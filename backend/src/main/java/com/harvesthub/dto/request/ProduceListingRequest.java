package com.harvesthub.dto.request;

import com.harvesthub.entity.ListingUnit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ProduceListingRequest {
    @NotNull
    private Long categoryId;

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String cropVariety;

    @NotNull
    private ListingUnit unit = ListingUnit.KG;

    @NotNull
    private BigDecimal basePricePerUnit;

    private String imageUrl;

    private Integer shelfLifeDays = 7;

    public ProduceListingRequest() {}

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

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
}
