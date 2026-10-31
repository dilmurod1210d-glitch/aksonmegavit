// Статические страницы сайта. Данные (товары, категории, планируемые продукты)
// подставляются при сборке, поэтому страницы работают и без JavaScript.
// Каждая функция получает язык (kr / uz / ru, см. build/i18n.mjs) и данные.
import { page, esc, ICON, PHONES, address, catalogUrl, productCard, settings, cfgText, phoneNote } from './layout.mjs';
import { L, href, dataText, productPath, LANG_ORDER, productName } from './i18n.mjs';

const count = (lang, n) => L(lang)(`${n} та маҳсулот`, `${n} ${ruPlural(n, 'товар', 'товара', 'товаров')}`);
function ruPlural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? few : many;
}
// Один и тот же адрес на всех языках — для hreflang и переключателя языка.
export const alternatesOf = path => Object.fromEntries(LANG_ORDER.map(l => [l, href(l, path)]));

const phoneButtons = () => PHONES.map(([tel, l], i) => `<a class="btn ${i === 0 ? 'btn-primary' : 'btn-outline'}" href="tel:${tel}">${i === 0 ? ICON.phone : ''}${l}</a>`).join('')
  + (settings().telegram ? `<a class="btn btn-outline" href="${esc(settings().telegram)}" target="_blank" rel="noopener">${ICON.send}Telegram</a>` : '');
const paragraphs = text => String(text).trim().split(/\n\s*\n/).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
const ctaBand = (title, text) => `<section class="section"><div class="container"><div class="cta-band"><div><h2>${title}</h2><p>${text}</p></div><div class="cta-phones">${phoneButtons()}</div></div></div></section>`;
export const crumbs = (lang, items) => `<nav class="breadcrumb" aria-label="${L(lang)('Йўл', 'Навигация')}">${items.map(([link, label], i) => (i ? '<span aria-hidden="true">/</span>' : '') + (link ? `<a href="${link}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`)).join('')}</nav>`;
const img800 = p => p && p.image ? '/' + esc(p.srcset && p.srcset.includes('-800.webp') ? p.image.replace(/\.[a-z0-9]+$/i, '-800.webp') : p.image) : '';
const cat = (lang, c) => esc(dataText(lang, c.name, 'category'));

