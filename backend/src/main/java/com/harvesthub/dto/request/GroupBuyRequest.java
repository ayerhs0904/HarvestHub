package com.harvesthub.dto.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class GroupBuyRequest {
    @NotNull
    private Long produceListingId;

    @NotNull
    private BigDecimal targetQuantity;

    private BigDecimal minPledgePerBuyer = BigDecimal.ONE;

    @NotNull
    private BigDecimal regularPrice;

    @NotNull
    private BigDecimal discountedPrice;

    @NotNull
    private LocalDateTime deadline;

    private String pickupLocation;

    public GroupBuyRequest() {}

    public Long getProduceListingId() { return produceListingId; }
    public void setProduceListingId(Long produceListingId) { this.produceListingId = produceListingId; }

    public BigDecimal getTargetQuantity() { return targetQuantity; }
    public void setTargetQuantity(BigDecimal targetQuantity) { this.targetQuantity = targetQuantity; }

    public BigDecimal getMinPledgePerBuyer() { return minPledgePerBuyer; }
    public void setMinPledgePerBuyer(BigDecimal minPledgePerBuyer) { this.minPledgePerBuyer = minPledgePerBuyer; }

    public BigDecimal getRegularPrice() { return regularPrice; }
    public void setRegularPrice(BigDecimal regularPrice) { this.regularPrice = regularPrice; }

    public BigDecimal getDiscountedPrice() { return discountedPrice; }
    public void setDiscountedPrice(BigDecimal discountedPrice) { this.discountedPrice = discountedPrice; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }
}
