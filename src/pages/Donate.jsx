import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Apple,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CreditCard,
  HandHeart,
  Heart,
  Info,
  LoaderCircle,
  Lock,
  Mail,
  MapPin,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Users,
  Wallet,
} from 'lucide-react';

import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { createDonationCheckout } from '../services/donationService.js';
import './Donate.css';

/* =========================================================
   CONFIGURATION
   ========================================================= */

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

const causes = [
  {
    id: 'nutrition',
    title: 'Child Nutrition Support',
    description: 'Nutritious food and nutritional support for vulnerable children.',
    icon: Apple,
  },
  {
    id: 'medical',
    title: 'Medical Outreach',
    description: 'Medical camps, healthcare services and essential supplies.',
    icon: Stethoscope,
  },
  {
    id: 'education',
    title: 'Health Education',
    description: 'Practical health and nutrition education for families.',
    icon: BookOpen,
  },
  {
    id: 'general',
    title: 'Where Most Needed',
    description: 'Direct your gift to the programme with the greatest need.',
    icon: HandHeart,
  },
];

const frequencies = [
  { id: 'Once', label: 'One-time', suffix: '' },
  { id: 'Monthly', label: 'Monthly', suffix: ' / month' },
];

const currencies = {
  UGX: { label: 'Ugandan Shilling', amounts: [10000, 25000, 50000, 100000], minimum: 1000, decimals: 0 },
  USD: { label: 'US Dollar', amounts: [10, 25, 50, 100], minimum: 1, decimals: 2 },
  GBP: { label: 'British Pound', amounts: [10, 25, 50, 100], minimum: 1, decimals: 2 },
  EUR: { label: 'Euro', amounts: [10, 25, 50, 100], minimum: 1, decimals: 2 },
};

const paymentMethods = [
  {
    id: 'card',
    title: 'Visa / Mastercard',
    description: 'Pay securely using your Visa or Mastercard.',
    brand: 'card',
    icon: CreditCard,
    status: 'Supported when card checkout is configured',
  },
  {
    id: 'paypal',
    title: 'PayPal',
    description: 'Pay with your PayPal account where merchant receiving is enabled.',
    brand: 'paypal',
    icon: Wallet,
    status: 'Receiving availability depends on your PayPal merchant account',
    unsupportedCurrencies: ['UGX'],
  },
  {
    id: 'google_pay',
    title: 'Google Pay',
    description: 'Availability depends on your device, country and payment provider.',
    brand: 'google_pay',
    icon: Smartphone,
    status: 'Coming soon',
    disabled: true,
  },
  {
    id: 'mtn_mobile_money',
    title: 'MTN Mobile Money',
    description: 'Pay using your MTN Mobile Money account.',
    brand: 'mtn',
    icon: Smartphone,
    status: 'Requires an active DPO Pay / mobile money integration',
  },
  {
    id: 'airtel_money',
    title: 'Airtel Money',
    description: 'Pay using your Airtel Money account.',
    brand: 'airtel',
    icon: Smartphone,
    status: 'Requires an active DPO Pay / mobile money integration',
  },
];

