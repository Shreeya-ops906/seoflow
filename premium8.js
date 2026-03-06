// premium8.js — Streaming generation + UI animations + interactive features
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'app.html');
// Normalize to LF for reliable matching, restore CRLF on write
let html = fs.readFileSync(htmlPath, 'utf8').replace(/\r\n/g, '\n');

let changes = 0;

function replace(oldStr, newStr, label) {
  if (!html.includes(oldStr)) {
    console.error(`❌ NOT FOUND: ${label}`);
    process.exit(1);
  }
  html = html.replace(oldStr, newStr);
  changes++;
  console.log(`✅ ${label}`);
}

// ─────────────────────────────────────────────────────────
// 1. Fix duplicate hamburger button
// ─────────────────────────────────────────────────────────
replace(
  `    <button class="hamburger" onclick="toggleSidebar()" aria-label="Menu"><span></span><span></span><span></span></button>
    <button class="hamburger" onclick="toggleSidebar()" aria-label="Menu"><span></span><span></span><span></span></button>`,
  `    <button class="hamburger" onclick="toggleSidebar()" aria-label="Menu"><span></span><span></span><span></span></button>`,
  'Fix duplicate hamburger button'
);

// ─────────────────────────────────────────────────────────
// 2. Add top-bar loading div inside topbar header
// ─────────────────────────────────────────────────────────
replace(
  `    <button class="hamburger" onclick="toggleSidebar()" aria-label="Menu"><span></span><span></span><span></span></button>`,
  `    <div id="cruise-top-bar"></div>
    <button class="hamburger" onclick="toggleSidebar()" aria-label="Menu"><span></span><span></span><span></span></button>`,
  'Add cruise-top-bar div'
);

// ─────────────────────────────────────────────────────────
// 3. Inject CSS animations block before </style> closest to topbar section
// We inject before the closing </style> of the last <style> block before <body>
// ─────────────────────────────────────────────────────────
const animCSS = `
/* ── Cruise SEO v8 Animations ─────────────────────────────── */
/* View enter transition */
.view.active { animation: pageIn .22s cubic-bezier(.4,0,.2,1) both; }
@keyframes pageIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

/* Button ripple */
.btn-primary { position:relative; overflow:hidden; }
.btn-ripple { position:absolute; border-radius:50%; background:rgba(255,255,255,.28); transform:scale(0); animation:ripple-grow .55s ease-out forwards; pointer-events:none; }
@keyframes ripple-grow { to { transform:scale(4); opacity:0; } }

/* Top loading bar */
#cruise-top-bar { position:fixed; top:0; left:220px; right:0; height:3px; background:linear-gradient(90deg,var(--amber),var(--sage),var(--amber)); background-size:200% 100%; z-index:9999; transform-origin:left; transform:scaleX(0); opacity:0; transition:transform .4s ease,opacity .2s ease; }
#cruise-top-bar.loading { opacity:1; transform:scaleX(.7); transition:transform 10s cubic-bezier(.05,0,.1,1),opacity .15s ease; animation:barShimmer 1.4s ease-in-out infinite; }
#cruise-top-bar.done { transform:scaleX(1); opacity:0; transition:transform .25s ease,opacity .3s ease .1s; }
@keyframes barShimmer { 0%,100%{background-position:200% 0} 50%{background-position:-200% 0} }
@media(max-width:768px){#cruise-top-bar{left:0}}

/* Blinking stream cursor */
#gen-stream-cursor { display:inline-block; width:2px; height:1.1em; background:var(--amber); vertical-align:text-bottom; margin-left:2px; animation:blink-cur .7s step-end infinite; border-radius:1px; }
@keyframes blink-cur { 0%,100%{opacity:1} 50%{opacity:0} }

/* Stat card pop-in */
@keyframes statPop { 0%{opacity:0;transform:translateY(14px) scale(.97)} 100%{opacity:1;transform:translateY(0) scale(1)} }
.stat-card { animation:statPop .35s cubic-bezier(.25,.46,.45,.94) both; }
.stat-card:nth-child(1){animation-delay:0ms} .stat-card:nth-child(2){animation-delay:60ms} .stat-card:nth-child(3){animation-delay:120ms} .stat-card:nth-child(4){animation-delay:180ms}

/* Shimmer skeleton */
.shimmer { background:linear-gradient(90deg,var(--bg2) 25%,#f0ede8 50%,var(--bg2) 75%); background-size:200% 100%; animation:shimmer 1.2s ease-in-out infinite; border-radius:6px; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Sidebar nav item hover slide */
.nav-item { transition:background var(--tr), transform .15s ease, color var(--tr); }
.nav-item:hover { transform:translateX(2px); }
.nav-item.active { transform:translateX(0); }

/* Stream output fade in */
#gen-editor { transition:opacity .2s ease; }
/* ─────────────────────────────────────────────────────────── */
`;

