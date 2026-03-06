const fs = require('fs');

// ═══════════════════════════════════════════════════
// PATCH onboarding.html — add Booking URL field
// ═══════════════════════════════════════════════════
{
  const p = 'C:/Users/Shreeya/AppData/Local/Temp/seoflow/onboarding.html';
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  // 1. Add bookingUrl input field after the website analysis card
  const targetHtml = `        </div>\n      </div>\n\n      <div class="field">\n        <label class="field-label">What do you do? <span class="optional">one sentence</span></label>`;
  const replacement = `        </div>\n      </div>\n\n      <div class="field">\n        <label class="field-label">Booking / contact URL <span class="optional">optional</span></label>\n        <input class="field-input" id="bizBookingUrl" type="url" placeholder="https://yoursite.com/book-a-session" />\n      </div>\n\n      <div class="field">\n        <label class="field-label">What do you do? <span class="optional">one sentence</span></label>`;

  if (c.includes(targetHtml)) {
    c = c.replace(targetHtml, replacement);
    console.log('OK:   Added bookingUrl field HTML');
  } else {
    console.log('MISS: bookingUrl field HTML');
  }

  // 2. Add bookingUrl to brandProfile object
  const bpTarget = `    differentiators: document.getElementById('differentiators').value,\n  };`;
  const bpReplace = `    differentiators: document.getElementById('differentiators').value,\n    bookingUrl: document.getElementById('bizBookingUrl')?.value || '',\n    booking_url: document.getElementById('bizBookingUrl')?.value || '',\n  };`;

  if (c.includes(bpTarget)) {
    c = c.replace(bpTarget, bpReplace);
    console.log('OK:   Added bookingUrl to brandProfile object');
  } else {
    console.log('MISS: brandProfile object update');
  }

  // 3. Also save bookingUrl to localStorage for easy retrieval
  const saveTarget = `  try {\n    await window.storage.set('brand-profile', JSON.stringify(brandProfile));\n  } catch(e) {}`;
  const saveReplace = `  try {\n    await window.storage.set('brand-profile', JSON.stringify(brandProfile));\n    localStorage.setItem('seoflow_brand', JSON.stringify(brandProfile));\n    localStorage.setItem('cruise_brand', JSON.stringify(brandProfile));\n  } catch(e) {}`;

  if (c.includes(saveTarget)) {
    c = c.replace(saveTarget, saveReplace);
    console.log('OK:   Added localStorage save with bookingUrl');
  } else {
    console.log('MISS: localStorage save update');
  }

  fs.writeFileSync(p, c.replace(/\n/g, '\r\n'), 'utf8');
}

// ═══════════════════════════════════════════════════
// PATCH api/wp-proxy.js — add Article Schema Markup
// ═══════════════════════════════════════════════════
{
  const p = 'C:/Users/Shreeya/AppData/Local/Temp/seoflow/api/wp-proxy.js';
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  // Add schema markup injection before the postBody is assembled
  const target = `      const postBody = {\n        title,\n        content: finalContent,\n        status: status || 'publish',\n        excerpt: excerpt || ''\n      };`;
  const replacement = `      // Inject Article schema markup at end of content
      const brandName = body.brandName || '';
      const schemaMarkup = '<script type="application/ld+json">' + JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString(),
        "author": { "@type": "Organization", "name": brandName || "Cruise SEO" },
        "publisher": { "@type": "Organization", "name": brandName || "Cruise SEO" },
        "description": excerpt || title
      }) + '<\/script>';
      finalContent = finalContent + '\\n' + schemaMarkup;

      const postBody = {
        title,
        content: finalContent,
        status: status || 'publish',
        excerpt: excerpt || ''
      };`;

  if (c.includes(target)) {
    c = c.replace(target, replacement);
    console.log('OK:   Added Article schema markup to wp-proxy.js');
  } else {
    console.log('MISS: schema markup injection');
    // Debug: show what's there
    const idx = c.indexOf('postBody = {');
    console.log('  postBody context:', JSON.stringify(c.slice(idx-20, idx+150)));
  }

  fs.writeFileSync(p, c.replace(/\n/g, '\r\n'), 'utf8');
}

console.log('\nAll patches complete.');
