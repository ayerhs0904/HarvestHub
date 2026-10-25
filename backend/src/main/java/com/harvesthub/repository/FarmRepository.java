package com.harvesthub.repository;

import com.harvesthub.entity.Farm;
import com.harvesthub.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FarmRepository extends JpaRepository<Farm, Long> {
    Optional<Farm> findByUserId(Long userId);
    List<Farm> findByVerificationStatus(VerificationStatus status);
}
