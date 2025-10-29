import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { booksAPI } from '../api';

import './HomePage.css';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const performSearch = async () => {
      if (q) {
        setLoading(true);
        setError('');
        try {
          const params = { query: q };
          if (category) params.genre = category;
          const response = await booksAPI.searchBooks(params);
          setBooks(response.data.books || []);
        } catch (error) {
          console.error('Failed to search books:', error);
          setError('Failed to perform search. Please try again later.');
          setBooks([]);
        }
        setLoading(false);
      } else {
        loadBooks();
      }
    };
    performSearch();
  }, [q, category]);

  const loadBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await booksAPI.getAllBooksSimple();
      setBooks(response.data || []);
    } catch (error) {
      console.error('Failed to load books:', error);
      setError('Failed to load books. Please try again later.');
      setBooks([]);
    }
    setLoading(false);
  };

  return (
    <div className="home-wrapper">
      {error && <div className="alert alert-error">{error}</div>}
      {/* ===== Hero Section ===== */}
      {q && (
        <section className="search-results">
          <h2>Search results for "{q}"</h2>
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : books.length > 0 ? (
            <div className="book-grid">
              {books.map((b, i) => (
                    <div key={i} className="book-card" role="button" tabIndex={0} onClick={() => {
                      if (user) navigate('/review', { state: { book: b } });
                      else navigate('/login', { state: { from: '/review', redirectState: { book: b } } });
                    }} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (user ? navigate('/review', { state: { book: b } }) : navigate('/login', { state: { from: '/review', redirectState: { book: b } } }))}>
                      <img 
                        src={b.imageUrl || "https://via.placeholder.com/150x220?text=Book"} 
                        alt={b.title} 
                        onLoad={(e) => e.target.classList.add('loaded')}
                        onError={(e) => {
                          e.target.classList.add('error');
                          e.target.src = "https://via.placeholder.com/150x220/cccccc/666666?text=" + encodeURIComponent(b.title.substring(0, 10));
                        }} 
                      />
                      <h3>{b.title}</h3>
                      <p>by {b.author}</p>
                      <span>{b.genre} • ⭐ {b.averageRating || 0}</span>
                    </div>
                  ))}
            </div>
          ) : (
            <p className="no-results">No results found. Try different keywords.</p>
          )}
        </section>
      )}
      <section className="home-hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Your Personalized Book Universe Awaits</h1>
          <p>
            Dive into a world of stories tailored just for you. Share your thoughts, discover hidden gems,
            and connect with fellow book enthusiasts in your personalized dashboard.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => user ? navigate('/review') : navigate('/login', { state: { from: '/review' } })}>Write a Review</button>
            <button className="btn-secondary" onClick={() => user ? navigate('/rating') : navigate('/login', { state: { from: '/rating' } })}>Rate a Book</button>
            <button className="btn-primary" onClick={() => navigate('/about')}>About Us</button>
          </div>
        </div>
      </section>

      {/* ===== About Section ===== */}
      <section className="home-about">
        <h2>About Our Platform</h2>
        <p>
          BookVerse is more than just a review site—it's a thriving community where passionate readers come together.
          Discover personalized book recommendations, share your honest opinions, and connect with fellow book enthusiasts
          from around the globe. Our platform uses advanced algorithms to suggest titles you'll love, while fostering
          meaningful discussions and celebrating the joy of reading.
        </p>
      </section>

      {/* ===== Features Section ===== */}
      <section className="home-features">
        <h2>Why BookVerse Stands Out</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Curated Recommendations</h3>
            <p>Get personalized book suggestions based on your reading history and preferences.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Community-Driven Reviews</h3>
            <p>Read authentic reviews from real readers and contribute your own insights.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h3>Easy Rating System</h3>
            <p>Rate books quickly with our intuitive star system and help others discover great reads.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Reader Connections</h3>
            <p>Join discussion groups, participate in reading challenges, and build lasting friendships.</p>
          </div>
        </div>
      </section>

      {/* ===== Book Reviews ===== */}
      <section className="home-reviews">
        <h2>Recent Book Reviews</h2>
        <div className="review-grid">
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : books.length > 0 ? (
            books.slice(0, 4).map((book) => (
              <div key={book.id} className="review-card" onClick={() => user ? navigate('/review', { state: { book } }) : navigate('/login', { state: { from: '/review', redirectState: { book } } })}>
                <img src={book.imageUrl || "https://via.placeholder.com/150x220?text=Book"} alt={book.title} onError={(e) => {e.target.src = "https://via.placeholder.com/150x220?text=Book"}} />
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                <div className="rating">{'⭐️'.repeat(Math.floor(book.averageRating || 0))}</div>
                <p className="review-text">
                  {book.description || 'Click to read reviews for this book.'}
                </p>
              </div>
            ))
          ) : (
            <p>No books available for review.</p>
          )}
        </div>
      </section>

      {/* ===== Book Suggestions ===== */}
      <section className="home-suggestions">
        <h2>Recommended Reads For You</h2>
        <div className="book-grid">
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : books.length > 0 ? (
            [...books].reverse().slice(0, 4).map((book) => (
              <div key={book.id} className="book-card" onClick={() => user ? navigate('/review', { state: { book } }) : navigate('/login', { state: { from: '/review', redirectState: { book } } })}>
                <img src={book.imageUrl || "https://via.placeholder.com/150x220?text=Book"} alt={book.title} onError={(e) => {e.target.src = "https://via.placeholder.com/150x220?text=Book"}} />
                <h3>{book.title}</h3>
                <p>by {book.author}</p>
                <span>{book.genre} • ⭐ {Math.round(book.averageRating * 10) / 10 || 0}</span>
              </div>
            ))
          ) : (
            <p>No books available. Please add some books in the admin panel.</p>
          )}
        </div>
      </section>

      {/* ===== Extra Options ===== */}
      <section className="home-actions">
        <h2>Take Action</h2>
        <div className="action-buttons">
          <Link to="/community"><button className="btn-primary">Join Book Community</button></Link>
          <Link to="/discover"><button className="btn-secondary">Discover New Titles</button></Link>
          <Link to="/newsletter"><button className="btn-primary">Subscribe to Updates</button></Link>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="home-footer">
        <p>Built with for book enthusiasts. © 2025 BookVerse</p>
      </footer>
    </div>
  );
};

export default HomePage;
