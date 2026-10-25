package com.harvesthub.config;

import com.harvesthub.entity.*;
import com.harvesthub.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FarmRepository farmRepository;
    private final CategoryRepository categoryRepository;
    private final ProduceListingRepository produceListingRepository;
    private final HarvestBatchRepository harvestBatchRepository;
    private final TraceabilityEventRepository traceabilityEventRepository;
    private final SurplusDealRepository surplusDealRepository;
    private final HarvestReservationRepository harvestReservationRepository;
    private final DeliverySlotRepository deliverySlotRepository;
    private final CommunityGroupBuyRepository communityGroupBuyRepository;
    private final GroupBuyParticipantRepository groupBuyParticipantRepository;
    private final CropDemandRequestRepository demandRequestRepository;
    private final CropDemandOfferRepository demandOfferRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ReviewRepository reviewRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      FarmRepository farmRepository,
                      CategoryRepository categoryRepository,
                      ProduceListingRepository produceListingRepository,
                      HarvestBatchRepository harvestBatchRepository,
                      TraceabilityEventRepository traceabilityEventRepository,
                      SurplusDealRepository surplusDealRepository,
                      HarvestReservationRepository harvestReservationRepository,
                      DeliverySlotRepository deliverySlotRepository,
                      CommunityGroupBuyRepository communityGroupBuyRepository,
                      GroupBuyParticipantRepository groupBuyParticipantRepository,
                      CropDemandRequestRepository demandRequestRepository,
                      CropDemandOfferRepository demandOfferRepository,
                      OrderRepository orderRepository,
                      OrderItemRepository orderItemRepository,
                      ReviewRepository reviewRepository,
                      NotificationRepository notificationRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.farmRepository = farmRepository;
        this.categoryRepository = categoryRepository;
        this.produceListingRepository = produceListingRepository;
        this.harvestBatchRepository = harvestBatchRepository;
        this.traceabilityEventRepository = traceabilityEventRepository;
        this.surplusDealRepository = surplusDealRepository;
        this.harvestReservationRepository = harvestReservationRepository;
        this.deliverySlotRepository = deliverySlotRepository;
        this.communityGroupBuyRepository = communityGroupBuyRepository;
        this.groupBuyParticipantRepository = groupBuyParticipantRepository;
        this.demandRequestRepository = demandRequestRepository;
        this.demandOfferRepository = demandOfferRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.reviewRepository = reviewRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        System.out.println("🌱 Seeding Harvest Hub agricultural marketplace demo data...");

        // 1. Users
        String defaultPw = passwordEncoder.encode("password123");

        User admin = new User("admin@harvesthub.farm", defaultPw, "Platform Admin (Auditor)", "+1 555-0100", Role.ROLE_ADMIN);
        User farmerGreen = new User("farmer.green@harvesthub.farm", defaultPw, "Rajesh Patel", "+1 555-0101", Role.ROLE_FARMER);
        User farmerSunshine = new User("farmer.sunshine@harvesthub.farm", defaultPw, "Anita Sharma", "+1 555-0102", Role.ROLE_FARMER);
        User buyerShreya = new User("buyer.shreya@harvesthub.farm", defaultPw, "Shreya Sen", "+1 555-0103", Role.ROLE_BUYER);
        User chefArjun = new User("chef.arjun@harvesthub.farm", defaultPw, "Chef Arjun (Artisan Bistro)", "+1 555-0104", Role.ROLE_BUYER);

        buyerShreya.setAddress("42 Elmwood Grove, Greenfield District");
        chefArjun.setAddress("Artisan Bistro, 12 Culinary Avenue");

        userRepository.save(admin);
        userRepository.save(farmerGreen);
        userRepository.save(farmerSunshine);
        userRepository.save(buyerShreya);
        userRepository.save(chefArjun);

        // 2. Farms
        Farm farm1 = new Farm(
                farmerGreen,
                "Green Valley Organic Estate",
                "Certified organic farm dedicated to heirloom vegetables and sustainable soil enrichment without chemical pesticides.",
                "Plot 14, Cauvery Basin Road",
                "Bangalore Rural",
                "Karnataka",
                FarmingMethod.ORGANIC
        );
        farm1.setPostalCode("562110");
        farm1.setLatitude(12.9716);
        farm1.setLongitude(77.5946);
        farm1.setVerificationStatus(VerificationStatus.VERIFIED);
        farm1.setVerificationNotes("Inspected by Agriculture Board; organic soil certification verified.");
        farm1.setCertificationDocUrl("https://images.unsplash.com/photo-1542838132-92c53300491e");
        farmRepository.save(farm1);

        Farm farm2 = new Farm(
                farmerSunshine,
                "Sunshine Regenerative Orchards",
                "Multi-generational orchard practicing zero-budget natural farming, rainwater harvesting, and bee conservation.",
                "Orchard Ridge, Godavari Valley",
                "Nashik",
                "Maharashtra",
                FarmingMethod.REGENERATIVE
        );
        farm2.setPostalCode("422003");
        farm2.setLatitude(19.9975);
        farm2.setLongitude(73.7898);
        farm2.setVerificationStatus(VerificationStatus.VERIFIED);
        farm2.setVerificationNotes("Regenerative farming certification audited & verified.");
        farm2.setCertificationDocUrl("https://images.unsplash.com/photo-1500937386664-56d1dfef3854");
        farmRepository.save(farm2);

        // 3. Categories
        Category catVeg = new Category("Crisp Vegetables", "vegetables", "Locally grown greens, root vegetables, and vine-ripened goods.", "Carrot");
        Category catFruit = new Category("Orchard Fresh Fruits", "fruits", "Tree-ripened seasonal fruits with uncompromised flavor.", "Apple");
        Category catHerbs = new Category("Herbs & Microgreens", "herbs", "Aromatic culinary herbs and nutrient-dense microgreens.", "Leaf");
        Category catDairy = new Category("Farm Dairy & Pure Honey", "dairy", "Direct from free-range cattle and ethical forest beekeepers.", "Milk");
        Category catGrains = new Category("Heritage Grains & Pulses", "grains", "Traditional unpolished grains and pulses preserved across generations.", "Wheat");

        categoryRepository.save(catVeg);
        categoryRepository.save(catFruit);
        categoryRepository.save(catHerbs);
        categoryRepository.save(catDairy);
        categoryRepository.save(catGrains);

        // 4. Produce Listings
        ProduceListing prod1 = new ProduceListing(
                farm1, catVeg,
                "Heirloom San Marzano Vine Tomatoes",
                "Sun-ripened, dense flesh with low acidity. Perfect for fresh caprese salads or slow-simmered sauces.",
                "San Marzano Heirloom",
                ListingUnit.KG,
                new BigDecimal("2.80"),
                "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop",
                7
        );
        produceListingRepository.save(prod1);

        ProduceListing prod2 = new ProduceListing(
                farm1, catVeg,
                "Hydroponic English Telegraph Cucumbers",
                "Thin-skinned, seedless, exceptionally crisp cucumbers grown in pure nutrient-rich spring water.",
                "English Telegraph",
                ListingUnit.KG,
                new BigDecimal("1.60"),
                "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=800&auto=format&fit=crop",
                8
        );
        produceListingRepository.save(prod2);

        ProduceListing prod3 = new ProduceListing(
                farm2, catFruit,
                "Alphonso Sunshine Mangoes (GI Tagged)",
                "Naturally tree-ripened Alphonso mangoes celebrated for intense saffron aroma and buttery texture.",
                "Ratnagiri Alphonso",
                ListingUnit.DOZEN,
                new BigDecimal("7.50"),
                "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop",
                6
        );
        produceListingRepository.save(prod3);

        ProduceListing prod4 = new ProduceListing(
                farm1, catHerbs,
                "Genovese Sweet Basil (Potted / Fresh Cut)",
                "Hand-snipped organic basil with fragrant sweet notes. Harvested at sunrise to preserve essential oils.",
                "Genovese Gigante",
                ListingUnit.BUNCH,
                new BigDecimal("1.20"),
                "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=800&auto=format&fit=crop",
                5
        );
        produceListingRepository.save(prod4);

        ProduceListing prod5 = new ProduceListing(
                farm2, catDairy,
                "Wildflower Raw Forest Honey",
                "Cold-extracted unfiltered honey harvested from multi-floral forest hives in western ghats.",
                "Wild Western Ghats Polyfloral",
                ListingUnit.KG,
                new BigDecimal("9.20"),
                "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop",
                365
        );
        produceListingRepository.save(prod5);

        ProduceListing prod6 = new ProduceListing(
                farm2, catFruit,
                "Crisp Himalayan Fuji Apples",
                "Orchard-fresh high altitude apples with natural sweet-tart balance and crunchy texture.",
                "Red Fuji Himalayan",
                ListingUnit.KG,
                new BigDecimal("3.40"),
                "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop",
                14
        );
        produceListingRepository.save(prod6);

        // 5. Harvest Batches & Explainable Freshness
        LocalDate today = LocalDate.now();

        // Batch 1: Peak Freshness (Harvested yesterday)
        HarvestBatch batch1 = new HarvestBatch(prod1, "BATCH-2026-TOM-01", today.minusDays(1),
                new BigDecimal("200.00"), 7, BatchStatus.ACTIVE);
        batch1.setStorageCondition("Cool Cellar (14°C - 16°C)");
        harvestBatchRepository.save(batch1);

        // Batch 2: Surplus Deal Batch (Harvested 4 days ago on a 6-day window)
        HarvestBatch batch2 = new HarvestBatch(prod1, "BATCH-2026-TOM-SURPLUS", today.minusDays(4),
                new BigDecimal("120.00"), 6, BatchStatus.ACTIVE);
        batch2.setStorageCondition("Ambient Climate Controlled (18°C)");
        harvestBatchRepository.save(batch2);

        // Batch 3: Fresh Cucumbers (Harvested today)
        HarvestBatch batch3 = new HarvestBatch(prod2, "BATCH-2026-CUC-01", today,
                new BigDecimal("150.00"), 8, BatchStatus.ACTIVE);
        batch3.setStorageCondition("Refrigerated (8°C)");
        harvestBatchRepository.save(batch3);

        // Batch 4: Upcoming Mango Harvest for Pre-Harvest Reservations (Harvesting in 5 days)
        HarvestBatch batch4 = new HarvestBatch(prod3, "BATCH-2026-MGO-UPCOMING", today.plusDays(5),
                new BigDecimal("80.00"), 6, BatchStatus.UPCOMING);
        batch4.setStorageCondition("Tree ripening on branch");
        harvestBatchRepository.save(batch4);

        // Batch 5: Fresh Basil (Harvested 2 days ago)
        HarvestBatch batch5 = new HarvestBatch(prod4, "BATCH-2026-BSL-01", today.minusDays(2),
                new BigDecimal("90.00"), 5, BatchStatus.ACTIVE);
        batch5.setStorageCondition("Hydroponic Water Bath (12°C)");
        harvestBatchRepository.save(batch5);

        // Batch 6: Raw Honey
        HarvestBatch batch6 = new HarvestBatch(prod5, "BATCH-2026-HNY-01", today.minusDays(10),
                new BigDecimal("60.00"), 365, BatchStatus.ACTIVE);
        batch6.setStorageCondition("Sealed Glass Jars (Ambient)");
        harvestBatchRepository.save(batch6);

        // 6. Traceability Events (Feature A: QR Harvest-to-Home Passport)
        TraceabilityEvent ev1 = new TraceabilityEvent(
                batch1, TraceabilityStage.SEEDING, LocalDateTime.now().minusDays(85),
                "Green Valley Greenhouse #2",
                "Non-GMO certified San Marzano seeds germinated in organic coco-coir seedling trays.",
                "Rajesh Patel", true
        );
        TraceabilityEvent ev2 = new TraceabilityEvent(
                batch1, TraceabilityStage.CULTIVATION, LocalDateTime.now().minusDays(45),
                "Open Field Plot 4A",
                "Drip irrigation activated; organic vermicompost and neem oil sprayed for pest immunity.",
                "Farm Operations Team", true
        );
        TraceabilityEvent ev3 = new TraceabilityEvent(
                batch1, TraceabilityStage.HARVEST, LocalDateTime.now().minusDays(1).withHour(6).withMinute(30),
                "Open Field Plot 4A",
                "Hand-picked at peak deep red ripeness at 6:30 AM ambient temperature 18°C.",
                "Rajesh Patel", true
        );
        TraceabilityEvent ev4 = new TraceabilityEvent(
                batch1, TraceabilityStage.QUALITY_INSPECTION, LocalDateTime.now().minusDays(1).withHour(9).withMinute(0),
                "Green Valley Packhouse Inspection Bay",
                "Brix sugar level tested at 6.8°; zero cosmetic blemish; passed pesticide residue clearance.",
                "K. Raman (QC Officer)", true
        );
        TraceabilityEvent ev5 = new TraceabilityEvent(
                batch1, TraceabilityStage.PACKAGING, LocalDateTime.now().minusDays(1).withHour(11).withMinute(0),
                "Green Valley Sustainable Packing Facility",
                "Graded into breathable recycled cardboard punnets with QR batch passport affixed.",
                "Packing Team", false
        );

        traceabilityEventRepository.save(ev1);
        traceabilityEventRepository.save(ev2);
        traceabilityEventRepository.save(ev3);
        traceabilityEventRepository.save(ev4);
        traceabilityEventRepository.save(ev5);

        // 7. Surplus Food Rescue Deal (Feature C)
        SurplusDeal surplusDeal = new SurplusDeal(
                batch2,
                new BigDecimal("40.00"), // 40% discount
                new BigDecimal("1.68"),  // $1.68 down from $2.80
                new BigDecimal("65.00"), // 65 kg surplus
                LocalDateTime.now().plusDays(2).withHour(18).withMinute(0),
                "Today & Tomorrow 09:00 AM - 05:00 PM (Farm Gate / Hub #1)"
        );
        surplusDealRepository.save(surplusDeal);

        // 8. Delivery Slots (Feature G: Slot planning & capacity)
        DeliverySlot slot1 = new DeliverySlot(
                farm1, today.plusDays(1), "09:00", "12:00",
                SlotType.FARM_PICKUP, 15, BigDecimal.ZERO
        );
        DeliverySlot slot2 = new DeliverySlot(
                farm1, today.plusDays(1), "14:00", "18:00",
                SlotType.LOCAL_DELIVERY, 10, new BigDecimal("3.50")
        );
        DeliverySlot slot3 = new DeliverySlot(
                farm1, today.plusDays(2), "10:00", "13:00",
                SlotType.FARM_PICKUP, 20, BigDecimal.ZERO
        );
        deliverySlotRepository.save(slot1);
        deliverySlotRepository.save(slot2);
        deliverySlotRepository.save(slot3);

        // 9. Community Group Buying (Feature D)
        CommunityGroupBuy groupBuy = new CommunityGroupBuy(
                prod3, buyerShreya,
                new BigDecimal("30.00"), // target 30 dozen
                new BigDecimal("2.00"),  // min 2 dozen
                new BigDecimal("7.50"),  // regular
                new BigDecimal("5.60"),  // 25% discount price
                LocalDateTime.now().plusDays(4),
                "Community Center, Greenfield District"
        );
        groupBuy.addParticipant(new GroupBuyParticipant(groupBuy, buyerShreya, new BigDecimal("6.00"), new BigDecimal("5.60")));
        groupBuy.addParticipant(new GroupBuyParticipant(groupBuy, chefArjun, new BigDecimal("12.00"), new BigDecimal("5.60")));
        communityGroupBuyRepository.save(groupBuy);

        // 10. Crop Demand Board (Feature F)
        CropDemandRequest demandReq = new CropDemandRequest(
                chefArjun,
                "Organic San Marzano Tomatoes",
                catVeg,
                new BigDecimal("30.00"),
                ListingUnit.KG,
                today.plusDays(6),
                new BigDecimal("2.50"),
                "Artisan Bistro, 12 Culinary Avenue",
                "Need 30 kg uniformly sized, vine-ripened tomatoes for Italian wine pairing event this coming weekend."
        );
        demandRequestRepository.save(demandReq);

        CropDemandOffer offer1 = new CropDemandOffer(
                demandReq, farm1,
                new BigDecimal("2.40"),
                today.plusDays(5),
                "Can harvest fresh from our Greenhouse #2 on Thursday morning and deliver directly to your bistro by 2 PM."
        );
        demandOfferRepository.save(offer1);

        // 11. Initial Completed Order & Verified Review
        Order seedOrder = new Order(
                "ORD-2026-SEED-01",
                buyerShreya, farm1,
                new BigDecimal("14.00"),
                FulfillmentType.FARM_PICKUP,
                slot1,
                "Farm Gate Pickup",
                PaymentMethod.SIMULATED_ONLINE,
                PaymentStatus.PAID,
                false,
                BigDecimal.ZERO
        );
        seedOrder.setStatus(OrderStatus.DELIVERED);
        seedOrder.addItem(new OrderItem(batch1, new BigDecimal("5.00"), new BigDecimal("2.80")));
        orderRepository.save(seedOrder);

        Review review1 = new Review(
                prod1, seedOrder, buyerShreya, 5,
                "These tomatoes are sensational! You can genuinely taste the sun and fertile soil. The QR traceability passport confirmed they were harvested just yesterday morning."
        );
        reviewRepository.save(review1);

        // Initial in-app notifications
        notificationRepository.save(new Notification(
                buyerShreya,
                "Welcome to Harvest Hub!",
                "Explore local farm produce, verify harvest dates via QR traceability passports, and rescue surplus produce.",
                "GENERAL",
                "/marketplace"
        ));

        notificationRepository.save(new Notification(
                farmerGreen,
                "Account Verified",
                "Your farm Green Valley Organic Estate has been verified by the platform administrators.",
                "ADMIN_VERIFICATION",
                "/farmer/dashboard"
        ));

        System.out.println("✅ Harvest Hub demo data seeded successfully with realistic farms, listings, batches, QR passports, surplus deals, and group buys!");
    }
}