// Insert CSS before the last </style> that is before <body>
const bodyIdx = html.indexOf('<body');
const lastStyleClose = html.lastIndexOf('</style>', bodyIdx);
if (lastStyleClose === -1) {
  console.error('❌ Could not find </style> before <body>');
  process.exit(1);
}
html = html.slice(0, lastStyleClose) + animCSS + '</style>' + html.slice(lastStyleClose + 8);
changes++;
console.log('✅ Inject animation CSS');

// ─────────────────────────────────────────────────────────
// 4. Update runGenerate() prompt tail (JSON → TITLE:/META:/---/HTML)
// ─────────────────────────────────────────────────────────
replace(
  `Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "title": "The full post title",
  "meta_description": "A compelling meta description 150-160 characters",
  "content_html": "The full post content as HTML using <h2>, <h3>, <p>, <ul>, <li>, <ol>, <strong> tags only"
}\`;`,
  `Return in this EXACT format — no JSON, no markdown, no preamble. Start immediately with TITLE: on the first line:
TITLE: [the complete H1 title]
META: [meta description, 150-160 characters]
---
[full HTML content using h2, h3, p, ul, li, ol, strong, table, blockquote tags. No wrapping div. No \`\`\` fences.]\`;`,
  'Update runGenerate prompt to TITLE:/META:/---/HTML format'
);

