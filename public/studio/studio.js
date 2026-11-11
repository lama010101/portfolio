(() => {
  'use strict';

  const cfg = window.__STUDIO_CONFIG__ || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* =========================================================================
     1. TOAST HELPER
     ========================================================================= */
  const toastHost = $('#st-toasts');
  function showToast(message) {
    if (!toastHost) return;
    const el = document.createElement('div');
    el.className = 'st-toast';
    el.textContent = message;
    toastHost.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 3600);
  }

  /* =========================================================================
     2. WEB AUDIO HARMONIC MICRO-SYNTH (Zero external audio files)
     ========================================================================= */
  let audioCtx = null;
  let soundOn = false;
  const soundBtn = $('#st-sound-btn');
  const soundLabel = $('#st-sound-label');

  function ensureAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq = 523.25, duration = 0.11, type = 'triangle', gainPeak = 0.06, delay = 0) {
    if (!soundOn) return;
    ensureAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playChord(freqs, step = 0.055) {
    freqs.forEach((f, idx) => playTone(f, 0.18, 'triangle', 0.055, idx * step));
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundOn = !soundOn;
      soundBtn.setAttribute('aria-pressed', String(soundOn));
      if (soundLabel) soundLabel.textContent = soundOn ? 'Sound: ON' : 'Sound: OFF';
      if (soundOn) {
        playChord([523.25, 659.25, 783.99]);
      }
    });
  }

  /* =========================================================================
     3. LIVE PALETTE SYNTHESIZER (4 Chromatic Worlds)
     ========================================================================= */
  const THEME_PALETTES = {
    prism: ['#ff3366', '#2952ff', '#ffb000', '#00b884', '#7c3aed'],
    arcade: ['#ff3e9d', '#00e5ff', '#ffd000', '#00f5a0', '#b066ff'],
    bauhaus: ['#e63946', '#1d4ed8', '#f4a200', '#1f9d73', '#6d28d9'],
    sunset: ['#ef2356', '#ff7a00', '#009e83', '#4338ca', '#9d174d'],
  };
  let activeTheme = 'prism';

  function applyTheme(theme) {
    if (!THEME_PALETTES[theme]) return;
    activeTheme = theme;
    document.documentElement.setAttribute('data-studio-theme', theme);
    $$('[data-theme-pick]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.themePick === theme));
    });
    try {
      sessionStorage.setItem('studio_theme', theme);
    } catch (_) {
      /* sessionStorage optional */
    }
  }

  try {
    const saved = sessionStorage.getItem('studio_theme');
    if (saved && THEME_PALETTES[saved]) applyTheme(saved);
  } catch (_) {
    /* ignore */
  }

  $$('[data-theme-pick]').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.themePick);
      const notes = [523.25, 587.33, 659.25, 783.99];
      playTone(notes[idx % notes.length], 0.12);
    });
  });

  /* =========================================================================
     4. SCROLL RIBBON & MOBILE MENU
     ========================================================================= */
  const progressBar = $('#st-progress-bar');
  window.addEventListener(
    'scroll',
    () => {
      if (!progressBar) return;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
      progressBar.style.width = `${pct}%`;
    },
    { passive: true }
  );

  const menuBtn = $('#st-menu-btn');
  const mobileDrawer = $('#st-mobile-drawer');
  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener('click', () => {
      const open = mobileDrawer.hidden;
      mobileDrawer.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
      playTone(open ? 587.33 : 440, 0.08);
    });
    $$('a', mobileDrawer).forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================================================================
     5. HERO INTERACTIVE CONSTELLATION & SHOCKWAVE CANVAS
     ========================================================================= */
  const heroCanvas = $('#st-hero-canvas');
  const heroSection = $('#st-hero');
  if (heroCanvas && heroSection && !reducedMotion) {
    const ctx = heroCanvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = true;
    const pointer = { x: -999, y: -999 };
    const nodes = [];
    const ripples = [];

    function resize() {
      const rect = heroSection.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      heroCanvas.width = width * dpr;
      heroCanvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seedNodes() {
      nodes.length = 0;
      const count = Math.min(44, Math.max(20, Math.floor((width * height) / 18000)));
      const palette = THEME_PALETTES[activeTheme] || THEME_PALETTES.prism;
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          r: 2.5 + Math.random() * 3.5,
          colorIdx: i % palette.length,
        });
      }
    }

    resize();
    seedNodes();
    window.addEventListener('resize', () => {
      resize();
      seedNodes();
    });

    heroSection.addEventListener('pointermove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    });
    heroSection.addEventListener('pointerleave', () => {
      pointer.x = -999;
      pointer.y = -999;
    });
    heroSection.addEventListener('pointerdown', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const rx = e.clientX - rect.left;
      const ry = e.clientY - rect.top;
      ripples.push({ x: rx, y: ry, r: 6, alpha: 0.7 });
      for (const n of nodes) {
        const dx = n.x - rx;
        const dy = n.y - ry;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 180) {
          const force = ((180 - dist) / 180) * 2.6;
          n.vx += (dx / dist) * force;
          n.vy += (dy / dist) * force;
        }
      }
    });

    const obs = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    obs.observe(heroSection);

    function renderCanvas() {
      if (visible) {
        ctx.clearRect(0, 0, width, height);
        const palette = THEME_PALETTES[activeTheme] || THEME_PALETTES.prism;

        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const dxp = pointer.x - n.x;
          const dyp = pointer.y - n.y;
          const dp = Math.hypot(dxp, dyp);
          if (dp < 150 && dp > 1) {
            n.vx += (dxp / dp) * 0.035;
            n.vy += (dyp / dp) * 0.035;
          }
          n.vx *= 0.992;
          n.vy *= 0.992;
          const speed = Math.hypot(n.vx, n.vy);
          if (speed < 0.2) {
            n.vx += (Math.random() - 0.5) * 0.08;
            n.vy += (Math.random() - 0.5) * 0.08;
          }
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0) { n.x = 0; n.vx *= -1; }
          if (n.x > width) { n.x = width; n.vx *= -1; }
          if (n.y < 0) { n.y = 0; n.vy *= -1; }
          if (n.y > height) { n.y = height; n.vy *= -1; }

          for (let j = i + 1; j < nodes.length; j++) {
            const m = nodes[j];
            const dist = Math.hypot(n.x - m.x, n.y - m.y);
            if (dist < 125) {
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(m.x, m.y);
              ctx.strokeStyle = palette[n.colorIdx];
              ctx.globalAlpha = (1 - dist / 125) * 0.22;
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }
          }

          ctx.globalAlpha = 0.72;
          ctx.fillStyle = palette[n.colorIdx];
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }

        for (let r = ripples.length - 1; r >= 0; r--) {
          const rp = ripples[r];
          rp.r += 4.2;
          rp.alpha -= 0.018;
          if (rp.alpha <= 0) {
            ripples.splice(r, 1);
            continue;
          }
          ctx.globalAlpha = rp.alpha;
          ctx.strokeStyle = palette[0];
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(renderCanvas);
    }
    requestAnimationFrame(renderCanvas);
  }

  /* =========================================================================
     6. TYPEWRITER FOCUS TICKER
     ========================================================================= */
  const twEl = $('#st-typewriter');
  if (twEl && !reducedMotion) {
    const phrases = [
      'BackToThePast (Guess-History) multiplayer rounds',
      'Multilingual AI output evaluation in EN / FR / ES',
      'i18n quality gates shaped at Google and Apple',
      'Spec-driven AI agent orchestration from idea to ship',
    ];
    let pIdx = 0;
    let cIdx = phrases[0].length;
    let deleting = false;

    function tickTypewriter() {
      const phrase = phrases[pIdx];
      cIdx += deleting ? -1 : 1;
      twEl.textContent = phrase.slice(0, cIdx);
      let delay = deleting ? 26 : 52;
      if (!deleting && cIdx >= phrase.length) {
        deleting = true;
        delay = 1900;
      } else if (deleting && cIdx <= 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        delay = 320;
      }
      setTimeout(tickTypewriter, delay);
    }
    setTimeout(tickTypewriter, 1600);
  }

  /* =========================================================================
     7. 3D SPOTLIGHT TILT ON CARDS
     ========================================================================= */
  if (finePointer && !reducedMotion) {
    $$('.st-card-3d').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = ((y / r.height) - 0.5) * -5;
        const ry = ((x / r.width) - 0.5) * 5;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* =========================================================================
     8. LAB 1: AI DIRECTOR'S CONSOLE (8-Step Orchestration Simulator)
     ========================================================================= */
  const SCENARIOS = {
    bttp: {
      problem: 'Turn passive history trivia into a fast, competitive multiplayer guessing round.',
      spec: 'Clue card + hidden year/location + distance-based scoring curve + zero answer leaks in metadata.',
      flaw: 'Agent exposed the answer year ("1969") inside the image filename and alt attribute, letting players inspect the DOM to win.',
      fix: 'Laurent rejected the build, required opaque asset hashes, server/build-stripped captions, and verified fair scoring.',
      preview: {
        en: 'LIVE ROUND READY // Clue: "Eagle has landed on the Sea of Tranquility" | Asset ID: #9f4c2a (No year leaked) | Scoring: Distance curve active.',
        fr: 'MANCHE PRETE // Indice : "L\'Aigle s\'est pose sur la mer de la Tranquillite" | ID media : #9f4c2a (Sans fuite de date) | Score progressif actif.',
        es: 'RONDA LISTA // Pista: "El Aguila ha alunizado en el Mar de la Tranquilidad" | ID recurso: #9f4c2a (Sin filtrar el ano) | Puntuacion por distancia activa.',
      },
      naivePreview: {
        en: 'UNVERIFIED BUILD // <img src="/events/apollo_1969_answer.jpg" alt="1969 Moon Landing"> — Answer leaked in markup!',
        fr: 'BUILD NON VERIFIE // <img src="/events/apollo_1969_answer.jpg" alt="1969"> — Reponse visible dans le code !',
        es: 'BUILD SIN VERIFICAR // <img src="/events/apollo_1969_answer.jpg" alt="1969"> — Respuesta filtrada en el HTML!',
      },
    },
    i18n: {
      problem: 'Ensure AI-generated customer workflows sound native and unambiguous across English, French, and Spanish.',
      spec: 'Enforce locale-specific date formatting, consistent formal register, and ban literal English calques.',
      flaw: 'Agent produced casual "tu" in B2B French, literal calque "cela fait du sens", and ambiguous numeric date "03/04/2026".',
      fix: 'Laurent enforced "vous" register, idiomatic phrasing ("cela est pertinent"), and explicit ISO/spelled locale dates ("4 mars 2026").',
      preview: {
        en: 'VERIFIED EN OUTPUT // "Your evaluation report will be ready on 4 March 2026. This approach aligns with your quality targets."',
        fr: 'SORTIE FR VERIFIEE // "Votre rapport d\'evaluation sera pret le 4 mars 2026. Cette approche repond pleinement a vos exigences qualite."',
        es: 'SALIDA ES VERIFICADA // "Su informe de evaluacion estara listo el 4 de marzo de 2026. Este enfoque cumple con sus objetivos de calidad."',
      },
      naivePreview: {
        en: 'RAW LLM DRAFT // "Hey! Report ready 03/04/2026 (March 4 or April 3?). That makes sense for your targets."',
        fr: 'BROUILLON BRUT // "Salut ! Ton rapport est pret le 03/04/2026. Ca fait du sens pour tes objectifs."',
        es: 'BORRADOR SIN QA // "Hola! Tu reporte esta listo el 03/04/2026. Eso hace sentido para tus metas."',
      },
    },
    liked: {
      problem: 'People save links, books, places, and favorites across ten apps and never find them again.',
      spec: 'Clean personal interest collections with fast capture, clear categories, and zero-clutter retrieval.',
      flaw: 'Agent over-engineered a 14-field enterprise taxonomy form just to save a single favorite item.',
      fix: 'Laurent cut intake friction down to instant capture + lightweight collection tags focused on everyday usability.',
      preview: {
        en: 'VERIFIED UX SPEC // 1-tap Save -> Auto-grouped into [Books · Places · Ideas] -> Instant filter & personal notes.',
        fr: 'UX VERIFIEE // Ajout en 1 clic -> Classement clair [Livres · Lieux · Idees] -> Recherche instantanee et notes.',
        es: 'UX VERIFICADA // Guardado en 1 toque -> Colecciones claras [Libros · Lugares · Ideas] -> Filtro instantaneo.',
      },
      naivePreview: {
        en: 'OVER-ENGINEERED DRAFT // 14 mandatory metadata fields required before user can bookmark a single link.',
        fr: 'USINE A GAZ // 14 champs obligatoires avant de pouvoir enregistrer un seul favori.',
        es: 'EXCESO DE COMPLEJIDAD // 14 campos obligatorios antes de guardar un solo enlace favorito.',
      },
    },
  };

  let curScenario = 'bttp';
  let curLang = 'en';
  let curMode = 'naive';
  let simTimer = null;
  let simState = 'idle'; // 'idle' | 'running' | 'flaw' | 'verified'

  const pipeSteps = $$('#st-pipeline .st-pipe-step');
  const outBrief = $('#st-out-brief');
  const outSpec = $('#st-out-spec');
  const outPreview = $('#st-out-preview');
  const flawBanner = $('#st-flaw-banner');
  const flawText = $('#st-flaw-text');
  const verifiedBanner = $('#st-verified-banner');
  const verifiedText = $('#st-verified-text');
  const runSimBtn = $('#st-run-sim');
  const fixSimBtn = $('#st-fix-sim');

  function syncDirectorCopy() {
    const sc = SCENARIOS[curScenario];
    if (!sc) return;
    if (outBrief) outBrief.textContent = sc.problem;
    if (outSpec) outSpec.textContent = sc.spec;
    if (flawText) flawText.textContent = sc.flaw;
    if (verifiedText) verifiedText.textContent = sc.fix;
    if (outPreview) {
      if (simState === 'flaw') {
        outPreview.textContent = sc.naivePreview[curLang];
      } else if (simState === 'verified') {
        outPreview.textContent = sc.preview[curLang];
      } else {
        outPreview.textContent = 'Press "Run AI Build Loop" to watch how an idea moves from business problem to verified output.';
      }
    }
  }

  function resetPipelineVisuals() {
    if (simTimer) clearInterval(simTimer);
    pipeSteps.forEach((li) => {
      li.classList.remove('is-active', 'is-done', 'is-warn');
      const badge = $('.st-pipe-badge', li);
      if (badge) badge.textContent = 'Pending';
    });
    if (flawBanner) flawBanner.hidden = true;
    if (verifiedBanner) verifiedBanner.hidden = true;
  }

  function runSimulation() {
    resetPipelineVisuals();
    simState = 'running';
    syncDirectorCopy();
    let idx = 0;
    const stopAtFlaw = curMode === 'naive';

    simTimer = setInterval(() => {
      if (idx > 0 && pipeSteps[idx - 1]) {
        pipeSteps[idx - 1].classList.remove('is-active');
        pipeSteps[idx - 1].classList.add('is-done');
        const prevBadge = $('.st-pipe-badge', pipeSteps[idx - 1]);
        if (prevBadge) prevBadge.textContent = 'Done';
      }

      if (stopAtFlaw && idx === 5) {
        clearInterval(simTimer);
        const step6 = pipeSteps[5];
        if (step6) {
          step6.classList.add('is-warn');
          const b = $('.st-pipe-badge', step6);
          if (b) b.textContent = 'Issue Caught';
        }
        simState = 'flaw';
        if (flawBanner) flawBanner.hidden = false;
        syncDirectorCopy();
        playChord([392.0, 369.99]);
        return;
      }

      if (idx >= pipeSteps.length) {
        clearInterval(simTimer);
        simState = 'verified';
        if (verifiedBanner) verifiedBanner.hidden = false;
        syncDirectorCopy();
        playChord([523.25, 659.25, 783.99, 1046.5]);
        return;
      }

      const cur = pipeSteps[idx];
      if (cur) {
        cur.classList.add('is-active');
        const b = $('.st-pipe-badge', cur);
        if (b) b.textContent = 'Running';
      }
      playTone(440 + idx * 45, 0.07, 'sine', 0.04);
      idx += 1;
    }, reducedMotion ? 40 : 240);
  }

  function resolveFlaw() {
    if (flawBanner) flawBanner.hidden = true;
    [5, 6, 7].forEach((i) => {
      if (pipeSteps[i]) {
        pipeSteps[i].classList.remove('is-warn', 'is-active');
        pipeSteps[i].classList.add('is-done');
        const b = $('.st-pipe-badge', pipeSteps[i]);
        if (b) b.textContent = 'Verified';
      }
    });
    simState = 'verified';
    if (verifiedBanner) verifiedBanner.hidden = false;
    syncDirectorCopy();
    playChord([523.25, 659.25, 783.99, 1046.5]);
  }

  $$('[data-scenario]').forEach((btn) => {
    btn.addEventListener('click', () => {
      curScenario = btn.dataset.scenario;
      $$('[data-scenario]').forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
      resetPipelineVisuals();
      simState = 'idle';
      syncDirectorCopy();
      playTone(587.33, 0.09);
    });
  });

  $$('[data-sim-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      curLang = btn.dataset.simLang;
      $$('[data-sim-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      syncDirectorCopy();
      playTone(659.25, 0.08);
    });
  });

  $$('[data-sim-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      curMode = btn.dataset.simMode;
      $$('[data-sim-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      playTone(523.25, 0.08);
    });
  });

  if (runSimBtn) runSimBtn.addEventListener('click', runSimulation);
  if (fixSimBtn) fixSimBtn.addEventListener('click', resolveFlaw);
  syncDirectorCopy();

  /* =========================================================================
     9. LAB 2: MULTILINGUAL AI EVALUATION ARENA (EN / FR / ES)
     ========================================================================= */
  const QA_CASES = {
    fr: {
      context: 'French B2B SaaS onboarding assistant output — tap the underlined segments to inspect subtle AI issues:',
      segments: [
        { text: 'Bonjour, ' },
        {
          bugId: 'fr1',
          raw: 'tu peux retrouver ton bilan',
          fixed: 'vous pouvez consulter votre bilan',
          sev: 'Register',
          note: 'Inconsistent informal "tu" in enterprise French B2B context; requires consistent "vous".',
        },
        { text: ' des le ' },
        {
          bugId: 'fr2',
          raw: '03/04/2026',
          fixed: '4 mars 2026',
          sev: 'Locale Trap',
          note: 'US MM/DD/YYYY copied into French means 3 April to a French reader instead of 4 March.',
        },
        { text: '. Cette configuration ' },
        {
          bugId: 'fr3',
          raw: 'fait totalement du sens',
          fixed: 'est tout a fait pertinente',
          sev: 'Anglicism',
          note: 'Literal translation of "makes sense" ("faire du sens") reads as machine-translated French.',
        },
        { text: ' pour votre equipe.' },
      ],
    },
    es: {
      context: 'Spanish product release summary — tap the underlined segments to inspect localization & locale bugs:',
      segments: [
        { text: 'Estimado cliente, ' },
        {
          bugId: 'es1',
          raw: 'aplicamos para tu cuenta',
          fixed: 'hemos activado en su cuenta',
          sev: 'Tone + Calque',
          note: 'Mixes formal opening ("Estimado cliente") with casual "tu" and English calque "aplicar para".',
        },
        { text: ' un limite de ' },
        {
          bugId: 'es2',
          raw: '1,250.50 EUR',
          fixed: '1.250,50 EUR',
          sev: 'Number Locale',
          note: 'Wrong thousand/decimal separators for standard Spanish (ES) locale conventions.',
        },
        { text: ' disponible ' },
        {
          bugId: 'es3',
          raw: 'en una base diaria',
          fixed: 'a diario',
          sev: 'Idiom',
          note: 'Word-for-word translation of "on a daily basis" instead of natural Spanish "a diario".',
        },
        { text: '.' },
      ],
    },
    en: {
      context: 'English AI historical summary — tap the underlined segments to inspect guideline & factual issues:',
      segments: [
        { text: 'The World Wide Web became publicly available in ' },
        {
          bugId: 'en1',
          raw: 'August 1991 across 42 miljoen users',
          fixed: 'August 1991 as an open project',
          sev: 'Code-Switch + Fact',
          note: 'Token glitch ("miljoen") plus unverified early user count hallucinated by the model.',
        },
        { text: ', originally proposed at CERN ' },
        {
          bugId: 'en2',
          raw: 'in Geneva, Switzerland (citation: J. Hist. Net. 1990, p. 412)',
          fixed: 'by Tim Berners-Lee in 1989 (source verification required)',
          sev: 'Fake Citation',
          note: 'Classic fabricated journal volume/page citation requiring human provenance review.',
        },
        { text: ' — ' },
        {
          bugId: 'en3',
          raw: 'guaranteeing 100% factual accuracy forever',
          fixed: 'laying the foundation for hypertext publishing',
          sev: 'Overclaim',
          note: 'Promotional/absolutist claim violating neutral evaluation guidelines.',
        },
        { text: '.' },
      ],
    },
  };

  let curQaLang = 'fr';
  let qaShowFixed = false;
  const caughtBugs = new Set();

  const qaContextEl = $('#st-qa-context');
  const qaPassageEl = $('#st-qa-passage');
  const qaFindingsEl = $('#st-qa-findings');
  const qaScoreEl = $('#st-qa-score');
  const qaRevealBtn = $('#st-qa-reveal');
  const qaToggleFixBtn = $('#st-qa-toggle-fix');

  function renderQaArena() {
    const data = QA_CASES[curQaLang];
    if (!data || !qaPassageEl || !qaFindingsEl) return;
    if (qaContextEl) qaContextEl.textContent = data.context;

    qaPassageEl.innerHTML = '';
    const bugsInCase = [];

    data.segments.forEach((seg) => {
      if (!seg.bugId) {
        qaPassageEl.appendChild(document.createTextNode(seg.text));
        return;
      }
      bugsInCase.push(seg);
      const isCaught = caughtBugs.has(seg.bugId);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `st-bug-token${isCaught ? ' is-caught' : ''}`;
      btn.textContent = qaShowFixed && isCaught ? seg.fixed : seg.raw;
      btn.setAttribute('aria-pressed', String(isCaught));
      btn.addEventListener('click', () => {
        if (!caughtBugs.has(seg.bugId)) {
          caughtBugs.add(seg.bugId);
          playChord([587.33, 783.99]);
        } else {
          playTone(523.25, 0.07);
        }
        renderQaArena();
      });
      qaPassageEl.appendChild(btn);
    });

    const caughtCount = bugsInCase.filter((b) => caughtBugs.has(b.bugId)).length;
    if (qaScoreEl) {
      qaScoreEl.textContent = `Issues Caught: ${caughtCount} / ${bugsInCase.length}`;
    }

    qaFindingsEl.innerHTML = '';
    bugsInCase.forEach((b) => {
      const li = document.createElement('li');
      const revealed = caughtBugs.has(b.bugId);
      li.className = `st-qa-finding${revealed ? ' is-revealed' : ''}`;
      if (revealed) {
        const badge = document.createElement('span');
        badge.className = 'st-sev';
        badge.textContent = b.sev;
        const strong = document.createElement('strong');
        strong.textContent = `Fix: "${b.fixed}" — `;
        const note = document.createElement('span');
        note.textContent = b.note;
        li.append(badge, strong, note);
      } else {
        li.textContent = 'Hidden issue — click an underlined phrase in the sample to inspect it.';
      }
      qaFindingsEl.appendChild(li);
    });
  }

  $$('[data-qa-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      curQaLang = btn.dataset.qaLang;
      qaShowFixed = false;
      if (qaToggleFixBtn) qaToggleFixBtn.setAttribute('aria-pressed', 'false');
      $$('[data-qa-lang]').forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
      renderQaArena();
      playTone(587.33, 0.08);
    });
  });

  if (qaRevealBtn) {
    qaRevealBtn.addEventListener('click', () => {
      const data = QA_CASES[curQaLang];
      if (!data) return;
      data.segments.forEach((s) => {
        if (s.bugId) caughtBugs.add(s.bugId);
      });
      renderQaArena();
      playChord([523.25, 659.25, 783.99]);
    });
  }

  if (qaToggleFixBtn) {
    qaToggleFixBtn.addEventListener('click', () => {
      const data = QA_CASES[curQaLang];
      if (data) {
        data.segments.forEach((s) => {
          if (s.bugId) caughtBugs.add(s.bugId);
        });
      }
      qaShowFixed = !qaShowFixed;
      qaToggleFixBtn.setAttribute('aria-pressed', String(qaShowFixed));
      qaToggleFixBtn.textContent = qaShowFixed ? 'Showing Verified Text' : 'Apply Verified Fixes';
      renderQaArena();
      playTone(qaShowFixed ? 783.99 : 523.25, 0.1);
    });
  }
  renderQaArena();

  /* =========================================================================
     10. LAB 3: CHRONO-PIN TIMELINE SCRUBBER (BackToThePast Slice)
     ========================================================================= */
  const CHRONO_ROUNDS = [
    {
      era: 'Political Milestone · Europe',
      event: 'Storming of the Bastille in Paris, a defining flashpoint of the French Revolution.',
      year: 1789,
    },
    {
      era: 'Aviation · Kitty Hawk',
      event: 'Orville and Wilbur Wright achieve the first controlled, sustained powered airplane flight.',
      year: 1903,
    },
    {
      era: 'Global Sport · Montevideo',
      event: 'Uruguay hosts and wins the inaugural FIFA World Cup tournament.',
      year: 1930,
    },
    {
      era: 'Space Exploration · Apollo 11',
      event: 'First crewed lunar landing sets down on the Moon\'s Sea of Tranquility.',
      year: 1969,
    },
    {
      era: 'Digital Era · CERN',
      event: 'The World Wide Web project is made publicly available on the Internet.',
      year: 1991,
    },
  ];

  let chIdx = 0;
  let chScore = 0;
  let chLocked = false;
  const chHistory = [];

  const chDots = $('#st-chrono-dots');
  const chScoreEl = $('#st-chrono-score');
  const chEraEl = $('#st-chrono-era');
  const chEventEl = $('#st-chrono-event');
  const chSlider = $('#st-chrono-slider');
  const chYearBig = $('#st-chrono-year');
  const chLockBtn = $('#st-chrono-lock');
  const chNextBtn = $('#st-chrono-next');
  const chResetBtn = $('#st-chrono-reset');
  const chFeedback = $('#st-chrono-feedback');

  function renderChronoDots() {
    if (!chDots) return;
    chDots.innerHTML = '';
    CHRONO_ROUNDS.forEach((_, i) => {
      const dot = document.createElement('i');
      if (i < chHistory.length) {
        dot.className = chHistory[i] <= 12 ? 'is-hit' : 'is-far';
      } else if (i === chIdx) {
        dot.className = 'is-current';
      }
      chDots.appendChild(dot);
    });
  }

  function loadChronoRound() {
    const item = CHRONO_ROUNDS[chIdx];
    if (!item) return;
    chLocked = false;
    if (chEraEl) chEraEl.textContent = `Round ${chIdx + 1} of ${CHRONO_ROUNDS.length} · ${item.era}`;
    if (chEventEl) chEventEl.textContent = item.event;
    if (chSlider) {
      chSlider.disabled = false;
      chSlider.value = '1900';
    }
    if (chYearBig) chYearBig.textContent = '1900';
    if (chFeedback) chFeedback.hidden = true;
    if (chLockBtn) chLockBtn.hidden = false;
    if (chNextBtn) chNextBtn.hidden = true;
    if (chResetBtn) chResetBtn.hidden = true;
    if (chScoreEl) chScoreEl.textContent = `Score: ${chScore} / ${CHRONO_ROUNDS.length * 1000}`;
    renderChronoDots();
  }

  if (chSlider && chYearBig) {
    chSlider.addEventListener('input', () => {
      chYearBig.textContent = chSlider.value;
    });
  }

  $$('[data-year-step]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!chSlider || chLocked) return;
      const delta = Number(btn.dataset.yearStep || 0);
      const next = Math.min(2020, Math.max(1750, Number(chSlider.value) + delta));
      chSlider.value = String(next);
      if (chYearBig) chYearBig.textContent = String(next);
      playTone(delta > 0 ? 587.33 : 493.88, 0.05, 'sine', 0.035);
    });
  });

  if (chLockBtn) {
    chLockBtn.addEventListener('click', () => {
      if (chLocked || !chSlider) return;
      chLocked = true;
      chSlider.disabled = true;
      const guess = Number(chSlider.value);
      const actual = CHRONO_ROUNDS[chIdx].year;
      const diff = Math.abs(guess - actual);
      const pts = diff === 0 ? 1000 : Math.max(0, Math.round(1000 - diff * 15));
      chScore += pts;
      chHistory.push(diff);
      renderChronoDots();
      if (chScoreEl) chScoreEl.textContent = `Score: ${chScore} / ${CHRONO_ROUNDS.length * 1000}`;

      if (chFeedback) {
        chFeedback.hidden = false;
        const verdict =
          diff === 0
            ? 'Exact year bullseye!'
            : diff <= 5
            ? `Razor close — only ${diff} year${diff === 1 ? '' : 's'} off!`
            : diff <= 20
            ? `Solid instinct — ${diff} years from ${actual}.`
            : `${diff} years away — the exact year was ${actual}.`;
        chFeedback.textContent = `${verdict} True year: ${actual} · +${pts} pts.`;
      }

      if (diff <= 10) playChord([523.25, 659.25, 783.99]);
      else playTone(392.0, 0.14);

      chLockBtn.hidden = true;
      if (chIdx < CHRONO_ROUNDS.length - 1) {
        if (chNextBtn) chNextBtn.hidden = false;
      } else {
        if (chFeedback) {
          const pct = Math.round((chScore / (CHRONO_ROUNDS.length * 1000)) * 100);
          chFeedback.textContent += ` Final Run Complete: ${chScore} / 5000 (${pct}% temporal precision).`;
        }
        if (chResetBtn) chResetBtn.hidden = false;
      }
    });
  }

  if (chNextBtn) {
    chNextBtn.addEventListener('click', () => {
      chIdx += 1;
      loadChronoRound();
      playTone(523.25, 0.08);
    });
  }

  if (chResetBtn) {
    chResetBtn.addEventListener('click', () => {
      chIdx = 0;
      chScore = 0;
      chHistory.length = 0;
      loadChronoRound();
      playChord([523.25, 659.25]);
    });
  }
  loadChronoRound();

  /* =========================================================================
     11. PROJECT DECK FILTER
     ========================================================================= */
  $$('[data-proj-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.projFilter;
      $$('[data-proj-filter]').forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
      $$('[data-proj-cat]').forEach((card) => {
        card.hidden = cat !== 'all' && card.dataset.projCat !== cat;
      });
      playTone(523.25, 0.08);
    });
  });

  /* =========================================================================
     12. MISSION COMPOSER (HIRE ME / PARTNER BRIEF BUILDER)
     ========================================================================= */
  const missionBtns = $$('[data-mission]');
  const noteInput = $('#st-brief-note');
  const briefPreview = $('#st-brief-preview');
  const sendBriefBtn = $('#st-send-brief');
  const copyBriefBtn = $('#st-copy-brief');

  function buildBriefText() {
    const picked = missionBtns
      .filter((b) => b.getAttribute('aria-pressed') === 'true')
      .map((b) => b.dataset.mission);
    const topics = picked.length ? picked : ['General AI product / evaluation inquiry'];
    const note = noteInput && noteInput.value.trim() ? noteInput.value.trim() : '(Add optional project context above)';
    const subject = `Inquiry: ${topics[0]}${topics.length > 1 ? ` + ${topics.length - 1} more` : ''}`;
    const body = [
      'Hello Laurent,',
      '',
      'I would like to discuss:',
      ...topics.map((t) => `- ${t}`),
      '',
      `Context: ${note}`,
    ].join('\n');
    return { subject, body };
  }

  function updateBriefUI() {
    if (!briefPreview) return;
    const { subject, body } = buildBriefText();
    briefPreview.textContent = `Subject: ${subject}\n\n${body}`;
  }

  missionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(next));
      const check = $('.st-mission-check', btn);
      if (check) check.textContent = next ? '✓' : '+';
      updateBriefUI();
      playTone(next ? 659.25 : 493.88, 0.08);
    });
  });

  if (noteInput) {
    noteInput.addEventListener('input', updateBriefUI);
  }
  updateBriefUI();

  if (sendBriefBtn) {
    sendBriefBtn.addEventListener('click', () => {
      const { subject, body } = buildBriefText();
      if (cfg.email) {
        window.location.href = `mailto:${cfg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      } else {
        showToast('Email is marked [[PLACEHOLDER]] in src/config.ts — use "Copy Brief" or set config.email to go live.');
        playTone(440, 0.12);
      }
    });
  }

  if (copyBriefBtn) {
    copyBriefBtn.addEventListener('click', async () => {
      const { subject, body } = buildBriefText();
      const full = `Subject: ${subject}\n\n${body}`;
      try {
        await navigator.clipboard.writeText(full);
        showToast('Project brief copied to clipboard.');
        playChord([523.25, 659.25, 783.99]);
      } catch (_) {
        showToast('Select the preview box text to copy manually.');
      }
    });
  }

  /* =========================================================================
     13. CONFIG-DRIVEN ACTION BUTTONS & LIVE DUAL CLOCK
     ========================================================================= */
  $$('[data-cfg-link]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.cfgLink;
      const val = cfg[key];
      if (val) {
        if (key === 'email') {
          const subj = btn.dataset.subject || 'Hello from your Studio portfolio';
          window.location.href = `mailto:${val}?subject=${encodeURIComponent(subj)}`;
        } else {
          window.open(val, '_blank', 'noopener,noreferrer');
        }
      } else {
        showToast(`[[PLACEHOLDER]]: "${key}" is not set in src/config.ts yet.`);
        playTone(440, 0.1);
      }
    });
  });

  const thClock = $('#st-clock-th');
  const localClock = $('#st-clock-local');
  function updateClocks() {
    const now = new Date();
    try {
      if (thClock) {
        thClock.textContent = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Bangkok',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now) + ' ICT (UTC+7)';
      }
      if (localClock) {
        localClock.textContent = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now);
      }
    } catch (_) {
      /* ignore Intl fallback */
    }
  }
  updateClocks();
  setInterval(updateClocks, 1000);
})();
