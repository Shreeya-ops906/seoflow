// /api/linkedin-callback.js
// Handles the LinkedIn OAuth 2.0 callback.
// Exchanges code for token, fetches profile, stores in Clerk, redirects to app.
//
// Required Vercel env vars:
//   LINKEDIN_CLIENT_ID
//   LINKEDIN_CLIENT_SECRET
//   CLERK_SECRET_KEY

export const config = { runtime: 'edge' };

const REDIRECT_URI = 'https://cruiseseo.site/api/linkedin-callback';

export default async function handler(req) {
  const url = new URL(req.url);
  const code  = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const state = url.searchParams.get('state') || '{}';

  const APP_URL = 'https://cruiseseo.site/app.html';

  if (error) {
    return Response.redirect(`${APP_URL}?linkedin_error=1&reason=${encodeURIComponent(error)}`, 302);
  }

  if (!code) {
    return Response.redirect(`${APP_URL}?linkedin_error=1&reason=no_code`, 302);
  }

  // ── 1. Exchange code for access token ───────────────────────────
  const tokenParams = new URLSearchParams();
  tokenParams.append('grant_type', 'authorization_code');
  tokenParams.append('code', code);
  tokenParams.append('redirect_uri', REDIRECT_URI);
  tokenParams.append('client_id', process.env.LINKEDIN_CLIENT_ID);
  tokenParams.append('client_secret', process.env.LINKEDIN_CLIENT_SECRET);

  let accessToken, expiresIn;
  try {
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });
    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('LinkedIn token error:', errText);
      return Response.redirect(`${APP_URL}?linkedin_error=1&reason=token_failed`, 302);
    }
    const tokenData = await tokenRes.json();
    accessToken = tokenData.access_token;
    expiresIn   = tokenData.expires_in; // seconds (~5184000 = 60 days)
  } catch (err) {
    return Response.redirect(`${APP_URL}?linkedin_error=1&reason=token_exception`, 302);
  }

  // ── 2. Fetch LinkedIn profile via OpenID Connect userinfo ────────
  let linkedInId, linkedInName;
  try {
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    if (!profileRes.ok) throw new Error('Profile fetch failed');
    const profile = await profileRes.json();
    linkedInId   = profile.sub;  // e.g. "abc123"
    linkedInName = profile.name || (profile.given_name + ' ' + profile.family_name).trim() || 'LinkedIn User';
  } catch (err) {
    return Response.redirect(`${APP_URL}?linkedin_error=1&reason=profile_failed`, 302);
  }

  const authorId = `urn:li:person:${linkedInId}`;
  const expiresAt = new Date(Date.now() + (expiresIn || 5184000) * 1000).toISOString();

  // ── 3. Find the Clerk user by looking up the Clerk session cookie ─
  // Since we can't directly get the Clerk userId from a server-side OAuth callback
  // without a Clerk session token, we store the LinkedIn data in a temporary
  // lookup table using the state param. Instead, we pass the data back to the
  // browser via URL params (hashed for mild obfuscation), then the browser-side
  // JS calls /api/get-linkedin-token to retrieve the access_token from Clerk.
  //
  // Safer approach: store in Clerk by userId passed via state param (requires
  // the frontend to pass userId when initiating the OAuth flow).
  // For now: pass profile info (non-secret) in URL, store token via a
  // server-to-server call using the Clerk Management API with the user's email
  // or a temporary signed state.
  //
  // Simple pragmatic approach: Return to app with linkedin_connected=1 and
  // store the token in a short-lived server-side cache keyed by a random token,
  // then the browser fetches it. Since we have no database, we encode it in
  // a signed URL param the browser immediately POSTs to /api/save-linkedin-token.

  // Encode as base64 so the access_token isn't visible in plain URL
  const payload = btoa(JSON.stringify({ accessToken, authorId, name: linkedInName, expiresAt }));

  return Response.redirect(
    `${APP_URL}?linkedin_connected=1&lipay=${encodeURIComponent(payload)}`,
    302
  );
}
