package com.harvesthub.repository;

import com.harvesthub.entity.CommunityGroupBuy;
import com.harvesthub.entity.GroupBuyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommunityGroupBuyRepository extends JpaRepository<CommunityGroupBuy, Long> {
    List<CommunityGroupBuy> findByStatusAndDeadlineAfter(GroupBuyStatus status, LocalDateTime now);
    List<CommunityGroupBuy> findByOrganizerId(Long organizerId);
    List<CommunityGroupBuy> findByProduceListingFarmId(Long farmId);
}
