package com.example.demo.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "reviews")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reviewText;
    private int rating;
    private Long userId;
    private java.time.LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private BookEntity book;

    @Column(name = "book_id", insertable = false, updatable = false)
    private Long bookId;

    @PostLoad
    @PostPersist
    @PostUpdate
    private void setBookIdFromBook() {
        if (this.book != null) {
            this.bookId = this.book.getId();
        }
    }
    
    @PrePersist
    private void setCreatedAt() {
        if (this.createdAt == null) {
            this.createdAt = java.time.LocalDateTime.now();
        }
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReviewText() { return reviewText; }
    public void setReviewText(String reviewText) { this.reviewText = reviewText; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public BookEntity getBook() { return book; }
    public void setBook(BookEntity book) { this.book = book; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }
}
