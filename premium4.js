const fs = require('fs');
const p = 'C:/Users/Shreeya/AppData/Local/Temp/seoflow/app.html';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
let hits = 0;

function rep(search, replacement, label) {
  if (!c.includes(search)) { console.log('MISS: ' + label); return; }
  c = c.split(search).join(replacement);
  console.log('OK:   ' + label);
  hits++;
}

// ══════════════════════════════════════════════════════════════════
// 1. CSS for all new features
// ══════════════════════════════════════════════════════════════════
rep(
`.template-chip.active{border-color:var(--amber);background:var(--amber-l);color:var(--amber-d)}
/* MOBILE */`,
`.template-chip.active{border-color:var(--amber);background:var(--amber-l);color:var(--amber-d)}
/* SEO EDUCATIONAL TOOLTIPS */
.seo-tip-wrap{position:relative;display:inline-flex;align-items:center}
.seo-tip-btn{width:17px;height:17px;border-radius:50%;background:var(--cream3);color:var(--ink4);font-size:10px;font-weight:700;display:grid;place-items:center;cursor:pointer;margin-left:8px;border:none;font-family:var(--font-ui);flex-shrink:0;transition:.15s;line-height:1}
.seo-tip-btn:hover{background:var(--amber);color:#fff}
.seo-tip-panel{position:absolute;top:calc(100%+6px);left:0;background:var(--ink);color:rgba(255,255,255,.9);border-radius:12px;padding:16px 18px;width:300px;font-size:12px;line-height:1.65;z-index:200;box-shadow:0 8px 32px rgba(0,0,0,.3);display:none;pointer-events:none}
.seo-tip-panel.open{display:block;pointer-events:all}
.seo-tip-panel .tip-title{color:#fff;font-weight:700;font-size:13px;margin-bottom:6px;display:block}
.seo-tip-panel .tip-why{color:rgba(255,255,255,.6);font-size:11px;margin-top:8px;line-height:1.5}
/* CLUSTER IN-TAB GENERATION */
.cluster-gen-slide{background:var(--cream2);border:1.5px solid var(--border2);border-radius:14px;padding:24px;margin-top:14px;display:none}
.cluster-gen-slide.open{display:block}
.cluster-post-card{padding:16px;background:var(--cream);border:1.5px solid var(--border);border-radius:12px;display:flex;flex-direction:column;gap:10px;position:relative}
/* IMAGE INSERTION */
.img-picker-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}
.img-pick-item{aspect-ratio:16/9;object-fit:cover;border-radius:8px;cursor:pointer;border:2px solid transparent;transition:.15s;width:100%;display:block;background:var(--cream3)}
.img-pick-item.selected{border-color:var(--amber);box-shadow:0 0 0 3px var(--amber-l)}
.img-pick-item:hover:not(.selected){border-color:var(--border2)}
/* SOCIAL MEDIA */
.social-plat-card{padding:16px;border:1.5px solid var(--border);border-radius:12px;background:var(--cream2);transition:.15s}
.social-plat-card.connected{border-color:var(--sage);background:var(--sage-l)}
.social-plat-icon{width:36px;height:36px;border-radius:8px;display:grid;place-items:center;font-size:18px;flex-shrink:0;background:var(--cream)}
/* CMS SELECTOR */
.cms-type-btn{padding:12px 14px;border:1.5px solid var(--border);border-radius:10px;cursor:pointer;transition:.15s;display:flex;align-items:center;gap:10px;background:var(--cream2);font-size:13px;font-weight:600;color:var(--ink3)}
.cms-type-btn.active{border-color:var(--amber);background:var(--amber-l);color:var(--amber-d)}
.cms-type-btn:hover:not(.active){border-color:var(--border2)}
/* BACKLINK PROSPECTS */
.backlink-prospect{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;gap:14px}
.backlink-prospect:last-child{border-bottom:none}
.backlink-score-badge{width:38px;height:38px;border-radius:8px;background:var(--amber-l);color:var(--amber-d);font-weight:800;font-size:12px;display:grid;place-items:center;flex-shrink:0}
/* AI FIX CARDS */
.audit-fix-item{padding:16px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;gap:12px}
.audit-fix-item:last-child{border-bottom:none}
.fix-impact{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;padding:2px 7px;border-radius:4px}
.fix-impact.high{background:rgba(192,48,79,.1);color:#C0304F}
.fix-impact.medium{background:var(--amber-l);color:var(--amber-d)}
.fix-impact.low{background:var(--sage-l);color:var(--sage)}
/* TONE FILTER + TOOLS */
.gen-action-bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
/* POSITIONING SETTINGS */
.pos-toggle{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--ink2)}
.pos-toggle:last-child{border-bottom:none}
.pos-toggle input[type="checkbox"]{accent-color:var(--amber);width:16px;height:16px}
/* MOBILE */`,
  'CSS for educational tooltips, cluster gen, images, social, CMS, backlinks, AI fix, tone');

// ══════════════════════════════════════════════════════════════════
// 2. SIDEBAR NAV — add Social Media connect item
// ══════════════════════════════════════════════════════════════════
rep(
`      <div class="nav-item" onclick="nav(this,'ranks')">
        <div class="nav-dot"></div>
        <svg viewBox="0 0 16 16"><path d="M2 13V7l4-3 4 4 4-6"/><circle cx="14" cy="4" r="1.5"/></svg>`,
`      <div class="nav-item" onclick="nav(this,'social-connect')">
        <div class="nav-dot"></div>
        <svg viewBox="0 0 16 16"><path d="M8 2a2 2 0 100 4 2 2 0 000-4zM3 10a2 2 0 100 4 2 2 0 000-4zM13 10a2 2 0 100 4 2 2 0 000-4z"/><path d="M7 5.5L4 10M9 5.5l3 4.5" opacity=".5"/></svg>
        Social Media
      </div>
      <div class="nav-item" onclick="nav(this,'ranks')">
        <div class="nav-dot"></div>
        <svg viewBox="0 0 16 16"><path d="M2 13V7l4-3 4 4 4-6"/><circle cx="14" cy="4" r="1.5"/></svg>`,
  'Sidebar: Social Media nav item');

