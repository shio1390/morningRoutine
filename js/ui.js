const esc = x => String(x).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[c]));
const sort = x => [...x].sort((a, b) => a.order - b.order);

// iPad・タブレットでも押しやすくするための共通スタイル設定
const ipadStyles = `
<style>
  .container-max { max-width: 700px; margin-left: auto; margin-right: auto; }
  .touch-form { display: flex; gap: 12px; margin-bottom: 24px; align-items: stretch; }
  .touch-input {
    font-size: 1.3rem !important; padding: 16px !important; border-radius: 16px !important;
    border: 2px solid #ddd !important; background: #fff; box-sizing: border-box;
  }
  .touch-input:focus { border-color: #ff8e9e !important; outline: none; }
  .touch-btn {
    padding: 0 28px !important; font-size: 1.2rem !important; border-radius: 16px !important;
    background-color: #ff8e9e !important; color: white !important; border: none !important;
    font-weight: bold !important; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 6px rgba(255,142,158,0.2);
  }
  .modal-backdrop {
    display: flex !important; align-items: center !important; justify-content: center !important;
    padding: 24px !important; box-sizing: border-box;
  }
  .touch-modal {
    width: 100% !important; max-width: 520px !important; padding: 40px 32px !important;
    border-radius: 28px !important; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
    margin: 0 !important; box-sizing: border-box;
  }
  .list-item {
    padding: 16px 20px !important; border-radius: 16px !important; margin-bottom: 12px !important;
    gap: 16px !important; background: #fff; border: 2px solid #eee; box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  }
  .item-label { font-size: 1.3rem !important; font-weight: bold !important; }
  .round-action {
    width: 48px !important; height: 48px !important; font-size: 1.3rem !important;
    display: flex !important; align-items: center; justify-content: center;
    border-radius: 50% !important; border: none; cursor: pointer;
  }
  .section-card { padding: 24px !important; border-radius: 24px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  h1, h2 { text-align: center; }
  .subtext { text-align: center; font-size: 1.1rem; margin-bottom: 24px; }
  .tag { padding: 12px 20px !important; font-size: 1.2rem !important; border-radius: 24px !important; }
  .setting-row { padding: 16px 0 !important; font-size: 1.2rem !important; }
</style>
`;

export function home(rows, date) {
  const done = rows.filter(r => r.completedDates?.includes(date)).length;
  const isAllDone = rows.length > 0 && done === rows.length;
  
  if (!rows.length) return `${ipadStyles}<h1>おはよう！</h1><p class="subtext">あさのじゅんびをしよう</p><section class="empty container-max">☀️<p>まずは、あさやることを<br>つくってみよう！</p><a class="primary-button" href="#routine">あしたのあさやることをつくる</a></section>`;
  
  return `${ipadStyles}<h1>あさやること</h1><p class="subtext">タップして、できた！にしよう</p><div class="progress container-max"><span style="width:${done / rows.length * 100}%"></span></div>
  <div class="container-max" style="display:flex; flex-direction:column; gap:16px; margin-top:24px; padding-bottom:40px;">
    ${sort(rows).map(r => {
      const d = r.completedDates?.includes(date);
      // ① 完了時の色を緑から変更。未完了はテーマカラー（ピンク）の太枠で可愛く、完了後はグレー系で落ち着かせるデザイン
      const bg = d ? '#f8f9fa' : '#ffffff';
      const border = d ? '#e9ecef' : '#ff8e9e';
      const textColor = d ? '#adb5bd' : '#333333';
      
      return `<button class="todo-item ${d ? 'is-done' : ''}" data-action="toggle" data-id="${r.id}" aria-pressed="${d}" style="display:flex; align-items:center; width:100%; padding:20px 24px; border-radius:20px; border:3px solid ${border}; background:${bg}; text-align:left; font-size:1.4rem; cursor:pointer; gap:16px; transition:all 0.2s; box-sizing:border-box; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
        <span class="item-icon" style="font-size:2.2rem; flex-shrink:0; ${d ? 'opacity:0.5;' : ''}">${esc(r.icon || '✨')}</span>
        <span class="item-text" style="flex-grow:1; font-weight:bold; color:${textColor}; ${d ? 'text-decoration:line-through;' : ''}">${esc(r.text)}</span>
        <span class="item-status" style="font-size:1.8rem; flex-shrink:0;">${d ? '✔' : '⬜'}</span>
      </button>`
    }).join('')}
    ${isAllDone ? `<div style="text-align:center; margin-top:24px;"><button class="primary-button" data-action="reset-routines" style="padding:18px 40px; font-size:1.3rem; border-radius:40px; background-color:#ff8e9e; color:white; border:none; cursor:pointer; font-weight:bold; box-shadow:0 8px 16px rgba(255,142,158,0.3);">またあした 👋</button></div>` : ''}
  </div>`;
}

