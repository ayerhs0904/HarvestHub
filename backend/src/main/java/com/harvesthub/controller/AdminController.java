package com.harvesthub.controller;

import com.harvesthub.dto.request.FarmVerificationRequest;
import com.harvesthub.dto.response.AdminStatsDto;
import com.harvesthub.dto.response.ApiResponse;
import com.harvesthub.dto.response.FarmDto;
import com.harvesthub.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administrator Portal", description = "Endpoints for platform moderation, farm verification, and analytics")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get platform-wide analytics and food rescue KPI counters")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        AdminStatsDto stats = adminService.getPlatformStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/verifications")
    @Operation(summary = "Get list of pending farmer verification applications")
    public ResponseEntity<ApiResponse<List<FarmDto>>> getPendingVerifications() {
        List<FarmDto> list = adminService.getPendingVerifications();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PutMapping("/verifications/{farmId}")
    @Operation(summary = "Approve or reject a farm verification application with notes")
    public ResponseEntity<ApiResponse<FarmDto>> verifyFarm(
            @PathVariable Long farmId,
            @Valid @RequestBody FarmVerificationRequest request) {
        FarmDto dto = adminService.verifyFarm(farmId, request);
        return ResponseEntity.ok(ApiResponse.ok("Farm verification status updated", dto));
    }
}
