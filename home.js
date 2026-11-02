// Витрина на главной: товары по очереди выходят в центр, подпись под ней — ссылка на текущий товар.
(() => {
  const root = document.querySelector('[data-rotator]');
  if (!root) return;
  const packs = [...root.querySelectorAll('.pack')], now = root.querySelector('.hero-now');
  if (packs.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let i = 0, timer = null;
  function show(n) {
    i = (n + packs.length) % packs.length;
    packs.forEach((p, k) => {
      const d = (k - i + packs.length) % packs.length;
      p.className = 'pack ' + (d === 0 ? 'pos-0' : d === 1 ? 'pos-1' : d === packs.length - 1 ? 'pos--1' : 'pos-out');
    });
    const cur = packs[i];
    now.href = cur.dataset.href;
    now.dataset.tone = cur.dataset.tone;
    now.querySelector('strong').textContent = cur.dataset.name;
    now.querySelector('small').textContent = cur.dataset.cat;
    now.classList.remove('flip'); void now.offsetWidth; now.classList.add('flip');
  }
  const play = () => { clearInterval(timer); timer = setInterval(() => { if (!document.hidden) show(i + 1); }, 3200); };
  root.addEventListener('mouseenter', () => clearInterval(timer));
  root.addEventListener('mouseleave', play);
  // Нажатие на боковую упаковку выводит её в центр.
  packs.forEach((p, k) => p.addEventListener('click', () => { if (k !== i) { show(k); play(); } }));
  play();
})();
