package com.example.demo;

import com.example.demo.Entity.UserEntity;
import com.example.demo.Entity.BookEntity;
import com.example.demo.Repos.UserRepository;
import com.example.demo.Repos.BookRespo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class DemoApplication implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DemoApplication.class);
    
    private final UserRepository userRepository;
    private final BookRespo bookRepository;
    private final PasswordEncoder passwordEncoder;
    
    public DemoApplication(UserRepository userRepository, BookRespo bookRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
        logger.info("BookVerse application started successfully");
    }

    @Override
    public void run(String... args) {
        try {
            // Create default admin user if not exists
            if (userRepository.findByUsername("admin").isEmpty()) {
                UserEntity admin = new UserEntity();
                admin.setUsername("admin");
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                logger.info("✅ Default admin user created: username=admin, password=admin123");
            } else {
                logger.info("✅ Default admin user already exists");
            }
            
            // Create test user if not exists
            if (userRepository.findByUsername("user").isEmpty()) {
                UserEntity user = new UserEntity();
                user.setUsername("user");
                user.setEmail("user@example.com");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setRole("USER");
                userRepository.save(user);
                logger.info("✅ Default test user created: username=user, password=user123");
            }
        } catch (Exception e) {
            logger.warn("Admin user creation skipped: {}", e.getMessage());
        }
        
        try {
            // Create sample books if none exist
            if (bookRepository.count() == 0) {
                createSampleBooks();
            }
        } catch (Exception e) {
            logger.warn("Sample books creation failed: {}", e.getMessage());
        }
    }
    
    private void createSampleBooks() {
        BookEntity[] books = {
            // Fiction
            new BookEntity("The Great Gatsby", "F. Scott Fitzgerald", "Fiction", "A classic American novel about the Jazz Age.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg"),
            new BookEntity("To Kill a Mockingbird", "Harper Lee", "Fiction", "A gripping tale of racial injustice and childhood innocence.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg"),
            new BookEntity("1984", "George Orwell", "Fiction", "A dystopian social science fiction novel.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg"),
            new BookEntity("The Catcher in the Rye", "J.D. Salinger", "Fiction", "A controversial novel about teenage rebellion.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg"),
            new BookEntity("Harry Potter and the Sorcerer's Stone", "J.K. Rowling", "Fiction", "A young wizard's journey begins.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg"),
            new BookEntity("The Lord of the Rings", "J.R.R. Tolkien", "Fiction", "An epic fantasy adventure.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1566425108i/33.jpg"),
            new BookEntity("Dune", "Frank Herbert", "Fiction", "A science fiction masterpiece about power and survival.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg"),
            new BookEntity("The Handmaid's Tale", "Margaret Atwood", "Fiction", "A dystopian tale of women's rights and freedom.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1578028274i/38447.jpg"),
            
            // Non-fiction
            new BookEntity("Sapiens", "Yuval Noah Harari", "Non-fiction", "A brief history of humankind and our species' journey.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1420585954i/23692271.jpg"),
            new BookEntity("Educated", "Tara Westover", "Non-fiction", "A memoir about education and family in rural America.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1506026635i/35133922.jpg"),
            new BookEntity("Becoming", "Michelle Obama", "Non-fiction", "The former First Lady's inspiring memoir.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1528206996i/38746485.jpg"),
            new BookEntity("The Immortal Life of Henrietta Lacks", "Rebecca Skloot", "Non-fiction", "The story of cells that changed medical science.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327878144i/6493208.jpg"),
            
            // Business/Economy
            new BookEntity("Think and Grow Rich", "Napoleon Hill", "Business", "Classic principles of wealth and success.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1463241782i/30186948.jpg"),
            new BookEntity("The Lean Startup", "Eric Ries", "Business", "How to build a successful startup efficiently.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333576876i/10127019.jpg"),
            new BookEntity("Good to Great", "Jim Collins", "Business", "Why some companies make the leap and others don't.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1397681917i/76865.jpg"),
            new BookEntity("The Intelligent Investor", "Benjamin Graham", "Business", "The definitive book on value investing.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1391639125i/106835.jpg"),
            
            // Self-Help
            new BookEntity("The 7 Habits of Highly Effective People", "Stephen Covey", "Self-Help", "Principles for personal and professional effectiveness.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1421842784i/36072.jpg"),
            new BookEntity("How to Win Friends and Influence People", "Dale Carnegie", "Self-Help", "Timeless advice for building relationships.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1442726934i/4865.jpg"),
            new BookEntity("Atomic Habits", "James Clear", "Self-Help", "An easy and proven way to build good habits.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1535115320i/40121378.jpg"),
            new BookEntity("The Power of Now", "Eckhart Tolle", "Self-Help", "A guide to spiritual enlightenment and mindfulness.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1386925471i/6708.jpg"),
            
            // Biography
            new BookEntity("Steve Jobs", "Walter Isaacson", "Biography", "The exclusive biography of Apple's co-founder.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1511288482i/11084145.jpg"),
            new BookEntity("Long Walk to Freedom", "Nelson Mandela", "Biography", "The autobiography of South Africa's first Black president.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327934888i/318431.jpg"),
            new BookEntity("Einstein: His Life and Universe", "Walter Isaacson", "Biography", "The definitive biography of the greatest scientist.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328011405i/10884.jpg"),
            new BookEntity("The Diary of a Young Girl", "Anne Frank", "Biography", "The powerful diary of a Jewish girl during WWII.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1560816565i/48855.jpg"),
            
            // Science/Tech
            new BookEntity("A Brief History of Time", "Stephen Hawking", "Science", "From the Big Bang to black holes.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333578746i/3869.jpg"),
            new BookEntity("The Code Breaker", "Walter Isaacson", "Science", "Jennifer Doudna and the future of the human race.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1582645471i/49247043.jpg"),
            new BookEntity("Homo Deus", "Yuval Noah Harari", "Science", "A brief history of tomorrow and human evolution.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1468760805i/31138556.jpg"),
            new BookEntity("The Innovators", "Walter Isaacson", "Science", "How a group of hackers and inventors created the digital revolution.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1410191571i/21856367.jpg"),
            
            // Mythology/Religious
            new BookEntity("The Alchemist", "Paulo Coelho", "Mythology", "A mystical story about following your dreams.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg"),
            new BookEntity("Mythology", "Edith Hamilton", "Mythology", "Timeless tales of gods and heroes.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388188530i/19381.jpg"),
            new BookEntity("The Power of Myth", "Joseph Campbell", "Mythology", "The role of myth in human civilization.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436217186i/35519.jpg"),
            new BookEntity("Siddhartha", "Hermann Hesse", "Religious", "A spiritual journey of self-discovery.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1428715580i/52036.jpg"),
            
            // Others
            new BookEntity("The Art of War", "Sun Tzu", "Philosophy", "Ancient Chinese military strategy and philosophy.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1453417993i/10534.jpg"),
            new BookEntity("Freakonomics", "Steven Levitt", "Economics", "A rogue economist explores the hidden side of everything.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1550695002i/1202.jpg"),
            new BookEntity("The Subtle Art of Not Giving a F*ck", "Mark Manson", "Philosophy", "A counterintuitive approach to living a good life.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1465761302i/28257707.jpg"),
            new BookEntity("Outliers", "Malcolm Gladwell", "Psychology", "The story of success and what makes high-achievers different.", "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1344266315i/3228917.jpg")
        };
        
        for (BookEntity book : books) {
            bookRepository.save(book);
        }
        logger.info("Sample books created: {} books added", books.length);
    }
}
