import { useRef, useState } from 'react';
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
import { createDonationCheckout } from '../services/donationService.js';
import './Donate.css';

// What one gift provides for each kind of patient we support
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

// Amount choices in the gift widget. Each one belongs to a programme.
const amountOptions = [
  { id: 'malnutrition-1', amount: 65, label: '1 malnourished child', programme: 'malnutrition' },
  { id: 'sickle-cell-1', amount: 75, label: '1 sickle cell patient', programme: 'sickle-cell' },
  { id: 'hiv-1', amount: 75, label: '1 HIV patient', programme: 'hiv' },
  { id: 'malnutrition-2', amount: 130, label: '2 malnourished children', programme: 'malnutrition' },
];

// Ways to pay. The ids are the values Nico's backend expects.
const paymentMethods = [
  { id: 'card', name: 'Visa / Mastercard', mobileMoney: false },
  { id: 'paypal', name: 'PayPal', mobileMoney: false },
  { id: 'mtn_momo', name: 'MTN MoMo', mobileMoney: true },
  { id: 'airtel_money', name: 'Airtel Money', mobileMoney: true },
];

// Small brand marks so donors recognise each payment method
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
  if (id === 'mtn_momo') {
    return (
      <span className="donate-brand donate-brand-mtn" aria-hidden="true">
        <strong>MTN</strong>
      </span>
    );
  }
  return (
    <span className="donate-brand donate-brand-airtel" aria-hidden="true">
      <strong>airtel</strong>
    </span>
  );
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// What happens after a donor presses Continue
const givingSteps = [
  {
    icon: Heart,
    title: 'Choose your gift',
    text: 'Pick who to sponsor, how much to give and whether to give once or every month.',
  },
  {
    icon: LockKeyhole,
    title: 'Pay your way',
    text: 'Add your details and pay by Visa, Mastercard, PayPal, MTN MoMo or Airtel Money on a secure checkout page.',
  },
  {
    icon: Pill,
    title: 'Your gift provides care',
    text: 'Your gift pays for the medicine and food listed above for a child we support.',
  },
];

const faqs = [
  {
    question: 'How do I pay?',
    answer:
      'Choose your gift and press Continue. Then add your name and email and pick Visa or Mastercard, PayPal, MTN MoMo or Airtel Money. You finish your gift on a secure checkout page.',
  },
  {
    question: 'Can I pay with mobile money?',
    answer:
      'Yes. Choose MTN MoMo or Airtel Money and enter the phone number you pay with, including the country code.',
  },
  {
    question: 'Can I give once instead of every month?',
    answer:
      'Yes. Choose One-time in the gift box. The prices show what one patient’s care costs each month, but any gift helps.',
  },
  {
    question: 'Can I give a different amount?',
    answer: 'Yes. Type any amount in the Other box and press Continue.',
  },
  {
    question: 'How do I change or stop a monthly gift?',
    answer: `Email us at ${CONTACT_EMAIL} and our team will help you.`,
  },
];

const firstOptionFor = (programmeId) =>
  amountOptions.find((option) => option.programme === programmeId).id;

