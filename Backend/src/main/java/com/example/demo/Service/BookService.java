package com.example.demo.Service;

import com.example.demo.Entity.BookEntity;
import com.example.demo.Repos.BookRespo;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRespo bookRespo;

    public BookService(BookRespo bookRespo) {
        this.bookRespo = bookRespo;
    }

    // Create
    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public BookEntity createBook(BookEntity book) {
        return bookRespo.save(book);
    }

    // Get all books with pagination
    @Transactional(readOnly = true)
    @Cacheable(value = "books", key = "#pageable.pageNumber + '_' + #pageable.pageSize + '_' + #pageable.sort")
    public Page<BookEntity> getAllBooks(Pageable pageable) {
        return bookRespo.findAll(pageable);
    }
    
    // Get all books (simple list for compatibility)
    @Transactional(readOnly = true)
    public List<BookEntity> getAllBooks() {
        return bookRespo.findAll();
    }
    
    // Get all books (simple list for compatibility)
    @Transactional(readOnly = true)
    public List<BookEntity> getAllBooksSimple() {
        return bookRespo.findAll();
    }

    // Get book by ID with reviews eagerly loaded
    @Transactional(readOnly = true)
    public Optional<BookEntity> getBookById(Long id) {
        return bookRespo.findByIdWithReviews(id);
    }

    // Update a book
    @Transactional
    public Optional<BookEntity> updateBook(Long id, BookEntity bookDetails) {
        return bookRespo.findById(id)
                .map(existingBook -> {
                    existingBook.setTitle(bookDetails.getTitle());
                    existingBook.setAuthor(bookDetails.getAuthor());
                    existingBook.setGenre(bookDetails.getGenre());
                    existingBook.setDescription(bookDetails.getDescription());
                    existingBook.setImageUrl(bookDetails.getImageUrl());
                    return bookRespo.save(existingBook);
                });
    }

    // Delete a book
    @Transactional
    public boolean deleteBook(Long id) {
        if (bookRespo.existsById(id)) {
            bookRespo.deleteById(id);
            return true;
        }
        return false;
    }

    // Advanced search with pagination
    @Transactional(readOnly = true)
    public Page<BookEntity> searchBooks(String query, String title, String author, String genre, Pageable pageable) {
        if (query != null && !query.trim().isEmpty()) {
            return bookRespo.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrGenreContainingIgnoreCase(
                query, query, query, pageable);
        } else {
            return bookRespo.findBooksWithFilters(title, author, genre, pageable);
        }
    }
    
    // Get top rated books
    @Transactional(readOnly = true)
    @Cacheable(value = "topRatedBooks")
    public List<BookEntity> getTopRatedBooks(Pageable pageable) {
        return bookRespo.findTopRatedBooks(pageable).getContent();
    }
    
    // Get distinct genres
    @Cacheable(value = "genres")
    public List<String> getDistinctGenres() {
        return bookRespo.findDistinctGenres();
    }
    
    // Increment view count
    @Transactional
    public void incrementViewCount(Long bookId) {
        bookRespo.incrementViewCount(bookId);
    }
}
