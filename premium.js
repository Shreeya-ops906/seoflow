const fs = require('fs');
const p = 'C:/Users/Shreeya/AppData/Local/Temp/seoflow/app.html';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
let hits = 0;

function rep(search, replacement, label) {
  if (!c.includes(search)) { console.log('MISS: ' + label); return; }
  c = c.replace(search, replacement);
  console.log('OK:   ' + label);
  hits++;
}

// ══════════════════════════════════════════════════════════════════
// 1. CSS PREMIUM ADDITIONS
// ══════════════════════════════════════════════════════════════════
rep(
  '/* MOBILE */',
  `/* PREMIUM POLISH */
.page-desc{font-size:13px;color:var(--ink4);line-height:1.6;margin:-8px 0 20px;max-width:560px}
.tool-header{margin-bottom:22px}
.tool-header h2{font-family:var(--font-serif);font-size:20px;font-weight:600;color:var(--ink);letter-spacing:-.02em}
.tool-header .page-desc{margin-top:6px;margin-bottom:0}
.empty-hero{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:56px 24px;text-align:center}
.empty-hero-icon{font-size:36px;margin-bottom:14px;opacity:.4}
.empty-hero-title{font-family:var(--font-serif);font-size:16px;font-weight:600;color:var(--ink);margin-bottom:8px}
.empty-hero-desc{font-size:13px;color:var(--ink4);line-height:1.6;max-width:340px;margin-bottom:20px}
.stat-trend{font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:3px}
.stat-trend.up{color:var(--sage)}
.stat-trend.neutral{color:var(--ink4)}
.usage-bar{height:3px;background:var(--cream3);border-radius:2px;overflow:hidden;margin-top:6px}
.usage-fill{height:100%;background:var(--amber);border-radius:2px;transition:width .4s}
.preview-panel{background:var(--cream2);border:1.5px dashed var(--border2);border-radius:12px;padding:28px;margin-top:16px}
.preview-panel-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--ink4);margin-bottom:12px}
.audit-cat{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--border);opacity:.4}
.audit-cat:last-child{border-bottom:none}
.audit-cat-icon{width:32px;height:32px;border-radius:8px;background:var(--cream2);display:grid;place-items:center;font-size:16px;flex-shrink:0}
.audit-cat-name{font-size:13px;font-weight:600;color:var(--ink)}
.audit-cat-desc{font-size:11px;color:var(--ink4);margin-top:2px}
.comp-saved{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
.comp-saved-item{padding:12px 14px;background:var(--cream2);border-radius:8px;border:1px solid var(--border);cursor:pointer;transition:.15s}
.comp-saved-item:hover{border-color:var(--amber);background:var(--surface)}
.rank-auto-pill{font-size:11px;font-weight:700;padding:4px 10px;border-radius:100px;background:var(--amber-l);color:var(--amber-d);cursor:pointer;border:none;font-family:var(--font-ui)}
.rank-auto-pill:hover{background:var(--amber);color:#fff}
/* MOBILE */`,
  'Premium CSS additions'
);

// ══════════════════════════════════════════════════════════════════
// 2. FIX BREADCRUMB CAPITALISATION in nav()
// ══════════════════════════════════════════════════════════════════
rep(
  "  document.getElementById('breadcrumb').textContent = id;",
  `  const crumbMap = {dashboard:'Dashboard',posts:'Content',keywords:'Keywords',engine:'Generate',grader:'Content Grader',audit:'Site Audit',clusters:'Topic Clusters',competitor:'Competitor',social:'Social Snippets',ranks:'Rank Tracker',autopilot:'Autopilot',publish:'Publish',profile:'Brand Profile'};
  document.getElementById('breadcrumb').textContent = crumbMap[id] || id.replace(/-/g,' ').replace(/\\b\\w/g,x=>x.toUpperCase());`,
  'Fix breadcrumb capitalisation'
);

// ══════════════════════════════════════════════════════════════════
// 3. FIX AUTOPILOT STATE SYNC — init apOn from localStorage
// ══════════════════════════════════════════════════════════════════
rep(
  `function initAutopilot() {
  const saved = localStorage.getItem('cruise_autopilot');
  if (saved) {
    try { apSettings = { ...apSettings, ...JSON.parse(saved) }; } catch(e) {}
  }`,
  `function initAutopilot() {
  const saved = localStorage.getItem('cruise_autopilot');
  if (saved) {
    try { apSettings = { ...apSettings, ...JSON.parse(saved) }; } catch(e) {}
  }
  // Sync sidebar toggle with actual saved state
  apOn = apSettings.enabled || false;
  const apToggleEl = document.getElementById('apToggle');
  const apTxtEl = document.getElementById('apTxt');
  if (apToggleEl) apToggleEl.classList.toggle('on', apOn);
  if (apTxtEl) { apTxtEl.textContent = apOn ? 'on' : 'off'; apTxtEl.style.color = apOn ? 'var(--sage)' : 'var(--ink4)'; }`,
  'Fix autopilot state sync'
);

