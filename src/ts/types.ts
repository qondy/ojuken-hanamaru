import { Timestamp } from 'firebase/firestore';

/** チェックリスト項目の習得ステータス */
export type ItemStatus = 'todo' | 'learning' | 'done';

/** users/{uid}/progress/{itemKey} — 触った項目だけ作られる */
export interface ProgressEntry {
  status: ItemStatus;
  note: string;
  updatedAt: Timestamp | null;
}

/** users/{uid}/customItems/{autoId} — ユーザーが分野に追加した独自項目 */
export interface CustomItem {
  id: string;
  categoryKey: string;
  label: string;
  createdAt: Timestamp | null;
}

/** users/{uid}/okeiko/{autoId} — 日々のおけいこ記録 */
export interface Okeiko {
  id: string;
  date: string; // YYYY-MM-DD
  content: string; // 取り組んだ内容
  childState: string; // 子どもの様子
  stumble: string; // つまずき・課題
  fields: string[]; // 関連分野（categoryKey の配列）
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

/** users/{uid}/schools/{autoId} — 志望校 */
export interface School {
  id: string;
  name: string;
  examDate: string; // YYYY-MM-DD | ''
  applyStart: string; // YYYY-MM-DD | ''
  applyEnd: string; // YYYY-MM-DD | ''
  note: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type QuestionTarget = 'parent' | 'child';

/** users/{uid}/questions/{autoId} — 面接想定問答 */
export interface Question {
  id: string;
  target: QuestionTarget;
  question: string;
  answer: string;
  mastered: boolean; // 練習した
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}
