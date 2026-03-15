/**
 * Contact form validation constants and helpers.
 * Keep in sync with client (ContactForm) and server (api/contact).
 */

export const CONTACT_LIMITS = {
  MAX_NAME_LENGTH: 200,
  MAX_EMAIL_LENGTH: 254,
  MAX_SUBJECT_LENGTH: 300,
  MAX_MESSAGE_LENGTH: 2000,
} as const;

/** Simple email format: local@domain.tld (no spaces, has @ and domain). */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required";
  if (trimmed.length > CONTACT_LIMITS.MAX_EMAIL_LENGTH) return "Email is too long";
  if (!EMAIL_REGEX.test(trimmed)) return "Please enter a valid email address";
  return null;
}

export function validateName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Name is required";
  if (trimmed.length > CONTACT_LIMITS.MAX_NAME_LENGTH) return `Name must be ${CONTACT_LIMITS.MAX_NAME_LENGTH} characters or less`;
  return null;
}

export function validateMessage(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Message is required";
  if (trimmed.length > CONTACT_LIMITS.MAX_MESSAGE_LENGTH) return `Message must be ${CONTACT_LIMITS.MAX_MESSAGE_LENGTH} characters or less`;
  return null;
}

export function validateSubject(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length > CONTACT_LIMITS.MAX_SUBJECT_LENGTH) return `Subject must be ${CONTACT_LIMITS.MAX_SUBJECT_LENGTH} characters or less`;
  return null;
}
