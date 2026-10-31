// Страница товара /mahsulot/<slug>/ на общем каркасе (build/layout.mjs).
import { page, esc, SITE, ICON, PHONES, catalogUrl, productCard } from './layout.mjs';

// Текст из админки: пустая строка — новый абзац, перенос строки — <br>.
const paragraphs = text => String(text).trim().split(/\n\s*\n/).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');

export function productPage(p, related, categories) {
  const url = `${SITE}/${p.url}`;
  const abs = rel => rel ? `${SITE}/${rel}` : '';
  const title = `${p.name} — ${p.category} | Akson Megavit`;
  const description = p.description ? String(p.description).replace(/\s+/g, ' ').trim().slice(0, 155)
    : `${p.name}${p.form ? ' (' + p.form + ')' : ''} — ${p.category.toLowerCase()} тоифасидаги биологик фаол қўшимча. Маҳсулот сурати ва асл қўлланиш буклети.`;

  const ld = [{
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, url,
    image: [p.image, ...p.leaflets].filter(Boolean).map(abs), description, category: p.category,
    ...(p.brand ? { brand: { '@type': 'Brand', name: p.brand } } : {}),
    manufacturer: { '@type': 'Organization', name: 'Akson Megavit', url: SITE + '/' }
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Бош саҳифа', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: SITE + '/catalog' },
      { '@type': 'ListItem', position: 3, name: p.category, item: SITE + catalogUrl(p.category) },
      { '@type': 'ListItem', position: 4, name: p.name, item: url }
    ]
  }];

  const facts = [['Бренд', p.brand], ['Шакли ва ҳажми', p.form], ['Тоифа', p.category]].filter(f => f[1]);
  const texts = [['Таркиби', p.composition], ['Қўлланиши', p.usage]].filter(t => t[1]);
  const photo = p.image
    ? `<img src="/${esc(p.image)}"${p.srcset ? ` srcset="${esc(p.srcset.replace(/(^|, )assets\//g, '$1/assets/'))}" sizes="(max-width:900px) 90vw, 560px"` : ''} alt="${esc(p.name)}" width="800" height="800" fetchpriority="high">`
    : '<span class="placeholder">Сурат тайёрланмоқда</span>';

  const main = `<div class="container">
<nav class="breadcrumb" aria-label="Йўл"><a href="/">Бош саҳифа</a><span aria-hidden="true">/</span><a href="/catalog.html">Каталог</a><span aria-hidden="true">/</span><a href="${esc(catalogUrl(p.category))}">${esc(p.category)}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span></nav>
<article class="product">
<div class="product-photo">${photo}</div>
<div class="product-info">
<span class="eyebrow">${esc(p.category)}</span>
<h1>${esc(p.name)}</h1>
${p.description ? `<div class="product-lead">${paragraphs(p.description)}</div>` : `<p class="product-lead">Биологик фаол қўшимча. Таркиби ва қўлланиш тартиби қуйидаги асл буклетда келтирилган.</p>`}
${facts.length ? `<dl class="product-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
<div class="product-contact"><span>Буюртма ва маълумот учун қўнғироқ қилинг</span><div class="cta-phones">${PHONES.map(([t, l], i) => `<a class="btn ${i ? 'btn-outline' : 'btn-primary'}" href="tel:${t}">${i ? '' : ICON.phone}${l}</a>`).join('')}</div></div>
<div class="notice" style="margin-top:16px">${ICON.info}<p>Биологик фаол қўшимча дори воситаси ҳисобланмайди. Қўллашдан олдин йўриқнома билан танишинг ва мутахассис билан маслаҳатлашинг.</p></div>
</div>
</article>
${texts.map(([k, v]) => `<section class="product-text"><h2>${k}</h2>${paragraphs(v)}</section>`).join('')}
<section class="product-leaflets"><h2>Буклет ва қўлланиш маълумотлари</h2>${p.leaflets.length
    ? `<p>Асл йўриқнома / маълумот варақаси. Катталаштириш учун суратни очинг.</p><div class="leaflet-pages">${p.leaflets.map((f, i) => `<a href="/${esc(f)}" target="_blank" rel="noopener"><img loading="lazy" src="/${esc(f)}" alt="${esc(p.name)} — маълумот варақаси ${i + 1}"><span>${i + 1}-варақни катта ҳажмда очиш ↗</span></a>`).join('')}</div>`
    : '<p>Тасдиқланган йўриқнома келиб тушгач, шу ерга жойлаштирилади.</p>'}</section>
${related.length ? `<section class="product-related"><div class="section-head"><h2>${esc(p.category)}: бошқа маҳсулотлар</h2><a class="link-arrow" href="${esc(catalogUrl(p.category))}">Барчаси ${ICON.arrow}</a></div><div class="product-grid">${related.map(r => productCard(r)).join('')}</div></section>` : ''}
</div>`;

  return page({ title, description, path: '/' + p.url, active: 'catalog', main, categories, ld, ogType: 'product', ogImage: abs(p.image) });
}
