// Статические страницы сайта. Данные (товары, категории, планируемые продукты)
// подставляются при сборке, поэтому страницы работают и без JavaScript.
import { page, esc, ICON, PHONES, ADDRESS, catalogUrl, productCard } from './layout.mjs';

const plural = n => `${n} та маҳсулот`;
const phoneButtons = (cls = 'btn-outline') => PHONES.map(([t, l], i) => `<a class="btn ${i === 0 ? 'btn-primary' : cls}" href="tel:${t}">${i === 0 ? ICON.phone : ''}${l}</a>`).join('');
const ctaBand = (title, text) => `<section class="section"><div class="container"><div class="cta-band"><div><h2>${title}</h2><p>${text}</p></div><div class="cta-phones">${phoneButtons()}</div></div></div></section>`;
const crumbs = items => `<nav class="breadcrumb" aria-label="Йўл">${items.map(([href, label], i) => (i ? '<span aria-hidden="true">/</span>' : '') + (href ? `<a href="${href}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`)).join('')}</nav>`;
const img = (p, w = 800) => p && p.image ? `/${esc(w === 400 ? (p.thumb || p.image) : (p.srcset && p.srcset.includes('-800.webp') ? p.image.replace(/\.[a-z0-9]+$/i, '-800.webp') : p.image))}` : '';

export function home(d) {
  const { products, categories, byCat, planned } = d;
  const show = [products[1], products[0], products[2]].filter(Boolean);
  const main = `
<section class="hero"><div class="container hero-grid">
<div>
<span class="eyebrow">Akson Megavit pharmaceutical</span>
<h1>Саломатликка эътибор — <em>ҳар бир маҳсулотда</em></h1>
<p class="lead">Akson ва Megavit биологик фаол қўшимчалари: сироплар, спрейлар, таблетка ва капсулалар. Ҳар бир маҳсулотнинг сурати ва асл буклети — бир жойда.</p>
<div class="hero-actions"><a class="btn btn-primary" href="/catalog.html">Каталогни очиш ${ICON.arrow}</a><a class="btn btn-outline" href="tel:${PHONES[0][0]}">${ICON.phone}Қўнғироқ қилиш</a></div>
<div class="stats"><div><strong>${products.length}</strong><span>маҳсулот</span></div><div><strong>${categories.length}</strong><span>тоифа</span></div><div><strong>2017</strong><span>йилдан буён</span></div></div>
</div>
<div class="hero-visual" aria-hidden="true">${show.map((p, i) => `<img src="${img(p)}" alt="" width="800" height="800"${i === 1 ? ' fetchpriority="high"' : ''}>`).join('')}</div>
</div></section>

<section class="section" style="padding-top:0"><div class="container">
<div class="section-head"><div><h2>Маҳсулот тоифалари</h2><p>Керакли тоифани танланг</p></div><a class="link-arrow" href="/catalog.html">Барча маҳсулотлар ${ICON.arrow}</a></div>
<div class="category-grid">${categories.map(c => { const first = byCat[c].find(p => p.image); return `<a class="category-tile" href="${esc(catalogUrl(c))}">${first ? `<img src="${img(first, 400)}" alt="" width="400" height="400" loading="lazy">` : ''}<strong>${esc(c)}</strong><span>${plural(byCat[c].length)}</span></a>`; }).join('')}</div>
</div></section>

<section class="section" style="padding-top:0"><div class="container">
<div class="section-head"><div><h2>Каталогдан</h2><p>Ҳар бир маҳсулот саҳифасида сурат ва асл қўлланиш буклети</p></div><a class="link-arrow" href="/catalog.html">Каталогни очиш ${ICON.arrow}</a></div>
<div class="product-grid">${products.slice(0, 8).map(p => productCard(p)).join('')}</div>
</div></section>

<section class="section" style="padding-top:0"><div class="container"><div class="panel split">
<div><div class="big-number">2017</div><p class="muted" style="margin-top:8px">йилдан буён</p></div>
<div><span class="eyebrow">Биз ҳақимизда</span><h2 style="margin:12px 0 14px">Akson ва Megavit</h2><p class="lead">Корхоналаримиз 2017 йилда ташкил этилган. Фаолиятимиз юқори технологиялар асосида сифатли биологик фаол қўшимчалар ишлаб чиқаришга қаратилган.</p><a class="link-arrow" href="/about.html">Батафсил ${ICON.arrow}</a></div>
</div></div></section>

${planned.length ? `<section class="section" style="padding-top:0"><div class="container">
<div class="section-head"><div><h2>Тез орада</h2><p>${planned.length} та янги маҳсулот ишлаб чиқариш режасида</p></div><a class="link-arrow" href="/planned.html">Барчасини кўриш ${ICON.arrow}</a></div>
<div class="planned-grid">${planned.slice(0, 4).map(p => `<a class="planned-card" href="/planned.html"><div class="photo"><span class="badge">Режада</span>${p.image ? `<img src="/${esc(p.image)}" alt="${esc(p.name)} — қадоқ макети" loading="lazy">` : ''}</div><div class="card-text"><h3>${esc(p.name)}</h3><span>${esc(p.subtitle || '')}</span></div></a>`).join('')}</div>
</div></section>` : ''}

${ctaBand('Маҳсулотлар бўйича савол борми?', 'Қўнғироқ қилинг — маҳсулот, буюртма ва ҳамкорлик бўйича маслаҳат берамиз.')}`;
  return page({
    title: 'Akson Megavit pharmaceutical — биологик фаол қўшимчалар каталоги',
    description: `Akson ва Megavit: ${products.length} та маҳсулот, суратлар ва асл буклетлар. Сироплар, спрейлар, таблетка ва капсулалар. Андижон шаҳри.`,
    path: '/', main, categories,
    extraHead: '<meta name="google-site-verification" content="rc_0PQZARM8L6S0S4vxCwKoDF6_xHoZhAECoESH31I8">\n',
    ld: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Akson Megavit', url: 'https://aksonmegavit.uz/' }]
  });
}

