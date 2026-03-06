export const config = { runtime: 'edge' };

export default async function handler(req) {
  const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ status: 'error', error: 'ANTHROPIC_API_KEY not configured in Vercel environment variables.' }), { status: 503, headers: CORS });
  }

  try {
    const body = req.method === 'POST' ? await req.json() : {};
    const { wpUrl, wpUser, wpPass, brand, keywords, manualTrigger, bookingUrl, existingPosts } = body;

    if (!wpUrl && !manualTrigger) {
      return new Response(JSON.stringify({
        status: 'cron_ping',
        message: 'Cron is alive. Dashboard should trigger autopilot run.',
        timestamp: new Date().toISOString()
      }), { status: 200, headers: CORS });
    }

    const callAnthropic = async (prompt, maxTokens) => {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const d = await r.json();
      if (!r.ok) {
        const msg = d.error?.message || (typeof d.error === 'string' ? d.error : JSON.stringify(d.error)) || `Anthropic error ${r.status}`;
        throw new Error(msg);
      }
      return d.content?.map(c => c.text || '').join('') || '';
    };

    // ── Step 1: Pick the best topic ───────────────────────────────
    const keywordList = (keywords || []).filter(Boolean).join(', ') || brand || 'general business';
    let topic = keywords?.[0] || 'industry tips';

    try {
      const trendText = await callAnthropic(
        `You are an SEO content strategist. Pick the single best topic to write a blog post about for a business in this area: ${keywordList}

Consider: what questions do their target customers search for? What would rank well for a small site?

Respond with ONLY the topic/keyword phrase — nothing else. No explanation. Just the topic itself.
Example response: "How to prepare for a maths GCSE exam"`, 150
      );
      if (trendText.trim()) topic = trendText.trim().replace(/^["']|["']$/g, '');
    } catch (topicErr) {
      // silently fall back to first keyword
    }

    // ── Step 2: Generate full blog post ──────────────────────────
    // Use plain-text delimiters instead of JSON to avoid HTML-inside-JSON escaping issues
    const postText = await callAnthropic(
      `You are an expert SEO blog writer. Write a comprehensive, SEO-optimised blog post in UK English.

Topic: "${topic}"
Brand context: ${brand || 'a professional service business'}
${bookingUrl ? `Booking/contact URL: ${bookingUrl}` : ''}
Target length: 900–1,100 words
Tone: authoritative and helpful

Requirements:
- Compelling keyword-rich title
- Meta description 150-160 characters
- Proper H2 and H3 subheadings
- Include the keyword naturally 4-6 times
- Short paragraphs (2-4 sentences max)
- At least one bulleted or numbered list
- Strong call-to-action conclusion${bookingUrl ? ' linking to the booking URL' : ''}

Format your response EXACTLY like this (do not add any extra text before TITLE:):

TITLE: [the post title]
META: [the meta description]
CONTENT:
[full post as HTML using only <h2>, <h3>, <p>, <ul>, <li>, <ol>, <strong> tags]`, 6000
    );

    // Parse the delimiter-based response
    const titleMatch = postText.match(/TITLE:\s*(.+)/);
    const metaMatch  = postText.match(/META:\s*(.+)/);
    const contentIdx = postText.indexOf('\nCONTENT:\n');

    if (!titleMatch || contentIdx === -1) {
      throw new Error('AI response format invalid — could not find TITLE or CONTENT markers. Response: ' + postText.slice(0, 200));
    }

    const title   = titleMatch[1].trim();
    const excerpt = metaMatch ? metaMatch[1].trim() : '';
    const contentHtml = postText.slice(contentIdx + '\nCONTENT:\n'.length).trim();

    if (!contentHtml) throw new Error('AI returned empty content.');

    // ── Step 3: Publish to WordPress ─────────────────────────────
    const wpCreds = btoa(`${wpUser}:${wpPass}`);

    // Optionally inject internal links
    let finalContent = contentHtml;
    if (bookingUrl) {
      const phrases = ['book a','book your','get in touch','contact us','speak to','free consultation','get started','enquire'];
      for (const phrase of phrases) {
        if (finalContent.toLowerCase().includes(phrase) && !finalContent.includes('href="' + bookingUrl)) {
          const regex = new RegExp('(' + phrase + '[^<.!?]{0,40})', 'gi');
          finalContent = finalContent.replace(regex, '<a href="' + bookingUrl + '" rel="noopener">$1</a>');
          break;
        }
      }
    }

    let wpRes, wpResText;
    try {
      wpRes = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${wpCreds}` },
        body: JSON.stringify({ title, content: finalContent, status: 'publish', excerpt })
      });
      wpResText = await wpRes.text();
    } catch(wpFetchErr) {
      throw new Error(`Cannot reach WordPress at ${wpUrl}: ${wpFetchErr.message}`);
    }

    let wpPost = {};
    try { wpPost = JSON.parse(wpResText); } catch(e) {
      throw new Error(`WordPress returned non-JSON (HTTP ${wpRes.status}). Response: ${wpResText.slice(0, 200)}`);
    }
    if (!wpRes.ok) {
      const errMsg = wpPost.message || wpPost.error || `WordPress error`;
      throw new Error(`${errMsg} (HTTP ${wpRes.status})`);
    }

    return new Response(JSON.stringify({
      status: 'success',
      topic,
      title,
      postUrl: wpPost.link,
      postId: wpPost.id,
      timestamp: new Date().toISOString()
    }), { status: 200, headers: CORS });

  } catch(err) {
    return new Response(JSON.stringify({
      status: 'error',
      error: err.message,
      timestamp: new Date().toISOString()
    }), { status: 500, headers: CORS });
  }
}
