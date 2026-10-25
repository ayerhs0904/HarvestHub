package com.harvesthub.dto.response;

import com.harvesthub.entity.FarmingMethod;
import com.harvesthub.entity.VerificationStatus;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class TraceabilityPassportDto {
    private String batchNumber;
    private String cropVariety;
    private String produceTitle;
    private String produceImageUrl;
    private Long farmId;
    private String farmName;
    private String farmLocation;
    private String farmCity;
    private FarmingMethod farmingMethod;
    private VerificationStatus farmVerificationStatus;
    private LocalDate harvestDate;
    private String storageCondition;

    // Freshness data
    private int freshnessPercentage;
    private String freshnessLabel;
    private String freshnessExplanation;

    private String qrCodeContent;
    private int adminVerifiedStepsCount;
    private int farmerLoggedStepsCount;

    private List<TraceabilityEventDto> events = new ArrayList<>();

    public TraceabilityPassportDto() {}

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public String getCropVariety() { return cropVariety; }
    public void setCropVariety(String cropVariety) { this.cropVariety = cropVariety; }

    public String getProduceTitle() { return produceTitle; }
    public void setProduceTitle(String produceTitle) { this.produceTitle = produceTitle; }

    public String getProduceImageUrl() { return produceImageUrl; }
    public void setProduceImageUrl(String produceImageUrl) { this.produceImageUrl = produceImageUrl; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public String getFarmName() { return farmName; }
    public void setFarmName(String farmName) { this.farmName = farmName; }

    public String getFarmLocation() { return farmLocation; }
    public void setFarmLocation(String farmLocation) { this.farmLocation = farmLocation; }

    public String getFarmCity() { return farmCity; }
    public void setFarmCity(String farmCity) { this.farmCity = farmCity; }

    public FarmingMethod getFarmingMethod() { return farmingMethod; }
    public void setFarmingMethod(FarmingMethod farmingMethod) { this.farmingMethod = farmingMethod; }

    public VerificationStatus getFarmVerificationStatus() { return farmVerificationStatus; }
    public void setFarmVerificationStatus(VerificationStatus farmVerificationStatus) { this.farmVerificationStatus = farmVerificationStatus; }

    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }

    public String getStorageCondition() { return storageCondition; }
    public void setStorageCondition(String storageCondition) { this.storageCondition = storageCondition; }

    public int getFreshnessPercentage() { return freshnessPercentage; }
    public void setFreshnessPercentage(int freshnessPercentage) { this.freshnessPercentage = freshnessPercentage; }

    public String getFreshnessLabel() { return freshnessLabel; }
    public void setFreshnessLabel(String freshnessLabel) { this.freshnessLabel = freshnessLabel; }

    public String getFreshnessExplanation() { return freshnessExplanation; }
    public void setFreshnessExplanation(String freshnessExplanation) { this.freshnessExplanation = freshnessExplanation; }

    public String getQrCodeContent() { return qrCodeContent; }
    public void setQrCodeContent(String qrCodeContent) { this.qrCodeContent = qrCodeContent; }

    public int getAdminVerifiedStepsCount() { return adminVerifiedStepsCount; }
    public void setAdminVerifiedStepsCount(int adminVerifiedStepsCount) { this.adminVerifiedStepsCount = adminVerifiedStepsCount; }

    public int getFarmerLoggedStepsCount() { return farmerLoggedStepsCount; }
    public void setFarmerLoggedStepsCount(int farmerLoggedStepsCount) { this.farmerLoggedStepsCount = farmerLoggedStepsCount; }

    public List<TraceabilityEventDto> getEvents() { return events; }
    public void setEvents(List<TraceabilityEventDto> events) { this.events = events; }
}
