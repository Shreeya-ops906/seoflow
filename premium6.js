const fs = require('fs');
let c = fs.readFileSync('app.html', 'utf8');
c = c.split('\r\n').join('\n');
let count = 0;

function rep(search, replace) {
  const idx = c.indexOf(search);
  if (idx === -1) { console.log('MISS: ' + search.slice(0, 80)); return; }
  const parts = c.split(search);
  if (parts.length > 2) console.log('MULTI (' + (parts.length-1) + 'x): ' + search.slice(0, 60));
  c = parts.join(replace);
  count++;
  console.log('OK [' + count + ']: ' + search.slice(0, 70));
}

// ── 1. Insert email outreach modal HTML before view-dashboard ──────────────
rep(
  '    </div>\n\n    <div class="view active" id="view-dashboard">',
  '    </div>\n\n' +
  '    <div class="ob-overlay" id="email-outreach-modal" onclick="if(event.target===this)closeEmailModal()">\n' +
  '      <div class="ob-box" style="max-width:560px">\n' +
  '        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">\n' +
  '          <h2 style="font-family:var(--font-serif);font-size:18px;font-weight:800;color:var(--ink);margin:0">Outreach Email</h2>\n' +
  '          <button class="btn btn-ghost" onclick="closeEmailModal()" style="font-size:22px;line-height:1;padding:0 8px">&#x2715;</button>\n' +
  '        </div>\n' +
  '        <div id="email-modal-site" style="font-size:12px;font-weight:600;color:var(--ink4);margin-bottom:12px"></div>\n' +
  '        <textarea id="email-modal-body" style="width:100%;min-height:220px;font-size:13px;line-height:1.65;padding:14px;resize:vertical;font-family:inherit;border:1.5px solid var(--border);border-radius:12px;background:var(--cream);box-sizing:border-box" readonly></textarea>\n' +
  '        <div style="display:flex;gap:10px;margin-top:16px">\n' +
  '          <button class="btn btn-ghost" onclick="copyEmailModal()" style="flex:1">Copy email</button>\n' +
  '          <a href="#" onclick="openEmailClient();return false" class="btn btn-primary" style="flex:1;justify-content:center;text-decoration:none">Open in mail client &#x2192;</a>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '    </div>\n\n' +
  '    <div class="view active" id="view-dashboard">'
);

// ── 2. Fix searchUnsplash: replace dead Unsplash Source API with Lorem Picsum ─
rep(
  '  // Use Unsplash Source (6 variants via different signals)\n' +
  '  const variants = [q, q+\',business\', q+\',office\', q+\',professional\', q+\',team\', q+\',concept\'];\n' +
  '  grid.innerHTML = variants.map((v, i) => {\n' +
  '    const url = `https://source.unsplash.com/800x450/?${encodeURIComponent(v)}&sig=${i+1}`;\n' +
  '    return `<img src="${url}" class="img-pick-item" loading="lazy" onclick="selectImage(this, \'${url}\')" alt="Image option ${i+1}" onerror="this.style.display=\'none\'">`;\n' +
  '  }).join(\'\');\n' +
  '}',
  '  // Use Lorem Picsum for reliable free stock photos\n' +
  '  var seeds = [q, q + \'-2\', q + \'-3\', q + \'-4\', q + \'-5\', q + \'-6\'];\n' +
  '  grid.innerHTML = seeds.map(function(s, i) {\n' +
  '    var url = \'https://picsum.photos/seed/\' + encodeURIComponent(s.replace(/[^a-z0-9]/gi, \'-\').slice(0, 30)) + \'/800/450\';\n' +
  '    return \'<img src="\' + url + \'" class="img-pick-item" loading="lazy" onclick="selectImage(this,\\\'\' + url + \'\\\')" alt="Stock photo \' + (i + 1) + \'" onerror="this.parentElement && this.parentElement.removeChild(this)">\';\n' +
  '  }).join(\'\');\n' +
  '}'
);

// ── 3. Fix image picker caption ────────────────────────────────────────────────
rep('Image via Unsplash', 'Image via Cruise SEO');

// ── 4. Fix generateOutreachEmail: show modal instead of silently copying ───────
rep(
  '    const email = await callAI(prompt, 500);\n' +
  '    navigator.clipboard.writeText(email);\n' +
  '    toast(\'Outreach email copied to clipboard!\', true);\n' +
  '  } catch(e) { toast(\'Failed to generate email: \' + e.message, false); }\n' +
  '}',
  '    const email = await callAI(prompt, 500);\n' +
  '    var modal = document.getElementById(\'email-outreach-modal\');\n' +
  '    var siteEl = document.getElementById(\'email-modal-site\');\n' +
  '    var bodyEl = document.getElementById(\'email-modal-body\');\n' +
  '    if (modal && bodyEl) {\n' +
  '      if (siteEl) siteEl.textContent = \'To: \' + p.site + \' \u2014 \' + p.type;\n' +
  '      bodyEl.value = email;\n' +
  '      window._emailModalContent = email;\n' +
  '      window._emailModalSite = p.site;\n' +
  '      modal.classList.add(\'open\');\n' +
  '    } else {\n' +
  '      navigator.clipboard.writeText(email);\n' +
  '      toast(\'Email copied!\', true);\n' +
  '    }\n' +
  '  } catch(e) { toast(\'Failed to generate email: \' + e.message, false); }\n' +
  '}'
);

