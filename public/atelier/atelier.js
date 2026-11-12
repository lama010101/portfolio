(() => {
  const root = document.documentElement;
  const reduced = root.classList.contains('at-rm');
  const cfg = window.__ATELIER__ || {};

  const menuBtn = document.getElementById('at-menu-btn');
  const navEl = document.getElementById('at-nav');
  if (menuBtn && navEl) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      navEl.classList.toggle('is-open', !open);
    });
    navEl.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        menuBtn.setAttribute('aria-expanded', 'false');
        navEl.classList.remove('is-open');
      }
    });
  }

  const audBtns = Array.from(document.querySelectorAll('[data-aud]'));
  if (audBtns.length) {
    const panels = Array.from(document.querySelectorAll('[data-aud-panel]'));
    audBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-aud');
        audBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        panels.forEach((p) => p.classList.toggle('is-on', p.getAttribute('data-aud-panel') === key));
      });
    });
  }

  const bp = document.querySelector('[data-bp]');
  if (bp) {
    const steps = Array.from(bp.querySelectorAll('[data-bp-step]'));
    const panels = Array.from(bp.querySelectorAll('[data-bp-panel]'));
    const select = (i) => {
      steps.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
      panels.forEach((p) => p.classList.toggle('is-on', p.getAttribute('data-bp-panel') === String(i)));
    };
    steps.forEach((b, i) => {
      b.addEventListener('click', () => select(i));
      b.addEventListener('keydown', (e) => {
        let n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % steps.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + steps.length) % steps.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = steps.length - 1;
        if (n !== null) {
          e.preventDefault();
          select(n);
          steps[n].focus();
        }
      });
    });
  }

  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const rail = document.getElementById('at-rail');
  if (rail && sections.length) {
    sections.forEach((s) => {
      const label = s.getAttribute('data-rail') || (s.querySelector('h2, h1') || {}).textContent || s.id;
      const a = document.createElement('a');
      a.href = `#${s.id}`;
      a.textContent = label.trim().slice(0, 26);
      rail.appendChild(a);
    });
    const railLinks = Array.from(rail.querySelectorAll('a'));
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            railLinks.forEach((l) => l.classList.toggle('is-on', l.getAttribute('href') === `#${en.target.id}`));
          }
        });
      },
      { rootMargin: '-30% 0px -55% 0px' }
    );
    sections.forEach((s) => spy.observe(s));
  }

  const bar = document.getElementById('at-progress-bar');
  if (bar) {
    const upd = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? `${Math.min(100, (window.scrollY / h) * 100)}%` : '0%';
    };
    document.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
  if (reveals.length && !reduced && 'IntersectionObserver' in window) {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            ro.unobserve(en.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((el) => ro.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch {}
      ta.remove();
      return ok;
    }
  };

  const palette = document.getElementById('at-palette');
  const paletteInput = document.getElementById('at-palette-input');
  const paletteList = document.getElementById('at-palette-list');
  const jumpBtn = document.getElementById('at-jump-btn');
  if (palette && paletteInput && paletteList) {
    const items = [];
    const pageLinks = Array.from(document.querySelectorAll('.at-head-bar .at-nav a'));
    pageLinks.forEach((a) => items.push({ kind: 'PAGE', label: a.textContent.trim(), hint: a.getAttribute('href'), run: () => (location.href = a.getAttribute('href')) }));
    sections.forEach((s) => {
      const h = s.querySelector('h2, h1');
      if (h) items.push({ kind: 'SECTION', label: h.textContent.trim(), hint: `#${s.id}`, run: () => { close(); document.getElementById(s.id).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); } });
    });
    if (cfg.email) {
      items.push({ kind: 'ACTION', label: `Email Laurent — ${cfg.email}`, hint: 'mailto', run: () => (location.href = `mailto:${cfg.email}`) });
      items.push({ kind: 'ACTION', label: 'Copy email address', hint: 'clipboard', run: () => { copyText(cfg.email); close(); } });
      items.push({ kind: 'ACTION', label: 'Discuss a project', hint: 'mailto', run: () => (location.href = `mailto:${cfg.email}?subject=${encodeURIComponent('Discuss a project')}`) });
    }
    if (cfg.linkedin) items.push({ kind: 'ACTION', label: 'Open LinkedIn profile', hint: 'external', run: () => window.open(cfg.linkedin, '_blank', 'noopener') });
    items.push({ kind: 'ACTION', label: 'Back to top', hint: 'scroll', run: () => { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); close(); } });

    let lastFocus = null;
    let filtered = items;
    const render = () => {
      paletteList.innerHTML = '';
      const shown = filtered.slice(0, 40);
      if (!shown.length) {
        const li = document.createElement('li');
        li.className = 'at-palette-empty';
        li.textContent = 'No match — try a page name or an action.';
        paletteList.appendChild(li);
        return;
      }
      shown.forEach((it, i) => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'option');
        b.className = i === 0 ? 'is-sel' : '';
        b.innerHTML = `<span class="at-k">${it.kind}</span><span>${it.label}</span><span class="at-s">${it.hint || ''}</span>`;
        b.addEventListener('click', () => it.run());
        b.addEventListener('mousemove', () => selectIdx(i));
        li.appendChild(b);
        paletteList.appendChild(li);
      });
    };
    const selectIdx = (i) => {
      Array.from(paletteList.querySelectorAll('button')).forEach((b, j) => b.classList.toggle('is-sel', j === i));
    };
    const selected = () => Array.from(paletteList.querySelectorAll('button')).findIndex((b) => b.classList.contains('is-sel'));
    const filter = () => {
      const q = paletteInput.value.trim().toLowerCase();
      filtered = q ? items.filter((it) => `${it.kind} ${it.label}`.toLowerCase().includes(q)) : items;
      render();
    };
    const open = () => {
      lastFocus = document.activeElement;
      palette.hidden = false;
      paletteInput.value = '';
      filter();
      paletteInput.focus();
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      palette.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    if (jumpBtn) jumpBtn.addEventListener('click', open);
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        palette.hidden ? open() : close();
      }
      if (e.key === 'Escape' && !palette.hidden) close();
    });
    palette.addEventListener('click', (e) => { if (e.target === palette) close(); });
    paletteInput.addEventListener('input', filter);
    palette.addEventListener('keydown', (e) => {
      const btns = Array.from(paletteList.querySelectorAll('button'));
      const idx = selected();
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!btns.length) return;
        const n = e.key === 'ArrowDown' ? (idx + 1) % btns.length : (idx - 1 + btns.length) % btns.length;
        selectIdx(n);
        btns[n].scrollIntoView({ block: 'nearest' });
      }
      if (e.key === 'Enter') {
        const it = filtered[Math.max(0, idx)];
        if (it) it.run();
      }
      if (e.key === 'Tab') {
        const focusables = [paletteInput, ...btns];
        const pos = focusables.indexOf(document.activeElement);
        const next = e.shiftKey ? (pos <= 0 ? focusables.length - 1 : pos - 1) : (pos === focusables.length - 1 ? 0 : pos + 1);
        e.preventDefault();
        focusables[next].focus();
      }
    });
  }

  const briefForm = document.getElementById('at-brief');
  if (briefForm && cfg.email) {
    const taskSel = document.getElementById('at-brief-task');
    const timeSel = document.getElementById('at-brief-time');
    const langBoxes = Array.from(briefForm.querySelectorAll('input[name="lang"]'));
    const out = document.getElementById('at-brief-out');
    const mail = document.getElementById('at-brief-mailto');
    const copyBtn = document.getElementById('at-brief-copy');
    const build = () => {
      const task = taskSel ? taskSel.value : '';
      const time = timeSel ? timeSel.value : '';
      const langs = langBoxes.filter((c) => c.checked).map((c) => c.value);
      const subject = `Project brief — ${task}`;
      const body = [
        `Task: ${task}`,
        `Timeline: ${time}`,
        `Language(s): ${langs.length ? langs.join(', ') : 'to be discussed'}`,
        '',
        'Context:',
        '',
      ].join('\n');
      if (mail) mail.href = `mailto:${cfg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (out) out.textContent = `Subject: ${subject}\n\n${body}`;
      return { subject, body };
    };
    [taskSel, timeSel, ...langBoxes].forEach((el) => el && el.addEventListener('change', build));
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const { subject, body } = build();
        const ok = await copyText(`${subject}\n\n${body}`);
        copyBtn.textContent = ok ? 'Copied' : 'Copy failed';
        setTimeout(() => (copyBtn.textContent = 'Copy brief'), 1600);
      });
    }
    build();
  }
})();
