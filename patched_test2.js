
// ── AI Content Generator ──────────────────────
let selectedTone = 'authoritative';
let generatedPostData = null;

let selectedLength = 'standard';
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
  el.innerHTML = '<span style="font-size:11px;color:var(--ink4)">Quick add:</span>' + all.map(kw=>`<button class="rank-auto-pill" onclick="document.getElementById('genKeyword').value='${kw.replace(/'/g,"\\'")}';">${kw}</button>`).join('');
}

function resetGenerator() {
  document.getElementById('gen-step-input').style.display = 'block';
  document.getElementById('gen-step-loading').style.display = 'none';
  document.getElementById('gen-step-output').style.display = 'none';
  document.getElementById('gen-publish-result').style.display = 'none';
  generatedPostData = null;
}

function showGenStep(step) {
  ['input','loading','output'].forEach(s => {
    document.getElementById('gen-step-' + s).style.display = s === step ? 'block' : 'none';
  });
}

function setGenStage(title, sub, pct) {
  document.getElementById('gen-stage-title').textContent = title;
  document.getElementById('gen-stage-sub').textContent = sub;
  document.getElementById('gen-progress-bar').style.width = pct + '%';
}

async function runGenerate() {
  const keyword = document.getElementById('genKeyword').value.trim();
  if (!keyword) { toast('Enter a keyword or topic first', false); return; }

  showGenStep('loading');
  setGenStage('Researching keyword...', 'Analysing search intent and competition', 10);

  // Get brand context
  const brandCtx = localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '';
  let brandInfo = '';
  try { 
    const b = JSON.parse(brandCtx);
    brandInfo = `Business: ${b.name || ''}. Industry: ${b.industry || ''}. Target audience: ${b.audience || ''}. Brand voice: ${b.voice || selectedTone}.`;
  } catch(e) { brandInfo = `Brand tone: ${selectedTone}.`; }

  const lengthMap = {short:'600–700 words',standard:'1,000–1,200 words',long:'1,500–1,800 words'};
  const templateInstructions = {
    blog: '- Write a comprehensive blog post with introduction, body sections, and conclusion',
    listicle: '- Format as a numbered listicle (e.g. "10 Ways to...") with each item as an H2 and 2-3 sentences of explanation',
    howto: '- Format as a step-by-step how-to guide. Number each step clearly as an H2. Include a "What you need" section at the start',
    comparison: '- Format as a comparison article. Include a pros/cons section, a comparison table (as HTML <table>), and a clear recommendation at the end',
    faq: '- Format as an FAQ article. Write 8-12 questions as H2 headings with detailed answers. Add an FAQ schema in the JSON-LD at the end',
    casestudy: '- Format as a case study. Include: the challenge, the approach, the results (with metrics), and key takeaways'
  };
  const tplInstruction = templateInstructions[selectedTemplate] || templateInstructions.blog;
  // Positioning + CTA
  const bpos = JSON.parse(localStorage.getItem('cruise_positioning') || '{}');
  const positioningLine = bpos.enabled ? `\n- Position the business as THE leading expert and ideal solution for the reader's problem throughout the article` : '';
  const contactUrl = b.bookingUrl || b.booking_url || bpos.contactUrl || '';
  const ctaLine = contactUrl ? `\n- End with a compelling CTA paragraph naturally linking to the contact/booking page: ${contactUrl} (use anchor text like "get in touch", "book a free consultation", or "contact us today")` : '';
  // Published posts for internal linking
  const pubPosts = getAllPublishedPosts ? getAllPublishedPosts().slice(0, 8).map(p => p.title + (p.url ? ' ('+p.url+')' : '')).join(', ') : '';
  const internalLinkLine = pubPosts ? `\n- Naturally interlink to these existing posts where relevant: ${pubPosts}` : '';
  // Layout richness
  const layoutLine = `\n- Enrich the layout: include at least one HTML <table> for comparisons/stats, one <blockquote> for a key insight, and multiple <ul> or <ol> lists. Use <strong> for key terms. Make it visually varied, not wall-to-wall paragraphs.`;
  // Backlink note
  const backlinkLine = `\n- Subtly reference 1-2 relevant, authoritative external sources (only where they add genuine value) with natural anchor text`;
  const prompt = `You are an expert SEO content writer. Write a comprehensive, SEO-optimised blog post for the following:

Keyword/Topic: "${keyword}"
Content type: ${selectedTemplate || 'blog post'}
Tone: ${selectedTone}
Target length: ${lengthMap[selectedLength]||'1,000–1,200 words'}
${brandInfo}

Requirements:
${tplInstruction}${positioningLine}${ctaLine}${internalLinkLine}${layoutLine}${backlinkLine}
- Write a compelling, keyword-rich H1 title (don't include "H1:" prefix, just the title)
- Use proper H2 and H3 subheadings throughout
- Include the target keyword naturally 4-6 times
- Write an engaging intro that hooks the reader in the first 2 sentences
- Use short paragraphs (2-4 sentences max) for readability
- Include at least one bulleted or numbered list
- End with a strong call-to-action conclusion
- Write in UK English

Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "title": "The full post title",
  "meta_description": "A compelling meta description 150-160 characters",
  "content_html": "The full post content as HTML using <h2>, <h3>, <p>, <ul>, <li>, <ol>, <strong> tags only"
}`;

  try {
    // Stage updates during generation
    setTimeout(() => setGenStage('Planning structure...', 'Mapping headings and key points', 25), 1500);
    setTimeout(() => setGenStage('Writing content...', 'Crafting SEO-optimised paragraphs', 50), 4000);
    setTimeout(() => setGenStage('Optimising for SEO...', 'Checking keyword density and readability', 80), 8000);

    const res = await fetch('/api/ai-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
    });

    const data = await res.json();
    const raw = data.content.map(c => c.text || '').join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    const post = JSON.parse(clean);

    setGenStage('Done!', 'Your post is ready', 100);
    await new Promise(r => setTimeout(r, 600));

    // Calculate stats
    const wordCount = post.content_html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const readTime = Math.ceil(wordCount / 200);
    const seoScore = calcSeoScore(post.content_html, post.title, keyword);

    generatedPostData = { ...post, keyword, wordCount, readTime, seoScore };

    // Render output
    document.getElementById('gen-post-title-display').textContent = post.title;
    document.getElementById('gen-word-count').textContent = wordCount.toLocaleString();
    document.getElementById('gen-seo-score').innerHTML = `<span style="color:${seoScore >= 80 ? 'var(--sage)' : seoScore >= 60 ? 'var(--amber)' : '#C0304F'}">${seoScore}/100</span>`;
    document.getElementById('gen-read-time').textContent = readTime + ' min';
    document.getElementById('gen-meta-desc').textContent = post.meta_description;
    document.getElementById('gen-editor').innerHTML = post.content_html;
    updateSerpPreview(post.title, post.meta_description);

    showGenStep('output');
    toast('Post generated! Review and publish.', true);

  } catch(err) {
    showGenStep('input');
    toast('Generation failed: ' + err.message, false);
    console.error(err);
  }
}

function calcSeoScore(html, title, keyword) {
  let score = 50;
  const text = html.replace(/<[^>]+>/g, ' ').toLowerCase();
  const kw = keyword.toLowerCase();
  const kwCount = (text.match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (kwCount >= 3 && kwCount <= 8) score += 15;
  else if (kwCount >= 1) score += 8;
  if (title.toLowerCase().includes(kw)) score += 10;
  if (wordCount >= 900) score += 10;
  if (html.includes('<h2>') || html.includes('<h2 ')) score += 8;
  if (html.includes('<ul>') || html.includes('<ol>')) score += 7;
  return Math.min(score, 100);
}

function onEditorChange() {
  if (!generatedPostData) return;
  const html = document.getElementById('gen-editor').innerHTML;
  const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);
  document.getElementById('gen-word-count').textContent = wordCount.toLocaleString();
  // Update SERP preview with current title
  const titleEl = document.getElementById('gen-post-title-display');
  const metaEl = document.getElementById('gen-meta-desc');
  if (titleEl && metaEl) updateSerpPreview(titleEl.textContent, metaEl.textContent);
  document.getElementById('gen-read-time').textContent = readTime + ' min';
  generatedPostData.content_html = html;
  generatedPostData.wordCount = wordCount;
}

async function publishToWP() {
  if (!generatedPostData) return;

  const wpRaw = localStorage.getItem('cruise_wp_connection');
  if (!wpRaw) {
    toast('Connect WordPress first in the Publish tab', false);
    return;
  }
  const wp = JSON.parse(wpRaw);

  const btn = document.getElementById('btnPublishWP');
  btn.disabled = true;
  btn.textContent = 'Publishing...';

  const resultEl = document.getElementById('gen-publish-result');
  resultEl.style.display = 'none';

  try {
    const r = await fetch('/api/wp-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'publish',
        url: wp.url,
        username: wp.username,
        password: atob(wp.password),
        title: generatedPostData.title,
        content: generatedPostData.content_html,
        status: 'publish',
        imageQuery: generatedPostData.title.split(' ').slice(0,3).join(' '),
        internalLinks: (() => {
          const posts = getAllPublishedPosts().slice(0,10);
          const b = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
          return { posts: posts.map(p=>({title:p.title,url:p.url})), bookingUrl: b.bookingUrl||b.booking_url||'' };
        })()
      })
    });

    const post = await r.json();
    if (!r.ok) throw new Error(post.error || 'HTTP ' + r.status);

    resultEl.style.display = 'block';
    resultEl.style.background = 'var(--sage-l)';
    resultEl.style.border = '1px solid rgba(74,124,111,.2)';
    resultEl.style.color = 'var(--sage)';
    resultEl.innerHTML = `✓ Published live on WordPress! <a href="${post.link}" target="_blank" style="color:var(--sage);font-weight:700;margin-left:8px">View post →</a>`;

    addWPLog(generatedPostData.title, wp.url, 'ok');
    toast('Post published live!', true);
    // Auto-post to social if enabled
    if (post.link) postAutoSocial(generatedPostData.title, post.link);
    if (post.id) {
      injectSEOMeta(wp.url, wp.username, atob(wp.password), post.id, generatedPostData.title, generatedPostData.content_html);
    }

    // Add to posts list
    const d = new Date();
    const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    if (typeof posts !== 'undefined') {
      posts.unshift({
        status: 'live',
        title: generatedPostData.title,
        keywords: generatedPostData.keyword,
        score: generatedPostData.seoScore + '',
        date: dateStr,
        words: generatedPostData.wordCount.toLocaleString()
      });
      if (typeof updateStats === 'function') updateStats();
    }

  } catch(err) {
    resultEl.style.display = 'block';
    resultEl.style.background = 'rgba(192,48,79,.06)';
    resultEl.style.border = '1px solid rgba(192,48,79,.2)';
    resultEl.style.color = '#C0304F';
    resultEl.textContent = 'Publish failed: ' + err.message;
    addWPLog(generatedPostData.title, wp.url, 'err');
  }

  btn.disabled = false;
  btn.textContent = 'Publish to WordPress ↗';
}


// ── Autopilot ─────────────────────────────────
let apSettings = { enabled: false, frequency: '3x_week', seeds: '', tone: 'authoritative', nextRun: null };
let apTone = 'authoritative';
let apFreq = '3x_week';

function initAutopilot() {
  const saved = localStorage.getItem('cruise_autopilot');
  if (saved) {
    try { apSettings = { ...apSettings, ...JSON.parse(saved) }; } catch(e) {}
  }
  // Populate usage indicator
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
  apOn = apSettings.enabled || false;
  const apToggleEl = document.getElementById('apToggle');
  const apTxtEl = document.getElementById('apTxt');
  if (apToggleEl) apToggleEl.classList.toggle('on', apOn);
  if (apTxtEl) { apTxtEl.textContent = apOn ? 'on' : 'off'; apTxtEl.style.color = apOn ? 'var(--sage)' : 'var(--ink4)'; }
  // Pre-fill seeds from brand keywords
  if (!apSettings.seeds && brand.keywords?.length) {
    apSettings.seeds = brand.keywords.slice(0, 5).join(', ');
  }
  apFreq = apSettings.frequency || '3x_week';
  apTone = apSettings.tone || 'authoritative';
  renderAutopilotUI();
  renderApLog();
}

function saveApSettings() {
  apSettings.frequency = apFreq;
  apSettings.tone = apTone;
  apSettings.seeds = document.getElementById('ap-seeds')?.value || apSettings.seeds;
  localStorage.setItem('cruise_autopilot', JSON.stringify(apSettings));
}

function renderAutopilotUI() {
  const badge = document.getElementById('ap-status-badge');
  const btn = document.getElementById('ap-toggle-btn');
  const activeCard = document.getElementById('ap-active-card');
  const seedsEl = document.getElementById('ap-seeds');
  if (seedsEl && apSettings.seeds) seedsEl.value = apSettings.seeds;

  // Set freq chip
  document.querySelectorAll('#freq-chips .tone-chip').forEach(c => {
    c.classList.toggle('on', c.getAttribute('data-freq') === apFreq ||
      c.textContent.toLowerCase().replace(/[^a-z0-9]/g,'_') === apFreq ||
      (apFreq === '3x_week' && c.textContent.includes('3')) ||
      (apFreq === 'weekly' && c.textContent.toLowerCase() === 'weekly') ||
      (apFreq === 'daily' && c.textContent.toLowerCase() === 'daily') ||
      (apFreq === 'monthly' && c.textContent.toLowerCase() === 'monthly')
    );
  });

  // Set tone chip
  document.querySelectorAll('#ap-tone-chips .tone-chip').forEach(c => {
    c.classList.toggle('on', c.textContent.toLowerCase() === apTone);
  });

  if (apSettings.enabled) {
    if (badge) { badge.textContent = 'Active'; badge.style.background = 'rgba(74,222,128,.15)'; badge.style.color = '#4ade80'; }
    if (btn) { btn.textContent = 'Pause autopilot'; btn.style.background = 'rgba(192,48,79,.1)'; btn.style.color = '#C0304F'; btn.style.border = '1px solid rgba(192,48,79,.2)'; }
    if (activeCard) activeCard.style.display = 'block';
    updateNextRunLabel();
  } else {
    if (badge) { badge.textContent = 'Off'; badge.style.background = 'var(--cream3)'; badge.style.color = 'var(--ink4)'; }
    if (btn) { btn.textContent = 'Enable autopilot'; btn.style.background = ''; btn.style.color = ''; btn.style.border = ''; }
    if (activeCard) activeCard.style.display = 'none';
  }
}

function updateNextRunLabel() {
  const freqLabels = { daily: 'Daily at 8:00 AM UTC', '3x_week': 'Mon, Wed & Fri at 8:00 AM UTC', weekly: 'Every Monday at 8:00 AM UTC', monthly: '1st of every month at 8:00 AM UTC' };
  const el = document.getElementById('ap-frequency-label');
  const nextEl = document.getElementById('ap-next-label');
  if (el) el.textContent = freqLabels[apFreq] || '';
  if (nextEl) {
    const next = calcNextRun(apFreq);
    nextEl.textContent = 'Next post: ' + next;
  }
}

