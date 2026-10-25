package com.harvesthub.dto.response;

import com.harvesthub.entity.OfferStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CropDemandOfferDto {
    private Long id;
    private Long demandRequestId;
    private Long farmId;
    private String farmName;
    private BigDecimal offeredPricePerUnit;
    private LocalDate availableDate;
    private String notes;
    private OfferStatus status;
    private LocalDateTime createdAt;

    public CropDemandOfferDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDemandRequestId() { return demandRequestId; }
    public void setDemandRequestId(Long demandRequestId) { this.demandRequestId = demandRequestId; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public String getFarmName() { return farmName; }
    public void setFarmName(String farmName) { this.farmName = farmName; }

    public BigDecimal getOfferedPricePerUnit() { return offeredPricePerUnit; }
    public void setOfferedPricePerUnit(BigDecimal offeredPricePerUnit) { this.offeredPricePerUnit = offeredPricePerUnit; }

    public LocalDate getAvailableDate() { return availableDate; }
    public void setAvailableDate(LocalDate availableDate) { this.availableDate = availableDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public OfferStatus getStatus() { return status; }
    public void setStatus(OfferStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
