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
// 1. BIG CSS BLOCK — dark mode, modals, bulk, edit, shortcuts, serp, history, templates
// ══════════════════════════════════════════════════════════════════
rep(
`.rank-auto-pill:hover{background:var(--amber);color:#fff}
/* MOBILE */`,
`.rank-auto-pill:hover{background:var(--amber);color:#fff}
/* DARK MODE */
body.dark{--cream:#1A1714;--cream2:#231F1C;--cream3:#2E2A26;--ink:#F5F0E8;--ink2:#D4CEC4;--ink3:#A09890;--ink4:#706860;--border:#3A3530;--border2:#4A4540}
body.dark .sidebar{background:#0F0D0B}body.dark .topbar{background:var(--cream);border-color:var(--border)}
body.dark .card{background:var(--cream2);border-color:var(--border)}body.dark .table-row:hover{background:var(--cream3)}
body.dark input,body.dark textarea,body.dark select{background:var(--cream2);border-color:var(--border2);color:var(--ink)}
body.dark tr{background:var(--cream2)}body.dark th,body.dark td{color:var(--ink2)}
/* UPGRADE MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1000;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .2s}
.modal-overlay.open{opacity:1;pointer-events:all}.modal-box{background:var(--cream,#fff);border-radius:20px;padding:36px;max-width:480px;width:90%;box-shadow:0 24px 64px rgba(0,0,0,.18);position:relative}
.modal-close{position:absolute;top:14px;right:16px;background:none;border:none;cursor:pointer;font-size:22px;color:var(--ink4);line-height:1}
.plan-cards{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px}
.plan-card{padding:18px;border-radius:12px;border:2px solid var(--border);background:var(--cream2)}.plan-card.featured{border-color:var(--amber);background:var(--amber-l)}
.plan-card-name{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:8px}
.plan-card-price{font-family:var(--font-serif);font-size:26px;font-weight:600;color:var(--ink);margin-bottom:12px}.plan-card-price span{font-size:13px;font-weight:400;color:var(--ink4)}
.plan-card ul{list-style:none;padding:0;margin:0 0 14px;display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--ink3)}.plan-card ul li::before{content:'✓  ';color:var(--sage);font-weight:700}
.pro-badge{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;background:var(--amber);color:#fff;padding:2px 6px;border-radius:4px;margin-left:6px;vertical-align:middle;display:inline-block}
.trial-banner{background:linear-gradient(135deg,var(--amber-l),var(--sage-l));border:1.5px solid var(--border2);border-radius:12px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px}
/* BULK ACTIONS */
.bulk-bar{display:none;align-items:center;gap:10px;padding:10px 14px;background:var(--cream2);border-radius:10px;margin-bottom:10px;border:1px solid var(--border)}.bulk-bar.visible{display:flex}
.content-check{width:14px;height:14px;cursor:pointer;accent-color:var(--amber)}
/* EDIT POST OVERLAY */
.edit-post-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:900;display:flex;align-items:flex-start;justify-content:center;padding:40px 16px;opacity:0;pointer-events:none;transition:opacity .2s;overflow-y:auto}
.edit-post-overlay.open{opacity:1;pointer-events:all}.edit-post-box{background:var(--cream,#fff);border-radius:16px;padding:28px;width:100%;max-width:680px;box-shadow:0 20px 60px rgba(0,0,0,.2);flex-shrink:0}
/* KEYBOARD SHORTCUTS */
.shortcuts-modal{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .2s}
.shortcuts-modal.open{opacity:1;pointer-events:all}.shortcuts-box{background:var(--cream,#fff);border-radius:16px;padding:28px;width:460px;max-width:92vw;box-shadow:0 20px 60px rgba(0,0,0,.15)}
.shortcut-row{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--ink2)}.shortcut-row:last-child{border-bottom:none}
.shortcut-keys{display:flex;gap:4px;align-items:center}kbd{background:var(--cream2);border:1px solid var(--border2);border-radius:5px;padding:2px 8px;font-family:var(--font-mono);font-size:11px;color:var(--ink2)}
/* SERP PREVIEW */
.serp-preview-wrap{background:#fff;border:1.5px solid #dadce0;border-radius:10px;padding:18px 20px;margin-top:12px}
.serp-preview-wrap .serp-url{font-size:12px;color:#202124;margin-bottom:3px;font-family:Arial,sans-serif}
.serp-preview-wrap .serp-title{font-size:19px;color:#1a0dab;font-weight:400;margin-bottom:5px;font-family:Arial,sans-serif;display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.serp-preview-wrap .serp-desc{font-size:13px;color:#4d5156;line-height:1.5;font-family:Arial,sans-serif}
.serp-char-row{display:flex;gap:8px;align-items:center;margin-bottom:6px;font-size:11px;color:var(--ink4)}
.serp-char-bar{flex:1;height:4px;border-radius:2px;background:var(--cream3);overflow:hidden}.serp-char-fill{height:100%;border-radius:2px;transition:width .3s}
/* SCORE HISTORY */
.score-sparkline{display:flex;align-items:flex-end;gap:3px;height:56px;padding:0 2px}
.score-spark-bar{flex:1;border-radius:2px 2px 0 0;min-height:3px;background:var(--amber);position:relative;cursor:default}
.score-spark-bar::after{content:attr(data-tip);position:absolute;bottom:calc(100%+4px);left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;white-space:nowrap;opacity:0;transition:opacity .15s;pointer-events:none}
.score-spark-bar:hover::after{opacity:1}
/* ONBOARDING CHECKLIST */
.setup-checklist{background:var(--cream2);border:1.5px solid var(--border2);border-radius:14px;padding:20px;margin-bottom:22px}
.setup-step{display:flex;align-items:center;gap:12px;padding:9px 0;font-size:13px;color:var(--ink2);border-bottom:1px solid var(--border)}.setup-step:last-child{border-bottom:none}
.setup-step.done{color:var(--ink4)}.setup-step-icon{width:22px;height:22px;border-radius:50%;border:2px solid var(--border2);display:grid;place-items:center;font-size:10px;flex-shrink:0;background:var(--cream)}
.setup-step.done .setup-step-icon{background:var(--sage);border-color:var(--sage);color:#fff;font-weight:700}
/* CONTENT TEMPLATES */
.template-chip{padding:6px 14px;border-radius:100px;border:1.5px solid var(--border2);font-size:12px;font-weight:600;cursor:pointer;transition:.15s;background:var(--cream2);color:var(--ink3)}
.template-chip.active{border-color:var(--amber);background:var(--amber-l);color:var(--amber-d)}
/* MOBILE */`,
  'Large CSS block (dark mode + all feature styles)');