function calcNextRun(freq) {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(8, 0, 0, 0);
  if (freq === 'daily') {
    if (now.getUTCHours() >= 8) next.setUTCDate(next.getUTCDate() + 1);
  } else if (freq === '3x_week') {
    const days = [1, 3, 5]; // Mon, Wed, Fri
    let d = now.getUTCDay();
    for (let i = 0; i < 7; i++) {
      const check = (d + i) % 7;
      if (days.includes(check) && (i > 0 || now.getUTCHours() < 8)) {
        next.setUTCDate(next.getUTCDate() + i); break;
      }
    }
  } else if (freq === 'weekly') {
    let daysUntilMon = (8 - now.getUTCDay()) % 7 || 7;
    if (now.getUTCDay() === 1 && now.getUTCHours() < 8) daysUntilMon = 0;
    next.setUTCDate(next.getUTCDate() + daysUntilMon);
  } else if (freq === 'monthly') {
    next.setUTCDate(1);
    if (now.getUTCDate() > 1 || now.getUTCHours() >= 8) next.setUTCMonth(next.getUTCMonth() + 1);
  }
  return next.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' at 8:00 AM';
}

function selectFreq(el, freq) {
  document.querySelectorAll('#freq-chips .tone-chip').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  apFreq = freq;
  saveApSettings();
  if (apSettings.enabled) updateNextRunLabel();
}

function selectApTone(el, tone) {
  document.querySelectorAll('#ap-tone-chips .tone-chip').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  apTone = tone;
  saveApSettings();
}

function toggleAutopilot() {
  // Check WP is connected
  const wp = localStorage.getItem('cruise_wp_connection');
  if (!wp && !apSettings.enabled) {
    toast('Connect WordPress first in the Publish tab', false);
    return;
  }
  saveApSettings();
  apSettings.enabled = !apSettings.enabled;
  localStorage.setItem('cruise_autopilot', JSON.stringify(apSettings));
  renderAutopilotUI();
  if (apSettings.enabled) toast('Autopilot enabled! First post will run on schedule.', true);
  else toast('Autopilot paused.', false);
}

async function triggerNow() {
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  if (!wp.url) { toast('Connect WordPress first', false); return; }

  const btn = document.getElementById('ap-run-now-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Running...'; }

  saveApSettings();
  const seeds = apSettings.seeds || (brand.keywords || []).join(', ') || brand.industry || 'general business tips';

  try {
    const res = await fetch('/api/autopilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        manualTrigger: true,
        wpUrl: wp.url,
        wpUser: wp.username,
        wpPass: atob(wp.password),
        brand: brand.name + '. ' + (brand.industry || '') + '. ' + (brand.voice || ''),
        frequency: apFreq,
        keywords: seeds.split(',').map(s => s.trim()).filter(Boolean),
        tone: apTone,
        bookingUrl: brand.bookingUrl || brand.booking_url || '',
        existingPosts: getAllPublishedPosts().slice(0,10).map(p=>({title:p.title,url:p.url}))
      })
    });

    const data = await res.json();
    if (data.status === 'success') {
      addApLog({ topic: data.topic, title: data.title, url: data.postUrl, status: 'ok', ts: data.timestamp });
      toast('Post published: ' + data.title.slice(0, 40) + '...', true);
      renderApLog();
    } else {
      addApLog({ topic: 'Error', title: data.error, url: '', status: 'err', ts: new Date().toISOString() });
      toast('Autopilot error: ' + data.error, false);
      renderApLog();
    }
  } catch(err) {
    toast('Failed: ' + err.message, false);
  }

  if (btn) { btn.disabled = false; btn.textContent = 'Run now ↗'; }
}

function addApLog(entry) {
  const logs = JSON.parse(localStorage.getItem('cruise_ap_log') || '[]');
  logs.unshift(entry);
  localStorage.setItem('cruise_ap_log', JSON.stringify(logs.slice(0, 50)));
}

function renderApLog() {
  const el = document.getElementById('ap-log-body');
  if (!el) return;
  const logs = JSON.parse(localStorage.getItem('cruise_ap_log') || '[]');
  if (!logs.length) {
    el.innerHTML = '<div style="padding:28px;text-align:center;color:var(--ink4);font-size:13px">No autopilot runs yet</div>';
    return;
  }
  el.innerHTML = `<table style="width:100%;border-collapse:collapse">
    <thead><tr style="background:var(--cream2);border-bottom:1px solid var(--border)">
      <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Status</th>
      <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Title</th>
      <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Topic</th>
      <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink4)">Time</th>
    </tr></thead>
    <tbody>${logs.map(l => `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:10px 16px"><span style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:100px;background:${l.status==='ok'?'rgba(74,222,128,.12)':'rgba(192,48,79,.08)'};color:${l.status==='ok'?'#16a34a':'#C0304F'}">${l.status==='ok'?'Published':'Failed'}</span></td>
      <td style="padding:10px 16px;font-size:13px;color:var(--ink2);max-width:300px">${l.url?`<a href="${l.url}" target="_blank" style="color:var(--amber);font-weight:600">${l.title}</a>`:l.title}</td>
      <td style="padding:10px 16px;font-size:12px;color:var(--ink4)">${l.topic || '—'}</td>
      <td style="padding:10px 16px;font-size:12px;color:var(--ink4)">${new Date(l.ts).toLocaleDateString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</td>
    </tr>`).join('')}</tbody>
  </table>`;
}


// ── Content List + Calendar ──────────────────────────────────────
let calOffset = 0;

function switchContentTab(tab) {
  const listView = document.getElementById('content-list-view');
  const calView = document.getElementById('content-calendar-view');
  const listBtn = document.getElementById('tab-list-btn');
  const calBtn = document.getElementById('tab-cal-btn');
  if (tab === 'list') {
    if(listView) listView.style.display = '';
    if(calView) calView.style.display = 'none';
    if(listBtn) { listBtn.style.background='var(--cream)'; listBtn.style.boxShadow='0 1px 3px rgba(0,0,0,.08)'; listBtn.style.color=''; }
    if(calBtn) { calBtn.style.background='transparent'; calBtn.style.boxShadow='none'; calBtn.style.color='var(--ink4)'; }
    renderAllPosts();
  } else {
    if(listView) listView.style.display = 'none';
    if(calView) calView.style.display = '';
    if(calBtn) { calBtn.style.background='var(--cream)'; calBtn.style.boxShadow='0 1px 3px rgba(0,0,0,.08)'; calBtn.style.color=''; }
    if(listBtn) { listBtn.style.background='transparent'; listBtn.style.boxShadow='none'; listBtn.style.color='var(--ink4)'; }
    renderCalendarNew();
  }
}

function getAllPublishedPosts() {
  const ap = JSON.parse(localStorage.getItem('cruise_ap_log') || '[]');
  const wp = JSON.parse(localStorage.getItem('cruise_wp_log') || '[]');
  return [...ap, ...wp]
    .filter(p => p.title)
    .sort((a,b) => new Date(b.ts) - new Date(a.ts));
}

function renderAllPosts() {
  const posts = getAllPublishedPosts();
  const tbody = document.getElementById('all-posts');
  const empty = document.getElementById('all-posts-empty');
  if (!tbody) return;
  if (!posts.length) {
    tbody.innerHTML = '';
    if(empty) empty.style.display = '';
    return;
  }
  if(empty) empty.style.display = 'none';
  tbody.innerHTML = posts.map(p => {
    const date = new Date(p.ts).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
    const isAp = (JSON.parse(localStorage.getItem('cruise_ap_log')||'[]')).some(a => a.ts === p.ts);
    const sourceBadge = isAp
      ? '<span style="font-size:10px;padding:2px 7px;border-radius:100px;background:rgba(76,148,178,.15);color:var(--blue);font-weight:700">Autopilot</span>'
      : '<span style="font-size:10px;padding:2px 7px;border-radius:100px;background:var(--cream3);color:var(--ink4);font-weight:700">Manual</span>';
    const statusBadge = p.status === 'ok'
      ? '<span style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:100px;background:rgba(74,222,128,.12);color:#16a34a">Live</span>'
      : '<span style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:100px;background:rgba(192,48,79,.08);color:#C0304F">Failed</span>';
    const wpId = p.wpId || '';
    const postUrl = p.url || '';
    return `<tr style="border-bottom:1px solid var(--border)" data-ts="${p.ts}">
      <td style="padding:10px 8px 10px 16px"><input type="checkbox" class="content-check post-check" data-ts="${p.ts}" onchange="updateBulkBar()" /></td>
      <td style="padding:10px 16px">${statusBadge}</td>
      <td style="padding:10px 16px;font-size:13px;font-weight:600;max-width:280px">${p.url ? `<a href="${p.url}" target="_blank" style="color:var(--amber)">${p.title}</a>` : p.title}</td>
      <td style="padding:10px 16px;font-size:12px;color:var(--ink4)">${(p.topic && isNaN(String(p.topic)) && p.topic !== '—') ? p.topic : '—'}</td>
      <td style="padding:10px 16px;font-size:12px;color:var(--ink4);text-align:center">${p.seoScore || '—'}</td>
      <td style="padding:10px 16px;font-size:12px;color:var(--ink4)">${date}</td>
      <td style="padding:10px 16px">${sourceBadge}</td>
      <td style="padding:10px 12px;white-space:nowrap">
        <!-- LINE_554_REMOVED -->
        <button class="btn btn-ghost" onclick="document.getElementById('grader-url').value='${p.url||p.title||''}';nav(null,'grader')" style="font-size:11px;padding:3px 10px;margin-left:4px">Grade</button>
      </td>
    </tr>`;
  }).join('');
}

function calNav(dir) {
  calOffset += dir;
  renderCalendarNew();
}

function renderCalendarNew() {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + calOffset, 1);
  const month = d.getMonth();
  const year = d.getFullYear();
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const titleEl = document.getElementById('calTitle');
  if (titleEl) titleEl.textContent = months[month] + ' ' + year;

  const posts = getAllPublishedPosts();
  const postsByDate = {};
  posts.forEach(p => {
    const key = new Date(p.ts).toDateString();
    if (!postsByDate[key]) postsByDate[key] = [];
    postsByDate[key].push(p);
  });

  // Get autopilot scheduled days
  const apSettings = JSON.parse(localStorage.getItem('cruise_autopilot') || '{}');
  const scheduledDays = apSettings.enabled ? getScheduledDaysInMonth(apSettings.frequency || '3x_week', month, year) : [];

  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = (firstDay === 0) ? 6 : firstDay - 1; // Mon-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid = document.getElementById('cal-grid');
  if (!grid) return;

  let cells = '';
  for (let i = 0; i < startOffset; i++) cells += '<div></div>';
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const key = dateObj.toDateString();
    const dayPosts = postsByDate[key] || [];
    const isToday = dateObj.toDateString() === now.toDateString();
    const isScheduled = scheduledDays.includes(day);
    const hasPosts = dayPosts.length > 0;
    cells += `<div style="min-height:70px;padding:6px;border-radius:8px;border:1px solid ${isToday ? 'var(--amber)' : 'var(--border)'};background:${isToday ? 'rgba(197,150,69,.06)' : hasPosts ? 'rgba(74,222,128,.05)' : 'var(--cream)'};cursor:${hasPosts ? 'pointer' : 'default'}" ${hasPosts ? `onclick="showDayPosts('${key}')"` : ''}>
      <div style="font-size:12px;font-weight:${isToday?'800':'600'};color:${isToday?'var(--amber)':'var(--ink3)'};margin-bottom:4px">${day}</div>
      ${hasPosts ? `<div style="font-size:10px;font-weight:700;padding:2px 5px;border-radius:4px;background:rgba(74,222,128,.2);color:#16a34a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${dayPosts[0].title?.split(' ').slice(0,3).join(' ')}...</div>` : ''}
      ${isScheduled && !hasPosts ? '<div style="font-size:10px;color:var(--blue);opacity:.6">● scheduled</div>' : ''}
    </div>`;
  }
  grid.innerHTML = cells;
}

function getScheduledDaysInMonth(freq, month, year) {
  const days = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const freqMap = { daily: [0,1,2,3,4,5,6], '3x_week': [1,3,5], weekly: [1], monthly: [] };
  const targetDays = freqMap[freq] || [1,3,5];
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay();
    if (targetDays.includes(dow)) days.push(d);
  }
  return days;
}

function showDayPosts(dateKey) {
  const posts = getAllPublishedPosts().filter(p => new Date(p.ts).toDateString() === dateKey);
  if (!posts.length) return;
  if (posts[0].url) window.open(posts[0].url, '_blank');
}

// ── Keyword Research ─────────────────────────────────────────────
async function runKwResearch() {
  const kw = document.getElementById('kwInput')?.value?.trim();
  if (!kw) return;

  const loading = document.getElementById('kw-loading');
  const results = document.getElementById('kw-results-wrap');
  const btn = document.getElementById('kwBtn');

  if(loading) loading.style.display = '';
  if(results) results.style.display = 'none';
  if(btn) { btn.disabled = true; btn.textContent = 'Researching...'; }

  try {
    const prompt = `You are an SEO keyword research expert. Research the keyword: "${kw}"

Provide detailed keyword analysis. Return ONLY a JSON object (no markdown, no code blocks):
{
  "main_keyword": "${kw}",
  "estimated_monthly_searches": "number as string like 1200 or 500-1000",
  "difficulty_score": "number 1-100",
  "opportunity_score": "number 1-100",
  "search_intent": "informational|commercial|navigational|transactional",
  "related_keywords": [
    { "keyword": "...", "volume": "...", "difficulty": 30, "intent": "informational" }
  ],
  "content_ideas": [
    { "title": "...", "angle": "..." }
  ],
  "quick_wins": ["keyword1", "keyword2", "keyword3"]
}

Include 8 related keywords and 6 content ideas. Focus on UK search trends if relevant.`;

    const res = await fetch('/api/ai-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
    });
    const data = await res.json();
    const raw = data.content?.map(x => x.text || '').join('') || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    const kd = JSON.parse(clean);

    // Render stats
    document.getElementById('kw-stat-vol').textContent = kd.estimated_monthly_searches || '—';
    document.getElementById('kw-stat-diff').textContent = (kd.difficulty_score || '—') + (kd.difficulty_score ? '/100' : '');
    document.getElementById('kw-stat-opp').textContent = (kd.opportunity_score || '—') + (kd.opportunity_score ? '/100' : '');

    // Render keyword table
    const tbody = document.getElementById('kw-table-body');
    if (tbody) tbody.innerHTML = (kd.related_keywords || []).map(k => {
      const diffColor = k.difficulty < 30 ? '#16a34a' : k.difficulty < 60 ? 'var(--amber)' : '#C0304F';
      return `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:10px 16px;font-size:13px;font-weight:600">${k.keyword}</td>
        <td style="padding:10px 16px;font-size:13px;text-align:center;color:var(--ink3)">${k.volume || '—'}</td>
        <td style="padding:10px 16px;text-align:center"><span style="font-size:12px;font-weight:700;color:${diffColor}">${k.difficulty}/100</span></td>
        <td style="padding:10px 16px;text-align:center"><span style="font-size:11px;padding:2px 8px;border-radius:100px;background:var(--cream2);color:var(--ink3)">${k.intent}</span></td>
        <td style="padding:10px 16px;text-align:center">
          <button class="btn" style="font-size:11px;padding:4px 10px" onclick="generateFromKeyword('${k.keyword.replace(/'/g,"\'")}')">Write post</button>
        </td>
      </tr>`;
    }).join('');

    // Render content ideas
    const ideas = document.getElementById('kw-content-ideas');
    if (ideas) ideas.innerHTML = (kd.content_ideas || []).map(idea => `
      <div class="card" style="padding:14px 16px;cursor:pointer;hover:background:var(--cream2)" onclick="generateFromKeyword('${idea.title.replace(/'/g,"\'")}')">
        <div style="font-size:13px;font-weight:700;color:var(--ink);margin-bottom:4px">${idea.title}</div>
        <div style="font-size:12px;color:var(--ink4)">${idea.angle}</div>
        <div style="font-size:11px;color:var(--amber);margin-top:8px;font-weight:600">Write this post →</div>
      </div>`).join('');

    // Quick win suggestions
    const sugg = document.getElementById('kw-suggestions');
    if (sugg && kd.quick_wins) {
      sugg.innerHTML = '<span style="font-size:12px;color:var(--ink4);margin-right:4px">Quick wins:</span>' +
        kd.quick_wins.map(w => `<span class="tone-chip" style="cursor:pointer" onclick="document.getElementById('kwInput').value='${w.replace(/'/g,"\'")}';runKwResearch()">${w}</span>`).join('');
    }

    if(results) results.style.display = '';
  } catch(e) {
    toast('Keyword research failed: ' + e.message, false);
  }

  if(loading) loading.style.display = 'none';
  if(btn) { btn.disabled = false; btn.textContent = 'Research ✦'; }
}

