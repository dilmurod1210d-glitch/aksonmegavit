// Языки сайта. Тексты пишутся один раз: на узбекском (кириллица) и русском.
// Узбекская латиница получается автоматически транслитерацией кириллицы.
//   kr — ўзбекча (кирилл), корень сайта: /
//   uz — oʻzbekcha (lotin):  /uz/
//   ru — русский:            /ru/
export const LANGS = {
  kr: { prefix: '', html: 'uz-Cyrl', hreflang: 'uz-Cyrl', og: 'uz_UZ', label: 'Ўз', name: 'Ўзбекча (кирилл)', product: 'mahsulot' },
  uz: { prefix: '/uz', html: 'uz-Latn', hreflang: 'uz-Latn', og: 'uz_UZ', label: 'Oʻz', name: 'Oʻzbekcha (lotin)', product: 'mahsulot' },
  ru: { prefix: '/ru', html: 'ru', hreflang: 'ru', og: 'ru_RU', label: 'Ру', name: 'Русский', product: 'product' }
};
export const LANG_ORDER = ['kr', 'uz', 'ru'];

// Транслитерация узбекской кириллицы в латиницу (правила 1995 г.):
// «е» в начале слова и после гласной — ye, «ц» — ts, «ў» — oʻ, «ғ» — gʻ, «ъ» — ʼ.
const VOWELS = 'аеёиоуэюяўАЕЁИОУЭЮЯЎ';
const MAP = { а:'a',б:'b',в:'v',г:'g',д:'d',ё:'yo',ж:'j',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'x',ц:'ts',ч:'ch',ш:'sh',щ:'sh',ъ:'ʼ',ы:'i',ь:'',э:'e',ю:'yu',я:'ya',ў:'oʻ',қ:'q',ғ:'gʻ',ҳ:'h' };
const isCyr = c => /[Ѐ-ӿ]/.test(c);
const isUpper = c => c !== c.toLowerCase();
export function toLatin(text) {
  const s = String(text == null ? '' : text);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (!isCyr(c)) { out += c; continue; }
    const lo = c.toLowerCase(), prev = s[i - 1] || '', next = s[i + 1] || '';
    let r;
    if (lo === 'е') r = (!prev || !isCyr(prev) || VOWELS.includes(prev) || 'ъьЪЬ'.includes(prev)) ? 'ye' : 'e';
    else r = MAP[lo] != null ? MAP[lo] : lo;
    if (isUpper(c) && r) {
      // «Ш» в слове из заглавных → «SH», иначе «Sh»
      const word = isUpper(next) && isCyr(next) || (isUpper(prev) && isCyr(prev) && !next.trim());
      r = word ? r.toUpperCase() : r[0].toUpperCase() + r.slice(1);
    }
    out += r;
  }
  return out;
}

// Категории товаров (как в products.json) → русский. Новую категорию из админки
// без перевода показываем как есть.
const CATEGORY_RU = {
  'Сироплар': 'Сиропы', 'Спрейлар': 'Спреи', 'Таблетка ва капсулалар': 'Таблетки и капсулы',
  'Томчилар': 'Капли', 'Саше ва порошоклар': 'Саше и порошки'
};
// Короткие подписи вида «Таблетка · 24 дона» → по-русски.
const WORDS_RU = [[/\bдона\b/g, 'шт.'], [/\bкапсула\b/g, 'капсул'], [/\bТаблетка\b/g, 'Таблетки']];

// Перевод текста из данных (название, категория, форма) на язык страницы.
export function dataText(lang, text, kind) {
  if (!text) return text;
  if (lang === 'uz') return toLatin(text);
  if (lang === 'ru') {
    if (kind === 'category') return CATEGORY_RU[text] || text;
    if (kind === 'form') return WORDS_RU.reduce((s, [re, to]) => s.replace(re, to), text);
  }
  return text;
}

// L(lang)('текст на кириллице', 'русский текст') — строка интерфейса.
export const L = lang => (kr, ru) => lang === 'ru' ? ru : lang === 'uz' ? toLatin(kr) : kr;

// Ссылки внутри сайта для языка: href('ru', '/catalog.html') → '/ru/catalog.html'
export const href = (lang, path) => LANGS[lang].prefix + path;
export const productPath = (lang, slug) => `${LANGS[lang].prefix}/${LANGS[lang].product}/${slug}/`;