export function catalog(d) {
  const { products, categories, byCat } = d;
  const search = p => esc([p.name, p.slug, p.form, p.brand, p.category].filter(Boolean).join(' ').toLocaleLowerCase().replace(/ё/g, 'е'));
  const main = `<div class="container">
${crumbs([['/', 'Бош саҳифа'], ['', 'Маҳсулотлар каталоги']])}
<div class="catalog-head"><div><h1>Маҳсулотлар каталоги</h1></div><span class="count">${plural(products.length)} · ${categories.length} тоифа</span></div>
<div class="catalog-tools">
<label class="search">${ICON.search}<span class="visually-hidden">Маҳсулот номи бўйича қидириш</span><input id="search" type="search" placeholder="Маҳсулот номини киритинг…" autocomplete="off"></label>
<div class="chips" role="group" aria-label="Тоифалар"><button type="button" data-filter="" aria-pressed="true">Барчаси<span>${products.length}</span></button>${categories.map(c => `<button type="button" data-filter="${esc(c)}" aria-pressed="false">${esc(c)}<span>${byCat[c].length}</span></button>`).join('')}<a href="/planned.html">Режадаги маҳсулотлар</a></div>
</div>
<div class="results"><span id="result-count" role="status">${plural(products.length)}</span><button type="button" id="reset" hidden>Филтрни тозалаш ×</button></div>
<div id="grid">${categories.map(c => `<section class="product-category" data-category="${esc(c)}" aria-label="${esc(c)}"><div class="category-heading"><h2>${esc(c)}</h2><span class="category-count">${plural(byCat[c].length)}</span></div><div class="product-grid">${byCat[c].map(p => productCard(p).replace('<a class="card"', `<a class="card" data-search="${search(p)}"`)).join('')}</div></section>`).join('')}</div>
<div class="empty" id="empty" hidden>Маҳсулот топилмади. Бошқа ном билан қидириб кўринг.</div>
<div class="notice" style="margin:32px 0 16px">${ICON.info}<p>Ҳар бир маҳсулотнинг асл йўриқномаси унинг саҳифасида. Қўллашдан олдин йўриқнома билан танишинг ва мутахассис билан маслаҳатлашинг.</p></div>
</div>`;
  return page({
    title: 'Маҳсулотлар каталоги — Akson Megavit',
    description: `Akson ва Megavit маҳсулотлари: ${products.length} та биологик фаол қўшимча. Ном бўйича қидирув, тоифалар, суратлар ва буклетлар.`,
    path: '/catalog', active: 'catalog', main, categories, scripts: ['/catalog.js'],
    ld: [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: 'https://aksonmegavit.uz/' + p.url, name: p.name })) }]
  });
}