function generateFromKeyword(kw) {
  nav(null, 'engine');
  setTimeout(() => {
    const inp = document.getElementById('kwInput2') || document.getElementById('genKeyword');
    if (inp) inp.value = kw;
    // Try to set the generator input
    const genInp = document.querySelector('#view-engine input[type="text"], #view-engine input:not([type])');
    if (genInp) genInp.value = kw;
  }, 100);
}

// ── Update publishToWP to log seoScore ───────────────────────────
const _origAddWPLog = typeof addWPLog === 'function' ? addWPLog : null;

// ── Call renderAllPosts when posts view shown ────────────────────
const _origNav = nav;
function nav(el, id) {
  _origNav(el, id);
  if (id === 'posts') { setTimeout(renderAllPosts, 50); }
  if (id === 'dashboard') { setTimeout(renderDashQueue, 50); }
}

// ── Initialise new features ──────────────────────────────────────
function syncWPPostsToLog() {
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  if (!wp.url) return;
  fetch('/api/wp-proxy', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ action: 'posts', url: wp.url, username: wp.username, password: atob(wp.password) })
  }).then(r => r.json()).then(d => {
    if (d.posts?.length) {
      const logs = d.posts.map(p => ({
        title: p.title?.rendered?.replace(/&#[0-9]+;/g, c => String.fromCharCode(parseInt(c.slice(2,-1)))) || p.slug,
        url: p.link,
        status: 'ok',
        topic: '—',
        ts: p.date,
        seoScore: null,
        source: 'WordPress'
      }));
      localStorage.setItem('cruise_wp_log', JSON.stringify(logs));
      renderDashQueue();
      renderAllPosts();
    }
  }).catch(() => {});
}

function initNewFeatures() {
  renderDashQueue();
  syncWPPostsToLog();
  loadDashHealth();
  // Update keyword count stat
  const rankData = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  const kwCountEl = document.getElementById('stKwCount');
  const kwSubEl = document.getElementById('stKwSub');
  if (kwCountEl) kwCountEl.textContent = rankData.length || '—';
  if (kwSubEl && rankData.length) kwSubEl.textContent = 'keywords tracked';
  // Pre-fill keyword seeds from brand
  const sugg = document.getElementById('kw-suggestions');
  if (sugg && brand?.keywords?.length) {
    sugg.innerHTML = '<span style="font-size:12px;color:var(--ink4);margin-right:4px">Try:</span>' +
      (brand.keywords || []).slice(0,5).map(w =>
        `<span class="tone-chip" style="cursor:pointer" onclick="document.getElementById('kwInput').value='${w}';runKwResearch()">${w}</span>`
      ).join('');
  }
}


// ═══════════════════════════════════════════════════════════════
// SEO SUITE — Content Grader, Site Audit, Clusters, Competitor, Social
// ═══════════════════════════════════════════════════════════════

// ── Shared helpers ───────────────────────────────────────────────
async function callAI(prompt, maxTokens) {
  const res = await fetch('/api/ai-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], max_tokens: maxTokens || 2000 })
  });
  const data = await res.json();
  const raw = (data.content || []).map(x => x.text || '').join('');
  return raw.replace(/```json\n?|```\n?/g, '').trim();
}

function scoreColor(n) {
  if (n >= 80) return 'var(--sage)';
  if (n >= 60) return 'var(--amber)';
  return '#C0304F';
}

function issueItem(text, type) {
  const icon = type === 'error' ? '✗' : type === 'warn' ? '⚠' : '✓';
  const col = type === 'error' ? '#C0304F' : type === 'warn' ? 'var(--amber)' : 'var(--sage)';
  return `<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);align-items:flex-start">
    <span style="color:${col};font-weight:700;flex-shrink:0;font-size:13px">${icon}</span>
    <span style="font-size:13px;color:var(--ink2);line-height:1.5">${text}</span>
  </div>`;
}

// ── 1. CONTENT GRADER ────────────────────────────────────────────
async function runGrader() {
  const url = document.getElementById('grader-url')?.value?.trim();
  const content = document.getElementById('grader-content')?.value?.trim();
  if (!url && !content) { toast('Enter a URL or paste content', false); return; }

  const btn = document.getElementById('grader-btn');
  const loading = document.getElementById('grader-loading');
  const results = document.getElementById('grader-results');
  btn.disabled = true; btn.textContent = 'Grading...';
  loading.style.display = ''; results.style.display = 'none';

  try {
    const subject = url || content.slice(0, 200);
    const prompt = `You are an expert SEO content auditor. Analyse this content/URL: "${subject}"

Grade it across multiple dimensions and provide actionable fixes.
Return ONLY a JSON object:
{
  "overall": 72,
  "seo_score": 68,
  "readability_score": 80,
  "engagement_score": 65,
  "issues": ["Missing focus keyword in H1", "Meta description too long (180 chars)", "No internal links to related content", "Paragraphs too long — average 120 words"],
  "quick_wins": ["Add keyword to first 100 words", "Break paragraphs into 3-4 sentences max", "Add a table of contents for posts over 1500 words", "Include at least 2 internal links"],
  "rewritten_intro": "A better opening paragraph that hooks readers immediately and includes the focus keyword naturally within the first two sentences."
}`;

    const raw = await callAI(prompt, 1500);
    const d = JSON.parse(raw);

    const overall = document.getElementById('gr-overall');
    overall.textContent = d.overall + '/100';
    overall.style.color = scoreColor(d.overall);
    document.getElementById('gr-seo').textContent = d.seo_score + '/100';
    document.getElementById('gr-seo').style.color = scoreColor(d.seo_score);
    document.getElementById('gr-read').textContent = d.readability_score + '/100';
    document.getElementById('gr-read').style.color = scoreColor(d.readability_score);
    document.getElementById('gr-eng').textContent = d.engagement_score + '/100';
    document.getElementById('gr-eng').style.color = scoreColor(d.engagement_score);

    document.getElementById('gr-issues').innerHTML = (d.issues || []).map(i => issueItem(i, 'error')).join('');
    document.getElementById('gr-wins').innerHTML = (d.quick_wins || []).map(i => issueItem(i, 'ok')).join('');
    document.getElementById('gr-rewrite').textContent = d.rewritten_intro || '';

    results.style.display = '';
  } catch(e) { toast('Grader error: ' + e.message, false); }

  loading.style.display = 'none';
  btn.disabled = false; btn.textContent = 'Grade it ✦';
}

// ── 2. SITE AUDIT ────────────────────────────────────────────────
async function runAudit() {
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  if (!wp.url) { toast('Connect WordPress first in the Publish tab', false); return; }

  const btn = document.getElementById('audit-btn');
  const loading = document.getElementById('audit-loading');
  const results = document.getElementById('audit-results');
  btn.disabled = true; btn.textContent = 'Auditing...';
  loading.style.display = ''; results.style.display = 'none';

  try {
    // Fetch posts from WP
    const wpRes = await fetch('/api/wp-proxy', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ action: 'posts', url: wp.url, username: wp.username, password: atob(wp.password) })
    });
    const wpData = await wpRes.json();
    const posts = wpData.posts || [];
    const postSummary = posts.slice(0,10).map(p =>
      `Title: "${p.title?.rendered}" | Has excerpt: ${!!p.excerpt?.rendered?.replace(/<[^>]+>/g,'')} | Has featured image: ${!!p.featured_media}`
    ).join('\n');

    const prompt = `You are an SEO technical auditor. Analyse this WordPress site: ${wp.url}

Here are the most recent posts:
${postSummary}

Perform a comprehensive SEO audit and return ONLY a JSON object:
{
  "health_score": 74,
  "error_count": 3,
  "warning_count": 7,
  "pages_checked": ${posts.length},
  "issues": [
    { "type": "error", "category": "Meta", "title": "Missing meta descriptions", "detail": "8 of 20 posts have no meta description set", "fix": "Add meta descriptions in WordPress SEO plugin" },
    { "type": "error", "category": "Images", "title": "Missing alt text", "detail": "Featured images on 5 posts have no alt text", "fix": "Edit each post and add descriptive alt text to images" },
    { "type": "warn", "category": "Content", "title": "Thin content detected", "detail": "3 posts are under 300 words", "fix": "Expand these posts to at least 800 words" },
    { "type": "warn", "category": "Internal Links", "title": "Low internal linking", "detail": "Most posts have fewer than 2 internal links", "fix": "Add links between related posts" },
    { "type": "warn", "category": "Schema", "title": "No Article schema markup", "detail": "Posts are missing structured data", "fix": "Install Yoast SEO or RankMath and enable Article schema" }
  ]
}`;

    const raw = await callAI(prompt, 2000);
    const d = JSON.parse(raw);

    const scoreEl = document.getElementById('aud-score');
    scoreEl.textContent = d.health_score + '/100';
    scoreEl.style.color = scoreColor(d.health_score);
    document.getElementById('aud-errors').textContent = d.error_count;
    document.getElementById('aud-warnings').textContent = d.warning_count;
    document.getElementById('aud-pages').textContent = d.pages_checked;

    const list = document.getElementById('audit-issues-list');
    list.innerHTML = (d.issues || []).map(issue => `
      <div style="padding:16px 20px;border-bottom:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
          <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:100px;background:${issue.type==='error'?'rgba(192,48,79,.1)':'rgba(197,150,69,.1)'};color:${issue.type==='error'?'#C0304F':'var(--amber)'};">${issue.category}</span>
          <span style="font-size:13px;font-weight:700;color:var(--ink)">${issue.title}</span>
        </div>
        <div style="font-size:13px;color:var(--ink3);margin-bottom:6px">${issue.detail}</div>
        <div style="font-size:12px;color:var(--sage);font-weight:600">Fix: ${issue.fix}</div>
      </div>`).join('');

    localStorage.setItem('cruise_last_audit', JSON.stringify({ health_score: d.health_score, ts: new Date().toISOString() }));
    // Save to score history
    const audHist = JSON.parse(localStorage.getItem('cruise_audit_history') || '[]');
    audHist.push({ score: d.health_score, ts: new Date().toISOString() });
    if (audHist.length > 12) audHist.splice(0, audHist.length - 12);
    localStorage.setItem('cruise_audit_history', JSON.stringify(audHist));
    renderScoreHistory();
    document.getElementById('audit-pre-state').style.display = 'none';
    const lastRun = document.getElementById('audit-last-run');
    if (lastRun) lastRun.textContent = 'Last run: just now · ' + d.pages_checked + ' pages checked';
    results.style.display = '';
    loadDashHealth();
  } catch(e) { toast('Audit error: ' + e.message, false); }

  loading.style.display = 'none';
  btn.disabled = false; btn.textContent = 'Run full audit ✦';
}

// ── 3. TOPIC CLUSTER BUILDER ─────────────────────────────────────
let clusterData = null;

async function runClusterBuilder() {
  const topic = document.getElementById('cluster-input')?.value?.trim();
  if (!topic) { toast('Enter a pillar topic', false); return; }

  const btn = document.getElementById('cluster-btn');
  const loading = document.getElementById('cluster-loading');
  const results = document.getElementById('cluster-results');
  btn.disabled = true; btn.textContent = 'Building...';
  loading.style.display = ''; results.style.display = 'none';

  try {
    const b = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
    const bookingUrl = b.bookingUrl || b.booking_url || '';
    const prompt = `You are an SEO content strategist. Build a topic cluster for: "${topic}"
Brand: ${b.name || 'tutoring business'}
${bookingUrl ? `Booking/contact URL: ${bookingUrl}` : ''}

Create a pillar page and 8 supporting posts. Each supporting post should internally link back to the pillar AND include a CTA to book/contact the business${bookingUrl ? ' at ' + bookingUrl : ''}.

Return ONLY JSON:
{
  "pillar": {
    "title": "The Complete Guide to [Topic]",
    "description": "Comprehensive overview targeting the main keyword",
    "keyword": "main keyword",
    "word_count": 3000
  },
  "supporting_posts": [
    {
      "title": "post title",
      "keyword": "long-tail keyword",
      "angle": "specific angle this post covers",
      "internal_link_anchor": "anchor text to link back to pillar",
      "cta": "Book a free ${topic} consultation today"
    }
  ]
}`;

    const raw = await callAI(prompt, 2500);
    clusterData = JSON.parse(raw);

    document.getElementById('cluster-pillar-title').textContent = clusterData.pillar?.title || '';
    document.getElementById('cluster-pillar-desc').textContent = clusterData.pillar?.description || '';
    document.getElementById('cluster-count').textContent = '(' + (clusterData.supporting_posts?.length || 0) + ' posts)';

    const postsEl = document.getElementById('cluster-posts');
    postsEl.innerHTML = (clusterData.supporting_posts || []).map((p, i) => `
      <div class="card" style="padding:16px">
        <div style="font-size:13px;font-weight:700;color:var(--ink);margin-bottom:6px">${p.title}</div>
        <div style="font-size:12px;color:var(--ink4);margin-bottom:4px">Keyword: <strong style="color:var(--blue)">${p.keyword}</strong></div>
        <div style="font-size:12px;color:var(--ink3);margin-bottom:10px">${p.angle}</div>
        <div style="font-size:11px;color:var(--sage);margin-bottom:10px">↩ Links back via: "${p.internal_link_anchor}"</div>
        <button class="btn btn-primary" style="font-size:11px;padding:5px 12px;width:100%" onclick="generateClusterPost(${i})">Generate this post →</button>
      </div>`).join('');

    results.style.display = '';
  } catch(e) { toast('Cluster error: ' + e.message, false); }

  loading.style.display = 'none';
  btn.disabled = false; btn.textContent = 'Build cluster ✦';
}

// generateClusterPillar replaced in generateClusterPost block above

function generateClusterPost(idx) {
  if (!clusterData?.supporting_posts?.[idx]) return;
  const post = clusterData.supporting_posts[idx];
  generateClusterInTab(post.keyword || post.title, post.title, post.angle || '', post.cta || '');
}

