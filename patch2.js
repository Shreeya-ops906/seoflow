const fs = require('fs');
const p = 'C:/Users/Shreeya/AppData/Local/Temp/seoflow/app.html';

// Read file and normalize to LF for reliable string matching
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

const orig = c;
let changed = 0;

function replace(search, replacement, label) {
  if (!c.includes(search)) {
    console.log('MISS: ' + label);
    return;
  }
  c = c.replace(search, replacement);
  console.log('OK:   ' + label);
  changed++;
}

function replaceRE(regex, replacement, label) {
  if (!regex.test(c)) {
    console.log('MISS: ' + label);
    return;
  }
  c = c.replace(regex, replacement);
  console.log('OK:   ' + label);
  changed++;
}

// ── 1. FIX DOM NESTING BUG ──
replace(
  '      </div>\n\n\n    <div class="view" id="view-engine">',
  '      </div>\n    </div><!-- /view-keywords -->\n\n    <div class="view" id="view-engine">',
  'DOM nesting fix'
);

// ── 2. ADD MOBILE CSS ──
replace(
  '::-webkit-scrollbar-thumb{background:var(--cream3);border-radius:3px}\n</style>',
  `::-webkit-scrollbar-thumb{background:var(--cream3);border-radius:3px}

/* MOBILE */
.hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:6px;border:none;background:none}
.hamburger span{display:block;width:20px;height:2px;background:var(--ink);border-radius:2px;transition:.3s}
.sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:99}
@media(max-width:768px){
  body{overflow:auto}
  .sidebar{position:fixed;left:-240px;z-index:100;transition:left .3s;height:100vh}
  .sidebar.open{left:0}
  .sidebar-overlay.open{display:block}
  .hamburger{display:flex}
  .main{width:100%;min-width:0}
  .grid-4{grid-template-columns:repeat(2,1fr)}
  .grid-2{grid-template-columns:1fr}
  .pub-grid{grid-template-columns:1fr 1fr}
  .topbar{padding:12px 16px}
  .content{padding:16px}
}
</style>`,
  'Mobile CSS'
);

// ── 3. ADD HAMBURGER BUTTON to topbar ──
replace(
  '    <div class="topbar-breadcrumb">',
  '    <button class="hamburger" onclick="toggleSidebar()" aria-label="Menu"><span></span><span></span><span></span></button>\n    <div class="topbar-breadcrumb">',
  'Hamburger button'
);

// ── 4. ADD SIDEBAR OVERLAY ──
replace(
  '</aside>\n\n<!-- MAIN -->',
  '</aside>\n<div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>\n\n<!-- MAIN -->',
  'Sidebar overlay'
);

// ── 5. ADD RANK TRACKER NAV ITEM ──
replace(
  `      <div class="nav-item" onclick="nav(this,'social')">
        <div class="nav-dot"></div>
        <svg viewBox="0 0 16 16"><circle cx="12" cy="4" r="2"/><circle cx="4" cy="8" r="2"/><circle cx="12" cy="12" r="2"/><path d="M6 7l4-2M6 9l4 2"/></svg>
        Social Snippets
      </div>
    </div>`,
  `      <div class="nav-item" onclick="nav(this,'social')">
        <div class="nav-dot"></div>
        <svg viewBox="0 0 16 16"><circle cx="12" cy="4" r="2"/><circle cx="4" cy="8" r="2"/><circle cx="12" cy="12" r="2"/><path d="M6 7l4-2M6 9l4 2"/></svg>
        Social Snippets
      </div>
      <div class="nav-item" onclick="nav(this,'ranks')">
        <div class="nav-dot"></div>
        <svg viewBox="0 0 16 16"><path d="M2 13V7l4-3 4 4 4-6"/><circle cx="14" cy="4" r="1.5"/></svg>
        Rank Tracker
      </div>
    </div>`,
  'Rank Tracker nav item'
);

