// Презентация препарата для врачей: /mahsulot/<slug>/taqdimot/ (и /uz/…, /ru/product/<slug>/presentation/).
// Слайды собираются из текста оригинального буклета (leaflet-text/<slug>.json).
// Листание: стрелки, пробел, свайп; «Печать» сохраняет в PDF — по слайду на страницу.
import { esc, PHONES, settings, phoneNote } from './layout.mjs';
import { L, LANGS, LANG_ORDER, dataText, productName, productPath, toLatin } from './i18n.mjs';

export const presentationPath = (lang, slug) => productPath(lang, slug) + (lang === 'ru' ? 'presentation/' : 'taqdimot/');

// Текст буклета на языке страницы: латиница — транслитерация узбекского текста.
// Если буклет только на русском, узбекские версии показывают русский текст как есть
// (медицинский текст сами не переводим) — с пометкой на слайдах.
const pick = (info, lang) => {
  if (lang !== 'ru' && !info.kr && info.ru) return Object.assign({ _original: true }, info.ru);
  const src = lang === 'ru' ? info.ru : info.kr;
  if (!src) return null;
  if (lang !== 'uz') return src;
  const out = {};
  for (const [k, v] of Object.entries(src)) out[k] = Array.isArray(v) ? v.map(toLatin) : typeof v === 'string' ? toLatin(v) : v;
  return out;
};
const paras = t => String(t).split('\n').map(s => `<p>${esc(s)}</p>`).join('');
const list = a => `<ul>${a.map(s => `<li>${esc(s)}</li>`).join('')}</ul>`;
// Длинный раздел делится на несколько слайдов: строки/пункты набираются, пока не превышен
// объём одного слайда (в символах); остаток мелкого переполнения подгоняет presentation.js.
const chunk = (items, max, maxN = 8) => items.reduce((out, it) => {
  const last = out[out.length - 1];
  if (last && last.length < maxN && last.join('').length + it.length <= max) last.push(it); else out.push([it]);
  return out;
}, []);
const lines = t => String(t).split('\n').filter(Boolean);

