// Информационный буклет для товаров без оригинальной инструкции: страница A4 (1240×1754)
// на узбекском и русском из leaflet-text/<slug>.json + фото коробки.
// Запуск: node build/booklet.mjs ostevix vitanova inulin-forte  (пишет assets/booklets/<slug>-1.webp, -2.webp)
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const W = 1240, H = 1754, PAD = 80, FONT = 'Arial, Helvetica, sans-serif';
const CHAR_W = 0.54; // средняя ширина знака Arial относительно кегля — для переноса строк

// Фирменный цвет каждой коробки (с развёртки)
const TONES = { ostevix: ['#0f4c6e', '#2a8bb8'], vitanova: ['#e8491d', '#ff9a1f'], 'inulin-forte': ['#2f9e2f', '#7fd13b'] };

const L = {
  kr: { action: 'Хусусиятлари', composition: 'Таркиби (1 капсулада)', form: 'Чиқарилиш шакли', contra: 'Қарши кўрсатмалар', shelf: 'Яроқлилик муддати', maker: 'Ишлаб чиқарувчи', ask: 'Қўллашдан олдин мутахассис билан маслаҳатлашинг.' },
  ru: { action: 'Свойства', composition: 'Состав (в 1 капсуле)', form: 'Форма выпуска', contra: 'Противопоказания', shelf: 'Срок годности', maker: 'Производитель', ask: 'Перед применением проконсультируйтесь со специалистом.' }
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function wrap(text, size, width) {
  const max = Math.floor(width / (size * CHAR_W)), lines = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/)) {
      if (line && (line + ' ' + word).length > max) { lines.push(line); line = word; } else line = line ? line + ' ' + word : word;
    }
    if (line) lines.push(line);
  }
  return lines;
}
const textBlock = (lines, x, y, size, opts = '') => lines.map((l, i) => `<text x="${x}" y="${y + i * size * 1.38}" font-size="${size}" ${opts}>${esc(l)}</text>`).join('');

// Секция: цветной маркер + заголовок + текст; возвращает [svg, новая y]
function section(title, body, y, tone, size = 26) {
  const lines = wrap(body, size, W - PAD * 2);
  const gap = Math.round(size * 1.8);
  const svg = `<rect x="${PAD}" y="${y - 26}" width="8" height="34" rx="4" fill="${tone}"/>
    <text x="${PAD + 22}" y="${y}" font-size="${size + 4}" font-weight="700" fill="#141634">${esc(title)}</text>
    ${textBlock(lines, PAD, y + gap, size, 'fill="#3a3d5c"')}`;
  return [svg, y + gap + lines.length * size * 1.38 + size + 4];
}

