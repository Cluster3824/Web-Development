package com.example.demo.Controller;

import com.example.demo.Entity.ReviewEntity;
import com.example.demo.Entity.UserEntity;
import com.example.demo.Service.ReviewService;
import com.example.demo.Repos.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;
    private final UserRepository userRepository;

    public ReviewController(ReviewService reviewService, UserRepository userRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addReview(@RequestBody ReviewEntity review) {
        try {
            // Validate required fields
            if (review.getBookId() == null || review.getRating() < 1 || review.getRating() > 5) {
                return ResponseEntity.badRequest().body("Invalid review data");
            }
            
            // Get authenticated user
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserEntity user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Check if user is banned
            if (user.isBanned()) {
                return ResponseEntity.status(403).body("Account is banned");
            }
            
            review.setUserId(user.getId());
            ReviewEntity savedReview = reviewService.addReview(review.getBookId(), review);
            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to create review: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllReviews() {
        try {
            List<ReviewEntity> reviews = reviewService.getAllReviews();
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch reviews: " + e.getMessage());
        }
    }

    @GetMapping("/book/{bookId}")
    public List<ReviewEntity> getReviewsByBook(@PathVariable Long bookId) {
        return reviewService.getReviewsByBook(bookId);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        if (reviewService.deleteReview(id)) {
            return ResponseEntity.ok("Review deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
