package com.harvesthub.service;

import com.harvesthub.dto.request.FarmProfileRequest;
import com.harvesthub.dto.request.FarmVerificationRequest;
import com.harvesthub.dto.response.FarmDto;
import com.harvesthub.entity.Farm;
import com.harvesthub.entity.User;
import com.harvesthub.entity.VerificationStatus;
import com.harvesthub.exception.ResourceNotFoundException;
import com.harvesthub.repository.FarmRepository;
import com.harvesthub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FarmService {

    private final FarmRepository farmRepository;
    private final UserRepository userRepository;

    public FarmService(FarmRepository farmRepository, UserRepository userRepository) {
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public FarmDto createOrUpdateFarm(String userEmail, FarmProfileRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Farm farm = farmRepository.findByUserId(user.getId())
                .orElse(new Farm());

        farm.setUser(user);
        farm.setFarmName(request.getFarmName());
        farm.setBio(request.getBio());
        farm.setAddress(request.getAddress());
        farm.setCity(request.getCity());
        farm.setState(request.getState());
        farm.setPostalCode(request.getPostalCode());
        farm.setLatitude(request.getLatitude());
        farm.setLongitude(request.getLongitude());
        if (request.getFarmingMethod() != null) {
            farm.setFarmingMethod(request.getFarmingMethod());
        }
        if (request.getCertificationDocUrl() != null) {
            farm.setCertificationDocUrl(request.getCertificationDocUrl());
        }

        Farm saved = farmRepository.save(farm);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public FarmDto getMyFarm(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        Farm farm = farmRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No farm profile found for user"));
        return mapToDto(farm);
    }

    @Transactional(readOnly = true)
    public FarmDto getFarmById(Long id) {
        Farm farm = farmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + id));
        return mapToDto(farm);
    }

    @Transactional
    public FarmDto verifyFarm(Long farmId, FarmVerificationRequest request) {
        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + farmId));

        farm.setVerificationStatus(request.getStatus());
        if (request.getVerificationNotes() != null) {
            farm.setVerificationNotes(request.getVerificationNotes());
        }

        Farm saved = farmRepository.save(farm);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<FarmDto> getPendingVerifications() {
        return farmRepository.findByVerificationStatus(VerificationStatus.PENDING)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FarmDto> getAllFarms() {
        return farmRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public FarmDto mapToDto(Farm farm) {
        FarmDto dto = new FarmDto();
        dto.setId(farm.getId());
        dto.setUserId(farm.getUser() != null ? farm.getUser().getId() : null);
        dto.setFarmerName(farm.getUser() != null ? farm.getUser().getFullName() : "Verified Producer");
        dto.setFarmName(farm.getFarmName());
        dto.setBio(farm.getBio());
        dto.setAddress(farm.getAddress());
        dto.setCity(farm.getCity());
        dto.setState(farm.getState());
        dto.setPostalCode(farm.getPostalCode());
        dto.setLatitude(farm.getLatitude());
        dto.setLongitude(farm.getLongitude());
        dto.setFarmingMethod(farm.getFarmingMethod());
        dto.setVerificationStatus(farm.getVerificationStatus());
        dto.setVerificationNotes(farm.getVerificationNotes());
        dto.setCertificationDocUrl(farm.getCertificationDocUrl());
        dto.setCreatedAt(farm.getCreatedAt());
        return dto;
    }
}
