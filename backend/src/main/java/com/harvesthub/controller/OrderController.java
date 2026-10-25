package com.harvesthub.controller;

import com.harvesthub.dto.request.CheckoutRequest;
import com.harvesthub.dto.request.OrderStatusUpdateRequest;
import com.harvesthub.dto.response.ApiResponse;
import com.harvesthub.dto.response.OrderDto;
import com.harvesthub.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Orders & Fulfillment", description = "Endpoints for atomic checkout, stock reservation, and farm-to-doorstep order fulfillment")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/orders/checkout")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "Submit checkout cart with concurrency-safe stock locking and simulated payment/COD")
    public ResponseEntity<ApiResponse<OrderDto>> checkout(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CheckoutRequest request) {
        OrderDto order = orderService.checkout(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully", order));
    }

    @GetMapping("/orders/my")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "Get list of orders placed by current buyer")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        List<OrderDto> orders = orderService.getMyOrders(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Get detailed order information by ID (accessible by buyer, farm owner, or admin)")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        OrderDto order = orderService.getOrderById(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @GetMapping("/farmer/orders")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Farmer retrieves incoming customer orders for their farm")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getFarmerOrders(@AuthenticationPrincipal UserDetails userDetails) {
        List<OrderDto> orders = orderService.getFarmerOrders(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PutMapping("/farmer/orders/{id}/status")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Farmer updates order fulfillment status (ACCEPTED, PREPARING, READY_FOR_PICKUP, DELIVERED, CANCELLED)")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderDto updated = orderService.updateOrderStatus(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated successfully", updated));
    }
}
