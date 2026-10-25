package com.harvesthub.dto.response;

import com.harvesthub.entity.ListingUnit;
import com.harvesthub.entity.ReservationStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class HarvestReservationDto {
    private Long id;
    private Long harvestBatchId;
    private String batchNumber;
    private Long produceListingId;
    private String produceTitle;
    private String cropVariety;
    private String farmName;
    private ListingUnit unit;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    private ReservationStatus status;
    private LocalDate estimatedHarvestDate;
    private String notes;
    private LocalDateTime createdAt;

    public HarvestReservationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getHarvestBatchId() { return harvestBatchId; }
    public void setHarvestBatchId(Long harvestBatchId) { this.harvestBatchId = harvestBatchId; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public Long getProduceListingId() { return produceListingId; }
    public void setProduceListingId(Long produceListingId) { this.produceListingId = produceListingId; }

    public String getProduceTitle() { return produceTitle; }
    public void setProduceTitle(String produceTitle) { this.produceTitle = produceTitle; }

    public String getCropVariety() { return cropVariety; }
    public void setCropVariety(String cropVariety) { this.cropVariety = cropVariety; }

    public String getFarmName() { return farmName; }
    public void setFarmName(String farmName) { this.farmName = farmName; }

    public ListingUnit getUnit() { return unit; }
    public void setUnit(ListingUnit unit) { this.unit = unit; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }

    public LocalDate getEstimatedHarvestDate() { return estimatedHarvestDate; }
    public void setEstimatedHarvestDate(LocalDate estimatedHarvestDate) { this.estimatedHarvestDate = estimatedHarvestDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
