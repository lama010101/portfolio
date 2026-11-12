(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const progress = $('[data-reading-progress]');
  const updateProgress = () => {
    if (!progress) return;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const menuButton = $('[data-menu-toggle]');
  const mobileNav = $('[data-mobile-nav]');
  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    mobileNav?.setAttribute('hidden', '');
  };
  menuButton?.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    if (opening) mobileNav?.removeAttribute('hidden');
    else closeMenu();
  });
  $$('a', mobileNav || document.createElement('div')).forEach((link) => link.addEventListener('click', closeMenu));

  const command = $('#command-menu');
  const commandInput = $('#command-filter');
  const commandLinks = $$('[data-command-link]');
  const openCommand = () => {
    if (!command || command.open) return;
    command.showModal();
    commandInput?.focus();
  };
  $$('[data-command-open]').forEach((button) => button.addEventListener('click', openCommand));
  $('[data-command-close]')?.addEventListener('click', () => command?.close());
  command?.addEventListener('click', (event) => {
    if (event.target === command) command.close();
  });
  commandInput?.addEventListener('input', () => {
    const query = commandInput.value.trim().toLowerCase();
    commandLinks.forEach((link) => {
      link.hidden = !link.textContent.toLowerCase().includes(query);
    });
  });
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (command?.open) command.close();
      else openCommand();
    }
  });

  const lensData = {
    employers: {
      number: '01',
      eyebrow: 'For employers & clients',
      title: 'Turn a business need into a useful, evaluated product.',
      text: 'Multilingual AI evaluation, localization quality and hands-on product direction — grounded in commercial thinking.',
      label: 'See how I can help',
      href: '/direction/hire/',
    },
    partners: {
      number: '02',
      eyebrow: 'For data & history partners',
      title: 'Make historical knowledge interactive — and measurable.',
      text: 'Explore partnerships around BackToThePast, sourced historical data, education and AI evaluation.',
      label: 'Explore the partnership',
      href: '/direction/backtothepast/#partner',
    },
    visitors: {
      number: '03',
      eyebrow: 'For the curious',
      title: 'Follow an idea from first brief to working product.',
      text: 'See the product decisions, AI direction and evaluation loop behind the work — without the usual AI theatre.',
      label: 'Explore selected work',
      href: '#selected-work',
    },
  };
  const lensButtons = $$('[data-lens]');
  lensButtons.forEach((button) => button.addEventListener('click', () => {
    const data = lensData[button.dataset.lens];
    if (!data) return;
    lensButtons.forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    $('#lens-number').textContent = data.number;
    $('#lens-eyebrow').textContent = data.eyebrow;
    $('#lens-title').textContent = data.title;
    $('#lens-text').textContent = data.text;
    $('#lens-panel')?.setAttribute('aria-labelledby', button.id);
    const link = $('#lens-link');
    link.textContent = `${data.label} ↗`;
    link.href = data.href;
  }));

  const methodData = [
    ['Business problem', 'Start with the opportunity, not the technology.', 'Identify a real problem or opportunity. Clarify who it matters to and what a useful outcome looks like.'],
    ['Product definition', 'Give the idea a precise shape.', 'Define the business objective, explore solutions with AI and translate the chosen direction into clear requirements.'],
    ['AI orchestration', 'Direction is the differentiator.', 'Break the work into instructions, provide context and constraints, and direct AI coding agents through implementation.'],
    ['Implementation', 'Turn the brief into something testable.', 'Coordinate AI-assisted implementation around the product decisions, rather than accepting the first plausible output.'],
    ['Validation', 'Evaluate the result, not the promise.', 'Test against the objective. Challenge errors, inconsistencies, weak language and mismatches with the intended experience.'],
    ['Iteration', 'Repeat until the objective is met.', 'Feed findings back into precise instructions, refine the product and continue the evaluation loop.'],
  ];
  const methodButtons = $$('[data-method-step]');
  methodButtons.forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.methodStep);
    const data = methodData[index];
    if (!data) return;
    methodButtons.forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    $('#method-count').textContent = `${String(index + 1).padStart(2, '0')} / 06`;
    $('#method-title').textContent = data[0];
    $('#method-subtitle').textContent = data[1];
    $('#method-description').textContent = data[2];
    $('#method-panel')?.setAttribute('aria-labelledby', button.id);
  }));

  if (!reducedMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('d-motion-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    $$('[data-reveal]').forEach((element) => observer.observe(element));
  }

  $$('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
    const target = $(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', link.getAttribute('href'));
  }));
})();
