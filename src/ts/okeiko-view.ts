import { CATEGORIES, categoryByKey } from './checklist';
import {
  OkeikoInput, createOkeiko, deleteOkeiko, subscribeOkeiko, updateOkeiko,
} from './store';
import { Okeiko } from './types';
import { confirmDelete } from './confirm';
import {
  el, formatMd, isWithinLastDays, showToast, textEl, todayIso,
} from './ui';
import { setSummary } from './summary';

let uid = '';
let list: Okeiko[] = [];
let editingId: string | null = null;
let unsub: (() => void) | null = null;

const selectedFields = new Set<string>();

// DOM
let form: HTMLFormElement;
let inputDate: HTMLInputElement;
let inputContent: HTMLTextAreaElement;
let inputChild: HTMLInputElement;
let inputStumble: HTMLInputElement;
let fieldsMount: HTMLElement;
let btnSubmit: HTMLButtonElement;
let btnCancel: HTMLButtonElement;
let formTitle: HTMLElement;
let listMount: HTMLElement;
let emptyEl: HTMLElement;

export function mountOkeiko(userId: string): () => void {
  uid = userId;
  list = [];
  editingId = null;
  selectedFields.clear();

  form = document.getElementById('okeiko-form') as HTMLFormElement;
  inputDate = document.getElementById('ok-date') as HTMLInputElement;
  inputContent = document.getElementById('ok-content') as HTMLTextAreaElement;
  inputChild = document.getElementById('ok-child') as HTMLInputElement;
  inputStumble = document.getElementById('ok-stumble') as HTMLInputElement;
  fieldsMount = document.getElementById('ok-fields') as HTMLElement;
  btnSubmit = document.getElementById('btn-okeiko-submit') as HTMLButtonElement;
  btnCancel = document.getElementById('btn-okeiko-cancel') as HTMLButtonElement;
  formTitle = document.getElementById('okeiko-form-title') as HTMLElement;
  listMount = document.getElementById('okeiko-list') as HTMLElement;
  emptyEl = document.getElementById('okeiko-empty') as HTMLElement;

  buildFieldChips();
  resetForm();

  form.onsubmit = onSubmit;
  btnCancel.onclick = () => resetForm();

  unsub = subscribeOkeiko(uid, (items) => {
    list = items;
    renderList();
    pushSummary();
  });

  return () => {
    if (unsub) { unsub(); unsub = null; }
  };
}

function buildFieldChips(): void {
  fieldsMount.innerHTML = '';
  CATEGORIES.forEach((cat) => {
    const chip = el('button', 'chip');
    chip.type = 'button';
    chip.dataset.key = cat.key;
    chip.textContent = `${cat.icon} ${cat.label}`;
    chip.addEventListener('click', () => {
      if (selectedFields.has(cat.key)) {
        selectedFields.delete(cat.key);
        chip.classList.remove('is-on');
      } else {
        selectedFields.add(cat.key);
        chip.classList.add('is-on');
      }
    });
    fieldsMount.append(chip);
  });
}

function syncChips(): void {
  fieldsMount.querySelectorAll<HTMLElement>('.chip').forEach((chip) => {
    const on = !!chip.dataset.key && selectedFields.has(chip.dataset.key);
    chip.classList.toggle('is-on', on);
  });
}

function resetForm(): void {
  editingId = null;
  form.reset();
  inputDate.value = todayIso();
  selectedFields.clear();
  syncChips();
  formTitle.textContent = 'おけいこを記録する';
  btnSubmit.textContent = '記録する';
  btnCancel.hidden = true;
}

function startEdit(o: Okeiko): void {
  editingId = o.id;
  inputDate.value = o.date || todayIso();
  inputContent.value = o.content;
  inputChild.value = o.childState;
  inputStumble.value = o.stumble;
  selectedFields.clear();
  o.fields.forEach((f) => selectedFields.add(f));
  syncChips();
  formTitle.textContent = 'おけいこ記録を編集';
  btnSubmit.textContent = '更新する';
  btnCancel.hidden = false;
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function onSubmit(e: SubmitEvent): void {
  e.preventDefault();
  if (btnSubmit.disabled) return;
  const content = inputContent.value.trim();
  if (!content) { showToast('取り組んだ内容を入力してください'); return; }
  const input: OkeikoInput = {
    date: inputDate.value || todayIso(),
    content,
    childState: inputChild.value.trim(),
    stumble: inputStumble.value.trim(),
    fields: [...selectedFields],
  };
  btnSubmit.disabled = true;
  const task = editingId
    ? updateOkeiko(uid, editingId, input)
    : createOkeiko(uid, input);
  task
    .then(() => { showToast(editingId ? '更新しました' : '記録しました'); resetForm(); })
    .catch((err: Error) => showToast('保存に失敗しました: ' + err.message))
    .finally(() => { btnSubmit.disabled = false; });
}

function pushSummary(): void {
  const days = new Set<string>();
  list.forEach((o) => { if (o.date && isWithinLastDays(o.date, 7)) days.add(o.date); });
  setSummary({ weekOkeikoDays: days.size });
}

function renderList(): void {
  listMount.innerHTML = '';
  emptyEl.hidden = list.length > 0;

  let lastDate = '';
  list.forEach((o) => {
    if (o.date !== lastDate) {
      lastDate = o.date;
      listMount.append(textEl('div', 'okeiko-date', formatMd(o.date) || o.date || '日付なし'));
    }
    listMount.append(renderCard(o));
  });
}

function renderCard(o: Okeiko): HTMLElement {
  const card = el('div', 'okeiko-card');
  card.append(textEl('p', 'okeiko-card__content', o.content));

  if (o.childState) {
    const row = el('p', 'okeiko-card__line');
    row.append(textEl('span', 'okeiko-card__k', '様子'));
    row.append(textEl('span', 'okeiko-card__v', o.childState));
    card.append(row);
  }
  if (o.stumble) {
    const row = el('p', 'okeiko-card__line okeiko-card__line--warn');
    row.append(textEl('span', 'okeiko-card__k', '課題'));
    row.append(textEl('span', 'okeiko-card__v', o.stumble));
    card.append(row);
  }

  if (o.fields.length) {
    const tags = el('div', 'okeiko-card__tags');
    o.fields.forEach((f) => {
      const cat = categoryByKey(f);
      tags.append(textEl('span', 'mini-tag', cat ? `${cat.icon} ${cat.label}` : f));
    });
    card.append(tags);
  }

  const footer = el('div', 'okeiko-card__footer');
  const edit = el('button', 'linkish');
  edit.type = 'button';
  edit.textContent = '✏️ 編集';
  edit.addEventListener('click', () => startEdit(o));
  const del = el('button', 'linkish is-danger');
  del.type = 'button';
  del.textContent = '🗑 削除';
  del.addEventListener('click', async () => {
    const ok = await confirmDelete('このおけいこ記録を削除しますか？');
    if (!ok) return;
    deleteOkeiko(uid, o.id)
      .then(() => { showToast('削除しました'); if (editingId === o.id) resetForm(); })
      .catch(() => showToast('削除に失敗しました'));
  });
  footer.append(edit, del);
  card.append(footer);
  return card;
}
