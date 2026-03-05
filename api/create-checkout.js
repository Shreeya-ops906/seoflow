// /api/create-checkout.js
// Creates a Stripe Checkout Session with 3-day free trial (CC required upfront).
//
// Required Vercel environment variables:
//   STRIPE_SECRET_KEY       — Stripe secret key (sk_live_... or sk_test_...)
//   STRIPE_PRICE_ID         — Price ID for the $49/mo Pro plan (price_xxx)
//   STRIPE_SCALE_PRICE_ID   — Price ID for the $149/mo Scale plan (price_xxx)
//                             Find in: Stripe Dashboard → Products → your product → Prices

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' },
    });
  }
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let userId, email, plan;
  try {
    const body = await req.json();
    userId = body.userId || '';
    email  = body.email  || '';
    plan   = body.plan === 'scale' ? 'scale' : 'pro';
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const priceId = plan === 'scale'
    ? process.env.STRIPE_SCALE_PRICE_ID
    : process.env.STRIPE_PRICE_ID;

  if (!priceId) {
    return new Response(
      JSON.stringify({ error: 'Price not configured for plan: ' + plan }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const params = new URLSearchParams();
  params.append('mode', 'subscription');
  params.append('payment_method_collection', 'always'); // require CC upfront
  params.append('line_items[0][price]', priceId);
  params.append('line_items[0][quantity]', '1');
  params.append('subscription_data[trial_period_days]', '3');
  params.append('metadata[plan_type]', plan);
  params.append('success_url', 'https://cruiseseo.site/app.html?trial_start=1');
  params.append('cancel_url', 'https://cruiseseo.site/onboarding.html');

  if (userId) {
    params.append('client_reference_id', userId);
    params.append('subscription_data[metadata][clerk_user_id]', userId);
    params.append('subscription_data[metadata][plan_type]', plan);
  }
  if (email) {
    params.append('customer_email', email);
  }

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const session = await res.json();

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: session.error?.message || 'Failed to create checkout session' }),
      { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
