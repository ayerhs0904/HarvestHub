package com.harvesthub.repository;

import com.harvesthub.entity.GroupBuyParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupBuyParticipantRepository extends JpaRepository<GroupBuyParticipant, Long> {
    List<GroupBuyParticipant> findByGroupBuyId(Long groupBuyId);
    List<GroupBuyParticipant> findByBuyerId(Long buyerId);
}
