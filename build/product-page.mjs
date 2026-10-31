// Шаблон страницы товара /mahsulot/<slug>/. Шапка и подвал такие же, как на
// остальных страницах, только ссылки абсолютные (страница лежит в подпапке).
const PHONES = [['+998912740000', '91 274 00 00'], ['+998975840000', '97 584 00 00'], ['+998902547000', '90 254 70 00']];
const CSS = ['style.css', 'panel.css', 'refresh.css', 'reference.css', 'catalog-navigation.css', 'mobile.css', 'product.css'];

const header = `<header><a class="brand" href="/"><img class="logo-akson" src="/assets/brands/akson.webp" width="170" height="48" alt="Akson Pharmaceutical company"><span class="logo-divider"></span><img class="logo-megavit" src="/assets/brands/megavit.webp" width="115" height="66" alt="MegavitFarm"></a><nav class="main-links" aria-label="Асосий меню"><a href="/">Бош саҳифа</a><a href="/about.html">Биз ҳақимизда</a><a href="/catalog.html">Каталог</a><a href="#contacts">Боғланиш</a></nav><div class="header-actions"><div class="theme-switch" role="group" aria-label="Ранг режими"><button type="button" data-theme-choice="light" aria-label="Кундузги режим" title="Кундузги режим">☀</button><button type="button" data-theme-choice="dark" aria-label="Тунги режим" title="Тунги режим">☾</button></div><a class="nav" href="/catalog.html">Маҳсулотлар каталоги <span>↗</span></a></div></header>`;

const footer = `<footer id="contacts"><div class="brand brand-footer"><img class="logo-akson" src="/assets/brands/akson.webp" width="170" height="48" alt="Akson Pharmaceutical company"><span class="logo-divider"></span><img class="logo-megavit" src="/assets/brands/megavit.webp" width="115" height="66" alt="MegavitFarm"></div><div class="footer-contacts"><span>Боғланиш учун</span>${PHONES.map(([t, l]) => `<a href="tel:${t}">${l}</a>`).join('')}</div><span>© <span id="year"></span></span></footer>`;

// Текст из админки: пустая строка — новый абзац, перенос строки — <br>.
const paragraphs = (text, esc) => String(text).trim().split(/\n\s*\n/).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');

