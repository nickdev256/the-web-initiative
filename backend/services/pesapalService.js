
const ENVIRONMENT = (
  process.env.PESAPAL_ENVIRONMENT || "sandbox"
).toLowerCase();

const BASE_URL =
  ENVIRONMENT === "live"
    ? "https://pay.pesapal.com/v3"
    : "https://cybqa.pesapal.com/pesapalv3";

let cachedToken = null;
let tokenExpiry = 0;
let registeredIpnId = process.env.PESAPAL_IPN_ID || null;

async function pesapalRequest(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.error) {
    throw new Error(
      result.error?.message ||
      result.message ||
      `Pesapal request failed (${response.status}).`
    );
  }

  return result;
}

export async function getPesapalToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error("Pesapal credentials are not configured.");
  }

  const result = await pesapalRequest("/api/Auth/RequestToken", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    }),
  });

  if (!result.token) {
    throw new Error("Pesapal did not return an access token.");
  }

  cachedToken = result.token;
  tokenExpiry = Date.now() + 4 * 60 * 1000;

  return cachedToken;
}

async function authenticatedRequest(path, options = {}) {
  const token = await getPesapalToken();

  return pesapalRequest(path, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function registerPesapalIpn() {
  if (registeredIpnId) {
    return registeredIpnId;
  }

  const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");

  if (!backendUrl || !backendUrl.startsWith("https://")) {
    throw new Error(
      "BACKEND_URL must be a public HTTPS address to register the Pesapal IPN."
    );
  }

  const result = await authenticatedRequest(
    "/api/URLSetup/RegisterIPN",
    {
      method: "POST",
      body: JSON.stringify({
        url: `${backendUrl}/api/payments/pesapal/ipn`,
        ipn_notification_type: "GET",
      }),
    }
  );

  if (!result.ipn_id) {
    throw new Error("Pesapal did not return an IPN registration ID.");
  }

  registeredIpnId = result.ipn_id;

  return registeredIpnId;
}

export async function createPesapalCheckout({
  reference,
  donorName,
  email,
  phone,
  amount,
  currency,
  cause,
}) {
  const notificationId = await registerPesapalIpn();

  const names = String(donorName).trim().split(/\s+/);
  const firstName = names.shift() || "Donor";
  const lastName = names.join(" ");

  const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");

  if (!backendUrl || !backendUrl.startsWith("https://")) {
    throw new Error("A public HTTPS BACKEND_URL is required.");
  }

  const result = await authenticatedRequest(
    "/api/Transactions/SubmitOrderRequest",
    {
      method: "POST",
      body: JSON.stringify({
        id: reference,
        currency,
        amount,
        description: `Donation - ${String(cause).slice(0, 70)}`,
        callback_url: `${backendUrl}/api/payments/pesapal/callback`,
        notification_id: notificationId,
        billing_address: {
          email_address: email,
          phone_number: phone || "",
          country_code: "UG",
          first_name: firstName,
          last_name: lastName || firstName,
        },
      }),
    }
  );

  if (!result.redirect_url || !result.order_tracking_id) {
    throw new Error(
      "Pesapal did not return a valid checkout URL and tracking ID."
    );
  }

  return {
    checkoutUrl: result.redirect_url,
    orderTrackingId: result.order_tracking_id,
  };
}

export async function getPesapalTransactionStatus(orderTrackingId) {
  if (!orderTrackingId) {
    throw new Error("Pesapal transaction tracking ID is missing.");
  }

  return authenticatedRequest(
    `/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(
      orderTrackingId
    )}`,
    {
      method: "GET",
    }
  );
}