function bullets(items, y, tone) {
  let out = '';
  for (const item of items) {
    const lines = wrap(item, 28, W - PAD * 2 - 60);
    out += `<circle cx="${PAD + 16}" cy="${y - 9}" r="13" fill="${tone}"/><path d="M${PAD + 9} ${y - 9} l5 5 l9 -10" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    out += textBlock(lines, PAD + 46, y, 28, 'fill="#1f2140"');
    y += lines.length * 28 * 1.38 + 18;
  }
  return [out, y + 14];
}

// Состав «Витамин A — 1,15 мг, …» → таблица в две колонки
function compositionTable(text, y, tone) {
  const rows = text.replace(/\.$/, '').split(/,\s(?=[^\d])/).map(s => s.split(' — '));
  const half = Math.ceil(rows.length / 2), colW = (W - PAD * 2 - 40) / 2, rowH = 40;
  let out = '';
  rows.forEach(([name, dose], i) => {
    const col = i < half ? 0 : 1, row = col ? i - half : i;
    const x = PAD + col * (colW + 40), ry = y + row * rowH;
    if (row % 2 === 0) out += `<rect x="${x}" y="${ry - 30}" width="${colW}" height="${rowH}" rx="8" fill="${tone}" opacity=".08"/>`;
    out += `<text x="${x + 16}" y="${ry}" font-size="25" fill="#1f2140">${esc(name.charAt(0).toUpperCase() + name.slice(1))}</text>`;
    out += `<text x="${x + colW - 16}" y="${ry}" font-size="25" font-weight="700" fill="${tone}" text-anchor="end">${esc(dose || '')}</text>`;
  });
  return [out, y + half * rowH + 20];
}

async function page(slug, lang, info, name) {
  const t = info[lang], s = L[lang], [dark, light] = TONES[slug];
  // Коробку обрезаем по белым полям и кладём на белую карточку со скруглением
  const CARD = { w: 440, h: 400 }, cardX = W - PAD - CARD.w, TEXT_W = cardX - PAD - 40;
  const pack = await sharp(path.join(ROOT, 'assets/products', slug + '.webp')).trim({ threshold: 8 }).resize({ width: CARD.w - 50, height: CARD.h - 60, fit: 'inside' }).png().toBuffer();
  const pm = await sharp(pack).metadata();
  const logo = await sharp(path.join(ROOT, 'assets/brands/akson.webp')).resize(240).png().toBuffer();
  const uri = b => 'data:image/png;base64,' + b.toString('base64');

  // Шапка: название (кегль подбирается по ширине), слоган, значки в 1–2 ряда; справа коробка на карточке
  const title = name.toUpperCase(), titleSize = Math.min(84, Math.floor(TEXT_W / (title.length * 0.68)));
  const tagLines = wrap(t.tagline, 32, TEXT_W);
  const tagY = 250 + 64;
  let badgeX = PAD, badgeY = tagY + tagLines.length * 32 * 1.38 + 16, badges = '';
  for (const b of t.badges || []) {
    const bw = Math.round(b.length * 21 * CHAR_W + 44);
    if (badgeX + bw > PAD + TEXT_W) { badgeX = PAD; badgeY += 58; }
    if (badgeY > 500) break;
    badges += `<rect x="${badgeX}" y="${badgeY}" width="${bw}" height="46" rx="23" fill="#fff" opacity=".22"/><text x="${badgeX + 22}" y="${badgeY + 31}" font-size="21" font-weight="700" fill="#fff">${esc(b)}</text>`;
    badgeX += bw + 12;
  }
  const head = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="${light}"/></linearGradient></defs>
    <rect width="${W}" height="560" fill="url(#g)"/>
    <circle cx="${W - 60}" cy="40" r="260" fill="#fff" opacity=".08"/><circle cx="${W - 200}" cy="520" r="160" fill="#fff" opacity=".06"/>
    <rect x="${PAD}" y="56" width="268" height="72" rx="16" fill="#fff"/><image href="${uri(logo)}" x="${PAD + 14}" y="64" width="240" height="56" preserveAspectRatio="xMidYMid meet"/>
    <text x="${PAD}" y="250" font-size="${titleSize}" font-weight="700" fill="#fff">${esc(title)}</text>
    ${textBlock(tagLines, PAD, tagY, 32, 'fill="#fff"')}
    ${badges}
    <rect x="${cardX}" y="${280 - CARD.h / 2}" width="${CARD.w}" height="${CARD.h}" rx="36" fill="#fff"/>
    <image href="${uri(pack)}" x="${cardX + CARD.w / 2 - pm.width / 2}" y="${280 - pm.height / 2}" width="${pm.width}" height="${pm.height}"/>`;

  // Длинный состав (Витанова) — компактнее, чтобы всё влезло на страницу
  const compact = !!t.composition;
  let y = compact ? 620 : 670, body = '';
  if (t.composition) {
    body += `<text x="${PAD}" y="${y}" font-size="34" font-weight="700" fill="#141634">${esc(s.composition)}</text>`;
    const [c, ny] = compositionTable(t.composition, y + 62, dark); body += c; y = ny + 20;
  }
  if (t.action) {
    body += `<text x="${PAD}" y="${y}" font-size="34" font-weight="700" fill="#141634">${esc(s.action)}</text>`;
    const [b, ny] = bullets(t.action, y + 60, dark); body += b; y = ny + 10;
  }
  for (const [key, title] of [['release_form', s.form], ['contraindications', s.contra], ['shelf_life', s.shelf], ['manufacturer', s.maker]]) {
    if (!t[key] || (compact && key === 'release_form')) continue; // у Витановы форма уже в значках
    const [sec, ny] = section(title, t[key] + (key === 'manufacturer' && t.approval ? '\n' + t.approval : ''), y, dark, compact ? 23 : 26);
    body += sec; y = ny;
  }
  if (y > H - 160) throw new Error(`${slug}/${lang}: текст не помещается (${Math.round(y)} px)`);

  const footLines = wrap(t.dispensing || '', 23, W - PAD * 2 - 260);
  const foot = `<rect y="${H - 150}" width="${W}" height="150" fill="#f3f4fb"/>
    ${textBlock(footLines, PAD, H - 98, 23, `font-weight="700" fill="${dark}"`)}
    <text x="${PAD}" y="${H - 98 + footLines.length * 23 * 1.38 + 6}" font-size="22" fill="#3a3d5c">${esc(s.ask)}</text>
    <text x="${W - PAD}" y="${H - 66}" font-size="28" font-weight="700" fill="#141634" text-anchor="end">aksonmegavit.uz</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="${FONT}"><rect width="100%" height="100%" fill="#fff"/>${head}${body}${foot}</svg>`;
  const rel = `assets/booklets/${slug}-${lang === 'kr' ? 1 : 2}.webp`;
  await sharp(Buffer.from(svg)).webp({ quality: 86 }).toFile(path.join(ROOT, rel));
  return rel;
}

export async function booklet(slug) {
  const info = JSON.parse(await fs.readFile(path.join(ROOT, 'leaflet-text', slug + '.json'), 'utf8'));
  const products = JSON.parse(await fs.readFile(path.join(ROOT, 'products.json'), 'utf8'));
  const p = products.find(x => x.slug === slug);
  if (!p || !TONES[slug]) throw new Error('Нет товара или цвета: ' + slug);
  return [await page(slug, 'kr', info, p.name), await page(slug, 'ru', info, p.name)];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const slug of process.argv.slice(2)) console.log(await booklet(slug));
}
