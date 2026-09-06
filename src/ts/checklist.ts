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
    icon: '🔢',
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
    icon: '🔷',
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
    icon: '🧩',
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
    icon: '🗣️',
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
    icon: '🧠',
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
    icon: '🌸',
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
    icon: '📏',
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
    icon: '🤝',
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
    icon: '🏃',
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
    icon: '✂️',
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
    icon: '🎨',
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
    icon: '🧦',
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
    icon: '🎤',
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