// ══════════════════════════════════════════════════════════════════
// 2. SIDEBAR — dark mode toggle button next to sign out
// ══════════════════════════════════════════════════════════════════
rep(
`    <button class="sb-signout" onclick="signOut()">Sign out</button>`,
`    <div style="display:flex;gap:6px;align-items:stretch">
      <button class="sb-signout" onclick="signOut()" style="flex:1">Sign out</button>
      <button onclick="toggleDarkMode()" id="dark-mode-btn" title="Toggle dark mode" style="background:none;border:none;cursor:pointer;color:rgba(255,255,255,.4);font-size:16px;padding:0 10px;line-height:1">☽</button>
    </div>`,
  'Sidebar dark mode toggle');

// ══════════════════════════════════════════════════════════════════
// 3. TOPBAR — add shortcuts ? button
// ══════════════════════════════════════════════════════════════════
rep(
`    <div class="topbar-actions">
      <button class="btn btn-ghost" onclick="nav(null,'profile')">Brand profile</button>`,
`    <div class="topbar-actions">
      <button class="btn btn-ghost" onclick="showShortcutsModal()" title="Keyboard shortcuts (press ?)" style="padding:7px 10px;min-width:0;font-size:15px;font-weight:600">?</button>
      <button class="btn btn-ghost" onclick="nav(null,'profile')">Brand profile</button>`,
  'Topbar shortcuts button');

// ══════════════════════════════════════════════════════════════════
// 4. MODALS HTML — upgrade, edit post, keyboard shortcuts
// ══════════════════════════════════════════════════════════════════
rep(
`</aside>
<div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>`,
`</aside>
<div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>

<!-- UPGRADE MODAL -->
<div class="modal-overlay" id="upgrade-modal" onclick="if(event.target===this)closeUpgradeModal()">
  <div class="modal-box">
    <button class="modal-close" onclick="closeUpgradeModal()">×</button>
    <h2 style="font-family:var(--font-serif);font-size:22px;font-weight:600;color:var(--ink);margin:0 0 6px">Upgrade to Pro</h2>
    <p style="font-size:13px;color:var(--ink4);margin:0">Unlock unlimited AI content, advanced analytics, and PDF reports.</p>
    <div class="plan-cards">
      <div class="plan-card">
        <div class="plan-card-name">Free Trial</div>
        <div class="plan-card-price">$0 <span>/ 14 days</span></div>
        <ul><li>50 AI posts total</li><li>1 WordPress site</li><li>Core SEO tools</li><li>Basic audit</li></ul>
      </div>
      <div class="plan-card featured">
        <div class="plan-card-name">Pro</div>
        <div class="plan-card-price">$49 <span>/ month</span></div>
        <ul><li>Unlimited AI posts</li><li>3 WordPress sites</li><li>Full SEO suite</li><li>PDF reports</li><li>GSC integration</li><li>Priority support</li></ul>
        <button class="btn btn-primary" style="width:100%;margin-top:14px;justify-content:center" onclick="activatePro()">Upgrade now →</button>
      </div>
    </div>
  </div>
</div>

<!-- EDIT POST OVERLAY -->
<div class="edit-post-overlay" id="edit-post-overlay" onclick="if(event.target===this)closeEditPost()">
  <div class="edit-post-box">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <h3 style="font-family:var(--font-serif);font-size:18px;font-weight:600;color:var(--ink);margin:0">Edit Post</h3>
      <button class="btn btn-ghost" onclick="closeEditPost()" style="padding:6px 12px">✕ Close</button>
    </div>
    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);display:block;margin-bottom:6px">Title</label>
      <input id="edit-post-title" class="field-input" type="text" style="width:100%;box-sizing:border-box" placeholder="Post title..." />
    </div>
    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);display:block;margin-bottom:6px">Content <span style="font-weight:400;text-transform:none">(HTML)</span></label>
      <textarea id="edit-post-content" style="width:100%;height:300px;box-sizing:border-box;padding:12px;border:1.5px solid var(--border2);border-radius:8px;font-family:var(--font-mono);font-size:12px;background:var(--cream2);color:var(--ink);resize:vertical;line-height:1.6" placeholder="Post HTML content..."></textarea>
    </div>
    <input type="hidden" id="edit-post-wp-id" value="" />
    <input type="hidden" id="edit-post-post-url" value="" />
    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="closeEditPost()">Cancel</button>
      <button class="btn btn-primary" id="edit-post-save-btn" onclick="saveEditPost()">Update on WordPress ↑</button>
    </div>
    <div id="edit-post-status" style="margin-top:10px;font-size:12px;color:var(--ink4)"></div>
  </div>
</div>

<!-- KEYBOARD SHORTCUTS MODAL -->
<div class="shortcuts-modal" id="shortcuts-modal" onclick="if(event.target===this)this.classList.remove('open')">
  <div class="shortcuts-box">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
      <h3 style="font-family:var(--font-serif);font-size:18px;font-weight:600;color:var(--ink);margin:0">Keyboard Shortcuts</h3>
      <button class="btn btn-ghost" onclick="document.getElementById('shortcuts-modal').classList.remove('open')" style="padding:6px 12px">✕</button>
    </div>
    <div class="shortcut-row"><span>Dashboard</span><div class="shortcut-keys"><kbd>G</kbd> then <kbd>D</kbd></div></div>
    <div class="shortcut-row"><span>Generate content</span><div class="shortcut-keys"><kbd>G</kbd> then <kbd>E</kbd></div></div>
    <div class="shortcut-row"><span>Content library</span><div class="shortcut-keys"><kbd>G</kbd> then <kbd>C</kbd></div></div>
    <div class="shortcut-row"><span>Publish settings</span><div class="shortcut-keys"><kbd>G</kbd> then <kbd>P</kbd></div></div>
    <div class="shortcut-row"><span>Brand profile</span><div class="shortcut-keys"><kbd>G</kbd> then <kbd>B</kbd></div></div>
    <div class="shortcut-row"><span>Site audit</span><div class="shortcut-keys"><kbd>G</kbd> then <kbd>A</kbd></div></div>
    <div class="shortcut-row"><span>Toggle dark mode</span><div class="shortcut-keys"><kbd>Shift</kbd> + <kbd>D</kbd></div></div>
    <div class="shortcut-row"><span>Show this panel</span><div class="shortcut-keys"><kbd>?</kbd></div></div>
  </div>
</div>`,
  'All overlay modals HTML (upgrade + edit post + shortcuts)');

