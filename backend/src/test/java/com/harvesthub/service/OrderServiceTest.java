package com.harvesthub.service;

import com.harvesthub.dto.request.CartItemRequest;
import com.harvesthub.dto.request.CheckoutRequest;
import com.harvesthub.dto.response.OrderDto;
import com.harvesthub.entity.*;
import com.harvesthub.exception.BadRequestException;
import com.harvesthub.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderItemRepository orderItemRepository;
    @Mock
    private HarvestBatchRepository harvestBatchRepository;
    @Mock
    private FarmRepository farmRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private DeliverySlotRepository deliverySlotRepository;
    @Mock
    private SurplusDealRepository surplusDealRepository;
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private SlotService slotService;

    @InjectMocks
    private OrderService orderService;

    private User buyer;
    private User farmerUser;
    private Farm farm;
    private Category category;
    private ProduceListing listing;
    private HarvestBatch batch;

    @BeforeEach
    void setUp() {
        buyer = new User("buyer@harvesthub.farm", "pass", "Buyer Buyer", "+123456", Role.ROLE_BUYER);
        buyer.setId(10L);

        farmerUser = new User("farmer@harvesthub.farm", "pass", "Farmer Joe", "+123456", Role.ROLE_FARMER);
        farmerUser.setId(20L);

        farm = new Farm(farmerUser, "Green Pastures", "Bio", "Valley", "City", "State", FarmingMethod.ORGANIC);
        farm.setId(1L);

        category = new Category("Vegetables", "veg", "desc", "icon");
        category.setId(1L);

        listing = new ProduceListing(farm, category, "Organic Heirloom Tomato", "Fresh", "Heirloom",
                ListingUnit.KG, new BigDecimal("3.00"), "img.jpg", 7);
        listing.setId(100L);

        batch = new HarvestBatch(listing, "BATCH-001", LocalDate.now(), new BigDecimal("50.00"), 7, BatchStatus.ACTIVE);
        batch.setId(200L);
    }

    @Test
    @DisplayName("Should successfully checkout and deduct available quantity")
    void testSuccessfulCheckout() {
        CheckoutRequest req = new CheckoutRequest();
        req.setFarmId(1L);
        req.setItems(Collections.singletonList(new CartItemRequest(200L, new BigDecimal("10.00"))));
        req.setFulfillmentType(FulfillmentType.FARM_PICKUP);
        req.setPaymentMethod(PaymentMethod.SIMULATED_ONLINE);

        when(userRepository.findByEmail("buyer@harvesthub.farm")).thenReturn(Optional.of(buyer));
        when(farmRepository.findById(1L)).thenReturn(Optional.of(farm));
        when(harvestBatchRepository.findByIdWithLock(200L)).thenReturn(Optional.of(batch));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(999L);
            return o;
        });

        OrderDto result = orderService.checkout("buyer@harvesthub.farm", req);

        assertNotNull(result);
        assertEquals(0, result.getTotalAmount().compareTo(new BigDecimal("30.00"))); // 10 kg * $3.00
        assertEquals(0, batch.getAvailableQuantity().compareTo(new BigDecimal("40.00"))); // 50 - 10
        verify(harvestBatchRepository, times(1)).save(batch);
        verify(orderRepository, times(1)).save(any(Order.class));
        verify(notificationRepository, times(2)).save(any(Notification.class));
    }

    @Test
    @DisplayName("Overselling Prevention: Should throw BadRequestException when requested quantity exceeds available stock")
    void testOversellingPreventionThrowsBadRequest() {
        CheckoutRequest req = new CheckoutRequest();
        req.setFarmId(1L);
        // Request 60 kg when only 50 kg is available
        req.setItems(Collections.singletonList(new CartItemRequest(200L, new BigDecimal("60.00"))));
        req.setFulfillmentType(FulfillmentType.FARM_PICKUP);
        req.setPaymentMethod(PaymentMethod.SIMULATED_ONLINE);

        when(userRepository.findByEmail("buyer@harvesthub.farm")).thenReturn(Optional.of(buyer));
        when(farmRepository.findById(1L)).thenReturn(Optional.of(farm));
        when(harvestBatchRepository.findByIdWithLock(200L)).thenReturn(Optional.of(batch));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                orderService.checkout("buyer@harvesthub.farm", req)
        );

        assertTrue(ex.getMessage().contains("Insufficient inventory"));
        assertEquals(new BigDecimal("50.00"), batch.getAvailableQuantity()); // stock remains intact!
        verify(orderRepository, never()).save(any(Order.class));
    }
}
