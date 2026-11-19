import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Mail,
  Heart,
  Pill,
  ChevronDown,
  ArrowLeft,
  LockKeyhole,
  LoaderCircle,
  AlertCircle,
} from 'lucide-react';

import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { CONTACT_EMAIL } from '../config.js';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import PhoneInput from '../components/PhoneInput.jsx';
import {
  createDonationCheckout,
  getDonationPaymentStatus,
} from '../services/donationService.js';

import './Donate.css';

// --------------------------------------------------
// DONATION PROGRAMMES
// --------------------------------------------------

const programmes = [
  {
    id: 'sickle-cell',
    tab: 'Sickle cell',
    label: 'Sponsor a sickle cell patient',
    amount: 75,
    summary:
      'Provides a child living with sickle cell disease with the medicine they need to manage pain and prevent dangerous infections.',
    items: [
      'Hydroxyurea',
      'Folic acid',
      'Analgesics (pain medicine)',
      'Anti-malarial prophylaxis and routine antibiotics',
    ],
  },
  {
    id: 'malnutrition',
    tab: 'Malnutrition',
    label: 'Sponsor a malnourished child',
    amount: 65,
    summary:
      'Provides a malnourished child with therapeutic food and the treatment they need to recover and grow strong.',
    items: [
      'Ready-to-Use Therapeutic Food (RUTF)',
      'F-75 and F-100 therapeutic milks',
      'Vitamin A and folic acid',
      'Deworming medication',
      'Anti-malarial prophylaxis and routine antibiotics',
    ],
  },
  {
    id: 'hiv',
    tab: 'HIV',
    label: 'Sponsor an HIV patient',
    amount: 75,
    summary:
      'Provides a child living with HIV with treatment that keeps the virus under control and protects against infections.',
    items: [
      'Antiretroviral Therapy (ART)',
      'Cotrimoxazole prophylaxis',
      'Tuberculosis Preventive Therapy (TPT)',
    ],
  },
];

// --------------------------------------------------
// DONATION AMOUNTS
// --------------------------------------------------

const amountOptions = [
  {
    id: 'malnutrition-1',
    amount: 65,
    label: '1 malnourished child',
    programme: 'malnutrition',
  },
  {
    id: 'sickle-cell-1',
    amount: 75,
    label: '1 sickle cell patient',
    programme: 'sickle-cell',
  },
  {
    id: 'hiv-1',
    amount: 75,
    label: '1 HIV patient',
    programme: 'hiv',
  },
  {
    id: 'malnutrition-2',
    amount: 130,
    label: '2 malnourished children',
    programme: 'malnutrition',
  },
];

// --------------------------------------------------
// PAYMENT METHODS
// --------------------------------------------------

const paymentMethods = [
  {
    id: 'card',
    name: 'Visa / Mastercard',
  },
  {
    id: 'paypal',
    name: 'PayPal',
  },
];

// --------------------------------------------------
// PAYMENT BRAND
// --------------------------------------------------

