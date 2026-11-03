import { useState } from "react";
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Users,
  Apple,
  Stethoscope,
  BookOpen,
  HandHeart,
  CheckCircle2,
  LockKeyhole,
  ChevronDown,
  LoaderCircle,
} from "lucide-react";

import { createDonationCheckout } from "../services/donationService.js";
import "./Donate.css";

const causes = [
  {
    title: "Child Nutrition Support",
    description:
      "Nutritious food and nutritional support for vulnerable children.",
    icon: Apple,
  },
  {
    title: "Medical Outreach",
    description:
      "Medical camps, healthcare services and essential supplies.",
    icon: Stethoscope,
  },
  {
    title: "Health Education",
    description:
      "Practical health and nutrition education for families.",
    icon: BookOpen,
  },
  {
    title: "Where Most Needed",
    description:
      "Direct your gift to the programme with the greatest need.",
    icon: HandHeart,
  },
];

const currencies = {
  UGX: {
    label: "UGX (Ugandan Shilling)",
    symbol: "UGX",
    amounts: [10000, 25000, 50000, 100000],
  },
  USD: {
    label: "USD (US Dollar)",
    symbol: "$",
    amounts: [5, 10, 25, 50],
  },
  EUR: {
    label: "EUR (Euro)",
    symbol: "€",
    amounts: [5, 10, 25, 50],
  },
  GBP: {
    label: "GBP (British Pound)",
    symbol: "£",
    amounts: [5, 10, 25, 50],
  },
};

const paymentMethods = [
  { id: "card", name: "Visa / Mastercard", className: "visa" },
  { id: "paypal", name: "PayPal", className: "paypal" },
  { id: "mtn_momo", name: "MTN MoMo", className: "mtn" },
  { id: "airtel_money", name: "Airtel Money", className: "airtel" },
];

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US").format(amount);

