// Qalam Consulting — Header interactions (Desktop unchanged, Mobile redesigned)
(function () {
  const root = document.querySelector('.new-header-embed');
  if (!root) return;

  const hamburger = root.querySelector('.hamburger-menu');
  const overlay = root.querySelector('.menu-overlay');
  const closeBtns = root.querySelectorAll('[data-action="close"]');
  const mainNav = root.querySelector('.main-navigation');
  const servicesTrigger = root.querySelector('.services-trigger');
  const backBtn = root.querySelector('.menu-back-btn'); // (not used; legacy-safe)
  const dropdown = root.querySelector('.dropdown');

  const mqlMobile = window.matchMedia('(max-width: 991px)');
  const mqlCoarse = window.matchMedia('(pointer: coarse)'); // touch-capable

  const isMobile = () => mqlMobile.matches;
  const isCoarse = () => mqlCoarse.matches;

  /* -------------------- Drawer open/close -------------------- */
  function openMenu(e) {
    if (e) e.preventDefault();
    root.classList.add('menu-open');
    document.body.classList.add('no-scroll');
    hamburger?.setAttribute('aria-expanded', 'true');
  }
  function closeMenu(e) {
    if (e) e.preventDefault();
    root.classList.remove('menu-open');
    document.body.classList.remove('no-scroll');
    mainNav.classList.remove('submenu-is-active'); // legacy safety
    hamburger?.setAttribute('aria-expanded', 'false');
  }

  /* -------------------- Mobile accordion -------------------- */
  function toggleAccordion(btn) {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const panelId = btn.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    // Close others
    root.querySelectorAll('.accordion-trigger[aria-expanded="true"]').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        const pid = other.getAttribute('aria-controls');
        const pnl = pid ? document.getElementById(pid) : null;
        if (pnl) pnl.hidden = true;
      }
    });

    // Toggle current
    btn.setAttribute('aria-expanded', (!expanded).toString());
    panel.hidden = expanded;
  }

  function setupAccordion() {
    const triggers = root.querySelectorAll('.accordion-trigger');
    triggers.forEach(btn => {
      btn.addEventListener('click', () => toggleAccordion(btn));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAccordion(btn); }
      });
    });
  }

  /* -------------------- Services trigger behavior -------------------- */
  // On mobile, tapping "Our Services" opens the first accordion and scrolls to it
  function onServicesMobile(e) {
    if (!isMobile()) return;
    e.preventDefault();
    const first = root.querySelector('.accordion-trigger');
    if (first && first.getAttribute('aria-expanded') !== 'true') {
      toggleAccordion(first);
    }
    const acc = root.querySelector('.mobile-services-accordion');
    acc?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // On touch-desktop (≥992px), allow tap-to-open mega menu (no hover)
  function onServicesTapDesktop(e) {
    if (isMobile()) return;
    if (!isCoarse()) return;
    e.preventDefault();
    dropdown.classList.toggle('is-open');
    servicesTrigger?.setAttribute('aria-expanded', dropdown.classList.contains('is-open') ? 'true' : 'false');
  }
  function onDocumentClick(e) {
    if (dropdown?.classList.contains('is-open') && !dropdown.contains(e.target)) {
      dropdown.classList.remove('is-open');
      servicesTrigger?.setAttribute('aria-expanded', 'false');
    }
  }

  /* -------------------- Active link -------------------- */
  function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = root.querySelectorAll('.main-navigation > ul > li > a');

    // Include both desktop and mobile service page filenames so "Our Services" gets marked
    const servicePages = [
      'Services.html',
      'Strategy-Consulting.html', 'Financial-Advisory.html', 'Startup-Advisory.html',
      'Business-Resiliency.html', 'Market-Research.html', 'Reports.html',
      'Deep-Dives.html', 'Startup-Advice.html', 'News.html',
      // desktop variants left unchanged:
      'Strategy.html', 'Marketing.html', 'Research.html'
    ];

    navLinks.forEach(link => {
      const linkHref = (link.getAttribute('href') || '').split('/').pop();
      link.classList.remove('is-active');

      // Direct match
      if (linkHref.toLowerCase() === currentPage.toLowerCase()) {
        link.classList.add('is-active');
        return;
      }
      // Home variations
      if ((/^(index|home)\.html$/i).test(linkHref) && (/^(index|home)\.html$/i).test(currentPage)) {
        link.classList.add('is-active');
        return;
      }
      // Services group (marks the "Our Services" top link active)
      if (link.classList.contains('services-trigger') &&
          servicePages.some(p => p.toLowerCase() === currentPage.toLowerCase())) {
        link.classList.add('is-active');
        return;
      }
    });
  }

  /* -------------------- Desktop "white parting line" animation on load -------------------- */
  function animateActiveUnderlineOnLoad() {
    const isDesktop = window.matchMedia('(min-width: 992px)').matches;
    if (!isDesktop) return;

    // 1) Force the active underline to width:0
    root.classList.add('pre-animate');

    // 2) Next two frames: swap to animate-in so it grows to 100%
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('pre-animate');
        root.classList.add('animate-in');
      });
    });
  }

  /* -------------------- Events -------------------- */
  hamburger?.addEventListener('click', openMenu);
  overlay?.addEventListener('click', closeMenu);
  closeBtns.forEach(btn => btn.addEventListener('click', closeMenu));

  servicesTrigger?.addEventListener('click', onServicesMobile);
  servicesTrigger?.addEventListener('click', onServicesTapDesktop);
  servicesTrigger?.addEventListener('touchstart', onServicesTapDesktop, { passive: false });

  document.addEventListener('click', onDocumentClick);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (root.classList.contains('menu-open')) closeMenu(e);
      dropdown?.classList.remove('is-open');
      servicesTrigger?.setAttribute('aria-expanded', 'false');
    }
  });

  function resetStates() {
    dropdown?.classList.remove('is-open');
    servicesTrigger?.setAttribute('aria-expanded', 'false');
    if (!isMobile()) {
      closeMenu();
    }
  }
  mqlMobile.addEventListener('change', resetStates);
  mqlCoarse.addEventListener('change', resetStates);

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupAccordion();
      setActiveLink();
      animateActiveUnderlineOnLoad();
    });
  } else {
    setupAccordion();
    setActiveLink();
    animateActiveUnderlineOnLoad();
  }
})();
