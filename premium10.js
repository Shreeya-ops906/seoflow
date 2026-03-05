// premium10.js — Stripe × Bark UI redesign for Cruise SEO
// Applies a cool blue-tinted palette, deep navy sidebar, vibrant blue primary,
// and a dark gradient welcome banner to the dashboard.

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app.html');
let html = fs.readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n');

const changes = [];
function apply(name, oldStr, newStr) {
  if (!html.includes(oldStr)) { console.error(`❌ NOT FOUND: ${name}`); return; }
  html = html.replace(oldStr, newStr);
  console.log(`✅ ${name}`); changes.push(name);
}

// ──────────────────────────────────────────────────────────────────────────────
// 1. INJECT STRIPE × BARK CSS OVERRIDE BLOCK
// ──────────────────────────────────────────────────────────────────────────────
const V10_CSS = `<style id="cruise-stripe-bark-v10">
/* ═══════════════════════════════════════════════════════════
   CRUISE SEO — Stripe × Bark Premium UI  (v10)
   ═══════════════════════════════════════════════════════════ */
:root {
  --cream: #F4F7FD;
  --cream2: #EBF0F8;
  --cream3: #D8E2F4;
  --surface: #FFFFFF;
  --ink: #0D1B35;
  --ink2: #2C3E5B;
  --ink3: #5E6F8A;
  --ink4: #8FA2BD;
  --amber: #2E79F5;
  --amber-l: #EBF3FF;
  --amber-d: #1A5ED4;
  --sage: #0EA87A;
  --sage-l: #E3FBF2;
  --border: rgba(13,27,53,.09);
  --border2: rgba(13,27,53,.16);
  --bg: var(--cream);
  --bg2: var(--cream2);
  --ac: var(--amber);
  --tx: var(--ink);
  --tx2: var(--ink2);
  --tx3: var(--ink3);
  --tx4: var(--ink4);
  --green: var(--sage);
  --green-l: var(--sage-l);
  --sh-xs: 0 1px 2px rgba(13,27,53,.04);
  --sh-sm: 0 1px 3px rgba(13,27,53,.05), 0 4px 16px rgba(13,27,53,.04);
  --sh-md: 0 4px 8px rgba(13,27,53,.07), 0 16px 40px rgba(13,27,53,.05);
  --sh-lg: 0 12px 24px rgba(13,27,53,.1), 0 48px 96px rgba(13,27,53,.08);
}

/* ── Body + content ─────────────────────────────────────────── */
body { background: var(--cream); color: var(--ink); }
.content { background: #F4F7FD; }

/* ── Sidebar — Stripe deep navy ─────────────────────────────── */
.sidebar {
  background: linear-gradient(180deg, #0C1424 0%, #0F1A30 100%);
  box-shadow: 1px 0 0 rgba(255,255,255,.04), 4px 0 24px rgba(0,0,0,.15);
}
.sb-logo { border-bottom: 1px solid rgba(255,255,255,.05); }
.sb-logo-mark {
  background: linear-gradient(145deg, #4190F8 0%, #1A5ED4 100%);
  box-shadow: 0 2px 12px rgba(46,121,245,.45);
  border-radius: 9px;
}
.sb-user { border-bottom: 1px solid rgba(255,255,255,.04); }
.sb-avatar {
  background: linear-gradient(135deg, #4190F8 0%, #1A5ED4 100%);
  box-shadow: 0 0 0 1.5px rgba(255,255,255,.1);
}
.nav-section-label { color: rgba(255,255,255,.2); }
.nav-item { color: rgba(255,255,255,.4); }
.nav-item:hover { background: rgba(255,255,255,.06); color: rgba(255,255,255,.8); }
.nav-item.active { background: rgba(46,121,245,.15); color: #fff; }
.nav-item.active::before { background: #4190F8; }
.sb-footer { border-top: 1px solid rgba(255,255,255,.05); }

/* ── Top bar ─────────────────────────────────────────────────── */
.topbar {
  background: rgba(244,247,253,.94);
  border-bottom: 1px solid rgba(13,27,53,.07);
  backdrop-filter: blur(12px);
}

/* ── Primary button — Stripe vibrant blue ────────────────────── */
.btn-primary {
  background: linear-gradient(160deg, #4190F8 0%, #1E6AE4 100%);
  box-shadow: 0 1px 3px rgba(46,121,245,.3), 0 4px 14px rgba(46,121,245,.15);
  border: none;
}
.btn-primary:hover {
  background: linear-gradient(160deg, #3585F8 0%, #1560DA 100%);
  box-shadow: 0 2px 6px rgba(46,121,245,.4), 0 8px 24px rgba(46,121,245,.2);
  transform: translateY(-1px);
}
.btn-primary:active { transform: translateY(0); }

/* ── Ghost button ────────────────────────────────────────────── */
.btn-ghost { border-color: rgba(13,27,53,.12); color: var(--ink2); }
.btn-ghost:hover { border-color: rgba(46,121,245,.35); color: var(--amber); background: rgba(46,121,245,.05); }

/* ── Cards ───────────────────────────────────────────────────── */
.card { border-color: rgba(13,27,53,.08); box-shadow: var(--sh-sm); }
.card:hover { box-shadow: var(--sh-md); }

/* ── Stat cards ──────────────────────────────────────────────── */
.stat-card {
  background: #fff;
  border: 1px solid rgba(13,27,53,.08);
  box-shadow: var(--sh-sm);
  transition: box-shadow .15s ease, transform .15s ease, border-color .15s ease;
}
.stat-card:hover {
  box-shadow: var(--sh-md);
  transform: translateY(-2px);
  border-color: rgba(46,121,245,.2);
}

/* ── Table rows hover ────────────────────────────────────────── */
.rank-row:hover,
.history-item:hover,
.audit-fix-item:hover,
.backlink-prospect:hover { background: rgba(46,121,245,.04); }

/* ── Input focus ─────────────────────────────────────────────── */
input:focus, textarea:focus, select:focus {
  border-color: #2E79F5 !important;
  box-shadow: 0 0 0 3px rgba(46,121,245,.1) !important;
  outline: none;
}

/* ── Tone / template chips ───────────────────────────────────── */
.tone-chip.on, .template-chip.active {
  border-color: var(--amber);
  background: rgba(46,121,245,.06);
  color: var(--amber-d);
  box-shadow: 0 2px 8px rgba(46,121,245,.14);
}

/* ── Trial banner ────────────────────────────────────────────── */
.trial-banner {
  background: linear-gradient(135deg, rgba(46,121,245,.07) 0%, rgba(14,168,122,.05) 100%);
  border-color: rgba(46,121,245,.14);
}

/* ── Plan card featured ──────────────────────────────────────── */
.plan-card.featured {
  background: linear-gradient(145deg, rgba(46,121,245,.08) 0%, rgba(46,121,245,.02) 100%);
  border-color: rgba(46,121,245,.18) !important;
}

/* ── Pub card ────────────────────────────────────────────────── */
.pub-card:hover { border-color: rgba(46,121,245,.18) !important; }
.pub-card.connected { border-color: rgba(14,168,122,.2) !important; background: rgba(14,168,122,.03); }

/* ── Competitor saved item ───────────────────────────────────── */
.comp-saved-item:hover { border-color: var(--amber); }

/* ── CMS type btn ────────────────────────────────────────────── */
.cms-type-btn.active { border-color: var(--amber); background: rgba(46,121,245,.05); color: var(--amber-d); }

/* ── Scrollbar ───────────────────────────────────────────────── */
::-webkit-scrollbar-thumb { background: rgba(13,27,53,.12); }
::-webkit-scrollbar-thumb:hover { background: rgba(13,27,53,.22); }

/* ── Shimmer skeleton ────────────────────────────────────────── */
.shimmer { background: linear-gradient(90deg, var(--cream2) 25%, #dde5f5 50%, var(--cream2) 75%); }

/* ── Top loading bar ─────────────────────────────────────────── */
#cruise-top-bar { background: linear-gradient(90deg, #4190F8, #0EA87A, #4190F8); background-size: 200% 100%; }

/* ── Insight card ────────────────────────────────────────────── */
.insight-priority.medium { color: var(--amber); }
.insight-priority.low { color: var(--sage); }
.insight-card.warn::before { background: var(--amber); }
.insight-card::before { background: var(--sage); }

/* ── Backlink badges ─────────────────────────────────────────── */
.bl-badge.dofollow { background: rgba(14,168,122,.12); color: var(--sage); }
.bl-badge.guest { background: rgba(46,121,245,.1); color: var(--amber-d); }

/* ── Tool pills ──────────────────────────────────────────────── */
.tool-pill:hover { border-color: var(--amber); color: var(--amber); background: rgba(46,121,245,.05); }

/* ── Autopilot calendar ──────────────────────────────────────── */
.ap-cal-day.scheduled .ap-cal-num { background: var(--sage); }
.ap-dow-label:has(input:checked) { background: var(--sage); border-color: var(--sage); }

/* ── Section headings ────────────────────────────────────────── */
.section-hd h2 { color: var(--ink); }

/* ── Dashboard welcome banner ────────────────────────────────── */
#dash-welcome-bar {
  background: linear-gradient(130deg, #0C1424 0%, #0E2040 45%, #092B1D 100%);
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.06);
  box-shadow: 0 4px 24px rgba(13,27,53,.2);
}
#dash-welcome-bar::before {
  content: '';
  position: absolute;
  top: -60px; right: -40px;
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(46,121,245,.18) 0%, transparent 70%);
  pointer-events: none;
}
#dash-welcome-bar::after {
  content: '';
  position: absolute;
  bottom: -40px; left: 30%;
  width: 160px; height: 160px;
  background: radial-gradient(circle, rgba(14,168,122,.12) 0%, transparent 70%);
  pointer-events: none;
}
.dash-welcome-left { position: relative; z-index: 1; }
.dash-welcome-greeting {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 5px;
  letter-spacing: -.025em;
}
.dash-welcome-sub {
  font-size: 13px;
  color: rgba(255,255,255,.5);
  line-height: 1.5;
}
.dash-welcome-actions {
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}
.dash-welcome-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all .15s ease;
  font-family: var(--font-ui);
  white-space: nowrap;
  text-decoration: none;
}
.dash-welcome-btn.primary {
  background: linear-gradient(160deg, #4190F8 0%, #1E6AE4 100%);
  color: #fff;
  box-shadow: 0 2px 12px rgba(46,121,245,.35);
}
.dash-welcome-btn.primary:hover {
  background: linear-gradient(160deg, #3585F8 0%, #1560DA 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 18px rgba(46,121,245,.45);
}
.dash-welcome-btn.secondary {
  background: rgba(255,255,255,.08);
  color: rgba(255,255,255,.75);
  border: 1px solid rgba(255,255,255,.12);
}
.dash-welcome-btn.secondary:hover {
  background: rgba(255,255,255,.12);
  color: rgba(255,255,255,.9);
}
@media (max-width: 768px) {
  #dash-welcome-bar { flex-direction: column; align-items: flex-start; gap: 16px; }
  .dash-welcome-actions { flex-wrap: wrap; }
}
</style>
`;

