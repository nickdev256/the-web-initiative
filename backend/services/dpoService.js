import {
  xmlEscape,
  xmlValue,
  timedFetch,
} from "../utils/helpers.js";

const DPO_API_URL =
  process.env.DPO_API_URL ||
  "https://secure.3gdirectpay.com/API/v6/";

const DPO_PAYMENT_URL =
  process.env.DPO_PAYMENT_URL ||
  "https://secure.3gdirectpay.com//payv2.php?ID=";

function requireDpoConfig() {
  const companyToken = process.env.DPO_COMPANY_TOKEN;
  const serviceTypeId = process.env.DPO_SERVICE_TYPE_ID;

  if (!companyToken || !serviceTypeId) {
    throw new Error(
      "DPO configuration is incomplete. Check DPO_COMPANY_TOKEN and DPO_SERVICE_TYPE_ID."
    );
  }

  return { companyToken, serviceTypeId };
}

// Send an XML request to DPO.
async function sendDpoRequest(xml) {
  const response = await timedFetch(DPO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/xml",
      Accept: "application/xml",
    },
    body: xml,
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`DPO request failed with HTTP ${response.status}.`);
  }

  const result = {
    code: xmlValue(responseText, "Result"),
    explanation: xmlValue(responseText, "ResultExplanation"),
    transToken: xmlValue(responseText, "TransToken"),
    transRef: xmlValue(responseText, "TransRef"),
    raw: responseText,
  };

  if (result.code !== "000") {
    throw new Error(
      result.explanation || "DPO could not process the payment request."
    );
  }

  return result;
}

// Create a hosted DPO checkout.
export async function createDpoCheckout(donation) {
  const { companyToken, serviceTypeId } = requireDpoConfig();

  const frontendUrl = process.env.FRONTEND_URL;
  const backendUrl = process.env.BACKEND_URL;

  if (!frontendUrl || !backendUrl) {
    throw new Error("Frontend or backend URL is missing from configuration.");
  }

  const amount = Number(donation.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid donation amount.");
  }

  const donorName = String(donation.donorName || "").trim();
  const nameParts = donorName.split(/\s+/);
  const firstName = nameParts.shift() || "Donor";
  const lastName = nameParts.join(" ") || " ";

  const reference = String(donation.reference);
  const email = String(donation.email || "").trim();
  const phone = String(donation.phone || "").trim();

  const transactionXml = `
    <API3G>
      <CompanyToken>${xmlEscape(companyToken)}</CompanyToken>
      <Request>createToken</Request>

      <Transaction>
        <PaymentAmount>${amount.toFixed(2)}</PaymentAmount>
        <PaymentCurrency>${xmlEscape(
          String(donation.currency || "USD").toUpperCase()
        )}</PaymentCurrency>

        <CompanyRef>${xmlEscape(reference)}</CompanyRef>
        <RedirectURL>${xmlEscape(
          `${backendUrl}/api/payments/dpo/return`
        )}</RedirectURL>
        <BackURL>${xmlEscape(`${frontendUrl}/donate?payment=cancelled`)}</BackURL>

        <CompanyRefUnique>1</CompanyRefUnique>
        <PTL>30</PTL>

        <CustomerFirstName>${xmlEscape(firstName)}</CustomerFirstName>
        <CustomerLastName>${xmlEscape(lastName)}</CustomerLastName>
        <CustomerEmail>${xmlEscape(email)}</CustomerEmail>
        <CustomerPhone>${xmlEscape(phone)}</CustomerPhone>

        <DefaultPayment>${xmlEscape(
          donation.paymentMethod === "card" ? "CC" : ""
        )}</DefaultPayment>
      </Transaction>

      <Services>
        <Service>
          <ServiceType>${xmlEscape(serviceTypeId)}</ServiceType>
          <ServiceDescription>${xmlEscape(
            donation.cause || "Donation to The Web Initiative Limited"
          )}</ServiceDescription>
          <ServiceDate>${new Date().toISOString().slice(0, 10)}</ServiceDate>
        </Service>
      </Services>
    </API3G>
  `;

  const result = await sendDpoRequest(transactionXml);

  if (!result.transToken) {
    throw new Error("DPO did not return a transaction token.");
  }

  return {
    token: result.transToken,
    checkoutUrl: `${DPO_PAYMENT_URL}${encodeURIComponent(
      result.transToken
    )}`,
  };
}

// Verify a DPO transaction before marking a donation as paid.
export async function verifyDpoPayment(token) {
  const { companyToken } = requireDpoConfig();

  if (!token) {
    throw new Error("DPO transaction token is missing.");
  }

  const verificationXml = `
    <API3G>
      <CompanyToken>${xmlEscape(companyToken)}</CompanyToken>
      <Request>verifyToken</Request>
      <TransactionToken>${xmlEscape(token)}</TransactionToken>
    </API3G>
  `;

  const result = await sendDpoRequest(verificationXml);

  return {
    resultCode: result.code,
    explanation: result.explanation,
    transactionReference: result.transRef,
    transactionToken: result.transToken,
    raw: result.raw,
  };
}