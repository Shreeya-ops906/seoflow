// /api/save-autopilot.js
// Saves a user's autopilot settings to Clerk private metadata so the
// nightly cron can find them and publish on their behalf.
//
// Required Vercel env vars:
//   CLERK_SECRET_KEY

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let userId, settings;
  try {
    const body = await req.json();
    userId   = body.userId;
    settings = body.settings; // { enabled, wpUrl, wpPass, brand, keywords, tone, frequency, bookingUrl }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid body' }), { status: 400, headers: CORS });
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400, headers: CORS });
  }

  if (!process.env.CLERK_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'CLERK_SECRET_KEY not configured' }), { status: 503, headers: CORS });
  }

  // Fetch current private metadata so we can merge (preserve lastRun, keywordIndex etc.)
  const getRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: { 'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}` }
  });
  const user = getRes.ok ? await getRes.json() : {};
  const existing = user.private_metadata?.autopilot || {};

  const merged = {
    ...existing,
    ...settings,
    updatedAt: new Date().toISOString()
  };

  const patchRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ private_metadata: { autopilot: merged } })
  });

  if (!patchRes.ok) {
    const err = await patchRes.text();
    return new Response(JSON.stringify({ error: 'Clerk update failed: ' + err }), { status: 500, headers: CORS });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: CORS });
}
