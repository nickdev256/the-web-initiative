import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Link, useLocation } from 'react-router-dom';

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

  Landmark,

  Copy,

  Check,

  Smartphone,

  ReceiptText,

  X,

} from 'lucide-react';

import Navbar from '../components/Navbar.jsx';

import Footer from '../components/Footer.jsx';

import Campaign from '../components/Campaign.jsx';

import { campaign } from '../data/campaign.js';

import { scrollToElement } from '../components/smoothScroll.js';

import { CONTACT_EMAIL } from '../config.js';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

import PhoneInput from '../components/PhoneInput.jsx';

import {

  createDonationCheckout,

  getDonationPaymentStatus,

} from '../services/donationService.js';

import { startDonateMotion } from './donateMotion.js';
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

    id: 'bank-transfer',

    name: 'Bank Transfer',

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

  if (id === 'bank-transfer') {

    return (

      <span

        className="donate-brand donate-brand-bank"

        aria-hidden="true"

      >

        <Landmark size={30} strokeWidth={1.8} />

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

    text: 'Enter your donor details and complete your gift using Visa, Mastercard or Bank Transfer.',

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

      'Choose your gift, enter your donor details and select Visa or Mastercard, or choose Bank Transfer. Card payments are completed through the secure hosted checkout provided by our payment partner.',

  },

  {

    question: 'Which payment methods are available?',

    answer:

      'You can select Visa or Mastercard, or make a bank transfer to our Equity Bank account.',

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

// Counts up to `value` (from 0 when it first shows, then from the last
// number when it changes). Screen readers get the plain number instead.
function CountUp({ value, duration = 900 }) {
  const [shown, setShown] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? value : 0
  );
  const shownRef = useRef(shown);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shownRef.current = value;
      setShown(value);
      return undefined;
    }

    const from = shownRef.current;
    const started = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const next = Math.round(from + (value - from) * eased);
      shownRef.current = next;
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return shown;
}