export function home(lang, d) {
  const t = L(lang);
  const { products, categories, byCat, planned } = d;
  const show = [products[1], products[0], products[2]].filter(Boolean);
  const main = `
<section class="hero"><div class="container hero-grid">
<div>
<span class="eyebrow">Akson Megavit pharmaceutical</span>
<h1>${t('Саломатликка эътибор — <em>ҳар бир маҳсулотда</em>', 'Забота о здоровье — <em>в каждом продукте</em>')}</h1>
<p class="lead">${t('Akson ва Megavit биологик фаол қўшимчалари: сироплар, спрейлар, таблетка ва капсулалар. Ҳар бир маҳсулотнинг сурати ва асл буклети — бир жойда.', 'Биологически активные добавки Akson и Megavit: сиропы, спреи, таблетки и капсулы. Фото и оригинальная инструкция каждого продукта — в одном месте.')}</p>
<div class="hero-actions"><a class="btn btn-primary" href="${href(lang, '/catalog.html')}">${t('Каталогни очиш', 'Открыть каталог')} ${ICON.arrow}</a><a class="btn btn-outline" href="tel:${PHONES[0][0]}">${ICON.phone}${t('Қўнғироқ қилиш', 'Позвонить')}</a></div>
<div class="stats"><div><strong>${products.length}</strong><span>${t('маҳсулот', 'продуктов')}</span></div><div><strong>${categories.length}</strong><span>${t('тоифа', 'категорий')}</span></div><div><strong>2017</strong><span>${t('йилдан буён', 'год основания')}</span></div></div>
</div>
<div class="hero-visual" aria-hidden="true">${show.map((p, i) => `<img src="${img800(p)}" alt="" width="800" height="800"${i === 1 ? ' fetchpriority="high"' : ''}>`).join('')}</div>
</div></section>

<section class="section" style="padding-top:0"><div class="container">
<div class="section-head"><div><h2>${t('Маҳсулот тоифалари', 'Категории продуктов')}</h2><p>${t('Керакли тоифани танланг', 'Выберите нужную категорию')}</p></div><a class="link-arrow" href="${href(lang, '/catalog.html')}">${t('Барча маҳсулотлар', 'Все продукты')} ${ICON.arrow}</a></div>
<div class="category-grid">${categories.map(c => { const first = byCat[c.name].find(p => p.image); return `<a class="category-tile" href="${esc(catalogUrl(lang, c))}">${first ? `<img src="/${esc(first.thumb || first.image)}" alt="" width="400" height="400" loading="lazy">` : ''}<strong>${cat(lang, c)}</strong><span>${count(lang, byCat[c.name].length)}</span></a>`; }).join('')}</div>
</div></section>

<section class="section" style="padding-top:0"><div class="container">
<div class="section-head"><div><h2>${t('Каталогдан', 'Из каталога')}</h2><p>${t('Ҳар бир маҳсулот саҳифасида сурат ва асл қўлланиш буклети', 'На странице каждого продукта — фото и оригинальная инструкция')}</p></div><a class="link-arrow" href="${href(lang, '/catalog.html')}">${t('Каталогни очиш', 'Открыть каталог')} ${ICON.arrow}</a></div>
<div class="product-grid">${products.slice(0, 8).map(p => productCard(lang, p)).join('')}</div>
</div></section>

<section class="section" style="padding-top:0"><div class="container"><div class="panel split">
<div><div class="big-number">2017</div><p class="muted" style="margin-top:8px">${t('йилдан буён', 'год основания')}</p></div>
<div><span class="eyebrow">${t('Биз ҳақимизда', 'О компании')}</span><h2 style="margin:12px 0 14px">${t('Akson ва Megavit', 'Akson и Megavit')}</h2><p class="lead">${t('Корхоналаримиз 2017 йилда ташкил этилган. Фаолиятимиз юқори технологиялар асосида сифатли биологик фаол қўшимчалар ишлаб чиқаришга қаратилган.', 'Наши предприятия основаны в 2017 году. Мы производим качественные биологически активные добавки на основе современных технологий.')}</p><a class="link-arrow" href="${href(lang, '/about.html')}">${t('Батафсил', 'Подробнее')} ${ICON.arrow}</a></div>
</div></div></section>

${planned.length ? `<section class="section" style="padding-top:0"><div class="container">
<div class="section-head"><div><h2>${t('Тез орада', 'Скоро')}</h2><p>${t(`${planned.length} та янги маҳсулот ишлаб чиқариш режасида`, `${planned.length} ${ruPlural(planned.length, 'новый продукт', 'новых продукта', 'новых продуктов')} в плане производства`)}</p></div><a class="link-arrow" href="${href(lang, '/planned.html')}">${t('Барчасини кўриш', 'Смотреть все')} ${ICON.arrow}</a></div>
<div class="planned-grid">${planned.slice(0, 4).map(p => `<a class="planned-card" href="${href(lang, '/planned.html')}"><div class="photo"><span class="badge">${t('Режада', 'В плане')}</span>${p.image ? `<img src="/${esc(p.image)}" alt="${esc(productName(lang, p))} — ${t('қадоқ макети', 'макет упаковки')}" loading="lazy">` : ''}</div><div class="card-text"><h3>${esc(productName(lang, p))}</h3><span>${esc(dataText(lang, p.subtitle || '', 'form'))}</span></div></a>`).join('')}</div>
</div></section>` : ''}

${ctaBand(t('Маҳсулотлар бўйича савол борми?', 'Есть вопросы о продуктах?'), t('Қўнғироқ қилинг — маҳсулот, буюртма ва ҳамкорлик бўйича маслаҳат берамиз.', 'Позвоните — проконсультируем по продуктам, заказу и сотрудничеству.'))}`;
  return page({
    lang, main, categories, alternates: alternatesOf('/'),
    title: t('Akson Megavit pharmaceutical — биологик фаол қўшимчалар каталоги', 'Akson Megavit pharmaceutical — каталог биологически активных добавок'),
    description: t(`Akson ва Megavit: ${products.length} та маҳсулот, суратлар ва асл буклетлар. Сироплар, спрейлар, таблетка ва капсулалар. Андижон шаҳри.`, `Akson и Megavit: ${products.length} ${ruPlural(products.length, 'продукт', 'продукта', 'продуктов')}, фото и оригинальные инструкции. Сиропы, спреи, таблетки и капсулы. г. Андижан.`),
    extraHead: '<meta name="google-site-verification" content="rc_0PQZARM8L6S0S4vxCwKoDF6_xHoZhAECoESH31I8">\n',
    ld: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Akson Megavit', url: 'https://aksonmegavit.uz' + href(lang, '/'), inLanguage: lang === 'ru' ? 'ru' : lang === 'uz' ? 'uz-Latn' : 'uz-Cyrl' }]
  });
}

