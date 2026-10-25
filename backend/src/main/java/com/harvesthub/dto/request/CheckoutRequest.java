package com.harvesthub.dto.request;

import com.harvesthub.entity.FulfillmentType;
import com.harvesthub.entity.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CheckoutRequest {
    @NotNull
    private Long farmId;

    @NotEmpty
    @Valid
    private List<CartItemRequest> items;

    @NotNull
    private FulfillmentType fulfillmentType = FulfillmentType.FARM_PICKUP;

    private Long deliverySlotId;

    private String deliveryAddress;

    @NotNull
    private PaymentMethod paymentMethod = PaymentMethod.SIMULATED_ONLINE;

    private Boolean isSurplusRescue = false;

    public CheckoutRequest() {}

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public List<CartItemRequest> getItems() { return items; }
    public void setItems(List<CartItemRequest> items) { this.items = items; }

    public FulfillmentType getFulfillmentType() { return fulfillmentType; }
    public void setFulfillmentType(FulfillmentType fulfillmentType) { this.fulfillmentType = fulfillmentType; }

    public Long getDeliverySlotId() { return deliverySlotId; }
    public void setDeliverySlotId(Long deliverySlotId) { this.deliverySlotId = deliverySlotId; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public Boolean getIsSurplusRescue() { return isSurplusRescue; }
    public void setIsSurplusRescue(Boolean isSurplusRescue) { this.isSurplusRescue = isSurplusRescue; }
}
