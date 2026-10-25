package com.harvesthub.repository;

import com.harvesthub.entity.CropDemandRequest;
import com.harvesthub.entity.DemandStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropDemandRequestRepository extends JpaRepository<CropDemandRequest, Long> {
    List<CropDemandRequest> findByStatusOrderByCreatedAtDesc(DemandStatus status);
    List<CropDemandRequest> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
}