function generateClusterPillar() {
  if (!clusterData?.pillar) return;
  generateClusterInTab(clusterData.pillar.keyword || clusterData.pillar.title, clusterData.pillar.title, clusterData.pillar.description || '', '');
}

// ── 4. COMPETITOR ANALYSIS ───────────────────────────────────────
async function runCompetitor() {
  const url = document.getElementById('competitor-url')?.value?.trim();
  if (!url) { toast('Enter a competitor URL', false); return; }

  const btn = document.getElementById('competitor-btn');
  const loading = document.getElementById('competitor-loading');
  const results = document.getElementById('competitor-results');
  btn.disabled = true; btn.textContent = 'Analysing...';
  loading.style.display = ''; results.style.display = 'none';

  try {
    const b = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
    const prompt = `You are an SEO competitive analyst. Analyse the competitor website: ${url}
My business: ${b.name || 'tutoring'} — ${b.industry || ''} — Keywords: ${(b.keywords||[]).join(', ')}

Identify their strengths, content gaps I can exploit, and keywords I should target to beat them.
Return ONLY JSON:
{
  "strengths": ["They rank well for X", "Strong backlink profile", "Regular content publishing"],
  "content_gaps": ["No content on Y topic", "Missing local SEO pages", "No comparison posts"],
  "keywords_to_target": [
    { "keyword": "...", "why": "They rank #4, I can beat them with better content" }
  ],
  "recommended_posts": [
    { "title": "...", "angle": "...", "keyword": "..." }
  ]
}`;

    const raw = await callAI(prompt, 2000);
    const d = JSON.parse(raw);

    document.getElementById('comp-strengths').innerHTML = (d.strengths||[]).map(s => issueItem(s, 'warn')).join('');
    document.getElementById('comp-gaps').innerHTML = (d.content_gaps||[]).map(s => issueItem(s, 'ok')).join('');
    document.getElementById('comp-keywords').innerHTML = (d.keywords_to_target||[]).map(k =>
      `<div style="padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-size:13px;font-weight:700;color:var(--blue)">${k.keyword}</div>
        <div style="font-size:12px;color:var(--ink4);margin-top:2px">${k.why}</div>
      </div>`).join('');

    document.getElementById('comp-posts').innerHTML = (d.recommended_posts||[]).map(p => `
      <div class="card" style="padding:14px">
        <div style="font-size:13px;font-weight:700;margin-bottom:4px">${p.title}</div>
        <div style="font-size:12px;color:var(--ink4);margin-bottom:8px">${p.angle}</div>
        <button class="btn btn-primary" style="font-size:11px;padding:4px 12px" onclick="generateFromKeyword('${p.keyword?.replace(/'/g,"\\'")}')">Write this post →</button>
      </div>`).join('');

    results.style.display = '';
  } catch(e) { toast('Competitor error: ' + e.message, false); }

  loading.style.display = 'none';
  btn.disabled = false; btn.textContent = 'Analyse ✦';
}

// ── 5. SOCIAL SNIPPETS ───────────────────────────────────────────
async function runSocialSnippets() {
  const urlOrTitle = document.getElementById('social-url')?.value?.trim();
  if (!urlOrTitle) { toast('Enter a URL or post title', false); return; }

  const btn = document.getElementById('social-btn');
  const loading = document.getElementById('social-loading');
  const results = document.getElementById('social-results');
  btn.disabled = true; btn.textContent = 'Generating...';
  loading.style.display = ''; results.style.display = 'none';

  try {
    const b = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
    const prompt = `You are a social media copywriter. Write social posts for this article: "${urlOrTitle}"
Brand: ${b.name || 'business'} — ${b.industry || ''} — Tone: ${b.tone || 'professional'}

Write engaging social posts for each platform. Return ONLY JSON:
{
  "twitter": "Tweet under 280 chars with 2-3 hashtags and a hook. Include the URL at the end.",
  "linkedin": "LinkedIn post 150-200 words. Professional tone. Start with a bold hook line. Use line breaks. End with a question to drive comments. Include 3 hashtags.",
  "facebook": "Facebook post 100-150 words. Conversational. Speak to parents/students. Include an emoji or two. End with a CTA.",
  "email_subjects": "Subject line 1\nSubject line 2\nSubject line 3\nSubject line 4\nSubject line 5"
}`;

    const raw = await callAI(prompt, 1500);
    const d = JSON.parse(raw);

    document.getElementById('social-twitter').textContent = d.twitter || '';
    document.getElementById('social-linkedin').textContent = d.linkedin || '';
    document.getElementById('social-facebook').textContent = d.facebook || '';
    document.getElementById('social-email').textContent = d.email_subjects || '';

    results.style.display = '';
  } catch(e) { toast('Social error: ' + e.message, false); }

  loading.style.display = 'none';
  btn.disabled = false; btn.textContent = 'Generate ✦';
}

function copySnippet(platform) {
  const el = document.getElementById('social-' + platform);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => toast('Copied to clipboard!', true));
}

function initSocialRecent() {
  const posts = getAllPublishedPosts().slice(0,5);
  const el = document.getElementById('social-recent-btns');
  if (!el || !posts.length) return;
  el.innerHTML = '<span style="font-size:12px;color:var(--ink4);margin-right:4px">Recent:</span>' +
    posts.map(p => `<span class="tone-chip" style="cursor:pointer;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" onclick="document.getElementById('social-url').value='${(p.url||p.title).replace(/'/g,"\\'")}';runSocialSnippets()">${p.title?.split(' ').slice(0,5).join(' ')}...</span>`).join('');
}

// ── 6. SEO META INJECTOR (runs on every publish) ─────────────────
async function injectSEOMeta(wpUrl, wpUser, wpPass, postId, title, content) {
  try {
    const prompt = `Write an SEO meta description for this post:
Title: "${title}"
Content preview: "${content.replace(/<[^>]+>/g,'').slice(0,300)}"

Return ONLY JSON:
{
  "meta_description": "150-160 char compelling meta description with keyword",
  "focus_keyword": "main keyword phrase",
  "og_title": "Open Graph title (can differ slightly from post title)"
}`;
    const raw = await callAI(prompt, 400);
    const meta = JSON.parse(raw);
    // Update the post with yoast/rankmath meta via WP REST
    const creds = btoa(wpUser + ':' + wpPass);
    await fetch(wpUrl + '/wp-json/wp/v2/posts/' + postId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic ' + creds },
      body: JSON.stringify({ meta: { _yoast_wpseo_metadesc: meta.meta_description, _yoast_wpseo_focuskw: meta.focus_keyword } })
    });
  } catch(e) { /* silent fail — meta injection is best-effort */ }
}

// ── 7. INTERNAL LINKING (injected into content on publish) ────────
function injectInternalLinks(htmlContent, existingPosts, brandBookingUrl) {
  let content = htmlContent;
  const usedUrls = new Set();

  // Link to booking/contact page
  if (brandBookingUrl) {
    const bookingPhrases = ['book a', 'book your', 'get in touch', 'contact us', 'speak to a tutor', 'free consultation', 'get started', 'try a lesson', 'enquire'];
    for (const phrase of bookingPhrases) {
      const regex = new RegExp(`(${phrase}[^<.!?]{0,40})`, 'gi');
      if (regex.test(content)) {
        content = content.replace(regex, `<a href="${brandBookingUrl}" rel="noopener">$1</a>`);
        break;
      }
    }
  }

  // Link to related existing posts (max 3)
  let linksAdded = 0;
  for (const post of existingPosts) {
    if (linksAdded >= 3) break;
    if (!post.url || usedUrls.has(post.url)) continue;
    const words = (post.title || '').toLowerCase().split(' ').filter(w => w.length > 4);
    for (const word of words) {
      const regex = new RegExp(`(?<!href="|>)(${word}s?)(?![^<]*>)`, 'gi');
      if (regex.test(content) && !content.includes('href="' + post.url)) {
        content = content.replace(regex, `<a href="${post.url}" rel="noopener">$1</a>`);
        usedUrls.add(post.url);
        linksAdded++;
        break;
      }
    }
  }
  return content;
}

// Hook into existing publishToWP to add internal links + meta
const _origPublishToWP = typeof publishToWP === 'function' ? publishToWP : null;

// Expose injectInternalLinks for use in publish flow
window._injectInternalLinks = injectInternalLinks;
window._injectSEOMeta = injectSEOMeta;

// ── Init on nav ──────────────────────────────────────────────────
const __origNav = nav;
function nav(el, id) {
  __origNav(el, id);
  if (id === 'social') setTimeout(initSocialRecent, 50);
}



// ── WordPress Connection ──
const WP_KEY = 'cruise_wp_connection';

function loadWPState() {
  const saved = localStorage.getItem(WP_KEY);
  if (saved) {
    const wp = JSON.parse(saved);
    showWPConnected(wp);
  }
}

function renderPublish() {
  loadWPState();
  renderWPLog();
}

function connectWP() {
  const url = document.getElementById('wp-url').value.trim().replace(/\/$/, '');
  const username = document.getElementById('wp-username').value.trim();
  const password = document.getElementById('wp-apppass').value.trim();

  if (!url) { wpAlert('Please enter your WordPress site URL.', 'err'); return; }
  if (!username) { wpAlert('Please enter your WordPress username.', 'err'); return; }
  if (!password) { wpAlert('Please enter your Application Password.', 'err'); return; }

  setWPLoading(true);
  clearWPAlert();

  fetch('/api/wp-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'test', url, username, password })
  })
  .then(r => r.json().then(data => ({ ok: r.ok, data })))
  .then(({ ok, data }) => {
    if (!ok) throw new Error(data.error || 'Connection failed');
    const wp = { url, username, password: btoa(password), name: data.name || username, connected: true };
    localStorage.setItem(WP_KEY, JSON.stringify(wp));
    setWPLoading(false);
    showWPConnected(wp);
    toast('WordPress connected!', true);
  })
  .catch(err => {
    setWPLoading(false);
    if (err.message.includes('401') || err.message.includes('incorrect_password') || err.message.includes('invalid_username')) {
      wpAlert('Wrong username or application password. Double-check and try again.', 'err');
    } else {
      wpAlert('Connection failed: ' + err.message, 'err');
    }
  });
}

function showWPConnected(wp) {
  document.getElementById('wp-connect-form').style.display = 'none';
  document.getElementById('wp-connected-state').style.display = 'block';
  document.getElementById('wp-connected-url').textContent = wp.url;
  document.getElementById('wp-connected-user').textContent = 'Connected as ' + wp.name;
  document.getElementById('wp-status-label').textContent = 'Connected';
  document.getElementById('wp-status-dot').style.background = 'var(--sage)';
}

function disconnectWP() {
  localStorage.removeItem(WP_KEY);
  document.getElementById('wp-connect-form').style.display = 'block';
  document.getElementById('wp-connected-state').style.display = 'none';
  document.getElementById('wp-status-label').textContent = 'Not connected';
  document.getElementById('wp-status-dot').style.background = 'var(--border2)';
  document.getElementById('wp-url').value = '';
  document.getElementById('wp-username').value = '';
  document.getElementById('wp-apppass').value = '';
  toast('WordPress disconnected', false);
}

async function testPublish() {
  const saved = localStorage.getItem(WP_KEY);
  if (!saved) { toast('Connect WordPress first', false); return; }
  const wp = JSON.parse(saved);
  const title = document.getElementById('wp-test-title').value.trim() || 'Test post from Cruise SEO';

  const btn = document.getElementById('btn-test-publish');
  btn.disabled = true;
  btn.textContent = 'Publishing...';

  try {
    const r = await fetch('/api/wp-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'publish',
        url: wp.url,
        username: wp.username,
        password: atob(wp.password),
        title,
        content: '<p>This is a test post published automatically by <strong>Cruise SEO</strong>. You can delete this — it was created to verify your connection is working.</p>',
        status: 'draft'
      })
    });

    const post = await r.json();
    if (!r.ok) throw new Error(post.error || 'HTTP ' + r.status);

    const resultEl = document.getElementById('wp-publish-result');
    resultEl.style.display = 'block';
    resultEl.style.background = 'var(--sage-l)';
    resultEl.style.border = '1px solid rgba(74,124,111,.2)';
    resultEl.style.color = 'var(--sage)';
    resultEl.innerHTML = '✓ Draft post created! <a href="' + wp.url + '/wp-admin/post.php?post=' + post.id + '&action=edit" target="_blank" style="color:var(--sage);font-weight:700;margin-left:6px">View in WordPress →</a>';

    addWPLog(title, wp.url, 'ok');
    toast('Post published to WordPress!', true);
  } catch(err) {
    const resultEl = document.getElementById('wp-publish-result');
    resultEl.style.display = 'block';
    resultEl.style.background = 'rgba(192,48,79,.06)';
    resultEl.style.border = '1px solid rgba(192,48,79,.2)';
    resultEl.style.color = '#C0304F';
    resultEl.textContent = 'Publish failed: ' + err.message;
    addWPLog(title, wp.url, 'err');
  }

  btn.disabled = false;
  btn.textContent = 'Publish test post';
}

function addWPLog(title, url, status) {
  const logs = JSON.parse(localStorage.getItem('cruise_wp_log') || '[]');
  logs.unshift({ title, url, status, time: new Date().toLocaleString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) });
  localStorage.setItem('cruise_wp_log', JSON.stringify(logs.slice(0, 20)));
  renderWPLog();
}