apply('Inject cruise-stripe-bark-v10 style block',
`/* ─────────────────────────────────────────────────────────────────── */
</style>
</head>`,
`/* ─────────────────────────────────────────────────────────────────── */
</style>
${V10_CSS}
</head>`
);

// ──────────────────────────────────────────────────────────────────────────────
// 2. INJECT DASHBOARD WELCOME BANNER HTML
// ──────────────────────────────────────────────────────────────────────────────
const WELCOME_BANNER_HTML = `      <div id="dash-welcome-bar">
        <div class="dash-welcome-left">
          <div class="dash-welcome-greeting" id="dash-greeting-text">Good morning, <span class="user-name">there</span> ✦</div>
          <div class="dash-welcome-sub">Your SEO dashboard is ready — let's grow your traffic.</div>
        </div>
        <div class="dash-welcome-actions">
          <button class="dash-welcome-btn primary" onclick="nav(null,'engine')">✦ Generate post</button>
          <button class="dash-welcome-btn secondary" onclick="nav(null,'audit')">◈ Run audit</button>
        </div>
      </div>`;

apply('Add dashboard welcome banner',
`      <div id="trial-banner-wrap"></div>
      <div id="onboarding-checklist"`,
`      <div id="trial-banner-wrap"></div>
${WELCOME_BANNER_HTML}
      <div id="onboarding-checklist"`
);

