export type ListeningExerciseType =
  | "vocabulary"
  | "sentence"
  | "dialogue"
  | "dictation";

export interface VocabularyExercise {
  type: "vocabulary";
  id: string;
  audioText: string;
  pinyin: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hskLevel: number;
  topicId?: string;
}

export interface SentenceExercise {
  type: "sentence";
  id: string;
  audioText: string;
  pinyin: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hskLevel: number;
  topicId?: string;
}

export interface DialogueLine {
  speaker: "A" | "B";
  text: string;
  pinyin: string;
}

export interface DialogueQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DialogueExercise {
  type: "dialogue";
  id: string;
  lines: DialogueLine[];
  questions: DialogueQuestion[];
  hskLevel: number;
  theme?: string;
}

export interface DictationExercise {
  type: "dictation";
  id: string;
  audioText: string;
  pinyin: string;
  displayText: string;
  blanks: { position: number; answer: string }[];
  options: string[];
  explanation: string;
  hskLevel: number;
  topicId?: string;
}

export type ListeningExercise =
  | VocabularyExercise
  | SentenceExercise
  | DialogueExercise
  | DictationExercise;

// --- HSK 1 Exercises ---

const HSK1_VOCABULARY: VocabularyExercise[] = [
  { type: "vocabulary", id: "lv-1-01", audioText: "你好", pinyin: "nǐ hǎo", options: ["你好", "再见", "谢谢", "对不起"], correctIndex: 0, explanation: "你好 (nǐ hǎo) means 'hello'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-02", audioText: "谢谢", pinyin: "xiè xiè", options: ["再见", "你好", "谢谢", "请"], correctIndex: 2, explanation: "谢谢 (xiè xiè) means 'thank you'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-03", audioText: "再见", pinyin: "zài jiàn", options: ["你好", "再见", "谢谢", "不客气"], correctIndex: 1, explanation: "再见 (zài jiàn) means 'goodbye'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-04", audioText: "学生", pinyin: "xué shēng", options: ["老师", "学生", "朋友", "同学"], correctIndex: 1, explanation: "学生 (xué shēng) means 'student'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-05", audioText: "老师", pinyin: "lǎo shī", options: ["老师", "医生", "学生", "先生"], correctIndex: 0, explanation: "老师 (lǎo shī) means 'teacher'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-06", audioText: "中国", pinyin: "zhōng guó", options: ["美国", "日本", "中国", "英国"], correctIndex: 2, explanation: "中国 (zhōng guó) means 'China'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-07", audioText: "苹果", pinyin: "píng guǒ", options: ["苹果", "香蕉", "西瓜", "橘子"], correctIndex: 0, explanation: "苹果 (píng guǒ) means 'apple'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-08", audioText: "电脑", pinyin: "diàn nǎo", options: ["手机", "电视", "电脑", "电话"], correctIndex: 2, explanation: "电脑 (diàn nǎo) means 'computer'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-09", audioText: "医院", pinyin: "yī yuàn", options: ["学校", "商店", "医院", "饭店"], correctIndex: 2, explanation: "医院 (yī yuàn) means 'hospital'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-10", audioText: "天气", pinyin: "tiān qì", options: ["天气", "时间", "日期", "温度"], correctIndex: 0, explanation: "天气 (tiān qì) means 'weather'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-11", audioText: "吃饭", pinyin: "chī fàn", options: ["喝水", "吃饭", "睡觉", "看书"], correctIndex: 1, explanation: "吃饭 (chī fàn) means 'eat (a meal)'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-12", audioText: "喝水", pinyin: "hē shuǐ", options: ["吃饭", "看书", "睡觉", "喝水"], correctIndex: 3, explanation: "喝水 (hē shuǐ) means 'drink water'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-13", audioText: "家", pinyin: "jiā", options: ["人", "家", "大", "小"], correctIndex: 1, explanation: "家 (jiā) means 'home/family'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-14", audioText: "朋友", pinyin: "péng yǒu", options: ["同学", "家人", "朋友", "老师"], correctIndex: 2, explanation: "朋友 (péng yǒu) means 'friend'.", hskLevel: 1 },
  { type: "vocabulary", id: "lv-1-15", audioText: "钱", pinyin: "qián", options: ["书", "钱", "车", "门"], correctIndex: 1, explanation: "钱 (qián) means 'money'.", hskLevel: 1 },
];

