package com.harvesthub.service;

import com.harvesthub.dto.request.TraceabilityEventRequest;
import com.harvesthub.dto.response.HarvestBatchDto;
import com.harvesthub.dto.response.TraceabilityEventDto;
import com.harvesthub.dto.response.TraceabilityPassportDto;
import com.harvesthub.entity.HarvestBatch;
import com.harvesthub.entity.TraceabilityEvent;
import com.harvesthub.entity.User;
import com.harvesthub.exception.ResourceNotFoundException;
import com.harvesthub.exception.UnauthorizedException;
import com.harvesthub.repository.HarvestBatchRepository;
import com.harvesthub.repository.TraceabilityEventRepository;
import com.harvesthub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TraceabilityService {

    private final HarvestBatchRepository harvestBatchRepository;
    private final TraceabilityEventRepository traceabilityEventRepository;
    private final UserRepository userRepository;
    private final ProduceService produceService;

    public TraceabilityService(HarvestBatchRepository harvestBatchRepository,
                               TraceabilityEventRepository traceabilityEventRepository,
                               UserRepository userRepository,
                               ProduceService produceService) {
        this.harvestBatchRepository = harvestBatchRepository;
        this.traceabilityEventRepository = traceabilityEventRepository;
        this.userRepository = userRepository;
        this.produceService = produceService;
    }

    @Transactional(readOnly = true)
    public TraceabilityPassportDto getPassport(String batchNumber) {
        HarvestBatch batch = harvestBatchRepository.findByBatchNumber(batchNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found for traceability passport: " + batchNumber));

        HarvestBatchDto batchDto = produceService.mapBatchToDto(batch);
        List<TraceabilityEventDto> eventDtos = traceabilityEventRepository
                .findByHarvestBatchBatchNumberOrderByEventTimestampAsc(batchNumber)
                .stream()
                .map(this::mapEventToDto)
                .collect(Collectors.toList());

        TraceabilityPassportDto passport = new TraceabilityPassportDto();
        passport.setBatchNumber(batch.getBatchNumber());
        passport.setCropVariety(batch.getProduceListing().getCropVariety());
        passport.setProduceTitle(batch.getProduceListing().getTitle());
        passport.setProduceImageUrl(batch.getProduceListing().getImageUrl());
        passport.setFarmId(batch.getProduceListing().getFarm().getId());
        passport.setFarmName(batch.getProduceListing().getFarm().getFarmName());
        passport.setFarmLocation(batch.getProduceListing().getFarm().getAddress());
        passport.setFarmCity(batch.getProduceListing().getFarm().getCity());
        passport.setFarmingMethod(batch.getProduceListing().getFarm().getFarmingMethod());
        passport.setFarmVerificationStatus(batch.getProduceListing().getFarm().getVerificationStatus());
        passport.setHarvestDate(batch.getHarvestDate());
        passport.setStorageCondition(batch.getStorageCondition());

        passport.setFreshnessPercentage(batchDto.getFreshnessPercentage());
        passport.setFreshnessLabel(batchDto.getFreshnessLabel());
        passport.setFreshnessExplanation(batchDto.getFreshnessExplanation());

        passport.setEvents(eventDtos);
        passport.setAdminVerifiedStepsCount((int) eventDtos.stream().filter(TraceabilityEventDto::getVerifiedByAdmin).count());
        passport.setFarmerLoggedStepsCount((int) eventDtos.stream().filter(e -> !e.getVerifiedByAdmin()).count());

        // QR Code destination URL
        passport.setQrCodeContent("http://localhost:5173/traceability/" + batch.getBatchNumber());

        return passport;
    }

    @Transactional
    public TraceabilityEventDto addEventToBatch(String farmerEmail, Long batchId, TraceabilityEventRequest request) {
        User user = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + farmerEmail));

        HarvestBatch batch = harvestBatchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found: " + batchId));

        if (!batch.getProduceListing().getFarm().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to add traceability events to this batch");
        }

        TraceabilityEvent event = new TraceabilityEvent(
                batch,
                request.getStage(),
                request.getEventTimestamp(),
                request.getLocation(),
                request.getDescription(),
                request.getOperatorName() != null ? request.getOperatorName() : user.getFullName(),
                false // Admin verification required
        );
        event.setProofDocumentUrl(request.getProofDocumentUrl());

        TraceabilityEvent saved = traceabilityEventRepository.save(event);
        return mapEventToDto(saved);
    }

    @Transactional
    public TraceabilityEventDto verifyEvent(Long eventId) {
        TraceabilityEvent event = traceabilityEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Traceability event not found: " + eventId));
        event.setVerifiedByAdmin(true);
        TraceabilityEvent updated = traceabilityEventRepository.save(event);
        return mapEventToDto(updated);
    }

    public TraceabilityEventDto mapEventToDto(TraceabilityEvent event) {
        TraceabilityEventDto dto = new TraceabilityEventDto();
        dto.setId(event.getId());
        dto.setStage(event.getStage());
        dto.setEventTimestamp(event.getEventTimestamp());
        dto.setLocation(event.getLocation());
        dto.setDescription(event.getDescription());
        dto.setOperatorName(event.getOperatorName());
        dto.setVerifiedByAdmin(event.getVerifiedByAdmin());
        dto.setProofDocumentUrl(event.getProofDocumentUrl());
        return dto;
    }
}