export function about(d) {
  const { products, categories } = d;
  const main = `<div class="container">
${crumbs([['/', 'Бош саҳифа'], ['', 'Биз ҳақимизда']])}
<section class="hero" style="padding-top:24px"><div class="hero-grid">
<div><span class="eyebrow">Akson Megavit pharmaceutical</span><h1>Биз ҳақимизда</h1><p class="lead">Akson ва Megavit корхоналари 2017 йилда ташкил этилган. Фаолиятимиз мижозлар учун юқори технологиялар асосида сифатли биологик фаол қўшимчалар ишлаб чиқаришга қаратилган.</p>
<div class="hero-actions"><a class="btn btn-primary" href="/catalog.html">Маҳсулотлар билан танишиш ${ICON.arrow}</a></div></div>
<div class="panel"><div class="big-number">2017</div><p class="muted" style="margin:8px 0 24px">йилдан буён</p><div class="stats" style="margin-top:0"><div><strong>${products.length}</strong><span>маҳсулот</span></div><div><strong>${categories.length}</strong><span>тоифа</span></div><div><strong>2</strong><span>бренд</span></div></div></div>
</div></section>
<div class="feature-list" style="margin-bottom:24px">
<div class="feature">${ICON.flask}<h3>Мақсадимиз</h3><p>Мижозларга сифатли, юқори технологиялар асосида ишлаб чиқарилган биологик фаол қўшимчаларни тақдим этиш.</p></div>
<div class="feature">${ICON.doc}<h3>Очиқ маълумот</h3><p>Ҳар бир маҳсулотнинг сурати ва асл қўлланиш буклети каталогда эълон қилинган.</p></div>
<div class="feature">${ICON.pin}<h3>Манзилимиз</h3><p>${ADDRESS}. Саволлар бўйича телефон орқали боғланинг.</p></div>
</div>
</div>
${ctaBand('Биз билан боғланинг', 'Маҳсулотлар, буюртма ва ҳамкорлик бўйича саволларга жавоб берамиз.')}`;
  return page({
    title: 'Биз ҳақимизда — Akson Megavit pharmaceutical',
    description: 'Akson ва Megavit корхоналари 2017 йилда ташкил этилган. Биологик фаол қўшимчалар ишлаб чиқариш. Андижон вилояти, Андижон шаҳри.',
    path: '/about', active: 'about', main, categories
  });
}

export function plannedPage(d) {
  const { planned, categories } = d;
  const main = `<div class="container">
${crumbs([['/', 'Бош саҳифа'], ['', 'Режадаги маҳсулотлар']])}
<div class="catalog-head"><div><span class="eyebrow">Келгуси маҳсулотлар</span><h1 style="margin-top:12px">Ишлаб чиқариш режасидаги маҳсулотлар</h1></div><span class="count">${plural(planned.length)}</span></div>
<div class="notice">${ICON.clock}<p>Ушбу ${planned.length} та маҳсулотнинг ишлаб чиқарилиши режалаштирилган. Ишлаб чиқариш бошланиш санаси ҳали эълон қилинмаган.</p></div>
<div class="planned-grid">${planned.map(p => `<article class="planned-card"><div class="photo"><span class="badge">Режада</span>${p.image ? `<img src="/${esc(p.image)}" alt="${esc(p.name)} — қадоқ макети" loading="lazy">` : ''}</div><div class="card-text"><h2 style="font-size:16px">${esc(p.name)}</h2><span>${esc(p.subtitle || '')}</span>${p.image ? `<button type="button" data-viewer="/${esc(p.image)}" data-title="${esc(p.name)}">Қадоқ макетини кўриш</button>` : ''}</div></article>`).join('')}</div>
</div>
<dialog class="viewer" id="viewer"><div class="viewer-head"><h2 id="viewer-title"></h2><button type="button" class="icon-btn" id="viewer-close" aria-label="Ёпиш">${ICON.close}</button></div><div class="viewer-body"><img id="viewer-img" alt=""><p style="margin-top:12px"><a id="viewer-link" target="_blank" rel="noopener">Суратни катта ҳажмда очиш</a></p></div></dialog>`;
  return page({
    title: 'Ишлаб чиқариш режасидаги маҳсулотлар — Akson Megavit',
    description: `Akson Megavit ишлаб чиқариш режасидаги ${planned.length} та маҳсулот ва уларнинг қадоқ макетлари.`,
    path: '/planned', active: 'planned', main, categories, scripts: ['/planned.js']
  });
}

export function notFound(d) {
  const main = `<div class="container not-found"><span class="eyebrow">404</span><h1>Саҳифа топилмади</h1><p class="lead">Бу манзилда саҳифа йўқ ёки у кўчирилган. Каталогдан керакли маҳсулотни топишингиз мумкин.</p><div class="hero-actions"><a class="btn btn-primary" href="/catalog.html">Маҳсулотлар каталоги ${ICON.arrow}</a><a class="btn btn-outline" href="/">Бош саҳифа</a></div></div>`;
  return page({ title: 'Саҳифа топилмади — Akson Megavit', description: 'Саҳифа топилмади.', path: '/404', main, categories: d.categories, noindex: true });
}
