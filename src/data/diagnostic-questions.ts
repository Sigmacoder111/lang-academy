import type { GraphNode, DiagnosticQuestion } from "../types/graph";

// --- Seeded RNG for deterministic generation ---

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type NodesByLevel = Record<number, GraphNode[]>;

function groupByLevel(graph: GraphNode[]): NodesByLevel {
  const byLevel: NodesByLevel = {};
  for (let i = 1; i <= 6; i++) byLevel[i] = [];
  for (const node of graph) {
    const level = node.hskLevel ?? 0;
    if (level >= 1 && level <= 6) byLevel[level].push(node);
  }
  return byLevel;
}

function findNodeByHanzi(
  graph: GraphNode[],
  hanzi: string,
  hskLevel?: number
): GraphNode | undefined {
  if (hskLevel !== undefined) {
    const exact = graph.find((n) => n.hanzi === hanzi && n.hskLevel === hskLevel);
    if (exact) return exact;
  }
  return graph.find((n) => n.hanzi === hanzi);
}

function stripToneMarks(pinyin: string): string {
  return pinyin
    .toLowerCase()
    .replace(/[āáǎà]/g, "a")
    .replace(/[ēéěè]/g, "e")
    .replace(/[īíǐì]/g, "i")
    .replace(/[ōóǒò]/g, "o")
    .replace(/[ūúǔù]/g, "u")
    .replace(/[ǖǘǚǜ]/g, "ü");
}

function hasChinese(str: string): boolean {
  return /[\u4e00-\u9fff]/.test(str);
}

function isValidDiagnosticNode(n: GraphNode): boolean {
  return (
    (n.type === "character" || n.type === "word") &&
    n.meaning.length > 0 &&
    !hasChinese(n.meaning) &&
    !n.meaning.startsWith("component of")
  );
}

function getInitial(pinyin: string): string {
  const stripped = stripToneMarks(pinyin);
  const initials = [
    "zh", "ch", "sh", "b", "p", "m", "f", "d", "t", "n", "l",
    "g", "k", "h", "j", "q", "x", "z", "c", "s", "r", "y", "w",
  ];
  for (const init of initials) {
    if (stripped.startsWith(init)) return init;
  }
  return "";
}

// --- Format 1: Character → Meaning ---

function generateCharToMeaning(
  byLevel: NodesByLevel
): DiagnosticQuestion[] {
  const questions: DiagnosticQuestion[] = [];
  const rng = seededRandom("diag-f1-v2");

  for (let level = 1; level <= 6; level++) {
    const nodes = byLevel[level].filter(isValidDiagnosticNode);
    const selected = seededShuffle(nodes, rng).slice(0, 20);

    for (const node of selected) {
      const distractorPool = nodes.filter(
        (n) => n.id !== node.id && n.meaning !== node.meaning
      );
      if (distractorPool.length < 3) continue;

      const distractors = seededShuffle(distractorPool, rng).slice(0, 3);
      const allOptions = [node.meaning, ...distractors.map((d) => d.meaning)];
      const shuffled = seededShuffle(allOptions, rng);

      questions.push({
        id: `f1_${node.id}`,
        format: "character_to_meaning",
        prompt: node.hanzi,
        options: shuffled,
        correctIndex: shuffled.indexOf(node.meaning),
        explanation: `${node.hanzi} (${node.pinyin}) means "${node.meaning}".`,
        expectedSeconds: 10,
        hskLevel: level,
        targetNodeId: node.id,
      });
    }
  }

  return questions;
}

// --- Format 2: Meaning → Character ---

function generateMeaningToChar(
  byLevel: NodesByLevel
): DiagnosticQuestion[] {
  const questions: DiagnosticQuestion[] = [];
  const rng = seededRandom("diag-f2-v2");

  for (let level = 1; level <= 6; level++) {
    const nodes = byLevel[level].filter(isValidDiagnosticNode);
    const selected = seededShuffle(nodes, rng).slice(0, 20);

    for (const node of selected) {
      const distractorPool = nodes.filter(
        (n) => n.id !== node.id && n.hanzi !== node.hanzi
      );
      if (distractorPool.length < 3) continue;

      const distractors = seededShuffle(distractorPool, rng).slice(0, 3);
      const allOptions = [node.hanzi, ...distractors.map((d) => d.hanzi)];
      const shuffled = seededShuffle(allOptions, rng);

      questions.push({
        id: `f2_${node.id}`,
        format: "meaning_to_character",
        prompt: node.meaning,
        options: shuffled,
        correctIndex: shuffled.indexOf(node.hanzi),
        explanation: `"${node.meaning}" is ${node.hanzi} (${node.pinyin}).`,
        expectedSeconds: 12,
        hskLevel: level,
        targetNodeId: node.id,
      });
    }
  }

  return questions;
}

