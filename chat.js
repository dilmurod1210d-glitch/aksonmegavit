// Чат «Савол беринг»: окно с формой, сообщение уходит на почту компании через FormSubmit
// (formsubmit.co). Адрес почты задаётся в site.json → «Настройки сайта» в админке.
// Тема «Буюртма» показывает поля аптеки; после отправки — экран «Юборилди» с итогом.
(() => {
  const box = document.getElementById('chat'), fab = document.querySelector('[data-chat-open]');
  if (!box || !fab) return;
  const form = box.querySelector('form'), log = box.querySelector('.chat-log'), err = box.querySelector('.chat-error');
  const order = box.querySelector('.order-fields'), done = box.querySelector('.chat-done');
  const nameLabel = box.querySelector('[data-label-name]'), msgLabel = box.querySelector('[data-label-message]');
  const message = form.querySelector('[name=message]'), nameInput = form.querySelector('[name=name]');
  const button = form.querySelector('button[type=submit]'), buttonText = button.querySelector('span');
  const initial = { name: nameLabel.textContent, msg: msgLabel.textContent, send: buttonText.textContent };

  const open = show => {
    box.hidden = !show;
    fab.setAttribute('aria-expanded', String(show));
    fab.classList.toggle('active', show);
    if (show && !form.hidden) form.querySelector('[name=contact]').focus();
  };
  fab.addEventListener('click', () => open(box.hidden));
  box.querySelector('[data-chat-close]').addEventListener('click', () => { open(false); fab.focus(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !box.hidden) { open(false); fab.focus(); } });

  const kind = () => form.querySelector('[name=topic]:checked').dataset.kind;
  // Буюртма: поля аптеки, другие подписи у имени и текста
  const setKind = () => {
    const isOrder = kind() === 'order';
    order.hidden = order.disabled = !isOrder;
    nameLabel.textContent = isOrder ? nameInput.dataset.orderLabel : initial.name;
    msgLabel.textContent = isOrder ? message.dataset.orderLabel : initial.msg;
    message.placeholder = isOrder ? message.dataset.orderPlaceholder : '';
    err.hidden = true;
  };
  form.addEventListener('change', e => { if (e.target.name === 'topic') setKind(); });

  const bubble = (text, cls) => {
    const p = document.createElement('p');
    p.className = 'msg ' + cls;
    p.textContent = text;
    log.append(p);
    log.scrollIntoView({ block: 'end' });
  };
  const fail = text => { err.textContent = text; err.hidden = false; };
  const label = el => el.closest('label').querySelector('span').textContent.replace(/\s*\*$/, '');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const missing = [...form.querySelectorAll('[required]')].filter(el => !el.matches(':disabled') && !el.value.trim());
    if (missing.length) { fail(err.dataset.msg); missing[0].focus(); return; }
    const inn = form.querySelector('[name=inn]');
    if (!inn.matches(':disabled') && !/^(\d{9}|\d{14})$/.test(inn.value.replace(/\s/g, ''))) { fail(err.dataset.msgInn); inn.focus(); return; }
    err.hidden = true;
    if (form.querySelector('[name=_honey]').value) return;   // бот заполнил скрытое поле

    // Поля для письма и для итога: подпись → значение (только заполненные и включённые)
    const topic = form.querySelector('[name=topic]:checked').value;
    const rows = [['Мавзу / Тема', topic]].concat([...form.querySelectorAll('input[type=text]:not([name=_honey]), select, textarea')]
      .filter(el => !el.matches(':disabled') && el.value.trim()).map(el => [label(el), el.value.trim()]));

    // FormSubmit отвечает долго (около 10 секунд), поэтому итог показывается сразу,
    // а строка статуса меняется, когда почта подтвердит доставку (или сообщит об ошибке).
    bubble(message.value.trim(), 'out');
    const text = done.querySelector('[data-done-text]');
    text.textContent = kind() === 'order' ? text.dataset.order : text.dataset.question;
    done.querySelector('.chat-summary').replaceChildren(...rows.flatMap(([k, v]) => {
      const dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = k; dd.textContent = v;
      return [dt, dd];
    }));
    setState('wait');
    form.hidden = true;
    done.hidden = false;
    done.focus();
    const sentKind = kind();
    try {
      const res = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(box.dataset.to), {
        method: 'POST',
        keepalive: true,   // письмо уйдёт, даже если посетитель закроет страницу
        signal: AbortSignal.timeout ? AbortSignal.timeout(45000) : undefined,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.assign({
          _subject: box.dataset.subject + ' (' + topic + ')',
          _template: 'table',
          _captcha: 'false'
        }, Object.fromEntries(rows), { 'Саҳифа / Страница': location.href }))
      });
      if (!res.ok) throw new Error(res.status);
      const answer = await res.json().catch(() => ({}));
      if (answer.success === 'false' || answer.success === false) throw new Error(answer.message);
      setState('ok');
      message.value = '';
      if (window.gtag) gtag('event', 'chat_message', { topic: sentKind });
      if (window.ym && window.YM_ID) ym(window.YM_ID, 'reachGoal', sentKind === 'order' ? 'chat_order' : 'chat_message');
    } catch (x) {
      setState('err');
    }
  });

  // Состояние экрана после отправки: wait — отправляется, ok — доставлено, err — ошибка
  const heading = done.querySelector('h3'), status = done.querySelector('.chat-status'), again = box.querySelector('[data-chat-again]');
  function setState(state) {
    done.dataset.state = state;
    heading.textContent = heading.dataset[state];
    status.textContent = state === 'err' ? box.dataset.fail : status.dataset[state];
    again.textContent = state === 'err' ? again.dataset.retry : again.dataset.again;
    again.hidden = state === 'wait';
  }

  // «Яна хабар ёзиш» — пустая форма; «Қайта уриниш» — та же форма с введёнными данными
  again.addEventListener('click', () => {
    done.hidden = true;
    form.hidden = false;
    message.focus();
  });
})();
