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
// 1. CSS — rank chart, history items, onboarding modal
// ══════════════════════════════════════════════════════════════════
rep(
`/* MOBILE */`,
`/* RANK CHART + HISTORY + ONBOARDING */
.rank-row{display:flex;align-items:center;gap:14px;padding:12px 18px;border-bottom:1px solid var(--border)}
.rank-row:last-child{border-bottom:none}
.rank-pos{font-size:22px;font-weight:900;font-family:var(--font-serif);line-height:1}
.rank-spark{display:flex;align-items:flex-end;gap:2px;height:28px;min-width:64px;flex-shrink:0}
.history-item{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .12s}
.history-item:hover{background:var(--cream2)}
.history-item:last-child{border-bottom:none}
.ob-overlay{position:fixed;inset:0;background:rgba(15,20,30,.6);z-index:3000;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s}
.ob-overlay.open{opacity:1;pointer-events:all}
.ob-box{background:var(--cream);border-radius:20px;padding:36px 40px;max-width:500px;width:90%;box-shadow:0 32px 96px rgba(0,0,0,.25);transform:translateY(24px);transition:transform .25s}
.ob-overlay.open .ob-box{transform:translateY(0)}
/* MOBILE */`,
'CSS: rank chart, history, onboarding');

// ══════════════════════════════════════════════════════════════════
// 2. Onboarding keyword modal HTML (before dashboard view)
// ══════════════════════════════════════════════════════════════════
rep(
`    <div class="view active" id="view-dashboard">`,
`    <!-- ONBOARDING: keyword tracking setup -->
    <div class="ob-overlay" id="onboarding-kw-modal">
      <div class="ob-box">
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-size:40px;margin-bottom:10px">🚀</div>
          <h2 style="font-family:var(--font-serif);font-size:22px;font-weight:800;color:var(--ink);margin:0 0 8px">Welcome to Cruise SEO</h2>
          <div style="font-size:14px;color:var(--ink4);line-height:1.65">Let's track the keywords that matter most to your business so you can measure real SEO progress over time.</div>
        </div>
        <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4);display:block;margin-bottom:8px">Keywords to track <span style="text-transform:none;font-weight:400">(comma separated)</span></label>
        <textarea id="ob-kw-input" class="kw-input" placeholder="e.g. tutoring London, GCSE revision help, online maths tutor" style="width:100%;min-height:76px;font-size:14px;padding:12px 14px;resize:vertical;font-family:inherit;box-sizing:border-box"></textarea>
        <div style="font-size:12px;color:var(--ink4);margin:8px 0 20px;line-height:1.55">💡 Think about what your ideal customers type into Google. Add 3–5 keywords — you can always add more in the Rank Tracker.</div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-ghost" onclick="closeOnboardingModal()" style="flex:1">Skip for now</button>
          <button class="btn btn-primary" onclick="submitOnboardingKeywords()" style="flex:2;justify-content:center">Start tracking →</button>
        </div>
      </div>
    </div>

    <div class="view active" id="view-dashboard">`,
'Onboarding modal HTML');

// ══════════════════════════════════════════════════════════════════
// 3. Dashboard: keyword ranking progress widget
// ══════════════════════════════════════════════════════════════════
rep(
`      <div class="section-hd" style="margin-top:0"><h2>Recent content</h2><div style="display:flex;gap:8px"><button class="btn btn-ghost" onclick="generatePDFReport()" style="font-size:12px">↓ Export report</button><button class="btn btn-ghost" onclick="nav(null,'posts')">View all</button></div></div>`,
`      <!-- Keyword Ranking Progress -->
      <div id="dash-rank-widget" style="display:none;margin-bottom:24px">
        <div class="section-hd" style="margin-top:0">
          <div>
            <h2>Keyword Rankings</h2>
            <div style="font-size:12px;color:var(--ink4);margin-top:2px">AI-estimated Google positions — shows your progress over time</div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost" onclick="estimateRankings()" style="font-size:12px">↻ Refresh</button>
            <button class="btn btn-ghost" onclick="nav(null,'ranks')" style="font-size:12px">View all →</button>
          </div>
        </div>
        <div class="card" style="padding:0;overflow:hidden">
          <div id="dash-rank-rows"></div>
          <div style="padding:11px 18px;border-top:1px solid var(--border);font-size:12px;color:var(--ink4)">
            <a href="#" onclick="nav(null,'ranks');return false" style="color:var(--amber);font-weight:600">+ Add more keywords</a> to expand your ranking profile
          </div>
        </div>
      </div>
      <!-- No-keywords prompt -->
      <div id="dash-rank-empty" style="display:none;margin-bottom:24px">
        <div class="card" style="padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px">
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:4px">Track your keyword rankings</div>
            <div style="font-size:13px;color:var(--ink4)">Add keywords to see your Google position estimates and measure improvement over time.</div>
          </div>
          <button class="btn btn-primary" onclick="nav(null,'ranks')" style="white-space:nowrap">Add keywords →</button>
        </div>
      </div>
      <div class="section-hd" style="margin-top:0"><h2>Recent content</h2><div style="display:flex;gap:8px"><button class="btn btn-ghost" onclick="generatePDFReport()" style="font-size:12px">↓ Export report</button><button class="btn btn-ghost" onclick="nav(null,'posts')">View all</button></div></div>`,
'Dashboard: ranking progress widget');

