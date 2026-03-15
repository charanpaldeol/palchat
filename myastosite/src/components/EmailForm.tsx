import { useForm } from "react-hook-form";

export type EmailFormData = {
  email: string;
};

type Props = {
  onSubmit?: (data: EmailFormData) => void;
};

export default function EmailForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit?.(data);
        console.log(data);
      })}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--sp-4)",
      }}
    >
      <div className="field">
        <label htmlFor="contact-email" className="field-label">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          className={`input ${errors.email ? "input-error" : ""}`}
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="field-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}
