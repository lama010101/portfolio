/* ============================================================
   LAURENT.PLAY — interactive engine
   cursor · confetti · tilt · magnetic · reveals · mini-game
   toasts · drag stickers · party mode
   ============================================================ */
(() => {
  'use strict';

  const cfg = window.SITE_CONFIG || {};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------------- toasts ---------------- */
  const toastHost = $('#toasts');
  function toast(html, ms = 3400) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = html;
    toastHost.appendChild(el);
    setTimeout(() => { el.classList.add('bye'); setTimeout(() => el.remove(), 350); }, ms);
  }

  /* ---------------- config-driven links ---------------- */
  const LINK_LABELS = {
    email: 'email address', linkedin: 'LinkedIn profile URL',
    gameUrl: 'live game URL', likedUrl: 'LIKED project URL', promptPulseUrl: 'PromptPulse project URL',
  };
  function resolveLink(key, subject) {
    const v = cfg[key];
    if (!v) return null;
    if (key === 'email') return `mailto:${v}?subject=${encodeURIComponent(subject || 'Hello from your portfolio')}`;
    return v;
  }
  $$('[data-link]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.link;
      const url = resolveLink(key, btn.dataset.subject);
      if (url) {
        if (url.startsWith('mailto:')) window.location.href = url;
        else window.open(url, '_blank', 'noopener');
        return;
      }
      const subject = btn.dataset.subject;
      if (key === 'email' && subject) {
        toast(`<b>Almost!</b> The email isn't set in <b>config.js</b> yet —<br>but I'd love to talk about: <b>${subject}</b>`);
      } else {
        toast(`<b>[[PLACEHOLDER]]</b> — the ${LINK_LABELS[key] || 'link'} isn't set in <b>config.js</b> yet. Ask me about it directly!`);
      }
      popConfetti(btn, 14);
    });
  });

  /* ---------------- confetti ---------------- */
  const canvas = $('#confetti');
  const ctx = canvas.getContext('2d');
  let parts = [];
  const COLORS = ['#FF4D8D', '#8B5CF6', '#38BDF8', '#FFD23F', '#A3E635', '#FF8A3D', '#17161F'];
  function sizeCanvas() { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.scale(devicePixelRatio, devicePixelRatio); }
  sizeCanvas();
  addEventListener('resize', sizeCanvas);

  function burst(x, y, n = 26, power = 9) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = power * (0.4 + Math.random() * 0.8);
      parts.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - power * 0.5,
        w: 5 + Math.random() * 7, h: 4 + Math.random() * 6,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        rot: Math.random() * Math.PI, vr: (Math.random() - .5) * 0.3,
        life: 60 + Math.random() * 40,
      });
    }
    if (parts.length && !running) requestAnimationFrame(tick);
  }
  function popConfetti(el, n = 22) {
    const r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, n);
  }
  let running = false;
  function tick() {
    running = true;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.life-- > 0 && p.y < innerHeight + 40);
    for (const p of parts) {
      p.vy += 0.28; p.x += p.vx; p.y += p.vy; p.vx *= 0.985; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.c; ctx.globalAlpha = Math.min(1, p.life / 30);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    }
    if (parts.length) requestAnimationFrame(tick);
    else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  // small celebration on any click (desktop, non-reduced)
  if (!reduced) {
    addEventListener('pointerdown', e => {
      if (e.target.closest('.game-opt')) return; // game has its own bigger burst
      burst(e.clientX, e.clientY, 8, 6);
    });
  }

  /* ---------------- data-shot image slots ---------------- */
  $$('[data-shot]').forEach(slot => {
    const key = slot.dataset.shot;
    if (cfg[key]) {
      const img = document.createElement('img');
      img.src = cfg[key];
      img.alt = key === 'portrait' ? 'Portrait of Laurent Martenot' : `${key} screenshot`;
      slot.innerHTML = '';
      slot.appendChild(img);
      slot.classList.add('has-img');
    }
  });

  /* ---------------- data-pop (extra click bounce) ---------------- */
  if (!reduced) {
    $$('[data-pop]').forEach(el => {
      el.addEventListener('click', () => {
        el.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(0.92)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }],
          { duration: 320, easing: 'cubic-bezier(.34,1.56,.64,1)' }
        );
      });
    });
  }

  /* ---------------- custom cursor ---------------- */
  if (finePointer && !reduced) {
    const dot = $('.cursor-dot'), ring = $('.cursor-ring');
    let mx = -100, my = -100, rx = -100, ry = -100;
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.documentElement.classList.add('cursor-on');
    const hoverables = 'a, button, .sticker, .tilt, input, textarea';
    addEventListener('pointerover', e => { if (e.target.closest(hoverables)) document.documentElement.classList.add('cursor-hover'); });
    addEventListener('pointerout', e => { if (e.target.closest(hoverables)) document.documentElement.classList.remove('cursor-hover'); });
  }

  /* ---------------- magnetic buttons ---------------- */
  if (finePointer && !reduced) {
    $$('[data-magnet]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------------- tilt cards ---------------- */
  if (finePointer && !reduced) {
    $$('.tilt').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------------- reveal on scroll ---------------- */
  const io = new IntersectionObserver(entries => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------------- XP bar ---------------- */
  const xpfill = $('#xpfill');
  addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    xpfill.style.width = `${Math.min(100, (scrollY / Math.max(1, max)) * 100)}%`;
  }, { passive: true });

  /* ---------------- hero word rotator ---------------- */
  const rot = $('#rotator');
  if (rot) {
    const words = JSON.parse(rot.dataset.words || '[]');
    let wi = 0, ci = words[0].length, del = false;
    (function type() {
      const word = words[wi];
      ci += del ? -1 : 1;
      rot.textContent = word.slice(0, ci);
      let wait = del ? 34 : 74;
      if (!del && ci === word.length) { wait = 1700; del = true; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; wait = 350; }
      setTimeout(type, wait);
    })();
  }

  /* ---------------- draggable stickers ---------------- */
  if (!reduced) {
    $$('[data-drag]').forEach(el => {
      let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;
      el.addEventListener('pointerdown', e => {
        dragging = true; sx = e.clientX; sy = e.clientY;
        el.setPointerCapture(e.pointerId);
        el.style.animation = 'none';
      });
      el.addEventListener('pointermove', e => {
        if (!dragging) return;
        el.style.translate = `${ox + e.clientX - sx}px, ${oy + e.clientY - sy}px`;
      });
      el.addEventListener('pointerup', e => {
        dragging = false; ox += e.clientX - sx; oy += e.clientY - sy;
      });
    });
  }

  /* ---------------- mobile menu ---------------- */
  const burger = $('#burger'), menu = $('#mobilemenu');
  function closeMenu() { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  burger.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('a', menu).forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) closeMenu(); });

  /* ---------------- mini-game: GUESS THE YEAR ---------------- */
  const QUESTIONS = [
    { q: 'Humans first walked on the Moon.', a: '1969', opts: ['1965', '1969', '1972', '1961'] },
    { q: 'The Berlin Wall fell.', a: '1989', opts: ['1987', '1991', '1989', '1985'] },
    { q: 'The very first website went live.', a: '1991', opts: ['1989', '1995', '1993', '1991'] },
    { q: 'The first iPhone was released.', a: '2007', opts: ['2005', '2007', '2009', '2008'] },
    { q: 'The first FIFA World Cup kicked off.', a: '1930', opts: ['1924', '1938', '1930', '1928'] },
  ];
  const RANKS = [
    { min: 5, rank: 'TIME LORD 🕰️', sub: 'Perfect run. BackToThePast wants your reflexes.' },
    { min: 4, rank: 'CHRONOLOGY CHAMP 🏆', sub: 'One off. Impressive temporal accuracy.' },
    { min: 3, rank: 'TIME TRAVELER IN TRAINING 🚀', sub: 'Solid instincts — the full game would suit you.' },
    { min: 0, rank: 'HISTORY ROOKIE 🐣', sub: 'Everyone starts somewhere. Play again!' },
  ];
  const stage = $('#gamestage'), qEl = $('#gameq'), optsEl = $('#gameopts'),
    dots = $('#gamedots'), scoreEl = $('#gamescore'), card = $('#gamecard'),
    resultEl = $('#gameresult'), startBtn = $('#gamestart');
  let qi = 0, score = 0, playing = false;

  function renderDots() {
    dots.innerHTML = QUESTIONS.map((_, i) => `<i class="${i < qi ? (dotState[i] ? 'done' : 'miss') : (i === qi && playing ? 'now' : '')}"></i>`).join('');
  }
  const dotState = [];

  function showQuestion() {
    const item = QUESTIONS[qi];
    qEl.textContent = item.q;
    scoreEl.textContent = `${score} / ${QUESTIONS.length}`;
    renderDots();
    optsEl.innerHTML = '';
    item.opts.forEach(y => {
      const b = document.createElement('button');
      b.className = 'game-opt'; b.textContent = y;
      b.addEventListener('click', () => answer(b, y, item.a));
      optsEl.appendChild(b);
    });
  }
  function answer(btn, chosen, correct) {
    $$('button', optsEl).forEach(b => { b.disabled = true; if (b.textContent === correct) b.classList.add('correct'); });
    const ok = chosen === correct;
    if (!ok) btn.classList.add('wrong');
    dotState[qi] = ok;
    if (ok) { score++; const r = btn.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 30, 10); }
    scoreEl.textContent = `${score} / ${QUESTIONS.length}`;
    renderDots();
    setTimeout(() => {
      qi++;
      if (qi < QUESTIONS.length) showQuestion();
      else finish();
    }, 950);
  }
  function finish() {
    playing = false;
    card.classList.remove('playing');
    stage.hidden = true;
    resultEl.hidden = false;
    const r = RANKS.find(r => score >= r.min);
    $('#gamerank').textContent = r.rank;
    $('#gamesub').textContent = `${r.sub} You scored ${score} / ${QUESTIONS.length}.`;
    if (score >= 4) { const c = card.getBoundingClientRect(); burst(c.left + c.width / 2, c.top + c.height / 2, 60, 12); }
  }
  function start() {
    qi = 0; score = 0; dotState.length = 0; playing = true;
    resultEl.hidden = true; stage.hidden = false;
    card.classList.add('playing');
    showQuestion();
  }
  if (startBtn) {
    startBtn.addEventListener('click', start);
    $('#gamereplay').addEventListener('click', start);
    renderDots();
  }

  /* ---------------- high five ---------------- */
  const EMOJI = ['👋', '🎉', '✨', '🙌', '💥', '⭐'];
  $('#highfive')?.addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    if (!reduced) for (let i = 0; i < 10; i++) {
      setTimeout(() => burst(r.left + Math.random() * r.width, r.top, 6, 8), i * 60);
    }
    toast('<b>High five received! 🙌</b> Now imagine what we could build together.');
  });

  /* ---------------- party mode (Konami) ---------------- */
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let ki = 0;
  addEventListener('keydown', e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    ki = (key === KONAMI[ki]) ? ki + 1 : (key === KONAMI[0] ? 1 : 0);
    if (ki === KONAMI.length) {
      ki = 0;
      const on = document.documentElement.classList.toggle('party');
      if (on) { toast('<b>PARTY MODE 🎉</b> You found the secret. Hire this energy.'); burst(innerWidth / 2, innerHeight / 3, 80, 13); }
    }
  });
  // logo clicks also trigger it (5 clicks)
  let clicks = 0, clickTimer;
  $('#logo')?.addEventListener('click', () => {
    clicks++; clearTimeout(clickTimer);
    clickTimer = setTimeout(() => clicks = 0, 1600);
    if (clicks >= 5) {
      clicks = 0;
      document.documentElement.classList.add('party');
      toast('<b>PARTY MODE 🎉</b> (click anywhere 5s later to keep working… just kidding, it stays fun)');
      burst(innerWidth / 2, innerHeight / 3, 80, 13);
    }
  });

  /* ---------------- misc ---------------- */
  $('#year').textContent = new Date().getFullYear();
})();
