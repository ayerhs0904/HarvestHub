package com.harvesthub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "delivery_slots")
public class DeliverySlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @NotNull
    @Column(nullable = false)
    private LocalDate slotDate;

    @NotBlank
    @Column(nullable = false)
    private String startTime;

    @NotBlank
    @Column(nullable = false)
    private String endTime;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotType slotType = SlotType.FARM_PICKUP;

    @NotNull
    @Column(nullable = false)
    private Integer maxCapacity = 20;

    @NotNull
    @Column(nullable = false)
    private Integer bookedCapacity = 0;

    @Column(precision = 10, scale = 2)
    private BigDecimal deliveryFee = BigDecimal.ZERO;

    @Column(nullable = false)
    private Boolean isActive = true;

    public DeliverySlot() {}

    public DeliverySlot(Farm farm, LocalDate slotDate, String startTime, String endTime,
                        SlotType slotType, Integer maxCapacity, BigDecimal deliveryFee) {
        this.farm = farm;
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.slotType = slotType;
        this.maxCapacity = maxCapacity != null ? maxCapacity : 20;
        this.bookedCapacity = 0;
        this.deliveryFee = deliveryFee != null ? deliveryFee : BigDecimal.ZERO;
        this.isActive = true;
    }

    public boolean hasAvailableCapacity() {
        return bookedCapacity < maxCapacity;
    }

    public void incrementBookedCapacity() {
        if (!hasAvailableCapacity()) {
            throw new IllegalStateException("Delivery slot capacity exceeded");
        }
        this.bookedCapacity++;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Farm getFarm() { return farm; }
    public void setFarm(Farm farm) { this.farm = farm; }

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

    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
