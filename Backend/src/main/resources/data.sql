-- Default admin user (password: admin123)
INSERT IGNORE INTO users (username, email, password, role, banned) 
VALUES ('admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN', false);

-- Insert some sample books
INSERT IGNORE INTO books (title, author, genre, description, image_url) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 'A classic American novel set in the Jazz Age', 'https://covers.openlibrary.org/b/id/8225261-L.jpg'),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'A gripping tale of racial injustice and childhood innocence', 'https://covers.openlibrary.org/b/id/8226886-L.jpg'),
('1984', 'George Orwell', 'Dystopian', 'A dystopian social science fiction novel', 'https://covers.openlibrary.org/b/id/7222246-L.jpg'),
('Pride and Prejudice', 'Jane Austen', 'Romance', 'A romantic novel of manners', 'https://covers.openlibrary.org/b/id/8091016-L.jpg'),
('The Catcher in the Rye', 'J.D. Salinger', 'Fiction', 'A controversial novel about teenage rebellion', 'https://covers.openlibrary.org/b/id/8225261-L.jpg');