export function catalog(lang, d) {
  const t = L(lang);
  const { products, categories, byCat } = d;
  // Поиск по названию на всех трёх вариантах написания и по адресу страницы (латиница).
  const search = p => esc([p.name, productName('uz', p), p.slug, p.form, p.brand, dataText(lang, p.category, 'category')].filter(Boolean).join(' ').toLocaleLowerCase().replace(/ё/g, 'е').replace(/[ʻʼ']/g, ''));
  const main = `<div class="container">
${crumbs(lang, [[href(lang, '/'), t('Бош саҳифа', 'Главная')], ['', t('Маҳсулотлар каталоги', 'Каталог продуктов')]])}
<div class="catalog-head"><div><h1>${t('Маҳсулотлар каталоги', 'Каталог продуктов')}</h1></div><span class="count">${count(lang, products.length)} · ${t(`${categories.length} тоифа`, `${categories.length} ${ruPlural(categories.length, 'категория', 'категории', 'категорий')}`)}</span></div>
<div class="catalog-tools">
<label class="search">${ICON.search}<span class="visually-hidden">${t('Маҳсулот номи бўйича қидириш', 'Поиск по названию')}</span><input id="search" type="search" placeholder="${t('Маҳсулот номини киритинг…', 'Введите название продукта…')}" autocomplete="off"></label>
<div class="chips" role="group" aria-label="${t('Тоифалар', 'Категории')}"><button type="button" data-filter="" aria-pressed="true">${t('Барчаси', 'Все')}<span>${products.length}</span></button>${categories.map(c => `<button type="button" data-filter="${c.key}" data-name="${esc(c.name)}" aria-pressed="false">${cat(lang, c)}<span>${byCat[c.name].length}</span></button>`).join('')}<a href="${href(lang, '/planned.html')}">${t('Режадаги маҳсулотлар', 'Планируемые продукты')}</a></div>
</div>
<div class="results"><span id="result-count" role="status" data-template="${esc(lang === 'ru' ? 'Найдено: {n}' : t('{n} та маҳсулот', ''))}">${count(lang, products.length)}</span><button type="button" id="reset" hidden>${t('Филтрни тозалаш', 'Сбросить фильтр')} ×</button></div>
<div id="grid">${categories.map(c => `<section class="product-category" data-category="${c.key}" aria-label="${cat(lang, c)}"><div class="category-heading"><h2>${cat(lang, c)}</h2><span class="category-count">${count(lang, byCat[c.name].length)}</span></div><div class="product-grid">${byCat[c.name].map(p => productCard(lang, p, { attrs: ` data-search="${search(p)}"` })).join('')}</div></section>`).join('')}</div>
<div class="empty" id="empty" hidden>${t('Маҳсулот топилмади. Бошқа ном билан қидириб кўринг.', 'Ничего не найдено. Попробуйте другое название.')}</div>
<div class="notice" style="margin:32px 0 16px">${ICON.info}<p>${t('Ҳар бир маҳсулотнинг асл йўриқномаси унинг саҳифасида. Қўллашдан олдин йўриқнома билан танишинг ва мутахассис билан маслаҳатлашинг.', 'Оригинальная инструкция каждого продукта — на его странице. Перед применением ознакомьтесь с инструкцией и проконсультируйтесь со специалистом.')}</p></div>
</div>`;
  return page({
    lang, main, categories, alternates: alternatesOf('/catalog'), active: 'catalog', scripts: ['/catalog.js'],
    title: t('Маҳсулотлар каталоги — Akson Megavit', 'Каталог продуктов — Akson Megavit'),
    description: t(`Akson ва Megavit маҳсулотлари: ${products.length} та биологик фаол қўшимча. Ном бўйича қидирув, тоифалар, суратлар ва буклетлар.`, `Продукты Akson и Megavit: ${products.length} БАД. Поиск по названию, категории, фото и инструкции.`),
    ld: [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: 'https://aksonmegavit.uz' + productPath(lang, p.slug), name: productName(lang, p) })) }]
  });
}

