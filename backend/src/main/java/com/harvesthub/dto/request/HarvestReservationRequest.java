package com.harvesthub.dto.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class HarvestReservationRequest {
    @NotNull
    private Long harvestBatchId;

    @NotNull
    private BigDecimal quantity;

    private String notes;

    public HarvestReservationRequest() {}

    public Long getHarvestBatchId() { return harvestBatchId; }
    public void setHarvestBatchId(Long harvestBatchId) { this.harvestBatchId = harvestBatchId; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
