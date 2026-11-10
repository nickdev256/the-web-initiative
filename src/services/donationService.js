
const API_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "")
).replace(/\/+$/, "");

async function parseResponse(response) {
  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message ||
      result.error ||
      `Payment server returned error ${response.status}.`
    );
  }

  return result;
}

// --------------------------------------------------
// CREATE DONATION CHECKOUT
// --------------------------------------------------

export async function createDonationCheckout(data) {
  if (!API_URL) {
    throw new Error(
      "Backend API URL is not configured. Check VITE_API_URL."
    );
  }

  try {
    const response = await fetch(
      `${API_URL}/api/payments/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await parseResponse(response);

    if (!result.success || !result.checkoutUrl) {
      throw new Error(
        result.message ||
        "Payment checkout link was not returned."
      );
    }

    return result;
  } catch (error) {
    console.error("Donation checkout request failed:", error);

    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to the payment server. Please check your internet connection or try again."
      );
    }

    throw error;
  }
}

// --------------------------------------------------
// CHECK DONATION PAYMENT STATUS
// --------------------------------------------------

export async function getDonationPaymentStatus(reference) {
  if (!API_URL) {
    throw new Error(
      "Backend API URL is not configured. Check VITE_API_URL."
    );
  }

  if (!reference) {
    throw new Error("Donation reference is missing.");
  }

  try {
    const response = await fetch(
      `${API_URL}/api/payments/status/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    const result = await parseResponse(response);

    if (!result.success) {
      throw new Error(
        result.message ||
        "Unable to check donation payment status."
      );
    }

    return result;
  } catch (error) {
    console.error("Payment status request failed:", error);

    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to the payment server."
      );
    }

    throw error;
  }
}
