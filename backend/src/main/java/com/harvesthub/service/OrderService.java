package com.harvesthub.service;

import com.harvesthub.dto.request.CartItemRequest;
import com.harvesthub.dto.request.CheckoutRequest;
import com.harvesthub.dto.request.OrderStatusUpdateRequest;
import com.harvesthub.dto.response.DeliverySlotDto;
import com.harvesthub.dto.response.OrderDto;
import com.harvesthub.dto.response.OrderItemDto;
import com.harvesthub.entity.*;
import com.harvesthub.exception.BadRequestException;
import com.harvesthub.exception.ResourceNotFoundException;
import com.harvesthub.exception.UnauthorizedException;
import com.harvesthub.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final HarvestBatchRepository harvestBatchRepository;
    private final FarmRepository farmRepository;
    private final UserRepository userRepository;
    private final DeliverySlotRepository deliverySlotRepository;
    private final SurplusDealRepository surplusDealRepository;
    private final NotificationRepository notificationRepository;
    private final SlotService slotService;

    private static final SecureRandom RANDOM = new SecureRandom();

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        HarvestBatchRepository harvestBatchRepository,
                        FarmRepository farmRepository,
                        UserRepository userRepository,
                        DeliverySlotRepository deliverySlotRepository,
                        SurplusDealRepository surplusDealRepository,
                        NotificationRepository notificationRepository,
                        SlotService slotService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.harvestBatchRepository = harvestBatchRepository;
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
        this.deliverySlotRepository = deliverySlotRepository;
        this.surplusDealRepository = surplusDealRepository;
        this.notificationRepository = notificationRepository;
        this.slotService = slotService;
    }

    /**
     * Atomic checkout with Pessimistic Write Lock on HarvestBatches.
     * Prevents concurrent overselling under high loads.
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public OrderDto checkout(String buyerEmail, CheckoutRequest request) {
        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found: " + buyerEmail));

        Farm farm = farmRepository.findById(request.getFarmId())
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found: " + request.getFarmId()));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one item");
        }

        DeliverySlot deliverySlot = null;
        BigDecimal deliveryFee = BigDecimal.ZERO;
        if (request.getDeliverySlotId() != null) {
            deliverySlot = deliverySlotRepository.findById(request.getDeliverySlotId())
                    .orElseThrow(() -> new ResourceNotFoundException("Delivery slot not found: " + request.getDeliverySlotId()));

            if (!deliverySlot.getFarm().getId().equals(farm.getId())) {
                throw new BadRequestException("Delivery slot does not belong to the selected farm");
            }
            if (!deliverySlot.hasAvailableCapacity()) {
                throw new BadRequestException("Selected time slot has reached maximum booking capacity");
            }
            deliverySlot.incrementBookedCapacity();
            deliverySlotRepository.save(deliverySlot);

            if (deliverySlot.getDeliveryFee() != null) {
                deliveryFee = deliverySlot.getDeliveryFee();
            }
        }

        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + (1000 + RANDOM.nextInt(9000));
        PaymentStatus paymentStatus = request.getPaymentMethod() == PaymentMethod.SIMULATED_ONLINE ?
                PaymentStatus.PAID : PaymentStatus.PENDING;

        Order order = new Order(
                orderNumber,
                buyer,
                farm,
                BigDecimal.ZERO, // will sum below
                request.getFulfillmentType(),
                deliverySlot,
                request.getDeliveryAddress(),
                request.getPaymentMethod(),
                paymentStatus,
                request.getIsSurplusRescue(),
                BigDecimal.ZERO
        );

        BigDecimal calculatedTotal = BigDecimal.ZERO;
        BigDecimal calculatedRescuedKg = BigDecimal.ZERO;

        for (CartItemRequest itemReq : request.getItems()) {
            if (itemReq.getQuantity() == null || itemReq.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Item quantity must be strictly greater than zero");
            }

            // CRITICAL: Acquire pessimistic lock on batch row
            HarvestBatch batch = harvestBatchRepository.findByIdWithLock(itemReq.getHarvestBatchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Harvest batch not found: " + itemReq.getHarvestBatchId()));

            if (!batch.getProduceListing().getFarm().getId().equals(farm.getId())) {
                throw new BadRequestException("Batch " + batch.getBatchNumber() + " does not belong to farm: " + farm.getFarmName());
            }

            // Strict inventory check to prevent overselling
            if (batch.getAvailableQuantity().compareTo(itemReq.getQuantity()) < 0) {
                throw new BadRequestException(String.format(
                        "Insufficient inventory for '%s' (Batch: %s). Requested: %.2f %s, Available: %.2f %s",
                        batch.getProduceListing().getTitle(),
                        batch.getBatchNumber(),
                        itemReq.getQuantity(),
                        batch.getProduceListing().getUnit(),
                        batch.getAvailableQuantity(),
                        batch.getProduceListing().getUnit()
                ));
            }

            // Deduct available stock
            batch.setAvailableQuantity(batch.getAvailableQuantity().subtract(itemReq.getQuantity()));
            if (batch.getAvailableQuantity().compareTo(BigDecimal.ZERO) == 0) {
                batch.setStatus(BatchStatus.DEPLETED);
            }
            harvestBatchRepository.save(batch);

            // Determine unit price (check for active surplus deal discount if applicable)
            BigDecimal unitPrice = batch.getProduceListing().getBasePricePerUnit();
            if (Boolean.TRUE.equals(request.getIsSurplusRescue()) && batch.getSurplusDeal() != null && batch.getSurplusDeal().getIsActive()) {
                SurplusDeal deal = batch.getSurplusDeal();
                unitPrice = deal.getDiscountedPrice();
                deal.setRemainingQuantity(deal.getRemainingQuantity().subtract(itemReq.getQuantity()).max(BigDecimal.ZERO));
                surplusDealRepository.save(deal);
                calculatedRescuedKg = calculatedRescuedKg.add(itemReq.getQuantity());
            }

            OrderItem orderItem = new OrderItem(batch, itemReq.getQuantity(), unitPrice);
            order.addItem(orderItem);
            calculatedTotal = calculatedTotal.add(orderItem.getSubtotal());
        }

        // Add delivery fee
        calculatedTotal = calculatedTotal.add(deliveryFee);
        order.setTotalAmount(calculatedTotal);
        order.setRescuedKg(calculatedRescuedKg);

        Order savedOrder = orderRepository.save(order);

        // Notify farmer
        User farmerUser = farm.getUser();
        notificationRepository.save(new Notification(
                farmerUser,
                "New Order Received: " + savedOrder.getOrderNumber(),
                String.format("Buyer %s placed order %s for total $%.2f. Please review and prepare.",
                        buyer.getFullName(), savedOrder.getOrderNumber(), savedOrder.getTotalAmount()),
                "ORDER_STATUS",
                "/farmer/dashboard"
        ));

        // Notify buyer
        notificationRepository.save(new Notification(
                buyer,
                "Order Placed Successfully",
                String.format("Your order %s with %s has been placed. Status: %s.",
                        savedOrder.getOrderNumber(), farm.getFarmName(), savedOrder.getStatus()),
                "ORDER_STATUS",
                "/buyer/orders"
        ));

        return mapToDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getMyOrders(String buyerEmail) {
        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found: " + buyerEmail));
        return orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyer.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getFarmerOrders(String farmerEmail) {
        User user = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found: " + farmerEmail));
        Farm farm = farmRepository.findByUserId(user.getId())
                .orElseThrow(() -> new UnauthorizedException("User does not have an associated farm"));
        return orderRepository.findByFarmIdOrderByCreatedAtDesc(farm.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(String userEmail, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        boolean isBuyer = order.getBuyer().getId().equals(user.getId());
        boolean isFarmer = order.getFarm().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        if (!isBuyer && !isFarmer && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to view this order");
        }

        return mapToDto(order);
    }

    @Transactional
    public OrderDto updateOrderStatus(String farmerEmail, Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        User user = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + farmerEmail));

        boolean isFarmer = order.getFarm().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        if (!isFarmer && !isAdmin) {
            throw new UnauthorizedException("You do not have permission to update status for this order");
        }

        OrderStatus oldStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();

        // If order is being cancelled, return deducted inventory back to batches
        if (newStatus == OrderStatus.CANCELLED && oldStatus != OrderStatus.CANCELLED && oldStatus != OrderStatus.DELIVERED) {
            for (OrderItem item : order.getItems()) {
                HarvestBatch batch = harvestBatchRepository.findByIdWithLock(item.getHarvestBatch().getId())
                        .orElse(null);
                if (batch != null) {
                    batch.setAvailableQuantity(batch.getAvailableQuantity().add(item.getQuantity()));
                    if (batch.getStatus() == BatchStatus.DEPLETED) {
                        batch.setStatus(BatchStatus.ACTIVE);
                    }
                    harvestBatchRepository.save(batch);
                }
            }
        }

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);

        // Notify buyer of status progression
        notificationRepository.save(new Notification(
                order.getBuyer(),
                "Order Status Update: " + updated.getOrderNumber(),
                String.format("Your order from %s has changed status to: %s.",
                        order.getFarm().getFarmName(), newStatus),
                "ORDER_STATUS",
                "/buyer/orders"
        ));

        return mapToDto(updated);
    }

    public OrderDto mapToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setBuyerId(order.getBuyer().getId());
        dto.setBuyerName(order.getBuyer().getFullName());
        dto.setBuyerEmail(order.getBuyer().getEmail());
        dto.setFarmId(order.getFarm().getId());
        dto.setFarmName(order.getFarm().getFarmName());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setFulfillmentType(order.getFulfillmentType());
        if (order.getDeliverySlot() != null) {
            dto.setDeliverySlot(slotService.mapToDto(order.getDeliverySlot()));
        }
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setIsSurplusRescue(order.getIsSurplusRescue());
        dto.setRescuedKg(order.getRescuedKg());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        List<OrderItemDto> itemDtos = order.getItems().stream().map(item -> {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setId(item.getId());
            itemDto.setHarvestBatchId(item.getHarvestBatch().getId());
            itemDto.setBatchNumber(item.getHarvestBatch().getBatchNumber());
            itemDto.setProduceListingId(item.getHarvestBatch().getProduceListing().getId());
            itemDto.setProduceTitle(item.getHarvestBatch().getProduceListing().getTitle());
            itemDto.setCropVariety(item.getHarvestBatch().getProduceListing().getCropVariety());
            itemDto.setUnit(item.getHarvestBatch().getProduceListing().getUnit());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setUnitPrice(item.getUnitPrice());
            itemDto.setSubtotal(item.getSubtotal());
            return itemDto;
        }).collect(Collectors.toList());

        dto.setItems(itemDtos);
        return dto;
    }
}
