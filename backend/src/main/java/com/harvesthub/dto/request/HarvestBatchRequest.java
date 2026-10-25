package com.harvesthub.dto.request;

import com.harvesthub.entity.BatchStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class HarvestBatchRequest {
    @NotBlank
    private String batchNumber;

    @NotNull
    private LocalDate harvestDate;

    @NotNull
    private BigDecimal initialQuantity;

    private Integer freshnessWindowDays = 5;

    private String storageCondition = "Ambient Cool Storage";

    private BatchStatus status = BatchStatus.ACTIVE;

    public HarvestBatchRequest() {}

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }

    public BigDecimal getInitialQuantity() { return initialQuantity; }
    public void setInitialQuantity(BigDecimal initialQuantity) { this.initialQuantity = initialQuantity; }

    public Integer getFreshnessWindowDays() { return freshnessWindowDays; }
    public void setFreshnessWindowDays(Integer freshnessWindowDays) { this.freshnessWindowDays = freshnessWindowDays; }

    public String getStorageCondition() { return storageCondition; }
    public void setStorageCondition(String storageCondition) { this.storageCondition = storageCondition; }

    public BatchStatus getStatus() { return status; }
    public void setStatus(BatchStatus status) { this.status = status; }
}
