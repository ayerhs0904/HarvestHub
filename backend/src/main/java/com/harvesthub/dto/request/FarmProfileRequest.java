package com.harvesthub.dto.request;

import com.harvesthub.entity.FarmingMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FarmProfileRequest {
    @NotBlank
    private String farmName;

    private String bio;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private Double latitude;
    private Double longitude;

    @NotNull
    private FarmingMethod farmingMethod = FarmingMethod.ORGANIC;

    private String certificationDocUrl;

    public FarmProfileRequest() {}

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

    public String getCertificationDocUrl() { return certificationDocUrl; }
    public void setCertificationDocUrl(String certificationDocUrl) { this.certificationDocUrl = certificationDocUrl; }
}
