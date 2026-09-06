import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// NOTE: Firebase の Web 設定は秘匿情報ではなく、実質的な防御は firestore.rules 側で行う。
// （他のミニアプリと同様に、この値はコミットして良い）
const firebaseConfig = {
  apiKey: 'AIzaSyAoP34sLgdLGDoeEzHOEDnI9CgygLkjfVw',
  authDomain: 'ojuken-hanamaru.firebaseapp.com',
  projectId: 'ojuken-hanamaru',
  storageBucket: 'ojuken-hanamaru.firebasestorage.app',
  messagingSenderId: '224069807190',
  appId: '1:224069807190:web:05167ce695e0c494735ff7',
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
