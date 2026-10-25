package com.harvesthub.service;

import com.harvesthub.dto.request.SurplusDealRequest;
import com.harvesthub.dto.response.SurplusDealDto;
import com.harvesthub.entity.HarvestBatch;
import com.harvesthub.entity.SurplusDeal;
import com.harvesthub.entity.User;
import com.harvesthub.exception.BadRequestException;
import com.harvesthub.exception.ResourceNotFoundException;
import com.harvesthub.exception.UnauthorizedException;
import com.harvesthub.repository.HarvestBatchRepository;
import com.harvesthub.repository.SurplusDealRepository;
import com.harvesthub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SurplusService {

    private final SurplusDealRepository surplusDealRepository;
    private final HarvestBatchRepository harvestBatchRepository;
    private final UserRepository userRepository;

    public SurplusService(SurplusDealRepository surplusDealRepository,
                          HarvestBatchRepository harvestBatchRepository,
                          UserRepository userRepository) {
        this.surplusDealRepository = surplusDealRepository;
        this.harvestBatchRepository = harvestBatchRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<SurplusDealDto> getActiveDeals() {
        return surplusDealRepository.findByIsActiveTrueAndDealDeadlineAfter(LocalDateTime.now())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SurplusDealDto createSurplusDeal(String farmerEmail, SurplusDealRequest request) {
        User user = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + farmerEmail));

        HarvestBatch batch = harvestBatchRepository.findById(request.getHarvestBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Harvest batch not found: " + request.getHarvestBatchId()));

        if (!batch.getProduceListing().getFarm().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not own this harvest batch");
        }

        if (batch.getAvailableQuantity().compareTo(request.getSurplusQuantity()) < 0) {
            throw new BadRequestException("Surplus quantity cannot exceed available batch quantity (" + batch.getAvailableQuantity() + ")");
        }

        BigDecimal regularPrice = batch.getProduceListing().getBasePricePerUnit();
        BigDecimal discountFactor = BigDecimal.ONE.subtract(request.getDiscountPercentage().divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
        BigDecimal discountedPrice = regularPrice.multiply(discountFactor).setScale(2, RoundingMode.HALF_UP);

        SurplusDeal deal = surplusDealRepository.findByHarvestBatchId(batch.getId())
                .orElse(new SurplusDeal());

        deal.setHarvestBatch(batch);
        deal.setDiscountPercentage(request.getDiscountPercentage());
        deal.setDiscountedPrice(discountedPrice);
        deal.setSurplusQuantity(request.getSurplusQuantity());
        deal.setRemainingQuantity(request.getSurplusQuantity());
        deal.setDealDeadline(request.getDealDeadline());
        deal.setPickupWindow(request.getPickupWindow());
        deal.setIsActive(true);

        SurplusDeal saved = surplusDealRepository.save(deal);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateRescuedKg() {
        return surplusDealRepository.calculateRescuedProduceKg();
    }

    public SurplusDealDto mapToDto(SurplusDeal deal) {
        SurplusDealDto dto = new SurplusDealDto();
        dto.setId(deal.getId());
        dto.setHarvestBatchId(deal.getHarvestBatch().getId());
        dto.setBatchNumber(deal.getHarvestBatch().getBatchNumber());
        dto.setProduceListingId(deal.getHarvestBatch().getProduceListing().getId());
        dto.setListingTitle(deal.getHarvestBatch().getProduceListing().getTitle());
        dto.setCropVariety(deal.getHarvestBatch().getProduceListing().getCropVariety());
        dto.setImageUrl(deal.getHarvestBatch().getProduceListing().getImageUrl());
        dto.setFarmName(deal.getHarvestBatch().getProduceListing().getFarm().getFarmName());
        dto.setUnit(deal.getHarvestBatch().getProduceListing().getUnit());
        dto.setRegularPrice(deal.getHarvestBatch().getProduceListing().getBasePricePerUnit());
        dto.setDiscountPercentage(deal.getDiscountPercentage());
        dto.setDiscountedPrice(deal.getDiscountedPrice());
        dto.setSurplusQuantity(deal.getSurplusQuantity());
        dto.setRemainingQuantity(deal.getRemainingQuantity());
        dto.setDealDeadline(deal.getDealDeadline());
        dto.setPickupWindow(deal.getPickupWindow());
        dto.setIsActive(deal.getIsActive());
        return dto;
    }
}