// Also fix dashboard Autopilot stat to read from saved settings
rep(
  `        <div class="stat-card"><div class="stat-label">Autopilot</div><div class="stat-value" id="stAP" style="font-size:20px;color:var(--sage)">● Active</div><div class="stat-sub up">publishing weekly</div></div>`,
  `        <div class="stat-card" style="cursor:pointer" onclick="nav(null,'autopilot')"><div class="stat-label">Autopilot</div><div class="stat-value" id="stAP" style="font-size:20px;color:var(--ink4)">○ Off</div><div class="stat-sub" id="stAPSub">click to configure</div></div>`,
  'Fix dashboard autopilot stat default state'
);

// Update renderDashQueue to also fix autopilot stat label
rep(
  `  if (stAP) {
    if (apSettings.enabled) {
      stAP.innerHTML = '● Active';
      stAP.style.color = 'var(--sage)';
      const sub = document.getElementById('stAP')?.parentElement?.querySelector('.stat-sub');
    } else {
      stAP.innerHTML = '○ Off';
      stAP.style.color = 'var(--ink4)';
    }
  }`,
  `  if (stAP) {
    const apCfg = JSON.parse(localStorage.getItem('cruise_autopilot') || '{}');
    const freqLabel = {daily:'Daily',weekly:'Weekly','3x_week':'3× week',monthly:'Monthly'};
    if (apCfg.enabled) {
      stAP.innerHTML = '● Active';
      stAP.style.color = 'var(--sage)';
      const sub = document.getElementById('stAPSub');
      if (sub) { sub.textContent = (freqLabel[apCfg.frequency] || 'Active') + ' publishing'; sub.className = 'stat-sub up'; }
    } else {
      stAP.innerHTML = '○ Off';
      stAP.style.color = 'var(--ink4)';
      const sub = document.getElementById('stAPSub');
      if (sub) { sub.textContent = 'click to enable'; sub.className = 'stat-sub neutral'; }
    }
  }`,
  'Fix autopilot stat in renderDashQueue'
);

// ══════════════════════════════════════════════════════════════════
// 4. FIX TIME COLUMN in renderWPLog (undefined bug)
// ══════════════════════════════════════════════════════════════════
rep(
  '      <span style="font-size:11px;color:var(--ink4);font-family:var(--font-mono)">${l.time}</span>',
  '      <span style="font-size:11px;color:var(--ink4);font-family:var(--font-mono)">${l.time || (l.ts ? new Date(l.ts).toLocaleDateString(\'en-GB\',{day:\'numeric\',month:\'short\',hour:\'2-digit\',minute:\'2-digit\'}) : \'—\')}</span>',
  'Fix TIME undefined in publish log'
);

// ══════════════════════════════════════════════════════════════════
// 5. FIX TOPIC COLUMN — numeric IDs showing in content list
// ══════════════════════════════════════════════════════════════════
rep(
  `      <td style="padding:10px 16px;font-size:12px;color:var(--ink4)">\${p.topic || '—'}</td>`,
  `      <td style="padding:10px 16px;font-size:12px;color:var(--ink4)">\${(p.topic && isNaN(String(p.topic)) && p.topic !== '—') ? p.topic : '—'}</td>`,
  'Fix topic column numeric IDs'
);

// ══════════════════════════════════════════════════════════════════
// 6. FIX DASHBOARD — Better Keywords stat card
// ══════════════════════════════════════════════════════════════════
rep(
  `        <div class="stat-card"><div class="stat-label">Keywords</div><div class="stat-value" id="stKeywords"><strong>—</strong></div><div class="stat-sub up">ranking on Google</div></div>`,
  `        <div class="stat-card" style="cursor:pointer" onclick="nav(null,'ranks')"><div class="stat-label">Keywords tracked</div><div class="stat-value" id="stKeywords"><strong id="stKwCount">—</strong></div><div class="stat-sub" id="stKwSub">click to track keywords</div></div>`,
  'Better keywords stat card'
);

// Update initNewFeatures to populate keyword count
rep(
  `function initNewFeatures() {
  renderDashQueue();
  syncWPPostsToLog();
  loadDashHealth();`,
  `function initNewFeatures() {
  renderDashQueue();
  syncWPPostsToLog();
  loadDashHealth();
  // Update keyword count stat
  const rankData = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  const kwCountEl = document.getElementById('stKwCount');
  const kwSubEl = document.getElementById('stKwSub');
  if (kwCountEl) kwCountEl.textContent = rankData.length || '—';
  if (kwSubEl && rankData.length) kwSubEl.textContent = 'keywords tracked';`,
  'Update keyword count on init'
);

// ══════════════════════════════════════════════════════════════════
// 7. FIX BRAND CONTEXT CARD on dashboard
// ══════════════════════════════════════════════════════════════════
rep(
  `      <div class="section-hd" style="margin-top:28px"><h2>Brand context</h2><button class="btn btn-ghost" onclick="nav(null,'profile')">Edit</button></div>
      <div class="card"><span style="font-size:13px;color:var(--ink3)" id="ctxVal">Loading brand profile...</span></div>`,
  `      <div class="section-hd" style="margin-top:28px"><h2>Brand context</h2><button class="btn btn-ghost" onclick="nav(null,'profile')">Edit profile →</button></div>
      <div class="card" style="padding:18px 22px">
        <span style="font-size:13px;color:var(--ink2);font-weight:600" id="ctxVal">Loading brand profile...</span>
        <div id="ctxMeta" style="display:flex;gap:16px;margin-top:10px;flex-wrap:wrap"></div>
      </div>`,
  'Better brand context card'
);

