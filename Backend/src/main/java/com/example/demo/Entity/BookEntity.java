package com.example.demo.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "books", indexes = {
    @Index(name = "idx_book_title", columnList = "title"),
    @Index(name = "idx_book_author", columnList = "author"),
    @Index(name = "idx_book_genre", columnList = "genre"),
    @Index(name = "idx_book_title_author", columnList = "title, author")
})
public class BookEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String genre;
    private String description;
    private String imageUrl;
    
    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;
    
    @Column(name = "view_count")
    private Long viewCount = 0L;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<ReviewEntity> reviews = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }


    // Constructors
    public BookEntity() {}
    
    public BookEntity(String title, String author, String genre, String description) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.description = description;
    }
    
    public BookEntity(String title, String author, String genre, String description, String imageUrl) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<ReviewEntity> getReviews() { return reviews; }
    public void setReviews(List<ReviewEntity> reviews) { this.reviews = reviews; }

    // Calculate average rating from reviews
    public double getAverageRating() {
        try {
            if (reviews == null || reviews.isEmpty()) {
                return 0.0;
            }
            return reviews.stream().mapToInt(ReviewEntity::getRating).average().orElse(0.0);
        } catch (Exception e) {
            // Handle lazy loading exception gracefully
            return 0.0;
        }
    }
}