function renderWPLog() {
  const logs = JSON.parse(localStorage.getItem('cruise_wp_log') || '[]');
  const el = document.getElementById('wp-log-wrap');
  if (!logs.length) {
    el.innerHTML = '<div style="padding:28px;text-align:center;color:var(--ink4);font-size:13px">No posts published yet</div>';
    return;
  }
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:60px 1fr 1fr 100px;padding:10px 18px;background:var(--cream2);border-bottom:1px solid var(--border);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink4)">
      <span>Status</span><span>Title</span><span>Site</span><span>Time</span>
    </div>
    ${logs.map(l => `
    <div style="display:grid;grid-template-columns:60px 1fr 1fr 100px;padding:13px 18px;border-bottom:1px solid var(--border);align-items:center">
      <span class="badge ${l.status === 'ok' ? 'badge-live' : 'badge-draft'}">${l.status === 'ok' ? 'Sent' : 'Failed'}</span>
      <span style="font-size:13px;font-weight:600;color:var(--ink2)">${l.title}</span>
      <span style="font-size:11px;color:var(--ink4)">${l.url ? '<a href="'+l.url+'" target="_blank" style="color:var(--amber);font-weight:600">'+(() => { try { return new URL(l.url).hostname; } catch(e) { return l.url.replace('https://','').split('/')[0]; } })()+'</a>' : '—'}</span>
      <span style="font-size:11px;color:var(--ink4);font-family:var(--font-mono)">${l.time || (l.ts ? new Date(l.ts).toLocaleDateString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '—')}</span>
    </div>`).join('')}`;
}

function setWPLoading(on) {
  document.getElementById('btn-connect-wp').disabled = on;
  document.getElementById('wp-btn-txt').textContent = on ? 'Testing connection...' : 'Test connection & save';
}

function wpAlert(msg, type) {
  const el = document.getElementById('wp-connect-alert');
  el.style.display = 'block';
  el.style.background = type === 'err' ? 'rgba(192,48,79,.07)' : 'var(--sage-l)';
  el.style.border = '1px solid ' + (type === 'err' ? 'rgba(192,48,79,.2)' : 'rgba(74,124,111,.2)');
  el.style.color = type === 'err' ? '#C0304F' : 'var(--sage)';
  el.textContent = msg;
}

function clearWPAlert() {
  document.getElementById('wp-connect-alert').style.display = 'none';
}

// ── Pre-fill WordPress credentials ──
window.addEventListener('DOMContentLoaded', () => {
  const urlEl = document.getElementById('wp-url');
  const userEl = document.getElementById('wp-username');
  if (urlEl && !localStorage.getItem(WP_KEY)) {
    urlEl.value = 'https://smartxtutoring.uk';
  }
});

// ── Override legacy CSS vars for compat ──
document.documentElement.style.setProperty('--ac', 'var(--amber)');
// ── Navigation ──
function nav(el, id) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');
  else {
    document.querySelectorAll('.nav-item').forEach(i => {
      if (i.getAttribute('onclick') && i.getAttribute('onclick').includes("'"+id+"'")) i.classList.add('active');
    });
  }
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const view = document.getElementById('view-' + id);
  if (view) view.classList.add('active');
  const crumbMap = {dashboard:'Dashboard',posts:'Content',keywords:'Keywords',engine:'Generate',grader:'Content Grader',audit:'Site Audit',clusters:'Topic Clusters',competitor:'Competitor',social:'Social Snippets',ranks:'Rank Tracker',autopilot:'Autopilot',publish:'Publish',profile:'Brand Profile','social-connect':'Social Media'};
  document.getElementById('breadcrumb').textContent = crumbMap[id] || id.replace(/-/g,' ').replace(/\b\w/g,x=>x.toUpperCase());
  if (id === 'profile') { renderProfile(); loadProfileView(); }
  if (id === 'audit') { renderScoreHistory(); }
  if (id === 'social-connect') { loadSocialState(); }
  if (id === 'publish') { restoreCMSType(); }
  if (id === 'dashboard') { renderOnboardingChecklist(); }
  if (id === 'engine') setTimeout(loadGenQuickKws, 50);
  if (id === 'dashboard') { renderDashQueue(); loadDashHealth(); }
  if (id === 'posts') renderAllPosts();
  if (id === 'publish') renderPublish();
  if (id === 'ranks') loadRankTracker();
  if (id === 'grader') setTimeout(initGraderRecent, 50);
  if (window.innerWidth <= 768) closeSidebar();
}
// ── Autopilot ──
function toggleAP() {
  const t = document.getElementById('apToggle');
  const on = t.classList.toggle('on');
  document.getElementById('apTxt').textContent = on ? 'on' : 'off';
  document.getElementById('apTxt').style.color = on ? 'var(--sage)' : 'var(--ink4)';
  toast('Autopilot ' + (on ? 'enabled' : 'paused'), on);
}
// ── Engine tabs ──
function switchETab(el, type) {
  document.querySelectorAll('.etab').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
  curTab = type;
  document.getElementById('gen-output-wrap').style.display = 'none';
}
// ── Keyword research ──
async function researchKW() {
  const kw = document.getElementById('kwInput').value.trim();
  if (!kw) { toast('Enter a topic first', false); return; }
  const out = document.getElementById('kw-results');
  out.innerHTML = '<div style="padding:20px;text-align:center;color:var(--ink4);font-size:13px">Researching keywords...</div>';
  const industry = typeof brand !== 'undefined' ? (brand.industry || 'business') : 'business';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:600,
        messages:[{role:'user', content:`Generate 6 SEO keyword ideas for: "${kw}" in the ${industry} industry. Return ONLY JSON array: [{"term":"...","volume":"...","difficulty":"easy|medium|hard"}]`}]
      })
    });
    const data = await res.json();
    const text = data.content.map(c => c.text||'').join('');
    const clean = text.replace(/```json|```/g,'').trim();
    const keywords = JSON.parse(clean);
    out.innerHTML = keywords.map(k => `
      <div class="kw-result-row">
        <span class="kw-result-term">${k.term}</span>
        <span class="kw-result-diff diff-${k.difficulty}">${k.difficulty}</span>
        <span class="kw-result-vol">${k.volume}</span>
      </div>`).join('');
  } catch(e) {
    out.innerHTML = '<div style="padding:16px;color:var(--amber);font-size:13px">Could not fetch keywords. Try again.</div>';
  }
}

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
  if (wpEl) {
    if (wp.url) {
      wpEl.innerHTML = `<span style="color:var(--sage);font-weight:600">✓ Connected</span> — <a href="${wp.url}" target="_blank" style="color:var(--amber)">${wp.url}</a> (as ${wp.name || wp.username || 'user'})`;
    } else {
      wpEl.innerHTML = `<span style="color:var(--ink4)">Not connected —</span> <button class="btn btn-ghost" onclick="nav(null,'publish')" style="font-size:12px;padding:3px 10px;margin-left:4px">Connect WordPress →</button>`;
    }
  }
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
      const fmt = d.toLocaleDateString('en-GB', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
      tsEl.textContent = 'Last audit: ' + fmt;
      const lastRunEl = document.getElementById('audit-last-run');
      if (lastRunEl) lastRunEl.textContent = 'Last run: ' + fmt;
    }
  } catch(e) {}
}

// ── Rank Tracker ────────────────────────────────────────────────
function loadRankTracker() {
  const saved = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  renderRankTable(saved);
}
function initGraderRecent() {
  const el = document.getElementById('grader-recent-posts');
  if (!el) return;
  const posts = getAllPublishedPosts().slice(0,6);
  if (!posts.length) return;
  el.innerHTML = '<div style="font-size:11px;color:var(--ink4);margin-bottom:8px;font-weight:700;text-transform:uppercase;letter-spacing:.06em">Quick grade a recent post:</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
    posts.map(p => `<button class="rank-auto-pill" onclick="document.getElementById('grader-url').value='${(p.url||'').replace(/'/g,"\\'")}';document.getElementById('grader-content').value='';document.getElementById('grader-btn').focus();">${(p.title||'').split(' ').slice(0,5).join(' ')}…</button>`).join('') +
    '</div>';
}
function importKwsFromBrand() {
  const kws = brand?.keywords || [];
  if (!kws.length) { toast('No brand keywords set — add them in Brand Profile', false); return; }
  const saved = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  let added = 0;
  kws.forEach(kw => {
    if (!saved.find(r => r.keyword.toLowerCase() === kw.toLowerCase())) {
      saved.push({ keyword: kw, position: null, change: 0, difficulty: '—', opportunity: '—', ts: null });
      added++;
    }
  });
  if (!added) { toast('All brand keywords are already tracked', false); return; }
  localStorage.setItem('cruise_rank_history', JSON.stringify(saved));
  renderRankTable(saved);
  toast(added + ' keyword' + (added>1?'s':'') + ' imported!', true);
  estimateRankings();
}