const HSK1_SENTENCES: SentenceExercise[] = [
  { type: "sentence", id: "ls-1-01", audioText: "你叫什么名字？", pinyin: "nǐ jiào shén me míng zì?", question: "What does this sentence mean?", options: ["What's your name?", "Where are you from?", "How old are you?", "What do you do?"], correctIndex: 0, explanation: "你叫什么名字 means 'What is your name?'", hskLevel: 1 },
  { type: "sentence", id: "ls-1-02", audioText: "今天天气很好。", pinyin: "jīn tiān tiān qì hěn hǎo.", question: "What does this sentence mean?", options: ["Today is Monday.", "The weather is nice today.", "I'm very good.", "Today is a holiday."], correctIndex: 1, explanation: "今天天气很好 means 'The weather is nice today.'", hskLevel: 1 },
  { type: "sentence", id: "ls-1-03", audioText: "我是中国人。", pinyin: "wǒ shì zhōng guó rén.", question: "What does this sentence mean?", options: ["I like China.", "I am going to China.", "I am Chinese.", "I live in China."], correctIndex: 2, explanation: "我是中国人 means 'I am Chinese.'", hskLevel: 1 },
  { type: "sentence", id: "ls-1-04", audioText: "他在学校学习。", pinyin: "tā zài xué xiào xué xí.", question: "What does this sentence mean?", options: ["He likes school.", "He studies at school.", "He teaches at school.", "He lives near school."], correctIndex: 1, explanation: "他在学校学习 means 'He studies at school.'", hskLevel: 1 },
  { type: "sentence", id: "ls-1-05", audioText: "我想喝茶。", pinyin: "wǒ xiǎng hē chá.", question: "What does this sentence mean?", options: ["I want to eat.", "I like coffee.", "I want to drink tea.", "I don't like tea."], correctIndex: 2, explanation: "我想喝茶 means 'I want to drink tea.'", hskLevel: 1 },
  { type: "sentence", id: "ls-1-06", audioText: "这是我的书。", pinyin: "zhè shì wǒ de shū.", question: "What does this sentence mean?", options: ["This is my book.", "That is your book.", "I have a book.", "Where is my book?"], correctIndex: 0, explanation: "这是我的书 means 'This is my book.'", hskLevel: 1 },
  { type: "sentence", id: "ls-1-07", audioText: "现在几点了？", pinyin: "xiàn zài jǐ diǎn le?", question: "What does this sentence mean?", options: ["What day is it?", "What time is it now?", "When are you coming?", "How long has it been?"], correctIndex: 1, explanation: "现在几点了 means 'What time is it now?'", hskLevel: 1 },
  { type: "sentence", id: "ls-1-08", audioText: "他有两个妹妹。", pinyin: "tā yǒu liǎng gè mèi mei.", question: "What does this sentence mean?", options: ["He has two older sisters.", "He has two younger sisters.", "He has two brothers.", "He has two friends."], correctIndex: 1, explanation: "他有两个妹妹 means 'He has two younger sisters.'", hskLevel: 1 },
  { type: "sentence", id: "ls-1-09", audioText: "我不喜欢下雨。", pinyin: "wǒ bù xǐ huān xià yǔ.", question: "What does this sentence mean?", options: ["I like rain.", "It's raining today.", "I don't like rain.", "It will rain tomorrow."], correctIndex: 2, explanation: "我不喜欢下雨 means 'I don't like rain.'", hskLevel: 1 },
  { type: "sentence", id: "ls-1-10", audioText: "请坐！", pinyin: "qǐng zuò!", question: "What does this sentence mean?", options: ["Please sit down!", "Please stand up!", "Please come in!", "Please wait!"], correctIndex: 0, explanation: "请坐 means 'Please sit down!'", hskLevel: 1 },
];

const HSK1_DIALOGUES: DialogueExercise[] = [
  {
    type: "dialogue", id: "ld-1-01", hskLevel: 1, theme: "families_communities",
    lines: [
      { speaker: "A", text: "你好！你叫什么名字？", pinyin: "nǐ hǎo! nǐ jiào shén me míng zì?" },
      { speaker: "B", text: "我叫李明。你呢？", pinyin: "wǒ jiào lǐ míng. nǐ ne?" },
      { speaker: "A", text: "我叫王芳。认识你很高兴。", pinyin: "wǒ jiào wáng fāng. rèn shì nǐ hěn gāo xìng." },
      { speaker: "B", text: "我也很高兴认识你。", pinyin: "wǒ yě hěn gāo xìng rèn shì nǐ." },
    ],
    questions: [
      { question: "What is speaker B's name?", options: ["Wang Fang", "Li Ming", "Zhang Wei", "Liu Yang"], correctIndex: 1, explanation: "Speaker B says '我叫李明' — My name is Li Ming." },
      { question: "How does speaker A feel about meeting speaker B?", options: ["Sad", "Angry", "Happy", "Tired"], correctIndex: 2, explanation: "Speaker A says '认识你很高兴' — Nice to meet you (happy to know you)." },
    ],
  },
  {
    type: "dialogue", id: "ld-1-02", hskLevel: 1, theme: "contemporary_life",
    lines: [
      { speaker: "A", text: "你今天想吃什么？", pinyin: "nǐ jīn tiān xiǎng chī shén me?" },
      { speaker: "B", text: "我想吃米饭和鸡肉。", pinyin: "wǒ xiǎng chī mǐ fàn hé jī ròu." },
      { speaker: "A", text: "好的，我们去那个饭店吧。", pinyin: "hǎo de, wǒ men qù nà gè fàn diàn ba." },
      { speaker: "B", text: "好！走吧！", pinyin: "hǎo! zǒu ba!" },
    ],
    questions: [
      { question: "What does speaker B want to eat?", options: ["Noodles and fish", "Rice and chicken", "Dumplings and soup", "Bread and beef"], correctIndex: 1, explanation: "Speaker B says '我想吃米饭和鸡肉' — I want to eat rice and chicken." },
      { question: "Where are they going?", options: ["A school", "A hospital", "A restaurant", "A park"], correctIndex: 2, explanation: "Speaker A suggests '我们去那个饭店吧' — Let's go to that restaurant." },
    ],
  },
  {
    type: "dialogue", id: "ld-1-03", hskLevel: 1, theme: "science_technology",
    lines: [
      { speaker: "A", text: "你的手机是新的吗？", pinyin: "nǐ de shǒu jī shì xīn de ma?" },
      { speaker: "B", text: "是的，我昨天买的。", pinyin: "shì de, wǒ zuó tiān mǎi de." },
      { speaker: "A", text: "很漂亮！多少钱？", pinyin: "hěn piào liang! duō shǎo qián?" },
      { speaker: "B", text: "三千块。", pinyin: "sān qiān kuài." },
    ],
    questions: [
      { question: "When did speaker B buy the phone?", options: ["Today", "Yesterday", "Last week", "Last month"], correctIndex: 1, explanation: "Speaker B says '我昨天买的' — I bought it yesterday." },
      { question: "How much did the phone cost?", options: ["1000 yuan", "2000 yuan", "3000 yuan", "5000 yuan"], correctIndex: 2, explanation: "Speaker B says '三千块' — 3000 yuan." },
    ],
  },
];

