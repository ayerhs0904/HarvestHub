package com.harvesthub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "community_group_buys")
public class CommunityGroupBuy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produce_listing_id", nullable = false)
    private ProduceListing produceListing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal targetQuantity;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal currentQuantity = BigDecimal.ZERO;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal minPledgePerBuyer = BigDecimal.ONE;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal regularPrice;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountedPrice;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime deadline;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GroupBuyStatus status = GroupBuyStatus.OPEN;

    private String pickupLocation;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "groupBuy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupBuyParticipant> participants = new ArrayList<>();

    public CommunityGroupBuy() {}

    public CommunityGroupBuy(ProduceListing produceListing, User organizer, BigDecimal targetQuantity,
                             BigDecimal minPledgePerBuyer, BigDecimal regularPrice, BigDecimal discountedPrice,
                             LocalDateTime deadline, String pickupLocation) {
        this.produceListing = produceListing;
        this.organizer = organizer;
        this.targetQuantity = targetQuantity;
        this.currentQuantity = BigDecimal.ZERO;
        this.minPledgePerBuyer = minPledgePerBuyer != null ? minPledgePerBuyer : BigDecimal.ONE;
        this.regularPrice = regularPrice;
        this.discountedPrice = discountedPrice;
        this.deadline = deadline;
        this.pickupLocation = pickupLocation;
        this.status = GroupBuyStatus.OPEN;
        this.createdAt = LocalDateTime.now();
    }

    public void addParticipant(GroupBuyParticipant participant) {
        participants.add(participant);
        participant.setGroupBuy(this);
        this.currentQuantity = this.currentQuantity.add(participant.getPledgedQuantity());
        if (this.currentQuantity.compareTo(this.targetQuantity) >= 0) {
            this.status = GroupBuyStatus.TARGET_MET;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProduceListing getProduceListing() { return produceListing; }
    public void setProduceListing(ProduceListing produceListing) { this.produceListing = produceListing; }

    public User getOrganizer() { return organizer; }
    public void setOrganizer(User organizer) { this.organizer = organizer; }

    public BigDecimal getTargetQuantity() { return targetQuantity; }
    public void setTargetQuantity(BigDecimal targetQuantity) { this.targetQuantity = targetQuantity; }

    public BigDecimal getCurrentQuantity() { return currentQuantity; }
    public void setCurrentQuantity(BigDecimal currentQuantity) { this.currentQuantity = currentQuantity; }

    public BigDecimal getMinPledgePerBuyer() { return minPledgePerBuyer; }
    public void setMinPledgePerBuyer(BigDecimal minPledgePerBuyer) { this.minPledgePerBuyer = minPledgePerBuyer; }

    public BigDecimal getRegularPrice() { return regularPrice; }
    public void setRegularPrice(BigDecimal regularPrice) { this.regularPrice = regularPrice; }

    public BigDecimal getDiscountedPrice() { return discountedPrice; }
    public void setDiscountedPrice(BigDecimal discountedPrice) { this.discountedPrice = discountedPrice; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public GroupBuyStatus getStatus() { return status; }
    public void setStatus(GroupBuyStatus status) { this.status = status; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<GroupBuyParticipant> getParticipants() { return participants; }
    public void setParticipants(List<GroupBuyParticipant> participants) { this.participants = participants; }
}
