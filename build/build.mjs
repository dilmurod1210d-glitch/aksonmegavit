// Сборка сайта для GitHub Pages: копирует статические файлы в _site/, собирает
// страницы (build/pages.mjs) и страницы товаров, карту сайта и уменьшенные картинки.
// Запускается в GitHub Actions после каждого коммита (в том числе из админки).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { productPage } from './product-page.mjs';
import { home, catalog, about, plannedPage, notFound } from './pages.mjs';
import { SITE } from './layout.mjs';
import { LANGS, LANG_ORDER, href, productPath } from './i18n.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '_site');
const SKIP = new Set(['.git', '.github', '.gitignore', 'node_modules', '_site', 'build', 'package.json', 'package-lock.json', 'README.md']);
const THUMBS = [400, 800];

// Та же транслитерация, что и в админке (admin/index.html → slug()).
const TR = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'j',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'x',ц:'ts',ч:'ch',ш:'sh',щ:'sh',ъ:'',ы:'i',ь:'',э:'e',ю:'yu',я:'ya',ў:'o',қ:'q',ғ:'g',ҳ:'h' };
export const slugify = s => String(s || '').toLowerCase().split('').map(c => TR[c] != null ? TR[c] : c).join('')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'mahsulot';

async function copyStatic() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });
  for (const name of await fs.readdir(ROOT)) {
    if (SKIP.has(name)) continue;
    await fs.cp(path.join(ROOT, name), path.join(OUT, name), { recursive: true });
  }
}

const readJson = async file => JSON.parse(await fs.readFile(path.join(ROOT, file), 'utf8'));

// Уменьшенные копии фото товара для каталога: x-400.webp, x-800.webp.
async function makeThumbs(image) {
  const src = path.join(ROOT, image);
  try { await fs.access(src); } catch { console.warn('Нет файла:', image); return null; }
  const { width } = await sharp(src).metadata();
  const base = image.replace(/\.[a-z0-9]+$/i, '');
  const sizes = [];
  for (const w of THUMBS) {
    if (w >= width) break;
    const rel = `${base}-${w}.webp`;
    await sharp(src).resize({ width: w }).webp({ quality: 80, effort: 5 }).toFile(path.join(OUT, rel));
    sizes.push({ w, rel });
  }
  sizes.push({ w: width, rel: image });
  return { thumb: sizes[0].rel, srcset: sizes.map(s => `${s.rel} ${s.w}w`).join(', ') };
}

// Каждый адрес на трёх языках, с перекрёстными ссылками hreflang.
function sitemap(products) {
  const groups = [...['/', '/catalog', '/about', '/planned'].map(p => Object.fromEntries(LANG_ORDER.map(l => [l, href(l, p)]))),
    ...products.map(p => Object.fromEntries(LANG_ORDER.map(l => [l, productPath(l, p.slug)])))];
  const alt = g => LANG_ORDER.map(l => `<xhtml:link rel="alternate" hreflang="${LANGS[l].hreflang}" href="${SITE}${g[l]}"/>`).join('');
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
    + groups.flatMap(g => LANG_ORDER.map(l => `<url><loc>${SITE}${g[l]}</loc>${alt(g)}</url>`)).join('\n') + '\n</urlset>\n';
}

async function main() {
  await copyStatic();
  const products = await readJson('products.json');

  const used = new Set();
  for (const p of products) {
    let slug = slugify(p.slug || p.name), n = 2;
    while (used.has(slug)) slug = `${slugify(p.slug || p.name)}-${n++}`;
    used.add(slug);
    p.slug = slug;
    p.url = `mahsulot/${slug}/`;
    if (!Array.isArray(p.leaflets)) p.leaflets = [];
    if (p.image) Object.assign(p, await makeThumbs(p.image));
  }

  // Категория: name — как в products.json, key — латинский ключ для адреса ?category=
  const categories = [...new Set(products.map(p => p.category))].map(name => ({ name, key: slugify(name) }));
  const byCat = Object.fromEntries(categories.map(c => [c.name, products.filter(p => p.category === c.name)]));
  let planned = [];
  try { planned = await readJson('planned.json'); } catch { console.warn('Нет planned.json'); }
  const data = { products, categories, byCat, planned };

  const write = async (rel, html) => { const f = path.join(OUT, rel); await fs.mkdir(path.dirname(f), { recursive: true }); await fs.writeFile(f, html); };
  for (const lang of LANG_ORDER) {
    for (const p of products) {
      const related = byCat[p.category].filter(x => x !== p).slice(0, 4);
      await write(productPath(lang, p.slug) + 'index.html', productPage(lang, p, related, categories));
    }
    const pages = { '/index.html': home, '/catalog.html': catalog, '/about.html': about, '/planned.html': plannedPage };
    for (const [file, render] of Object.entries(pages)) await write(href(lang, file), render(lang, data));
  }
  await write('404.html', notFound('kr', data));

  // Готовые ссылки и превью — для внешних потребителей (сам сайт этот файл не читает).
  await fs.writeFile(path.join(OUT, 'products.json'), JSON.stringify(products, null, 2) + '\n');

  await fs.writeFile(path.join(OUT, 'sitemap.xml'), sitemap(products));
  // Админка сверяет этот файл, чтобы понять, что её коммит уже на сайте.
  await fs.writeFile(path.join(OUT, 'version.json'), JSON.stringify({ commit: process.env.GITHUB_SHA || 'local', built: new Date().toISOString() }) + '\n');

  console.log(`Готово: ${products.length} товаров × ${LANG_ORDER.length} языка → ${path.relative(ROOT, OUT)}/`);
}

main().catch(e => { console.error(e); process.exit(1); });
