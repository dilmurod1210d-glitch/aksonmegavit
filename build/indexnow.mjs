// Сообщает Яндексу и Bing (протокол IndexNow) обо всех адресах из sitemap.xml.
// Запускается в GitHub Actions после публикации. Ключ подтверждения — файл ec27672abcea734bd76fa99e037dd216.txt в корне сайта.
const KEY = 'ec27672abcea734bd76fa99e037dd216';
const HOST = 'aksonmegavit.uz';

const xml = await (await fetch(`https://${HOST}/sitemap.xml?${Date.now()}`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList })
});
console.log(`IndexNow: ${urlList.length} адресов → ${res.status}`);
// 200/202 — принято; ошибка IndexNow не должна ломать публикацию сайта.
