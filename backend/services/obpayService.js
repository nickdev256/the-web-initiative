
import { timedFetch } from "../utils/helpers.js";

// ==================================================
// OBPAY CONFIGURATION
// ==================================================

const OBPAY_BASE_URL = (
  process.env.OBPAY_BASE_URL ||
  "https://obpay.online/api/public/v1"
).replace(/\/+$/, "");

function requireObPayConfig() {
  const secretKey = process.env.OBPAY_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "ObPay secret key is missing. Configure OBPAY_SECRET_KEY."
    );
  }

  return secretKey;
}

// ==================================================
// RESPONSE HANDLING
// ==================================================

async function readResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("ObPay returned an invalid response.");
  }
}

function validateCheckoutUrl(url) {
  if (!url) {
    throw new Error("ObPay did not return a checkout URL.");
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("ObPay returned an invalid checkout URL.");
  }

  if (parsedUrl.protocol !== "https:") {
    throw new Error(
      "ObPay returned an insecure checkout URL."
    );
  }

  return parsedUrl.toString();
}

function getTransaction(data) {
  return (
    data?.data?.transaction ||
    data?.data ||
    data?.transaction ||
    data
  );
}

// ==================================================
// CREATE OBPAY CARD CHECKOUT
// POST /services/cards
// ==================================================

export async function createObPayCheckout(donation) {
  const secretKey = requireObPayConfig();

  if (!donation?.reference || !donation?.id) {
    throw new Error(
      "Donation reference or ID is missing."
    );
  }

  const amount = Number(donation.amount);

  const currency = String(
    donation.currency || "USD"
  ).trim().toUpperCase();

  if (!Number.isFinite(amount) || amount < 0.5) {
    throw new Error(
      "The minimum card donation is USD 0.50."
    );
  }

  if (currency !== "USD") {
    throw new Error(
      "Only USD card donations are supported."
    );
  }

  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    throw new Error(
      "BACKEND_URL is missing from backend configuration."
    );
  }

  const cleanBackendUrl = backendUrl.replace(/\/+$/, "");

  const customerName = String(
    donation.donorName || "Donor"
  ).trim();

  const customerEmail = String(
    donation.email || ""
  ).trim();

  if (!customerEmail) {
    throw new Error(
      "Customer email is required for ObPay checkout."
    );
  }

  const payload = {
    reference: donation.reference,
    amount,
    currency,

    customer_name: customerName,
    customer_email: customerEmail,

    description: String(
      donation.cause ||
      "Donation to The Web Initiative Limited"
    )
      .trim()
      .slice(0, 127),

    // ObPay server notification endpoint.
    callback_url:
      `${cleanBackendUrl}/api/payments/obpay/webhook`,

    // Donor returns through backend verification.
    redirect_url:
      `${cleanBackendUrl}/api/payments/obpay/callback`,
  };

  const response = await timedFetch(
    `${OBPAY_BASE_URL}/services/cards`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    },
    15000
  );

  const data = await readResponse(response);

  if (!response.ok || data.success === false) {
    console.error("ObPay checkout error:", {
      status: response.status,
      message: data.message,
    });

    throw new Error(
      data.message ||
      "Unable to create ObPay checkout."
    );
  }

  const checkoutUrl =
    data.data?.checkout_url ||
    data.checkout_url ||
    data.data?.checkoutUrl ||
    data.checkoutUrl;

  const providerReference =
    data.data?.reference ||
    data.data?.transaction_reference ||
    data.reference ||
    data.transaction_reference ||
    donation.reference;

  if (!providerReference) {
    throw new Error(
      "ObPay did not return a transaction reference."
    );
  }

  return {
    checkoutUrl: validateCheckoutUrl(checkoutUrl),

    providerReference: String(
      providerReference
    ),

    status:
      data.data?.status ||
      data.status ||
      "pending",

    raw: data,
  };
}

// ==================================================
// VERIFY OBPAY TRANSACTION
// GET /transactions/{reference}
// ==================================================

export async function verifyObPayTransaction(
  reference,
  timeout = 6000
) {
  const secretKey = requireObPayConfig();

  if (!reference) {
    throw new Error(
      "ObPay transaction reference is missing."
    );
  }

  const response = await timedFetch(
    `${OBPAY_BASE_URL}/transactions/${encodeURIComponent(
      reference
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        Accept: "application/json",
      },
    },
    timeout
  );

  const data = await readResponse(response);

  if (!response.ok || data.success === false) {
    console.error("ObPay verification error:", {
      status: response.status,
      message: data.message,
    });

    throw new Error(
      data.message ||
      "Unable to verify ObPay transaction."
    );
  }

  const transaction = getTransaction(data);

  if (
    !transaction ||
    typeof transaction !== "object" ||
    Array.isArray(transaction)
  ) {
    throw new Error(
      "ObPay returned incomplete transaction information."
    );
  }

  return transaction;
}