const MOBILE_MONEY_METHODS = ['mtn_mobile_money', 'airtel_money'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_LIMIT = 500;

/**
 * Logo files: public/images/payments/<file>.svg
 * A missing file shows a text badge instead of a broken image.
 */
const brandLogos = {
  card: [
    { src: '/images/payments/visa.svg', alt: 'Visa', fallback: 'VISA' },
    { src: '/images/payments/mastercard.svg', alt: 'Mastercard', fallback: 'Mastercard' },
  ],
  paypal: [{ src: '/images/payments/paypal.svg', alt: 'PayPal', fallback: 'PayPal' }],
  google_pay: [{ src: '/images/payments/google-pay.svg', alt: 'Google Pay', fallback: 'G Pay' }],
  mtn: [{ src: '/images/payments/mtn-momo.svg', alt: 'MTN Mobile Money', fallback: 'MTN MoMo' }],
  airtel: [{ src: '/images/payments/airtel-money.svg', alt: 'Airtel Money', fallback: 'Airtel Money' }],
};

/* =========================================================
   HELPERS
   ========================================================= */

function formatMoney(value, currency) {
  const { decimals } = currencies[currency];

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: Number.isInteger(value) ? 0 : decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Digits only, at most one decimal point, limited to the currency's decimals. */
function sanitizeAmount(raw, decimals) {
  const cleaned = raw.replace(/[^\d.]/g, '');

  if (decimals === 0) return cleaned.replace(/\./g, '');

  const [whole, ...rest] = cleaned.split('.');
  if (rest.length === 0) return whole;

  return `${whole}.${rest.join('').slice(0, decimals)}`;
}

/** Keeps the 9 local digits of a Ugandan mobile number (7XXXXXXXX). */
function toLocalMobile(value) {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('256')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);

  return digits.slice(0, 9);
}

function formatLocalMobile(value) {
  return [value.slice(0, 3), value.slice(3, 6), value.slice(6, 9)]
    .filter(Boolean)
    .join(' ');
}

const isValidLocalMobile = (digits) => /^7\d{8}$/.test(digits);

const supportsCurrency = (method, code) =>
  !method?.unsupportedCurrencies?.includes(code);

/* =========================================================
   SMALL COMPONENTS
   ========================================================= */

function BrandLogo({ src, alt, fallback }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="donate-logo-fallback" role="img" aria-label={alt}>
        {fallback}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable="false"
      onError={() => setFailed(true)}
    />
  );
}

function BrandLogos({ brand }) {
  return (
    <span className={`donate-brand-logos donate-brand-${brand}`}>
      {brandLogos[brand].map((logo) => (
        <BrandLogo key={logo.src} {...logo} />
      ))}
    </span>
  );
}

function FieldError({ id, children }) {
  if (!children) return null;

  return (
    <span className="donate-field-error" id={id} role="alert">
      <AlertCircle size={14} />
      {children}
    </span>
  );
}

function HeroImage() {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`donate-hero-image ${failed ? 'is-placeholder' : ''}`}>
      {failed ? (
        <div className="donate-hero-placeholder" aria-hidden="true">
          <Heart size={64} strokeWidth={1.4} />
        </div>
      ) : (
        <img
          src="/images/donate-hero.jpg"
          alt="Community healthcare outreach"
          onError={() => setFailed(true)}
        />
      )}

      <div className="donate-hero-image-caption">
        <span className="donate-hero-caption-icon">
          <HandHeart size={22} />
        </span>

        <div>
          <strong>Every contribution matters</strong>
          <span>Join us in supporting communities.</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

