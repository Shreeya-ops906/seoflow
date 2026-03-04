export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { action, url, username, password, title, content, status } = body;

    // Some hosts strip Authorization header — use both Basic auth methods
    const credentials = btoa(`${username}:${password}`);
    const headers = {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      // Some hosts need this to pass auth through
      'X-WP-Nonce': '',
    };

    let endpoint, method, wpBody;

    if (action === 'test') {
      // Try /users/me first, fall back to creating a test post as auth check
      endpoint = `${url}/wp-json/wp/v2/users/me?context=edit`;
      method = 'GET';
    } else if (action === 'publish') {
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

    const responseText = await wpRes.text();
    
    // Check if response is HTML (auth issue or redirect)
    if (responseText.trim().startsWith('<')) {
      // Try alternative: test by fetching posts with auth (public endpoint, auth just confirms creds work)
      if (action === 'test') {
        const postsRes = await fetch(`${url}/wp-json/wp/v2/posts?per_page=1&status=draft`, {
          method: 'GET',
          headers,
        });
        const postsText = await postsRes.text();
        
        if (postsText.trim().startsWith('<')) {
          return new Response(JSON.stringify({ 
            error: 'WordPress is returning HTML instead of JSON. Your host may be blocking authentication headers. Please add "SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1" to your .htaccess file.' 
          }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }
        
        // If posts worked, auth is fine — return fake success
        try {
          JSON.parse(postsText);
          return new Response(JSON.stringify({ name: username, slug: username }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        } catch(e) {
          return new Response(JSON.stringify({ error: 'Could not verify credentials' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }
      }
      
      return new Response(JSON.stringify({ error: 'WordPress returned HTML — authentication headers may be blocked by your host' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch(e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON from WordPress: ' + responseText.slice(0, 100) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

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
