package com.harvesthub.controller;

import com.harvesthub.dto.request.ReviewRequest;
import com.harvesthub.dto.response.ApiResponse;
import com.harvesthub.dto.response.ReviewDto;
import com.harvesthub.service.ReviewService;
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
@RequestMapping("/api/v1/reviews")
@Tag(name = "Reviews & Ratings", description = "Endpoints for verified buyer produce feedback and ratings")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/produce/{produceId}")
    @Operation(summary = "Get all customer reviews for a produce listing")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getReviewsForListing(@PathVariable Long produceId) {
        List<ReviewDto> list = reviewService.getReviewsForListing(produceId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "Submit product rating and review (restricted to verified buyers with completed orders)")
    public ResponseEntity<ApiResponse<ReviewDto>> submitReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReviewRequest request) {
        ReviewDto dto = reviewService.submitReview(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Review submitted with verified purchase badge", dto));
    }
}
