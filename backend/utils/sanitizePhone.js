// Cleans up a phone number so it always ends up as plain digits with the
// country code and no "+", no leading "00", and no spaces/dashes/parentheses.
// This makes the WhatsApp wa.me link robust even if a number was typed or
// configured with a slightly different format (00923..., +92 320..., etc).
function sanitizePhone(raw) {
  if (!raw) return "";

  // Keep digits only.
  let cleaned = String(raw).replace(/\D/g, "");

  // "00" is the international dialing prefix some people use instead of "+".
  // wa.me does not want it - strip it if present.
  if (cleaned.startsWith("00")) {
    cleaned = cleaned.slice(2);
  }

  return cleaned;
}

module.exports = sanitizePhone;
