import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./contact";

vi.mock("@/lib/repositories/contactRepository", () => ({
  addContactSubmission: vi.fn(() => Promise.resolve()),
}));

vi.mock("@/lib/origin", () => ({
  isAllowedOrigin: vi.fn(() => true),
}));

function jsonRequest(body: unknown, origin = "https://www.reclaim.org") {
  return new Request("https://www.reclaim.org/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 and success for valid payload", async () => {
    const res = await POST({
      request: jsonRequest({
        name: "Jane Doe",
        email: "jane@example.com",
        subject: "Hello",
        message: "This is my message.",
      }),
    } as never);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ success: true });
  });

  it("accepts optional subject (empty string)", async () => {
    const res = await POST({
      request: jsonRequest({
        name: "Jane",
        email: "jane@example.com",
        subject: "",
        message: "Message here.",
      }),
    } as never);

    expect(res.status).toBe(200);
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST({
      request: jsonRequest({
        name: "",
        email: "jane@example.com",
        message: "Message.",
      }),
    } as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Name is required");
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST({
      request: jsonRequest({
        name: "Jane",
        email: "",
        message: "Message.",
      }),
    } as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Email is required");
  });

  it("returns 400 when email format is invalid", async () => {
    const res = await POST({
      request: jsonRequest({
        name: "Jane",
        email: "not-an-email",
        message: "Message.",
      }),
    } as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Please enter a valid email address");
  });

  it("returns 400 when message is missing", async () => {
    const res = await POST({
      request: jsonRequest({
        name: "Jane",
        email: "jane@example.com",
        message: "",
      }),
    } as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Message is required");
  });

  it("returns 400 when message exceeds max length", async () => {
    const res = await POST({
      request: jsonRequest({
        name: "Jane",
        email: "jane@example.com",
        message: "x".repeat(2001),
      }),
    } as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("2000");
  });

  it("returns 400 when name exceeds max length", async () => {
    const res = await POST({
      request: jsonRequest({
        name: "x".repeat(201),
        email: "jane@example.com",
        message: "Message.",
      }),
    } as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("200");
  });

  it("returns 400 when subject exceeds max length", async () => {
    const res = await POST({
      request: jsonRequest({
        name: "Jane",
        email: "jane@example.com",
        subject: "x".repeat(301),
        message: "Message.",
      }),
    } as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("300");
  });

  it("returns 400 for invalid JSON body", async () => {
    const res = await POST({
      request: new Request("https://www.reclaim.org/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "https://www.reclaim.org" },
        body: "not json",
      }),
    } as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid request body");
  });

  it("returns 400 when body is not an object", async () => {
    const res = await POST({
      request: jsonRequest("string body"),
    } as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid request body");
  });

  it("returns 403 when origin is not allowed", async () => {
    const { isAllowedOrigin } = await import("@/lib/origin");
    vi.mocked(isAllowedOrigin).mockReturnValue(false);

    const res = await POST({
      request: jsonRequest({
        name: "Jane",
        email: "jane@example.com",
        message: "Hi",
      }),
    } as never);

    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe("Invalid origin");
  });
});
