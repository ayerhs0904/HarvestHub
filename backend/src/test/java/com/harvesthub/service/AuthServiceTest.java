package com.harvesthub.service;

import com.harvesthub.dto.request.RegisterRequest;
import com.harvesthub.dto.response.AuthResponse;
import com.harvesthub.entity.Farm;
import com.harvesthub.entity.Role;
import com.harvesthub.entity.User;
import com.harvesthub.exception.BadRequestException;
import com.harvesthub.repository.FarmRepository;
import com.harvesthub.repository.UserRepository;
import com.harvesthub.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserRepository userRepository;
    @Mock
    private FarmRepository farmRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("Should auto-provision draft farm record when registering as FARMER")
    void testFarmerRegistrationProvisionsFarm() {
        RegisterRequest req = new RegisterRequest("farmer.new@harvesthub.farm", "secret123", "New Farmer", "+12345", Role.ROLE_FARMER);

        when(userRepository.existsByEmail("farmer.new@harvesthub.farm")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encodedSecret");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(50L);
            return u;
        });
        when(farmRepository.save(any(Farm.class))).thenAnswer(inv -> {
            Farm f = inv.getArgument(0);
            f.setId(105L);
            return f;
        });
        when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(mock(Authentication.class));
        when(tokenProvider.generateToken(any())).thenReturn("mock.jwt.token");

        AuthResponse resp = authService.register(req);

        assertNotNull(resp);
        assertEquals(Role.ROLE_FARMER, resp.getRole());
        assertEquals(105L, resp.getFarmId());
        assertEquals("mock.jwt.token", resp.getToken());
        verify(farmRepository, times(1)).save(any(Farm.class));
    }

    @Test
    @DisplayName("Should reject duplicate email registration with BadRequestException")
    void testDuplicateEmailRejected() {
        RegisterRequest req = new RegisterRequest("existing@harvesthub.farm", "secret123", "User", "+123", Role.ROLE_BUYER);
        when(userRepository.existsByEmail("existing@harvesthub.farm")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any(User.class));
    }
}
