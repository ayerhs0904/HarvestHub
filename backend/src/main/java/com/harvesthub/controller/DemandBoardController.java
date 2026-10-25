package com.harvesthub.controller;

import com.harvesthub.dto.request.CropDemandOfferRequest;
import com.harvesthub.dto.request.CropDemandRequestCreate;
import com.harvesthub.dto.response.ApiResponse;
import com.harvesthub.dto.response.CropDemandOfferDto;
import com.harvesthub.dto.response.CropDemandRequestDto;
import com.harvesthub.service.DemandBoardService;
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
@RequestMapping("/api/v1/demand-board")
@Tag(name = "Crop Demand Board", description = "Endpoints for restaurant/household crop requests (RFQs) and direct farmer price bidding")
public class DemandBoardController {

    private final DemandBoardService demandBoardService;

    public DemandBoardController(DemandBoardService demandBoardService) {
        this.demandBoardService = demandBoardService;
    }

    @GetMapping
    @Operation(summary = "Get list of active buyer crop requests and current bids")
    public ResponseEntity<ApiResponse<List<CropDemandRequestDto>>> getActiveDemands() {
        List<CropDemandRequestDto> list = demandBoardService.getActiveDemands();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "Buyer posts a customized produce demand request (e.g. 50 kg San Marzano Tomatoes needed by next Friday)")
    public ResponseEntity<ApiResponse<CropDemandRequestDto>> createDemand(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CropDemandRequestCreate request) {
        CropDemandRequestDto dto = demandBoardService.createDemand(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Crop demand request published", dto));
    }

    @PostMapping("/{id}/offers")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    @Operation(summary = "Farmer submits a price proposal/quote to satisfy a buyer crop demand")
    public ResponseEntity<ApiResponse<CropDemandOfferDto>> createOffer(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody CropDemandOfferRequest request) {
        CropDemandOfferDto dto = demandBoardService.createOffer(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Offer submitted to buyer", dto));
    }

    @PutMapping("/offers/{offerId}/accept")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "Buyer accepts a farmer's offer on their demand request")
    public ResponseEntity<ApiResponse<CropDemandOfferDto>> acceptOffer(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long offerId) {
        CropDemandOfferDto dto = demandBoardService.acceptOffer(userDetails.getUsername(), offerId);
        return ResponseEntity.ok(ApiResponse.ok("Farmer offer accepted", dto));
    }
}
