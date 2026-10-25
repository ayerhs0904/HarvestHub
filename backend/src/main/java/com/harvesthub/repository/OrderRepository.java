package com.harvesthub.repository;

import com.harvesthub.entity.Order;
import com.harvesthub.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);

    List<Order> findByFarmIdOrderByCreatedAtDesc(Long farmId);

    List<Order> findByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != 'CANCELLED'")
    BigDecimal calculateGrossMerchandiseValue();

    @Query("SELECT COALESCE(SUM(o.rescuedKg), 0) FROM Order o WHERE o.isSurplusRescue = true AND o.status != 'CANCELLED'")
    BigDecimal calculateTotalRescuedKg();
}
