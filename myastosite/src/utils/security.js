/**
 * Security utilities for PalChat
 * Provides common security functions to prevent XSS, CSRF, and other attacks
 */

// HTML sanitization function
export function sanitizeHtml(html) {
  if (typeof html !== 'string') return '';
  
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<a[^>]*href\s*=\s*["']javascript:/gi, '<a href="#"')
    .replace(/<img[^>]*on\w+\s*=/gi, '<img')
    .trim();
}

// HTML escaping function
export function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Input validation function
export function validateInput(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';
  
  const sanitized = sanitizeHtml(input);
  
  if (sanitized.length > maxLength) {
    throw new Error(`Input too long. Maximum length is ${maxLength} characters.`);
  }
  
  return sanitized;
}

// Rate limiting utility
export class RateLimiter {
  constructor(limit = 5, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.store = new Map();
  }
  
  check(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.store.has(key)) {
      this.store.set(key, []);
    }
    
    const requests = this.store.get(key);
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    if (recentRequests.length >= this.limit) {
      return false; // Rate limit exceeded
    }
    
    recentRequests.push(now);
    this.store.set(key, recentRequests);
    return true; // Within rate limit
  }
  
  cleanup() {
    const now = Date.now();
    for (const [key, requests] of this.store.entries()) {
      const recentRequests = requests.filter(timestamp => now - timestamp < this.windowMs);
      if (recentRequests.length === 0) {
        this.store.delete(key);
      } else {
        this.store.set(key, recentRequests);
      }
    }
  }
}

// CSRF token generation and validation
export function generateCSRFToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function validateCSRFToken(token, expectedToken) {
  return token === expectedToken;
}

// Content Security Policy builder
export function buildCSP(options = {}) {
  const {
    allowInlineScripts = false,
    allowInlineStyles = false,
    allowExternalFonts = true,
    allowExternalImages = true,
    allowExternalConnections = false
  } = options;
  
  const directives = {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'"],
    'font-src': ["'self'"],
    'img-src': ["'self'"],
    'connect-src': ["'self'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  };
  
  if (allowInlineScripts) {
    directives['script-src'].push("'unsafe-inline'");
  }
  
  if (allowInlineStyles) {
    directives['style-src'].push("'unsafe-inline'");
  }
  
  if (allowExternalFonts) {
    directives['font-src'].push('https://fonts.gstatic.com');
    directives['style-src'].push('https://fonts.googleapis.com');
  }
  
  if (allowExternalImages) {
    directives['img-src'].push('data:', 'https:');
  }
  
  if (allowExternalConnections) {
    directives['connect-src'].push('https:');
  }
  
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

// Security headers configuration
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Input length limits
export const inputLimits = {
  subject: 200,
  message: 2000,
  pseudonym: 100,
  comment: 1000,
  search: 100
};

// Dangerous patterns for XSS detection
export const dangerousPatterns = {
  script: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  iframe: /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  object: /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  embed: /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  javascript: /javascript:/gi,
  eventHandlers: /on\w+\s*=/gi,
  javascriptLinks: /<a[^>]*href\s*=\s*["']javascript:/gi,
  javascriptImages: /<img[^>]*on\w+\s*=/gi
};

// Check if input contains dangerous patterns
export function containsDangerousPatterns(input) {
  if (typeof input !== 'string') return false;
  
  return Object.values(dangerousPatterns).some(pattern => pattern.test(input));
} 