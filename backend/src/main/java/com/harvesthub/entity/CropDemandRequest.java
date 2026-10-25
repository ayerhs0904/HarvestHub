package com.harvesthub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "crop_demand_requests")
public class CropDemandRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @NotBlank
    @Column(nullable = false)
    private String cropName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal requestedQuantity;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingUnit unit = ListingUnit.KG;

    @NotNull
    @Column(nullable = false)
    private LocalDate neededByDate;

    @Column(precision = 10, scale = 2)
    private BigDecimal maxBudgetPerUnit;

    private String deliveryLocation;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DemandStatus status = DemandStatus.OPEN;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "demandRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CropDemandOffer> offers = new ArrayList<>();

    public CropDemandRequest() {}

    public CropDemandRequest(User buyer, String cropName, Category category, BigDecimal requestedQuantity,
                             ListingUnit unit, LocalDate neededByDate, BigDecimal maxBudgetPerUnit,
                             String deliveryLocation, String notes) {
        this.buyer = buyer;
        this.cropName = cropName;
        this.category = category;
        this.requestedQuantity = requestedQuantity;
        this.unit = unit != null ? unit : ListingUnit.KG;
        this.neededByDate = neededByDate;
        this.maxBudgetPerUnit = maxBudgetPerUnit;
        this.deliveryLocation = deliveryLocation;
        this.notes = notes;
        this.status = DemandStatus.OPEN;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getBuyer() { return buyer; }
    public void setBuyer(User buyer) { this.buyer = buyer; }

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

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

    public List<CropDemandOffer> getOffers() { return offers; }
    public void setOffers(List<CropDemandOffer> offers) { this.offers = offers; }
}
