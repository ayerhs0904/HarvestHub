package com.harvesthub.repository;

import com.harvesthub.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduceListingIdOrderByCreatedAtDesc(Long produceListingId);
    boolean existsByOrderIdAndProduceListingId(Long orderId, Long produceListingId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.produceListing.id = :listingId")
    Double getAverageRatingForListing(@Param("listingId") Long listingId);
}
