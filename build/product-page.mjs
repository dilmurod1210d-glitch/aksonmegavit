// Страница товара на общем каркасе (build/layout.mjs):
// /mahsulot/<slug>/, /uz/mahsulot/<slug>/, /ru/product/<slug>/.
import { page, esc, SITE, ICON, PHONES, catalogUrl, productCard } from './layout.mjs';
import { L, href, dataText, productPath, LANG_ORDER } from './i18n.mjs';
import { crumbs } from './pages.mjs';

// Текст из админки: пустая строка — новый абзац, перенос строки — <br>.
const paragraphs = text => String(text).trim().split(/\n\s*\n/).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');

export function productPage(lang, p, related, categories) {
  const t = L(lang);
  const url = SITE + productPath(lang, p.slug);
  const abs = rel => rel ? `${SITE}/${rel}` : '';
  const name = dataText(lang, p.name), category = dataText(lang, p.category, 'category'), form = dataText(lang, p.form, 'form');
  const catObj = categories.find(c => c.name === p.category);
  // Описание, состав и применение админка хранит на узбекском (кириллица):
  // для латиницы транслитерируем, для русского пока не показываем.
  const text = v => !v ? '' : lang === 'ru' ? '' : dataText(lang, v);
  const description = text(p.description);
  const title = `${name} — ${category} | Akson Megavit`;
  const metaDescription = description ? description.replace(/\s+/g, ' ').trim().slice(0, 155)
    : t(`${p.name}${p.form ? ' (' + p.form + ')' : ''} — ${p.category.toLowerCase()} тоифасидаги биологик фаол қўшимча. Маҳсулот сурати ва асл қўлланиш буклети.`,
        `${name}${form ? ' (' + form + ')' : ''} — биологически активная добавка, категория «${category}». Фото продукта и оригинальная инструкция.`);

  const ld = [{
    '@context': 'https://schema.org', '@type': 'Product', name, url,
    image: [p.image, ...p.leaflets].filter(Boolean).map(abs), description: metaDescription, category,
    ...(p.brand ? { brand: { '@type': 'Brand', name: p.brand } } : {}),
    manufacturer: { '@type': 'Organization', name: 'Akson Megavit', url: SITE + '/' }
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('Бош саҳифа', 'Главная'), item: SITE + href(lang, '/') },
      { '@type': 'ListItem', position: 2, name: t('Каталог', 'Каталог'), item: SITE + href(lang, '/catalog') },
      { '@type': 'ListItem', position: 3, name: category, item: SITE + catalogUrl(lang, catObj) },
      { '@type': 'ListItem', position: 4, name, item: url }
    ]
  }];

  const facts = [[t('Бренд', 'Бренд'), p.brand], [t('Шакли ва ҳажми', 'Форма и объём'), form], [t('Тоифа', 'Категория'), category]].filter(f => f[1]);
  const texts = [[t('Таркиби', 'Состав'), text(p.composition)], [t('Қўлланиши', 'Применение'), text(p.usage)]].filter(x => x[1]);
  const ruPending = lang === 'ru' && (p.description || p.composition || p.usage);
  const photo = p.image
    ? `<img src="/${esc(p.image)}"${p.srcset ? ` srcset="${esc(p.srcset.replace(/(^|, )assets\//g, '$1/assets/'))}" sizes="(max-width:900px) 90vw, 560px"` : ''} alt="${esc(name)}" width="800" height="800" fetchpriority="high">`
    : `<span class="placeholder">${t('Сурат тайёрланмоқда', 'Фото готовится')}</span>`;

  const main = `<div class="container">
${crumbs(lang, [[href(lang, '/'), t('Бош саҳифа', 'Главная')], [href(lang, '/catalog.html'), t('Каталог', 'Каталог')], [esc(catalogUrl(lang, catObj)), category], ['', name]])}
<article class="product">
<div class="product-photo">${photo}</div>
<div class="product-info">
<span class="eyebrow">${esc(category)}</span>
<h1>${esc(name)}</h1>
${description ? `<div class="product-lead">${paragraphs(description)}</div>` : `<p class="product-lead">${ruPending
    ? 'Описание продукта на русском языке готовится. Состав и способ применения указаны в оригинальной инструкции ниже.'
    : t('Биологик фаол қўшимча. Таркиби ва қўлланиш тартиби қуйидаги асл буклетда келтирилган.', 'Биологически активная добавка. Состав и способ применения указаны в оригинальной инструкции ниже.')}</p>`}
${facts.length ? `<dl class="product-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
<div class="product-contact"><span>${t('Буюртма ва маълумот учун қўнғироқ қилинг', 'Звоните для заказа и консультации')}</span><div class="cta-phones">${PHONES.map(([tel, l], i) => `<a class="btn ${i ? 'btn-outline' : 'btn-primary'}" href="tel:${tel}">${i ? '' : ICON.phone}${l}</a>`).join('')}</div></div>
<div class="notice" style="margin-top:16px">${ICON.info}<p>${t('Биологик фаол қўшимча дори воситаси ҳисобланмайди. Қўллашдан олдин йўриқнома билан танишинг ва мутахассис билан маслаҳатлашинг.', 'БАД не является лекарственным средством. Перед применением ознакомьтесь с инструкцией и проконсультируйтесь со специалистом.')}</p></div>
</div>
</article>
${texts.map(([k, v]) => `<section class="product-text"><h2>${k}</h2>${paragraphs(v)}</section>`).join('')}
<section class="product-leaflets"><h2>${t('Буклет ва қўлланиш маълумотлари', 'Инструкция и информация о применении')}</h2>${p.leaflets.length
    ? `<p>${t('Асл йўриқнома / маълумот варақаси. Катталаштириш учун суратни очинг.', 'Оригинальная инструкция / информационный лист. Откройте изображение, чтобы увеличить.')}</p><div class="leaflet-pages">${p.leaflets.map((f, i) => `<a href="/${esc(f)}" target="_blank" rel="noopener"><img loading="lazy" src="/${esc(f)}" alt="${esc(name)} — ${t('маълумот варақаси', 'информационный лист')} ${i + 1}"><span>${t(`${i + 1}-варақни катта ҳажмда очиш`, `Открыть лист ${i + 1} в полном размере`)} ↗</span></a>`).join('')}</div>`
    : `<p>${t('Тасдиқланган йўриқнома келиб тушгач, шу ерга жойлаштирилади.', 'Утверждённая инструкция будет размещена здесь.')}</p>`}</section>
${related.length ? `<section class="product-related"><div class="section-head"><h2>${t(`${p.category}: бошқа маҳсулотлар`, `${category}: другие продукты`)}</h2><a class="link-arrow" href="${esc(catalogUrl(lang, catObj))}">${t('Барчаси', 'Все')} ${ICON.arrow}</a></div><div class="product-grid">${related.map(r => productCard(lang, r)).join('')}</div></section>` : ''}
</div>`;

  const alternates = Object.fromEntries(LANG_ORDER.map(l => [l, productPath(l, p.slug)]));
  return page({ lang, title, description: metaDescription, alternates, active: 'catalog', main, categories, ld, ogType: 'product', ogImage: abs(p.image) });
}