// --- Format 3: Sentence Context ---

interface SentenceTemplate {
  sentenceZh: string;
  sentenceEn: string;
  correctHanzi: string;
  distractorHanzi: string[];
  hskLevel: number;
}

const SENTENCE_TEMPLATES: SentenceTemplate[] = [
  // HSK 1
  {
    sentenceZh: "她在学校教书，是一位很好的____。",
    sentenceEn: "She teaches at school, she is a very good ____.",
    correctHanzi: "老师",
    distractorHanzi: ["学生", "朋友", "同学"],
    hskLevel: 1,
  },
  {
    sentenceZh: "他每天都去学校上课，是一个努力的____。",
    sentenceEn: "He goes to school every day, he is a hardworking ____.",
    correctHanzi: "学生",
    distractorHanzi: ["老师", "朋友", "同学"],
    hskLevel: 1,
  },
  {
    sentenceZh: "他和我一起长大，是我最好的____。",
    sentenceEn: "He grew up with me, he is my best ____.",
    correctHanzi: "朋友",
    distractorHanzi: ["老师", "学生", "同学"],
    hskLevel: 1,
  },
  {
    sentenceZh: "北京是____的首都。",
    sentenceEn: "Beijing is the capital of ____.",
    correctHanzi: "中国",
    distractorHanzi: ["你好", "谢谢", "再见"],
    hskLevel: 1,
  },
  {
    sentenceZh: "今天天气很____，我们去散步吧。",
    sentenceEn: "The weather today is very ____, let's go for a walk.",
    correctHanzi: "好",
    distractorHanzi: ["大", "多", "少"],
    hskLevel: 1,
  },
  {
    sentenceZh: "这个苹果很____，我一个人吃不完。",
    sentenceEn: "This apple is very ____, I can't finish it alone.",
    correctHanzi: "大",
    distractorHanzi: ["好", "多", "小"],
    hskLevel: 1,
  },
  {
    sentenceZh: "这只小猫很____，非常可爱。",
    sentenceEn: "This little cat is very ____, very cute.",
    correctHanzi: "小",
    distractorHanzi: ["大", "多", "少"],
    hskLevel: 1,
  },
  {
    sentenceZh: "今天来的人很____，座位不够了。",
    sentenceEn: "There are very ____ people here today, not enough seats.",
    correctHanzi: "多",
    distractorHanzi: ["大", "好", "小"],
    hskLevel: 1,
  },

  // HSK 2
  {
    sentenceZh: "他每天早上都去公园____步。",
    sentenceEn: "He goes to the park to ____ every morning.",
    correctHanzi: "跑",
    distractorHanzi: ["走", "唱", "跳"],
    hskLevel: 2,
  },
  {
    sentenceZh: "你能____我一下吗？这个箱子太重了。",
    sentenceEn: "Can you ____ me? This box is too heavy.",
    correctHanzi: "帮",
    distractorHanzi: ["找", "穿", "唱"],
    hskLevel: 2,
  },
  {
    sentenceZh: "我在____我的钥匙，不知道放哪儿了。",
    sentenceEn: "I am ____ing for my keys, I don't know where I put them.",
    correctHanzi: "找",
    distractorHanzi: ["帮", "穿", "唱"],
    hskLevel: 2,
  },
  {
    sentenceZh: "她的声音很好听，最喜欢____歌。",
    sentenceEn: "Her voice is beautiful, she loves to ____ songs.",
    correctHanzi: "唱",
    distractorHanzi: ["跑", "走", "等"],
    hskLevel: 2,
  },
  {
    sentenceZh: "小孩子们在操场上____绳。",
    sentenceEn: "The children are ____ing rope on the playground.",
    correctHanzi: "跳",
    distractorHanzi: ["走", "唱", "穿"],
    hskLevel: 2,
  },
  {
    sentenceZh: "他____了我一份生日礼物。",
    sentenceEn: "He ____ed me a birthday gift.",
    correctHanzi: "送",
    distractorHanzi: ["找", "帮", "穿"],
    hskLevel: 2,
  },
  {
    sentenceZh: "今天很冷，要多____一件外套。",
    sentenceEn: "It's very cold today, wear one more jacket.",
    correctHanzi: "穿",
    distractorHanzi: ["唱", "跑", "帮"],
    hskLevel: 2,
  },
  {
    sentenceZh: "请____我一下，我马上就来。",
    sentenceEn: "Please ____ for me a moment, I'll be right there.",
    correctHanzi: "等",
    distractorHanzi: ["跑", "唱", "送"],
    hskLevel: 2,
  },
  {
    sentenceZh: "妈妈____了我一些零花钱。",
    sentenceEn: "Mom ____ed me some pocket money.",
    correctHanzi: "给",
    distractorHanzi: ["找", "穿", "帮"],
    hskLevel: 2,
  },
  {
    sentenceZh: "我们____路去学校吧，不远。",
    sentenceEn: "Let's ____ to school, it's not far.",
    correctHanzi: "走",
    distractorHanzi: ["唱", "穿", "跳"],
    hskLevel: 2,
  },

  // HSK 3
  {
    sentenceZh: "他____去北京旅行。",
    sentenceEn: "He ____ed to travel to Beijing.",
    correctHanzi: "决定",
    distractorHanzi: ["练习", "选择", "变化"],
    hskLevel: 3,
  },
  {
    sentenceZh: "我每天都____写汉字。",
    sentenceEn: "I ____ writing Chinese characters every day.",
    correctHanzi: "练习",
    distractorHanzi: ["决定", "选择", "变化"],
    hskLevel: 3,
  },
  {
    sentenceZh: "你可以____一个你喜欢的颜色。",
    sentenceEn: "You can ____ a color you like.",
    correctHanzi: "选择",
    distractorHanzi: ["决定", "练习", "变化"],
    hskLevel: 3,
  },
  {
    sentenceZh: "上海是一个非常繁华的____。",
    sentenceEn: "Shanghai is a very prosperous ____.",
    correctHanzi: "城市",
    distractorHanzi: ["世界", "历史", "文化"],
    hskLevel: 3,
  },
  {
    sentenceZh: "他想去____各地旅行。",
    sentenceEn: "He wants to travel around the ____.",
    correctHanzi: "世界",
    distractorHanzi: ["城市", "环境", "文化"],
    hskLevel: 3,
  },
  {
    sentenceZh: "中国的____非常丰富多彩。",
    sentenceEn: "China's ____ is very rich and colorful.",
    correctHanzi: "文化",
    distractorHanzi: ["城市", "历史", "环境"],
    hskLevel: 3,
  },
  {
    sentenceZh: "这本书讲的是中国的____。",
    sentenceEn: "This book is about China's ____.",
    correctHanzi: "历史",
    distractorHanzi: ["文化", "城市", "环境"],
    hskLevel: 3,
  },
  {
    sentenceZh: "我们应该保护自然____。",
    sentenceEn: "We should protect the natural ____.",
    correctHanzi: "环境",
    distractorHanzi: ["历史", "文化", "城市"],
    hskLevel: 3,
  },
  {
    sentenceZh: "这个城市最近几年的____很大。",
    sentenceEn: "This city has seen big ____ in recent years.",
    correctHanzi: "变化",
    distractorHanzi: ["决定", "练习", "选择"],
    hskLevel: 3,
  },
  {
    sentenceZh: "他有很多工作____。",
    sentenceEn: "He has a lot of work ____.",
    correctHanzi: "经验",
    distractorHanzi: ["历史", "文化", "环境"],
    hskLevel: 3,
  },

  // HSK 4
  {
    sentenceZh: "每个人都是____的一部分。",
    sentenceEn: "Everyone is a part of ____.",
    correctHanzi: "社会",
    distractorHanzi: ["经济", "科技", "教育"],
    hskLevel: 4,
  },
  {
    sentenceZh: "中国的____发展非常迅速。",
    sentenceEn: "China's ____ is developing very rapidly.",
    correctHanzi: "经济",
    distractorHanzi: ["社会", "教育", "计划"],
    hskLevel: 4,
  },
  {
    sentenceZh: "____对孩子的成长非常重要。",
    sentenceEn: "____ is very important for children's growth.",
    correctHanzi: "教育",
    distractorHanzi: ["经济", "科技", "计划"],
    hskLevel: 4,
  },
  {
    sentenceZh: "你有什么旅行____？",
    sentenceEn: "What travel ____ do you have?",
    correctHanzi: "计划",
    distractorHanzi: ["社会", "经济", "教育"],
    hskLevel: 4,
  },
  {
    sentenceZh: "互联网技术在不断____。",
    sentenceEn: "Internet technology is constantly ____ing.",
    correctHanzi: "发展",
    distractorHanzi: ["改革", "建设", "计划"],
    hskLevel: 4,
  },
  {
    sentenceZh: "这次经济____很成功。",
    sentenceEn: "This economic ____ was very successful.",
    correctHanzi: "改革",
    distractorHanzi: ["发展", "建设", "计划"],
    hskLevel: 4,
  },
  {
    sentenceZh: "现代____让人们的生活更方便了。",
    sentenceEn: "Modern ____ has made people's lives more convenient.",
    correctHanzi: "科技",
    distractorHanzi: ["社会", "经济", "教育"],
    hskLevel: 4,
  },
  {
    sentenceZh: "____发布了新的环保政策。",
    sentenceEn: "The ____ released new environmental policies.",
    correctHanzi: "政府",
    distractorHanzi: ["社会", "教育", "科技"],
    hskLevel: 4,
  },
  {
    sentenceZh: "学校____了一次大型运动会。",
    sentenceEn: "The school ____ed a large sports meeting.",
    correctHanzi: "组织",
    distractorHanzi: ["建设", "改革", "发展"],
    hskLevel: 4,
  },
  {
    sentenceZh: "我们正在____一所新的学校。",
    sentenceEn: "We are ____ing a new school.",
    correctHanzi: "建设",
    distractorHanzi: ["组织", "改革", "发展"],
    hskLevel: 4,
  },

  // HSK 5
  {
    sentenceZh: "我们应该____每个人的想法。",
    correctHanzi: "尊重",
    distractorHanzi: ["信任", "表达", "沟通"],
    sentenceEn: "",
    hskLevel: 5,
  },
  {
    sentenceZh: "学习新的____让他非常开心。",
    correctHanzi: "知识",
    distractorHanzi: ["思想", "精神", "道德"],
    sentenceEn: "",
    hskLevel: 5,
  },
  {
    sentenceZh: "经过多年努力，他终于____了。",
    correctHanzi: "成功",
    distractorHanzi: ["失败", "挑战", "经历"],
    sentenceEn: "",
    hskLevel: 5,
  },
  {
    sentenceZh: "虽然这次____了，但他不会放弃。",
    correctHanzi: "失败",
    distractorHanzi: ["成功", "沟通", "表达"],
    sentenceEn: "",
    hskLevel: 5,
  },
  {
    sentenceZh: "学中文对他来说是一个很大的____。",
    correctHanzi: "挑战",
    distractorHanzi: ["目标", "机会", "记忆"],
    sentenceEn: "",
    hskLevel: 5,
  },
  {
    sentenceZh: "你的新年____是什么？",
    correctHanzi: "目标",
    distractorHanzi: ["挑战", "记忆", "印象"],
    sentenceEn: "",
    hskLevel: 5,
  },
  {
    sentenceZh: "不要错过这个好____。",
    correctHanzi: "机会",
    distractorHanzi: ["目标", "挑战", "印象"],
    sentenceEn: "",
    hskLevel: 5,
  },
  {
    sentenceZh: "他不太善于____自己的感情。",
    correctHanzi: "表达",
    distractorHanzi: ["尊重", "信任", "沟通"],
    sentenceEn: "",
    hskLevel: 5,
  },
  {
    sentenceZh: "我们需要更多的____来解决这个问题。",
    correctHanzi: "沟通",
    distractorHanzi: ["表达", "尊重", "信任"],
    sentenceEn: "",
    hskLevel: 5,
  },
  {
    sentenceZh: "朋友之间需要互相____。",
    correctHanzi: "信任",
    distractorHanzi: ["尊重", "表达", "沟通"],
    sentenceEn: "",
    hskLevel: 5,
  },
  {
    sentenceZh: "这位____在大学里教了三十年书。",
    correctHanzi: "教授",
    distractorHanzi: ["知识", "思想", "目标"],
    sentenceEn: "",
    hskLevel: 5,
  },
  {
    sentenceZh: "他是一个非常____的人，从不说谎。",
    correctHanzi: "诚实",
    distractorHanzi: ["谦虚", "理想", "精神"],
    sentenceEn: "",
    hskLevel: 5,
  },

  // HSK 6
  {
    sentenceZh: "他们之间存在很深的____。",
    correctHanzi: "矛盾",
    distractorHanzi: ["和谐", "秩序", "妥协"],
    sentenceEn: "",
    hskLevel: 6,
  },
  {
    sentenceZh: "这个社区的人们相处得很____。",
    correctHanzi: "和谐",
    distractorHanzi: ["混乱", "贫穷", "抽象"],
    sentenceEn: "",
    hskLevel: 6,
  },
  {
    sentenceZh: "两国之间发生了严重的____。",
    correctHanzi: "冲突",
    distractorHanzi: ["妥协", "和谐", "协商"],
    sentenceEn: "",
    hskLevel: 6,
  },
  {
    sentenceZh: "双方最终都做出了____。",
    correctHanzi: "妥协",
    distractorHanzi: ["冲突", "矛盾", "崇拜"],
    sentenceEn: "",
    hskLevel: 6,
  },
  {
    sentenceZh: "两国正在进行和平____。",
    correctHanzi: "谈判",
    distractorHanzi: ["冲突", "崇拜", "赞美"],
    sentenceEn: "",
    hskLevel: 6,
  },
  {
    sentenceZh: "他太____父母了，什么都要父母帮忙。",
    correctHanzi: "依赖",
    distractorHanzi: ["敬佩", "崇拜", "奉献"],
    sentenceEn: "",
    hskLevel: 6,
  },
  {
    sentenceZh: "我非常____他面对困难时的勇气。",
    correctHanzi: "敬佩",
    distractorHanzi: ["依赖", "牺牲", "补偿"],
    sentenceEn: "",
    hskLevel: 6,
  },
  {
    sentenceZh: "她为了家庭____了自己的事业。",
    correctHanzi: "牺牲",
    distractorHanzi: ["崇拜", "赞美", "补偿"],
    sentenceEn: "",
    hskLevel: 6,
  },
  {
    sentenceZh: "他把一生都____给了教育事业。",
    correctHanzi: "奉献",
    distractorHanzi: ["依赖", "崇拜", "补偿"],
    sentenceEn: "",
    hskLevel: 6,
  },
  {
    sentenceZh: "这个地区非常____，需要更多的帮助。",
    correctHanzi: "贫穷",
    distractorHanzi: ["混乱", "和谐", "抽象"],
    sentenceEn: "",
    hskLevel: 6,
  },
  {
    sentenceZh: "战争之后，整个城市陷入了____。",
    correctHanzi: "混乱",
    distractorHanzi: ["秩序", "和谐", "贫穷"],
    sentenceEn: "",
    hskLevel: 6,
  },
  {
    sentenceZh: "大家都____他在科学上的成就。",
    correctHanzi: "赞美",
    distractorHanzi: ["牺牲", "依赖", "妥协"],
    sentenceEn: "",
    hskLevel: 6,
  },
];