function addTrackKeywords() {
  const input = document.getElementById('rank-input');
  const val = input?.value?.trim();
  if (!val) return;
  const kws = val.split(',').map(s => s.trim()).filter(Boolean);
  const saved = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  kws.forEach(kw => {
    if (!saved.find(r => r.keyword.toLowerCase() === kw.toLowerCase())) {
      saved.push({ keyword: kw, position: null, change: 0, difficulty: '—', opportunity: '—', ts: null });
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
      return { ...r, position: newPos, change: (prevPos && newPos) ? prevPos - newPos : 0, difficulty: est.difficulty_score ? est.difficulty_score + '/100' : '—', opportunity: est.opportunity || '—', ts: new Date().toISOString() };
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
    const pos = r.position ? '#' + r.position : '—';
    const posColor = !r.position ? 'var(--ink4)' : r.position <= 10 ? 'var(--sage)' : r.position <= 30 ? 'var(--amber)' : 'var(--ink3)';
    const chg = r.change > 0 ? '<span style="color:var(--sage)">▲ ' + r.change + '</span>' : r.change < 0 ? '<span style="color:#C0304F">▼ ' + Math.abs(r.change) + '</span>' : '<span style="color:var(--ink4)">—</span>';
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

// ── Approve post ──
// ══════════════════════════════════════════════════════════════════
// EDUCATIONAL TOOLTIPS
// ══════════════════════════════════════════════════════════════════
const seoTips = {
  'Content Grader': { title: 'Why grade your content?', body: 'Search engines like Google use E-E-A-T (Experience, Expertise, Authority, Trust) to rank content. A content grade tells you whether your post is readable, keyword-optimised, and engaging enough to rank well.', why: 'Posts with scores above 75 are 3x more likely to reach page 1.' },
  'Site Audit': { title: 'What is an SEO site audit?', body: 'A site audit crawls your entire website and flags technical issues that prevent Google from properly indexing your pages — broken links, missing meta descriptions, slow images, and more.', why: 'Fixing audit errors can improve rankings within 2–4 weeks.' },
  'Topic Clusters': { title: 'What are topic clusters?', body: 'A topic cluster is a group of interlinked content: one long-form "pillar" post and multiple "supporting" posts targeting related keywords. Internal links pass SEO authority between posts.', why: 'Sites using topic clusters see 20–40% more organic traffic.' },
  'Competitor Analysis': { title: 'Why analyse competitors?', body: 'Understanding what content your competitors rank for reveals gaps you can exploit. By targeting their weaknesses, you can outrank them for profitable keywords without guessing.', why: 'Content gap analysis is one of the highest-ROI SEO tactics.' },
  'Social Snippets': { title: 'SEO + social media', body: 'While social signals don\'t directly affect rankings, they drive traffic that Google interprets as proof of relevance. More traffic = stronger ranking signals over time.', why: 'Posts shared on LinkedIn get 3x more indexed backlinks.' },
  'Rank Tracker': { title: 'Why track keyword rankings?', body: 'Rank tracking tells you if your SEO efforts are working. Seeing a keyword move from position 18 to 7 tells you which content to invest in more.', why: 'Most clicks go to positions 1–3. Even moving from 10→5 doubles traffic.' },
  'Autopilot': { title: 'How autopilot helps SEO', body: 'Google rewards websites that publish consistently. Sites that post 2–4x per week index faster, rank for more keywords, and build domain authority much faster than irregular publishers.', why: 'Consistent publishing is the #1 driver of long-term organic traffic growth.' },
  'Keyword Research': { title: 'Why keyword research matters', body: 'Writing about topics nobody searches for wastes time. Keyword research finds the exact phrases your customers type into Google, with volume and competition data to prioritise wisely.', why: 'The right keyword choice can mean 10x more traffic for the same effort.' },
  'Content Engine': { title: 'AI-powered SEO content', body: 'Each post is generated with your brand voice, target keyword, proper heading structure, and internal links built in. The AI follows Google\'s E-E-A-T guidelines to maximise ranking potential.', why: 'AI-assisted content published consistently outperforms sporadic manual posts.' },
  'Publishing': { title: 'Why connect your CMS?', body: 'Direct publishing to your CMS removes friction and ensures content goes live immediately with the correct metadata, internal links, and schema markup that manual copy-paste often misses.', why: 'Indexed content ranks faster when published with correct technical SEO.' },
};

function initEducationalTooltips() {
  document.querySelectorAll('.view .section-hd h2, .view h2').forEach(h2 => {
    const text = h2.textContent.trim();
    if (!seoTips[text] || h2.querySelector('.seo-tip-btn')) return;
    const tip = seoTips[text];
    const wrap = document.createElement('span');
    wrap.className = 'seo-tip-wrap';
    wrap.style.cssText = 'position:relative;display:inline-flex;align-items:center';
    const btn = document.createElement('button');
    btn.className = 'seo-tip-btn';
    btn.textContent = 'i';
    btn.title = 'Learn why this matters for SEO';
    const panel = document.createElement('div');
    panel.className = 'seo-tip-panel';
    panel.innerHTML = `<span class="tip-title">${tip.title}</span>${tip.body}<span class="tip-why" style="display:block;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.15)">💡 ${tip.why}</span>`;
    btn.onclick = (e) => { e.stopPropagation(); panel.classList.toggle('open'); };
    document.addEventListener('click', () => panel.classList.remove('open'));
    wrap.appendChild(btn);
    wrap.appendChild(panel);
    h2.appendChild(wrap);
  });
}

// ══ POSITIONING SETTINGS ══════════════════════════════════════════
function initPositioningSettings() {
  const pos = JSON.parse(localStorage.getItem('cruise_positioning') || '{}');
  const setSafe = (id, val) => { const el = document.getElementById(id); if (el) { if (el.type === 'checkbox') el.checked = !!val; else el.value = val || ''; } };
  setSafe('pos-solution', pos.enabled);
  setSafe('pos-cta', pos.cta);
  setSafe('pos-interlink', pos.interlink !== false);
  setSafe('pos-backlink', pos.backlink !== false);
  setSafe('pos-contact-url', pos.contactUrl || '');
}

function savePositioning() {
  const getVal = id => { const el = document.getElementById(id); return el ? (el.type === 'checkbox' ? el.checked : el.value) : null; };
  const pos = { enabled: getVal('pos-solution'), cta: getVal('pos-cta'), interlink: getVal('pos-interlink'), backlink: getVal('pos-backlink'), contactUrl: getVal('pos-contact-url') };
  localStorage.setItem('cruise_positioning', JSON.stringify(pos));
  toast('Positioning settings saved', true);
}

// ══ TONE FILTER ═══════════════════════════════════════════════════
async function runToneFilter() {
  if (!generatedPostData) { toast('Generate a post first', false); return; }
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const content = document.getElementById('gen-editor').innerHTML;
  const tone = brand.tone || 'authoritative';
  const voice = brand.voice || '';
  const btn = document.querySelector('[onclick="runToneFilter()"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Applying...'; }
  try {
    const prompt = `You are a brand editor. The following HTML blog post needs its tone adjusted to match this brand voice:
Brand name: ${brand.name || 'the business'}
Desired tone: ${tone}
Brand voice statement: ${voice}
Industry: ${brand.industry || ''}

Rewrite the content maintaining the same structure and information, but ensure the tone is consistently ${tone} throughout. Preserve all HTML tags. Return ONLY the revised HTML content, nothing else.

CONTENT TO REFINE:
${content.slice(0, 6000)}`;
    const refined = await callAI(prompt, 3000);
    document.getElementById('gen-editor').innerHTML = refined.replace(/```html|```/g, '');
    toast('Brand voice applied!', true);
  } catch(e) { toast('Tone filter failed: ' + e.message, false); }
  if (btn) { btn.disabled = false; btn.textContent = '🎨 Apply brand voice'; }
}

// ══ INTERNAL LINKING ══════════════════════════════════════════════
async function addInternalLinks() {
  if (!generatedPostData) { toast('Generate a post first', false); return; }
  const posts = getAllPublishedPosts().filter(p => p.url).slice(0, 10);
  if (!posts.length) { toast('No published posts to link to yet', false); return; }
  const content = document.getElementById('gen-editor').innerHTML;
  const btn = document.querySelector('[onclick="addInternalLinks()"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Linking...'; }
  try {
    const postList = posts.map(p => `"${p.title}" → ${p.url}`).join('\n');
    const prompt = `You are an SEO expert. Add 2-4 natural internal links to the following HTML blog post, linking to relevant pages from this list:
${postList}

Rules:
- Only add links where they make genuine contextual sense
- Use natural, descriptive anchor text (NOT "click here")
- Wrap existing words in <a href="URL"> tags — do not add new sentences
- Return ONLY the modified HTML, preserving all existing formatting and content`;
    const result = await callAI(prompt + '\n\nBLOG POST HTML:\n' + content.slice(0, 5000), 3000);
    document.getElementById('gen-editor').innerHTML = result.replace(/```html|```/g, '');
    toast('Internal links added!', true);
  } catch(e) { toast('Internal linking failed: ' + e.message, false); }
  if (btn) { btn.disabled = false; btn.textContent = '🔗 Add internal links'; }
}

// ══ COMPANY CTA ═══════════════════════════════════════════════════
async function addCompanyCTA() {
  if (!generatedPostData) { toast('Generate a post first', false); return; }
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const pos = JSON.parse(localStorage.getItem('cruise_positioning') || '{}');
  const contactUrl = brand.bookingUrl || brand.booking_url || pos.contactUrl || '';
  if (!contactUrl) { toast('Add your contact/booking URL in Brand Profile first', false); nav(null, 'profile'); return; }
  const content = document.getElementById('gen-editor').innerHTML;
  const btn = document.querySelector('[onclick="addCompanyCTA()"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Adding CTA...'; }
  try {
    const prompt = `Add a compelling call-to-action paragraph at the end of this HTML blog post. The CTA should:
- Position ${brand.name || 'the business'} as the ideal solution
- Feel natural and helpful, not salesy
- Include a link to: ${contactUrl} with anchor text like "get in touch", "book a free consultation", or "speak with our team"
- Be 2-3 sentences max
- Return ONLY the complete HTML with the CTA added`;
    const result = await callAI(prompt + '\n\nBLOG POST:\n' + content.slice(0, 5000), 2000);
    document.getElementById('gen-editor').innerHTML = result.replace(/```html|```/g, '');
    toast('CTA added!', true);
  } catch(e) { toast('CTA failed: ' + e.message, false); }
  if (btn) { btn.disabled = false; btn.textContent = '📣 Add CTA'; }
}

// ══ IMAGE INSERTION ═══════════════════════════════════════════════
let _selectedImageUrl = null;

function addPostImage() {
  const panel = document.getElementById('img-picker-panel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? '' : 'none';
  if (panel.style.display !== 'none') {
    const kw = generatedPostData?.keyword || '';
    document.getElementById('img-search-query').value = kw;
    if (kw) searchUnsplash();
  }
}

function searchUnsplash() {
  const q = (document.getElementById('img-search-query')?.value || '').trim().replace(/s+/g, ',');
  if (!q) return;
  const grid = document.getElementById('img-picker-grid');
  if (!grid) return;
  _selectedImageUrl = null;
  document.getElementById('img-insert-btn').disabled = true;
  grid.innerHTML = '';
  // Use Unsplash Source (6 variants via different signals)
  const variants = [q, q+',business', q+',office', q+',professional', q+',team', q+',concept'];
  grid.innerHTML = variants.map((v, i) => {
    const url = `https://source.unsplash.com/800x450/?${encodeURIComponent(v)}&sig=${i+1}`;
    return `<img src="${url}" class="img-pick-item" loading="lazy" onclick="selectImage(this, '${url}')" alt="Image option ${i+1}" onerror="this.style.display='none'">`;
  }).join('');
}

function selectImage(imgEl, url) {
  document.querySelectorAll('.img-pick-item').forEach(i => i.classList.remove('selected'));
  imgEl.classList.add('selected');
  _selectedImageUrl = url;
  document.getElementById('img-insert-btn').disabled = false;
}

function insertSelectedImage() {
  if (!_selectedImageUrl) return;
  const editor = document.getElementById('gen-editor');
  if (!editor) return;
  const imgHtml = `<figure style="margin:0 0 24px;text-align:center"><img src="${_selectedImageUrl}" alt="${generatedPostData?.keyword || 'article image'}" style="max-width:100%;border-radius:8px;height:auto" loading="lazy" /><figcaption style="font-size:12px;color:#888;margin-top:8px">Image via Unsplash</figcaption></figure>\n`;
  editor.innerHTML = imgHtml + editor.innerHTML;
  if (generatedPostData) generatedPostData.featuredImageUrl = _selectedImageUrl;
  document.getElementById('img-picker-panel').style.display = 'none';
  toast('Image added to post!', true);
}

// ══ AI AUDIT FIXER ════════════════════════════════════════════════
async function runAIAuditFix() {
  const lastAudit = JSON.parse(localStorage.getItem('cruise_last_audit') || '{}');
  if (!lastAudit.health_score) { toast('Run an audit first', false); return; }
  const btn = document.getElementById('audit-fix-btn');
  const loading = document.getElementById('audit-fix-loading');
  const results = document.getElementById('audit-fix-results');
  if (btn) { btn.disabled = true; btn.textContent = 'Analysing...'; }
  if (loading) loading.style.display = '';
  if (results) results.style.display = 'none';
  // Collect audit issue text from the page
  const issueEls = document.querySelectorAll('#audit-issues-list > div');
  const issueTexts = Array.from(issueEls).map(el => el.textContent.trim().slice(0, 200)).filter(Boolean).slice(0, 10);
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  try {
    const prompt = `You are an SEO technical specialist. Based on these site audit issues, generate specific, actionable fixes:

Issues found:
${issueTexts.length ? issueTexts.join('\n') : 'General SEO improvements needed'}

Site: ${wp.url || 'the website'}

Return ONLY a JSON array of fix objects:
[
  {
    "priority": "high|medium|low",
    "category": "Meta Tags|Images|Content|Links|Schema",
    "issue": "Brief issue description",
    "fix": "Specific action to take (step-by-step)",
    "impact": "Expected improvement if fixed",
    "auto_fixable": false
  }
]`;
    const raw = await callAI(prompt, 2000);
    const fixes = JSON.parse(raw);
    if (results) {
      results.style.display = '';
      results.innerHTML = fixes.map((f, i) => `<div class="audit-fix-item">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span class="fix-impact ${f.priority}">${f.priority} priority</span>
            <span style="font-size:11px;font-weight:700;color:var(--ink4)">${f.category}</span>
          </div>
          <div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:6px">${f.issue}</div>
          <div style="font-size:12px;color:var(--ink3);margin-bottom:6px;line-height:1.6"><strong>Fix:</strong> ${f.fix}</div>
          <div style="font-size:12px;color:var(--sage);font-weight:600">Impact: ${f.impact}</div>
        </div>
        <button class="btn btn-ghost" onclick="copyAuditFix(${i})" style="font-size:11px;padding:3px 10px;flex-shrink:0;margin-top:4px">Copy fix</button>
      </div>`).join('');
      window._auditFixes = fixes;
    }
    toast('AI fix plan ready!', true);
  } catch(e) { toast('Fix analysis failed: ' + e.message, false); }
  if (loading) loading.style.display = 'none';
  if (btn) { btn.disabled = false; btn.textContent = 'Fix issues with AI ✦'; }
}

function copyAuditFix(idx) {
  const fix = window._auditFixes?.[idx];
  if (!fix) return;
  navigator.clipboard.writeText(`Issue: ${fix.issue}\nFix: ${fix.fix}\nImpact: ${fix.impact}`);
  toast('Fix copied to clipboard', true);
}

// ══ BACKLINK RESEARCH ══════════════════════════════════════════════
async function runBacklinkResearch() {
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const btn = document.getElementById('backlink-btn');
  const loading = document.getElementById('backlink-loading');
  const results = document.getElementById('backlink-results');
  if (btn) { btn.disabled = true; btn.textContent = 'Researching...'; }
  if (loading) loading.style.display = '';
  if (results) results.style.display = 'none';
  try {
    const prompt = `You are an SEO link-building specialist. Generate 8 realistic backlink prospects for this business:

Business: ${brand.name || 'a business'}
Industry: ${brand.industry || 'professional services'}
Target audience: ${brand.audience || brand.idealCustomer || ''}

Return ONLY a JSON array:
[
  {
    "site": "Site name",
    "url": "https://example.com",
    "type": "Guest post|Resource page|Directory|Partnership|Press",
    "relevance_score": 85,
    "notes": "Why this site is valuable + how to approach them",
    "outreach_angle": "Specific pitch angle that would work for this site"
  }
]`;
    const raw = await callAI(prompt, 2000);
    const prospects = JSON.parse(raw);
    if (results) {
      results.style.display = '';
      results.innerHTML = prospects.map((p, i) => `<div class="backlink-prospect">
        <div class="backlink-score-badge">${p.relevance_score || '?'}</div>
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="font-size:13px;font-weight:700;color:var(--ink)">${p.site}</span>
            <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:var(--cream3);color:var(--ink4)">${p.type}</span>
          </div>
          <div style="font-size:12px;color:var(--ink4);margin-bottom:4px">${p.notes}</div>
          <div style="font-size:12px;color:var(--amber-d);font-weight:600">Angle: ${p.outreach_angle}</div>
        </div>
        <button class="btn btn-ghost" onclick="generateOutreachEmail(${i})" style="font-size:11px;padding:3px 10px;flex-shrink:0">Email →</button>
      </div>`).join('');
      window._backlinkProspects = prospects;
    }
    toast('Backlink prospects ready!', true);
  } catch(e) { toast('Research failed: ' + e.message, false); }
  if (loading) loading.style.display = 'none';
  if (btn) { btn.disabled = false; btn.textContent = 'Find opportunities'; }
}

async function generateOutreachEmail(idx) {
  const p = window._backlinkProspects?.[idx];
  if (!p) return;
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const prompt = `Write a short, genuine outreach email to secure a backlink or guest post opportunity:
Target site: ${p.site} (${p.url})
Opportunity type: ${p.type}
Pitch angle: ${p.outreach_angle}
Our business: ${brand.name || 'the business'} — ${brand.industry || ''}
Keep it under 150 words, friendly, professional, and value-focused. No "I hope this email finds you well". Return just the email text.`;
  try {
    const email = await callAI(prompt, 500);
    navigator.clipboard.writeText(email);
    toast('Outreach email copied to clipboard!', true);
  } catch(e) { toast('Failed to generate email: ' + e.message, false); }
}

// ══ CLUSTER IN-TAB GENERATION ══════════════════════════════════════
let _clusterGenData = null;

async function generateClusterInTab(keyword, title, angle, cta) {
  const panel = document.getElementById('cluster-gen-slide');
  const titleLabel = document.getElementById('cluster-gen-title-label');
  const genLoading = document.getElementById('cluster-gen-loading');
  const genOutput = document.getElementById('cluster-gen-output');
  const preview = document.getElementById('cluster-gen-preview');
  const resultEl = document.getElementById('cluster-gen-result');
  if (!panel) return;
  panel.classList.add('open');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (titleLabel) titleLabel.textContent = title;
  if (genLoading) genLoading.style.display = '';
  if (genOutput) genOutput.style.display = 'none';
  if (resultEl) resultEl.textContent = '';
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const pillarTitle = document.getElementById('cluster-pillar-title')?.textContent || '';
  const pos = JSON.parse(localStorage.getItem('cruise_positioning') || '{}');
  const contactUrl = brand.bookingUrl || brand.booking_url || pos.contactUrl || '';
  try {
    const prompt = `Write a complete SEO blog post:
Title: ${title}
Target keyword: ${keyword}
Angle/focus: ${angle}
Brand: ${brand.name || ''} | Industry: ${brand.industry || ''}
Tone: ${brand.tone || 'authoritative'}
This is part of a topic cluster. The pillar page is: "${pillarTitle}"
- Link back to the pillar post using anchor text naturally
- Position the business as the expert solution${contactUrl ? '\n- End with a CTA linking to: ' + contactUrl : ''}
${cta ? '- CTA suggestion: ' + cta : ''}
- Use H2/H3 headings, bullet lists, and at least one table
- Write in UK English, 900-1100 words
Return ONLY JSON: { "title": "...", "meta_description": "...", "content_html": "..." }`;
    const raw = await callAI(prompt, 3000);
    _clusterGenData = JSON.parse(raw);
    if (preview) {
      preview.innerHTML = `<h3 style="font-size:16px;font-weight:700;margin-bottom:12px">${_clusterGenData.title}</h3>` + _clusterGenData.content_html;
    }
    // Default schedule to tomorrow 8am
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(8, 0, 0, 0);
    const dtInput = document.getElementById('cluster-schedule-dt');
    if (dtInput) dtInput.value = tomorrow.toISOString().slice(0, 16);
    if (genLoading) genLoading.style.display = 'none';
    if (genOutput) genOutput.style.display = '';
  } catch(e) {
    if (genLoading) genLoading.style.display = 'none';
    toast('Generation failed: ' + e.message, false);
  }
}

function closeClusterGenPanel() {
  const panel = document.getElementById('cluster-gen-slide');
  if (panel) panel.classList.remove('open');
  _clusterGenData = null;
}

async function publishClusterPostNow() {
  if (!_clusterGenData) return;
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  if (!wp.url) { toast('Connect WordPress in the Publish tab first', false); return; }
  const resultEl = document.getElementById('cluster-gen-result');
  if (resultEl) resultEl.textContent = 'Publishing...';
  try {
    const r = await fetch('/api/wp-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'publish', url: wp.url, username: wp.username, password: wp.password, title: _clusterGenData.title, content: _clusterGenData.content_html, status: 'publish', excerpt: _clusterGenData.meta_description })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Publish failed');
    if (resultEl) resultEl.innerHTML = `<span style="color:var(--sage)">✓ Published! <a href="${d.url}" target="_blank" style="color:var(--amber)">View post ↗</a></span>`;
    const log = JSON.parse(localStorage.getItem('cruise_wp_log') || '[]');
    log.unshift({ title: _clusterGenData.title, url: d.url, status: 'ok', ts: new Date().toISOString(), topic: 'cluster' });
    localStorage.setItem('cruise_wp_log', JSON.stringify(log));
    toast('Cluster post published!', true);
  } catch(e) {
    if (resultEl) resultEl.innerHTML = `<span style="color:#C0304F">Error: ${e.message}</span>`;
  }
}

async function scheduleClusterPost() {
  if (!_clusterGenData) return;
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  if (!wp.url) { toast('Connect WordPress first', false); return; }
  const dtVal = document.getElementById('cluster-schedule-dt')?.value;
  if (!dtVal) { toast('Pick a date/time', false); return; }
  const schedDate = new Date(dtVal).toISOString();
  const resultEl = document.getElementById('cluster-gen-result');
  if (resultEl) resultEl.textContent = 'Scheduling...';
  try {
    const r = await fetch('/api/wp-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'publish', url: wp.url, username: wp.username, password: wp.password, title: _clusterGenData.title, content: _clusterGenData.content_html, status: 'future', date: schedDate, excerpt: _clusterGenData.meta_description })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Schedule failed');
    if (resultEl) resultEl.innerHTML = `<span style="color:var(--sage)">✓ Scheduled for ${new Date(dtVal).toLocaleString('en-GB', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</span>`;
    toast('Post scheduled!', true);
  } catch(e) {
    if (resultEl) resultEl.innerHTML = `<span style="color:#C0304F">Error: ${e.message}</span>`;
  }
}

// ══ SOCIAL MEDIA ══════════════════════════════════════════════════
function loadSocialState() {
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  ['twitter', 'linkedin', 'webhook'].forEach(p => {
    const cred = social[p];
    const connUi = document.getElementById(p + '-connected-ui');
    const connFrm = document.getElementById(p + '-connect-ui');
    const dot = document.getElementById(p + '-status-dot');
    const lbl = document.getElementById(p + '-status-label');
    const card = document.getElementById('social-card-' + p);
    if (cred) {
      if (connUi) connUi.style.display = '';
      if (connFrm) connFrm.style.display = 'none';
      if (dot) dot.style.background = 'var(--sage)';
      if (lbl) lbl.textContent = 'Connected';
      if (card) card.classList.add('connected');
    } else {
      if (connUi) connUi.style.display = 'none';
      if (connFrm) connFrm.style.display = '';
      if (dot) dot.style.background = 'var(--border2)';
      if (lbl) lbl.textContent = 'Not connected';
      if (card) card.classList.remove('connected');
    }
  });
  const autoToggle = document.getElementById('social-auto-toggle');
  const autoKnob = document.getElementById('social-auto-knob');
  const autoVis = document.getElementById('social-auto-visual');
  const autoOn = !!(JSON.parse(localStorage.getItem('cruise_social') || '{}').autoPost);
  if (autoToggle) autoToggle.checked = autoOn;
  if (autoVis) autoVis.style.background = autoOn ? 'var(--sage)' : 'var(--border2)';
  if (autoKnob) autoKnob.style.left = autoOn ? '18px' : '2px';
}

function connectSocial(platform) {
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  if (platform === 'twitter') {
    const token = document.getElementById('twitter-bearer')?.value.trim();
    if (!token) { toast('Enter your Bearer Token', false); return; }
    social.twitter = { bearerToken: token };
    toast('X/Twitter connected!', true);
  } else if (platform === 'linkedin') {
    const token = document.getElementById('linkedin-token')?.value.trim();
    const author = document.getElementById('linkedin-author')?.value.trim();
    if (!token || !author) { toast('Enter Access Token and Person ID', false); return; }
    social.linkedin = { accessToken: token, authorId: author };
    toast('LinkedIn connected!', true);
  } else if (platform === 'webhook') {
    const url = document.getElementById('webhook-url')?.value.trim();
    if (!url) { toast('Enter webhook URL', false); return; }
    social.webhook = { webhookUrl: url };
    toast('Webhook saved!', true);
  }
  localStorage.setItem('cruise_social', JSON.stringify(social));
  loadSocialState();
}

function disconnectSocial(platform) {
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  delete social[platform];
  localStorage.setItem('cruise_social', JSON.stringify(social));
  loadSocialState();
  toast('Disconnected', true);
}

function saveSocialAutoPost(enabled) {
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  social.autoPost = enabled;
  localStorage.setItem('cruise_social', JSON.stringify(social));
  const knob = document.getElementById('social-auto-knob');
  const vis = document.getElementById('social-auto-visual');
  if (knob) knob.style.left = enabled ? '18px' : '2px';
  if (vis) vis.style.background = enabled ? 'var(--sage)' : 'var(--border2)';
  toast(enabled ? 'Auto-post enabled' : 'Auto-post disabled', true);
}

async function postToSocialPlatform(platform, content, link) {
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  const cred = social[platform];
  if (!cred) { toast(`${platform} not connected`, false); return false; }
  try {
    const r = await fetch('/api/social-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, credentials: cred, content, link })
    });
    const d = await r.json();
    return r.ok && d.ok;
  } catch(e) { return false; }
}

async function postManualSocial(platform) {
  const text = document.getElementById('social-compose-text')?.value.trim();
  if (!text) { toast('Write something to post first', false); return; }
  const resultEl = document.getElementById('social-compose-result');
  if (resultEl) resultEl.textContent = 'Posting...';
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  const platforms = platform === 'all' ? ['twitter', 'linkedin', 'webhook'].filter(p => social[p]) : [platform];
  if (!platforms.length) { toast('No platforms connected. Go to Social Media settings.', false); return; }
  const results = await Promise.all(platforms.map(p => postToSocialPlatform(p, text, '')));
  const successCount = results.filter(Boolean).length;
  if (resultEl) resultEl.innerHTML = `<span style="color:${successCount > 0 ? 'var(--sage)' : '#C0304F'}">${successCount > 0 ? `✓ Posted to ${successCount} platform${successCount > 1 ? 's' : ''}` : '✗ All posts failed — check credentials'}</span>`;
}

async function generateSocialFromURL() {
  const url = document.getElementById('social-article-url')?.value.trim();
  const textarea = document.getElementById('social-compose-text');
  if (!url || !textarea) return;
  textarea.value = 'Generating...';
  try {
    const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
    const prompt = `Write a compelling social media post about this article URL: ${url}
Brand: ${brand.name || ''} | Tone: ${brand.tone || 'professional'}
Write 3 variations — one for Twitter/X (under 240 chars), one for LinkedIn (3-4 sentences professional), one for general use.
Format as:
TWITTER: ...
LINKEDIN: ...
GENERAL: ...`;
    const result = await callAI(prompt, 500);
    textarea.value = result;
  } catch(e) { textarea.value = ''; toast('Generation failed: ' + e.message, false); }
}

async function postAutoSocial(postTitle, postUrl) {
  const social = JSON.parse(localStorage.getItem('cruise_social') || '{}');
  if (!social.autoPost) return;
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const platforms = ['twitter', 'linkedin', 'webhook'].filter(p => social[p]);
  if (!platforms.length) return;
  try {
    const prompt = `Write a social media post promoting this new article:
Title: "${postTitle}"
Brand: ${brand.name || ''}
Keep it engaging, under 240 characters, include relevant hashtags.`;
    const snippet = await callAI(prompt, 200);
    platforms.forEach(p => postToSocialPlatform(p, snippet, postUrl));
  } catch(e) { /* silent */ }
}

// ══ CMS TYPE SELECTION ═════════════════════════════════════════════
function selectCMSType(type) {
  ['wordpress', 'ghost', 'webflow', 'custom'].forEach(t => {
    const btn = document.getElementById('cms-btn-' + t);
    const card = document.getElementById(t === 'custom' ? 'custom-cms-card' : t + '-connect-card');
    if (btn) btn.classList.toggle('active', t === type);
    if (card && t !== 'wordpress') card.style.display = t === type ? '' : 'none';
    if (t === 'wordpress') {
      const wpCard = document.getElementById('wp-connect-card');
      if (wpCard) wpCard.style.display = type === 'wordpress' ? '' : 'none';
    }
  });
  localStorage.setItem('cruise_cms_type', type);
}

function restoreCMSType() {
  const saved = localStorage.getItem('cruise_cms_type') || 'wordpress';
  selectCMSType(saved);
  const ghost = JSON.parse(localStorage.getItem('cruise_ghost') || '{}');
  if (ghost.url) { document.getElementById('ghost-connect-form').style.display = 'none'; document.getElementById('ghost-connected-state').style.display = ''; document.getElementById('ghost-status-dot').style.background = 'var(--sage)'; document.getElementById('ghost-status-label').textContent = 'Connected — ' + ghost.url; }
  const wf = JSON.parse(localStorage.getItem('cruise_webflow') || '{}');
  if (wf.token) { document.getElementById('webflow-connect-form').style.display = 'none'; document.getElementById('webflow-connected-state').style.display = ''; document.getElementById('webflow-status-dot').style.background = 'var(--sage)'; document.getElementById('webflow-status-label').textContent = 'Connected'; }
}

function connectGhost() {
  const url = document.getElementById('ghost-url')?.value.trim();
  const key = document.getElementById('ghost-api-key')?.value.trim();
  if (!url || !key) { toast('Enter Ghost URL and Admin API Key', false); return; }
  if (!key.includes(':')) { toast('Admin API Key format: id:secret (contains a colon)', false); return; }
  localStorage.setItem('cruise_ghost', JSON.stringify({ url, adminKey: key }));
  document.getElementById('ghost-connect-form').style.display = 'none';
  document.getElementById('ghost-connected-state').style.display = '';
  document.getElementById('ghost-status-dot').style.background = 'var(--sage)';
  document.getElementById('ghost-status-label').textContent = 'Connected — ' + url;
  toast('Ghost CMS connected!', true);
}

function disconnectGhost() {
  localStorage.removeItem('cruise_ghost');
  document.getElementById('ghost-connect-form').style.display = '';
  document.getElementById('ghost-connected-state').style.display = 'none';
  document.getElementById('ghost-status-dot').style.background = 'var(--border2)';
  document.getElementById('ghost-status-label').textContent = 'Not connected';
  toast('Ghost disconnected', true);
}

function connectWebflow() {
  const token = document.getElementById('webflow-token')?.value.trim();
  const collection = document.getElementById('webflow-collection')?.value.trim();
  if (!token || !collection) { toast('Enter API token and Collection ID', false); return; }
  localStorage.setItem('cruise_webflow', JSON.stringify({ token, collectionId: collection }));
  document.getElementById('webflow-connect-form').style.display = 'none';
  document.getElementById('webflow-connected-state').style.display = '';
  document.getElementById('webflow-status-dot').style.background = 'var(--sage)';
  document.getElementById('webflow-status-label').textContent = 'Connected';
  toast('Webflow connected!', true);
}

function disconnectWebflow() {
  localStorage.removeItem('cruise_webflow');
  document.getElementById('webflow-connect-form').style.display = '';
  document.getElementById('webflow-connected-state').style.display = 'none';
  document.getElementById('webflow-status-dot').style.background = 'var(--border2)';
  document.getElementById('webflow-status-label').textContent = 'Not connected';
  toast('Webflow disconnected', true);
}

function connectCustomCMS() {
  const endpoint = document.getElementById('custom-endpoint')?.value.trim();
  const auth = document.getElementById('custom-auth')?.value.trim();
  const titleField = document.getElementById('custom-field-title')?.value.trim() || 'title';
  const contentField = document.getElementById('custom-field-content')?.value.trim() || 'content';
  if (!endpoint) { toast('Enter the API endpoint URL', false); return; }
  localStorage.setItem('cruise_custom_cms', JSON.stringify({ endpoint, auth, titleField, contentField }));
  const resultEl = document.getElementById('custom-cms-result');
  if (resultEl) resultEl.innerHTML = `<span style="color:var(--sage)">✓ Custom API saved — ${endpoint}</span>`;
  toast('Custom CMS saved!', true);
}

// ══ PUBLISH TO CUSTOM CMS (extends publishToWP) ══════════════════
async function publishToActiveCMS(postData) {
  const cmsType = localStorage.getItem('cruise_cms_type') || 'wordpress';
  if (cmsType === 'wordpress') return null; // uses existing publishToWP()
  const { title, content_html, meta_description } = postData;
  if (cmsType === 'ghost') {
    const ghost = JSON.parse(localStorage.getItem('cruise_ghost') || '{}');
    if (!ghost.url) throw new Error('Ghost not connected');
    const r = await fetch('/api/cms-proxy', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ cms: 'ghost', action: 'publish', url: ghost.url, adminKey: ghost.adminKey, title, content: content_html, excerpt: meta_description }) });
    return await r.json();
  }
  if (cmsType === 'webflow') {
    const wf = JSON.parse(localStorage.getItem('cruise_webflow') || '{}');
    if (!wf.token) throw new Error('Webflow not connected');
    const r = await fetch('/api/cms-proxy', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ cms: 'webflow', action: 'publish', token: wf.token, collectionId: wf.collectionId, title, content: content_html }) });
    return await r.json();
  }
  if (cmsType === 'custom') {
    const custom = JSON.parse(localStorage.getItem('cruise_custom_cms') || '{}');
    if (!custom.endpoint) throw new Error('Custom CMS not configured');
    const r = await fetch('/api/cms-proxy', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ cms: 'custom', action: 'publish', endpoint: custom.endpoint, auth: custom.auth, titleField: custom.titleField, contentField: custom.contentField, title, content: content_html }) });
    return await r.json();
  }
}

