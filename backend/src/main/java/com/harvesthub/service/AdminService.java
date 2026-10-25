package com.harvesthub.service;

import com.harvesthub.dto.request.FarmVerificationRequest;
import com.harvesthub.dto.response.AdminStatsDto;
import com.harvesthub.dto.response.FarmDto;
import com.harvesthub.entity.Notification;
import com.harvesthub.entity.VerificationStatus;
import com.harvesthub.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final FarmRepository farmRepository;
    private final ProduceListingRepository produceListingRepository;
    private final OrderRepository orderRepository;
    private final CommunityGroupBuyRepository communityGroupBuyRepository;
    private final SurplusDealRepository surplusDealRepository;
    private final FarmService farmService;
    private final NotificationRepository notificationRepository;

    public AdminService(UserRepository userRepository,
                        FarmRepository farmRepository,
                        ProduceListingRepository produceListingRepository,
                        OrderRepository orderRepository,
                        CommunityGroupBuyRepository communityGroupBuyRepository,
                        SurplusDealRepository surplusDealRepository,
                        FarmService farmService,
                        NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.farmRepository = farmRepository;
        this.produceListingRepository = produceListingRepository;
        this.orderRepository = orderRepository;
        this.communityGroupBuyRepository = communityGroupBuyRepository;
        this.surplusDealRepository = surplusDealRepository;
        this.farmService = farmService;
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public AdminStatsDto getPlatformStats() {
        AdminStatsDto stats = new AdminStatsDto();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalFarms(farmRepository.count());
        stats.setVerifiedFarms(farmRepository.findByVerificationStatus(VerificationStatus.VERIFIED).size());
        stats.setPendingVerifications(farmRepository.findByVerificationStatus(VerificationStatus.PENDING).size());
        stats.setTotalListings(produceListingRepository.count());
        stats.setTotalOrders(orderRepository.count());
        stats.setGrossMerchandiseValue(orderRepository.calculateGrossMerchandiseValue());

        BigDecimal rescuedKgOrders = orderRepository.calculateTotalRescuedKg();
        BigDecimal rescuedKgDeals = surplusDealRepository.calculateRescuedProduceKg();
        stats.setRescuedProduceKg(rescuedKgOrders.max(rescuedKgDeals));

        stats.setActiveGroupBuys(communityGroupBuyRepository.count());
        return stats;
    }

    @Transactional(readOnly = true)
    public List<FarmDto> getPendingVerifications() {
        return farmService.getPendingVerifications();
    }

    @Transactional
    public FarmDto verifyFarm(Long farmId, FarmVerificationRequest request) {
        FarmDto updated = farmService.verifyFarm(farmId, request);

        // Send notification to the farmer
        userRepository.findById(updated.getUserId()).ifPresent(farmerUser -> {
            String title = request.getStatus() == VerificationStatus.VERIFIED ?
                    "Farm Verification Approved!" : "Farm Verification Update";
            String msg = request.getStatus() == VerificationStatus.VERIFIED ?
                    "Congratulations! Your farm profile has been officially verified by administrators. Your produce listings now carry the Verified Producer badge." :
                    "Your farm profile verification status has been updated. Notes: " + request.getVerificationNotes();
            notificationRepository.save(new Notification(farmerUser, title, msg, "ADMIN_VERIFICATION", "/farmer/dashboard"));
        });

        return updated;
    }
}
