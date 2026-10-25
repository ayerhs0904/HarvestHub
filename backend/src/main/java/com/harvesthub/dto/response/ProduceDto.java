package com.harvesthub.dto.response;

import com.harvesthub.entity.FarmingMethod;
import com.harvesthub.entity.ListingUnit;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ProduceDto {
    private Long id;
    private Long farmId;
    private String farmName;
    private String farmCity;
    private FarmingMethod farmingMethod;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private String cropVariety;
    private ListingUnit unit;
    private BigDecimal basePricePerUnit;
    private String imageUrl;
    private Integer shelfLifeDays;
    private Boolean isActive;
    private Double averageRating;
    private Integer reviewCount;
    private List<HarvestBatchDto> batches = new ArrayList<>();
    private LocalDateTime createdAt;

    public ProduceDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public String getFarmName() { return farmName; }
    public void setFarmName(String farmName) { this.farmName = farmName; }

    public String getFarmCity() { return farmCity; }
    public void setFarmCity(String farmCity) { this.farmCity = farmCity; }

    public FarmingMethod getFarmingMethod() { return farmingMethod; }
    public void setFarmingMethod(FarmingMethod farmingMethod) { this.farmingMethod = farmingMethod; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCropVariety() { return cropVariety; }
    public void setCropVariety(String cropVariety) { this.cropVariety = cropVariety; }

    public ListingUnit getUnit() { return unit; }
    public void setUnit(ListingUnit unit) { this.unit = unit; }

    public BigDecimal getBasePricePerUnit() { return basePricePerUnit; }
    public void setBasePricePerUnit(BigDecimal basePricePerUnit) { this.basePricePerUnit = basePricePerUnit; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getShelfLifeDays() { return shelfLifeDays; }
    public void setShelfLifeDays(Integer shelfLifeDays) { this.shelfLifeDays = shelfLifeDays; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public List<HarvestBatchDto> getBatches() { return batches; }
    public void setBatches(List<HarvestBatchDto> batches) { this.batches = batches; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
