// Общий каркас всех страниц: <head>, шапка, подвал, нижняя панель звонка.
// Страницы (build/pages.mjs, build/product-page.mjs) передают только содержимое <main>.
export const SITE = 'https://aksonmegavit.uz';
export const PHONES = [['+998912740000', '91 274 00 00'], ['+998975840000', '97 584 00 00'], ['+998902547000', '90 254 70 00']];
export const ADDRESS = 'Андижон вилояти, Андижон шаҳри';

export const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const catalogUrl = cat => '/catalog.html' + (cat ? '?category=' + encodeURIComponent(cat) : '');

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
  leaf: svg('<path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 12-4 16-9 16z"/><path d="M4 20c4-4 7-6 11-8"/>'),
  doc: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
  pin: svg('<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0z"/><circle cx="12" cy="10" r="2.5"/>'),
  flask: svg('<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')
};

const NAV = [['/catalog.html', 'Каталог', 'catalog'], ['/about.html', 'Биз ҳақимизда', 'about'], ['/planned.html', 'Режадаги маҳсулотлар', 'planned'], ['#contacts', 'Алоқа', '']];

const logos = `<img class="logo-akson" src="/assets/brands/akson.webp" width="680" height="158" alt="Akson Pharmaceutical company"><span class="logo-divider" aria-hidden="true"></span><img class="logo-megavit" src="/assets/brands/megavit.webp" width="460" height="307" alt="MegavitFarm">`;

function header(active) {
  return `<a class="skip" href="#main">Асосий матнга ўтиш</a>
<header class="site-header"><div class="container header-inner">
<a class="brand" href="/" aria-label="Akson Megavit — бош саҳифа">${logos}</a>
<nav class="site-nav" id="site-nav" aria-label="Асосий меню">${NAV.map(([href, label, key]) => `<a href="${href}"${key && key === active ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
<div class="header-tools">
<button type="button" class="icon-btn theme-toggle" data-theme-toggle aria-label="Тунги / кундузги режим"><span class="sun">${ICON.sun}</span><span class="moon">${ICON.moon}</span></button>
<a class="btn btn-primary btn-sm header-call" href="tel:${PHONES[0][0]}">${ICON.phone}${PHONES[0][1]}</a>
<button type="button" class="icon-btn menu-toggle" data-menu-toggle aria-controls="site-nav" aria-expanded="false" aria-label="Менюни очиш"><span class="open-icon">${ICON.menu}</span><span class="close-icon">${ICON.close}</span></button>
</div>
</div></header>`;
}

function footer(categories) {
  return `<footer class="site-footer" id="contacts"><div class="container">
<div class="footer-grid">
<div class="footer-about"><a class="brand" href="/" aria-label="Akson Megavit — бош саҳифа">${logos}</a><p>Akson ва Megavit — 2017 йилдан буён биологик фаол қўшимчалар ишлаб чиқаради. ${ADDRESS}.</p></div>
<div><h2>Боғланиш</h2><ul class="footer-phones">${PHONES.map(([t, l]) => `<li><a href="tel:${t}">${l}</a></li>`).join('')}</ul><p class="muted" style="margin-top:12px">${ADDRESS}</p></div>
<div><h2>Каталог</h2><ul>${categories.map(c => `<li><a href="${esc(catalogUrl(c))}">${esc(c)}</a></li>`).join('')}<li><a href="/planned.html">Режадаги маҳсулотлар</a></li></ul></div>
</div>
<div class="footer-bottom"><span>© <span id="year">${new Date().getFullYear()}</span> Akson Megavit pharmaceutical</span><span>Биологик фаол қўшимча дори воситаси ҳисобланмайди.</span></div>
</div></footer>
<div class="call-bar"><a class="btn btn-primary" href="tel:${PHONES[0][0]}">${ICON.phone}Қўнғироқ қилиш</a><a class="btn btn-outline" href="/catalog.html">Каталог</a></div>`;
}

const ORG_LD = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Akson Megavit', url: SITE + '/', logo: SITE + '/favicon-512.png', telephone: PHONES.map(p => p[0]), address: { '@type': 'PostalAddress', addressLocality: 'Андижон', addressRegion: 'Андижон вилояти', addressCountry: 'UZ' } };

export function page({ title, description, path, active = '', bodyClass = '', main, categories, ld = [], ogType = 'website', ogImage, scripts = [], noindex = false, extraHead = '' }) {
  const url = SITE + path;
  const image = ogImage || SITE + '/assets/og/og-image.jpg';
  const jsonLd = [ORG_LD, ...ld];
  return `<!doctype html>
<html lang="uz-Cyrl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<script>try{document.documentElement.dataset.theme=localStorage.getItem("akson-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}</script>
<link rel="preload" href="/assets/fonts/manrope-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/site.css">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}"><meta name="robots" content="index,follow">`}
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:type" content="${ogType}"><meta property="og:image" content="${esc(image)}"><meta property="og:site_name" content="Akson Megavit"><meta property="og:locale" content="uz_UZ"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#16204a">
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48"><link rel="icon" type="image/png" href="/favicon-48.png" sizes="48x48"><link rel="icon" type="image/png" href="/favicon-192.png" sizes="192x192"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
${extraHead}<script type="application/ld+json">${JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd).replace(/</g, '\\u003c')}</script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${header(active)}
<main id="main">
${main}
</main>
${footer(categories)}
<script src="/theme.js" defer></script>${scripts.map(s => `<script src="${s}" defer></script>`).join('')}
</body></html>
`;
}

// Карточка товара — одинаковая в каталоге, на главной и в «похожих».
export function productCard(p, { sizes = '(max-width:640px) 45vw, 280px', heading = 'h3' } = {}) {
  const img = p.image
    ? `<img loading="lazy" src="/${esc(p.thumb || p.image)}"${p.srcset ? ` srcset="${esc(p.srcset.replace(/(^|, )assets\//g, '$1/assets/'))}" sizes="${sizes}"` : ''} alt="${esc(p.name)}" width="400" height="400">`
    : '<span class="placeholder">Сурат тайёрланмоқда</span>';
  return `<a class="card" href="/${p.url}"><div class="photo">${img}</div><div class="card-text"><${heading}>${esc(p.name)}</${heading}><span>${esc(p.form || p.category)}</span></div></a>`;
}
