package com.harvesthub.dto.request;

import com.harvesthub.entity.ListingUnit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CropDemandRequestCreate {
    @NotBlank
    private String cropName;

    private Long categoryId;

    @NotNull
    private BigDecimal requestedQuantity;

    private ListingUnit unit = ListingUnit.KG;

    @NotNull
    private LocalDate neededByDate;

    private BigDecimal maxBudgetPerUnit;

    private String deliveryLocation;

    private String notes;

    public CropDemandRequestCreate() {}

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

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
}
