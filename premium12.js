// premium12.js — 3-day trial, urgent trial banner, dashboard upgrade CTAs

const fs   = require('fs');
const path = require('path');
const FILE = path.join(__dirname, 'app.html');
let html   = fs.readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n');

const changes = [];
function apply(name, oldStr, newStr) {
  if (!html.includes(oldStr)) { console.error(`❌ NOT FOUND: ${name}`); return; }
  html = html.replace(oldStr, newStr);
  console.log(`✅ ${name}`); changes.push(name);
}

// ──────────────────────────────────────────────────────────────────────────────
// 1. REPLACE renderTrialBanner — 3-day urgency + dashboard upgrade CTA
// ──────────────────────────────────────────────────────────────────────────────
apply('Replace renderTrialBanner with 3-day urgency version',
`function renderTrialBanner(plan) {
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
}`,
`function renderTrialBanner(plan) {
  const wrap = document.getElementById('trial-banner-wrap');
  const cta  = document.getElementById('dash-trial-cta');
  if (!plan || !wrap) return;

  if (plan.type === 'pro') {
    wrap.innerHTML = '';
    if (cta) cta.style.display = 'none';
    return;
  }

  // Calculate time remaining (3-day trial)
  const trialMs  = 3 * 24 * 60 * 60 * 1000;
  const elapsed  = Date.now() - plan.start;
  const msLeft   = Math.max(0, trialMs - elapsed);
  const daysLeft = Math.floor(msLeft / 86400000);
  const hrsLeft  = Math.floor((msLeft % 86400000) / 3600000);

  let timeStr, urgency;
  if (msLeft <= 0)        { timeStr = 'Expired';                                         urgency = 'expired';  }
  else if (daysLeft >= 2) { timeStr = daysLeft + ' days';                                urgency = 'normal';   }
  else if (daysLeft === 1){ timeStr = '1 day';                                           urgency = 'warning';  }
  else if (hrsLeft > 0)   { timeStr = hrsLeft + ' hour' + (hrsLeft !== 1 ? 's' : '');  urgency = 'critical'; }
  else                    { timeStr = 'Less than 1 hour';                                urgency = 'critical'; }

  const cfg = {
    normal:   { bg: 'rgba(46,121,245,.07)',  border: 'rgba(46,121,245,.14)', timeColor: 'var(--amber-d)',  dot: '#4190F8',  dotBg: 'rgba(46,121,245,.15)'  },
    warning:  { bg: 'rgba(230,140,0,.08)',   border: 'rgba(230,140,0,.22)',  timeColor: '#A86000',         dot: '#E88C00',  dotBg: 'rgba(230,140,0,.18)'   },
    critical: { bg: 'rgba(192,48,79,.08)',   border: 'rgba(192,48,79,.22)',  timeColor: '#C0304F',         dot: '#E8536E',  dotBg: 'rgba(192,48,79,.18)'   },
    expired:  { bg: 'rgba(192,48,79,.06)',   border: 'rgba(192,48,79,.25)',  timeColor: '#C0304F',         dot: '#C0304F',  dotBg: 'rgba(192,48,79,.15)'   },
  }[urgency];

  // ── Top banner strip ──
  if (urgency === 'expired') {
    wrap.innerHTML = \`<div style="background:\${cfg.bg};border:1px solid \${cfg.border};border-radius:12px;padding:12px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:0">
      <div style="font-size:13px;color:var(--ink2)"><strong style="color:\${cfg.timeColor}">Your free trial has ended.</strong> Upgrade to keep all your content and features.</div>
      <button class="btn btn-primary" onclick="openUpgradeModal()" style="white-space:nowrap;font-size:12px;padding:7px 16px;flex-shrink:0">Upgrade → $49/mo</button>
    </div>\`;
  } else {
    wrap.innerHTML = \`<div style="background:\${cfg.bg};border:1px solid \${cfg.border};border-radius:12px;padding:11px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:0">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:7px;height:7px;border-radius:50%;background:\${cfg.dot};flex-shrink:0\${urgency!=='normal'?';animation:blink-cur .9s step-end infinite':''}"></div>
        <div style="font-size:13px;color:var(--ink2)"><strong style="color:\${cfg.timeColor}">\${timeStr} left</strong> in your free trial &nbsp;·&nbsp; <span style="color:var(--ink4);font-size:12px">$49/mo after · cancel anytime</span></div>
      </div>
      <button class="btn btn-primary" onclick="openUpgradeModal()" style="white-space:nowrap;font-size:12px;padding:7px 16px;flex-shrink:0">Upgrade → $49/mo</button>
    </div>\`;
  }

  // ── Dashboard inline upgrade CTA ──
  if (!cta) return;
  cta.style.display = 'block';

  if (urgency === 'expired') {
    cta.innerHTML = \`<div style="background:rgba(192,48,79,.06);border:1.5px solid rgba(192,48,79,.22);border-radius:14px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:20px">
      <div>
        <div style="font-size:15px;font-weight:700;color:#C0304F;margin-bottom:5px">Your free trial has ended</div>
        <div style="font-size:13px;color:var(--ink3)">Upgrade to Pro to keep generating unlimited content and accessing all SEO tools.</div>
      </div>
      <button class="btn btn-primary" onclick="openUpgradeModal()" style="white-space:nowrap;flex-shrink:0;padding:10px 22px">Upgrade now →</button>
    </div>\`;
    return;
  }

  cta.innerHTML = \`<div style="background:linear-gradient(130deg,#0C1424 0%,#0E2040 48%,#110C24 100%);border-radius:16px;padding:22px 26px;display:flex;align-items:center;justify-content:space-between;gap:20px;border:1px solid rgba(255,255,255,.06);box-shadow:0 4px 24px rgba(13,27,53,.2);position:relative;overflow:hidden;margin-top:20px">
    <div style="position:absolute;top:-50px;right:-30px;width:180px;height:180px;background:radial-gradient(circle,rgba(46,121,245,.2) 0%,transparent 70%);pointer-events:none"></div>
    <div style="position:absolute;bottom:-40px;left:25%;width:140px;height:140px;background:radial-gradient(circle,rgba(14,168,122,.12) 0%,transparent 70%);pointer-events:none"></div>
    <div style="position:relative;z-index:1">
      <div style="display:inline-flex;align-items:center;gap:6px;background:\${cfg.dotBg};border:1px solid \${cfg.border};padding:4px 10px;border-radius:100px;margin-bottom:12px">
        <div style="width:6px;height:6px;border-radius:50%;background:\${cfg.dot}\${urgency!=='normal'?';animation:blink-cur .9s step-end infinite':''}"></div>
        <span style="font-size:11px;font-weight:700;color:\${cfg.dot};text-transform:uppercase;letter-spacing:.09em">\${timeStr} left in trial</span>
      </div>
      <h3 style="font-family:var(--font-serif);font-size:17px;font-weight:700;color:#fff;margin-bottom:5px;letter-spacing:-.02em">Keep your SEO engine running</h3>
      <p style="font-size:13px;color:rgba(255,255,255,.48);line-height:1.5">$49/mo · Unlimited posts · Full SEO suite · Cancel anytime</p>
    </div>
    <div style="display:flex;align-items:center;gap:16px;position:relative;z-index:1;flex-shrink:0">
      <div style="font-size:12px;color:rgba(255,255,255,.38);line-height:1.8">
        <div>✦ Unlimited AI posts</div>
        <div>✦ PDF reports</div>
        <div>✦ Priority support</div>
      </div>
      <button onclick="openUpgradeModal()" style="background:linear-gradient(160deg,#4190F8 0%,#1E6AE4 100%);color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap;box-shadow:0 2px 14px rgba(46,121,245,.4);font-family:var(--font-ui);transition:transform .15s" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">Upgrade to Pro →</button>
    </div>
  </div>\`;
}`
);