// ── 6. REBUILD PROFILE VIEW + ADD RANK TRACKER VIEW ──
replace(
  `    <!-- PROFILE -->
    <div class="view" id="view-profile">
      <div class="section-hd">
        <h2 id="profName">Brand Profile</h2>
        <button class="btn btn-ghost" onclick="toast('Edit profile opens in onboarding — coming in next session',true)">Edit profile</button>
      </div>
      <div class="grid-2 gap-14" id="profileGrid"></div>
    </div>`,
  `    <!-- PROFILE -->
    <div class="view" id="view-profile">
      <div class="section-hd">
        <h2 id="profName">Brand Profile</h2>
        <button class="btn btn-primary" onclick="saveProfile()">Save changes</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px" id="profileGrid">
        <div class="card">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:10px">Business name</div>
          <input class="kw-input" id="prof-name" style="width:100%" placeholder="Your business name">
        </div>
        <div class="card">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:10px">Industry</div>
          <input class="kw-input" id="prof-industry" style="width:100%" placeholder="e.g. Tutoring, Marketing, Law">
        </div>
        <div class="card">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:10px">Target audience</div>
          <input class="kw-input" id="prof-audience" style="width:100%" placeholder="e.g. Parents of GCSE students">
        </div>
        <div class="card">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:10px">Booking / Contact URL</div>
          <input class="kw-input" id="prof-booking" style="width:100%" placeholder="https://yoursite.com/book">
        </div>
        <div class="card" style="grid-column:1/-1">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:10px">Writing tone</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap" id="prof-tone-chips">
            <div class="tone-chip" onclick="selectProfileTone(this,'authoritative')">Authoritative</div>
            <div class="tone-chip" onclick="selectProfileTone(this,'friendly')">Friendly</div>
            <div class="tone-chip" onclick="selectProfileTone(this,'educational')">Educational</div>
            <div class="tone-chip" onclick="selectProfileTone(this,'conversational')">Conversational</div>
            <div class="tone-chip" onclick="selectProfileTone(this,'professional')">Professional</div>
          </div>
        </div>
        <div class="card" style="grid-column:1/-1">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:10px">Brand keywords <span style="font-weight:400;text-transform:none">(comma separated)</span></div>
          <input class="kw-input" id="prof-keywords" style="width:100%" placeholder="e.g. tutoring, 11+ exam, GCSE revision">
        </div>
        <div class="card" style="grid-column:1/-1">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:8px">Connected WordPress site</div>
          <div style="font-size:13px;color:var(--ink3)" id="prof-wp-site">No WordPress site connected</div>
        </div>
      </div>
    </div>

    <!-- RANK TRACKER -->
    <div class="view" id="view-ranks">
      <div class="section-hd">
        <h2>Rank Tracker</h2>
        <button class="btn btn-primary" onclick="estimateRankings()">Refresh estimates ✦</button>
      </div>
      <div class="card" style="margin-bottom:16px">
        <div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:10px">Track keywords</div>
        <div style="display:flex;gap:10px">
          <input class="kw-input" id="rank-input" placeholder="Add keywords to track (comma separated)..." style="flex:1;font-size:14px;padding:11px 14px">
          <button class="btn btn-primary" onclick="addTrackKeywords()" style="white-space:nowrap">Add ✦</button>
        </div>
      </div>
      <div id="rank-loading" style="display:none;padding:40px;text-align:center"><div class="gen-spinner"></div><div style="margin-top:16px;color:var(--ink4);font-size:14px">Estimating rankings with AI...</div></div>
      <div id="rank-results">
        <div class="card" style="padding:0;overflow:hidden">
          <table style="width:100%;border-collapse:collapse">
            <thead><tr style="background:var(--cream2);border-bottom:1px solid var(--border)">
              <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Keyword</th>
              <th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Est. Position</th>
              <th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Change</th>
              <th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Difficulty</th>
              <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Opportunity</th>
            </tr></thead>
            <tbody id="rank-table-body">
              <tr><td colspan="5" style="padding:28px;text-align:center;color:var(--ink4);font-size:13px">Add keywords above to start tracking</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>`,
  'Profile view + Rank Tracker view'
);

