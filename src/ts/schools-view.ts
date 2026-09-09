import {
  SchoolInput, createSchool, deleteSchool, subscribeSchools, updateSchool,
} from './store';
import { School } from './types';
import { confirmDelete } from './confirm';
import {
  daysFromToday, el, formatMd, showToast, textEl,
} from './ui';
import { setSummary } from './summary';

let uid = '';
let list: School[] = [];
let editingId: string | null = null;
let unsub: (() => void) | null = null;

let form: HTMLFormElement;
let inName: HTMLInputElement;
let inExam: HTMLInputElement;
let inStart: HTMLInputElement;
let inEnd: HTMLInputElement;
let inNote: HTMLInputElement;
let btnSubmit: HTMLButtonElement;
let btnCancel: HTMLButtonElement;
let formTitle: HTMLElement;
let listMount: HTMLElement;
let emptyEl: HTMLElement;

export function mountSchools(userId: string): () => void {
  uid = userId;
  list = [];
  editingId = null;

  form = document.getElementById('school-form') as HTMLFormElement;
  inName = document.getElementById('sc-name') as HTMLInputElement;
  inExam = document.getElementById('sc-exam') as HTMLInputElement;
  inStart = document.getElementById('sc-apply-start') as HTMLInputElement;
  inEnd = document.getElementById('sc-apply-end') as HTMLInputElement;
  inNote = document.getElementById('sc-note') as HTMLInputElement;
  btnSubmit = document.getElementById('btn-school-submit') as HTMLButtonElement;
  btnCancel = document.getElementById('btn-school-cancel') as HTMLButtonElement;
  formTitle = document.getElementById('school-form-title') as HTMLElement;
  listMount = document.getElementById('school-list') as HTMLElement;
  emptyEl = document.getElementById('school-empty') as HTMLElement;

  resetForm();
  form.onsubmit = onSubmit;
  btnCancel.onclick = () => resetForm();

  unsub = subscribeSchools(uid, (items) => {
    list = sortSchools(items);
    renderList();
    pushSummary();
  });

  return () => { if (unsub) { unsub(); unsub = null; } };
}

function sortSchools(items: School[]): School[] {
  return [...items].sort((a, b) => {
    if (a.examDate && b.examDate) return a.examDate < b.examDate ? -1 : a.examDate > b.examDate ? 1 : 0;
    if (a.examDate) return -1;
    if (b.examDate) return 1;
    return 0;
  });
}

function resetForm(): void {
  editingId = null;
  form.reset();
  formTitle.textContent = '志望校を追加する';
  btnSubmit.textContent = '追加する';
  btnCancel.hidden = true;
}

function startEdit(s: School): void {
  editingId = s.id;
  inName.value = s.name;
  inExam.value = s.examDate;
  inStart.value = s.applyStart;
  inEnd.value = s.applyEnd;
  inNote.value = s.note;
  formTitle.textContent = '志望校を編集';
  btnSubmit.textContent = '更新する';
  btnCancel.hidden = false;
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function onSubmit(e: SubmitEvent): void {
  e.preventDefault();
  if (btnSubmit.disabled) return;
  const name = inName.value.trim();
  if (!name) { showToast('学校名を入力してください'); return; }
  const input: SchoolInput = {
    name,
    examDate: inExam.value,
    applyStart: inStart.value,
    applyEnd: inEnd.value,
    note: inNote.value.trim(),
  };
  btnSubmit.disabled = true;
  const task = editingId ? updateSchool(uid, editingId, input) : createSchool(uid, input);
  task
    .then(() => { showToast(editingId ? '更新しました' : '追加しました'); resetForm(); })
    .catch((err: Error) => showToast('保存に失敗しました: ' + err.message))
    .finally(() => { btnSubmit.disabled = false; });
}

function pushSummary(): void {
  let bestName = '';
  let bestDays: number | null = null;
  list.forEach((s) => {
    const d = daysFromToday(s.examDate);
    if (d === null || d < 0) return;
    if (bestDays === null || d < bestDays) { bestDays = d; bestName = s.name; }
  });
  setSummary({ nextExamName: bestName, nextExamDays: bestDays });
}

function renderList(): void {
  listMount.innerHTML = '';
  emptyEl.hidden = list.length > 0;
  list.forEach((s) => listMount.append(renderCard(s)));
}

function examBadge(s: School): HTMLElement {
  const d = daysFromToday(s.examDate);
  if (d === null) return textEl('span', 'sc-badge sc-badge--none', '考査日 未定');
  if (d > 0) return textEl('span', 'sc-badge sc-badge--soon', `考査まで あと${d}日`);
  if (d === 0) return textEl('span', 'sc-badge sc-badge--today', '考査は今日');
  return textEl('span', 'sc-badge sc-badge--done', '考査 終了');
}

function applyText(s: School): string {
  if (!s.applyStart && !s.applyEnd) return '';
  const a = s.applyStart ? formatMd(s.applyStart) : '？';
  const b = s.applyEnd ? formatMd(s.applyEnd) : '？';
  const startD = daysFromToday(s.applyStart);
  const endD = daysFromToday(s.applyEnd);
  let state = '';
  if (startD !== null && endD !== null) {
    if (startD <= 0 && endD >= 0) state = '（受付中）';
    else if (startD > 0) state = `（あと${startD}日で開始）`;
    else if (endD < 0) state = '（終了）';
  }
  return `出願 ${a} 〜 ${b} ${state}`.trim();
}

function renderCard(s: School): HTMLElement {
  const card = el('div', 'sc-card');
  const head = el('div', 'sc-card__head');
  head.append(textEl('span', 'sc-card__name', s.name));
  head.append(examBadge(s));
  card.append(head);

  const meta = el('div', 'sc-card__meta');
  if (s.examDate) meta.append(textEl('span', 'sc-card__exam', `考査日 ${formatMd(s.examDate)}`));
  const ap = applyText(s);
  if (ap) meta.append(textEl('span', 'sc-card__apply', ap));
  if (meta.childElementCount) card.append(meta);

  if (s.note) card.append(textEl('p', 'sc-card__note', s.note));

  const footer = el('div', 'sc-card__footer');
  const edit = el('button', 'linkish');
  edit.type = 'button';
  edit.innerHTML = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-2px;display:inline-block"><path d="M40 12 L52 24 L24 52 L12 52 L12 40 Z"/><line x1="34" y1="18" x2="46" y2="30"/></svg> 編集';
  edit.addEventListener('click', () => startEdit(s));
  const del = el('button', 'linkish is-danger');
  del.type = 'button';
  del.innerHTML = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-2px;display:inline-block"><path d="M14 18 H50"/><path d="M22 18 V12 Q22 10 24 10 H40 Q42 10 42 12 V18"/><path d="M18 18 L21 52 Q21 54 23 54 H41 Q43 54 43 52 L46 18"/><line x1="26" y1="26" x2="27" y2="46"/><line x1="38" y1="26" x2="37" y2="46"/></svg> 削除';
  del.addEventListener('click', async () => {
    const ok = await confirmDelete(`「${s.name}」を削除しますか？`);
    if (!ok) return;
    deleteSchool(uid, s.id)
      .then(() => { showToast('削除しました'); if (editingId === s.id) resetForm(); })
      .catch(() => showToast('削除に失敗しました'));
  });
  footer.append(edit, del);
  card.append(footer);
  return card;
}