const HSK1_DICTATION: DictationExercise[] = [
  { type: "dictation", id: "ldi-1-01", audioText: "我是学生。", pinyin: "wǒ shì xué shēng.", displayText: "我是___。", blanks: [{ position: 0, answer: "学生" }], options: ["学生", "老师", "医生", "工人"], explanation: "我是学生 means 'I am a student.' The missing word is 学生.", hskLevel: 1 },
  { type: "dictation", id: "ldi-1-02", audioText: "他喜欢吃苹果。", pinyin: "tā xǐ huān chī píng guǒ.", displayText: "他喜欢吃___。", blanks: [{ position: 0, answer: "苹果" }], options: ["苹果", "香蕉", "西瓜", "葡萄"], explanation: "他喜欢吃苹果 means 'He likes to eat apples.' The missing word is 苹果.", hskLevel: 1 },
  { type: "dictation", id: "ldi-1-03", audioText: "今天星期一。", pinyin: "jīn tiān xīng qī yī.", displayText: "今天___。", blanks: [{ position: 0, answer: "星期一" }], options: ["星期一", "星期二", "星期三", "星期五"], explanation: "今天星期一 means 'Today is Monday.' The missing word is 星期一.", hskLevel: 1 },
  { type: "dictation", id: "ldi-1-04", audioText: "她在家看电视。", pinyin: "tā zài jiā kàn diàn shì.", displayText: "她在家看___。", blanks: [{ position: 0, answer: "电视" }], options: ["电视", "电脑", "手机", "电影"], explanation: "她在家看电视 means 'She watches TV at home.' The missing word is 电视.", hskLevel: 1 },
  { type: "dictation", id: "ldi-1-05", audioText: "我爸爸是医生。", pinyin: "wǒ bà ba shì yī shēng.", displayText: "我___是医生。", blanks: [{ position: 0, answer: "爸爸" }], options: ["爸爸", "妈妈", "哥哥", "弟弟"], explanation: "我爸爸是医生 means 'My father is a doctor.' The missing word is 爸爸.", hskLevel: 1 },
];

// --- HSK 2 Exercises ---

const HSK2_VOCABULARY: VocabularyExercise[] = [
  { type: "vocabulary", id: "lv-2-01", audioText: "考试", pinyin: "kǎo shì", options: ["考试", "学习", "上课", "作业"], correctIndex: 0, explanation: "考试 (kǎo shì) means 'exam/test'.", hskLevel: 2 },
  { type: "vocabulary", id: "lv-2-02", audioText: "旅游", pinyin: "lǚ yóu", options: ["运动", "工作", "旅游", "购物"], correctIndex: 2, explanation: "旅游 (lǚ yóu) means 'travel/tourism'.", hskLevel: 2 },
  { type: "vocabulary", id: "lv-2-03", audioText: "公司", pinyin: "gōng sī", options: ["公司", "学校", "银行", "医院"], correctIndex: 0, explanation: "公司 (gōng sī) means 'company'.", hskLevel: 2 },
  { type: "vocabulary", id: "lv-2-04", audioText: "运动", pinyin: "yùn dòng", options: ["唱歌", "跳舞", "运动", "画画"], correctIndex: 2, explanation: "运动 (yùn dòng) means 'exercise/sport'.", hskLevel: 2 },
  { type: "vocabulary", id: "lv-2-05", audioText: "便宜", pinyin: "pián yi", options: ["贵", "便宜", "好看", "难"], correctIndex: 1, explanation: "便宜 (pián yi) means 'cheap/inexpensive'.", hskLevel: 2 },
  { type: "vocabulary", id: "lv-2-06", audioText: "准备", pinyin: "zhǔn bèi", options: ["开始", "结束", "准备", "完成"], correctIndex: 2, explanation: "准备 (zhǔn bèi) means 'prepare'.", hskLevel: 2 },
  { type: "vocabulary", id: "lv-2-07", audioText: "健康", pinyin: "jiàn kāng", options: ["快乐", "健康", "安全", "舒服"], correctIndex: 1, explanation: "健康 (jiàn kāng) means 'healthy/health'.", hskLevel: 2 },
  { type: "vocabulary", id: "lv-2-08", audioText: "环境", pinyin: "huán jìng", options: ["自然", "环境", "空气", "地方"], correctIndex: 1, explanation: "环境 (huán jìng) means 'environment'.", hskLevel: 2 },
  { type: "vocabulary", id: "lv-2-09", audioText: "历史", pinyin: "lì shǐ", options: ["地理", "数学", "历史", "科学"], correctIndex: 2, explanation: "历史 (lì shǐ) means 'history'.", hskLevel: 2 },
  { type: "vocabulary", id: "lv-2-10", audioText: "机会", pinyin: "jī huì", options: ["问题", "办法", "机会", "困难"], correctIndex: 2, explanation: "机会 (jī huì) means 'opportunity'.", hskLevel: 2 },
];

