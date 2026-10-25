package com.harvesthub.dto.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SurplusDealRequest {
    @NotNull
    private Long harvestBatchId;

    @NotNull
    private BigDecimal discountPercentage;

    @NotNull
    private BigDecimal surplusQuantity;

    @NotNull
    private LocalDateTime dealDeadline;

    @NotNull
    private String pickupWindow;

    public SurplusDealRequest() {}

    public Long getHarvestBatchId() { return harvestBatchId; }
    public void setHarvestBatchId(Long harvestBatchId) { this.harvestBatchId = harvestBatchId; }

    public BigDecimal getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(BigDecimal discountPercentage) { this.discountPercentage = discountPercentage; }

    public BigDecimal getSurplusQuantity() { return surplusQuantity; }
    public void setSurplusQuantity(BigDecimal surplusQuantity) { this.surplusQuantity = surplusQuantity; }

    public LocalDateTime getDealDeadline() { return dealDeadline; }
    public void setDealDeadline(LocalDateTime dealDeadline) { this.dealDeadline = dealDeadline; }

    public String getPickupWindow() { return pickupWindow; }
    public void setPickupWindow(String pickupWindow) { this.pickupWindow = pickupWindow; }
}
