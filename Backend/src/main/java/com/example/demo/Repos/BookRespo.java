package com.example.demo.Repos;

import com.example.demo.Entity.BookEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRespo extends JpaRepository<BookEntity, Long> {

    // Paginated search
    Page<BookEntity> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrGenreContainingIgnoreCase(
        String title, String author, String genre, Pageable pageable);
    
    // Genre-based filtering
    Page<BookEntity> findByGenreIgnoreCase(String genre, Pageable pageable);
    
    // Advanced search with multiple criteria
    @Query("SELECT b FROM BookEntity b WHERE " +
           "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:author IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))) AND " +
           "(:genre IS NULL OR LOWER(b.genre) LIKE LOWER(CONCAT('%', :genre, '%')))")
    Page<BookEntity> findBooksWithFilters(@Param("title") String title, 
                                         @Param("author") String author, 
                                         @Param("genre") String genre, 
                                         Pageable pageable);

    // Fetch a single book with reviews to prevent LazyInitializationException
    @Query("SELECT b FROM BookEntity b LEFT JOIN FETCH b.reviews WHERE b.id = :id")
    Optional<BookEntity> findByIdWithReviews(@Param("id") Long id);

    // Fetch books with average ratings (performance optimized)
    @Query("SELECT b, COALESCE(AVG(r.rating), 0) as avgRating FROM BookEntity b " +
           "LEFT JOIN b.reviews r GROUP BY b.id ORDER BY avgRating DESC")
    List<Object[]> findBooksWithAverageRating();
    
    // Top rated books
    @Query("SELECT b FROM BookEntity b LEFT JOIN b.reviews r " +
           "GROUP BY b.id ORDER BY COALESCE(AVG(r.rating), 0) DESC")
    Page<BookEntity> findTopRatedBooks(Pageable pageable);
    
    // Recently added books
    Page<BookEntity> findByOrderByCreatedAtDesc(Pageable pageable);
    
    // Update view count
    @Modifying
    @Transactional
    @Query("UPDATE BookEntity b SET b.viewCount = b.viewCount + 1 WHERE b.id = :id")
    void incrementViewCount(@Param("id") Long id);
    
    // Get distinct genres
    @Query("SELECT DISTINCT b.genre FROM BookEntity b ORDER BY b.genre")
    List<String> findDistinctGenres();
}
