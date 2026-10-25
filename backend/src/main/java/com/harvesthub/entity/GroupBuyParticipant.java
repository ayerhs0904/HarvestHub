package com.harvesthub.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "group_buy_participants")
public class GroupBuyParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_buy_id", nullable = false)
    @JsonIgnore
    private CommunityGroupBuy groupBuy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pledgedQuantity;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pledgedAmount;

    @Column(nullable = false)
    private String paymentStatus = "PLEDGED";

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    public GroupBuyParticipant() {}

    public GroupBuyParticipant(CommunityGroupBuy groupBuy, User buyer, BigDecimal pledgedQuantity, BigDecimal unitPrice) {
        this.groupBuy = groupBuy;
        this.buyer = buyer;
        this.pledgedQuantity = pledgedQuantity;
        this.pledgedAmount = unitPrice.multiply(pledgedQuantity);
        this.paymentStatus = "PLEDGED";
        this.joinedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CommunityGroupBuy getGroupBuy() { return groupBuy; }
    public void setGroupBuy(CommunityGroupBuy groupBuy) { this.groupBuy = groupBuy; }

    public User getBuyer() { return buyer; }
    public void setBuyer(User buyer) { this.buyer = buyer; }

    public BigDecimal getPledgedQuantity() { return pledgedQuantity; }
    public void setPledgedQuantity(BigDecimal pledgedQuantity) { this.pledgedQuantity = pledgedQuantity; }

    public BigDecimal getPledgedAmount() { return pledgedAmount; }
    public void setPledgedAmount(BigDecimal pledgedAmount) { this.pledgedAmount = pledgedAmount; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
