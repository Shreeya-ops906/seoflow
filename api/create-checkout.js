// /api/create-checkout.js
// Creates a Stripe Checkout Session with 3-day free trial (CC required upfront).
//
// Required Vercel environment variables:
//   STRIPE_SECRET_KEY  — Stripe secret key (sk_live_... or sk_test_...)
//   STRIPE_PRICE_ID    — Price ID for the $49/mo subscription (price_xxx)
//                        Find in: Stripe Dashboard → Products → your product → Prices

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' },
    });
  }
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let userId, email;
  try {
    const body = await req.json();
    userId = body.userId || '';
    email  = body.email  || '';
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const params = new URLSearchParams();
  params.append('mode', 'subscription');
  params.append('payment_method_collection', 'always'); // require CC upfront
  params.append('line_items[0][price]', process.env.STRIPE_PRICE_ID);
  params.append('line_items[0][quantity]', '1');
  params.append('subscription_data[trial_period_days]', '3');
  params.append('success_url', 'https://cruiseseo.site/app.html?trial_start=1');
  params.append('cancel_url', 'https://cruiseseo.site/onboarding.html');

  if (userId) {
    params.append('client_reference_id', userId);
    params.append('subscription_data[metadata][clerk_user_id]', userId);
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
