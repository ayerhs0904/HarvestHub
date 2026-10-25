package com.harvesthub.dto.response;

import com.harvesthub.entity.BatchStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class HarvestBatchDto {
    private Long id;
    private Long produceListingId;
    private String listingTitle;
    private String batchNumber;
    private LocalDate harvestDate;
    private BigDecimal initialQuantity;
    private BigDecimal availableQuantity;
    private BigDecimal reservedQuantity;
    private BatchStatus status;
    private String storageCondition;
    private Integer freshnessWindowDays;

    // Explainable Freshness calculation metrics
    private long daysSinceHarvest;
    private long daysRemainingFresh;
    private int freshnessPercentage;
    private String freshnessLabel;
    private String freshnessExplanation;

    private LocalDateTime createdAt;

    public HarvestBatchDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProduceListingId() { return produceListingId; }
    public void setProduceListingId(Long produceListingId) { this.produceListingId = produceListingId; }

    public String getListingTitle() { return listingTitle; }
    public void setListingTitle(String listingTitle) { this.listingTitle = listingTitle; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }

    public BigDecimal getInitialQuantity() { return initialQuantity; }
    public void setInitialQuantity(BigDecimal initialQuantity) { this.initialQuantity = initialQuantity; }

    public BigDecimal getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(BigDecimal availableQuantity) { this.availableQuantity = availableQuantity; }

    public BigDecimal getReservedQuantity() { return reservedQuantity; }
    public void setReservedQuantity(BigDecimal reservedQuantity) { this.reservedQuantity = reservedQuantity; }

    public BatchStatus getStatus() { return status; }
    public void setStatus(BatchStatus status) { this.status = status; }

    public String getStorageCondition() { return storageCondition; }
    public void setStorageCondition(String storageCondition) { this.storageCondition = storageCondition; }

    public Integer getFreshnessWindowDays() { return freshnessWindowDays; }
    public void setFreshnessWindowDays(Integer freshnessWindowDays) { this.freshnessWindowDays = freshnessWindowDays; }

    public long getDaysSinceHarvest() { return daysSinceHarvest; }
    public void setDaysSinceHarvest(long daysSinceHarvest) { this.daysSinceHarvest = daysSinceHarvest; }

    public long getDaysRemainingFresh() { return daysRemainingFresh; }
    public void setDaysRemainingFresh(long daysRemainingFresh) { this.daysRemainingFresh = daysRemainingFresh; }

    public int getFreshnessPercentage() { return freshnessPercentage; }
    public void setFreshnessPercentage(int freshnessPercentage) { this.freshnessPercentage = freshnessPercentage; }

    public String getFreshnessLabel() { return freshnessLabel; }
    public void setFreshnessLabel(String freshnessLabel) { this.freshnessLabel = freshnessLabel; }

    public String getFreshnessExplanation() { return freshnessExplanation; }
    public void setFreshnessExplanation(String freshnessExplanation) { this.freshnessExplanation = freshnessExplanation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