function PaymentBrand({ id }) {
  if (id === 'card') {
    return (
      <span className="donate-brand donate-brand-card" aria-hidden="true">
        <strong>VISA</strong>
        <span className="donate-brand-mc">
          <span />
          <span />
        </span>
      </span>
    );
  }

  if (id === 'paypal') {
    return (
      <span className="donate-brand donate-brand-paypal" aria-hidden="true">
        <strong>Pay</strong>
        <strong>Pal</strong>
      </span>
    );
  }

  return null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --------------------------------------------------
// HOW GIVING WORKS
// --------------------------------------------------

const givingSteps = [
  {
    icon: Heart,
    title: 'Choose your gift',
    text: 'Pick who to sponsor, how much to give and whether to give once or every month.',
  },
  {
    icon: LockKeyhole,
    title: 'Pay your way',
    text: 'Enter your donor details and complete your gift using Visa, Mastercard or PayPal.',
  },
  {
    icon: Pill,
    title: 'Your gift provides care',
    text: 'Your gift pays for the medicine and food listed above for a child we support.',
  },
];

// --------------------------------------------------
// FAQ
// --------------------------------------------------

const faqs = [
  {
    question: 'How do I pay?',
    answer:
      'Choose your gift, enter your donor details and select Visa or Mastercard or PayPal. Card payments are completed through the secure hosted checkout provided by our payment partner.',
  },
  {
    question: 'Which payment methods are available?',
    answer:
      'You can select Visa or Mastercard, or choose PayPal.',
  },
  {
    question: 'Can I give once instead of every month?',
    answer:
      'Yes. Choose One-time in the gift box. Automatic recurring billing depends on the payment provider.',
  },
  {
    question: 'Can I give a different amount?',
    answer:
      'Yes. Type any amount in the Other box and press Continue.',
  },
  {
    question: 'How do I change or stop a monthly gift?',
    answer: `Email us at ${CONTACT_EMAIL} and our team will help you.`,
  },
];

const firstOptionFor = (programmeId) =>
  amountOptions.find((option) => option.programme === programmeId)?.id ||
  amountOptions[0].id;

// ==================================================
// DONATE COMPONENT
// ==================================================

export default function Donate() {
  const [programmeId, setProgrammeId] = useState('sickle-cell');
  const [optionId, setOptionId] = useState('sickle-cell-1');
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const [step, setStep] = useState('amount');

  const [donor, setDonor] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    message: '',
  });

  const [phoneCountry, setPhoneCountry] = useState('UG');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  const [paymentResult, setPaymentResult] = useState({
    status: '',
    reference: '',
    message: '',
  });

  const widgetRef = useRef(null);
  const nameRef = useRef(null);  // --------------------------------------------------
  // VERIFY PAYMENT AFTER RETURN FROM CHECKOUT
  // --------------------------------------------------

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedStatus = params.get('payment');
    const reference = params.get('reference');

    if (!requestedStatus) return;

    let active = true;

    async function confirmPayment() {
      if (
        requestedStatus === 'cancelled' ||
        requestedStatus === 'failed'
      ) {
        if (active) {
          setPaymentResult({
            status: requestedStatus,
            reference: reference || '',
            message:
              requestedStatus === 'cancelled'
                ? 'You left checkout before completing the payment. You can try again.'
                : 'The payment provider reported that the payment was not completed.',
          });
        }

        return;
      }

      if (!reference) {
        if (active) {
          setPaymentResult({
            status: 'pending',
            reference: '',
            message:
              'We returned from checkout, but no payment reference was supplied. Please contact our team before trying again.',
          });
        }

        return;
      }

      try {
        const result = await getDonationPaymentStatus(reference);

        const status = String(
          result.paymentStatus ||
            result.payment_status ||
            result.status ||
            result.data?.paymentStatus ||
            result.data?.payment_status ||
            result.data?.status ||
            ''
        ).toLowerCase();

        if (!active) return;

        if (
          ['paid', 'completed', 'success', 'successful'].includes(status)
        ) {
          setPaymentResult({
            status: 'success',
            reference,
            message:
              'Thank you for supporting The Web Initiative Ltd. Your payment has been verified.',
          });
        } else if (
          ['failed', 'cancelled', 'canceled'].includes(status)
        ) {
          setPaymentResult({
            status: 'failed',
            reference,
            message:
              'The payment was not completed. You can try again or contact our team for assistance.',
          });
        } else {
          setPaymentResult({
            status: 'pending',
            reference,
            message:
              'Your payment is still being confirmed. Please allow a short time for the provider to update the transaction.',
          });
        }
      } catch {
        if (active) {
          setPaymentResult({
            status: 'pending',
            reference,
            message:
              'We could not verify the payment just yet. Please wait a moment or contact our team with your reference.',
          });
        }
      }
    }

    confirmPayment();

    return () => {
      active = false;
    };
  }, []);

  // --------------------------------------------------
  // SELECTED DONATION INFORMATION
  // --------------------------------------------------

  const programme = programmes.find(
    (item) => item.id === programmeId
  );

  const selectedOption = amountOptions.find(
    (option) => option.id === optionId
  );

  const usingCustom = customAmount !== '';

  const selectedAmount = usingCustom
    ? Number(customAmount)
    : selectedOption?.amount;

  const amountIsValid =
    Number.isFinite(selectedAmount) && selectedAmount > 0;

  const amountLabel = amountIsValid
    ? `$${selectedAmount.toLocaleString('en-US', {
        minimumFractionDigits: Number.isInteger(selectedAmount) ? 0 : 2,
        maximumFractionDigits: 2,
      })}`
    : '';

  const frequencyLabel =
    frequency === 'Monthly' ? 'monthly' : 'one-time';

  const continueLabel = amountIsValid
    ? `Continue with ${amountLabel} ${frequencyLabel}`
    : 'Enter an amount';

  const giftText = usingCustom
    ? `Other amount (${programme.label})`
    : selectedOption?.label;

  const method = paymentMethods.find(
    (item) => item.id === paymentMethod
  );

  const parsedPhone = donor.phone.trim()
    ? parsePhoneNumberFromString(donor.phone, phoneCountry)
    : undefined;

  const phoneIsValid = Boolean(parsedPhone?.isValid());

  // --------------------------------------------------
  // FORM HELPERS
  // --------------------------------------------------

  function chooseProgramme(id) {
    setProgrammeId(id);
    setOptionId(firstOptionFor(id));
    setCustomAmount('');
    setStep('amount');
    setError('');
  }

  function chooseOption(option) {
    setOptionId(option.id);
    setProgrammeId(option.programme);
    setCustomAmount('');
    setError('');
  }

  function updateDonor(field, value) {
    setDonor((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError('');
  }

  function focusWidget(target) {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    widgetRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    target?.focus({ preventScroll: true });
  }

  function goToDetails(event) {
    event.preventDefault();

    if (!amountIsValid) {
      return setError('Please enter a valid donation amount.');
    }

    setStep('details');
    setError('');
    setOffline(false);

    window.setTimeout(() => focusWidget(nameRef.current), 0);
  }

  // --------------------------------------------------
  // OFFLINE DONATION EMAIL
  // --------------------------------------------------

  function emailHref() {
    const subject = encodeURIComponent(
      'Donation - The Web Initiative Ltd'
    );

    const body = encodeURIComponent(
      `Hello The Web Initiative Ltd,
I would like to make a donation.
Programme: ${programme.label}
Gift: ${giftText}
Amount: ${amountLabel} USD
Frequency: ${frequency === 'Monthly' ? 'Monthly' : 'One-time'}
Preferred payment: ${method?.name || paymentMethod}
Name: ${donor.name}
Email: ${donor.email}
Phone: ${parsedPhone ? parsedPhone.formatInternational() : 'Not given'}
Message: ${donor.message || 'None'}
Please send me your official payment details.`
    );

    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  // --------------------------------------------------
  // CREATE DONATION CHECKOUT
  // --------------------------------------------------

  async function handleDonate(event) {
    event.preventDefault();

    setError('');
    setOffline(false);

    if (!amountIsValid) {
      return setError('Please enter a valid donation amount.');
    }

    if (!donor.name.trim()) {
      return setError('Please enter your full name.');
    }

    if (!EMAIL_PATTERN.test(donor.email.trim())) {
      return setError('Please enter a valid email address.');
    }

    if (donor.phone.trim() && !phoneIsValid) {
      return setError(
        'Please check your phone number and country code.'
      );
    }

    // Billing address validation for card payments
    if (paymentMethod === 'card') {
      if (!donor.addressLine1.trim()) {
        return setError('Please enter your billing address.');
      }

      if (!donor.city.trim()) {
        return setError('Please enter your city.');
      }

      if (!donor.state.trim()) {
        return setError('Please enter your state or region.');
      }
    }

    setLoading(true);

    try {
      const result = await createDonationCheckout({
        donorName: donor.name.trim(),
        email: donor.email.trim(),
        phone: parsedPhone ? parsedPhone.number : '',
        addressLine1: donor.addressLine1.trim(),
        addressLine2: donor.addressLine2.trim(),
        city: donor.city.trim(),
        state: donor.state.trim(),
        postalCode: donor.postalCode.trim(),
        amount: Number(Number(selectedAmount).toFixed(2)),
        currency: 'USD',
        cause: programme.label,
        gift: giftText,
        frequency:
          frequency === 'Monthly' ? 'monthly' : 'one-time',
        paymentMethod,
        message: donor.message.trim(),
      });

      const checkoutUrl =
        result?.checkoutUrl ||
        result?.checkout_url ||
        result?.data?.checkoutUrl ||
        result?.data?.checkout_url;

      if (!checkoutUrl) {
        throw new Error(
          'The payment provider did not return a checkout link. Please try again.'
        );
      }

      // Redirect to the secure hosted checkout page.
      window.location.assign(checkoutUrl);
    } catch (err) {
      const unreachable =
        err instanceof TypeError ||
        /not configured/i.test(err.message || '');

      if (unreachable) {
        setOffline(true);
      } else {
        setError(
          err.message ||
            'We could not start your donation. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  }  // ==================================================
  // PAGE
  // ==================================================

  return (
    <>
      <Navbar />

      <main className="donate-page">
        {/* PAYMENT RESULT */}
        {paymentResult.status && (
          <section
            className={`donate-payment-result donate-payment-result--${paymentResult.status}`}
            role="status"
            aria-live="polite"
          >
            {paymentResult.status === 'success' ? (
              <CheckCircle2 size={22} aria-hidden="true" />
            ) : (
              <AlertCircle size={22} aria-hidden="true" />
            )}

            <div>
              <strong>
                {paymentResult.status === 'success'
                  ? 'Payment confirmed'
                  : paymentResult.status === 'pending'
                    ? 'Payment confirmation pending'
                    : paymentResult.status === 'cancelled'
                      ? 'Checkout cancelled'
                      : 'Payment not completed'}
              </strong>

              <p>{paymentResult.message}</p>

              {paymentResult.reference && (
                <p>Reference: {paymentResult.reference}</p>
              )}
            </div>
          </section>
        )}

        {/* HERO */}
        <section className="donate-hero">
          <div className="donate-hero-shade" />

          <div className="donate-container donate-hero-content">
            <span className="donate-kicker donate-kicker-light">
              <span className="donate-kicker-dot" />
              MAKE A DIFFERENCE
            </span>

            <h1>
              Your generosity can help{' '}
              <span className="hand-accent hand-accent--on-dark">
                change lives.
              </span>
            </h1>

            <p>
              Sponsor the treatment of a child living with sickle cell
              disease, HIV or malnutrition, and give them the chance to
              grow up healthy.
            </p>

            <a href="#give" className="donate-btn donate-btn-light">
              Choose your gift
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* GIVE */}
        <section
          className="donate-give"
          id="give"
          aria-labelledby="donate-give-title"
        >
          <div className="donate-container">
            <div className="donate-give-heading">
              <span className="donate-kicker donate-kicker-light">
                <span className="donate-kicker-dot" />
                PARTNER WITH US
              </span>

              <h2 id="donate-give-title">
                Health and hope for{' '}
                <span className="hand-accent hand-accent--on-dark">
                  every child.
                </span>
              </h2>
            </div>

            <div className="donate-card">
              {/* PROGRAMME INFORMATION */}
              <div className="donate-card-info">
                <div
                  className="donate-tabs"
                  role="group"
                  aria-label="Choose who to sponsor"
                >
                  {programmes.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={`donate-tab ${
                        programmeId === item.id ? 'is-active' : ''
                      }`}
                      aria-pressed={programmeId === item.id}
                      onClick={() => chooseProgramme(item.id)}
                    >
                      {item.tab}
                    </button>
                  ))}
                </div>

                <p className="donate-card-label">
                  {programme.label}
                </p>

                <p className="donate-price" aria-live="polite">
                  ${programme.amount}
                  <span> / month</span>
                </p>

                <p className="donate-summary">
                  {programme.summary}
                </p>

                <ul className="donate-items">
                  {programme.items.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={22} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* DONATION WIDGET */}
              <div className="donate-widget" ref={widgetRef}>
                {step === 'amount' ? (
                  <form
                    className="donate-widget-body"
                    onSubmit={goToDetails}
                  >
                    <p className="donate-widget-title">
                      <ShieldCheck size={20} aria-hidden="true" />
                      Choose amount
                    </p>

                    <div
                      className="donate-frequency"
                      role="group"
                      aria-label="How often"
                    >
                      {['Monthly', 'Once'].map((option) => (
                        <button
                          type="button"
                          key={option}
                          className={
                            frequency === option ? 'is-active' : ''
                          }
                          aria-pressed={frequency === option}
                          onClick={() => setFrequency(option)}
                        >
                          {option === 'Once' ? 'One-time' : 'Monthly'}
                        </button>
                      ))}
                    </div>

                    {frequency === 'Monthly' && (
                      <div className="donate-recurring">
                        <span className="donate-recurring-icon">
                          <RefreshCw size={18} aria-hidden="true" />
                        </span>

                        <span>
                          <strong>Recurring donation</strong>
                          <span>
                            Monthly giving is selected. Automatic
                            recurring billing depends on the payment
                            provider.
                          </span>
                        </span>
                      </div>
                    )}

                    <div
                      className="donate-amounts"
                      role="group"
                      aria-label="Gift amount in US dollars"
                    >
                      {amountOptions.map((option) => (
                        <button
                          type="button"
                          key={option.id}
                          className={
                            !usingCustom && optionId === option.id
                              ? 'is-active'
                              : ''
                          }
                          aria-pressed={
                            !usingCustom && optionId === option.id
                          }
                          onClick={() => chooseOption(option)}
                        >
                          <strong>${option.amount}</strong>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>

                    <label className="donate-other">
                      <span aria-hidden="true">$</span>

                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        inputMode="decimal"
                        placeholder="Other"
                        aria-label="Other amount in US dollars"
                        value={customAmount}
                        onChange={(event) => {
                          setCustomAmount(event.target.value);
                          setError('');
                        }}
                      />

                      <span aria-hidden="true">USD</span>
                    </label>

                    {error && (
                      <p className="donate-error" role="alert">
                        <AlertCircle size={18} aria-hidden="true" />
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="donate-btn donate-continue"
                      disabled={!amountIsValid}
                    >
                      {continueLabel}
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </form>
                ) : (
                  <form
                    className="donate-widget-body"
                    onSubmit={handleDonate}
                    noValidate
                  >
                    <button
                      type="button"
                      className="donate-back"
                      onClick={() => {
                        setStep('amount');
                        setError('');
                        setOffline(false);
                      }}
                    >
                      <ArrowLeft size={16} aria-hidden="true" />
                      Change amount
                    </button>

                    <div className="donate-summary-chip">
                      <span>{programme.label}</span>
                      <strong>
                        {amountLabel} {frequencyLabel}
                      </strong>
                    </div>

                    {/* DONOR DETAILS */}
                    <div className="donate-fields">
                      <label className="donate-field">
                        <span>Full name *</span>

                        <input
                          ref={nameRef}
                          type="text"
                          autoComplete="name"
                          placeholder="Your full name"
                          value={donor.name}
                          onChange={(event) =>
                            updateDonor('name', event.target.value)
                          }
                          required
                        />
                      </label>

                      <label className="donate-field">
                        <span>Email address *</span>

                        <input
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={donor.email}
                          onChange={(event) =>
                            updateDonor('email', event.target.value)
                          }
                          required
                        />
                      </label>
                    </div>

                    {/* PAYMENT METHOD */}
                    <fieldset className="donate-methods">
                      <legend>Payment method</legend>

                      <div className="donate-methods-grid">
                        {paymentMethods.map((item) => (
                          <label
                            key={item.id}
                            className={`donate-method ${
                              paymentMethod === item.id
                                ? 'is-selected'
                                : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment-method"
                              value={item.id}
                              checked={paymentMethod === item.id}
                              onChange={() => {
                                setPaymentMethod(item.id);
                                setError('');
                                setOffline(false);
                              }}
                            />

                            <PaymentBrand id={item.id} />

                            <span className="donate-method-name">
                              {item.name}
                            </span>

                            <CheckCircle2
                              className="donate-method-check"
                              size={18}
                              aria-hidden="true"
                            />
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    {/* SECURE CARD CHECKOUT INFORMATION */}
                    {paymentMethod === 'card' && (
                      <section
                        className="donate-card-entry"
                        aria-label="Secure card payment information"
                      >
                        <div className="donate-card-entry-heading">
                          <LockKeyhole size={16} aria-hidden="true" />
                          <span>Secure Visa / Mastercard payment</span>
                        </div>

                        <p className="donate-card-provider-note">
                          After you click Donate, you will be redirected
                          to the secure ObPay checkout page. Enter your
                          card details directly on that page. This
                          website does not collect or store your card
                          number, CVC or expiry date.
                        </p>
                      </section>
                    )}                    {/* PHONE NUMBER */}
                    <div className="donate-field">
                      <label htmlFor="donate-phone">
                        Phone number (optional)
                      </label>

                      <PhoneInput
                        id="donate-phone"
                        country={phoneCountry}
                        onCountryChange={(code) => {
                          setPhoneCountry(code);
                          setError('');
                        }}
                        value={donor.phone}
                        onChange={(value) =>
                          updateDonor('phone', value)
                        }
                      />
                    </div>

                    {/* BILLING ADDRESS */}
                    {paymentMethod === 'card' && (
                      <section className="donate-billing-address">
                        <div className="donate-card-entry-heading">
                          <LockKeyhole size={16} aria-hidden="true" />
                          <span>Billing address</span>
                        </div>

                        <p className="donate-card-provider-note">
                          Enter your billing address for secure card
                          payment processing.
                        </p>

                        <div className="donate-fields">
                          <label className="donate-field">
                            <span>Address line 1 *</span>
                            <input
                              type="text"
                              autoComplete="address-line1"
                              placeholder="Street, building or area"
                              value={donor.addressLine1}
                              onChange={(event) =>
                                updateDonor(
                                  'addressLine1',
                                  event.target.value
                                )
                              }
                              required
                            />
                          </label>

                          <label className="donate-field">
                            <span>Address line 2 (optional)</span>
                            <input
                              type="text"
                              autoComplete="address-line2"
                              placeholder="Apartment, floor or additional details"
                              value={donor.addressLine2}
                              onChange={(event) =>
                                updateDonor(
                                  'addressLine2',
                                  event.target.value
                                )
                              }
                            />
                          </label>
                        </div>

                        <div className="donate-fields">
                          <label className="donate-field">
                            <span>City *</span>
                            <input
                              type="text"
                              autoComplete="address-level2"
                              placeholder="Your city"
                              value={donor.city}
                              onChange={(event) =>
                                updateDonor('city', event.target.value)
                              }
                              required
                            />
                          </label>

                          <label className="donate-field">
                            <span>State / Region *</span>
                            <input
                              type="text"
                              autoComplete="address-level1"
                              placeholder="Your state or region"
                              value={donor.state}
                              onChange={(event) =>
                                updateDonor('state', event.target.value)
                              }
                              required
                            />
                          </label>
                        </div>

                        <label className="donate-field">
                          <span>Postal code (optional)</span>
                          <input
                            type="text"
                            autoComplete="postal-code"
                            placeholder="Postal code"
                            value={donor.postalCode}
                            onChange={(event) =>
                              updateDonor(
                                'postalCode',
                                event.target.value
                              )
                            }
                          />
                        </label>
                      </section>
                    )}

                    {/* OPTIONAL MESSAGE */}
                    <label className="donate-field">
                      <span>Message (optional)</span>
                      <textarea
                        rows="2"
                        placeholder="A note to our team..."
                        value={donor.message}
                        onChange={(event) =>
                          updateDonor('message', event.target.value)
                        }
                      />
                    </label>

                    {error && (
                      <p className="donate-error" role="alert">
                        <AlertCircle size={18} aria-hidden="true" />
                        {error}
                      </p>
                    )}

                    {offline ? (
                      <div className="donate-offline" role="status">
                        <p>
                          Online payment isn’t available just yet.
                          You can still give today: email us your gift
                          and our team will send you secure payment
                          details.
                        </p>

                        <a
                          className="donate-btn donate-continue"
                          href={emailHref()}
                        >
                          <Mail size={18} aria-hidden="true" />
                          Email us your gift
                        </a>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="donate-btn donate-continue"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <LoaderCircle
                              className="donate-spin"
                              size={18}
                              aria-hidden="true"
                            />
                            Starting secure checkout…
                          </>
                        ) : (
                          <>
                            <LockKeyhole
                              size={18}
                              aria-hidden="true"
                            />
                            Donate {amountLabel} {frequencyLabel}
                          </>
                        )}
                      </button>
                    )}
                  </form>
                )}

                <p className="donate-widget-foot">
                  <LockKeyhole size={16} aria-hidden="true" />
                  Visa, Mastercard and PayPal checkout options are available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW GIVING WORKS */}
        <section
          className="donate-steps"
          aria-labelledby="donate-steps-title"
        >
          <div className="donate-container">
            <div className="donate-heading donate-heading-center">
              <span className="donate-kicker">
                <span className="donate-kicker-dot" />
                HOW IT WORKS
              </span>

              <h2 id="donate-steps-title">
                Three simple steps{' '}
                <span className="hand-accent">to give.</span>
              </h2>
            </div>

            <ol className="donate-steps-grid">
              {givingSteps.map((item, index) => {
                const Icon = item.icon;

                return (
                  <li className="donate-step" key={item.title}>
                    <span
                      className="donate-step-number"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="donate-icon-box">
                      <Icon size={24} aria-hidden="true" />
                    </span>

                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="donate-faq"
          aria-labelledby="donate-faq-title"
        >
          <div className="donate-container donate-faq-grid">
            <div className="donate-faq-intro">
              <span className="donate-kicker">
                <span className="donate-kicker-dot" />
                QUESTIONS
              </span>

              <h2 id="donate-faq-title">
                Giving,{' '}
                <span className="hand-accent">made clear.</span>
              </h2>

              <p>
                Want to help in another way? You can also volunteer at
                a camp or partner with us.
              </p>

              <Link to="/contact" className="donate-text-link">
                Contact our team
                <span>
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
              </Link>
            </div>

            <div className="donate-faq-list">
              {faqs.map((item) => (
                <details
                  className="donate-faq-item"
                  key={item.question}
                >
                  <summary>
                    {item.question}
                    <ChevronDown size={20} aria-hidden="true" />
                  </summary>

                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}