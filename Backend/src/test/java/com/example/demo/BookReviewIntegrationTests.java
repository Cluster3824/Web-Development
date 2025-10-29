package com.example.demo;

import com.example.demo.Entity.BookEntity;
import com.example.demo.Entity.ReviewEntity;
import com.example.demo.Repos.BookRespo;
import com.example.demo.Repos.ReviewRespo;
import com.example.demo.Service.BookService;
import com.example.demo.Service.ReviewService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class BookReviewIntegrationTests {
    @Autowired
    private BookRespo bookRespo;
    @Autowired
    private ReviewRespo reviewRespo;
    @Autowired
    private BookService bookService;
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private MockMvc mockMvc;

    @Test
    void contextLoadsAndBeansProperly() {
        Assertions.assertNotNull(bookRespo);
        Assertions.assertNotNull(reviewRespo);
        Assertions.assertNotNull(bookService);
        Assertions.assertNotNull(reviewService);
    }

    @Test
    void repositoryLayerBookSaveAndFind() {
        BookEntity book = new BookEntity();
        book.setTitle("Test Book");
        book.setAuthor("Author");
        book.setGenre("Fiction");
        book.setDescription("Desc");
        BookEntity saved = bookRespo.save(book);
        Assertions.assertNotNull(saved.getId());
        BookEntity found = bookRespo.findById(saved.getId()).orElse(null);
        Assertions.assertNotNull(found);
        Assertions.assertEquals("Test Book", found.getTitle());
    }

    @Test
    void serviceLayerSaveBook() {
        BookEntity book = new BookEntity();
        book.setTitle("Service Book");
        book.setAuthor("Author");
        book.setGenre("Fiction");
        book.setDescription("Desc");
        BookEntity saved = bookService.createBook(book);
        Assertions.assertNotNull(saved.getId());
        List<BookEntity> all = bookService.getAllBooks();
        Assertions.assertTrue(all.stream().anyMatch(b -> b.getTitle().equals("Service Book")));
    }

    @Test
    void getAllBooksEndpoint() throws Exception {
        mockMvc.perform(get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void postNewBookEndpoint() throws Exception {
        String json = "{" +
                "\"title\":\"API Book\"," +
                "\"author\":\"API Author\"," +
                "\"genre\":\"API Genre\"," +
                "\"description\":\"API Desc\"}";
        mockMvc.perform(post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void repositoryAndServiceSaveReview() {
        BookEntity book = new BookEntity();
        book.setTitle("Review Book");
        book.setAuthor("A");
        book.setGenre("G");
        book.setDescription("D");
        BookEntity savedBook = bookRespo.save(book);
        ReviewEntity review = new ReviewEntity();
        review.setBook(savedBook);
        review.setRating(5);
        review.setReviewText("Great!");
        ReviewEntity savedReview = reviewRespo.save(review);
        Assertions.assertNotNull(savedReview.getId());
        ReviewEntity serviceReview = reviewService.addReview(savedBook.getId(), review);
        Assertions.assertNotNull(serviceReview.getId());
    }

    @Test
    void getReviewsByBookIdEndpoint() throws Exception {
        BookEntity book = new BookEntity();
        book.setTitle("Book for Reviews");
        book.setAuthor("A");
        book.setGenre("G");
        book.setDescription("D");
        BookEntity savedBook = bookRespo.save(book);
        ReviewEntity review = new ReviewEntity();
        review.setBook(savedBook);
        review.setRating(4);
        review.setReviewText("Nice");
        reviewRespo.save(review);
        mockMvc.perform(get("/api/reviews?bookId=" + savedBook.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void postReviewEndpoint() throws Exception {
        BookEntity book = new BookEntity();
        book.setTitle("Book for Post Review");
        book.setAuthor("A");
        book.setGenre("G");
        book.setDescription("D");
        BookEntity savedBook = bookRespo.save(book);
        String json = "{" +
                "\"reviewText\":\"Awesome\"," +
                "\"rating\":5}";
        mockMvc.perform(post("/api/reviews?bookId=" + savedBook.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void averageRatingIsCalculated() {
        BookEntity book = new BookEntity();
        book.setTitle("Avg Book");
        book.setAuthor("A");
        book.setGenre("G");
        book.setDescription("D");
        BookEntity savedBook = bookRespo.save(book);
        ReviewEntity r1 = new ReviewEntity();
        r1.setBook(savedBook);
        r1.setRating(4);
        r1.setReviewText("Good");
        reviewRespo.save(r1);
        ReviewEntity r2 = new ReviewEntity();
        r2.setBook(savedBook);
        r2.setRating(2);
        r2.setReviewText("Bad");
        reviewRespo.save(r2);
        List<ReviewEntity> reviews = reviewRespo.findByBook_Id(savedBook.getId());
        savedBook.setReviews(reviews);
        Assertions.assertEquals(3.0, savedBook.getAverageRating());
    }

    @Test
    void getAllBooksReturnsEmptyWhenNoneExist() {
        bookRespo.deleteAll();
        List<BookEntity> books = bookService.getAllBooks();
        Assertions.assertTrue(books.isEmpty());
    }
}
