package com.harvesthub.dto.response;

import com.harvesthub.entity.ListingUnit;
import java.math.BigDecimal;

public class OrderItemDto {
    private Long id;
    private Long harvestBatchId;
    private String batchNumber;
    private Long produceListingId;
    private String produceTitle;
    private String cropVariety;
    private ListingUnit unit;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;

    public OrderItemDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getHarvestBatchId() { return harvestBatchId; }
    public void setHarvestBatchId(Long harvestBatchId) { this.harvestBatchId = harvestBatchId; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public Long getProduceListingId() { return produceListingId; }
    public void setProduceListingId(Long produceListingId) { this.produceListingId = produceListingId; }

    public String getProduceTitle() { return produceTitle; }
    public void setProduceTitle(String produceTitle) { this.produceTitle = produceTitle; }

    public String getCropVariety() { return cropVariety; }
    public void setCropVariety(String cropVariety) { this.cropVariety = cropVariety; }

    public ListingUnit getUnit() { return unit; }
    public void setUnit(ListingUnit unit) { this.unit = unit; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
