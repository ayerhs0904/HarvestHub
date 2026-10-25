package com.harvesthub.controller;

import com.harvesthub.dto.request.HarvestBatchRequest;
import com.harvesthub.dto.request.ProduceListingRequest;
import com.harvesthub.dto.response.ApiResponse;
import com.harvesthub.dto.response.HarvestBatchDto;
import com.harvesthub.dto.response.ProduceDto;
import com.harvesthub.entity.FarmingMethod;
import com.harvesthub.service.ProduceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Produce & Inventory", description = "Endpoints for marketplace produce discovery, filtering, and farmer inventory/batch management")
public class ProduceController {

    private final ProduceService produceService;

    public ProduceController(ProduceService produceService) {
        this.produceService = produceService;
    }

    @GetMapping("/produce")
    @Operation(summary = "Search marketplace produce with multi-criteria filters, sorting, and pagination")
    public ResponseEntity<ApiResponse<Page<ProduceDto>>> searchProduce(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) FarmingMethod farmingMethod,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        String[] sortParts = sort.split(",");
        Sort sortObj = Sort.by(sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc") ?
                Sort.Direction.ASC : Sort.Direction.DESC, sortParts[0]);

        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<ProduceDto> result = produceService.searchProduce(categoryId, farmingMethod, minPrice, maxPrice, search, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/produce/{id}")
    @Operation(summary = "Get detailed produce listing by ID with batch freshness metrics")
    public ResponseEntity<ApiResponse<ProduceDto>> getProduceById(@PathVariable Long id) {
        ProduceDto dto = produceService.getProduceById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PostMapping("/farmer/produce")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Farmer creates a new produce listing")
    public ResponseEntity<ApiResponse<ProduceDto>> createProduce(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProduceListingRequest request) {
        ProduceDto dto = produceService.createProduce(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Produce listing created successfully", dto));
    }

    @PutMapping("/farmer/produce/{id}")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Farmer updates existing produce listing")
    public ResponseEntity<ApiResponse<ProduceDto>> updateProduce(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody ProduceListingRequest request) {
        ProduceDto dto = produceService.updateProduce(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Produce listing updated successfully", dto));
    }

    @PostMapping("/farmer/produce/{id}/batches")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Farmer logs a new harvest batch for a produce listing")
    public ResponseEntity<ApiResponse<HarvestBatchDto>> addBatch(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody HarvestBatchRequest request) {
        HarvestBatchDto dto = produceService.addBatchToListing(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Harvest batch logged successfully", dto));
    }

    @GetMapping("/farmer/inventory")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Farmer retrieves all their produce listings and batch inventory stock levels")
    public ResponseEntity<ApiResponse<List<ProduceDto>>> getFarmerInventory(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ProduceDto> inventory = produceService.getFarmerInventory(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(inventory));
    }
}
