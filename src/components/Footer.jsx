
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  MessageCircle,
  Heart,
  ArrowRight,
  ArrowUp,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { CONTACT_EMAIL, SOCIAL_LINKS } from '../config.js';
import './Footer.css';

const exploreLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Our Team', path: '/our-team' },
  { label: 'Our Impact', path: '/impact' },
  { label: 'Gallery', path: '/gallery' },
];

const workLinks = [
  { label: 'Medical Services', path: '/medical-services' },
  { label: 'Medical Camps', path: '/medical-camps' },
  { label: 'Get Involved', path: '/contact' },
  { label: 'Make a Donation', path: '/donate' },
];

// X (formerly Twitter) logo; Lucide only ships the old bird icon.
function XLogo({ size = 18 }) {
  return (
    <svg
      className="lucide"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45Z" />
    </svg>
  );
}

const socialPlatforms = [
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'x', label: 'X (Twitter)', icon: XLogo },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'youtube', label: 'YouTube', icon: Youtube },
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
];


function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      {/* Final call to action */}
      <section className="footer-cta" aria-labelledby="footer-cta-title">
        <div className="footer-container footer-cta-inner">
          <div className="footer-cta-copy">
            <h2 id="footer-cta-title">
              Help us bring care closer to every community.
            </h2>
            <p>
              Your support helps us bring medical camps and health
              education to families in Jinja and beyond.
            </p>
          </div>

          <div className="footer-cta-actions">
            <Link to="/donate" className="footer-btn btn-support">
              <Heart size={17} fill="currentColor" aria-hidden="true" />
              Make a Donation
            </Link>
            <Link to="/contact" className="footer-btn footer-btn-outline">
              Contact our team
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <div className="footer-main">
        <div className="footer-container footer-grid">
          <div className="footer-about">
            <Link
              to="/"
              className="footer-brand"
              aria-label="The Web Initiative Ltd home"
            >
              <img
                src="/images/logo.jpeg"
                alt="The Web Initiative logo"
                className="footer-logo"
              />
            </Link>

            <p className="footer-description">
              A community health organisation working towards healthier
              communities through medical camps, health education and
              outreach.
            </p>

            <Link to="/about" className="footer-learn-link">
              Learn more about us
              <ArrowRight size={16} aria-hidden="true" />
            </Link>

            {/* Icons become links once their URL is added in config.js;
                until then they show without being clickable. */}
            <ul className="footer-social" aria-label="Follow us">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                const url = SOCIAL_LINKS[platform.key];

                return (
                  <li key={platform.key}>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${platform.label} (opens in a new tab)`}
                        title={platform.label}
                      >
                        <Icon size={18} aria-hidden="true" />
                      </a>
                    ) : (
                      <span
                        className="footer-social-pending"
                        title={`${platform.label} (coming soon)`}
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span className="sr-only">
                          {platform.label} (coming soon)
                        </span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <nav className="footer-column" aria-label="Explore">
            <h3>Explore</h3>
            <ul>
              {exploreLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-column" aria-label="Our work">
            <h3>Our Work</h3>
            <ul>
              {workLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-column">
            <h3>Get in Touch</h3>

            <ul className="footer-contact-list">
              <li>
                <MapPin size={19} aria-hidden="true" />
                <span>
                  Jinja, Uganda
                  <small>P.O. Box 903588</small>
                </span>
              </li>
              <li>
                <Mail size={19} aria-hidden="true" />
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>
                <MessageCircle size={19} aria-hidden="true" />
                <Link to="/contact">Send us a message</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container footer-bottom-inner">
          <p>© {currentYear} The Web Initiative Ltd. All rights reserved.</p>

          <p className="footer-tagline">
            <span className="hand-accent hand-accent--on-dark">
              Made to make a difference
            </span>
            <Heart size={15} aria-hidden="true" />
          </p>

          <button
            type="button"
            className="footer-top-button"
            onClick={scrollToTop}
          >
            Back to top
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
