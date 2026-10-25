package com.harvesthub.controller;

import com.harvesthub.dto.request.GroupBuyPledgeRequest;
import com.harvesthub.dto.request.GroupBuyRequest;
import com.harvesthub.dto.response.ApiResponse;
import com.harvesthub.dto.response.CommunityGroupBuyDto;
import com.harvesthub.service.GroupBuyService;
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
@RequestMapping("/api/v1/group-buys")
@Tag(name = "Community Group Buying", description = "Endpoints for crowdsourced bulk produce purchases unlocking wholesale tier pricing")
public class GroupBuyController {

    private final GroupBuyService groupBuyService;

    public GroupBuyController(GroupBuyService groupBuyService) {
        this.groupBuyService = groupBuyService;
    }

    @GetMapping
    @Operation(summary = "Get list of active community group buy campaigns")
    public ResponseEntity<ApiResponse<List<CommunityGroupBuyDto>>> getActiveGroupBuys() {
        List<CommunityGroupBuyDto> list = groupBuyService.getActiveGroupBuys();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "Buyer launches a new community group buy pool for a produce item")
    public ResponseEntity<ApiResponse<CommunityGroupBuyDto>> createGroupBuy(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody GroupBuyRequest request) {
        CommunityGroupBuyDto dto = groupBuyService.createGroupBuy(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Group buy pool launched successfully", dto));
    }

    @PostMapping("/{id}/join")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "Buyer pledges a quantity to an existing group buy pool")
    public ResponseEntity<ApiResponse<CommunityGroupBuyDto>> joinGroupBuy(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody GroupBuyPledgeRequest request) {
        CommunityGroupBuyDto dto = groupBuyService.joinGroupBuy(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Successfully pledged to group buy pool", dto));
    }
}
