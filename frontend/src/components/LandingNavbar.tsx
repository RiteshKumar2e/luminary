import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Features', href: '/#features' },
  { label: 'Contact', href: '/contact' },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <header className={`landing-navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container landing-navbar__inner">
        <Link to="/" className="landing-navbar__logo">
          <span className="logo-mark">✦</span>
          <span className="logo-text">Luminary</span>
        </Link>

        <nav className={`landing-navbar__links${menuOpen ? ' open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="landing-navbar__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="landing-navbar__actions">
          <Link to="/login" className="btn btn-ghost">Log in</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>

        <button
          className="landing-navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}
