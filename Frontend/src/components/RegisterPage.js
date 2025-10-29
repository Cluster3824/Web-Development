import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register({ username: email, email: email, password, role: 'USER' });
    
    if (result.success) {
      alert('Registration successful! Please login.');
      navigate('/login');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleRegister = () => {
    alert('Google registration is not yet configured. Please use regular registration for now.');
  };

  return (
    <div className="register-wrapper">
      {/* Floating shapes */}
      <div className="register-shape register-shape1"></div>
      <div className="register-shape register-shape2"></div>

      {/* Container */}
      <div className="register-container">
        {/* Image section */}
        <div className="register-image-container">
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.7jvWY9MWgGHCRvoY5NRJ_QDIDI%3Fcb%3D12%26pid%3DApi&f=1&ipt=da828bc7cc76c66a0785e67d49f21d0b8337a538673b0756214866fc6312f36f&ipo=images"
            alt="Community"
            className="register-image"
          />
        </div>

        {/* Form section */}
        <div className="register-form">
          <h2>Join Us</h2>
          <p className="register-subtitle">Create your account to get started</p>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="Email (used as username)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div style={{ margin: '20px 0', textAlign: 'center', color: '#666' }}>or</div>
          
          <button 
            type="button" 
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'white',
              color: '#757575',
              border: '1px solid #dadce0',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'box-shadow 0.3s'
            }}
            onMouseOver={(e) => e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)'}
            onMouseOut={(e) => e.target.style.boxShadow = 'none'}
            onClick={handleGoogleRegister}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="register-text">
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
          
          <div style={{ 
            marginTop: '30px', 
            padding: '10px', 
            textAlign: 'center', 
            borderTop: '1px solid #eee',
            fontSize: '12px',
            color: '#999'
          }}>
            <Link 
              to="/admin-register" 
              style={{ 
                color: '#e74c3c', 
                textDecoration: 'none',
                fontSize: '11px'
              }}
            >
              🔐 Administrator Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
