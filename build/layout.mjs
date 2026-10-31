// Общий каркас всех страниц: <head>, шапка, подвал, нижняя панель звонка.
// Страницы (build/pages.mjs, build/product-page.mjs) передают только содержимое <main>.
// Каждая страница собирается на трёх языках (build/i18n.mjs).
import { LANGS, LANG_ORDER, L, href, dataText, productPath, toLatin, productName } from './i18n.mjs';

export const SITE = 'https://aksonmegavit.uz';

// Контакты и настройки берутся из site.json (вкладка «Настройки сайта» в админке).
// build.mjs вызывает useSettings() до сборки страниц.
let CFG = {};
export const PHONES = [];   // [tel, '91 274 00 00', {label, label_ru}]
export const phoneLabel = n => { const d = String(n).replace(/\D/g, '').replace(/^998/, ''); return d.length === 9 ? d.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4') : n; };
export function useSettings(s) {
  CFG = s || {};
  PHONES.splice(0, PHONES.length, ...(CFG.phones || []).map(p => [p.number, phoneLabel(p.number), p]));
  if (!PHONES.length) throw new Error('site.json: нужен хотя бы один телефон');
}
export const settings = () => CFG;
// Текст настроек на языке страницы: узбекский хранится кириллицей, русский — в поле *_ru.
export const cfgText = (lang, key) => lang === 'ru' ? (CFG[key + '_ru'] || '') : lang === 'uz' ? toLatin(CFG[key] || '') : (CFG[key] || '');
export const address = lang => cfgText(lang, 'address') || L(lang)('Андижон вилояти, Андижон шаҳри', 'Андижанская область, г. Андижан');
export const phoneNote = (lang, p) => lang === 'ru' ? (p.label_ru || '') : lang === 'uz' ? toLatin(p.label || '') : (p.label || '');

export const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Ссылка на категорию в каталоге: ?category=<латинский ключ>
export const catalogUrl = (lang, cat) => href(lang, '/catalog.html') + (cat ? '?category=' + cat.key : '');

// Иконки (24×24, обводка) — без внешних библиотек.
const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const ICON = {
  phone: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
  doc: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
  pin: svg('<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0z"/><circle cx="12" cy="10" r="2.5"/>'),
  flask: svg('<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  send: svg('<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  truck: svg('<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>'),
  globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>')
};

const logos = `<img class="logo-akson" src="/assets/brands/akson.webp" width="680" height="158" alt="Akson Pharmaceutical company"><span class="logo-divider" aria-hidden="true"></span><img class="logo-megavit" src="/assets/brands/megavit.webp" width="460" height="307" alt="MegavitFarm">`;

function header(lang, active, alternates) {
  const t = L(lang);
  const nav = [['/catalog.html', t('Каталог', 'Каталог'), 'catalog'], ['/about.html', t('Биз ҳақимизда', 'О компании'), 'about'], ['/partners.html', t('Ҳамкорлар учун', 'Партнёрам'), 'partners'], ['/contacts.html', t('Алоқа', 'Контакты'), 'contacts']];
  const langs = LANG_ORDER.map(l => `<a href="${alternates[l]}" hreflang="${LANGS[l].hreflang}" lang="${LANGS[l].html}" title="${LANGS[l].name}"${l === lang ? ' aria-current="true"' : ''}>${LANGS[l].label}</a>`).join('');
  return `<a class="skip" href="#main">${t('Асосий матнга ўтиш', 'Перейти к содержанию')}</a>
<header class="site-header"><div class="container header-inner">
<a class="brand" href="${href(lang, '/')}" aria-label="Akson Megavit — ${t('бош саҳифа', 'главная')}">${logos}</a>
<nav class="site-nav" id="site-nav" aria-label="${t('Асосий меню', 'Основное меню')}">${nav.map(([p, label, key]) => `<a href="${href(lang, p)}"${key === active ? ' aria-current="page"' : ''}>${label}</a>`).join('')}<button type="button" class="nav-theme theme-toggle" data-theme-toggle><span class="sun">${ICON.sun}</span><span class="moon">${ICON.moon}</span>${t('Тунги / кундузги режим', 'Тёмная / светлая тема')}</button></nav>
<div class="header-tools">
<nav class="lang-switch" aria-label="${t('Тил', 'Язык')}">${langs}</nav>
<button type="button" class="icon-btn theme-toggle" data-theme-toggle aria-label="${t('Тунги / кундузги режим', 'Тёмная / светлая тема')}"><span class="sun">${ICON.sun}</span><span class="moon">${ICON.moon}</span></button>
<a class="btn btn-primary btn-sm header-call" href="tel:${PHONES[0][0]}">${ICON.phone}${PHONES[0][1]}</a>
<button type="button" class="icon-btn menu-toggle" data-menu-toggle aria-controls="site-nav" aria-expanded="false" aria-label="${t('Менюни очиш', 'Открыть меню')}" data-label-open="${t('Менюни очиш', 'Открыть меню')}" data-label-close="${t('Менюни ёпиш', 'Закрыть меню')}"><span class="open-icon">${ICON.menu}</span><span class="close-icon">${ICON.close}</span></button>
</div>
</div></header>`;
}

function footer(lang, categories) {
  const t = L(lang);
  return `<footer class="site-footer" id="contacts"><div class="container">
<div class="footer-grid">
<div class="footer-about"><a class="brand" href="${href(lang, '/')}" aria-label="Akson Megavit — ${t('бош саҳифа', 'главная')}">${logos}</a><p>${t('Akson ва Megavit — 2017 йилдан буён биологик фаол қўшимчалар ишлаб чиқаради.', 'Akson и Megavit с 2017 года производят биологически активные добавки.')}</p></div>
<div><h2>${t('Боғланиш', 'Контакты')}</h2><ul class="footer-phones">${PHONES.map(([tel, l]) => `<li><a href="tel:${tel}">${l}</a></li>`).join('')}</ul><ul style="margin-top:12px">${CFG.telegram ? `<li><a href="${esc(CFG.telegram)}" target="_blank" rel="noopener">Telegram</a></li>` : ''}${CFG.email ? `<li><a href="mailto:${esc(CFG.email)}">${esc(CFG.email)}</a></li>` : ''}<li class="muted">${esc(address(lang))}</li>${cfgText(lang, 'hours') ? `<li class="muted">${esc(cfgText(lang, 'hours'))}</li>` : ''}<li><a href="${href(lang, '/contacts.html')}">${t('Барча алоқа маълумотлари', 'Все контакты')} →</a></li></ul></div>
<div><h2>${t('Каталог', 'Каталог')}</h2><ul>${categories.map(c => `<li><a href="${esc(catalogUrl(lang, c))}">${esc(dataText(lang, c.name, 'category'))}</a></li>`).join('')}<li><a href="${href(lang, '/planned.html')}">${t('Режадаги маҳсулотлар', 'Планируемые продукты')}</a></li><li><a href="${href(lang, '/partners.html')}">${t('Дорихоналар ва дистрибьюторлар учун', 'Аптекам и дистрибьюторам')}</a></li></ul></div>
</div>
<div class="footer-bottom"><span>© <span id="year">${new Date().getFullYear()}</span> Akson Megavit pharmaceutical</span><span>${t('Биологик фаол қўшимча дори воситаси ҳисобланмайди.', 'БАД не является лекарственным средством.')}</span></div>
</div></footer>
<div class="call-bar"><a class="btn btn-primary" href="tel:${PHONES[0][0]}">${ICON.phone}${t('Қўнғироқ қилиш', 'Позвонить')}</a>${CFG.telegram
    ? `<a class="btn btn-outline" href="${esc(CFG.telegram)}" target="_blank" rel="noopener">${ICON.send}Telegram</a>`
    : `<a class="btn btn-outline" href="${href(lang, '/catalog.html')}">${t('Каталог', 'Каталог')}</a>`}</div>`;
}

const orgLd = lang => ({
  '@context': 'https://schema.org', '@type': 'Organization', name: 'Akson Megavit', url: SITE + '/', logo: SITE + '/favicon-512.png',
  telephone: PHONES.map(p => p[0]), ...(CFG.email ? { email: CFG.email } : {}), ...(CFG.telegram ? { sameAs: [CFG.telegram] } : {}),
  address: { '@type': 'PostalAddress', addressLocality: L(lang)('Андижон', 'Андижан'), addressCountry: 'UZ', ...(cfgText(lang, 'address') ? { streetAddress: cfgText(lang, 'address') } : {}) }
});

// Аналитика включается, только когда в site.json указаны номера счётчиков.
// Нажатия на телефон и Telegram отправляются как цели (theme.js → window.track).
function analytics() {
  const a = CFG.analytics || {};
  let out = '';
  if (a.ga4) out += `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(a.ga4)}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${esc(a.ga4)}');</script>`;
  if (a.yandex) out += `<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${Number(a.yandex)},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});window.YM_ID=${Number(a.yandex)};</script>`;
  return out;
}

// alternates: { kr: '/catalog', uz: '/uz/catalog', ru: '/ru/catalog' } — один и тот же адрес на всех языках.
export function page({ lang, title, description, alternates, active = '', main, categories, ld = [], ogType = 'website', ogImage, scripts = [], noindex = false, extraHead = '' }) {
  const t = L(lang);
  const url = SITE + alternates[lang];
  const image = ogImage || SITE + '/assets/og/og-image.jpg';
  const jsonLd = [orgLd(lang), ...ld];
  const links = LANG_ORDER.map(l => `<link rel="alternate" hreflang="${LANGS[l].hreflang}" href="${SITE + alternates[l]}">`).join('') + `<link rel="alternate" hreflang="x-default" href="${SITE + alternates.kr}">`;
  return `<!doctype html>
<html lang="${LANGS[lang].html}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<script>try{document.documentElement.dataset.theme=localStorage.getItem("akson-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}</script>
<link rel="preload" href="/assets/fonts/${lang === 'uz' ? 'manrope-latin' : 'manrope-cyrillic'}.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/site.css">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}"><meta name="robots" content="index,follow">${links}`}
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:type" content="${ogType}"><meta property="og:image" content="${esc(image)}"><meta property="og:site_name" content="Akson Megavit"><meta property="og:locale" content="${LANGS[lang].og}"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#16204a">
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48"><link rel="icon" type="image/png" href="/favicon-48.png" sizes="48x48"><link rel="icon" type="image/png" href="/favicon-192.png" sizes="192x192"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
${extraHead}${noindex ? '' : analytics()}<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
</head>
<body>
${header(lang, active, alternates)}
<main id="main">
${main}
</main>
${footer(lang, categories)}
<script src="/theme.js" defer></script>${scripts.map(s => `<script src="${s}" defer></script>`).join('')}
</body></html>
`;
}

// Карточка товара — одинаковая в каталоге, на главной и в «похожих».
export function productCard(lang, p, { attrs = '' } = {}) {
  const name = productName(lang, p);
  const img = p.image
    ? `<img loading="lazy" src="/${esc(p.thumb || p.image)}"${p.srcset ? ` srcset="${esc(p.srcset.replace(/(^|, )assets\//g, '$1/assets/'))}" sizes="(max-width:640px) 45vw, 280px"` : ''} alt="${esc(name)}" width="400" height="400">`
    : `<span class="placeholder">${L(lang)('Сурат тайёрланмоқда', 'Фото готовится')}</span>`;
  return `<a class="card" href="${productPath(lang, p.slug)}"${attrs}><div class="photo">${img}</div><div class="card-text"><h3>${esc(name)}</h3><span>${esc(dataText(lang, p.form, 'form') || dataText(lang, p.category, 'category'))}</span></div></a>`;
}
