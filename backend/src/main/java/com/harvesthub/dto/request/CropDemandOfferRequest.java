package com.harvesthub.dto.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CropDemandOfferRequest {
    @NotNull
    private BigDecimal offeredPricePerUnit;

    @NotNull
    private LocalDate availableDate;

    private String notes;

    public CropDemandOfferRequest() {}

    public BigDecimal getOfferedPricePerUnit() { return offeredPricePerUnit; }
    public void setOfferedPricePerUnit(BigDecimal offeredPricePerUnit) { this.offeredPricePerUnit = offeredPricePerUnit; }

    public LocalDate getAvailableDate() { return availableDate; }
    public void setAvailableDate(LocalDate availableDate) { this.availableDate = availableDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
