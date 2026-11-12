/* Edition 04 · LENS — interaction layer (no dependencies). */
(() => {
  const D = window.LENS || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem('lens:' + k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem('lens:' + k, v); } catch { /* private mode */ } },
  };

  let toastTimer;
  function toast(msg) {
    const el = $('#ln-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 2600);
  }

  /* ---------------- lens (audience) ---------------- */
  const flow = $('#ln-flow');
  const sections = $$('[data-sec]');
  let lens = 'hire';

  function applyLens(next, announce) {
    if (!D.lenses || !D.lenses[next]) return;
    lens = next;
    const cfg = D.lenses[next];
    root.setAttribute('data-lens', next);
    $$('[data-lens-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lensBtn === next)));

    const lead = $('#ln-lead');
    if (lead) lead.textContent = cfg.lead;
    const cta = $('#ln-cta');
    if (cta) { cta.innerHTML = cfg.cta.label + ' <span aria-hidden="true">&rarr;</span>'; cta.href = cfg.cta.href; }
    const alt = $('#ln-cta-alt');
    if (alt) { alt.textContent = cfg.alt.label; alt.href = cfg.alt.href; }

    if (flow) {
      const move = () => {
        cfg.order.forEach((id) => {
          const el = document.getElementById(id);
          if (el) flow.appendChild(el);
        });
        buildMini();
      };
      if (!RM && document.startViewTransition) document.startViewTransition(move);
      else move();
    }

    const route = $('#ln-route');
    if (route) {
      route.innerHTML = '';
      cfg.order.slice(0, 3).forEach((id, i) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + id;
        const b = document.createElement('b');
        b.textContent = '0' + (i + 1);
        a.append(b, document.createTextNode(D.titles[id] || id));
        li.appendChild(a);
        route.appendChild(li);
      });
    }

    store.set('persona', next);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lens', next);
      history.replaceState(null, '', url);
    } catch { /* file:// preview */ }
    if (announce) toast('Page re-composed for: ' + (next === 'hire' ? 'hiring' : next === 'partner' ? 'partners' : 'exploring'));
  }

  $$('[data-lens-btn]').forEach((b) => b.addEventListener('click', () => applyLens(b.dataset.lensBtn, true)));

  /* ---------------- headline languages ---------------- */
  const headEl = $('#ln-headline');
  const h1 = $('#ln-h1');
  let lang = 'en';
  let decodeFrame;

  function setLang(next) {
    if (!D.headlines || !D.headlines[next] || !headEl) return;
    lang = next;
    $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === next)));
    if (h1) h1.lang = next;
    const target = D.headlines[next];
    cancelAnimationFrame(decodeFrame);
    if (RM) { headEl.textContent = target; return; }
    const glyphs = 'abcdefghjkmnpqrstuvwxyz·—';
    const start = performance.now();
    const dur = 420;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const reveal = Math.floor(target.length * p);
      let out = target.slice(0, reveal);
      for (let i = reveal; i < target.length; i++) {
        const ch = target[i];
        out += ch === ' ' ? ' ' : glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      headEl.textContent = out;
      if (p < 1) decodeFrame = requestAnimationFrame(tick);
      else headEl.textContent = target;
    };
    decodeFrame = requestAnimationFrame(tick);
  }
  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ---------------- theme ---------------- */
  function setTheme(next) {
    root.setAttribute('data-theme', next);
    const btn = $('#ln-theme');
    if (btn) btn.setAttribute('aria-pressed', String(next === 'dark'));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === 'dark' ? '#0E1116' : '#F3F1EC';
    store.set('theme', next);
  }
  $('#ln-theme')?.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  /* ---------------- sources / claim ledger ---------------- */
  function setSources(on) {
    root.classList.toggle('show-src', on);
    $('#ln-src-toggle')?.setAttribute('aria-pressed', String(on));
    const ledger = $('#ln-ledger');
    if (ledger) ledger.hidden = !on;
  }
  const srcCount = $$('[data-src]').length;
  const phCount = $$('[data-placeholder]').length;
  if ($('#ln-count-src')) $('#ln-count-src').textContent = String(srcCount);
  if ($('#ln-count-ph')) $('#ln-count-ph').textContent = String(phCount);
  $('#ln-src-toggle')?.addEventListener('click', () => setSources(!root.classList.contains('show-src')));

  /* ---------------- project tabs ---------------- */
  const tabs = $$('.ln-work-tab');
  function selectTab(i, focus) {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
      if (on && focus) t.focus();
    });
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(i));
    t.addEventListener('keydown', (e) => {
      const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in map) { e.preventDefault(); selectTab((i + map[e.key] + tabs.length) % tabs.length, true); }
      if (e.key === 'Home') { e.preventDefault(); selectTab(0, true); }
      if (e.key === 'End') { e.preventDefault(); selectTab(tabs.length - 1, true); }
    });
  });

  /* ---------------- pipeline ---------------- */
  const stickyTerm = $('#ln-term');
  const stages = $$('[data-stage]');
  const railItems = $$('[data-rail]');
  function setStage(i) {
    const src = $(`[data-term="${i}"]`);
    if (stickyTerm && src && stickyTerm.dataset.for !== String(i)) {
      const clone = src.cloneNode(true);
      clone.removeAttribute('data-term');
      clone.classList.remove('ln-term-inline');
      stickyTerm.replaceChildren(...Array.from(clone.childNodes));
      stickyTerm.dataset.for = String(i);
      stickyTerm.className = src.className.replace('ln-term-inline', '').trim();
    }
    railItems.forEach((li) => li.classList.toggle('is-on', Number(li.dataset.rail) === i));
    stages.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.stage) === i));
  }
  if (stages.length) {
    setStage(0);
    const stageObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setStage(Number(e.target.dataset.stage)); });
    }, { rootMargin: '-40% 0px -45% 0px', threshold: 0 });
    stages.forEach((s) => stageObs.observe(s));
  }

  /* ---------------- reveal ---------------- */
  const reveals = $$('.ln-reveal');
  if (reveals.length && 'IntersectionObserver' in window && !RM) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => ro.observe(el));
  } else reveals.forEach((el) => el.classList.add('is-in'));

  /* ---------------- now / next split ---------------- */
  const split = $('#ln-split');
  $$('[data-split]').forEach((b) => {
    if (b.tagName !== 'BUTTON') return;
    b.addEventListener('click', () => {
      const mode = b.dataset.split;
      split?.setAttribute('data-split', mode);
      $$('#ln-split [data-split]').forEach((x) => { if (x.tagName === 'BUTTON') x.setAttribute('aria-pressed', String(x === b)); });
    });
  });

  /* ---------------- hire composer ---------------- */
  const chosen = new Set();
  function draft() {
    const picked = (D.tasks || []).filter((t) => chosen.has(t.id));
    const problem = ($('#ln-problem')?.value || '').trim();
    const subject = picked.length ? picked.map((t) => t.title).join(' + ') : 'Tell me what you need';
    let body = 'Hi Laurent,\n\n';
    body += picked.length
      ? "I'd like to talk about:\n" + picked.map((t) => '- ' + t.title).join('\n') + '\n'
      : "I'd like to talk about a project.\n";
    if (problem) body += '\nThe problem:\n' + problem + '\n';
    body += '\nThanks,\n';
    return { subject, body };
  }
  function renderDraft() {
    const { subject, body } = draft();
    if ($('#ln-mail-subj')) $('#ln-mail-subj').textContent = subject;
    if ($('#ln-mail-text')) $('#ln-mail-text').textContent = body;
    const send = $('#ln-mail-send');
    if (send && D.email) send.href = 'mailto:' + D.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  $$('[data-task]').forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.task;
    if (chosen.has(id)) chosen.delete(id); else chosen.add(id);
    b.setAttribute('aria-pressed', String(chosen.has(id)));
    renderDraft();
  }));
  $('#ln-problem')?.addEventListener('input', renderDraft);
  renderDraft();

  $('#ln-mail-copy')?.addEventListener('click', async () => {
    const { subject, body } = draft();
    const text = (D.email ? 'To: ' + D.email + '\n' : '') + 'Subject: ' + subject + '\n\n' + body;
    try {
      await navigator.clipboard.writeText(text);
      toast('Draft copied to clipboard');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); toast('Draft copied to clipboard'); }
      catch { toast('Copy not available — select the draft text manually'); }
      ta.remove();
    }
  });

  /* ---------------- minimap + progress + nav state ---------------- */
  function buildMini() {
    const mini = $('#ln-mini');
    if (!mini) return;
    mini.innerHTML = '';
    $$('[data-sec]').forEach((s) => {
      const a = document.createElement('a');
      a.href = '#' + s.id;
      a.dataset.mini = s.id;
      const label = document.createElement('span');
      label.textContent = D.titles[s.id] || s.id;
      const bar = document.createElement('i');
      a.append(label, bar);
      mini.appendChild(a);
    });
  }
  buildMini();

  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      $$('#ln-mini a').forEach((a) => a.classList.toggle('is-on', a.dataset.mini === id));
      $$('.ln-nav a').forEach((a) => a.classList.toggle('is-on', a.getAttribute('href') === '#' + id));
    });
  }, { rootMargin: '-30% 0px -55% 0px' });
  sections.forEach((s) => secObs.observe(s));

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? (window.scrollY / max) * 100 : 0;
      const bar = $('#ln-progress');
      if (bar) bar.style.width = p + '%';
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- spotlight ---------------- */
  if (!RM && window.matchMedia('(pointer: fine)').matches) {
    $$('.ln-spot').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ---------------- command palette ---------------- */
  const dlg = $('#ln-cmd');
  const input = $('#ln-cmd-input');
  const list = $('#ln-cmd-list');
  let items = [];
  let active = 0;

  function go(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  function buildItems() {
    const order = (D.lenses && D.lenses[lens].order) || [];
    items = [
      ...order.map((id) => ({ group: 'Sections', label: D.titles[id] || id, hint: 'jump', run: () => go(id) })),
      { group: 'Lens', label: "Re-compose for hiring", hint: 'lens', run: () => applyLens('hire', true) },
      { group: 'Lens', label: 'Re-compose for partners', hint: 'lens', run: () => applyLens('partner', true) },
      { group: 'Lens', label: 'Re-compose for exploring', hint: 'lens', run: () => applyLens('explore', true) },
      { group: 'Language', label: 'Headline in English', hint: 'EN', run: () => setLang('en') },
      { group: 'Language', label: 'Titre en français', hint: 'FR', run: () => setLang('fr') },
      { group: 'Language', label: 'Titular en español', hint: 'ES', run: () => setLang('es') },
      { group: 'Display', label: 'Toggle dark mode', hint: 'theme', run: () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark') },
      { group: 'Display', label: 'Toggle claim sources', hint: 'audit', run: () => setSources(!root.classList.contains('show-src')) },
      { group: 'Editions', label: '01 · Editorial Consultancy', hint: '/', run: () => { window.location.href = '/'; } },
      { group: 'Editions', label: '02 · Laurent.Play Arcade', hint: '/play/', run: () => { window.location.href = '/play/'; } },
      { group: 'Editions', label: '03 · Laurent // Studio', hint: '/studio/', run: () => { window.location.href = '/studio/'; } },
      { group: 'Editions', label: 'All portfolios hub', hint: '/portfolios/', run: () => { window.location.href = '/portfolios/'; } },
    ];
  }

  function renderList() {
    if (!list) return;
    const q = (input?.value || '').trim().toLowerCase();
    const matches = items.filter((it) => (it.group + ' ' + it.label).toLowerCase().includes(q));
    active = Math.min(active, Math.max(0, matches.length - 1));
    list.innerHTML = '';
    if (!matches.length) {
      const li = document.createElement('li');
      li.className = 'ln-cmd-empty';
      li.textContent = 'No match. Try "work", "partner", "dark" or "FR".';
      list.appendChild(li);
      input?.removeAttribute('aria-activedescendant');
      return;
    }
    let lastGroup = '';
    matches.forEach((it, i) => {
      if (it.group !== lastGroup) {
        lastGroup = it.group;
        const g = document.createElement('li');
        g.className = 'ln-cmd-group';
        g.textContent = it.group;
        list.appendChild(g);
      }
      const li = document.createElement('li');
      li.id = 'cmd-opt-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === active));
      li.textContent = it.label;
      const small = document.createElement('small');
      small.textContent = it.hint;
      li.appendChild(small);
      li.addEventListener('click', () => { closeCmd(); it.run(); });
      li.addEventListener('pointermove', () => { if (active !== i) { active = i; paintActive(matches); } });
      list.appendChild(li);
    });
    const opt = $('#cmd-opt-' + active);
    if (opt) input?.setAttribute('aria-activedescendant', opt.id);
  }

  function paintActive(matches) {
    matches.forEach((_, i) => $('#cmd-opt-' + i)?.setAttribute('aria-selected', String(i === active)));
    input?.setAttribute('aria-activedescendant', 'cmd-opt-' + active);
  }

  function currentMatches() {
    const q = (input?.value || '').trim().toLowerCase();
    return items.filter((it) => (it.group + ' ' + it.label).toLowerCase().includes(q));
  }

  function openCmd() {
    if (!dlg) return;
    buildItems();
    active = 0;
    if (input) input.value = '';
    renderList();
    if (!dlg.open) dlg.showModal();
    input?.focus();
  }
  function closeCmd() { if (dlg?.open) dlg.close(); }

  $('#ln-cmd-open')?.addEventListener('click', openCmd);
  input?.addEventListener('input', () => { active = 0; renderList(); });
  input?.addEventListener('keydown', (e) => {
    const m = currentMatches();
    if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, m.length - 1); paintActive(m); $('#cmd-opt-' + active)?.scrollIntoView({ block: 'nearest' }); }
    if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); paintActive(m); $('#cmd-opt-' + active)?.scrollIntoView({ block: 'nearest' }); }
    if (e.key === 'Enter' && m[active]) { e.preventDefault(); closeCmd(); m[active].run(); }
  });
  dlg?.addEventListener('click', (e) => { if (e.target === dlg) closeCmd(); });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg?.open ? closeCmd() : openCmd(); }
  });

  /* ---------------- restore state ---------------- */
  const savedTheme = store.get('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') setTheme(savedTheme);
  let initial = new URLSearchParams(window.location.search).get('lens') || store.get('persona') || 'hire';
  if (!D.lenses || !D.lenses[initial]) initial = 'hire';
  applyLens(initial, false);
})();
