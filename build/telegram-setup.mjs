// Настройка пересылки чата в Telegram одной командой: node build/telegram-setup.mjs
// Спрашивает токен бота, сам находит id чата (после /start боту), записывает оба значения
// в переменные Netlify, присылает пробное сообщение и заново выкладывает функцию.
// Токен никуда, кроме Telegram и Netlify, не уходит и в файлы не пишется.
import readline from 'node:readline/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKEN_RE = /^\d{6,12}:[A-Za-z0-9_-]{30,}$/;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const tg = async (token, method, body) => {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {})
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram: ${data.description || res.status}`);
  return data.result;
};

const netlify = args => {
  const r = spawnSync('npx', ['--yes', 'netlify-cli', ...args], { cwd: ROOT, stdio: 'inherit', shell: true });
  if (r.status !== 0) throw new Error('Netlify буйруғи бажарилмади: ' + args.slice(0, 2).join(' '));
};

async function main() {
  console.log('\n1) @BotFather берган токенни қўйинг ва Enter босинг.');
  const token = (await rl.question('Токен: ')).trim();
  if (!TOKEN_RE.test(token)) throw new Error('Токен нотўғри кўринишда. Масалан: 123456789:AAH...');
  const bot = await tg(token, 'getMe');
  console.log(`   ✓ Бот топилди: @${bot.username}`);

  console.log(`\n2) Telegram'да @${bot.username} ни очиб, Start (ёки /start) босинг.`);
  console.log('   Гуруҳга хабар келсин десангиз — ботни гуруҳга қўшиб, гуруҳда бирор сўз ёзинг.');
  console.log('   Ботга хабар келишини кутяпман (3 дақиқагача)...');
  // Длинный опрос: ждём первое сообщение боту, а не требуем точного момента нажатия Enter
  let updates = [];
  for (let i = 0; i < 6 && !updates.length; i++) updates = await tg(token, 'getUpdates', { timeout: 30 });
  const chats = [...new Map(updates.map(u => (u.message || u.my_chat_member || u.channel_post || {}).chat).filter(Boolean)
    .map(c => [c.id, c])).values()];
  if (!chats.length) throw new Error('Ботга ҳали хабар келмаган. Start босиб, қайта ишга туширинг.');
  chats.forEach((c, i) => console.log(`   ${i + 1}. ${c.title || [c.first_name, c.last_name].filter(Boolean).join(' ')} (${c.type})`));
  const pick = chats.length === 1 ? 1 : Number(await rl.question('   Хабарлар қайси чатга келсин? Рақамини ёзинг: '));
  const chat = chats[pick - 1];
  if (!chat) throw new Error('Бундай рақам йўқ.');

  console.log('\n3) Netlify созланмоқда...');
  netlify(['env:set', 'TELEGRAM_BOT_TOKEN', token]);
  netlify(['env:set', 'TELEGRAM_CHAT_ID', String(chat.id)]);

  await tg(token, 'sendMessage', { chat_id: chat.id, text: '✅ aksonmegavit.uz: сайтдаги саволлар энди шу ерга ҳам келади.' });
  console.log('   ✓ Telegram\'га синов хабари юборилди.');

  console.log('\n4) Сайт функцияси қайта чиқарилмоқда...');
  netlify(['deploy', '--prod', '--dir', '_site', '--functions', 'netlify/functions']);
  console.log('\n✓ Тайёр. Сайтдаги «Савол беринг» хабарлари почта ва Telegram\'га келади.');
}

main().catch(e => { console.error('\n✗ ' + e.message); process.exitCode = 1; }).finally(() => rl.close());