// ══════════════════════════════════════════════════════════════════
// 4. Keywords view: search history container (above loading div)
// ══════════════════════════════════════════════════════════════════
rep(
`      <div id="kw-loading" style="display:none;padding:40px;text-align:center"><div class="gen-spinner"></div>`,
`      <div id="kw-history-wrap" style="display:none;margin-bottom:8px"></div>
      <div id="kw-loading" style="display:none;padding:40px;text-align:center"><div class="gen-spinner"></div>`,
'Keywords view: history container');

// ══════════════════════════════════════════════════════════════════
// 5. Audit view: history container (below last-run label)
// ══════════════════════════════════════════════════════════════════
rep(
`      <div id="audit-last-run" style="font-size:12px;color:var(--ink4);margin-bottom:16px"></div>`,
`      <div id="audit-last-run" style="font-size:12px;color:var(--ink4);margin-bottom:8px"></div>
      <div id="audit-history-wrap" style="margin-bottom:16px"></div>`,
'Audit view: history container');

// ══════════════════════════════════════════════════════════════════
// 6. estimateRankings: save rank log + render dashboard chart
// ══════════════════════════════════════════════════════════════════
rep(
`    localStorage.setItem('cruise_rank_history', JSON.stringify(updated));
    renderRankTable(updated);
    toast('Rankings updated!', true);`,
`    localStorage.setItem('cruise_rank_history', JSON.stringify(updated));
    saveRankLog(estimates);
    renderRankTable(updated);
    renderDashRankChart();
    toast('Rankings updated!', true);`,
'estimateRankings: save rank log + chart');

// ══════════════════════════════════════════════════════════════════
// 7. runKwResearch: save to history after results render
// ══════════════════════════════════════════════════════════════════
rep(
`    document.getElementById('kw-stat-vol').textContent = kd.estimated_monthly_searches || '—';`,
`    saveKwToHistory(kw, kd.estimated_monthly_searches, kd.difficulty_score);
    renderKwHistory();
    document.getElementById('kw-stat-vol').textContent = kd.estimated_monthly_searches || '—';`,
'runKwResearch: save to history');

// ══════════════════════════════════════════════════════════════════
// 8. runAudit: save full audit log
// ══════════════════════════════════════════════════════════════════
rep(
`    renderScoreHistory();
    document.getElementById('audit-pre-state').style.display = 'none';`,
`    renderScoreHistory();
    saveFullAuditLog(d);
    document.getElementById('audit-pre-state').style.display = 'none';`,
'runAudit: save full audit log');

// ══════════════════════════════════════════════════════════════════
// 9. initTrialSystem: trigger onboarding modal on first visit
// ══════════════════════════════════════════════════════════════════
rep(
`  renderTrialBanner(plan);
  renderOnboardingChecklist();
}`,
`  renderTrialBanner(plan);
  renderOnboardingChecklist();
  setTimeout(maybeShowOnboarding, 1500);
}`,
'initTrialSystem: trigger onboarding');

// ══════════════════════════════════════════════════════════════════
// 10. renderAll: render ranking chart + audit history on load
// ══════════════════════════════════════════════════════════════════
rep(
`  updateStats();
}`,
`  updateStats();
  renderDashRankChart();
  renderAuditHistory();
}`,
'renderAll: render chart + audit history on init');

