package com.harvesthub.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ReviewRequest {
    @NotNull
    private Long orderId;

    @NotNull
    private Long produceListingId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    private String comment;

    public ReviewRequest() {}

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getProduceListingId() { return produceListingId; }
    public void setProduceListingId(Long produceListingId) { this.produceListingId = produceListingId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