// ── 7. ADD SEO HEALTH WIDGET + QUICK ACTIONS to dashboard ──
replace(
  `      <div class="section-hd"><h2>Recent content</h2><button class="btn btn-ghost" onclick="nav(null,'posts')">View all</button></div>`,
  `      <div style="display:grid;grid-template-columns:1fr auto;gap:12px;align-items:start;margin:24px 0 14px">
        <div class="card" id="seo-health-widget" style="padding:16px 20px;display:flex;align-items:center;gap:16px">
          <div style="text-align:center;min-width:60px">
            <div style="font-size:28px;font-weight:900;font-family:var(--font-serif)" id="health-score-val">—</div>
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">SEO Health</div>
          </div>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:4px" id="health-score-label">Run a site audit to see your score</div>
            <div style="font-size:11px;color:var(--ink4)" id="health-score-ts"></div>
          </div>
          <button class="btn btn-ghost" onclick="nav(null,'audit')" style="font-size:12px;white-space:nowrap">Run audit →</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn btn-primary" onclick="nav(null,'engine')" style="white-space:nowrap;justify-content:center">✦ Generate post</button>
          <button class="btn btn-ghost" onclick="nav(null,'audit')" style="white-space:nowrap;justify-content:center">◈ Site audit</button>
          <button class="btn btn-ghost" onclick="nav(null,'keywords')" style="white-space:nowrap;justify-content:center">⌕ Research</button>
        </div>
      </div>
      <div class="section-hd" style="margin-top:0"><h2>Recent content</h2><button class="btn btn-ghost" onclick="nav(null,'posts')">View all</button></div>`,
  'Health widget + quick actions'
);

// ── 8. WIRE injectSEOMeta ──
replace(
  `    addWPLog(generatedPostData.title, wp.url, 'ok');\n    toast('Post published live!', true);`,
  `    addWPLog(generatedPostData.title, wp.url, 'ok');
    toast('Post published live!', true);
    if (post.id) {
      injectSEOMeta(wp.url, wp.username, atob(wp.password), post.id, generatedPostData.title, generatedPostData.content_html);
    }`,
  'Wire injectSEOMeta'
);

// ── 9. SAVE AUDIT SCORE ──
replace(
  `    results.style.display = '';\n  } catch(e) { toast('Audit error: ' + e.message, false); }`,
  `    localStorage.setItem('cruise_last_audit', JSON.stringify({ health_score: d.health_score, ts: new Date().toISOString() }));
    results.style.display = '';
    loadDashHealth();
  } catch(e) { toast('Audit error: ' + e.message, false); }`,
  'Save audit score'
);

// ── 10. FIX updateStats ──
replaceRE(
  /function updateStats\(\) \{[\s\S]*?document\.getElementById\('stHours'\)[\s\S]*?\n\}/,
  `function updateStats() {\n  // stPublished managed by renderDashQueue() reflecting live WP posts\n}`,
  'Fix updateStats'
);

// ── 11. FIX nav() function (last definition, ~line 2793) ──
replace(
  `  if (id === 'profile') renderProfile();\n  if (id === 'dashboard') renderDashPosts();\n  if (id === 'posts') renderAllPosts();\n  if (id === 'publish') renderPublish();\n}`,
  `  if (id === 'profile') { renderProfile(); loadProfileView(); }
  if (id === 'dashboard') { renderDashQueue(); loadDashHealth(); }
  if (id === 'posts') renderAllPosts();
  if (id === 'publish') renderPublish();
  if (id === 'ranks') loadRankTracker();
  if (window.innerWidth <= 768) closeSidebar();
}`,
  'Fix nav() function'
);

// ── 12. UPDATE initNewFeatures ──
replace(
  `function initNewFeatures() {\n  renderDashQueue();\n  syncWPPostsToLog();`,
  `function initNewFeatures() {\n  renderDashQueue();\n  syncWPPostsToLog();\n  loadDashHealth();`,
  'Update initNewFeatures'
);

