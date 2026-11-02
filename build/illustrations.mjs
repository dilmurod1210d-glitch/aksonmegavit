// Иллюстрации категорий для плиток на главной (вместо фото конкретного товара).
// Цвета берутся из цвета категории (data-tone): .i-main — насыщенный, .i-dark — тёмный,
// .i-soft — белый, .i-shade — тень. Ключ — латинский ключ категории (см. build.mjs).
const svg = body => `<svg class="cat-illustration" viewBox="0 0 120 120" aria-hidden="true"><ellipse class="i-shade" cx="60" cy="110" rx="36" ry="6"/>${body}</svg>`;

const ART = {
  // Сироп: бутылка из тёмного стекла на фоне веточки трав, ложка с каплей сиропа
  siroplar: svg(`
    <path class="i-stem" d="M86 104C84 80 88 52 98 26"/>
    <g transform="translate(87 84) rotate(-58)"><path class="i-leaf" d="M0 0C-9.9 -5.3999999999999995 -9.9 -14.4 0 -18C9.9 -14.4 9.9 -5.3999999999999995 0 0z"/><path class="i-vein" d="M0 -2V-14.4"/></g><g transform="translate(89 66) rotate(52)"><path class="i-leaf-d" d="M0 0C-9.350000000000001 -5.1 -9.350000000000001 -13.600000000000001 0 -17C9.350000000000001 -13.600000000000001 9.350000000000001 -5.1 0 0z"/><path class="i-vein" d="M0 -2V-13.600000000000001"/></g><g transform="translate(92 48) rotate(-50)"><path class="i-leaf" d="M0 0C-8.25 -4.5 -8.25 -12 0 -15C8.25 -12 8.25 -4.5 0 0z"/><path class="i-vein" d="M0 -2V-12"/></g><g transform="translate(97 32) rotate(40)"><path class="i-leaf-d" d="M0 0C-6.6000000000000005 -3.5999999999999996 -6.6000000000000005 -9.600000000000001 0 -12C6.6000000000000005 -9.600000000000001 6.6000000000000005 -3.5999999999999996 0 0z"/><path class="i-vein" d="M0 -2V-9.600000000000001"/></g>
    <rect class="i-dark" x="37" y="10" width="30" height="13" rx="4"/>
    <rect class="i-dark" x="41" y="23" width="22" height="6"/>
    <path class="i-main" d="M39 29h26v7c11 4 16 12 16 23v37a9 9 0 0 1-9 9H32a9 9 0 0 1-9-9V59c0-11 5-19 16-23z"/>
    <path class="i-hl" d="M30 78V60c0-7 3-12 8-15"/>
    <rect class="i-soft" x="31" y="58" width="42" height="34" rx="8"/>
    <g transform="translate(52 86) rotate(-28)"><path class="i-leaf" d="M0 0C-9.350000000000001 -5.1 -9.350000000000001 -13.600000000000001 0 -17C9.350000000000001 -13.600000000000001 9.350000000000001 -5.1 0 0z"/><path class="i-vein" d="M0 -2V-13.600000000000001"/></g><g transform="translate(52 86) rotate(34)"><path class="i-leaf-d" d="M0 0C-7.15 -3.9 -7.15 -10.4 0 -13C7.15 -10.4 7.15 -3.9 0 0z"/><path class="i-vein" d="M0 -2V-10.4"/></g>
    <path class="i-spoon" d="M70 103l26-12"/><ellipse class="i-spoon-bowl" cx="102" cy="88" rx="10" ry="6" transform="rotate(-24 102 88)"/>
    <ellipse class="i-honey" cx="102" cy="88" rx="6.5" ry="3.4" transform="rotate(-24 102 88)"/>
    <path class="i-spark" d="M20 18Q20 24 26 24Q20 24 20 30Q20 24 14 24Q20 24 20 18z"/><path class="i-spark" d="M30 8.5Q30 12 33.5 12Q30 12 30 15.5Q30 12 26.5 12Q30 12 30 8.5z"/>`),
  // Спрей для горла: флакон с помпой и длинной насадкой, из которой выходит облачко
  spreylar: svg(`
    <path class="i-mist" d="M90 22l20-12v26z"/>
    <circle class="i-main" cx="96" cy="21" r="2.2"/><circle class="i-main" cx="103" cy="15" r="1.8"/><circle class="i-main" cx="104" cy="27" r="1.8"/><circle class="i-main" cx="109" cy="21" r="1.5"/>
    <path class="i-nozzle" d="M50 30V24a4 4 0 0 1 4-4h22l12 0"/>
    <rect class="i-dark" x="84" y="17" width="8" height="8" rx="2.5"/>
    <rect class="i-dark" x="40" y="22" width="20" height="16" rx="5"/>
    <rect class="i-soft i-cap" x="44" y="38" width="12" height="8" rx="1.5"/>
    <rect class="i-dark" x="38" y="46" width="24" height="9" rx="3"/>
    <path class="i-main" d="M40 55h20v4c10 3 14 9 14 18v20a9 9 0 0 1-9 9H35a9 9 0 0 1-9-9V77c0-9 4-15 14-18z"/>
    <path class="i-hl" d="M33 96V78c0-5 2-9 6-11"/>
    <rect class="i-soft" x="33" y="74" width="34" height="24" rx="6"/>
    <g transform="translate(50 95) rotate(-28)"><path class="i-leaf" d="M0 0C-7.700000000000001 -4.2 -7.700000000000001 -11.200000000000001 0 -14C7.700000000000001 -11.200000000000001 7.700000000000001 -4.2 0 0z"/><path class="i-vein" d="M0 -2V-11.200000000000001"/></g><g transform="translate(50 95) rotate(36)"><path class="i-leaf-d" d="M0 0C-6.050000000000001 -3.3 -6.050000000000001 -8.8 0 -11C6.050000000000001 -8.8 6.050000000000001 -3.3 0 0z"/><path class="i-vein" d="M0 -2V-8.8"/></g>
    <g transform="translate(92 96) rotate(40)"><path class="i-leaf" d="M0 0C-8.8 -4.8 -8.8 -12.8 0 -16C8.8 -12.8 8.8 -4.8 0 0z"/><path class="i-vein" d="M0 -2V-12.8"/></g><g transform="translate(92 96) rotate(-30)"><path class="i-leaf-d" d="M0 0C-7.15 -3.9 -7.15 -10.4 0 -13C7.15 -10.4 7.15 -3.9 0 0z"/><path class="i-vein" d="M0 -2V-10.4"/></g>
    <path class="i-spark" d="M18 35Q18 40 23 40Q18 40 18 45Q18 40 13 40Q18 40 18 35z"/><path class="i-spark" d="M100 58Q100 62 104 62Q100 62 100 66Q100 62 96 62Q100 62 100 58z"/>`),
  // Таблетки и капсулы
  'tabletka-va-kapsulalar': svg(`
    <g transform="rotate(-35 46 54)"><rect class="i-main" x="16" y="42" width="60" height="24" rx="12"/><path class="i-soft" d="M46 42h18a12 12 0 0 1 0 24H46z"/><path class="i-hl" d="M24 50h14"/></g>
    <g transform="rotate(28 82 74)"><rect class="i-dark" x="60" y="64" width="46" height="20" rx="10"/><path class="i-main" d="M83 64h13a10 10 0 0 1 0 20H83z"/></g>
    <circle class="i-soft i-ring" cx="40" cy="88" r="16"/><path class="i-line" d="M29 88h22"/>
    <circle class="i-main" cx="78" cy="30" r="9"/><path class="i-line-soft" d="M72 30h12"/>`),
  // Капли: пипетка роняет каплю с листочком в спокойную воду (круги на воде)
  tomchilar: svg(`
    <ellipse class="i-ripple" cx="60" cy="100" rx="38" ry="8"/><ellipse class="i-ripple" cx="60" cy="100" rx="22" ry="4.5"/>
    <path class="i-dark" d="M54 4h12a5 5 0 0 1 5 5v14H49V9a5 5 0 0 1 5-5z"/>
    <rect class="i-dark" x="46" y="22" width="28" height="6" rx="3"/>
    <path class="i-glass" d="M53 28h14v14l-4 10h-6l-4-10z"/>
    <path class="i-main" d="M55 38h10v4l-3 8h-4l-3-8z"/>
    <path class="i-main" d="M60 56c10 13 16 20 16 28a16 16 0 0 1-32 0c0-8 6-15 16-28z"/>
    <path class="i-hl" d="M52 84a8 8 0 0 0 5 8"/>
    <g transform="translate(61 90) rotate(18)"><path class="i-leaf-w" d="M0 0C-8.25 -4.5 -8.25 -12 0 -15C8.25 -12 8.25 -4.5 0 0z"/><path class="i-vein" d="M0 -2V-12"/></g>
    <path class="i-main" d="M24 50c3 5 5 7 5 10a5 5 0 0 1-10 0c0-3 2-5 5-10z" opacity=".55"/>
    <g transform="translate(96 64) rotate(30)"><path class="i-leaf" d="M0 0C-8.25 -4.5 -8.25 -12 0 -15C8.25 -12 8.25 -4.5 0 0z"/><path class="i-vein" d="M0 -2V-12"/></g><g transform="translate(96 64) rotate(-40)"><path class="i-leaf-d" d="M0 0C-6.6000000000000005 -3.5999999999999996 -6.6000000000000005 -9.600000000000001 0 -12C6.6000000000000005 -9.600000000000001 6.6000000000000005 -3.5999999999999996 0 0z"/><path class="i-vein" d="M0 -2V-9.600000000000001"/></g>
    <path class="i-spark" d="M94 24Q94 30 100 30Q94 30 94 36Q94 30 88 30Q94 30 94 24z"/><path class="i-spark" d="M22 78Q22 82 26 82Q22 82 22 86Q22 82 18 82Q22 82 22 78z"/>`),
  // Саше: пакетик высыпается в стакан воды с пузырьками и долькой цитруса
  'sashe-va-poroshoklar': svg(`
    <g transform="rotate(-24 34 40)">
      <path class="i-main" d="M14 20l4-5 4 5 4-5 4 5 4-5 4 5 4-5 4 5v44H14z"/>
      <rect class="i-dark" x="14" y="20" width="36" height="6"/>
      <rect class="i-soft" x="20" y="34" width="24" height="20" rx="5"/>
      <g transform="translate(32 51) rotate(-25)"><path class="i-leaf" d="M0 0C-6.6000000000000005 -3.5999999999999996 -6.6000000000000005 -9.600000000000001 0 -12C6.6000000000000005 -9.600000000000001 6.6000000000000005 -3.5999999999999996 0 0z"/><path class="i-vein" d="M0 -2V-9.600000000000001"/></g><g transform="translate(32 51) rotate(35)"><path class="i-leaf-d" d="M0 0C-4.95 -2.6999999999999997 -4.95 -7.2 0 -9C4.95 -7.2 4.95 -2.6999999999999997 0 0z"/><path class="i-vein" d="M0 -2V-7.2"/></g>
    </g>
    <circle class="i-main" cx="58" cy="44" r="2.2"/><circle class="i-main" cx="62" cy="52" r="1.8"/><circle class="i-main" cx="57" cy="58" r="1.5"/>
    <path class="i-glass" d="M46 62h48l-6 42a6 6 0 0 1-6 5H58a6 6 0 0 1-6-5z"/>
    <path class="i-water" d="M48.5 74h43l-4.3 30a4 4 0 0 1-4 3.5H56.8a4 4 0 0 1-4-3.5z"/>
    <circle class="i-soft" cx="62" cy="96" r="2.6"/><circle class="i-soft" cx="74" cy="88" r="2"/><circle class="i-soft" cx="80" cy="99" r="2.8"/><circle class="i-soft" cx="68" cy="82" r="1.6"/>
    <path class="i-hl" d="M54 70l4 32"/>
    <path class="i-citrus" d="M80 62a14 14 0 0 1 28 0z"/><path class="i-citrus-in" d="M84 62a10 10 0 0 1 20 0z"/>
    <path class="i-vein-c" d="M94 62V52M94 62l-7-6M94 62l7-6"/>
    <path class="i-spark" d="M104 22Q104 28 110 28Q104 28 104 34Q104 28 98 28Q104 28 104 22z"/><path class="i-spark" d="M22 88Q22 92 26 92Q22 92 22 96Q22 92 18 92Q22 92 22 88z"/>`)
};

// Для новой категории без своей картинки — нейтральная коробочка.
const FALLBACK = svg(`
  <path class="i-main" d="M30 40l30-14 30 14v48L60 102 30 88z"/>
  <path class="i-dark" d="M60 54v48L30 88V40z"/>
  <path class="i-soft" d="M30 40l30 14 30-14-30-14z"/>`);

export const categoryArt = key => ART[key] || FALLBACK;