// ══════════════════════════════════════════════════════════════════
// 5. DASHBOARD — trial banner + onboarding checklist at top
// ══════════════════════════════════════════════════════════════════
rep(
`    <div class="view active" id="view-dashboard">
      <div class="grid-4 gap-20">`,
`    <div class="view active" id="view-dashboard">
      <div id="trial-banner-wrap"></div>
      <div id="onboarding-checklist" style="display:none" class="setup-checklist">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4)">⚡ Setup checklist</span>
          <button class="btn btn-ghost" onclick="document.getElementById('onboarding-checklist').style.display='none'" style="font-size:11px;padding:3px 10px">Dismiss</button>
        </div>
        <div class="setup-step" id="step-wp"><div class="setup-step-icon">✓</div><span>Connect your WordPress site</span><a href="#" onclick="nav(null,'publish');return false" style="margin-left:auto;font-size:12px;color:var(--amber)">Go →</a></div>
        <div class="setup-step" id="step-audit"><div class="setup-step-icon">✓</div><span>Run your first site audit</span><a href="#" onclick="nav(null,'audit');return false" style="margin-left:auto;font-size:12px;color:var(--amber)">Go →</a></div>
        <div class="setup-step" id="step-post"><div class="setup-step-icon">✓</div><span>Publish your first AI post</span><a href="#" onclick="nav(null,'engine');return false" style="margin-left:auto;font-size:12px;color:var(--amber)">Go →</a></div>
        <div class="setup-step" id="step-kw"><div class="setup-step-icon">✓</div><span>Track at least 5 keywords in Rank Tracker</span><a href="#" onclick="nav(null,'ranks');return false" style="margin-left:auto;font-size:12px;color:var(--amber)">Go →</a></div>
      </div>
      <div class="grid-4 gap-20">`,
  'Dashboard trial banner + onboarding checklist');

// ══════════════════════════════════════════════════════════════════
// 6. DASHBOARD HEADER — add PDF export button
// ══════════════════════════════════════════════════════════════════
rep(
`      <div class="section-hd" style="margin-top:0"><h2>Recent content</h2><button class="btn btn-ghost" onclick="nav(null,'posts')">View all</button></div>`,
`      <div class="section-hd" style="margin-top:0"><h2>Recent content</h2><div style="display:flex;gap:8px"><button class="btn btn-ghost" onclick="generatePDFReport()" style="font-size:12px">↓ Export report</button><button class="btn btn-ghost" onclick="nav(null,'posts')">View all</button></div></div>`,
  'Dashboard PDF export button');

// ══════════════════════════════════════════════════════════════════
// 7. GENERATE — content template chips before keyword input
// ══════════════════════════════════════════════════════════════════
rep(
`        <div class="card">
          <div style="margin-bottom:20px">
            <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);display:block;margin-bottom:8px">Target keyword or topic</label>`,
`        <div class="card">
          <div style="margin-bottom:16px">
            <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);display:block;margin-bottom:8px">Content type</label>
            <div style="display:flex;gap:8px;flex-wrap:wrap" id="template-chips">
              <div class="template-chip active" onclick="selectTemplate(this,'blog')" data-tpl="blog">Blog post</div>
              <div class="template-chip" onclick="selectTemplate(this,'listicle')" data-tpl="listicle">Listicle</div>
              <div class="template-chip" onclick="selectTemplate(this,'howto')" data-tpl="howto">How-to guide</div>
              <div class="template-chip" onclick="selectTemplate(this,'comparison')" data-tpl="comparison">Comparison</div>
              <div class="template-chip" onclick="selectTemplate(this,'faq')" data-tpl="faq">FAQ</div>
              <div class="template-chip" onclick="selectTemplate(this,'casestudy')" data-tpl="casestudy">Case study</div>
            </div>
          </div>
          <div style="margin-bottom:20px">
            <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);display:block;margin-bottom:8px">Target keyword or topic</label>`,
  'Generate page template selector');

