package com.harvesthub.service;

import com.harvesthub.dto.request.CropDemandOfferRequest;
import com.harvesthub.dto.request.CropDemandRequestCreate;
import com.harvesthub.dto.response.CropDemandOfferDto;
import com.harvesthub.dto.response.CropDemandRequestDto;
import com.harvesthub.entity.*;
import com.harvesthub.exception.BadRequestException;
import com.harvesthub.exception.ResourceNotFoundException;
import com.harvesthub.exception.UnauthorizedException;
import com.harvesthub.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DemandBoardService {

    private final CropDemandRequestRepository demandRequestRepository;
    private final CropDemandOfferRepository demandOfferRepository;
    private final CategoryRepository categoryRepository;
    private final FarmRepository farmRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public DemandBoardService(CropDemandRequestRepository demandRequestRepository,
                              CropDemandOfferRepository demandOfferRepository,
                              CategoryRepository categoryRepository,
                              FarmRepository farmRepository,
                              UserRepository userRepository,
                              NotificationRepository notificationRepository) {
        this.demandRequestRepository = demandRequestRepository;
        this.demandOfferRepository = demandOfferRepository;
        this.categoryRepository = categoryRepository;
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public List<CropDemandRequestDto> getActiveDemands() {
        return demandRequestRepository.findAll().stream()
                .filter(d -> d.getStatus() == DemandStatus.OPEN || d.getStatus() == DemandStatus.OFFERS_RECEIVED)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CropDemandRequestDto createDemand(String buyerEmail, CropDemandRequestCreate request) {
        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found: " + buyerEmail));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        CropDemandRequest demand = new CropDemandRequest(
                buyer,
                request.getCropName(),
                category,
                request.getRequestedQuantity(),
                request.getUnit(),
                request.getNeededByDate(),
                request.getMaxBudgetPerUnit(),
                request.getDeliveryLocation(),
                request.getNotes()
        );

        CropDemandRequest saved = demandRequestRepository.save(demand);
        return mapToDto(saved);
    }

    @Transactional
    public CropDemandOfferDto createOffer(String farmerEmail, Long demandId, CropDemandOfferRequest request) {
        User user = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + farmerEmail));

        Farm farm = farmRepository.findByUserId(user.getId())
                .orElseThrow(() -> new UnauthorizedException("User does not have an associated farm"));

        CropDemandRequest demand = demandRequestRepository.findById(demandId)
                .orElseThrow(() -> new ResourceNotFoundException("Demand request not found: " + demandId));

        if (demand.getStatus() == DemandStatus.FULFILLED || demand.getStatus() == DemandStatus.EXPIRED) {
            throw new BadRequestException("This demand post is no longer accepting offers");
        }

        CropDemandOffer offer = new CropDemandOffer(
                demand,
                farm,
                request.getOfferedPricePerUnit(),
                request.getAvailableDate(),
                request.getNotes()
        );

        demand.setStatus(DemandStatus.OFFERS_RECEIVED);
        demandRequestRepository.save(demand);

        CropDemandOffer savedOffer = demandOfferRepository.save(offer);

        // Notify buyer of incoming proposal
        notificationRepository.save(new Notification(
                demand.getBuyer(),
                "New Farmer Quote on Demand Post",
                String.format("Farm %s offered $%.2f/%s for your '%s' request.",
                        farm.getFarmName(), offer.getOfferedPricePerUnit(), demand.getUnit(), demand.getCropName()),
                "DEMAND_OFFER",
                "/demand-board"
        ));

        return mapOfferToDto(savedOffer);
    }

    @Transactional
    public CropDemandOfferDto acceptOffer(String buyerEmail, Long offerId) {
        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found: " + buyerEmail));

        CropDemandOffer offer = demandOfferRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found: " + offerId));

        if (!offer.getDemandRequest().getBuyer().getId().equals(buyer.getId())) {
            throw new UnauthorizedException("You are not the creator of this demand request");
        }

        offer.setStatus(OfferStatus.ACCEPTED);
        offer.getDemandRequest().setStatus(DemandStatus.FULFILLED);
        demandRequestRepository.save(offer.getDemandRequest());

        CropDemandOffer updated = demandOfferRepository.save(offer);

        // Notify farmer that their proposal won!
        notificationRepository.save(new Notification(
                offer.getFarm().getUser(),
                "Your Demand Offer Was Accepted!",
                String.format("Buyer %s accepted your offer for '%s' (%.1f %s @ $%.2f/%s).",
                        buyer.getFullName(), offer.getDemandRequest().getCropName(),
                        offer.getDemandRequest().getRequestedQuantity(), offer.getDemandRequest().getUnit(),
                        offer.getOfferedPricePerUnit(), offer.getDemandRequest().getUnit()),
                "DEMAND_OFFER",
                "/farmer/dashboard"
        ));

        return mapOfferToDto(updated);
    }

    public CropDemandRequestDto mapToDto(CropDemandRequest demand) {
        CropDemandRequestDto dto = new CropDemandRequestDto();
        dto.setId(demand.getId());
        dto.setBuyerId(demand.getBuyer().getId());
        dto.setBuyerName(demand.getBuyer().getFullName());
        dto.setCropName(demand.getCropName());
        if (demand.getCategory() != null) {
            dto.setCategoryId(demand.getCategory().getId());
            dto.setCategoryName(demand.getCategory().getName());
        }
        dto.setRequestedQuantity(demand.getRequestedQuantity());
        dto.setUnit(demand.getUnit());
        dto.setNeededByDate(demand.getNeededByDate());
        dto.setMaxBudgetPerUnit(demand.getMaxBudgetPerUnit());
        dto.setDeliveryLocation(demand.getDeliveryLocation());
        dto.setNotes(demand.getNotes());
        dto.setStatus(demand.getStatus());
        dto.setCreatedAt(demand.getCreatedAt());

        List<CropDemandOfferDto> offerDtos = demandOfferRepository.findByDemandRequestId(demand.getId())
                .stream()
                .map(this::mapOfferToDto)
                .collect(Collectors.toList());
        dto.setOffers(offerDtos);

        return dto;
    }

    public CropDemandOfferDto mapOfferToDto(CropDemandOffer offer) {
        CropDemandOfferDto dto = new CropDemandOfferDto();
        dto.setId(offer.getId());
        dto.setDemandRequestId(offer.getDemandRequest().getId());
        dto.setFarmId(offer.getFarm().getId());
        dto.setFarmName(offer.getFarm().getFarmName());
        dto.setOfferedPricePerUnit(offer.getOfferedPricePerUnit());
        dto.setAvailableDate(offer.getAvailableDate());
        dto.setNotes(offer.getNotes());
        dto.setStatus(offer.getStatus());
        dto.setCreatedAt(offer.getCreatedAt());
        return dto;
    }
}