// ══════════════════════════════════════════════════════════════════
// 11. nav(): hook history renders on view switch
// ══════════════════════════════════════════════════════════════════
rep(
`  if (id === 'social-connect') { loadSocialState(); }`,
`  if (id === 'social-connect') { loadSocialState(); }
  if (id === 'keywords') { setTimeout(renderKwHistory, 50); }
  if (id === 'audit') { renderAuditHistory(); }
  if (id === 'dashboard') { renderDashRankChart(); }`,
'nav(): render history + chart on view switch');

// ══════════════════════════════════════════════════════════════════
// 12. All new JS functions
// Note: backticks in inserted JS are written as \` and ${ as \${
// ══════════════════════════════════════════════════════════════════
rep(
`// ══ DARK MODE ══════════════════════════════════════════════════════`,
`// ══════════════════════════════════════════════════════════════════
// KEYWORD SEARCH HISTORY
// ══════════════════════════════════════════════════════════════════
function saveKwToHistory(query, vol, difficulty) {
  const hist = JSON.parse(localStorage.getItem('cruise_kw_history') || '[]');
  const existing = hist.findIndex(h => h.query.toLowerCase() === query.toLowerCase());
  const entry = {
    query,
    date: new Date().toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'}),
    vol: vol || '—',
    difficulty: difficulty || '—',
    ts: Date.now()
  };
  if (existing >= 0) hist.splice(existing, 1);
  hist.unshift(entry);
  if (hist.length > 20) hist.length = 20;
  localStorage.setItem('cruise_kw_history', JSON.stringify(hist));
}

function setKwAndSearch(kw) {
  const el = document.getElementById('kwInput');
  if (el) el.value = kw;
  runKwResearch();
}

function renderKwHistory() {
  const el = document.getElementById('kw-history-wrap');
  if (!el) return;
  const hist = JSON.parse(localStorage.getItem('cruise_kw_history') || '[]');
  if (!hist.length) { el.style.display = 'none'; return; }
  el.style.display = '';
  const rows = hist.slice(0, 15).map(h => {
    const safeQ = h.query.replace(/"/g, '').replace(/'/g, '');
    return '<div class="history-item" data-kw="' + safeQ + '" onclick="setKwAndSearch(this.dataset.kw)">' +
      '<div>' +
        '<div style="font-size:13px;font-weight:600;color:var(--ink)">' + h.query + '</div>' +
        '<div style="font-size:11px;color:var(--ink4);margin-top:2px">' + h.date + ' &nbsp;·&nbsp; Vol: ' + h.vol + ' &nbsp;·&nbsp; Difficulty: ' + h.difficulty + '/100</div>' +
      '</div>' +
      '<span style="font-size:12px;color:var(--amber);font-weight:600;flex-shrink:0">Search again →</span>' +
    '</div>';
  }).join('');
  el.innerHTML =
    '<div class="section-hd" style="margin-top:0"><h2>Recent searches</h2>' +
    '<button class="btn btn-ghost" onclick="clearKwHistory()" style="font-size:11px;padding:4px 10px">Clear history</button></div>' +
    '<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">' + rows + '</div>';
}

function clearKwHistory() {
  localStorage.removeItem('cruise_kw_history');
  renderKwHistory();
  toast('Search history cleared', true);
}

// ══════════════════════════════════════════════════════════════════
// AUDIT HISTORY LOG
// ══════════════════════════════════════════════════════════════════
function saveFullAuditLog(d) {
  const log = JSON.parse(localStorage.getItem('cruise_audit_log') || '[]');
  log.unshift({
    date: new Date().toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'}),
    ts: Date.now(),
    score: d.health_score,
    errors: d.error_count,
    warnings: d.warning_count,
    pages: d.pages_checked
  });
  if (log.length > 24) log.length = 24;
  localStorage.setItem('cruise_audit_log', JSON.stringify(log));
  renderAuditHistory();
}

function renderAuditHistory() {
  const el = document.getElementById('audit-history-wrap');
  if (!el) return;
  const log = JSON.parse(localStorage.getItem('cruise_audit_log') || '[]');
  if (!log.length) { el.innerHTML = ''; return; }
  const scoreC = s => s >= 80 ? 'var(--sage)' : s >= 60 ? 'var(--amber)' : '#C0304F';
  const rows = log.map((a, i) => {
    const prev = log[i + 1];
    const delta = prev ? a.score - prev.score : null;
    let dHtml;
    if (delta === null) dHtml = '<span style="color:var(--ink4)">—</span>';
    else if (delta > 0) dHtml = '<span style="color:var(--sage);font-weight:700">+' + delta + '</span>';
    else if (delta < 0) dHtml = '<span style="color:#C0304F;font-weight:700">' + delta + '</span>';
    else dHtml = '<span style="color:var(--ink4)">→</span>';
    return '<tr style="border-bottom:1px solid var(--border)">' +
      '<td style="padding:10px 16px;font-size:13px;color:var(--ink2)">' + a.date + '</td>' +
      '<td style="padding:10px 16px;text-align:center;font-size:16px;font-weight:900;color:' + scoreC(a.score) + '">' + a.score + '<span style="font-size:11px;font-weight:400;color:var(--ink4)">/100</span></td>' +
      '<td style="padding:10px 16px;text-align:center;font-size:13px;color:#C0304F;font-weight:700">' + a.errors + '</td>' +
      '<td style="padding:10px 16px;text-align:center;font-size:13px;color:var(--amber);font-weight:700">' + a.warnings + '</td>' +
      '<td style="padding:10px 16px;text-align:center;font-size:13px;color:var(--ink3)">' + a.pages + '</td>' +
      '<td style="padding:10px 16px;text-align:center;font-size:13px">' + dHtml + '</td>' +
    '</tr>';
  }).join('');
  el.innerHTML =
    '<div class="section-hd" style="margin-top:0"><h2>Audit history</h2>' +
    '<div style="font-size:12px;color:var(--ink4)">Score trend across all runs</div></div>' +
    '<div class="card" style="padding:0;overflow:hidden">' +
      '<table style="width:100%;border-collapse:collapse">' +
        '<thead><tr style="background:var(--cream2);border-bottom:1px solid var(--border)">' +
          '<th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Date</th>' +
          '<th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Health score</th>' +
          '<th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Errors</th>' +
          '<th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Warnings</th>' +
          '<th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Pages</th>' +
          '<th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Change</th>' +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
    '</div>';
}

// ══════════════════════════════════════════════════════════════════
// RANK LOG — position history per keyword over time
// ══════════════════════════════════════════════════════════════════
function saveRankLog(estimates) {
  if (!Array.isArray(estimates)) return;
  const log = JSON.parse(localStorage.getItem('cruise_rank_log') || '{}');
  const today = new Date().toISOString().slice(0, 10);
  estimates.forEach(e => {
    if (!e.keyword || !e.estimated_position) return;
    const kw = e.keyword.toLowerCase();
    if (!log[kw]) log[kw] = [];
    const idx = log[kw].findIndex(x => x.date === today);
    const entry = { date: today, position: e.estimated_position };
    if (idx >= 0) log[kw][idx] = entry;
    else log[kw].push(entry);
    if (log[kw].length > 12) log[kw] = log[kw].slice(-12);
  });
  localStorage.setItem('cruise_rank_log', JSON.stringify(log));
}

// ══════════════════════════════════════════════════════════════════
// DASHBOARD RANKING CHART
// ══════════════════════════════════════════════════════════════════
function renderDashRankChart() {
  const widget = document.getElementById('dash-rank-widget');
  const empty = document.getElementById('dash-rank-empty');
  const rowsEl = document.getElementById('dash-rank-rows');
  if (!rowsEl) return;

  const tracked = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  const log = JSON.parse(localStorage.getItem('cruise_rank_log') || '{}');

  if (!tracked.length) {
    if (widget) widget.style.display = 'none';
    if (empty) empty.style.display = '';
    return;
  }
  if (widget) widget.style.display = '';
  if (empty) empty.style.display = 'none';

  const posColor = pos => pos <= 3 ? '#16a34a' : pos <= 10 ? 'var(--sage)' : pos <= 20 ? 'var(--amber)' : pos <= 50 ? '#e07a10' : '#C0304F';
  const posLabel = pos => pos <= 3 ? 'Top 3!' : pos <= 10 ? 'Page 1' : pos <= 20 ? 'Pages 1-2' : pos <= 50 ? 'Pages 3-5' : 'Below p.5';

  rowsEl.innerHTML = tracked.slice(0, 6).map(r => {
    const pos = r.position;
    const kwKey = r.keyword.toLowerCase();
    const hist = (log[kwKey] || []).slice(-8);

    // Sparkline bars — height represents rank quality (higher = better)
    let sparkBars = '';
    if (hist.length) {
      sparkBars = hist.map(pt => {
        const barH = Math.max(3, Math.round((100 - Math.min(pt.position, 100)) / 100 * 26));
        const col = pt.position <= 10 ? 'var(--sage)' : pt.position <= 30 ? 'var(--amber)' : '#e07a10';
        return '<div style="width:5px;height:' + barH + 'px;background:' + col + ';border-radius:2px;flex-shrink:0"></div>';
      }).join('');
    } else {
      sparkBars = '<div style="font-size:10px;color:var(--ink4);line-height:1.3;align-self:center;white-space:nowrap">No data<br>yet</div>';
    }

    // Change from last two history points
    const latestH = hist[hist.length - 1];
    const prevH = hist[hist.length - 2];
    const change = latestH && prevH ? prevH.position - latestH.position : (r.change || 0);
    let changeHtml = '';
    if (pos) {
      if (change > 0) changeHtml = '<div style="font-size:11px;color:var(--sage);font-weight:700;margin-top:1px">↑' + change + ' improved</div>';
      else if (change < 0) changeHtml = '<div style="font-size:11px;color:#C0304F;font-weight:700;margin-top:1px">↓' + Math.abs(change) + ' dropped</div>';
      else changeHtml = '<div style="font-size:11px;color:var(--ink4);margin-top:1px">→ no change</div>';
    }

    return '<div class="rank-row">' +
      '<div style="flex:1;min-width:0">' +
        '<div style="font-size:13px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + r.keyword + '</div>' +
        '<div style="font-size:11px;color:var(--ink4);margin-top:2px">' + (pos ? posLabel(pos) : 'Not estimated yet') + '</div>' +
      '</div>' +
      '<div class="rank-spark">' + sparkBars + '</div>' +
      '<div style="text-align:right;min-width:56px;flex-shrink:0">' +
        '<div class="rank-pos" style="color:' + (pos ? posColor(pos) : 'var(--ink4)') + '">' + (pos ? '#' + pos : '—') + '</div>' +
        changeHtml +
      '</div>' +
    '</div>';
  }).join('');
}

// ══════════════════════════════════════════════════════════════════
// ONBOARDING MODAL
// ══════════════════════════════════════════════════════════════════
function maybeShowOnboarding() {
  if (localStorage.getItem('cruise_onboarded')) return;
  const tracked = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  if (tracked.length) { localStorage.setItem('cruise_onboarded', '1'); return; }
  const modal = document.getElementById('onboarding-kw-modal');
  if (modal) modal.classList.add('open');
}

function closeOnboardingModal() {
  const modal = document.getElementById('onboarding-kw-modal');
  if (modal) modal.classList.remove('open');
  localStorage.setItem('cruise_onboarded', '1');
}

function submitOnboardingKeywords() {
  const input = document.getElementById('ob-kw-input');
  const val = input ? input.value.trim() : '';
  if (!val) { toast('Enter at least one keyword to track', false); return; }
  const kws = val.split(',').map(s => s.trim()).filter(Boolean);
  if (!kws.length) return;
  const saved = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  kws.forEach(kw => {
    if (!saved.find(r => r.keyword.toLowerCase() === kw.toLowerCase())) {
      saved.push({ keyword: kw, position: null, change: 0, difficulty: '—', opportunity: '—', ts: null });
    }
  });
  localStorage.setItem('cruise_rank_history', JSON.stringify(saved));
  localStorage.setItem('cruise_onboarded', '1');
  closeOnboardingModal();
  toast('Keywords saved — estimating your positions now...', true);
  renderDashRankChart();
  estimateRankings();
}

// ══ DARK MODE ══════════════════════════════════════════════════════`,
'All new JS: history, rank chart, onboarding');

// ══════════════════════════════════════════════════════════════════
// Write file
// ══════════════════════════════════════════════════════════════════
fs.writeFileSync(p, c.replace(/\n/g, '\r\n'), 'utf8');
console.log(`\nDone — ${hits} replacements applied. Lines: ${c.split('\n').length}`);
