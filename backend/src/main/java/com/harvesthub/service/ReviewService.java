package com.harvesthub.service;

import com.harvesthub.dto.request.ReviewRequest;
import com.harvesthub.dto.response.ReviewDto;
import com.harvesthub.entity.Order;
import com.harvesthub.entity.OrderStatus;
import com.harvesthub.entity.ProduceListing;
import com.harvesthub.entity.Review;
import com.harvesthub.entity.User;
import com.harvesthub.exception.BadRequestException;
import com.harvesthub.exception.ResourceNotFoundException;
import com.harvesthub.exception.UnauthorizedException;
import com.harvesthub.repository.OrderRepository;
import com.harvesthub.repository.ProduceListingRepository;
import com.harvesthub.repository.ReviewRepository;
import com.harvesthub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final ProduceListingRepository produceListingRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         OrderRepository orderRepository,
                         ProduceListingRepository produceListingRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.produceListingRepository = produceListingRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsForListing(Long listingId) {
        return reviewRepository.findByProduceListingIdOrderByCreatedAtDesc(listingId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto submitReview(String buyerEmail, ReviewRequest request) {
        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found: " + buyerEmail));

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + request.getOrderId()));

        if (!order.getBuyer().getId().equals(buyer.getId())) {
            throw new UnauthorizedException("You are not the buyer who placed this order");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new BadRequestException("Reviews are strictly restricted to completed and delivered orders");
        }

        ProduceListing listing = produceListingRepository.findById(request.getProduceListingId())
                .orElseThrow(() -> new ResourceNotFoundException("Produce listing not found: " + request.getProduceListingId()));

        boolean itemInOrder = order.getItems().stream()
                .anyMatch(item -> item.getHarvestBatch().getProduceListing().getId().equals(listing.getId()));

        if (!itemInOrder) {
            throw new BadRequestException("Produce item was not purchased in this order");
        }

        if (reviewRepository.existsByOrderIdAndProduceListingId(order.getId(), listing.getId())) {
            throw new BadRequestException("You have already reviewed this produce item for this order");
        }

        Review review = new Review(
                listing,
                order,
                buyer,
                request.getRating(),
                request.getComment()
        );

        Review saved = reviewRepository.save(review);
        return mapToDto(saved);
    }

    public ReviewDto mapToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setProduceListingId(review.getProduceListing().getId());
        dto.setBuyerId(review.getBuyer().getId());
        dto.setBuyerName(review.getBuyer().getFullName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setVerifiedPurchase(review.getVerifiedPurchase());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
