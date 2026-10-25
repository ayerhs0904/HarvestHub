package com.harvesthub.service;

import com.harvesthub.dto.request.HarvestReservationRequest;
import com.harvesthub.dto.response.HarvestBatchDto;
import com.harvesthub.dto.response.HarvestReservationDto;
import com.harvesthub.entity.*;
import com.harvesthub.exception.BadRequestException;
import com.harvesthub.exception.ResourceNotFoundException;
import com.harvesthub.exception.UnauthorizedException;
import com.harvesthub.repository.HarvestBatchRepository;
import com.harvesthub.repository.HarvestReservationRepository;
import com.harvesthub.repository.NotificationRepository;
import com.harvesthub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final HarvestReservationRepository harvestReservationRepository;
    private final HarvestBatchRepository harvestBatchRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final ProduceService produceService;

    public ReservationService(HarvestReservationRepository harvestReservationRepository,
                              HarvestBatchRepository harvestBatchRepository,
                              UserRepository userRepository,
                              NotificationRepository notificationRepository,
                              ProduceService produceService) {
        this.harvestReservationRepository = harvestReservationRepository;
        this.harvestBatchRepository = harvestBatchRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.produceService = produceService;
    }

    @Transactional(readOnly = true)
    public List<HarvestBatchDto> getUpcomingHarvests() {
        return harvestBatchRepository.findByStatus(BatchStatus.UPCOMING)
                .stream()
                .map(produceService::mapBatchToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public HarvestReservationDto reserveHarvest(String buyerEmail, HarvestReservationRequest request) {
        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found: " + buyerEmail));

        // Lock batch to safely check remaining available upcoming capacity
        HarvestBatch batch = harvestBatchRepository.findByIdWithLock(request.getHarvestBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Harvest batch not found: " + request.getHarvestBatchId()));

        if (batch.getAvailableQuantity().compareTo(request.getQuantity()) < 0) {
            throw new BadRequestException("Requested quantity exceeds available upcoming harvest capacity (" + batch.getAvailableQuantity() + ")");
        }

        // Deduct available upcoming quantity and mark reserved
        batch.setAvailableQuantity(batch.getAvailableQuantity().subtract(request.getQuantity()));
        batch.setReservedQuantity(batch.getReservedQuantity().add(request.getQuantity()));
        harvestBatchRepository.save(batch);

        BigDecimal unitPrice = batch.getProduceListing().getBasePricePerUnit();
        HarvestReservation reservation = new HarvestReservation(
                batch,
                buyer,
                request.getQuantity(),
                unitPrice,
                batch.getHarvestDate(),
                request.getNotes()
        );

        HarvestReservation saved = harvestReservationRepository.save(reservation);

        // Notify farmer
        User farmerUser = batch.getProduceListing().getFarm().getUser();
        notificationRepository.save(new Notification(
                farmerUser,
                "New Pre-Harvest Reservation",
                String.format("Buyer %s reserved %.1f %s of %s (Batch %s).",
                        buyer.getFullName(), request.getQuantity(), batch.getProduceListing().getUnit(),
                        batch.getProduceListing().getTitle(), batch.getBatchNumber()),
                "RESERVATION",
                "/farmer/dashboard"
        ));

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<HarvestReservationDto> getMyReservations(String buyerEmail) {
        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found: " + buyerEmail));
        return harvestReservationRepository.findByBuyerIdOrderByCreatedAtDesc(buyer.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HarvestReservationDto> getFarmerReservations(String farmerEmail) {
        User user = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found: " + farmerEmail));
        return harvestReservationRepository.findAll().stream()
                .filter(r -> r.getHarvestBatch().getProduceListing().getFarm().getUser().getId().equals(user.getId()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public HarvestReservationDto confirmReservation(String farmerEmail, Long reservationId) {
        HarvestReservation reservation = harvestReservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + reservationId));

        User user = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found: " + farmerEmail));

        if (!reservation.getHarvestBatch().getProduceListing().getFarm().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not own this harvest batch reservation");
        }

        reservation.setStatus(ReservationStatus.CONFIRMED);
        HarvestReservation updated = harvestReservationRepository.save(reservation);

        // Notify buyer
        notificationRepository.save(new Notification(
                reservation.getBuyer(),
                "Harvest Reservation Confirmed!",
                String.format("Your reservation for %s has been confirmed by %s! Produce is harvested and ready.",
                        reservation.getHarvestBatch().getProduceListing().getTitle(),
                        reservation.getHarvestBatch().getProduceListing().getFarm().getFarmName()),
                "RESERVATION",
                "/buyer/orders"
        ));

        return mapToDto(updated);
    }

    public HarvestReservationDto mapToDto(HarvestReservation reservation) {
        HarvestReservationDto dto = new HarvestReservationDto();
        dto.setId(reservation.getId());
        dto.setHarvestBatchId(reservation.getHarvestBatch().getId());
        dto.setBatchNumber(reservation.getHarvestBatch().getBatchNumber());
        dto.setProduceListingId(reservation.getHarvestBatch().getProduceListing().getId());
        dto.setProduceTitle(reservation.getHarvestBatch().getProduceListing().getTitle());
        dto.setCropVariety(reservation.getHarvestBatch().getProduceListing().getCropVariety());
        dto.setFarmName(reservation.getHarvestBatch().getProduceListing().getFarm().getFarmName());
        dto.setUnit(reservation.getHarvestBatch().getProduceListing().getUnit());
        dto.setQuantity(reservation.getQuantity());
        dto.setUnitPrice(reservation.getUnitPrice());
        dto.setTotalAmount(reservation.getTotalAmount());
        dto.setStatus(reservation.getStatus());
        dto.setEstimatedHarvestDate(reservation.getEstimatedHarvestDate());
        dto.setNotes(reservation.getNotes());
        dto.setCreatedAt(reservation.getCreatedAt());
        return dto;
    }
}
