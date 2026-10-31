// Просмотр макета упаковки планируемого продукта.
(() => {
  const dialog = document.getElementById('viewer');
  if (!dialog) return;
  const img = document.getElementById('viewer-img'), link = document.getElementById('viewer-link');
  document.querySelectorAll('[data-viewer]').forEach(b => b.addEventListener('click', () => {
    document.getElementById('viewer-title').textContent = b.dataset.title;
    img.src = link.href = b.dataset.viewer;
    img.alt = b.dataset.title + ' — қадоқ макети';
    dialog.showModal();
    document.body.classList.add('modal-open');
  }));
  document.getElementById('viewer-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
})();
