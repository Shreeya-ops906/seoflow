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

  const { platform, content, link, credentials } = body;

  if (!platform || !content) {
    return new Response(JSON.stringify({ error: 'Missing platform or content' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    if (platform === 'twitter') {
      return await postToTwitter(content, link, credentials);
    } else if (platform === 'linkedin') {
      return await postToLinkedIn(content, link, credentials);
    } else if (platform === 'webhook') {
      return await postToWebhook(content, link, credentials);
    } else {
      return new Response(JSON.stringify({ error: 'Unknown platform: ' + platform }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Post failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

async function postToTwitter(content, link, credentials) {
  const bearerToken = credentials?.bearerToken;
  if (!bearerToken) {
    return new Response(JSON.stringify({ error: 'Twitter Bearer Token required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // Truncate tweet to 280 chars, append link if space allows
  let tweet = content.slice(0, 240);
  if (link) tweet = tweet + '\n\n' + link;
  tweet = tweet.slice(0, 280);

  const res = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + bearerToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: tweet })
  });

  const data = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify({ error: data.detail || data.title || 'Twitter post failed', raw: data }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true, id: data.data?.id, platform: 'twitter' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function postToLinkedIn(content, link, credentials) {
  const accessToken = credentials?.accessToken;
  const authorUrn = credentials?.authorUrn; // e.g. "urn:li:person:abc123"
  if (!accessToken || !authorUrn) {
    return new Response(JSON.stringify({ error: 'LinkedIn Access Token and Author URN required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const postBody = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: content + (link ? '\n\n' + link : '') },
        shareMediaCategory: link ? 'ARTICLE' : 'NONE',
        ...(link ? {
          media: [{
            status: 'READY',
            originalUrl: link
          }]
        } : {})
      }
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
    }
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
    return new Response(JSON.stringify({ error: err.message || 'LinkedIn post failed', raw: err }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = await res.json().catch(() => ({}));
  return new Response(JSON.stringify({ success: true, id: data.id, platform: 'linkedin' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function postToWebhook(content, link, credentials) {
  const webhookUrl = credentials?.webhookUrl;
  if (!webhookUrl) {
    return new Response(JSON.stringify({ error: 'Webhook URL required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const payload = {
    text: content + (link ? '\n\n' + link : ''),
    content,
    link: link || null,
    timestamp: new Date().toISOString()
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Webhook returned ' + res.status }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true, platform: 'webhook' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