export default function Donate() {
  const [programmeId, setProgrammeId] = useState('sickle-cell');
  const [optionId, setOptionId] = useState('sickle-cell-1');
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const [step, setStep] = useState('amount');
  const [donor, setDonor] = useState({ name: '', email: '', phone: '', message: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Shown when online payment can't start, e.g. before the backend is live
  const [offline, setOffline] = useState(false);
  const widgetRef = useRef(null);
  const nameRef = useRef(null);

  const programme = programmes.find((item) => item.id === programmeId);
  const selectedOption = amountOptions.find((option) => option.id === optionId);
  const usingCustom = customAmount !== '';
  const selectedAmount = usingCustom ? Number(customAmount) : selectedOption?.amount;
  const amountIsValid = Number.isFinite(selectedAmount) && selectedAmount > 0;
  const amountLabel = amountIsValid
    ? `$${selectedAmount.toLocaleString('en-US', {
        minimumFractionDigits: Number.isInteger(selectedAmount) ? 0 : 2,
        maximumFractionDigits: 2,
      })}`
    : '';
  const frequencyLabel = frequency === 'Monthly' ? 'monthly' : 'one-time';
  const continueLabel = amountIsValid
    ? `Continue with ${amountLabel} ${frequencyLabel}`
    : 'Enter an amount';
  const giftText = usingCustom ? `Other amount (${programme.label})` : selectedOption?.label;
  const method = paymentMethods.find((item) => item.id === paymentMethod);

  function chooseProgramme(id) {
    setProgrammeId(id);
    setOptionId(firstOptionFor(id));
    setCustomAmount('');
    setStep('amount');
  }

  function chooseOption(option) {
    setOptionId(option.id);
    setProgrammeId(option.programme);
    setCustomAmount('');
  }

  function updateDonor(field, value) {
    setDonor((previous) => ({ ...previous, [field]: value }));
    setError('');
  }

  // Move the widget into view and put the cursor in the first field
  function focusWidget(target) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    widgetRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    target?.focus({ preventScroll: true });
  }

  function goToDetails(event) {
    event.preventDefault();
    if (!amountIsValid) return;
    setStep('details');
    setError('');
    setOffline(false);
    window.setTimeout(() => focusWidget(nameRef.current), 0);
  }

  // Email fallback, used when online payment is not available
  function emailHref() {
    const subject = encodeURIComponent('Donation - The Web Initiative Ltd');
    const body = encodeURIComponent(
      `Hello The Web Initiative Ltd,

I would like to make a donation.

Programme: ${programme.label}
Gift: ${giftText}
Amount: ${amountLabel} USD
Frequency: ${frequency === 'Monthly' ? 'Monthly' : 'One-time'}
Preferred payment: ${method.name}
Name: ${donor.name}
Phone: ${donor.phone || 'Not given'}
Message: ${donor.message || 'None'}

Please send me your official payment details.`
    );
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  async function handleDonate(event) {
    event.preventDefault();
    setError('');

    if (!donor.name.trim()) return setError('Please enter your full name.');
    if (!EMAIL_PATTERN.test(donor.email.trim())) return setError('Please enter a valid email address.');
    if (method.mobileMoney && donor.phone.replace(/\D/g, '').length < 9) {
      return setError(`Please enter the phone number you pay with on ${method.name}.`);
    }

    setLoading(true);
    try {
      const result = await createDonationCheckout({
        donorName: donor.name.trim(),
        email: donor.email.trim(),
        phone: donor.phone.trim(),
        amount: selectedAmount,
        currency: 'USD',
        cause: programme.label,
        gift: giftText,
        frequency: frequency === 'Monthly' ? 'monthly' : 'one-time',
        paymentMethod,
        message: donor.message.trim(),
      });
      window.location.href = result.checkoutUrl;
    } catch (err) {
      // No backend yet, or it can't be reached: offer the email route
      const unreachable =
        err instanceof TypeError || /not configured/i.test(err.message || '');
      if (unreachable) setOffline(true);
      else setError(err.message || 'We could not start your donation. Please try again.');
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="donate-page">
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
        <section className="donate-give" id="give" aria-labelledby="donate-give-title">
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
              {/* What the gift provides */}
              <div className="donate-card-info">
                <div className="donate-tabs" role="group" aria-label="Choose who to sponsor">
                  {programmes.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className="donate-tab"
                      aria-pressed={programmeId === item.id}
                      onClick={() => chooseProgramme(item.id)}
                    >
                      {item.tab}
                    </button>
                  ))}
                </div>

                <p className="donate-card-label">{programme.label}</p>

                {/* The cost of one patient's care each month */}
                <p className="donate-price" aria-live="polite">
                  ${programme.amount}
                  <span> / month</span>
                </p>

                <p className="donate-summary">{programme.summary}</p>

                <ul className="donate-items">
                  {programme.items.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={22} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gift widget */}
              <div className="donate-widget" ref={widgetRef}>
                {step === 'amount' ? (
                  <form className="donate-widget-body" onSubmit={goToDetails}>
                    <p className="donate-widget-title">
                      <ShieldCheck size={20} aria-hidden="true" />
                      Choose amount
                    </p>

                    <div className="donate-frequency" role="group" aria-label="How often">
                      {['Monthly', 'Once'].map((option) => (
                        <button
                          type="button"
                          key={option}
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
                          <span>This gift is set to renew every month.</span>
                        </span>
                      </div>
                    )}

                    <div className="donate-amounts" role="group" aria-label="Gift amount in US dollars">
                      {amountOptions.map((option) => (
                        <button
                          type="button"
                          key={option.id}
                          aria-pressed={!usingCustom && optionId === option.id}
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
                        step="1"
                        inputMode="decimal"
                        placeholder="Other"
                        aria-label="Other amount in US dollars"
                        value={customAmount}
                          onChange={(event) => setCustomAmount(event.target.value)}
                      />
                      <span aria-hidden="true">USD</span>
                    </label>

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
                  <form className="donate-widget-body" onSubmit={handleDonate} noValidate>
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

                    <div className="donate-fields">
                      <label className="donate-field">
                        <span>Full name *</span>
                        <input
                          ref={nameRef}
                          type="text"
                          autoComplete="name"
                          placeholder="Your full name"
                          value={donor.name}
                          onChange={(event) => updateDonor('name', event.target.value)}
                        />
                      </label>
                      <label className="donate-field">
                        <span>Email address *</span>
                        <input
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={donor.email}
                          onChange={(event) => updateDonor('email', event.target.value)}
                        />
                      </label>
                    </div>

                    <fieldset className="donate-methods">
                      <legend>Payment method</legend>
                      <div className="donate-methods-grid">
                        {paymentMethods.map((item) => (
                          <label
                            key={item.id}
                            className={`donate-method${paymentMethod === item.id ? ' is-selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="payment-method"
                              value={item.id}
                              checked={paymentMethod === item.id}
                              onChange={() => {
                                setPaymentMethod(item.id);
                                setError('');
                              }}
                            />
                            <PaymentBrand id={item.id} />
                            <span className="donate-method-name">{item.name}</span>
                            <CheckCircle2 className="donate-method-check" size={18} aria-hidden="true" />
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <label className="donate-field">
                      <span>
                        Phone number {method.mobileMoney ? '*' : '(optional)'}
                      </span>
                      <input
                        type="tel"
                        autoComplete="tel"
                        placeholder="e.g. +256 700 000 000"
                        value={donor.phone}
                        onChange={(event) => updateDonor('phone', event.target.value)}
                      />
                      {method.mobileMoney && (
                        <small>The number you pay with on {method.name}.</small>
                      )}
                    </label>

                    <label className="donate-field">
                      <span>Message (optional)</span>
                      <textarea
                        rows="2"
                        placeholder="A note to our team..."
                        value={donor.message}
                        onChange={(event) => updateDonor('message', event.target.value)}
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
                          Online payment isn’t available just yet. You can still
                          give today: email us your gift and our team will send
                          you secure payment details.
                        </p>
                        <a className="donate-btn donate-continue" href={emailHref()}>
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
                            <LoaderCircle className="donate-spin" size={18} aria-hidden="true" />
                            Starting secure checkout…
                          </>
                        ) : (
                          <>
                            <LockKeyhole size={18} aria-hidden="true" />
                            Donate {amountLabel} {frequencyLabel}
                          </>
                        )}
                      </button>
                    )}
                  </form>
                )}

                <p className="donate-widget-foot">
                  <LockKeyhole size={16} aria-hidden="true" />
                  Visa, Mastercard, PayPal, MTN MoMo and Airtel Money accepted.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW GIVING WORKS */}
        <section className="donate-steps" aria-labelledby="donate-steps-title">
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
              {givingSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <li className="donate-step" key={step.title}>
                    <span className="donate-step-number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="donate-icon-box">
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* QUESTIONS */}
        <section className="donate-faq" aria-labelledby="donate-faq-title">
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
                Want to help in another way? You can also volunteer at a
                camp or partner with us.
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
                <details className="donate-faq-item" key={item.question}>
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
