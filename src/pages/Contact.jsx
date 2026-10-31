
import { useState } from 'react';
import {
  Mail,
  MapPin,
  Send,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { CONTACT_EMAIL } from '../config.js';
import './Contact.css';

// Each topic picks the matching subject in the form when clicked
const HELP_TOPICS = [
  { label: 'Medical camps', subject: 'Medical camps' },
  { label: 'Partnerships', subject: 'Partnership opportunity' },
  { label: 'Donations', subject: 'Donation and support' },
  { label: 'Volunteering', subject: 'Volunteering' },
];

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

  function chooseTopic(subject) {
    setForm((previous) => ({ ...previous, subject }));
    setSubmitted(false);
    // Glide to the message box instead of jumping straight to it
    const message = document.getElementById('contact-message');
    if (message) {
      message.focus({ preventScroll: true });
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      message.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }
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
        {/* HERO */}
        <section className="contact-hero">
          <div className="contact-hero-shade" />

          <div className="contact-container contact-hero-content">
            <span className="contact-kicker contact-kicker-light">
              <span className="contact-kicker-dot" />
              GET IN TOUCH
            </span>

            <h1>
              Let’s start a{' '}
              <span className="hand-accent hand-accent--on-dark">
                conversation.
              </span>
            </h1>

            <p>
              Have a question, want to partner with us, or need more
              information about our work? We would love to hear from you.
            </p>

            <a href="#contact-form" className="contact-btn contact-btn-light">
              Send us a message
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* DETAILS AND FORM */}
        <section className="contact-main" id="contact-form">
          <div className="contact-container">
            <div className="contact-heading">
              <span className="contact-kicker">
                <span className="contact-kicker-dot" />
                CONTACT INFORMATION
              </span>
              <h2>
                We are here{' '}
                <span className="hand-accent">to help.</span>
              </h2>
              <p>
                Reach out to discuss our work, explore partnership
                opportunities or ask a question about The Web Initiative Ltd.
              </p>
            </div>

            <div className="contact-layout">
              <aside className="contact-info-panel" aria-label="Contact details">
                <h3>Contact details</h3>
                <p className="contact-info-intro">
                  Choose the most convenient way to reach our team.
                </p>

                <ul className="contact-info-list">
                  <li>
                    <span className="contact-icon-box">
                      <MapPin size={22} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>Our location</strong>
                      <span>Jinja, Uganda</span>
                      <span>P.O. Box 903588</span>
                    </span>
                  </li>
                  <li>
                    <span className="contact-icon-box">
                      <Mail size={22} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>Email us</strong>
                      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                    </span>
                  </li>
                </ul>

                <div className="contact-topics">
                  <strong>We can help with</strong>
                  <ul>
                    {HELP_TOPICS.map((topic) => (
                      <li key={topic.label}>
                        <button
                          type="button"
                          aria-pressed={form.subject === topic.subject}
                          onClick={() => chooseTopic(topic.subject)}
                        >
                          {topic.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="contact-info-note">
                  <MessageCircle size={22} aria-hidden="true" />
                  <p>
                    For partnerships, outreach programmes and other
                    enquiries, please include a few details so we can
                    understand how to help.
                  </p>
                </div>
              </aside>

              <div className="contact-form-panel">
                <div className="contact-form-heading">
                  <h3>How can we help you?</h3>
                  <p>
                    Fill in the details below. Fields marked * are required.
                  </p>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-form-row">
                    <label className="contact-field">
                      <span>Full name *</span>
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
                      <span>Email address *</span>
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
                      <span>Phone number</span>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="e.g. +256 700 000 000"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </label>

                    <label className="contact-field">
                      <span>Subject *</span>
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
                    <span>Your message *</span>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="6"
                      placeholder="Tell us how we can help..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <button type="submit" className="contact-btn contact-btn-dark contact-submit">
                    Prepare email
                    <Send size={17} aria-hidden="true" />
                  </button>

                  <p className="contact-form-disclaimer">
                    This opens your email app with your message ready to
                    send.
                  </p>

                  {submitted && (
                    <p className="contact-form-status" role="status">
                      Your email application should open with your message.
                      If it does not, please email us directly at{' '}
                      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FIND US */}
        <section className="contact-location" aria-labelledby="contact-location-title">
          <div className="contact-container contact-location-grid">
            <div className="contact-location-copy">
              <span className="contact-kicker">
                <span className="contact-kicker-dot" />
                FIND US
              </span>
              <h2 id="contact-location-title">
                Based in{' '}
                <span className="hand-accent">Jinja, Uganda.</span>
              </h2>
              <p>
                The Web Initiative Ltd is based in Jinja, in Eastern Uganda.
                Please contact us before visiting so we can confirm the right
                meeting place.
              </p>
              <a
                className="contact-text-link"
                href="https://www.google.com/maps/search/?api=1&query=Jinja%2C%20Uganda"
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
                <span className="sr-only"> (opens in a new tab)</span>
                <span aria-hidden="true">
                  <ArrowUpRight size={18} aria-hidden="true" />
                </span>
              </a>
            </div>

            <div className="contact-map">
              <iframe
                title="Map of Jinja, Uganda"
                src="https://www.google.com/maps?q=Jinja,+Uganda&z=12&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
