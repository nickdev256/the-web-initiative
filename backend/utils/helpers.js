
// Escape special characters before inserting values into XML.
export function xmlEscape(value = "") {
  return String(value).replace(/[<>&'"]/g, (character) => {
    const entities = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

// Extract a value from an XML response.
export function xmlValue(xml, tag) {
  // Escape the tag name before using it in a regular expression.
  const safeTag = String(tag).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const expression = new RegExp(
    `<${safeTag}(?:\\s[^>]*)?>([\\s\\S]*?)</${safeTag}>`,
    "i"
  );

  const match = String(xml).match(expression);

  if (!match) {
    return "";
  }

  return match[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

// Make HTTP requests with a 20-second timeout.
export async function timedFetch(url, options = {}, timeout = 20000) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The request timed out. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
