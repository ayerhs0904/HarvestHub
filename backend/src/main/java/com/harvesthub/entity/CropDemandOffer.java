package com.harvesthub.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "crop_demand_offers")
public class CropDemandOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "demand_request_id", nullable = false)
    @JsonIgnore
    private CropDemandRequest demandRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal offeredPricePerUnit;

    @NotNull
    @Column(nullable = false)
    private LocalDate availableDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfferStatus status = OfferStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public CropDemandOffer() {}

    public CropDemandOffer(CropDemandRequest demandRequest, Farm farm, BigDecimal offeredPricePerUnit,
                           LocalDate availableDate, String notes) {
        this.demandRequest = demandRequest;
        this.farm = farm;
        this.offeredPricePerUnit = offeredPricePerUnit;
        this.availableDate = availableDate;
        this.notes = notes;
        this.status = OfferStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CropDemandRequest getDemandRequest() { return demandRequest; }
    public void setDemandRequest(CropDemandRequest demandRequest) { this.demandRequest = demandRequest; }

    public Farm getFarm() { return farm; }
    public void setFarm(Farm farm) { this.farm = farm; }

    public BigDecimal getOfferedPricePerUnit() { return offeredPricePerUnit; }
    public void setOfferedPricePerUnit(BigDecimal offeredPricePerUnit) { this.offeredPricePerUnit = offeredPricePerUnit; }

    public LocalDate getAvailableDate() { return availableDate; }
    public void setAvailableDate(LocalDate availableDate) { this.availableDate = availableDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public OfferStatus getStatus() { return status; }
    public void setStatus(OfferStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