// ─────────────────────────────────────────────────────────
// 5. Replace runGenerate() fake-timeout stages + fetch/parse block
//    with streaming implementation
// ─────────────────────────────────────────────────────────
replace(
  `  try {
    // Stage updates during generation
    setTimeout(() => setGenStage('Planning structure...', 'Mapping headings and key points', 25), 1500);
    setTimeout(() => setGenStage('Writing content...', 'Crafting SEO-optimised paragraphs', 50), 4000);
    setTimeout(() => setGenStage('Optimising for SEO...', 'Checking keyword density and readability', 80), 8000);

    const res = await fetch('/api/ai-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
    });

    const data = await res.json();
    const raw = data.content.map(c => c.text || '').join('');
    const clean = raw.replace(/\`\`\`json|\`\`\`/g, '').trim();
    const post = JSON.parse(clean);

    setGenStage('Done!', 'Your post is ready', 100);
    await new Promise(r => setTimeout(r, 600));

    // Calculate stats
    const wordCount = post.content_html.replace(/<[^>]+>/g, ' ').split(/\\s+/).filter(Boolean).length;
    const readTime = Math.ceil(wordCount / 200);
    const seoScore = calcSeoScore(post.content_html, post.title, keyword);

    generatedPostData = { ...post, keyword, wordCount, readTime, seoScore };

    // Render output
    document.getElementById('gen-post-title-display').textContent = post.title;
    document.getElementById('gen-word-count').textContent = wordCount.toLocaleString();
    document.getElementById('gen-seo-score').innerHTML = \`<span style="color:\${seoScore >= 80 ? 'var(--sage)' : seoScore >= 60 ? 'var(--amber)' : '#C0304F'}">\${seoScore}/100</span>\`;
    document.getElementById('gen-read-time').textContent = readTime + ' min';
    document.getElementById('gen-meta-desc').textContent = post.meta_description;
    document.getElementById('gen-editor').innerHTML = post.content_html;
    updateSerpPreview(post.title, post.meta_description);

    showGenStep('output');
    toast('Post generated! Review and publish.', true);`,
  `  try {
    // Show streaming cursor in title area
    const _genTitle = document.getElementById('gen-post-title-display');
    if (_genTitle) _genTitle.innerHTML = '<span style="color:var(--ink4);font-style:italic">Writing your post…</span><span id="gen-stream-cursor"></span>';
    cruiseBarStart();
    setGenStage('Writing your post…', 'Content is streaming in — you\'ll see it appear live', 10);

    let _sTitle = '', _sMeta = '', _sShown = false;
    const _sEditor = document.getElementById('gen-editor');

    const full = await callAIStream(prompt, (chunk, accumulated) => {
      // Extract title as soon as we have it
      if (!_sTitle) {
        const m = accumulated.match(/^TITLE:\\s*(.+)/m);
        if (m) {
          _sTitle = m[1].trim();
          if (_genTitle) _genTitle.innerHTML = _sTitle + '<span id="gen-stream-cursor"></span>';
        }
      }
      // Extract meta description
      if (!_sMeta) {
        const m = accumulated.match(/^META:\\s*(.+)/m);
        if (m) _sMeta = m[1].trim();
      }
      // Once we hit the --- separator, switch to output view and stream HTML
      const sepIdx = accumulated.indexOf('\\n---\\n');
      if (sepIdx !== -1) {
        if (!_sShown) {
          _sShown = true;
          showGenStep('output');
          if (document.getElementById('gen-word-count')) document.getElementById('gen-word-count').textContent = '…';
          if (document.getElementById('gen-seo-score')) document.getElementById('gen-seo-score').innerHTML = '<span style="color:var(--ink4)">…</span>';
          if (document.getElementById('gen-read-time')) document.getElementById('gen-read-time').textContent = '…';
          if (document.getElementById('gen-meta-desc')) document.getElementById('gen-meta-desc').textContent = _sMeta || '…';
          if (typeof updatePublishBtnLabel === 'function') updatePublishBtnLabel();
        }
        if (_sEditor) _sEditor.innerHTML = accumulated.slice(sepIdx + 5);
      }
    }, 4000);

    cruiseBarDone();

    // Parse final output
    const titleMatch = full.match(/^TITLE:\\s*(.+)/m);
    const metaMatch = full.match(/^META:\\s*(.+)/m);
    const sepIdx = full.indexOf('\\n---\\n');
    const postTitle = (titleMatch ? titleMatch[1] : _sTitle || keyword).trim();
    const postMeta = (metaMatch ? metaMatch[1] : _sMeta || '').trim();
    const postHtml = (sepIdx !== -1 ? full.slice(sepIdx + 5) : full).trim();

    // Calculate stats
    const wordCount = postHtml.replace(/<[^>]+>/g, ' ').split(/\\s+/).filter(Boolean).length;
    const readTime = Math.ceil(wordCount / 200);
    const seoScore = calcSeoScore(postHtml, postTitle, keyword);

    generatedPostData = { title: postTitle, meta_description: postMeta, content_html: postHtml, keyword, wordCount, readTime, seoScore };

    // Render final stats (remove streaming cursor)
    if (_genTitle) _genTitle.textContent = postTitle;
    document.getElementById('gen-post-title-display').textContent = postTitle;
    document.getElementById('gen-word-count').textContent = wordCount.toLocaleString();
    document.getElementById('gen-seo-score').innerHTML = '<span style="color:' + (seoScore >= 80 ? 'var(--sage)' : seoScore >= 60 ? 'var(--amber)' : '#C0304F') + '">' + seoScore + '/100</span>';
    document.getElementById('gen-read-time').textContent = readTime + ' min';
    document.getElementById('gen-meta-desc').textContent = postMeta;
    if (_sEditor) _sEditor.innerHTML = postHtml;
    updateSerpPreview(postTitle, postMeta);
    if (!_sShown) showGenStep('output');
    toast('Post generated! Review and publish.', true);`,
  'Replace runGenerate fetch block with callAIStream streaming'
);

