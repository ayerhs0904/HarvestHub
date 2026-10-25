package com.harvesthub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "produce_listings")
public class ProduceListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Column(nullable = false)
    private String cropVariety;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingUnit unit = ListingUnit.KG;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basePricePerUnit;

    private String imageUrl;

    @Column(nullable = false)
    private Integer shelfLifeDays = 7;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "produceListing", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HarvestBatch> batches = new ArrayList<>();

    public ProduceListing() {}

    public ProduceListing(Farm farm, Category category, String title, String description,
                          String cropVariety, ListingUnit unit, BigDecimal basePricePerUnit,
                          String imageUrl, Integer shelfLifeDays) {
        this.farm = farm;
        this.category = category;
        this.title = title;
        this.description = description;
        this.cropVariety = cropVariety;
        this.unit = unit;
        this.basePricePerUnit = basePricePerUnit;
        this.imageUrl = imageUrl;
        this.shelfLifeDays = shelfLifeDays;
        this.isActive = true;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Farm getFarm() { return farm; }
    public void setFarm(Farm farm) { this.farm = farm; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<HarvestBatch> getBatches() { return batches; }
    public void setBatches(List<HarvestBatch> batches) { this.batches = batches; }
}