function generateSentenceContext(graph: GraphNode[]): DiagnosticQuestion[] {
  const questions: DiagnosticQuestion[] = [];

  for (let ti = 0; ti < SENTENCE_TEMPLATES.length; ti++) {
    const template = SENTENCE_TEMPLATES[ti];
    const correctNode = findNodeByHanzi(graph, template.correctHanzi, template.hskLevel);
    if (!correctNode) continue;

    const distractorNodes: string[] = [];
    for (const hanzi of template.distractorHanzi) {
      const node = findNodeByHanzi(graph, hanzi, template.hskLevel) ??
                   findNodeByHanzi(graph, hanzi);
      if (node) distractorNodes.push(node.hanzi);
    }
    if (distractorNodes.length < 3) continue;

    const rng = seededRandom(`f3_${correctNode.id}_${ti}`);
    const allOptions = [correctNode.hanzi, ...distractorNodes.slice(0, 3)];
    const shuffled = seededShuffle(allOptions, rng);

    const showTranslation = template.hskLevel <= 3 && template.sentenceEn !== "";

    questions.push({
      id: `f3_${correctNode.id}_${ti}`,
      format: "sentence_context",
      prompt: "Choose the word that best completes the sentence:",
      sentenceZh: template.sentenceZh,
      sentenceEn: showTranslation ? template.sentenceEn : undefined,
      options: shuffled,
      correctIndex: shuffled.indexOf(correctNode.hanzi),
      explanation: `${correctNode.hanzi} (${correctNode.pinyin}) means "${correctNode.meaning}" and fits the sentence context.`,
      expectedSeconds: template.hskLevel <= 3 ? 15 : 18,
      hskLevel: template.hskLevel,
      targetNodeId: correctNode.id,
    });
  }

  return questions;
}

