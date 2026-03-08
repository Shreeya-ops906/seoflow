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
  const q        = url.searchParams.get('q') || 'business';
  const count    = Math.min(parseInt(url.searchParams.get('count') || '6', 10), 12);
  const download = url.searchParams.get('download') === '1';

  const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  // Download mode: fetch first image and return as base64 for WordPress featured image
  if (download) {
    let imgUrl = null;
    const rand = Math.floor(Math.random() * 100);
    if (process.env.PEXELS_API_KEY) {
      try {
        const sr = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=5&orientation=landscape`,
          { headers: { 'Authorization': process.env.PEXELS_API_KEY } }
        );
        if (sr.ok) {
          const sd = await sr.json();
          const photos = sd.photos || [];
          if (photos.length) {
            const p = photos[Math.floor(Math.random() * photos.length)];
            imgUrl = p?.src?.large || null;
          }
        }
      } catch (_) {}
    }
    if (!imgUrl) imgUrl = `https://picsum.photos/seed/${encodeURIComponent(q)}${rand}/1200/675`;
    try {
      const ir = await fetch(imgUrl);
      if (!ir.ok) return new Response(JSON.stringify({ error: 'fetch_failed' }), { headers: CORS });
      const buf = await ir.arrayBuffer();
      if (buf.byteLength > 700000) return new Response(JSON.stringify({ error: 'too_large' }), { headers: CORS });
      const mime = ir.headers.get('content-type')?.split(';')[0] || 'image/jpeg';
      const bytes = new Uint8Array(buf);
      let bin = '';
      for (let i = 0; i < bytes.byteLength; i += 8192)
        bin += String.fromCharCode(...bytes.subarray(i, Math.min(i + 8192, bytes.byteLength)));
      return new Response(JSON.stringify({ b64: btoa(bin), mime }), { headers: CORS });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { headers: CORS });
    }
  }

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
