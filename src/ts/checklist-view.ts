import {
  CATEGORIES, Category, GROUPS, STATUS_LABEL, STATUS_ORDER, STATUS_SHORT, builtinItemCount,
} from './checklist';
import {
  ProgressMap, createCustomItem, deleteCustomItem,
  setProgress, subscribeCustomItems, subscribeProgress,
} from './store';
import { CustomItem, ItemStatus } from './types';
import { confirmDelete } from './confirm';
import { el, showToast, textEl } from './ui';
import { setSummary } from './summary';

interface Row {
  key: string;
  label: string;
  custom: boolean;
}

let uid = '';
let progress: ProgressMap = {};
let customItems: CustomItem[] = [];
let unsubs: Array<() => void> = [];
const openCats = new Set<string>();

export function mountChecklist(userId: string): () => void {
  uid = userId;
  progress = {};
  customItems = [];
  unsubs = [
    subscribeProgress(uid, (m) => { progress = m; render(); }),
    subscribeCustomItems(uid, (list) => { customItems = list; render(); }),
  ];
  return () => {
    unsubs.forEach((u) => u());
    unsubs = [];
  };
}

function rowsOf(cat: Category): Row[] {
  const base: Row[] = cat.items.map((it) => ({ key: it.key, label: it.label, custom: false }));
  const extra: Row[] = customItems
    .filter((c) => c.categoryKey === cat.key)
    .map((c) => ({ key: c.id, label: c.label, custom: true }));
  return [...base, ...extra];
}

function statusOf(key: string): ItemStatus {
  return progress[key]?.status ?? 'todo';
}

function countByStatus(rows: Row[]): Record<ItemStatus, number> {
  const c: Record<ItemStatus, number> = { todo: 0, learning: 0, done: 0 };
  rows.forEach((r) => { c[statusOf(r.key)] += 1; });
  return c;
}

function render(): void {
  renderRing();
  renderList();
  pushSummary();
}

function pushSummary(): void {
  let done = 0;
  let learning = 0;
  const total = builtinItemCount() + customItems.length;
  CATEGORIES.forEach((cat) => {
    rowsOf(cat).forEach((r) => {
      const s = statusOf(r.key);
      if (s === 'done') done += 1;
      else if (s === 'learning') learning += 1;
    });
  });
  setSummary({ hanamaruDone: done, hanamaruTotal: total, learning });
}

function renderRing(): void {
  const mount = document.getElementById('checklist-ring');
  if (!mount) return;
  let done = 0;
  const total = builtinItemCount() + customItems.length;
  CATEGORIES.forEach((cat) => rowsOf(cat).forEach((r) => { if (statusOf(r.key) === 'done') done += 1; }));
  const pct = total > 0 ? done / total : 0;
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  mount.innerHTML = '';
  const wrap = el('div', 'ring');
  wrap.innerHTML = `
    <svg class="ring__svg" viewBox="0 0 128 128" aria-hidden="true">
      <circle class="ring__track" cx="64" cy="64" r="${r}" />
      <circle class="ring__fill" cx="64" cy="64" r="${r}"
        stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}" />
    </svg>`;
  const center = el('div', 'ring__center');
  center.append(
    textEl('span', 'ring__pct', `${Math.round(pct * 100)}%`),
    textEl('span', 'ring__label', `◎ ${done} / ${total}`),
  );
  wrap.append(center);
  mount.append(wrap);
}

