import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { reviewsAPI, booksAPI } from '../api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    favoriteGenre: 'Fiction',
    joinDate: new Date().toLocaleDateString()
  });
  const [profileImage] = useState(user?.profileImage || '');

  const loadUserReviews = useCallback(async () => {
    setLoading(true);
    try {
      const [reviewsResponse, booksResponse] = await Promise.all([
        reviewsAPI.getAllReviews(),
        booksAPI.getAllBooksSimple()
      ]);

      const allReviews = reviewsResponse.data || [];
      const allBooks = booksResponse.data || [];
      setBooks(allBooks);
      const myReviews = allReviews.filter(review => review.userId === user.id);

      setUserReviews(myReviews);
      
      const totalReviews = myReviews.length;
      const averageRating = totalReviews > 0 
        ? (myReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews).toFixed(1)
        : 0;
      
      setStats({
        totalReviews,
        averageRating,
        favoriteGenre: 'Fiction',
        joinDate: new Date().toLocaleDateString()
      });
    } catch (error) {
      console.error('Failed to load user reviews:', error);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserReviews();
    }
  }, [user, loadUserReviews]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="profile-wrapper">
        <div style={{ textAlign: 'center', padding: '100px 20px', color: '#666' }}>
          <h2>Please login to view your profile</h2>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        {user.role === 'ADMIN' && (
          <div className="admin-access">
            <h3>🔐 Administrator Access</h3>
            <p>You have admin privileges.</p>
            <button className="btn" onClick={() => navigate('/admin')}>
              Access Admin Panel
            </button>
          </div>
        )}

        <div className="profile-header">
          <div className="profile-avatar" style={{
            backgroundImage: profileImage ? `url(${profileImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: profileImage ? 'transparent' : 'white'
          }}>
            {!profileImage && user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user.username}</h1>
            <p>Member since {stats.joinDate}</p>
            <div className="profile-badges">
              <span className={`badge ${user.role === 'ADMIN' ? 'admin' : ''}`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <h3>Account Information</h3>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value">{user.role}</span>
            </div>
          </div>

          <div className="profile-card">
            <h3>Reading Statistics</h3>
            <div className="info-item">
              <span className="info-label">Total Reviews:</span>
              <span className="info-value">{stats.totalReviews}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Average Rating:</span>
              <span className="info-value">{stats.averageRating} ⭐</span>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h3>Account Settings</h3>
          <div className="action-buttons">
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="reviews-section">
          <div className="reviews-header">
            <h3>My Review History ({stats.totalReviews})</h3>
            <button className="btn btn-primary" onClick={() => navigate('/review')}>
              Write New Review
            </button>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading your reviews...</p>
            </div>
          ) : userReviews.length > 0 ? (
            <div className="reviews-list">
              {userReviews.map((review, index) => {
                const book = books.find(b => b.id === review.bookId);
                return (
                  <div key={review.id || index} className="review-item">
                    <div className="review-book">
                      <h4>{book?.title || 'Unknown Book'}</h4>
                      <p>by {book?.author || 'Unknown Author'}</p>
                    </div>
                    <div className="review-content">
                      <div className="review-rating">
                        {'⭐'.repeat(review.rating || 0)}
                      </div>
                      <p className="review-text">{review.reviewText}</p>
                      <p className="review-date">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-reviews">
              <p>You haven't written any reviews yet.</p>
              <button className="btn btn-primary" onClick={() => navigate('/review')}>
                Write Your First Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;