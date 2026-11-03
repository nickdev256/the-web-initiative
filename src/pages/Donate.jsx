import React, { useRef, useState } from 'react';

import {
  Apple,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  HandHeart,
  Heart,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  User,
  Wallet,
} from 'lucide-react';

import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { createDonationCheckout } from '../services/donationService.js';
import './Donate.css';

/* ---------------------------------------------------------
   CONFIGURATION
--------------------------------------------------------- */

const causes = [
  {
    id: 'nutrition',
    title: 'Child Nutrition Support',
    description:
      'Nutritious food and nutritional support for vulnerable children.',
    icon: Apple,
  },
  {
    id: 'medical',
    title: 'Medical Outreach',
    description:
      'Medical camps, healthcare services and essential supplies.',
    icon: Stethoscope,
  },
  {
    id: 'education',
    title: 'Health Education',
    description:
      'Practical health and nutrition education for families.',
    icon: BookOpen,
  },
  {
    id: 'general',
    title: 'Where Most Needed',
    description:
      'Let us direct your gift to the programme with the greatest need.',
    icon: HandHeart,
  },
];

const currencies = {
  UGX: {
    label: 'Ugandan Shilling',
    amounts: [10000, 25000, 50000, 100000],
    minimum: 1000,
    decimals: 0,
  },
  USD: {
    label: 'US Dollar',
    amounts: [10, 25, 50, 100],
    minimum: 1,
    decimals: 2,
  },
  GBP: {
    label: 'British Pound',
    amounts: [10, 25, 50, 100],
    minimum: 1,
    decimals: 2,
  },
  EUR: {
    label: 'Euro',
    amounts: [10, 25, 50, 100],
    minimum: 1,
    decimals: 2,
  },
};

/*
  IMPORTANT:
  These are frontend payment options. They do not become
  operational until the relevant payment provider is configured
  on the backend.
*/

const paymentMethods = [
  {
    id: 'card',
    title: 'Visa / Mastercard',
    description:
      'Pay by Visa or Mastercard through a secure, eligible card processor.',
    brand: 'card',
    status: 'Supported',
  },
  {
    id: 'paypal',
    title: 'PayPal wallet',
    description:
      'Pay with your PayPal balance where merchant receiving is enabled.',
    brand: 'paypal',
    status: 'Where receiving is enabled',
    unsupportedCurrencies: ['UGX'],
  },
  {
    id: 'google_pay',
    title: 'Google Pay',
    description:
      'Availability depends on the donor country, device and payment provider.',
    brand: 'google_pay',
    status: 'Limited availability',
    disabled: true,
  },
  {
    id: 'mtn_mobile_money',
    title: 'MTN Mobile Money',
    description:
      'Local mobile money checkout through DPO Pay.',
    brand: 'mtn',
    status: 'DPO integration required',
  },
  {
    id: 'airtel_money',
    title: 'Airtel Money',
    description:
      'Local mobile money checkout through DPO Pay.',
    brand: 'airtel',
    status: 'DPO integration required',
  },
];

const MOBILE_MONEY_METHODS = [
  'mtn_mobile_money',
  'airtel_money',
];

const brandLogos = {
  card: [
    {
      src: '/images/payments/visa.svg',
      alt: 'Visa',
      fallback: 'VISA',
    },
    {
      src: '/images/payments/mastercard.svg',
      alt: 'Mastercard',
      fallback: 'MC',
    },
  ],

  paypal: [
    {
      src: '/images/payments/paypal.svg',
      alt: 'PayPal',
      fallback: 'PayPal',
    },
  ],

  google_pay: [
    {
      src: '/images/payments/google-pay.svg',
      alt: 'Google Pay',
      fallback: 'G Pay',
    },
  ],

  mtn: [
    {
      src: '/images/payments/mtn-momo.svg',
      alt: 'MTN Mobile Money',
      fallback: 'MoMo',
    },
  ],

  airtel: [
    {
      src: '/images/payments/airtel-money.svg',
      alt: 'Airtel Money',
      fallback: 'Airtel',
    },
  ],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

function formatMoney(value, currency) {
  const { decimals } = currencies[currency];

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: Number.isInteger(value) ? 0 : decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function currencyPrefix(currency) {
  return (
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    })
      .formatToParts(0)
      .find((part) => part.type === 'currency')?.value ?? currency
  );
}

