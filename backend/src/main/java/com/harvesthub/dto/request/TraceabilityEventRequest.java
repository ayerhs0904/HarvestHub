package com.harvesthub.dto.request;

import com.harvesthub.entity.TraceabilityStage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class TraceabilityEventRequest {
    @NotNull
    private TraceabilityStage stage;

    @NotNull
    private LocalDateTime eventTimestamp;

    @NotBlank
    private String location;

    @NotBlank
    private String description;

    private String operatorName;

    private String proofDocumentUrl;

    public TraceabilityEventRequest() {}

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

    public String getProofDocumentUrl() { return proofDocumentUrl; }
    public void setProofDocumentUrl(String proofDocumentUrl) { this.proofDocumentUrl = proofDocumentUrl; }
}
