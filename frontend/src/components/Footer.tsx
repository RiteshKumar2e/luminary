import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="logo-mark">✦</span>
            <span>Luminary</span>
          </Link>
          <p className="footer__tagline">
            AI-powered creative intelligence for the modern creator.
          </p>
        </div>

        <div className="footer__grid">
          <div className="footer__col">
            <h4>Product</h4>
            <a href="/#features">Features</a>
            <a href="/#how-it-works">How It Works</a>
            <Link to="/register">Get Started</Link>
          </div>
          <div className="footer__col">
            <h4>Company</h4>
            <a href="/#about">About</a>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer__col">
            <h4>Tools</h4>
            <Link to="/story">Story Generator</Link>
            <Link to="/campaign">Campaign Planner</Link>
            <Link to="/brand-kit">Brand Kit</Link>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Luminary AI. Built with IBM Watson &amp; Groq.</p>
      </div>
    </footer>
  );
}