export function about(lang, d) {
  const t = L(lang);
  const { products, categories } = d;
  const main = `<div class="container">
${crumbs(lang, [[href(lang, '/'), t('Бош саҳифа', 'Главная')], ['', t('Биз ҳақимизда', 'О компании')]])}
<section class="hero" style="padding-top:24px"><div class="hero-grid">
<div><span class="eyebrow">Akson Megavit pharmaceutical</span><h1>${t('Биз ҳақимизда', 'О компании')}</h1><p class="lead">${t('Akson ва Megavit корхоналари 2017 йилда ташкил этилган. Фаолиятимиз мижозлар учун юқори технологиялар асосида сифатли биологик фаол қўшимчалар ишлаб чиқаришга қаратилган.', 'Предприятия Akson и Megavit основаны в 2017 году. Наша деятельность — производство качественных биологически активных добавок на основе современных технологий.')}</p>
<div class="hero-actions"><a class="btn btn-primary" href="${href(lang, '/catalog.html')}">${t('Маҳсулотлар билан танишиш', 'Смотреть продукты')} ${ICON.arrow}</a></div></div>
<div class="panel"><div class="big-number">2017</div><p class="muted" style="margin:8px 0 24px">${t('йилдан буён', 'год основания')}</p><div class="stats" style="margin-top:0"><div><strong>${products.length}</strong><span>${t('маҳсулот', 'продуктов')}</span></div><div><strong>${categories.length}</strong><span>${t('тоифа', 'категорий')}</span></div><div><strong>2</strong><span>${t('бренд', 'бренда')}</span></div></div></div>
</div></section>
<div class="feature-list" style="margin-bottom:24px">
<div class="feature">${ICON.flask}<h3>${t('Мақсадимиз', 'Наша цель')}</h3><p>${t('Мижозларга сифатли, юқори технологиялар асосида ишлаб чиқарилган биологик фаол қўшимчаларни тақдим этиш.', 'Предлагать клиентам качественные биологически активные добавки, произведённые по современным технологиям.')}</p></div>
<div class="feature">${ICON.doc}<h3>${t('Очиқ маълумот', 'Открытая информация')}</h3><p>${t('Ҳар бир маҳсулотнинг сурати ва асл қўлланиш буклети каталогда эълон қилинган.', 'Фото и оригинальная инструкция каждого продукта опубликованы в каталоге.')}</p></div>
<div class="feature">${ICON.pin}<h3>${t('Манзилимиз', 'Наш адрес')}</h3><p>${address(lang)}. ${t('Саволлар бўйича телефон орқали боғланинг.', 'По вопросам звоните по телефону.')}</p></div>
</div>
</div>
${ctaBand(t('Биз билан боғланинг', 'Свяжитесь с нами'), t('Маҳсулотлар, буюртма ва ҳамкорлик бўйича саволларга жавоб берамиз.', 'Ответим на вопросы о продуктах, заказе и сотрудничестве.'))}`;
  return page({
    lang, main, categories, alternates: alternatesOf('/about'), active: 'about',
    title: t('Биз ҳақимизда — Akson Megavit pharmaceutical', 'О компании — Akson Megavit pharmaceutical'),
    description: t('Akson ва Megavit корхоналари 2017 йилда ташкил этилган. Биологик фаол қўшимчалар ишлаб чиқариш. Андижон вилояти, Андижон шаҳри.', 'Предприятия Akson и Megavit основаны в 2017 году. Производство биологически активных добавок. Андижанская область, г. Андижан.')
  });
}