// Update applyBrand to populate ctxMeta
rep(
  "  if(ctxVal) ctxVal.textContent = brand.name + ' · ' + (brand.tone||'conversational') + ' · ' + (brand.keywords||[]).slice(0,3).join(', ');",
  `  if(ctxVal) ctxVal.textContent = brand.name || 'Your Business';
  const ctxMeta = document.getElementById('ctxMeta');
  if(ctxMeta) {
    const items = [
      brand.industry ? {l:'Industry',v:brand.industry} : null,
      brand.tone ? {l:'Voice',v:brand.tone} : null,
      (brand.keywords||[]).length ? {l:'Keywords',v:(brand.keywords||[]).slice(0,3).join(', ')} : null,
      brand.bookingUrl ? {l:'Booking URL',v:'✓ Set'} : null,
    ].filter(Boolean);
    ctxMeta.innerHTML = items.map(i=>\`<span style="font-size:11px;color:var(--ink4)"><strong style="color:var(--ink3);">\${i.l}:</strong> \${i.v}</span>\`).join('');
  }`,
  'Better brand context applyBrand'
);

// ══════════════════════════════════════════════════════════════════
// 8. DASHBOARD — Better empty state for content table
// ══════════════════════════════════════════════════════════════════
rep(
  `  if (!allPosts.length) {
    el.innerHTML = '<div style="padding:28px;text-align:center;color:var(--ink4);font-size:13px">No posts published yet — use Generate or enable Autopilot</div>';
    return;
  }`,
  `  if (!allPosts.length) {
    el.innerHTML = \`<div class="empty-hero">
      <div class="empty-hero-icon">✦</div>
      <div class="empty-hero-title">No published posts yet</div>
      <div class="empty-hero-desc">Generate your first AI-written, SEO-optimised post and publish it to WordPress in one click.</div>
      <button class="btn btn-primary" onclick="nav(null,'engine')">Generate your first post →</button>
    </div>\`;
    return;
  }`,
  'Better dashboard empty state'
);

// ══════════════════════════════════════════════════════════════════
// 9. GENERATE PAGE — Premium upgrade with description + options
// ══════════════════════════════════════════════════════════════════
rep(
  `      <!-- Step 1: Input -->
      <div id="gen-step-input">
        <div class="section-hd"><h2>Generate a blog post</h2></div>
        <div class="card">
          <div style="margin-bottom:20px">
            <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);display:block;margin-bottom:8px">Target keyword or topic</label>
            <input class="kw-input" id="genKeyword" placeholder="e.g. How to prepare for the 11+ exam" style="width:100%;font-size:15px;padding:13px 16px">
          </div>
          <div style="margin-bottom:20px">
            <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);display:block;margin-bottom:8px">Tone <span style="font-weight:400;text-transform:none;letter-spacing:0">(optional)</span></label>
            <div style="display:flex;gap:8px;flex-wrap:wrap" id="tone-chips">
              <div class="tone-chip on" onclick="selectTone(this,'authoritative')">Authoritative</div>
              <div class="tone-chip" onclick="selectTone(this,'friendly')">Friendly</div>
              <div class="tone-chip" onclick="selectTone(this,'educational')">Educational</div>
              <div class="tone-chip" onclick="selectTone(this,'conversational')">Conversational</div>
              <div class="tone-chip" onclick="selectTone(this,'professional')">Professional</div>
            </div>
          </div>
          <button class="btn btn-primary" onclick="runGenerate()" id="btnGen" style="font-size:15px;padding:13px 28px">
            Generate post ✦
          </button>
        </div>
      </div>`,
  `      <!-- Step 1: Input -->
      <div id="gen-step-input">
        <div class="section-hd" style="margin-top:0">
          <div>
            <h2>Content Engine</h2>
            <div class="page-desc">Write a fully-structured, SEO-optimised blog post and publish it to WordPress automatically.</div>
          </div>
        </div>
        <div class="card">
          <div style="margin-bottom:20px">
            <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);display:block;margin-bottom:8px">Target keyword or topic</label>
            <input class="kw-input" id="genKeyword" placeholder="e.g. How to prepare for the 11+ exam" style="width:100%;font-size:15px;padding:13px 16px">
            <div id="gen-quick-kws" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
            <div>
              <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);display:block;margin-bottom:8px">Post length</label>
              <div style="display:flex;gap:8px;flex-wrap:wrap" id="length-chips">
                <div class="tone-chip" onclick="selectLength(this,'short')" data-len="short">Short  ~600w</div>
                <div class="tone-chip on" onclick="selectLength(this,'standard')" data-len="standard">Standard  ~1000w</div>
                <div class="tone-chip" onclick="selectLength(this,'long')" data-len="long">Long  ~1500w</div>
              </div>
            </div>
            <div>
              <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);display:block;margin-bottom:8px">Tone</label>
              <div style="display:flex;gap:8px;flex-wrap:wrap" id="tone-chips">
                <div class="tone-chip on" onclick="selectTone(this,'authoritative')">Authoritative</div>
                <div class="tone-chip" onclick="selectTone(this,'friendly')">Friendly</div>
                <div class="tone-chip" onclick="selectTone(this,'educational')">Educational</div>
                <div class="tone-chip" onclick="selectTone(this,'conversational')">Conversational</div>
                <div class="tone-chip" onclick="selectTone(this,'professional')">Professional</div>
              </div>
            </div>
          </div>
          <button class="btn btn-primary" onclick="runGenerate()" id="btnGen" style="font-size:15px;padding:13px 28px">
            Generate post ✦
          </button>
        </div>
      </div>`,
  'Premium Generate page'
);

