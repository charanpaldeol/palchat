import type { APIRoute } from "astro";
import { addContactSubmission } from "@/lib/repositories/contactRepository";
import { isAllowedOrigin } from "@/lib/origin";
import {
  validateName,
  validateEmail,
  validateMessage,
  validateSubject,
} from "@/lib/contactValidation";

export const POST: APIRoute = async ({ request }) => {
  if (!isAllowedOrigin(request)) {
    return new Response(
      JSON.stringify({ error: "Invalid origin" }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (body === null || typeof body !== "object") {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const name = typeof (body as Record<string, unknown>).name === "string" ? (body as Record<string, unknown>).name as string : "";
  const email = typeof (body as Record<string, unknown>).email === "string" ? (body as Record<string, unknown>).email as string : "";
  const subject = typeof (body as Record<string, unknown>).subject === "string" ? (body as Record<string, unknown>).subject as string : "";
  const message = typeof (body as Record<string, unknown>).message === "string" ? (body as Record<string, unknown>).message as string : "";

  const nameError = validateName(name);
  if (nameError) {
    return new Response(JSON.stringify({ error: nameError }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const emailError = validateEmail(email);
  if (emailError) {
    return new Response(JSON.stringify({ error: emailError }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const subjectTrimmed = subject.trim();
  const subjectError = validateSubject(subject);
  if (subjectError) {
    return new Response(JSON.stringify({ error: subjectError }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messageError = validateMessage(message);
  if (messageError) {
    return new Response(JSON.stringify({ error: messageError }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await addContactSubmission({
      name: name.trim(),
      email: email.trim(),
      subject: subjectTrimmed || null,
      message: message.trim(),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