function sanitizeAmount(raw, decimals) {
  const cleaned = raw.replace(/[^\d.]/g, '');

  if (decimals === 0) {
    return cleaned.replace(/\./g, '');
  }

  const [whole, ...rest] = cleaned.split('.');

  if (rest.length === 0) return whole;

  return `${whole}.${rest.join('').slice(0, decimals)}`;
}

function toLocalMobile(raw) {
  let digits = raw.replace(/\D/g, '');

  if (digits.startsWith('256')) {
    digits = digits.slice(3);
  }

  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 9);
}

function formatLocalMobile(digits) {
  return [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 9),
  ]
    .filter(Boolean)
    .join(' ');
}

const isValidLocalMobile = (digits) => /^7\d{8}$/.test(digits);

const supportsCurrency = (method, currency) =>
  !method.unsupportedCurrencies?.includes(currency);

/* ---------------------------------------------------------
   SMALL COMPONENTS
--------------------------------------------------------- */

function BrandLogo({ src, alt, fallback }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="payment-logo-fallback"
        role="img"
        aria-label={alt}
      >
        {fallback}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function PaymentBrand({ brand }) {
  return (
    <span className={`payment-brand payment-brand-${brand}`}>
      {brandLogos[brand]?.map((logo) => (
        <BrandLogo key={logo.src} {...logo} />
      ))}
    </span>
  );
}

function StepHeading({ number, title, description }) {
  return (
    <div className="donate-step-heading">
      <span className="donate-step-number" aria-hidden="true">
        {number}
      </span>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function FieldError({ id, message }) {
  if (!message) return null;

  return (
    <span className="donate-field-error" id={id}>
      <AlertCircle size={14} />
      {message}
    </span>
  );
}

/* ---------------------------------------------------------
   DONATION PAGE
--------------------------------------------------------- */

export default function Donate() {
  const [cause, setCause] = useState('nutrition');

  // PayPal-first display. UGX is not used for PayPal checkout.
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [currencyNotice, setCurrencyNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const fieldRefs = {
    amount: useRef(null),
    phone: useRef(null),
    fullName: useRef(null),
    email: useRef(null),
  };

  const config = currencies[currency];

  const selectedAmount =
    customAmount !== '' ? Number(customAmount) : amount;

  const validAmount =
    Number.isFinite(selectedAmount) &&
    selectedAmount >= config.minimum;

  const isMobileMoney =
    MOBILE_MONEY_METHODS.includes(paymentMethod);

  const isPayPal = paymentMethod === 'paypal';

  const selectedCause = causes.find(
    (item) => item.id === cause
  );

  const selectedMethod = paymentMethods.find(
    (item) => item.id === paymentMethod
  );

  /* ---------------------------------------------------------
     FORM HELPERS
  --------------------------------------------------------- */

  const clearError = (key) => {
    setFormError('');

    setErrors((current) =>
      current[key]
        ? { ...current, [key]: undefined }
        : current
    );
  };

  const changeCurrency = (code) => {
    setCurrency(code);
    setAmount(currencies[code].amounts[1]);
    setCustomAmount('');
    setCurrencyNotice('');
    clearError('amount');
  };

  const changePaymentMethod = (methodId) => {
    const method = paymentMethods.find(
      (item) => item.id === methodId
    );

    if (!method || method.disabled) return;

    setPaymentMethod(methodId);
    clearError('phone');

    if (!supportsCurrency(method, currency)) {
      setCurrency('USD');
      setAmount(currencies.USD.amounts[1]);
      setCustomAmount('');

      setCurrencyNotice(
        `${method.title} does not accept ${currency}. Your donation currency has been changed to USD.`
      );
    } else {
      setCurrencyNotice('');
    }
  };

  /* ---------------------------------------------------------
     VALIDATION
  --------------------------------------------------------- */

  const validate = () => {
    const next = {};

    if (!validAmount) {
      next.amount = `The minimum donation is ${formatMoney(
        config.minimum,
        currency
      )}.`;
    } else if (!supportsCurrency(selectedMethod, currency)) {
      next.amount = `${selectedMethod.title} does not accept ${currency}. Please choose another currency.`;
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

  /* ---------------------------------------------------------
     SUBMIT DONATION
  --------------------------------------------------------- */

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const nextErrors = validate();
    setErrors(nextErrors);

    const firstInvalid = [
      'amount',
      'phone',
      'fullName',
      'email',
    ].find((key) => nextErrors[key]);

    if (firstInvalid) {
      fieldRefs[firstInvalid].current?.focus();
      return;
    }

    const donationData = {
      cause,
      amount: selectedAmount,
      currency,
      paymentMethod,
      fullName: fullName.trim(),
      email: email.trim(),
      ...(isMobileMoney && {
        phoneNumber: `256${phone}`,
      }),
    };

    try {
      setLoading(true);

      const result = await createDonationCheckout(donationData);

      if (!result?.checkoutUrl) {
        throw new Error(
          'The payment provider did not return a checkout link.'
        );
      }

      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setFormError(
        error.message ||
          'Unable to start your donation. Please try again.'
      );

      setLoading(false);
    }
  };

  const submitLabel = isPayPal ? 'with PayPal' : '';

  /* ---------------------------------------------------------
     PAGE UI
  --------------------------------------------------------- */

  return (
    <>
      <Navbar />

      <main className="donate-page">

        {/* HERO */}

        <section className="donate-hero">
          <div className="donate-container">
            <div className="donate-hero-content">

              <span className="donate-eyebrow">
                <Heart size={16} />
                MAKE A DIFFERENCE
              </span>

              <h1>
                Your generosity can
                <span> change lives.</span>
              </h1>

              <p>
                Your contribution helps us improve nutrition,
                support healthcare and empower vulnerable
                families in underserved communities.
              </p>

              <div className="donate-hero-actions">

                <a
                  href="#donation-form"
                  className="donate-hero-button"
                >
                  Donate now <ArrowRight size={18} />
                </a>

                <ul className="donate-hero-trust">
                  <li>
                    <ShieldCheck size={17} />
                    Secure checkout
                  </li>

                  <li>
                    <CreditCard size={17} />
                    Visa &amp; Mastercard
                  </li>

                  <li>
                    <Wallet size={17} />
                    PayPal wallet
                  </li>

                  <li>
                    <Smartphone size={17} />
                    MTN &amp; Airtel Money
                  </li>
                </ul>

              </div>
            </div>
          </div>
        </section>

        {/* DONATION FORM */}

        <section
          className="donate-section"
          id="donation-form"
        >
          <div className="donate-container">

            <div className="donate-section-heading">
              <span className="donate-section-label">
                YOUR CONTRIBUTION
              </span>

              <h2>Make your donation</h2>

              <p>
                Choose where your gift goes, pick an amount
                and complete your donation securely in a few steps.
              </p>
            </div>

            <div className="donate-layout">

              {/* FORM */}

              <form
                className="donate-form"
                onSubmit={handleSubmit}
                noValidate
              >

                {/* 01 CAUSE */}

                <fieldset className="donate-form-section">
                  <legend className="donate-sr-only">
                    Donation purpose
                  </legend>

                  <StepHeading
                    number="01"
                    title="Choose your donation purpose"
                    description="Select the programme you would like to support."
                  />

                  <div className="donate-causes">
                    {causes.map(
                      ({
                        id,
                        title,
                        description,
                        icon: Icon,
                      }) => {
                        const active = cause === id;

                        return (
                          <label
                            key={id}
                            className={`donate-cause-card ${
                              active ? 'active' : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name="cause"
                              value={id}
                              checked={active}
                              onChange={() => setCause(id)}
                              className="donate-sr-only"
                            />

                            <span
                              className="donate-cause-icon"
                              aria-hidden="true"
                            >
                              <Icon size={20} />
                            </span>

                            <span className="donate-cause-text">
                              <strong>{title}</strong>
                              <small>{description}</small>
                            </span>

                            <span
                              className="donate-check"
                              aria-hidden="true"
                            >
                              <Check
                                size={13}
                                strokeWidth={3}
                              />
                            </span>
                          </label>
                        );
                      }
                    )}
                  </div>
                </fieldset>

                {/* 02 AMOUNT */}

                <fieldset className="donate-form-section">
                  <legend className="donate-sr-only">
                    Donation amount
                  </legend>

                  <StepHeading
                    number="02"
                    title="Choose your amount"
                    description="Select a suggested amount or enter your own."
                  />

                  <div
                    className="donate-currency-switch"
                    role="radiogroup"
                    aria-label="Currency"
                  >
                    {Object.entries(currencies).map(
                      ([code, item]) => {
                        const unavailable =
                          !supportsCurrency(selectedMethod, code);

                        return (
                          <label
                            key={code}
                            className={`donate-currency-pill ${
                              currency === code ? 'active' : ''
                            } ${
                              unavailable ? 'disabled' : ''
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
                      }
                    )}
                  </div>

                  {currencyNotice && (
                    <p
                      className="donate-currency-notice"
                      role="status"
                    >
                      <AlertCircle size={15} />
                      {currencyNotice}
                    </p>
                  )}

                  <div className="donate-amount-options">
                    {config.amounts.map((value) => {
                      const active =
                        customAmount === '' && amount === value;

                      return (
                        <label
                          key={value}
                          className={`donate-amount-option ${
                            active ? 'active' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="amount"
                            value={value}
                            checked={active}
                            onChange={() => {
                              setAmount(value);
                              setCustomAmount('');
                              clearError('amount');
                            }}
                            className="donate-sr-only"
                          />

                          {formatMoney(value, currency)}
                        </label>
                      );
                    })}
                  </div>

                  <div className="donate-field donate-custom-amount">
                    <label htmlFor="custom-amount">
                      Or enter a custom amount
                    </label>

                    <div
                      className={`donate-input-group ${
                        customAmount !== '' ? 'filled' : ''
                      } ${
                        errors.amount ? 'has-error' : ''
                      }`}
                    >
                      <span className="donate-input-prefix">
                        {currencyPrefix(currency)}
                      </span>

                      <input
                        ref={fieldRefs.amount}
                        id="custom-amount"
                        type="text"
                        inputMode={
                          config.decimals ? 'decimal' : 'numeric'
                        }
                        placeholder={`Minimum ${formatMoney(
                          config.minimum,
                          currency
                        )}`}
                        value={customAmount}
                        onChange={(event) => {
                          setCustomAmount(
                            sanitizeAmount(
                              event.target.value,
                              config.decimals
                            )
                          );

                          clearError('amount');
                        }}
                        aria-invalid={Boolean(errors.amount)}
                        aria-describedby={
                          errors.amount ? 'amount-error' : undefined
                        }
                      />
                    </div>

                    <FieldError
                      id="amount-error"
                      message={errors.amount}
                    />
                  </div>
                </fieldset>

                {/* 03 PAYMENT */}

                <fieldset className="donate-form-section">
                  <legend className="donate-sr-only">
                    Payment method
                  </legend>

                  <StepHeading
                    number="03"
                    title="Choose payment method"
                    description="Select how you would like to pay."
                  />

                  <div className="donate-payment-options">
                    {paymentMethods.map((method) => {
                      const active =
                        paymentMethod === method.id;

                      return (
                        <label
                          key={method.id}
                          className={`donate-payment-option ${
                            active ? 'active' : ''
                          } ${
                            method.disabled ? 'is-disabled' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment-method"
                            value={method.id}
                            checked={active}
                            disabled={Boolean(method.disabled)}
                            onChange={() =>
                              changePaymentMethod(method.id)
                            }
                            className="donate-sr-only"
                          />

                          <span
                            className="donate-radio"
                            aria-hidden="true"
                          />

                          <span className="donate-payment-details">
                            <strong>{method.title}</strong>
                            <small>{method.description}</small>

                            <small className="donate-payment-status">
                              {method.status}
                            </small>
                          </span>

                          <PaymentBrand brand={method.brand} />
                        </label>
                      );
                    })}
                  </div>

                  {/* CARD INFORMATION */}

                  {paymentMethod === 'card' && (
                    <div className="donate-payment-panel">
                      <div className="donate-payment-note">
                        <CreditCard size={20} />

                        <p>
                          You'll be redirected to our payment
                          provider's secure checkout to enter
                          your card details.{' '}
                          <strong>
                            Never enter card details on this page.
                          </strong>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* PAYPAL INFORMATION */}

                  {isPayPal && (
                    <div className="donate-payment-panel">
                      <div className="donate-payment-note">
                        <Wallet size={20} />

                        <p>
                          You'll be redirected to PayPal to log
                          in and approve your donation, then
                          brought back here.{' '}
                          <strong>
                            PayPal receiving must be enabled
                            for the merchant account.
                          </strong>
                          {' '}PayPal checkout does not use UGX.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* GOOGLE PAY INFORMATION */}

                  {paymentMethod === 'google_pay' && (
                    <div className="donate-payment-panel">
                      <div className="donate-payment-note">
                        <Wallet size={20} />

                        <p>
                          Google Pay is subject to country,
                          device and payment-provider availability.
                          It will become selectable after the
                          payment integration is configured.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* MOBILE MONEY INFORMATION */}

                  {isMobileMoney && (
                    <div className="donate-payment-panel">
                      <div className="donate-payment-note">
                        <Smartphone size={20} />

                        <p>
                          A payment prompt will be sent to this{' '}
                          {selectedMethod.title} number. Enter
                          your PIN on your phone to approve it.
                        </p>
                      </div>

                      <div className="donate-field">
                        <label htmlFor="donor-phone">
                          Mobile money number
                        </label>

                        <div
                          className={`donate-input-group ${
                            errors.phone ? 'has-error' : ''
                          }`}
                        >
                          <span className="donate-input-prefix">
                            +256
                          </span>

                          <input
                            ref={fieldRefs.phone}
                            id="donor-phone"
                            type="tel"
                            inputMode="numeric"
                            placeholder="772 123 456"
                            value={formatLocalMobile(phone)}
                            onChange={(event) => {
                              setPhone(
                                toLocalMobile(event.target.value)
                              );

                              clearError('phone');
                            }}
                            autoComplete="tel-national"
                            aria-invalid={Boolean(errors.phone)}
                            aria-describedby={
                              errors.phone
                                ? 'phone-error'
                                : 'phone-hint'
                            }
                          />

                          {isValidLocalMobile(phone) && (
                            <CheckCircle2
                              className="donate-input-valid"
                              size={18}
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        {errors.phone ? (
                          <FieldError
                            id="phone-error"
                            message={errors.phone}
                          />
                        ) : (
                          <small id="phone-hint">
                            Use the number registered to your
                            mobile money account.
                          </small>
                        )}
                      </div>
                    </div>
                  )}
                </fieldset>

                {/* 04 DONOR DETAILS */}

                <fieldset className="donate-form-section">
                  <legend className="donate-sr-only">
                    Your details
                  </legend>

                  <StepHeading
                    number="04"
                    title="Your details"
                    description="We'll send your donation receipt to this email."
                  />

                  <div className="donate-donor-fields">

                    {/* FULL NAME */}

                    <div className="donate-field">
                      <label htmlFor="donor-name">
                        Full name
                      </label>

                      <div
                        className={`donate-input-group ${
                          errors.fullName ? 'has-error' : ''
                        }`}
                      >
                        <span className="donate-input-icon">
                          <User size={17} />
                        </span>

                        <input
                          ref={fieldRefs.fullName}
                          id="donor-name"
                          type="text"
                          placeholder="Jane Namukasa"
                          value={fullName}
                          onChange={(event) => {
                            setFullName(event.target.value);
                            clearError('fullName');
                          }}
                          autoComplete="name"
                          aria-invalid={Boolean(errors.fullName)}
                          aria-describedby={
                            errors.fullName
                              ? 'name-error'
                              : undefined
                          }
                        />
                      </div>

                      <FieldError
                        id="name-error"
                        message={errors.fullName}
                      />
                    </div>

                    {/* EMAIL */}

                    <div className="donate-field">
                      <label htmlFor="donor-email">
                        Email address
                      </label>

                      <div
                        className={`donate-input-group ${
                          errors.email ? 'has-error' : ''
                        }`}
                      >
                        <span className="donate-input-icon">
                          <Mail size={17} />
                        </span>

                        <input
                          ref={fieldRefs.email}
                          id="donor-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);
                            clearError('email');
                          }}
                          autoComplete="email"
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={
                            errors.email
                              ? 'email-error'
                              : undefined
                          }
                        />
                      </div>

                      <FieldError
                        id="email-error"
                        message={errors.email}
                      />
                    </div>

                  </div>
                </fieldset>

                {/* DONATION SUMMARY */}

                <div
                  className="donate-summary"
                  aria-live="polite"
                >
                  <div className="donate-summary-row">
                    <span>Supporting</span>
                    <strong>{selectedCause.title}</strong>
                  </div>

                  <div className="donate-summary-row">
                    <span>Paying with</span>
                    <strong>{selectedMethod.title}</strong>
                  </div>

                  <div className="donate-summary-row donate-summary-total">
                    <span>Total donation</span>

                    <strong>
                      {validAmount
                        ? formatMoney(selectedAmount, currency)
                        : '—'}
                    </strong>
                  </div>
                </div>

                {/* ERROR MESSAGE */}

                {formError && (
                  <div
                    className="donate-error-message"
                    role="alert"
                  >
                    <AlertCircle size={19} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* SUBMIT BUTTON */}

                <button
                  type="submit"
                  className={`donate-submit-button ${
                    isPayPal ? 'is-paypal' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        className="donate-spinner"
                        size={20}
                      />

                      {isPayPal
                        ? 'Connecting to PayPal…'
                        : 'Preparing secure checkout…'}
                    </>
                  ) : (
                    <>
                      <Lock size={17} />

                      {validAmount
                        ? `Donate ${formatMoney(
                            selectedAmount,
                            currency
                          )} ${submitLabel}`.trim()
                        : 'Continue to payment'}

                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p className="donate-secure-note">
                  <ShieldCheck size={16} />
                  Payments are processed securely by our payment provider.
                </p>

              </form>

              {/* SIDEBAR */}

              <aside className="donate-information">

                <div className="donate-info-card">

                  <div className="donate-info-icon">
                    <Heart size={22} />
                  </div>

                  <h3>Why your donation matters</h3>

                  <p>
                    Children living with sickle cell disease
                    and HIV can face additional nutritional and
                    healthcare challenges. Your contribution
                    helps us provide community-based support
                    to families who need it.
                  </p>

                  <ul className="donate-info-features">
                    <li>
                      <CheckCircle2 size={18} />
                      Support child nutrition programmes
                    </li>

                    <li>
                      <CheckCircle2 size={18} />
                      Support medical outreach initiatives
                    </li>

                    <li>
                      <CheckCircle2 size={18} />
                      Strengthen families and communities
                    </li>
                  </ul>

                </div>

                <div className="donate-security-card">
                  <ShieldCheck size={24} />

                  <div>
                    <h4>Secure giving</h4>

                    <p>
                      Card and PayPal details are entered only
                      on the payment provider's secure checkout,
                      never on this website.
                    </p>
                  </div>
                </div>

              </aside>

            </div>
          </div>
        </section>

        {/* THANK YOU */}

        <section className="donate-thank-you">
          <div className="donate-container">
            <Heart size={27} />

            <h2>Thank you for making a difference.</h2>

            <p>
              Every contribution helps us build healthier
              and stronger communities.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}