export function presentationPage(lang, p) {
  const t = L(lang), i = pick(p.info, lang);
  if (!i) return null;
  const name = productName(lang, p), category = dataText(lang, p.category, 'category');
  const form = dataText(lang, p.form, 'form');
  const brand = p.brand || '';   // бренд — только если указан в админке
  const tone = p.tone || 1;
  // «Не является лекарственным средством» — только если это написано в самом буклете
  const notDrug = /не является лекарствен|ҳисобланмайди|биологически активн|биологик фаол|дори воситаси эмас/i.test(JSON.stringify(p.info));

  const orig = i._original ? `<span class="orig">${t('Матн асл йўриқномадан (рус тилида)', '')}</span>` : '';
  const slide = (title, body, extra = '') => `<section class="slide ${extra}"><header><span class="tag">${esc(name)}</span><h2>${title}</h2>${orig}</header><div class="body"><div class="fit">${body}</div></div></section>`;
  // Раздел на нескольких слайдах: «Показания (1/2)», «Показания (2/2)»
  const series = (title, parts, render, extra) => parts.map((part, k) => slide(parts.length > 1 ? `${title} <small>${k + 1}/${parts.length}</small>` : title, render(part), extra));
  const box = (h, text, cls = '') => text ? `<div class="box ${cls}">${h ? `<h3>${h}</h3>` : ''}<p>${esc(text)}</p></div>` : '';
  const leaflets = (p.leaflets || []).slice(0, 3);
  const slides = [
    `<section class="slide cover"><div class="cover-text">
      <span class="kicker">${t('Шифокорлар учун маълумот', 'Информация для врачей')}</span>
      <h1>${esc(name)}</h1>
      <p class="sub">${[brand, category, form].filter(Boolean).map(esc).join(' · ')}</p>
      ${i.tagline ? `<p class="tagline">${esc(i.tagline)}</p>` : ''}
      ${i.badges ? `<p class="badges">${i.badges.map(b => `<span>${esc(b)}</span>`).join('')}</p>` : ''}
      ${i.description ? `<p class="desc">${esc(i.description)}</p>` : ''}
      ${notDrug ? `<p class="note">${t('Биологик фаол қўшимча. Дори воситаси эмас.', 'Биологически активная добавка. Не является лекарственным средством.')}</p>` : ''}
    </div><div class="cover-photo">${p.image ? `<img src="/${esc(p.image)}" alt="${esc(name)}">` : ''}</div></section>`,
    ...((i.composition || i.chemistry) ? series(t('Таркиби', 'Состав'),
      (i.composition || '').length + (i.chemistry || '').length > 550 && i.composition && i.chemistry ? [['c'], ['h']] : [['c', 'h']],
      part => `${part.includes('c') && i.composition ? `<div class="box latin">${paras(i.composition)}</div>` : ''}${part.includes('h') ? box(t('Кимёвий таркиби', 'Химический состав'), i.chemistry) : ''}`) : []),
    ...(i.action ? series(t('Таъсири', 'Действие'), chunk(Array.isArray(i.action) ? i.action : lines(i.action), 600), part => list(part), 'cols') : []),
    ...(i.indications ? series(t('Қўлланилиши', 'Показания'), chunk(lines(i.indications), 540, 7), part => paras(part.join('\n')), 'big') : []),
    ...((i.dosage || i.course) ? (() => {
      const parts = chunk(lines(i.dosage || ''), 560);
      if (!parts.length) parts.push([]);
      return series(t('Қўллаш усули ва дозалари', 'Способ применения и дозы'), parts,
        part => `${part.length ? `<div class="box">${paras(part.join('\n'))}</div>` : ''}${part === parts[parts.length - 1] ? box(t('Даволаниш муддати', 'Курс лечения'), i.course, 'accent') : ''}`);
    })() : []),
    ...((i.contraindications || i.side_effects) ? series(t('Хавфсизлик', 'Безопасность'),
      (i.contraindications || '').length + (i.side_effects || '').length > 560 && i.contraindications && i.side_effects ? [['c'], ['s']] : [['c', 's']],
      part => `${part.includes('c') && i.contraindications ? `<div class="box warn"><h3>${t('Қарши кўрсатмалар', 'Противопоказания')}</h3>${paras(i.contraindications)}</div>` : ''}${part.includes('s') && i.side_effects ? `<div class="box"><h3>${t('Ножўя таъсирлари', 'Побочные действия')}</h3>${paras(i.side_effects)}</div>` : ''}`) : []),
    (i.release_form || i.storage || i.shelf_life || i.dispensing) && slide(t('Чиқарилиш шакли ва сақлаш', 'Форма выпуска и хранение'),
      `<dl class="facts">${[[t('Чиқарилиш шакли', 'Форма выпуска'), i.release_form], [t('Сақлаш шароити', 'Условия хранения'), i.storage], [t('Яроқлилик муддати', 'Срок годности'), i.shelf_life], [t('Дорихоналардан бериш тартиби', 'Условия отпуска из аптек'), i.dispensing]].filter(x => x[1]).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`),
    leaflets.length && `<section class="slide leaflet-slide"><header><span class="tag">${esc(name)}</span><h2>${t('Асл буклет ва қадоқ', 'Оригинальный буклет и упаковка')}</h2></header><div class="leaflet-row">${p.image ? `<figure class="pack-fig"><img src="/${esc(p.image)}" alt="${esc(name)}"></figure>` : ''}${leaflets.map((l, k) => `<figure><img src="/${esc(l)}" alt="${esc(name)} — ${t('буклет', 'буклет')} ${k + 1}" loading="lazy"></figure>`).join('')}</div></section>`,
    `<section class="slide end"><div>
      <span class="kicker">Akson Megavit pharmaceutical</span>
      <h2>${t('Саволлар бўлса, боғланинг', 'Остались вопросы? Свяжитесь с нами')}</h2>
      <p class="phones">${PHONES.map(ph => esc(ph[1]) + (phoneNote(lang, ph[2]) ? ` (${esc(phoneNote(lang, ph[2]))})` : '')).join(' · ')}</p>
      ${settings().email ? `<p>${esc(settings().email)}</p>` : ''}
      <p class="site">aksonmegavit.uz</p>
      ${i.manufacturer ? `<p class="maker">${t('Ишлаб чиқарувчи', 'Производитель')}: ${esc(i.manufacturer)}</p>` : ''}
      ${i.approval ? `<p class="maker">${esc(i.approval)}</p>` : ''}
      <p class="note">${t('Маълумот маҳсулотнинг асл йўриқномасидан олинган.', 'Информация взята из оригинальной инструкции продукта.')}</p>
    </div></section>`
  ].filter(Boolean);

  const total = slides.length;
  const alternates = Object.fromEntries(LANG_ORDER.map(l => [l, presentationPath(l, p.slug)]));
  return `<!doctype html>
<html lang="${LANGS[lang].html}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)} — ${t('шифокорлар учун презентация', 'презентация для врачей')} | Akson Megavit</title>
<meta name="robots" content="noindex">
<link rel="preload" href="/assets/fonts/${lang === 'uz' ? 'manrope-latin' : 'manrope-cyrillic'}.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/site.css"><link rel="stylesheet" href="/presentation.css">
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
</head>
<body class="deck-page" data-tone="${tone}">
<div class="deck-bar">
<a class="deck-back" href="${productPath(lang, p.slug)}">← ${esc(name)}</a>
<span class="deck-langs">${LANG_ORDER.map(l => `<a href="${alternates[l]}"${l === lang ? ' aria-current="true"' : ''}>${LANGS[l].label}</a>`).join('')}</span>
<span class="deck-count"><b id="cur">1</b> / ${total}</span>
<button type="button" id="prev" aria-label="${t('Олдинги', 'Назад')}">‹</button><button type="button" id="next" aria-label="${t('Кейинги', 'Далее')}">›</button>
<button type="button" id="full">${t('Тўлиқ экран', 'Во весь экран')}</button><button type="button" id="print">${t('PDF / Чоп этиш', 'PDF / Печать')}</button>
</div>
<main class="deck" id="deck">${slides.join('\n')}</main>
<script src="/presentation.js" defer></script>
</body></html>
`;
}
