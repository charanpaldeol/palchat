import { describe, it, expect } from "vitest";
import {
  validateName,
  validateEmail,
  validateMessage,
  validateSubject,
  CONTACT_LIMITS,
} from "./contactValidation";

describe("contactValidation", () => {
  describe("validateName", () => {
    it("returns error when empty", () => {
      expect(validateName("")).toBe("Name is required");
      expect(validateName("   ")).toBe("Name is required");
    });
    it("returns null when valid", () => {
      expect(validateName("Jane")).toBeNull();
      expect(validateName("  Jane  ")).toBeNull();
    });
    it("returns error when over max length", () => {
      expect(validateName("x".repeat(CONTACT_LIMITS.MAX_NAME_LENGTH + 1))).toContain("200");
    });
    it("accepts exactly max length", () => {
      expect(validateName("x".repeat(CONTACT_LIMITS.MAX_NAME_LENGTH))).toBeNull();
    });
  });

  describe("validateEmail", () => {
    it("returns error when empty", () => {
      expect(validateEmail("")).toBe("Email is required");
      expect(validateEmail("   ")).toBe("Email is required");
    });
    it("returns null for valid emails", () => {
      expect(validateEmail("a@b.co")).toBeNull();
      expect(validateEmail("user@example.com")).toBeNull();
    });
    it("returns error for invalid format", () => {
      expect(validateEmail("no-at-sign")).toBe("Please enter a valid email address");
      expect(validateEmail("@nodomain.com")).toBe("Please enter a valid email address");
      expect(validateEmail("nodomain")).toBe("Please enter a valid email address");
    });
    it("returns error when over max length", () => {
      // MAX_EMAIL_LENGTH is 254; need 255+ to fail
      expect(validateEmail("a@b." + "c".repeat(251))).toBe("Email is too long");
    });
  });

  describe("validateMessage", () => {
    it("returns error when empty", () => {
      expect(validateMessage("")).toBe("Message is required");
      expect(validateMessage("   ")).toBe("Message is required");
    });
    it("returns null when valid", () => {
      expect(validateMessage("Hello world")).toBeNull();
    });
    it("returns error when over max length", () => {
      expect(validateMessage("x".repeat(CONTACT_LIMITS.MAX_MESSAGE_LENGTH + 1))).toContain("2000");
    });
  });

  describe("validateSubject", () => {
    it("returns null when empty (optional)", () => {
      expect(validateSubject("")).toBeNull();
      expect(validateSubject("   ")).toBeNull();
    });
    it("returns error when over max length", () => {
      expect(validateSubject("x".repeat(CONTACT_LIMITS.MAX_SUBJECT_LENGTH + 1))).toContain("300");
    });
  });
});
