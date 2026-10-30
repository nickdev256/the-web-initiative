
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  HandHeart,
  ShieldCheck,
  Users,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { CONTACT_EMAIL } from '../config.js';
import './Donate.css';

const donationOptions = [
  { amount: 25, label: '$25' },
  { amount: 50, label: '$50' },
  { amount: 100, label: '$100' },
  { amount: 250, label: '$250' },
];

const donationUses = [
  {
    icon: Stethoscope,
    title: 'Medical Outreach',
    text: 'Help support community outreach activities and access to essential health services.',
  },
  {
    icon: Users,
    title: 'Community Education',
    text: 'Support health awareness and education activities for the communities we serve.',
  },
  {
    icon: HandHeart,
    title: 'Community Support',
    text: 'Help strengthen initiatives that respond to local needs through collaboration.',
  },
];

export default function Donate() {
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('Once');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedAmount =
    customAmount !== '' ? Number(customAmount) : amount;

  const formattedAmount =
    Number.isFinite(selectedAmount) && selectedAmount > 0
      ? selectedAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : '0.00';

  function handleSubmit(event) {
    event.preventDefault();

    if (!Number.isFinite(selectedAmount) || selectedAmount <= 0) {
      return;
    }

    const subject = encodeURIComponent(
      'Donation enquiry - THE WEB INITIATIVE LTD'
    );

    const body = encodeURIComponent(
      `Hello THE WEB INITIATIVE LTD,

I would like to enquire about making a donation.

Name: ${fullName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Amount: $${formattedAmount} USD
Frequency: ${frequency}
Message: ${message || 'None'}

Please share the official donation procedure and payment details.`
    );

    setSubmitted(true);

    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <>
      <Navbar />

      <main className="donate-page">
        <section className="donate-hero">
          <div className="donate-container donate-hero-inner">
            <div className="donate-hero-copy">
              <span className="donate-eyebrow">
                <Heart size={17} />
                MAKE A DIFFERENCE
              </span>

              <h1>
                Your generosity can help
                <span className="hand-accent"> change lives.</span>
              </h1>

              <p>
                Support community-centred health initiatives, medical
                outreach, and health education with THE WEB INITIATIVE LTD.
              </p>

              <a
                href="#donation-form"
                className="donate-btn donate-btn-white"
              >
                Make a Donation <ArrowRight size={18} />
              </a>
            </div>

            <div className="donate-hero-image">
              <img
                src="/images/donate-hero.jpg"
                alt="Community healthcare outreach"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />

              <div className="donate-hero-image-caption">
                <HandHeart size={26} />

                <div>
                  <strong>Every contribution matters</strong>
                  <span>Join us in supporting communities.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="donate-why donate-section">
          <div className="donate-container">
            <div className="donate-section-heading">
              <span className="donate-label">WHY GIVE?</span>

              <h2>Help support work that puts people first.</h2>

              <p>
                Your support can help community programmes grow. We welcome
                individuals and organisations who share our commitment to
                community wellbeing.
              </p>
            </div>

            <div className="donate-use-grid">
              {donationUses.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    className="donate-use-card"
                    key={item.title}
                  >
                    <div className="donate-use-icon">
                      <Icon size={27} />
                    </div>

                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="donate-form-section"
          id="donation-form"
        >
          <div className="donate-container donate-form-layout">
            <div className="donate-form-info">
              <span className="donate-label">
                SUPPORT OUR MISSION
              </span>

              <h2>Choose how you would like to contribute.</h2>

              <p>
                Select an amount in US dollars or enter a custom
                contribution. Submit your details to contact our team
                for verified donation instructions.
              </p>

              <div className="donate-trust-item">
                <ShieldCheck size={22} />

                <div>
                  <strong>Confirm payment details first</strong>
                  <span>
                    Request official payment instructions before sending
                    money.
                  </span>
                </div>
              </div>

              <div className="donate-trust-item">
                <CheckCircle2 size={22} />

                <div>
                  <strong>Discuss your intended contribution</strong>
                  <span>
                    Contact our team if you need help choosing a suitable
                    way to support our work.
                  </span>
                </div>
              </div>

              <div className="donate-contact-card">
                <Mail size={20} />

                <div>
                  <strong>Have a question?</strong>
                  <Link to="/contact">Contact our team</Link>
                </div>
              </div>
            </div>

            <form
              className="donate-form"
              onSubmit={handleSubmit}
            >
              <div className="donate-form-heading">
                <span className="donate-label">
                  CONTRIBUTION DETAILS
                </span>

                <h3>Donation enquiry</h3>
                <p>Complete the form to enquire about donating.</p>
              </div>

              <fieldset className="donate-frequency-field">
                <legend>Contribution frequency</legend>

                <div className="donate-frequency-options">
                  {['Once', 'Monthly'].map((option) => (
                    <button
                      className={`donate-frequency-option ${
                        frequency === option ? 'active' : ''
                      }`}
                      type="button"
                      key={option}
                      onClick={() => setFrequency(option)}
                      aria-pressed={frequency === option}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="donate-amount-field">
                <legend>Select an amount (USD)</legend>

                <div className="donate-amount-grid">
                  {donationOptions.map((option) => (
                    <button
                      type="button"
                      key={option.amount}
                      className={`donate-amount-option ${
                        customAmount === '' &&
                        amount === option.amount
                          ? 'active'
                          : ''
                      }`}
                      onClick={() => {
                        setAmount(option.amount);
                        setCustomAmount('');
                      }}
                      aria-pressed={
                        customAmount === '' &&
                        amount === option.amount
                      }
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="donate-field">
                Custom amount (USD)

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter another amount"
                  value={customAmount}
                  onChange={(event) =>
                    setCustomAmount(event.target.value)
                  }
                />
              </label>

              <label className="donate-field">
                Full name

                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  required
                />
              </label>

              <label className="donate-field">
                Email address

                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </label>

              <label className="donate-field">
                Phone number (optional)

                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder="Your phone number"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                />
              </label>

              <label className="donate-field">
                Message (optional)

                <textarea
                  rows="3"
                  placeholder="Tell us what you would like to support..."
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                />
              </label>

              <div className="donate-selected-summary">
                <span>Selected contribution</span>

                <strong>
                  ${formattedAmount} USD
                  {' / '}
                  {frequency === 'Monthly' ? 'month' : 'once'}
                </strong>
              </div>

              <button
                className="donate-btn donate-submit-btn"
                type="submit"
              >
                Send Donation Enquiry <ArrowRight size={18} />
              </button>

              <p className="donate-form-disclaimer">
                This form sends an enquiry by email. It does not process
                a payment or automatically create a recurring donation.
              </p>

              {submitted && (
                <p className="donate-form-status" role="status">
                  Your email application should open with your enquiry.
                  If it does not, please email us directly at{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
              )}
            </form>
          </div>
        </section>

        <section className="donate-bottom-cta">
          <div className="donate-container donate-bottom-inner">
            <div>
              <span className="donate-label">
                LET'S WORK TOGETHER
              </span>

              <h2>Interested in partnering with us?</h2>

              <p>
                We welcome conversations with organisations, community
                groups, and individuals interested in supporting our mission.
              </p>
            </div>

            <Link
              to="/contact"
              className="donate-btn donate-btn-primary"
            >
              Contact Us <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <div className="donate-location">
          <MapPin size={17} />
          <span>THE WEB INITIATIVE LTD · Jinja, Uganda</span>
        </div>
      </main>

      <Footer />
    </>
  );
}