// ──────────────────────────────────────────────────────────────────────────────
// 3. INJECT v10 JS — time-based greeting
// ──────────────────────────────────────────────────────────────────────────────
const V10_JS = `<script>
// ── v10 JS — time-based greeting ────────────────────────────────
(function() {
  function setGreeting() {
    var el = document.getElementById('dash-greeting-text');
    if (!el) return;
    var h = new Date().getHours();
    var word = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    var name = window._cruiseName || (el.querySelector('.user-name') ? el.querySelector('.user-name').textContent : 'there');
    if (name === 'Loading...' || name === '?') name = 'there';
    el.innerHTML = word + ', <span class="user-name">' + name + '</span> ✦';
  }
  setGreeting();
  setTimeout(setGreeting, 1500);
})();
</script>
`;

apply('Inject v10 JS greeting',
`// ──────────────────────────────────────────────────────────────────
</script>
</body>`,
`// ──────────────────────────────────────────────────────────────────
</script>
${V10_JS}
</body>`
);

// ──────────────────────────────────────────────────────────────────────────────
// WRITE
// ──────────────────────────────────────────────────────────────────────────────
fs.writeFileSync(FILE, html.replace(/\n/g, '\r\n'), 'utf8');
console.log(`\n✅ premium10 complete — ${changes.length} changes applied`);
