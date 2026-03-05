// update-clerk-key.js — Swap Clerk test keys for production live keys
//
// Usage:
//   node update-clerk-key.js pk_live_XXXXXXXXXXXX https://YOUR-APP.clerk.accounts.dev
//
// Get both values from: Clerk Dashboard → API Keys → (switch to Production)

const fs   = require('fs');
const path = require('path');

const [,, newKey, newUrl] = process.argv;

if (!newKey || !newKey.startsWith('pk_live_')) {
  console.error('❌ Usage: node update-clerk-key.js pk_live_XXXX https://your-app.clerk.accounts.dev');
  console.error('   The key must start with pk_live_');
  process.exit(1);
}

if (!newUrl || !newUrl.includes('clerk.accounts.dev')) {
  console.error('❌ Please provide your Clerk Frontend API URL (e.g. https://abc-123.clerk.accounts.dev)');
  process.exit(1);
}

const FILE = path.join(__dirname, 'app.html');
let html = fs.readFileSync(FILE, 'utf8');

// Find the existing test key
const testKeyMatch = html.match(/pk_test_[A-Za-z0-9]+/);
const testUrlMatch = html.match(/https:\/\/[a-z0-9-]+\.clerk\.accounts\.dev/);

if (!testKeyMatch) {
  console.error('❌ Could not find existing Clerk publishable key in app.html');
  process.exit(1);
}

const oldKey = testKeyMatch[0];
const oldUrl = testUrlMatch ? testUrlMatch[0] : null;

// Replace all occurrences of the test key
let updated = html.split(oldKey).join(newKey);

// Replace the Clerk CDN URL if found
if (oldUrl) {
  const newClerkUrl = newUrl.replace('https://', '').replace(/\/$/, '');
  const oldClerkUrl = oldUrl.replace('https://', '').replace(/\/$/, '');
  updated = updated.split(oldClerkUrl).join(newClerkUrl);
  console.log(`✅ Replaced Clerk URL: ${oldUrl} → ${newUrl}`);
}

fs.writeFileSync(FILE, updated, 'utf8');

console.log(`✅ Replaced Clerk key: ${oldKey} → ${newKey}`);
console.log(`✅ Saved ${FILE}`);
console.log('\n🚀 app.html is now using production Clerk keys.');
console.log('   Commit and push to deploy:\n');
console.log('   git add app.html && git commit -m "Switch to Clerk production keys" && git push');
