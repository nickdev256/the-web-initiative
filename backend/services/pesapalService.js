
const ENVIRONMENT = (
  process.env.PESAPAL_ENVIRONMENT || "sandbox"
).trim().toLowerCase();

const BASE_URL =
  ENVIRONMENT === "live"
    ? "https://pay.pesapal.com/v3"
    : "https://cybqa.pesapal.com/pesapalv3";

let cachedToken = null;
let tokenExpiry = 0;

let registeredIpnId =
  process.env.PESAPAL_IPN_ID?.trim() || null;

const TOKEN_CACHE_DURATION = 4 * 60 * 1000;

const SUPPORTED_CURRENCIES = ["USD", "UGX"];

// --------------------------------------------------
// BACKEND CONFIGURATION
// --------------------------------------------------

function getBackendUrl() {
  const backendUrl = process.env.BACKEND_URL
    ?.trim()
    .replace(/\/+$/, "");

  if (
    !backendUrl ||
    !backendUrl.startsWith("https://")
  ) {
    throw new Error(
      "BACKEND_URL must be a public HTTPS address."
    );
  }

  return backendUrl;
}

// --------------------------------------------------
// PESAPAL CREDENTIALS
// --------------------------------------------------

function getPesapalCredentials() {
  const consumerKey =
    process.env.PESAPAL_CONSUMER_KEY?.trim();

  const consumerSecret =
    process.env.PESAPAL_CONSUMER_SECRET?.trim();

  if (!consumerKey || !consumerSecret) {
    throw new Error(
      "Pesapal credentials are not configured."
    );
  }

  return {
    consumerKey,
    consumerSecret,
  };
}

// --------------------------------------------------
// GENERAL PESAPAL REQUEST
// --------------------------------------------------

