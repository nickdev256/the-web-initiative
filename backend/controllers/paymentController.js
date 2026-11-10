
import { supabase } from "../config/supabase.js";

import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import {
  createObPayCheckout,
  verifyObPayTransaction,
} from "../services/obpayService.js";

import {
  createPaypalOrder,
  capturePaypalOrder,
  verifyPaypalWebhook,
} from "../services/paypalService.js";

// --------------------------------------------------
// CONFIGURATION
// --------------------------------------------------

const FRONTEND_URL = (
  process.env.FRONTEND_URL || "http://localhost:5173"
).replace(/\/+$/, "");

const ALLOWED_METHODS = ["card", "paypal"];
const ALLOWED_FREQUENCIES = ["one-time", "monthly"];
const MAX_DONATION_AMOUNT = 1000000;

// --------------------------------------------------
// GENERAL HELPERS
// --------------------------------------------------

function createReference() {
  return `TWI-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
}

function redirectToDonation(status, reference = "") {
  const url = new URL("/donate", FRONTEND_URL);

  url.searchParams.set("payment", status);

  if (reference) {
    url.searchParams.set("reference", reference);
  }

  return url.toString();
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeStatus(status) {
  const value = String(status || "").trim().toLowerCase();

  if (["success", "successful", "completed", "paid"].includes(value)) {
    return "success";
  }

  if (["failed", "failure", "declined", "cancelled", "canceled"].includes(value)) {
    return "failed";
  }

  if (["pending", "processing", "initiated"].includes(value)) {
    return "pending";
  }

  return value;
}

async function findDonationById(id) {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function findDonationByReference(reference) {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function findDonationByProviderReference(reference) {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("provider_reference", reference)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function findDonationForObPay(reference) {
  // First, try the donation's own reference.
  let donation = await findDonationByReference(reference);

  // If that fails, try the provider reference.
  if (!donation) {
    donation = await findDonationByProviderReference(reference);
  }

  return donation;
}

async function markDonationPaid(id, paymentNote = "") {
  const { error } = await supabase
    .from("donations")
    .update({
      payment_status: "paid",
      status: "completed",
      payment_note: paymentNote,
      paid_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("payment_status", "pending");

  if (error) throw error;
}

async function markDonationFailed(id, paymentNote = "") {
  const { error } = await supabase
    .from("donations")
    .update({
      payment_status: "failed",
      status: "cancelled",
      payment_note: paymentNote,
    })
    .eq("id", id)
    .eq("payment_status", "pending");

  if (error) throw error;
}

// --------------------------------------------------
// OBPAY WEBHOOK SIGNATURE VERIFICATION
// --------------------------------------------------

function verifyObPayWebhookSignature(req) {
  const secret = process.env.OBPAY_WEBHOOK_SECRET;
  const signature = req.get("X-ObPay-Signature");

  if (!secret || !signature || !req.rawBody) {
    return false;
  }

  const suppliedSignature = signature.trim().toLowerCase();

  if (!/^[a-f0-9]{64}$/.test(suppliedSignature)) {
    return false;
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(req.rawBody)
    .digest();

  const receivedSignature = Buffer.from(
    suppliedSignature,
    "hex"
  );

  return (
    expectedSignature.length === receivedSignature.length &&
    timingSafeEqual(expectedSignature, receivedSignature)
  );
}

// --------------------------------------------------
// 1. CREATE DONATION CHECKOUT
// POST /api/payments/checkout
// --------------------------------------------------

export async function createCheckout(req, res) {
  let donationId;

  try {
    const {
      donorName,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      amount,
      currency = "USD",
      cause,
      gift,
      frequency = "one-time",
      paymentMethod,
      message,
    } = req.body || {};

    const cleanName = String(donorName || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPhone = String(phone || "").trim();
    const cleanCause = String(cause || gift || "").trim();
    const cleanMessage = String(message || "").trim();

    const cleanCurrency = String(currency || "")
      .trim()
      .toUpperCase();

    const cleanPaymentMethod = String(paymentMethod || "")
      .trim()
      .toLowerCase();

    const cleanFrequency = String(frequency || "one-time")
      .trim()
      .toLowerCase();

    const donationAmount = Number(amount);

    // Required fields
    if (
      !cleanName ||
      !cleanEmail ||
      !cleanCause ||
      !cleanPaymentMethod ||
      !Number.isFinite(donationAmount) ||
      donationAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required donation details.",
      });
    }

    // Email validation
    if (!validEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Amount validation
    if (donationAmount > MAX_DONATION_AMOUNT) {
      return res.status(400).json({
        success: false,
        message: "The donation amount is above the allowed limit.",
      });
    }

    // Currency validation
    if (cleanCurrency !== "USD") {
      return res.status(400).json({
        success: false,
        message: "Only USD donations are currently supported.",
      });
    }

    // Payment method validation
    if (!ALLOWED_METHODS.includes(cleanPaymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Please select card payment or PayPal.",
      });
    }

    // Frequency validation
    if (!ALLOWED_FREQUENCIES.includes(cleanFrequency)) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation frequency.",
      });
    }

    // ObPay USD minimum
    if (cleanPaymentMethod === "card" && donationAmount < 0.5) {
      return res.status(400).json({
        success: false,
        message: "The minimum ObPay card payment is USD 0.50.",
      });
    }

    const reference = createReference();

    const billingAddress = {
      addressLine1: String(addressLine1 || "").trim(),
      addressLine2: String(addressLine2 || "").trim(),
      city: String(city || "").trim(),
      state: String(state || "").trim(),
      postalCode: String(postalCode || "").trim(),
    };

    // Save donation before creating checkout.
    const { data: donation, error: insertError } = await supabase
      .from("donations")
      .insert({
        reference,
        full_name: cleanName,
        donor_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone || null,
        billing_address: billingAddress,
        amount: donationAmount,
        currency: cleanCurrency,
        cause: cleanCause,
        frequency: cleanFrequency,
        payment_method: cleanPaymentMethod,
        status: "pending",
        payment_status: "pending",
        message: cleanMessage || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Donation database error:", insertError);
      throw new Error("Unable to save your donation.");
    }

    donationId = donation.id;

    let checkout;

    // PayPal checkout
    if (cleanPaymentMethod === "paypal") {
      checkout = await createPaypalOrder({
        id: donation.id,
        reference,
        donorName: cleanName,
        email: cleanEmail,
        amount: donationAmount,
        currency: cleanCurrency,
        cause: cleanCause,
      });
    }

    // ObPay hosted card checkout
    if (cleanPaymentMethod === "card") {
      checkout = await createObPayCheckout({
        id: donation.id,
        reference,
        donorName: cleanName,
        email: cleanEmail,
        amount: donationAmount,
        currency: cleanCurrency,
        cause: cleanCause,
      });
    }

    if (!checkout?.checkoutUrl) {
      throw new Error(
        "The payment provider did not return a checkout URL."
      );
    }

    const providerReference =
      cleanPaymentMethod === "paypal"
        ? checkout.orderId
        : checkout.providerReference || reference;

    if (!providerReference) {
      throw new Error(
        "The payment provider did not return a transaction reference."
      );
    }

    const { error: updateError } = await supabase
      .from("donations")
      .update({
        provider_reference: providerReference,
      })
      .eq("id", donation.id);

    if (updateError) throw updateError;

    return res.status(200).json({
      success: true,
      donationId: donation.id,
      reference,
      checkoutUrl: checkout.checkoutUrl,
    });
  } catch (error) {
    console.error("Create checkout error:", error);

    if (donationId) {
      try {
        await markDonationFailed(
          donationId,
          "Checkout could not be created."
        );
      } catch (updateError) {
        console.error("Could not update donation:", updateError);
      }
    }

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Unable to start your donation payment. Please try again."
          : error.message,
    });
  }
}

// --------------------------------------------------
// 2. OBPAY TRANSACTION VERIFICATION
// --------------------------------------------------

async function processObPayNotification(reference) {
  if (!reference) {
    throw new Error("ObPay transaction reference is missing.");
  }

  const donation = await findDonationForObPay(reference);

  if (!donation) {
    throw new Error("Donation record was not found.");
  }

  if (donation.payment_method !== "card") {
    throw new Error("This donation is not an ObPay card payment.");
  }

  if (donation.payment_status === "paid") {
    return {
      status: "success",
      reference: donation.reference,
    };
  }

  // Verify directly with ObPay.
  // Never trust the browser redirect as proof of payment.
  const referenceToVerify =
    donation.provider_reference || donation.reference;

  const transaction = await verifyObPayTransaction(
    referenceToVerify
  );

  const transactionReference = String(
    transaction.reference ||
    transaction.transaction_reference ||
    ""
  ).trim();

  const transactionStatus = normalizeStatus(
    transaction.status || transaction.payment_status
  );

  const transactionType = String(
    transaction.type || ""
  ).trim().toLowerCase();

  const transactionAmount = Number(transaction.amount);

  const transactionCurrency = String(
    transaction.currency || ""
  ).trim().toUpperCase();

  // Accept only the reference that was actually sent to ObPay.
  const validReferences = [
    donation.reference,
    donation.provider_reference,
  ].filter(Boolean);

  const referenceMatches = validReferences.includes(
    transactionReference
  );

  const paymentMatches =
    referenceMatches &&
    transactionType === "collection" &&
    Number.isFinite(transactionAmount) &&
    transactionAmount === Number(donation.amount) &&
    transactionCurrency === String(donation.currency).toUpperCase();

  if (!paymentMatches) {
    throw new Error(
      "ObPay payment amount, currency, type or reference does not match."
    );
  }

  if (transactionStatus === "success") {
    await markDonationPaid(
      donation.id,
      `ObPay payment verified: ${donation.reference}`
    );

    return {
      status: "success",
      reference: donation.reference,
    };
  }

  if (transactionStatus === "failed") {
    await markDonationFailed(
      donation.id,
      "ObPay reported that the payment failed."
    );

    return {
      status: "failed",
      reference: donation.reference,
    };
  }

  if (transactionStatus === "pending") {
    return {
      status: "pending",
      reference: donation.reference,
    };
  }

  throw new Error(
    "ObPay returned an unrecognised transaction status."
  );
}

// --------------------------------------------------
// 3. OBPAY CALLBACK
// GET /api/payments/obpay/callback
// --------------------------------------------------

export async function obpayCallback(req, res) {
  try {
    const reference =
      req.query.reference ||
      req.query.transaction_reference;

    const result = await processObPayNotification(reference);

    return res.redirect(
      redirectToDonation(result.status, result.reference)
    );
  } catch (error) {
    console.error("ObPay callback error:", error);

    return res.redirect(
      redirectToDonation("pending")
    );
  }
}

// --------------------------------------------------
// 4. OBPAY WEBHOOK
// POST /api/payments/obpay/webhook
// --------------------------------------------------

export async function obpayWebhook(req, res) {
  try {
    // Verify signature before processing the notification.
    if (!verifyObPayWebhookSignature(req)) {
      console.error("ObPay webhook signature verification failed.");

      return res.status(401).json({
        success: false,
        message: "Invalid ObPay webhook signature.",
      });
    }

    const reference =
      req.body?.reference ||
      req.body?.transaction_reference ||
      req.body?.data?.reference ||
      req.body?.data?.transaction_reference;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "ObPay notification is missing its reference.",
      });
    }

    const result = await processObPayNotification(reference);

    return res.status(200).json({
      success: true,
      paymentStatus: result.status,
      reference: result.reference,
    });
  } catch (error) {
    console.error("ObPay webhook error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify ObPay notification.",
    });
  }
}

// --------------------------------------------------
// 5. PAYPAL PAYMENT RETURN
// GET /api/payments/paypal/return
// --------------------------------------------------

export async function paypalReturn(req, res) {
  try {
    const orderId = req.query.token;

    if (!orderId) {
      return res.redirect(
        redirectToDonation("pending")
      );
    }

    const donation = await findDonationByProviderReference(
      orderId
    );

    if (!donation) {
      console.error(
        "PayPal donation lookup failed: no matching donation."
      );

      return res.redirect(
        redirectToDonation("pending")
      );
    }

    if (donation.payment_status === "paid") {
      return res.redirect(
        redirectToDonation("success", donation.reference)
      );
    }

    const capture = await capturePaypalOrder(orderId);

    const paymentMatches =
      capture.status === "COMPLETED" &&
      capture.donationId === donation.id &&
      capture.reference === donation.reference &&
      Number(capture.amount) === Number(donation.amount) &&
      String(capture.currency).toUpperCase() ===
        String(donation.currency).toUpperCase();

    if (!paymentMatches) {
      return res.redirect(
        redirectToDonation("pending", donation.reference)
      );
    }

    await markDonationPaid(
      donation.id,
      `PayPal capture: ${capture.captureId}`
    );

    return res.redirect(
      redirectToDonation("success", donation.reference)
    );
  } catch (error) {
    console.error("PayPal return error:", error);

    return res.redirect(
      redirectToDonation("pending")
    );
  }
}

// --------------------------------------------------
// 6. PAYPAL WEBHOOK
// POST /api/payments/paypal/webhook
// --------------------------------------------------

export async function paypalWebhook(req, res) {
  try {
    const event = req.body;

    const verified = await verifyPaypalWebhook(
      req.headers,
      event
    );

    if (!verified) {
      return res.status(401).json({
        success: false,
        message: "Invalid PayPal webhook signature.",
      });
    }

    if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
      return res.status(200).json({
        success: true,
        message: "Webhook received.",
      });
    }

    const capture = event.resource;

    const donationId = capture.custom_id;
    const amount = capture.amount?.value;
    const currency = capture.amount?.currency_code;

    if (!donationId || amount == null || !currency) {
      return res.status(200).json({
        success: true,
        message: "Webhook received without donation details.",
      });
    }

    const donation = await findDonationById(donationId);

    if (!donation) {
      return res.status(200).json({
        success: true,
        message: "Donation record was not found.",
      });
    }

    const paymentMatches =
      Number(amount) === Number(donation.amount) &&
      currency.toUpperCase() === donation.currency.toUpperCase() &&
      donation.payment_method === "paypal";

    if (!paymentMatches) {
      console.error(
        "PayPal webhook amount or currency mismatch:",
        donation.reference
      );

      return res.status(200).json({
        success: true,
        message: "Payment details did not match the donation.",
      });
    }

    if (donation.payment_status !== "paid") {
      await markDonationPaid(
        donation.id,
        `PayPal webhook capture: ${capture.id || "verified"}`
      );
    }

    return res.status(200).json({
      success: true,
      message: "Donation payment confirmed.",
    });
  } catch (error) {
    console.error("PayPal webhook error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process PayPal webhook.",
    });
  }
}

// --------------------------------------------------
// 7. DONATION PAYMENT STATUS
// GET /api/payments/status/:reference
// --------------------------------------------------

export async function getDonationPaymentStatus(req, res) {
  try {
    const reference = String(
      req.params.reference || ""
    ).trim();

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "A donation reference is required.",
      });
    }

    const donation = await findDonationByReference(reference);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation record was not found.",
      });
    }

    // Re-check ObPay while the payment is still pending.
    if (
      donation.payment_method === "card" &&
      donation.payment_status === "pending"
    ) {
      try {
        const result = await processObPayNotification(reference);

        return res.status(200).json({
          success: true,
          reference,
          paymentStatus: result.status,
        });
      } catch (verificationError) {
        console.error(
          "ObPay status verification error:",
          verificationError
        );
      }
    }

    return res.status(200).json({
      success: true,
      reference,
      paymentStatus:
        donation.payment_status === "paid"
          ? "success"
          : donation.payment_status,
    });
  } catch (error) {
    console.error("Donation status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve donation status.",
    });
  }
}
