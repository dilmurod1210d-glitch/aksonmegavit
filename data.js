/* Сайт берёт товары и планируемые продукты из products.json и planned.json.
   Эти файлы меняются через админку (/admin), поэтому счётчики и меню категорий
   на страницах строятся здесь автоматически. */
(function () {
  var ICONS = {
    'Сироплар': '♧', 'Спрейлар': '✧', 'Таблетка ва капсулалар': '◒',
    'Томчилар': '◉', 'Саше ва порошоклар': '▱'
  };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var v = '?v=' + Date.now();
  var get = function (url) {
    return fetch(url + v, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(url);
      return r.json();
    });
  };

  function categoriesOf(products) {
    var list = [];
    products.forEach(function (p) { if (p.category && list.indexOf(p.category) < 0) list.push(p.category); });
    return list;
  }

  function rebuildNav(data) {
    var cats = data.categories;
    document.querySelectorAll('.top-categories').forEach(function (nav) {
      var withIcons = nav.classList.contains('catalog-categories');
      var link = function (href, label, icon) {
        return withIcons
          ? '<a href="' + href + '"><span class="type-icon" aria-hidden="true">' + icon + '</span><span>' + esc(label) + '</span><span class="type-arrow" aria-hidden="true">›</span></a>'
          : '<a href="' + href + '">' + esc(label) + '</a>';
      };
      var html = link('catalog.html', 'Барча маҳсулотлар', '▦');
      cats.forEach(function (c) {
        html += link('catalog.html?category=' + encodeURIComponent(c), c, ICONS[c] || '◇');
      });
      if (data.planned.length) html += link('planned.html', 'Режадаги маҳсулотлар', '◷');
      nav.innerHTML = html;
    });
  }

  function fillCounts(data) {
    var p = data.products, cats = data.categories;
    var byCat = {};
    p.forEach(function (x) { byCat[x.category] = (byCat[x.category] || 0) + 1; });
    var top = cats.slice().sort(function (a, b) { return byCat[b] - byCat[a]; }).slice(0, 2);
    var other = p.length - top.reduce(function (s, c) { return s + byCat[c]; }, 0);
    var values = {
      products: p.length,
      categories: cats.length,
      leaflets: p.filter(function (x) { return x.leaflets && x.leaflets.length; }).length,
      planned: data.planned.length,
      top1: top[0] ? byCat[top[0]] : 0,
      top2: top[1] ? byCat[top[1]] : 0,
      top1name: top[0] || '',
      top2name: top[1] || '',
      other: other
    };
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var k = el.getAttribute('data-count');
      if (k in values) el.textContent = values[k];
    });
    var ring = document.querySelector('.catalog-ring');
    if (ring && p.length) {
      var a = other / p.length * 100, b = a + values.top1 / p.length * 100;
      ring.style.background = 'conic-gradient(#f02c9c 0 ' + a + '%,#6952ee ' + a + '% ' + b + '%,#b68af4 ' + b + '% 100%)';
    }
  }

  window.SiteData = Promise.all([get('products.json'), get('planned.json').catch(function () { return []; })])
    .then(function (r) {
      var data = { products: r[0], planned: r[1] };
      data.categories = categoriesOf(data.products);
      window.CATALOG_PRODUCTS = data.products;
      rebuildNav(data);
      fillCounts(data);
      return data;
    });
})();
