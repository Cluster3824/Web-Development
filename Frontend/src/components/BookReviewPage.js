import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { booksAPI, reviewsAPI } from '../api';
import { useAuth } from './AuthContext';
import "./BookReviewPage.css";

const BookReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, reviewText: '' });

  useEffect(() => {
    loadBooks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedBook) {
      loadReviews(selectedBook.id);
    }
  }, [selectedBook]);

  const loadBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await booksAPI.getAllBooksSimple();
      setBooks(response.data || []);
      
      if (location?.state?.book && response.data) {
        const incoming = location.state.book;
        const matched = response.data.find((b) => b.title === incoming.title);
        if (matched) setSelectedBook(matched);
      }
      setError('');
    } catch (error) {
      console.error('Failed to load books:', error);
      if (error.response?.status === 500) {
        setError('Server error. Please check if the backend is running.');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to load books. Please try again.');
      }
      setBooks([]);
    }
    setLoading(false);
  };

  const loadReviews = async (bookId) => {
    try {
      const response = await reviewsAPI.getReviewsByBook(bookId);
      setReviews(response.data || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setReviews([]);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.reviewText.trim()) {
      setError('Please write a review before submitting.');
      return;
    }
    try {
      await reviewsAPI.createReview({
        bookId: selectedBook.id,
        rating: newReview.rating,
        reviewText: newReview.reviewText
      });
      setNewReview({ rating: 5, reviewText: '' });
      setShowReviewForm(false);
      loadReviews(selectedBook.id);
      setError('');
    } catch (error) {
      console.error('Failed to submit review:', error);
      setError('Failed to submit review. Please try again.');
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAverage = (book) => {
    return book.averageRating || 0;
  };

  return (
    <div className="review-landing">
      {/* Animated Background */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      {/* Navbar */}
      <nav className="review-navbar">
        <h1 className="logo">BookVerse</h1>
        <button onClick={() => navigate("/home")} className="back-home-btn">
          ⬅ Back to Home
        </button>
      </nav>

      {/* Header */}
      <header className="review-header">
        <h2>Discover. Read. Reflect.</h2>
        <p>See what readers think about your favorite books.</p>
      </header>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by title or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Error Display */}
      {error && <div className="alert alert-error">{error}</div>}
      
      {/* Main View */}
      {loading && <div className="loading"><div className="spinner"></div></div>}
      {!selectedBook ? (
        // ==== Book Grid ====
        <section className="book-grid">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => setSelectedBook(book)}
              >
                <img src={book.imageUrl || "https://via.placeholder.com/150x220?text=Book"} alt={book.title} onError={(e) => {e.target.src = "https://via.placeholder.com/150x220?text=Book"}} />
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p>{book.genre}</p>
                <p className="avg-rating">
                  ⭐ {calculateAverage(book)} / 5
                </p>
              </div>
            ))
          ) : (
            <p className="no-results">No books found</p>
          )}
        </section>
      ) : (
        // ==== Book Details + Reviews ====
        <div className="review-panel fade-in">
          <button className="back-btn" onClick={() => setSelectedBook(null)}>← Back</button>

          <div className="book-detail">
            <img src={selectedBook.imageUrl || "https://via.placeholder.com/200x300?text=Book"} alt={selectedBook.title} onError={(e) => {e.target.src = "https://via.placeholder.com/200x300?text=Book"}} />
            <div className="book-info">
              <h2>{selectedBook.title}</h2>
              <p><strong>Author:</strong> {selectedBook.author}</p>
              <p><strong>Genre:</strong> {selectedBook.genre}</p>
              <p><strong>Description:</strong> {selectedBook.description}</p>
              <p><strong>Average Rating:</strong> ⭐ {calculateAverage(selectedBook)} / 5</p>
            </div>
          </div>

          <div className="user-reviews">
            <div className="reviews-header">
              <h4>What readers say:</h4>
              {user ? (
                <button 
                  className="btn btn-primary" 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? 'Cancel' : 'Write Review'}
                </button>
              ) : (
                <button 
                  className="btn btn-secondary" 
                  onClick={() => navigate('/login', { state: { from: '/review', redirectState: { book: selectedBook } } })}
                >
                  Login to Write Review
                </button>
              )}
            </div>
            
            {showReviewForm && (
              <form className="review-form" onSubmit={handleSubmitReview}>
                <div className="rating-input">
                  <label>Rating:</label>
                  <select 
                    value={newReview.rating} 
                    onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                  >
                    <option value={5}>5 ⭐⭐⭐⭐⭐</option>
                    <option value={4}>4 ⭐⭐⭐⭐</option>
                    <option value={3}>3 ⭐⭐⭐</option>
                    <option value={2}>2 ⭐⭐</option>
                    <option value={1}>1 ⭐</option>
                  </select>
                </div>
                <textarea
                  placeholder="Write your review here..."
                  value={newReview.reviewText}
                  onChange={(e) => setNewReview({...newReview, reviewText: e.target.value})}
                  rows={4}
                  required
                />
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </form>
            )}
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div key={idx} className="review-card">
                  <div className="review-header">
                    <span className="stars">{"⭐".repeat(review.rating)}</span>
                    <span className="date">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                  <p className="review-text">“{review.reviewText}”</p>
                  <p className="review-user">– User {review.userId}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">No reviews yet for this book.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReviewPage;
