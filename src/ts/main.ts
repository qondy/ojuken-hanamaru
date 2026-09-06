import { onAuthChange, loginWithGoogle, logout } from './auth';
import { submitFeedback } from './feedback';
import {
  bindOverlayBackdrop, closeOverlay, openOverlay, showToast,
} from './ui';
import { initConfirm } from './confirm';
import { resetSummary } from './summary';
import { mountChecklist } from './checklist-view';
import { mountOkeiko } from './okeiko-view';
import { mountSchools } from './schools-view';
import { mountQuestions } from './questions-view';

// ============================================================
// DOM refs
// ============================================================
const loginScreen = document.getElementById('login-screen') as HTMLElement;
const appEl = document.getElementById('app') as HTMLElement;
const userInfo = document.getElementById('user-info') as HTMLElement;
const userAvatar = document.getElementById('user-avatar') as HTMLImageElement;
const userName = document.getElementById('user-name') as HTMLElement;
const btnGoogleLogin = document.getElementById('btn-google-login') as HTMLButtonElement;
const btnLogout = document.getElementById('btn-logout') as HTMLButtonElement;

const feedbackBtn = document.getElementById('feedback-btn') as HTMLButtonElement;
const feedbackOverlay = document.getElementById('feedback-modal-overlay') as HTMLElement;
const inputFeedbackMessage = document.getElementById('input-feedback-message') as HTMLTextAreaElement;
const btnFeedbackClose = document.getElementById('btn-feedback-close') as HTMLButtonElement;
const btnFeedbackSend = document.getElementById('btn-feedback-send') as HTMLButtonElement;

// ============================================================
// State
// ============================================================
let teardowns: Array<() => void> = [];

function mountApp(uid: string): void {
  teardowns = [
    mountOkeiko(uid),
    mountChecklist(uid),
    mountSchools(uid),
    mountQuestions(uid),
  ];
}

function unmountApp(): void {
  teardowns.forEach((fn) => {
    try { fn(); } catch { /* noop */ }
  });
  teardowns = [];
  resetSummary();
}

// ============================================================
// Auth
// ============================================================
onAuthChange((user) => {
  unmountApp();
  if (user) {
    loginScreen.classList.add('hidden');
    appEl.classList.remove('hidden');
    userInfo.classList.remove('hidden');
    userAvatar.src = user.photoURL || '';
    userAvatar.alt = '';
    userName.textContent = user.displayName || user.email || '';
    mountApp(user.uid);
  } else {
    loginScreen.classList.remove('hidden');
    appEl.classList.add('hidden');
    userInfo.classList.add('hidden');
  }
});

btnGoogleLogin.addEventListener('click', () => {
  loginWithGoogle().catch((e: Error) => showToast('ログインに失敗しました: ' + e.message));
});

btnLogout.addEventListener('click', () => { logout(); });

// ============================================================
// Feedback modal
// ============================================================
feedbackBtn.addEventListener('click', () => {
  inputFeedbackMessage.value = '';
  openOverlay(feedbackOverlay);
});
btnFeedbackClose.addEventListener('click', () => closeOverlay(feedbackOverlay));
bindOverlayBackdrop(feedbackOverlay, () => closeOverlay(feedbackOverlay));

btnFeedbackSend.addEventListener('click', () => {
  const message = inputFeedbackMessage.value.trim();
  if (!message || btnFeedbackSend.disabled) return;
  btnFeedbackSend.disabled = true;
  submitFeedback(message)
    .then((ok) => {
      showToast(ok ? '送信しました。ありがとうございます！' : '送信に失敗しました');
      if (ok) closeOverlay(feedbackOverlay);
    })
    .finally(() => { btnFeedbackSend.disabled = false; });
});

// ============================================================
// init
// ============================================================
initConfirm();
