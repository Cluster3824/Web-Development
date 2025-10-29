package com.example.demo.Service;

import com.example.demo.Entity.BookEntity;
import com.example.demo.Entity.ReviewEntity;
import com.example.demo.Repos.BookRespo;
import com.example.demo.Repos.ReviewRespo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {
    private final ReviewRespo reviewRespo;
    private final BookRespo bookRespo;

    public ReviewService(ReviewRespo reviewRespo, BookRespo bookRespo) {
        this.reviewRespo = reviewRespo;
        this.bookRespo = bookRespo;
    }

    @Transactional
    public ReviewEntity addReview(Long bookId, ReviewEntity review) {
        BookEntity book = bookRespo.findById(bookId)
                                   .orElseThrow(() -> new RuntimeException("Book not found"));
        review.setBook(book);
        review.setBookId(bookId);
        review.setCreatedAt(java.time.LocalDateTime.now());
        ReviewEntity saved = reviewRespo.save(review);
        // Return a clean entity without lazy-loaded relationships
        ReviewEntity cleanReview = new ReviewEntity();
        cleanReview.setId(saved.getId());
        cleanReview.setReviewText(saved.getReviewText());
        cleanReview.setRating(saved.getRating());
        cleanReview.setUserId(saved.getUserId());
        cleanReview.setCreatedAt(saved.getCreatedAt());
        cleanReview.setBookId(bookId);
        return cleanReview;
    }

    public List<ReviewEntity> getAllReviews() {
        List<ReviewEntity> reviews = reviewRespo.findAll();
        return reviews.stream().map(review -> {
            ReviewEntity cleanReview = new ReviewEntity();
            cleanReview.setId(review.getId());
            cleanReview.setReviewText(review.getReviewText());
            cleanReview.setRating(review.getRating());
            cleanReview.setUserId(review.getUserId());
            cleanReview.setCreatedAt(review.getCreatedAt());
            cleanReview.setBookId(review.getBookId());
            return cleanReview;
        }).toList();
    }

    public List<ReviewEntity> getReviewsByBook(Long bookId) {
        return reviewRespo.findByBook_Id(bookId);
    }
    
    public boolean deleteReview(Long reviewId) {
        if (reviewRespo.existsById(reviewId)) {
            reviewRespo.deleteById(reviewId);
            return true;
        }
        return false;
    }
}
    