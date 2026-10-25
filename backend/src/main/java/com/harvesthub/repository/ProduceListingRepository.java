package com.harvesthub.repository;

import com.harvesthub.entity.FarmingMethod;
import com.harvesthub.entity.ProduceListing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProduceListingRepository extends JpaRepository<ProduceListing, Long> {

    List<ProduceListing> findByFarmId(Long farmId);

    @Query("SELECT p FROM ProduceListing p WHERE p.isActive = true " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:farmingMethod IS NULL OR p.farm.farmingMethod = :farmingMethod) " +
           "AND (:minPrice IS NULL OR p.basePricePerUnit >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.basePricePerUnit <= :maxPrice) " +
           "AND (:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(p.cropVariety) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(p.farm.farmName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<ProduceListing> searchProduce(
            @Param("categoryId") Long categoryId,
            @Param("farmingMethod") FarmingMethod farmingMethod,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("search") String search,
            Pageable pageable);

    long countByIsActiveTrue();
}