// Add selectLength function + quick keywords loader after selectTone
rep(
  `function selectTone(el, tone) {
  document.querySelectorAll('.tone-chip').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  selectedTone = tone;
}`,
  `let selectedLength = 'standard';
function selectTone(el, tone) {
  document.querySelectorAll('#tone-chips .tone-chip').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  selectedTone = tone;
}
function selectLength(el, len) {
  document.querySelectorAll('#length-chips .tone-chip').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  selectedLength = len;
}
function loadGenQuickKws() {
  const el = document.getElementById('gen-quick-kws');
  if (!el) return;
  const ranked = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]').slice(0,5);
  const brandKws = (brand?.keywords || []).slice(0,5);
  const all = [...ranked.map(r=>r.keyword), ...brandKws].filter((v,i,a)=>a.indexOf(v)===i).slice(0,6);
  if (!all.length) return;
  el.innerHTML = '<span style="font-size:11px;color:var(--ink4)">Quick add:</span>' + all.map(kw=>\`<button class="rank-auto-pill" onclick="document.getElementById('genKeyword').value='\${kw.replace(/'/g,"\\\\'")}';">\${kw}</button>\`).join('');
}`,
  'Add selectLength and quick kw loader'
);

// Update runGenerate prompt to use selectedLength
rep(
  `  const prompt = \`You are an expert SEO content writer. Write a comprehensive, SEO-optimised blog post for the following:

Keyword/Topic: "\${keyword}"
Tone: \${selectedTone}
Target length: 1,000–1,200 words`,
  `  const lengthMap = {short:'600–700 words',standard:'1,000–1,200 words',long:'1,500–1,800 words'};
  const prompt = \`You are an expert SEO content writer. Write a comprehensive, SEO-optimised blog post for the following:

Keyword/Topic: "\${keyword}"
Tone: \${selectedTone}
Target length: \${lengthMap[selectedLength]||'1,000–1,200 words'}`,
  'Use selectedLength in generate prompt'
);

// Load quick kws when navigating to engine
rep(
  `  if (id === 'profile') { renderProfile(); loadProfileView(); }`,
  `  if (id === 'profile') { renderProfile(); loadProfileView(); }
  if (id === 'engine') setTimeout(loadGenQuickKws, 50);`,
  'Load quick kws on engine nav'
);

// ══════════════════════════════════════════════════════════════════
// 10. ALL TOOL PAGES — add premium descriptions
// ══════════════════════════════════════════════════════════════════

// Content Grader
rep(
  `    <div class="view" id="view-grader">
      <div class="section-hd"><h2>Content Grader</h2></div>`,
  `    <div class="view" id="view-grader">
      <div class="section-hd" style="margin-top:0">
        <div>
          <h2>Content Grader</h2>
          <div class="page-desc">Score any post across SEO, readability and engagement — then get a rewritten intro and specific fixes.</div>
        </div>
      </div>`,
  'Content Grader description'
);

// Add contextual quick-paste buttons to Content Grader
rep(
  `      <div id="grader-loading" style="display:none;padding:40px;text-align:center"><div class="gen-spinner"></div><div style="margin-top:16px;color:var(--ink4);font-size:14px">Analysing content...</div></div>`,
  `      <div id="grader-recent-posts" style="margin-bottom:12px"></div>
      <div id="grader-loading" style="display:none;padding:40px;text-align:center"><div class="gen-spinner"></div><div style="margin-top:16px;color:var(--ink4);font-size:14px">Analysing content...</div></div>`,
  'Add recent posts to Content Grader'
);

// Site Audit
rep(
  `    <div class="view" id="view-audit">
      <div class="section-hd"><h2>Site Audit</h2></div>
      <div class="card" style="margin-bottom:16px">
        <div style="font-size:13px;color:var(--ink3);margin-bottom:14px">Crawls your connected WordPress site and checks for SEO issues across all pages.</div>
        <button class="btn btn-primary" onclick="runAudit()" id="audit-btn">Run full audit ✦</button>
      </div>`,
  `    <div class="view" id="view-audit">
      <div class="section-hd" style="margin-top:0">
        <div>
          <h2>Site Audit</h2>
          <div class="page-desc">A full technical SEO crawl of your WordPress site — checks meta, images, headings, internal links, schema, and more.</div>
        </div>
        <button class="btn btn-primary" onclick="runAudit()" id="audit-btn">Run full audit ✦</button>
      </div>
      <div id="audit-last-run" style="font-size:12px;color:var(--ink4);margin-bottom:16px"></div>`,
  'Site Audit description'
);

