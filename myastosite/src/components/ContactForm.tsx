import { useState } from "react";
import { useForm } from "react-hook-form";
import { CONTACT_LIMITS, EMAIL_REGEX } from "@/lib/contactValidation";

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Props = {
  /** Called after successful submit (e.g. for analytics). */
  onSuccess?: () => void;
};

export default function ContactForm({ onSuccess }: Props) {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus("sending");
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          subject: data.subject?.trim() || null,
          message: data.message.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(json.error ?? "Something went wrong. Please try again.");
        setSubmitStatus("error");
        return;
      }
      setSubmitStatus("success");
      reset();
      onSuccess?.();
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitStatus("error");
    }
  };

  if (submitStatus === "success") {
    return (
      <div
        className="alert"
        style={{
          background: "var(--color-success-bg)",
          border: "1px solid var(--color-success)",
          color: "var(--color-text-primary)",
        }}
        role="status"
      >
        Thanks for reaching out. We’ll get back to you soon.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--sp-4)",
      }}
    >
      {submitError && (
        <div className="alert alert-error" role="alert">
          {submitError}
        </div>
      )}

      <div className="field">
        <label htmlFor="contact-name" className="field-label">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          className={`input ${errors.name ? "input-error" : ""}`}
          {...register("name", {
          required: "Name is required",
          maxLength: {
            value: CONTACT_LIMITS.MAX_NAME_LENGTH,
            message: `Name must be ${CONTACT_LIMITS.MAX_NAME_LENGTH} characters or less`,
          },
        })}
        />
        {errors.name && (
          <p className="field-error" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="contact-email" className="field-label">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          className={`input ${errors.email ? "input-error" : ""}`}
          {...register("email", {
          required: "Email is required",
          pattern: {
            value: EMAIL_REGEX,
            message: "Please enter a valid email address",
          },
          maxLength: {
            value: CONTACT_LIMITS.MAX_EMAIL_LENGTH,
            message: "Email is too long",
          },
        })}
        />
        {errors.email && (
          <p className="field-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="contact-subject" className="field-label">
          Subject <span className="body-text-small" style={{ color: "var(--color-text-secondary)", fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          className="input"
          {...register("subject", {
          maxLength: {
            value: CONTACT_LIMITS.MAX_SUBJECT_LENGTH,
            message: `Subject must be ${CONTACT_LIMITS.MAX_SUBJECT_LENGTH} characters or less`,
          },
        })}
        />
      </div>

      <div className="field">
        <label htmlFor="contact-message" className="field-label">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className={`input ${errors.message ? "input-error" : ""}`}
          {...register("message", {
            required: "Message is required",
            maxLength: {
              value: CONTACT_LIMITS.MAX_MESSAGE_LENGTH,
              message: `Message must be ${CONTACT_LIMITS.MAX_MESSAGE_LENGTH} characters or less`,
            },
          })}
        />
        {errors.message && (
          <p className="field-error" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitStatus === "sending"}>
        {submitStatus === "sending" ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
