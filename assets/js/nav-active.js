(() => {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // Find all menu links
  document.querySelectorAll('.menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (!href) return;

    // Match the current page
    if (href === path) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    } else {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    }
  });
})();