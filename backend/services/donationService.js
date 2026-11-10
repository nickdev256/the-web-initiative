
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000'
).replace(/\/+$/, '');

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error('The server returned an invalid response.');
  }

  if (!response.ok || data?.success === false) {
    throw new Error(
      data?.message ||
      data?.error ||
      'The request could not be completed. Please try again.'
    );
  }

  return data;
}

/**
 * Creates a donation and starts the selected payment checkout.
 *
 * Supported methods:
 * - card: ObPay
 * - paypal: PayPal
 *
 * The backend is responsible for creating the donation record
 * and communicating with the payment provider.
 */
export async function createDonationCheckout(donation) {
  if (!donation || typeof donation !== 'object') {
    throw new Error('Donation details are missing.');
  }

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
    currency = 'USD',
    cause,
    gift,
    frequency = 'one-time',
    paymentMethod,
    message,
  } = donation;

  if (!donorName?.trim()) {
    throw new Error('Please enter your full name.');
  }

  if (!email?.trim()) {
    throw new Error('Please enter your email address.');
  }

  if (!Number.isFinite(Number(amount)) || Number(amount) < 0.5) {
    throw new Error('Please enter a valid donation amount.');
  }

  if (!['card', 'paypal'].includes(paymentMethod)) {
    throw new Error('Please select a valid payment method.');
  }

  if (!['one-time', 'monthly'].includes(frequency)) {
    throw new Error('Please select a valid donation frequency.');
  }

  const payload = {
    donorName: donorName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone || '',

    addressLine1: addressLine1 || '',
    addressLine2: addressLine2 || '',
    city: city || '',
    state: state || '',
    postalCode: postalCode || '',

    amount: Number(amount),
    currency,
    cause: cause || '',
    gift: gift || '',
    frequency,
    paymentMethod,
    message: message || '',
  };

  const result = await apiRequest('/api/payments/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // Support either a direct checkoutUrl or a nested data response.
  const checkoutUrl =
    result?.checkoutUrl ||
    result?.data?.checkoutUrl;

  if (!checkoutUrl) {
    throw new Error(
      'The server did not return a payment checkout URL.'
    );
  }

  return {
    ...result,
    checkoutUrl,
  };
}

/**
 * Retrieves the status of a donation using its reference.
 * The backend should verify the transaction with the provider.
 */
export async function getDonationStatus(reference) {
  if (!reference) {
    throw new Error('A donation reference is required.');
  }

  return apiRequest(
    `/api/payments/status/${encodeURIComponent(reference)}`,
    {
      method: 'GET',
    }
  );
}