export function plannedPage(lang, d) {
  const t = L(lang);
  const { planned, categories } = d;
  const main = `<div class="container">
${crumbs(lang, [[href(lang, '/'), t('Бош саҳифа', 'Главная')], ['', t('Режадаги маҳсулотлар', 'Планируемые продукты')]])}
<div class="catalog-head"><div><span class="eyebrow">${t('Келгуси маҳсулотлар', 'Будущие продукты')}</span><h1 style="margin-top:12px">${t('Ишлаб чиқариш режасидаги маҳсулотлар', 'Продукты в плане производства')}</h1></div><span class="count">${count(lang, planned.length)}</span></div>
<div class="notice">${ICON.clock}<p>${t(`Ушбу ${planned.length} та маҳсулотнинг ишлаб чиқарилиши режалаштирилган. Ишлаб чиқариш бошланиш санаси ҳали эълон қилинмаган.`, `Производство этих продуктов (${planned.length}) запланировано. Дата начала производства пока не объявлена.`)}</p></div>
<div class="planned-grid">${planned.map(p => { const name = esc(productName(lang, p)); return `<article class="planned-card"><div class="photo"><span class="badge">${t('Режада', 'В плане')}</span>${p.image ? `<img src="/${esc(p.image)}" alt="${name} — ${t('қадоқ макети', 'макет упаковки')}" loading="lazy">` : ''}</div><div class="card-text"><h2 style="font-size:16px">${name}</h2><span>${esc(dataText(lang, p.subtitle || '', 'form'))}</span>${p.image ? `<button type="button" data-viewer="/${esc(p.image)}" data-title="${name}">${t('Қадоқ макетини кўриш', 'Смотреть макет упаковки')}</button>` : ''}</div></article>`; }).join('')}</div>
</div>
<dialog class="viewer" id="viewer" data-alt="${t('қадоқ макети', 'макет упаковки')}"><div class="viewer-head"><h2 id="viewer-title"></h2><button type="button" class="icon-btn" id="viewer-close" aria-label="${t('Ёпиш', 'Закрыть')}">${ICON.close}</button></div><div class="viewer-body"><img id="viewer-img" alt=""><p style="margin-top:12px"><a id="viewer-link" target="_blank" rel="noopener">${t('Суратни катта ҳажмда очиш', 'Открыть изображение в полном размере')}</a></p></div></dialog>`;
  return page({
    lang, main, categories, alternates: alternatesOf('/planned'), active: 'planned', scripts: ['/planned.js'],
    title: t('Ишлаб чиқариш режасидаги маҳсулотлар — Akson Megavit', 'Продукты в плане производства — Akson Megavit'),
    description: t(`Akson Megavit ишлаб чиқариш режасидаги ${planned.length} та маҳсулот ва уларнинг қадоқ макетлари.`, `Продукты Akson Megavit в плане производства (${planned.length}) и макеты их упаковки.`)
  });
}