const HSK2_SENTENCES: SentenceExercise[] = [
  { type: "sentence", id: "ls-2-01", audioText: "你能帮我一下吗？", pinyin: "nǐ néng bāng wǒ yī xià ma?", question: "What does this sentence mean?", options: ["Can you help me?", "Are you busy?", "Do you want to go?", "Can you hear me?"], correctIndex: 0, explanation: "你能帮我一下吗 means 'Can you help me?'", hskLevel: 2 },
  { type: "sentence", id: "ls-2-02", audioText: "我打算明天去图书馆。", pinyin: "wǒ dǎ suàn míng tiān qù tú shū guǎn.", question: "What does this sentence mean?", options: ["I went to the library yesterday.", "I plan to go to the library tomorrow.", "I like reading at the library.", "I work at the library."], correctIndex: 1, explanation: "我打算明天去图书馆 means 'I plan to go to the library tomorrow.'", hskLevel: 2 },
  { type: "sentence", id: "ls-2-03", audioText: "这个菜太辣了。", pinyin: "zhè ge cài tài là le.", question: "What does this sentence mean?", options: ["This dish is too salty.", "This dish is too spicy.", "This dish is very good.", "This dish is too sweet."], correctIndex: 1, explanation: "这个菜太辣了 means 'This dish is too spicy.'", hskLevel: 2 },
  { type: "sentence", id: "ls-2-04", audioText: "我已经学了两年中文。", pinyin: "wǒ yǐ jīng xué le liǎng nián zhōng wén.", question: "What does this sentence mean?", options: ["I want to study Chinese.", "I have studied Chinese for two years.", "I studied Chinese in college.", "I am starting to learn Chinese."], correctIndex: 1, explanation: "我已经学了两年中文 means 'I have already studied Chinese for two years.'", hskLevel: 2 },
  { type: "sentence", id: "ls-2-05", audioText: "你应该多锻炼身体。", pinyin: "nǐ yīng gāi duō duàn liàn shēn tǐ.", question: "What does this sentence mean?", options: ["You should eat more.", "You should rest more.", "You should exercise more.", "You should study more."], correctIndex: 2, explanation: "你应该多锻炼身体 means 'You should exercise more.'", hskLevel: 2 },
  { type: "sentence", id: "ls-2-06", audioText: "我觉得学中文很有意思。", pinyin: "wǒ jué de xué zhōng wén hěn yǒu yì si.", question: "What does this sentence mean?", options: ["Chinese is very difficult.", "I think learning Chinese is interesting.", "I don't want to learn Chinese.", "Learning Chinese is important."], correctIndex: 1, explanation: "我觉得学中文很有意思 means 'I think learning Chinese is interesting.'", hskLevel: 2 },
  { type: "sentence", id: "ls-2-07", audioText: "请把窗户打开。", pinyin: "qǐng bǎ chuāng hù dǎ kāi.", question: "What does this sentence mean?", options: ["Please close the door.", "Please turn on the light.", "Please open the window.", "Please turn off the computer."], correctIndex: 2, explanation: "请把窗户打开 means 'Please open the window.'", hskLevel: 2 },
  { type: "sentence", id: "ls-2-08", audioText: "他每天骑自行车上班。", pinyin: "tā měi tiān qí zì xíng chē shàng bān.", question: "What does this sentence mean?", options: ["He drives to work every day.", "He rides a bike to work every day.", "He takes the bus to work.", "He walks to work every day."], correctIndex: 1, explanation: "他每天骑自行车上班 means 'He rides a bike to work every day.'", hskLevel: 2 },
];

const HSK2_DIALOGUES: DialogueExercise[] = [
  {
    type: "dialogue", id: "ld-2-01", hskLevel: 2, theme: "contemporary_life",
    lines: [
      { speaker: "A", text: "你周末有什么计划？", pinyin: "nǐ zhōu mò yǒu shén me jì huà?" },
      { speaker: "B", text: "我打算去爬山。你想一起去吗？", pinyin: "wǒ dǎ suàn qù pá shān. nǐ xiǎng yī qǐ qù ma?" },
      { speaker: "A", text: "好啊！几点出发？", pinyin: "hǎo a! jǐ diǎn chū fā?" },
      { speaker: "B", text: "早上七点吧，不要太晚。", pinyin: "zǎo shang qī diǎn ba, bú yào tài wǎn." },
    ],
    questions: [
      { question: "What does speaker B plan to do on the weekend?", options: ["Go shopping", "Go hiking", "Stay home", "Visit friends"], correctIndex: 1, explanation: "Speaker B says '我打算去爬山' — I plan to go hiking/climb a mountain." },
      { question: "What time do they plan to depart?", options: ["6 AM", "7 AM", "8 AM", "9 AM"], correctIndex: 1, explanation: "Speaker B suggests '早上七点' — 7 AM." },
    ],
  },
  {
    type: "dialogue", id: "ld-2-02", hskLevel: 2, theme: "families_communities",
    lines: [
      { speaker: "A", text: "你家有几口人？", pinyin: "nǐ jiā yǒu jǐ kǒu rén?" },
      { speaker: "B", text: "五口人。爸爸、妈妈、哥哥、姐姐和我。", pinyin: "wǔ kǒu rén. bà ba, mā ma, gē ge, jiě jie hé wǒ." },
      { speaker: "A", text: "你哥哥做什么工作？", pinyin: "nǐ gē ge zuò shén me gōng zuò?" },
      { speaker: "B", text: "他是工程师。", pinyin: "tā shì gōng chéng shī." },
    ],
    questions: [
      { question: "How many people are in speaker B's family?", options: ["3", "4", "5", "6"], correctIndex: 2, explanation: "Speaker B says '五口人' — 5 people." },
      { question: "What is speaker B's brother's job?", options: ["Doctor", "Teacher", "Engineer", "Driver"], correctIndex: 2, explanation: "Speaker B says '他是工程师' — He is an engineer." },
    ],
  },
];

