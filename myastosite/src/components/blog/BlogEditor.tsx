import React, { useRef, useState } from "react";
import type { Editor } from "@tiptap/core";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const BlogEditor: React.FC = () => {
  const editorRef = useRef<Editor | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const editor = editorRef.current;
    if (!editor) return;

    const contentHtml = editor.getHTML();
    const payload = {
      title: title.trim(),
      description: description.trim(),
      contentHtml,
    };

    if (!payload.title || !payload.description || !payload.contentHtml || contentHtml === "<p></p>") {
      setError("Please add a title, description, and some content.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/blog/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data && typeof data.error === "string"
            ? data.error
            : "Something went wrong while saving your post. Please try again.";
        setError(message);
        return;
      }

      const data = await res.json();
      if (data && typeof data.slug === "string") {
        window.location.href = `/blog/${data.slug}/`;
      } else {
        window.location.href = "/blog";
      }
    } catch {
      setError("Something went wrong while saving your post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="blog-editor-form" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="field">
        <label htmlFor="blog-title" className="field-label">
          Title
        </label>
        <input
          id="blog-title"
          type="text"
          className="input"
          value={title}
          maxLength={200}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your essay a clear title"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="blog-description" className="field-label">
          Description
        </label>
        <input
          id="blog-description"
          type="text"
          className="input"
          value={description}
          maxLength={400}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A short summary that will appear in the list"
          required
        />
      </div>

      <div className="field">
        <label className="field-label">
          Body
        </label>
        <div className="blog-editor-shell blog-editor-shell--simple">
          <SimpleEditor
            initialContent={{ type: "doc", content: [] }}
            editorRef={editorRef}
            hideThemeToggle
          />
        </div>
        <p className="field-helper">
          Use the toolbar for headings, lists, bold, italic, links, images, and more.
        </p>
      </div>

      <div>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Publishing…" : "Publish essay"}
        </button>
      </div>
    </form>
  );
};

export default BlogEditor;
