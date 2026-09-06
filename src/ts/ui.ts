export function showToast(message: string): void {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

export function openOverlay(overlay: HTMLElement): void {
  overlay.classList.add('is-open');
}

export function closeOverlay(overlay: HTMLElement): void {
  overlay.classList.remove('is-open');
}

/** クリックがオーバーレイ背景そのものだったら閉じる（子要素なら無視） */
export function bindOverlayBackdrop(overlay: HTMLElement, onClose: () => void): void {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) onClose();
  });
}

/** ユーザー入力テキストを安全に表示するための要素を作る（innerHTML不使用） */
export function textEl(tag: string, className: string, text: string): HTMLElement {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = text;
  return el;
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export function formatDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/** 'YYYY-MM-DD' → '10/15(水)'。不正な値は空文字 */
export function formatMd(iso: string): string {
  const d = parseIso(iso);
  if (!d) return '';
  return `${d.getMonth() + 1}/${d.getDate()}(${WEEKDAYS[d.getDay()]})`;
}

export function parseIso(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

export function todayIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** iso の日付が「今日から見て」あと何日か。過去なら負の数 */
export function daysFromToday(iso: string): number | null {
  const target = parseIso(iso);
  if (!target) return null;
  const now = new Date();
  const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const t1 = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  return Math.round((t1 - t0) / 86400000);
}

/** 今日を含む直近7日以内（月曜起算ではなく単純な7日窓）に何日ぶんの記録があるか */
export function isWithinLastDays(iso: string, days: number): boolean {
  const n = daysFromToday(iso);
  return n !== null && n <= 0 && n > -days;
}
