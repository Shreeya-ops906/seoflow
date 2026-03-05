const fs = require('fs');
let c = fs.readFileSync('app.html', 'utf8');
c = c.split('\r\n').join('\n');
let count = 0;

function rep(search, replace) {
  const idx = c.indexOf(search);
  if (idx === -1) { console.log('MISS: ' + search.slice(0, 80)); return; }
  c = c.split(search).join(replace);
  count++;
  console.log('OK [' + count + ']: ' + search.slice(0, 70));
}

// ── Inject Nordic Clean CSS override block before </head> ──────────────────
rep(
  '</style>\n</head>',
  '</style>\n' +
  '<style id="cruise-nordic-v7">\n' +
  '/* ═══════════════════════════════════════════════════════════\n' +
  '   CRUISE SEO — Nordic Clean UI  (premium7)\n' +
  '   ═══════════════════════════════════════════════════════════ */\n' +
  ':root {\n' +
  '  --sh-xs: 0 1px 2px rgba(15,12,10,.04);\n' +
  '  --sh-sm: 0 1px 3px rgba(15,12,10,.06), 0 4px 12px rgba(15,12,10,.04);\n' +
  '  --sh-md: 0 4px 8px rgba(15,12,10,.08), 0 14px 32px rgba(15,12,10,.07);\n' +
  '  --sh-lg: 0 10px 24px rgba(15,12,10,.1), 0 40px 80px rgba(15,12,10,.08);\n' +
  '  --tr: .15s cubic-bezier(.25,.46,.45,.94);\n' +
  '  --surface: #FFFFFF;\n' +
  '  --border: rgba(28,23,20,.08);\n' +
  '  --border2: rgba(28,23,20,.15);\n' +
  '}\n' +

  /* ── Sidebar ── */
  '.sidebar {\n' +
  '  background: #0D0C0B;\n' +
  '  width: 220px;\n' +
  '  box-shadow: 1px 0 0 rgba(255,255,255,.04);\n' +
  '}\n' +
  '.sb-logo {\n' +
  '  padding: 20px 16px 16px;\n' +
  '  border-bottom: 1px solid rgba(255,255,255,.05);\n' +
  '}\n' +
  '.sb-logo-mark {\n' +
  '  background: linear-gradient(145deg, #5ba3c4 0%, #3a7a96 100%);\n' +
  '  box-shadow: 0 2px 10px rgba(76,148,178,.4);\n' +
  '  border-radius: 9px;\n' +
  '}\n' +
  '.sb-brand-name {\n' +
  '  font-size: 14px;\n' +
  '  font-weight: 700;\n' +
  '  letter-spacing: -.028em;\n' +
  '}\n' +
  '.sb-user {\n' +
  '  padding: 11px 16px;\n' +
  '  border-bottom: 1px solid rgba(255,255,255,.04);\n' +
  '  gap: 9px;\n' +
  '}\n' +
  '.sb-avatar {\n' +
  '  width: 25px; height: 25px;\n' +
  '  font-size: 9.5px;\n' +
  '  background: linear-gradient(135deg, #5ba3c4 0%, #3a7a96 100%);\n' +
  '  box-shadow: 0 0 0 1.5px rgba(255,255,255,.1);\n' +
  '}\n' +
  '.sb-username { font-size: 11px; color: rgba(250,248,244,.44); }\n' +
  '.sb-nav { padding: 10px 8px; }\n' +
  '.nav-section { padding: 0; margin-bottom: 0; }\n' +
  '.nav-section-label {\n' +
  '  font-size: 9px;\n' +
  '  font-weight: 700;\n' +
  '  letter-spacing: .15em;\n' +
  '  color: rgba(250,248,244,.17);\n' +
  '  padding: 14px 10px 5px;\n' +
  '}\n' +
  '.nav-dot { display: none; }\n' +
  '.nav-item {\n' +
  '  font-size: 12.5px;\n' +
  '  font-weight: 500;\n' +
  '  color: rgba(250,248,244,.42);\n' +
  '  padding: 8px 10px;\n' +
  '  border-radius: 7px;\n' +
  '  margin-bottom: 1px;\n' +
  '  gap: 9px;\n' +
  '  transition: background var(--tr), color var(--tr);\n' +
  '  position: relative;\n' +
  '}\n' +
  '.nav-item:hover {\n' +
  '  background: rgba(255,255,255,.055);\n' +
  '  color: rgba(250,248,244,.78);\n' +
  '}\n' +
  '.nav-item.active {\n' +
  '  background: rgba(76,148,178,.1);\n' +
  '  color: #fff;\n' +
  '  font-weight: 600;\n' +
  '}\n' +
  '.nav-item.active::before {\n' +
  '  content: "";\n' +
  '  position: absolute;\n' +
  '  left: 0; top: 22%; bottom: 22%;\n' +
  '  width: 2px;\n' +
  '  background: var(--amber);\n' +
  '  border-radius: 0 2px 2px 0;\n' +
  '}\n' +
  '.nav-item svg { width: 14px; height: 14px; opacity: .55; transition: opacity var(--tr); }\n' +
  '.nav-item:hover svg { opacity: .82; }\n' +
  '.nav-item.active svg { opacity: 1; }\n' +
  '.sb-footer {\n' +
  '  padding: 12px 8px;\n' +
  '  border-top: 1px solid rgba(255,255,255,.04);\n' +
  '}\n' +
  '.ap-row {\n' +
  '  background: rgba(255,255,255,.03);\n' +
  '  border: 1px solid rgba(255,255,255,.05);\n' +
  '  border-radius: 8px;\n' +
  '}\n' +
  '.sb-signout {\n' +
  '  border: 1px solid rgba(255,255,255,.07);\n' +
  '  color: rgba(250,248,244,.24);\n' +
  '  border-radius: 7px;\n' +
  '}\n' +
  '.sb-signout:hover {\n' +
  '  background: rgba(255,255,255,.04);\n' +
  '  color: rgba(250,248,244,.44);\n' +
  '}\n' +

  /* ── Topbar ── */
  '.topbar {\n' +
  '  height: 52px;\n' +
  '  background: rgba(249,247,243,.95);\n' +
  '  backdrop-filter: blur(12px);\n' +
  '  -webkit-backdrop-filter: blur(12px);\n' +
  '  border-bottom: 1px solid rgba(28,23,20,.07);\n' +
  '  padding: 0 28px;\n' +
  '  box-shadow: 0 1px 0 rgba(255,255,255,.7);\n' +
  '}\n' +
  '.topbar-breadcrumb { font-size: 12px; }\n' +
  '.topbar-breadcrumb .current { color: var(--ink2); font-weight: 600; }\n' +

  /* ── Content area ── */
  '.content { padding: 28px 32px; background: #F8F6F2; }\n' +
  '@media(max-width:768px){.content{padding:16px}}\n' +

  /* ── Stat cards ── */
  '.stat-card {\n' +
  '  background: #fff;\n' +
  '  border: 1px solid rgba(28,23,20,.08);\n' +
  '  border-radius: 14px;\n' +
  '  padding: 22px 24px;\n' +
  '  box-shadow: var(--sh-sm);\n' +
  '  overflow: visible;\n' +
  '  transition: box-shadow var(--tr), transform var(--tr);\n' +
  '}\n' +
  '.stat-card:hover { box-shadow: var(--sh-md); transform: translateY(-1px); }\n' +
  '.stat-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; margin-bottom: 10px; }\n' +
  '.stat-value { font-size: 30px; font-weight: 700; letter-spacing: -.04em; line-height: 1; margin-bottom: 6px; }\n' +
  '.stat-sub { font-size: 11px; font-weight: 500; }\n' +

  /* ── Cards ── */
  '.card {\n' +
  '  background: #fff;\n' +
  '  border: 1px solid rgba(28,23,20,.08);\n' +
  '  border-radius: 14px;\n' +
  '  box-shadow: var(--sh-sm);\n' +
  '}\n' +

  /* ── Section headers ── */
  '.section-hd { margin: 26px 0 12px; }\n' +
  '.section-hd h2 { font-size: 16px; font-weight: 700; letter-spacing: -.025em; }\n' +

  /* ── Tables ── */
  '.table-wrap {\n' +
  '  background: #fff;\n' +
  '  border: 1px solid rgba(28,23,20,.08);\n' +
  '  border-radius: 14px;\n' +
  '  box-shadow: var(--sh-sm);\n' +
  '}\n' +
  '.table-hd { background: #F8F6F2; border-bottom: 1px solid rgba(28,23,20,.06); font-size: 9.5px; letter-spacing: .1em; }\n' +
  '.table-row { border-bottom: 1px solid rgba(28,23,20,.045); transition: background var(--tr); }\n' +
  '.table-row:hover { background: #F8F6F2; }\n' +
  '.table-row:last-child { border-bottom: none; }\n' +

  /* ── Buttons ── */
  '.btn { font-size: 12.5px; font-weight: 700; padding: 8px 16px; border-radius: 8px; letter-spacing: .01em; transition: all var(--tr); }\n' +
  '.btn-primary {\n' +
  '  background: linear-gradient(160deg, #5ba3c4 0%, #39789a 100%);\n' +
  '  border: none;\n' +
  '  box-shadow: 0 1px 3px rgba(57,120,154,.25), 0 3px 10px rgba(57,120,154,.12);\n' +
  '}\n' +
  '.btn-primary:hover {\n' +
  '  background: linear-gradient(160deg, #4d96bb 0%, #2e6e8e 100%);\n' +
  '  box-shadow: 0 2px 6px rgba(57,120,154,.3), 0 8px 22px rgba(57,120,154,.14);\n' +
  '  transform: translateY(-1px);\n' +
  '}\n' +
  '.btn-primary:active { transform: translateY(0); box-shadow: 0 1px 3px rgba(57,120,154,.2); }\n' +
  '.btn-ghost { background: transparent; border: 1px solid rgba(28,23,20,.14); color: var(--ink3); }\n' +
  '.btn-ghost:hover { background: rgba(28,23,20,.04); border-color: rgba(28,23,20,.22); color: var(--ink2); }\n' +

  /* ── Inputs ── */
  '.kw-input, .gen-area {\n' +
  '  border: 1.5px solid rgba(28,23,20,.14);\n' +
  '  border-radius: 10px;\n' +
  '  background: #fff;\n' +
  '  transition: border-color var(--tr), box-shadow var(--tr);\n' +
  '}\n' +
  '.kw-input:focus, .gen-area:focus {\n' +
  '  border-color: var(--amber);\n' +
  '  box-shadow: 0 0 0 3px rgba(76,148,178,.1);\n' +
  '  outline: none;\n' +
  '}\n' +
  'input:not([type=checkbox]):not([type=radio]):not([type=range]):focus,\n' +
  'textarea:focus, select:focus {\n' +
  '  outline: none;\n' +
  '  border-color: var(--amber) !important;\n' +
  '  box-shadow: 0 0 0 3px rgba(76,148,178,.1) !important;\n' +
  '}\n' +

  /* ── Badges ── */
  '.badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; letter-spacing: .02em; }\n' +
  '.badge-live { background: rgba(74,124,111,.1); color: #3b6e62; }\n' +
  '.badge-sched { background: rgba(139,105,20,.08); color: #7a6012; }\n' +
  '.badge-draft { background: rgba(76,148,178,.1); color: var(--amber-d); }\n' +
  '.badge-gen { background: rgba(28,23,20,.06); color: var(--ink3); }\n' +

  /* ── Pub cards ── */
  '.pub-card {\n' +
  '  background: #fff;\n' +
  '  border: 1px solid rgba(28,23,20,.08);\n' +
  '  border-radius: 12px;\n' +
  '  box-shadow: var(--sh-xs);\n' +
  '  transition: all var(--tr);\n' +
  '}\n' +
  '.pub-card:hover { box-shadow: var(--sh-md); transform: translateY(-1px); border-color: rgba(28,23,20,.14); background: #fff; }\n' +
  '.pub-card.connected { border-color: rgba(74,124,111,.2); background: rgba(74,124,111,.03); box-shadow: 0 1px 3px rgba(74,124,111,.07); }\n' +

  /* ── Tone / template chips ── */
  '.tone-chip, .template-chip { border: 1px solid rgba(28,23,20,.14); transition: all var(--tr); }\n' +
  '.tone-chip.on, .template-chip.active { box-shadow: 0 2px 8px rgba(76,148,178,.14); }\n' +

  /* ── Profile sections ── */
  '.profile-section { background: #fff; border: 1px solid rgba(28,23,20,.08); border-radius: 12px; box-shadow: var(--sh-xs); }\n' +

  /* ── Toast ── */
  '.toast { border-radius: 12px; padding: 12px 20px; font-size: 12.5px; box-shadow: var(--sh-lg); }\n' +
  '.toast.ok { background: #182520; color: #a5d0c2; border-left-color: var(--sage); }\n' +
  '.toast.warn { background: #16202b; color: #a5c4d4; border-left-color: var(--amber); }\n' +

  /* ── Modals ── */
  '.modal-box, .edit-post-box, .shortcuts-box { border-radius: 20px; box-shadow: var(--sh-lg); }\n' +
  '.ob-box { border-radius: 22px; box-shadow: 0 40px 100px rgba(10,8,6,.24), 0 8px 24px rgba(10,8,6,.1); }\n' +

  /* ── KW results / misc cards ── */
  '.kw-result-row { background: #fff; border: 1px solid rgba(28,23,20,.08); border-radius: 10px; box-shadow: var(--sh-xs); transition: box-shadow var(--tr); }\n' +
  '.kw-result-row:hover { box-shadow: var(--sh-sm); }\n' +
  '.comp-saved-item { background: #fff; border: 1px solid rgba(28,23,20,.08); border-radius: 10px; box-shadow: var(--sh-xs); transition: all var(--tr); }\n' +
  '.comp-saved-item:hover { box-shadow: var(--sh-md); transform: translateY(-1px); border-color: var(--amber); }\n' +
  '.cluster-post-card { background: #fff; border: 1px solid rgba(28,23,20,.08); box-shadow: var(--sh-xs); }\n' +
  '.social-plat-card { background: #fff; border: 1px solid rgba(28,23,20,.08); box-shadow: var(--sh-xs); }\n' +
  '.social-plat-card.connected { border-color: rgba(74,124,111,.2); background: rgba(74,124,111,.03); }\n' +

  /* ── List row hover states ── */
  '.history-item { transition: background var(--tr); }\n' +
  '.history-item:hover { background: rgba(248,246,242,.9); }\n' +
  '.audit-fix-item { transition: background var(--tr); }\n' +
  '.audit-fix-item:hover { background: rgba(248,246,242,.7); }\n' +
  '.backlink-prospect { transition: background var(--tr); }\n' +
  '.backlink-prospect:hover { background: rgba(248,246,242,.7); }\n' +
  '.rank-row { transition: background var(--tr); }\n' +
  '.rank-row:hover { background: rgba(248,246,242,.8); }\n' +

  /* ── Trial banner ── */
  '.trial-banner {\n' +
  '  background: linear-gradient(135deg, rgba(91,163,196,.07) 0%, rgba(74,124,111,.05) 100%);\n' +
  '  border: 1px solid rgba(91,163,196,.14);\n' +
  '  border-radius: 14px;\n' +
  '}\n' +

  /* ── Plan cards ── */
  '.plan-card { border-radius: 14px; }\n' +
  '.plan-card.featured { background: linear-gradient(145deg, rgba(91,163,196,.08) 0%, rgba(91,163,196,.02) 100%); }\n' +

  /* ── Setup checklist ── */
  '.setup-checklist { background: #fff; border: 1px solid rgba(28,23,20,.08); border-radius: 14px; box-shadow: var(--sh-xs); }\n' +

  /* ── CMS type buttons ── */
  '.cms-type-btn { background: #fff; border: 1px solid rgba(28,23,20,.1); transition: all var(--tr); }\n' +
  '.cms-type-btn:hover:not(.active) { border-color: rgba(28,23,20,.2); box-shadow: var(--sh-xs); }\n' +
  '.cms-type-btn.active { border-color: var(--amber); background: rgba(76,148,178,.05); color: var(--amber-d); }\n' +

  /* ── Cluster gen slide ── */
  '.cluster-gen-slide { background: #fff; border: 1px solid rgba(28,23,20,.08); box-shadow: var(--sh-sm); }\n' +

  /* ── Score spark bars ── */
  '.score-spark-bar { background: var(--amber); opacity: .8; }\n' +

  /* ── Empty hero ── */
  '.empty-hero-icon { font-size: 30px; opacity: .25; margin-bottom: 16px; }\n' +
  '.empty-hero-title { font-size: 15px; font-weight: 700; letter-spacing: -.02em; }\n' +
  '.empty-hero-desc { font-size: 13px; color: var(--ink4); line-height: 1.65; }\n' +

  /* ── Scrollbars ── */
  '::-webkit-scrollbar { width: 4px; height: 4px; }\n' +
  '::-webkit-scrollbar-track { background: transparent; }\n' +
  '::-webkit-scrollbar-thumb { background: rgba(28,23,20,.12); border-radius: 2px; }\n' +
  '::-webkit-scrollbar-thumb:hover { background: rgba(28,23,20,.22); }\n' +

  /* ── Dark mode override for new vars ── */
  'body.dark .stat-card, body.dark .card, body.dark .table-wrap,\n' +
  'body.dark .kw-result-row, body.dark .profile-section, body.dark .comp-saved-item,\n' +
  'body.dark .cluster-post-card, body.dark .pub-card, body.dark .setup-checklist {\n' +
  '  background: var(--cream2);\n' +
  '  border-color: var(--border);\n' +
  '  box-shadow: none;\n' +
  '}\n' +
  'body.dark .table-hd { background: var(--cream3); }\n' +
  'body.dark .content { background: var(--cream); }\n' +
  'body.dark .topbar { background: rgba(26,23,20,.92); border-color: var(--border); box-shadow: none; }\n' +
  '</style>\n' +
  '</head>'
);

fs.writeFileSync('app.html', c.split('\n').join('\r\n'));
console.log('\nTotal replacements: ' + count + ' / 1');