// Site Audit — premium empty state with category preview
rep(
  `      <div id="audit-loading" style="display:none;padding:40px;text-align:center"><div class="gen-spinner"></div><div style="margin-top:16px;color:var(--ink4);font-size:14px">Auditing site...</div></div>
      <div id="audit-results" style="display:none">`,
  `      <div id="audit-loading" style="display:none;padding:40px;text-align:center"><div class="gen-spinner"></div><div style="margin-top:16px;color:var(--ink4);font-size:14px">Crawling your site and checking for issues...</div></div>
      <div id="audit-pre-state" class="card" style="padding:0;overflow:hidden">
        <div class="audit-cat"><div class="audit-cat-icon">🏷</div><div><div class="audit-cat-name">Meta & Titles</div><div class="audit-cat-desc">Title tags, meta descriptions, duplicates</div></div></div>
        <div class="audit-cat"><div class="audit-cat-icon">🖼</div><div><div class="audit-cat-name">Images & Media</div><div class="audit-cat-desc">Alt text, file sizes, lazy loading</div></div></div>
        <div class="audit-cat"><div class="audit-cat-icon">🔗</div><div><div class="audit-cat-name">Internal Linking</div><div class="audit-cat-desc">Link structure, orphaned pages, anchor text</div></div></div>
        <div class="audit-cat"><div class="audit-cat-icon">📄</div><div><div class="audit-cat-name">Content Quality</div><div class="audit-cat-desc">Word count, keyword usage, readability</div></div></div>
        <div class="audit-cat"><div class="audit-cat-icon">⚡</div><div><div class="audit-cat-name">Performance Signals</div><div class="audit-cat-desc">Core Web Vitals, mobile-friendliness, HTTPS</div></div></div>
        <div class="audit-cat"><div class="audit-cat-icon">📊</div><div><div class="audit-cat-name">Structured Data</div><div class="audit-cat-desc">Schema markup, Article/FAQ/BreadcrumbList</div></div></div>
      </div>
      <div id="audit-results" style="display:none">`,
  'Site Audit premium empty state'
);

// Hide pre-state once results shown — in runAudit
rep(
  `    localStorage.setItem('cruise_last_audit', JSON.stringify({ health_score: d.health_score, ts: new Date().toISOString() }));
    results.style.display = '';
    loadDashHealth();`,
  `    localStorage.setItem('cruise_last_audit', JSON.stringify({ health_score: d.health_score, ts: new Date().toISOString() }));
    document.getElementById('audit-pre-state').style.display = 'none';
    const lastRun = document.getElementById('audit-last-run');
    if (lastRun) lastRun.textContent = 'Last run: just now · ' + d.pages_checked + ' pages checked';
    results.style.display = '';
    loadDashHealth();`,
  'Hide audit pre-state after run'
);

// Topic Clusters
rep(
  `    <div class="view" id="view-clusters">
      <div class="section-hd"><h2>Topic Clusters</h2></div>
      <div class="card" style="margin-bottom:16px">
        <div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:10px">Enter a pillar topic to build a cluster around</div>`,
  `    <div class="view" id="view-clusters">
      <div class="section-hd" style="margin-top:0">
        <div>
          <h2>Topic Clusters</h2>
          <div class="page-desc">Build a content hub — one pillar page and up to 8 supporting posts — all internally linked for maximum SEO authority.</div>
        </div>
      </div>
      <div class="card" style="margin-bottom:16px">
        <div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:10px">Enter a pillar topic to build a cluster around</div>`,
  'Topic Clusters description'
);

// Competitor Analysis
rep(
  `    <div class="view" id="view-competitor">
      <div class="section-hd"><h2>Competitor Analysis</h2></div>
      <div class="card" style="margin-bottom:16px">
        <div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:10px">Enter a competitor's website URL</div>`,
  `    <div class="view" id="view-competitor">
      <div class="section-hd" style="margin-top:0">
        <div>
          <h2>Competitor Analysis</h2>
          <div class="page-desc">Uncover your competitors' strengths, find content gaps you can own, and get a list of posts to write that will outrank them.</div>
        </div>
      </div>
      <div class="card" style="margin-bottom:16px">
        <div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:10px">Enter a competitor's website URL</div>`,
  'Competitor Analysis description'
);

// Social Snippets
rep(
  `    <div class="view" id="view-social">
      <div class="section-hd"><h2>Social Snippets</h2></div>
      <div class="card" style="margin-bottom:16px">
        <div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:10px">Generate social posts for a published article</div>`,
  `    <div class="view" id="view-social">
      <div class="section-hd" style="margin-top:0">
        <div>
          <h2>Social Snippets</h2>
          <div class="page-desc">Turn any blog post into ready-to-publish Twitter/X, LinkedIn, Facebook, and email subject lines — in one click.</div>
        </div>
      </div>
      <div class="card" style="margin-bottom:16px">
        <div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:10px">Paste a post URL or title to repurpose</div>`,
  'Social Snippets description'
);

// Keywords view
rep(
  `    <div class="view" id="view-keywords">
      <div class="section-hd">
        <h2>Keyword research</h2>
      </div>`,
  `    <div class="view" id="view-keywords">
      <div class="section-hd" style="margin-top:0">
        <div>
          <h2>Keyword Research</h2>
          <div class="page-desc">Get monthly search volume, difficulty scores, search intent, related keywords, and AI-generated content ideas for any topic.</div>
        </div>
      </div>`,
  'Keywords description'
);

// ══════════════════════════════════════════════════════════════════
// 11. PUBLISH VIEW — Premium upgrade
// ══════════════════════════════════════════════════════════════════

// Rename Test Publish to Verify Connection
rep(
  `          <!-- Test publish -->
          <div style="margin-bottom:6px">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:10px">Test publish</div>
            <div style="display:flex;gap:10px">
              <input id="wp-test-title" class="kw-input" placeholder="Post title e.g. How to rank on Google in 2025" style="flex:1">
              <button class="btn btn-primary" onclick="testPublish()" id="btn-test-publish">Publish test post</button>
            </div>
            <div id="wp-publish-result" style="display:none;margin-top:12px;padding:12px 14px;border-radius:9px;font-size:13px;font-weight:500"></div>
          </div>`,
  `          <!-- Verify connection -->
          <div style="margin-bottom:6px">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:4px">Verify connection</div>
            <div style="font-size:12px;color:var(--ink4);margin-bottom:10px">Publish a draft post to confirm everything is working correctly.</div>
            <div style="display:flex;gap:10px">
              <input id="wp-test-title" class="kw-input" placeholder="Test post title..." style="flex:1">
              <button class="btn btn-ghost" onclick="testPublish()" id="btn-test-publish">Publish draft test</button>
            </div>
            <div id="wp-publish-result" style="display:none;margin-top:12px;padding:12px 14px;border-radius:9px;font-size:13px;font-weight:500"></div>
          </div>`,
  'Rename Test Publish section'
);

// Better Publish log (fix URL truncation)
rep(
  `      <span style="font-size:11px;color:var(--ink4);font-family:var(--font-mono)">\${l.url.replace('https://','')}</span>`,
  `      <span style="font-size:11px;color:var(--ink4)">\${l.url ? '<a href="'+l.url+'" target="_blank" style="color:var(--amber);font-weight:600">'+new URL(l.url).hostname+'</a>' : '—'}</span>`,
  'Fix Publish log URL column'
);

// ══════════════════════════════════════════════════════════════════
// 12. PROFILE VIEW — Fix h1 to always say "Brand Profile"
// ══════════════════════════════════════════════════════════════════
rep(
  `    <div class="view" id="view-profile">
      <div class="section-hd">
        <h2 id="profName">Brand Profile</h2>
        <button class="btn btn-primary" onclick="saveProfile()">Save changes</button>
      </div>`,
  `    <div class="view" id="view-profile">
      <div class="section-hd">
        <div>
          <h2>Brand Profile</h2>
          <div class="page-desc" id="profMeta2">Your business identity — used by the AI for every post it generates.</div>
        </div>
        <button class="btn btn-primary" onclick="saveProfile()">Save changes</button>
      </div>`,
  'Fix profile h1'
);

// Fix renderProfile to not overwrite the heading
rep(
  `function renderProfile() {
  if(!brand) return;
  document.getElementById('profName').textContent=brand.name;
  document.getElementById('profMeta').textContent=brand.industry+' / '+(brand.type||'');`,
  `function renderProfile() {
  if(!brand) return;
  const pn = document.getElementById('profName'); if(pn) pn.textContent = brand.name;
  const pm = document.getElementById('profMeta'); if(pm) pm.textContent = brand.industry+' / '+(brand.type||'');`,
  'Fix renderProfile null check'
);

// ══════════════════════════════════════════════════════════════════
// 13. SIDEBAR — Add AI usage indicator + polish
// ══════════════════════════════════════════════════════════════════
rep(
  `  <div class="sb-footer">
    <div class="ap-row" onclick="toggleAP()">
      <span class="ap-label">autopilot <span id="apTxt">on</span></span>
      <div class="toggle on" id="apToggle"></div>
    </div>
    <button class="sb-signout" onclick="signOut()">Sign out</button>
  </div>`,
  `  <div class="sb-footer">
    <div style="padding:10px 16px 6px;border-top:1px solid rgba(255,255,255,.08)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.3)">AI Posts this month</span>
        <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5)" id="sb-usage-count">—</span>
      </div>
      <div class="usage-bar"><div class="usage-fill" id="sb-usage-fill" style="width:0%"></div></div>
    </div>
    <div class="ap-row" onclick="toggleAP()">
      <span class="ap-label">autopilot <span id="apTxt">off</span></span>
      <div class="toggle" id="apToggle"></div>
    </div>
    <button class="sb-signout" onclick="signOut()">Sign out</button>
  </div>`,
  'Sidebar usage indicator'
);

// Populate sidebar usage on init
rep(
  `  // Sync sidebar toggle with actual saved state
  apOn = apSettings.enabled || false;`,
  `  // Populate usage indicator
  const apLogs = JSON.parse(localStorage.getItem('cruise_ap_log') || '[]');
  const wpLogs = JSON.parse(localStorage.getItem('cruise_wp_log') || '[]');
  const thisMonth = new Date(); thisMonth.setDate(1); thisMonth.setHours(0,0,0,0);
  const monthCount = [...apLogs, ...wpLogs].filter(l => l.ts && new Date(l.ts) >= thisMonth).length;
  const usageEl = document.getElementById('sb-usage-count');
  const usageFill = document.getElementById('sb-usage-fill');
  const MONTHLY_LIMIT = 50;
  if (usageEl) usageEl.textContent = monthCount + '/' + MONTHLY_LIMIT;
  if (usageFill) usageFill.style.width = Math.min(100, (monthCount/MONTHLY_LIMIT)*100) + '%';
  // Sync sidebar toggle with actual saved state
  apOn = apSettings.enabled || false;`,
  'Sidebar usage count population'
);

// ══════════════════════════════════════════════════════════════════
// 14. LOAD PROFILE VIEW — Fix WP site pre-population
// ══════════════════════════════════════════════════════════════════
rep(
  `  // Set WP site
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  if (wpEl) wpEl.textContent = wp.url || 'No WordPress site connected';`,
  `  // Set WP site
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || localStorage.getItem(typeof WP_KEY !== 'undefined' ? WP_KEY : 'cruise_wp_connection') || '{}');
  if (wpEl) {
    if (wp.url) {
      wpEl.innerHTML = \`<span style="color:var(--sage);font-weight:600">✓ Connected</span> — <a href="\${wp.url}" target="_blank" style="color:var(--amber)">\${wp.url}</a> (as \${wp.name || wp.username || 'user'})\`;
    } else {
      wpEl.innerHTML = \`<span style="color:var(--ink4)">Not connected —</span> <button class="btn btn-ghost" onclick="nav(null,'publish')" style="font-size:12px;padding:3px 10px;margin-left:4px">Connect WordPress →</button>\`;
    }
  }`,
  'Fix WP site pre-population in profile'
);

// ══════════════════════════════════════════════════════════════════
// 15. RANK TRACKER — Add auto-import from WP posts button + better description
// ══════════════════════════════════════════════════════════════════
rep(
  `    <div class="view" id="view-ranks">
      <div class="section-hd">
        <h2>Rank Tracker</h2>
        <button class="btn btn-primary" onclick="estimateRankings()">Refresh estimates ✦</button>
      </div>`,
  `    <div class="view" id="view-ranks">
      <div class="section-hd" style="margin-top:0">
        <div>
          <h2>Rank Tracker</h2>
          <div class="page-desc">Track your target keywords, get AI-estimated Google positions, and spot your highest-opportunity terms.</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-ghost" onclick="importKwsFromBrand()" style="font-size:12px">↓ Import brand keywords</button>
          <button class="btn btn-primary" onclick="estimateRankings()">Refresh estimates ✦</button>
        </div>
      </div>`,
  'Rank Tracker description + import button'
);

// Add importKwsFromBrand function
rep(
  `function loadRankTracker() {
  const saved = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  if (saved.length) renderRankTable(saved);
}`,
  `function loadRankTracker() {
  const saved = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  renderRankTable(saved);
}
function importKwsFromBrand() {
  const kws = brand?.keywords || [];
  if (!kws.length) { toast('No brand keywords set — add them in Brand Profile', false); return; }
  const saved = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  let added = 0;
  kws.forEach(kw => {
    if (!saved.find(r => r.keyword.toLowerCase() === kw.toLowerCase())) {
      saved.push({ keyword: kw, position: null, change: 0, difficulty: '\u2014', opportunity: '\u2014', ts: null });
      added++;
    }
  });
  if (!added) { toast('All brand keywords are already tracked', false); return; }
  localStorage.setItem('cruise_rank_history', JSON.stringify(saved));
  renderRankTable(saved);
  toast(added + ' keyword' + (added>1?'s':'') + ' imported!', true);
  estimateRankings();
}`,
  'Add importKwsFromBrand function'
);

// ══════════════════════════════════════════════════════════════════
// 16. AUTOPILOT — better empty log state + description
// ══════════════════════════════════════════════════════════════════
rep(
  `      <div class="section-hd">
        <h2>Autopilot</h2>
        <div style="display:flex;align-items:center;gap:12px">`,
  `      <div class="section-hd" style="margin-top:0">
        <div>
          <h2>Autopilot</h2>
          <div class="page-desc">Set a schedule and let the AI research trending topics, write full posts, and publish them to WordPress — automatically.</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">`,
  'Autopilot description'
);

rep(
  `          <div id="ap-log-body">
            <div style="padding:28px;text-align:center;color:var(--ink4);font-size:13px">No autopilot runs yet</div>
          </div>`,
  `          <div id="ap-log-body">
            <div class="empty-hero" style="padding:36px 24px">
              <div class="empty-hero-icon">🤖</div>
              <div class="empty-hero-title">No runs yet</div>
              <div class="empty-hero-desc">Once enabled, Autopilot will publish posts here on your chosen schedule. You can also trigger it manually with "Run now".</div>
            </div>
          </div>`,
  'Better autopilot empty log state'
);

// ══════════════════════════════════════════════════════════════════
// 17. CONTENT GRADER — init recent posts on nav
// ══════════════════════════════════════════════════════════════════
rep(
  `  if (id === 'ranks') loadRankTracker();`,
  `  if (id === 'ranks') loadRankTracker();
  if (id === 'grader') setTimeout(initGraderRecent, 50);`,
  'Load recent posts on grader nav'
);

// Add initGraderRecent function
rep(
  `function importKwsFromBrand() {`,
  `function initGraderRecent() {
  const el = document.getElementById('grader-recent-posts');
  if (!el) return;
  const posts = getAllPublishedPosts().slice(0,6);
  if (!posts.length) return;
  el.innerHTML = '<div style="font-size:11px;color:var(--ink4);margin-bottom:8px;font-weight:700;text-transform:uppercase;letter-spacing:.06em">Quick grade a recent post:</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
    posts.map(p => \`<button class="rank-auto-pill" onclick="document.getElementById('grader-url').value='\${(p.url||'').replace(/'/g,"\\\\'")}';document.getElementById('grader-content').value='';document.getElementById('grader-btn').focus();">\${(p.title||'').split(' ').slice(0,5).join(' ')}…</button>\`).join('') +
    '</div>';
}
function importKwsFromBrand() {`,
  'Add initGraderRecent function'
);

// ══════════════════════════════════════════════════════════════════
// 18. FIX PUBLISH VIEW — add section description
// ══════════════════════════════════════════════════════════════════
rep(
  `    <div class="view" id="view-publish">
      <div class="section-hd"><h2>Publishing channels</h2></div>`,
  `    <div class="view" id="view-publish">
      <div class="section-hd" style="margin-top:0">
        <div>
          <h2>Publishing</h2>
          <div class="page-desc">Connect your WordPress site and all generated posts will publish there automatically — with featured images and internal links.</div>
        </div>
      </div>`,
  'Publish view description'
);

// ══════════════════════════════════════════════════════════════════
// 19. POSTS/CONTENT VIEW — description + better empty state
// ══════════════════════════════════════════════════════════════════
rep(
  `    <div class="view" id="view-posts">
      <div class="section-hd">
        <h2>Content</h2>`,
  `    <div class="view" id="view-posts">
      <div class="section-hd">
        <h2>Content Library</h2>`,
  'Content view heading'
);

rep(
  `          <div id="all-posts-empty" style="padding:40px;text-align:center;color:var(--ink4);font-size:13px;display:none">No posts yet — generate your first post or enable Autopilot</div>`,
  `          <div id="all-posts-empty" style="display:none">
            <div class="empty-hero">
              <div class="empty-hero-icon">📄</div>
              <div class="empty-hero-title">Your content library is empty</div>
              <div class="empty-hero-desc">Generate and publish your first post — it will appear here with its live URL, SEO score, and source.</div>
              <button class="btn btn-primary" onclick="nav(null,'engine')">Generate first post ✦</button>
            </div>
          </div>`,
  'Better content empty state'
);

// ══════════════════════════════════════════════════════════════════
// 20. loadDashHealth — update audit-last-run element too
// ══════════════════════════════════════════════════════════════════
rep(
  `    if (tsEl && audit.ts) {
      const d = new Date(audit.ts);
      tsEl.textContent = 'Last audit: ' + d.toLocaleDateString('en-GB', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
    }`,
  `    if (tsEl && audit.ts) {
      const d = new Date(audit.ts);
      const fmt = d.toLocaleDateString('en-GB', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
      tsEl.textContent = 'Last audit: ' + fmt;
      const lastRunEl = document.getElementById('audit-last-run');
      if (lastRunEl) lastRunEl.textContent = 'Last run: ' + fmt;
    }`,
  'Sync audit last-run label'
);

// ══════════════════════════════════════════════════════════════════
// 21. Fix Publish log URL try/catch (URL constructor can throw)
// ══════════════════════════════════════════════════════════════════
rep(
  `      <span style="font-size:11px;color:var(--ink4)">\${l.url ? '<a href="'+l.url+'" target="_blank" style="color:var(--amber);font-weight:600">'+new URL(l.url).hostname+'</a>' : '—'}</span>`,
  `      <span style="font-size:11px;color:var(--ink4)">\${l.url ? '<a href="'+l.url+'" target="_blank" style="color:var(--amber);font-weight:600">'+(() => { try { return new URL(l.url).hostname; } catch(e) { return l.url.replace('https://','').split('/')[0]; } })()+'</a>' : '—'}</span>`,
  'Fix URL constructor crash in publish log'
);

// ══════════════════════════════════════════════════════════════════
// WRITE BACK
// ══════════════════════════════════════════════════════════════════
fs.writeFileSync(p, c.replace(/\n/g, '\r\n'), 'utf8');
console.log('\n✓ Done — ' + hits + ' replacements. Lines: ' + c.split('\n').length);
