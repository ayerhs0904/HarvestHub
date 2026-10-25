package com.harvesthub.repository;

import com.harvesthub.entity.DeliverySlot;
import com.harvesthub.entity.SlotType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DeliverySlotRepository extends JpaRepository<DeliverySlot, Long> {
    List<DeliverySlot> findByFarmIdAndSlotDateGreaterThanEqualAndIsActiveTrueOrderBySlotDateAscStartTimeAsc(Long farmId, LocalDate fromDate);
    List<DeliverySlot> findByFarmIdAndSlotType(Long farmId, SlotType slotType);
}
