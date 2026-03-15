import { useState, useId } from "react";
import { useForm } from "react-hook-form";

const MAX_WORDS = 200;

function countWords(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export type CommentFormData = {
  comment: string;
};

type Props = {
  /** Shown after a server redirect with success=1 */
  justSaved?: boolean;
  /** Shown after a server redirect with error=1 */
  hasError?: boolean;
};

export default function CommentForm({ justSaved = false, hasError = false }: Props) {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting">("idle");
  const wordCountId = useId();
  const errorId = useId();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CommentFormData>({
    mode: "onChange",
    defaultValues: { comment: "" },
  });

  const commentValue = watch("comment", "");
  const words = countWords(commentValue ?? "");
  const isOverLimit = words > MAX_WORDS;
  const isEmpty = words === 0;

  const validateWordCount = (value: string) => {
    const w = countWords(value);
    if (w === 0) return "Please enter at least 1 word.";
    if (w > MAX_WORDS) return `Please keep comments to ${MAX_WORDS} words or fewer.`;
    return true;
  };

  const onSubmit = async (data: CommentFormData) => {
    const w = countWords(data.comment);
    if (w === 0 || w > MAX_WORDS) return;
    setSubmitStatus("submitting");
    const formData = new FormData();
    formData.set("comment", data.comment.trim());
    try {
      const res = await fetch("/api/add-comment?redirect=/comments", {
        method: "POST",
        body: formData,
        redirect: "manual",
      });
      const location = res.headers.get("Location");
      if (location) {
        window.location.href = location;
        return;
      }
      window.location.href = "/comments?error=1";
    } catch {
      window.location.href = "/comments?error=1";
    } finally {
      setSubmitStatus("idle");
    }
  };

  const commentError = errors.comment?.message;
  const showError = commentError || (isOverLimit && commentValue?.trim());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
      {justSaved && (
        <div className="alert alert-success" style={{ marginTop: "var(--sp-3)" }} role="status">
          Saved. Your comment has been stored in the database.
        </div>
      )}

      {hasError && (
        <div className="alert alert-error" style={{ marginTop: "var(--sp-3)" }} role="alert">
          Please enter between 1 and 200 words before saving.
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          marginTop: "var(--sp-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--sp-4)",
        }}
        noValidate
      >
        <div className="field">
          <label htmlFor="comment" className="field-label">
            Your comment
          </label>
          <textarea
            id="comment"
            rows={4}
            className={`input ${showError ? "input-error" : ""}`}
            aria-describedby={`${wordCountId} ${showError ? errorId : undefined}`}
            aria-invalid={!!showError}
            {...register("comment", {
              required: "Please enter at least 1 word.",
              validate: validateWordCount,
            })}
          />
          <p id={wordCountId} className="field-helper">
            <span aria-live="polite">
              {words} / {MAX_WORDS} words
            </span>
            . Empty comments or longer inputs will show an error and will not be saved.
          </p>
          {showError && (
            <p id={errorId} className="field-error" role="alert">
              {commentError ||
                (isOverLimit ? `Please keep comments to ${MAX_WORDS} words or fewer.` : "Please enter at least 1 word.")}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitStatus === "submitting" || isEmpty || isOverLimit}
        >
          {submitStatus === "submitting" ? "Saving…" : "Save comment"}
        </button>
      </form>
    </div>
  );
}
