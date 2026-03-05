// /api/generate-image.js
// Generates an AI image using OpenAI DALL-E 3 — Scale plan feature.
//
// Required Vercel env var:
//   OPENAI_API_KEY — from platform.openai.com/api-keys
//
// Cost: ~$0.04 per image (1024x1024, standard quality)
//
// Usage: POST /api/generate-image { "prompt": "..." }

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

  const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  let prompt;
  try {
    const body = await req.json();
    prompt = body.prompt || '';
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400, headers: CORS });
  }

  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Missing prompt' }), { status: 400, headers: CORS });
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'Image generation not configured' }), { status: 503, headers: CORS });
  }

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt.slice(0, 1000), // DALL-E 3 limit
        n: 1,
        size: '1792x1024',   // Landscape — ideal for blog hero
        quality: 'standard', // 'hd' costs 2× more
        style: 'natural',
        response_format: 'url',
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'OpenAI API error');
    }

    const data = await res.json();
    const url = data.data?.[0]?.url;

    if (!url) throw new Error('No image URL in response');

    return new Response(JSON.stringify({ url }), { status: 200, headers: CORS });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Image generation failed' }),
      { status: 500, headers: CORS }
    );
  }
}
