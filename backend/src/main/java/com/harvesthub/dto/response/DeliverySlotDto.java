package com.harvesthub.dto.response;

import com.harvesthub.entity.SlotType;
import java.math.BigDecimal;
import java.time.LocalDate;

public class DeliverySlotDto {
    private Long id;
    private Long farmId;
    private LocalDate slotDate;
    private String startTime;
    private String endTime;
    private SlotType slotType;
    private Integer maxCapacity;
    private Integer bookedCapacity;
    private Integer availableCapacity;
    private BigDecimal deliveryFee;
    private Boolean isActive;

    public DeliverySlotDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

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

    public Integer getBookedCapacity() { return bookedCapacity; }
    public void setBookedCapacity(Integer bookedCapacity) { this.bookedCapacity = bookedCapacity; }

    public Integer getAvailableCapacity() { return availableCapacity; }
    public void setAvailableCapacity(Integer availableCapacity) { this.availableCapacity = availableCapacity; }

    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
