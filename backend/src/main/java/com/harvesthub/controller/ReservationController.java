package com.harvesthub.controller;

import com.harvesthub.dto.request.HarvestReservationRequest;
import com.harvesthub.dto.response.ApiResponse;
import com.harvesthub.dto.response.HarvestBatchDto;
import com.harvesthub.dto.response.HarvestReservationDto;
import com.harvesthub.service.ReservationService;
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
@RequestMapping("/api/v1/reservations")
@Tag(name = "Harvest Reservations", description = "Endpoints for pre-harvest reservation marketplace and advance crop bookings")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Public catalog of upcoming crop harvests open for advance pre-order reservation")
    public ResponseEntity<ApiResponse<List<HarvestBatchDto>>> getUpcomingHarvests() {
        List<HarvestBatchDto> upcoming = reservationService.getUpcomingHarvests();
        return ResponseEntity.ok(ApiResponse.ok(upcoming));
    }

    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "Buyer reserves a quantity from an upcoming harvest before actual picking")
    public ResponseEntity<ApiResponse<HarvestReservationDto>> reserveHarvest(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody HarvestReservationRequest request) {
        HarvestReservationDto dto = reservationService.reserveHarvest(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Harvest reservation successfully placed", dto));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "Buyer views their active harvest pre-orders")
    public ResponseEntity<ApiResponse<List<HarvestReservationDto>>> getMyReservations(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<HarvestReservationDto> list = reservationService.getMyReservations(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/farmer")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Farmer reviews advance reservations placed for their upcoming harvest batches")
    public ResponseEntity<ApiResponse<List<HarvestReservationDto>>> getFarmerReservations(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<HarvestReservationDto> list = reservationService.getFarmerReservations(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PutMapping("/farmer/{id}/confirm")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Farmer confirms harvest readiness, notifying the buyer to arrange pickup or delivery")
    public ResponseEntity<ApiResponse<HarvestReservationDto>> confirmReservation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        HarvestReservationDto dto = reservationService.confirmReservation(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("Reservation confirmed upon harvest completion", dto));
    }
}
