#!/usr/bin/env node
/**
 * Smoke test for the live site (run after deploy).
 * Usage: LIVE_URL=https://www.reclaim.org node scripts/smoke-test-live.mjs
 * Or:   npm run test:live
 *
 * - GET /contact → 200
 * - POST /api/contact with valid payload and Origin → 200 (creates one real submission)
 */

const BASE = process.env.LIVE_URL || "https://www.reclaim.org";

async function run() {
  let failed = 0;

  // 1. Contact page loads
  try {
    const res = await fetch(`${BASE}/contact`, { redirect: "manual" });
    if (res.status !== 200) {
      console.error(`FAIL GET /contact: expected 200, got ${res.status}`);
      failed++;
    } else {
      console.log("OK  GET /contact → 200");
    }
  } catch (e) {
    console.error("FAIL GET /contact:", e.message);
    failed++;
  }

  // 2. Contact API accepts valid POST (same-origin)
  try {
    const res = await fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE,
        Referer: `${BASE}/contact`,
      },
      body: JSON.stringify({
        name: "Smoke Test",
        email: "smoke-test@example.com",
        subject: "Live smoke test",
        message: "Automated smoke test after deploy. Safe to delete.",
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status !== 200) {
      console.error(`FAIL POST /api/contact: expected 200, got ${res.status}`, data);
      failed++;
    } else {
      console.log("OK  POST /api/contact → 200");
    }
  } catch (e) {
    console.error("FAIL POST /api/contact:", e.message);
    failed++;
  }

  if (failed > 0) {
    process.exit(1);
  }
  console.log("\nSmoke test passed.");
}

run();
