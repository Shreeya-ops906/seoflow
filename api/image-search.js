// /api/image-search.js
// Proxies Pexels photo search — keeps the API key server-side.
//
// Required Vercel env var:
//   PEXELS_API_KEY — from pexels.com/api (free, 200 req/hr, commercial use allowed)
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

  // Fallback: picsum if no API key configured yet
  if (!process.env.PEXELS_API_KEY) {
    const urls = Array.from({ length: count }, (_, i) => ({
      regular: `https://picsum.photos/seed/${encodeURIComponent(q)}${i}/800/450`,
      full:    `https://picsum.photos/seed/${encodeURIComponent(q)}${i}/1600/900`,
      credit:  null,
    }));
    return new Response(JSON.stringify({ urls }), { headers: CORS });
  }

  try {
    const searchRes = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${count}&orientation=landscape`,
      { headers: { 'Authorization': process.env.PEXELS_API_KEY } }
    );

    if (!searchRes.ok) {
      throw new Error('Pexels API error: ' + searchRes.status);
    }

    const data = await searchRes.json();
    const results = (data.photos || []).map(photo => ({
      thumb:   photo.src?.medium,
      regular: photo.src?.large,
      full:    photo.src?.original,
      credit:  photo.photographer || null,
      credit_url: photo.photographer_url || null,
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
