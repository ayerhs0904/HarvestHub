package com.harvesthub.repository;

import com.harvesthub.entity.HarvestReservation;
import com.harvesthub.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HarvestReservationRepository extends JpaRepository<HarvestReservation, Long> {
    List<HarvestReservation> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
    List<HarvestReservation> findByHarvestBatchProduceListingFarmIdOrderByCreatedAtDesc(Long farmId);
    List<HarvestReservation> findByStatus(ReservationStatus status);
}
