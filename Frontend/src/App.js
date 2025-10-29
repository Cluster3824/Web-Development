import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import BookListPage from './components/BookListPage';
import BookReviewPage from './components/BookReviewPage';
import BookRatingPage from './components/BookRatingPage';
import AdminPage from './components/AdminPage';
import AdminLoginPage from './components/AdminLoginPage';
import AdminRegisterPage from './components/AdminRegisterPage';
import ProfilePage from './components/ProfilePage';
import './App.css';
import './components/GlobalStyles.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin-register" element={<AdminRegisterPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/books" element={<BookListPage />} />
            <Route path="/review" element={<BookReviewPage />} />
            <Route path="/rating" element={<BookRatingPage />} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