export default function Donate() {
  const [formData, setFormData] = useState({
    cause: "Where Most Needed",
    frequency: "one-time",
    currency: "UGX",
    amount: 10000,
    customAmount: "",
    fullName: "",
    email: "",
    phone: "",
    message: "",
    paymentMethod: "card",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedCurrency = currencies[formData.currency];

  const currentAmount = formData.customAmount
    ? Number(formData.customAmount)
    : Number(formData.amount);

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const selectAmount = (amount) => {
    setFormData((previous) => ({
      ...previous,
      amount,
      customAmount: "",
    }));

    setError("");
  };

  const handleCurrencyChange = (currency) => {
    setFormData((previous) => ({
      ...previous,
      currency,
      amount: currencies[currency].amounts[0],
      customAmount: "",
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!currentAmount || currentAmount <= 0 || !Number.isFinite(currentAmount)) {
      setError("Please enter a valid donation amount.");
      return;
    }

    if (
      formData.paymentMethod === "mtn_momo" ||
      formData.paymentMethod === "airtel_money"
    ) {
      if (!formData.phone.trim()) {
        setError("Please enter your phone number for mobile money payments.");
        return;
      }
    }

    setLoading(true);

    try {
      const result = await createDonationCheckout({
        donorName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        amount: currentAmount,
        currency: formData.currency,
        cause: formData.cause,
        frequency: formData.frequency,
        paymentMethod: formData.paymentMethod,
        message: formData.message.trim(),
      });

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error("The payment provider did not return a checkout link.");
      }
    } catch (err) {
      setError(
        err.message || "We could not start your donation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="donate-page">
      {/* HERO SECTION */}
      <section className="donate-hero">
        <div className="donate-hero-overlay" />

        <div className="donate-hero-content">
          <div className="hero-label">
            <Heart size={19} />
            <span>SUPPORT OUR WORK</span>
          </div>

          <h1>
            Make a Difference
            <br />
            in Our Communities
          </h1>

          <p>
            Your gift helps us deliver medical outreach, health education
            and community support to the people who need it most.
          </p>

          <a href="#donation-form" className="hero-donate-button">
            Donate Now <ArrowRight size={19} />
          </a>

          <div className="hero-trust-items">
            <div>
              <ShieldCheck size={25} />
              <span>Secure Payment</span>
            </div>

            <div>
              <Leaf size={25} />
              <span>Meaningful Impact</span>
            </div>

            <div>
              <Users size={25} />
              <span>Real People, Real Change</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="donate-main">
        <div className="donate-left-content">
          <div className="programmes-heading">
            <h2>Where Your Donation Goes</h2>
            <p>
              Your support helps us run life-changing programmes, including:
            </p>
          </div>

          <div className="programme-grid">
            {causes.map((cause) => {
              const Icon = cause.icon;

              return (
                <article className="programme-card" key={cause.title}>
                  <Icon className="programme-icon" size={42} strokeWidth={1.8} />

                  <h3>{cause.title}</h3>

                  <p>{cause.description}</p>
                </article>
              );
            })}
          </div>

          {/* IMPACT SECTION */}
          <div className="impact-card">
            <div className="impact-image">
              <img
                src="/images/community-outreach.jpg"
                alt="Community healthcare outreach"
              />
            </div>

            <div className="impact-information">
              <h3>The Impact of Your Support</h3>

              <ul>
                <li>
                  <CheckCircle2 />
                  Brings healthcare closer to communities.
                </li>

                <li>
                  <CheckCircle2 />
                  Improves health and nutrition outcomes.
                </li>

                <li>
                  <CheckCircle2 />
                  Builds healthier, more resilient families.
                </li>
              </ul>
            </div>
          </div>

          {/* STATISTICS */}
          <div className="impact-statistics">
            <div className="stat-item">
              <Users size={38} />
              <strong>10,000+</strong>
              <span>People Reached</span>
            </div>

            <div className="stat-item">
              <Stethoscope size={38} />
              <strong>50+</strong>
              <span>Medical Camps</span>
            </div>

            <div className="stat-item">
              <Heart size={38} />
              <strong>20+</strong>
              <span>Communities Served</span>
            </div>
          </div>
        </div>

        {/* DONATION FORM */}
        <div className="donation-form-card" id="donation-form">
          <div className="form-heading">
            <div className="form-heading-icon">
              <HandHeart size={46} strokeWidth={1.8} />
            </div>

            <div>
              <h2>Make a Donation</h2>
              <p>
                Choose an amount, your preferred payment method,
                and help us continue our work.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* CAUSE */}
            <div className="form-section">
              <div className="form-section-title">
                <span className="step-number">1</span>
                <h3>Choose a Cause</h3>
              </div>

              <div className="select-wrapper">
                <select
                  value={formData.cause}
                  onChange={(e) => updateField("cause", e.target.value)}
                  aria-label="Choose a donation cause"
                >
                  {causes.map((cause) => (
                    <option value={cause.title} key={cause.title}>
                      {cause.title}
                    </option>
                  ))}
                </select>

                <ChevronDown size={18} />
              </div>
            </div>

            {/* FREQUENCY */}
            <div className="form-section">
              <div className="form-section-title">
                <span className="step-number">2</span>
                <h3>Select Donation Frequency</h3>
              </div>

              <div className="frequency-options">
                <button
                  type="button"
                  className={
                    formData.frequency === "one-time" ? "active" : ""
                  }
                  onClick={() => updateField("frequency", "one-time")}
                >
                  {formData.frequency === "one-time" && (
                    <CheckCircle2 size={16} />
                  )}
                  One-time
                </button>

                <button
                  type="button"
                  className={
                    formData.frequency === "monthly" ? "active" : ""
                  }
                  onClick={() => updateField("frequency", "monthly")}
                >
                  {formData.frequency === "monthly" && (
                    <CheckCircle2 size={16} />
                  )}
                  Monthly
                </button>
              </div>
            </div>

            {/* AMOUNT */}
            <div className="form-section">
              <div className="amount-heading-row">
                <div className="form-section-title">
                  <span className="step-number">3</span>
                  <h3>Choose Amount</h3>
                </div>

                <div className="currency-select">
                  <select
                    value={formData.currency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    aria-label="Select currency"
                  >
                    {Object.entries(currencies).map(([code, currency]) => (
                      <option value={code} key={code}>
                        {currency.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown size={15} />
                </div>
              </div>

              <div className="amount-options">
                {selectedCurrency.amounts.map((amount) => (
                  <button
                    type="button"
                    key={amount}
                    className={
                      !formData.customAmount && formData.amount === amount
                        ? "active"
                        : ""
                    }
                    onClick={() => selectAmount(amount)}
                  >
                    {selectedCurrency.symbol} {formatAmount(amount)}
                  </button>
                ))}
              </div>

              <div className="custom-amount">
                <input
                  type="number"
                  min="1"
                  placeholder="Or enter a custom amount"
                  value={formData.customAmount}
                  onChange={(e) =>
                    updateField("customAmount", e.target.value)
                  }
                />

                <span>{selectedCurrency.symbol}</span>
              </div>
            </div>

            {/* DONOR DETAILS */}
            <div className="form-section">
              <div className="form-section-title">
                <span className="step-number">4</span>
                <h3>Your Details</h3>
              </div>

              <div className="donor-details-grid">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  autoComplete="name"
                  required
                />

                <input
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  autoComplete="email"
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  autoComplete="tel"
                  className="full-width-field"
                />

                <textarea
                  placeholder="Message (Optional)"
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  rows="3"
                  className="full-width-field"
                />
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="form-section">
              <div className="form-section-title">
                <span className="step-number">5</span>
                <h3>Payment Method</h3>
              </div>

              <div className="payment-method-grid">
                {paymentMethods.map((method) => (
                  <button
                    type="button"
                    key={method.id}
                    className={`payment-method ${
                      formData.paymentMethod === method.id ? "selected" : ""
                    }`}
                    onClick={() =>
                      updateField("paymentMethod", method.id)
                    }
                    aria-pressed={formData.paymentMethod === method.id}
                  >
                    <span className="payment-radio">
                      {formData.paymentMethod === method.id && (
                        <span />
                      )}
                    </span>

                    <span className={`payment-brand ${method.className}`}>
                      {method.id === "card" && (
                        <>
                          <strong>VISA</strong>
                          <span className="mastercard-symbol">
                            <i />
                            <i />
                          </span>
                        </>
                      )}

                      {method.id === "paypal" && (
                        <strong>
                          <span className="paypal-p">P</span> PayPal
                        </strong>
                      )}

                      {method.id === "mtn_momo" && (
                        <strong>
                          <span className="mtn-circle">MTN</span>
                          <span>MoMo</span>
                        </strong>
                      )}

                      {method.id === "airtel_money" && (
                        <strong>
                          <span className="airtel-symbol">◔</span>
                          Airtel
                        </strong>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="donation-error" role="alert">
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="secure-donate-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="loading-spinner" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  <LockKeyhole size={19} />
                  Donate Securely Now
                  <ArrowRight size={19} />
                </>
              )}
            </button>

            <div className="payment-security-note">
              <ShieldCheck size={17} />
              <span>Your payment is secure and encrypted.</span>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}