export function contacts(lang, d) {
  const t = L(lang), s = settings();
  const hours = cfgText(lang, 'hours');
  const map = s.map && s.map.lat != null ? s.map : null;
  const mapBox = map ? `<div class="map"><iframe title="${t('Харита', 'Карта')}" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${map.lng - 0.006}%2C${map.lat - 0.004}%2C${map.lng + 0.006}%2C${map.lat + 0.004}&amp;layer=mapnik&amp;marker=${map.lat}%2C${map.lng}"></iframe><p><a href="https://yandex.uz/maps/?pt=${map.lng},${map.lat}&amp;z=17&amp;l=map" target="_blank" rel="noopener">${t('Яндекс Харитада очиш', 'Открыть в Яндекс Картах')} ↗</a> · <a href="https://www.google.com/maps?q=${map.lat},${map.lng}" target="_blank" rel="noopener">Google Maps ↗</a></p></div>` : '';
  const main = `<div class="container">
${crumbs(lang, [[href(lang, '/'), t('Бош саҳифа', 'Главная')], ['', t('Алоқа', 'Контакты')]])}
<div class="catalog-head"><div><h1>${t('Алоқа', 'Контакты')}</h1><p class="lead" style="margin-top:12px">${t('Маҳсулотлар, буюртма ва ҳамкорлик бўйича саволларга жавоб берамиз.', 'Ответим на вопросы о продуктах, заказе и сотрудничестве.')}</p></div></div>
<div class="contact-grid">
<section class="panel"><h2>${t('Телефонлар', 'Телефоны')}</h2><ul class="contact-list">${PHONES.map(([tel, l, p]) => `<li><a class="contact-phone" href="tel:${tel}">${ICON.phone}${l}</a>${phoneNote(lang, p) ? `<span class="muted">${esc(phoneNote(lang, p))}</span>` : ''}</li>`).join('')}</ul>
${s.telegram || s.email ? `<h2 style="margin-top:28px">${t('Ёзиш', 'Написать')}</h2><ul class="contact-list">${s.telegram ? `<li><a class="contact-phone" href="${esc(s.telegram)}" target="_blank" rel="noopener">${ICON.send}Telegram</a></li>` : ''}${s.email ? `<li><a class="contact-phone" href="mailto:${esc(s.email)}">${ICON.mail}${esc(s.email)}</a></li>` : ''}</ul>` : ''}</section>
<section class="panel"><h2>${t('Манзил', 'Адрес')}</h2><p class="lead">${esc(address(lang))}</p>${hours ? `<p><strong>${t('Иш вақти', 'Время работы')}:</strong> ${esc(hours)}</p>` : ''}${mapBox}</section>
</div>
<div class="notice" style="margin:24px 0">${ICON.info}<p>${t('Дорихоналар ва дистрибьюторлар учун алоҳида саҳифа бор:', 'Для аптек и дистрибьюторов есть отдельная страница:')} <a href="${href(lang, '/partners.html')}">${t('Ҳамкорлар учун', 'Партнёрам')}</a>.</p></div>
</div>`;
  return page({
    lang, main, categories: d.categories, alternates: alternatesOf('/contacts'), active: 'contacts',
    title: t('Алоқа — Akson Megavit', 'Контакты — Akson Megavit'),
    description: t(`Akson Megavit билан боғланиш: ${PHONES.map(p => p[1]).join(', ')}. ${address('kr')}.`, `Связаться с Akson Megavit: ${PHONES.map(p => p[1]).join(', ')}. ${address('ru')}.`),
    ld: [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: t('Алоқа', 'Контакты'), url: 'https://aksonmegavit.uz' + href(lang, '/contacts') }]
  });
}