// ══════════════════════════════════════════════════════════════════
// 8. GENERATE OUTPUT — SERP preview after meta desc stats
// ══════════════════════════════════════════════════════════════════
rep(
`        <!-- Editable post content -->
        <div class="card" style="padding:0;overflow:hidden">`,
`        <!-- SERP Preview -->
        <div class="card" style="padding:18px 20px" id="serp-preview-card">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:12px">Google SERP Preview</div>
          <div class="serp-char-row"><span style="min-width:108px">Title length</span><div class="serp-char-bar"><div class="serp-char-fill" id="serp-title-fill" style="width:0%;background:var(--sage)"></div></div><span id="serp-title-cnt" style="min-width:40px;text-align:right">0/60</span></div>
          <div class="serp-char-row" style="margin-bottom:12px"><span style="min-width:108px">Description</span><div class="serp-char-bar"><div class="serp-char-fill" id="serp-desc-fill" style="width:0%;background:var(--amber)"></div></div><span id="serp-desc-cnt" style="min-width:40px;text-align:right">0/160</span></div>
          <div class="serp-preview-wrap">
            <div class="serp-url" id="serp-url-preview">yoursite.com › blog › post-slug</div>
            <span class="serp-title" id="serp-title-preview">Your post title will appear here</span>
            <div class="serp-desc" id="serp-desc-preview">Your meta description will appear here — make it compelling and under 160 characters.</div>
          </div>
        </div>
        <!-- Editable post content -->
        <div class="card" style="padding:0;overflow:hidden">`,
  'Generate SERP preview');

// ══════════════════════════════════════════════════════════════════
// 9. CONTENT LIST — bulk action bar before table
// ══════════════════════════════════════════════════════════════════
rep(
`      <!-- List view -->
      <div id="content-list-view">`,
`      <div id="bulk-action-bar" class="bulk-bar">
        <span id="bulk-count" style="font-size:12px;font-weight:600;color:var(--ink3)">0 selected</span>
        <button class="btn btn-ghost" onclick="bulkGrade()" style="font-size:12px;padding:5px 12px">Grade selected ✦</button>
        <button class="btn btn-ghost" onclick="bulkExportCSV()" style="font-size:12px;padding:5px 12px">Export CSV</button>
        <button class="btn btn-ghost" onclick="clearBulkSelection()" style="font-size:12px;padding:5px 12px;color:var(--ink4)">✕ Clear</button>
      </div>
      <!-- List view -->
      <div id="content-list-view">`,
  'Content list bulk action bar');

// ══════════════════════════════════════════════════════════════════
// 10. CONTENT LIST THEAD — add checkbox and Actions columns
// ══════════════════════════════════════════════════════════════════
rep(
`            <thead><tr style="background:var(--cream2);border-bottom:1px solid var(--border)">
              <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Status</th>`,
`            <thead><tr style="background:var(--cream2);border-bottom:1px solid var(--border)">
              <th style="padding:10px 8px 10px 16px;width:32px"><input type="checkbox" id="select-all-posts" class="content-check" onchange="toggleSelectAll(this)" /></th>
              <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Status</th>`,
  'Content list checkbox column in thead');

rep(
`              <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Source</th>
            </tr></thead>`,
`              <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Source</th>
              <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Actions</th>
            </tr></thead>`,
  'Content list Actions column in thead');

// ══════════════════════════════════════════════════════════════════
// 11. renderAllPosts — add checkbox + edit button to each row
// ══════════════════════════════════════════════════════════════════
rep(
`    return \`<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:10px 16px">\${statusBadge}</td>`,
`    const wpId = p.wpId || '';
    const postUrl = p.url || '';
    return \`<tr style="border-bottom:1px solid var(--border)" data-ts="\${p.ts}">
      <td style="padding:10px 8px 10px 16px"><input type="checkbox" class="content-check post-check" data-ts="\${p.ts}" onchange="updateBulkBar()" /></td>
      <td style="padding:10px 16px">\${statusBadge}</td>`,
  'renderAllPosts — add checkbox to rows');

rep(
`      <td style="padding:10px 16px">\${sourceBadge}</td>
    </tr>\`;`,
`      <td style="padding:10px 16px">\${sourceBadge}</td>
      <td style="padding:10px 12px;white-space:nowrap">
        <button class="btn btn-ghost" onclick="openEditPost('\${p.ts}',\`\${(p.title||'').replace(/\`/g,\\"'\\")}\`,\`\${(p.url||'')}\`,\`\${(p.wpId||'')}\`)" style="font-size:11px;padding:3px 10px">Edit</button>
        <button class="btn btn-ghost" onclick="document.getElementById('grader-url').value='\${p.url||p.title||''}';nav(null,'grader')" style="font-size:11px;padding:3px 10px;margin-left:4px">Grade</button>
      </td>
    </tr>\`;`,
  'renderAllPosts — add edit + grade buttons');

// ══════════════════════════════════════════════════════════════════
// 12. AUDIT VIEW — score history sparkline after audit results scores
// ══════════════════════════════════════════════════════════════════
rep(
`      <div id="audit-results" style="display:none">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">`,
`      <div id="audit-results" style="display:none">
        <div style="display:grid;grid-template-columns:1fr auto;gap:16px;align-items:start;margin-bottom:16px">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px" id="audit-score-cards">`,
  'Audit results — wrap scores for history layout');

