import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Github, ChevronUp } from 'lucide-react';
import '../styles/Footer.css';

export function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openModal = (type: string) => {
    setActiveModal(type);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = '';
  };

  const renderModalContent = (type: string) => {
    switch (type) {
      case 'privacy':
        return (
          <>
            <h3>Privacy Policy</h3>
            <p>At Luminary AI, we prioritize the protection of your personal and brand data.</p>
            <ul>
              <li><strong>Data Encryption</strong>: All transit requests are secured using TLS 1.3 protocol.</li>
              <li><strong>Data Usage</strong>: Content generated via Groq models is processed in real time and never retained for marketing purposes.</li>
              <li><strong>No Data Sharing</strong>: We do not sell your personal identifiers or document logs to third parties.</li>
            </ul>
            <p>For detailed inquiries about data deletion or subject access rights, contact our support desk.</p>
          </>
        );
      case 'terms':
        return (
          <>
            <h3>Terms of Service</h3>
            <p>By registering or using the Luminary creative workspace, you agree to the following conditions:</p>
            <ul>
              <li><strong>Ownership</strong>: You retain 100% intellectual property ownership of all campaigns and stories generated.</li>
              <li><strong>Acceptable Use</strong>: Generation of malicious spam, phishing material, or explicit content is strictly prohibited.</li>
              <li><strong>Fair Use limits</strong>: Generation is subject to fair usage limits depending on your subscribed tier.</li>
            </ul>
            <p>Failure to comply with usage policies may result in account termination.</p>
          </>
        );
      case 'cookies':
        return (
          <>
            <h3>Cookie Policy</h3>
            <p>We use cookies to maintain your login session parameters and optimize website latency.</p>
            <ul>
              <li><strong>Essential</strong>: Required to maintain secure JWT session states.</li>
              <li><strong>Performance</strong>: Helps monitor system latency and dashboard render speeds anonymously.</li>
              <li><strong>Functionality</strong>: Stores workspace configurations, active templates, and preferred branding kit selectors.</li>
            </ul>
          </>
        );
      case 'accessibility':
        return (
          <>
            <h3>Accessibility Statement</h3>
            <p>Luminary is built to ensure a screen-reader friendly and accessible workspace for creators of all abilities.</p>
            <ul>
              <li><strong>Standards</strong>: Designed in compliance with WCAG 2.1 Level AA parameters.</li>
              <li><strong>Navigation</strong>: Supports complete keyboard access and focus outline styling.</li>
              <li><strong>Attributes</strong>: Employs high-contrast color mappings and clean aria-label configurations.</li>
            </ul>
            <p>Please contact us if you experience any visibility or layout issues.</p>
          </>
        );
      case 'preferences':
        return (
          <>
            <h3>Privacy Preferences</h3>
            <p>Manage how cookies are utilized on your browser:</p>
            
            <div className="pref-row">
              <div className="pref-info">
                <strong>Essential Cookies</strong>
                <span>Required for secure system login and session parameters.</span>
              </div>
              <label className="switch">
                <input type="checkbox" checked disabled />
                <span className="slider"></span>
              </label>
            </div>

            <div className="pref-row">
              <div className="pref-info">
                <strong>Analytics & Metrics</strong>
                <span>Enables anonymous usage tracking to speed up performance.</span>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>

            <div className="pref-row">
              <div className="pref-info">
                <strong>Personalization Switch</strong>
                <span>Saves preferences for brand styles and quick templates.</span>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>

            <button className="btn-save-pref" onClick={closeModal}>Save Preferences</button>
          </>
        );
      default:
        return null;
    }
  };

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
          <div className="footer__socials">
            <a href="mailto:riteshkumar90359@gmail.com" title="Email" className="footer__social-link">
              <Mail size={16} strokeWidth={2.2} />
            </a>
            <a href="https://www.linkedin.com/in/riteshkumar-tech/" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="footer__social-link">
              <Linkedin size={16} strokeWidth={2.2} />
            </a>
            <a href="https://github.com/RiteshKumar2e" target="_blank" rel="noopener noreferrer" title="GitHub" className="footer__social-link">
              <Github size={16} strokeWidth={2.2} />
            </a>
          </div>
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
        <div className="container footer__bottom-container">
          <div className="footer__bottom-links">
            <button className="footer__link-btn" onClick={() => openModal('privacy')}>Privacy Policy</button>
            <button className="footer__link-btn" onClick={() => openModal('terms')}>Terms of Service</button>
            <button className="footer__link-btn" onClick={() => openModal('cookies')}>Cookie Policy</button>
            <button className="footer__link-btn" onClick={() => openModal('accessibility')}>Accessibility</button>
            <button className="footer__link-btn" onClick={() => openModal('preferences')}>Manage Privacy Preferences</button>
          </div>
          <p className="footer__copyright">
            © {new Date().getFullYear()} Luminary AI. All rights reserved. Built with IBM Watson &amp; Groq.
          </p>
        </div>
        <button className={`footer__scroll-top${showScrollTop ? ' visible' : ''}`} onClick={scrollToTop} aria-label="Scroll to top">
          <ChevronUp size={20} strokeWidth={2.5} />
        </button>
      </div>

      {activeModal && (
        <div className="footer-modal-overlay" onClick={closeModal}>
          <div className="footer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="footer-modal-close" onClick={closeModal}>&times;</button>
            <div className="footer-modal-body">
              {renderModalContent(activeModal)}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
