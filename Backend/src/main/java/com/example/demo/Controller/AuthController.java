package com.example.demo.Controller;

import com.example.demo.Entity.RefreshToken;
import com.example.demo.Entity.UserEntity;
import com.example.demo.Entity.LoginRequest;
import com.example.demo.Entity.RegisterRequest;
import com.example.demo.Repos.UserRepository;
import com.example.demo.Service.JwtUtil;
import com.example.demo.Service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    
    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, 
                         PasswordEncoder passwordEncoder, JwtUtil jwtUtil, RefreshTokenService refreshTokenService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginData) {
        try {
            String loginIdentifier = loginData.getUsername();
            String password = loginData.getPassword();
            
            // Input validation
            if (loginIdentifier == null || loginIdentifier.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email/username is required");
            }
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }
            
            // Try to find user by email first, then by username
            UserEntity user = userRepository.findByEmail(loginIdentifier)
                    .orElse(userRepository.findByUsername(loginIdentifier).orElse(null));
            
            if (user == null) {
                return ResponseEntity.status(401).body("Invalid email/username or password");
            }
            
            // Check if user is banned
            if (user.isBanned()) {
                return ResponseEntity.status(403).body("Account is banned");
            }
            
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), password)
            );
            
            String accessToken = jwtUtil.generateToken(user.getUsername(), user.getRole());
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken.getToken());
            response.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "banned", user.isBanned()
            ));
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid email/username or password");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerData) {
        try {
            String username = registerData.getUsername();
            String email = registerData.getEmail();
            String password = registerData.getPassword();
            String role = registerData.getRole() != null ? registerData.getRole() : "USER";
            
            // Input validation
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (password == null || password.length() < 6) {
                return ResponseEntity.badRequest().body("Password must be at least 6 characters");
            }
            
            // Check if email already exists
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            // Use email as username if username not provided
            if (username == null || username.trim().isEmpty()) {
                username = email;
            }
            
            // Check if username already exists
            if (userRepository.existsByUsername(username)) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            
            UserEntity user = new UserEntity();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole("USER");
            user.setBanned(false);
            userRepository.save(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> refreshData) {
        String refreshTokenStr = refreshData.get("refreshToken");
        Optional<RefreshToken> refreshTokenOpt = refreshTokenService.findByToken(refreshTokenStr);
        if (refreshTokenOpt.isEmpty() || !refreshTokenService.isValid(refreshTokenOpt.get())) {
            return ResponseEntity.status(401).body("Invalid or expired refresh token");
        }
        RefreshToken oldToken = refreshTokenOpt.get();
        RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(oldToken);
        UserEntity user = oldToken.getUser();
        String newAccessToken = jwtUtil.generateToken(user.getUsername(), user.getRole());
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", newAccessToken);
        response.put("refreshToken", newRefreshToken.getToken());
        response.put("user", Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "role", user.getRole(),
            "banned", user.isBanned()
        ));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> logoutData) {
        String refreshTokenStr = logoutData.get("refreshToken");
        boolean revokeAll = Boolean.parseBoolean(logoutData.getOrDefault("revokeAll", "false"));
        if (revokeAll) {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserEntity user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
            refreshTokenService.revokeByUser(user);
        } else {
            refreshTokenService.revokeToken(refreshTokenStr);
        }
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> me() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("id", user.getId());
        response.put("banned", user.isBanned());
        return ResponseEntity.ok(response);
    }
}
