import {
  QuestionInput, createQuestion, deleteQuestion, subscribeQuestions, updateQuestion,
} from './store';
import { Question, QuestionTarget } from './types';
import { confirmDelete } from './confirm';
import { el, showToast, textEl } from './ui';

const TARGET_LABEL: Record<QuestionTarget, string> = { parent: '親（保護者）', child: '子ども' };

let uid = '';
let list: Question[] = [];
let activeTab: QuestionTarget = 'parent';
let editingId: string | null = null;
let unsub: (() => void) | null = null;

let form: HTMLFormElement;
let inQ: HTMLTextAreaElement;
let inA: HTMLTextAreaElement;
let btnSubmit: HTMLButtonElement;
let btnCancel: HTMLButtonElement;
let formTitle: HTMLElement;
let tabsMount: HTMLElement;
let progressEl: HTMLElement;
let listMount: HTMLElement;
let emptyEl: HTMLElement;

export function mountQuestions(userId: string): () => void {
  uid = userId;
  list = [];
  editingId = null;
  activeTab = 'parent';

  form = document.getElementById('question-form') as HTMLFormElement;
  inQ = document.getElementById('q-question') as HTMLTextAreaElement;
  inA = document.getElementById('q-answer') as HTMLTextAreaElement;
  btnSubmit = document.getElementById('btn-question-submit') as HTMLButtonElement;
  btnCancel = document.getElementById('btn-question-cancel') as HTMLButtonElement;
  formTitle = document.getElementById('question-form-title') as HTMLElement;
  tabsMount = document.getElementById('q-tabs') as HTMLElement;
  progressEl = document.getElementById('question-progress') as HTMLElement;
  listMount = document.getElementById('question-list') as HTMLElement;
  emptyEl = document.getElementById('question-empty') as HTMLElement;

  tabsMount.querySelectorAll<HTMLElement>('[data-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.target as QuestionTarget;
      if (t !== 'parent' && t !== 'child') return;
      activeTab = t;
      syncTabs();
      if (!editingId) formTitle.textContent = `${TARGET_LABEL[activeTab]}への質問を追加`;
      renderList();
    });
  });

  resetForm();
  form.onsubmit = onSubmit;
  btnCancel.onclick = () => resetForm();

  unsub = subscribeQuestions(uid, (items) => {
    list = items;
    renderList();
  });

  return () => { if (unsub) { unsub(); unsub = null; } };
}

function syncTabs(): void {
  tabsMount.querySelectorAll<HTMLElement>('[data-target]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.target === activeTab);
  });
}

function resetForm(): void {
  editingId = null;
  form.reset();
  syncTabs();
  formTitle.textContent = `${TARGET_LABEL[activeTab]}への質問を追加`;
  btnSubmit.textContent = '追加する';
  btnCancel.hidden = true;
}

function startEdit(q: Question): void {
  editingId = q.id;
  activeTab = q.target;
  syncTabs();
  inQ.value = q.question;
  inA.value = q.answer;
  formTitle.textContent = '質問を編集';
  btnSubmit.textContent = '更新する';
  btnCancel.hidden = false;
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function onSubmit(e: SubmitEvent): void {
  e.preventDefault();
  if (btnSubmit.disabled) return;
  const question = inQ.value.trim();
  if (!question) { showToast('質問を入力してください'); return; }
  const answer = inA.value.trim();
  btnSubmit.disabled = true;

  const task = editingId
    ? updateQuestion(uid, editingId, { target: activeTab, question, answer })
    : createQuestion(uid, { target: activeTab, question, answer } as QuestionInput);
  task
    .then(() => { showToast(editingId ? '更新しました' : '追加しました'); resetForm(); })
    .catch((err: Error) => showToast('保存に失敗しました: ' + err.message))
    .finally(() => { btnSubmit.disabled = false; });
}

function renderList(): void {
  const rows = list.filter((q) => q.target === activeTab);
  listMount.innerHTML = '';
  emptyEl.hidden = rows.length > 0;

  const done = rows.filter((q) => q.mastered).length;
  progressEl.textContent = rows.length ? `練習済み ${done} / ${rows.length}` : '';

  rows.forEach((q) => listMount.append(renderCard(q)));
}

function renderCard(q: Question): HTMLElement {
  const card = el('div', 'qa-card' + (q.mastered ? ' is-done' : ''));

  const qRow = el('div', 'qa-card__q');
  qRow.append(textEl('span', 'qa-card__qmark', 'Q'));
  qRow.append(textEl('p', 'qa-card__qtext', q.question));
  card.append(qRow);

  if (q.answer) {
    const aRow = el('div', 'qa-card__a');
    aRow.append(textEl('span', 'qa-card__amark', 'A'));
    aRow.append(textEl('p', 'qa-card__atext', q.answer));
    card.append(aRow);
  }

  const footer = el('div', 'qa-card__footer');

  const toggle = el('label', 'qa-check');
  const cb = el('input');
  cb.type = 'checkbox';
  cb.checked = q.mastered;
  cb.addEventListener('change', () => {
    updateQuestion(uid, q.id, { mastered: cb.checked }).catch(() => {
      showToast('更新に失敗しました');
      cb.checked = q.mastered;
    });
  });
  toggle.append(cb, textEl('span', '', '練習した'));
  footer.append(toggle);

  const spacer = el('span', 'qa-card__spacer');
  footer.append(spacer);

  const edit = el('button', 'linkish');
  edit.type = 'button';
  edit.innerHTML = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-2px;display:inline-block"><path d="M40 12 L52 24 L24 52 L12 52 L12 40 Z"/><line x1="34" y1="18" x2="46" y2="30"/></svg> 編集';
  edit.addEventListener('click', () => startEdit(q));
  const del = el('button', 'linkish is-danger');
  del.type = 'button';
  del.innerHTML = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-2px;display:inline-block"><path d="M14 18 H50"/><path d="M22 18 V12 Q22 10 24 10 H40 Q42 10 42 12 V18"/><path d="M18 18 L21 52 Q21 54 23 54 H41 Q43 54 43 52 L46 18"/><line x1="26" y1="26" x2="27" y2="46"/><line x1="38" y1="26" x2="37" y2="46"/></svg> 削除';
  del.addEventListener('click', async () => {
    const ok = await confirmDelete('この質問を削除しますか？');
    if (!ok) return;
    deleteQuestion(uid, q.id)
      .then(() => { showToast('削除しました'); if (editingId === q.id) resetForm(); })
      .catch(() => showToast('削除に失敗しました'));
  });
  footer.append(edit, del);
  card.append(footer);
  return card;
}
