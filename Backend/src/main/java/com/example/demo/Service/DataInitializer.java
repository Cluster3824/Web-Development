package com.example.demo.Service;

import com.example.demo.Entity.UserEntity;
import com.example.demo.Entity.BookEntity;
import com.example.demo.Entity.ReviewEntity;
import com.example.demo.Repos.UserRepository;
import com.example.demo.Repos.BookRespo;
import com.example.demo.Repos.ReviewRespo;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BookRespo bookRepository;
    private final ReviewRespo reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, BookRespo bookRepository, ReviewRespo reviewRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            UserEntity admin = new UserEntity();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setBanned(false);
            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin/admin123");
        }
        
        // Create sample books
        if (bookRepository.count() == 0) {
            BookEntity[] books = {
                // Fiction
                new BookEntity("The Great Gatsby", "F. Scott Fitzgerald", "Fiction", "A classic American novel set in the Jazz Age", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"),
                new BookEntity("To Kill a Mockingbird", "Harper Lee", "Fiction", "A gripping tale of racial injustice and childhood innocence", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"),
                new BookEntity("1984", "George Orwell", "Fiction", "A dystopian social science fiction novel", "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop"),
                new BookEntity("Pride and Prejudice", "Jane Austen", "Fiction", "A romantic novel of manners", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"),
                new BookEntity("The Catcher in the Rye", "J.D. Salinger", "Fiction", "A controversial novel about teenage rebellion", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"),
                new BookEntity("Lord of the Flies", "William Golding", "Fiction", "A group of boys stranded on an island", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"),
                new BookEntity("The Kite Runner", "Khaled Hosseini", "Fiction", "A story of friendship and redemption in Afghanistan", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"),
                new BookEntity("Brave New World", "Aldous Huxley", "Fiction", "A dystopian vision of the future", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"),
                new BookEntity("The Handmaid's Tale", "Margaret Atwood", "Fiction", "A dystopian tale of women's oppression", "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop"),
                new BookEntity("One Hundred Years of Solitude", "Gabriel García Márquez", "Fiction", "Magical realism masterpiece", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"),
                
                // Mystery
                new BookEntity("The Girl with the Dragon Tattoo", "Stieg Larsson", "Mystery", "A gripping Swedish crime thriller", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"),
                new BookEntity("Gone Girl", "Gillian Flynn", "Mystery", "A psychological thriller about a missing wife", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"),
                new BookEntity("The Da Vinci Code", "Dan Brown", "Mystery", "A mystery involving art and religion", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"),
                new BookEntity("Sherlock Holmes", "Arthur Conan Doyle", "Mystery", "Classic detective stories", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"),
                new BookEntity("Murder on the Orient Express", "Agatha Christie", "Mystery", "The queen of mystery novels", "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop"),
                new BookEntity("The Silent Patient", "Alex Michaelides", "Mystery", "A psychotherapist's obsession with a patient", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"),
                new BookEntity("Big Little Lies", "Liane Moriarty", "Mystery", "Secrets and lies in a small town", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"),
                new BookEntity("The Girl on the Train", "Paula Hawkins", "Mystery", "A psychological thriller about memory and truth", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"),
                new BookEntity("In the Woods", "Tana French", "Mystery", "A haunting Irish mystery", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"),
                new BookEntity("The Maltese Falcon", "Dashiell Hammett", "Mystery", "Classic noir detective fiction", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"),
                
                // Romance
                new BookEntity("The Notebook", "Nicholas Sparks", "Romance", "A timeless love story", "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop"),
                new BookEntity("Me Before You", "Jojo Moyes", "Romance", "An unlikely love story", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"),
                new BookEntity("The Fault in Our Stars", "John Green", "Romance", "A heart-wrenching teen romance", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"),
                new BookEntity("Outlander", "Diana Gabaldon", "Romance", "Time-traveling historical romance", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"),
                new BookEntity("Jane Eyre", "Charlotte Brontë", "Romance", "A Gothic romance classic", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"),
                new BookEntity("Wuthering Heights", "Emily Brontë", "Romance", "A passionate and destructive love story", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"),
                new BookEntity("The Time Traveler's Wife", "Audrey Niffenegger", "Romance", "A unique love story across time", "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop"),
                new BookEntity("Sense and Sensibility", "Jane Austen", "Romance", "A tale of two sisters and their loves", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"),
                new BookEntity("The Kiss Quotient", "Helen Hoang", "Romance", "A modern romance with diverse characters", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"),
                new BookEntity("It Ends with Us", "Colleen Hoover", "Romance", "A powerful story about love and resilience", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"),
                
                // Fantasy
                new BookEntity("Harry Potter and the Sorcerer's Stone", "J.K. Rowling", "Fantasy", "The boy who lived begins his magical journey", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"),
                new BookEntity("The Lord of the Rings", "J.R.R. Tolkien", "Fantasy", "Epic fantasy adventure in Middle-earth", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"),
                new BookEntity("Game of Thrones", "George R.R. Martin", "Fantasy", "Political intrigue in a fantasy world", "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop"),
                new BookEntity("The Name of the Wind", "Patrick Rothfuss", "Fantasy", "The legend of Kvothe begins", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"),
                new BookEntity("The Way of Kings", "Brandon Sanderson", "Fantasy", "Epic fantasy with unique magic systems", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"),
                new BookEntity("The Hobbit", "J.R.R. Tolkien", "Fantasy", "Bilbo's unexpected journey", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"),
                new BookEntity("The Chronicles of Narnia", "C.S. Lewis", "Fantasy", "Children discover a magical world", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"),
                new BookEntity("The Dark Tower", "Stephen King", "Fantasy", "A gunslinger's quest across worlds", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"),
                new BookEntity("American Gods", "Neil Gaiman", "Fantasy", "Old gods vs new in modern America", "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop"),
                new BookEntity("The Fifth Season", "N.K. Jemisin", "Fantasy", "A world of seismic catastrophes", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"),
                
                // Science Fiction
                new BookEntity("Dune", "Frank Herbert", "Science Fiction", "Epic space opera on the desert planet Arrakis", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"),
                new BookEntity("The Hitchhiker's Guide to the Galaxy", "Douglas Adams", "Science Fiction", "A comedic journey through space", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"),
                new BookEntity("Foundation", "Isaac Asimov", "Science Fiction", "The fall and rise of a galactic empire", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"),
                new BookEntity("Ender's Game", "Orson Scott Card", "Science Fiction", "A child prodigy in a military school", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"),
                new BookEntity("The Martian", "Andy Weir", "Science Fiction", "Survival on Mars with science and humor", "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop"),
                new BookEntity("Neuromancer", "William Gibson", "Science Fiction", "Cyberpunk classic about virtual reality", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"),
                new BookEntity("The Left Hand of Darkness", "Ursula K. Le Guin", "Science Fiction", "Gender and society on an alien world", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"),
                new BookEntity("Fahrenheit 451", "Ray Bradbury", "Science Fiction", "A dystopian future where books are banned", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"),
                new BookEntity("The Time Machine", "H.G. Wells", "Science Fiction", "A journey to the far future", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"),
                new BookEntity("Do Androids Dream of Electric Sheep?", "Philip K. Dick", "Science Fiction", "What makes us human in a world of androids", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"),
                
                // Non-Fiction
                new BookEntity("Sapiens", "Yuval Noah Harari", "Non-Fiction", "A brief history of humankind", "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop"),
                new BookEntity("Educated", "Tara Westover", "Non-Fiction", "A memoir about education and family", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"),
                new BookEntity("Atomic Habits", "James Clear", "Non-Fiction", "How to build good habits and break bad ones", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"),
                new BookEntity("Becoming", "Michelle Obama", "Non-Fiction", "Memoir of the former First Lady", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"),
                new BookEntity("The Immortal Life of Henrietta Lacks", "Rebecca Skloot", "Non-Fiction", "Science, ethics, and human story", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"),
                new BookEntity("Thinking, Fast and Slow", "Daniel Kahneman", "Non-Fiction", "How we make decisions", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"),
                new BookEntity("The Power of Now", "Eckhart Tolle", "Non-Fiction", "A guide to spiritual enlightenment", "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop"),
                new BookEntity("Steve Jobs", "Walter Isaacson", "Non-Fiction", "Biography of the Apple co-founder", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"),
                new BookEntity("The 7 Habits of Highly Effective People", "Stephen Covey", "Non-Fiction", "Personal development classic", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"),
                new BookEntity("Quiet", "Susan Cain", "Non-Fiction", "The power of introverts in an extroverted world", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop")
            };
            
            for (BookEntity book : books) {
                bookRepository.save(book);
            }
            System.out.println("✅ Sample books created: " + books.length + " books added");
        }
        
        // Add sample reviews - 10 reviews per book
        if (reviewRepository.count() == 0) {
            UserEntity adminUser = userRepository.findByUsername("admin").orElse(null);
            if (adminUser != null) {
                List<BookEntity> allBooks = bookRepository.findAll();
                String[] reviewTexts = {
                    "Absolutely phenomenal! This book captivated me from the very first page and never let go.",
                    "A literary masterpiece that deserves all the praise it receives. Highly recommended!",
                    "Incredible character development and a plot that keeps you guessing until the end.",
                    "This book completely changed my perspective on life. A truly transformative read.",
                    "Beautifully written with prose that flows like poetry. Simply magnificent.",
                    "A page-turner that I finished in one sitting. Couldn't put it down!",
                    "Emotionally powerful and deeply moving. Had me in tears by the end.",
                    "One of the best books I've read this year. Will definitely read again.",
                    "Thought-provoking and intellectually stimulating. Made me think for days.",
                    "A timeless classic that everyone should read at least once in their lifetime."
                };
                
                int reviewCount = 0;
                for (BookEntity book : allBooks) {
                    // Add 10 reviews per book
                    for (int j = 0; j < 10; j++) {
                        ReviewEntity review = new ReviewEntity();
                        review.setBook(book);
                        review.setBookId(book.getId());
                        review.setUserId(adminUser.getId());
                        review.setReviewText(reviewTexts[j]);
                        review.setRating(((j % 5) + 1)); // Ratings from 1-5
                        review.setCreatedAt(java.time.LocalDateTime.now().minusDays(j).minusHours(reviewCount));
                        reviewRepository.save(review);
                        reviewCount++;
                    }
                }
                System.out.println("✅ Sample reviews created: " + reviewCount + " reviews added (10 per book)");
            }
        }
        
        System.out.println("📊 Database initialized - Users: " + userRepository.count() + ", Books: " + bookRepository.count() + ", Reviews: " + reviewRepository.count());
    }
}