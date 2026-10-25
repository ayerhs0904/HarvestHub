package com.harvesthub.dto.response;

import com.harvesthub.entity.GroupBuyStatus;
import com.harvesthub.entity.ListingUnit;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CommunityGroupBuyDto {
    private Long id;
    private Long produceListingId;
    private String produceTitle;
    private String cropVariety;
    private String imageUrl;
    private ListingUnit unit;
    private String organizerName;
    private BigDecimal targetQuantity;
    private BigDecimal currentQuantity;
    private int progressPercentage;
    private BigDecimal minPledgePerBuyer;
    private BigDecimal regularPrice;
    private BigDecimal discountedPrice;
    private LocalDateTime deadline;
    private GroupBuyStatus status;
    private String pickupLocation;
    private int participantCount;

    public CommunityGroupBuyDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProduceListingId() { return produceListingId; }
    public void setProduceListingId(Long produceListingId) { this.produceListingId = produceListingId; }

    public String getProduceTitle() { return produceTitle; }
    public void setProduceTitle(String produceTitle) { this.produceTitle = produceTitle; }

    public String getCropVariety() { return cropVariety; }
    public void setCropVariety(String cropVariety) { this.cropVariety = cropVariety; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public ListingUnit getUnit() { return unit; }
    public void setUnit(ListingUnit unit) { this.unit = unit; }

    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }

    public BigDecimal getTargetQuantity() { return targetQuantity; }
    public void setTargetQuantity(BigDecimal targetQuantity) { this.targetQuantity = targetQuantity; }

    public BigDecimal getCurrentQuantity() { return currentQuantity; }
    public void setCurrentQuantity(BigDecimal currentQuantity) { this.currentQuantity = currentQuantity; }

    public int getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(int progressPercentage) { this.progressPercentage = progressPercentage; }

    public BigDecimal getMinPledgePerBuyer() { return minPledgePerBuyer; }
    public void setMinPledgePerBuyer(BigDecimal minPledgePerBuyer) { this.minPledgePerBuyer = minPledgePerBuyer; }

    public BigDecimal getRegularPrice() { return regularPrice; }
    public void setRegularPrice(BigDecimal regularPrice) { this.regularPrice = regularPrice; }

    public BigDecimal getDiscountedPrice() { return discountedPrice; }
    public void setDiscountedPrice(BigDecimal discountedPrice) { this.discountedPrice = discountedPrice; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public GroupBuyStatus getStatus() { return status; }
    public void setStatus(GroupBuyStatus status) { this.status = status; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public int getParticipantCount() { return participantCount; }
    public void setParticipantCount(int participantCount) { this.participantCount = participantCount; }
}
