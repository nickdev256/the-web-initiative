
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export async function createDonationCheckout(data) {
  if (!API_URL) {
    throw new Error(
      "Backend API URL is not configured. Check your frontend .env file."
    );
  }

  try {
    const response = await fetch(`${API_URL}/api/payments/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message || "Unable to initiate donation payment."
      );
    }

    if (!result.success || !result.checkoutUrl) {
      throw new Error(
        result.message || "Payment checkout link was not returned."
      );
    }

    return result;
  } catch (error) {
    console.error("Donation checkout request failed:", error);

    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to the payment server. Please try again."
      );
    }

    throw error;
  }
}
