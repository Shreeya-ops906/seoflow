export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { action, url, username, password, title, content, status } = body;

    const credentials = btoa(`${username}:${password}`);
    const headers = {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    };

    let endpoint, method, wpBody;

    if (action === 'test') {
      // Test connection — fetch current user
      endpoint = `${url}/wp-json/wp/v2/users/me`;
      method = 'GET';
    } else if (action === 'publish') {
      // Publish a post
      endpoint = `${url}/wp-json/wp/v2/posts`;
      method = 'POST';
      wpBody = JSON.stringify({ title, content, status: status || 'draft' });
    } else {
      return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
    }

    const wpRes = await fetch(endpoint, {
      method,
      headers,
      ...(wpBody ? { body: wpBody } : {}),
    });

    const data = await wpRes.json();

    if (!wpRes.ok) {
      return new Response(JSON.stringify({ error: data.message || `HTTP ${wpRes.status}`, code: data.code }), {
        status: wpRes.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
