import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { booksAPI } from '../api';
import { useAuth } from './AuthContext';
import './BookListPage.css';

const BookListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortDir, setSortDir] = useState(searchParams.get('sortDir') || 'desc');
  
  const pageSize = 12;

  // Load genres
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await booksAPI.getGenres();
        setGenres(['All', ...response.data]);
      } catch (error) {
        console.error('Failed to load genres:', error);
      }
    };
    loadGenres();
  }, []);

  // Load books with debouncing
  const loadBooks = useCallback(async (page = 0) => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        page,
        size: pageSize,
        sortBy,
        sortDir,
        ...(searchQuery && { query: searchQuery }),
        ...(selectedGenre && selectedGenre !== 'All' && { genre: selectedGenre })
      };
      
      const response = await booksAPI.searchBooks(params);
      const data = response.data;
      
      setBooks(data.books || []);
      setCurrentPage(data.currentPage || 0);
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalItems || 0);
      setHasNext(data.hasNext || false);
      setHasPrevious(data.hasPrevious || false);
      
    } catch (error) {
      console.error('Failed to load books:', error);
      setError('Failed to load books. Please try again.');
      setBooks([]);
    }
    
    setLoading(false);
  }, [searchQuery, selectedGenre, sortBy, sortDir]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedGenre && selectedGenre !== 'All') params.set('genre', selectedGenre);
    if (sortBy !== 'createdAt') params.set('sortBy', sortBy);
    if (sortDir !== 'desc') params.set('sortDir', sortDir);
    
    setSearchParams(params);
  }, [searchQuery, selectedGenre, sortBy, sortDir, setSearchParams]);

  // Load books when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadBooks(0);
      setCurrentPage(0);
    }, 300); // Debounce search
    
    return () => clearTimeout(timeoutId);
  }, [loadBooks]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadBooks(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBookClick = (book) => {
    if (user) {
      navigate('/review', { state: { book } });
    } else {
      navigate('/login', { state: { from: '/review', redirectState: { book } } });
    }
  };

  return (
    <div className="book-list-page">
      <div className="page-header">
        <h1>Discover Books</h1>
        <p>Explore our collection of {totalItems} books</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search books, authors, or genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="genre-select"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          
          <select
            value={`${sortBy}-${sortDir}`}
            onChange={(e) => {
              const [newSortBy, newSortDir] = e.target.value.split('-');
              setSortBy(newSortBy);
              setSortDir(newSortDir);
            }}
            className="sort-select"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="author-asc">Author A-Z</option>
            <option value="author-desc">Author Z-A</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading books...</p>
        </div>
      )}

      {/* Books Grid */}
      {!loading && (
        <>
          <div className="books-grid">
            {books.map(book => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => handleBookClick(book)}
              >
                <div className="book-image">
                  <img
                    src={book.imageUrl || "https://via.placeholder.com/150x220?text=Book"}
                    alt={book.title}
                    onLoad={(e) => e.target.classList.add('loaded')}
                    onError={(e) => {
                      e.target.classList.add('error');
                      e.target.src = `https://via.placeholder.com/150x220/cccccc/666666?text=${encodeURIComponent(book.title.substring(0, 10))}`;
                    }}
                  />
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-meta">
                    <span className="book-genre">{book.genre}</span>
                    <span className="book-rating">⭐ {book.averageRating || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevious}
                className="pagination-btn"
              >
                ← Previous
              </button>
              
              <div className="pagination-info">
                <span>Page {currentPage + 1} of {totalPages}</span>
                <span>({totalItems} total books)</span>
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNext}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}

          {/* No Results */}
          {books.length === 0 && !loading && (
            <div className="no-results">
              <h3>No books found</h3>
              <p>Try adjusting your search criteria or browse all books.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('All');
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookListPage;