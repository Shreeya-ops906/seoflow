// premium9.js — Autopilot calendar, SemRush features, premium polish
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'app.html');
let html = fs.readFileSync(htmlPath, 'utf8').replace(/\r\n/g, '\n');
let changes = 0;

function replace(oldStr, newStr, label) {
  if (!html.includes(oldStr)) {
    console.error(`\n❌ NOT FOUND: ${label}`);
    console.error('Expected:\n' + oldStr.slice(0, 120));
    process.exit(1);
  }
  html = html.replace(oldStr, newStr);
  changes++;
  console.log(`✅ ${label}`);
}

// ─────────────────────────────────────────────────────────
// 1. Fix .page-desc negative margin (title/subtitle overlap)
// ─────────────────────────────────────────────────────────
replace(
  `.page-desc{font-size:13px;color:var(--ink4);line-height:1.6;margin:-8px 0 20px;max-width:560px}`,
  `.page-desc{font-size:13px;color:var(--ink4);line-height:1.6;margin:4px 0 20px;max-width:560px}`,
  'Fix .page-desc negative margin (title/subtitle overlap)'
);

// ─────────────────────────────────────────────────────────
// 2. Inject premium9 CSS
// ─────────────────────────────────────────────────────────
const newCSS = `
/* ── Premium9 — Autopilot calendar, Backlinks, Insights ─────────── */
/* Autopilot day-of-week picker */
.ap-dow-label{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;border:1.5px solid var(--border);border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;transition:all var(--tr);user-select:none;color:var(--ink3);background:var(--bg)}
.ap-dow-label:has(input:checked){background:var(--sage);border-color:var(--sage);color:#fff}
.ap-dow-label input{display:none}

/* Mini calendar */
.ap-cal{border:1px solid var(--border);border-radius:12px;overflow:hidden;background:#fff}
.ap-cal-header{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:var(--cream2);border-bottom:1px solid var(--border)}
.ap-cal-header-title{font-size:13px;font-weight:700;color:var(--ink)}
.ap-cal-grid{display:grid;grid-template-columns:repeat(7,1fr)}
.ap-cal-dow{padding:7px 0;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4);border-bottom:1px solid var(--border);background:var(--cream2)}
.ap-cal-day{padding:5px 0;text-align:center;font-size:12px;min-height:30px;display:flex;align-items:center;justify-content:center}
.ap-cal-num{width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:12px}
.ap-cal-day.today .ap-cal-num{background:var(--ink);color:#fff;font-weight:700}
.ap-cal-day.scheduled .ap-cal-num{background:var(--sage);color:#fff;font-weight:700}
.ap-cal-day.past{opacity:.3}
.ap-cal-day.empty{min-height:30px}

/* Backlink monitor */
.bl-stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
.bl-stat{background:#fff;border:1px solid var(--border);border-radius:12px;padding:18px;text-align:center;box-shadow:var(--sh-xs)}
.bl-stat-num{font-family:var(--font-serif);font-size:28px;font-weight:700;color:var(--ink);letter-spacing:-.03em;margin-bottom:2px}
.bl-stat-lbl{font-size:11px;color:var(--ink4);font-weight:600;text-transform:uppercase;letter-spacing:.06em}
.bl-badge{display:inline-block;padding:3px 8px;border-radius:100px;font-size:11px;font-weight:700}
.bl-badge.dofollow{background:rgba(74,124,111,.12);color:var(--sage)}
.bl-badge.nofollow{background:var(--cream3);color:var(--ink4)}
.bl-badge.guest{background:rgba(76,148,178,.1);color:var(--amber-d)}

/* Dashboard AI Insights */
.insight-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.insight-card{background:#fff;border:1px solid var(--border);border-radius:12px;padding:16px 18px;position:relative;overflow:hidden;transition:all var(--tr);display:flex;flex-direction:column}
.insight-card:hover{box-shadow:var(--sh-md);transform:translateY(-2px);border-color:rgba(28,23,20,.15)}
.insight-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px}
.insight-card.alert::before{background:#C0304F}
.insight-card.warn::before{background:var(--amber)}
.insight-card::before{background:var(--sage)}
.insight-priority{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}
.insight-priority.high{color:#C0304F}
.insight-priority.medium{color:var(--amber-d)}
.insight-priority.low{color:var(--sage)}
.insight-title{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:5px;line-height:1.35}
.insight-body{font-size:12px;color:var(--ink4);line-height:1.55;flex:1;margin-bottom:12px}

/* Tool/external link pills */
.tool-pill{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border:1px solid var(--border);border-radius:100px;font-size:12px;font-weight:600;color:var(--ink3);background:#fff;cursor:pointer;transition:all var(--tr);text-decoration:none}
.tool-pill:hover{border-color:var(--amber);color:var(--amber);background:rgba(76,148,178,.05)}

/* Number input styles */
input[type=number]{-moz-appearance:textfield}
input[type=number]::-webkit-inner-spin-button{opacity:1;height:24px}

/* Frequency custom builder */
.freq-builder{padding:12px 14px;background:var(--cream2);border-radius:10px;border:1.5px solid var(--border);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.freq-num-input{width:60px;padding:6px 10px;border:1.5px solid var(--border2);border-radius:8px;font-size:16px;font-weight:700;text-align:center;background:#fff;color:var(--ink)}
.freq-period-select{padding:6px 12px;border:1.5px solid var(--border2);border-radius:8px;font-size:13px;background:#fff;color:var(--ink);cursor:pointer}
/* ─────────────────────────────────────────────────────────────────── */
`;
const bodyIdx = html.indexOf('<body');
const lastStyleClose = html.lastIndexOf('</style>', bodyIdx);
html = html.slice(0, lastStyleClose) + newCSS + '</style>' + html.slice(lastStyleClose + 8);
changes++;
console.log('✅ Inject premium9 CSS');

// ─────────────────────────────────────────────────────────
// 3. Autopilot: replace freq-chips with full frequency builder + day picker
// ─────────────────────────────────────────────────────────
replace(
  `        <div style="margin-bottom:20px">
          <label style="font-size:13px;font-weight:600;color:var(--ink);display:block;margin-bottom:10px">Posting frequency</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap" id="freq-chips">
            <div class="tone-chip" onclick="selectFreq(this,'daily')">Daily</div>
            <div class="tone-chip on" onclick="selectFreq(this,'3x_week')">3x per week</div>
            <div class="tone-chip" onclick="selectFreq(this,'weekly')">Weekly</div>
            <div class="tone-chip" onclick="selectFreq(this,'monthly')">Monthly</div>
          </div>
        </div>`,
  `        <div style="margin-bottom:20px">
          <label style="font-size:13px;font-weight:600;color:var(--ink);display:block;margin-bottom:10px">Posting frequency</label>
          <!-- Quick presets -->
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px" id="freq-chips">
            <div class="tone-chip" onclick="selectFreqPreset('daily')">Daily</div>
            <div class="tone-chip on" onclick="selectFreqPreset('3x_week')">3× week</div>
            <div class="tone-chip" onclick="selectFreqPreset('weekly')">Weekly</div>
            <div class="tone-chip" onclick="selectFreqPreset('biweekly')">Bi-weekly</div>
            <div class="tone-chip" onclick="selectFreqPreset('monthly')">Monthly</div>
          </div>
          <!-- Custom frequency number builder -->
          <div class="freq-builder">
            <span style="font-size:13px;font-weight:600;color:var(--ink2)">Every</span>
            <input type="number" id="ap-freq-num" min="1" max="30" value="3" oninput="apFreqCustomChanged()" class="freq-num-input">
            <select id="ap-freq-period" onchange="apFreqCustomChanged()" class="freq-period-select">
              <option value="day">day(s)</option>
              <option value="week" selected>week(s)</option>
              <option value="month">month(s)</option>
            </select>
            <span style="font-size:12px;color:var(--ink4)" id="ap-freq-label-custom">→ 3× per week</span>
          </div>
          <!-- Day-of-week selector -->
          <div id="ap-dow-row" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;align-items:center">
            <span style="font-size:12px;color:var(--ink4);font-weight:600;margin-right:2px">Days:</span>
            <label class="ap-dow-label"><input type="checkbox" value="1" onchange="apDowChanged()"> Mon</label>
            <label class="ap-dow-label"><input type="checkbox" value="2" onchange="apDowChanged()"> Tue</label>
            <label class="ap-dow-label"><input type="checkbox" value="3" checked onchange="apDowChanged()"> Wed</label>
            <label class="ap-dow-label"><input type="checkbox" value="4" onchange="apDowChanged()"> Thu</label>
            <label class="ap-dow-label"><input type="checkbox" value="5" checked onchange="apDowChanged()"> Fri</label>
            <label class="ap-dow-label"><input type="checkbox" value="6" onchange="apDowChanged()"> Sat</label>
            <label class="ap-dow-label"><input type="checkbox" value="0" onchange="apDowChanged()"> Sun</label>
          </div>
        </div>`,
  'Autopilot: replace freq-chips with frequency builder + day picker'
);

// ─────────────────────────────────────────────────────────
// 4. Add publishing calendar + upcoming dates before Autopilot log
// ─────────────────────────────────────────────────────────
replace(
  `      <div style="margin-top:8px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:12px">Autopilot log</div>`,
  `      <!-- Publishing calendar -->
      <div class="card" style="margin-top:8px;margin-bottom:8px" id="ap-cal-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--ink)">Publishing calendar</div>
            <div style="font-size:12px;color:var(--ink4);margin-top:2px" id="ap-cal-summary">Based on your frequency settings</div>
          </div>
          <div style="display:flex;gap:6px">
            <button onclick="apCalNav(-1)" style="border:1px solid var(--border);border-radius:8px;background:#fff;padding:4px 11px;font-size:17px;cursor:pointer;color:var(--ink3);line-height:1">‹</button>
            <button onclick="apCalNav(1)" style="border:1px solid var(--border);border-radius:8px;background:#fff;padding:4px 11px;font-size:17px;cursor:pointer;color:var(--ink3);line-height:1">›</button>
          </div>
        </div>
        <div id="ap-mini-cal"></div>
        <div id="ap-upcoming" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)"></div>
      </div>

      <div style="margin-top:8px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);margin-bottom:12px">Autopilot log</div>`,
  'Autopilot: add publishing calendar section'
);

// ─────────────────────────────────────────────────────────
// 5. Add Backlinks nav item in sidebar (after Rank Tracker, before Settings)
// ─────────────────────────────────────────────────────────
replace(
  `      <div class="nav-item" onclick="nav(this,'ranks')">
        <div class="nav-dot"></div>
        <svg viewBox="0 0 16 16"><path d="M2 13V7l4-3 4 4 4-6"/><circle cx="14" cy="4" r="1.5"/></svg>
        Rank Tracker
      </div>
    </div>
    <div class="nav-section">
      <div class="nav-section-label">Settings</div>`,
  `      <div class="nav-item" onclick="nav(this,'ranks')">
        <div class="nav-dot"></div>
        <svg viewBox="0 0 16 16"><path d="M2 13V7l4-3 4 4 4-6"/><circle cx="14" cy="4" r="1.5"/></svg>
        Rank Tracker
      </div>
      <div class="nav-item" onclick="nav(this,'backlinks')">
        <div class="nav-dot"></div>
        <svg viewBox="0 0 16 16"><path d="M6.5 9.5a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0-5-5L7 4"/><path d="M9.5 6.5a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5L9 12"/></svg>
        Backlinks
      </div>
    </div>
    <div class="nav-section">
      <div class="nav-section-label">Settings</div>`,
  'Sidebar: add Backlinks nav item'
);

// ─────────────────────────────────────────────────────────
// 6. Add view-backlinks HTML (before the closing divs + TOAST)
// ─────────────────────────────────────────────────────────
replace(
  `  </div>
</div>

<!-- TOAST -->`,
  `    <!-- BACKLINK MONITOR -->
    <div class="view" id="view-backlinks">

      <div class="section-hd" style="margin-top:0">
        <div>
          <h2>Backlink Monitor</h2>
          <div class="page-desc">Track your inbound links, monitor link-building progress, and find new opportunities. Add links you've earned or use free external tools.</div>
        </div>
        <button class="btn btn-primary" onclick="showAddBacklinkModal()">+ Add backlink</button>
      </div>

      <!-- Stats -->
      <div class="bl-stat-grid">
        <div class="bl-stat"><div class="bl-stat-num" id="bl-total">—</div><div class="bl-stat-lbl">Total backlinks</div></div>
        <div class="bl-stat"><div class="bl-stat-num" id="bl-dofollow-pct">—%</div><div class="bl-stat-lbl">Dofollow</div></div>
        <div class="bl-stat"><div class="bl-stat-num" id="bl-domains">—</div><div class="bl-stat-lbl">Unique domains</div></div>
      </div>

      <!-- External tools -->
      <div class="card" style="margin-bottom:16px;padding:16px 20px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4);margin-bottom:10px">Check your backlinks with free tools</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <a onclick="openBacklinkTool('ahrefs');return false" href="#" class="tool-pill">↗ Ahrefs Free Checker</a>
          <a onclick="openBacklinkTool('moz');return false" href="#" class="tool-pill">↗ Moz Link Explorer</a>
          <a onclick="openBacklinkTool('semrush');return false" href="#" class="tool-pill">↗ Semrush Backlinks</a>
          <a onclick="openBacklinkTool('gsc');return false" href="#" class="tool-pill">↗ Google Search Console</a>
        </div>
      </div>

      <!-- Backlinks table -->
      <div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
        <div id="bl-table-body">
          <div class="empty-hero" style="padding:44px 24px">
            <div class="empty-hero-icon">🔗</div>
            <div class="empty-hero-title">No backlinks tracked yet</div>
            <div class="empty-hero-desc">Add backlinks you've earned manually, or use the free tools above to discover your existing link profile.</div>
            <button class="btn btn-primary" onclick="showAddBacklinkModal()" style="margin-top:16px">+ Add your first backlink</button>
          </div>
        </div>
      </div>

      <!-- AI link opportunity ideas -->
      <div class="section-hd" style="margin-top:0">
        <h2>Link building opportunities</h2>
        <button class="btn btn-ghost" onclick="generateLinkOpportunities()" id="bl-opp-btn" style="font-size:12px">Generate with AI ✦</button>
      </div>
      <div id="bl-opportunities">
        <div class="card" style="padding:20px 24px;color:var(--ink4);font-size:13px;text-align:center">
          Click "Generate with AI" to get personalised link-building opportunity ideas based on your brand and niche.
        </div>
      </div>

    </div>

  </div>
</div>

<!-- TOAST -->`,
  'Add view-backlinks HTML'
);

// ─────────────────────────────────────────────────────────
// 7. Add Dashboard AI Insights panel (before "Recent content")
// ─────────────────────────────────────────────────────────
replace(
  `      <div class="section-hd" style="margin-top:0"><h2>Recent content</h2><div style="display:flex;gap:8px"><button class="btn btn-ghost" onclick="generatePDFReport()" style="font-size:12px">↓ Export report</button><button class="btn btn-ghost" onclick="nav(null,'posts')">View all</button></div></div>`,
  `      <!-- AI Insights panel -->
      <div id="dash-insights-panel" style="margin-bottom:24px">
        <div class="section-hd" style="margin-top:0;margin-bottom:12px">
          <div>
            <h2>✦ AI Insights</h2>
            <div style="font-size:12px;color:var(--ink4);margin-top:2px">Priority actions to grow your rankings</div>
          </div>
          <button class="btn btn-ghost" onclick="loadDashInsights(true)" id="dash-insights-refresh" style="font-size:12px">↻ Refresh</button>
        </div>
        <div class="insight-cards" id="dash-insights-cards">
          <div style="grid-column:1/-1;padding:20px;text-align:center;color:var(--ink4);font-size:13px">Loading insights…</div>
        </div>
      </div>

      <div class="section-hd" style="margin-top:0"><h2>Recent content</h2><div style="display:flex;gap:8px"><button class="btn btn-ghost" onclick="generatePDFReport()" style="font-size:12px">↓ Export report</button><button class="btn btn-ghost" onclick="nav(null,'posts')">View all</button></div></div>`,
  'Dashboard: add AI Insights panel'
);

// ─────────────────────────────────────────────────────────
// 8. Update breadcrumb map to include backlinks
// ─────────────────────────────────────────────────────────
replace(
  `const crumbMap = {dashboard:'Dashboard',posts:'Content',keywords:'Keywords',engine:'Generate',grader:'Content Grader',audit:'Site Audit',clusters:'Topic Clusters',competitor:'Competitor',social:'Social Snippets',ranks:'Rank Tracker',autopilot:'Autopilot',publish:'Publish',profile:'Brand Profile','social-connect':'Social Media'};`,
  `const crumbMap = {dashboard:'Dashboard',posts:'Content',keywords:'Keywords',engine:'Generate',grader:'Content Grader',audit:'Site Audit',clusters:'Topic Clusters',competitor:'Competitor',social:'Social Snippets',ranks:'Rank Tracker',backlinks:'Backlinks',autopilot:'Autopilot',publish:'Publish',profile:'Brand Profile','social-connect':'Social Media'};`,
  'Update crumbMap to include backlinks'
);

// ─────────────────────────────────────────────────────────
// 9. Update saveApSettings to also persist selectedDays
// ─────────────────────────────────────────────────────────
replace(
  `function saveApSettings() {
  apSettings.frequency = apFreq;
  apSettings.tone = apTone;
  apSettings.seeds = document.getElementById('ap-seeds')?.value || apSettings.seeds;
  localStorage.setItem('cruise_autopilot', JSON.stringify(apSettings));
}`,
  `function saveApSettings() {
  apSettings.frequency = apFreq;
  apSettings.tone = apTone;
  apSettings.seeds = document.getElementById('ap-seeds')?.value || apSettings.seeds;
  if (typeof apSelectedDays !== 'undefined') apSettings.selectedDays = apSelectedDays;
  localStorage.setItem('cruise_autopilot', JSON.stringify(apSettings));
}`,
  'saveApSettings: persist selectedDays'
);

// ─────────────────────────────────────────────────────────
// 10. Update renderAutopilotUI to sync the new freq builder UI
// ─────────────────────────────────────────────────────────
replace(
  `  // Set freq chip
  document.querySelectorAll('#freq-chips .tone-chip').forEach(c => {
    c.classList.toggle('on', c.getAttribute('data-freq') === apFreq ||
      c.textContent.toLowerCase().replace(/[^a-z0-9]/g,'_') === apFreq ||
      (apFreq === '3x_week' && c.textContent.includes('3')) ||
      (apFreq === 'weekly' && c.textContent.toLowerCase() === 'weekly') ||
      (apFreq === 'daily' && c.textContent.toLowerCase() === 'daily') ||
      (apFreq === 'monthly' && c.textContent.toLowerCase() === 'monthly')
    );
  });`,
  `  // Set freq chip — v9 updated preset order
  const _fpList = ['daily','3x_week','weekly','biweekly','monthly'];
  document.querySelectorAll('#freq-chips .tone-chip').forEach(function(c, i) {
    c.classList.toggle('on', _fpList[i] === apFreq);
  });
  // Sync custom freq number inputs
  const _fn = document.getElementById('ap-freq-num');
  const _fp = document.getElementById('ap-freq-period');
  if (_fn && _fp) {
    const _pm = {daily:{n:1,p:'day'},'3x_week':{n:3,p:'week'},weekly:{n:1,p:'week'},biweekly:{n:2,p:'week'},monthly:{n:1,p:'month'}};
    const _m = _pm[apFreq];
    if (_m) { _fn.value = _m.n; _fp.value = _m.p; }
    else if (apFreq && apFreq.startsWith('custom_')) {
      const _pts = apFreq.split('_'); if (_pts[1]&&_pts[2]) { _fn.value=_pts[1]; _fp.value=_pts[2]; }
    }
  }
  if (typeof syncDowCheckboxes === 'function') syncDowCheckboxes();
  if (typeof showHideDowRow === 'function') showHideDowRow();`,
  'renderAutopilotUI: sync new freq builder UI'
);

// ─────────────────────────────────────────────────────────
// 11. Update updateNextRunLabel to handle biweekly + custom freqs
// ─────────────────────────────────────────────────────────
replace(
  `  const freqLabels = { daily: 'Daily at 8:00 AM UTC', '3x_week': 'Mon, Wed & Fri at 8:00 AM UTC', weekly: 'Every Monday at 8:00 AM UTC', monthly: '1st of every month at 8:00 AM UTC' };`,
  `  const _fn2 = document.getElementById('ap-freq-num'); const _fp2 = document.getElementById('ap-freq-period');
  const _n2 = _fn2 ? parseInt(_fn2.value)||1 : 1; const _p2 = _fp2 ? _fp2.value : 'week';
  const _dow2 = (typeof apSelectedDays!=='undefined'&&apSelectedDays.length)?apSelectedDays.map(d=>['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', '):null;
  const freqLabels = { daily:'Daily at 8:00 AM', '3x_week':'Mon, Wed & Fri at 8:00 AM', weekly:'Every Monday at 8:00 AM', biweekly:'Every 2 weeks on Monday', monthly:'1st of every month' };
  if (!freqLabels[apFreq]) freqLabels[apFreq] = 'Every ' + _n2 + ' ' + _p2 + (_dow2?' ('+_dow2+')':'');`,
  'updateNextRunLabel: handle biweekly + custom freqs'
);

// ─────────────────────────────────────────────────────────
// 12. Inject all new JS before last </script>
// ─────────────────────────────────────────────────────────
const v9JS = `

// ── Premium9 — Autopilot calendar, Backlinks, Insights ──────────────

// ── Autopilot Enhanced ──────────────────────────────────────────────
let apCalViewDate = new Date();
let apSelectedDays = [3, 5]; // Wed, Fri defaults

function selectFreqPreset(freq) {
  document.querySelectorAll('#freq-chips .tone-chip').forEach(c => c.classList.remove('on'));
  if (event && event.target) event.target.closest('.tone-chip').classList.add('on');
  apFreq = freq;
  const numEl = document.getElementById('ap-freq-num');
  const periodEl = document.getElementById('ap-freq-period');
  if (numEl && periodEl) {
    const map = {daily:{n:1,p:'day'},'3x_week':{n:3,p:'week'},weekly:{n:1,p:'week'},biweekly:{n:2,p:'week'},monthly:{n:1,p:'month'}};
    const m = map[freq] || {n:1,p:'week'};
    numEl.value = m.n; periodEl.value = m.p;
  }
  const dowDefs = {daily:[0,1,2,3,4,5,6],'3x_week':[1,3,5],weekly:[1],biweekly:[1],monthly:[]};
  apSelectedDays = dowDefs[freq] || [1,3,5];
  syncDowCheckboxes();
  showHideDowRow();
  updateFreqCustomLabel();
  saveApSettings();
  renderApCalendar();
  if (apSettings && apSettings.enabled) updateNextRunLabel();
}

function apFreqCustomChanged() {
  document.querySelectorAll('#freq-chips .tone-chip').forEach(c => c.classList.remove('on'));
  const n = parseInt(document.getElementById('ap-freq-num')?.value) || 1;
  const p = document.getElementById('ap-freq-period')?.value || 'week';
  apFreq = 'custom_' + n + '_' + p;
  showHideDowRow();
  updateFreqCustomLabel();
  saveApSettings();
  renderApCalendar();
  if (apSettings && apSettings.enabled) updateNextRunLabel();
}

function apDowChanged() {
  apSelectedDays = Array.from(document.querySelectorAll('#ap-dow-row input[type=checkbox]:checked')).map(cb => parseInt(cb.value));
  if (apSelectedDays.length === 0) { apSelectedDays = [1]; syncDowCheckboxes(); }
  document.querySelectorAll('#freq-chips .tone-chip').forEach(c => c.classList.remove('on'));
  apFreq = 'custom_dow';
  updateFreqCustomLabel();
  saveApSettings();
  renderApCalendar();
  if (apSettings && apSettings.enabled) updateNextRunLabel();
}

function syncDowCheckboxes() {
  document.querySelectorAll('#ap-dow-row input[type=checkbox]').forEach(cb => {
    cb.checked = apSelectedDays.includes(parseInt(cb.value));
  });
}

function showHideDowRow() {
  const period = document.getElementById('ap-freq-period')?.value;
  const row = document.getElementById('ap-dow-row');
  if (row) row.style.display = (period === 'week' || apFreq === 'custom_dow' || apFreq === '3x_week' || apFreq === 'weekly' || apFreq === 'biweekly') ? 'flex' : 'none';
}

function updateFreqCustomLabel() {
  const el = document.getElementById('ap-freq-label-custom');
  if (!el) return;
  const n = parseInt(document.getElementById('ap-freq-num')?.value) || 1;
  const p = document.getElementById('ap-freq-period')?.value || 'week';
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  if (p === 'week' && apSelectedDays && apSelectedDays.length) {
    el.textContent = '→ ' + apSelectedDays.map(d => dayNames[d]).join(', ');
  } else if (p === 'day') {
    el.textContent = n === 1 ? '→ Daily' : '→ Every ' + n + ' days';
  } else if (p === 'month') {
    el.textContent = n === 1 ? '→ Monthly' : '→ Every ' + n + ' months';
  } else {
    el.textContent = '→ ' + n + '× per ' + p;
  }
}

function getScheduledDaysInMonth(year, month) {
  const scheduled = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const n = parseInt(document.getElementById('ap-freq-num')?.value) || 3;
  const p = document.getElementById('ap-freq-period')?.value || 'week';
  const days = apSelectedDays || [1, 3, 5];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dow = date.getDay();
    if (apFreq === 'daily' || (apFreq.startsWith('custom_') && p === 'day' && n === 1)) {
      scheduled.push(d);
    } else if (['3x_week','weekly','biweekly','custom_dow'].includes(apFreq) ||
               (apFreq.startsWith('custom_') && p === 'week')) {
      if (days.includes(dow)) scheduled.push(d);
    } else if (apFreq === 'monthly' || (apFreq.startsWith('custom_') && p === 'month')) {
      if (d === 1) scheduled.push(d);
    } else {
      if (days.includes(dow)) scheduled.push(d);
    }
  }
  return scheduled;
}

function apCalNav(dir) {
  apCalViewDate = new Date(apCalViewDate.getFullYear(), apCalViewDate.getMonth() + dir, 1);
  renderApCalendar();
}

function renderApCalendar() {
  const cal = document.getElementById('ap-mini-cal');
  if (!cal) return;
  const year = apCalViewDate.getFullYear();
  const month = apCalViewDate.getMonth();
  const today = new Date();
  const scheduledDays = getScheduledDaysInMonth(year, month);
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dNames = ['S','M','T','W','T','F','S'];

  const count = scheduledDays.length;
  const sumEl = document.getElementById('ap-cal-summary');
  if (sumEl) sumEl.textContent = count + ' post' + (count !== 1 ? 's' : '') + ' scheduled this month';

  let h = '<div class="ap-cal"><div class="ap-cal-header"><div class="ap-cal-header-title">' + mNames[month] + ' ' + year + '</div></div>';
  h += '<div class="ap-cal-grid">';
  dNames.forEach(d => { h += '<div class="ap-cal-dow">' + d + '</div>'; });
  for (let i = 0; i < firstDow; i++) h += '<div class="ap-cal-day empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = (d === today.getDate() && month === today.getMonth() && year === today.getFullYear());
    const isScheduled = scheduledDays.includes(d);
    const isPast = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let cls = 'ap-cal-day';
    if (isToday) cls += ' today';
    else if (isScheduled && !isPast) cls += ' scheduled';
    else if (isPast) cls += ' past';
    h += '<div class="' + cls + '"><span class="ap-cal-num">' + d + '</span></div>';
  }
  h += '</div></div>';
  cal.innerHTML = h;

  // Upcoming posts list
  const upEl = document.getElementById('ap-upcoming');
  if (upEl) {
    const now = new Date();
    const thisMonthDates = getScheduledDaysInMonth(now.getFullYear(), now.getMonth())
      .filter(d => d >= now.getDate())
      .map(d => new Date(now.getFullYear(), now.getMonth(), d));
    const nextMonthBase = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthDates = getScheduledDaysInMonth(nextMonthBase.getFullYear(), nextMonthBase.getMonth())
      .map(d => new Date(nextMonthBase.getFullYear(), nextMonthBase.getMonth(), d));
    const allDates = [...thisMonthDates, ...nextMonthDates].slice(0, 6);
    if (allDates.length) {
      upEl.innerHTML = '<div style="font-size:11px;font-weight:700;color:var(--ink4);margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em">Next scheduled posts</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
        allDates.map(d => {
          const lbl = d.toLocaleDateString('en-GB', {weekday:'short',day:'numeric',month:'short'});
          return '<span style="font-size:12px;padding:4px 11px;background:rgba(74,124,111,.1);border-radius:100px;color:var(--sage);font-weight:600">' + lbl + '</span>';
        }).join('') + '</div>';
    } else {
      upEl.innerHTML = '<div style="font-size:12px;color:var(--ink4)">No posts scheduled this or next month — adjust your frequency settings above.</div>';
    }
  }
}

// ── Backlink Monitor ─────────────────────────────────────────────────
let blData = [];

function loadBacklinks() {
  blData = JSON.parse(localStorage.getItem('cruise_backlinks') || '[]');
  renderBacklinks();
}

function saveBacklinks() {
  localStorage.setItem('cruise_backlinks', JSON.stringify(blData));
}

function renderBacklinks() {
  const totalEl = document.getElementById('bl-total');
  const dfPctEl = document.getElementById('bl-dofollow-pct');
  const domEl = document.getElementById('bl-domains');
  const total = blData.length;
  const dofollow = blData.filter(b => b.type !== 'nofollow').length;
  const domains = new Set(blData.map(b => { try { return new URL(b.source).hostname; } catch(e) { return b.source; } })).size;
  if (totalEl) totalEl.textContent = total || '—';
  if (dfPctEl) dfPctEl.textContent = total ? Math.round((dofollow / total) * 100) + '%' : '—%';
  if (domEl) domEl.textContent = domains || '—';

  const body = document.getElementById('bl-table-body');
  if (!body) return;
  if (blData.length === 0) {
    body.innerHTML = '<div class="empty-hero" style="padding:44px 24px"><div class="empty-hero-icon">🔗</div><div class="empty-hero-title">No backlinks tracked yet</div><div class="empty-hero-desc">Add backlinks you\'ve earned manually, or use the free tools above to discover your existing link profile.</div><button class="btn btn-primary" onclick="showAddBacklinkModal()" style="margin-top:16px">+ Add your first backlink</button></div>';
    return;
  }
  const badge = t => t==='nofollow'?'<span class="bl-badge nofollow">nofollow</span>':t==='guest'?'<span class="bl-badge guest">guest post</span>':'<span class="bl-badge dofollow">dofollow</span>';
  body.innerHTML = '<table style="width:100%;border-collapse:collapse"><thead><tr style="background:var(--cream2);border-bottom:1px solid var(--border)">' +
    '<th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Source</th>' +
    '<th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Anchor text</th>' +
    '<th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Type</th>' +
    '<th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Added</th>' +
    '<th style="padding:10px 16px;text-align:right;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)"></th>' +
    '</tr></thead><tbody>' +
    blData.map((bl, i) => {
      let host = bl.source; try { host = new URL(bl.source).hostname; } catch(e) {}
      const dt = bl.date ? new Date(bl.date).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'}) : '—';
      return '<tr style="border-bottom:1px solid var(--border)">' +
        '<td style="padding:12px 16px"><a href="' + bl.source + '" target="_blank" rel="noopener" style="color:var(--amber);font-weight:600;font-size:13px">' + host + '</a></td>' +
        '<td style="padding:12px 16px;font-size:13px;color:var(--ink2)">' + (bl.anchor || '—') + '</td>' +
        '<td style="padding:12px 16px;text-align:center">' + badge(bl.type) + '</td>' +
        '<td style="padding:12px 16px;font-size:12px;color:var(--ink4)">' + dt + '</td>' +
        '<td style="padding:12px 16px;text-align:right"><button onclick="removeBacklink(' + i + ')" style="background:none;border:none;color:var(--ink4);cursor:pointer;font-size:12px;padding:4px 8px;border-radius:6px" onmouseover="this.style.background=\'var(--cream3)\'" onmouseout="this.style.background=\'none\'">✕</button></td>' +
        '</tr>';
    }).join('') + '</tbody></table>';
}

function removeBacklink(idx) {
  blData.splice(idx, 1);
  saveBacklinks();
  renderBacklinks();
  toast('Backlink removed', true);
}

let _blModalEl = null;
function showAddBacklinkModal() {
  if (_blModalEl) _blModalEl.remove();
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';
  div.innerHTML = '<div style="background:#fff;border-radius:20px;padding:28px;width:100%;max-width:480px;box-shadow:0 40px 80px rgba(0,0,0,.22)">' +
    '<h3 style="font-family:var(--font-serif);font-size:18px;font-weight:600;color:var(--ink);margin:0 0 20px">Add backlink</h3>' +
    '<div style="margin-bottom:14px"><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink4);display:block;margin-bottom:6px">Source URL *</label><input id="_bl-src" class="kw-input" placeholder="https://example.com/article" style="width:100%"></div>' +
    '<div style="margin-bottom:14px"><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink4);display:block;margin-bottom:6px">Anchor text</label><input id="_bl-anc" class="kw-input" placeholder="e.g. tutoring London" style="width:100%"></div>' +
    '<div style="margin-bottom:20px"><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink4);display:block;margin-bottom:6px">Link type</label>' +
    '<select id="_bl-type" style="padding:10px 14px;border:1.5px solid var(--border2);border-radius:8px;font-size:13px;background:var(--cream2);width:100%"><option value="dofollow">Dofollow</option><option value="nofollow">Nofollow</option><option value="guest">Guest post</option></select></div>' +
    '<div style="display:flex;gap:10px;justify-content:flex-end"><button onclick="this.closest(\'[style*=fixed]\').remove()" class="btn btn-ghost">Cancel</button><button onclick="commitAddBacklink()" class="btn btn-primary">Add backlink</button></div></div>';
  document.body.appendChild(div);
  _blModalEl = div;
  div.addEventListener('click', e => { if (e.target === div) div.remove(); });
  setTimeout(() => document.getElementById('_bl-src')?.focus(), 50);
}

function commitAddBacklink() {
  const src = document.getElementById('_bl-src')?.value.trim();
  const anc = document.getElementById('_bl-anc')?.value.trim();
  const type = document.getElementById('_bl-type')?.value || 'dofollow';
  if (!src) { toast('Enter a source URL', false); return; }
  blData.unshift({ source: src, anchor: anc, type, date: new Date().toISOString() });
  saveBacklinks();
  renderBacklinks();
  _blModalEl?.remove();
  toast('Backlink added!', true);
}

function openBacklinkTool(tool) {
  const domain = (brand && brand.website) ? brand.website.replace(/^https?:\/\//, '') : '';
  const urls = {
    ahrefs: 'https://ahrefs.com/backlink-checker/?input=' + encodeURIComponent(domain),
    moz: 'https://moz.com/link-explorer',
    semrush: 'https://www.semrush.com/analytics/backlinks/?target=' + encodeURIComponent(domain),
    gsc: 'https://search.google.com/search-console'
  };
  window.open(urls[tool] || '#', '_blank');
}

async function generateLinkOpportunities() {
  const btn = document.getElementById('bl-opp-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Generating…'; }
  const el = document.getElementById('bl-opportunities');
  if (el) el.innerHTML = '<div class="card" style="padding:32px;text-align:center"><div class="gen-spinner"></div><div style="margin-top:14px;color:var(--ink4);font-size:13px">Finding link opportunities for your brand…</div></div>';
  try {
    const b = JSON.parse(localStorage.getItem('cruise_brand') || '{}');
    const prompt = 'You are an expert SEO link-building strategist. Business: "' + (b.name||'small business') + '" in the ' + (b.industry||'service') + ' industry. Website: ' + (b.website||'not provided') + '. Give exactly 5 specific, actionable link-building opportunities. For each return: type (guest_post/directory/resource_page/local/partnership/podcast), target (specific site, blog, or platform), pitch (one sentence pitch angle). Return ONLY a JSON array: [{"type":"...","target":"...","pitch":"..."}]';
    const raw = await callAI(prompt, 800);
    const opps = JSON.parse(raw);
    const icons = {guest_post:'✍️',directory:'📁',resource_page:'📚',local:'📍',partnership:'🤝',podcast:'🎙️'};
    if (el) el.innerHTML = '<div style="display:flex;flex-direction:column;gap:10px">' +
      opps.map(o => '<div class="card" style="padding:16px 18px"><div style="display:flex;align-items:start;gap:12px">' +
        '<span style="font-size:22px;line-height:1">' + (icons[o.type]||'🔗') + '</span>' +
        '<div><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4);margin-bottom:4px">' + (o.type||'opportunity').replace(/_/g,' ') + '</div>' +
        '<div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:4px">' + o.target + '</div>' +
        '<div style="font-size:12px;color:var(--ink3);line-height:1.55">' + o.pitch + '</div></div></div></div>'
      ).join('') + '</div>';
    toast('Link opportunities ready!', true);
  } catch(e) {
    if (el) el.innerHTML = '<div class="card" style="padding:20px 24px;color:var(--ink4);font-size:13px;text-align:center">Could not generate opportunities. Try again.</div>';
    toast('Error: ' + e.message, false);
  }
  if (btn) { btn.disabled = false; btn.textContent = 'Generate with AI ✦'; }
}

// ── Dashboard AI Insights (Copilot-style) ──────────────────────────
let _insightsLoaded = false;

function loadDashInsights(force) {
  if (_insightsLoaded && !force) return;
  const body = document.getElementById('dash-insights-cards');
  if (!body) return;

  const posts = JSON.parse(localStorage.getItem('cruise_queue') || '[]');
  const ranks = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  const blinks = JSON.parse(localStorage.getItem('cruise_backlinks') || '[]');
  const b = JSON.parse(localStorage.getItem('cruise_brand') || '{}');
  const wpConn = localStorage.getItem('cruise_wp_connection');
  const apData = JSON.parse(localStorage.getItem('cruise_autopilot') || '{}');

  const insights = [];

  if (!b.name) {
    insights.push({p:'high',cls:'alert',title:'Complete your brand profile',body:'The AI uses your brand profile for every piece of content it writes. Without it, posts will be generic and miss your target audience.',action:'Set up profile',nav:'profile'});
  }
  if (posts.length === 0) {
    insights.push({p:'high',cls:'alert',title:'Write your first SEO post',body:'You haven\'t published any content yet. Generate your first post to start ranking for your target keywords.',action:'Generate post →',nav:'engine'});
  } else if (posts.length < 5) {
    insights.push({p:'medium',cls:'warn',title:'Build your content volume',body:posts.length + ' post' + (posts.length>1?'s':'') + ' published. Aim for 10+ to establish topical authority and appear for more keyword variations.',action:'Write more posts',nav:'engine'});
  }
  if (ranks.length === 0) {
    insights.push({p:'high',cls:'alert',title:'Start tracking keyword rankings',body:'Without rank tracking you can\'t measure your SEO progress. Add your target keywords to see position estimates and trends.',action:'Track keywords →',nav:'ranks'});
  } else {
    const lowRank = ranks.filter(r => r.position > 20);
    if (lowRank.length > 2) {
      insights.push({p:'medium',cls:'warn',title:lowRank.length + ' keywords outside top 20',body:'These terms need stronger content targeting. Create dedicated posts with clear search intent matching to improve their positions.',action:'View rankings',nav:'ranks'});
    }
  }
  if (blinks.length === 0) {
    insights.push({p:'medium',cls:'warn',title:'Start tracking your backlinks',body:'Backlinks are the #1 Google ranking factor. Track the links you earn and find new link-building opportunities to accelerate growth.',action:'Monitor backlinks',nav:'backlinks'});
  }
  if (!wpConn) {
    insights.push({p:'medium',cls:'warn',title:'Connect WordPress for 1-click publishing',body:'Link your site to publish AI posts directly — with featured images, internal links, and schema markup added automatically.',action:'Connect site →',nav:'publish'});
  }
  if (posts.length >= 5 && !apData.enabled) {
    insights.push({p:'low',cls:'',title:'Enable Autopilot to scale content',body:'You\'ve built a solid base. Let Autopilot write and publish on a schedule — Google rewards consistent publishing with faster indexing.',action:'Set up autopilot →',nav:'autopilot'});
  }
  if (posts.length >= 3) {
    insights.push({p:'low',cls:'',title:'Build a topic cluster',body:'Group your posts into a content hub with a pillar page. This signals topical authority to Google and boosts rankings across all related terms.',action:'Build cluster',nav:'clusters'});
  }

  const final = insights.slice(0, 4);
  if (final.length === 0) {
    final.push({p:'low',cls:'',title:'You\'re on track! Keep publishing',body:'Your SEO foundation looks solid. Maintain consistency — publish 2–4 times per week and track rankings weekly to compound your results.',action:'Generate post →',nav:'engine'});
  }

  body.innerHTML = final.map(ins =>
    '<div class="insight-card ' + (ins.cls||'') + '">' +
    '<div class="insight-priority ' + ins.p + '">' + ins.p.toUpperCase() + ' PRIORITY</div>' +
    '<div class="insight-title">' + ins.title + '</div>' +
    '<div class="insight-body">' + ins.body + '</div>' +
    '<button onclick="nav(null,\'' + ins.nav + '\')" class="btn btn-ghost" style="font-size:12px;padding:5px 12px;margin-top:auto">' + ins.action + '</button>' +
    '</div>'
  ).join('');

  _insightsLoaded = true;
}

// ── v9 Nav hook ────────────────────────────────────────────────────
(function() {
  const _v9Nav = nav;
  nav = function(el, id) {
    _v9Nav(el, id);
    if (id === 'dashboard') { _insightsLoaded = false; setTimeout(loadDashInsights, 100); }
    if (id === 'backlinks') setTimeout(loadBacklinks, 50);
    if (id === 'autopilot') setTimeout(renderApCalendar, 100);
  };
})();

// Initial insights load on startup
setTimeout(loadDashInsights, 800);
// Init autopilot calendar on load
setTimeout(function() {
  if (typeof apSelectedDays !== 'undefined') {
    const saved = JSON.parse(localStorage.getItem('cruise_autopilot') || '{}');
    if (saved.selectedDays) apSelectedDays = saved.selectedDays;
  }
}, 200);

// ──────────────────────────────────────────────────────────────────
`;

const lastSC = html.lastIndexOf('</script>');
if (lastSC === -1) { console.error('❌ No </script> found'); process.exit(1); }
html = html.slice(0, lastSC) + v9JS + '</script>' + html.slice(lastSC + 9);
changes++;
console.log('✅ Inject v9 JS (autopilot calendar, backlinks, insights, nav hook)');

// Write output
fs.writeFileSync(htmlPath, html.replace(/\n/g, '\r\n'), 'utf8');
console.log(`\n✅ Done — ${changes} changes applied to app.html`);
