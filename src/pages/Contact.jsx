
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  MapPin,
  Send,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { CONTACT_EMAIL } from '../config.js';
import './Contact.css';

export default function Contact() { 
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General enquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const subject = encodeURIComponent(
      `Website enquiry: ${form.subject}`
    );

    const body = encodeURIComponent(
      `Hello THE WEB INITIATIVE LTD,\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || 'Not provided'}\nSubject: ${form.subject}\n\nMessage:\n${form.message}\n`
    );

    setSubmitted(true);

    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <>
      <Navbar />

      <main className="contact-page">
        <section className="contact-hero">
          <div className="contact-container contact-hero-content">
            <span className="contact-eyebrow">
              <MessageCircle size={17} /> GET IN TOUCH
            </span>

            <h1>
              Let's start a
              <span className="hand-accent"> conversation.</span>
            </h1>

            <p>
              Have a question, want to partner with us, or need more information
              about our initiatives? We would love to hear from you.
            </p>

            <a href="#contact-details" className="contact-btn contact-btn-white">
              Contact Our Team <ArrowRight size={18} />
            </a>
          </div>
        </section>

        <section className="contact-main contact-section" id="contact-details">
          <div className="contact-container">
            <div className="contact-heading">
              <span className="contact-label">CONTACT INFORMATION</span>
              <h2>We are here to help.</h2>
              <p>
                Reach out to discuss our work, explore partnership opportunities,
                or ask a question about THE WEB INITIATIVE LTD.
              </p>
            </div>

            <div className="contact-layout">
              <aside className="contact-info-panel">
                <h3>Contact details</h3>
                <p className="contact-info-intro">
                  Choose the most convenient way to get in touch with our team.
                </p>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <strong>Our location</strong>
                    <span>Jinja, Uganda</span>
                    <span>P.O. Box 903588</span>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Mail size={22} />
                  </div>
                  <div>
                    <strong>Email us</strong>
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </div>
                </div>

                <div className="contact-info-note">
                  <MessageCircle size={22} />
                  <p>
                    For partnerships, outreach programmes, and other enquiries,
                    please include a few details so we can understand how to help.
                  </p>
                </div>
              </aside>

              <div className="contact-form-panel">
                <div className="contact-form-heading">
                  <span className="contact-label">SEND A MESSAGE</span>
                  <h3>How can we help you?</h3>
                  <p>Fill in the details below to prepare your enquiry.</p>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-form-row">
                    <label className="contact-field">
                      Full name *
                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        autoComplete="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </label>

                    <label className="contact-field">
                      Email address *
                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </label>
                  </div>

                  <div className="contact-form-row">
                    <label className="contact-field">
                      Phone number
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Your phone number"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </label>

                    <label className="contact-field">
                      Subject *
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                      >
                        <option>General enquiry</option>
                        <option>Medical camps</option>
                        <option>Partnership opportunity</option>
                        <option>Donation and support</option>
                        <option>Volunteering</option>
                        <option>Other</option>
                      </select>
                    </label>
                  </div>

                  <label className="contact-field">
                    Your message *
                    <textarea
                      name="message"
                      rows="6"
                      placeholder="Tell us how we can help..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <button type="submit" className="contact-btn contact-submit">
                    Prepare Email <Send size={17} />
                  </button>

                  <p className="contact-form-disclaimer">
                    This form opens your email application to send the message.
                    It does not submit information to a website server.
                  </p>

                  {submitted && (
                    <p className="contact-form-status" role="status">
                      Your email application should open with your message. If
                      it does not, please email us directly at{' '}
                      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-location-section">
          <div className="contact-container contact-location-inner">
            <div className="contact-location-copy">
              <span className="contact-label">FIND US</span>
              <h2>Based in Jinja, Uganda.</h2>
              <p>
                THE WEB INITIATIVE LTD is based in Jinja, Uganda. Contact us
                before visiting to confirm the appropriate meeting location.
              </p>
              <a
                className="contact-btn contact-btn-primary"
                href="https://www.google.com/maps/search/?api=1&query=Jinja%2C%20Uganda"
                target="_blank"
                rel="noreferrer"
              >
                Explore Jinja on Maps <MapPin size={17} />
              </a>
            </div>

            <div className="contact-map-card">
              <div className="contact-map-decoration">
                <MapPin size={44} />
              </div>
              <span className="contact-map-kicker">OUR LOCATION</span>
              <h3>Jinja, Uganda</h3>
              <p>Eastern Uganda</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Jinja%2C%20Uganda"
                target="_blank"
                rel="noreferrer"
              >
                Open Google Maps <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="contact-bottom-cta">
          <div className="contact-container contact-bottom-inner">
            <div>
              <span className="contact-label">LET'S WORK TOGETHER</span>
              <h2>Interested in making a difference?</h2>
              <p>
                Discover our community work and find ways to get involved.
              </p>
            </div>

            <div className="contact-bottom-actions">
              <Link to="/medical-camps" className="contact-btn contact-btn-primary">
                Explore Medical Camps <ArrowRight size={17} />
              </Link>
              <Link to="/donate" className="contact-btn contact-btn-light">
                Support Our Work
              </Link>
            </div>
          </div>
        </section>

        <div className="contact-location-strip">
          <CheckCircle2 size={16} />
          <span>THE WEB INITIATIVE LTD · Jinja, Uganda</span>
        </div>
      </main>

      <Footer />
    </>
  );
}
