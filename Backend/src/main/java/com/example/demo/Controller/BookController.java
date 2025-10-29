
package com.example.demo.Controller;
import org.springframework.security.access.prepost.PreAuthorize;

import com.example.demo.DTO.BookDTO;
import com.example.demo.Entity.BookEntity;
import com.example.demo.Service.BookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private static final Logger logger = LoggerFactory.getLogger(BookController.class);

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // Create a new book
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<BookDTO> createBook(@RequestBody BookEntity book) {
        BookEntity savedBook = bookService.createBook(book);
        return ResponseEntity.ok(convertToDto(savedBook));
    }

    // Get all books with pagination
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<BookEntity> bookPage = bookService.getAllBooks(pageable);
        List<BookDTO> books = bookPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("books", books);
        response.put("currentPage", bookPage.getNumber());
        response.put("totalItems", bookPage.getTotalElements());
        response.put("totalPages", bookPage.getTotalPages());
        response.put("hasNext", bookPage.hasNext());
        response.put("hasPrevious", bookPage.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
    
    // Get all books (simple list for compatibility)
    @GetMapping("/simple")
    public ResponseEntity<List<BookDTO>> getAllBooksSimple() {
        List<BookDTO> books = bookService.getAllBooksSimple()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(books);
    }

    // Get book by ID
    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update book
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookDTO> updateBook(@PathVariable Long id, @RequestBody BookEntity bookDetails) {
        return bookService.updateBook(id, bookDetails)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete book
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (bookService.deleteBook(id)) return ResponseEntity.ok().build();
        return ResponseEntity.notFound().build();
    }

    // Advanced search with pagination
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchBooks(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String genre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<BookEntity> bookPage = bookService.searchBooks(query, title, author, genre, pageable);
        List<BookDTO> books = bookPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("books", books);
        response.put("currentPage", bookPage.getNumber());
        response.put("totalItems", bookPage.getTotalElements());
        response.put("totalPages", bookPage.getTotalPages());
        response.put("hasNext", bookPage.hasNext());
        response.put("hasPrevious", bookPage.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
    
    // Get top rated books
    @GetMapping("/top-rated")
    public ResponseEntity<List<BookDTO>> getTopRatedBooks(
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<BookDTO> books = bookService.getTopRatedBooks(pageable)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(books);
    }
    
    // Get genres
    @GetMapping("/genres")
    public ResponseEntity<List<String>> getGenres() {
        List<String> genres = bookService.getDistinctGenres();
        return ResponseEntity.ok(genres);
    }

    // Helper: safely convert BookEntity to BookDTO
    private BookDTO convertToDto(BookEntity book) {
        if (book == null) {
            logger.error("BookEntity is null in convertToDto");
            return null;
        }
        double avgRating = 0.0;
        try {
            avgRating = book.getAverageRating();
        } catch (Exception e) {
            logger.warn("Could not calculate average rating for book {}, using 0.0", book.getId());
            avgRating = 0.0;
        }
        return new BookDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getGenre(),
                book.getDescription(),
                book.getImageUrl(),
                avgRating
        );
    }
}