// ══════════════════════════════════════════════════════════════════
// 3. SOCIAL MEDIA VIEW — new view before PROFILE
// ══════════════════════════════════════════════════════════════════
rep(
`    <!-- PROFILE -->
    <div class="view" id="view-profile">`,
`    <!-- SOCIAL MEDIA CONNECT -->
    <div class="view" id="view-social-connect">
      <div class="section-hd" style="margin-top:0">
        <div>
          <h2>Social Media</h2>
          <div class="page-desc">Connect your social channels to auto-post content snippets when you publish articles — or compose and post manually at any time.</div>
        </div>
      </div>
      <!-- Platform cards -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:24px">
        <div class="social-plat-card" id="social-card-twitter">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div class="social-plat-icon" style="background:#000;color:#fff;font-size:15px;font-weight:800">𝕏</div>
            <div><div style="font-size:14px;font-weight:700;color:var(--ink)">X / Twitter</div><div style="font-size:11px;color:var(--ink4)" id="twitter-status-label">Not connected</div></div>
            <div style="margin-left:auto;width:10px;height:10px;border-radius:50%;background:var(--border2)" id="twitter-status-dot"></div>
          </div>
          <div id="twitter-connected-ui" style="display:none;margin-bottom:10px">
            <div style="font-size:12px;color:var(--sage);font-weight:600;margin-bottom:8px">✓ Connected</div>
            <button class="btn btn-ghost" onclick="disconnectSocial('twitter')" style="font-size:11px;padding:3px 10px">Disconnect</button>
          </div>
          <div id="twitter-connect-ui">
            <div style="font-size:12px;color:var(--ink4);margin-bottom:10px;line-height:1.5">Provide your X/Twitter API Bearer Token. Create one at <strong>developer.twitter.com</strong> → Projects & Apps → Keys & Tokens.</div>
            <input id="twitter-bearer" class="kw-input" type="password" placeholder="Bearer Token..." style="width:100%;margin-bottom:8px;font-size:12px;font-family:monospace">
            <button class="btn btn-primary" onclick="connectSocial('twitter')" style="width:100%;justify-content:center;font-size:12px">Connect X/Twitter</button>
          </div>
        </div>
        <div class="social-plat-card" id="social-card-linkedin">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div class="social-plat-icon" style="background:#0A66C2;color:#fff;font-size:18px">in</div>
            <div><div style="font-size:14px;font-weight:700;color:var(--ink)">LinkedIn</div><div style="font-size:11px;color:var(--ink4)" id="linkedin-status-label">Not connected</div></div>
            <div style="margin-left:auto;width:10px;height:10px;border-radius:50%;background:var(--border2)" id="linkedin-status-dot"></div>
          </div>
          <div id="linkedin-connected-ui" style="display:none;margin-bottom:10px">
            <div style="font-size:12px;color:var(--sage);font-weight:600;margin-bottom:8px">✓ Connected</div>
            <button class="btn btn-ghost" onclick="disconnectSocial('linkedin')" style="font-size:11px;padding:3px 10px">Disconnect</button>
          </div>
          <div id="linkedin-connect-ui">
            <div style="font-size:12px;color:var(--ink4);margin-bottom:10px;line-height:1.5">Access Token from LinkedIn Developer portal. Also provide your Person URN (your LinkedIn ID).</div>
            <input id="linkedin-token" class="kw-input" type="password" placeholder="Access Token..." style="width:100%;margin-bottom:6px;font-size:12px;font-family:monospace">
            <input id="linkedin-author" class="kw-input" type="text" placeholder="Person ID (e.g. AbCdEfGhI)" style="width:100%;margin-bottom:8px;font-size:12px">
            <button class="btn btn-primary" onclick="connectSocial('linkedin')" style="width:100%;justify-content:center;font-size:12px">Connect LinkedIn</button>
          </div>
        </div>
        <div class="social-plat-card" id="social-card-webhook">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div class="social-plat-icon" style="background:#FF6B35;color:#fff">⚡</div>
            <div><div style="font-size:14px;font-weight:700;color:var(--ink)">Buffer / Zapier / Make</div><div style="font-size:11px;color:var(--ink4)" id="webhook-status-label">Not connected</div></div>
            <div style="margin-left:auto;width:10px;height:10px;border-radius:50%;background:var(--border2)" id="webhook-status-dot"></div>
          </div>
          <div id="webhook-connected-ui" style="display:none;margin-bottom:10px">
            <div style="font-size:12px;color:var(--sage);font-weight:600;margin-bottom:8px">✓ Webhook active</div>
            <button class="btn btn-ghost" onclick="disconnectSocial('webhook')" style="font-size:11px;padding:3px 10px">Disconnect</button>
          </div>
          <div id="webhook-connect-ui">
            <div style="font-size:12px;color:var(--ink4);margin-bottom:10px;line-height:1.5">Paste a webhook URL from Buffer, Zapier, Make, or any automation tool. Posts will be sent as JSON payloads.</div>
            <input id="webhook-url" class="kw-input" type="url" placeholder="https://hooks.zapier.com/..." style="width:100%;margin-bottom:8px;font-size:12px">
            <button class="btn btn-primary" onclick="connectSocial('webhook')" style="width:100%;justify-content:center;font-size:12px">Save Webhook</button>
          </div>
        </div>
        <div class="social-plat-card">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div class="social-plat-icon" style="background:var(--amber);color:#fff;font-size:16px">🔄</div>
            <div><div style="font-size:14px;font-weight:700;color:var(--ink)">Auto-post on publish</div><div style="font-size:11px;color:var(--ink4)">Post to all connected platforms</div></div>
            <label style="margin-left:auto;position:relative;cursor:pointer"><input type="checkbox" id="social-auto-toggle" onchange="saveSocialAutoPost(this.checked)" style="opacity:0;width:0;height:0;position:absolute"><span id="social-auto-visual" style="display:block;width:36px;height:20px;background:var(--border2);border-radius:100px;transition:.2s;position:relative"><span style="position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 1px 4px rgba(0,0,0,.2)" id="social-auto-knob"></span></span></label>
          </div>
          <div style="font-size:12px;color:var(--ink4);line-height:1.5">When enabled, AI-generated social snippets are automatically posted to all connected platforms whenever you publish a post.</div>
        </div>
      </div>
      <!-- Manual composer -->
      <div class="section-hd" style="margin-top:4px"><h2>Compose post</h2></div>
      <div class="card">
        <textarea id="social-compose-text" style="width:100%;height:120px;padding:12px;border:1.5px solid var(--border2);border-radius:8px;font-family:var(--font-ui);font-size:14px;color:var(--ink);background:var(--cream2);resize:vertical;line-height:1.6;box-sizing:border-box" placeholder="Write a social post... or paste an article URL below to generate one."></textarea>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
          <input id="social-article-url" class="kw-input" placeholder="Or paste article URL to generate snippet..." style="flex:1;font-size:13px;padding:9px 12px">
          <button class="btn btn-ghost" onclick="generateSocialFromURL()" style="white-space:nowrap">AI write ✦</button>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
          <span style="font-size:12px;font-weight:600;color:var(--ink3);line-height:2">Post to:</span>
          <button class="btn btn-ghost" onclick="postManualSocial('twitter')" style="font-size:12px;padding:5px 12px">X / Twitter</button>
          <button class="btn btn-ghost" onclick="postManualSocial('linkedin')" style="font-size:12px;padding:5px 12px">LinkedIn</button>
          <button class="btn btn-ghost" onclick="postManualSocial('webhook')" style="font-size:12px;padding:5px 12px">Webhook</button>
          <button class="btn btn-primary" onclick="postManualSocial('all')" style="font-size:12px;padding:5px 16px;margin-left:auto">Post to all →</button>
        </div>
        <div id="social-compose-result" style="margin-top:10px;font-size:12px"></div>
      </div>
    </div>

    <!-- PROFILE -->
    <div class="view" id="view-profile">`,
  'Social Media connect view');

// ══════════════════════════════════════════════════════════════════
// 4. PUBLISH VIEW — CMS type selector before WordPress card
// ══════════════════════════════════════════════════════════════════
rep(
`      <!-- WordPress Connect Card -->
      <div class="card" id="wp-connect-card">`,
`      <!-- CMS TYPE SELECTOR -->
      <div style="margin-bottom:20px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:10px">Platform</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px" id="cms-type-selector">
          <div class="cms-type-btn active" id="cms-btn-wordpress" onclick="selectCMSType('wordpress')">🔌 WordPress</div>
          <div class="cms-type-btn" id="cms-btn-ghost" onclick="selectCMSType('ghost')">👻 Ghost CMS</div>
          <div class="cms-type-btn" id="cms-btn-webflow" onclick="selectCMSType('webflow')">⚡ Webflow</div>
          <div class="cms-type-btn" id="cms-btn-custom" onclick="selectCMSType('custom')">🔧 Custom API</div>
        </div>
      </div>

      <!-- Ghost CMS Form -->
      <div class="card" id="ghost-connect-card" style="display:none">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
          <div style="width:44px;height:44px;background:#15171A;border-radius:10px;display:grid;place-items:center;font-size:22px">👻</div>
          <div><div style="font-size:17px;font-weight:600;color:var(--ink)">Ghost CMS</div><div style="font-size:12px;color:var(--ink4)" id="ghost-status-label">Not connected</div></div>
          <div style="margin-left:auto;width:10px;height:10px;border-radius:50%;background:var(--border2)" id="ghost-status-dot"></div>
        </div>
        <div id="ghost-connect-form">
          <div style="background:var(--cream2);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:16px;font-size:13px;color:var(--ink3);line-height:1.6">Go to <strong>Ghost Admin → Settings → Integrations → Add custom integration</strong> and copy the Admin API Key.</div>
          <div style="margin-bottom:12px"><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink4);display:block;margin-bottom:6px">Ghost site URL</label><input id="ghost-url" class="kw-input" type="url" placeholder="https://your-blog.ghost.io" style="width:100%"></div>
          <div style="margin-bottom:16px"><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink4);display:block;margin-bottom:6px">Admin API Key (id:secret)</label><input id="ghost-api-key" class="kw-input" type="password" placeholder="64char-id:64char-secret" style="width:100%;font-family:monospace"></div>
          <button class="btn btn-primary" onclick="connectGhost()" style="width:100%;justify-content:center">Connect Ghost CMS</button>
        </div>
        <div id="ghost-connected-state" style="display:none">
          <div style="background:var(--sage-l);border:1px solid rgba(74,124,111,.2);border-radius:10px;padding:14px;margin-bottom:14px;font-size:13px;font-weight:600;color:var(--sage)">✓ Ghost CMS connected</div>
          <button class="btn btn-ghost" onclick="disconnectGhost()" style="font-size:12px">Disconnect</button>
        </div>
      </div>

      <!-- Webflow Form -->
      <div class="card" id="webflow-connect-card" style="display:none">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
          <div style="width:44px;height:44px;background:#146EF5;border-radius:10px;display:grid;place-items:center;font-size:22px">⚡</div>
          <div><div style="font-size:17px;font-weight:600;color:var(--ink)">Webflow CMS</div><div style="font-size:12px;color:var(--ink4)" id="webflow-status-label">Not connected</div></div>
          <div style="margin-left:auto;width:10px;height:10px;border-radius:50%;background:var(--border2)" id="webflow-status-dot"></div>
        </div>
        <div id="webflow-connect-form">
          <div style="background:var(--cream2);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:16px;font-size:13px;color:var(--ink3);line-height:1.6">Go to <strong>Webflow → Project Settings → Integrations → API Access</strong> to get your API token and CMS Collection ID.</div>
          <div style="margin-bottom:12px"><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink4);display:block;margin-bottom:6px">API Token</label><input id="webflow-token" class="kw-input" type="password" placeholder="Bearer token..." style="width:100%;font-family:monospace"></div>
          <div style="margin-bottom:16px"><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink4);display:block;margin-bottom:6px">Blog Collection ID</label><input id="webflow-collection" class="kw-input" type="text" placeholder="Collection ID from Webflow..." style="width:100%"></div>
          <button class="btn btn-primary" onclick="connectWebflow()" style="width:100%;justify-content:center">Connect Webflow</button>
        </div>
        <div id="webflow-connected-state" style="display:none">
          <div style="background:var(--sage-l);border:1px solid rgba(74,124,111,.2);border-radius:10px;padding:14px;margin-bottom:14px;font-size:13px;font-weight:600;color:var(--sage)">✓ Webflow CMS connected</div>
          <button class="btn btn-ghost" onclick="disconnectWebflow()" style="font-size:12px">Disconnect</button>
        </div>
      </div>

      <!-- Custom REST API Form -->
      <div class="card" id="custom-cms-card" style="display:none">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
          <div style="width:44px;height:44px;background:var(--ink);border-radius:10px;display:grid;place-items:center;font-size:22px">🔧</div>
          <div><div style="font-size:17px;font-weight:600;color:var(--ink)">Custom REST API</div><div style="font-size:12px;color:var(--ink4)">Connect any headless CMS</div></div>
        </div>
        <div style="margin-bottom:12px"><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink4);display:block;margin-bottom:6px">POST endpoint URL</label><input id="custom-endpoint" class="kw-input" type="url" placeholder="https://api.yoursite.com/posts" style="width:100%"></div>
        <div style="margin-bottom:12px"><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink4);display:block;margin-bottom:6px">Authorization header value</label><input id="custom-auth" class="kw-input" type="password" placeholder="Bearer token / API key..." style="width:100%;font-family:monospace"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
          <div><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink4);display:block;margin-bottom:6px">Title field name</label><input id="custom-field-title" class="kw-input" type="text" placeholder="title" style="width:100%"></div>
          <div><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink4);display:block;margin-bottom:6px">Content field name</label><input id="custom-field-content" class="kw-input" type="text" placeholder="body / content" style="width:100%"></div>
        </div>
        <button class="btn btn-primary" onclick="connectCustomCMS()" style="width:100%;justify-content:center">Save & test connection</button>
        <div id="custom-cms-result" style="margin-top:12px;font-size:12px"></div>
      </div>

      <!-- WordPress Connect Card -->
      <div class="card" id="wp-connect-card" style="">`,
  'Publish view: CMS type selector + Ghost + Webflow + Custom forms');

