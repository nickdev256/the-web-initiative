
const API_URL = import.meta.env.VITE_API_URL;

export async function createDonationCheckout(data) {
  if (!API_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const response = await fetch(`${API_URL}/api/payments/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to initiate donation payment."
    );
  }

  if (!result.checkoutUrl) {
    throw new Error("Checkout URL was not returned.");
  }

  return result;
}