// ══ DARK MODE ══════════════════════════════════════════════════════
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('cruise_dark', isDark ? '1' : '0');
  const btn = document.getElementById('dark-mode-btn');
  if (btn) btn.textContent = isDark ? '☀' : '☽';
}

// ══ KEYBOARD SHORTCUTS ════════════════════════════════════════════
function showShortcutsModal() {
  document.getElementById('shortcuts-modal').classList.add('open');
}

let _kbPrev = '';
function initKeyboardShortcuts() {
  // Restore dark mode preference
  if (localStorage.getItem('cruise_dark') === '1') {
    document.body.classList.add('dark');
    const btn = document.getElementById('dark-mode-btn');
    if (btn) btn.textContent = '☀';
  }
  document.addEventListener('keydown', e => {
    const tag = document.activeElement ? document.activeElement.tagName : '';
    if (['INPUT','TEXTAREA','SELECT'].includes(tag) || document.activeElement.isContentEditable) {
      _kbPrev = ''; return;
    }
    const key = e.key.toLowerCase();
    if (key === '?' || (e.shiftKey && key === '/')) { e.preventDefault(); showShortcutsModal(); _kbPrev = ''; return; }
    if (e.shiftKey && key === 'd') { e.preventDefault(); toggleDarkMode(); _kbPrev = ''; return; }
    if (_kbPrev === 'g') {
      e.preventDefault();
      if (key === 'd') nav(null, 'dashboard');
      if (key === 'e') nav(null, 'engine');
      if (key === 'c') nav(null, 'posts');
      if (key === 'p') nav(null, 'publish');
      if (key === 'b') nav(null, 'profile');
      if (key === 'a') nav(null, 'audit');
      _kbPrev = '';
      return;
    }
    if (key === 'escape') { closeUpgradeModal(); closeEditPost(); document.getElementById('shortcuts-modal').classList.remove('open'); }
    _kbPrev = key;
    setTimeout(() => { _kbPrev = ''; }, 1000);
  });
}

// ══ TRIAL / PLAN SYSTEM ════════════════════════════════════════════
function initTrialSystem() {
  let plan = JSON.parse(localStorage.getItem('cruise_plan') || 'null');
  if (!plan) {
    plan = { type: 'trial', start: Date.now() };
    localStorage.setItem('cruise_plan', JSON.stringify(plan));
  }
  renderTrialBanner(plan);
  renderOnboardingChecklist();
}

function renderTrialBanner(plan) {
  const wrap = document.getElementById('trial-banner-wrap');
  if (!plan || !wrap) return;
  if (plan.type === 'pro') { wrap.innerHTML = ''; return; }
  const daysLeft = Math.max(0, 14 - Math.floor((Date.now() - plan.start) / 86400000));
  wrap.innerHTML = `<div class="trial-banner">
    <div style="font-size:13px;color:var(--ink2);line-height:1.5">
      <strong style="color:var(--amber-d)">${daysLeft} days left</strong> on your free trial —
      <span style="color:var(--ink4)">50 AI posts included</span>
    </div>
    <button class="btn btn-primary" onclick="openUpgradeModal()" style="white-space:nowrap;font-size:12px;padding:7px 16px">Upgrade to Pro →</button>
  </div>`;
}

function openUpgradeModal() { document.getElementById('upgrade-modal').classList.add('open'); }
function closeUpgradeModal() { document.getElementById('upgrade-modal').classList.remove('open'); }
function activatePro() {
  const plan = { type: 'pro', start: Date.now() };
  localStorage.setItem('cruise_plan', JSON.stringify(plan));
  closeUpgradeModal();
  renderTrialBanner(plan);
  toast('Pro plan activated! Unlimited posts unlocked.', true);
}

