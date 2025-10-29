import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './LoginPage.css';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login({ username, password });
      
      if (result.success) {
        navigate('/admin');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
        setError('Backend server is not running. Please start the Spring Boot server on port 8082.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      <div className="login-shape shape1"></div>
      <div className="login-shape shape2"></div>

      <div className="login-container">
        <div className="login-image-container">
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.rwr6SRa66XQuHOFFxei8hgHaFN%3Fpid%3DApi&f=1&ipt=f9ea1e6842e78099bf7d4a9559ccfd184d0fe058e6e9052fbb2ab9d0d1fcf501&ipo=images"
            alt="Admin Login"
            className="login-image"
          />
        </div>

        <div className="login-form">
          <h2>🔐 Admin Login</h2>
          <p className="login-subtitle">Administrator access only</p>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Admin Username/Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying Admin...' : 'Admin Login'}
            </button>
          </form>

          <p className="register-text">
            Need admin account? <Link to="/admin-register">Admin Registration</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;