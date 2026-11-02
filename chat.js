// Чат «Савол беринг»: окно с формой, сообщение уходит на почту компании через FormSubmit
// (formsubmit.co). Адрес почты задаётся в site.json → «Настройки сайта» в админке.
(() => {
  const box = document.getElementById('chat'), fab = document.querySelector('[data-chat-open]');
  if (!box || !fab) return;
  const form = box.querySelector('form'), log = box.querySelector('.chat-log'), err = box.querySelector('.chat-error');

  const open = show => {
    box.hidden = !show;
    fab.setAttribute('aria-expanded', String(show));
    fab.classList.toggle('active', show);
    if (show) form.querySelector('[name=contact]').focus();
  };
  fab.addEventListener('click', () => open(box.hidden));
  box.querySelector('[data-chat-close]').addEventListener('click', () => { open(false); fab.focus(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !box.hidden) { open(false); fab.focus(); } });

  const bubble = (text, cls) => {
    const p = document.createElement('p');
    p.className = 'msg ' + cls;
    p.textContent = text;
    log.append(p);
    log.scrollTop = log.scrollHeight;
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.contact.trim() || !data.message.trim()) { err.hidden = false; return; }
    err.hidden = true;
    if (data._honey) return;   // бот заполнил скрытое поле
    bubble(data.message.trim(), 'out');
    const button = form.querySelector('button[type=submit]');
    button.disabled = true;
    try {
      const res = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(box.dataset.to), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: box.dataset.subject + ' (' + data.topic + ')',
          _template: 'table',
          _captcha: 'false',
          'Мавзу / Тема': data.topic,
          'Исм / Имя': data.name,
          'Алоқа / Контакт': data.contact,
          'Савол / Вопрос': data.message,
          'Саҳифа / Страница': location.href
        })
      });
      if (!res.ok) throw new Error(res.status);
      bubble(box.dataset.sent, 'in');
      form.querySelector('[name=message]').value = '';
      if (window.gtag) gtag('event', 'chat_message');
      if (window.ym && window.YM_ID) ym(window.YM_ID, 'reachGoal', 'chat_message');
    } catch (x) {
      bubble(box.dataset.fail, 'in error');
    } finally {
      button.disabled = false;
    }
  });
})();