function checkUsageLimit() {
  const plan = JSON.parse(localStorage.getItem('cruise_plan') || '{}');
  if (plan.type === 'pro') return true;
  const ap = JSON.parse(localStorage.getItem('cruise_ap_log') || '[]');
  const wp = JSON.parse(localStorage.getItem('cruise_wp_log') || '[]');
  const total = ap.length + wp.length;
  if (total >= 50) { openUpgradeModal(); return false; }
  return true;
}

// ══ ONBOARDING CHECKLIST ══════════════════════════════════════════
function renderOnboardingChecklist() {
  const el = document.getElementById('onboarding-checklist');
  if (!el) return;
  const hasWP = !!localStorage.getItem('cruise_wp_connection');
  const hasAudit = !!localStorage.getItem('cruise_last_audit');
  const hasPost = (JSON.parse(localStorage.getItem('cruise_wp_log') || '[]').length + JSON.parse(localStorage.getItem('cruise_ap_log') || '[]').length) > 0;
  const hasKw = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]').length >= 5;
  const steps = [
    { id: 'step-wp', done: hasWP },
    { id: 'step-audit', done: hasAudit },
    { id: 'step-post', done: hasPost },
    { id: 'step-kw', done: hasKw }
  ];
  steps.forEach(s => {
    const stepEl = document.getElementById(s.id);
    if (!stepEl) return;
    stepEl.classList.toggle('done', s.done);
    const icon = stepEl.querySelector('.setup-step-icon');
    if (icon) icon.textContent = s.done ? '✓' : '';
  });
  const allDone = steps.every(s => s.done);
  el.style.display = allDone ? 'none' : '';
}

// ══ CONTENT TEMPLATES ══════════════════════════════════════════════
let selectedTemplate = 'blog';
function selectTemplate(el, type) {
  selectedTemplate = type;
  document.querySelectorAll('#template-chips .template-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
}

// Template-aware prompt injection is handled in runGenerate via selectedTemplate var
// (runGenerate already reads selectedTemplate — this function just sets the UI state)

// ══ SERP PREVIEW ══════════════════════════════════════════════════
function updateSerpPreview(title, desc) {
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  const domain = wp.url ? wp.url.replace(/https?:\/\//, '').replace(/\/$/, '') : 'yoursite.com';
  const slug = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const titleEl = document.getElementById('serp-title-preview');
  const urlEl = document.getElementById('serp-url-preview');
  const descEl = document.getElementById('serp-desc-preview');
  const titleFill = document.getElementById('serp-title-fill');
  const descFill = document.getElementById('serp-desc-fill');
  const titleCnt = document.getElementById('serp-title-cnt');
  const descCnt = document.getElementById('serp-desc-cnt');
  if (titleEl) titleEl.textContent = (title || '').slice(0, 60) || 'Your post title will appear here';
  if (urlEl) urlEl.textContent = domain + ' › blog › ' + (slug.slice(0, 40) || 'post-slug');
  if (descEl) descEl.textContent = (desc || '').slice(0, 160) || 'Your meta description will appear here.';
  const tLen = (title || '').length; const dLen = (desc || '').length;
  if (titleFill) { titleFill.style.width = Math.min(100, (tLen / 60) * 100) + '%'; titleFill.style.background = tLen > 60 ? '#C0304F' : tLen > 50 ? 'var(--sage)' : 'var(--amber)'; }
  if (descFill) { descFill.style.width = Math.min(100, (dLen / 160) * 100) + '%'; descFill.style.background = dLen > 160 ? '#C0304F' : dLen > 130 ? 'var(--sage)' : 'var(--amber)'; }
  if (titleCnt) titleCnt.textContent = tLen + '/60';
  if (descCnt) descCnt.textContent = dLen + '/160';
}

// ══ AUDIT SCORE HISTORY ═══════════════════════════════════════════
function renderScoreHistory() {
  const el = document.getElementById('audit-score-history');
  const label = document.getElementById('audit-history-label');
  if (!el) return;
  const hist = JSON.parse(localStorage.getItem('cruise_audit_history') || '[]');
  if (!hist.length) { el.innerHTML = ''; if(label) label.textContent = 'No history yet'; return; }
  const max = Math.max(...hist.map(h => h.score), 1);
  el.innerHTML = hist.map(h => {
    const pct = Math.max(5, Math.round((h.score / 100) * 100));
    const date = new Date(h.ts).toLocaleDateString('en-GB', {day:'numeric',month:'short'});
    return `<div class="score-spark-bar" style="height:${pct}%" data-tip="${h.score}/100 · ${date}"></div>`;
  }).join('');
  if (label) label.textContent = hist.length + ' audit' + (hist.length !== 1 ? 's' : '') + ' recorded';
}

// ══ BULK ACTIONS ══════════════════════════════════════════════════
let selectedPostTs = new Set();

function toggleSelectAll(checkbox) {
  const checks = document.querySelectorAll('.post-check');
  checks.forEach(c => { c.checked = checkbox.checked; const ts = c.getAttribute('data-ts'); if (ts) checkbox.checked ? selectedPostTs.add(ts) : selectedPostTs.delete(ts); });
  updateBulkBar();
}

function updateBulkBar() {
  selectedPostTs = new Set();
  document.querySelectorAll('.post-check:checked').forEach(c => { const ts = c.getAttribute('data-ts'); if (ts) selectedPostTs.add(ts); });
  const bar = document.getElementById('bulk-action-bar');
  const cnt = document.getElementById('bulk-count');
  if (bar) bar.classList.toggle('visible', selectedPostTs.size > 0);
  if (cnt) cnt.textContent = selectedPostTs.size + ' selected';
}

function clearBulkSelection() {
  selectedPostTs = new Set();
  document.querySelectorAll('.post-check, #select-all-posts').forEach(c => c.checked = false);
  const bar = document.getElementById('bulk-action-bar');
  if (bar) bar.classList.remove('visible');
}

function bulkGrade() {
  if (!selectedPostTs.size) return;
  const posts = getAllPublishedPosts().filter(p => selectedPostTs.has(p.ts));
  const first = posts[0];
  if (!first) return;
  const target = first.url || first.title || '';
  document.getElementById('grader-url').value = target;
  nav(null, 'grader');
  clearBulkSelection();
  toast('Grading first selected post — open the others manually', true);
}

function bulkExportCSV() {
  const posts = getAllPublishedPosts().filter(p => selectedPostTs.has(p.ts));
  if (!posts.length) return;
  const rows = [['Title','URL','Status','Date','SEO Score']];
  posts.forEach(p => {
    const date = new Date(p.ts).toLocaleDateString('en-GB');
    rows.push([
      (p.title || '').replace(/,/g,''),
      p.url || '',
      p.status === 'ok' ? 'Live' : 'Failed',
      date,
      p.seoScore || '—'
    ]);
  });
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cruise-seo-export.csv'; a.click();
  clearBulkSelection();
  toast('Exported ' + posts.length + ' posts to CSV', true);
}

// ══ EDIT PUBLISHED POSTS ══════════════════════════════════════════
let _editPostTs = null;

function openEditPost(ts, title, url, wpId) {
  _editPostTs = ts;
  const titleInput = document.getElementById('edit-post-title');
  const contentArea = document.getElementById('edit-post-content');
  const statusEl = document.getElementById('edit-post-status');
  const wpIdEl = document.getElementById('edit-post-wp-id');
  const urlEl = document.getElementById('edit-post-post-url');
  if (titleInput) titleInput.value = title || '';
  if (contentArea) contentArea.value = 'Loading post content...';
  if (statusEl) statusEl.textContent = '';
  if (wpIdEl) wpIdEl.value = wpId || '';
  if (urlEl) urlEl.value = url || '';
  document.getElementById('edit-post-overlay').classList.add('open');
  // Try to load current content from WP
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  if (wp.url && wpId) {
    fetch('/api/wp-proxy', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ action: 'getpost', url: wp.url, username: wp.username, password: wp.password, postId: wpId })
    }).then(r => r.json()).then(d => {
      if (d.content && contentArea) contentArea.value = d.content;
    }).catch(() => { if (contentArea) contentArea.value = '<!-- Paste or write post content here -->'; });
  } else {
    if (contentArea) contentArea.value = '<!-- Paste or write post content here. WP post ID required to load automatically. -->';
  }
}

function closeEditPost() {
  document.getElementById('edit-post-overlay').classList.remove('open');
  _editPostTs = null;
}

async function saveEditPost() {
  const title = document.getElementById('edit-post-title').value.trim();
  const content = document.getElementById('edit-post-content').value.trim();
  const wpId = document.getElementById('edit-post-wp-id').value.trim();
  const statusEl = document.getElementById('edit-post-status');
  const saveBtn = document.getElementById('edit-post-save-btn');
  if (!title || !content) { toast('Title and content are required', false); return; }
  const wp = JSON.parse(localStorage.getItem('cruise_wp_connection') || '{}');
  if (!wp.url) { toast('Connect WordPress first', false); return; }
  if (!wpId) {
    if (statusEl) statusEl.innerHTML = '<span style="color:#C0304F">No WordPress post ID — cannot update. Re-publish as a new post instead.</span>';
    return;
  }
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Updating...'; }
  if (statusEl) statusEl.textContent = 'Sending to WordPress...';
  try {
    const r = await fetch('/api/wp-proxy', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ action: 'updatepost', url: wp.url, username: wp.username, password: wp.password, postId: wpId, title, content })
    });
    const d = await r.json();
    if (!r.ok || !d.ok) throw new Error(d.error || 'Update failed');
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--sage)">✓ Updated on WordPress — <a href="${d.link || ''}" target="_blank" style="color:var(--amber)">view post ↗</a></span>`;
    toast('Post updated on WordPress!', true);
  } catch(err) {
    if (statusEl) statusEl.innerHTML = `<span style="color:#C0304F">Error: ${err.message}</span>`;
  } finally {
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Update on WordPress ↑'; }
  }
}

// ══ PDF REPORT ════════════════════════════════════════════════════
function generatePDFReport() {
  const brand = JSON.parse(localStorage.getItem('seoflow_brand') || localStorage.getItem('cruise_brand') || '{}');
  const audit = JSON.parse(localStorage.getItem('cruise_last_audit') || '{}');
  const ap = JSON.parse(localStorage.getItem('cruise_ap_log') || '[]');
  const wp = JSON.parse(localStorage.getItem('cruise_wp_log') || '[]');
  const ranks = JSON.parse(localStorage.getItem('cruise_rank_history') || '[]');
  const allPosts = [...ap, ...wp].filter(p => p.title).sort((a,b) => new Date(b.ts) - new Date(a.ts));
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = allPosts.filter(p => new Date(p.ts) >= monthStart);
  const reportHTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cruise SEO Report — ${now.toLocaleDateString('en-GB',{month:'long',year:'numeric'})}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Arial',sans-serif;color:#1C1714;background:#fff;padding:40px;max-width:800px;margin:0 auto}
h1{font-size:28px;font-weight:700;margin-bottom:4px;color:#1C1714}h2{font-size:16px;font-weight:700;margin:28px 0 12px;padding-bottom:8px;border-bottom:2px solid #E8E2D6;color:#3D3830}
.meta{font-size:13px;color:#6B6458;margin-bottom:32px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
.stat-box{padding:16px;border:1px solid #E8E2D6;border-radius:8px;text-align:center}.stat-num{font-size:28px;font-weight:800;color:#4c94b2}
.stat-label{font-size:11px;color:#9B9088;margin-top:4px;text-transform:uppercase;letter-spacing:.06em}
table{width:100%;border-collapse:collapse;font-size:13px}th{background:#F2EFE8;padding:8px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#9B9088}
td{padding:10px 12px;border-bottom:1px solid #E8E2D6;color:#3D3830}.footer{margin-top:40px;font-size:11px;color:#9B9088;text-align:center;border-top:1px solid #E8E2D6;padding-top:16px}
@media print{body{padding:20px}.no-print{display:none}}</style></head><body>
<div class="no-print" style="background:#FFF3CD;border:1px solid #FFC107;border-radius:8px;padding:12px 16px;margin-bottom:24px;font-size:13px">Print or save as PDF: use your browser's print function (Ctrl/Cmd+P) and select "Save as PDF"</div>
<h1>SEO Performance Report</h1>
<div class="meta">${brand.name || 'Your Business'} &nbsp;·&nbsp; ${now.toLocaleDateString('en-GB',{month:'long',year:'numeric'})} &nbsp;·&nbsp; Generated by Cruise SEO</div>
<div class="grid">
  <div class="stat-box"><div class="stat-num">${allPosts.length}</div><div class="stat-label">Total Posts</div></div>
  <div class="stat-box"><div class="stat-num">${thisMonth.length}</div><div class="stat-label">This Month</div></div>
  <div class="stat-box"><div class="stat-num" style="color:${(audit.health_score||0)>=80?'#4A7C6F':'#4c94b2'}">${audit.health_score || '—'}<span style="font-size:16px">/100</span></div><div class="stat-label">SEO Health</div></div>
  <div class="stat-box"><div class="stat-num">${ranks.length}</div><div class="stat-label">Keywords Tracked</div></div>
</div>
<h2>Posts Published This Month</h2>
<table><thead><tr><th>Title</th><th>Status</th><th>Date</th></tr></thead><tbody>
${thisMonth.length ? thisMonth.map(p => `<tr><td>${p.url ? `<a href="${p.url}" style="color:#4c94b2">${p.title}</a>` : p.title}</td><td>${p.status==='ok'?'Live':'Failed'}</td><td>${new Date(p.ts).toLocaleDateString('en-GB')}</td></tr>`).join('') : '<tr><td colspan="3" style="color:#9B9088;font-style:italic">No posts published this month</td></tr>'}
</tbody></table>
${ranks.length ? `<h2>Tracked Keywords (${ranks.length})</h2>
<table><thead><tr><th>Keyword</th><th>Est. Position</th><th>Opportunity</th></tr></thead><tbody>
${ranks.map(r => `<tr><td>${r.keyword}</td><td>${r.estimated_position || '—'}</td><td>${r.opportunity || '—'}</td></tr>`).join('')}
</tbody></table>` : ''}
<div class="footer">Generated by Cruise SEO · cruiseseo.site · ${now.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
</body></html>`;
  const w = window.open('', '_blank');
  if (w) { w.document.write(reportHTML); w.document.close(); w.focus(); setTimeout(() => w.print(), 500); }
  else toast('Allow pop-ups to generate the PDF report', false);
}

function approvePost() {
  const title = document.getElementById('genPrompt').value.trim() || 'New post';
  const d = new Date(); d.setDate(d.getDate() + 3);
  const dateStr = d.toLocaleDateString('en-GB',{day:'numeric',month:'short'});
  const post = { status:'sched', title, keywords: title.slice(0,30), score:'91', date:dateStr, words:'1,180' };
  if (typeof posts !== 'undefined') posts.unshift(post);
  document.getElementById('gen-output-wrap').style.display = 'none';
  document.getElementById('genPrompt').value = '';
  toast('Post scheduled for ' + dateStr, true);
  if (typeof updateStats === 'function') updateStats();
}
