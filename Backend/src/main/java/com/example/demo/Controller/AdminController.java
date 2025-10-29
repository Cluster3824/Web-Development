package com.example.demo.Controller;

import com.example.demo.Entity.UserEntity;
import com.example.demo.Entity.BookEntity;
import com.example.demo.Entity.ReviewEntity;
import com.example.demo.Repos.UserRepository;
import com.example.demo.Repos.BookRespo;
import com.example.demo.Repos.ReviewRespo;
import com.example.demo.Repos.RefreshTokenRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final BookRespo bookRepository;
    private final ReviewRespo reviewRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    
    public AdminController(UserRepository userRepository, BookRespo bookRepository, ReviewRespo reviewRepository, RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        try {
            List<UserEntity> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/users/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> banUser(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(user -> {
                user.setBanned(true);
                userRepository.save(user);
                return ResponseEntity.ok("User banned successfully");
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> unbanUser(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(user -> {
                user.setBanned(false);
                userRepository.save(user);
                return ResponseEntity.ok("User unbanned successfully");
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            if (userRepository.existsById(id)) {
                // Delete related records first
                reviewRepository.deleteByUserId(id);
                refreshTokenRepository.deleteByUserId(id);
                // Then delete the user
                userRepository.deleteById(id);
                return ResponseEntity.ok("User deleted successfully");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete user: " + e.getMessage());
        }
    }
    
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalBooks", bookRepository.count());
        stats.put("totalReviews", reviewRepository.count());
        stats.put("bannedUsers", userRepository.countByBannedTrue());
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/users/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserEntity>> searchUsers(@RequestParam String query) {
        List<UserEntity> users = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> roleData) {
        return userRepository.findById(id)
            .map(user -> {
                String newRole = roleData.get("role");
                if ("USER".equals(newRole) || "ADMIN".equals(newRole)) {
                    user.setRole(newRole);
                    userRepository.save(user);
                    return ResponseEntity.ok("User role updated successfully");
                }
                return ResponseEntity.badRequest().body("Invalid role");
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/users/{id}/details")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserDetails(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(user -> {
                Map<String, Object> details = new HashMap<>();
                details.put("user", user);
                details.put("reviewCount", reviewRepository.countByUserId(id));
                details.put("recentReviews", reviewRepository.findTop5ByUserIdOrderByCreatedAtDesc(id));
                return ResponseEntity.ok(details);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}