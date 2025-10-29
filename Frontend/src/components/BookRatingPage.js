import React, { useState, useEffect } from "react";
import { booksAPI, reviewsAPI } from '../api';
import "./BookRatingPage.css";

const BookRatingPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedBook, setSelectedBook] = useState(null);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const response = await booksAPI.getAllBooks();
      // Normalize response to an array in case backend returns an object wrapper
      const res = response?.data;
      let booksArray = [];
      if (Array.isArray(res)) booksArray = res;
      else if (Array.isArray(res?.books)) booksArray = res.books;
      else if (Array.isArray(res?.data)) booksArray = res.data;
      else booksArray = [];
      setBooks(booksArray);
      setError('');
    } catch (err) {
      setError('Failed to load books');
      setBooks([]);
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddReview = async () => {
    if (!newReview.trim() || newRating === 0) {
      setError('Please provide both rating and review text');
      return;
    }
    
    try {
      const reviewData = {
        bookId: selectedBook.id,
        reviewText: newReview,
        rating: newRating
      };
      await reviewsAPI.createReview(reviewData);
      setNewReview("");
      setNewRating(0);
      setError('');
      alert('Review added successfully!');
      // Reload books to update ratings
      loadBooks();
    } catch (err) {
      setError('Failed to add review: ' + (err.response?.data || err.message));
      console.error(err);
    }
  };

  
  // Safely compute genres, filteredBooks and topRated even if `books` is not an array
  const genres = React.useMemo(() => {
    const list = Array.isArray(books) ? books : [];
    return ["All", ...new Set(list.map((b) => b.genre))];
  }, [books]);

  const filteredBooks = React.useMemo(() => {
    const list = Array.isArray(books) ? books : [];
    return list
      .filter((b) => selectedGenre === "All" || b.genre === selectedGenre)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  }, [books, selectedGenre]);

  const topRated = React.useMemo(() => {
    const list = Array.isArray(books) ? books : [];
    return [...list]
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 3);
  }, [books]);

  return (
    <div className="page-container">
      {/* decorative animated blobs for subtle background motion */}
      <div className="blob blob1" aria-hidden="true" />
      <div className="blob blob2" aria-hidden="true" />
      <div className="blob blob3" aria-hidden="true" />
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Genres</h3>
        <ul className="genre-list">
          {genres.map((g) => (
            <li
              key={g}
              className={g === selectedGenre ? "active" : ""}
              onClick={() => setSelectedGenre(g)}
            >
              {g}
            </li>
          ))}
        </ul>

        <h4>Top Rated</h4>
        <div className="top-rated">
          {topRated.map((b) => (
            <div
              key={b.id}
              className="top-item"
              onClick={() => setSelectedBook(b)}
            >
              <img src={b.imageUrl || "https://via.placeholder.com/80x120?text=Book"} alt={b.title} onError={(e) => {e.target.src = "https://via.placeholder.com/80x120?text=Book"}} />
              <div>
                <p>{b.title}</p>
                <span>⭐ {Math.round(b.averageRating * 10) / 10 || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2>Book Ratings</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {loading && <div className="loading"><div className="spinner"></div></div>}
        <div className="book-grid">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className={`book-card ${
                selectedBook?.id === book.id ? "selected" : ""
              }`}
              onClick={() => setSelectedBook(book)}
            >
              <img src={book.imageUrl || "https://via.placeholder.com/150x220?text=Book"} alt={book.title} onError={(e) => {e.target.src = "https://via.placeholder.com/150x220?text=Book"}} />
              <h4>{book.title}</h4>
              <p>{book.author}</p>
              <p>{book.genre}</p>
              <span>⭐ {book.averageRating || 0}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Detail Panel */}
      {selectedBook && (
        <div className="book-detail">
          <button className="back-button" onClick={() => setSelectedBook(null)}>
            ← Back
          </button>

          <div className="detail-header">
            <img src={selectedBook.imageUrl || "https://via.placeholder.com/200x300?text=Book"} alt={selectedBook.title} onError={(e) => {e.target.src = "https://via.placeholder.com/200x300?text=Book"}} />
            <div>
              <h2>{selectedBook.title}</h2>
              <p><strong>Author:</strong> {selectedBook.author}</p>
              <p className="genre-tag">{selectedBook.genre}</p>
              <p className="avg-detail">
                ⭐ {Math.round(selectedBook.averageRating * 10) / 10 || 0} average
              </p>

              <p>Rate this book by adding a review below!</p>
            </div>
          </div>

          {/* User Reviews Only */}
          <div className="reviews-section">
            <h3>Add Your Review</h3>
            <div className="add-review">
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= newRating ? "active" : ""}`}
                    onClick={() => setNewRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                placeholder="Write your review..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
              <button onClick={handleAddReview}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRatingPage;
