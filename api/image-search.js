// /api/image-search.js
// Proxies Unsplash photo search — keeps the API key server-side.
//
// Required Vercel env var:
//   UNSPLASH_ACCESS_KEY — from unsplash.com/developers (free, 50 req/hr)
//
// Usage: GET /api/image-search?q=marketing+agency&count=6

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const url = new URL(req.url);
  const q     = url.searchParams.get('q') || 'business';
  const count = Math.min(parseInt(url.searchParams.get('count') || '6', 10), 12);

  const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  // Fallback: picsum if no API key configured
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    const urls = Array.from({ length: count }, (_, i) => ({
      regular: `https://picsum.photos/seed/${encodeURIComponent(q)}${i}/800/450`,
      full:    `https://picsum.photos/seed/${encodeURIComponent(q)}${i}/1600/900`,
      credit:  null,
    }));
    return new Response(JSON.stringify({ urls }), { headers: CORS });
  }

  try {
    const searchRes = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=${count}&orientation=landscape`,
      { headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
    );

    if (!searchRes.ok) {
      throw new Error('Unsplash API error: ' + searchRes.status);
    }

    const data = await searchRes.json();
    const results = (data.results || []).map(photo => ({
      thumb:   photo.urls?.thumb,
      regular: photo.urls?.regular,
      full:    photo.urls?.full,
      credit:  photo.user?.name || null,
      credit_url: photo.user?.links?.html || null,
    }));

    return new Response(JSON.stringify({ urls: results }), { headers: CORS });
  } catch (err) {
    // Fallback to picsum on any error
    const urls = Array.from({ length: count }, (_, i) => ({
      regular: `https://picsum.photos/seed/${encodeURIComponent(q)}${i}/800/450`,
      full:    `https://picsum.photos/seed/${encodeURIComponent(q)}${i}/1600/900`,
      credit:  null,
    }));
    return new Response(JSON.stringify({ urls, fallback: true }), { headers: CORS });
  }
}
