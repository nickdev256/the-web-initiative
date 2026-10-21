
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  Phone,
  Heart,
  ArrowRight,
} from 'lucide-react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-about">
            <Link to="/" className="footer-brand">
              <img
                src="/images/logo.jpeg"
                alt="The Web Initiative Ltd logo"
                className="footer-logo"
              />

             
            </Link>

            <p className="footer-description">
              Working towards healthier communities through healthcare
              services, medical outreach, and community-focused initiatives.
            </p>

            <Link to="/about" className="footer-learn-link">
              Learn more about us <ArrowRight size={16} />
            </Link>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>

            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/our-team">Our Team</Link></li>
              <li><Link to="/impact">Our Impact</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Our Services</h3>

            <ul>
              <li><Link to="/medical-services">Medical Services</Link></li>
              <li><Link to="/medical-camps">Medical Camps</Link></li>
              <li><Link to="/medical-camps">Community Outreach</Link></li>
              <li><Link to="/contact">Get Involved</Link></li>
              <li><Link to="/donate">Support Our Work</Link></li>
            </ul>
          </div>

          <div className="footer-column footer-contact">
            <h3>Contact Us</h3>

            <div className="footer-contact-item">
              <MapPin size={19} aria-hidden="true" />
              <p>
                Jinja, Uganda
                <span>P.O. Box 903588</span>
              </p>
            </div>

            <a
              className="footer-contact-item"
              href="mailto:info@thewebinitiative.org"
            >
              <Mail size={19} aria-hidden="true" />
              <span>Email us</span>
            </a>

            <Link to="/contact" className="footer-contact-item">
              <Phone size={19} aria-hidden="true" />
              <span>Contact our team</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>
            © {currentYear} The Web Initiative Ltd. All rights reserved.
          </p>

          <Link to="/donate" className="footer-support-link">
            Made to make a difference <Heart size={15} />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
