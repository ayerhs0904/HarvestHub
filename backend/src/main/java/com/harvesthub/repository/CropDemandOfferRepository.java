package com.harvesthub.repository;

import com.harvesthub.entity.CropDemandOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropDemandOfferRepository extends JpaRepository<CropDemandOffer, Long> {
    List<CropDemandOffer> findByDemandRequestId(Long demandRequestId);
    List<CropDemandOffer> findByFarmId(Long farmId);
}