// ══════════════════════════════════════════════════════════════════
// 5. GENERATE OUTPUT — image picker + tone filter + internal links + company positioning
// ══════════════════════════════════════════════════════════════════
rep(
`        <!-- SERP Preview -->`,
`        <!-- Action toolbar -->
        <div class="gen-action-bar">
          <button class="btn btn-ghost" onclick="runToneFilter()" style="font-size:12px;padding:6px 14px">🎨 Apply brand voice</button>
          <button class="btn btn-ghost" onclick="addInternalLinks()" style="font-size:12px;padding:6px 14px">🔗 Add internal links</button>
          <button class="btn btn-ghost" onclick="addPostImage()" style="font-size:12px;padding:6px 14px">🖼 Add image</button>
          <button class="btn btn-ghost" onclick="addCompanyCTA()" style="font-size:12px;padding:6px 14px">📣 Add CTA</button>
        </div>
        <!-- Image picker (hidden by default) -->
        <div id="img-picker-panel" class="card" style="display:none;padding:18px 20px;margin-bottom:14px">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:12px">Featured Image</div>
          <div style="display:flex;gap:8px;margin-bottom:12px">
            <input id="img-search-query" class="kw-input" placeholder="Search for an image (e.g. marketing, office, laptop)..." style="flex:1;font-size:13px;padding:9px 12px">
            <button class="btn btn-ghost" onclick="searchUnsplash()" style="white-space:nowrap">Search</button>
          </div>
          <div id="img-picker-grid" class="img-picker-grid"></div>
          <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end">
            <button class="btn btn-ghost" onclick="document.getElementById('img-picker-panel').style.display='none'" style="font-size:12px">Cancel</button>
            <button class="btn btn-primary" onclick="insertSelectedImage()" id="img-insert-btn" style="font-size:12px" disabled>Insert image</button>
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--ink4)">Images sourced from Unsplash — free for commercial use.</div>
        </div>
        <!-- SERP Preview -->`,
  'Generate output: action toolbar + image picker');

// ══════════════════════════════════════════════════════════════════
// 6. SITE AUDIT — AI fixer section after issues list
// ══════════════════════════════════════════════════════════════════
rep(
`        <div class="card" style="padding:0;overflow:hidden">
          <div id="audit-issues-list"></div>
        </div>
      </div>
    </div>

    <!-- TOPIC CLUSTERS -->`,
`        <div class="card" style="padding:0;overflow:hidden">
          <div id="audit-issues-list"></div>
        </div>
        <!-- AI Fix Panel -->
        <div style="margin-top:20px">
          <div class="section-hd" style="margin-top:0">
            <div>
              <h2>AI Issue Fixer</h2>
              <div style="font-size:12px;color:var(--ink4);margin-top:2px">Let AI analyse your audit results and generate specific, actionable fixes for each issue.</div>
            </div>
            <button class="btn btn-primary" onclick="runAIAuditFix()" id="audit-fix-btn">Fix issues with AI ✦</button>
          </div>
          <div id="audit-fix-loading" style="display:none;padding:40px;text-align:center"><div class="gen-spinner"></div><div style="margin-top:16px;color:var(--ink4);font-size:14px">AI is analysing your audit results...</div></div>
          <div class="card" id="audit-fix-results" style="display:none;padding:0;overflow:hidden"></div>
        </div>
        <!-- Backlink Opportunities -->
        <div style="margin-top:20px">
          <div class="section-hd" style="margin-top:0">
            <div>
              <h2>Backlink Opportunities</h2>
              <div style="font-size:12px;color:var(--ink4);margin-top:2px">AI-researched sites in your niche that are likely to link back or accept guest posts.</div>
            </div>
            <button class="btn btn-ghost" onclick="runBacklinkResearch()" id="backlink-btn">Find opportunities</button>
          </div>
          <div id="backlink-loading" style="display:none;padding:40px;text-align:center"><div class="gen-spinner"></div><div style="margin-top:16px;color:var(--ink4);font-size:14px">Researching backlink prospects...</div></div>
          <div class="card" id="backlink-results" style="display:none;padding:0;overflow:hidden"></div>
        </div>
      </div>
    </div>

    <!-- TOPIC CLUSTERS -->`,
  'Site Audit: AI fixer + Backlink opportunities sections');

// ══════════════════════════════════════════════════════════════════
// 7. TOPIC CLUSTERS — Enhanced cluster post cards + in-tab gen panel
// ══════════════════════════════════════════════════════════════════
rep(
`        <div id="cluster-posts" style="display:grid;grid-template-columns:1fr 1fr;gap:10px"></div>
      </div>
    </div>`,
`        <div id="cluster-posts" style="display:grid;grid-template-columns:1fr 1fr;gap:10px"></div>
        <!-- In-tab generation panel -->
        <div id="cluster-gen-slide" class="cluster-gen-slide">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
            <div>
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:3px">Generating</div>
              <div style="font-size:15px;font-weight:700;color:var(--ink)" id="cluster-gen-title-label">—</div>
            </div>
            <button class="btn btn-ghost" onclick="closeClusterGenPanel()" style="padding:6px 12px">✕ Close</button>
          </div>
          <div id="cluster-gen-loading" style="text-align:center;padding:28px 0"><div class="gen-spinner"></div><div style="margin-top:14px;color:var(--ink4);font-size:13px">Writing post...</div></div>
          <div id="cluster-gen-output" style="display:none">
            <div id="cluster-gen-preview" style="padding:16px;background:var(--cream);border:1px solid var(--border);border-radius:8px;font-size:13px;color:var(--ink2);line-height:1.7;max-height:280px;overflow-y:auto;margin-bottom:16px"></div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
              <div>
                <label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink4);display:block;margin-bottom:4px">Publish time</label>
                <input type="datetime-local" id="cluster-schedule-dt" class="kw-input" style="font-size:13px">
              </div>
              <div style="margin-top:18px;display:flex;gap:8px">
                <button class="btn btn-ghost" onclick="publishClusterPostNow()" style="font-size:12px">Publish now</button>
                <button class="btn btn-primary" onclick="scheduleClusterPost()" style="font-size:12px">Schedule →</button>
              </div>
            </div>
            <div id="cluster-gen-result" style="margin-top:10px;font-size:12px;color:var(--ink4)"></div>
          </div>
        </div>
      </div>
    </div>`,
  'Topic Clusters: in-tab gen panel');

