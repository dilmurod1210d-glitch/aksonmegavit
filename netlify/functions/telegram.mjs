// Пересылка сообщений чата «Савол беринг» в Telegram (вдобавок к почте через FormSubmit).
// Токен бота и чат в браузер не попадают: они хранятся в переменных окружения Netlify —
//   TELEGRAM_BOT_TOKEN — токен от @BotFather
//   TELEGRAM_CHAT_ID   — кому слать (id чата/группы; несколько — через запятую)
// Адрес функции: https://aksonmegavit-uz.netlify.app/.netlify/functions/telegram
const ALLOWED_ORIGINS = new Set([
  'https://aksonmegavit.uz', 'https://www.aksonmegavit.uz', 'https://aksonmegavit-uz.netlify.app',
  'http://localhost:8765', 'http://127.0.0.1:8765'
]);
const MAX_BODY = 8000, MAX_FIELDS = 20, MAX_KEY = 80, MAX_VALUE = 1500;
const RATE_LIMIT = 5, RATE_WINDOW_MS = 10 * 60 * 1000;   // не больше 5 сообщений за 10 минут с одного адреса
const hits = new Map();   // живёт, пока жив экземпляр функции — защита от простого спама

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://aksonmegavit.uz',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin'
  };
}
const reply = (status, body, headers) => new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });

function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  hits.set(ip, [...recent, now]);
  return recent.length >= RATE_LIMIT;
}

// { subject, fields: { подпись: значение } } → проверенный список строк
function parse(raw) {
  const data = JSON.parse(raw);
  if (!data || typeof data.fields !== 'object' || Array.isArray(data.fields)) throw new Error('fields');
  const rows = Object.entries(data.fields)
    .filter(([k, v]) => typeof k === 'string' && typeof v === 'string' && v.trim())
    .slice(0, MAX_FIELDS)
    .map(([k, v]) => [k.slice(0, MAX_KEY), v.trim().slice(0, MAX_VALUE)]);
  if (!rows.length) throw new Error('empty');
  return { subject: String(data.subject || 'Сайтдан хабар').slice(0, 200), rows };
}

export default async (req, context) => {
  const origin = req.headers.get('origin') || '', headers = cors(origin);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return reply(405, { success: false, error: 'method' }, headers);
  if (!ALLOWED_ORIGINS.has(origin)) return reply(403, { success: false, error: 'origin' }, headers);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chats = (process.env.TELEGRAM_CHAT_ID || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!token || !chats.length) return reply(503, { success: false, error: 'not configured' }, headers);
  if (limited(context?.ip || 'unknown')) return reply(429, { success: false, error: 'rate' }, headers);

  const raw = await req.text();
  if (raw.length > MAX_BODY) return reply(413, { success: false, error: 'size' }, headers);
  let msg;
  try { msg = parse(raw); } catch { return reply(400, { success: false, error: 'bad request' }, headers); }

  const text = `<b>${esc(msg.subject)}</b>\n\n` + msg.rows.map(([k, v]) => `<b>${esc(k)}:</b> ${esc(v)}`).join('\n');
  const results = await Promise.all(chats.map(chat_id => fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true })
  }).then(r => r.ok).catch(() => false)));
  if (!results.some(Boolean)) {
    console.error('telegram: sendMessage failed for all chats');
    return reply(502, { success: false, error: 'telegram' }, headers);
  }
  return reply(200, { success: true }, headers);
};
