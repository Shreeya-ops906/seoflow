export const config = { runtime: 'edge' };

export default async function handler(req) {
  const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ status: 'error', error: 'ANTHROPIC_API_KEY not configured in Vercel environment variables.' }), { status: 503, headers: CORS });
  }

  // ── Shared: call Anthropic ──────────────────────────────────────
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

  // ── Shared: fetch a relevant image using the core keyword ───────
  // Uses keywords[0] (e.g. "plumber" / "solicitor") not the topic sentence,
  // so Pexels returns on-brand professional photos.
  const fetchImage = async (imageQuery) => {
    const safeQuery = (imageQuery || 'business professional').split(/\s+/).slice(0, 4).join(' ');
    if (!process.env.PEXELS_API_KEY) {
      return { url: `https://picsum.photos/seed/${encodeURIComponent(safeQuery)}/1200/675`, credit: null };
    }
    try {
      const r = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(safeQuery)}&per_page=1&orientation=landscape`,
        { headers: { 'Authorization': process.env.PEXELS_API_KEY } }
      );
      if (!r.ok) return { url: `https://picsum.photos/seed/${encodeURIComponent(safeQuery)}/1200/675`, credit: null };
      const d = await r.json();
      const p = d.photos?.[0];
      if (!p?.src) return { url: `https://picsum.photos/seed/${encodeURIComponent(safeQuery)}/1200/675`, credit: null };
      return { url: p.src.large || p.src.large2x || p.src.medium, credit: p.photographer || null };
    } catch (_) {
      return { url: `https://picsum.photos/seed/${encodeURIComponent(safeQuery)}/1200/675`, credit: null };
    }
  };

  // ── Shared: post to LinkedIn with an AI-generated caption ───────
  const postToLinkedInAutopilot = async (title, postUrl, accessToken, authorId) => {
    const caption = await callAnthropic(
      `Write a short LinkedIn post to share this blog article.
Title: "${title}"
- 2-3 sentences, engaging, professional UK English tone
- Highlight why it's useful to read
- Do NOT include the URL (it will be appended automatically)
- No hashtags
Respond with ONLY the post text, nothing else.`, 200
    );

    const postBody = {
      author: authorId,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: caption.trim() + '\n\n' + postUrl },
          shareMediaCategory: 'ARTICLE',
          media: [{ status: 'READY', originalUrl: postUrl }]
        }
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
    };

    const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postBody)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `LinkedIn post failed (HTTP ${res.status})`);
    }
    const data = await res.json().catch(() => ({}));
    return { id: data.id };
  };

  // ── Shared: generate blog post and publish to WordPress ─────────
  // lastTopics: array of recent post titles to avoid repeating
  const generateAndPublish = async (wpUrl, wpPass, brand, keywords, tone, bookingUrl, lastTopics = []) => {
    const keywordList = (keywords || []).filter(Boolean).join(', ') || brand || 'general business';
    let topic = keywords?.[0] || 'industry tips';

    // Step 1: Pick a topic — explicitly avoid recently published ones
    const avoidSection = lastTopics.length > 0
      ? `\n\nIMPORTANT — these topics have been covered recently. Pick something genuinely different:\n${lastTopics.slice(0, 15).map(t => '- ' + t).join('\n')}`
      : '';

    try {
      const trendText = await callAnthropic(
        `You are an SEO content strategist. Pick the single best topic to write a blog post about for a business in this area: ${keywordList}

Consider: what questions do their target customers search for? What would rank well for a small site?
Choose a specific angle — avoid generic titles.

Respond with ONLY the topic/keyword phrase — nothing else. No explanation.
Example response: "How to prepare for a maths GCSE exam"${avoidSection}`, 150
      );
      if (trendText.trim()) topic = trendText.trim().replace(/^[\"']|[\"']$/g, '');
    } catch (_) {
      // fall back to first keyword
    }

    // Step 1b: Fetch image URL + generate blog post in parallel (saves ~2s)
    const imageQuery = (keywords || []).filter(Boolean)[0] || topic.split(/\s+/).slice(0, 3).join(' ');
    const [img, postText] = await Promise.all([
      fetchImage(imageQuery),
      callAnthropic(
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
      )
    ]);

    const titleMatch = postText.match(/TITLE:\s*(.+)/);
    const metaMatch  = postText.match(/META:\s*(.+)/);
    const contentIdx = postText.indexOf('\nCONTENT:\n');

    if (!titleMatch || contentIdx === -1) {
      throw new Error('AI response format invalid — could not find TITLE or CONTENT markers. Response: ' + postText.slice(0, 200));
    }

    const title      = titleMatch[1].trim();
    const excerpt    = metaMatch ? metaMatch[1].trim() : '';
    let contentHtml  = postText.slice(contentIdx + '\nCONTENT:\n'.length).trim();

    if (!contentHtml) throw new Error('AI returned empty content.');

    // Step 2b: Download image bytes in Edge Function (reliable internet) and encode as base64.
    // PHP receives raw bytes and saves locally — no server-side URL download required,
    // which bypasses firewall/allow_url_fopen issues that break media_sideload_image.
    let imgB64 = '', imgMime = 'image/jpeg';
    if (img?.url) {
      try {
        const ir = await fetch(img.url);
        if (ir.ok) {
          const buf = await ir.arrayBuffer();
          if (buf.byteLength <= 700000) { // skip if >700KB to keep payload manageable
            imgMime = ir.headers.get('content-type')?.split(';')[0] || 'image/jpeg';
            const bytes = new Uint8Array(buf);
            let bin = '';
            for (let i = 0; i < bytes.byteLength; i += 8192)
              bin += String.fromCharCode(...bytes.subarray(i, Math.min(i + 8192, bytes.byteLength)));
            imgB64 = btoa(bin);
          }
        }
      } catch (_) { /* silent — post still publishes without featured image */ }
    }

    // Step 3: Optionally inject internal links
    if (bookingUrl) {
      const phrases = ['book a','book your','get in touch','contact us','speak to','free consultation','get started','enquire'];
      for (const phrase of phrases) {
        if (contentHtml.toLowerCase().includes(phrase) && !contentHtml.includes('href="' + bookingUrl)) {
          const regex = new RegExp('(' + phrase + '[^<.!?]{0,40})', 'gi');
          contentHtml = contentHtml.replace(regex, '<a href="' + bookingUrl + '" rel="noopener">$1</a>');
          break;
        }
      }
    }

    // Step 4: Publish to WordPress via CSK endpoint
    // image_url is passed separately so the PHP snippet can set it as the WordPress
    // featured image via media_sideload_image (requires updated CSK snippet v2).
    let wpRes, wpResText;
    try {
      wpRes = await fetch(`${wpUrl}/wp-json/csk/v1/publish?_k=${encodeURIComponent(wpPass)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: contentHtml,
          status: 'publish',
          excerpt,
          image_b64:  imgB64,           // raw image bytes (base64) — PHP saves without URL download
          image_type: imgMime,          // e.g. "image/jpeg"
          image_url:  img?.url || ''    // fallback reference
        })
      });
      wpResText = await wpRes.text();
    } catch (wpFetchErr) {
      throw new Error(`Cannot reach WordPress at ${wpUrl}: ${wpFetchErr.message}`);
    }

    let wpPost = {};
    try { wpPost = JSON.parse(wpResText); } catch (_) {
      throw new Error(`WordPress returned non-JSON (HTTP ${wpRes.status}). Response: ${wpResText.slice(0, 200)}`);
    }
    if (!wpRes.ok) {
      const errMsg = wpPost.message || wpPost.error || 'WordPress error';
      throw new Error(`${errMsg} (HTTP ${wpRes.status})`);
    }

    return { topic, title, postUrl: wpPost.link, postId: wpPost.id, imageUrl: img?.url || null, imgDebug: wpPost.img_debug || null };
  };

  // ── Cron handler (GET — called by Vercel cron at 0 8 * * *) ────
  if (req.method === 'GET') {
    if (!process.env.CLERK_SECRET_KEY) {
      return new Response(JSON.stringify({ error: 'CLERK_SECRET_KEY not configured' }), { status: 503, headers: CORS });
    }

    const now = new Date();

    // Fetch all Clerk users (paginated)
    let allUsers = [];
    let offset = 0;
    while (true) {
      const usersRes = await fetch(`https://api.clerk.com/v1/users?limit=100&offset=${offset}`, {
        headers: { 'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}` }
      });
      if (!usersRes.ok) break;
      const page = await usersRes.json();
      if (!Array.isArray(page) || page.length === 0) break;
      allUsers = allUsers.concat(page);
      if (page.length < 100) break;
      offset += 100;
    }

    const results = [];

    for (const user of allUsers) {
      const ap = user.private_metadata?.autopilot;
      if (!ap?.enabled || !ap?.wpUrl || !ap?.wpPass) continue;
      if (!shouldPostToday(ap.frequency, ap.lastRun, now)) continue;

      const keywords = ap.keywords?.length
        ? ap.keywords
        : (ap.seeds ? ap.seeds.split(',').map(s => s.trim()).filter(Boolean) : []);

      let result, linkedinResult = null;

      try {
        result = await generateAndPublish(
          ap.wpUrl,
          ap.wpPass,
          ap.brand || '',
          keywords,
          ap.tone || 'authoritative',
          ap.bookingUrl || '',
          ap.lastTopics || []
        );

        // Attempt LinkedIn if connected
        const li = ap.linkedinToken;
        if (li?.accessToken && li?.authorId && result.postUrl) {
          try {
            linkedinResult = await postToLinkedInAutopilot(result.title, result.postUrl, li.accessToken, li.authorId);
          } catch (liErr) {
            linkedinResult = { error: liErr.message };
          }
        }

        // Update Clerk: lastRun + prepend to lastTopics (keep 20 max)
        const updatedLastTopics = [result.title, ...(ap.lastTopics || [])].slice(0, 20);
        await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            private_metadata: {
              autopilot: { ...ap, lastRun: now.toISOString(), lastTopics: updatedLastTopics }
            }
          })
        });

        results.push({
          userId:   user.id,
          status:   'success',
          topic:    result.topic,
          title:    result.title,
          postUrl:  result.postUrl,
          imageUrl: result.imageUrl,
          linkedin: linkedinResult
        });
      } catch (err) {
        results.push({ userId: user.id, status: 'error', error: err.message });
      }
    }

    return new Response(JSON.stringify({
      status:    'done',
      checked:   allUsers.length,
      published: results.filter(r => r.status === 'success').length,
      results,
      timestamp: now.toISOString()
    }), { status: 200, headers: CORS });
  }

  // ── Manual trigger (POST — from browser dashboard) ──────────────
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const body = await req.json();
    const { wpUrl, wpPass, brand, keywords, manualTrigger, bookingUrl, tone,
            linkedinAccessToken, linkedinAuthorId, recentTopics } = body;

    if (!wpUrl && !manualTrigger) {
      return new Response(JSON.stringify({
        status: 'cron_ping',
        message: 'No wpUrl provided. Cron now reads settings from Clerk — ensure autopilot is saved via /api/save-autopilot.',
        timestamp: new Date().toISOString()
      }), { status: 200, headers: CORS });
    }

    const result = await generateAndPublish(
      wpUrl,
      wpPass,
      brand,
      keywords || [],
      tone || 'authoritative',
      bookingUrl || '',
      recentTopics || []
    );

    // Attempt LinkedIn if credentials were passed
    let linkedinResult = null;
    if (linkedinAccessToken && linkedinAuthorId && result.postUrl) {
      try {
        linkedinResult = await postToLinkedInAutopilot(result.title, result.postUrl, linkedinAccessToken, linkedinAuthorId);
      } catch (liErr) {
        linkedinResult = { error: liErr.message };
      }
    }

    return new Response(JSON.stringify({
      status:    'success',
      ...result,
      linkedin:  linkedinResult,
      timestamp: new Date().toISOString()
    }), { status: 200, headers: CORS });

  } catch (err) {
    return new Response(JSON.stringify({
      status:    'error',
      error:     err.message,
      timestamp: new Date().toISOString()
    }), { status: 500, headers: CORS });
  }
}

