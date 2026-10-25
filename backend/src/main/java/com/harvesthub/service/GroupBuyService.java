package com.harvesthub.service;

import com.harvesthub.dto.request.GroupBuyPledgeRequest;
import com.harvesthub.dto.request.GroupBuyRequest;
import com.harvesthub.dto.response.CommunityGroupBuyDto;
import com.harvesthub.entity.CommunityGroupBuy;
import com.harvesthub.entity.GroupBuyParticipant;
import com.harvesthub.entity.GroupBuyStatus;
import com.harvesthub.entity.ProduceListing;
import com.harvesthub.entity.User;
import com.harvesthub.exception.BadRequestException;
import com.harvesthub.exception.ResourceNotFoundException;
import com.harvesthub.repository.CommunityGroupBuyRepository;
import com.harvesthub.repository.GroupBuyParticipantRepository;
import com.harvesthub.repository.ProduceListingRepository;
import com.harvesthub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupBuyService {

    private final CommunityGroupBuyRepository communityGroupBuyRepository;
    private final GroupBuyParticipantRepository groupBuyParticipantRepository;
    private final ProduceListingRepository produceListingRepository;
    private final UserRepository userRepository;

    public GroupBuyService(CommunityGroupBuyRepository communityGroupBuyRepository,
                           GroupBuyParticipantRepository groupBuyParticipantRepository,
                           ProduceListingRepository produceListingRepository,
                           UserRepository userRepository) {
        this.communityGroupBuyRepository = communityGroupBuyRepository;
        this.groupBuyParticipantRepository = groupBuyParticipantRepository;
        this.produceListingRepository = produceListingRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CommunityGroupBuyDto> getActiveGroupBuys() {
        return communityGroupBuyRepository.findByStatusAndDeadlineAfter(GroupBuyStatus.OPEN, LocalDateTime.now())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommunityGroupBuyDto createGroupBuy(String userEmail, GroupBuyRequest request) {
        User organizer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        ProduceListing listing = produceListingRepository.findById(request.getProduceListingId())
                .orElseThrow(() -> new ResourceNotFoundException("Produce listing not found: " + request.getProduceListingId()));

        CommunityGroupBuy groupBuy = new CommunityGroupBuy(
                listing,
                organizer,
                request.getTargetQuantity(),
                request.getMinPledgePerBuyer(),
                request.getRegularPrice(),
                request.getDiscountedPrice(),
                request.getDeadline(),
                request.getPickupLocation()
        );

        CommunityGroupBuy saved = communityGroupBuyRepository.save(groupBuy);
        return mapToDto(saved);
    }

    @Transactional
    public CommunityGroupBuyDto joinGroupBuy(String userEmail, Long groupBuyId, GroupBuyPledgeRequest request) {
        User buyer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found: " + userEmail));

        CommunityGroupBuy groupBuy = communityGroupBuyRepository.findById(groupBuyId)
                .orElseThrow(() -> new ResourceNotFoundException("Group buy campaign not found: " + groupBuyId));

        if (groupBuy.getStatus() != GroupBuyStatus.OPEN) {
            throw new BadRequestException("Group buy campaign is not currently open for pledges");
        }

        if (request.getPledgedQuantity().compareTo(groupBuy.getMinPledgePerBuyer()) < 0) {
            throw new BadRequestException("Pledged quantity must meet or exceed minimum pledge: " + groupBuy.getMinPledgePerBuyer());
        }

        GroupBuyParticipant participant = new GroupBuyParticipant(
                groupBuy,
                buyer,
                request.getPledgedQuantity(),
                groupBuy.getDiscountedPrice()
        );

        groupBuy.addParticipant(participant);
        communityGroupBuyRepository.save(groupBuy);

        return mapToDto(groupBuy);
    }

    public CommunityGroupBuyDto mapToDto(CommunityGroupBuy groupBuy) {
        CommunityGroupBuyDto dto = new CommunityGroupBuyDto();
        dto.setId(groupBuy.getId());
        dto.setProduceListingId(groupBuy.getProduceListing().getId());
        dto.setProduceTitle(groupBuy.getProduceListing().getTitle());
        dto.setCropVariety(groupBuy.getProduceListing().getCropVariety());
        dto.setImageUrl(groupBuy.getProduceListing().getImageUrl());
        dto.setUnit(groupBuy.getProduceListing().getUnit());
        dto.setOrganizerName(groupBuy.getOrganizer().getFullName());
        dto.setTargetQuantity(groupBuy.getTargetQuantity());
        dto.setCurrentQuantity(groupBuy.getCurrentQuantity());

        int pct = 0;
        if (groupBuy.getTargetQuantity().compareTo(BigDecimal.ZERO) > 0) {
            pct = groupBuy.getCurrentQuantity().multiply(BigDecimal.valueOf(100))
                    .divide(groupBuy.getTargetQuantity(), 0, java.math.RoundingMode.HALF_UP).intValue();
        }
        dto.setProgressPercentage(Math.min(100, pct));
        dto.setMinPledgePerBuyer(groupBuy.getMinPledgePerBuyer());
        dto.setRegularPrice(groupBuy.getRegularPrice());
        dto.setDiscountedPrice(groupBuy.getDiscountedPrice());
        dto.setDeadline(groupBuy.getDeadline());
        dto.setStatus(groupBuy.getStatus());
        dto.setPickupLocation(groupBuy.getPickupLocation());
        dto.setParticipantCount(groupBuy.getParticipants().size());
        return dto;
    }
}
