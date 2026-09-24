/**
 * Utility functions for normalizing and formatting WhatsApp numbers and links
 */

/**
 * Normalizes any Indonesian phone number string into standard international format '628xxx'
 * Examples:
 *   '0819-9154-1376' -> '6281991541376'
 *   '+62 819 9154 1376' -> '6281991541376'
 *   '81991541376' -> '6281991541376'
 *   '6281991541376' -> '6281991541376'
 */
export function normalizeWhatsAppNumber(phone: string | null | undefined, fallback: string = '6281991541376'): string {
  if (!phone) return fallback;
  
  let clean = String(phone).replace(/[^0-9]/g, '');
  if (!clean) return fallback;

  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (clean.startsWith('8')) {
    clean = '62' + clean;
  }

  return clean || fallback;
}

/**
 * Creates a valid wa.me link with optional pre-filled text
 */
export function createWhatsAppLink(phone: string | null | undefined, text?: string): string {
  const cleanPhone = normalizeWhatsAppNumber(phone);
  const baseUrl = `https://wa.me/${cleanPhone}`;
  if (text) {
    return `${baseUrl}?text=${encodeURIComponent(text)}`;
  }
  return baseUrl;
}
