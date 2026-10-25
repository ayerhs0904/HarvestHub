package com.harvesthub.repository;

import com.harvesthub.entity.BatchStatus;
import com.harvesthub.entity.HarvestBatch;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HarvestBatchRepository extends JpaRepository<HarvestBatch, Long> {

    Optional<HarvestBatch> findByBatchNumber(String batchNumber);

    List<HarvestBatch> findByProduceListingId(Long produceListingId);

    List<HarvestBatch> findByProduceListingFarmId(Long farmId);

    List<HarvestBatch> findByStatus(BatchStatus status);

    /**
     * Pessimistic Write Lock ensures no two concurrent checkouts can modify or read
     * available quantities simultaneously, preventing overselling.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM HarvestBatch b WHERE b.id = :id")
    Optional<HarvestBatch> findByIdWithLock(@Param("id") Long id);
}
