import { useState } from "react";
import { useForm } from "react-hook-form";

const USERNAME_MIN = 2;
const USERNAME_MAX = 64;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
const PASSWORD_MIN = 6;

export type SignupFormData = {
  username: string;
  password: string;
};

type Props = {
  /** Initial server-side error message (e.g. from ?error=exists). */
  serverError?: string | null;
};

export default function SignupForm({ serverError }: Props) {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  const onSubmit = async (data: SignupFormData) => {
    setSubmitStatus("submitting");
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.set("username", data.username.trim());
      formData.set("password", data.password);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
        redirect: "manual",
      });

      if (res.type === "opaqueredirect" || res.status === 303 || res.status === 302) {
        const location = res.headers.get("Location");
        if (location) {
          window.location.href = location;
          return;
        }
      }

      if (!res.ok) {
        setSubmitError("Something went wrong. Please try again.");
        setSubmitStatus("error");
        return;
      }

      setSubmitError("Unexpected response. Please try again.");
      setSubmitStatus("error");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitStatus("error");
    }
  };

  const displayError = submitError ?? serverError;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--sp-4)",
      }}
    >
      {displayError && (
        <div className="alert alert-error" role="alert">
          {displayError}
        </div>
      )}

      <div className="field">
        <label htmlFor="signup-username" className="field-label">
          ID
        </label>
        <input
          id="signup-username"
          type="text"
          autoComplete="username"
          className={`input ${errors.username ? "input-error" : ""}`}
          {...register("username", {
            required: "Please choose an ID.",
            minLength: {
              value: USERNAME_MIN,
              message: `ID must be at least ${USERNAME_MIN} characters.`,
            },
            maxLength: {
              value: USERNAME_MAX,
              message: `ID must be ${USERNAME_MAX} characters or less.`,
            },
            pattern: {
              value: USERNAME_PATTERN,
              message: "ID can only contain letters, numbers, and underscores.",
            },
          })}
        />
        <p className="field-helper">
          2–64 characters. Letters, numbers, and underscores only.
        </p>
        {errors.username && (
          <p className="field-error" role="alert">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="signup-password" className="field-label">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          className={`input ${errors.password ? "input-error" : ""}`}
          {...register("password", {
            required: "Please choose a password.",
            minLength: {
              value: PASSWORD_MIN,
              message: `Password must be at least ${PASSWORD_MIN} characters.`,
            },
          })}
        />
        <p className="field-helper">
          At least 6 characters.
        </p>
        {errors.password && (
          <p className="field-error" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitStatus === "submitting"}>
        {submitStatus === "submitting" ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
