package com.harvesthub.dto.response;

import com.harvesthub.entity.ListingUnit;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SurplusDealDto {
    private Long id;
    private Long harvestBatchId;
    private String batchNumber;
    private Long produceListingId;
    private String listingTitle;
    private String cropVariety;
    private String imageUrl;
    private String farmName;
    private ListingUnit unit;
    private BigDecimal regularPrice;
    private BigDecimal discountPercentage;
    private BigDecimal discountedPrice;
    private BigDecimal surplusQuantity;
    private BigDecimal remainingQuantity;
    private LocalDateTime dealDeadline;
    private String pickupWindow;
    private Boolean isActive;

    public SurplusDealDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getHarvestBatchId() { return harvestBatchId; }
    public void setHarvestBatchId(Long harvestBatchId) { this.harvestBatchId = harvestBatchId; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public Long getProduceListingId() { return produceListingId; }
    public void setProduceListingId(Long produceListingId) { this.produceListingId = produceListingId; }

    public String getListingTitle() { return listingTitle; }
    public void setListingTitle(String listingTitle) { this.listingTitle = listingTitle; }

    public String getCropVariety() { return cropVariety; }
    public void setCropVariety(String cropVariety) { this.cropVariety = cropVariety; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getFarmName() { return farmName; }
    public void setFarmName(String farmName) { this.farmName = farmName; }

    public ListingUnit getUnit() { return unit; }
    public void setUnit(ListingUnit unit) { this.unit = unit; }

    public BigDecimal getRegularPrice() { return regularPrice; }
    public void setRegularPrice(BigDecimal regularPrice) { this.regularPrice = regularPrice; }

    public BigDecimal getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(BigDecimal discountPercentage) { this.discountPercentage = discountPercentage; }

    public BigDecimal getDiscountedPrice() { return discountedPrice; }
    public void setDiscountedPrice(BigDecimal discountedPrice) { this.discountedPrice = discountedPrice; }

    public BigDecimal getSurplusQuantity() { return surplusQuantity; }
    public void setSurplusQuantity(BigDecimal surplusQuantity) { this.surplusQuantity = surplusQuantity; }

    public BigDecimal getRemainingQuantity() { return remainingQuantity; }
    public void setRemainingQuantity(BigDecimal remainingQuantity) { this.remainingQuantity = remainingQuantity; }

    public LocalDateTime getDealDeadline() { return dealDeadline; }
    public void setDealDeadline(LocalDateTime dealDeadline) { this.dealDeadline = dealDeadline; }

    public String getPickupWindow() { return pickupWindow; }
    public void setPickupWindow(String pickupWindow) { this.pickupWindow = pickupWindow; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
