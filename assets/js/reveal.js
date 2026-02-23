(() => {
  const root = document.getElementById('servicesReveal');
  if (!root) return;

  const buttons = Array.from(root.querySelectorAll('button.reveal-btn'));
  const panelTitle = root.querySelector('.reveal-title');
  const panelBody = root.querySelector('.reveal-body');

  if (!buttons.length || !panelTitle || !panelBody) return;

  const setActive = (btn) => {
    buttons.forEach(b => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
    panelTitle.textContent = btn.getAttribute('data-title') || btn.textContent.trim();
    panelBody.textContent = btn.getAttribute('data-body') || '';
  };

  // Initialize with whichever is marked selected; otherwise first
  const initial = buttons.find(b => b.getAttribute('aria-selected') === 'true') || buttons[0];
  setActive(initial);

  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => setActive(btn));
    btn.addEventListener('focus', () => setActive(btn));
    btn.addEventListener('click', (e) => { e.preventDefault(); setActive(btn); });
  });
})();