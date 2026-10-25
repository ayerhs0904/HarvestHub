package com.harvesthub.dto.request;

import com.harvesthub.entity.SlotType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class DeliverySlotRequest {
    @NotNull
    private LocalDate slotDate;

    @NotBlank
    private String startTime;

    @NotBlank
    private String endTime;

    @NotNull
    private SlotType slotType = SlotType.FARM_PICKUP;

    private Integer maxCapacity = 20;

    private BigDecimal deliveryFee = BigDecimal.ZERO;

    public DeliverySlotRequest() {}

    public LocalDate getSlotDate() { return slotDate; }
    public void setSlotDate(LocalDate slotDate) { this.slotDate = slotDate; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public SlotType getSlotType() { return slotType; }
    public void setSlotType(SlotType slotType) { this.slotType = slotType; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }
}
