// premium11.js — Stripe checkout, Clerk plan sync, privacy link
//
// ── SETUP CHECKLIST (complete before running) ────────────────────────────────
// 1. Stripe Dashboard → Products → Create "Cruise SEO Pro" ($49/mo recurring)
// 2. Stripe Dashboard → Payment Links → Create link for that product
//    → Set Success URL: https://cruiseseo.site/app.html?upgrade=success
//    → Copy the payment link URL (looks like: https://buy.stripe.com/xxxxx)
// 3. Paste the URL as STRIPE_PAYMENT_LINK below
// 4. Stripe Dashboard → Developers → Webhooks → Add endpoint:
//    → URL: https://cruiseseo.site/api/stripe-webhook
//    → Events: checkout.session.completed, customer.subscription.deleted, invoice.payment_failed
//    → Copy the Signing secret → add as STRIPE_WEBHOOK_SECRET in Vercel
// 5. Add to Vercel → Settings → Environment Variables:
//    → STRIPE_SECRET_KEY   (Stripe secret key)
//    → STRIPE_WEBHOOK_SECRET (Stripe webhook signing secret)
//    → CLERK_SECRET_KEY    (Clerk secret key — from Clerk Dashboard → API Keys)
// 6. Run: node update-clerk-key.js pk_live_XXXX https://your-clerk-frontend-api.clerk.accounts.dev
// ────────────────────────────────────────────────────────────────────────────

const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/REPLACE_THIS_WITH_YOUR_PAYMENT_LINK';

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
// 1. REPLACE activatePro() — wire up Stripe checkout
// ──────────────────────────────────────────────────────────────────────────────
apply('Wire Stripe checkout to upgrade modal',
`function activatePro() {
  const plan = { type: 'pro', start: Date.now() };
  localStorage.setItem('cruise_plan', JSON.stringify(plan));
  closeUpgradeModal();
  renderTrialBanner(plan);
  toast('Pro plan activated! Unlimited posts unlocked.', true);
}`,
`function activatePro() { startStripeCheckout(); }

function startStripeCheckout() {
  closeUpgradeModal();
  const userId = window.Clerk?.user?.id || '';
  const email  = window.Clerk?.user?.primaryEmailAddress?.emailAddress || '';
  const base   = '${STRIPE_PAYMENT_LINK}';
  const params = new URLSearchParams();
  if (userId) params.set('client_reference_id', userId);
  if (email)  params.set('prefilled_email', email);
  const url = params.toString() ? base + '?' + params.toString() : base;
  window.open(url, '_blank', 'noopener');
}`
);

// ──────────────────────────────────────────────────────────────────────────────
// 2. UPDATE initTrialSystem() — check Clerk metadata + handle ?upgrade=success
// ──────────────────────────────────────────────────────────────────────────────
apply('Sync Clerk plan metadata in initTrialSystem',
`function initTrialSystem() {
  let plan = JSON.parse(localStorage.getItem('cruise_plan') || 'null');
  if (!plan) {
    plan = { type: 'trial', start: Date.now() };
    localStorage.setItem('cruise_plan', JSON.stringify(plan));
  }
  renderTrialBanner(plan);
  renderOnboardingChecklist();
  setTimeout(maybeShowOnboarding, 1500);
}`,
`function initTrialSystem() {
  // If Clerk metadata says pro, trust that over localStorage
  const meta = window.Clerk?.user?.publicMetadata;
  if (meta?.plan === 'pro') {
    localStorage.setItem('cruise_plan', JSON.stringify({ type: 'pro', start: Date.now() }));
  }

  let plan = JSON.parse(localStorage.getItem('cruise_plan') || 'null');
  if (!plan) {
    plan = { type: 'trial', start: Date.now() };
    localStorage.setItem('cruise_plan', JSON.stringify(plan));
  }
  renderTrialBanner(plan);
  renderOnboardingChecklist();
  setTimeout(maybeShowOnboarding, 1500);

  // Handle post-Stripe redirect — Clerk may need a moment to refresh metadata
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
  }
}`
);

// ──────────────────────────────────────────────────────────────────────────────
// 3. ADD PRIVACY + SUPPORT LINKS in sidebar footer
// ──────────────────────────────────────────────────────────────────────────────
apply('Add privacy and support links to sidebar footer',
`      <button class="sb-signout" onclick="signOut()" style="flex:1">Sign out</button>
      <button onclick="toggleDarkMode()" id="dark-mode-btn" title="Toggle dark mode" style="background:none;border:none;cursor:pointer;color:rgba(255,255,255,.4);font-size:16px;padding:0 10px;line-height:1">☽</button>
    </div>
  </div>
</aside>`,
`      <button class="sb-signout" onclick="signOut()" style="flex:1">Sign out</button>
      <button onclick="toggleDarkMode()" id="dark-mode-btn" title="Toggle dark mode" style="background:none;border:none;cursor:pointer;color:rgba(255,255,255,.4);font-size:16px;padding:0 10px;line-height:1">☽</button>
    </div>
    <div style="padding:10px 10px 4px;text-align:center">
      <a href="/privacy.html" target="_blank" style="font-size:10px;color:rgba(255,255,255,.2);text-decoration:none;transition:color .15s" onmouseover="this.style.color='rgba(255,255,255,.45)'" onmouseout="this.style.color='rgba(255,255,255,.2)'">Privacy Policy</a>
      <span style="color:rgba(255,255,255,.12);margin:0 5px">·</span>
      <a href="mailto:hello@cruiseseo.site" style="font-size:10px;color:rgba(255,255,255,.2);text-decoration:none;transition:color .15s" onmouseover="this.style.color='rgba(255,255,255,.45)'" onmouseout="this.style.color='rgba(255,255,255,.2)'">Support</a>
    </div>
  </div>
</aside>`
);

// ──────────────────────────────────────────────────────────────────────────────
// 4. UPDATE ai-generate fetch to handle 429 rate limit errors gracefully
// ──────────────────────────────────────────────────────────────────────────────
apply('Handle 429 rate limit in callAI',
`    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || errData.error || 'AI request failed');
    }`,
`    if (res.status === 429) {
      throw new Error('Rate limit reached — please wait a few minutes before generating more content.');
    }
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || errData.error || 'AI request failed');
    }`
);

// ──────────────────────────────────────────────────────────────────────────────
// WRITE
// ──────────────────────────────────────────────────────────────────────────────
fs.writeFileSync(FILE, html.replace(/\n/g, '\r\n'), 'utf8');
console.log(`\n✅ premium11 complete — ${changes.length} changes applied`);
console.log('\n📋 Next steps:');
console.log('  1. Create Stripe Payment Link → paste URL as STRIPE_PAYMENT_LINK in this file → re-run');
console.log('  2. Add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, CLERK_SECRET_KEY to Vercel env vars');
console.log('  3. Add Stripe webhook endpoint: https://cruiseseo.site/api/stripe-webhook');
console.log('  4. Run: node update-clerk-key.js pk_live_XXXX https://your-clerk-frontend-api.dev');
