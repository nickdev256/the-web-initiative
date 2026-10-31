import { useState } from 'react';
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
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { CONTACT_EMAIL } from '../config.js';
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

// What happens after a donor presses Continue
const givingSteps = [
  {
    icon: Heart,
    title: 'Choose your gift',
    text: 'Pick who to sponsor, how much to give and whether to give once or every month.',
  },
  {
    icon: Mail,
    title: 'Get payment details',
    text: 'Your email app opens with your gift filled in. Send it, and our team replies with official payment details.',
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
      'Choosing your gift opens your email app with the details filled in. Send the email and our team will reply with official payment details. No payment is taken on this website.',
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
  const [addNote, setAddNote] = useState(false);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
  const continueLabel = amountIsValid
    ? `Continue with ${amountLabel} ${frequency === 'Monthly' ? 'monthly' : 'one-time'}`
    : 'Enter an amount';

  function chooseProgramme(id) {
    setProgrammeId(id);
    setOptionId(firstOptionFor(id));
    setCustomAmount('');
    setSubmitted(false);
  }

  function chooseOption(option) {
    setOptionId(option.id);
    setProgrammeId(option.programme);
    setCustomAmount('');
    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!amountIsValid) return;

    const amountText = selectedAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const giftText = usingCustom ? 'Other amount' : selectedOption.label;

    const subject = encodeURIComponent('Donation - The Web Initiative Ltd');
    const body = encodeURIComponent(
      `Hello The Web Initiative Ltd,

I would like to make a donation.

Programme: ${programme.label}
Gift: ${giftText}
Amount: $${amountText} USD
Frequency: ${frequency === 'Monthly' ? 'Monthly' : 'One-time'}
Note: ${addNote && note ? note : 'None'}

Please send me your official payment details.`
    );

    setSubmitted(true);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
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
              <form className="donate-widget" onSubmit={handleSubmit}>
                <div className="donate-widget-body">
                  <p className="donate-widget-title">
                    <ShieldCheck size={20} aria-hidden="true" />
                    Choose amount
                  </p>

                  <div className="donate-frequency" role="group" aria-label="How often">
                    {['Once', 'Monthly'].map((option) => (
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
                      onChange={(event) => {
                        setCustomAmount(event.target.value);
                        setSubmitted(false);
                      }}
                    />
                    <span aria-hidden="true">USD</span>
                  </label>

                  <label className="donate-note-toggle">
                    <input
                      type="checkbox"
                      checked={addNote}
                      onChange={(event) => setAddNote(event.target.checked)}
                    />
                    Add a note or comment
                  </label>

                  {addNote && (
                    <textarea
                      className="donate-note"
                      rows="3"
                      placeholder="Your note to our team..."
                      aria-label="Note to our team"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                  )}

                  <button
                    type="submit"
                    className="donate-btn donate-continue"
                    disabled={!amountIsValid}
                  >
                    {continueLabel}
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>

                  {submitted && (
                    <p className="donate-status" role="status">
                      Your email app should open with your gift details. If
                      it does not, please email us at{' '}
                      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                    </p>
                  )}
                </div>

                <p className="donate-widget-foot">
                  <Mail size={16} aria-hidden="true" />
                  No payment is taken here. Our team will email you secure
                  payment details.
                </p>
              </form>
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
