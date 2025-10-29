import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './RegisterPage.css';

const AdminRegisterPage = () => {
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

    try {
      const result = await register({ username: email, email: email, password, role: 'ADMIN' });
      
      if (result.success) {
        alert('Admin registration successful! Please login.');
        navigate('/admin-login');
      } else {
        const errorMsg = result.error;
        if (errorMsg && errorMsg.includes('already exists')) {
          setError('Username or email already exists. Try different credentials.');
        } else {
          setError(errorMsg || 'Registration failed. Please try again.');
        }
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
    <div className="register-wrapper">
      <div className="register-shape register-shape1"></div>
      <div className="register-shape register-shape2"></div>

      <div className="register-container">
        <div className="register-image-container">
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.7jvWY9MWgGHCRvoY5NRJ_QDIDI%3Fcb%3D12%26pid%3DApi&f=1&ipt=da828bc7cc76c66a0785e67d49f21d0b8337a538673b0756214866fc6312f36f&ipo=images"
            alt="Admin Registration"
            className="register-image"
          />
        </div>

        <div className="register-form">
          <h2>🔐 Admin Registration</h2>
          <p className="register-subtitle">Create administrator account</p>
          

          
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="Admin Email (used as username)"
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
              {loading ? 'Creating Admin...' : 'Register as Admin'}
            </button>
          </form>

          <p className="register-text">
            Already have admin account?{' '}
            <Link to="/admin-login">Admin Login</Link>
          </p>
          

        </div>
      </div>
    </div>
  );
};

export default AdminRegisterPage;