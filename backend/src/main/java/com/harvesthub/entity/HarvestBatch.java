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
@Table(name = "harvest_batches")
public class HarvestBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produce_listing_id", nullable = false)
    private ProduceListing produceListing;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String batchNumber;

    @NotNull
    @Column(nullable = false)
    private LocalDate harvestDate;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal initialQuantity;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal availableQuantity;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal reservedQuantity = BigDecimal.ZERO;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BatchStatus status = BatchStatus.ACTIVE;

    private String storageCondition = "Ambient Cool Storage";

    @Column(nullable = false)
    private Integer freshnessWindowDays = 5;

    @Version
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "harvestBatch", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("eventTimestamp ASC")
    private List<TraceabilityEvent> traceabilityEvents = new ArrayList<>();

    @OneToOne(mappedBy = "harvestBatch", cascade = CascadeType.ALL)
    private SurplusDeal surplusDeal;

    public HarvestBatch() {}

    public HarvestBatch(ProduceListing produceListing, String batchNumber, LocalDate harvestDate,
                        BigDecimal initialQuantity, Integer freshnessWindowDays, BatchStatus status) {
        this.produceListing = produceListing;
        this.batchNumber = batchNumber;
        this.harvestDate = harvestDate;
        this.initialQuantity = initialQuantity;
        this.availableQuantity = initialQuantity;
        this.reservedQuantity = BigDecimal.ZERO;
        this.freshnessWindowDays = freshnessWindowDays != null ? freshnessWindowDays : 5;
        this.status = status != null ? status : BatchStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProduceListing getProduceListing() { return produceListing; }
    public void setProduceListing(ProduceListing produceListing) { this.produceListing = produceListing; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }

    public BigDecimal getInitialQuantity() { return initialQuantity; }
    public void setInitialQuantity(BigDecimal initialQuantity) { this.initialQuantity = initialQuantity; }

    public BigDecimal getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(BigDecimal availableQuantity) { this.availableQuantity = availableQuantity; }

    public BigDecimal getReservedQuantity() { return reservedQuantity; }
    public void setReservedQuantity(BigDecimal reservedQuantity) { this.reservedQuantity = reservedQuantity; }

    public BatchStatus getStatus() { return status; }
    public void setStatus(BatchStatus status) { this.status = status; }

    public String getStorageCondition() { return storageCondition; }
    public void setStorageCondition(String storageCondition) { this.storageCondition = storageCondition; }

    public Integer getFreshnessWindowDays() { return freshnessWindowDays; }
    public void setFreshnessWindowDays(Integer freshnessWindowDays) { this.freshnessWindowDays = freshnessWindowDays; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<TraceabilityEvent> getTraceabilityEvents() { return traceabilityEvents; }
    public void setTraceabilityEvents(List<TraceabilityEvent> traceabilityEvents) { this.traceabilityEvents = traceabilityEvents; }

    public SurplusDeal getSurplusDeal() { return surplusDeal; }
    public void setSurplusDeal(SurplusDeal surplusDeal) { this.surplusDeal = surplusDeal; }
}
