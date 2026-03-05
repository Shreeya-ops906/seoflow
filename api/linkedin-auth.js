// /api/linkedin-auth.js
// Initiates LinkedIn OAuth 2.0 flow.
//
// Required Vercel env vars:
//   LINKEDIN_CLIENT_ID     — from LinkedIn Developer App
//   LINKEDIN_CLIENT_SECRET — from LinkedIn Developer App
//
// In LinkedIn Developer App, add this Authorized Redirect URL:
//   https://cruiseseo.site/api/linkedin-callback
//
// Products to enable in LinkedIn Developer App:
//   "Sign In with LinkedIn using OpenID Connect"
//   "Share on LinkedIn"

export const config = { runtime: 'edge' };

const REDIRECT_URI = 'https://cruiseseo.site/api/linkedin-callback';
const SCOPES = 'openid profile w_member_social';

export default async function handler(req) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;

  if (!clientId) {
    return new Response('LinkedIn OAuth not configured. Set LINKEDIN_CLIENT_ID in Vercel.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // State param — the `from` query carries where to return (setup or settings)
  const url = new URL(req.url);
  const from = url.searchParams.get('from') || 'settings';
  const state = encodeURIComponent(JSON.stringify({ from }));

  const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('scope', SCOPES);
  authUrl.searchParams.set('state', state);

  return Response.redirect(authUrl.toString(), 302);
}
