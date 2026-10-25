package com.harvesthub.dto.response;

import com.harvesthub.entity.DemandStatus;
import com.harvesthub.entity.ListingUnit;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CropDemandRequestDto {
    private Long id;
    private Long buyerId;
    private String buyerName;
    private String cropName;
    private Long categoryId;
    private String categoryName;
    private BigDecimal requestedQuantity;
    private ListingUnit unit;
    private LocalDate neededByDate;
    private BigDecimal maxBudgetPerUnit;
    private String deliveryLocation;
    private String notes;
    private DemandStatus status;
    private LocalDateTime createdAt;
    private List<CropDemandOfferDto> offers = new ArrayList<>();

    public CropDemandRequestDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public BigDecimal getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(BigDecimal requestedQuantity) { this.requestedQuantity = requestedQuantity; }

    public ListingUnit getUnit() { return unit; }
    public void setUnit(ListingUnit unit) { this.unit = unit; }

    public LocalDate getNeededByDate() { return neededByDate; }
    public void setNeededByDate(LocalDate neededByDate) { this.neededByDate = neededByDate; }

    public BigDecimal getMaxBudgetPerUnit() { return maxBudgetPerUnit; }
    public void setMaxBudgetPerUnit(BigDecimal maxBudgetPerUnit) { this.maxBudgetPerUnit = maxBudgetPerUnit; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public DemandStatus getStatus() { return status; }
    public void setStatus(DemandStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<CropDemandOfferDto> getOffers() { return offers; }
    public void setOffers(List<CropDemandOfferDto> offers) { this.offers = offers; }
}
