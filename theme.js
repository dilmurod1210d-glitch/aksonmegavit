// Переключатель темы и мобильное меню — общие для всех страниц.
(() => {
  const root = document.documentElement;
  document.querySelectorAll('[data-theme-toggle]').forEach(b => {
    const sync = () => b.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
    sync();
    b.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('akson-theme', root.dataset.theme); } catch (e) {}
      sync();
    });
  });

  const toggle = document.querySelector('[data-menu-toggle]'), nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  const set = open => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
  };
  toggle.addEventListener('click', () => set(!nav.classList.contains('open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); toggle.focus(); } });
  matchMedia('(min-width: 1081px)').addEventListener('change', e => { if (e.matches) set(false); });
})();
