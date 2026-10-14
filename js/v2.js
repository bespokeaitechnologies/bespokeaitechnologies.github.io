/* v2 interactions: progress bar, spotlight, agent console, pipeline, forms, careers, admin */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // scroll progress
  const bar = document.createElement('div'); bar.className = 'scroll-progress'; document.body.prepend(bar);
  addEventListener('scroll', () => {
    const h = document.documentElement; bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  }, { passive: true });

  // spotlight cards follow cursor
  $$('.spot').forEach(el => el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  // reveal-l / reveal-r
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); rio.unobserve(e.target); } }), { threshold: .15 });
  $$('.reveal-l,.reveal-r').forEach(el => rio.observe(el));

  // ── Agent console typing ─────────────────────────
  function runConsole(el, lines, loop) {
    if (!el) return;
    let i = 0;
    const tick = () => {
      if (i >= lines.length) { if (!loop) return; setTimeout(() => { el.innerHTML = ''; i = 0; tick(); }, 2600); return; }
      const d = document.createElement('div'); d.className = 'ln'; d.innerHTML = lines[i++]; el.appendChild(d);
      while (el.children.length > 9) el.removeChild(el.firstChild);
      setTimeout(tick, 650 + Math.random() * 450);
    };
    el.innerHTML = ''; tick();
  }
  const HERO_LINES = [
    '<span class="c-dim">$</span> factory run --brief "order-management portal"',
    '<span class="c-agent">[planner]</span> parsed BRD → 14 stories, 6 services',
    '<span class="c-agent">[architect]</span> chose: React · API gateway · ATP · OCI',
    '<span class="c-agent">[builder]</span> scaffolding services… <span class="c-ok">done</span>',
    '<span class="c-agent">[builder]</span> wrote 212 files, 38 endpoints',
    '<span class="c-agent">[tester]</span> generated 164 tests · <span class="c-ok">164 passed</span>',
    '<span class="c-agent">[reviewer]</span> 2 findings → fixed, re-verified',
    '<span class="c-agent">[release]</span> deploying to staging <span class="c-cy">▸</span> <span class="c-ok">healthy</span>',
    '<span class="c-warn">human gate</span> engineer approves → production'
  ];
  runConsole($('#heroConsole'), HERO_LINES, true);

  // ── Pipeline stages ──────────────────────────────
  const STAGES = {
    discover: { t: 'Discover', p: 'A forward deployed engineer embeds with your team, maps how work actually happens, and audits your current systems, data and tooling.',
      li: ['Process and system footprint review', 'Data and integration inventory', 'AI opportunity scoring and ROI ranking'],
      log: ['<span class="c-dim">$</span> fde audit --client acme', '<span class="c-agent">[scout]</span> 9 systems, 3 spreadsheets in critical path', '<span class="c-agent">[scout]</span> manual re-keying found in order intake', '<span class="c-ok">✓</span> opportunity map ready'] },
    design: { t: 'Design', p: 'Specs, architecture and a delivery plan written as machine-readable briefs that both engineers and agents can build from.',
      li: ['BRD → user stories → acceptance tests', 'Reference architecture and security model', 'Hosting and cost plan'],
      log: ['<span class="c-agent">[planner]</span> BRD → 22 stories', '<span class="c-agent">[architect]</span> API-first, event-driven, ATP store', '<span class="c-agent">[security]</span> threat model attached', '<span class="c-ok">✓</span> design signed off'] },
    build: { t: 'Build', p: 'Specialised agents generate services, front ends and integrations in parallel; engineers direct and own the result.',
      li: ['Web, mobile and e-commerce front ends', 'APIs, workflows and agentic tools', 'ERP, CRM and legacy integrations'],
      log: ['<span class="c-agent">[builder-ui]</span> 14 screens generated', '<span class="c-agent">[builder-api]</span> 38 endpoints', '<span class="c-agent">[builder-int]</span> ERP sync mapped', '<span class="c-ok">✓</span> build green'] },
    test: { t: 'Test', p: 'Every change is validated by generated tests, static analysis and human review before anything ships.',
      li: ['Unit, API and end-to-end tests', 'Security and dependency scanning', 'Engineer code review gate'],
      log: ['<span class="c-agent">[tester]</span> 164 tests generated', '<span class="c-ok">✓</span> 164 passed', '<span class="c-agent">[reviewer]</span> 2 findings fixed', '<span class="c-ok">✓</span> gate passed'] },
    ship: { t: 'Ship', p: 'Infrastructure as code and automated pipelines put it live safely, with rollbacks and staged releases.',
      li: ['CI/CD with staged environments', 'Terraform-managed infrastructure', 'Zero-surprise cutover plans'],
      log: ['<span class="c-agent">[release]</span> plan: 14 resources', '<span class="c-agent">[release]</span> staging <span class="c-ok">healthy</span>', '<span class="c-warn">human gate</span> approved', '<span class="c-ok">✓</span> production live'] },
    run: { t: 'Run', p: 'We host and operate it. Monitoring, patching, backups, security and support are ours, so your team stays focused on the business.',
      li: ['24x7 monitoring and incident response', 'Patching, backup and DR', 'Continuous improvement and new agents'],
      log: ['<span class="c-agent">[sre]</span> all checks green', '<span class="c-agent">[sre]</span> patch window scheduled', '<span class="c-agent">[cost]</span> rightsizing saved spend', '<span class="c-ok">✓</span> monthly report sent'] }
  };
  const pd = $('#pipeDetail');
  function showStage(k) {
    if (!pd) return; const s = STAGES[k];
    $$('.pipe-node').forEach(n => n.classList.toggle('active', n.dataset.stage === k));
    pd.innerHTML = `<div><h3>${s.t}</h3><p>${s.p}</p><ul>${s.li.map(x => `<li>${x}</li>`).join('')}</ul></div>
      <div class="console"><div class="console-bar"><i></i><i></i><i></i><span>agent-console · ${s.t.toLowerCase()}</span></div><div class="console-body" id="stageLog"></div></div>`;
    runConsole($('#stageLog'), s.log, true);
  }
  $$('.pipe-node').forEach(n => n.addEventListener('click', () => showStage(n.dataset.stage)));
  if (pd) showStage('discover');

  // ── Tabs (module explorers); hash links like #erp open the matching tab ──
  $$('[data-tabs]').forEach(root => {
    const btns = $$('.tab-btn', root), panels = $$('.tab-panel', root);
    const show = id => {
      btns.forEach(b => { const on = b.dataset.tab === id; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
      panels.forEach(p => p.classList.toggle('on', p.dataset.tab === id));
    };
    btns.forEach(b => b.addEventListener('click', () => { show(b.dataset.tab); history.replaceState(null, '', '#' + b.dataset.tab); }));
    const fromHash = () => {
      const h = location.hash.slice(1);
      const m = h && btns.find(b => b.dataset.tab === h || (b.dataset.alias || '').split(' ').includes(h));
      show(m ? m.dataset.tab : btns[0].dataset.tab);
      if (m) setTimeout(() => root.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    };
    fromHash(); addEventListener('hashchange', fromHash);
  });

  // ── Rotating words ───────────────────────────────
  const rot = $('#rotor');
  if (rot) {
    const w = ['AI agents', 'RAG systems', 'fine-tuned models', 'small language models', 'e-commerce platforms', 'ERP & operations tools', 'HR & order-management systems', 'fully managed IT'];
    let i = 0; setInterval(() => { rot.style.opacity = 0; setTimeout(() => { i = (i + 1) % w.length; rot.textContent = w[i]; rot.style.opacity = 1; }, 300); }, 2600);
    rot.style.transition = 'opacity .3s';
  }

  // ── Forms → ATP API ──────────────────────────────
  function note(form, cls, msg) { const n = $('.form-note', form); if (n) { n.className = 'form-note ' + cls; n.textContent = msg; } }
  async function handle(form, build, path) {
    const btn = $('button[type=submit]', form); const orig = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending…'; note(form, 'info', '');
    try {
      const payload = await build(new FormData(form));
      const tok = form.querySelector('[name=cf-turnstile-response]'); if (tok) payload.turnstileToken = tok.value;
      const r = await window.BespokeAPI.post(path, payload);
      if (r.ok) { note(form, 'ok', r.message); form.reset(); const dz = $('.drop-name', form); if (dz) dz.textContent = ''; }
      else note(form, r.preview ? 'info' : 'err', r.message);
    } catch (e) { note(form, 'err', 'Something went wrong. Please try again.'); }
    btn.disabled = false; btn.textContent = orig;
  }
  const cf = $('#contactForm');
  if (cf) cf.addEventListener('submit', e => { e.preventDefault();
    handle(cf, async fd => Object.fromEntries(fd.entries()), 'contact').then(() => {}); });
  const af = $('#applyForm');
  if (af) {
    const file = $('#resume'); const dz = $('.drop', af);
    if (dz) {
      ['dragover', 'dragenter'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('over'); }));
      ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('over'); }));
      dz.addEventListener('drop', e => { if (e.dataTransfer.files[0]) { file.files = e.dataTransfer.files; file.dispatchEvent(new Event('change')); } });
      dz.addEventListener('click', () => file.click());
      file.addEventListener('change', () => { $('.drop-name', af).textContent = file.files[0] ? file.files[0].name : ''; });
    }
    af.addEventListener('submit', e => { e.preventDefault();
      handle(af, async fd => {
        const o = Object.fromEntries(fd.entries()); delete o.resume;
        const f = file.files[0];
        if (f) {
          if (f.size > 4 * 1024 * 1024) throw new Error('Resume must be under 4 MB.');
          o.resumeFilename = f.name; o.resumeMime = f.type; o.resumeBase64 = await window.BespokeAPI.fileToBase64(f);
        }
        return o;
      }, 'apply');
    });
  }

  // ── Careers list ─────────────────────────────────
  const jl = $('#jobList');
  if (jl) window.BespokeAPI.jobs().then(items => {
    if (!items.length) { jl.innerHTML = '<p style="color:var(--txt-2)">No open roles right now. Send a general application below.</p>'; return; }
    jl.innerHTML = items.map(j => `<button type="button" class="job" data-slug="${esc(j.slug)}" data-title="${esc(j.title)}">
      <div><h4>${esc(j.title)}</h4><p>${esc(j.summary)}</p>
      <div class="meta"><span class="tag tag-teal">${esc(j.department)}</span><span class="tag tag-navy">${esc(j.location)}</span><span class="tag tag-gold">${esc(j.experience_level || j.experienceLevel || '')}</span></div></div>
      <span class="go">Apply →</span></button>`).join('');
    $$('.job', jl).forEach(b => b.addEventListener('click', () => {
      $$('.job', jl).forEach(x => x.classList.remove('sel')); b.classList.add('sel');
      $('#jobSlug').value = b.dataset.slug; $('#jobTitleLabel').textContent = 'Applying for: ' + b.dataset.title;
      $('#applyBox').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    const pre = new URLSearchParams(location.search).get('job'); if (pre) $(`.job[data-slug="${CSS.escape(pre)}"]`, jl)?.click();
  });

  // ── Admin dashboard ──────────────────────────────
  const adm = $('#adminApp');
  if (adm) {
    let key = ''; const out = $('#admOut');
    const call = (action, extra = {}) => window.BespokeAPI.post('admin', { key, action, ...extra });
    const fmt = d => (d || '').replace('T', ' ').replace('Z', '');
    async function load(tab) {
      $$('.adm-tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
      const r = await call(tab); if (!r.ok) { out.innerHTML = `<p class="form-note err">${esc(r.message)}</p>`; return; }
      const rows = r.data.items || [];
      if (tab === 'inquiries') out.innerHTML = table(['When', 'Name', 'Email', 'Company', 'Interest', 'Message', 'Status'], rows.map(x => [fmt(x.createdAt), x.name, x.email, x.company, x.interest, x.message, x.status]));
      if (tab === 'applications') { out.innerHTML = table(['When', 'Name', 'Email', 'Role', 'Skill', 'Exp', 'Resume', 'Status'],
        rows.map(x => [fmt(x.createdAt), x.name, x.email, x.job || 'General', x.specialization, x.experience,
          x.resumeFilename ? `<a href="#" data-resume="${x.id}">${esc(x.resumeFilename)}</a>` : '—', x.status]), [6]);
        $$('[data-resume]', out).forEach(a => a.addEventListener('click', async e => { e.preventDefault();
          const rr = await call('resume', { id: +a.dataset.resume }); if (!rr.ok) return;
          const bin = atob(rr.data.base64), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
          const l = document.createElement('a'); l.href = URL.createObjectURL(new Blob([u])); l.download = rr.data.filename; l.click(); })); }
      if (tab === 'jobs') out.innerHTML = table(['Title', 'Dept', 'Location', 'Level', 'Status'], rows.map(x => [x.title, x.department, x.location, x.level, x.status]));
    }
    function table(h, rows, raw = []) {
      return `<div class="tbl-wrap"><table class="adm"><thead><tr>${h.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${
        rows.map(r => `<tr>${r.map((c, i) => `<td>${raw.includes(i) ? c : esc(c)}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${h.length}">No records.</td></tr>`}</tbody></table></div>`;
    }
    $('#admLogin').addEventListener('submit', async e => {
      e.preventDefault(); key = $('#admKey').value;
      const r = await call('summary'); const n = $('#admLoginNote');
      if (!r.ok) { n.textContent = r.message; n.className = 'form-note err'; return; }
      $('#admLoginBox').hidden = true; $('#admMain').hidden = false;
      const d = r.data; $('#kInq').textContent = d.inquiries; $('#kInqN').textContent = d.inquiriesNew + ' new';
      $('#kApp').textContent = d.applications; $('#kAppN').textContent = d.applicationsNew + ' new'; $('#kJobs').textContent = d.openJobs;
      const weeks = {}; (d.weekly || []).forEach(w => weeks[w.week] = (weeks[w.week] || 0) + w.n);
      const vals = Object.values(weeks), mx = Math.max(1, ...vals);
      $('#admSpark').innerHTML = vals.map(v => `<i style="height:0" data-h="${v / mx * 100}%" title="${v}"></i>`).join('');
      requestAnimationFrame(() => $$('#admSpark i').forEach(i => i.style.height = i.dataset.h));
      load('inquiries');
    });
    $$('.adm-tabs button').forEach(b => b.addEventListener('click', () => load(b.dataset.tab)));
  }
})();
