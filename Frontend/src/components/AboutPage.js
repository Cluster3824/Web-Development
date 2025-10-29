import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-wrapper">
      <div className="about-container">
        <div className="about-hero">
          <h1>About BookVerse</h1>
          <p>Your ultimate destination for discovering, reviewing, and sharing the books that matter most to you</p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              At BookVerse, we believe that every book has the power to transform lives. Our mission is to create 
              a vibrant, inclusive community where readers from all walks of life can connect, share their passion 
              for literature, and discover their next favorite read through authentic, thoughtful reviews.
            </p>
          </div>

          <div className="about-section">
            <h2>What We Offer</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">📚</div>
                <h3>Comprehensive Reviews</h3>
                <p>Read detailed, honest reviews from fellow book enthusiasts</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⭐</div>
                <h3>Smart Rating System</h3>
                <p>Rate books with our intuitive 5-star system</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔍</div>
                <h3>Personalized Discovery</h3>
                <p>Find new books tailored to your reading preferences</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">👥</div>
                <h3>Reader Community</h3>
                <p>Connect with like-minded readers and book clubs</p>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>BookVerse by the Numbers</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <h3>10,000+</h3>
                <p>Books Reviewed</p>
              </div>
              <div className="stat-item">
                <h3>5,000+</h3>
                <p>Active Readers</p>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <p>Book Genres</p>
              </div>
              <div className="stat-item">
                <h3>99%</h3>
                <p>User Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Our Story</h2>
            <p>
              Founded in 2024, BookVerse emerged from a simple idea: that the best book recommendations come 
              from real readers, not algorithms. We started as a small community of book lovers who wanted 
              to share their reading experiences in a meaningful way. Today, we've grown into a thriving 
              platform that celebrates the diversity of literature and the unique perspectives each reader brings.
            </p>
          </div>

          <div className="contact-section">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you! Whether you have questions, suggestions, or just want to chat about books.</p>
            <div className="contact-info">
              <div className="contact-item">
                <span>📧</span>
                <span>info@bookverse.com</span>
              </div>
              <div className="contact-item">
                <span>📞</span>
                <span>(555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span>🌐</span>
                <span>www.bookverse.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;