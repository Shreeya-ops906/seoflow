export const config = { runtime: 'edge' };

export default async function handler(req) {
  const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  try {
    const body = await req.json();
    const { action, url, username, password, title, content, status, excerpt, imageQuery } = body;
    const creds = btoa(`${username}:${password}`);
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Basic ${creds}` };

    if (action === 'test') {
      const r = await fetch(`${url}/wp-json/wp/v2/users/me`, { headers });
      const d = await r.json();
      return new Response(JSON.stringify({ ok: r.ok, name: d.name, error: d.message }), { headers: CORS });
    }

    if (action === 'publish') {
      // Step 1: Optionally fetch and upload a featured image from Unsplash
      let featuredMediaId = null;
      if (imageQuery) {
        try {
          // Use Unsplash source (no API key needed)
          const imgQuery = encodeURIComponent(imageQuery);
          const imgUrl = `https://source.unsplash.com/1200x630/?${imgQuery}`;
          const imgRes = await fetch(imgUrl);
          if (imgRes.ok) {
            const imgBuffer = await imgRes.arrayBuffer();
            const imgBlob = new Uint8Array(imgBuffer);
            const slug = imageQuery.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
            const mediaRes = await fetch(`${url}/wp-json/wp/v2/media`, {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${creds}`,
                'Content-Disposition': `attachment; filename="${slug}.jpg"`,
                'Content-Type': 'image/jpeg'
              },
              body: imgBlob
            });
            if (mediaRes.ok) {
              const mediaData = await mediaRes.json();
              featuredMediaId = mediaData.id;
            }
          }
        } catch(imgErr) {
          // Image upload failed silently — post still publishes
        }
      }

      // Step 2: Publish the post
      // Inject internal links into content
      let finalContent = content;
      if (body.internalLinks) {
        const { posts, bookingUrl } = body.internalLinks;
        const usedUrls = new Set();
        let linksAdded = 0;

        // Link to booking/contact page
        if (bookingUrl) {
          const phrases = ['book a','book your','get in touch','contact us','speak to a tutor','free consultation','get started','try a lesson','enquire now'];
          for (const phrase of phrases) {
            if (finalContent.toLowerCase().includes(phrase) && !finalContent.includes('href="' + bookingUrl)) {
              const regex = new RegExp('(' + phrase + '[^<.!?]{0,40})', 'gi');
              finalContent = finalContent.replace(regex, '<a href="' + bookingUrl + '" rel="noopener">$1</a>');
              break;
            }
          }
        }

        // Link to related posts (max 3)
        for (const post of (posts || [])) {
          if (linksAdded >= 3 || !post.url || usedUrls.has(post.url)) continue;
          const words = (post.title || '').toLowerCase().split(' ').filter(w => w.length > 5);
          for (const word of words) {
            if (finalContent.toLowerCase().includes(word) && !finalContent.includes('href="' + post.url)) {
              const regex = new RegExp('(?<!["\/])\b(' + word + 's?)\b(?![^<]*>)', 'gi');
              finalContent = finalContent.replace(regex, '<a href="' + post.url + '" rel="noopener">$1</a>');
              usedUrls.add(post.url);
              linksAdded++;
              break;
            }
          }
        }
      }

      // Inject Article schema markup at end of content
      const brandName = body.brandName || '';
      const schemaMarkup = '<script type="application/ld+json">' + JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString(),
        "author": { "@type": "Organization", "name": brandName || "Cruise SEO" },
        "publisher": { "@type": "Organization", "name": brandName || "Cruise SEO" },
        "description": excerpt || title
      }) + '</script>';
      finalContent = finalContent + '\n' + schemaMarkup;

      const postBody = {
        title,
        content: finalContent,
        status: status || 'publish',
        excerpt: excerpt || ''
      };
      if (featuredMediaId) postBody.featured_media = featuredMediaId;

      const r = await fetch(`${url}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(postBody)
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || `WP error ${r.status}`);

      return new Response(JSON.stringify({
        ok: true,
        id: d.id,
        link: d.link,
        title: d.title?.rendered,
        featuredImage: featuredMediaId ? true : false
      }), { headers: CORS });
    }

    if (action === 'posts') {
      const r = await fetch(`${url}/wp-json/wp/v2/posts?per_page=20&status=publish`, { headers });
      const d = await r.json();
      return new Response(JSON.stringify({ ok: r.ok, posts: d }), { headers: CORS });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers: CORS });

  } catch(err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS });
  }
}