function renderList(): void {
  const mount = document.getElementById('checklist-mount');
  if (!mount) return;
  mount.innerHTML = '';

  GROUPS.forEach((g) => {
    const cats = CATEGORIES.filter((c) => c.group === g.key);
    mount.append(textEl('h3', 'group-title', g.label));

    cats.forEach((cat) => {
      const rows = rowsOf(cat);
      const cnt = countByStatus(rows);
      const isOpen = openCats.has(cat.key);

      const block = el('div', 'cat-block' + (isOpen ? ' is-open' : ''));

      // header (クリックで開閉)
      const head = el('button', 'cat-head');
      head.type = 'button';
      head.setAttribute('aria-expanded', String(isOpen));
      head.append(
        textEl('span', 'cat-head__icon', cat.icon),
        textEl('span', 'cat-head__name', cat.label),
      );
      const meter = el('span', 'cat-head__meter');
      const fill = el('span', 'cat-head__meter-fill');
      fill.style.width = `${rows.length ? (cnt.done / rows.length) * 100 : 0}%`;
      meter.append(fill);
      head.append(meter);
      head.append(textEl('span', 'cat-head__count', `${cnt.done}/${rows.length}`));
      head.append(textEl('span', 'cat-head__chev', isOpen ? '▲' : '▼'));
      head.addEventListener('click', () => {
        if (openCats.has(cat.key)) openCats.delete(cat.key);
        else openCats.add(cat.key);
        renderList();
      });
      block.append(head);

      if (isOpen) {
        const body = el('div', 'cat-body');
        rows.forEach((row) => body.append(renderItemRow(row)));
        body.append(renderAddRow(cat));
        block.append(body);
      }

      mount.append(block);
    });
  });
}

function renderItemRow(row: Row): HTMLElement {
  const status = statusOf(row.key);
  const wrap = el('div', 'chk-item');

  const top = el('div', 'chk-item__top');
  const label = textEl('span', 'chk-item__label', row.label);
  if (row.custom) label.append(textEl('span', 'chk-item__tag', '追加'));
  top.append(label);

  // segmented control
  const seg = el('div', 'seg');
  STATUS_ORDER.forEach((s) => {
    const b = el('button', 'seg__btn' + (s === status ? ' is-active' : '') + ` seg__btn--${s}`);
    b.type = 'button';
    b.textContent = STATUS_SHORT[s];
    b.title = STATUS_LABEL[s];
    b.setAttribute('aria-label', STATUS_LABEL[s]);
    b.addEventListener('click', () => {
      setProgress(uid, row.key, { status: s }).catch(() => showToast('保存に失敗しました'));
    });
    seg.append(b);
  });
  top.append(seg);
  wrap.append(top);

  // note toggle
  const noteText = progress[row.key]?.note ?? '';
  const actions = el('div', 'chk-item__actions');
  const noteBtn = el('button', 'linkish');
  noteBtn.type = 'button';
  noteBtn.textContent = noteText ? '📝 メモを編集' : '＋ メモ';
  actions.append(noteBtn);

  if (row.custom) {
    const delBtn = el('button', 'linkish is-danger');
    delBtn.type = 'button';
    delBtn.textContent = '🗑 削除';
    delBtn.addEventListener('click', async () => {
      const ok = await confirmDelete(`「${row.label}」を削除しますか？`);
      if (!ok) return;
      deleteCustomItem(uid, row.key)
        .then(() => showToast('削除しました'))
        .catch(() => showToast('削除に失敗しました'));
    });
    actions.append(delBtn);
  }
  wrap.append(actions);

  const noteBox = el('div', 'chk-item__note');
  noteBox.hidden = !noteText;
  const ta = el('textarea');
  ta.value = noteText;
  ta.rows = 2;
  ta.maxLength = 300;
  ta.placeholder = '苦手なところ、声かけのコツ、次にやること…';
  ta.addEventListener('blur', () => {
    const v = ta.value.trim();
    if (v === (progress[row.key]?.note ?? '')) return;
    setProgress(uid, row.key, { note: v }).catch(() => showToast('メモの保存に失敗しました'));
  });
  noteBox.append(ta);
  wrap.append(noteBox);

  noteBtn.addEventListener('click', () => {
    noteBox.hidden = !noteBox.hidden;
    if (!noteBox.hidden) ta.focus();
  });

  return wrap;
}

function renderAddRow(cat: Category): HTMLElement {
  const form = el('form', 'chk-add');
  const input = el('input');
  input.type = 'text';
  input.maxLength = 60;
  input.placeholder = 'この分野に項目を追加';
  const btn = el('button', 'btn btn--ghost btn--sm');
  btn.type = 'submit';
  btn.textContent = '追加';
  form.append(input, btn);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const label = input.value.trim();
    if (!label) return;
    btn.disabled = true;
    createCustomItem(uid, cat.key, label)
      .then(() => { input.value = ''; showToast('項目を追加しました'); })
      .catch(() => showToast('追加に失敗しました'))
      .finally(() => { btn.disabled = false; });
  });
  return form;
}
