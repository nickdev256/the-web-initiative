
import { supabase } from "../config/supabase.js";

import {
  createPesapalCheckout,
  getPesapalTransactionStatus,
} from "../services/pesapalService.js";

import {
  createPaypalOrder,
  capturePaypalOrder,
  verifyPaypalWebhook,
} from "../services/paypalService.js";

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const ALLOWED_METHODS = ["card", "paypal"];
const ALLOWED_FREQUENCIES = ["one-time", "monthly"];

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

async function findDonationById(id) {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;
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
      amount,
      currency = "USD",
      cause,
      frequency = "one-time",
      paymentMethod,
      message,
    } = req.body;

    const cleanName = String(donorName || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPhone = String(phone || "").trim();
    const donationAmount = Number(amount);

    if (
      !cleanName ||
      !cleanEmail ||
      !cause ||
      !paymentMethod ||
      !Number.isFinite(donationAmount) ||
      donationAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required donation details.",
      });
    }

    if (!validEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (donationAmount > 1000000) {
      return res.status(400).json({
        success: false,
        message: "The donation amount is above the allowed limit.",
      });
    }

    if (String(currency).toUpperCase() !== "USD") {
      return res.status(400).json({
        success: false,
        message: "Only USD donations are currently supported.",
      });
    }

    if (!ALLOWED_METHODS.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Please select Visa, Mastercard or PayPal.",
      });
    }

    if (!ALLOWED_FREQUENCIES.includes(frequency)) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation frequency.",
      });
    }

    const reference = createReference();

    // Save donation before starting payment.
    const { data: donation, error: insertError } = await supabase
      .from("donations")
      .insert({
        reference,
        full_name: cleanName,
        donor_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone || null,
        amount: donationAmount,
        currency: "USD",
        cause: String(cause).trim(),
        frequency,
        payment_method: paymentMethod,
        status: "pending",
        payment_status: "pending",
        message: String(message || "").trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Donation database error:", insertError);
      throw new Error("Unable to save your donation.");
    }

    donationId = donation.id;

    let checkout;

    if (paymentMethod === "paypal") {
      checkout = await createPaypalOrder({
        id: donation.id,
        reference,
        donorName: cleanName,
        email: cleanEmail,
        amount: donationAmount,
        currency: "USD",
        cause,
      });
    } else {
      checkout = await createPesapalCheckout({
        reference,
        donorName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        amount: donationAmount,
        currency: "USD",
        cause,
      });
    }

    if (!checkout?.checkoutUrl) {
      throw new Error(
        "The payment provider did not return a checkout URL."
      );
    }

    const providerReference =
      paymentMethod === "paypal"
        ? checkout.orderId
        : checkout.orderTrackingId;

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
// 2. PESAPAL PAYMENT VERIFICATION
// --------------------------------------------------

async function processPesapalNotification(req) {
  const orderTrackingId =
    req.query.OrderTrackingId ||
    req.body?.OrderTrackingId ||
    req.body?.orderTrackingId;

  const merchantReference =
    req.query.OrderMerchantReference ||
    req.body?.OrderMerchantReference ||
    req.body?.orderMerchantReference;

  if (!orderTrackingId || !merchantReference) {
    throw new Error("Pesapal notification is missing transaction details.");
  }

  const { data: donation, error } = await supabase
    .from("donations")
    .select("*")
    .eq("reference", merchantReference)
    .maybeSingle();

  if (error) throw error;

  if (!donation) {
    throw new Error("Donation record was not found.");
  }

  if (
    donation.payment_method !== "card" ||
    donation.provider_reference !== orderTrackingId
  ) {
    throw new Error("Pesapal transaction does not match the donation.");
  }

  // Always verify payment directly with Pesapal.
  const transaction =
    await getPesapalTransactionStatus(orderTrackingId);

  const paymentStatus = String(
    transaction.payment_status_description || ""
  ).trim().toUpperCase();

  const paymentMatches =
    transaction.merchant_reference === donation.reference &&
    Number(transaction.amount) === Number(donation.amount) &&
    String(transaction.currency || "").toUpperCase() ===
      String(donation.currency || "").toUpperCase();

  if (!paymentMatches) {
    throw new Error(
      "Pesapal payment amount, currency or reference does not match."
    );
  }

  if (paymentStatus === "COMPLETED") {
    if (donation.payment_status !== "paid") {
      await markDonationPaid(
        donation.id,
        `Pesapal payment verified: ${
          transaction.confirmation_code || orderTrackingId
        }`
      );
    }

    return {
      status: "success",
      reference: donation.reference,
    };
  }

  if (paymentStatus === "FAILED") {
    if (donation.payment_status === "pending") {
      await markDonationFailed(
        donation.id,
        "Pesapal reported that the payment failed."
      );
    }

    return {
      status: "failed",
      reference: donation.reference,
    };
  }

  return {
    status: "pending",
    reference: donation.reference,
  };
}

// --------------------------------------------------
// 3. PESAPAL CALLBACK
// GET /api/payments/pesapal/callback
// --------------------------------------------------

export async function pesapalCallback(req, res) {
  try {
    const result = await processPesapalNotification(req);

    return res.redirect(
      redirectToDonation(result.status, result.reference)
    );
  } catch (error) {
    console.error("Pesapal callback error:", error);

    return res.redirect(redirectToDonation("pending"));
  }
}

// --------------------------------------------------
// 4. PESAPAL IPN
// GET /api/payments/pesapal/ipn
// --------------------------------------------------

export async function pesapalIpn(req, res) {
  try {
    const result = await processPesapalNotification(req);

    return res.status(200).json({
      orderNotificationType:
        req.query.OrderNotificationType || "IPNCHANGE",
      orderTrackingId: req.query.OrderTrackingId || "",
      orderMerchantReference:
        req.query.OrderMerchantReference || "",
      status: 200,
      paymentStatus: result.status,
    });
  } catch (error) {
    console.error("Pesapal IPN error:", error);

    return res.status(500).json({
      status: 500,
      message: "Unable to process Pesapal notification.",
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
      return res.redirect(redirectToDonation("pending"));
    }

    const { data: donation, error } = await supabase
      .from("donations")
      .select("*")
      .eq("provider_reference", orderId)
      .maybeSingle();

    if (error || !donation) {
      console.error("PayPal donation lookup failed:", error);

      return res.redirect(redirectToDonation("pending"));
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
      capture.currency === donation.currency.toUpperCase();

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

    return res.redirect(redirectToDonation("pending"));
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

    if (!donationId || !amount || !currency) {
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