// ── 13. ADD ALL NEW JS FUNCTIONS ──
const newFunctions = `
// ── Profile view functions ──────────────────────────────────────
function loadProfileView() {
  if (!brand) return;
  const nameEl = document.getElementById('prof-name');
  const indEl = document.getElementById('prof-industry');
  const audEl = document.getElementById('prof-audience');
  const bookEl = document.getElementById('prof-booking');
  const kwEl = document.getElementById('prof-keywords');
  const wpEl = document.getElementById('prof-wp-site');
  if (nameEl) nameEl.value = brand.name || '';
  if (indEl) indEl.value = brand.industry || '';
  if (audEl) audEl.value = brand.idealCustomer || '';
  if (bookEl) bookEl.value = brand.bookingUrl || brand.booking_url || '';
  if (kwEl) kwEl.value = (brand.keywords || []).join(', ');
  const tone = brand.tone || 'conversational';
  document.querySelectorAll('#prof-tone-chips .tone-chip').forEach(chip => {
    chip.classList.toggle('on', chip.textContent.toLowerCase() === tone);
  });
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  if (wpEl) wpEl.textContent = wp.url || 'No WordPress site connected';
}

function selectProfileTone(el, tone) {
  document.querySelectorAll('#prof-tone-chips .tone-chip').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
}

async function saveProfile() {
  const nameVal = document.getElementById('prof-name')?.value?.trim();
  const indVal = document.getElementById('prof-industry')?.value?.trim();
  const audVal = document.getElementById('prof-audience')?.value?.trim();
  const bookVal = document.getElementById('prof-booking')?.value?.trim();
  const kwVal = document.getElementById('prof-keywords')?.value?.trim();
  const toneEl = document.querySelector('#prof-tone-chips .tone-chip.on');
  const toneVal = toneEl ? toneEl.textContent.toLowerCase() : (brand.tone || 'conversational');
  brand.name = nameVal || brand.name;
  brand.industry = indVal || brand.industry;
  brand.idealCustomer = audVal || brand.idealCustomer;
  brand.bookingUrl = bookVal;
  brand.booking_url = bookVal;
  brand.keywords = kwVal ? kwVal.split(',').map(s => s.trim()).filter(Boolean) : brand.keywords;
  brand.tone = toneVal;
  try { await window.storage.set('brand-profile', JSON.stringify(brand)); } catch(e) {}
  localStorage.setItem('seoflow_brand', JSON.stringify(brand));
  localStorage.setItem('cruise_brand', JSON.stringify(brand));
  applyBrand();
  document.getElementById('profName').textContent = brand.name;
  toast('Profile saved!', true);
}

// ── SEO Health Widget ───────────────────────────────────────────
function loadDashHealth() {
  const raw = localStorage.getItem('cruise_last_audit');
  if (!raw) return;
  try {
    const audit = JSON.parse(raw);
    const score = audit.health_score;
    const scoreEl = document.getElementById('health-score-val');
    const labelEl = document.getElementById('health-score-label');
    const tsEl = document.getElementById('health-score-ts');
    if (!scoreEl) return;
    scoreEl.textContent = score + '/100';
    scoreEl.style.color = score >= 80 ? 'var(--sage)' : score >= 60 ? 'var(--amber)' : '#C0304F';
    if (labelEl) labelEl.textContent = score >= 80 ? 'Site is in great SEO health' : score >= 60 ? 'A few issues to fix' : 'Site needs SEO attention';
    if (tsEl && audit.ts) {
      const d = new Date(audit.ts);
      tsEl.textContent = 'Last audit: ' + d.toLocaleDateString('en-GB', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
    }
  } catch(e) {}
}

// ── Rank Tracker ────────────────────────────────────────────────
function loadRankTracker() {
  const saved = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  if (saved.length) renderRankTable(saved);
}

function addTrackKeywords() {
  const input = document.getElementById('rank-input');
  const val = input?.value?.trim();
  if (!val) return;
  const kws = val.split(',').map(s => s.trim()).filter(Boolean);
  const saved = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  kws.forEach(kw => {
    if (!saved.find(r => r.keyword.toLowerCase() === kw.toLowerCase())) {
      saved.push({ keyword: kw, position: null, change: 0, difficulty: '\u2014', opportunity: '\u2014', ts: null });
    }
  });
  localStorage.setItem('cruise_rank_history', JSON.stringify(saved));
  if (input) input.value = '';
  renderRankTable(saved);
  estimateRankings();
}

async function estimateRankings() {
  const saved = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  if (!saved.length) { toast('Add keywords to track first', false); return; }
  const loading = document.getElementById('rank-loading');
  if (loading) loading.style.display = '';
  try {
    const kwList = saved.map(r => r.keyword).join(', ');
    const site = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}').url || 'your site';
    const prompt = 'You are an SEO expert. For ' + site + ', estimate Google positions for: ' + kwList + '. Return ONLY JSON array: [{"keyword":"...","estimated_position":15,"difficulty_score":45,"opportunity":"high"}]';
    const raw = await callAI(prompt, 1500);
    const estimates = JSON.parse(raw);
    const updated = saved.map(r => {
      const est = estimates.find(e => e.keyword.toLowerCase() === r.keyword.toLowerCase()) || {};
      const prevPos = r.position;
      const newPos = est.estimated_position || null;
      return { ...r, position: newPos, change: (prevPos && newPos) ? prevPos - newPos : 0, difficulty: est.difficulty_score ? est.difficulty_score + '/100' : '\u2014', opportunity: est.opportunity || '\u2014', ts: new Date().toISOString() };
    });
    localStorage.setItem('cruise_rank_history', JSON.stringify(updated));
    renderRankTable(updated);
    toast('Rankings updated!', true);
  } catch(e) { toast('Estimate failed: ' + e.message, false); }
  if (loading) loading.style.display = 'none';
}

function renderRankTable(data) {
  const tbody = document.getElementById('rank-table-body');
  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="padding:28px;text-align:center;color:var(--ink4);font-size:13px">Add keywords above to start tracking</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(r => {
    const pos = r.position ? '#' + r.position : '\u2014';
    const posColor = !r.position ? 'var(--ink4)' : r.position <= 10 ? 'var(--sage)' : r.position <= 30 ? 'var(--amber)' : 'var(--ink3)';
    const chg = r.change > 0 ? '<span style="color:var(--sage)">\u25b2 ' + r.change + '</span>' : r.change < 0 ? '<span style="color:#C0304F">\u25bc ' + Math.abs(r.change) + '</span>' : '<span style="color:var(--ink4)">\u2014</span>';
    const opp = r.opportunity === 'high' ? '<span style="color:var(--sage)">High</span>' : r.opportunity === 'medium' ? '<span style="color:var(--amber)">Medium</span>' : '<span style="color:var(--ink4)">' + r.opportunity + '</span>';
    return '<tr style="border-bottom:1px solid var(--border)"><td style="padding:12px 16px;font-size:13px;font-weight:600">' + r.keyword + '</td><td style="padding:12px 16px;text-align:center;font-size:18px;font-weight:900;font-family:var(--font-serif);color:' + posColor + '">' + pos + '</td><td style="padding:12px 16px;text-align:center">' + chg + '</td><td style="padding:12px 16px;text-align:center;font-size:12px;color:var(--ink3)">' + r.difficulty + '</td><td style="padding:12px 16px">' + opp + '</td></tr>';
  }).join('');
}

// ── Mobile sidebar ──────────────────────────────────────────────
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}

function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}
`;

replace(
  '// ── Approve post ──\nfunction approvePost()',
  newFunctions + '\n// ── Approve post ──\nfunction approvePost()',
  'New JS functions'
);

// Write back with CRLF (Windows)
if (c !== orig) {
  fs.writeFileSync(p, c.replace(/\n/g, '\r\n'), 'utf8');
  console.log('\nDone! ' + changed + ' replacements applied. Lines: ' + c.split('\n').length);
} else {
  console.log('\nWARNING: No changes were applied!');
}