// --- Format 4: Pinyin → Character ---

function generatePinyinToChar(byLevel: NodesByLevel): DiagnosticQuestion[] {
  const questions: DiagnosticQuestion[] = [];
  const rng = seededRandom("diag-f4-v2");

  for (let level = 1; level <= 6; level++) {
    const chars = byLevel[level].filter(
      (n) => n.type === "character" && n.pinyin.length > 0
    );
    if (chars.length < 4) continue;

    const bySyllable: Record<string, GraphNode[]> = {};
    for (const c of chars) {
      const base = stripToneMarks(c.pinyin);
      if (!bySyllable[base]) bySyllable[base] = [];
      bySyllable[base].push(c);
    }

    const byInitial: Record<string, GraphNode[]> = {};
    for (const c of chars) {
      const init = getInitial(c.pinyin);
      if (!byInitial[init]) byInitial[init] = [];
      byInitial[init].push(c);
    }

    const usedTargets = new Set<string>();

    for (const [, nodes] of Object.entries(bySyllable)) {
      if (nodes.length < 2) continue;

      for (const target of nodes) {
        if (usedTargets.has(target.id)) continue;

        const sameSyllableDistractors = nodes
          .filter((n) => n.id !== target.id && n.hanzi !== target.hanzi)
          .slice(0, 2);

        const init = getInitial(target.pinyin);
        const sameInitialDistractors = (byInitial[init] ?? []).filter(
          (n) =>
            n.id !== target.id &&
            n.hanzi !== target.hanzi &&
            !sameSyllableDistractors.some((d) => d.id === n.id)
        );

        const otherDistractors = seededShuffle(
          chars.filter(
            (n) =>
              n.id !== target.id &&
              n.hanzi !== target.hanzi &&
              !sameSyllableDistractors.some((d) => d.id === n.id) &&
              !sameInitialDistractors.some((d) => d.id === n.id)
          ),
          rng
        );

        const distractors = [
          ...sameSyllableDistractors,
          ...seededShuffle(sameInitialDistractors, rng),
          ...otherDistractors,
        ].slice(0, 3);

        if (distractors.length < 3) continue;

        const allOptions = [target.hanzi, ...distractors.map((d) => d.hanzi)];
        const shuffled = seededShuffle(allOptions, rng);

        questions.push({
          id: `f4_${target.id}`,
          format: "pinyin_to_character",
          prompt: target.pinyin,
          options: shuffled,
          correctIndex: shuffled.indexOf(target.hanzi),
          explanation: `${target.pinyin} is the pronunciation of ${target.hanzi}, meaning "${target.meaning}".`,
          expectedSeconds: 12,
          hskLevel: level,
          targetNodeId: target.id,
        });

        usedTargets.add(target.id);

        if (questions.filter((q) => q.hskLevel === level && q.format === "pinyin_to_character").length >= 8) {
          break;
        }
      }

      if (questions.filter((q) => q.hskLevel === level && q.format === "pinyin_to_character").length >= 8) {
        break;
      }
    }
  }

  return questions;
}

