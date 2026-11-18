// Объёмная коробка из развёртки (dieline): лицевая и боковая стороны вырезаются из плоского
// макета и собираются в 3D-вид на белом фоне — как остальные фото товаров каталога.
// Запуск: node build/packshot.mjs  (пишет assets/products/<slug>.webp)
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Координаты панелей на развёртке: [x, y, ширина, высота].
// side: 'edge' — боковина из правой кромки лицевой стороны: на развёртках Виродола и Лакторича
// боковые панели содержат текст от ОС-Д3, его на фото быть не должно.
export const DIELINES = {
  virodol: { src: 'assets/planned/virodol.webp', front: [667, 390, 185, 500], side: 'edge' },
  'os-d3': { src: 'assets/planned/os-d3.webp', front: [589, 474, 200, 525], side: [789, 474, 198, 525] },
  laktorich: { src: 'assets/planned/laktorich.webp', front: [589, 474, 200, 525], side: 'edge' },
  tinodol: { src: 'assets/planned/tinodol.webp', front: [607, 428, 200, 530], side: [807, 428, 198, 530] },
  'parazol-nol': { src: 'assets/planned/parazol-nol.webp', front: [603, 430, 200, 532], side: [803, 430, 199, 532] },
  // Капсулы в лежачей коробке. view: 'front' — вид спереди, как фото Седаксона/Фераксона в каталоге.
  ostevix: { src: 'assets/planned/ostevix.webp', front: [371, 662, 537, 337], view: 'front' },
  vitanova: { src: 'assets/planned/vitanova.webp', front: [371, 662, 537, 337], view: 'front' },
  'inulin-forte': { src: 'assets/planned/inulin-forte.webp', front: [371, 662, 537, 337], view: 'front' }
};

// Вид спереди: лицевая сторона почти во всю ширину, тонкая крышка сверху, мягкая тень снизу.
const FRONT_W = 1110, LID = 12;
async function frontShot(slug, front, [, , w, h]) {
  const fw = FRONT_W, fh = Math.round(fw * (h - 6) / (w - 6));
  const x0 = Math.round((SIZE - fw) / 2), y0 = Math.round((SIZE - fh) / 2);
  const top = await sharp(front).extract({ left: 0, top: 2, width: w - 6, height: 6 }).stats();
  const [r, g, b] = top.channels.map(c => Math.round(c.mean * 0.85 + 255 * 0.15));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <defs><radialGradient id="sh"><stop offset="0" stop-color="#1b1d3a" stop-opacity=".22"/><stop offset="1" stop-color="#1b1d3a" stop-opacity="0"/></radialGradient>
  <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".10"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".06"/></linearGradient></defs>
  <rect width="100%" height="100%" fill="#fff"/>
  <ellipse cx="${SIZE / 2}" cy="${y0 + fh + 8}" rx="${fw * 0.52}" ry="22" fill="url(#sh)"/>
  <rect x="${x0 + 4}" y="${y0 - LID}" width="${fw - 8}" height="${LID + 2}" fill="rgb(${r},${g},${b})"/>
  <image href="${dataUri(front)}" x="${x0}" y="${y0}" width="${fw}" height="${fh}" preserveAspectRatio="none"/>
  <rect x="${x0}" y="${y0}" width="${fw}" height="${fh}" fill="url(#shade)"/>
</svg>`;
  const out = path.join(ROOT, 'assets/products', slug + '.webp');
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(out);
  return path.relative(ROOT, out).replace(/\\/g, '/');
}

const SIZE = 1254, MAX_H = 900, MAX_W = 1080, SKEW = 22;   // холст, предельные высота/ширина коробки, наклон боковины (°)

// Отступ 3 px внутрь — чтобы не попали линии реза развёртки
const crop = (src, [left, top, width, height]) => sharp(src).extract({ left: left + 3, top: top + 3, width: width - 6, height: height - 6 }).png().toBuffer();
const dataUri = buf => 'data:image/png;base64,' + buf.toString('base64');

export async function packshot(slug) {
  const d = DIELINES[slug];
  const src = path.join(ROOT, d.src);
  const front = await crop(src, d.front);
  if (d.view === 'front') return frontShot(slug, front, d.front);
  const side = d.side === 'edge'
    ? await sharp(front).extract({ left: d.front[2] - 6 - 8, top: 0, width: 8, height: d.front[3] - 6 }).resize({ width: 160, height: d.front[3] - 6, fit: 'fill' }).png().toBuffer()
    : await crop(src, d.side);
  // Цвет крышки — средний цвет верхней кромки лицевой стороны
  const top = await sharp(front).extract({ left: 0, top: 2, width: d.front[2] - 6, height: 6 }).stats();
  const [r, g, b] = top.channels.map(c => Math.round(c.mean * 0.92 + 255 * 0.08));

  // Высокая коробка — высотой H; лежачая уменьшается, чтобы вместе с боковиной влезть в холст.
  const aspect = d.front[2] / d.front[3], depth = d.depth || 0.42;
  const H = Math.round(Math.min(MAX_H, MAX_W / (aspect * (1 + depth))));
  const wf = Math.round(H * aspect), ws = Math.round(wf * depth);
  const rise = Math.round(ws * Math.tan(SKEW * Math.PI / 180));
  const x0 = Math.round((SIZE - wf - ws) / 2), y0 = Math.round((SIZE - H + rise) / 2) - 20;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <defs><radialGradient id="sh"><stop offset="0" stop-color="#1b1d3a" stop-opacity=".28"/><stop offset="1" stop-color="#1b1d3a" stop-opacity="0"/></radialGradient>
  <linearGradient id="side" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>
  <linearGradient id="gloss" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <rect width="100%" height="100%" fill="#fff"/>
  <ellipse cx="${x0 + (wf + ws) / 2}" cy="${y0 + H + 6}" rx="${(wf + ws) * 0.62}" ry="34" fill="url(#sh)"/>
  <polygon points="${x0},${y0} ${x0 + wf},${y0} ${x0 + wf + ws},${y0 - rise} ${x0 + ws},${y0 - rise}" fill="rgb(${r},${g},${b})"/>
  <polygon points="${x0},${y0} ${x0 + wf},${y0} ${x0 + wf + ws},${y0 - rise} ${x0 + ws},${y0 - rise}" fill="#fff" opacity=".18"/>
  <g transform="translate(${x0 + wf} ${y0}) skewY(${-SKEW})">
    <image href="${dataUri(side)}" width="${ws}" height="${H}" preserveAspectRatio="none"/>
    <rect width="${ws}" height="${H}" fill="url(#side)"/>
  </g>
  <image href="${dataUri(front)}" x="${x0}" y="${y0}" width="${wf}" height="${H}" preserveAspectRatio="none"/>
  <rect x="${x0}" y="${y0}" width="${wf}" height="${H}" fill="url(#gloss)"/>
</svg>`;
  const out = path.join(ROOT, 'assets/products', slug + '.webp');
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(out);
  return path.relative(ROOT, out).replace(/\\/g, '/');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const slug of Object.keys(DIELINES)) console.log(await packshot(slug));
}
