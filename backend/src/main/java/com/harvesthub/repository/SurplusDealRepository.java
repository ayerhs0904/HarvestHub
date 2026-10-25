package com.harvesthub.repository;

import com.harvesthub.entity.SurplusDeal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SurplusDealRepository extends JpaRepository<SurplusDeal, Long> {

    List<SurplusDeal> findByIsActiveTrueAndDealDeadlineAfter(LocalDateTime now);

    Optional<SurplusDeal> findByHarvestBatchId(Long harvestBatchId);

    @Query("SELECT COALESCE(SUM(s.surplusQuantity - s.remainingQuantity), 0) FROM SurplusDeal s")
    BigDecimal calculateRescuedProduceKg();
}