// ══════════════════════════════════════════════════════════════════
// 8. GENERATE PROMPT — add positioning + contact CTA + layout richness + backlinking
// ══════════════════════════════════════════════════════════════════
rep(
`  const tplInstruction = templateInstructions[selectedTemplate] || templateInstructions.blog;
  const prompt = \`You are an expert SEO content writer. Write a comprehensive, SEO-optimised blog post for the following:`,
`  const tplInstruction = templateInstructions[selectedTemplate] || templateInstructions.blog;
  // Positioning + CTA
  const bpos = JSON.parse(localStorage.getItem('cruise_positioning') || '{}');
  const positioningLine = bpos.enabled ? \`\\n- Position the business as THE leading expert and ideal solution for the reader's problem throughout the article\` : '';
  const contactUrl = b.bookingUrl || b.booking_url || bpos.contactUrl || '';
  const ctaLine = contactUrl ? \`\\n- End with a compelling CTA paragraph naturally linking to the contact/booking page: \${contactUrl} (use anchor text like "get in touch", "book a free consultation", or "contact us today")\` : '';
  // Published posts for internal linking
  const pubPosts = getAllPublishedPosts ? getAllPublishedPosts().slice(0, 8).map(p => p.title + (p.url ? ' ('+p.url+')' : '')).join(', ') : '';
  const internalLinkLine = pubPosts ? \`\\n- Naturally interlink to these existing posts where relevant: \${pubPosts}\` : '';
  // Layout richness
  const layoutLine = \`\\n- Enrich the layout: include at least one HTML <table> for comparisons/stats, one <blockquote> for a key insight, and multiple <ul> or <ol> lists. Use <strong> for key terms. Make it visually varied, not wall-to-wall paragraphs.\`;
  // Backlink note
  const backlinkLine = \`\\n- Subtly reference 1-2 relevant, authoritative external sources (only where they add genuine value) with natural anchor text\`;
  const prompt = \`You are an expert SEO content writer. Write a comprehensive, SEO-optimised blog post for the following:`,
  'runGenerate: positioning + CTA + internal links + layout richness + backlinking in prompt vars');

rep(
`Requirements:
\${tplInstruction}
- Write a compelling, keyword-rich H1 title (don't include "H1:" prefix, just the title)`,
`Requirements:
\${tplInstruction}\${positioningLine}\${ctaLine}\${internalLinkLine}\${layoutLine}\${backlinkLine}
- Write a compelling, keyword-rich H1 title (don't include "H1:" prefix, just the title)`,
  'runGenerate: inject positioning/CTA/links/layout into prompt');

// ══════════════════════════════════════════════════════════════════
// 9. UPDATE generateClusterPost — use in-tab panel instead of nav
// ══════════════════════════════════════════════════════════════════
rep(
`function generateClusterPost(idx) {
  if (!clusterData?.supporting_posts?.[idx]) return;
  const post = clusterData.supporting_posts[idx];
  nav(null, 'engine');
  setTimeout(() => {
    const inp = document.querySelector('#view-engine input[type="text"], #view-engine input:not([type])');
    if (inp) inp.value = post.keyword || post.title;
  }, 100);
}`,
`function generateClusterPost(idx) {
  if (!clusterData?.supporting_posts?.[idx]) return;
  const post = clusterData.supporting_posts[idx];
  generateClusterInTab(post.keyword || post.title, post.title, post.angle || '', post.cta || '');
}

function generateClusterPillar() {
  if (!clusterData?.pillar) return;
  generateClusterInTab(clusterData.pillar.keyword || clusterData.pillar.title, clusterData.pillar.title, clusterData.pillar.description || '', '');
}`,
  'generateClusterPost: use in-tab panel');

// ══════════════════════════════════════════════════════════════════
// 10. GENERATE CLUSTER PILLAR — already replaced above, patch original
// ══════════════════════════════════════════════════════════════════
rep(
`function generateClusterPillar() {
  if (!clusterData?.pillar) return;
  nav(null, 'engine');
  setTimeout(() => {
    const inp = document.querySelector('#view-engine input[type="text"], #view-engine input:not([type])');
    if (inp) inp.value = clusterData.pillar.keyword || clusterData.pillar.title;
  }, 100);
}`,
`// generateClusterPillar replaced in generateClusterPost block above`,
  'generateClusterPillar: original replaced');

// ══════════════════════════════════════════════════════════════════
// 11. nav() crumbMap — add social-connect
// ══════════════════════════════════════════════════════════════════
rep(
`  const crumbMap = {dashboard:'Dashboard',posts:'Content',keywords:'Keywords',engine:'Generate',grader:'Content Grader',audit:'Site Audit',clusters:'Topic Clusters',competitor:'Competitor',social:'Social Snippets',ranks:'Rank Tracker',autopilot:'Autopilot',publish:'Publish',profile:'Brand Profile'};`,
`  const crumbMap = {dashboard:'Dashboard',posts:'Content',keywords:'Keywords',engine:'Generate',grader:'Content Grader',audit:'Site Audit',clusters:'Topic Clusters',competitor:'Competitor',social:'Social Snippets',ranks:'Rank Tracker',autopilot:'Autopilot',publish:'Publish',profile:'Brand Profile','social-connect':'Social Media'};`,
  'nav() crumbMap: add social-connect');

// ══════════════════════════════════════════════════════════════════
// 12. nav() — init social view when navigated
// ══════════════════════════════════════════════════════════════════
rep(
`  if (id === 'audit') { renderScoreHistory(); }`,
`  if (id === 'audit') { renderScoreHistory(); }
  if (id === 'social-connect') { loadSocialState(); }
  if (id === 'publish') { restoreCMSType(); }`,
  'nav(): load social state + CMS type on nav');

// ══════════════════════════════════════════════════════════════════
// 13. initNewFeatures — add initEducationalTooltips + initPositioning
// ══════════════════════════════════════════════════════════════════
rep(
`  initTrialSystem();
  initKeyboardShortcuts();`,
`  initTrialSystem();
  initKeyboardShortcuts();
  setTimeout(initEducationalTooltips, 200);
  initPositioningSettings();`,
  'initNewFeatures: add tooltip init + positioning');

// ══════════════════════════════════════════════════════════════════
// 14. PROFILE VIEW — add positioning settings section
// ══════════════════════════════════════════════════════════════════
rep(
`        <button class="btn btn-primary" onclick="saveProfile()">Save profile</button>`,
`        <button class="btn btn-primary" onclick="saveProfile()">Save profile</button>
      </div>
      <!-- POSITIONING & CTA SETTINGS -->
      <div class="section-hd" style="margin-top:28px"><h2>Content positioning</h2></div>
      <div class="card" style="padding:20px 24px">
        <div style="font-size:13px;color:var(--ink4);margin-bottom:14px;line-height:1.6">Control how every piece of AI content positions your brand and drives leads.</div>
        <div class="pos-toggle">
          <input type="checkbox" id="pos-solution" onchange="savePositioning()">
          <div><div style="font-weight:600">Always position as the ideal solution</div><div style="font-size:11px;color:var(--ink4);margin-top:2px">AI will frame every post to position your business as the expert answer to the reader's problem</div></div>
        </div>
        <div class="pos-toggle">
          <input type="checkbox" id="pos-cta" onchange="savePositioning()">
          <div><div style="font-weight:600">Always include contact/booking CTA</div><div style="font-size:11px;color:var(--ink4);margin-top:2px">Every post ends with a compelling call-to-action linking to your contact/booking URL</div></div>
        </div>
        <div class="pos-toggle">
          <input type="checkbox" id="pos-interlink" checked onchange="savePositioning()">
          <div><div style="font-weight:600">Auto-interlink to existing posts</div><div style="font-size:11px;color:var(--ink4);margin-top:2px">AI naturally links to your published posts where relevant, building internal authority</div></div>
        </div>
        <div class="pos-toggle">
          <input type="checkbox" id="pos-backlink" checked onchange="savePositioning()">
          <div><div style="font-weight:600">Subtle authority backlinking</div><div style="font-size:11px;color:var(--ink4);margin-top:2px">Reference 1-2 authoritative external sources per post to signal expertise to search engines</div></div>
        </div>
        <div style="margin-top:14px">
          <label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink4);display:block;margin-bottom:6px">Contact / Booking URL for CTAs</label>
          <input id="pos-contact-url" class="kw-input" type="url" placeholder="https://yoursite.com/contact" style="width:100%">
        </div>
        <button class="btn btn-primary" onclick="savePositioning()" style="margin-top:14px">Save positioning settings`,
  'Profile view: positioning settings section');