// --- Format 5: Reading Comprehension (HSK 4-6) ---

interface ReadingCompTemplate {
  passage: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hskLevel: number;
}

const READING_COMP_TEMPLATES: ReadingCompTemplate[] = [
  // HSK 4
  {
    passage: "他虽然很累，但还是坚持把工作做完了。",
    question: "What does this sentence tell us about him?",
    options: [
      "He finished the work despite being tired",
      "He gave up because he was too tired",
      "He asked someone else to finish the work",
      "He decided to rest before continuing",
    ],
    correctIndex: 0,
    explanation:
      "虽然...但还是 means 'although...still', indicating he persisted despite tiredness.",
    hskLevel: 4,
  },
  {
    passage: "虽然下雨了，我们还是决定去公园散步。",
    question: "What did they decide to do?",
    options: [
      "Go to the park despite the rain",
      "Stay home because of the rain",
      "Wait for the rain to stop",
      "Go shopping instead",
    ],
    correctIndex: 0,
    explanation:
      "还是决定 means 'still decided to', showing they went to the park regardless of rain.",
    hskLevel: 4,
  },
  {
    passage: "这家餐厅的菜不但好吃，而且价格也很合理。",
    question: "How is this restaurant described?",
    options: [
      "The food is tasty and reasonably priced",
      "The food is expensive but delicious",
      "The restaurant is cheap but has bad food",
      "The restaurant recently changed its menu",
    ],
    correctIndex: 0,
    explanation:
      "不但...而且 means 'not only...but also', praising both taste and price.",
    hskLevel: 4,
  },
  {
    passage: "如果明天天气好的话，我们就去爬山。",
    question: "What is the plan?",
    options: [
      "Go hiking if the weather is nice",
      "Go hiking regardless of weather",
      "Cancel the hiking trip entirely",
      "Go hiking only if it rains",
    ],
    correctIndex: 0,
    explanation:
      "如果...就 means 'if...then', making the hiking conditional on good weather.",
    hskLevel: 4,
  },
  {
    passage: "她每天早上六点起床，先跑步，然后吃早饭。",
    question: "What is her morning routine?",
    options: [
      "Wake at 6, run, then eat breakfast",
      "Eat breakfast before running",
      "Run in the evening after work",
      "Wake at 6 but skip breakfast",
    ],
    correctIndex: 0,
    explanation:
      "先...然后 indicates the sequence: first running, then breakfast.",
    hskLevel: 4,
  },
  {
    passage: "学中文的时候，最重要的是多练习说话。",
    question: "What is the key advice about learning Chinese?",
    options: [
      "Practice speaking more",
      "Focus on writing characters",
      "Read as many books as possible",
      "Watch Chinese TV shows",
    ],
    correctIndex: 0,
    explanation:
      "最重要的是多练习说话 means 'the most important thing is to practice speaking more'.",
    hskLevel: 4,
  },
  {
    passage: "他把手机忘在了出租车上，所以打不了电话。",
    question: "Why can't he make a phone call?",
    options: [
      "He left his phone in a taxi",
      "His phone battery died",
      "He doesn't own a phone",
      "The phone signal is weak",
    ],
    correctIndex: 0,
    explanation:
      "忘在了出租车上 means 'left it in the taxi', explaining why he can't call.",
    hskLevel: 4,
  },
  {
    passage: "这本书我已经看了三遍了，每次都有新的收获。",
    question: "What does the speaker say about the book?",
    options: [
      "Read it three times, learned something new each time",
      "Read it once and didn't enjoy it",
      "Only read part of it",
      "Plans to read it for the first time",
    ],
    correctIndex: 0,
    explanation:
      "看了三遍 means 'read three times', 每次都有新的收获 means 'gained something new each time'.",
    hskLevel: 4,
  },

  // HSK 5
  {
    passage: "随着科技的发展，人们的生活变得越来越方便了。",
    question: "What has been the impact of technological development?",
    options: [
      "Life has become more convenient",
      "People have become less social",
      "Technology has caused many problems",
      "Life has become more expensive",
    ],
    correctIndex: 0,
    explanation:
      "越来越方便 means 'more and more convenient', describing the positive impact of technology.",
    hskLevel: 5,
  },
  {
    passage: "他对自己的成绩不太满意，决定更加努力学习。",
    question: "Why did he decide to study harder?",
    options: [
      "He was unsatisfied with his grades",
      "His teacher required it",
      "He wanted to compete with classmates",
      "He was preparing for a vacation",
    ],
    correctIndex: 0,
    explanation:
      "不太满意 means 'not very satisfied', which motivated harder study.",
    hskLevel: 5,
  },
  {
    passage: "这个城市的交通非常发达，坐地铁去哪儿都很方便。",
    question: "What is noted about this city?",
    options: [
      "It has excellent public transportation",
      "It has too many cars on the road",
      "The subway system is being built",
      "Traffic jams are very common",
    ],
    correctIndex: 0,
    explanation:
      "交通非常发达 means 'transportation is very developed'; 坐地铁很方便 means 'taking the subway is convenient'.",
    hskLevel: 5,
  },
  {
    passage: "她不仅会说中文，还能流利地说日语和韩语。",
    question: "What is special about her language abilities?",
    options: [
      "She speaks Chinese, Japanese, and Korean fluently",
      "She only speaks Chinese",
      "She is currently learning Japanese",
      "She can read but cannot speak these languages",
    ],
    correctIndex: 0,
    explanation:
      "不仅...还 means 'not only...but also', showing multilingual ability.",
    hskLevel: 5,
  },
  {
    passage: "保护环境是每个人的责任，我们应该从小事做起。",
    question: "What is the main message?",
    options: [
      "Everyone should protect the environment starting with small actions",
      "Only the government should protect the environment",
      "Environmental protection is not important",
      "Big changes are needed, not small ones",
    ],
    correctIndex: 0,
    explanation:
      "每个人的责任 means 'everyone's responsibility'; 从小事做起 means 'start from small things'.",
    hskLevel: 5,
  },
  {
    passage:
      "他在大学学习了四年计算机专业，毕业后在一家科技公司工作。",
    question: "What did he do after graduating?",
    options: [
      "He worked at a technology company",
      "He continued studying",
      "He changed his major",
      "He started his own business",
    ],
    correctIndex: 0,
    explanation:
      "毕业后 means 'after graduating'; 在一家科技公司工作 means 'worked at a technology company'.",
    hskLevel: 5,
  },
  {
    passage:
      "虽然这次比赛没有获得第一名，但她觉得自己进步了很多。",
    question: "How did she feel about the competition?",
    options: [
      "She felt she improved a lot despite not winning",
      "She was very disappointed with her performance",
      "She won first place",
      "She decided to quit competing",
    ],
    correctIndex: 0,
    explanation:
      "没有获得第一名 means 'didn't get first place'; 进步了很多 means 'improved a lot'.",
    hskLevel: 5,
  },
  {
    passage:
      "来中国以前，我以为中国人都会功夫，来了以后才知道不是这样。",
    question: "What did the speaker learn after coming to China?",
    options: [
      "Not all Chinese people know kung fu",
      "Chinese people are very good at kung fu",
      "Kung fu is extremely popular in China",
      "They want to learn kung fu in China",
    ],
    correctIndex: 0,
    explanation:
      "以为...来了以后才知道不是这样 means 'thought...but learned it wasn't so after arriving'.",
    hskLevel: 5,
  },

  // HSK 6
  {
    passage:
      "尽管困难重重，他始终没有放弃自己的理想，最终实现了目标。",
    question: "What is the main idea?",
    options: [
      "He achieved his goal by persisting through difficulties",
      "He gave up when things got too hard",
      "He changed his goals to easier ones",
      "He needed others' help to succeed",
    ],
    correctIndex: 0,
    explanation:
      "尽管困难重重 means 'despite many difficulties'; 始终没有放弃 means 'never gave up'; 最终实现了目标 means 'finally achieved his goal'.",
    hskLevel: 6,
  },
  {
    passage:
      "这部电影之所以受欢迎，不仅因为演员演技好，更因为剧情感人至深。",
    question: "Why is this movie popular?",
    options: [
      "Both the acting and the deeply touching storyline",
      "Only because of the famous actors",
      "Because of its special effects",
      "Because it was heavily advertised",
    ],
    correctIndex: 0,
    explanation:
      "不仅...更因为 means 'not only...but even more because', crediting both acting and story.",
    hskLevel: 6,
  },
  {
    passage:
      "在全球化的背景下，跨文化交流能力变得越来越重要。",
    question:
      "What ability is becoming more important due to globalization?",
    options: [
      "Cross-cultural communication skills",
      "Technical programming skills",
      "Financial management abilities",
      "Physical fitness and athletics",
    ],
    correctIndex: 0,
    explanation:
      "跨文化交流能力 means 'cross-cultural communication ability'; 越来越重要 means 'more and more important'.",
    hskLevel: 6,
  },
  {
    passage: "他的成功并非偶然，而是多年来不懈努力的结果。",
    question: "What does the sentence say about his success?",
    options: [
      "It was the result of years of persistent effort",
      "It was a lucky accident",
      "It happened suddenly and unexpectedly",
      "Others helped him achieve it",
    ],
    correctIndex: 0,
    explanation:
      "并非偶然 means 'not accidental'; 不懈努力的结果 means 'the result of unrelenting effort'.",
    hskLevel: 6,
  },
  {
    passage: "与其抱怨环境不好，不如自己努力去改变现状。",
    question: "What is the message of this sentence?",
    options: [
      "It's better to take action than to complain",
      "Complaining is necessary for change",
      "The environment cannot be changed",
      "One should accept things as they are",
    ],
    correctIndex: 0,
    explanation:
      "与其...不如 means 'rather than...it's better to', advocating action over complaint.",
    hskLevel: 6,
  },
  {
    passage:
      '古人云："读万卷书，行万里路。"这说明实践经验和书本知识同样重要。',
    question: "What does this proverb suggest?",
    options: [
      "Both practical experience and book knowledge are equally important",
      "Reading books is more important than traveling",
      "Traveling is more important than reading",
      "Neither reading nor traveling matters",
    ],
    correctIndex: 0,
    explanation:
      "同样重要 means 'equally important', balancing book learning (读万卷书) with real-world experience (行万里路).",
    hskLevel: 6,
  },
  {
    passage:
      "面对生活中的挫折，保持积极乐观的心态至关重要。",
    question: "What is the advice when facing setbacks?",
    options: [
      "Maintaining a positive and optimistic attitude is crucial",
      "It's normal to feel depressed and give up",
      "Seek help from professionals immediately",
      "Avoid all difficult situations in life",
    ],
    correctIndex: 0,
    explanation:
      "保持积极乐观的心态 means 'maintain a positive and optimistic attitude'; 至关重要 means 'is crucially important'.",
    hskLevel: 6,
  },
  {
    passage:
      "这篇文章深入分析了当代社会中年轻人面临的就业压力及其根本原因。",
    question: "What does this article analyze?",
    options: [
      "Employment pressure facing young people and its root causes",
      "The advantages of being young in modern society",
      "Economic growth in modern society",
      "Educational reform proposals for universities",
    ],
    correctIndex: 0,
    explanation:
      "就业压力 means 'employment pressure'; 根本原因 means 'root causes'; 年轻人面临的 means 'faced by young people'.",
    hskLevel: 6,
  },
];

