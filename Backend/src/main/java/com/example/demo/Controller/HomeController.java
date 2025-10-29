package com.example.demo.Controller;

import com.example.demo.Repos.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HomeController {

    private final UserRepository userRepository;

    public HomeController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/")
    public String home() {
        return "📚 Book & Review API is running! Use /api/books or /api/reviews";
    }

    @GetMapping("/api/test/db-status")
    public ResponseEntity<?> testDatabase() {
        try {
            long userCount = userRepository.count();
            return ResponseEntity.ok(Map.of(
                "status", "connected",
                "userCount", userCount,
                "message", "Database connection successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Database connection failed: " + e.getMessage()
            ));
        }
    }
}
