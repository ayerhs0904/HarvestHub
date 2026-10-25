package com.harvesthub.dto.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CartItemRequest {
    @NotNull
    private Long harvestBatchId;

    @NotNull
    private BigDecimal quantity;

    public CartItemRequest() {}

    public CartItemRequest(Long harvestBatchId, BigDecimal quantity) {
        this.harvestBatchId = harvestBatchId;
        this.quantity = quantity;
    }

    public Long getHarvestBatchId() { return harvestBatchId; }
    public void setHarvestBatchId(Long harvestBatchId) { this.harvestBatchId = harvestBatchId; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
}
