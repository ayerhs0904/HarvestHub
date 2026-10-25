package com.harvesthub.dto.request;

import com.harvesthub.entity.VerificationStatus;
import jakarta.validation.constraints.NotNull;

public class FarmVerificationRequest {
    @NotNull
    private VerificationStatus status;

    private String verificationNotes;

    public FarmVerificationRequest() {}

    public VerificationStatus getStatus() { return status; }
    public void setStatus(VerificationStatus status) { this.status = status; }

    public String getVerificationNotes() { return verificationNotes; }
    public void setVerificationNotes(String verificationNotes) { this.verificationNotes = verificationNotes; }
}
