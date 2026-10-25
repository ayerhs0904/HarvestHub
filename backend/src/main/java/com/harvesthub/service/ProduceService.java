package com.harvesthub.service;

import com.harvesthub.dto.request.HarvestBatchRequest;
import com.harvesthub.dto.request.ProduceListingRequest;
import com.harvesthub.dto.response.HarvestBatchDto;
import com.harvesthub.dto.response.ProduceDto;
import com.harvesthub.entity.*;
import com.harvesthub.exception.BadRequestException;
import com.harvesthub.exception.ResourceNotFoundException;
import com.harvesthub.exception.UnauthorizedException;
import com.harvesthub.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProduceService {

    private final ProduceListingRepository produceListingRepository;
    private final HarvestBatchRepository harvestBatchRepository;
    private final CategoryRepository categoryRepository;
    private final FarmRepository farmRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public ProduceService(ProduceListingRepository produceListingRepository,
                          HarvestBatchRepository harvestBatchRepository,
                          CategoryRepository categoryRepository,
                          FarmRepository farmRepository,
                          UserRepository userRepository,
                          ReviewRepository reviewRepository) {
        this.produceListingRepository = produceListingRepository;
        this.harvestBatchRepository = harvestBatchRepository;
        this.categoryRepository = categoryRepository;
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional(readOnly = true)
    public Page<ProduceDto> searchProduce(Long categoryId, FarmingMethod farmingMethod,
                                          BigDecimal minPrice, BigDecimal maxPrice,
                                          String search, Pageable pageable) {
        return produceListingRepository.searchProduce(categoryId, farmingMethod, minPrice, maxPrice, search, pageable)
                .map(this::mapListingToDto);
    }

    @Transactional(readOnly = true)
    public ProduceDto getProduceById(Long id) {
        ProduceListing listing = produceListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produce listing not found with id: " + id));
        return mapListingToDto(listing);
    }

    @Transactional
    public ProduceDto createProduce(String farmerEmail, ProduceListingRequest request) {
        Farm farm = getFarmerFarm(farmerEmail);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryId()));

        ProduceListing listing = new ProduceListing(
                farm,
                category,
                request.getTitle(),
                request.getDescription(),
                request.getCropVariety(),
                request.getUnit(),
                request.getBasePricePerUnit(),
                request.getImageUrl(),
                request.getShelfLifeDays()
        );

        ProduceListing saved = produceListingRepository.save(listing);
        return mapListingToDto(saved);
    }

    @Transactional
    public ProduceDto updateProduce(String farmerEmail, Long listingId, ProduceListingRequest request) {
        Farm farm = getFarmerFarm(farmerEmail);
        ProduceListing listing = produceListingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Produce listing not found: " + listingId));

        if (!listing.getFarm().getId().equals(farm.getId())) {
            throw new UnauthorizedException("You do not own this produce listing");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryId()));

        listing.setCategory(category);
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setCropVariety(request.getCropVariety());
        listing.setUnit(request.getUnit());
        listing.setBasePricePerUnit(request.getBasePricePerUnit());
        listing.setImageUrl(request.getImageUrl());
        listing.setShelfLifeDays(request.getShelfLifeDays());

        ProduceListing updated = produceListingRepository.save(listing);
        return mapListingToDto(updated);
    }

    @Transactional
    public HarvestBatchDto addBatchToListing(String farmerEmail, Long listingId, HarvestBatchRequest request) {
        Farm farm = getFarmerFarm(farmerEmail);
        ProduceListing listing = produceListingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Produce listing not found: " + listingId));

        if (!listing.getFarm().getId().equals(farm.getId())) {
            throw new UnauthorizedException("You do not own this produce listing");
        }

        if (harvestBatchRepository.findByBatchNumber(request.getBatchNumber()).isPresent()) {
            throw new BadRequestException("Batch number already exists: " + request.getBatchNumber());
        }

        HarvestBatch batch = new HarvestBatch(
                listing,
                request.getBatchNumber(),
                request.getHarvestDate(),
                request.getInitialQuantity(),
                request.getFreshnessWindowDays(),
                request.getStatus()
        );
        if (request.getStorageCondition() != null) {
            batch.setStorageCondition(request.getStorageCondition());
        }

        HarvestBatch saved = harvestBatchRepository.save(batch);
        return mapBatchToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ProduceDto> getFarmerInventory(String farmerEmail) {
        Farm farm = getFarmerFarm(farmerEmail);
        return produceListingRepository.findByFarmId(farm.getId())
                .stream()
                .map(this::mapListingToDto)
                .collect(Collectors.toList());
    }

    private Farm getFarmerFarm(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return farmRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Farmer profile does not exist for user: " + email));
    }

    public ProduceDto mapListingToDto(ProduceListing listing) {
        ProduceDto dto = new ProduceDto();
        dto.setId(listing.getId());
        dto.setFarmId(listing.getFarm().getId());
        dto.setFarmName(listing.getFarm().getFarmName());
        dto.setFarmCity(listing.getFarm().getCity());
        dto.setFarmingMethod(listing.getFarm().getFarmingMethod());
        dto.setCategoryId(listing.getCategory().getId());
        dto.setCategoryName(listing.getCategory().getName());
        dto.setTitle(listing.getTitle());
        dto.setDescription(listing.getDescription());
        dto.setCropVariety(listing.getCropVariety());
        dto.setUnit(listing.getUnit());
        dto.setBasePricePerUnit(listing.getBasePricePerUnit());
        dto.setImageUrl(listing.getImageUrl());
        dto.setShelfLifeDays(listing.getShelfLifeDays());
        dto.setIsActive(listing.getIsActive());
        dto.setCreatedAt(listing.getCreatedAt());

        Double avgRating = reviewRepository.getAverageRatingForListing(listing.getId());
        dto.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 5.0);
        dto.setReviewCount(reviewRepository.findByProduceListingIdOrderByCreatedAtDesc(listing.getId()).size());

        List<HarvestBatchDto> batches = harvestBatchRepository.findByProduceListingId(listing.getId())
                .stream()
                .map(this::mapBatchToDto)
                .collect(Collectors.toList());
        dto.setBatches(batches);

        return dto;
    }

    public HarvestBatchDto mapBatchToDto(HarvestBatch batch) {
        HarvestBatchDto dto = new HarvestBatchDto();
        dto.setId(batch.getId());
        dto.setProduceListingId(batch.getProduceListing().getId());
        dto.setListingTitle(batch.getProduceListing().getTitle());
        dto.setBatchNumber(batch.getBatchNumber());
        dto.setHarvestDate(batch.getHarvestDate());
        dto.setInitialQuantity(batch.getInitialQuantity());
        dto.setAvailableQuantity(batch.getAvailableQuantity());
        dto.setReservedQuantity(batch.getReservedQuantity());
        dto.setStatus(batch.getStatus());
        dto.setStorageCondition(batch.getStorageCondition());
        dto.setFreshnessWindowDays(batch.getFreshnessWindowDays());
        dto.setCreatedAt(batch.getCreatedAt());

        // Explainable Freshness calculation
        LocalDate today = LocalDate.now();
        long daysSinceHarvest = ChronoUnit.DAYS.between(batch.getHarvestDate(), today);
        dto.setDaysSinceHarvest(daysSinceHarvest);

        int window = batch.getFreshnessWindowDays() != null && batch.getFreshnessWindowDays() > 0 ? batch.getFreshnessWindowDays() : 7;
        long daysRemaining = window - daysSinceHarvest;
        dto.setDaysRemainingFresh(Math.max(0, daysRemaining));

        int freshnessPercentage;
        String label;
        if (daysSinceHarvest < 0) {
            freshnessPercentage = 100;
            label = "Upcoming Harvest (Pre-harvest reservation stage)";
        } else if (daysSinceHarvest == 0) {
            freshnessPercentage = 100;
            label = "Peak Freshness (Harvested today)";
        } else if (daysSinceHarvest >= window) {
            freshnessPercentage = 10;
            label = "Rescue Window (Discounted surplus recommended)";
        } else {
            freshnessPercentage = (int) Math.max(15, 100 - (daysSinceHarvest * 100L / window));
            if (freshnessPercentage >= 80) {
                label = "Peak Freshness (Harvested recently)";
            } else if (freshnessPercentage >= 50) {
                label = "High Freshness (Crisp & Optimal)";
            } else {
                label = "Good Freshness (Ready to consume)";
            }
        }

        dto.setFreshnessPercentage(freshnessPercentage);
        dto.setFreshnessLabel(label);
        dto.setFreshnessExplanation(String.format(
                "Batch %s was harvested on %s (%d days ago). The agronomic freshness window for this %s variety is %d days. Freshness score: %d%% (%s). Note: This is an agricultural quality estimate based on harvest timing and storage temperature, not a food-safety certificate.",
                batch.getBatchNumber(),
                batch.getHarvestDate(),
                Math.max(0, daysSinceHarvest),
                batch.getProduceListing().getCropVariety(),
                window,
                freshnessPercentage,
                label
        ));

        return dto;
    }
}
