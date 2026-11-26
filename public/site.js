/* Studio interaction layer (no dependencies). */
function initStudioInteractions() {
  const D = window.SITE_DATA || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem('ll:' + k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem('ll:' + k, v); } catch { /* private mode */ } },
  };

  let toastTimer;
  function toast(msg) {
    const el = $('#ll-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 2600);
  }

  /* ---------------- audience routing ---------------- */
  const flow = $('#ll-flow');
  const sections = $$('[data-sec]');
  let audience = D.defaultAudience || 'agency';

  function applyAudience(next, announce, animate = true) {
    const cfg = (D.audiences || []).find((a) => a.id === next);
    if (!cfg || !flow) { if (cfg) audience = next; return; }
    audience = next;
    $$('[data-audience-btn]').forEach((b) => {
      const pressed = String(b.dataset.audienceBtn === next);
      if (b.getAttribute('aria-pressed') !== pressed) b.setAttribute('aria-pressed', pressed);
    });

    const lead = $('#ll-lead');
    if (lead && lead.textContent !== cfg.lead) lead.textContent = cfg.lead;

    const alreadyOrdered = cfg.order.every((id, index) => flow.children[index]?.id === id) && flow.children.length === cfg.order.length;
    const move = () => {
      cfg.order.forEach((id) => {
        const el = document.getElementById(id);
        if (el) flow.appendChild(el);
      });
      buildMini();
    };
    if (!alreadyOrdered) {
      if (animate && !RM && document.startViewTransition) document.startViewTransition(move);
      else move();
    }

    const route = $('#ll-route');
    if (route) {
      const wanted = cfg.order.slice(0, 3);
      const current = $$('a', route).map((a) => a.getAttribute('href')).join('|');
      const target = wanted.map((id) => '#' + id).join('|');
      if (current !== target) {
        route.innerHTML = '';
        wanted.forEach((id, i) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = '#' + id;
          const b = document.createElement('b');
          b.textContent = '0' + (i + 1);
          a.append(b, document.createTextNode(D.sectionTitles[id] || id));
          li.appendChild(a);
          route.appendChild(li);
        });
      }
    }

    store.set('audience', next);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('audience', next);
      history.replaceState(null, '', url);
    } catch { /* file:// preview */ }
    if (announce) toast('Page re-composed for: ' + cfg.label);
  }

  $$('[data-audience-btn]').forEach((b) => b.addEventListener('click', () => applyAudience(b.dataset.audienceBtn, true)));

  /* ---------------- theme ---------------- */
  function setTheme(next) {
    root.setAttribute('data-theme', next);
    const btn = $('#ll-theme');
    if (btn) btn.setAttribute('aria-pressed', String(next === 'dark'));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === 'dark' ? '#0E1116' : '#F3F1EC';
    store.set('theme', next);
  }
  $('#ll-theme')?.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  /* ---------------- progress + nav state + spotlight ---------------- */
  const miniMedia = window.matchMedia('(min-width: 80rem)');
  let secObs = null;

  function buildMini() {
    const mini = $('#ll-mini');
    if (!mini) return;
    if (mini.innerHTML) mini.innerHTML = '';
    if (!miniMedia.matches) return;
    $$('[data-sec]').forEach((s) => {
      const a = document.createElement('a');
      a.href = '#' + s.id;
      a.dataset.mini = s.id;
      const label = document.createElement('span');
      label.textContent = D.sectionTitles[s.id] || s.id;
      const bar = document.createElement('i');
      a.append(label, bar);
      mini.appendChild(a);
    });
  }

  function watchSections() {
    if (!sections.length) return;
    if (!miniMedia.matches) {
      secObs?.disconnect();
      secObs = null;
      return;
    }
    if (secObs) return;
    secObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        $$('#ll-mini a').forEach((a) => a.classList.toggle('is-on', a.dataset.mini === id));
        $$('.ll-nav a').forEach((a) => a.classList.toggle('is-on', a.getAttribute('href') === '#' + id));
      });
    }, { rootMargin: '-30% 0px -55% 0px' });
    sections.forEach((s) => secObs.observe(s));
  }

  buildMini();
  watchSections();
  miniMedia.addEventListener?.('change', () => { buildMini(); watchSections(); });

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? (window.scrollY / max) * 100 : 0;
      const bar = $('#ll-progress');
      const width = p + '%';
      if (bar && bar.style.width !== width && !(p === 0 && !bar.style.width)) bar.style.width = width;
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });


  if (!RM && window.matchMedia('(pointer: fine)').matches) {
    $$('.ll-spot').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ---------------- contact composer ---------------- */
  const picked = new Set();
  const topics = D.contactOptions || [];
  function draft() {
    const sel = topics.filter((t) => picked.has(t.id));
    const problem = ($('#ll-problem')?.value || '').trim();
    const subject = sel.length ? sel.map((t) => t.subject).join(' + ') : (D.quoteSubject || 'Quote request');
    let body = 'Hello,\n\n';
    body += sel.length
      ? 'I would like a quote or more information about:\n' + sel.map((t) => '- ' + t.label).join('\n') + '\n'
      : 'I would like a quote or more information about your services.\n';
    if (problem) body += '\nContext:\n' + problem + '\n';
    body += '\nThank you,\n';
    return { subject, body };
  }
  function renderDraft() {
    const { subject, body } = draft();
    if ($('#ll-mail-subj')) $('#ll-mail-subj').textContent = subject;
    if ($('#ll-mail-text')) $('#ll-mail-text').textContent = body;
    const send = $('#ll-mail-send');
    if (send && D.email) send.href = 'mailto:' + D.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  $$('[data-topic]').forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.topic;
    if (picked.has(id)) picked.delete(id); else picked.add(id);
    b.setAttribute('aria-pressed', String(picked.has(id)));
    renderDraft();
  }));
  $('#ll-problem')?.addEventListener('input', renderDraft);
  renderDraft();

  $('#ll-mail-copy')?.addEventListener('click', async () => {
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

  $$('[data-print]').forEach((b) => b.addEventListener('click', () => window.print()));

  /* ---------------- command palette ---------------- */
  const dlg = $('#ll-cmd');
  const input = $('#ll-cmd-input');
  const list = $('#ll-cmd-list');
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
    const order = (D.audiences || []).find((a) => a.id === audience)?.order || [];
    const pages = D.pages || [];
    items = [
      ...order.map((id) => ({ group: 'Sections', label: D.sectionTitles[id] || id, hint: 'jump', run: () => go(id) })),
      ...pages.map((p) => ({ group: 'Pages', label: p.label, hint: p.href, run: () => { window.location.href = p.href; } })),
      ...(D.audiences || []).map((a) => ({ group: 'Audience', label: 'Re-compose for ' + a.label.toLowerCase(), hint: 'audience', run: () => applyAudience(a.id, true) })),
      { group: 'Actions', label: 'Request a quote', hint: 'email', run: () => { window.location.href = D.quoteMailto || '#contact'; } },
      { group: 'Actions', label: 'Vendor one-pager (PDF)', hint: 'pdf', run: () => { window.location.href = '/capability-statement.pdf'; } },
      { group: 'Display', label: 'Toggle dark mode', hint: 'theme', run: () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark') },
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
      li.className = 'll-cmd-empty';
      li.textContent = 'No match. Try "quality", "eval", "quote" or "dark".';
      list.appendChild(li);
      input?.removeAttribute('aria-activedescendant');
      return;
    }
    let lastGroup = '';
    matches.forEach((it, i) => {
      if (it.group !== lastGroup) {
        lastGroup = it.group;
        const g = document.createElement('li');
        g.className = 'll-cmd-group';
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

  $('#ll-cmd-open')?.addEventListener('click', openCmd);
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
  let initial = new URLSearchParams(window.location.search).get('audience') || store.get('audience') || D.defaultAudience || 'agency';
  if (!D.audiences?.some((a) => a.id === initial)) initial = D.defaultAudience || 'agency';
  applyAudience(initial, false, false);
}

try {
  const initialTheme = localStorage.getItem('ll:theme');
  if (initialTheme === 'dark' || initialTheme === 'light') document.documentElement.setAttribute('data-theme', initialTheme);
} catch { /* private mode */ }

function scheduleStudioInteractions() {
  requestAnimationFrame(() => setTimeout(initStudioInteractions, 0));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleStudioInteractions, { once: true });
} else {
  scheduleStudioInteractions();
}