rep(
`          <div class="card" style="text-align:center;padding:20px"><div style="font-size:28px;font-weight:800;color:var(--blue)" id="aud-pages">—</div><div style="font-size:12px;color:var(--ink4);margin-top:4px">Pages Checked</div></div>
        </div>
        <div class="card" style="padding:0;overflow:hidden">`,
`          <div class="card" style="text-align:center;padding:20px"><div style="font-size:28px;font-weight:800;color:var(--blue)" id="aud-pages">—</div><div style="font-size:12px;color:var(--ink4);margin-top:4px">Pages Checked</div></div>
          </div>
          <div class="card" style="padding:18px 20px;min-width:140px">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:10px">Score history</div>
            <div class="score-sparkline" id="audit-score-history"></div>
            <div style="font-size:10px;color:var(--ink4);margin-top:6px;text-align:center" id="audit-history-label">No history yet</div>
          </div>
        </div>
        <div class="card" style="padding:0;overflow:hidden">`,
  'Audit results — score history sparkline');

// ══════════════════════════════════════════════════════════════════
// 13. runAudit — save score to history after saving to cruise_last_audit
// ══════════════════════════════════════════════════════════════════
rep(
`    localStorage.setItem('cruise_last_audit', JSON.stringify({ health_score: d.health_score, ts: new Date().toISOString() }));`,
`    localStorage.setItem('cruise_last_audit', JSON.stringify({ health_score: d.health_score, ts: new Date().toISOString() }));
    // Save to score history
    const audHist = JSON.parse(localStorage.getItem('cruise_audit_history') || '[]');
    audHist.push({ score: d.health_score, ts: new Date().toISOString() });
    if (audHist.length > 12) audHist.splice(0, audHist.length - 12);
    localStorage.setItem('cruise_audit_history', JSON.stringify(audHist));
    renderScoreHistory();`,
  'runAudit — save score to history');

// ══════════════════════════════════════════════════════════════════
// 14. runGenerate — update SERP preview after generating
// ══════════════════════════════════════════════════════════════════
rep(
`    document.getElementById('gen-meta-desc').textContent = post.meta_description;
    document.getElementById('gen-editor').innerHTML = post.content_html;

    showGenStep('output');`,
`    document.getElementById('gen-meta-desc').textContent = post.meta_description;
    document.getElementById('gen-editor').innerHTML = post.content_html;
    updateSerpPreview(post.title, post.meta_description);

    showGenStep('output');`,
  'runGenerate — update SERP preview after generation');

// ══════════════════════════════════════════════════════════════════
// 15. onEditorChange — also update SERP preview
// ══════════════════════════════════════════════════════════════════
rep(
`function onEditorChange() {
  if (!generatedPostData) return;
  const html = document.getElementById('gen-editor').innerHTML;
  const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);
  document.getElementById('gen-word-count').textContent = wordCount.toLocaleString();`,
`function onEditorChange() {
  if (!generatedPostData) return;
  const html = document.getElementById('gen-editor').innerHTML;
  const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);
  document.getElementById('gen-word-count').textContent = wordCount.toLocaleString();
  // Update SERP preview with current title
  const titleEl = document.getElementById('gen-post-title-display');
  const metaEl = document.getElementById('gen-meta-desc');
  if (titleEl && metaEl) updateSerpPreview(titleEl.textContent, metaEl.textContent);`,
  'onEditorChange — update SERP preview');

// ══════════════════════════════════════════════════════════════════
// 16. initNewFeatures — add init calls for new features
// ══════════════════════════════════════════════════════════════════
rep(
`  renderAutoPublish();
  initAutopilot();
  initNewFeatures();
  renderProfile();`,
`  renderAutoPublish();
  initAutopilot();
  initNewFeatures();
  initTrialSystem();
  initKeyboardShortcuts();
  renderProfile();`,
  'initNewFeatures — call new init functions');

// ══════════════════════════════════════════════════════════════════
// 17. nav() — render score history + onboarding checklist when navigating
// ══════════════════════════════════════════════════════════════════
rep(
`  if (id === 'profile') { renderProfile(); loadProfileView(); }`,
`  if (id === 'profile') { renderProfile(); loadProfileView(); }
  if (id === 'audit') { renderScoreHistory(); }
  if (id === 'dashboard') { renderOnboardingChecklist(); }`,
  'nav() — trigger score history and onboarding on nav');

