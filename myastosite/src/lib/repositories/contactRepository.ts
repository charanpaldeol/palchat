import { query } from "../db";

export type ContactSubmission = {
  name: string;
  email: string;
  subject: string | null;
  message: string;
};

export async function addContactSubmission(data: ContactSubmission): Promise<void> {
  await query(
    "INSERT INTO contact_submissions (name, email, subject, message) VALUES ($1, $2, $3, $4)",
    [data.name, data.email, data.subject ?? null, data.message],
  );
}