// ── Frequency check ──────────────────────────────────────────────
function shouldPostToday(frequency, lastRun, now) {
  const dayOfWeek   = now.getUTCDay();
  const dateOfMonth = now.getUTCDate();

  if (lastRun) {
    const hoursSince = (now - new Date(lastRun)) / 3600000;
    if (hoursSince < 20) return false;
  }

  if (frequency === 'daily')    return true;
  if (frequency === '3x_week')  return [1, 3, 5].includes(dayOfWeek);
  if (frequency === 'weekly')   return dayOfWeek === 1;
  if (frequency === 'monthly')  return dateOfMonth === 1;

  if (frequency === 'biweekly') {
    if (dayOfWeek !== 1) return false;
    if (!lastRun) return true;
    return (now - new Date(lastRun)) / 86400000 >= 14;
  }

  if (frequency?.startsWith('custom_')) {
    const parts  = frequency.split('_');
    const n      = parseInt(parts[1]) || 1;
    const period = parts[2] || 'week';
    if (!lastRun) return true;
    const daysSince = (now - new Date(lastRun)) / 86400000;
    if (period === 'day')   return daysSince >= n;
    if (period === 'week')  return daysSince >= n * 7;
    if (period === 'month') return daysSince >= n * 30;
  }

  return false;
}