// ══════════════════════════════════════════════════════════════════
// 18. NEW JS FUNCTIONS — appended before closing </script>
// ══════════════════════════════════════════════════════════════════
rep(
`function approvePost() {`,
`// ══ DARK MODE ══════════════════════════════════════════════════════
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('cruise_dark', isDark ? '1' : '0');
  const btn = document.getElementById('dark-mode-btn');
  if (btn) btn.textContent = isDark ? '☀' : '☽';
}

// ══ KEYBOARD SHORTCUTS ════════════════════════════════════════════
function showShortcutsModal() {
  document.getElementById('shortcuts-modal').classList.add('open');
}

let _kbPrev = '';
function initKeyboardShortcuts() {
  // Restore dark mode preference
  if (localStorage.getItem('cruise_dark') === '1') {
    document.body.classList.add('dark');
    const btn = document.getElementById('dark-mode-btn');
    if (btn) btn.textContent = '☀';
  }
  document.addEventListener('keydown', e => {
    const tag = document.activeElement ? document.activeElement.tagName : '';
    if (['INPUT','TEXTAREA','SELECT'].includes(tag) || document.activeElement.isContentEditable) {
      _kbPrev = ''; return;
    }
    const key = e.key.toLowerCase();
    if (key === '?' || (e.shiftKey && key === '/')) { e.preventDefault(); showShortcutsModal(); _kbPrev = ''; return; }
    if (e.shiftKey && key === 'd') { e.preventDefault(); toggleDarkMode(); _kbPrev = ''; return; }
    if (_kbPrev === 'g') {
      e.preventDefault();
      if (key === 'd') nav(null, 'dashboard');
      if (key === 'e') nav(null, 'engine');
      if (key === 'c') nav(null, 'posts');
      if (key === 'p') nav(null, 'publish');
      if (key === 'b') nav(null, 'profile');
      if (key === 'a') nav(null, 'audit');
      _kbPrev = '';
      return;
    }
    if (key === 'escape') { closeUpgradeModal(); closeEditPost(); document.getElementById('shortcuts-modal').classList.remove('open'); }
    _kbPrev = key;
    setTimeout(() => { _kbPrev = ''; }, 1000);
  });
}

// ══ TRIAL / PLAN SYSTEM ════════════════════════════════════════════
function initTrialSystem() {
  let plan = JSON.parse(localStorage.getItem('cruise_plan') || 'null');
  if (!plan) {
    plan = { type: 'trial', start: Date.now() };
    localStorage.setItem('cruise_plan', JSON.stringify(plan));
  }
  renderTrialBanner(plan);
  renderOnboardingChecklist();
}

function renderTrialBanner(plan) {
  const wrap = document.getElementById('trial-banner-wrap');
  if (!plan || !wrap) return;
  if (plan.type === 'pro') { wrap.innerHTML = ''; return; }
  const daysLeft = Math.max(0, 14 - Math.floor((Date.now() - plan.start) / 86400000));
  wrap.innerHTML = \`<div class="trial-banner">
    <div style="font-size:13px;color:var(--ink2);line-height:1.5">
      <strong style="color:var(--amber-d)">\${daysLeft} days left</strong> on your free trial —
      <span style="color:var(--ink4)">50 AI posts included</span>
    </div>
    <button class="btn btn-primary" onclick="openUpgradeModal()" style="white-space:nowrap;font-size:12px;padding:7px 16px">Upgrade to Pro →</button>
  </div>\`;
}

function openUpgradeModal() { document.getElementById('upgrade-modal').classList.add('open'); }
function closeUpgradeModal() { document.getElementById('upgrade-modal').classList.remove('open'); }
function activatePro() {
  const plan = { type: 'pro', start: Date.now() };
  localStorage.setItem('cruise_plan', JSON.stringify(plan));
  closeUpgradeModal();
  renderTrialBanner(plan);
  toast('Pro plan activated! Unlimited posts unlocked.', true);
}

function checkUsageLimit() {
  const plan = JSON.parse(localStorage.getItem('cruise_plan') || '{}');
  if (plan.type === 'pro') return true;
  const ap = JSON.parse(localStorage.getItem('cruise_ap_log') || '[]');
  const wp = JSON.parse(localStorage.getItem('cruise_wp_log') || '[]');
  const total = ap.length + wp.length;
  if (total >= 50) { openUpgradeModal(); return false; }
  return true;
}

// ══ ONBOARDING CHECKLIST ══════════════════════════════════════════
function renderOnboardingChecklist() {
  const el = document.getElementById('onboarding-checklist');
  if (!el) return;
  const hasWP = !!localStorage.getItem('cruise_wp_connection');
  const hasAudit = !!localStorage.getItem('cruise_last_audit');
  const hasPost = (JSON.parse(localStorage.getItem('cruise_wp_log') || '[]').length + JSON.parse(localStorage.getItem('cruise_ap_log') || '[]').length) > 0;
  const hasKw = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]').length >= 5;
  const steps = [
    { id: 'step-wp', done: hasWP },
    { id: 'step-audit', done: hasAudit },
    { id: 'step-post', done: hasPost },
    { id: 'step-kw', done: hasKw }
  ];
  steps.forEach(s => {
    const stepEl = document.getElementById(s.id);
    if (!stepEl) return;
    stepEl.classList.toggle('done', s.done);
    const icon = stepEl.querySelector('.setup-step-icon');
    if (icon) icon.textContent = s.done ? '✓' : '';
  });
  const allDone = steps.every(s => s.done);
  el.style.display = allDone ? 'none' : '';
}

// ══ CONTENT TEMPLATES ══════════════════════════════════════════════
let selectedTemplate = 'blog';
function selectTemplate(el, type) {
  selectedTemplate = type;
  document.querySelectorAll('#template-chips .template-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
}

// Template-aware prompt injection is handled in runGenerate via selectedTemplate var
// (runGenerate already reads selectedTemplate — this function just sets the UI state)

// ══ SERP PREVIEW ══════════════════════════════════════════════════
function updateSerpPreview(title, desc) {
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  const domain = wp.url ? wp.url.replace(/https?:\\/\\//, '').replace(/\\/$/, '') : 'yoursite.com';
  const slug = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const titleEl = document.getElementById('serp-title-preview');
  const urlEl = document.getElementById('serp-url-preview');
  const descEl = document.getElementById('serp-desc-preview');
  const titleFill = document.getElementById('serp-title-fill');
  const descFill = document.getElementById('serp-desc-fill');
  const titleCnt = document.getElementById('serp-title-cnt');
  const descCnt = document.getElementById('serp-desc-cnt');
  if (titleEl) titleEl.textContent = (title || '').slice(0, 60) || 'Your post title will appear here';
  if (urlEl) urlEl.textContent = domain + ' › blog › ' + (slug.slice(0, 40) || 'post-slug');
  if (descEl) descEl.textContent = (desc || '').slice(0, 160) || 'Your meta description will appear here.';
  const tLen = (title || '').length; const dLen = (desc || '').length;
  if (titleFill) { titleFill.style.width = Math.min(100, (tLen / 60) * 100) + '%'; titleFill.style.background = tLen > 60 ? '#C0304F' : tLen > 50 ? 'var(--sage)' : 'var(--amber)'; }
  if (descFill) { descFill.style.width = Math.min(100, (dLen / 160) * 100) + '%'; descFill.style.background = dLen > 160 ? '#C0304F' : dLen > 130 ? 'var(--sage)' : 'var(--amber)'; }
  if (titleCnt) titleCnt.textContent = tLen + '/60';
  if (descCnt) descCnt.textContent = dLen + '/160';
}

// ══ AUDIT SCORE HISTORY ═══════════════════════════════════════════
function renderScoreHistory() {
  const el = document.getElementById('audit-score-history');
  const label = document.getElementById('audit-history-label');
  if (!el) return;
  const hist = JSON.parse(localStorage.getItem('cruise_audit_history') || '[]');
  if (!hist.length) { el.innerHTML = ''; if(label) label.textContent = 'No history yet'; return; }
  const max = Math.max(...hist.map(h => h.score), 1);
  el.innerHTML = hist.map(h => {
    const pct = Math.max(5, Math.round((h.score / 100) * 100));
    const date = new Date(h.ts).toLocaleDateString('en-GB', {day:'numeric',month:'short'});
    return \`<div class="score-spark-bar" style="height:\${pct}%" data-tip="\${h.score}/100 · \${date}"></div>\`;
  }).join('');
  if (label) label.textContent = hist.length + ' audit' + (hist.length !== 1 ? 's' : '') + ' recorded';
}

// ══ BULK ACTIONS ══════════════════════════════════════════════════
let selectedPostTs = new Set();

function toggleSelectAll(checkbox) {
  const checks = document.querySelectorAll('.post-check');
  checks.forEach(c => { c.checked = checkbox.checked; const ts = c.getAttribute('data-ts'); if (ts) checkbox.checked ? selectedPostTs.add(ts) : selectedPostTs.delete(ts); });
  updateBulkBar();
}

function updateBulkBar() {
  selectedPostTs = new Set();
  document.querySelectorAll('.post-check:checked').forEach(c => { const ts = c.getAttribute('data-ts'); if (ts) selectedPostTs.add(ts); });
  const bar = document.getElementById('bulk-action-bar');
  const cnt = document.getElementById('bulk-count');
  if (bar) bar.classList.toggle('visible', selectedPostTs.size > 0);
  if (cnt) cnt.textContent = selectedPostTs.size + ' selected';
}

function clearBulkSelection() {
  selectedPostTs = new Set();
  document.querySelectorAll('.post-check, #select-all-posts').forEach(c => c.checked = false);
  const bar = document.getElementById('bulk-action-bar');
  if (bar) bar.classList.remove('visible');
}

function bulkGrade() {
  if (!selectedPostTs.size) return;
  const posts = getAllPublishedPosts().filter(p => selectedPostTs.has(p.ts));
  const first = posts[0];
  if (!first) return;
  const target = first.url || first.title || '';
  document.getElementById('grader-url').value = target;
  nav(null, 'grader');
  clearBulkSelection();
  toast('Grading first selected post — open the others manually', true);
}

function bulkExportCSV() {
  const posts = getAllPublishedPosts().filter(p => selectedPostTs.has(p.ts));
  if (!posts.length) return;
  const rows = [['Title','URL','Status','Date','SEO Score']];
  posts.forEach(p => {
    const date = new Date(p.ts).toLocaleDateString('en-GB');
    rows.push([
      (p.title || '').replace(/,/g,''),
      p.url || '',
      p.status === 'ok' ? 'Live' : 'Failed',
      date,
      p.seoScore || '—'
    ]);
  });
  const csv = rows.map(r => r.join(',')).join('\\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cruise-seo-export.csv'; a.click();
  clearBulkSelection();
  toast('Exported ' + posts.length + ' posts to CSV', true);
}

// ══ EDIT PUBLISHED POSTS ══════════════════════════════════════════
let _editPostTs = null;

function openEditPost(ts, title, url, wpId) {
  _editPostTs = ts;
  const titleInput = document.getElementById('edit-post-title');
  const contentArea = document.getElementById('edit-post-content');
  const statusEl = document.getElementById('edit-post-status');
  const wpIdEl = document.getElementById('edit-post-wp-id');
  const urlEl = document.getElementById('edit-post-post-url');
  if (titleInput) titleInput.value = title || '';
  if (contentArea) contentArea.value = 'Loading post content...';
  if (statusEl) statusEl.textContent = '';
  if (wpIdEl) wpIdEl.value = wpId || '';
  if (urlEl) urlEl.value = url || '';
  document.getElementById('edit-post-overlay').classList.add('open');
  // Try to load current content from WP
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  if (wp.url && wpId) {
    fetch('/api/wp-proxy', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ action: 'getpost', url: wp.url, username: wp.username, password: wp.password, postId: wpId })
    }).then(r => r.json()).then(d => {
      if (d.content && contentArea) contentArea.value = d.content;
    }).catch(() => { if (contentArea) contentArea.value = '<!-- Paste or write post content here -->'; });
  } else {
    if (contentArea) contentArea.value = '<!-- Paste or write post content here. WP post ID required to load automatically. -->';
  }
}

function closeEditPost() {
  document.getElementById('edit-post-overlay').classList.remove('open');
  _editPostTs = null;
}

async function saveEditPost() {
  const title = document.getElementById('edit-post-title').value.trim();
  const content = document.getElementById('edit-post-content').value.trim();
  const wpId = document.getElementById('edit-post-wp-id').value.trim();
  const statusEl = document.getElementById('edit-post-status');
  const saveBtn = document.getElementById('edit-post-save-btn');
  if (!title || !content) { toast('Title and content are required', false); return; }
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  if (!wp.url) { toast('Connect WordPress first', false); return; }
  if (!wpId) {
    if (statusEl) statusEl.innerHTML = '<span style="color:#C0304F">No WordPress post ID — cannot update. Re-publish as a new post instead.</span>';
    return;
  }
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Updating...'; }
  if (statusEl) statusEl.textContent = 'Sending to WordPress...';
  try {
    const r = await fetch('/api/wp-proxy', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ action: 'updatepost', url: wp.url, username: wp.username, password: wp.password, postId: wpId, title, content })
    });
    const d = await r.json();
    if (!r.ok || !d.ok) throw new Error(d.error || 'Update failed');
    if (statusEl) statusEl.innerHTML = \`<span style="color:var(--sage)">✓ Updated on WordPress — <a href="\${d.link || ''}" target="_blank" style="color:var(--amber)">view post ↗</a></span>\`;
    toast('Post updated on WordPress!', true);
  } catch(err) {
    if (statusEl) statusEl.innerHTML = \`<span style="color:#C0304F">Error: \${err.message}</span>\`;
  } finally {
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Update on WordPress ↑'; }
  }
}

// ══ PDF REPORT ════════════════════════════════════════════════════
function generatePDFReport() {
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const audit = JSON.parse(localStorage.getItem('cruise_last_audit') || '{}');
  const ap = JSON.parse(localStorage.getItem('cruise_ap_log') || '[]');
  const wp = JSON.parse(localStorage.getItem('cruise_wp_log') || '[]');
  const ranks = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  const allPosts = [...ap, ...wp].filter(p => p.title).sort((a,b) => new Date(b.ts) - new Date(a.ts));
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = allPosts.filter(p => new Date(p.ts) >= monthStart);
  const reportHTML = \`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cruise SEO Report — \${now.toLocaleDateString('en-GB',{month:'long',year:'numeric'})}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Arial',sans-serif;color:#1C1714;background:#fff;padding:40px;max-width:800px;margin:0 auto}
h1{font-size:28px;font-weight:700;margin-bottom:4px;color:#1C1714}h2{font-size:16px;font-weight:700;margin:28px 0 12px;padding-bottom:8px;border-bottom:2px solid #E8E2D6;color:#3D3830}
.meta{font-size:13px;color:#6B6458;margin-bottom:32px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
.stat-box{padding:16px;border:1px solid #E8E2D6;border-radius:8px;text-align:center}.stat-num{font-size:28px;font-weight:800;color:#4c94b2}
.stat-label{font-size:11px;color:#9B9088;margin-top:4px;text-transform:uppercase;letter-spacing:.06em}
table{width:100%;border-collapse:collapse;font-size:13px}th{background:#F2EFE8;padding:8px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#9B9088}
td{padding:10px 12px;border-bottom:1px solid #E8E2D6;color:#3D3830}.footer{margin-top:40px;font-size:11px;color:#9B9088;text-align:center;border-top:1px solid #E8E2D6;padding-top:16px}
@media print{body{padding:20px}.no-print{display:none}}</style></head><body>
<div class="no-print" style="background:#FFF3CD;border:1px solid #FFC107;border-radius:8px;padding:12px 16px;margin-bottom:24px;font-size:13px">Print or save as PDF: use your browser's print function (Ctrl/Cmd+P) and select "Save as PDF"</div>
<h1>SEO Performance Report</h1>
<div class="meta">\${brand.name || 'Your Business'} &nbsp;·&nbsp; \${now.toLocaleDateString('en-GB',{month:'long',year:'numeric'})} &nbsp;·&nbsp; Generated by Cruise SEO</div>
<div class="grid">
  <div class="stat-box"><div class="stat-num">\${allPosts.length}</div><div class="stat-label">Total Posts</div></div>
  <div class="stat-box"><div class="stat-num">\${thisMonth.length}</div><div class="stat-label">This Month</div></div>
  <div class="stat-box"><div class="stat-num" style="color:\${(audit.health_score||0)>=80?'#4A7C6F':'#4c94b2'}">\${audit.health_score || '—'}<span style="font-size:16px">/100</span></div><div class="stat-label">SEO Health</div></div>
  <div class="stat-box"><div class="stat-num">\${ranks.length}</div><div class="stat-label">Keywords Tracked</div></div>
</div>
<h2>Posts Published This Month</h2>
<table><thead><tr><th>Title</th><th>Status</th><th>Date</th></tr></thead><tbody>
\${thisMonth.length ? thisMonth.map(p => \`<tr><td>\${p.url ? \`<a href="\${p.url}" style="color:#4c94b2">\${p.title}</a>\` : p.title}</td><td>\${p.status==='ok'?'Live':'Failed'}</td><td>\${new Date(p.ts).toLocaleDateString('en-GB')}</td></tr>\`).join('') : '<tr><td colspan="3" style="color:#9B9088;font-style:italic">No posts published this month</td></tr>'}
</tbody></table>
\${ranks.length ? \`<h2>Tracked Keywords (\${ranks.length})</h2>
<table><thead><tr><th>Keyword</th><th>Est. Position</th><th>Opportunity</th></tr></thead><tbody>
\${ranks.map(r => \`<tr><td>\${r.keyword}</td><td>\${r.estimated_position || '—'}</td><td>\${r.opportunity || '—'}</td></tr>\`).join('')}
</tbody></table>\` : ''}
<div class="footer">Generated by Cruise SEO · cruiseseo.site · \${now.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
</body></html>\`;
  const w = window.open('', '_blank');
  if (w) { w.document.write(reportHTML); w.document.close(); w.focus(); setTimeout(() => w.print(), 500); }
  else toast('Allow pop-ups to generate the PDF report', false);
}

function approvePost() {`,
  'All new JS functions (dark mode, shortcuts, trial, templates, SERP, history, bulk, edit, PDF)');

// ══════════════════════════════════════════════════════════════════
// Write output
// ══════════════════════════════════════════════════════════════════
fs.writeFileSync(p, c.replace(/\n/g, '\r\n'), 'utf8');
console.log(`\nDone — ${hits} replacements applied. Lines: ${c.split('\n').length}`);
