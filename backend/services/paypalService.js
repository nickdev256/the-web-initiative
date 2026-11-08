import { timedFetch } from "../utils/helpers.js";

const PAYPAL_BASE_URL = (
  process.env.PAYPAL_BASE_URL ||
  "https://api-m.sandbox.paypal.com"
).replace(/\/$/, "");

function requirePaypalConfig() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "PayPal credentials are missing. Check your backend/.env file."
    );
  }

  return { clientId, clientSecret };
}

// Obtain an access token from PayPal.
async function getPaypalAccessToken() {
  const { clientId, clientSecret } = requirePaypalConfig();

  const credentials = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const response = await timedFetch(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error("Unable to authenticate with PayPal.");
  }

  return data.access_token;
}

// Create a PayPal donation checkout.
export async function createPaypalOrder(donation) {
  const accessToken = await getPaypalAccessToken();

  const frontendUrl = process.env.FRONTEND_URL;
  const backendUrl = process.env.BACKEND_URL;

  if (!frontendUrl || !backendUrl) {
    throw new Error("Frontend or backend URL is missing.");
  }

  const amount = Number(donation.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid donation amount.");
  }

  const currency = String(donation.currency || "USD").toUpperCase();

  if (currency !== "USD") {
    throw new Error("This PayPal checkout currently supports USD only.");
  }

  const response = await timedFetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `donation-${donation.reference}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",

        purchase_units: [
          {
            reference_id: donation.reference,
            custom_id: donation.id,
            invoice_id: donation.reference,

            description: String(
              donation.cause || "Donation to The Web Initiative Limited"
            ).slice(0, 127),

            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
          },
        ],

        payment_source: {
          paypal: {
            experience_context: {
              brand_name: "THE WEB INITIATIVE LIMITED",
              user_action: "PAY_NOW",
              return_url: `${backendUrl}/api/payments/paypal/return`,
              cancel_url: `${frontendUrl}/donate?payment=cancelled`,
            },
          },
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("PayPal order creation failed:", data);
    throw new Error("Unable to create PayPal checkout.");
  }

  const approvalLink = data.links?.find(
    (link) =>
      link.rel === "payer-action" || link.rel === "approve"
  );

  if (!data.id || !approvalLink?.href) {
    throw new Error("PayPal did not return a checkout URL.");
  }

  return {
    orderId: data.id,
    checkoutUrl: approvalLink.href,
  };
}

// Capture an approved PayPal order.
export async function capturePaypalOrder(orderId) {
  if (!orderId) {
    throw new Error("PayPal order ID is missing.");
  }

  const accessToken = await getPaypalAccessToken();

  const response = await timedFetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(
      orderId
    )}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `capture-${orderId}`,
      },
      body: JSON.stringify({}),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("PayPal capture failed:", data);
    throw new Error("Unable to capture PayPal payment.");
  }

  const purchaseUnit = data.purchase_units?.[0];
  const capture = purchaseUnit?.payments?.captures?.[0];

  if (!capture) {
    throw new Error("PayPal did not return payment capture details.");
  }

  return {
    orderId: data.id,
    status: capture.status,
    captureId: capture.id,
    amount: capture.amount?.value,
    currency: capture.amount?.currency_code,
    donationId: purchaseUnit.custom_id,
    reference: purchaseUnit.reference_id,
  };
}

// Verify that a webhook notification genuinely came from PayPal.
export async function verifyPaypalWebhook(headers, webhookEvent) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    throw new Error("PAYPAL_WEBHOOK_ID is missing from backend/.env.");
  }

  const accessToken = await getPaypalAccessToken();

  const response = await timedFetch(
    `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: headers["paypal-auth-algo"],
        cert_url: headers["paypal-cert-url"],
        transmission_id: headers["paypal-transmission-id"],
        transmission_sig: headers["paypal-transmission-sig"],
        transmission_time: headers["paypal-transmission-time"],
        webhook_id: webhookId,
        webhook_event: webhookEvent,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("PayPal webhook verification failed:", data);
    return false;
  }

  return data.verification_status === "SUCCESS";
}