// ── 5. Fix publishToActiveCMS + add helper functions after it ──────────────────
rep(
  'async function publishToActiveCMS(postData) {\n' +
  '  const cmsType = localStorage.getItem(\'cruise_cms_type\') || \'wordpress\';\n' +
  '  if (cmsType === \'wordpress\') return null; // uses existing publishToWP()\n' +
  '  const { title, content_html, meta_description } = postData;\n' +
  '  if (cmsType === \'ghost\') {\n' +
  '    const ghost = JSON.parse(localStorage.getItem(\'cruise_ghost\') || \'{}\');\n' +
  '    if (!ghost.url) throw new Error(\'Ghost not connected\');\n' +
  '    const r = await fetch(\'/api/cms-proxy\', { method: \'POST\', headers: {\'Content-Type\':\'application/json\'}, body: JSON.stringify({ cms: \'ghost\', action: \'publish\', url: ghost.url, adminKey: ghost.adminKey, title, content: content_html, excerpt: meta_description }) });\n' +
  '    return await r.json();\n' +
  '  }\n' +
  '  if (cmsType === \'webflow\') {\n' +
  '    const wf = JSON.parse(localStorage.getItem(\'cruise_webflow\') || \'{}\');\n' +
  '    if (!wf.token) throw new Error(\'Webflow not connected\');\n' +
  '    const r = await fetch(\'/api/cms-proxy\', { method: \'POST\', headers: {\'Content-Type\':\'application/json\'}, body: JSON.stringify({ cms: \'webflow\', action: \'publish\', token: wf.token, collectionId: wf.collectionId, title, content: content_html }) });\n' +
  '    return await r.json();\n' +
  '  }\n' +
  '  if (cmsType === \'custom\') {\n' +
  '    const custom = JSON.parse(localStorage.getItem(\'cruise_custom_cms\') || \'{}\');\n' +
  '    if (!custom.endpoint) throw new Error(\'Custom CMS not configured\');\n' +
  '    const r = await fetch(\'/api/cms-proxy\', { method: \'POST\', headers: {\'Content-Type\':\'application/json\'}, body: JSON.stringify({ cms: \'custom\', action: \'publish\', endpoint: custom.endpoint, auth: custom.auth, titleField: custom.titleField, contentField: custom.contentField, title, content: content_html }) });\n' +
  '    return await r.json();\n' +
  '  }\n' +
  '}',

  // New publishToActiveCMS + helper functions
  'async function publishToActiveCMS(postData) {\n' +
  '  const cmsType = localStorage.getItem(\'cruise_cms_type\') || \'wordpress\';\n' +
  '  if (cmsType === \'wordpress\') return null;\n' +
  '  const { title, content_html } = postData;\n' +
  '  const post = { title, content_html, status: \'published\' };\n' +
  '  let credentials = {};\n' +
  '  if (cmsType === \'ghost\') {\n' +
  '    const ghost = JSON.parse(localStorage.getItem(\'cruise_ghost\') || \'{}\');\n' +
  '    if (!ghost.url) throw new Error(\'Ghost not connected \u2014 set it up in the Publish tab\');\n' +
  '    credentials = { ghostUrl: ghost.url, adminApiKey: ghost.adminKey };\n' +
  '  } else if (cmsType === \'webflow\') {\n' +
  '    const wf = JSON.parse(localStorage.getItem(\'cruise_webflow\') || \'{}\');\n' +
  '    if (!wf.token) throw new Error(\'Webflow not connected \u2014 set it up in the Publish tab\');\n' +
  '    credentials = { collectionId: wf.collectionId, apiToken: wf.token, siteId: wf.siteId || \'\' };\n' +
  '  } else if (cmsType === \'custom\') {\n' +
  '    const custom = JSON.parse(localStorage.getItem(\'cruise_custom_cms\') || \'{}\');\n' +
  '    if (!custom.endpoint) throw new Error(\'Custom CMS not configured \u2014 set it up in the Publish tab\');\n' +
  '    credentials = { endpoint: custom.endpoint, authType: custom.authType || \'bearer\', authValue: custom.authValue || custom.auth || \'\' };\n' +
  '  }\n' +
  '  const r = await fetch(\'/api/cms-proxy\', { method: \'POST\', headers: {\'Content-Type\':\'application/json\'}, body: JSON.stringify({ cmsType, post, credentials }) });\n' +
  '  const data = await r.json();\n' +
  '  if (!r.ok) throw new Error(data.error || \'Publish failed\');\n' +
  '  return data;\n' +
  '}\n' +
  '\n' +
  '// \u2550\u2550 PUBLISH ROUTER \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n' +
  'async function publishToPost() {\n' +
  '  const cmsType = localStorage.getItem(\'cruise_cms_type\') || \'wordpress\';\n' +
  '  if (!cmsType || cmsType === \'wordpress\') return publishToWP();\n' +
  '  if (!generatedPostData) { toast(\'Generate a post first\', false); return; }\n' +
  '  const btn = document.getElementById(\'btnPublishWP\');\n' +
  '  const resultEl = document.getElementById(\'gen-publish-result\');\n' +
  '  const cmsLabels = { ghost: \'Ghost\', webflow: \'Webflow\', custom: \'Custom CMS\' };\n' +
  '  const label = cmsLabels[cmsType] || cmsType;\n' +
  '  if (btn) { btn.disabled = true; btn.textContent = \'Publishing...\'; }\n' +
  '  if (resultEl) resultEl.style.display = \'none\';\n' +
  '  try {\n' +
  '    const result = await publishToActiveCMS(generatedPostData);\n' +
  '    if (resultEl) {\n' +
  '      resultEl.style.display = \'block\';\n' +
  '      resultEl.style.background = \'var(--sage-l)\';\n' +
  '      resultEl.style.border = \'1px solid rgba(74,124,111,.2)\';\n' +
  '      resultEl.style.color = \'var(--sage)\';\n' +
  '      resultEl.innerHTML = \'\u2713 Published to \' + label + \'!\' +\n' +
  '        (result && result.url ? \' <a href="\' + result.url + \'" target="_blank" style="color:var(--sage);font-weight:700;margin-left:8px">View post \u2192</a>\' : \'\');\n' +
  '    }\n' +
  '    toast(\'Post published to \' + label + \'!\', true);\n' +
  '    if (result && result.url) postAutoSocial(generatedPostData.title, result.url);\n' +
  '  } catch(err) {\n' +
  '    if (resultEl) {\n' +
  '      resultEl.style.display = \'block\';\n' +
  '      resultEl.style.background = \'rgba(192,48,79,.06)\';\n' +
  '      resultEl.style.border = \'1px solid rgba(192,48,79,.2)\';\n' +
  '      resultEl.style.color = \'#C0304F\';\n' +
  '      resultEl.textContent = \'Publish failed: \' + err.message;\n' +
  '    }\n' +
  '    toast(err.message, false);\n' +
  '  }\n' +
  '  if (btn) {\n' +
  '    btn.disabled = false;\n' +
  '    btn.textContent = \'Publish to \' + label + \' \u2197\';\n' +
  '  }\n' +
  '}\n' +
  '\n' +
  'function updatePublishBtnLabel() {\n' +
  '  const btn = document.getElementById(\'btnPublishWP\');\n' +
  '  if (!btn) return;\n' +
  '  const cmsType = localStorage.getItem(\'cruise_cms_type\') || \'wordpress\';\n' +
  '  const labels = { ghost: \'Ghost\', webflow: \'Webflow\', custom: \'Custom CMS\', wordpress: \'WordPress\' };\n' +
  '  btn.textContent = \'Publish to \' + (labels[cmsType] || \'WordPress\') + \' \u2197\';\n' +
  '}\n' +
  '\n' +
  'function closeEmailModal() {\n' +
  '  var m = document.getElementById(\'email-outreach-modal\');\n' +
  '  if (m) m.classList.remove(\'open\');\n' +
  '}\n' +
  '\n' +
  'function copyEmailModal() {\n' +
  '  var el = document.getElementById(\'email-modal-body\');\n' +
  '  var txt = el ? el.value : \'\';\n' +
  '  if (!txt) return;\n' +
  '  navigator.clipboard.writeText(txt)\n' +
  '    .then(function() { toast(\'Email copied!\', true); })\n' +
  '    .catch(function() {\n' +
  '      el.select();\n' +
  '      document.execCommand(\'copy\');\n' +
  '      toast(\'Email copied!\', true);\n' +
  '    });\n' +
  '}\n' +
  '\n' +
  'function openEmailClient() {\n' +
  '  var body = window._emailModalContent || \'\';\n' +
  '  var site = window._emailModalSite || \'\';\n' +
  '  var subject = \'Collaboration opportunity\';\n' +
  '  if (site) subject = \'Collaboration opportunity with \' + site;\n' +
  '  window.open(\'mailto:?subject=\' + encodeURIComponent(subject) + \'&body=\' + encodeURIComponent(body), \'_blank\');\n' +
  '}'
);

// ── 6. Update publish button to call publishToPost instead of publishToWP ──────
rep(
  'onclick="publishToWP()" id="btnPublishWP">Publish to WordPress \u2197</button>',
  'onclick="publishToPost()" id="btnPublishWP">Publish to WordPress \u2197</button>'
);

// ── 7. Call updatePublishBtnLabel from initNewFeatures ────────────────────────
rep(
  '  renderDashQueue();\n' +
  '  syncWPPostsToLog();\n' +
  '  loadDashHealth();',
  '  renderDashQueue();\n' +
  '  syncWPPostsToLog();\n' +
  '  loadDashHealth();\n' +
  '  updatePublishBtnLabel();'
);

// ── Write output ───────────────────────────────────────────────────────────────
fs.writeFileSync('app.html', c.split('\n').join('\r\n'));
console.log('\nTotal replacements: ' + count + ' / 7');
