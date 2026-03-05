// update-clerk-key.js — Swap Clerk test keys for production live keys
//                       Patches both app.html AND onboarding.html
//
// Usage:
//   node update-clerk-key.js pk_live_XXXXXXXXXXXX https://YOUR-APP.clerk.accounts.dev
//
// Get both values from: Clerk Dashboard → API Keys → (switch to Production)
// NOTE: You want the PUBLISHABLE key (starts with pk_live_), NOT the secret key (sk_live_)

const fs   = require('fs');
const path = require('path');

const [,, newKey, newUrl] = process.argv;

if (!newKey || !newKey.startsWith('pk_live_')) {
  console.error('❌ Usage: node update-clerk-key.js pk_live_XXXX https://your-app.clerk.accounts.dev');
  console.error('   You want the PUBLISHABLE key (pk_live_...), not the secret key (sk_live_...)');
  console.error('   Find it: Clerk Dashboard → API Keys → switch to Production → Publishable key');
  process.exit(1);
}

if (!newUrl || !newUrl.includes('clerk.accounts.dev')) {
  console.error('❌ Please provide your Clerk Frontend API URL (e.g. https://abc-123.clerk.accounts.dev)');
  process.exit(1);
}

const newClerkHost = newUrl.replace('https://', '').replace(/\/$/, '');

function patchFile(filename) {
  const filepath = path.join(__dirname, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  ${filename} not found — skipping`);
    return;
  }

  let html = fs.readFileSync(filepath, 'utf8');

  const testKeyMatch = html.match(/pk_test_[A-Za-z0-9]+/);
  const testUrlMatch = html.match(/https:\/\/[a-z0-9-]+\.clerk\.accounts\.dev/);

  if (!testKeyMatch) {
    console.log(`⚠️  No pk_test_ key found in ${filename} — skipping`);
    return;
  }

  const oldKey  = testKeyMatch[0];
  const oldHost = testUrlMatch ? testUrlMatch[0].replace('https://', '').replace(/\/$/, '') : null;

  let updated = html.split(oldKey).join(newKey);

  if (oldHost) {
    updated = updated.split(oldHost).join(newClerkHost);
    console.log(`✅ ${filename}: Replaced URL  ${oldHost} → ${newClerkHost}`);
  }

  fs.writeFileSync(filepath, updated, 'utf8');
  console.log(`✅ ${filename}: Replaced key  ${oldKey} → ${newKey}`);
}

patchFile('app.html');
patchFile('onboarding.html');

console.log('\n🚀 Both files now use production Clerk keys.');
console.log('   Commit and push to deploy:\n');
console.log('   git add app.html onboarding.html && git commit -m "Switch to Clerk production keys" && git push');
