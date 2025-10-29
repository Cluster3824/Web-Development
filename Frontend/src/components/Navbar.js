import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  return (
    <nav style={{
      padding: '10px 20px',
      backgroundColor: '#333',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
        BookVerse
      </Link>
      
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {isLandingPage ? (
          <>
            <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
          </>
        ) : (
          <>
            <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              {user ? (
                <div 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: user.role === 'ADMIN' ? '#e74c3c' : '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: user.role === 'ADMIN' ? '2px solid #c0392b' : 'none',
                    backgroundImage: user.profileImage ? `url(${user.profileImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: user.profileImage ? 'transparent' : 'white'
                  }}
                >
                  {!user.profileImage && user.username?.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: 'white'
                  }}
                  onClick={() => navigate('/login')}
                >
                  👤
                </div>
              )}
                
                {showDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '50px',
                    right: '0',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    minWidth: '200px',
                    zIndex: 1000
                  }}>
                    <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>{user.username}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{user.role}</div>
                    </div>
                    
                    <div style={{ padding: '8px 0' }}>
                      <div 
                        onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          color: '#333',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        👤 My Profile
                      </div>

                      
                      {user.role === 'ADMIN' && (
                        <div 
                          onClick={() => { navigate('/admin'); setShowDropdown(false); }}
                          style={{
                            padding: '10px 15px',
                            cursor: 'pointer',
                            color: '#e74c3c',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: 'bold'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#fdf2f2'}
                          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          🔒 Admin Panel
                        </div>
                      )}
                      
                      <div 
                        onClick={() => { navigate('/home'); setShowDropdown(false); }}
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          color: '#333',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        🏠 Home
                      </div>
                      
                      <div 
                        onClick={() => { navigate('/books'); setShowDropdown(false); }}
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          color: '#333',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        📚 Browse Books
                      </div>
                      
                      <div 
                        onClick={() => { navigate('/review'); setShowDropdown(false); }}
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          color: '#333',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        ✍️ Write Review
                      </div>
                      
                      <div style={{ borderTop: '1px solid #eee', marginTop: '8px', paddingTop: '8px' }}>
                        <div 
                          onClick={async () => { await logout(); navigate('/'); setShowDropdown(false); }}
                          style={{
                            padding: '10px 15px',
                            cursor: 'pointer',
                            color: '#e74c3c',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#fdf2f2'}
                          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          🚪 Logout
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;