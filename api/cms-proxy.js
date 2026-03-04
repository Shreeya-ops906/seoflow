export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { cmsType, post, credentials } = body;

  if (!cmsType || !post) {
    return new Response(JSON.stringify({ error: 'Missing cmsType or post' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    if (cmsType === 'ghost') {
      return await publishToGhost(post, credentials);
    } else if (cmsType === 'webflow') {
      return await publishToWebflow(post, credentials);
    } else if (cmsType === 'custom') {
      return await publishToCustom(post, credentials);
    } else {
      return new Response(JSON.stringify({ error: 'Unknown CMS type: ' + cmsType }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Publish failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// ── Ghost CMS ─────────────────────────────────────────────────────────────────
// Generates a short-lived JWT from the Ghost Admin API Key (id:secret format)
async function ghostJWT(adminApiKey) {
  const [id, secret] = adminApiKey.split(':');
  if (!id || !secret) throw new Error('Ghost Admin API Key must be in format id:secret');

  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: id }))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payload = btoa(JSON.stringify({ iat: now, exp: now + 300, aud: '/admin/' }))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const keyBytes = hexToBytes(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );

  const sigBuffer = await crypto.subtle.sign('HMAC', cryptoKey, strToBuffer(header + '.' + payload));
  const sig = bufferToBase64url(sigBuffer);

  return `${header}.${payload}.${sig}`;
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function strToBuffer(str) {
  return new TextEncoder().encode(str);
}

function bufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = '';
  bytes.forEach(b => str += String.fromCharCode(b));
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function publishToGhost(post, credentials) {
  const { ghostUrl, adminApiKey } = credentials || {};
  if (!ghostUrl || !adminApiKey) {
    return new Response(JSON.stringify({ error: 'Ghost URL and Admin API Key required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const token = await ghostJWT(adminApiKey);
  const baseUrl = ghostUrl.replace(/\/$/, '');

  const ghostPost = {
    title: post.title,
    html: post.content_html || post.content,
    status: post.status === 'future' ? 'scheduled' : 'published',
    ...(post.status === 'future' && post.date ? { published_at: post.date } : {}),
    ...(post.tags ? { tags: post.tags.map(t => ({ name: t })) } : {})
  };

  const res = await fetch(`${baseUrl}/ghost/api/admin/posts/?source=html`, {
    method: 'POST',
    headers: {
      'Authorization': 'Ghost ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ posts: [ghostPost] })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errMsg = data.errors?.[0]?.message || 'Ghost publish failed';
    return new Response(JSON.stringify({ error: errMsg, raw: data }), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  }

  const published = data.posts?.[0];
  return new Response(JSON.stringify({
    success: true,
    id: published?.id,
    url: published?.url,
    title: published?.title
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

// ── Webflow CMS ───────────────────────────────────────────────────────────────
async function publishToWebflow(post, credentials) {
  const { siteId, collectionId, apiToken, fieldMap } = credentials || {};
  if (!collectionId || !apiToken) {
    return new Response(JSON.stringify({ error: 'Webflow Collection ID and API Token required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // fieldMap lets users specify which Webflow fields map to title/body/etc.
  // Defaults: name → title, body → content_html, slug → auto
  const nameField = fieldMap?.title || 'name';
  const bodyField = fieldMap?.body || 'post-body';
  const slugField = fieldMap?.slug || 'slug';

  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);

  const fieldData = {
    [nameField]: post.title,
    [bodyField]: post.content_html || post.content,
    [slugField]: slug,
    _archived: false,
    _draft: false
  };

  // Create item
  const res = await fetch(`https://api.webflow.com/v2/collections/${collectionId}/items`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiToken,
      'Content-Type': 'application/json',
      'accept-version': '1.0.0'
    },
    body: JSON.stringify({ fieldData })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return new Response(JSON.stringify({ error: data.message || 'Webflow publish failed', raw: data }), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  }

  // Publish the item (live)
  if (siteId) {
    await fetch(`https://api.webflow.com/v2/sites/${siteId}/publish`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ domains: [] })
    }).catch(() => {}); // Non-fatal if publish fails
  }

  return new Response(JSON.stringify({
    success: true,
    id: data.id,
    url: data.fieldData?.[slugField] ? `https://${siteId ? siteId : 'your-site'}.webflow.io/${slug}` : null,
    title: post.title
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

// ── Custom REST API ───────────────────────────────────────────────────────────
async function publishToCustom(post, credentials) {
  const { endpoint, authType, authValue, fieldMap, method } = credentials || {};
  if (!endpoint) {
    return new Response(JSON.stringify({ error: 'Custom API endpoint URL required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // Build auth header
  let authHeader = '';
  if (authType === 'bearer') authHeader = 'Bearer ' + authValue;
  else if (authType === 'basic') authHeader = 'Basic ' + btoa(authValue);
  else if (authType === 'apikey') authHeader = authValue;

  // fieldMap: { title: 'title', body: 'content', status: 'status' }
  const titleField = fieldMap?.title || 'title';
  const bodyField = fieldMap?.body || 'content';
  const statusField = fieldMap?.status || 'status';

  const payload = {
    [titleField]: post.title,
    [bodyField]: post.content_html || post.content,
    [statusField]: post.status || 'published'
  };

  const headers = { 'Content-Type': 'application/json' };
  if (authHeader) headers['Authorization'] = authHeader;

  const res = await fetch(endpoint, {
    method: method || 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch { data = { raw: text }; }

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Custom API returned ' + res.status, raw: data }), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({
    success: true,
    id: data.id || data._id || null,
    url: data.url || data.link || data.permalink || null,
    title: post.title,
    raw: data
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
