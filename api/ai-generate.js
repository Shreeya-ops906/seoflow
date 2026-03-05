export const config = { runtime: 'edge' };

// ── IP rate limiter (in-memory; resets on cold start) ─────────────────────────
const rl = new Map();
const RL_MAX = 30;      // requests allowed per window per IP
const RL_WIN = 3600e3;  // 1 hour window

function rateCheck(ip) {
  const now = Date.now();
  let e = rl.get(ip);
  if (!e || now > e.reset) e = { n: 0, reset: now + RL_WIN };
  e.n++;
  rl.set(ip, e);
  return e.n <= RL_MAX;
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  // ── Origin guard ─────────────────────────────────────────────────────────────
  const origin = req.headers.get('origin') || '';
  const host   = req.headers.get('host')   || '';
  const allowed =
    origin.includes('cruiseseo.site') ||
    host.includes('cruiseseo.site')   ||
    origin.includes('vercel.app')     ||
    origin.includes('localhost');
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Rate limit ────────────────────────────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateCheck(ip)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please wait before generating more content.' }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    const body = await req.json();
    const { messages, stream } = body;
    const max_tokens = Math.min(body.max_tokens || 4000, 4000); // hard cap at 4000

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens,
        stream: stream ? true : false,
        messages,
      }),
    });

    // Stream passthrough: pipe Anthropic SSE directly to client
    if (stream && anthropicRes.ok) {
      return new Response(anthropicRes.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    const data = await anthropicRes.json();
    return new Response(JSON.stringify(data), {
      status: anthropicRes.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