export default function Donate() {
  // Page motion (entrance on every load, scroll reveals, card effects)
  const pageRef = useRef(null);
  useEffect(() => startDonateMotion(pageRef.current), []);

  const [programmeId, setProgrammeId] = useState('sickle-cell');

  const [optionId, setOptionId] = useState('sickle-cell-1');

  const [customAmount, setCustomAmount] = useState('');

  // True when giving to the fundraising campaign (src/data/campaign.js)
  const [forCampaign, setForCampaign] = useState(false);

  const location = useLocation();

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

  // Phone country code starts on the United States (+1)
  const [phoneCountry, setPhoneCountry] = useState('US');

  const [paymentMethod, setPaymentMethod] = useState('card');

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const [offline, setOffline] = useState(false);

  const [bankDetailsCopied, setBankDetailsCopied] = useState(false);
  const [swiftCopied, setSwiftCopied] = useState(false);

  const [showBankModal, setShowBankModal] = useState(false);

  const [paymentResult, setPaymentResult] = useState({

    status: '',

    reference: '',

    message: '',

  });

  const widgetRef = useRef(null);

  const nameRef = useRef(null);

  // --------------------------------------------------

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

  // True once the visitor picks another tab: the programme details then
  // slide in on each switch (not on the first page load)
  const [tabSwitched, setTabSwitched] = useState(false);

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

  // What the gift is for, sent with the donation
  const causeText = forCampaign ? campaign.title : programme.label;

  const giftLabel = forCampaign ? `${campaign.title} (${amountLabel || 'amount'})` : giftText;

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

  // Give to the fundraising campaign: one-time gift, amount typed in
  function giveToCampaign(amount) {
    setForCampaign(true);
    setFrequency('Once');
    setStep('amount');
    setError('');
    if (amount) setCustomAmount(String(amount));
    const widget = widgetRef.current;
    if (widget) {
      scrollToElement(widget);
      window.setTimeout(() => widget.querySelector('.donate-other input')?.focus({ preventScroll: true }), 700);
    }
  }

  // Links from the Home page campaign: /donate?campaign=medical-camps&amount=50
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('campaign') !== campaign.id) return;
    const amount = Number(params.get('amount'));
    setForCampaign(true);
    setFrequency('Once');
    if (Number.isFinite(amount) && amount > 0) setCustomAmount(String(amount));
  }, [location.search]);

  function chooseProgramme(id) {
    if (id !== programmeId) setTabSwitched(true);

    setProgrammeId(id);
    setForCampaign(false);

    setOptionId(firstOptionFor(id));

    setCustomAmount('');

    setStep('amount');

    setError('');

  }

  function chooseOption(option) {

    setOptionId(option.id);
    setForCampaign(false);

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

  async function writeClipboardText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const temporaryInput = document.createElement('textarea');
    temporaryInput.value = text;
    temporaryInput.setAttribute('readonly', '');
    temporaryInput.style.position = 'fixed';
    temporaryInput.style.opacity = '0';
    temporaryInput.style.pointerEvents = 'none';
    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    const copied = document.execCommand('copy');
    document.body.removeChild(temporaryInput);

    if (!copied) {
      throw new Error('Clipboard copy was not available in this browser.');
    }
  }

  async function copyBankDetails() {
    const details = [
      'Bank: Equity Bank Uganda Limited',
      'Currency: USD',
      'Account Name: The Web Initiative Ltd',
      'Account Number: 1027203775339',
      'Branch: Jinja Branch',
      'SWIFT / BIC: EQBLUGKA',
    ].join('\n');

    try {
      await writeClipboardText(details);
      setBankDetailsCopied(true);
      window.setTimeout(() => setBankDetailsCopied(false), 2500);
    } catch {
      setError(
        'Could not copy the bank details. Please copy the details manually.'
      );
    }
  }

  async function copySwiftCode() {
    try {
      await writeClipboardText('EQBLUGKA');
      setSwiftCopied(true);
      window.setTimeout(() => setSwiftCopied(false), 2500);
    } catch {
      setError(
        'Could not copy the SWIFT code. Please select and copy EQBLUGKA manually.'
      );
    }
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

  }  // --------------------------------------------------

  // OFFLINE DONATION EMAIL

  // --------------------------------------------------

  function emailHref() {

    const subject = encodeURIComponent(

      'Donation - The Web Initiative Ltd'

    );

    const body = encodeURIComponent(

      `Hello The Web Initiative Ltd,

I would like to make a donation.

Programme: ${causeText}

Gift: ${giftLabel}

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

    // Bank transfer does not use the ObPay card checkout.

    if (paymentMethod === 'bank-transfer') {

      return;

    }

    // Billing address validation for card payments.

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

        cause: causeText,

        gift: giftLabel,

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

  }

  // ==================================================

  // PAGE

  // ==================================================

  return (

    <>

      <style>{`

      .donate-bank-panel{margin:28px 0 8px;border:1px solid #d8e5f5;border-radius:22px;overflow:hidden;background:#fff;box-shadow:0 12px 34px rgba(15,45,85,.10);color:#101d3a}

      .donate-bank-panel-heading{position:relative;overflow:hidden;padding:24px 34px;background:linear-gradient(110deg,#174d83 0%,#06447e 58%,#073b70 100%);color:#fff}

      .donate-bank-panel-heading:after{content:"";position:absolute;width:48%;height:100px;right:-5%;bottom:-66px;background:#1689df;transform:rotate(-8deg);border-radius:50% 0 0 0;opacity:.85}

      .donate-bank-panel-heading-inner{position:relative;z-index:1;display:flex;align-items:center;gap:24px}

      .donate-bank-panel-heading h3{margin:0 0 4px;font-size:clamp(25px,3vw,38px);font-weight:800;color:#fff}

      .donate-bank-panel-heading p{margin:0;font-size:17px;color:#fff}

      .donate-bank-panel-content{padding:25px 30px 28px}

      .donate-bank-section-title{position:relative;margin:0 0 18px;padding-bottom:12px;font-size:clamp(22px,2.4vw,30px);font-weight:800;color:#102b59}

      .donate-bank-section-title:after{content:"";position:absolute;left:0;bottom:0;width:58px;height:6px;border-radius:8px;background:#f5b400}

      .donate-bank-account-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.donate-bank-account-grid-single{grid-template-columns:minmax(0,760px);justify-content:center}

      .donate-bank-account-card{overflow:hidden;border:1px solid #d3e4fb;border-radius:17px;background:#fbfdff}

      .donate-bank-account-card-title{display:flex;align-items:center;gap:16px;padding:14px 18px;background:#eaf3ff;border-bottom:1px solid #d3e4fb;font-size:17px;color:#10254a}

      .donate-bank-flag{font-size:31px;line-height:1}

      .donate-bank-details-list{display:grid;gap:9px;margin:0;padding:15px 18px}

      .donate-bank-details-list>div{display:grid;grid-template-columns:minmax(125px,.9fr) minmax(0,1.2fr);gap:8px;align-items:center}

      .donate-bank-details-list dt{font-weight:800;color:#17233c}

      .donate-bank-details-list dd{margin:0;color:#202b3d;overflow-wrap:anywhere}

      .donate-bank-number-row dd strong{display:inline-block;padding:5px 10px;border:1px solid #c6ddf7;border-radius:9px;background:#e8f2ff;color:#07509a;font-size:18px;letter-spacing:.2px}

      .donate-bank-copy-inline{display:inline-flex;align-items:center;gap:8px;margin:0 18px 16px;padding:8px 12px;border:1px solid #c5d9f3;border-radius:8px;background:#fff;color:#07509a;font-weight:700;cursor:pointer}

      .donate-bank-steps-title{margin-top:30px}

      .donate-bank-steps-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin:0;padding:8px 0 18px;list-style:none;text-align:center}

      .donate-bank-steps-grid li{position:relative;display:flex;flex-direction:column;align-items:center;min-width:0}

      .donate-bank-step-icon{display:grid;place-items:center;width:82px;height:82px;border-radius:50%;background:#e8f1fb;color:#0870c9}

      .donate-bank-step-number{display:grid;place-items:center;width:42px;height:42px;margin-top:-9px;border:3px solid #fff;border-radius:50%;background:#0755a0;color:#fff;font-weight:800}

      .donate-bank-steps-grid strong{margin:10px 0 4px;color:#102653;font-size:16px}

      .donate-bank-steps-grid p{max-width:220px;margin:0;color:#172238;font-size:14px;line-height:1.45}

      .donate-bank-notify-inline{display:flex;align-items:center;justify-content:center;gap:16px;width:min(100%,540px);margin:22px auto 20px;padding:15px 20px;border-radius:15px;background:linear-gradient(110deg,#07559a,#003b78);color:#fff;text-decoration:none;font-size:20px;font-weight:800;box-shadow:0 7px 18px rgba(0,61,125,.18)}

      .donate-bank-notify-inline:hover{filter:brightness(1.08)}

      .donate-bank-confirmation-note{display:flex;align-items:center;gap:13px;margin:0;padding:15px 18px;border:1px solid #d2e4fb;border-radius:14px;background:#eff6ff;color:#14243d;font-size:15px}

      .donate-bank-confirmation-note svg{flex:0 0 auto;color:#07539a}

      
      .donate-bank-swift-row dd{display:flex;align-items:center;flex-wrap:wrap;gap:9px}
      .donate-bank-copy-swift{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:6px 10px;border:1px solid #c5d9f3;border-radius:8px;background:#fff;color:#07509a;font-size:12px;font-weight:800;cursor:pointer;transition:background .2s ease,border-color .2s ease}
      .donate-bank-copy-swift:hover{background:#eaf3ff;border-color:#8eb9e8}
      .donate-bank-copy-swift:focus-visible{outline:3px solid rgba(7,80,154,.25);outline-offset:2px}
      @media(max-width:420px){.donate-bank-swift-row dd{align-items:flex-start}}
      @media(max-width:760px){.donate-bank-panel-heading{padding:20px}.donate-bank-panel-content{padding:20px 16px}.donate-bank-account-grid{grid-template-columns:1fr}.donate-bank-steps-grid{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:24px}.donate-bank-details-list>div{grid-template-columns: minmax(115px,.8fr) minmax(0,1.2fr)}}

      .donate-bank-modal-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(8,20,42,.66);backdrop-filter:blur(5px);overflow-y:auto}.donate-bank-panel{position:relative;width:min(1160px,100%);max-height:calc(100vh - 48px);overflow-y:auto;margin:auto;border:1px solid #d8e5f5;border-radius:22px;background:#fff;box-shadow:0 24px 80px rgba(0,0,0,.28)}.donate-bank-modal-close{position:absolute;z-index:5;top:14px;right:16px;display:grid;place-items:center;width:42px;height:42px;border:1px solid rgba(255,255,255,.5);border-radius:50%;background:rgba(255,255,255,.16);color:#fff;cursor:pointer}.donate-bank-modal-close:hover{background:rgba(255,255,255,.28)}@media(max-width:600px){.donate-bank-modal-overlay{padding:12px}.donate-bank-panel{max-height:calc(100vh - 24px);border-radius:16px}}

      @media(max-width:420px){.donate-bank-panel-heading-inner{gap:13px}.donate-bank-panel-heading-inner>svg{width:40px;height:40px}.donate-bank-steps-grid{grid-template-columns:1fr 1fr;gap:18px 10px}.donate-bank-steps-grid p{font-size:13px}.donate-bank-account-card-title{font-size:15px}.donate-bank-details-list{padding:13px}.donate-bank-details-list>div{grid-template-columns:1fr;gap:2px}.donate-bank-number-row dd strong{font-size:16px}.donate-bank-notify-inline{font-size:16px;gap:9px}}

    `}</style>

      <Navbar />

      <main className="donate-page" ref={pageRef} data-own-motion>

        <h1 className="sr-only">Donate to The Web Initiative Ltd</h1>

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

        {/* HERO

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

        </section> */}

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

              {/* <h2 id="donate-give-title">

                Health and hope for{' '}

                <span className="hand-accent hand-accent--on-dark">

                  every child.

                </span>

              </h2> */}

            </div>

            <Campaign variant="compact" onGive={() => giveToCampaign()} />

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

                <div
                  key={programme.id}
                  className={`donate-programme-details ${tabSwitched ? 'is-switching' : ''}`}
                >
                <p className="donate-card-label">

                  {programme.label}

                </p>

                <p className="donate-price">

                  <span className="donate-price-number" aria-hidden="true">
                    $<CountUp value={programme.amount} />
                  </span>
                  <span className="sr-only">${programme.amount}</span>

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

              </div>

              {/* DONATION WIDGET */}

              <div className="donate-widget" id="donate-widget" ref={widgetRef}>

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

                    {forCampaign && (
                      <div className="donate-campaign-note">
                        <span>
                          Giving to the <strong>{campaign.title.toLowerCase()}</strong>.
                          Type any amount below.
                        </span>
                        <button type="button" onClick={() => setForCampaign(false)}>
                          Change
                        </button>
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

                      <span>{causeText}</span>

                      <strong>

                        {amountLabel} {frequencyLabel}

                      </strong>

                    </div>                    {/* DONOR DETAILS */}

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

                      {/* PHONE NUMBER */}
                      <div className="donate-field donate-field-wide">

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

                                setShowBankModal(item.id === 'bank-transfer');

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

                  {/* BANK TRANSFER DETAILS — INLINE DESIGN */}

                  {/* The panel is placed at the end of the page (a portal), so it always
                      sits above the header and the animated cards */}
                  {showBankModal && paymentMethod === 'bank-transfer' && createPortal(
                    <div className="donate-bank-modal-overlay" data-lenis-prevent onClick={() => setShowBankModal(false)}>

                    <section className="donate-bank-panel" aria-labelledby="donate-bank-panel-title" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>

                      <button type="button" className="donate-bank-modal-close" aria-label="Close bank transfer details" onClick={() => setShowBankModal(false)}><X size={22} /></button>

                      <div className="donate-bank-panel-heading">

                        <div className="donate-bank-panel-heading-inner">

                          <Landmark size={54} aria-hidden="true" />

                          <div>

                            <h3 id="donate-bank-panel-title">Bank Transfer</h3>

                            <p>Give directly through our bank account.</p>

                          </div>

                        </div>

                      </div>

                      <div className="donate-bank-panel-content">

                        <h4 className="donate-bank-section-title">Our Bank Details</h4>

                        <div className="donate-bank-account-grid donate-bank-account-grid-single">

                          <article className="donate-bank-account-card">

                            <div className="donate-bank-brand">

                              <div className="donate-equity-mark" aria-hidden="true"><span></span></div>

                              <strong className="donate-equity-wordmark">EQUITY</strong>

                              <span className="donate-equity-caption">Equity Bank<br /> (Uganda)</span>

                            </div>

                            <div className="donate-bank-account-information">

                              <div className="donate-bank-account-card-title">

                                <span className="donate-bank-flag" aria-hidden="true">🇺🇸</span>

                                <strong>USD Account (US Dollars)</strong>

                              </div>

                              <dl className="donate-bank-details-list">

                                <div><dt>Account Name</dt><dd>The Web Initiative Ltd</dd></div>

                                <div className="donate-bank-number-row">

                                  <dt>Account Number</dt>

                                  <dd><strong>1027203775339</strong></dd>

                                </div>

                                <div><dt>Currency</dt><dd>USD</dd></div>

                                <div><dt>Branch</dt><dd>Jinja Branch</dd></div>

                                <div className="donate-bank-swift-row">
                                  <dt>SWIFT / BIC Code</dt>
                                  <dd>
                                    <strong>EQBLUGKA</strong>
                                    <button
                                      type="button"
                                      className="donate-bank-copy-swift"
                                      onClick={copySwiftCode}
                                      aria-label="Copy SWIFT code EQBLUGKA"
                                    >
                                      {swiftCopied ? (
                                        <Check size={15} aria-hidden="true" />
                                      ) : (
                                        <Copy size={15} aria-hidden="true" />
                                      )}
                                      {swiftCopied ? 'Copied' : 'Copy SWIFT'}
                                    </button>
                                  </dd>
                                </div>

                              </dl>

                              <button type="button" className="donate-bank-copy-inline" onClick={copyBankDetails}>

                                {bankDetailsCopied ? <Check size={16} /> : <Copy size={16} />}

                                {bankDetailsCopied ? 'Bank details copied' : 'Copy bank details'}

                              </button>

                            </div>

                          </article>

                        </div>

                        <h4 className="donate-bank-section-title donate-bank-steps-title">How to Complete Your Transfer</h4>

                        <ol className="donate-bank-steps-grid">

                          <li>

                            <span className="donate-bank-step-icon"><Copy size={32} /></span>

                            <span className="donate-bank-step-number">01</span>

                            <strong>Copy bank details</strong>

                            <p>Copy the USD account number and SWIFT code, then make your transfer.</p>

                          </li>

                          <li>

                            <span className="donate-bank-step-icon"><RefreshCw size={32} /></span>

                            <span className="donate-bank-step-number">02</span>

                            <strong>Make your transfer</strong>

                            <p>Use mobile banking, internet banking or visit a bank branch.</p>

                          </li>

                          <li>

                            <span className="donate-bank-step-icon"><ReceiptText size={32} /></span>

                            <span className="donate-bank-step-number">03</span>

                            <strong>Keep your receipt</strong>

                            <p>Save your transaction receipt or payment reference.</p>

                          </li>

                          <li>

                            <span className="donate-bank-step-icon"><Mail size={32} /></span>

                            <span className="donate-bank-step-number">04</span>

                            <strong>Notify our team</strong>

                            <p>Email your payment confirmation for verification.</p>

                          </li>

                        </ol>

                        <div className="donate-bank-bottom-row">

                        <a href={emailHref()} className="donate-bank-notify-inline">

                          <Mail size={25} aria-hidden="true" />

                          Notify us after payment

                          <ArrowRight size={23} aria-hidden="true" />

                        </a>

                        <p className="donate-bank-confirmation-note">

                          <ShieldCheck size={24} aria-hidden="true" />

                          Your donation will be confirmed after our team verifies receipt of the funds.

                        </p>

                      </div>

                      </div>

                    </section>

                    </div>,
                    document.body

                  )}

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

                    )}


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

                    {offline && paymentMethod === 'card' ? (

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

                    ) : paymentMethod === 'bank-transfer' ? (

                      <div className="donate-offline">

                        <p>

                          Complete the transfer using the Equity Bank

                          details and follow the instructions above to

                          notify our team.

                        </p>

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

                  Visa, Mastercard and Bank Transfer options are available.

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