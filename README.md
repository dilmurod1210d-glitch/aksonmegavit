# Сайт aksonmegavit.uz

Сайт каталога Akson Megavit на GitHub Pages. Публикуется через GitHub Actions
(`.github/workflows/pages.yml`) после каждого коммита в `main`.

- Товары: `products.json`, планируемые продукты: `planned.json`.
- Админка: `/admin/` — вход по личному токену GitHub владельца (Contents: Read and write).
  Админка загружает картинки, обновляет JSON и делает один коммит; сайт пересобирается за 2–3 минуты.
- Сборка (`npm run build` → папка `_site/`, скрипт `build/build.mjs`):
  - страница каждого товара `/mahsulot/<slug>/` (шаблон `build/product-page.mjs`, стили `product.css`);
  - каталог с готовым списком товаров для поисковиков, `sitemap.xml`;
  - уменьшенные копии фото товаров (`-400.webp`, `-800.webp`) для каталога;
  - `version.json` с номером коммита — по нему админка понимает, что сайт обновился.
- Поля товара: `name`, `slug` (адрес страницы, латиницей), `category`, `brand`, `form`, `image`,
  `leaflets`, `description`, `composition`, `usage`. Необязательные поля можно не заполнять.
- Счётчики на главной и меню категорий строятся автоматически (`data.js`).

Локально: `npm ci && npm run build`, затем открыть `_site/` любым статическим сервером.
