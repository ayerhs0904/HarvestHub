package com.harvesthub.service;

import com.harvesthub.dto.request.DeliverySlotRequest;
import com.harvesthub.dto.response.DeliverySlotDto;
import com.harvesthub.entity.DeliverySlot;
import com.harvesthub.entity.Farm;
import com.harvesthub.entity.User;
import com.harvesthub.exception.ResourceNotFoundException;
import com.harvesthub.exception.UnauthorizedException;
import com.harvesthub.repository.DeliverySlotRepository;
import com.harvesthub.repository.FarmRepository;
import com.harvesthub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SlotService {

    private final DeliverySlotRepository deliverySlotRepository;
    private final FarmRepository farmRepository;
    private final UserRepository userRepository;

    public SlotService(DeliverySlotRepository deliverySlotRepository,
                       FarmRepository farmRepository,
                       UserRepository userRepository) {
        this.deliverySlotRepository = deliverySlotRepository;
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<DeliverySlotDto> getFarmSlots(Long farmId) {
        return deliverySlotRepository.findByFarmIdAndSlotDateGreaterThanEqualAndIsActiveTrueOrderBySlotDateAscStartTimeAsc(
                farmId, LocalDate.now())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public DeliverySlotDto createSlot(String farmerEmail, DeliverySlotRequest request) {
        User user = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + farmerEmail));

        Farm farm = farmRepository.findByUserId(user.getId())
                .orElseThrow(() -> new UnauthorizedException("User does not have an associated farm"));

        DeliverySlot slot = new DeliverySlot(
                farm,
                request.getSlotDate(),
                request.getStartTime(),
                request.getEndTime(),
                request.getSlotType(),
                request.getMaxCapacity(),
                request.getDeliveryFee()
        );

        DeliverySlot saved = deliverySlotRepository.save(slot);
        return mapToDto(saved);
    }

    public DeliverySlotDto mapToDto(DeliverySlot slot) {
        DeliverySlotDto dto = new DeliverySlotDto();
        dto.setId(slot.getId());
        dto.setFarmId(slot.getFarm().getId());
        dto.setSlotDate(slot.getSlotDate());
        dto.setStartTime(slot.getStartTime());
        dto.setEndTime(slot.getEndTime());
        dto.setSlotType(slot.getSlotType());
        dto.setMaxCapacity(slot.getMaxCapacity());
        dto.setBookedCapacity(slot.getBookedCapacity());
        dto.setAvailableCapacity(Math.max(0, slot.getMaxCapacity() - slot.getBookedCapacity()));
        dto.setDeliveryFee(slot.getDeliveryFee());
        dto.setIsActive(slot.getIsActive());
        return dto;
    }
}