export function partners(lang, d) {
  const t = L(lang);
  const terms = cfgText(lang, 'partners');
  const main = `<div class="container">
${crumbs(lang, [[href(lang, '/'), t('Бош саҳифа', 'Главная')], ['', t('Ҳамкорлар учун', 'Партнёрам')]])}
<section class="hero" style="padding-top:24px"><div class="hero-grid">
<div><span class="eyebrow">${t('Дорихоналар ва дистрибьюторлар учун', 'Для аптек и дистрибьюторов')}</span><h1>${t('Ҳамкорлик', 'Сотрудничество')}</h1><p class="lead">${t('Akson ва Megavit маҳсулотларини дорихонангиз ёки тармоғингизга олмоқчимисиз? Қўнғироқ қилинг — шартлар, нархлар ва етказиб бериш бўйича маълумот берамиз.', 'Хотите добавить продукты Akson и Megavit в свою аптеку или сеть? Позвоните — расскажем об условиях, ценах и доставке.')}</p>
<div class="hero-actions"><a class="btn btn-primary" href="tel:${PHONES[0][0]}">${ICON.phone}${PHONES[0][1]}</a>${settings().telegram ? `<a class="btn btn-outline" href="${esc(settings().telegram)}" target="_blank" rel="noopener">${ICON.send}Telegram</a>` : ''}<a class="btn btn-outline" href="${href(lang, '/catalog.html')}">${t('Каталогни кўриш', 'Смотреть каталог')}</a></div></div>
<div class="panel"><div class="stats" style="margin-top:0;border:0;padding:0"><div><strong>${d.products.length}</strong><span>${t('маҳсулот', 'продуктов')}</span></div><div><strong>${d.categories.length}</strong><span>${t('тоифа', 'категорий')}</span></div><div><strong>${d.planned.length}</strong><span>${t('янги маҳсулот режада', 'новых в плане')}</span></div></div></div>
</div></section>
<div class="feature-list" style="margin-top:0">
<div class="feature">${ICON.flask}<h3>${t('Ишлаб чиқарувчидан', 'От производителя')}</h3><p>${t('Akson ва Megavit маҳсулотлари — биологик фаол қўшимчалар, сироплардан порошокларгача.', 'Продукты Akson и Megavit — биологически активные добавки: от сиропов до порошков.')}</p></div>
<div class="feature">${ICON.doc}<h3>${t('Тайёр маълумот', 'Готовая информация')}</h3><p>${t('Ҳар бир маҳсулотнинг сурати ва асл буклети сайтда — харидорга кўрсатиш учун қулай.', 'Фото и оригинальная инструкция каждого продукта на сайте — удобно показать покупателю.')}</p></div>
<div class="feature">${ICON.truck}<h3>${t('Шартлар бўйича', 'Об условиях')}</h3><p>${t('Минимал буюртма, нарх ва етказиб бериш бўйича телефон орқали маслаҳат берамиз.', 'Минимальный заказ, цены и доставку уточняйте по телефону.')}</p></div>
</div>
${terms ? `<section class="product-text" style="margin-top:40px"><h2>${t('Ҳамкорлик шартлари', 'Условия сотрудничества')}</h2>${paragraphs(terms)}</section>` : ''}
</div>
${ctaBand(t('Ҳамкор бўлинг', 'Станьте партнёром'), t('Қўнғироқ қилинг — ҳамкорлик шартлари бўйича маслаҳат берамиз.', 'Позвоните — расскажем об условиях сотрудничества.'))}`;
  return page({
    lang, main, categories: d.categories, alternates: alternatesOf('/partners'), active: 'partners',
    title: t('Дорихоналар ва дистрибьюторлар учун — Akson Megavit', 'Аптекам и дистрибьюторам — Akson Megavit'),
    description: t('Akson ва Megavit маҳсулотлари бўйича ҳамкорлик: дорихоналар ва дистрибьюторлар учун шартлар ва алоқа.', 'Сотрудничество с Akson и Megavit: условия и контакты для аптек и дистрибьюторов.')
  });
}

// GitHub Pages показывает один 404.html на весь сайт — делаем его на трёх языках сразу.
export function notFound(lang, d) {
  const block = l => { const t = L(l); return `<div lang="${l === 'ru' ? 'ru' : l === 'uz' ? 'uz-Latn' : 'uz-Cyrl'}" style="margin-bottom:32px"><h${l === 'kr' ? 1 : 2}>${t('Саҳифа топилмади', 'Страница не найдена')}</h${l === 'kr' ? 1 : 2}><p class="lead">${t('Бу манзилда саҳифа йўқ ёки у кўчирилган.', 'По этому адресу страницы нет, или она перемещена.')}</p><div class="hero-actions"><a class="btn btn-primary" href="${href(l, '/catalog.html')}">${t('Маҳсулотлар каталоги', 'Каталог продуктов')} ${ICON.arrow}</a><a class="btn btn-outline" href="${href(l, '/')}">${t('Бош саҳифа', 'Главная')}</a></div></div>`; };
  const main = `<div class="container not-found"><span class="eyebrow">404</span>${LANG_ORDER.map(block).join('')}</div>`;
  return page({ lang, main, categories: d.categories, alternates: alternatesOf('/404'), noindex: true, title: 'Саҳифа топилмади / Sahifa topilmadi / Страница не найдена — Akson Megavit', description: '404' });
}
