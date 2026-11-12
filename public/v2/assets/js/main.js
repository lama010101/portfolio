/* ==========================================================================
   LAURENT MARTENOT — PORTFOLIO V2
   Vanilla JS: config/placeholders, nav, reveals, stepper, forms.
   No dependencies, no build step.
   ========================================================================== */
(function () {
  'use strict';

  var cfg = (window.SITE_CONFIG || {});
  var PH_RE = /^\[\[PLACEHOLDER:/;
  var isPH = function (v) { return !v || PH_RE.test(String(v)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ------------------------------------------------------------------ *
   *  Placeholder engine
   *  - [data-cfg="key"]            → textContent = config value
   *  - [data-cfg-link="key"]       → <a href> or marked placeholder
   *  - [data-mailto="Subject"]     → mailto link or marked placeholder
   * ------------------------------------------------------------------ */
  function phLabel(v) {
    return String(v).replace(/^\[\[PLACEHOLDER:\s*/, '').replace(/\]\]$/, '');
  }

  function renderPH(el, description) {
    el.classList.add('ph');
    el.textContent = '[[PLACEHOLDER: ' + description + ']]';
    el.removeAttribute('href');
  }

  function initConfig() {
    document.querySelectorAll('[data-cfg]').forEach(function (el) {
      var key = el.getAttribute('data-cfg');
      var val = cfg[key];
      el.textContent = isPH(val) ? '[[PLACEHOLDER: ' + phLabel(val) + ']]' : val;
      if (isPH(val)) el.classList.add('ph');
    });

    document.querySelectorAll('[data-cfg-link]').forEach(function (el) {
      var key = el.getAttribute('data-cfg-link');
      var val = cfg[key];
      if (isPH(val)) {
        var d;
        if (el.classList.contains('btn')) {
          // Keep button-shaped but visibly marked as a placeholder.
          d = document.createElement('span');
          d.className = el.className + ' ph-btn';
          d.textContent = '[[PLACEHOLDER: ' + phLabel(val) + ']]';
        } else {
          d = document.createElement('span');
          d.className = 'ph';
          d.textContent = '[[PLACEHOLDER: ' + phLabel(val) + ']]';
        }
        el.replaceWith(d);
      } else {
        el.setAttribute('href', val);
        el.removeAttribute('data-cfg-link');
      }
    });

    // Optional links: removed entirely while the config value is a placeholder.
    document.querySelectorAll('[data-cfg-optional]').forEach(function (el) {
      var key = el.getAttribute('data-cfg-optional');
      var val = cfg[key];
      if (isPH(val)) { el.remove(); return; }
      el.setAttribute('href', val);
      el.removeAttribute('data-cfg-optional');
    });

    document.querySelectorAll('[data-mailto]').forEach(function (el) {
      var subject = el.getAttribute('data-mailto') || 'Hello from your portfolio';
      if (isPH(cfg.email)) {
        var d = document.createElement('span');
        d.className = 'ph';
        d.textContent = '[[PLACEHOLDER: email address]]';
        el.replaceWith(d);
      } else {
        el.setAttribute('href', 'mailto:' + cfg.email + '?subject=' + encodeURIComponent(subject));
        el.removeAttribute('data-mailto');
      }
    });

    // Canonical + og:url only when a real siteUrl is configured.
    if (!isPH(cfg.siteUrl) && cfg.siteUrl) {
      var canon = document.querySelector('link[rel="canonical"]');
      if (canon) canon.setAttribute('href', cfg.siteUrl.replace(/\/$/, '') + location.pathname);
      var ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', cfg.siteUrl.replace(/\/$/, '') + location.pathname);
    }
  }

  /* ------------------------------------------------------------------ *
   *  Header state + scroll progress
   * ------------------------------------------------------------------ */
  function initHeader() {
    var header = document.querySelector('.site-header');
    var bar = document.querySelector('.progress-bar');
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('scrolled', y > 24);
      if (bar && !reduceMotion) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   *  Mobile menu
   * ------------------------------------------------------------------ */
  function initMobileMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;

    var links = menu.querySelectorAll('a');
    function setMenu(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      // stagger links
      links.forEach(function (a, i) {
        a.style.transitionDelay = open ? (120 + i * 55) + 'ms' : '0ms';
      });
    }
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    links.forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  /* ------------------------------------------------------------------ *
   *  Scroll reveals
   * ------------------------------------------------------------------ */
  function initReveals() {
    var els = document.querySelectorAll('[data-rv], [data-rv-group]');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   *  Magnetic buttons (desktop, fine pointer, motion allowed)
   * ------------------------------------------------------------------ */
  function initMagnetic() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll('.btn').forEach(function (btn) {
      var strength = 0.28;
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width / 2);
        var y = e.clientY - (r.top + r.height / 2);
        btn.style.transform = 'translate(' + (x * strength) + 'px,' + (y * strength) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------ *
   *  Animated counters
   * ------------------------------------------------------------------ */
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1400;
      var start = null;
      function tick(t) {
        if (!start) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      if (reduceMotion) { el.textContent = target + suffix; return; }
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   *  Accordion
   * ------------------------------------------------------------------ */
  function initAccordion() {
    document.querySelectorAll('.acc').forEach(function (acc) {
      var btns = acc.querySelectorAll('.acc-btn');
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('.acc-item');
          var open = item.classList.contains('open');
          // close siblings (accordion behaviour)
          acc.querySelectorAll('.acc-item.open').forEach(function (o) {
            o.classList.remove('open');
            o.querySelector('.acc-btn').setAttribute('aria-expanded', 'false');
          });
          if (!open) {
            item.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------ *
   *  Pipeline stepper (How I work)
   * ------------------------------------------------------------------ */
  function initStepper() {
    var list = document.querySelector('[data-stepper]');
    var panel = document.querySelector('[data-stepper-panel]');
    if (!list || !panel) return;
    var btns = Array.prototype.slice.call(list.querySelectorAll('.stage-btn'));
    if (!btns.length) return;

    var stages = btns.map(function (b) {
      return {
        kicker: b.getAttribute('data-kicker') || '',
        title: b.getAttribute('data-title') || '',
        desc: b.getAttribute('data-desc') || '',
        output: b.getAttribute('data-output') || ''
      };
    });

    var current = 0;

    function render(i) {
      current = i;
      var s = stages[i];
      btns.forEach(function (b, j) {
        var active = j === i;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', String(active));
      });
      panel.innerHTML =
        '<div class="sp-kicker">Stage ' + String(i + 1).padStart(2, '0') + ' / ' + String(stages.length).padStart(2, '0') + ' — ' + escapeHTML(s.kicker) + '</div>' +
        '<h3>' + escapeHTML(s.title) + '</h3>' +
        '<p class="sp-desc">' + escapeHTML(s.desc) + '</p>' +
        '<div class="sp-out"><strong>Output</strong>' + escapeHTML(s.output) + '</div>';
      panel.classList.remove('fade');
      void panel.offsetWidth;
      panel.classList.add('fade');
    }
    function escapeHTML(str) {
      return String(str).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { render(i); });
    });
    list.addEventListener('keydown', function (e) {
      var idx = btns.indexOf(document.activeElement);
      if (idx === -1) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); btns[(idx + 1) % btns.length].focus(); btns[(idx + 1) % btns.length].click(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); var p = (idx - 1 + btns.length) % btns.length; btns[p].focus(); btns[p].click(); }
    });
    render(0);
  }

  /* ------------------------------------------------------------------ *
   *  Copy buttons (prompt cards)
   * ------------------------------------------------------------------ */
  function initCopy() {
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.closest('.prompt-card');
        var text = target ? target.querySelector('pre') : null;
        if (!text) return;
        var done = function () {
          var old = btn.textContent;
          btn.textContent = 'Copied';
          setTimeout(function () { btn.textContent = old; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text.textContent).then(done, done);
        } else {
          var ta = document.createElement('textarea');
          ta.value = text.textContent;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (e) {}
          document.body.removeChild(ta);
          done();
        }
      });
    });
  }

  /* ------------------------------------------------------------------ *
   *  Dynamic year
   * ------------------------------------------------------------------ */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ------------------------------------------------------------------ *
   *  Optional contact form (only when config.formEndpoint is set)
   * ------------------------------------------------------------------ */
  function initForm() {
    var mount = document.querySelector('[data-contact-form]');
    if (!mount || isPH(cfg.formEndpoint) || !cfg.formEndpoint) return;

    var emailPH = isPH(cfg.email);
    mount.innerHTML =
      '<div class="divider-label">Or send a message</div>' +
      '<form class="contact-form" action="' + cfg.formEndpoint + '" method="POST" novalidate>' +
      '  <div class="cf-grid">' +
      '    <label class="cf-field"><span>Name</span><input type="text" name="name" required autocomplete="name"></label>' +
      '    <label class="cf-field"><span>Email</span><input type="email" name="email" required autocomplete="email"></label>' +
      '  </div>' +
      '  <label class="cf-field"><span>What do you need?</span><textarea name="message" rows="5" required></textarea></label>' +
      '  <input type="text" name="_gotcha" class="cf-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '  <button type="submit" class="btn btn-ink">Send message <span class="arr">→</span></button>' +
      '</form>';
    mount.hidden = false;
  }

  /* ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initConfig();
    initHeader();
    initMobileMenu();
    initReveals();
    initMagnetic();
    initCounters();
    initAccordion();
    initStepper();
    initCopy();
    initYear();
    initForm();
  });
})();
