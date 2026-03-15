import { useState } from "react";
import { useForm } from "react-hook-form";

export type LoginFormData = {
  username: string;
  password: string;
};

type Props = {
  /** Initial server-side error message (e.g. from ?error=invalid). */
  serverError?: string | null;
  /** Redirect path to send with login (e.g. from ?redirect=). */
  redirect?: string;
};

export default function LoginForm({ serverError, redirect }: Props) {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setSubmitStatus("submitting");
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.set("username", data.username.trim());
      formData.set("password", data.password);
      if (redirect) formData.set("redirect", redirect);

      const res = await fetch("/api/auth/login", {
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
        <label htmlFor="login-username" className="field-label">
          ID
        </label>
        <input
          id="login-username"
          type="text"
          autoComplete="username"
          className={`input ${errors.username ? "input-error" : ""}`}
          {...register("username", {
            required: "Please enter your ID.",
          })}
        />
        {errors.username && (
          <p className="field-error" role="alert">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="login-password" className="field-label">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          className={`input ${errors.password ? "input-error" : ""}`}
          {...register("password", {
            required: "Please enter your password.",
          })}
        />
        {errors.password && (
          <p className="field-error" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitStatus === "submitting"}>
        {submitStatus === "submitting" ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