// ══════════════════════════════════════════════════════════════════
// 15. ALL NEW JS FUNCTIONS — add before closing </script>
// ══════════════════════════════════════════════════════════════════
rep(
`// ══ DARK MODE ══════════════════════════════════════════════════════`,
`// ══════════════════════════════════════════════════════════════════
// EDUCATIONAL TOOLTIPS
// ══════════════════════════════════════════════════════════════════
const seoTips = {
  'Content Grader': { title: 'Why grade your content?', body: 'Search engines like Google use E-E-A-T (Experience, Expertise, Authority, Trust) to rank content. A content grade tells you whether your post is readable, keyword-optimised, and engaging enough to rank well.', why: 'Posts with scores above 75 are 3x more likely to reach page 1.' },
  'Site Audit': { title: 'What is an SEO site audit?', body: 'A site audit crawls your entire website and flags technical issues that prevent Google from properly indexing your pages — broken links, missing meta descriptions, slow images, and more.', why: 'Fixing audit errors can improve rankings within 2–4 weeks.' },
  'Topic Clusters': { title: 'What are topic clusters?', body: 'A topic cluster is a group of interlinked content: one long-form "pillar" post and multiple "supporting" posts targeting related keywords. Internal links pass SEO authority between posts.', why: 'Sites using topic clusters see 20–40% more organic traffic.' },
  'Competitor Analysis': { title: 'Why analyse competitors?', body: 'Understanding what content your competitors rank for reveals gaps you can exploit. By targeting their weaknesses, you can outrank them for profitable keywords without guessing.', why: 'Content gap analysis is one of the highest-ROI SEO tactics.' },
  'Social Snippets': { title: 'SEO + social media', body: 'While social signals don\'t directly affect rankings, they drive traffic that Google interprets as proof of relevance. More traffic = stronger ranking signals over time.', why: 'Posts shared on LinkedIn get 3x more indexed backlinks.' },
  'Rank Tracker': { title: 'Why track keyword rankings?', body: 'Rank tracking tells you if your SEO efforts are working. Seeing a keyword move from position 18 to 7 tells you which content to invest in more.', why: 'Most clicks go to positions 1–3. Even moving from 10→5 doubles traffic.' },
  'Autopilot': { title: 'How autopilot helps SEO', body: 'Google rewards websites that publish consistently. Sites that post 2–4x per week index faster, rank for more keywords, and build domain authority much faster than irregular publishers.', why: 'Consistent publishing is the #1 driver of long-term organic traffic growth.' },
  'Keyword Research': { title: 'Why keyword research matters', body: 'Writing about topics nobody searches for wastes time. Keyword research finds the exact phrases your customers type into Google, with volume and competition data to prioritise wisely.', why: 'The right keyword choice can mean 10x more traffic for the same effort.' },
  'Content Engine': { title: 'AI-powered SEO content', body: 'Each post is generated with your brand voice, target keyword, proper heading structure, and internal links built in. The AI follows Google\'s E-E-A-T guidelines to maximise ranking potential.', why: 'AI-assisted content published consistently outperforms sporadic manual posts.' },
  'Publishing': { title: 'Why connect your CMS?', body: 'Direct publishing to your CMS removes friction and ensures content goes live immediately with the correct metadata, internal links, and schema markup that manual copy-paste often misses.', why: 'Indexed content ranks faster when published with correct technical SEO.' },
};

function initEducationalTooltips() {
  document.querySelectorAll('.view .section-hd h2, .view h2').forEach(h2 => {
    const text = h2.textContent.trim();
    if (!seoTips[text] || h2.querySelector('.seo-tip-btn')) return;
    const tip = seoTips[text];
    const wrap = document.createElement('span');
    wrap.className = 'seo-tip-wrap';
    wrap.style.cssText = 'position:relative;display:inline-flex;align-items:center';
    const btn = document.createElement('button');
    btn.className = 'seo-tip-btn';
    btn.textContent = 'i';
    btn.title = 'Learn why this matters for SEO';
    const panel = document.createElement('div');
    panel.className = 'seo-tip-panel';
    panel.innerHTML = \`<span class="tip-title">\${tip.title}</span>\${tip.body}<span class="tip-why" style="display:block;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.15)">💡 \${tip.why}</span>\`;
    btn.onclick = (e) => { e.stopPropagation(); panel.classList.toggle('open'); };
    document.addEventListener('click', () => panel.classList.remove('open'));
    wrap.appendChild(btn);
    wrap.appendChild(panel);
    h2.appendChild(wrap);
  });
}

// ══ POSITIONING SETTINGS ══════════════════════════════════════════
function initPositioningSettings() {
  const pos = JSON.parse(localStorage.getItem('cruise_positioning') || '{}');
  const setSafe = (id, val) => { const el = document.getElementById(id); if (el) { if (el.type === 'checkbox') el.checked = !!val; else el.value = val || ''; } };
  setSafe('pos-solution', pos.enabled);
  setSafe('pos-cta', pos.cta);
  setSafe('pos-interlink', pos.interlink !== false);
  setSafe('pos-backlink', pos.backlink !== false);
  setSafe('pos-contact-url', pos.contactUrl || '');
}

function savePositioning() {
  const getVal = id => { const el = document.getElementById(id); return el ? (el.type === 'checkbox' ? el.checked : el.value) : null; };
  const pos = { enabled: getVal('pos-solution'), cta: getVal('pos-cta'), interlink: getVal('pos-interlink'), backlink: getVal('pos-backlink'), contactUrl: getVal('pos-contact-url') };
  localStorage.setItem('cruise_positioning', JSON.stringify(pos));
  toast('Positioning settings saved', true);
}

// ══ TONE FILTER ═══════════════════════════════════════════════════
async function runToneFilter() {
  if (!generatedPostData) { toast('Generate a post first', false); return; }
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const content = document.getElementById('gen-editor').innerHTML;
  const tone = brand.tone || 'authoritative';
  const voice = brand.voice || '';
  const btn = document.querySelector('[onclick="runToneFilter()"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Applying...'; }
  try {
    const prompt = \`You are a brand editor. The following HTML blog post needs its tone adjusted to match this brand voice:
Brand name: \${brand.name || 'the business'}
Desired tone: \${tone}
Brand voice statement: \${voice}
Industry: \${brand.industry || ''}

Rewrite the content maintaining the same structure and information, but ensure the tone is consistently \${tone} throughout. Preserve all HTML tags. Return ONLY the revised HTML content, nothing else.

CONTENT TO REFINE:
\${content.slice(0, 6000)}\`;
    const refined = await callAI(prompt, 3000);
    document.getElementById('gen-editor').innerHTML = refined.replace(/\`\`\`html|\`\`\`/g, '');
    toast('Brand voice applied!', true);
  } catch(e) { toast('Tone filter failed: ' + e.message, false); }
  if (btn) { btn.disabled = false; btn.textContent = '🎨 Apply brand voice'; }
}

// ══ INTERNAL LINKING ══════════════════════════════════════════════
async function addInternalLinks() {
  if (!generatedPostData) { toast('Generate a post first', false); return; }
  const posts = getAllPublishedPosts().filter(p => p.url).slice(0, 10);
  if (!posts.length) { toast('No published posts to link to yet', false); return; }
  const content = document.getElementById('gen-editor').innerHTML;
  const btn = document.querySelector('[onclick="addInternalLinks()"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Linking...'; }
  try {
    const postList = posts.map(p => \`"\${p.title}" → \${p.url}\`).join('\\n');
    const prompt = \`You are an SEO expert. Add 2-4 natural internal links to the following HTML blog post, linking to relevant pages from this list:
\${postList}

Rules:
- Only add links where they make genuine contextual sense
- Use natural, descriptive anchor text (NOT "click here")
- Wrap existing words in <a href="URL"> tags — do not add new sentences
- Return ONLY the modified HTML, preserving all existing formatting and content\`;
    const result = await callAI(prompt + '\\n\\nBLOG POST HTML:\\n' + content.slice(0, 5000), 3000);
    document.getElementById('gen-editor').innerHTML = result.replace(/\`\`\`html|\`\`\`/g, '');
    toast('Internal links added!', true);
  } catch(e) { toast('Internal linking failed: ' + e.message, false); }
  if (btn) { btn.disabled = false; btn.textContent = '🔗 Add internal links'; }
}

// ══ COMPANY CTA ═══════════════════════════════════════════════════
async function addCompanyCTA() {
  if (!generatedPostData) { toast('Generate a post first', false); return; }
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const pos = JSON.parse(localStorage.getItem('cruise_positioning') || '{}');
  const contactUrl = brand.bookingUrl || brand.booking_url || pos.contactUrl || '';
  if (!contactUrl) { toast('Add your contact/booking URL in Brand Profile first', false); nav(null, 'profile'); return; }
  const content = document.getElementById('gen-editor').innerHTML;
  const btn = document.querySelector('[onclick="addCompanyCTA()"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Adding CTA...'; }
  try {
    const prompt = \`Add a compelling call-to-action paragraph at the end of this HTML blog post. The CTA should:
- Position \${brand.name || 'the business'} as the ideal solution
- Feel natural and helpful, not salesy
- Include a link to: \${contactUrl} with anchor text like "get in touch", "book a free consultation", or "speak with our team"
- Be 2-3 sentences max
- Return ONLY the complete HTML with the CTA added\`;
    const result = await callAI(prompt + '\\n\\nBLOG POST:\\n' + content.slice(0, 5000), 2000);
    document.getElementById('gen-editor').innerHTML = result.replace(/\`\`\`html|\`\`\`/g, '');
    toast('CTA added!', true);
  } catch(e) { toast('CTA failed: ' + e.message, false); }
  if (btn) { btn.disabled = false; btn.textContent = '📣 Add CTA'; }
}

// ══ IMAGE INSERTION ═══════════════════════════════════════════════
let _selectedImageUrl = null;

function addPostImage() {
  const panel = document.getElementById('img-picker-panel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? '' : 'none';
  if (panel.style.display !== 'none') {
    const kw = generatedPostData?.keyword || '';
    document.getElementById('img-search-query').value = kw;
    if (kw) searchUnsplash();
  }
}

function searchUnsplash() {
  const q = (document.getElementById('img-search-query')?.value || '').trim().replace(/\s+/g, ',');
  if (!q) return;
  const grid = document.getElementById('img-picker-grid');
  if (!grid) return;
  _selectedImageUrl = null;
  document.getElementById('img-insert-btn').disabled = true;
  grid.innerHTML = '';
  // Use Unsplash Source (6 variants via different signals)
  const variants = [q, q+',business', q+',office', q+',professional', q+',team', q+',concept'];
  grid.innerHTML = variants.map((v, i) => {
    const url = \`https://source.unsplash.com/800x450/?\${encodeURIComponent(v)}&sig=\${i+1}\`;
    return \`<img src="\${url}" class="img-pick-item" loading="lazy" onclick="selectImage(this, '\${url}')" alt="Image option \${i+1}" onerror="this.style.display='none'">\`;
  }).join('');
}

function selectImage(imgEl, url) {
  document.querySelectorAll('.img-pick-item').forEach(i => i.classList.remove('selected'));
  imgEl.classList.add('selected');
  _selectedImageUrl = url;
  document.getElementById('img-insert-btn').disabled = false;
}

function insertSelectedImage() {
  if (!_selectedImageUrl) return;
  const editor = document.getElementById('gen-editor');
  if (!editor) return;
  const imgHtml = \`<figure style="margin:0 0 24px;text-align:center"><img src="\${_selectedImageUrl}" alt="\${generatedPostData?.keyword || 'article image'}" style="max-width:100%;border-radius:8px;height:auto" loading="lazy" /><figcaption style="font-size:12px;color:#888;margin-top:8px">Image via Unsplash</figcaption></figure>\\n\`;
  editor.innerHTML = imgHtml + editor.innerHTML;
  if (generatedPostData) generatedPostData.featuredImageUrl = _selectedImageUrl;
  document.getElementById('img-picker-panel').style.display = 'none';
  toast('Image added to post!', true);
}

// ══ AI AUDIT FIXER ════════════════════════════════════════════════
async function runAIAuditFix() {
  const lastAudit = JSON.parse(localStorage.getItem('cruise_last_audit') || '{}');
  if (!lastAudit.health_score) { toast('Run an audit first', false); return; }
  const btn = document.getElementById('audit-fix-btn');
  const loading = document.getElementById('audit-fix-loading');
  const results = document.getElementById('audit-fix-results');
  if (btn) { btn.disabled = true; btn.textContent = 'Analysing...'; }
  if (loading) loading.style.display = '';
  if (results) results.style.display = 'none';
  // Collect audit issue text from the page
  const issueEls = document.querySelectorAll('#audit-issues-list > div');
  const issueTexts = Array.from(issueEls).map(el => el.textContent.trim().slice(0, 200)).filter(Boolean).slice(0, 10);
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  try {
    const prompt = \`You are an SEO technical specialist. Based on these site audit issues, generate specific, actionable fixes:

Issues found:
\${issueTexts.length ? issueTexts.join('\\n') : 'General SEO improvements needed'}

Site: \${wp.url || 'the website'}

Return ONLY a JSON array of fix objects:
[
  {
    "priority": "high|medium|low",
    "category": "Meta Tags|Images|Content|Links|Schema",
    "issue": "Brief issue description",
    "fix": "Specific action to take (step-by-step)",
    "impact": "Expected improvement if fixed",
    "auto_fixable": false
  }
]\`;
    const raw = await callAI(prompt, 2000);
    const fixes = JSON.parse(raw);
    if (results) {
      results.style.display = '';
      results.innerHTML = fixes.map((f, i) => \`<div class="audit-fix-item">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span class="fix-impact \${f.priority}">\${f.priority} priority</span>
            <span style="font-size:11px;font-weight:700;color:var(--ink4)">\${f.category}</span>
          </div>
          <div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:6px">\${f.issue}</div>
          <div style="font-size:12px;color:var(--ink3);margin-bottom:6px;line-height:1.6"><strong>Fix:</strong> \${f.fix}</div>
          <div style="font-size:12px;color:var(--sage);font-weight:600">Impact: \${f.impact}</div>
        </div>
        <button class="btn btn-ghost" onclick="copyAuditFix(\${i})" style="font-size:11px;padding:3px 10px;flex-shrink:0;margin-top:4px">Copy fix</button>
      </div>\`).join('');
      window._auditFixes = fixes;
    }
    toast('AI fix plan ready!', true);
  } catch(e) { toast('Fix analysis failed: ' + e.message, false); }
  if (loading) loading.style.display = 'none';
  if (btn) { btn.disabled = false; btn.textContent = 'Fix issues with AI ✦'; }
}

function copyAuditFix(idx) {
  const fix = window._auditFixes?.[idx];
  if (!fix) return;
  navigator.clipboard.writeText(\`Issue: \${fix.issue}\\nFix: \${fix.fix}\\nImpact: \${fix.impact}\`);
  toast('Fix copied to clipboard', true);
}

// ══ BACKLINK RESEARCH ══════════════════════════════════════════════
async function runBacklinkResearch() {
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const btn = document.getElementById('backlink-btn');
  const loading = document.getElementById('backlink-loading');
  const results = document.getElementById('backlink-results');
  if (btn) { btn.disabled = true; btn.textContent = 'Researching...'; }
  if (loading) loading.style.display = '';
  if (results) results.style.display = 'none';
  try {
    const prompt = \`You are an SEO link-building specialist. Generate 8 realistic backlink prospects for this business:

Business: \${brand.name || 'a business'}
Industry: \${brand.industry || 'professional services'}
Target audience: \${brand.audience || brand.idealCustomer || ''}

Return ONLY a JSON array:
[
  {
    "site": "Site name",
    "url": "https://example.com",
    "type": "Guest post|Resource page|Directory|Partnership|Press",
    "relevance_score": 85,
    "notes": "Why this site is valuable + how to approach them",
    "outreach_angle": "Specific pitch angle that would work for this site"
  }
]\`;
    const raw = await callAI(prompt, 2000);
    const prospects = JSON.parse(raw);
    if (results) {
      results.style.display = '';
      results.innerHTML = prospects.map((p, i) => \`<div class="backlink-prospect">
        <div class="backlink-score-badge">\${p.relevance_score || '?'}</div>
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="font-size:13px;font-weight:700;color:var(--ink)">\${p.site}</span>
            <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:var(--cream3);color:var(--ink4)">\${p.type}</span>
          </div>
          <div style="font-size:12px;color:var(--ink4);margin-bottom:4px">\${p.notes}</div>
          <div style="font-size:12px;color:var(--amber-d);font-weight:600">Angle: \${p.outreach_angle}</div>
        </div>
        <button class="btn btn-ghost" onclick="generateOutreachEmail(\${i})" style="font-size:11px;padding:3px 10px;flex-shrink:0">Email →</button>
      </div>\`).join('');
      window._backlinkProspects = prospects;
    }
    toast('Backlink prospects ready!', true);
  } catch(e) { toast('Research failed: ' + e.message, false); }
  if (loading) loading.style.display = 'none';
  if (btn) { btn.disabled = false; btn.textContent = 'Find opportunities'; }
}

async function generateOutreachEmail(idx) {
  const p = window._backlinkProspects?.[idx];
  if (!p) return;
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const prompt = \`Write a short, genuine outreach email to secure a backlink or guest post opportunity:
Target site: \${p.site} (\${p.url})
Opportunity type: \${p.type}
Pitch angle: \${p.outreach_angle}
Our business: \${brand.name || 'the business'} — \${brand.industry || ''}
Keep it under 150 words, friendly, professional, and value-focused. No "I hope this email finds you well". Return just the email text.\`;
  try {
    const email = await callAI(prompt, 500);
    navigator.clipboard.writeText(email);
    toast('Outreach email copied to clipboard!', true);
  } catch(e) { toast('Failed to generate email: ' + e.message, false); }
}

// ══ CLUSTER IN-TAB GENERATION ══════════════════════════════════════
let _clusterGenData = null;

async function generateClusterInTab(keyword, title, angle, cta) {
  const panel = document.getElementById('cluster-gen-slide');
  const titleLabel = document.getElementById('cluster-gen-title-label');
  const genLoading = document.getElementById('cluster-gen-loading');
  const genOutput = document.getElementById('cluster-gen-output');
  const preview = document.getElementById('cluster-gen-preview');
  const resultEl = document.getElementById('cluster-gen-result');
  if (!panel) return;
  panel.classList.add('open');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (titleLabel) titleLabel.textContent = title;
  if (genLoading) genLoading.style.display = '';
  if (genOutput) genOutput.style.display = 'none';
  if (resultEl) resultEl.textContent = '';
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const pillarTitle = document.getElementById('cluster-pillar-title')?.textContent || '';
  const pos = JSON.parse(localStorage.getItem('cruise_positioning') || '{}');
  const contactUrl = brand.bookingUrl || brand.booking_url || pos.contactUrl || '';
  try {
    const prompt = \`Write a complete SEO blog post:
Title: \${title}
Target keyword: \${keyword}
Angle/focus: \${angle}
Brand: \${brand.name || ''} | Industry: \${brand.industry || ''}
Tone: \${brand.tone || 'authoritative'}
This is part of a topic cluster. The pillar page is: "\${pillarTitle}"
- Link back to the pillar post using anchor text naturally
- Position the business as the expert solution\${contactUrl ? '\\n- End with a CTA linking to: ' + contactUrl : ''}
\${cta ? '- CTA suggestion: ' + cta : ''}
- Use H2/H3 headings, bullet lists, and at least one table
- Write in UK English, 900-1100 words
Return ONLY JSON: { "title": "...", "meta_description": "...", "content_html": "..." }\`;
    const raw = await callAI(prompt, 3000);
    _clusterGenData = JSON.parse(raw);
    if (preview) {
      preview.innerHTML = \`<h3 style="font-size:16px;font-weight:700;margin-bottom:12px">\${_clusterGenData.title}</h3>\` + _clusterGenData.content_html;
    }
    // Default schedule to tomorrow 8am
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(8, 0, 0, 0);
    const dtInput = document.getElementById('cluster-schedule-dt');
    if (dtInput) dtInput.value = tomorrow.toISOString().slice(0, 16);
    if (genLoading) genLoading.style.display = 'none';
    if (genOutput) genOutput.style.display = '';
  } catch(e) {
    if (genLoading) genLoading.style.display = 'none';
    toast('Generation failed: ' + e.message, false);
  }
}

function closeClusterGenPanel() {
  const panel = document.getElementById('cluster-gen-slide');
  if (panel) panel.classList.remove('open');
  _clusterGenData = null;
}

async function publishClusterPostNow() {
  if (!_clusterGenData) return;
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  if (!wp.url) { toast('Connect WordPress in the Publish tab first', false); return; }
  const resultEl = document.getElementById('cluster-gen-result');
  if (resultEl) resultEl.textContent = 'Publishing...';
  try {
    const r = await fetch('/api/wp-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'publish', url: wp.url, username: wp.username, password: wp.password, title: _clusterGenData.title, content: _clusterGenData.content_html, status: 'publish', excerpt: _clusterGenData.meta_description })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Publish failed');
    if (resultEl) resultEl.innerHTML = \`<span style="color:var(--sage)">✓ Published! <a href="\${d.url}" target="_blank" style="color:var(--amber)">View post ↗</a></span>\`;
    const log = JSON.parse(localStorage.getItem('cruise_wp_log') || '[]');
    log.unshift({ title: _clusterGenData.title, url: d.url, status: 'ok', ts: new Date().toISOString(), topic: 'cluster' });
    localStorage.setItem('cruise_wp_log', JSON.stringify(log));
    toast('Cluster post published!', true);
  } catch(e) {
    if (resultEl) resultEl.innerHTML = \`<span style="color:#C0304F">Error: \${e.message}</span>\`;
  }
}

async function scheduleClusterPost() {
  if (!_clusterGenData) return;
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  if (!wp.url) { toast('Connect WordPress first', false); return; }
  const dtVal = document.getElementById('cluster-schedule-dt')?.value;
  if (!dtVal) { toast('Pick a date/time', false); return; }
  const schedDate = new Date(dtVal).toISOString();
  const resultEl = document.getElementById('cluster-gen-result');
  if (resultEl) resultEl.textContent = 'Scheduling...';
  try {
    const r = await fetch('/api/wp-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'publish', url: wp.url, username: wp.username, password: wp.password, title: _clusterGenData.title, content: _clusterGenData.content_html, status: 'future', date: schedDate, excerpt: _clusterGenData.meta_description })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Schedule failed');
    if (resultEl) resultEl.innerHTML = \`<span style="color:var(--sage)">✓ Scheduled for \${new Date(dtVal).toLocaleString('en-GB', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</span>\`;
    toast('Post scheduled!', true);
  } catch(e) {
    if (resultEl) resultEl.innerHTML = \`<span style="color:#C0304F">Error: \${e.message}</span>\`;
  }
}

// ══ SOCIAL MEDIA ══════════════════════════════════════════════════
function loadSocialState() {
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  ['twitter', 'linkedin', 'webhook'].forEach(p => {
    const cred = social[p];
    const connUi = document.getElementById(p + '-connected-ui');
    const connFrm = document.getElementById(p + '-connect-ui');
    const dot = document.getElementById(p + '-status-dot');
    const lbl = document.getElementById(p + '-status-label');
    const card = document.getElementById('social-card-' + p);
    if (cred) {
      if (connUi) connUi.style.display = '';
      if (connFrm) connFrm.style.display = 'none';
      if (dot) dot.style.background = 'var(--sage)';
      if (lbl) lbl.textContent = 'Connected';
      if (card) card.classList.add('connected');
    } else {
      if (connUi) connUi.style.display = 'none';
      if (connFrm) connFrm.style.display = '';
      if (dot) dot.style.background = 'var(--border2)';
      if (lbl) lbl.textContent = 'Not connected';
      if (card) card.classList.remove('connected');
    }
  });
  const autoToggle = document.getElementById('social-auto-toggle');
  const autoKnob = document.getElementById('social-auto-knob');
  const autoVis = document.getElementById('social-auto-visual');
  const autoOn = !!(JSON.parse(localStorage.getItem('cruise_social') || '{}').autoPost);
  if (autoToggle) autoToggle.checked = autoOn;
  if (autoVis) autoVis.style.background = autoOn ? 'var(--sage)' : 'var(--border2)';
  if (autoKnob) autoKnob.style.left = autoOn ? '18px' : '2px';
}

function connectSocial(platform) {
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  if (platform === 'twitter') {
    const token = document.getElementById('twitter-bearer')?.value.trim();
    if (!token) { toast('Enter your Bearer Token', false); return; }
    social.twitter = { bearerToken: token };
    toast('X/Twitter connected!', true);
  } else if (platform === 'linkedin') {
    const token = document.getElementById('linkedin-token')?.value.trim();
    const author = document.getElementById('linkedin-author')?.value.trim();
    if (!token || !author) { toast('Enter Access Token and Person ID', false); return; }
    social.linkedin = { accessToken: token, authorId: author };
    toast('LinkedIn connected!', true);
  } else if (platform === 'webhook') {
    const url = document.getElementById('webhook-url')?.value.trim();
    if (!url) { toast('Enter webhook URL', false); return; }
    social.webhook = { webhookUrl: url };
    toast('Webhook saved!', true);
  }
  localStorage.setItem('cruise_social', JSON.stringify(social));
  loadSocialState();
}

function disconnectSocial(platform) {
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  delete social[platform];
  localStorage.setItem('cruise_social', JSON.stringify(social));
  loadSocialState();
  toast('Disconnected', true);
}

function saveSocialAutoPost(enabled) {
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  social.autoPost = enabled;
  localStorage.setItem('cruise_social', JSON.stringify(social));
  const knob = document.getElementById('social-auto-knob');
  const vis = document.getElementById('social-auto-visual');
  if (knob) knob.style.left = enabled ? '18px' : '2px';
  if (vis) vis.style.background = enabled ? 'var(--sage)' : 'var(--border2)';
  toast(enabled ? 'Auto-post enabled' : 'Auto-post disabled', true);
}

async function postToSocialPlatform(platform, content, link) {
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  const cred = social[platform];
  if (!cred) { toast(\`\${platform} not connected\`, false); return false; }
  try {
    const r = await fetch('/api/social-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, credentials: cred, content, link })
    });
    const d = await r.json();
    return r.ok && d.ok;
  } catch(e) { return false; }
}

async function postManualSocial(platform) {
  const text = document.getElementById('social-compose-text')?.value.trim();
  if (!text) { toast('Write something to post first', false); return; }
  const resultEl = document.getElementById('social-compose-result');
  if (resultEl) resultEl.textContent = 'Posting...';
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  const platforms = platform === 'all' ? ['twitter', 'linkedin', 'webhook'].filter(p => social[p]) : [platform];
  if (!platforms.length) { toast('No platforms connected. Go to Social Media settings.', false); return; }
  const results = await Promise.all(platforms.map(p => postToSocialPlatform(p, text, '')));
  const successCount = results.filter(Boolean).length;
  if (resultEl) resultEl.innerHTML = \`<span style="color:\${successCount > 0 ? 'var(--sage)' : '#C0304F'}">\${successCount > 0 ? \`✓ Posted to \${successCount} platform\${successCount > 1 ? 's' : ''}\` : '✗ All posts failed — check credentials'}</span>\`;
}

async function generateSocialFromURL() {
  const url = document.getElementById('social-article-url')?.value.trim();
  const textarea = document.getElementById('social-compose-text');
  if (!url || !textarea) return;
  textarea.value = 'Generating...';
  try {
    const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
    const prompt = \`Write a compelling social media post about this article URL: \${url}
Brand: \${brand.name || ''} | Tone: \${brand.tone || 'professional'}
Write 3 variations — one for Twitter/X (under 240 chars), one for LinkedIn (3-4 sentences professional), one for general use.
Format as:
TWITTER: ...
LINKEDIN: ...
GENERAL: ...\`;
    const result = await callAI(prompt, 500);
    textarea.value = result;
  } catch(e) { textarea.value = ''; toast('Generation failed: ' + e.message, false); }
}

async function postAutoSocial(postTitle, postUrl) {
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  if (!social.autoPost) return;
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const platforms = ['twitter', 'linkedin', 'webhook'].filter(p => social[p]);
  if (!platforms.length) return;
  try {
    const prompt = \`Write a social media post promoting this new article:
Title: "\${postTitle}"
Brand: \${brand.name || ''}
Keep it engaging, under 240 characters, include relevant hashtags.\`;
    const snippet = await callAI(prompt, 200);
    platforms.forEach(p => postToSocialPlatform(p, snippet, postUrl));
  } catch(e) { /* silent */ }
}

// ══ CMS TYPE SELECTION ═════════════════════════════════════════════
function selectCMSType(type) {
  ['wordpress', 'ghost', 'webflow', 'custom'].forEach(t => {
    const btn = document.getElementById('cms-btn-' + t);
    const card = document.getElementById(t === 'custom' ? 'custom-cms-card' : t + '-connect-card');
    if (btn) btn.classList.toggle('active', t === type);
    if (card && t !== 'wordpress') card.style.display = t === type ? '' : 'none';
    if (t === 'wordpress') {
      const wpCard = document.getElementById('wp-connect-card');
      if (wpCard) wpCard.style.display = type === 'wordpress' ? '' : 'none';
    }
  });
  localStorage.setItem('cruise_cms_type', type);
}

function restoreCMSType() {
  const saved = localStorage.getItem('cruise_cms_type') || 'wordpress';
  selectCMSType(saved);
  const ghost = JSON.parse(localStorage.getItem('cruise_ghost') || '{}');
  if (ghost.url) { document.getElementById('ghost-connect-form').style.display = 'none'; document.getElementById('ghost-connected-state').style.display = ''; document.getElementById('ghost-status-dot').style.background = 'var(--sage)'; document.getElementById('ghost-status-label').textContent = 'Connected — ' + ghost.url; }
  const wf = JSON.parse(localStorage.getItem('cruise_webflow') || '{}');
  if (wf.token) { document.getElementById('webflow-connect-form').style.display = 'none'; document.getElementById('webflow-connected-state').style.display = ''; document.getElementById('webflow-status-dot').style.background = 'var(--sage)'; document.getElementById('webflow-status-label').textContent = 'Connected'; }
}

function connectGhost() {
  const url = document.getElementById('ghost-url')?.value.trim();
  const key = document.getElementById('ghost-api-key')?.value.trim();
  if (!url || !key) { toast('Enter Ghost URL and Admin API Key', false); return; }
  if (!key.includes(':')) { toast('Admin API Key format: id:secret (contains a colon)', false); return; }
  localStorage.setItem('cruise_ghost', JSON.stringify({ url, adminKey: key }));
  document.getElementById('ghost-connect-form').style.display = 'none';
  document.getElementById('ghost-connected-state').style.display = '';
  document.getElementById('ghost-status-dot').style.background = 'var(--sage)';
  document.getElementById('ghost-status-label').textContent = 'Connected — ' + url;
  toast('Ghost CMS connected!', true);
}

function disconnectGhost() {
  localStorage.removeItem('cruise_ghost');
  document.getElementById('ghost-connect-form').style.display = '';
  document.getElementById('ghost-connected-state').style.display = 'none';
  document.getElementById('ghost-status-dot').style.background = 'var(--border2)';
  document.getElementById('ghost-status-label').textContent = 'Not connected';
  toast('Ghost disconnected', true);
}

function connectWebflow() {
  const token = document.getElementById('webflow-token')?.value.trim();
  const collection = document.getElementById('webflow-collection')?.value.trim();
  if (!token || !collection) { toast('Enter API token and Collection ID', false); return; }
  localStorage.setItem('cruise_webflow', JSON.stringify({ token, collectionId: collection }));
  document.getElementById('webflow-connect-form').style.display = 'none';
  document.getElementById('webflow-connected-state').style.display = '';
  document.getElementById('webflow-status-dot').style.background = 'var(--sage)';
  document.getElementById('webflow-status-label').textContent = 'Connected';
  toast('Webflow connected!', true);
}

function disconnectWebflow() {
  localStorage.removeItem('cruise_webflow');
  document.getElementById('webflow-connect-form').style.display = '';
  document.getElementById('webflow-connected-state').style.display = 'none';
  document.getElementById('webflow-status-dot').style.background = 'var(--border2)';
  document.getElementById('webflow-status-label').textContent = 'Not connected';
  toast('Webflow disconnected', true);
}

function connectCustomCMS() {
  const endpoint = document.getElementById('custom-endpoint')?.value.trim();
  const auth = document.getElementById('custom-auth')?.value.trim();
  const titleField = document.getElementById('custom-field-title')?.value.trim() || 'title';
  const contentField = document.getElementById('custom-field-content')?.value.trim() || 'content';
  if (!endpoint) { toast('Enter the API endpoint URL', false); return; }
  localStorage.setItem('cruise_custom_cms', JSON.stringify({ endpoint, auth, titleField, contentField }));
  const resultEl = document.getElementById('custom-cms-result');
  if (resultEl) resultEl.innerHTML = \`<span style="color:var(--sage)">✓ Custom API saved — \${endpoint}</span>\`;
  toast('Custom CMS saved!', true);
}

// ══ PUBLISH TO CUSTOM CMS (extends publishToWP) ══════════════════
async function publishToActiveCMS(postData) {
  const cmsType = localStorage.getItem('cruise_cms_type') || 'wordpress';
  if (cmsType === 'wordpress') return null; // uses existing publishToWP()
  const { title, content_html, meta_description } = postData;
  if (cmsType === 'ghost') {
    const ghost = JSON.parse(localStorage.getItem('cruise_ghost') || '{}');
    if (!ghost.url) throw new Error('Ghost not connected');
    const r = await fetch('/api/cms-proxy', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ cms: 'ghost', action: 'publish', url: ghost.url, adminKey: ghost.adminKey, title, content: content_html, excerpt: meta_description }) });
    return await r.json();
  }
  if (cmsType === 'webflow') {
    const wf = JSON.parse(localStorage.getItem('cruise_webflow') || '{}');
    if (!wf.token) throw new Error('Webflow not connected');
    const r = await fetch('/api/cms-proxy', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ cms: 'webflow', action: 'publish', token: wf.token, collectionId: wf.collectionId, title, content: content_html }) });
    return await r.json();
  }
  if (cmsType === 'custom') {
    const custom = JSON.parse(localStorage.getItem('cruise_custom_cms') || '{}');
    if (!custom.endpoint) throw new Error('Custom CMS not configured');
    const r = await fetch('/api/cms-proxy', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ cms: 'custom', action: 'publish', endpoint: custom.endpoint, auth: custom.auth, titleField: custom.titleField, contentField: custom.contentField, title, content: content_html }) });
    return await r.json();
  }
}

// ══ DARK MODE ══════════════════════════════════════════════════════`,
  'All new JS functions (tooltips, positioning, tone filter, internal links, CTA, images, AI fix, backlinks, cluster in-tab, social media, CMS types)');

// ══════════════════════════════════════════════════════════════════
// 16. publishToWP — add auto social posting after publish
// ══════════════════════════════════════════════════════════════════
rep(
`    toast('Published to WordPress!', true);`,
`    toast('Published to WordPress!', true);
    // Auto-post to social if enabled
    if (d.url) postAutoSocial(post.title, d.url);`,
  'publishToWP: auto-post to social after publish');

// ══════════════════════════════════════════════════════════════════
// Write file
// ══════════════════════════════════════════════════════════════════
fs.writeFileSync(p, c.replace(/\n/g, '\r\n'), 'utf8');
console.log(`\nDone — ${hits} replacements applied. Lines: ${c.split('\n').length}`);
