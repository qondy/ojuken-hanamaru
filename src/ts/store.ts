import {
  collection, doc, onSnapshot, query, orderBy,
  addDoc, updateDoc, deleteDoc, setDoc,
  serverTimestamp, DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  CustomItem, ItemStatus, Okeiko, ProgressEntry, Question, QuestionTarget, School,
} from './types';

// ============================================================
// progress（チェックリストの習得ステータス）
// ============================================================
function toStatus(raw: unknown): ItemStatus {
  return raw === 'learning' || raw === 'done' ? raw : 'todo';
}

export type ProgressMap = Record<string, ProgressEntry>;

export function subscribeProgress(uid: string, cb: (map: ProgressMap) => void): () => void {
  return onSnapshot(collection(db, 'users', uid, 'progress'), (snap) => {
    const map: ProgressMap = {};
    snap.docs.forEach((d) => {
      const data = d.data();
      map[d.id] = {
        status: toStatus(data.status),
        note: typeof data.note === 'string' ? data.note : '',
        updatedAt: data.updatedAt ?? null,
      };
    });
    cb(map);
  });
}

export function setProgress(
  uid: string,
  itemKey: string,
  patch: Partial<Pick<ProgressEntry, 'status' | 'note'>>,
): Promise<void> {
  return setDoc(
    doc(db, 'users', uid, 'progress', itemKey),
    { ...patch, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

// ============================================================
// customItems（分野へのユーザー追加項目）
// ============================================================
function toCustomItem(id: string, data: DocumentData): CustomItem {
  return {
    id,
    categoryKey: data.categoryKey ?? '',
    label: data.label ?? '',
    createdAt: data.createdAt ?? null,
  };
}

export function subscribeCustomItems(uid: string, cb: (items: CustomItem[]) => void): () => void {
  const q = query(collection(db, 'users', uid, 'customItems'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => toCustomItem(d.id, d.data()))));
}

export function createCustomItem(uid: string, categoryKey: string, label: string): Promise<string> {
  return addDoc(collection(db, 'users', uid, 'customItems'), {
    categoryKey,
    label,
    createdAt: serverTimestamp(),
  }).then((ref) => ref.id);
}

export async function deleteCustomItem(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'customItems', id));
  // ひもづく progress も掃除（無ければ何もしない）
  await deleteDoc(doc(db, 'users', uid, 'progress', id)).catch(() => undefined);
}

// ============================================================
// okeiko（おけいこ記録）
// ============================================================
function toOkeiko(id: string, data: DocumentData): Okeiko {
  return {
    id,
    date: typeof data.date === 'string' ? data.date : '',
    content: data.content ?? '',
    childState: data.childState ?? '',
    stumble: data.stumble ?? '',
    fields: Array.isArray(data.fields) ? data.fields.filter((f: unknown) => typeof f === 'string') : [],
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

export interface OkeikoInput {
  date: string;
  content: string;
  childState: string;
  stumble: string;
  fields: string[];
}

export function subscribeOkeiko(uid: string, cb: (list: Okeiko[]) => void): () => void {
  const q = query(collection(db, 'users', uid, 'okeiko'), orderBy('date', 'desc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => toOkeiko(d.id, d.data()))));
}

export function createOkeiko(uid: string, input: OkeikoInput): Promise<string> {
  return addDoc(collection(db, 'users', uid, 'okeiko'), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }).then((ref) => ref.id);
}

export function updateOkeiko(uid: string, id: string, input: OkeikoInput): Promise<void> {
  return updateDoc(doc(db, 'users', uid, 'okeiko', id), { ...input, updatedAt: serverTimestamp() });
}

export function deleteOkeiko(uid: string, id: string): Promise<void> {
  return deleteDoc(doc(db, 'users', uid, 'okeiko', id));
}

// ============================================================
// schools（志望校）
// ============================================================
function toSchool(id: string, data: DocumentData): School {
  return {
    id,
    name: data.name ?? '',
    examDate: typeof data.examDate === 'string' ? data.examDate : '',
    applyStart: typeof data.applyStart === 'string' ? data.applyStart : '',
    applyEnd: typeof data.applyEnd === 'string' ? data.applyEnd : '',
    note: data.note ?? '',
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

export interface SchoolInput {
  name: string;
  examDate: string;
  applyStart: string;
  applyEnd: string;
  note: string;
}

export function subscribeSchools(uid: string, cb: (list: School[]) => void): () => void {
  const q = query(collection(db, 'users', uid, 'schools'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => toSchool(d.id, d.data()))));
}

export function createSchool(uid: string, input: SchoolInput): Promise<string> {
  return addDoc(collection(db, 'users', uid, 'schools'), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }).then((ref) => ref.id);
}

export function updateSchool(uid: string, id: string, input: SchoolInput): Promise<void> {
  return updateDoc(doc(db, 'users', uid, 'schools', id), { ...input, updatedAt: serverTimestamp() });
}

export function deleteSchool(uid: string, id: string): Promise<void> {
  return deleteDoc(doc(db, 'users', uid, 'schools', id));
}

// ============================================================
// questions（面接想定問答）
// ============================================================
function toQuestion(id: string, data: DocumentData): Question {
  const target: QuestionTarget = data.target === 'child' ? 'child' : 'parent';
  return {
    id,
    target,
    question: data.question ?? '',
    answer: data.answer ?? '',
    mastered: data.mastered === true,
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

export interface QuestionInput {
  target: QuestionTarget;
  question: string;
  answer: string;
}

export function subscribeQuestions(uid: string, cb: (list: Question[]) => void): () => void {
  const q = query(collection(db, 'users', uid, 'questions'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => toQuestion(d.id, d.data()))));
}

export function createQuestion(uid: string, input: QuestionInput): Promise<string> {
  return addDoc(collection(db, 'users', uid, 'questions'), {
    ...input,
    mastered: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }).then((ref) => ref.id);
}

export function updateQuestion(
  uid: string,
  id: string,
  patch: Partial<Pick<Question, 'target' | 'question' | 'answer' | 'mastered'>>,
): Promise<void> {
  return updateDoc(doc(db, 'users', uid, 'questions', id), { ...patch, updatedAt: serverTimestamp() });
}

export function deleteQuestion(uid: string, id: string): Promise<void> {
  return deleteDoc(doc(db, 'users', uid, 'questions', id));
}
