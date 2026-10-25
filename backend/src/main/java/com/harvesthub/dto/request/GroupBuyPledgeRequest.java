package com.harvesthub.dto.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class GroupBuyPledgeRequest {
    @NotNull
    private BigDecimal pledgedQuantity;

    public GroupBuyPledgeRequest() {}

    public BigDecimal getPledgedQuantity() { return pledgedQuantity; }
    public void setPledgedQuantity(BigDecimal pledgedQuantity) { this.pledgedQuantity = pledgedQuantity; }
}
