export const config = { runtime: 'edge' };

export default async function handler(req) {
  const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  // Allow manual trigger from dashboard (POST) or Vercel cron (GET)
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  try {
    const body = req.method === 'POST' ? await req.json() : {};
    const { wpUrl, wpUser, wpPass, brand, frequency, keywords, manualTrigger, bookingUrl, existingPosts } = body;

    // If called from cron (no body), we can't do anything without credentials
    // The dashboard passes credentials on manual trigger
    // For cron: we use Vercel KV or env-stored settings (future enhancement)
    // For now: manual trigger only, cron signals the dashboard to run
    if (!wpUrl && !manualTrigger) {
      return new Response(JSON.stringify({ 
        status: 'cron_ping', 
        message: 'Cron is alive. Dashboard should trigger autopilot run.',
        timestamp: new Date().toISOString()
      }), { status: 200, headers: CORS });
    }

    // Step 1: Find trending topics using web search via Claude
    const trendPrompt = `You are an SEO content strategist. I need you to identify the BEST trending topic to write a blog post about right now.

Brand/Business context: ${brand || 'general business'}
Industry keywords: ${(keywords || []).join(', ') || 'general'}

Your task:
1. Think about what topics are currently trending in this industry (consider seasonal trends, common questions, recent developments)
2. Pick the single BEST topic that would:
   - Attract organic search traffic
   - Be relevant to the brand's audience  
   - Not be too competitive for a smaller site
   - Have clear search intent

Return ONLY a JSON object (no markdown, no explanation):
{
  "topic": "The exact topic/keyword to write about",
  "reason": "One sentence why this topic is trending and valuable now",
  "search_intent": "informational|commercial|navigational"
}`;

    const trendRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: trendPrompt }]
      })
    });

    const trendData = await trendRes.json();
    const trendText = trendData.content?.filter(c => c.type === 'text').map(c => c.text).join('') || '';
    
    let trendResult;
    try {
      const clean = trendText.replace(/```json|```/g, '').trim();
      trendResult = JSON.parse(clean);
    } catch(e) {
      // Fallback topic based on keywords
      trendResult = { 
        topic: keywords?.[0] || brand || 'industry tips and trends',
        reason: 'Based on brand keywords',
        search_intent: 'informational'
      };
    }

    // Step 2: Generate full blog post
    const postPrompt = `You are an expert SEO content writer. Write a comprehensive, SEO-optimised blog post.

Topic: "${trendResult.topic}"
Brand context: ${brand || ''}
Tone: authoritative and helpful
Target length: 1,000–1,200 words
Write in UK English.

Requirements:
- Compelling keyword-rich H1 title
- Proper H2 and H3 subheadings
- Include the keyword naturally 4-6 times
- Engaging intro that hooks in first 2 sentences
- Short paragraphs (2-4 sentences max)
- At least one bulleted or numbered list
- Strong call-to-action conclusion

Return ONLY a JSON object (no markdown, no code blocks):
{
  "title": "The full post title",
  "meta_description": "A compelling meta description 150-160 characters",
  "content_html": "Full post as HTML using only <h2>, <h3>, <p>, <ul>, <li>, <ol>, <strong> tags"
}`;

    const postRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        messages: [{ role: 'user', content: postPrompt }]
      })
    });

    const postData = await postRes.json();
    const postRaw = postData.content?.map(c => c.text || '').join('') || '';
    const postClean = postRaw.replace(/```json|```/g, '').trim();
    const post = JSON.parse(postClean);

    // Step 3: Publish to WordPress
    const wpCreds = btoa(`${wpUser}:${wpPass}`);
    const wpRes = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${wpCreds}`
      },
      body: JSON.stringify({
        title: post.title,
        content: post.content_html,
        status: 'publish',
        excerpt: post.meta_description,
        imageQuery: trendResult.topic,
        internalLinks: { posts: existingPosts || [], bookingUrl: bookingUrl || '' }
      })
    });

    const wpPost = await wpRes.json();
    if (!wpRes.ok) throw new Error(wpPost.message || `WP error ${wpRes.status}`);

    return new Response(JSON.stringify({
      status: 'success',
      topic: trendResult.topic,
      reason: trendResult.reason,
      title: post.title,
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
