// Иллюстрации категорий для плиток на главной (вместо фото конкретного товара).
// Цвета берутся из цвета категории (data-tone): .i-main — насыщенный, .i-dark — тёмный,
// .i-soft — белый, .i-shade — тень. Ключ — латинский ключ категории (см. build.mjs).
const svg = body => `<svg class="cat-illustration" viewBox="0 0 120 120" aria-hidden="true"><ellipse class="i-shade" cx="60" cy="110" rx="36" ry="6"/>${body}</svg>`;

const ART = {
  // Сироп: бутылка с крышкой, этикетка с каплей и мерная ложка
  siroplar: svg(`
    <rect class="i-dark" x="45" y="8" width="30" height="14" rx="4"/>
    <rect class="i-dark" x="49" y="22" width="22" height="6"/>
    <path class="i-main" d="M47 28h26v8c11 4 17 12 17 24v38a9 9 0 0 1-9 9H39a9 9 0 0 1-9-9V60c0-12 6-20 17-24z"/>
    <path class="i-hl" d="M37 76V60c0-7 3-12 9-15"/>
    <rect class="i-soft" x="38" y="62" width="44" height="32" rx="7"/>
    <path class="i-main" d="M60 67c5 7 8 10 8 15a8 8 0 0 1-16 0c0-5 3-8 8-15z"/>
    <path class="i-dark" d="M88 96c6 0 10-3 10-7s-4-7-10-7-10 3-10 7l-8 12 4 2z" transform="rotate(-20 88 90)"/>`),
  // Спрей: распылитель, облачко брызг, флакон с крестиком
  spreylar: svg(`
    <circle class="i-main" cx="92" cy="18" r="3"/><circle class="i-main" cx="100" cy="26" r="2.5"/><circle class="i-main" cx="98" cy="12" r="2"/><circle class="i-main" cx="106" cy="18" r="2"/>
    <rect class="i-dark" x="48" y="12" width="26" height="14" rx="4"/>
    <rect class="i-dark" x="72" y="15" width="12" height="6" rx="2"/>
    <rect class="i-dark" x="54" y="26" width="14" height="9"/>
    <rect class="i-main" x="38" y="35" width="46" height="70" rx="11"/>
    <path class="i-hl" d="M45 92V50"/>
    <rect class="i-soft" x="46" y="55" width="30" height="34" rx="6"/>
    <path class="i-main" d="M57 62h8v6h6v8h-6v6h-8v-6h-6v-8h6z"/>`),
  // Таблетки и капсулы
  'tabletka-va-kapsulalar': svg(`
    <g transform="rotate(-35 46 54)"><rect class="i-main" x="16" y="42" width="60" height="24" rx="12"/><path class="i-soft" d="M46 42h18a12 12 0 0 1 0 24H46z"/><path class="i-hl" d="M24 50h14"/></g>
    <g transform="rotate(28 82 74)"><rect class="i-dark" x="60" y="64" width="46" height="20" rx="10"/><path class="i-main" d="M83 64h13a10 10 0 0 1 0 20H83z"/></g>
    <circle class="i-soft i-ring" cx="40" cy="88" r="16"/><path class="i-line" d="M29 88h22"/>
    <circle class="i-main" cx="78" cy="30" r="9"/><path class="i-line-soft" d="M72 30h12"/>`),
  // Капли: флакон с пипеткой и падающие капли
  tomchilar: svg(`
    <path class="i-dark" d="M50 8h20a6 6 0 0 1 6 6v10H44V14a6 6 0 0 1 6-6z"/>
    <rect class="i-dark" x="46" y="24" width="28" height="8" rx="2"/>
    <path class="i-main" d="M40 34h40v62a10 10 0 0 1-10 10H50a10 10 0 0 1-10-10z"/>
    <path class="i-hl" d="M47 92V46"/>
    <rect class="i-soft" x="47" y="52" width="26" height="30" rx="6"/>
    <path class="i-main" d="M60 57c4 6 6 8 6 12a6 6 0 0 1-12 0c0-4 2-6 6-12z"/>
    <path class="i-main" d="M96 52c4 6 6 8 6 12a6 6 0 0 1-12 0c0-4 2-6 6-12z"/>
    <path class="i-dark" d="M100 78c3 4 4 6 4 8a4 4 0 0 1-8 0c0-2 1-4 4-8z"/>
    <path class="i-main" d="M20 64c3 5 5 7 5 10a5 5 0 0 1-10 0c0-3 2-5 5-10z"/>`),
  // Саше и порошки: пакетик с зубчатым краем и горка порошка
  'sashe-va-poroshoklar': svg(`
    <g transform="rotate(-8 50 56)">
      <path class="i-main" d="M24 22l5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6v74H24z"/>
      <rect class="i-dark" x="24" y="22" width="50" height="8"/>
      <rect class="i-soft" x="31" y="42" width="36" height="34" rx="6"/>
      <path class="i-main" d="M45 50h8v6h6v8h-6v6h-8v-6h-6v-8h6z"/>
      <path class="i-hl" d="M30 88V40"/>
    </g>
    <path class="i-dark" d="M64 104c2-14 10-22 20-22s18 8 20 22z"/>
    <circle class="i-main" cx="78" cy="78" r="2.5"/><circle class="i-main" cx="90" cy="74" r="2"/><circle class="i-main" cx="96" cy="80" r="1.8"/>`)
};

// Для новой категории без своей картинки — нейтральная коробочка.
const FALLBACK = svg(`
  <path class="i-main" d="M30 40l30-14 30 14v48L60 102 30 88z"/>
  <path class="i-dark" d="M60 54v48L30 88V40z"/>
  <path class="i-soft" d="M30 40l30 14 30-14-30-14z"/>`);

export const categoryArt = key => ART[key] || FALLBACK;
