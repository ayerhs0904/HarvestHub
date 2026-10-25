package com.harvesthub.dto.response;

import com.harvesthub.entity.FarmingMethod;
import com.harvesthub.entity.VerificationStatus;
import java.time.LocalDateTime;

public class FarmDto {
    private Long id;
    private Long userId;
    private String farmerName;
    private String farmName;
    private String bio;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private Double latitude;
    private Double longitude;
    private FarmingMethod farmingMethod;
    private VerificationStatus verificationStatus;
    private String verificationNotes;
    private String certificationDocUrl;
    private LocalDateTime createdAt;

    public FarmDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }

    public String getFarmName() { return farmName; }
    public void setFarmName(String farmName) { this.farmName = farmName; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public FarmingMethod getFarmingMethod() { return farmingMethod; }
    public void setFarmingMethod(FarmingMethod farmingMethod) { this.farmingMethod = farmingMethod; }

    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getVerificationNotes() { return verificationNotes; }
    public void setVerificationNotes(String verificationNotes) { this.verificationNotes = verificationNotes; }

    public String getCertificationDocUrl() { return certificationDocUrl; }
    public void setCertificationDocUrl(String certificationDocUrl) { this.certificationDocUrl = certificationDocUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