const HSK2_DICTATION: DictationExercise[] = [
  { type: "dictation", id: "ldi-2-01", audioText: "我每天早上跑步。", pinyin: "wǒ měi tiān zǎo shang pǎo bù.", displayText: "我每天早上___。", blanks: [{ position: 0, answer: "跑步" }], options: ["跑步", "游泳", "唱歌", "画画"], explanation: "我每天早上跑步 means 'I run every morning.' The missing word is 跑步.", hskLevel: 2 },
  { type: "dictation", id: "ldi-2-02", audioText: "明天会下雨吗？", pinyin: "míng tiān huì xià yǔ ma?", displayText: "明天会___吗？", blanks: [{ position: 0, answer: "下雨" }], options: ["下雨", "下雪", "刮风", "晴天"], explanation: "明天会下雨吗 means 'Will it rain tomorrow?' The missing word is 下雨.", hskLevel: 2 },
  { type: "dictation", id: "ldi-2-03", audioText: "她的生日是五月十号。", pinyin: "tā de shēng rì shì wǔ yuè shí hào.", displayText: "她的___是五月十号。", blanks: [{ position: 0, answer: "生日" }], options: ["生日", "考试", "假期", "工作"], explanation: "她的生日是五月十号 means 'Her birthday is May 10th.' The missing word is 生日.", hskLevel: 2 },
  { type: "dictation", id: "ldi-2-04", audioText: "请你说慢一点。", pinyin: "qǐng nǐ shuō màn yī diǎn.", displayText: "请你说___一点。", blanks: [{ position: 0, answer: "慢" }], options: ["慢", "快", "大", "多"], explanation: "请你说慢一点 means 'Please speak slower.' The missing word is 慢.", hskLevel: 2 },
  { type: "dictation", id: "ldi-2-05", audioText: "这个周末我们去看电影。", pinyin: "zhè ge zhōu mò wǒ men qù kàn diàn yǐng.", displayText: "这个周末我们去看___。", blanks: [{ position: 0, answer: "电影" }], options: ["电影", "电视", "比赛", "表演"], explanation: "这个周末我们去看电影 means 'This weekend we're going to see a movie.' The missing word is 电影.", hskLevel: 2 },
];

// --- HSK 3 Exercises ---

const HSK3_VOCABULARY: VocabularyExercise[] = [
  { type: "vocabulary", id: "lv-3-01", audioText: "经验", pinyin: "jīng yàn", options: ["知识", "经验", "能力", "态度"], correctIndex: 1, explanation: "经验 (jīng yàn) means 'experience'.", hskLevel: 3 },
  { type: "vocabulary", id: "lv-3-02", audioText: "责任", pinyin: "zé rèn", options: ["责任", "任务", "工作", "义务"], correctIndex: 0, explanation: "责任 (zé rèn) means 'responsibility'.", hskLevel: 3 },
  { type: "vocabulary", id: "lv-3-03", audioText: "选择", pinyin: "xuǎn zé", options: ["决定", "选择", "考虑", "放弃"], correctIndex: 1, explanation: "选择 (xuǎn zé) means 'to choose/choice'.", hskLevel: 3 },
  { type: "vocabulary", id: "lv-3-04", audioText: "传统", pinyin: "chuán tǒng", options: ["现代", "传统", "流行", "古代"], correctIndex: 1, explanation: "传统 (chuán tǒng) means 'tradition/traditional'.", hskLevel: 3 },
  { type: "vocabulary", id: "lv-3-05", audioText: "保护", pinyin: "bǎo hù", options: ["破坏", "保护", "改变", "发展"], correctIndex: 1, explanation: "保护 (bǎo hù) means 'to protect'.", hskLevel: 3 },
  { type: "vocabulary", id: "lv-3-06", audioText: "影响", pinyin: "yǐng xiǎng", options: ["影响", "变化", "关系", "联系"], correctIndex: 0, explanation: "影响 (yǐng xiǎng) means 'influence/affect'.", hskLevel: 3 },
  { type: "vocabulary", id: "lv-3-07", audioText: "社会", pinyin: "shè huì", options: ["国家", "世界", "社会", "城市"], correctIndex: 2, explanation: "社会 (shè huì) means 'society'.", hskLevel: 3 },
  { type: "vocabulary", id: "lv-3-08", audioText: "文化", pinyin: "wén huà", options: ["文化", "艺术", "教育", "科技"], correctIndex: 0, explanation: "文化 (wén huà) means 'culture'.", hskLevel: 3 },
  { type: "vocabulary", id: "lv-3-09", audioText: "交流", pinyin: "jiāo liú", options: ["交通", "交流", "交易", "交换"], correctIndex: 1, explanation: "交流 (jiāo liú) means 'to exchange/communicate'.", hskLevel: 3 },
  { type: "vocabulary", id: "lv-3-10", audioText: "丰富", pinyin: "fēng fù", options: ["简单", "复杂", "丰富", "贫穷"], correctIndex: 2, explanation: "丰富 (fēng fù) means 'rich/abundant'.", hskLevel: 3 },
];

