import { bindOverlayBackdrop } from './ui';

let resolver: ((v: boolean) => void) | null = null;

function overlay(): HTMLElement {
  return document.getElementById('confirm-dialog-overlay') as HTMLElement;
}

function settle(v: boolean): void {
  overlay().classList.remove('is-open');
  const r = resolver;
  resolver = null;
  if (r) r(v);
}

export function initConfirm(): void {
  (document.getElementById('btn-confirm-cancel') as HTMLButtonElement)
    .addEventListener('click', () => settle(false));
  (document.getElementById('btn-confirm-delete') as HTMLButtonElement)
    .addEventListener('click', () => settle(true));
  bindOverlayBackdrop(overlay(), () => settle(false));
}

/** カスタムUIの削除確認。OK なら true */
export function confirmDelete(title: string, text = '削除すると元に戻せません。'): Promise<boolean> {
  (document.getElementById('confirm-dialog-title') as HTMLElement).textContent = title;
  (document.getElementById('confirm-dialog-text') as HTMLElement).textContent = text;
  overlay().classList.add('is-open');
  if (resolver) {
    // 直前の確認が未解決なら false で閉じる
    const prev = resolver;
    resolver = null;
    prev(false);
  }
  return new Promise((res) => { resolver = res; });
}
