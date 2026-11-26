/* Duet Studio — lightweight interaction layer. No dependencies, no network calls. */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal content only after it can be observed; content remains in the HTML without JS. */
  const revealItems = $$('.ds-reveal');
  if (revealItems.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((el) => el.classList.add('is-in'));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
      revealItems.forEach((el) => revealObserver.observe(el));
    }
  }

  /* Card spotlight: pointer-only enhancement, never required for content access. */
  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    $$('[data-spot]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
    });
  }

  /* Copy-to-clipboard helper for email checklists. */
  $$('[data-copy-target]').forEach((button) => {
    const original = button.textContent;
    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.copyTarget || '');
      const text = target ? target.textContent.trim() : '';
      let copied = false;
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        try { copied = document.execCommand('copy'); } catch { copied = false; }
        area.remove();
      }
      button.textContent = copied ? (button.dataset.copiedLabel || button.dataset.copyDoneLabel || original) : (button.dataset.failedLabel || original);
      window.setTimeout(() => { button.textContent = original; }, 2200);
    });
  });

  /* Generated counterpoint canvas: two independent lines resolving at controlled points. */
  function setupDuetCanvas(canvas) {
    const frame = canvas.closest('[data-score-frame]') || canvas.parentElement;
    const context = canvas.getContext('2d');
    if (!frame || !context) return;

    let width = 0;
    let height = 0;
    let ratio = 1;
    let time = 0;
    let raf = 0;
    let visible = false;
    let lastFrame = 0;
    let activeUntil = 0;
    const frameMs = 1000 / 30;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const centers = [0.24, 0.55, 0.84];

    function resize() {
      const rect = frame.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    }

    function path(points, color, widthPx) {
      context.beginPath();
      points.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      });
      context.strokeStyle = color;
      context.lineWidth = widthPx;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.stroke();
    }

    function pullTowardResolution(y, nx) {
      let next = y;
      centers.forEach((center) => {
        const distance = nx - center;
        const influence = Math.exp(-(distance * distance) / 0.006);
        next += (height * 0.5 - next) * influence * 0.82;
      });
      return next;
    }

    function drawStaff() {
      context.save();
      context.strokeStyle = 'rgba(247, 240, 228, 0.12)';
      context.lineWidth = 1;
      const rows = [0.27, 0.38, 0.49, 0.6, 0.71];
      rows.forEach((row) => {
        context.beginPath();
        context.moveTo(width * 0.06, height * row);
        context.lineTo(width * 0.94, height * row);
        context.stroke();
      });
      context.strokeStyle = 'rgba(247, 240, 228, 0.16)';
      centers.forEach((center) => {
        const x = width * center;
        context.beginPath();
        context.moveTo(x, height * 0.2);
        context.lineTo(x, height * 0.79);
        context.stroke();
      });
      context.restore();
    }

    function drawLabels() {
      const humanLineLabel = (frame.dataset.humanLineLabel || '').toUpperCase();
      const aiLineLabel = (frame.dataset.aiLineLabel || '').toUpperCase();
      const resolutionPointsLabel = (frame.dataset.resolutionPointsLabel || '').toUpperCase();
      context.save();
      context.font = '11px ui-monospace, Menlo, Consolas, monospace';
      context.textBaseline = 'middle';
      context.fillStyle = 'rgba(255, 140, 110, 0.9)';
      context.fillText(humanLineLabel, width * 0.07, height * 0.16);
      context.fillStyle = 'rgba(145, 164, 255, 0.92)';
      context.fillText(aiLineLabel, width * 0.24, height * 0.16);
      context.fillStyle = 'rgba(126, 217, 191, 0.86)';
      context.fillText(resolutionPointsLabel, width * 0.67, height * 0.16);
      context.restore();
    }

    function drawResolutionMarkers(humanPoints, aiPoints) {
      centers.forEach((center) => {
        const index = Math.round(center * (humanPoints.length - 1));
        const hx = humanPoints[index].x;
        const hy = (humanPoints[index].y + aiPoints[index].y) / 2;
        context.save();
        context.strokeStyle = 'rgba(126, 217, 191, 0.72)';
        context.lineWidth = 1.5;
        context.setLineDash([4, 5]);
        context.beginPath();
        context.moveTo(hx, height * 0.22);
        context.lineTo(hx, height * 0.8);
        context.stroke();
        context.setLineDash([]);
        context.fillStyle = '#f7f0e4';
        context.beginPath();
        context.arc(hx, hy, 4.5, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = '#58c7a9';
        context.lineWidth = 2;
        context.beginPath();
        context.arc(hx, hy, 9, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      });
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      drawStaff();
      drawLabels();

      const steps = Math.max(72, Math.floor(width / 8));
      const humanPoints = [];
      const aiPoints = [];
      const energy = reducedMotion ? 0.58 : 0.7 + pointer.y * 0.32;
      const drift = reducedMotion ? 0 : (pointer.x - 0.5) * 1.3;

      for (let index = 0; index <= steps; index += 1) {
        const nx = index / steps;
        const x = width * (0.055 + nx * 0.89);
        const waveTime = time + drift;
        let humanY = height * 0.5
          + Math.sin(nx * 7.2 + waveTime * 1.05) * height * 0.12 * energy
          + Math.sin(nx * 15.7 - waveTime * 0.55) * height * 0.032;
        let aiY = height * 0.5
          + Math.cos(nx * 6.4 - waveTime * 0.88) * height * 0.115 * energy
          + Math.sin(nx * 12.8 + waveTime * 0.62) * height * 0.045;
        humanY = pullTowardResolution(humanY, nx);
        aiY = pullTowardResolution(aiY, nx);
        humanPoints.push({ x, y: humanY });
        aiPoints.push({ x, y: aiY });
      }

      context.save();
      context.shadowColor = 'rgba(229, 84, 56, 0.45)';
      context.shadowBlur = 13;
      path(humanPoints, '#ff8c6e', 2.4);
      context.restore();

      context.save();
      context.shadowColor = 'rgba(71, 101, 255, 0.45)';
      context.shadowBlur = 13;
      path(aiPoints, '#91a4ff', 2.4);
      context.restore();

      drawResolutionMarkers(humanPoints, aiPoints);
    }

    function tick(now = 0) {
      raf = 0;
      if (!visible || reducedMotion) return;
      if (now - lastFrame >= frameMs) {
        const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 1 / 30;
        time += delta * 0.72;
        pointer.x += (pointer.tx - pointer.x) * 0.055;
        pointer.y += (pointer.ty - pointer.y) * 0.055;
        draw();
        lastFrame = now;
      }
      if (now < activeUntil) raf = window.requestAnimationFrame(tick);
    }

    function play(duration = 1200) {
      if (reducedMotion) return;
      activeUntil = Math.max(activeUntil, performance.now() + duration);
      if (visible && !raf) raf = window.requestAnimationFrame(tick);
    }

    if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
      frame.addEventListener('pointermove', (event) => {
        const rect = frame.getBoundingClientRect();
        pointer.tx = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        pointer.ty = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
        play(900);
      });
      frame.addEventListener('pointerleave', () => {
        pointer.tx = 0.5;
        pointer.ty = 0.5;
        play(700);
      });
    }

    if (!reducedMotion) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            visible = entry.isIntersecting;
            if (visible) play(1600);
            if (!visible && raf) {
              window.cancelAnimationFrame(raf);
              raf = 0;
            }
          });
        }, { threshold: 0.08 });
        observer.observe(frame);
      } else {
        visible = true;
        play(1600);
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    if (reducedMotion) draw();
  }

  $$('[data-duet-canvas]').forEach(setupDuetCanvas);
})();