const HSK3_SENTENCES: SentenceExercise[] = [
  { type: "sentence", id: "ls-3-01", audioText: "虽然他很累，但是他还在工作。", pinyin: "suī rán tā hěn lèi, dàn shì tā hái zài gōng zuò.", question: "What does this sentence mean?", options: ["He is too tired to work.", "Although he is tired, he is still working.", "He will work after he rests.", "He stopped working because he was tired."], correctIndex: 1, explanation: "虽然他很累，但是他还在工作 uses the 虽然...但是 pattern meaning 'Although...but'.", hskLevel: 3 },
  { type: "sentence", id: "ls-3-02", audioText: "如果明天不下雨，我们就去公园。", pinyin: "rú guǒ míng tiān bù xià yǔ, wǒ men jiù qù gōng yuán.", question: "What does this sentence mean?", options: ["We went to the park because it didn't rain.", "If it doesn't rain tomorrow, we'll go to the park.", "It rained so we couldn't go to the park.", "We always go to the park when it rains."], correctIndex: 1, explanation: "如果明天不下雨，我们就去公园 uses the 如果...就 conditional pattern.", hskLevel: 3 },
  { type: "sentence", id: "ls-3-03", audioText: "这本书不但有趣，而且很有用。", pinyin: "zhè běn shū bú dàn yǒu qù, ér qiě hěn yǒu yòng.", question: "What does this sentence mean?", options: ["This book is boring but useful.", "This book is not only interesting but also useful.", "This book is interesting but not useful.", "This book is neither interesting nor useful."], correctIndex: 1, explanation: "不但...而且 means 'not only...but also'.", hskLevel: 3 },
  { type: "sentence", id: "ls-3-04", audioText: "他说话说得很流利。", pinyin: "tā shuō huà shuō de hěn liú lì.", question: "What does this sentence mean?", options: ["He speaks very quietly.", "He speaks very fast.", "He speaks very fluently.", "He speaks very loudly."], correctIndex: 2, explanation: "说得很流利 means 'speaks very fluently'.", hskLevel: 3 },
  { type: "sentence", id: "ls-3-05", audioText: "中国的传统文化非常丰富。", pinyin: "zhōng guó de chuán tǒng wén huà fēi cháng fēng fù.", question: "What does this sentence mean?", options: ["Chinese food culture is varied.", "China's traditional culture is very rich.", "Chinese modern culture is developing.", "China has no traditional culture."], correctIndex: 1, explanation: "中国的传统文化非常丰富 means 'China's traditional culture is very rich.'", hskLevel: 3 },
];

const HSK3_DIALOGUES: DialogueExercise[] = [
  {
    type: "dialogue", id: "ld-3-01", hskLevel: 3, theme: "beauty_aesthetics",
    lines: [
      { speaker: "A", text: "你看过那个新的中国电影吗？", pinyin: "nǐ kàn guò nà ge xīn de zhōng guó diàn yǐng ma?" },
      { speaker: "B", text: "看过了。我觉得特别好看，演员演得非常好。", pinyin: "kàn guò le. wǒ jué de tè bié hǎo kàn, yǎn yuán yǎn de fēi cháng hǎo." },
      { speaker: "A", text: "是吗？那我这个周末去看。故事是关于什么的？", pinyin: "shì ma? nà wǒ zhè ge zhōu mò qù kàn. gù shi shì guān yú shén me de?" },
      { speaker: "B", text: "是关于一个年轻人在大城市追求梦想的故事。", pinyin: "shì guān yú yī ge nián qīng rén zài dà chéng shì zhuī qiú mèng xiǎng de gù shi." },
    ],
    questions: [
      { question: "What did speaker B think of the movie?", options: ["It was boring", "It was very good", "It was too long", "It was confusing"], correctIndex: 1, explanation: "Speaker B says '我觉得特别好看' — I think it was especially good." },
      { question: "What is the movie about?", options: ["A family reunion", "A historical war", "A young person pursuing dreams in a big city", "A love story in the countryside"], correctIndex: 2, explanation: "The movie is about '一个年轻人在大城市追求梦想' — a young person pursuing dreams in a big city." },
    ],
  },
  {
    type: "dialogue", id: "ld-3-02", hskLevel: 3, theme: "global_challenges",
    lines: [
      { speaker: "A", text: "你觉得现在的环境问题严重吗？", pinyin: "nǐ jué de xiàn zài de huán jìng wèn tí yán zhòng ma?" },
      { speaker: "B", text: "当然很严重。空气污染越来越差了。", pinyin: "dāng rán hěn yán zhòng. kōng qì wū rǎn yuè lái yuè chà le." },
      { speaker: "A", text: "我们应该怎么做？", pinyin: "wǒ men yīng gāi zěn me zuò?" },
      { speaker: "B", text: "每个人都应该少开车，多用公共交通。", pinyin: "měi ge rén dōu yīng gāi shǎo kāi chē, duō yòng gōng gòng jiāo tōng." },
    ],
    questions: [
      { question: "What is the main environmental problem mentioned?", options: ["Water pollution", "Air pollution", "Deforestation", "Noise pollution"], correctIndex: 1, explanation: "Speaker B mentions '空气污染' — air pollution." },
      { question: "What does speaker B suggest people should do?", options: ["Plant more trees", "Use more electricity", "Drive less and use more public transportation", "Move to the countryside"], correctIndex: 2, explanation: "Speaker B says '少开车，多用公共交通' — drive less, use more public transportation." },
    ],
  },
];

