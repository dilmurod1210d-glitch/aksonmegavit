// Фильтр каталога: список товаров уже есть в HTML, скрипт только скрывает лишнее.
// Состояние хранится в адресе: ?category=…&q=…
(() => {
  const $ = s => document.querySelector(s);
  const input = $('#search'), chips = [...document.querySelectorAll('[data-filter]')];
  const sections = [...document.querySelectorAll('.product-category')];
  const count = $('#result-count'), reset = $('#reset'), empty = $('#empty');
  const norm = s => s.toLocaleLowerCase().replace(/ё/g, 'е').trim();
  const params = new URLSearchParams(location.search);
  let cat = params.get('category') || '';
  if (!chips.some(b => b.dataset.filter === cat)) cat = '';
  input.value = params.get('q') || '';

  function apply() {
    const q = norm(input.value);
    let total = 0;
    sections.forEach(sec => {
      let n = 0;
      const inCat = !cat || sec.dataset.category === cat;
      sec.querySelectorAll('.card').forEach(card => {
        const ok = inCat && (!q || card.dataset.search.includes(q));
        card.hidden = !ok;
        if (ok) n++;
      });
      sec.hidden = !n;
      total += n;
    });
    count.textContent = total + ' та маҳсулот';
    empty.hidden = total > 0;
    reset.hidden = !q && !cat;
    chips.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === cat)));
    const url = new URL(location.href);
    cat ? url.searchParams.set('category', cat) : url.searchParams.delete('category');
    q ? url.searchParams.set('q', input.value.trim()) : url.searchParams.delete('q');
    history.replaceState(null, '', url);
  }

  chips.forEach(b => b.addEventListener('click', () => { cat = b.dataset.filter; apply(); }));
  input.addEventListener('input', apply);
  reset.addEventListener('click', () => { cat = ''; input.value = ''; apply(); input.focus(); });
  apply();
})();