function list(rows, type) {
  return rows.length ? `<div class="editable-list container-max" data-sortable="${type}">${sort(rows).map(r => `<div class="list-item" draggable="true" data-id="${r.id}"><span class="drag-handle" style="font-size:1.6rem; color:#ccc; padding:0 8px;">⠿</span><span class="item-label" style="display:flex; align-items:center; gap:12px; flex-grow:1;"><span style="font-size:1.8rem;">${esc(r.icon || '✨')}</span> <span>${esc(r.text)}</span></span><div class="item-actions" style="display:flex; gap:8px;"><button class="round-action" data-action="edit-${type}" data-id="${r.id}" style="background:#f5f5f5;">✏️</button><button class="round-action danger-button" data-action="delete-${type}" data-id="${r.id}" style="background:#fff0f0;">🗑️</button></div></div>`).join('')}</div>` : '<div class="empty">まだないよ。追加してみよう！</div>'
}

export function routine(rows, favs) {
  const used = new Set(rows.map(r => r.favoriteId));
  return `${ipadStyles}<h1>今日やること</h1><p class="subtext">おしたまま動かして、じゅんばんもかえられるよ</p>
  <section class="section-card container-max">
    <form id="routine-form" class="touch-form">
      <input class="touch-input" name="icon" maxlength="2" placeholder="😀" style="width:4em; text-align:center;" title="アイコン（絵文字）">
      <input class="touch-input" name="text" maxlength="30" required placeholder="たとえば：はをみがく" style="flex-grow:1;">
      <button class="touch-btn">追加</button>
    </form>
  </section>
  <h2>今日のリスト</h2>${list(rows, 'routine')}
  <h2 style="margin-top:32px;">よく使う項目</h2>
  <div class="tags container-max">
    ${favs.length ? sort(favs).map(f => `<button class="tag ${used.has(f.id) ? 'added' : ''}" data-action="add-fav" data-id="${f.id}">${used.has(f.id) ? '✓ ' : '+ '}${esc(f.icon || '✨')} ${esc(f.text)}</button>`).join('') : '<p class="subtext">「よく使う」画面で追加できるよ</p>'}
  </div>`
}

export function favorites(rows) {
  return `${ipadStyles}<h1>よく使う項目</h1><p class="subtext">いつものじゅんびを登録しよう</p>
  <section class="section-card container-max">
    <form id="favorite-form" class="touch-form">
      <input class="touch-input" name="icon" maxlength="2" placeholder="😀" style="width:4em; text-align:center;" title="アイコン（絵文字）">
      <input class="touch-input" name="text" maxlength="30" required placeholder="たとえば：かおをあらう" style="flex-grow:1;">
      <button class="touch-btn">追加</button>
    </form>
  </section>
  ${list(rows, 'favorite')}`
}

export function config(s) {
  return `${ipadStyles}<h1>設定</h1><section class="section-card container-max"><div class="setting-row"><div><div class="setting-label">お知らせ</div><p class="setting-help">アプリを開いている間に時刻をチェックします</p></div><label class="switch"><input data-setting="notifications" type="checkbox" ${s.notifications ? 'checked' : ''}><span class="slider"></span></label></div><label class="setting-row"><span class="setting-label">朝のお知らせ</span><input class="time-input" data-setting="morningTime" type="time" value="${s.morningTime}"></label><label class="setting-row"><span class="setting-label">前の日のお知らせ</span><input class="time-input" data-setting="eveTime" type="time" value="${s.eveTime}"></label></section><section class="section-card container-max" style="margin-top:24px;"><div class="setting-label">データのバックアップ</div><p class="setting-help">この端末のデータをJSONファイルで保存・復元できます。</p><div style="display:flex; gap:16px; margin-top:16px;"><button class="outline-button" data-action="export" style="flex:1; padding:12px; border-radius:12px;">エクスポート</button><label class="outline-button file-button" style="flex:1; padding:12px; border-radius:12px; text-align:center;">インポート<input data-action="import" type="file" accept="application/json,.json"></label></div></section>`
}

export function modal(item) {
  return `${ipadStyles}<div class="modal-backdrop" data-action="close">
    <form id="edit-form" class="modal touch-modal">
      <h2 style="margin-top:0; margin-bottom:24px; text-align:center; font-size:1.6rem;">なまえをかえる</h2>
      <div class="touch-form" style="margin-bottom:32px;">
        <input class="touch-input" name="icon" value="${esc(item.icon || '✨')}" maxlength="2" style="width:4em; text-align:center;" title="アイコン（絵文字）">
        <input class="touch-input" name="text" value="${esc(item.text)}" maxlength="30" required autofocus style="flex-grow:1;">
      </div>
      <div class="modal-actions" style="display:flex; gap:16px;">
        <button type="button" class="outline-button touch-modal-btn" data-action="close" style="border:2px solid #ddd; background:transparent;">やめる</button>
        <button class="touch-btn touch-modal-btn" style="padding:16px !important;">保存</button>
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
  document.querySelector('#modal-root').innerHTML = `${ipadStyles}<div class="hanamaru-overlay"><div class="hanamaru" style="font-size:2rem; padding:40px; border-radius:40px;">🌸 はなまる！！ 🌸<small style="display:block; font-size:1.3rem; margin-top:16px;">ぜんぶできたね！すごい！</small></div></div>`;
  setTimeout(() => document.querySelector('#modal-root').innerHTML = '', 2600)
}