// ─────────────────────────────────────────────────────────
// 6. Add callAIStream() after callAI()
// ─────────────────────────────────────────────────────────
replace(
  `async function callAI(prompt, maxTokens) {
  const res = await fetch('/api/ai-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], max_tokens: maxTokens || 2000 })
  });
  const data = await res.json();
  const raw = (data.content || []).map(x => x.text || '').join('');
  return raw.replace(/\`\`\`json\\n?|\`\`\`\\n?/g, '').trim();
}`,
  `async function callAI(prompt, maxTokens) {
  const res = await fetch('/api/ai-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], max_tokens: maxTokens || 2000 })
  });
  const data = await res.json();
  const raw = (data.content || []).map(x => x.text || '').join('');
  return raw.replace(/\`\`\`json\\n?|\`\`\`\\n?/g, '').trim();
}

async function callAIStream(prompt, onChunk, maxTokens) {
  const res = await fetch('/api/ai-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens || 4000,
      stream: true
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Generation failed' }));
    throw new Error(err.error || 'Generation failed');
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '', full = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\\n');
      buf = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (raw === '[DONE]') return full;
        try {
          const j = JSON.parse(raw);
          if (j.type === 'content_block_delta' && j.delta && j.delta.type === 'text_delta') {
            full += j.delta.text;
            onChunk(j.delta.text, full);
          }
          if (j.type === 'error') throw new Error((j.error && j.error.message) || 'Stream error');
        } catch(e) {
          if (e.message && !e.message.includes('JSON')) throw e;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
  return full;
}`,
  'Add callAIStream() function'
);

// ─────────────────────────────────────────────────────────
// 7. Add top-bar helpers, ripple, counter, nav wrapper
//    Append before the closing </script> of the last script block
// ─────────────────────────────────────────────────────────
const v8JS = `

// ── Cruise SEO v8 — Animations & Interactive ─────────────────────

// Top loading bar
function cruiseBarStart() {
  const b = document.getElementById('cruise-top-bar');
  if (!b) return;
  b.className = '';
  void b.offsetWidth;
  b.className = 'loading';
}
function cruiseBarDone() {
  const b = document.getElementById('cruise-top-bar');
  if (!b) return;
  b.className = 'done';
  setTimeout(() => { b.className = ''; }, 400);
}

// Counter animation (ease-out cubic)
function animateCounterEl(el) {
  if (!el || el._counting) return;
  const text = el.textContent.trim();
  const raw = text.replace(/[^0-9.]/g, '');
  const target = parseFloat(raw);
  if (isNaN(target) || target === 0) return;
  el._counting = true;
  const suffix = text.replace(/[0-9.,]/g, '').trim();
  const duration = 700;
  const startTime = Date.now();
  function tick() {
    const t = Math.min((Date.now() - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = Math.round(target * ease);
    el.textContent = val.toLocaleString() + (suffix ? ' ' + suffix : '');
    if (t < 1) requestAnimationFrame(tick);
    else { el._counting = false; el.textContent = text; }
  }
  requestAnimationFrame(tick);
}

// Button ripple effect
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.btn-primary');
  if (!btn) return;
  const r = document.createElement('span');
  r.className = 'btn-ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - rect.left - size / 2) + 'px;top:' + (e.clientY - rect.top - size / 2) + 'px;';
  btn.appendChild(r);
  setTimeout(() => r.remove(), 600);
}, true);

// Nav animation wrapper (wraps existing nav chain)
(function() {
  const _v8Nav = nav;
  nav = function(el, id) {
    _v8Nav(el, id);
    if (!id) return;
    const view = document.getElementById('view-' + id);
    if (view) {
      view.style.animation = 'none';
      void view.offsetWidth;
      view.style.animation = '';
    }
    if (id === 'dashboard') {
      setTimeout(function() {
        document.querySelectorAll('.stat-value').forEach(animateCounterEl);
      }, 150);
    }
  };
})();

// ─────────────────────────────────────────────────────────────────
`;

// Find the last </script> in the file and insert before it
const lastScriptClose = html.lastIndexOf('</script>');
if (lastScriptClose === -1) {
  console.error('❌ Could not find closing </script>');
  process.exit(1);
}
html = html.slice(0, lastScriptClose) + v8JS + '</script>' + html.slice(lastScriptClose + 9);
changes++;
console.log('✅ Inject v8 JS (top-bar, ripple, counter, nav wrapper)');

// Write output (restore CRLF for Windows compatibility)
fs.writeFileSync(htmlPath, html.replace(/\n/g, '\r\n'), 'utf8');
console.log(`\n✅ Done — ${changes} changes applied to app.html`);
