package com.harvesthub.dto.response;

import com.harvesthub.entity.TraceabilityStage;
import java.time.LocalDateTime;

public class TraceabilityEventDto {
    private Long id;
    private TraceabilityStage stage;
    private LocalDateTime eventTimestamp;
    private String location;
    private String description;
    private String operatorName;
    private Boolean verifiedByAdmin;
    private String proofDocumentUrl;

    public TraceabilityEventDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
}
