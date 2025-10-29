import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { booksAPI, reviewsAPI, adminAPI } from '../api';
import './AdminPage.css';

const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [newBook, setNewBook] = useState({ title: '', author: '', genre: '', description: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({ totalUsers: 0, totalBooks: 0, totalReviews: 0, bannedUsers: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Loading admin data...');
      const [booksRes, reviewsRes, usersRes, statsRes] = await Promise.all([
        booksAPI.getAllBooksSimple().catch(err => { console.error('Books error:', err); return { data: [] }; }),
        reviewsAPI.getAllReviews().catch(err => { console.error('Reviews error:', err); return { data: [] }; }),
        adminAPI.getAllUsers().catch(err => { console.error('Users error:', err); return { data: [] }; }),
        adminAPI.getStats().catch(err => { console.error('Stats error:', err); return { data: { totalUsers: 0, totalBooks: 0, totalReviews: 0, bannedUsers: 0 } }; })
      ]);
      console.log('Data loaded:', { books: booksRes.data?.length, reviews: reviewsRes.data?.length, users: usersRes.data?.length });
      setBooks(booksRes.data || []);
      setReviews(reviewsRes.data || []);
      setUsers(usersRes.data || []);
      setStats(statsRes.data || { totalUsers: 0, totalBooks: 0, totalReviews: 0, bannedUsers: 0 });
      setError('');
    } catch (err) {
      console.error('Load data error:', err);
      setError('Failed to load data: ' + (err.message || 'Unknown error'));
      setBooks([]);
      setReviews([]);
      setUsers([]);
      setStats({ totalUsers: 0, totalBooks: 0, totalReviews: 0, bannedUsers: 0 });
    }
    setLoading(false);
  };

  const handleCreateBook = async () => {
    if (!newBook.title || !newBook.author) return;
    try {
      await booksAPI.createBook(newBook);
      setNewBook({ title: '', author: '', genre: '', description: '', imageUrl: '' });
      loadData();
    } catch (err) {
      setError('Failed to create book');
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
  };

  const handleSaveBook = async (updatedBook) => {
    try {
      await booksAPI.updateBook(updatedBook.id, updatedBook);
      setEditingBook(null);
      loadData();
    } catch (err) {
      setError('Failed to update book');
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await booksAPI.deleteBook(id);
      loadData();
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await adminAPI.banUser(userId);
      loadData();
    } catch (err) {
      setError('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await adminAPI.unbanUser(userId);
      loadData();
    } catch (err) {
      setError('Failed to unban user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        loadData();
        setError('');
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Failed to delete user';
        setError(typeof errorMsg === 'string' ? errorMsg : 'Failed to delete user');
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewsAPI.deleteReview(reviewId);
      loadData();
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) {
      loadData();
      return;
    }
    try {
      const response = await adminAPI.searchUsers(searchQuery);
      setUsers(response.data || []);
    } catch (err) {
      setError('Failed to search users');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      loadData();
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Failed to update user role';
      setError(typeof errorMsg === 'string' ? errorMsg : 'Failed to update user role');
    }
  };

  const handleViewUserDetails = async (userId) => {
    try {
      const response = await adminAPI.getUserDetails(userId);
      setSelectedUser(response.data);
    } catch (err) {
      setError('Failed to load user details');
    }
  };

  const totalUsers = stats.totalUsers || users.length;
  const totalBooks = stats.totalBooks || books.length;
  const totalReviews = stats.totalReviews || reviews.length;
  const bannedUsers = stats.bannedUsers || 0;
  const averageRating = books.length > 0 ? (books.reduce((sum, book) => sum + (book.averageRating || 0), 0) / books.length).toFixed(1) : '0.0';

  return (
    <div className="admin-page">
      <header className="admin-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h1>Admin Panel</h1>
        <p>Welcome, {user?.username}!</p>
      </header>

      {error && <div className="alert alert-error" style={{backgroundColor: '#fee', color: '#c33', padding: '10px', margin: '10px 0', borderRadius: '4px'}}>{error}</div>}
      
      {!loading && books.length === 0 && users.length === 0 && (
        <div className="alert alert-warning" style={{backgroundColor: '#fff3cd', color: '#856404', padding: '15px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ffeaa7'}}>
          <strong>No Data Found:</strong> The database appears to be empty. Make sure:
          <ul style={{margin: '10px 0', paddingLeft: '20px'}}>
            <li>MySQL server is running</li>
            <li>Database connection is working</li>
            <li>Spring Boot application started successfully</li>
            <li>Check console logs for any errors</li>
          </ul>
        </div>
      )}
      
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <h3>Total Books</h3>
          <p>{totalBooks}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <h3>Total Reviews</h3>
          <p>{totalReviews}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚫</div>
          <h3>Banned Users</h3>
          <p>{bannedUsers}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <h3>Average Rating</h3>
          <p>{averageRating}</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          📊 Dashboard
        </button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
          👥 Manage Users
        </button>
        <button className={activeTab === 'books' ? 'active' : ''} onClick={() => setActiveTab('books')}>
          📚 Manage Books
        </button>
        <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>
          ⭐ Manage Reviews
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner"></div></div>}
      
      {activeTab === 'dashboard' && (
        <div className="admin-section">
          <h2>Dashboard Overview</h2>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">👤</span>
                  <span>{totalUsers} total users registered</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📚</span>
                  <span>{totalBooks} books in library</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">⭐</span>
                  <span>{totalReviews} reviews submitted</span>
                </div>
                {bannedUsers > 0 && (
                  <div className="activity-item warning">
                    <span className="activity-icon">⚠️</span>
                    <span>{bannedUsers} users currently banned</span>
                  </div>
                )}
              </div>
            </div>
            <div className="dashboard-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <button onClick={() => setActiveTab('users')} className="quick-action-btn">
                  👥 Manage Users
                </button>
                <button onClick={() => setActiveTab('books')} className="quick-action-btn">
                  📚 Add New Book
                </button>
                <button onClick={() => setActiveTab('reviews')} className="quick-action-btn">
                  ⭐ Review Management
                </button>
                <button onClick={loadData} className="quick-action-btn refresh">
                  🔄 Refresh Data
                </button>
                <button onClick={async () => {
                  try {
                    const response = await fetch('/api/test/db-status');
                    if (!response.ok) {
                      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    const data = await response.json();
                    alert(`Database Status: ${data.status}\nUsers: ${data.userCount}\nMessage: ${data.message}`);
                  } catch (err) {
                    if (err.message.includes('Failed to fetch')) {
                      alert('Backend server is not running. Please start Spring Boot on port 8082.');
                    } else {
                      alert('Database test failed: ' + err.message);
                    }
                  }
                }} className="quick-action-btn">
                  🔍 Test Database
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>User Management</h2>
          
          <div className="user-management-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search users by email or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchUsers()}
              />
              <button onClick={handleSearchUsers} className="search-btn">🔍</button>
              <button onClick={() => { setSearchQuery(''); loadData(); }} className="clear-btn">✖</button>
            </div>
          </div>
          
          <table className="table admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? users.map(user => (
                <tr key={user?.id || Math.random()} className={user?.banned ? 'banned-user' : ''}>
                  <td>{user?.id || 'N/A'}</td>
                  <td>{user?.email || user?.username || 'N/A'}</td>
                  <td>{user?.username || 'N/A'}</td>
                  <td>
                    <select 
                      value={user.role} 
                      onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                      className="role-select"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge ${user.banned ? 'banned' : 'active'}`}>
                      {user.banned ? '🚫 Banned' : '✅ Active'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleViewUserDetails(user.id)} className="btn btn-info" title="View Details">
                      👁️
                    </button>
                    {user.banned ? (
                      <button onClick={() => handleUnbanUser(user.id)} className="btn btn-success" title="Unban User">
                        ✅
                      </button>
                    ) : (
                      <button onClick={() => handleBanUser(user.id)} className="btn btn-warning" title="Ban User">
                        🚫
                      </button>
                    )}
                    <button onClick={() => handleDeleteUser(user.id)} className="btn btn-danger" title="Delete User">
                      🗑️
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {selectedUser && (
            <div className="user-details-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>User Details</h3>
                  <button onClick={() => setSelectedUser(null)} className="close-btn">✖</button>
                </div>
                <div className="modal-body">
                  <div className="user-info">
                    <p><strong>ID:</strong> {selectedUser.user.id}</p>
                    <p><strong>Email:</strong> {selectedUser.user.email || selectedUser.user.username}</p>
                    <p><strong>Username:</strong> {selectedUser.user.username}</p>
                    <p><strong>Role:</strong> {selectedUser.user.role}</p>
                    <p><strong>Status:</strong> {selectedUser.user.banned ? 'Banned' : 'Active'}</p>
                    <p><strong>Total Reviews:</strong> {selectedUser.reviewCount}</p>
                  </div>
                  {selectedUser.recentReviews && selectedUser.recentReviews.length > 0 && (
                    <div className="recent-reviews">
                      <h4>Recent Reviews</h4>
                      {selectedUser.recentReviews.map(review => (
                        <div key={review.id} className="review-item">
                          <p><strong>Book:</strong> {books.find(b => b.id === review.bookId)?.title || 'Unknown'}</p>
                          <p><strong>Rating:</strong> {'⭐'.repeat(review.rating)}</p>
                          <p><strong>Review:</strong> {review.reviewText}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'books' && (
        <div className="admin-section">
          <h2>Manage Books</h2>
          
          <div className="add-book-form" style={{marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9'}}>
            <h3 style={{marginBottom: '15px', color: '#333'}}>Add New Book</h3>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
              <input
                type="text"
                placeholder="Title"
                value={newBook.title}
                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                style={{padding: '10px', border: '1px solid #ddd', borderRadius: '4px'}}
              />
              <input
                type="text"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                style={{padding: '10px', border: '1px solid #ddd', borderRadius: '4px'}}
              />
              <input
                type="text"
                placeholder="Genre"
                value={newBook.genre}
                onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                style={{padding: '10px', border: '1px solid #ddd', borderRadius: '4px'}}
              />
              <input
                type="url"
                placeholder="Image URL (e.g., https://example.com/book-cover.jpg)"
                value={newBook.imageUrl}
                onChange={(e) => setNewBook({...newBook, imageUrl: e.target.value})}
                style={{padding: '10px', border: '1px solid #ddd', borderRadius: '4px'}}
              />
            </div>
            <textarea
              placeholder="Description"
              value={newBook.description}
              onChange={(e) => setNewBook({...newBook, description: e.target.value})}
              style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px', marginBottom: '15px'}}
            />
            {newBook.imageUrl && (
              <div style={{marginBottom: '15px'}}>
                <p style={{margin: '0 0 10px 0', fontWeight: 'bold'}}>Image Preview:</p>
                <img 
                  src={newBook.imageUrl} 
                  alt="Book cover preview" 
                  style={{width: '100px', height: '150px', objectFit: 'cover', border: '1px solid #ddd', borderRadius: '4px'}}
                  onError={(e) => {e.target.style.display = 'none'}}
                />
              </div>
            )}
            <button onClick={handleCreateBook} className="btn btn-primary" style={{padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Add Book</button>
          </div>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Rating</th>
                <th>Reviews</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books && books.length > 0 ? books.map(book => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>
                    {editingBook?.id === book.id ? (
                      <div>
                        <input
                          type="url"
                          placeholder="Image URL"
                          value={editingBook.imageUrl || ''}
                          onChange={(e) => setEditingBook({ ...editingBook, imageUrl: e.target.value })}
                          style={{width: '100%', marginBottom: '5px'}}
                        />
                        {editingBook.imageUrl && (
                          <img 
                            src={editingBook.imageUrl} 
                            alt="Preview" 
                            style={{width: '40px', height: '60px', objectFit: 'cover'}}
                            onError={(e) => {e.target.style.display = 'none'}}
                          />
                        )}
                      </div>
                    ) : (
                      book.imageUrl ? (
                        <img 
                          src={book.imageUrl} 
                          alt={book.title} 
                          style={{width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px'}}
                          onError={(e) => {e.target.src = 'https://via.placeholder.com/40x60?text=No+Image'}}
                        />
                      ) : (
                        <div style={{width: '40px', height: '60px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', borderRadius: '4px'}}>No Image</div>
                      )
                    )}
                  </td>
                  <td>
                    {editingBook?.id === book.id ? (
                      <input
                        type="text"
                        value={editingBook.title}
                        onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                      />
                    ) : (
                      book.title
                    )}
                  </td>
                  <td>
                    {editingBook?.id === book.id ? (
                      <input
                        type="text"
                        value={editingBook.author}
                        onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                      />
                    ) : (
                      book.author
                    )}
                  </td>
                  <td>
                    {editingBook?.id === book.id ? (
                      <input
                        type="text"
                        value={editingBook.genre}
                        onChange={(e) => setEditingBook({ ...editingBook, genre: e.target.value })}
                      />
                    ) : (
                      book.genre
                    )}
                  </td>
                  <td>{book.averageRating || 0}</td>
                  <td>0</td>
                  <td>
                    {editingBook?.id === book.id ? (
                      <button onClick={() => handleSaveBook(editingBook)} style={{marginRight: '5px', padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px'}}>Save</button>
                    ) : (
                      <button onClick={() => handleEditBook(book)} style={{marginRight: '5px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px'}}>Edit</button>
                    )}
                    <button onClick={() => handleDeleteBook(book.id)} style={{padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px'}}>Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>No books found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="admin-section">
          <h2>Review Management</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Book</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews && reviews.length > 0 ? reviews.map(review => (
                <tr key={review.id}>
                  <td>{review.id}</td>
                  <td>User {review.userId}</td>
                  <td>{books.find(b => b.id === review.bookId)?.title || 'Unknown'}</td>
                  <td>{'⭐'.repeat(review.rating)}</td>
                  <td style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis'}}>{review.reviewText}</td>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDeleteReview(review.id)} className="btn btn-danger" style={{padding: '5px 10px', fontSize: '12px'}}>Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No reviews found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