const HSK3_DICTATION: DictationExercise[] = [
  { type: "dictation", id: "ldi-3-01", audioText: "学习一门外语需要很多时间。", pinyin: "xué xí yī mén wài yǔ xū yào hěn duō shí jiān.", displayText: "学习一门___需要很多时间。", blanks: [{ position: 0, answer: "外语" }], options: ["外语", "知识", "技术", "方法"], explanation: "学习一门外语需要很多时间 means 'Learning a foreign language takes a lot of time.'", hskLevel: 3 },
  { type: "dictation", id: "ldi-3-02", audioText: "中国人过春节的时候会包饺子。", pinyin: "zhōng guó rén guò chūn jié de shí hou huì bāo jiǎo zi.", displayText: "中国人过春节的时候会包___。", blanks: [{ position: 0, answer: "饺子" }], options: ["饺子", "粽子", "月饼", "汤圆"], explanation: "中国人过春节的时候会包饺子 means 'Chinese people make dumplings during Spring Festival.'", hskLevel: 3 },
  { type: "dictation", id: "ldi-3-03", audioText: "我们应该尊重不同的文化。", pinyin: "wǒ men yīng gāi zūn zhòng bù tóng de wén huà.", displayText: "我们应该___不同的文化。", blanks: [{ position: 0, answer: "尊重" }], options: ["尊重", "忽视", "改变", "批评"], explanation: "我们应该尊重不同的文化 means 'We should respect different cultures.'", hskLevel: 3 },
];

// --- HSK 4+ Exercises ---

const HSK4_VOCABULARY: VocabularyExercise[] = [
  { type: "vocabulary", id: "lv-4-01", audioText: "竞争", pinyin: "jìng zhēng", options: ["合作", "竞争", "交流", "发展"], correctIndex: 1, explanation: "竞争 (jìng zhēng) means 'competition/compete'.", hskLevel: 4 },
  { type: "vocabulary", id: "lv-4-02", audioText: "可持续", pinyin: "kě chí xù", options: ["可持续", "可能", "可以", "可靠"], correctIndex: 0, explanation: "可持续 (kě chí xù) means 'sustainable'.", hskLevel: 4 },
  { type: "vocabulary", id: "lv-4-03", audioText: "创新", pinyin: "chuàng xīn", options: ["创造", "创新", "创业", "创意"], correctIndex: 1, explanation: "创新 (chuàng xīn) means 'innovation/innovate'.", hskLevel: 4 },
  { type: "vocabulary", id: "lv-4-04", audioText: "全球化", pinyin: "quán qiú huà", options: ["国际化", "全球化", "现代化", "城市化"], correctIndex: 1, explanation: "全球化 (quán qiú huà) means 'globalization'.", hskLevel: 4 },
  { type: "vocabulary", id: "lv-4-05", audioText: "观念", pinyin: "guān niàn", options: ["观念", "观点", "观察", "观光"], correctIndex: 0, explanation: "观念 (guān niàn) means 'concept/notion'.", hskLevel: 4 },
];

const HSK4_SENTENCES: SentenceExercise[] = [
  { type: "sentence", id: "ls-4-01", audioText: "随着科技的发展，人们的生活方式发生了很大的变化。", pinyin: "suí zhe kē jì de fā zhǎn, rén men de shēng huó fāng shì fā shēng le hěn dà de biàn huà.", question: "What does this sentence mean?", options: ["Technology has stopped developing.", "With the development of technology, people's lifestyles have changed greatly.", "People don't like technological changes.", "Technology has no effect on daily life."], correctIndex: 1, explanation: "随着科技的发展 means 'With the development of technology', followed by the observation about lifestyle changes.", hskLevel: 4 },
  { type: "sentence", id: "ls-4-02", audioText: "保护传统文化是每个人的责任。", pinyin: "bǎo hù chuán tǒng wén huà shì měi ge rén de zé rèn.", question: "What does this sentence mean?", options: ["Traditional culture is disappearing.", "Protecting traditional culture is everyone's responsibility.", "Nobody cares about traditional culture.", "Only the government should protect culture."], correctIndex: 1, explanation: "保护传统文化是每个人的责任 means 'Protecting traditional culture is everyone's responsibility.'", hskLevel: 4 },
  { type: "sentence", id: "ls-4-03", audioText: "教育不仅仅是学校的事情，家庭教育也非常重要。", pinyin: "jiào yù bù jǐn jǐn shì xué xiào de shì qing, jiā tíng jiào yù yě fēi cháng zhòng yào.", question: "What does this sentence mean?", options: ["Schools are more important than families.", "Education is not just a school matter; family education is also very important.", "Family education is not important.", "Education only happens in schools."], correctIndex: 1, explanation: "不仅仅...也 means 'not just...also', emphasizing both school and family education.", hskLevel: 4 },
];