async function pesapalRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch (error) {
    throw new Error(
      `Could not connect to Pesapal: ${error.message}`
    );
  }

  const responseText = await response.text();

  let result = {};

  try {
    result = responseText
      ? JSON.parse(responseText)
      : {};
  } catch {
    throw new Error(
      `Pesapal returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok || result.error) {
    const message =
      result.error?.message ||
      result.message ||
      `Pesapal request failed (${response.status}).`;

    throw new Error(message);
  }

  return result;
}

// --------------------------------------------------
// GET PESAPAL ACCESS TOKEN
// --------------------------------------------------

export async function getPesapalToken() {
  if (
    cachedToken &&
    Date.now() < tokenExpiry
  ) {
    return cachedToken;
  }

  const {
    consumerKey,
    consumerSecret,
  } = getPesapalCredentials();

  const result = await pesapalRequest(
    "/api/Auth/RequestToken",
    {
      method: "POST",
      body: JSON.stringify({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      }),
    }
  );

  if (!result.token) {
    throw new Error(
      "Pesapal did not return an access token."
    );
  }

  cachedToken = result.token;
  tokenExpiry = Date.now() + TOKEN_CACHE_DURATION;

  return cachedToken;
}

// --------------------------------------------------
// AUTHENTICATED REQUEST
// --------------------------------------------------

async function authenticatedRequest(path, options = {}) {
  const token = await getPesapalToken();

  return pesapalRequest(path, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

// --------------------------------------------------
// CLEAN DONOR NAME FOR PESAPAL
// --------------------------------------------------

function cleanPesapalName(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._:-]/g, "");
}

// --------------------------------------------------
// FORMAT DONOR NAMES
// --------------------------------------------------

function formatDonorNames(donorName) {
  const names = String(donorName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (names.length === 0) {
    throw new Error("Donor name is required.");
  }

  const firstName = cleanPesapalName(
    names[0] || "Donor"
  );

  const middleName = cleanPesapalName(
    names.length > 2
      ? names.slice(1, -1).join("")
      : firstName
  );

  const lastName = cleanPesapalName(
    names.length > 1
      ? names[names.length - 1]
      : firstName
  );

  if (!firstName || !middleName || !lastName) {
    throw new Error(
      "Please provide a valid donor name for Pesapal."
    );
  }

  return {
    firstName,
    middleName,
    lastName,
  };
}

// --------------------------------------------------
// REGISTER PESAPAL IPN
// --------------------------------------------------

export async function registerPesapalIpn() {
  if (registeredIpnId) {
    return registeredIpnId;
  }

  const backendUrl = getBackendUrl();

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
    throw new Error(
      "Pesapal did not return an IPN registration ID."
    );
  }

  registeredIpnId = result.ipn_id;

  return registeredIpnId;
}

// --------------------------------------------------
// CREATE PESAPAL CHECKOUT
// --------------------------------------------------

export async function createPesapalCheckout({
  reference,
  donorName,
  email,
  phone,
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
  countryCode = "UG",
  amount,
  currency,
  cause,
}) {
  // Validate required donation information
  if (
    !reference ||
    !donorName ||
    !email ||
    !cause
  ) {
    throw new Error(
      "Donation reference, donor name, email and cause are required."
    );
  }

  // --------------------------------------------------
  // VALIDATE BILLING ADDRESS
  // --------------------------------------------------

  const cleanAddressLine1 = String(
    addressLine1 || ""
  ).trim();

  const cleanAddressLine2 = String(
    addressLine2 || ""
  ).trim();

  const cleanCity = String(city || "").trim();

  const cleanState = String(state || "").trim();

  const cleanPostalCode = String(
    postalCode || ""
  ).trim();

  if (!cleanAddressLine1) {
    throw new Error(
      "Billing Address Line 1 is required."
    );
  }

  if (!cleanAddressLine2) {
    throw new Error(
      "Billing Address Line 2 is required."
    );
  }

  // --------------------------------------------------
  // VALIDATE AMOUNT
  // --------------------------------------------------

  const parsedAmount = Number(amount);

  if (
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0
  ) {
    throw new Error(
      "Donation amount must be greater than zero."
    );
  }

  // --------------------------------------------------
  // VALIDATE CURRENCY
  // --------------------------------------------------

  const normalizedCurrency = String(currency || "")
    .trim()
    .toUpperCase();

  if (
    !SUPPORTED_CURRENCIES.includes(normalizedCurrency)
  ) {
    throw new Error(
      "Pesapal currency must be UGX or USD."
    );
  }

  // --------------------------------------------------
  // VALIDATE EMAIL
  // --------------------------------------------------

  const cleanEmail = String(email).trim();

  const validEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

  if (!validEmail) {
    throw new Error(
      "Please provide a valid donor email address."
    );
  }

  // --------------------------------------------------
  // VALIDATE COUNTRY CODE
  // --------------------------------------------------

  const normalizedCountryCode = String(
    countryCode || "UG"
  )
    .trim()
    .toUpperCase();

  if (!/^[A-Z]{2}$/.test(normalizedCountryCode)) {
    throw new Error(
      "Please provide a valid two-letter country code."
    );
  }

  // --------------------------------------------------
  // PREPARE PESAPAL REQUEST
  // --------------------------------------------------

  const backendUrl = getBackendUrl();

  const notificationId = await registerPesapalIpn();

  const {
    firstName,
    middleName,
    lastName,
  } = formatDonorNames(donorName);

  // All address lines are populated with donor-supplied
  // information. Do not send empty address values.

  const billingAddress = {
    email_address: cleanEmail,
    country_code: normalizedCountryCode,

    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,

    line_1: cleanAddressLine1,
    line_2: cleanAddressLine2,
  };

  if (phone && String(phone).trim()) {
    billingAddress.phone_number = String(phone).trim();
  }

  if (cleanCity) {
    billingAddress.city = cleanCity;
  }

  if (cleanState) {
    billingAddress.state = cleanState;
  }

  if (cleanPostalCode) {
    billingAddress.postal_code = cleanPostalCode;
  }

  // --------------------------------------------------
  // SUBMIT CHECKOUT REQUEST TO PESAPAL
  // --------------------------------------------------

  const result = await authenticatedRequest(
    "/api/Transactions/SubmitOrderRequest",
    {
      method: "POST",
      body: JSON.stringify({
        id: String(reference),

        currency: normalizedCurrency,
        amount: parsedAmount,

        description:
          `Donation - ${String(cause).slice(0, 70)}`,

        callback_url:
          `${backendUrl}/api/payments/pesapal/callback`,

        notification_id: notificationId,

        billing_address: billingAddress,
      }),
    }
  );

  if (
    !result.redirect_url ||
    !result.order_tracking_id
  ) {
    throw new Error(
      "Pesapal did not return a valid checkout URL and tracking ID."
    );
  }

  return {
    checkoutUrl: result.redirect_url,
    orderTrackingId: result.order_tracking_id,
  };
}

// --------------------------------------------------
// GET PESAPAL TRANSACTION STATUS
// --------------------------------------------------

export async function getPesapalTransactionStatus(
  orderTrackingId
) {
  if (!orderTrackingId) {
    throw new Error(
      "Pesapal transaction tracking ID is missing."
    );
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
