package com.harvesthub.controller;

import com.harvesthub.dto.request.DeliverySlotRequest;
import com.harvesthub.dto.response.ApiResponse;
import com.harvesthub.dto.response.DeliverySlotDto;
import com.harvesthub.service.SlotService;
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
@Tag(name = "Delivery & Pickup Slots", description = "Endpoints for farm pickup windows, local delivery scheduling, and capacity planning")
public class SlotController {

    private final SlotService slotService;

    public SlotController(SlotService slotService) {
        this.slotService = slotService;
    }

    @GetMapping("/farms/{farmId}/slots")
    @Operation(summary = "Get available pickup and local delivery slots for a given farm")
    public ResponseEntity<ApiResponse<List<DeliverySlotDto>>> getSlotsForFarm(@PathVariable Long farmId) {
        List<DeliverySlotDto> slots = slotService.getFarmSlots(farmId);
        return ResponseEntity.ok(ApiResponse.ok(slots));
    }

    @PostMapping("/farmer/slots")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Farmer configures a new pickup/delivery time slot with capacity quota")
    public ResponseEntity<ApiResponse<DeliverySlotDto>> createSlot(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody DeliverySlotRequest request) {
        DeliverySlotDto dto = slotService.createSlot(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Slot scheduled successfully", dto));
    }
}
