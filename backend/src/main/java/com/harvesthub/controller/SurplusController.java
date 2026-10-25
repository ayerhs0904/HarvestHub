package com.harvesthub.controller;

import com.harvesthub.dto.request.SurplusDealRequest;
import com.harvesthub.dto.response.ApiResponse;
import com.harvesthub.dto.response.SurplusDealDto;
import com.harvesthub.service.SurplusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/surplus")
@Tag(name = "Surplus Food Rescue", description = "Endpoints for discounted surplus food rescue deals and platform waste reduction metrics")
public class SurplusController {

    private final SurplusService surplusService;

    public SurplusController(SurplusService surplusService) {
        this.surplusService = surplusService;
    }

    @GetMapping("/deals")
    @Operation(summary = "Get list of active surplus food rescue deals with countdown deadlines")
    public ResponseEntity<ApiResponse<List<SurplusDealDto>>> getActiveDeals() {
        List<SurplusDealDto> deals = surplusService.getActiveDeals();
        return ResponseEntity.ok(ApiResponse.ok(deals));
    }

    @PostMapping("/farmer/create")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Farmer posts surplus produce at a rescue discount before a scheduled cutoff")
    public ResponseEntity<ApiResponse<SurplusDealDto>> createSurplusDeal(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SurplusDealRequest request) {
        SurplusDealDto dto = surplusService.createSurplusDeal(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Surplus rescue deal created successfully", dto));
    }

    @GetMapping("/impact")
    @Operation(summary = "Platform-wide food rescue metrics (total kg food saved from waste)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getImpactMetrics() {
        BigDecimal rescuedKg = surplusService.calculateRescuedKg();
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "totalRescuedKg", rescuedKg,
                "co2EquivalentSavedKg", rescuedKg.multiply(BigDecimal.valueOf(2.5)), // 2.5 kg CO2 per kg food saved
                "impactMessage", "Every kilogram rescued directly combats agricultural waste and carbon footprint."
        )));
    }
}