const HSK4_DIALOGUES: DialogueExercise[] = [
  {
    type: "dialogue", id: "ld-4-01", hskLevel: 4, theme: "science_technology",
    lines: [
      { speaker: "A", text: "你觉得人工智能会取代人类的工作吗？", pinyin: "nǐ jué de rén gōng zhì néng huì qǔ dài rén lèi de gōng zuò ma?" },
      { speaker: "B", text: "我认为它会取代一些简单的工作，但是需要创造力的工作不会被取代。", pinyin: "wǒ rèn wéi tā huì qǔ dài yī xiē jiǎn dān de gōng zuò, dàn shì xū yào chuàng zào lì de gōng zuò bú huì bèi qǔ dài." },
      { speaker: "A", text: "那我们应该怎么准备呢？", pinyin: "nà wǒ men yīng gāi zěn me zhǔn bèi ne?" },
      { speaker: "B", text: "我们需要不断学习新技能，保持竞争力。", pinyin: "wǒ men xū yào bú duàn xué xí xīn jì néng, bǎo chí jìng zhēng lì." },
    ],
    questions: [
      { question: "According to speaker B, which jobs will AI replace?", options: ["All jobs", "Creative jobs", "Simple/routine jobs", "No jobs"], correctIndex: 2, explanation: "Speaker B says AI will replace '一些简单的工作' — some simple jobs." },
      { question: "What does speaker B suggest we should do?", options: ["Stop using technology", "Continuously learn new skills", "Change careers immediately", "Not worry about it"], correctIndex: 1, explanation: "Speaker B says '不断学习新技能' — continuously learn new skills." },
      { question: "What kind of jobs does speaker B think are safe from AI?", options: ["Manual labor jobs", "Government jobs", "Jobs requiring creativity", "Teaching jobs"], correctIndex: 2, explanation: "Speaker B says '需要创造力的工作不会被取代' — jobs requiring creativity won't be replaced." },
    ],
  },
];

const HSK4_DICTATION: DictationExercise[] = [
  { type: "dictation", id: "ldi-4-01", audioText: "互联网改变了人们的生活方式。", pinyin: "hù lián wǎng gǎi biàn le rén men de shēng huó fāng shì.", displayText: "___改变了人们的生活方式。", blanks: [{ position: 0, answer: "互联网" }], options: ["互联网", "电视台", "图书馆", "大学"], explanation: "互联网改变了人们的生活方式 means 'The internet has changed people's lifestyles.'", hskLevel: 4 },
  { type: "dictation", id: "ldi-4-02", audioText: "我们应该重视环境保护。", pinyin: "wǒ men yīng gāi zhòng shì huán jìng bǎo hù.", displayText: "我们应该重视___。", blanks: [{ position: 0, answer: "环境保护" }], options: ["环境保护", "经济发展", "科技创新", "文化交流"], explanation: "我们应该重视环境保护 means 'We should value environmental protection.'", hskLevel: 4 },
];

// --- Export all exercises ---

export const ALL_LISTENING_EXERCISES: ListeningExercise[] = [
  ...HSK1_VOCABULARY, ...HSK1_SENTENCES, ...HSK1_DIALOGUES, ...HSK1_DICTATION,
  ...HSK2_VOCABULARY, ...HSK2_SENTENCES, ...HSK2_DIALOGUES, ...HSK2_DICTATION,
  ...HSK3_VOCABULARY, ...HSK3_SENTENCES, ...HSK3_DIALOGUES, ...HSK3_DICTATION,
  ...HSK4_VOCABULARY, ...HSK4_SENTENCES, ...HSK4_DIALOGUES, ...HSK4_DICTATION,
];

export function getExercisesByLevel(level: number): ListeningExercise[] {
  return ALL_LISTENING_EXERCISES.filter((e) => e.hskLevel === level);
}

export function getExercisesByType(exerciseType: ListeningExerciseType): ListeningExercise[] {
  return ALL_LISTENING_EXERCISES.filter((e) => e.type === exerciseType);
}

export function getExercisesByLevelAndType(
  level: number,
  exerciseType: ListeningExerciseType
): ListeningExercise[] {
  return ALL_LISTENING_EXERCISES.filter(
    (e) => e.hskLevel === level && e.type === exerciseType
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function selectListeningExercises(count: number = 5): ListeningExercise[] {
  const shuffled = shuffle(ALL_LISTENING_EXERCISES);
  const selected: ListeningExercise[] = [];
  const usedTypes = new Set<ListeningExerciseType>();

  for (const ex of shuffled) {
    if (selected.length >= count) break;
    if (selected.length < 4 && usedTypes.has(ex.type) && shuffled.length > count) {
      continue;
    }
    selected.push(ex);
    usedTypes.add(ex.type);
  }

  while (selected.length < count && shuffled.length > selected.length) {
    const remaining = shuffled.filter((e) => !selected.includes(e));
    if (remaining.length === 0) break;
    selected.push(remaining[0]);
  }

  return selected;
}
