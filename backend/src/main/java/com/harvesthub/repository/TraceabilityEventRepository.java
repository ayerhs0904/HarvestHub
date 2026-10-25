package com.harvesthub.repository;

import com.harvesthub.entity.TraceabilityEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TraceabilityEventRepository extends JpaRepository<TraceabilityEvent, Long> {
    List<TraceabilityEvent> findByHarvestBatchIdOrderByEventTimestampAsc(Long harvestBatchId);
    List<TraceabilityEvent> findByHarvestBatchBatchNumberOrderByEventTimestampAsc(String batchNumber);
}
