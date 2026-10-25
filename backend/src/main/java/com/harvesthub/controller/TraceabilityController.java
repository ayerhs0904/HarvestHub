package com.harvesthub.controller;

import com.harvesthub.dto.request.TraceabilityEventRequest;
import com.harvesthub.dto.response.ApiResponse;
import com.harvesthub.dto.response.TraceabilityEventDto;
import com.harvesthub.dto.response.TraceabilityPassportDto;
import com.harvesthub.service.TraceabilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Traceability Passport", description = "Endpoints for the QR Harvest-to-Home Traceability Passport and verifiable agricultural journey")
public class TraceabilityController {

    private final TraceabilityService traceabilityService;

    public TraceabilityController(TraceabilityService traceabilityService) {
        this.traceabilityService = traceabilityService;
    }

    @GetMapping("/traceability/{batchNumber}")
    @Operation(summary = "Public endpoint to retrieve the complete Traceability Passport for a harvest batch by batch number")
    public ResponseEntity<ApiResponse<TraceabilityPassportDto>> getPassport(@PathVariable String batchNumber) {
        TraceabilityPassportDto passport = traceabilityService.getPassport(batchNumber);
        return ResponseEntity.ok(ApiResponse.ok(passport));
    }

    @PostMapping("/farmer/batches/{batchId}/events")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Farmer records a new lifecycle traceability event (e.g. Sowing, Harvest, Quality Check)")
    public ResponseEntity<ApiResponse<TraceabilityEventDto>> addEvent(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long batchId,
            @Valid @RequestBody TraceabilityEventRequest request) {
        TraceabilityEventDto dto = traceabilityService.addEventToBatch(userDetails.getUsername(), batchId, request);
        return ResponseEntity.ok(ApiResponse.ok("Traceability event recorded successfully", dto));
    }

    @PutMapping("/admin/traceability-events/{eventId}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Administrator validates and certifies the authenticity of a traceability event")
    public ResponseEntity<ApiResponse<TraceabilityEventDto>> verifyEvent(@PathVariable Long eventId) {
        TraceabilityEventDto dto = traceabilityService.verifyEvent(eventId);
        return ResponseEntity.ok(ApiResponse.ok("Traceability event verified by admin", dto));
    }
}