export function productPage(p, related, { SITE, esc }) {
  const url = `${SITE}/${p.url}`;
  const abs = rel => rel ? `${SITE}/${rel}` : '';
  const title = `${p.name} — ${p.category} | Akson Megavit`;
  const description = (p.description ? String(p.description).replace(/\s+/g, ' ').trim().slice(0, 155)
    : `${p.name}${p.form ? ' (' + p.form + ')' : ''} — ${p.category.toLowerCase()} тоифасидаги биологик фаол қўшимча. Маҳсулот сурати ва асл қўлланиш буклети.`);
  const catalogUrl = `/catalog.html?category=${encodeURIComponent(p.category)}`;

  const ld = [{
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, url,
    image: [p.image, ...p.leaflets].filter(Boolean).map(abs), description, category: p.category,
    ...(p.brand ? { brand: { '@type': 'Brand', name: p.brand } } : {}),
    manufacturer: { '@type': 'Organization', name: 'Akson Megavit', url: SITE + '/' }
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Бош саҳифа', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: SITE + '/catalog' },
      { '@type': 'ListItem', position: 3, name: p.category, item: SITE + catalogUrl },
      { '@type': 'ListItem', position: 4, name: p.name, item: url }
    ]
  }];

  const facts = [['Бренд', p.brand], ['Шакли ва ҳажми', p.form], ['Тоифа', p.category]].filter(f => f[1]);
  const texts = [['Таркиби', p.composition], ['Қўлланиши', p.usage]].filter(t => t[1]);

  return `<!doctype html>
<html lang="uz-Cyrl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><script>try{document.documentElement.dataset.theme=localStorage.getItem("akson-theme")||"light"}catch(e){}</script>${CSS.map(c => `<link rel="stylesheet" href="/${c}">`).join('')}<link rel="canonical" href="${url}"><meta name="robots" content="index,follow"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:type" content="product"><meta property="og:image" content="${esc(abs(p.image) || SITE + '/assets/og/og-image.jpg')}"><meta property="og:site_name" content="Akson Megavit"><meta property="og:locale" content="uz_UZ"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48"><link rel="icon" type="image/png" href="/favicon-48.png" sizes="48x48"><link rel="icon" type="image/png" href="/favicon-192.png" sizes="192x192"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script></head>
<body class="product-page">${header}<main>
<nav class="breadcrumb" aria-label="Йўл"><a href="/">Бош саҳифа</a><span>/</span><a href="/catalog.html">Каталог</a><span>/</span><a href="${esc(catalogUrl)}">${esc(p.category)}</a><span>/</span><span aria-current="page">${esc(p.name)}</span></nav>
<article class="product">
<div class="product-photo">${p.image ? `<img src="/${esc(p.image)}"${p.srcset ? ` srcset="${esc(p.srcset.replace(/(^|, )assets\//g, '$1/assets/'))}" sizes="(max-width:800px) 90vw, 560px"` : ''} alt="${esc(p.name)}" fetchpriority="high">` : '<span class="placeholder">Сурат тайёрланмоқда</span>'}</div>
<div class="product-info">
<div class="eyebrow">${esc(p.category.toUpperCase())}</div>
<h1>${esc(p.name)}</h1>
${p.description ? `<div class="product-lead">${paragraphs(p.description, esc)}</div>` : `<p class="product-lead">Биологик фаол қўшимча. Таркиби ва қўлланиш тартиби қуйидаги асл буклетда келтирилган.</p>`}
${facts.length ? `<dl class="product-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
<div class="product-contact"><span>Буюртма ва маълумот учун</span><div>${PHONES.map(([t, l]) => `<a href="tel:${t}">${l}</a>`).join('')}</div></div>
</div>
</article>
${texts.map(([k, v]) => `<section class="product-text"><h2>${k}</h2>${paragraphs(v, esc)}</section>`).join('')}
<section class="leaflets product-leaflets"><h2>Буклет ва қўлланиш маълумотлари</h2>${p.leaflets.length
    ? `<p>Асл йўриқнома / маълумот варақаси. Катталаштириш учун суратни очинг.</p><div class="leaflet-pages">${p.leaflets.map((f, i) => `<a href="/${esc(f)}" target="_blank" rel="noopener"><img loading="lazy" src="/${esc(f)}" alt="${esc(p.name)} — маълумот варақаси ${i + 1}"><span>${i + 1}-варақни катта ҳажмда очиш ↗</span></a>`).join('')}</div>`
    : '<p>Тасдиқланган йўриқнома келиб тушгач, шу ерга жойлаштирилади.</p>'}</section>
<section class="info"><span>ℹ</span><div><h3>Муҳим</h3><p>Биологик фаол қўшимча дори воситаси ҳисобланмайди. Қўллашдан олдин йўриқнома билан танишинг ва мутахассис билан маслаҳатлашинг.</p></div></section>
${related.length ? `<section class="product-related"><h2>${esc(p.category)}: бошқа маҳсулотлар</h2><div class="category-products">${related.map(r => `<a class="card" href="/${r.url}"><div class="photo">${r.image ? `<img loading="lazy" src="/${esc(r.thumb || r.image)}" alt="${esc(r.name)}">` : '<span class="placeholder">Сурат тайёрланмоқда</span>'}</div><div class="card-text"><h3>${esc(r.name)}</h3><div class="card-bottom"><span>Батафсил маълумот</span><span class="arrow">↗</span></div></div></a>`).join('')}</div></section>` : ''}
</main>${footer}<script src="/theme.js"></script></body></html>
`;
}
