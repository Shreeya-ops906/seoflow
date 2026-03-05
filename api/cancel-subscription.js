// /api/cancel-subscription.js
// Cancels a Stripe subscription at period end (user keeps access until billing period ends).
//
// Required Vercel environment variables:
//   STRIPE_SECRET_KEY  — Stripe secret key
//   CLERK_SECRET_KEY   — Clerk secret key

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let userId;
  try {
    const body = await req.json();
    userId = body.userId || '';
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // 1. Fetch user from Clerk to get stripe_subscription_id from private metadata
  const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: { 'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}` },
  });

  if (!clerkRes.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch user data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const user = await clerkRes.json();
  const subscriptionId = user.private_metadata?.stripe_subscription_id;

  if (!subscriptionId) {
    return new Response(JSON.stringify({ error: 'No active subscription found for this account' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // 2. Cancel the subscription at period end via Stripe
  const stripeRes = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'cancel_at_period_end=true',
  });

  if (!stripeRes.ok) {
    const stripeErr = await stripeRes.json();
    return new Response(
      JSON.stringify({ error: stripeErr.error?.message || 'Failed to cancel subscription' }),
      { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const sub = await stripeRes.json();
  const cancelAt = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  // 3. Mark cancellation pending in Clerk public metadata (plan stays active until period end)
  await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      public_metadata: { plan_cancel_at: cancelAt },
    }),
  });

  return new Response(
    JSON.stringify({ success: true, cancel_at: cancelAt }),
    { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
  );
}
