package com.harvesthub.service;

import com.harvesthub.dto.request.LoginRequest;
import com.harvesthub.dto.request.RegisterRequest;
import com.harvesthub.dto.response.AuthResponse;
import com.harvesthub.dto.response.UserProfileResponse;
import com.harvesthub.entity.Farm;
import com.harvesthub.entity.Role;
import com.harvesthub.entity.User;
import com.harvesthub.exception.BadRequestException;
import com.harvesthub.exception.ResourceNotFoundException;
import com.harvesthub.repository.FarmRepository;
import com.harvesthub.repository.UserRepository;
import com.harvesthub.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final FarmRepository farmRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       FarmRepository farmRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.farmRepository = farmRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already in use: " + request.getEmail());
        }

        User user = new User(
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getPhone(),
                request.getRole()
        );
        user.setAddress(request.getAddress());
        User savedUser = userRepository.save(user);

        // If registering as a farmer, create an initial draft farm record
        Long farmId = null;
        if (savedUser.getRole() == Role.ROLE_FARMER) {
            Farm initialFarm = new Farm(
                    savedUser,
                    savedUser.getFullName() + "'s Farm",
                    "Dedicated to sustainable, farm-fresh produce.",
                    savedUser.getAddress() != null ? savedUser.getAddress() : "Local Farmland",
                    "Regional",
                    "State",
                    com.harvesthub.entity.FarmingMethod.ORGANIC
            );
            Farm savedFarm = farmRepository.save(initialFarm);
            farmId = savedFarm.getId();
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole(), farmId);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Long farmId = null;
        if (user.getRole() == Role.ROLE_FARMER) {
            farmId = farmRepository.findByUserId(user.getId()).map(Farm::getId).orElse(null);
        }

        return new AuthResponse(jwt, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), farmId);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Long farmId = null;
        if (user.getRole() == Role.ROLE_FARMER) {
            farmId = farmRepository.findByUserId(user.getId()).map(Farm::getId).orElse(null);
        }

        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getAddress(),
                user.getRole(),
                farmId,
                user.getCreatedAt()
        );
    }

    @Transactional
    public UserProfileResponse updateProfile(String email, UserProfileResponse updateRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (updateRequest.getFullName() != null) user.setFullName(updateRequest.getFullName());
        if (updateRequest.getPhone() != null) user.setPhone(updateRequest.getPhone());
        if (updateRequest.getAddress() != null) user.setAddress(updateRequest.getAddress());

        User saved = userRepository.save(user);

        Long farmId = null;
        if (saved.getRole() == Role.ROLE_FARMER) {
            farmId = farmRepository.findByUserId(saved.getId()).map(Farm::getId).orElse(null);
        }

        return new UserProfileResponse(
                saved.getId(),
                saved.getEmail(),
                saved.getFullName(),
                saved.getPhone(),
                saved.getAddress(),
                saved.getRole(),
                farmId,
                saved.getCreatedAt()
        );
    }
}
