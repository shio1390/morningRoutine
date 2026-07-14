const esc = x => String(x).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[c]));
const sort = x => [...x].sort((a, b) => a.order - b.order);

export function home(rows, date) {
  const done = rows.filter(r => r.completedDates?.includes(date)).length;
  const isAllDone = rows.length > 0 && done === rows.length;
  
  if (!rows.length) return `<h1>おはよう！</h1><p class="subtext">あさのじゅんびをしよう</p><section class="empty">☀️<p>まずは、あさやることを<br>つくってみよう！</p><a class="primary-button" href="#routine">あしたのあさやることをつくる</a></section>`;
  
  // 横書きレイアウトにするためのスタイルと、「またあした」ボタンを末尾に追加
  return `<h1>あさやること</h1><p class="subtext">タップして、できた！にしよう</p><div class="progress"><span style="width:${done / rows.length * 100}%"></span></div>
  <div class="todo-list" style="display:flex; flex-direction:column; gap:12px; margin-top:24px;">
    ${sort(rows).map(r => {
      const d = r.completedDates?.includes(date);
      return `<button class="todo-item ${d ? 'is-done' : ''}" data-action="toggle" data-id="${r.id}" aria-pressed="${d}" style="display:flex; align-items:center; width:100%; padding:16px; border-radius:12px; border:2px solid #eee; background:${d ? '#f0fff0' : '#fff'}; text-align:left; font-size:1.2rem; cursor:pointer; gap:12px; transition:all 0.2s; box-sizing:border-box;">
        <span class="item-icon" style="font-size:1.8rem; flex-shrink:0;">${esc(r.icon || '✨')}</span>
        <span class="item-text" style="flex-grow:1; font-weight:bold; ${d ? 'text-decoration:line-through; color:#999;' : ''}">${esc(r.text)}</span>
        <span class="item-status" style="font-size:1.5rem; flex-shrink:0;">${d ? '✅' : '⬜'}</span>
      </button>`
    }).join('')}
  </div>
  ${isAllDone ? `<div style="text-align:center; margin-top:32px;"><button class="primary-button" data-action="reset-routines" style="padding:16px 32px; font-size:1.2rem; border-radius:30px; background-color:#ff8e9e; color:white; border:none; cursor:pointer; font-weight:bold;">またあした 👋</button></div>` : ''}`;
}

function list(rows, type) {
  return rows.length ? `<div class="editable-list" data-sortable="${type}">${sort(rows).map(r => `<div class="list-item" draggable="true" data-id="${r.id}"><span class="drag-handle">⠿</span><span class="item-label" style="display:flex; gap:8px;"><span>${esc(r.icon || '✨')}</span> <span>${esc(r.text)}</span></span><div class="item-actions"><button class="round-action" data-action="edit-${type}" data-id="${r.id}">✏️</button><button class="round-action danger-button" data-action="delete-${type}" data-id="${r.id}">🗑️</button></div></div>`).join('')}</div>` : '<div class="empty">まだないよ。追加してみよう！</div>'
}

export function routine(rows, favs) {
  const used = new Set(rows.map(r => r.favoriteId));
  return `<h1>今日やること</h1><p class="subtext">おしたまま動かして、じゅんばんもかえられるよ</p>
  <section class="section-card">
    <form id="routine-form" class="add-row">
      <input class="text-input" name="icon" maxlength="2" placeholder="😀" style="width:3em; text-align:center;" title="アイコン（絵文字）">
      <input class="text-input" name="text" maxlength="30" required placeholder="たとえば：はをみがく">
      <button class="small-button">追加</button>
    </form>
  </section>
  <h2>今日のリスト</h2>${list(rows, 'routine')}
  <h2>よく使う項目</h2>
  <div class="tags">
    ${favs.length ? sort(favs).map(f => `<button class="tag ${used.has(f.id) ? 'added' : ''}" data-action="add-fav" data-id="${f.id}">${used.has(f.id) ? '✓ ' : '+ '}${esc(f.icon || '✨')} ${esc(f.text)}</button>`).join('') : '<p class="subtext">「よく使う」画面で追加できるよ</p>'}
  </div>`
}

export function favorites(rows) {
  return `<h1>よく使う項目</h1><p class="subtext">いつものじゅんびを登録しよう</p>
  <section class="section-card">
    <form id="favorite-form" class="add-row">
      <input class="text-input" name="icon" maxlength="2" placeholder="😀" style="width:3em; text-align:center;" title="アイコン（絵文字）">
      <input class="text-input" name="text" maxlength="30" required placeholder="たとえば：かおをあらう">
      <button class="small-button">追加</button>
    </form>
  </section>
  ${list(rows, 'favorite')}`
}

export function config(s) {
  return `<h1>設定</h1><section class="section-card"><div class="setting-row"><div><div class="setting-label">お知らせ</div><p class="setting-help">アプリを開いている間に時刻をチェックします</p></div><label class="switch"><input data-setting="notifications" type="checkbox" ${s.notifications ? 'checked' : ''}><span class="slider"></span></label></div><label class="setting-row"><span class="setting-label">朝のお知らせ</span><input class="time-input" data-setting="morningTime" type="time" value="${s.morningTime}"></label><label class="setting-row"><span class="setting-label">前の日のお知らせ</span><input class="time-input" data-setting="eveTime" type="time" value="${s.eveTime}"></label></section><section class="section-card"><div class="setting-label">データのバックアップ</div><p class="setting-help">この端末のデータをJSONファイルで保存・復元できます。</p><button class="outline-button" data-action="export">エクスポート</button><label class="outline-button file-button">インポート<input data-action="import" type="file" accept="application/json,.json"></label></section>`
}

export function modal(item) {
  return `<div class="modal-backdrop" data-action="close">
    <form id="edit-form" class="modal">
      <h2>なまえをかえる</h2>
      <div style="display:flex; gap:8px; margin-bottom:16px;">
        <input class="text-input" name="icon" value="${esc(item.icon || '✨')}" maxlength="2" style="width:3em; text-align:center;" title="アイコン（絵文字）">
        <input class="text-input" name="text" value="${esc(item.text)}" maxlength="30" required autofocus style="flex-grow:1;">
      </div>
      <div class="modal-actions">
        <button type="button" class="outline-button" data-action="close">やめる</button>
        <button class="small-button">保存</button>
      </div>
    </form>
  </div>`
}

export function toast(msg) {
  const t = document.querySelector('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600)
}

export function hanamaru() {
  document.querySelector('#modal-root').innerHTML = '<div class="hanamaru-overlay"><div class="hanamaru">🌸 はなまる！！ 🌸<small>ぜんぶできたね！すごい！</small></div></div>';
  setTimeout(() => document.querySelector('#modal-root').innerHTML = '', 2600)
}