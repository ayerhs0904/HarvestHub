package com.harvesthub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "surplus_deals")
public class SurplusDeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "harvest_batch_id", nullable = false, unique = true)
    private HarvestBatch harvestBatch;

    @NotNull
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal discountPercentage;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountedPrice;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal surplusQuantity;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal remainingQuantity;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime dealDeadline;

    @Column(nullable = false)
    private String pickupWindow;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public SurplusDeal() {}

    public SurplusDeal(HarvestBatch harvestBatch, BigDecimal discountPercentage, BigDecimal discountedPrice,
                       BigDecimal surplusQuantity, LocalDateTime dealDeadline, String pickupWindow) {
        this.harvestBatch = harvestBatch;
        this.discountPercentage = discountPercentage;
        this.discountedPrice = discountedPrice;
        this.surplusQuantity = surplusQuantity;
        this.remainingQuantity = surplusQuantity;
        this.dealDeadline = dealDeadline;
        this.pickupWindow = pickupWindow;
        this.isActive = true;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public HarvestBatch getHarvestBatch() { return harvestBatch; }
    public void setHarvestBatch(HarvestBatch harvestBatch) { this.harvestBatch = harvestBatch; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
