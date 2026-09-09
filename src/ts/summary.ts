interface SummaryState {
  hanamaruDone: number;
  hanamaruTotal: number;
  learning: number;
  nextExamName: string;
  nextExamDays: number | null;
  weekOkeikoDays: number;
}

const state: SummaryState = {
  hanamaruDone: 0,
  hanamaruTotal: 0,
  learning: 0,
  nextExamName: '',
  nextExamDays: null,
  weekOkeikoDays: 0,
};

export function setSummary(patch: Partial<SummaryState>): void {
  Object.assign(state, patch);
  render();
}

export function resetSummary(): void {
  Object.assign(state, {
    hanamaruDone: 0, hanamaruTotal: 0, learning: 0,
    nextExamName: '', nextExamDays: null, weekOkeikoDays: 0,
  });
  render();
}

function render(): void {
  const rateEl = document.getElementById('sum-rate');
  const rateSubEl = document.getElementById('sum-rate-sub');
  const examEl = document.getElementById('sum-exam');
  const examSubEl = document.getElementById('sum-exam-sub');
  const weekEl = document.getElementById('sum-week');
  if (!rateEl || !examEl || !weekEl || !rateSubEl || !examSubEl) return;

  const pct = state.hanamaruTotal > 0
    ? Math.round((state.hanamaruDone / state.hanamaruTotal) * 100)
    : 0;
  rateEl.textContent = `${pct}%`;
  rateSubEl.innerHTML = `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em;vertical-align:-3px;display:inline-block"><circle cx="26" cy="30" r="14"/><circle cx="38" cy="34" r="14"/></svg> ${state.hanamaruDone} / ${state.hanamaruTotal}　練習中 ${state.learning}`;

  if (state.nextExamDays === null) {
    examEl.textContent = '—';
    examSubEl.textContent = '志望校の考査日を登録すると表示されます';
  } else if (state.nextExamDays > 0) {
    examEl.textContent = `あと${state.nextExamDays}日`;
    examSubEl.textContent = state.nextExamName || '考査日';
  } else if (state.nextExamDays === 0) {
    examEl.textContent = '本番';
    examSubEl.textContent = `${state.nextExamName || '考査'}は今日です`;
  } else {
    examEl.textContent = '—';
    examSubEl.textContent = '次の考査日は未登録です';
  }

  weekEl.textContent = `${state.weekOkeikoDays}日`;
}
