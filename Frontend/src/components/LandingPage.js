import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import AOS from "aos";
import "aos/dist/aos.css";
import "./LandingPage.css";

const LandingPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
    // ensure animations are recalculated after all assets load
    const onLoad = () => AOS.refresh();
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');
  // featured books used by the page and by the local index
  

  // extra local index to detect direct book matches from search
  const localIndex = [
    { img: "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg", title: "Atomic Habits", author: "James Clear", rating: "4.8" },
    { img: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg", title: "The Alchemist", author: "Paulo Coelho", rating: "4.7" },
    { img: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg", title: "Rich Dad Poor Dad ", author: "George Orwell", rating: "4.9" },
    { img: "https://m.media-amazon.com/images/I/71g2ednj0JL.jpg", title: "Psychology of Money", author: "Mark Manson", rating: "4.6" },
    { title: '1984', author: 'George Orwell', img: 'https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg', rating: '4.5' },
    { title: 'Sapiens', author: 'Yuval Noah Harari', img: 'https://m.media-amazon.com/images/I/713jIoMO3UL.jpg', rating: '4.6' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', img: 'https://m.media-amazon.com/images/I/81OdwZ9aLOL.jpg', rating: '4.8' },
    { title: 'Ikigai', author: 'Francesc Miralles', img: 'https://m.media-amazon.com/images/I/81l3rZK4lnL.jpg', rating: '4.3' },
  ];
  const FALLBACK_IMG = 'https://via.placeholder.com/150x220?text=No+Image';

  const handleNavigate = (path, extraState) => {
    // If user is logged in, navigate to the target with state
    if (user) {
      navigate(path, { state: extraState });
    } else {
      // Otherwise send them to login and record where they wanted to go
      navigate('/login', { state: { from: path, redirectState: extraState } });
    }
  };

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const q = searchTerm?.trim();
    if (!q) {
      // empty search -> go to home
      navigate('/home');
      return;
    }

    // try to find a direct book match (title or author contains query)
    const query = q.toLowerCase();
    const matched = localIndex.find((b) => {
      if (!b) return false;
      const title = (b.title || '').toLowerCase();
      const author = (b.author || '').toLowerCase();
      return title.includes(query) || author.includes(query) || query.includes(title);
    });

    if (matched) {
      // send user to book review page and open matched book; honor auth check
      handleNavigate('/review', { book: matched });
      return;
    }

    // otherwise go to /home with query params
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category && category !== 'All Categories') params.set('category', category);
    navigate(`/home?${params.toString()}`);
  };

  

  const testimonials = [
    {
      quote:
        "“Thanks to BookVerse, I've discovered my favorite books this year. The personalized recommendations are spot on!”",
      name: "Emily R.",
      location: "Toronto, Canada",
      animation: "fade-right",
    },
    {
      quote:
        "“The community reviews helped me find hidden gems I never would have discovered otherwise. It's like having a personal librarian.”",
      name: "Marcus L.",
      location: "Sydney, Australia",
      animation: "zoom-in",
    },
    {
      quote:
        "“BookVerse makes tracking my reading goals fun and easy. I've never been more motivated to read!”",
      name: "Priya S.",
      location: "Mumbai, India",
      animation: "fade-left",
    },
  ];

  return (
    <div className="landing-wrapper">

            {/* HERO SECTION */}
      <section className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1 data-aos="fade-up">Discover & Share Books You Love</h1>
          <p data-aos="fade-up" data-aos-delay="200">
            Join a vibrant community of readers — explore recommendations, share reviews, and connect around the stories you love.
          </p>

          <form className="search-bar" data-aos="fade-up" data-aos-delay="400" onSubmit={handleSearch}>
            <input aria-label="Search books" type="text" placeholder="Search for a book, author, or genre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>All Categories</option>
              <option>Fiction</option>
              <option>Non-Fiction</option>
              <option>Mystery</option>
              <option>Science</option>
              <option>Fantasy</option>
              <option>Biography</option>
            </select>
            <button aria-label="Search" type="submit">Search</button>
          </form>

          <div className="hero-buttons" data-aos="fade-up" data-aos-delay="600">
            <Link to="/register"><button className="btn-primary">Get Started</button></Link>
            <Link to="/login"><button className="btn-secondary">Login</button></Link>
            <button className="btn-secondary" onClick={() => handleNavigate('/home')}>Explore Books</button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <div className="section-header">
          <h2 data-aos="fade-up">What You Can Do on BookVerse</h2>
          <p data-aos="fade-up" data-aos-delay="200">A premium space to rate books, discover recommendations, and join an active reading community.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card" data-aos="fade-up" data-aos-delay="300" aria-label="Rate Books" role="button" tabIndex={0} onClick={() => handleNavigate('/rating')} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate('/rating')}>
            <div className="feature-icon"></div>
            <h3>Rate Books</h3>
            <p>Quickly rate any title and help others find the best reads.</p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="380" aria-label="Discover Books" role="button" tabIndex={0} onClick={() => handleNavigate('/home')} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate('/home')}>
            <div className="feature-icon"></div>
            <h3>Discover Books</h3>
            <p>Explore curated lists, trending books, and tailored recommendations.</p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="460" aria-label="Join Community" role="button" tabIndex={0} onClick={() => handleNavigate('/home', { anchor: 'community' })} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate('/home', { anchor: 'community' })}>
            <div className="feature-icon"></div>
            <h3>Join Community</h3>
            <p>Follow reviewers, join discussions, and share reading lists.</p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="540" aria-label="Top Reviewers" role="button" tabIndex={0} onClick={() => handleNavigate('/review')} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate('/review')}>
            <div className="feature-icon"></div>
            <h3>Top Reviewers</h3>
            <p>Discover trusted voices and in-depth reviews from power readers.</p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="620" aria-label="Genre Collections" role="button" tabIndex={0} onClick={() => handleNavigate('/home', { collection: 'all' })} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate('/home', { collection: 'all' })}>
            <div className="feature-icon"></div>
            <h3>Genre Collections</h3>
            <p>Browse themed collections to find your next favorite in any genre.</p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="700" aria-label="Reading Challenges" role="button" tabIndex={0} onClick={() => handleNavigate('/home')} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate('/home')}>
            <div className="feature-icon"></div>
            <h3>Reading Challenges</h3>
            <p>Set goals, track progress, and celebrate milestones with badges.</p>
          </div>
        </div>
      </section>

      {/* FEATURED BOOKS */}
      <section className="featured">
        <h2 data-aos="fade-up">Trending Books This Week</h2>
        <div className="book-grid">
          {localIndex.slice(0, 4).map((book, index) => (
            <div key={index} className="book-card" data-aos="fade-up" role="button" tabIndex={0} aria-label={`Review ${book.title}`} onClick={() => handleNavigate('/review', { book })} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate('/review', { book })}>
              <img src={book.img} alt={book.title} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <span className="rating">★ {book.rating}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials" id="reviews">
        <div className="section-header">
          <h2>What Our Readers Say</h2>
          <p>Real voices from the BookVerse community</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t, index) => (
            <div className="testimonial-card" key={index} onClick={() => window.scrollTo({ top: document.getElementById('reviews')?.offsetTop || 0, behavior: 'smooth' })} role="button" tabIndex={0} aria-label={`Open testimonial by ${t.name}`}>
              <div className="quote">❝</div>
              <p>{t.quote}</p>
              <h4>{t.name}</h4>
              <span> {t.location}</span>
            </div>
          ))}
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="community" id="community">
        <div className="community-box">
          <h2> Get Book Tips & Updates</h2>
          <p>
            Subscribe to our newsletter for personalized book recommendations, reading challenges, and exclusive insights from fellow book lovers.
          </p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button>Subscribe Now</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-about">
            <h3>About BookVerse</h3>
            <p>
              BookVerse is a space for readers and authors to connect, discover, and share the love for books.
              From trending titles to hidden gems, we celebrate stories that move the world.
            </p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>
          <div className="footer-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">📘</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">🐦</a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📸</a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">💼</a>
            </div>
          </div>
        </div>
        <hr />
        <p className="footer-note">
          © 2025 BookVerse — Crafted by Rohith Zone
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