export default function Donate() {
  const [cause, setCause] = useState('nutrition');
  const [currency, setCurrency] = useState('UGX');
  const [amount, setAmount] = useState(25000);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('Once');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const fieldRefs = {
    amount: useRef(null),
    phone: useRef(null),
    fullName: useRef(null),
    email: useRef(null),
  };

  const config = currencies[currency];
  const selectedMethod = paymentMethods.find((method) => method.id === paymentMethod);
  const selectedCause = causes.find((item) => item.id === cause);
  const selectedFrequency = frequencies.find((item) => item.id === frequency);

  const selectedAmount = customAmount !== '' ? Number(customAmount) : amount;
  const validAmount =
    Number.isFinite(selectedAmount) && selectedAmount >= config.minimum;

  const isMobileMoney = MOBILE_MONEY_METHODS.includes(paymentMethod);
  const isPayPal = paymentMethod === 'paypal';

  const totalLabel = validAmount
    ? `${formatMoney(selectedAmount, currency)}${selectedFrequency.suffix}`
    : '—';

  /* ---------- state helpers ---------- */

  const clearError = (key) => {
    setErrors((current) => (current[key] ? { ...current, [key]: '' } : current));
    setFormError('');
  };

  const changeCurrency = (code) => {
    setCurrency(code);
    setAmount(currencies[code].amounts[1]);
    setCustomAmount('');
    setNotice('');
    clearError('amount');
  };

  const changePaymentMethod = (id) => {
    const method = paymentMethods.find((item) => item.id === id);
    if (!method || method.disabled) return;

    setPaymentMethod(id);
    clearError('phone');

    if (!supportsCurrency(method, currency)) {
      changeCurrency('USD');
      setNotice(
        `${method.title} does not support ${currency} checkout, so your donation currency has been changed to USD.`
      );
    } else {
      setNotice('');
    }
  };

  /* ---------- validation + submit ---------- */

  const validate = () => {
    const next = {};

    if (!validAmount) {
      next.amount = `Enter at least ${formatMoney(config.minimum, currency)}.`;
    } else if (!supportsCurrency(selectedMethod, currency)) {
      next.amount = `${selectedMethod.title} does not support ${currency}. Please choose another currency.`;
    }

    if (isMobileMoney && !isValidLocalMobile(phone)) {
      next.phone = phone
        ? 'Enter a valid Ugandan mobile number, e.g. 772 123 456.'
        : 'Please enter your mobile money number.';
    }

    if (!fullName.trim()) {
      next.fullName = 'Please enter your full name.';
    }

    if (!email.trim()) {
      next.email = 'Please enter your email address.';
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }

    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setFormError('');

    const nextErrors = validate();
    setErrors(nextErrors);

    const firstInvalid = ['amount', 'phone', 'fullName', 'email'].find(
      (key) => nextErrors[key]
    );

    if (firstInvalid) {
      fieldRefs[firstInvalid].current?.focus();
      return;
    }

    const donationData = {
      cause,
      amount: selectedAmount,
      currency,
      frequency,
      paymentMethod,
      fullName: fullName.trim(),
      email: email.trim(),
      ...(isMobileMoney && { phoneNumber: `256${phone}` }),
      message: message.trim(),
    };

    try {
      setLoading(true);

      const result = await createDonationCheckout(donationData);

      if (!result?.checkoutUrl) {
        throw new Error('The payment provider did not return a checkout link.');
      }

      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setFormError(
        error?.message ||
          'Online checkout is not available yet. Please contact our team for verified donation instructions.'
      );
      setLoading(false);
    }
  };

  /* ---------- render ---------- */

  return (
    <>
      <Navbar />

      <main className="donate-page">
        {/* ================= HERO ================= */}
        <section className="donate-hero">
          <div className="donate-container donate-hero-inner">
            <div className="donate-hero-copy">
              <span className="donate-eyebrow">
                <Heart size={16} />
                Make a difference
              </span>

              <h1>
                Your generosity can help
                <span> change lives.</span>
              </h1>

              <p>
                Support community-centred health initiatives, medical outreach
                and health education with THE WEB INITIATIVE LTD.
              </p>

              <div className="donate-hero-actions">
                <a href="#donation-form" className="donate-btn donate-btn-white">
                  Make a Donation
                  <ArrowRight size={18} />
                </a>

                <Link to="/contact" className="donate-btn donate-btn-ghost">
                  Talk to our team
                </Link>
              </div>

              <ul className="donate-hero-trust">
                <li>
                  <ShieldCheck size={16} /> Secure provider checkout
                </li>
                <li>
                  <CreditCard size={16} /> Visa &amp; Mastercard
                </li>
                <li>
                  <Wallet size={16} /> PayPal
                </li>
                <li>
                  <Smartphone size={16} /> MTN &amp; Airtel Money
                </li>
              </ul>
            </div>

            <HeroImage />
          </div>
        </section>

        {/* ================= WHY GIVE ================= */}
        <section className="donate-section donate-why">
          <div className="donate-container">
            <div className="donate-section-heading">
              <span className="donate-label">Why give?</span>
              <h2>Help support work that puts people first.</h2>
              <p>
                Your support can help community programmes grow. We welcome
                individuals and organisations who share our commitment to
                community wellbeing.
              </p>
            </div>

            <div className="donate-use-grid">
              {donationUses.map(({ icon: Icon, title, text }) => (
                <article className="donate-use-card" key={title}>
                  <div className="donate-use-icon">
                    <Icon size={26} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= DONATION FORM ================= */}
        <section className="donate-form-section" id="donation-form">
          <div className="donate-container donate-form-layout">
            {/* ---------- left info column ---------- */}
            <aside className="donate-form-info">
              <span className="donate-label">Support our mission</span>
              <h2>Choose how you would like to contribute.</h2>
              <p>
                Select a programme, contribution amount and payment method. Your
                payment will continue through the configured provider's secure
                checkout.
              </p>

              <div className="donate-trust-list">
                <div className="donate-trust-item">
                  <span className="donate-trust-icon">
                    <ShieldCheck size={20} />
                  </span>
                  <div>
                    <strong>Secure payment details</strong>
                    <span>
                      Card and wallet details are entered only on the payment
                      provider's secure checkout.
                    </span>
                  </div>
                </div>

                <div className="donate-trust-item">
                  <span className="donate-trust-icon">
                    <CheckCircle2 size={20} />
                  </span>
                  <div>
                    <strong>Support communities</strong>
                    <span>
                      Your contribution supports nutrition, healthcare and
                      community education.
                    </span>
                  </div>
                </div>
              </div>

              {/* Live summary (desktop) */}
              <div className="donate-side-summary" aria-hidden="true">
                <span className="donate-side-summary-label">Your donation</span>
                <strong className="donate-side-summary-total">{totalLabel}</strong>
                <ul>
                  <li>
                    <span>Supporting</span>
                    <b>{selectedCause.title}</b>
                  </li>
                  <li>
                    <span>Frequency</span>
                    <b>{selectedFrequency.label}</b>
                  </li>
                  <li>
                    <span>Paying with</span>
                    <b>{selectedMethod.title}</b>
                  </li>
                </ul>
              </div>

              <div className="donate-contact-card">
                <span className="donate-trust-icon">
                  <Mail size={19} />
                </span>
                <div>
                  <strong>Have a question?</strong>
                  <Link to="/contact">
                    Contact our team <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </aside>

            {/* ---------- form ---------- */}
            <form className="donate-form" onSubmit={handleSubmit} noValidate>
              <div className="donate-form-heading">
                <span className="donate-label">Contribution details</span>
                <h3>Make your donation</h3>
                <p>Complete the details below to continue to payment.</p>
              </div>

              {/* 01 CAUSE */}
              <fieldset className="donate-form-fieldset">
                <legend>
                  <span className="donate-step">1</span>
                  What would you like to support?
                </legend>

                <div className="donate-cause-options">
                  {causes.map(({ id, title, description, icon: Icon }) => (
                    <label
                      key={id}
                      className={`donate-cause-option ${cause === id ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="cause"
                        value={id}
                        checked={cause === id}
                        onChange={() => setCause(id)}
                        className="donate-sr-only"
                      />

                      <span className="donate-cause-icon" aria-hidden="true">
                        <Icon size={20} />
                      </span>

                      <span className="donate-cause-copy">
                        <strong>{title}</strong>
                        <small>{description}</small>
                      </span>

                      <CheckCircle2
                        size={19}
                        className="donate-cause-check"
                        aria-hidden="true"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* 02 FREQUENCY */}
              <fieldset className="donate-form-fieldset">
                <legend>
                  <span className="donate-step">2</span>
                  Contribution frequency
                </legend>

                <div className="donate-segmented" role="radiogroup" aria-label="Frequency">
                  {frequencies.map((option) => (
                    <label
                      key={option.id}
                      className={`donate-segment ${frequency === option.id ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="frequency"
                        value={option.id}
                        checked={frequency === option.id}
                        onChange={() => setFrequency(option.id)}
                        className="donate-sr-only"
                      />
                      {option.id === 'Monthly' && <Heart size={14} />}
                      {option.label}
                    </label>
                  ))}
                </div>

                {frequency === 'Monthly' && (
                  <p className="donate-hint">
                    <Info size={14} />
                    Monthly giving is recorded as your preference. Automatic
                    recurring billing starts only once the provider supports it.
                  </p>
                )}
              </fieldset>

              {/* 03 AMOUNT */}
              <fieldset className="donate-form-fieldset">
                <legend>
                  <span className="donate-step">3</span>
                  Choose an amount
                </legend>

                <div
                  className="donate-segmented donate-currency-options"
                  role="radiogroup"
                  aria-label="Donation currency"
                >
                  {Object.entries(currencies).map(([code, item]) => {
                    const unavailable = !supportsCurrency(selectedMethod, code);

                    return (
                      <label
                        key={code}
                        className={`donate-segment ${currency === code ? 'active' : ''} ${
                          unavailable ? 'is-disabled' : ''
                        }`}
                        title={
                          unavailable
                            ? `${item.label} is not available with ${selectedMethod.title}`
                            : item.label
                        }
                      >
                        <input
                          type="radio"
                          name="currency"
                          value={code}
                          checked={currency === code}
                          disabled={unavailable}
                          onChange={() => changeCurrency(code)}
                          className="donate-sr-only"
                        />
                        {code}
                      </label>
                    );
                  })}
                </div>

                {notice && (
                  <p className="donate-notice" role="status">
                    <Info size={15} />
                    {notice}
                  </p>
                )}

                <div className="donate-amount-grid">
                  {config.amounts.map((value) => {
                    const active = customAmount === '' && amount === value;

                    return (
                      <button
                        type="button"
                        key={value}
                        className={`donate-amount-option ${active ? 'active' : ''}`}
                        aria-pressed={active}
                        onClick={() => {
                          setAmount(value);
                          setCustomAmount('');
                          clearError('amount');
                        }}
                      >
                        {formatMoney(value, currency)}
                      </button>
                    );
                  })}
                </div>

                <div className="donate-field">
                  <label htmlFor="donate-custom-amount">Or enter a custom amount</label>

                  <div
                    className={`donate-input-group ${customAmount !== '' ? 'is-filled' : ''} ${
                      errors.amount ? 'has-error' : ''
                    }`}
                  >
                    <span className="donate-input-prefix">{currency}</span>
                    <input
                      ref={fieldRefs.amount}
                      id="donate-custom-amount"
                      type="text"
                      inputMode={config.decimals ? 'decimal' : 'numeric'}
                      placeholder={`Minimum ${formatMoney(config.minimum, currency)}`}
                      value={customAmount}
                      onChange={(event) => {
                        setCustomAmount(sanitizeAmount(event.target.value, config.decimals));
                        clearError('amount');
                      }}
                      aria-invalid={Boolean(errors.amount)}
                      aria-describedby={errors.amount ? 'amount-error' : undefined}
                    />
                  </div>

                  <FieldError id="amount-error">{errors.amount}</FieldError>
                </div>
              </fieldset>

              {/* 04 PAYMENT */}
              <fieldset className="donate-form-fieldset">
                <legend>
                  <span className="donate-step">4</span>
                  Choose payment method
                </legend>

                <div className="donate-payment-options">
                  {paymentMethods.map((method) => {
                    const active = paymentMethod === method.id;

                    return (
                      <label
                        key={method.id}
                        className={`donate-payment-option ${active ? 'active' : ''} ${
                          method.disabled ? 'is-disabled' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={active}
                          disabled={Boolean(method.disabled)}
                          onChange={() => changePaymentMethod(method.id)}
                          className="donate-sr-only"
                        />

                        <span className="donate-payment-radio" aria-hidden="true" />

                        <span className="donate-payment-details">
                          <strong>
                            {method.title}
                            {method.disabled && (
                              <em className="donate-badge">Coming soon</em>
                            )}
                          </strong>
                          <small>{method.description}</small>
                          {!method.disabled && (
                            <small className="donate-payment-status">{method.status}</small>
                          )}
                        </span>

                        <BrandLogos brand={method.brand} />
                      </label>
                    );
                  })}
                </div>

                {paymentMethod === 'card' && (
                  <div className="donate-payment-instructions">
                    <CreditCard size={19} />
                    <p>
                      You will be redirected to the payment provider's secure
                      checkout to enter your card details.{' '}
                      <strong>Never enter card details on this page.</strong>
                    </p>
                  </div>
                )}

                {isPayPal && (
                  <div className="donate-payment-instructions">
                    <Wallet size={19} />
                    <p>
                      You will be redirected to PayPal to log in and approve your
                      donation. PayPal is not offered in UGX, so{' '}
                      <strong>USD, GBP or EUR</strong> must be selected.
                    </p>
                  </div>
                )}

                {isMobileMoney && (
                  <div className="donate-payment-instructions">
                    <Smartphone size={19} />
                    <p>
                      Enter the Ugandan number registered to your{' '}
                      <strong>{selectedMethod.title}</strong> account. A payment
                      prompt is sent to your phone once checkout starts.
                    </p>

                    <div className="donate-field">
                      <label htmlFor="donate-phone">Mobile money number</label>

                      <div className={`donate-input-group ${errors.phone ? 'has-error' : ''}`}>
                        <span className="donate-input-prefix">+256</span>
                        <input
                          ref={fieldRefs.phone}
                          id="donate-phone"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          placeholder="772 123 456"
                          value={formatLocalMobile(phone)}
                          onChange={(event) => {
                            setPhone(toLocalMobile(event.target.value));
                            clearError('phone');
                          }}
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                        />
                        {isValidLocalMobile(phone) && (
                          <CheckCircle2 size={18} className="donate-input-valid" aria-hidden="true" />
                        )}
                      </div>

                      <FieldError id="phone-error">{errors.phone}</FieldError>
                    </div>
                  </div>
                )}
              </fieldset>

              {/* 05 DETAILS */}
              <fieldset className="donate-form-fieldset">
                <legend>
                  <span className="donate-step">5</span>
                  Your details
                </legend>

                <div className="donate-field-row">
                  <div className="donate-field">
                    <label htmlFor="donate-name">Full name</label>
                    <input
                      ref={fieldRefs.fullName}
                      id="donate-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      className={errors.fullName ? 'has-error' : ''}
                      value={fullName}
                      onChange={(event) => {
                        setFullName(event.target.value);
                        clearError('fullName');
                      }}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'name-error' : undefined}
                    />
                    <FieldError id="name-error">{errors.fullName}</FieldError>
                  </div>

                  <div className="donate-field">
                    <label htmlFor="donate-email">Email address</label>
                    <input
                      ref={fieldRefs.email}
                      id="donate-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={errors.email ? 'has-error' : ''}
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        clearError('email');
                      }}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    <FieldError id="email-error">{errors.email}</FieldError>
                  </div>
                </div>

                <div className="donate-field">
                  <label htmlFor="donate-message">
                    Message <span className="donate-optional">(optional)</span>
                  </label>
                  <textarea
                    id="donate-message"
                    rows="3"
                    maxLength={MESSAGE_LIMIT}
                    placeholder="Tell us anything you would like us to know..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                  />
                  <span className="donate-char-count">
                    {message.length}/{MESSAGE_LIMIT}
                  </span>
                </div>
              </fieldset>

              {/* SUMMARY */}
              <div className="donate-selected-summary" aria-live="polite">
                <div>
                  <span>Selected contribution</span>
                  <small>
                    {selectedCause.title} · {selectedMethod.title}
                  </small>
                </div>
                <strong>{validAmount ? totalLabel : 'Enter a valid amount'}</strong>
              </div>

              {formError && (
                <div className="donate-form-error" role="alert">
                  <AlertCircle size={18} />
                  <span>{formError}</span>
                </div>
              )}

              <button
                className={`donate-btn donate-submit-btn ${isPayPal ? 'is-paypal' : ''}`}
                type="submit"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="donate-loading-icon" />
                    {isPayPal ? 'Connecting to PayPal…' : 'Preparing secure checkout…'}
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    {validAmount ? `Donate ${totalLabel}` : 'Continue to payment'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="donate-form-disclaimer">
                Payment processing depends on the payment provider integrations
                and merchant account settings. Monthly selection is a donor
                preference and recurring billing must be enabled by the provider
                before it can be charged automatically.
              </p>
            </form>
          </div>
        </section>

        {/* ================= BOTTOM CTA ================= */}
        <section className="donate-bottom-cta">
          <div className="donate-container">
            <div className="donate-bottom-inner">
              <div>
                <span className="donate-label donate-label-light">Let's work together</span>
                <h2>Interested in partnering with us?</h2>
                <p>
                  We welcome conversations with organisations, community groups
                  and individuals interested in supporting our mission.
                </p>
              </div>

              <Link to="/contact" className="donate-btn donate-btn-white">
                Contact Us
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= LOCATION ================= */}
        <div className="donate-location">
          <MapPin size={16} />
          <span>THE WEB INITIATIVE LTD · Jinja, Uganda</span>
        </div>
      </main>

      <Footer />
    </>
  );
}