function getReadingComprehensionQuestions(): DiagnosticQuestion[] {
  return READING_COMP_TEMPLATES.map((t, i) => ({
    id: `f5_hsk${t.hskLevel}_${i}`,
    format: "reading_comprehension" as const,
    prompt: t.question,
    passage: t.passage,
    passageQuestion: t.question,
    options: t.options,
    correctIndex: t.correctIndex,
    explanation: t.explanation,
    expectedSeconds: 20,
    hskLevel: t.hskLevel,
    targetNodeId: `_rc_${t.hskLevel}_${i}`,
  }));
}

// --- Main builder ---

let cachedBank: DiagnosticQuestion[] | null = null;
let cachedGraphLen = -1;

export function buildDiagnosticBank(graph: GraphNode[]): DiagnosticQuestion[] {
  if (cachedBank && cachedGraphLen === graph.length) return cachedBank;

  const byLevel = groupByLevel(graph);
  const questions: DiagnosticQuestion[] = [];

  questions.push(...generateCharToMeaning(byLevel));
  questions.push(...generateMeaningToChar(byLevel));
  questions.push(...generateSentenceContext(graph));
  questions.push(...generatePinyinToChar(byLevel));
  questions.push(...getReadingComprehensionQuestions());

  cachedBank = questions;
  cachedGraphLen = graph.length;
  return questions;
}
