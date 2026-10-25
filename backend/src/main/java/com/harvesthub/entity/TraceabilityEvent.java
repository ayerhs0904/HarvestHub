package com.harvesthub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "traceability_events")
public class TraceabilityEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "harvest_batch_id", nullable = false)
    private HarvestBatch harvestBatch;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TraceabilityStage stage;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime eventTimestamp;

    @NotBlank
    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private String operatorName;

    @Column(nullable = false)
    private Boolean verifiedByAdmin = false;

    private String proofDocumentUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public TraceabilityEvent() {}

    public TraceabilityEvent(HarvestBatch harvestBatch, TraceabilityStage stage, LocalDateTime eventTimestamp,
                             String location, String description, String operatorName, Boolean verifiedByAdmin) {
        this.harvestBatch = harvestBatch;
        this.stage = stage;
        this.eventTimestamp = eventTimestamp;
        this.location = location;
        this.description = description;
        this.operatorName = operatorName;
        this.verifiedByAdmin = verifiedByAdmin != null ? verifiedByAdmin : false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public HarvestBatch getHarvestBatch() { return harvestBatch; }
    public void setHarvestBatch(HarvestBatch harvestBatch) { this.harvestBatch = harvestBatch; }

    public TraceabilityStage getStage() { return stage; }
    public void setStage(TraceabilityStage stage) { this.stage = stage; }

    public LocalDateTime getEventTimestamp() { return eventTimestamp; }
    public void setEventTimestamp(LocalDateTime eventTimestamp) { this.eventTimestamp = eventTimestamp; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getOperatorName() { return operatorName; }
    public void setOperatorName(String operatorName) { this.operatorName = operatorName; }

    public Boolean getVerifiedByAdmin() { return verifiedByAdmin; }
    public void setVerifiedByAdmin(Boolean verifiedByAdmin) { this.verifiedByAdmin = verifiedByAdmin; }

    public String getProofDocumentUrl() { return proofDocumentUrl; }
    public void setProofDocumentUrl(String proofDocumentUrl) { this.proofDocumentUrl = proofDocumentUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
