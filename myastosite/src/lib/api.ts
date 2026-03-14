/**
 * Backend API base URL (server-side only).
 * Set API_URL in .env / Vercel to your deployed API project (e.g. https://reclaim-api.vercel.app).
 * In dev, set to where the api project runs (e.g. http://localhost:3000).
 */
export function getApiUrl(): string {
  return import.meta.env.API_URL ?? "";
}
