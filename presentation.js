// Листание презентации: стрелки, пробел, PageUp/PageDown, кнопки; номер текущего слайда.
(() => {
  const deck = document.getElementById('deck');
  const slides = [...deck.querySelectorAll('.slide')];
  const cur = document.getElementById('cur');
  let i = 0;

  const go = n => {
    i = Math.max(0, Math.min(slides.length - 1, n));
    slides[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Если текст не помещается в слайд, он плавно уменьшается (не меньше 60%), а не обрезается.
  const shrink = (el, room) => {
    el.style.zoom = 1;
    for (let k = 1; k > 0.6 && el.getBoundingClientRect().height > room(); k -= 0.04) el.style.zoom = k.toFixed(2);
  };
  const fit = () => slides.forEach(s => {
    const body = s.querySelector('.body'), fitEl = s.querySelector('.fit'), cover = s.querySelector('.cover-text');
    if (body && fitEl) shrink(fitEl, () => body.getBoundingClientRect().height);
    if (cover) {
      const cs = getComputedStyle(s);
      shrink(cover, () => s.getBoundingClientRect().height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom));
    }
  });
  fit();
  document.fonts && document.fonts.ready.then(fit);
  addEventListener('resize', fit);
  addEventListener('beforeprint', fit);

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { i = slides.indexOf(e.target); cur.textContent = i + 1; }
  }), { root: deck, threshold: 0.6 });
  slides.forEach(s => io.observe(s));

  document.getElementById('prev').addEventListener('click', () => go(i - 1));
  document.getElementById('next').addEventListener('click', () => go(i + 1));
  document.getElementById('print').addEventListener('click', () => window.print());
  document.getElementById('full').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (deck.requestFullscreen) deck.requestFullscreen();
  });
  document.addEventListener('keydown', e => {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(i + 1); }
    if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(i - 1); }
    if (e.key === 'Home') go(0);
    if (e.key === 'End') go(slides.length - 1);
  });
})();
