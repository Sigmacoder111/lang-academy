import type { GraphNode } from "../types/graph";

export const GRAPH: GraphNode[] = [
  // ─── Layer 0: Radicals (no prereqs) ───────────────────────────────

  { id: "r_water",  type: "radical", hanzi: "氵", pinyin: "shuǐ",  meaning: "water",  prereqs: [] },
  { id: "r_wood",   type: "radical", hanzi: "木",  pinyin: "mù",    meaning: "wood",   prereqs: [] },
  { id: "r_sun",    type: "radical", hanzi: "日",  pinyin: "rì",    meaning: "sun",    prereqs: [] },
  { id: "r_mouth",  type: "radical", hanzi: "口",  pinyin: "kǒu",   meaning: "mouth",  prereqs: [] },
  { id: "r_person", type: "radical", hanzi: "人",  pinyin: "rén",   meaning: "person", prereqs: [] },
  { id: "r_woman",  type: "radical", hanzi: "女",  pinyin: "nǚ",    meaning: "woman",  prereqs: [] },
  { id: "r_fire",   type: "radical", hanzi: "火",  pinyin: "huǒ",   meaning: "fire",   prereqs: [] },
  { id: "r_earth",  type: "radical", hanzi: "土",  pinyin: "tǔ",    meaning: "earth",  prereqs: [] },
  { id: "r_heart",  type: "radical", hanzi: "心",  pinyin: "xīn",   meaning: "heart",  prereqs: [] },
  { id: "r_hand",   type: "radical", hanzi: "手",  pinyin: "shǒu",  meaning: "hand",   prereqs: [] },

  // ─── Layer 1: Characters (require radicals) ──────────────────────

  { id: "c_river",    type: "character", hanzi: "河",  pinyin: "hé",    meaning: "river",     prereqs: ["r_water"] },
  { id: "c_forest",   type: "character", hanzi: "林",  pinyin: "lín",   meaning: "forest",    prereqs: ["r_wood"] },
  { id: "c_bright",   type: "character", hanzi: "明",  pinyin: "míng",  meaning: "bright",    prereqs: ["r_sun"] },
  { id: "c_good",     type: "character", hanzi: "好",  pinyin: "hǎo",   meaning: "good",      prereqs: ["r_woman"] },
  { id: "c_sea",      type: "character", hanzi: "海",  pinyin: "hǎi",   meaning: "sea",       prereqs: ["r_water"] },
  { id: "c_big",      type: "character", hanzi: "大",  pinyin: "dà",    meaning: "big",       prereqs: ["r_person"] },
  { id: "c_sky",      type: "character", hanzi: "天",  pinyin: "tiān",  meaning: "sky/day",   prereqs: ["r_person"] },
  { id: "c_fire_char",type: "character", hanzi: "炎",  pinyin: "yán",   meaning: "flame/hot", prereqs: ["r_fire"] },
  { id: "c_earth_land",type: "character", hanzi: "地", pinyin: "dì",    meaning: "land/ground", prereqs: ["r_earth"] },
  { id: "c_think",    type: "character", hanzi: "想",  pinyin: "xiǎng", meaning: "think/want",  prereqs: ["r_heart", "r_wood"] },
  { id: "c_hit",      type: "character", hanzi: "打",  pinyin: "dǎ",    meaning: "hit/play",    prereqs: ["r_hand"] },
  { id: "c_eat",      type: "character", hanzi: "吃",  pinyin: "chī",   meaning: "eat",         prereqs: ["r_mouth"] },
  { id: "c_flow",     type: "character", hanzi: "流",  pinyin: "liú",   meaning: "flow",        prereqs: ["r_water"] },
  { id: "c_rest",     type: "character", hanzi: "休",  pinyin: "xiū",   meaning: "rest",        prereqs: ["r_person", "r_wood"] },
  { id: "c_she",      type: "character", hanzi: "她",  pinyin: "tā",    meaning: "she/her",     prereqs: ["r_woman"] },

  // ─── Layer 2: Words (require characters) ──────────────────────────

  { id: "w_river_flow",  type: "word", hanzi: "河流", pinyin: "héliú",    meaning: "river/stream",   prereqs: ["c_river", "c_flow"] },
  { id: "w_tomorrow",    type: "word", hanzi: "明天", pinyin: "míngtiān", meaning: "tomorrow",       prereqs: ["c_bright", "c_sky"] },
  { id: "w_the_sea",     type: "word", hanzi: "大海", pinyin: "dàhǎi",   meaning: "the sea",        prereqs: ["c_big", "c_sea"] },
  { id: "w_forest",      type: "word", hanzi: "森林", pinyin: "sēnlín",  meaning: "forest",         prereqs: ["c_forest"] },
  { id: "w_earth",       type: "word", hanzi: "大地", pinyin: "dàdì",    meaning: "the earth/land", prereqs: ["c_big", "c_earth_land"] },
  { id: "w_fire",        type: "word", hanzi: "火炎", pinyin: "huǒyán",  meaning: "blaze",          prereqs: ["c_fire_char"] },
  { id: "w_rest",        type: "word", hanzi: "休息", pinyin: "xiūxi",   meaning: "rest/relax",     prereqs: ["c_rest"] },
  { id: "w_good_eat",    type: "word", hanzi: "好吃", pinyin: "hǎochī",  meaning: "delicious",      prereqs: ["c_good", "c_eat"] },
  { id: "w_hit_ball",    type: "word", hanzi: "打球", pinyin: "dǎqiú",   meaning: "play ball",      prereqs: ["c_hit"] },
  { id: "w_think_want",  type: "word", hanzi: "想法", pinyin: "xiǎngfǎ", meaning: "idea/thought",   prereqs: ["c_think"] },
];