// ──────────────────────────────────────────────────────────────────────────────
// 2. UPDATE initTrialSystem — 3-day trial start, Clerk metadata, ?trial_start=1
// ──────────────────────────────────────────────────────────────────────────────
apply('Update initTrialSystem for trial_start param and Clerk sync',
`  // Handle upgrade success redirect
  if (window.location.search.includes('upgrade=success')) {
    setTimeout(function() {
      // Re-check Clerk metadata after redirect
      const m = window.Clerk?.user?.publicMetadata;
      if (m?.plan === 'pro') {
        const p = { type: 'pro', start: Date.now() };
        localStorage.setItem('cruise_plan', JSON.stringify(p));
        renderTrialBanner(p);
      }
      toast('Welcome to Pro! Your plan is now active. ✦', true);
      history.replaceState({}, '', window.location.pathname);
    }, 2500);
  }`,
`  // Handle post-trial-signup redirect (?trial_start=1)
  if (window.location.search.includes('trial_start=1')) {
    setTimeout(function() {
      toast('Your 3-day free trial has started! ✦ We have your card on file — cancel anytime.', true);
      history.replaceState({}, '', window.location.pathname);
    }, 1200);
  }

  // Handle upgrade success redirect (?upgrade=success)
  if (window.location.search.includes('upgrade=success')) {
    setTimeout(function() {
      const m = window.Clerk?.user?.publicMetadata;
      if (m?.plan === 'pro' || m?.plan === 'trial') {
        const p = { type: 'pro', start: Date.now() };
        localStorage.setItem('cruise_plan', JSON.stringify(p));
        renderTrialBanner(p);
      }
      toast('Welcome to Pro! Your plan is now active. ✦', true);
      history.replaceState({}, '', window.location.pathname);
    }, 2500);
  }`
);

// ──────────────────────────────────────────────────────────────────────────────
// 3. INJECT dash-trial-cta placeholder after stat cards
// ──────────────────────────────────────────────────────────────────────────────
apply('Inject dash-trial-cta placeholder div',
`      <div style="display:grid;grid-template-columns:1fr auto;gap:12px;align-items:start;margin:24px 0 14px">
        <div class="card" id="seo-health-widget"`,
`      <div id="dash-trial-cta"></div>
      <div style="display:grid;grid-template-columns:1fr auto;gap:12px;align-items:start;margin:24px 0 14px">
        <div class="card" id="seo-health-widget"`
);

// ──────────────────────────────────────────────────────────────────────────────
// 4. UPDATE plan card "14 days" → "3 days"
// ──────────────────────────────────────────────────────────────────────────────
apply('Update plan card trial duration 14→3 days',
`        <div class="plan-card-price">$0 <span>/ 14 days</span></div>`,
`        <div class="plan-card-price">$0 <span>/ 3 days</span></div>`
);

// ──────────────────────────────────────────────────────────────────────────────
// WRITE
// ──────────────────────────────────────────────────────────────────────────────
fs.writeFileSync(FILE, html.replace(/\n/g, '\r\n'), 'utf8');
console.log(`\n✅ premium12 complete — ${changes.length} changes applied`);
