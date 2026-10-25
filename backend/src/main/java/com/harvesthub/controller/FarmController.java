package com.harvesthub.controller;

import com.harvesthub.dto.request.FarmProfileRequest;
import com.harvesthub.dto.response.ApiResponse;
import com.harvesthub.dto.response.FarmDto;
import com.harvesthub.service.FarmService;
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
@Tag(name = "Farms", description = "Endpoints for farm profile management, public discovery, and verification")
public class FarmController {

    private final FarmService farmService;

    public FarmController(FarmService farmService) {
        this.farmService = farmService;
    }

    @PostMapping("/farmer/farm")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Create or update authenticated farmer's farm profile")
    public ResponseEntity<ApiResponse<FarmDto>> createOrUpdateFarm(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody FarmProfileRequest request) {
        FarmDto dto = farmService.createOrUpdateFarm(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Farm profile updated successfully", dto));
    }

    @GetMapping("/farmer/farm")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Get authenticated farmer's farm details")
    public ResponseEntity<ApiResponse<FarmDto>> getMyFarm(@AuthenticationPrincipal UserDetails userDetails) {
        FarmDto dto = farmService.getMyFarm(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/farms/{id}")
    @Operation(summary = "Public endpoint to view a farm profile by ID")
    public ResponseEntity<ApiResponse<FarmDto>> getFarmById(@PathVariable Long id) {
        FarmDto dto = farmService.getFarmById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/farms")
    @Operation(summary = "Public endpoint to list all registered farms")
    public ResponseEntity<ApiResponse<List<FarmDto>>> getAllFarms() {
        List<FarmDto> farms = farmService.getAllFarms();
        return ResponseEntity.ok(ApiResponse.ok(farms));
    }
}
