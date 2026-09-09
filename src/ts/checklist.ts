import { ItemStatus } from './types';

export type GroupKey = 'paper' | 'nonpaper';

export interface Category {
  key: string;
  label: string;
  icon: string;
  group: GroupKey;
  items: { key: string; label: string }[];
}

export const GROUPS: { key: GroupKey; label: string }[] = [
  { key: 'paper', label: 'ペーパー課題' },
  { key: 'nonpaper', label: '行動・実技・口頭' },
];

/**
 * お受験でよく問われる分野と代表的な課題。
 * item.key は保存キーになるので変更しないこと（ラベルは変更可）。
 */
export const CATEGORIES: Category[] = [
  {
    key: 'paper-kazu',
    label: '数量',
    icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="18" x2="52" y2="18"/><line x1="12" y1="32" x2="52" y2="32"/><line x1="12" y1="46" x2="52" y2="46"/><circle cx="20" cy="18" r="4" fill="currentColor" stroke="none"/><circle cx="32" cy="32" r="4" fill="currentColor" stroke="none"/><circle cx="44" cy="46" r="4" fill="currentColor" stroke="none"/></svg>',
    group: 'paper',
    items: [
      { key: 'paper-kazu__keisu', label: '20くらいまで正しく数える' },
      { key: 'paper-kazu__tasho', label: '多い・少ないを見分ける' },
      { key: 'paper-kazu__gosei', label: '数の合成・分解（いくつといくつ）' },
      { key: 'paper-kazu__wakeru', label: '同じ数ずつに分ける' },
      { key: 'paper-kazu__zougen', label: 'あわせて・のこりは（増減）' },
      { key: 'paper-kazu__taio', label: '一対一の対応' },
      { key: 'paper-kazu__keiretsu', label: '数の系列・規則' },
    ],
  },
  {
    key: 'paper-zukei',
    label: '図形',
    icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="30" width="20" height="20" rx="2"/><circle cx="42" cy="24" r="12"/><path d="M32 52 L44 32 L56 52 Z"/></svg>',
    group: 'paper',
    items: [
      { key: 'paper-zukei__onaji', label: '同じ形をさがす' },
      { key: 'paper-zukei__kosei', label: '形の構成（パズル・分割）' },
      { key: 'paper-zukei__kaiten', label: '回転図形' },
      { key: 'paper-zukei__kasane', label: '重ね図形' },
      { key: 'paper-zukei__ten', label: '点図形（点つなぎ）' },
      { key: 'paper-zukei__taisho', label: '対称図形（線対称）' },
    ],
  },
  {
    key: 'paper-suiri',
    label: '推理・思考',
    icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16 H30 V22 A5 5 0 0 1 40 22 V16 H50 V26 A5 5 0 0 0 50 36 V46 H40 V40 A5 5 0 0 0 30 40 V46 H20 V36 A5 5 0 0 1 20 26 Z"/></svg>',
    group: 'paper',
    items: [
      { key: 'paper-suiri__keiretsu', label: '系列（順番のきまり）' },
      { key: 'paper-suiri__seesaw', label: 'シーソー（重さくらべ）' },
      { key: 'paper-suiri__kanransha', label: '観覧車・回転の推理' },
      { key: 'paper-suiri__blackbox', label: 'ブラックボックス（お約束）' },
      { key: 'paper-suiri__meiro', label: '迷路' },
      { key: 'paper-suiri__joken', label: '条件を整理して考える' },
    ],
  },
  {
    key: 'paper-gengo',
    label: '言語',
    icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="14" width="48" height="30" rx="8"/><path d="M22 44 L14 54 V44"/></svg>',
    group: 'paper',
    items: [
      { key: 'paper-gengo__shiritori', label: 'しりとり' },
      { key: 'paper-gengo__atama', label: '頭の音（あたまおと）' },
      { key: 'paper-gengo__owari', label: '終わりの音' },
      { key: 'paper-gengo__onsu', label: '音の数だけ○をぬる' },
      { key: 'paper-gengo__ugoki', label: '動きことば・様子ことば' },
      { key: 'paper-gengo__hantai', label: '反対ことば' },
      { key: 'paper-gengo__ohanashi', label: 'お話づくり（絵の並べ替え）' },
    ],
  },
  {
    key: 'paper-kioku',
    label: '記憶',
    icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 14 C16 14 12 20 14 26 C8 28 8 38 14 40 C12 46 18 52 26 50 C28 54 36 54 38 50 C46 52 52 46 50 40 C56 38 56 28 50 26 C52 20 48 14 40 14 C36 14 34 16 32 18 C30 16 28 14 24 14 Z"/><line x1="32" y1="18" x2="32" y2="50"/></svg>',
    group: 'paper',
    items: [
      { key: 'paper-kioku__ohanashi', label: 'お話の記憶' },
      { key: 'paper-kioku__e', label: '絵の記憶' },
      { key: 'paper-kioku__ichi', label: '位置の記憶' },
      { key: 'paper-kioku__kazu', label: '数の記憶' },
    ],
  },
  {
    key: 'paper-joshiki',
    label: '常識',
    icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="18" r="7"/><circle cx="46" cy="32" r="7"/><circle cx="32" cy="46" r="7"/><circle cx="18" cy="32" r="7"/><circle cx="32" cy="32" r="6" fill="currentColor" stroke="none"/></svg>',
    group: 'paper',
    items: [
      { key: 'paper-joshiki__kisetsu', label: '季節（花・食べ物・行事）' },
      { key: 'paper-joshiki__gyoji', label: '年中行事' },
      { key: 'paper-joshiki__seibutsu', label: '動物・植物の知識' },
      { key: 'paper-joshiki__sodachi', label: '生き物の育ち方' },
      { key: 'paper-joshiki__manner', label: '生活のマナー・道具の使い方' },
      { key: 'paper-joshiki__shizen', label: '天気・自然の知識' },
      { key: 'paper-joshiki__kotsu', label: '交通ルール・公共の場' },
    ],
  },
  {
    key: 'paper-hikaku',
    label: '比較・位置・分類',
    icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="26" width="48" height="12" rx="2"/><line x1="16" y1="26" x2="16" y2="32"/><line x1="24" y1="26" x2="24" y2="34"/><line x1="32" y1="26" x2="32" y2="32"/><line x1="40" y1="26" x2="40" y2="34"/><line x1="48" y1="26" x2="48" y2="32"/></svg>',
    group: 'paper',
    items: [
      { key: 'paper-hikaku__nagasa', label: '長さくらべ' },
      { key: 'paper-hikaku__hirosa', label: '広さ・かさくらべ' },
      { key: 'paper-hikaku__omosa', label: '重さくらべ' },
      { key: 'paper-hikaku__idou', label: '位置の移動（上下左右）' },
      { key: 'paper-hikaku__shiho', label: '四方からの観察' },
      { key: 'paper-hikaku__nakama', label: '仲間あつめ' },
      { key: 'paper-hikaku__hazure', label: '仲間はずれ' },
    ],
  },
  {
    key: 'koudou',
    label: '行動観察',
    icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="24" r="9"/><path d="M8 50 C8 38 14 34 22 34 C30 34 36 38 36 50"/><circle cx="44" cy="26" r="8"/><path d="M32 50 C32 40 37 36 44 36 C51 36 56 40 56 50"/></svg>',
    group: 'nonpaper',
    items: [
      { key: 'koudou__aisatsu', label: 'あいさつ・返事がはっきりできる' },
      { key: 'koudou__shiji', label: '先生の指示を最後まで聞く' },
      { key: 'koudou__kyoryoku', label: '集団遊びで友だちと協力する' },
      { key: 'koudou__junban', label: '順番・ルールを守る' },
      { key: 'koudou__katazuke', label: '使ったものを自分で片付ける' },
      { key: 'koudou__hatsutaimen', label: '初めての子にも自分から関わる' },
      { key: 'koudou__komatta', label: '困ったとき自分で言える' },
    ],
  },
  {
    key: 'undou',
    label: '運動',
    icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="36" cy="14" r="6"/><path d="M36 20 L30 34 L18 40"/><path d="M30 34 L40 44 L48 38"/><path d="M30 34 L20 26"/><path d="M40 44 L44 56"/><path d="M30 34 L26 56"/></svg>',
    group: 'nonpaper',
    items: [
      { key: 'undou__kenken', label: 'ケンケン（左右とも）' },
      { key: 'undou__skip', label: 'スキップ' },
      { key: 'undou__gallop', label: 'ギャロップ' },
      { key: 'undou__jump', label: '両足跳び・連続ジャンプ' },
      { key: 'undou__balance', label: '片足バランス（10秒）' },
      { key: 'undou__ball_toss', label: 'ボールを投げる・キャッチする' },
      { key: 'undou__ball_tsuki', label: 'ボールつき（ドリブル）' },
      { key: 'undou__kuma', label: 'クマ歩き・くも歩き' },
      { key: 'undou__mohou', label: '模倣体操（先生の真似）' },
    ],
  },
  {
    key: 'kouchisei',
    label: '巧緻性',
    icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="6"/><circle cx="16" cy="48" r="6"/><line x1="20" y1="20" x2="52" y2="52"/><line x1="20" y1="44" x2="52" y2="12"/></svg>',
    group: 'nonpaper',
    items: [
      { key: 'kouchisei__chomusubi', label: 'ちょう結び' },
      { key: 'kouchisei__hasami_choku', label: 'はさみで直線を切る' },
      { key: 'kouchisei__hasami_kyoku', label: 'はさみで曲線・形を切る' },
      { key: 'kouchisei__chigiri', label: 'ちぎり' },
      { key: 'kouchisei__nori', label: 'のりづけ（はみ出さない）' },
      { key: 'kouchisei__origami', label: '折り紙（基本の折り方）' },
      { key: 'kouchisei__himotoshi', label: 'ひも通し・ビーズ通し' },
      { key: 'kouchisei__hashi', label: 'お箸で豆つまみ' },
      { key: 'kouchisei__button', label: 'ボタン・スナップの留め外し' },
    ],
  },
  {
    key: 'seisaku',
    label: '絵画・制作',
    icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M32 10 C16 10 8 22 8 34 C8 44 16 48 22 44 C24 42 28 42 30 46 C32 50 38 50 40 46 C48 44 56 36 56 26 C56 16 46 10 32 10 Z"/><circle cx="20" cy="26" r="3" fill="currentColor" stroke="none"/><circle cx="30" cy="20" r="3" fill="currentColor" stroke="none"/><circle cx="42" cy="22" r="3" fill="currentColor" stroke="none"/></svg>',
    group: 'nonpaper',
    items: [
      { key: 'seisaku__jinbutsu', label: '人物（家族・自分）を描く' },
      { key: 'seisaku__seikatsu', label: '生活の場面を描く' },
      { key: 'seisaku__joken', label: '指示された条件で描く' },
      { key: 'seisaku__nuru', label: '色をていねいに塗る' },
      { key: 'seisaku__mihon', label: '見本を見て作る' },
      { key: 'seisaku__happyo', label: '作品を発表・説明できる' },
    ],
  },
  {
    key: 'seikatsu',
    label: '生活習慣',
    icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 30 L32 12 L52 30"/><path d="M18 26 V52 H46 V26"/><line x1="32" y1="52" x2="32" y2="38"/></svg>',
    group: 'nonpaper',
    items: [
      { key: 'seikatsu__chakudatsu', label: '衣服の着脱・たたむ' },
      { key: 'seikatsu__kutsu', label: '靴をそろえる・座って履く' },
      { key: 'seikatsu__shokuji', label: '食事のマナー・配膳' },
      { key: 'seikatsu__zokin', label: '雑巾しぼり・拭き掃除' },
      { key: 'seikatsu__seiri', label: '持ち物の整理整頓' },
      { key: 'seikatsu__tokei', label: '時計を見て行動する' },
      { key: 'seikatsu__seiketsu', label: '手洗い・うがい・清潔' },
    ],
  },
  {
    key: 'koutou',
    label: '口頭試問・面接',
    icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><rect x="26" y="10" width="12" height="26" rx="6"/><path d="M18 28 A14 14 0 0 0 46 28"/><line x1="32" y1="42" x2="32" y2="52"/><line x1="22" y1="52" x2="42" y2="52"/></svg>',
    group: 'nonpaper',
    items: [
      { key: 'koutou__namae', label: '名前・年齢・誕生日を言える' },
      { key: 'koutou__en', label: '園の名前・担任の先生を言える' },
      { key: 'koutou__suki', label: '好きな遊び・食べ物とその理由' },
      { key: 'koutou__kazoku', label: '家族の紹介・お手伝いのこと' },
      { key: 'koutou__e', label: '絵や写真を見てお話しする' },
      { key: 'koutou__dousuru', label: '「〜のときどうする？」に答える' },
      { key: 'koutou__fukusho', label: '復唱（先生の言葉を繰り返す）' },
      { key: 'koutou__nyutaishitsu', label: '面接の入退室・姿勢・言葉づかい' },
    ],
  },
];

export const STATUS_ORDER: ItemStatus[] = ['todo', 'learning', 'done'];

export const STATUS_LABEL: Record<ItemStatus, string> = {
  todo: '未着手',
  learning: '練習中',
  done: 'はなまる',
};

export const STATUS_SHORT: Record<ItemStatus, string> = {
  todo: '未',
  learning: '練',
  done: '◎',
};

export function categoryByKey(key: string): Category | undefined {
  return CATEGORIES.find((c) => c.key === key);
}

/** builtin の総項目数 */
export function builtinItemCount(): number {
  return CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);
}
