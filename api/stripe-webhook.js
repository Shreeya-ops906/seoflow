// /api/stripe-webhook.js
// Handles Stripe subscription events and syncs plan status to Clerk user metadata.
//
// Required Vercel environment variables:
//   STRIPE_WEBHOOK_SECRET  — from Stripe Dashboard → Webhooks → Signing secret
//   STRIPE_SECRET_KEY      — from Stripe Dashboard → Developers → API Keys
//   CLERK_SECRET_KEY       — from Clerk Dashboard → API Keys → Secret key
//
// Stripe webhook events to subscribe to:
//   checkout.session.completed
//   customer.subscription.deleted
//   invoice.payment_failed

export const config = { runtime: 'edge' };

// ── Verify Stripe webhook signature (HMAC-SHA256) ─────────────────────────────
async function verifyStripeWebhook(payload, sigHeader, secret) {
  const parts = sigHeader.split(',');
  const ts  = parts.find(p => p.startsWith('t=')).slice(2);
  const sig = parts.find(p => p.startsWith('v1=')).slice(3);

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const raw = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${ts}.${payload}`)
  );

  const computed = [...new Uint8Array(raw)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  if (computed !== sig) throw new Error('Invalid webhook signature');
  if (Math.abs(Date.now() / 1000 - parseInt(ts)) > 300) throw new Error('Stale timestamp');

  return JSON.parse(payload);
}

// ── Update Clerk user public/private metadata ─────────────────────────────────
async function clerkUpdateUser(userId, publicMeta, privateMeta) {
  const body = {};
  if (publicMeta)  body.public_metadata  = publicMeta;
  if (privateMeta) body.private_metadata = privateMeta;

  const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Clerk update failed: ${err}`);
  }
}

// ── Tag Stripe customer with clerk_user_id for future lookups ─────────────────
async function tagStripeCustomer(customerId, clerkUserId) {
  await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `metadata[clerk_user_id]=${encodeURIComponent(clerkUserId)}`,
  });
}

// ── Fetch Stripe customer metadata ────────────────────────────────────────────
async function getStripeCustomer(customerId) {
  const res = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
    headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` },
  });
  return res.json();
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const rawBody = await req.text();
  const sig     = req.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event;
  try {
    event = await verifyStripeWebhook(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  const obj = event.data.object;

  try {
    if (event.type === 'checkout.session.completed') {
      // client_reference_id = Clerk user ID (set in the payment link URL)
      const clerkUserId = obj.client_reference_id;

      if (clerkUserId) {
        // Upgrade user in Clerk
        await clerkUpdateUser(
          clerkUserId,
          { plan: 'pro', plan_since: new Date().toISOString() },
          { stripe_customer_id: obj.customer, stripe_subscription_id: obj.subscription }
        );
        // Tag Stripe customer with clerk_user_id for future subscription events
        if (obj.customer) {
          await tagStripeCustomer(obj.customer, clerkUserId);
        }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      // Look up clerk_user_id from Stripe customer metadata
      const customer = await getStripeCustomer(obj.customer);
      const clerkUserId = customer.metadata?.clerk_user_id;

      if (clerkUserId) {
        await clerkUpdateUser(clerkUserId, { plan: 'free' }, null);
      }
    }

    if (event.type === 'invoice.payment_failed') {
      // Optionally notify user — for now just log
      console.log('Payment failed for customer:', obj.customer);
    }

  } catch (err) {
    console.error('Webhook handler error:', err.message);
    // Return 200 anyway so Stripe doesn't retry — log and handle manually
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
