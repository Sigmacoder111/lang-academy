import type { SpeakingExerciseType } from "../types/tasks";

export interface WordExercise {
  id: string;
  type: "word";
  hanzi: string;
  pinyin: string;
  meaning: string;
  theme?: string;
}

export interface SentenceExercise {
  id: string;
  type: "sentence";
  hanzi: string;
  pinyin: string;
  meaning: string;
  theme?: string;
}

export interface ConversationExercise {
  id: string;
  type: "conversation";
  promptChinese: string;
  promptPinyin: string;
  promptEnglish: string;
  timeLimitSeconds: number;
  expectedTopics: string[];
  expectedVocabulary: string[];
  theme: string;
  modelResponse: string;
}

export interface PresentationExercise {
  id: string;
  type: "presentation";
  topicEnglish: string;
  topicChinese: string;
  timeLimitSeconds: number;
  expectedTopics: string[];
  expectedVocabulary: string[];
  theme: string;
  rubricPoints: string[];
  modelResponse: string;
}

export type SpeakingExercise =
  | WordExercise
  | SentenceExercise
  | ConversationExercise
  | PresentationExercise;

const WORD_EXERCISES: WordExercise[] = [
  { id: "sw-1", type: "word", hanzi: "你好", pinyin: "nǐ hǎo", meaning: "hello", theme: "social" },
  { id: "sw-2", type: "word", hanzi: "谢谢", pinyin: "xiè xiè", meaning: "thank you", theme: "social" },
  { id: "sw-3", type: "word", hanzi: "学校", pinyin: "xué xiào", meaning: "school", theme: "education" },
  { id: "sw-4", type: "word", hanzi: "家庭", pinyin: "jiā tíng", meaning: "family", theme: "family" },
  { id: "sw-5", type: "word", hanzi: "朋友", pinyin: "péng yǒu", meaning: "friend", theme: "social" },
  { id: "sw-6", type: "word", hanzi: "老师", pinyin: "lǎo shī", meaning: "teacher", theme: "education" },
  { id: "sw-7", type: "word", hanzi: "医生", pinyin: "yī shēng", meaning: "doctor", theme: "health" },
  { id: "sw-8", type: "word", hanzi: "电脑", pinyin: "diàn nǎo", meaning: "computer", theme: "technology" },
  { id: "sw-9", type: "word", hanzi: "手机", pinyin: "shǒu jī", meaning: "cell phone", theme: "technology" },
  { id: "sw-10", type: "word", hanzi: "春节", pinyin: "chūn jié", meaning: "Spring Festival", theme: "culture" },
  { id: "sw-11", type: "word", hanzi: "环境", pinyin: "huán jìng", meaning: "environment", theme: "environment" },
  { id: "sw-12", type: "word", hanzi: "旅游", pinyin: "lǚ yóu", meaning: "travel", theme: "travel" },
  { id: "sw-13", type: "word", hanzi: "运动", pinyin: "yùn dòng", meaning: "exercise/sports", theme: "health" },
  { id: "sw-14", type: "word", hanzi: "音乐", pinyin: "yīn yuè", meaning: "music", theme: "arts" },
  { id: "sw-15", type: "word", hanzi: "经济", pinyin: "jīng jì", meaning: "economy", theme: "society" },
];

const SENTENCE_EXERCISES: SentenceExercise[] = [
  { id: "ss-1", type: "sentence", hanzi: "我每天早上六点起床。", pinyin: "Wǒ měi tiān zǎo shang liù diǎn qǐ chuáng.", meaning: "I get up at 6am every morning.", theme: "daily_life" },
  { id: "ss-2", type: "sentence", hanzi: "我喜欢在图书馆学习。", pinyin: "Wǒ xǐ huān zài tú shū guǎn xué xí.", meaning: "I like studying in the library.", theme: "education" },
  { id: "ss-3", type: "sentence", hanzi: "这个周末我打算去爬山。", pinyin: "Zhè gè zhōu mò wǒ dǎ suàn qù pá shān.", meaning: "I plan to go hiking this weekend.", theme: "travel" },
  { id: "ss-4", type: "sentence", hanzi: "中国的长城是世界奇迹之一。", pinyin: "Zhōng guó de Cháng Chéng shì shì jiè qí jì zhī yī.", meaning: "China's Great Wall is one of the world's wonders.", theme: "culture" },
  { id: "ss-5", type: "sentence", hanzi: "学习中文需要很多练习。", pinyin: "Xué xí zhōng wén xū yào hěn duō liàn xí.", meaning: "Learning Chinese requires a lot of practice.", theme: "education" },
  { id: "ss-6", type: "sentence", hanzi: "我的家人都很支持我学中文。", pinyin: "Wǒ de jiā rén dōu hěn zhī chí wǒ xué zhōng wén.", meaning: "My family all support me learning Chinese.", theme: "family" },
  { id: "ss-7", type: "sentence", hanzi: "保护环境是每个人的责任。", pinyin: "Bǎo hù huán jìng shì měi gè rén de zé rèn.", meaning: "Protecting the environment is everyone's responsibility.", theme: "environment" },
  { id: "ss-8", type: "sentence", hanzi: "科技的发展改变了我们的生活方式。", pinyin: "Kē jì de fā zhǎn gǎi biàn le wǒ men de shēng huó fāng shì.", meaning: "Technological development has changed our way of life.", theme: "technology" },
  { id: "ss-9", type: "sentence", hanzi: "中秋节是中国的传统节日。", pinyin: "Zhōng qiū jié shì Zhōng guó de chuán tǒng jié rì.", meaning: "Mid-Autumn Festival is a traditional Chinese holiday.", theme: "culture" },
  { id: "ss-10", type: "sentence", hanzi: "我觉得多运动对身体很好。", pinyin: "Wǒ jué de duō yùn dòng duì shēn tǐ hěn hǎo.", meaning: "I think exercising more is very good for the body.", theme: "health" },
  { id: "ss-11", type: "sentence", hanzi: "请问，去火车站怎么走？", pinyin: "Qǐng wèn, qù huǒ chē zhàn zěn me zǒu?", meaning: "Excuse me, how do I get to the train station?", theme: "travel" },
  { id: "ss-12", type: "sentence", hanzi: "我们应该尊重不同的文化。", pinyin: "Wǒ men yīng gāi zūn zhòng bù tóng de wén huà.", meaning: "We should respect different cultures.", theme: "culture" },
];

const CONVERSATION_EXERCISES: ConversationExercise[] = [
  { id: "sc-1", type: "conversation", promptChinese: "你周末一般做什么？", promptPinyin: "Nǐ zhōu mò yī bān zuò shén me?", promptEnglish: "What do you usually do on weekends?", timeLimitSeconds: 20, expectedTopics: ["weekend activities", "hobbies"], expectedVocabulary: ["周末", "喜欢", "一般"], theme: "families_communities", modelResponse: "周末我一般会和朋友一起去运动。有时候我们打篮球，有时候去跑步。如果天气不好，我就在家看书或者学习中文。" },
  { id: "sc-2", type: "conversation", promptChinese: "你在学校最喜欢什么科目？为什么？", promptPinyin: "Nǐ zài xué xiào zuì xǐ huān shén me kē mù? Wèi shén me?", promptEnglish: "What's your favorite subject at school? Why?", timeLimitSeconds: 20, expectedTopics: ["school subject", "reason"], expectedVocabulary: ["科目", "喜欢", "因为"], theme: "families_communities", modelResponse: "我最喜欢的科目是数学，因为它很有逻辑性。我也喜欢解决数学难题，这让我有很大的成就感。" },
  { id: "sc-3", type: "conversation", promptChinese: "你能介绍一下你的家庭吗？", promptPinyin: "Nǐ néng jiè shào yī xià nǐ de jiā tíng ma?", promptEnglish: "Can you introduce your family?", timeLimitSeconds: 20, expectedTopics: ["family members", "relationships"], expectedVocabulary: ["家人", "爸爸", "妈妈", "兄弟", "姐妹"], theme: "families_communities", modelResponse: "我的家庭有四口人。我爸爸是工程师，我妈妈是老师。我还有一个妹妹，她比我小三岁。我们一家人关系很好。" },
  { id: "sc-4", type: "conversation", promptChinese: "你觉得学中文难不难？最大的挑战是什么？", promptPinyin: "Nǐ jué de xué zhōng wén nán bù nán? Zuì dà de tiǎo zhàn shì shén me?", promptEnglish: "Do you find learning Chinese difficult? What's the biggest challenge?", timeLimitSeconds: 20, expectedTopics: ["learning difficulties", "challenges"], expectedVocabulary: ["中文", "难", "挑战", "声调"], theme: "global_challenges", modelResponse: "我觉得学中文有一些困难，最大的挑战是声调。每个字有不同的声调，说错了意思就完全不一样了。但是我会继续练习。" },
  { id: "sc-5", type: "conversation", promptChinese: "你最喜欢什么中国菜？", promptPinyin: "Nǐ zuì xǐ huān shén me Zhōng guó cài?", promptEnglish: "What's your favorite Chinese dish?", timeLimitSeconds: 20, expectedTopics: ["Chinese food", "preferences"], expectedVocabulary: ["中国菜", "好吃", "喜欢"], theme: "beauty_aesthetics", modelResponse: "我最喜欢吃北京烤鸭，因为它的皮很脆，肉很嫩。我也很喜欢吃宫保鸡丁，味道又辣又好吃。" },
  { id: "sc-6", type: "conversation", promptChinese: "你平时怎么保持身体健康？", promptPinyin: "Nǐ píng shí zěn me bǎo chí shēn tǐ jiàn kāng?", promptEnglish: "How do you usually stay healthy?", timeLimitSeconds: 20, expectedTopics: ["health habits", "exercise"], expectedVocabulary: ["健康", "运动", "吃", "睡觉"], theme: "personal_public_identities", modelResponse: "我平时通过运动和健康饮食来保持身体健康。每天早上我会跑步半个小时，也尽量多吃蔬菜水果，少吃零食。" },
  { id: "sc-7", type: "conversation", promptChinese: "你会用什么方式保护环境？", promptPinyin: "Nǐ huì yòng shén me fāng shì bǎo hù huán jìng?", promptEnglish: "What ways do you use to protect the environment?", timeLimitSeconds: 20, expectedTopics: ["environment", "green living"], expectedVocabulary: ["环境", "保护", "回收", "节约"], theme: "global_challenges", modelResponse: "我会通过几种方式保护环境。首先，我尽量减少使用塑料袋。其次，我会把垃圾分类回收。最后，我出门尽量坐公交车或骑自行车。" },
  { id: "sc-8", type: "conversation", promptChinese: "你将来想做什么工作？", promptPinyin: "Nǐ jiāng lái xiǎng zuò shén me gōng zuò?", promptEnglish: "What job do you want in the future?", timeLimitSeconds: 20, expectedTopics: ["career goals", "future plans"], expectedVocabulary: ["将来", "工作", "想", "因为"], theme: "personal_public_identities", modelResponse: "我将来想当一名软件工程师，因为我对科技很感兴趣。我觉得通过编程可以创造很多有用的东西，帮助别人解决问题。" },
  { id: "sc-9", type: "conversation", promptChinese: "你喜欢看什么类型的电影？", promptPinyin: "Nǐ xǐ huān kàn shén me lèi xíng de diàn yǐng?", promptEnglish: "What type of movies do you like to watch?", timeLimitSeconds: 20, expectedTopics: ["movie preferences", "entertainment"], expectedVocabulary: ["电影", "喜欢", "类型"], theme: "beauty_aesthetics", modelResponse: "我最喜欢看科幻电影，因为它们充满了想象力。我也喜欢看纪录片，可以学到很多新的知识。" },
  { id: "sc-10", type: "conversation", promptChinese: "你去过中国吗？如果没有，你最想去哪里？", promptPinyin: "Nǐ qù guò Zhōng guó ma? Rú guǒ méi yǒu, nǐ zuì xiǎng qù nǎ lǐ?", promptEnglish: "Have you been to China? If not, where do you want to go most?", timeLimitSeconds: 20, expectedTopics: ["travel", "China destinations"], expectedVocabulary: ["去过", "中国", "想", "旅游"], theme: "science_technology", modelResponse: "我还没去过中国，但我最想去北京。我想看长城和故宫，也想品尝正宗的北京烤鸭。我还想去上海看看现代化的城市。" },
  { id: "sc-11", type: "conversation", promptChinese: "你怎么看待社交媒体的影响？", promptPinyin: "Nǐ zěn me kàn dài shè jiāo méi tǐ de yǐng xiǎng?", promptEnglish: "What do you think about the impact of social media?", timeLimitSeconds: 20, expectedTopics: ["social media", "technology impact"], expectedVocabulary: ["社交媒体", "影响", "觉得"], theme: "science_technology", modelResponse: "我觉得社交媒体有好处也有坏处。好处是我们可以很方便地和朋友联系。坏处是有些人花太多时间在上面，影响了学习和睡眠。" },
  { id: "sc-12", type: "conversation", promptChinese: "你过春节的时候有什么特别的习俗吗？", promptPinyin: "Nǐ guò Chūn Jié de shí hòu yǒu shén me tè bié de xí sú ma?", promptEnglish: "Do you have any special customs when celebrating Spring Festival?", timeLimitSeconds: 20, expectedTopics: ["Spring Festival", "customs"], expectedVocabulary: ["春节", "习俗", "过年"], theme: "families_communities", modelResponse: "过春节的时候，我们全家人会在一起吃团年饭。大人会给孩子们发红包。我们还会放烟花、看春晚。这是一年中最热闹的时候。" },
  { id: "sc-13", type: "conversation", promptChinese: "你认为科技对教育有什么影响？", promptPinyin: "Nǐ rèn wéi kē jì duì jiào yù yǒu shén me yǐng xiǎng?", promptEnglish: "What impact do you think technology has on education?", timeLimitSeconds: 20, expectedTopics: ["technology", "education"], expectedVocabulary: ["科技", "教育", "影响", "网上"], theme: "science_technology", modelResponse: "科技对教育有很大的影响。现在学生可以在网上学习各种课程，也可以用手机查找资料。但是我觉得面对面的教学也很重要。" },
  { id: "sc-14", type: "conversation", promptChinese: "你最尊敬的人是谁？为什么？", promptPinyin: "Nǐ zuì zūn jìng de rén shì shéi? Wèi shén me?", promptEnglish: "Who do you respect the most? Why?", timeLimitSeconds: 20, expectedTopics: ["role model", "qualities"], expectedVocabulary: ["尊敬", "因为", "人"], theme: "personal_public_identities", modelResponse: "我最尊敬的人是我的妈妈。她既要工作，又要照顾我们，非常辛苦。她教会了我很多做人的道理，让我学会了坚持和努力。" },
  { id: "sc-15", type: "conversation", promptChinese: "如果你能去中国留学，你想学什么？", promptPinyin: "Rú guǒ nǐ néng qù Zhōng guó liú xué, nǐ xiǎng xué shén me?", promptEnglish: "If you could study abroad in China, what would you want to study?", timeLimitSeconds: 20, expectedTopics: ["study abroad", "academic interests"], expectedVocabulary: ["留学", "中国", "学习", "专业"], theme: "contemporary_life", modelResponse: "如果我能去中国留学，我想学习中国文学。我对中国古代的诗词很感兴趣，想更深入地了解中国文化和历史。" },
  { id: "sc-16", type: "conversation", promptChinese: "你觉得中美文化有什么不同？", promptPinyin: "Nǐ jué de Zhōng Měi wén huà yǒu shén me bù tóng?", promptEnglish: "What differences do you see between Chinese and American culture?", timeLimitSeconds: 20, expectedTopics: ["cultural differences", "comparison"], expectedVocabulary: ["文化", "不同", "中国", "美国"], theme: "beauty_aesthetics", modelResponse: "中美文化有很多不同。比如，中国人比较注重集体和家庭，而美国人更注重个人独立。在饮食方面，中国人用筷子，美国人用刀叉。" },
  { id: "sc-17", type: "conversation", promptChinese: "你有什么爱好？", promptPinyin: "Nǐ yǒu shén me ài hào?", promptEnglish: "What are your hobbies?", timeLimitSeconds: 20, expectedTopics: ["hobbies", "free time"], expectedVocabulary: ["爱好", "喜欢", "时间"], theme: "contemporary_life", modelResponse: "我有很多爱好。我最喜欢画画，每个周末都会画一幅画。我也喜欢弹吉他和读小说。这些爱好让我的生活更有趣。" },
  { id: "sc-18", type: "conversation", promptChinese: "你觉得什么样的朋友是好朋友？", promptPinyin: "Nǐ jué de shén me yàng de péng yǒu shì hǎo péng yǒu?", promptEnglish: "What kind of friend do you think is a good friend?", timeLimitSeconds: 20, expectedTopics: ["friendship", "qualities"], expectedVocabulary: ["朋友", "好", "信任", "帮助"], theme: "families_communities", modelResponse: "我觉得好朋友应该是诚实可靠的。好朋友在你需要帮助的时候会支持你，在你开心的时候会和你一起庆祝。最重要的是互相尊重和信任。" },
  { id: "sc-19", type: "conversation", promptChinese: "你对中国的哪个城市最感兴趣？", promptPinyin: "Nǐ duì Zhōng guó de nǎ gè chéng shì zuì gǎn xìng qù?", promptEnglish: "Which Chinese city are you most interested in?", timeLimitSeconds: 20, expectedTopics: ["Chinese cities", "reasons"], expectedVocabulary: ["城市", "感兴趣", "因为"], theme: "contemporary_life", modelResponse: "我对上海最感兴趣。上海是中国最现代化的城市之一，有很多高楼大厦和国际美食。我也听说上海的夜景非常漂亮。" },
  { id: "sc-20", type: "conversation", promptChinese: "你怎么过生日？", promptPinyin: "Nǐ zěn me guò shēng rì?", promptEnglish: "How do you celebrate your birthday?", timeLimitSeconds: 20, expectedTopics: ["birthday celebration"], expectedVocabulary: ["生日", "过", "蛋糕", "朋友"], theme: "families_communities", modelResponse: "过生日的时候，我通常会和家人一起吃晚饭，然后吃蛋糕。有时候我也会邀请朋友来家里，一起看电影、玩游戏。" },
  { id: "sc-21", type: "conversation", promptChinese: "你对网上购物有什么看法？", promptPinyin: "Nǐ duì wǎng shàng gòu wù yǒu shén me kàn fǎ?", promptEnglish: "What's your opinion on online shopping?", timeLimitSeconds: 20, expectedTopics: ["online shopping", "advantages/disadvantages"], expectedVocabulary: ["网上", "购物", "方便", "觉得"], theme: "science_technology", modelResponse: "我觉得网上购物很方便，可以比较不同商品的价格。但是有时候收到的东西和图片不一样，这让人很失望。所以我觉得要选择可靠的网站。" },
  { id: "sc-22", type: "conversation", promptChinese: "你最近读了什么好书？", promptPinyin: "Nǐ zuì jìn dú le shén me hǎo shū?", promptEnglish: "What good books have you read recently?", timeLimitSeconds: 20, expectedTopics: ["reading", "books"], expectedVocabulary: ["书", "读", "最近", "好看"], theme: "beauty_aesthetics", modelResponse: "我最近读了一本关于中国历史的书，很有意思。这本书讲述了唐朝的故事，让我对中国古代文化有了更多了解。" },
  { id: "sc-23", type: "conversation", promptChinese: "你觉得学生应该做义工吗？为什么？", promptPinyin: "Nǐ jué de xué shēng yīng gāi zuò yì gōng ma? Wèi shén me?", promptEnglish: "Do you think students should volunteer? Why?", timeLimitSeconds: 20, expectedTopics: ["volunteering", "student responsibility"], expectedVocabulary: ["义工", "学生", "应该", "帮助"], theme: "global_challenges", modelResponse: "我觉得学生应该做义工。通过做义工，学生可以帮助别人，同时也能学到很多课本上学不到的东西。这对培养责任感很有帮助。" },
  { id: "sc-24", type: "conversation", promptChinese: "你平时喜欢听什么音乐？", promptPinyin: "Nǐ píng shí xǐ huān tīng shén me yīn yuè?", promptEnglish: "What kind of music do you usually like to listen to?", timeLimitSeconds: 20, expectedTopics: ["music preferences"], expectedVocabulary: ["音乐", "喜欢", "听", "歌"], theme: "beauty_aesthetics", modelResponse: "我平时喜欢听流行音乐和古典音乐。流行音乐让我心情愉快，古典音乐帮助我集中注意力学习。我也开始听一些中文歌曲来练习中文。" },
  { id: "sc-25", type: "conversation", promptChinese: "你认为传统文化重要吗？为什么？", promptPinyin: "Nǐ rèn wéi chuán tǒng wén huà zhòng yào ma? Wèi shén me?", promptEnglish: "Do you think traditional culture is important? Why?", timeLimitSeconds: 20, expectedTopics: ["traditional culture", "importance"], expectedVocabulary: ["传统", "文化", "重要", "保护"], theme: "beauty_aesthetics", modelResponse: "我认为传统文化非常重要，因为它是一个民族的根。通过了解传统文化，我们可以知道自己从哪里来。我们应该保护和传承传统文化。" },
  { id: "sc-26", type: "conversation", promptChinese: "你觉得城市生活和农村生活哪个更好？", promptPinyin: "Nǐ jué de chéng shì shēng huó hé nóng cūn shēng huó nǎ gè gèng hǎo?", promptEnglish: "Do you think city life or rural life is better?", timeLimitSeconds: 20, expectedTopics: ["city vs rural", "comparison"], expectedVocabulary: ["城市", "农村", "生活", "好"], theme: "contemporary_life", modelResponse: "这个问题很难回答。城市生活交通方便，工作机会多。但是农村空气新鲜，生活节奏慢。我觉得年轻时在城市发展，退休后去农村生活比较好。" },
  { id: "sc-27", type: "conversation", promptChinese: "你对中国书法感兴趣吗？", promptPinyin: "Nǐ duì Zhōng guó shū fǎ gǎn xìng qù ma?", promptEnglish: "Are you interested in Chinese calligraphy?", timeLimitSeconds: 20, expectedTopics: ["calligraphy", "art"], expectedVocabulary: ["书法", "感兴趣", "写", "练习"], theme: "beauty_aesthetics", modelResponse: "我对中国书法很感兴趣。我觉得书法是一种很美的艺术。我尝试过用毛笔写字，虽然写得不太好，但是很有意思。我希望以后能继续学习。" },
  { id: "sc-28", type: "conversation", promptChinese: "你觉得什么是幸福？", promptPinyin: "Nǐ jué de shén me shì xìng fú?", promptEnglish: "What do you think happiness is?", timeLimitSeconds: 20, expectedTopics: ["happiness", "life values"], expectedVocabulary: ["幸福", "觉得", "家人", "快乐"], theme: "personal_public_identities", modelResponse: "我觉得幸福就是和家人在一起，做自己喜欢的事情。幸福不一定是有很多钱，而是内心感到满足和平静。有健康的身体、好的朋友，就是幸福。" },
  { id: "sc-29", type: "conversation", promptChinese: "如果你有三天假期，你想做什么？", promptPinyin: "Rú guǒ nǐ yǒu sān tiān jià qī, nǐ xiǎng zuò shén me?", promptEnglish: "If you had a three-day holiday, what would you want to do?", timeLimitSeconds: 20, expectedTopics: ["holiday plans", "activities"], expectedVocabulary: ["假期", "想", "做", "去"], theme: "contemporary_life", modelResponse: "如果我有三天假期，第一天我想在家休息，看看书。第二天我想和朋友去爬山或者去海边。第三天我想陪家人去吃好吃的东西。" },
  { id: "sc-30", type: "conversation", promptChinese: "你用过筷子吃饭吗？感觉怎么样？", promptPinyin: "Nǐ yòng guò kuài zi chī fàn ma? Gǎn jué zěn me yàng?", promptEnglish: "Have you used chopsticks to eat? How did it feel?", timeLimitSeconds: 20, expectedTopics: ["chopsticks", "Chinese dining culture"], expectedVocabulary: ["筷子", "吃饭", "用", "感觉"], theme: "beauty_aesthetics", modelResponse: "我用过筷子吃饭。刚开始的时候觉得很难，经常掉东西。但是练习了几次以后就越来越熟练了。现在我觉得用筷子吃饭很有趣。" },
  { id: "sc-31", type: "conversation", promptChinese: "你怎么看待学校的考试制度？", promptPinyin: "Nǐ zěn me kàn dài xué xiào de kǎo shì zhì dù?", promptEnglish: "What do you think about the school exam system?", timeLimitSeconds: 20, expectedTopics: ["exams", "education system"], expectedVocabulary: ["考试", "学生", "压力", "学习"], theme: "families_communities", modelResponse: "我觉得考试可以帮助学生检验学习效果，但是太多的考试会给学生带来很大的压力。我认为学校应该采用更多元化的评价方式。" },
  { id: "sc-32", type: "conversation", promptChinese: "你最喜欢哪个季节？为什么？", promptPinyin: "Nǐ zuì xǐ huān nǎ gè jì jié? Wèi shén me?", promptEnglish: "Which season is your favorite? Why?", timeLimitSeconds: 20, expectedTopics: ["seasons", "preferences"], expectedVocabulary: ["季节", "喜欢", "天气", "因为"], theme: "contemporary_life", modelResponse: "我最喜欢秋天。秋天的天气凉爽舒适，不冷也不热。树叶变成金黄色，景色很美。而且秋天有很多好吃的水果，比如苹果和梨。" },
  { id: "sc-33", type: "conversation", promptChinese: "你觉得手机对学生的影响是什么？", promptPinyin: "Nǐ jué de shǒu jī duì xué shēng de yǐng xiǎng shì shén me?", promptEnglish: "What do you think is the impact of phones on students?", timeLimitSeconds: 20, expectedTopics: ["phone usage", "student life"], expectedVocabulary: ["手机", "学生", "影响", "学习"], theme: "science_technology", modelResponse: "手机对学生有好的影响也有不好的影响。好处是可以查资料、学习新知识。坏处是有些学生花太多时间玩手机游戏，影响了学习成绩。" },
  { id: "sc-34", type: "conversation", promptChinese: "你会做什么中国菜？", promptPinyin: "Nǐ huì zuò shén me Zhōng guó cài?", promptEnglish: "What Chinese dishes can you cook?", timeLimitSeconds: 20, expectedTopics: ["cooking", "Chinese food"], expectedVocabulary: ["做菜", "中国菜", "会"], theme: "contemporary_life", modelResponse: "我会做简单的炒饭和炒面。我妈妈教过我做番茄炒鸡蛋，这是一道很容易学的中国家常菜。我希望以后能学会做更多中国菜。" },
  { id: "sc-35", type: "conversation", promptChinese: "你怎么看待全球变暖的问题？", promptPinyin: "Nǐ zěn me kàn dài quán qiú biàn nuǎn de wèn tí?", promptEnglish: "What do you think about global warming?", timeLimitSeconds: 20, expectedTopics: ["global warming", "environment"], expectedVocabulary: ["全球变暖", "环境", "问题", "影响"], theme: "global_challenges", modelResponse: "全球变暖是一个非常严重的问题。它会导致海平面上升、极端天气增多。我觉得每个人都应该减少碳排放，比如少开车、多种树。" },
  { id: "sc-36", type: "conversation", promptChinese: "你每天花多少时间学习？", promptPinyin: "Nǐ měi tiān huā duō shǎo shí jiān xué xí?", promptEnglish: "How much time do you spend studying every day?", timeLimitSeconds: 20, expectedTopics: ["study habits", "time management"], expectedVocabulary: ["学习", "时间", "每天", "小时"], theme: "families_communities", modelResponse: "我每天大概花四到五个小时学习。放学后我会先做作业，然后复习当天学的内容。晚饭后我会花一个小时学中文。" },
  { id: "sc-37", type: "conversation", promptChinese: "你参加过什么课外活动？", promptPinyin: "Nǐ cān jiā guò shén me kè wài huó dòng?", promptEnglish: "What extracurricular activities have you participated in?", timeLimitSeconds: 20, expectedTopics: ["extracurricular activities"], expectedVocabulary: ["参加", "活动", "社团", "课外"], theme: "families_communities", modelResponse: "我参加过学校的合唱团和辩论社。合唱团让我学会了和别人合作，辩论社提高了我的表达能力和逻辑思维。我觉得课外活动对成长很有帮助。" },
  { id: "sc-38", type: "conversation", promptChinese: "你觉得旅游对年轻人有什么好处？", promptPinyin: "Nǐ jué de lǚ yóu duì nián qīng rén yǒu shén me hǎo chù?", promptEnglish: "What benefits do you think travel has for young people?", timeLimitSeconds: 20, expectedTopics: ["travel benefits", "youth"], expectedVocabulary: ["旅游", "年轻人", "好处", "经历"], theme: "contemporary_life", modelResponse: "我觉得旅游可以开阔年轻人的视野，了解不同的文化和生活方式。旅游也能让人变得更独立，学会解决问题。这些经历对成长很有价值。" },
  { id: "sc-39", type: "conversation", promptChinese: "你觉得人工智能会怎么改变我们的未来？", promptPinyin: "Nǐ jué de rén gōng zhì néng huì zěn me gǎi biàn wǒ men de wèi lái?", promptEnglish: "How do you think artificial intelligence will change our future?", timeLimitSeconds: 20, expectedTopics: ["AI", "future"], expectedVocabulary: ["人工智能", "未来", "改变", "科技"], theme: "science_technology", modelResponse: "我觉得人工智能会在很多方面改变我们的未来。它会让很多工作变得自动化，也会在医疗和教育领域带来很大的进步。但是我们也需要注意隐私安全的问题。" },
  { id: "sc-40", type: "conversation", promptChinese: "你是怎么开始学中文的？", promptPinyin: "Nǐ shì zěn me kāi shǐ xué zhōng wén de?", promptEnglish: "How did you start learning Chinese?", timeLimitSeconds: 20, expectedTopics: ["learning journey", "motivation"], expectedVocabulary: ["开始", "学", "中文", "原因"], theme: "personal_public_identities", modelResponse: "我是在高中的时候开始学中文的。当时学校开了中文课，我觉得很好奇就选了这门课。学了以后发现中文很有意思，所以就一直学下去了。" },
  { id: "sc-41", type: "conversation", promptChinese: "你觉得男女平等重要吗？", promptPinyin: "Nǐ jué de nán nǚ píng děng zhòng yào ma?", promptEnglish: "Do you think gender equality is important?", timeLimitSeconds: 20, expectedTopics: ["gender equality", "social issues"], expectedVocabulary: ["平等", "男女", "重要", "社会"], theme: "global_challenges", modelResponse: "我觉得男女平等非常重要。每个人不管性别如何，都应该有同样的机会和权利。在教育和工作中，我们应该公平对待每一个人。" },
  { id: "sc-42", type: "conversation", promptChinese: "你家有宠物吗？你喜欢什么动物？", promptPinyin: "Nǐ jiā yǒu chǒng wù ma? Nǐ xǐ huān shén me dòng wù?", promptEnglish: "Do you have pets? What animals do you like?", timeLimitSeconds: 20, expectedTopics: ["pets", "animals"], expectedVocabulary: ["宠物", "动物", "喜欢", "养"], theme: "contemporary_life", modelResponse: "我家养了一只金毛犬，它已经三岁了。我很喜欢狗，因为狗很忠诚也很活泼。每天放学后我都会带它去公园散步。" },
  { id: "sc-43", type: "conversation", promptChinese: "你怎么看待中国的传统节日？", promptPinyin: "Nǐ zěn me kàn dài Zhōng guó de chuán tǒng jié rì?", promptEnglish: "What do you think about traditional Chinese holidays?", timeLimitSeconds: 20, expectedTopics: ["Chinese holidays", "traditions"], expectedVocabulary: ["传统", "节日", "文化", "庆祝"], theme: "beauty_aesthetics", modelResponse: "我觉得中国的传统节日很有意义。每个节日都有独特的习俗和故事。比如春节代表团圆，中秋节代表思念。这些节日帮助人们保持和家人的联系。" },
  { id: "sc-44", type: "conversation", promptChinese: "你觉得学外语最重要的方法是什么？", promptPinyin: "Nǐ jué de xué wài yǔ zuì zhòng yào de fāng fǎ shì shén me?", promptEnglish: "What do you think is the most important method for learning a foreign language?", timeLimitSeconds: 20, expectedTopics: ["language learning", "methods"], expectedVocabulary: ["学习", "方法", "练习", "外语"], theme: "families_communities", modelResponse: "我觉得学外语最重要的方法是多练习。每天都要听、说、读、写。和母语者交流也很重要，这样可以学到最自然的表达方式。坚持不放弃也是关键。" },
  { id: "sc-45", type: "conversation", promptChinese: "你最难忘的一次经历是什么？", promptPinyin: "Nǐ zuì nán wàng de yī cì jīng lì shì shén me?", promptEnglish: "What is your most unforgettable experience?", timeLimitSeconds: 20, expectedTopics: ["memorable experience"], expectedVocabulary: ["难忘", "经历", "记得"], theme: "personal_public_identities", modelResponse: "我最难忘的经历是第一次参加中文演讲比赛。虽然我很紧张，但是我鼓起勇气完成了演讲。最后我得了第二名，这让我非常有成就感。" },
  { id: "sc-46", type: "conversation", promptChinese: "你觉得运动和学习哪个更重要？", promptPinyin: "Nǐ jué de yùn dòng hé xué xí nǎ gè gèng zhòng yào?", promptEnglish: "Which do you think is more important, exercise or study?", timeLimitSeconds: 20, expectedTopics: ["exercise vs study", "balance"], expectedVocabulary: ["运动", "学习", "重要", "健康"], theme: "personal_public_identities", modelResponse: "我觉得运动和学习都很重要，不能只选一个。学习能提升我们的知识，运动能保持身体健康。只有身体好了，才能更好地学习。我们应该合理安排时间。" },
  { id: "sc-47", type: "conversation", promptChinese: "你觉得尊重老人重要吗？在你的文化中是怎么做的？", promptPinyin: "Nǐ jué de zūn zhòng lǎo rén zhòng yào ma?", promptEnglish: "Do you think respecting elders is important? How is it done in your culture?", timeLimitSeconds: 20, expectedTopics: ["respecting elders", "cultural values"], expectedVocabulary: ["尊重", "老人", "文化", "传统"], theme: "families_communities", modelResponse: "我觉得尊重老人非常重要。在我的文化中，我们会在节日里看望祖父母，给他们送礼物。平时我们也会帮助老人做事情，比如让座、帮忙提东西。" },
  { id: "sc-48", type: "conversation", promptChinese: "你想对十年后的自己说什么？", promptPinyin: "Nǐ xiǎng duì shí nián hòu de zì jǐ shuō shén me?", promptEnglish: "What would you want to say to yourself ten years from now?", timeLimitSeconds: 20, expectedTopics: ["future self", "aspirations"], expectedVocabulary: ["未来", "希望", "自己", "坚持"], theme: "personal_public_identities", modelResponse: "我想对十年后的自己说：希望你实现了你的梦想，成为了一个对社会有用的人。不管遇到什么困难，都不要放弃。记住要一直保持学习的热情。" },
  { id: "sc-49", type: "conversation", promptChinese: "你怎么处理学习压力？", promptPinyin: "Nǐ zěn me chǔ lǐ xué xí yā lì?", promptEnglish: "How do you deal with study pressure?", timeLimitSeconds: 20, expectedTopics: ["stress management", "study pressure"], expectedVocabulary: ["压力", "处理", "方法", "放松"], theme: "personal_public_identities", modelResponse: "当我感到学习压力大的时候，我会做运动来放松自己。听音乐和和朋友聊天也能帮助我减轻压力。最重要的是合理安排学习计划，不要把事情拖到最后一刻。" },
  { id: "sc-50", type: "conversation", promptChinese: "你觉得零花钱应该怎么用？", promptPinyin: "Nǐ jué de líng huā qián yīng gāi zěn me yòng?", promptEnglish: "How do you think allowance money should be spent?", timeLimitSeconds: 20, expectedTopics: ["money management", "spending habits"], expectedVocabulary: ["钱", "花", "存", "节约"], theme: "contemporary_life", modelResponse: "我觉得零花钱应该合理使用。一部分可以存起来，一部分用来买学习用品或者书。偶尔也可以买一些自己喜欢的东西，但是不应该乱花钱。学会理财很重要。" },
];

const PRESENTATION_EXERCISES: PresentationExercise[] = [
  { id: "sp-1", type: "presentation", topicEnglish: "Describe a traditional Chinese holiday and its significance", topicChinese: "描述一个中国传统节日及其意义", timeLimitSeconds: 120, expectedTopics: ["holiday name", "customs", "cultural significance"], expectedVocabulary: ["传统", "节日", "庆祝", "意义"], theme: "beauty_aesthetics", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "我想介绍中国的春节。春节是中国最重要的传统节日，在每年的农历正月初一。过春节的时候，家人会团聚在一起吃年夜饭。人们会贴春联、放烟花、给孩子发红包。春节代表着新的开始和美好的祝愿。这个节日的意义是让家人团圆，传承中国文化。" },
  { id: "sp-2", type: "presentation", topicEnglish: "Compare education systems in China and the United States", topicChinese: "比较中国和美国的教育制度", timeLimitSeconds: 120, expectedTopics: ["education differences", "exam system", "teaching methods"], expectedVocabulary: ["教育", "考试", "制度", "不同"], theme: "families_communities", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "中国和美国的教育制度有很多不同。中国学生需要参加高考，这是一次决定未来的重要考试。美国学生申请大学时不仅看成绩，还看课外活动和个人特长。中国的课堂比较注重知识的传授，美国更注重培养学生的独立思考能力。两种制度各有优缺点。" },
  { id: "sp-3", type: "presentation", topicEnglish: "Discuss the impact of technology on daily life in China", topicChinese: "讨论科技对中国日常生活的影响", timeLimitSeconds: 120, expectedTopics: ["technology", "daily life changes", "mobile payment"], expectedVocabulary: ["科技", "影响", "生活", "手机"], theme: "science_technology", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "科技对中国人的日常生活产生了巨大影响。现在几乎每个人都用手机支付，很少有人带现金。人们通过网上购物买各种东西，非常方便。社交媒体让人们可以随时和朋友联系。共享单车和网约车改变了人们的出行方式。可以说，科技让中国人的生活变得更加便利。" },
  { id: "sp-4", type: "presentation", topicEnglish: "Describe the importance of family in Chinese culture", topicChinese: "描述家庭在中国文化中的重要性", timeLimitSeconds: 120, expectedTopics: ["family values", "filial piety", "family structure"], expectedVocabulary: ["家庭", "孝顺", "传统", "尊重"], theme: "families_communities", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "在中国文化中，家庭是最重要的。中国人非常重视孝顺，就是尊敬和照顾父母长辈。一家人经常在一起吃饭、过节日。在中国传统中，几代人住在一起是很常见的。虽然现在年轻人更独立了，但是家庭的纽带仍然很强。中国人觉得家是最温暖的地方。" },
  { id: "sp-5", type: "presentation", topicEnglish: "Discuss environmental challenges facing China today", topicChinese: "讨论中国今天面临的环境挑战", timeLimitSeconds: 120, expectedTopics: ["pollution", "solutions", "government policy"], expectedVocabulary: ["环境", "污染", "保护", "政策"], theme: "global_challenges", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "中国面临着很多环境挑战。首先是空气污染，很多大城市的空气质量不太好。其次是水污染问题。中国政府已经采取了很多措施，比如发展新能源、减少工厂排放。中国现在是世界上太阳能发展最快的国家之一。虽然还有很多工作要做，但情况在慢慢改善。" },
  { id: "sp-6", type: "presentation", topicEnglish: "Explain the significance of Chinese cuisine in Chinese culture", topicChinese: "解释中国菜在中国文化中的意义", timeLimitSeconds: 120, expectedTopics: ["regional cuisines", "dining culture", "food symbolism"], expectedVocabulary: ["中国菜", "文化", "饮食", "地区"], theme: "beauty_aesthetics", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "中国菜在中国文化中有很重要的地位。中国有八大菜系，每个地区都有自己独特的烹饪风格。中国人常说'民以食为天'，意思是食物是生活中最重要的事情。在节日里，不同的食物有不同的象征意义，比如饺子象征财富，鱼象征年年有余。一起吃饭也是社交的重要方式。" },
  { id: "sp-7", type: "presentation", topicEnglish: "Describe how young people in China spend their free time", topicChinese: "描述中国年轻人如何度过空闲时间", timeLimitSeconds: 120, expectedTopics: ["youth activities", "social media", "entertainment"], expectedVocabulary: ["年轻人", "空闲", "活动", "娱乐"], theme: "contemporary_life", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "中国年轻人在空闲时间有很多活动选择。很多人喜欢玩手机游戏和看短视频。也有人喜欢运动，比如打篮球、跑步。周末的时候，年轻人常常和朋友去逛街、看电影。越来越多的年轻人也开始关注健康，喜欢去健身房锻炼。网上社交也是年轻人生活中很重要的一部分。" },
  { id: "sp-8", type: "presentation", topicEnglish: "Discuss the role of the Chinese language in global communication", topicChinese: "讨论中文在全球交流中的作用", timeLimitSeconds: 120, expectedTopics: ["Chinese language globally", "Confucius Institutes", "economic ties"], expectedVocabulary: ["中文", "全球", "交流", "学习"], theme: "global_challenges", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "中文在全球交流中越来越重要。中文是世界上使用人数最多的语言。随着中国经济的发展，越来越多的外国人开始学习中文。全世界有很多孔子学院，帮助人们学习中文和了解中国文化。学习中文不仅有助于就业，还能帮助人们更好地理解中国的文化和思维方式。" },
  { id: "sp-9", type: "presentation", topicEnglish: "Compare traditional and modern Chinese art forms", topicChinese: "比较传统和现代的中国艺术形式", timeLimitSeconds: 120, expectedTopics: ["traditional arts", "modern arts", "evolution"], expectedVocabulary: ["艺术", "传统", "现代", "变化"], theme: "beauty_aesthetics", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "中国的艺术形式既有传统的也有现代的。传统艺术包括书法、国画、京剧等，这些有几千年的历史。现代中国艺术融合了西方元素，出现了很多新的艺术形式，比如当代绘画和电影。虽然形式不同，但都反映了中国人的审美观念。传统艺术需要保护，现代艺术也需要创新。" },
  { id: "sp-10", type: "presentation", topicEnglish: "Describe the significance of the Great Wall of China", topicChinese: "描述中国长城的意义", timeLimitSeconds: 120, expectedTopics: ["history", "cultural significance", "tourism"], expectedVocabulary: ["长城", "历史", "建造", "意义"], theme: "beauty_aesthetics", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "中国的长城是世界上最伟大的建筑之一。它始建于两千多年前的秦朝，是为了防御北方的游牧民族。长城全长超过两万公里，是古代劳动人民智慧的结晶。现在长城已经成为中国最著名的旅游景点和世界文化遗产。中国人常说'不到长城非好汉'，说明长城在中国文化中的重要地位。" },
  { id: "sp-11", type: "presentation", topicEnglish: "Discuss the benefits and challenges of studying abroad", topicChinese: "讨论出国留学的好处和挑战", timeLimitSeconds: 120, expectedTopics: ["benefits", "challenges", "cultural adjustment"], expectedVocabulary: ["留学", "好处", "挑战", "文化"], theme: "families_communities", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "出国留学有很多好处，也有一些挑战。好处是可以提高外语水平，了解不同的文化，培养独立生活的能力。挑战包括语言障碍、文化差异和想家。很多留学生刚到外国时会感到孤独，但是随着时间的推移，他们会慢慢适应。总的来说，留学是一段宝贵的人生经历。" },
  { id: "sp-12", type: "presentation", topicEnglish: "Explain the concept of harmony in Chinese philosophy", topicChinese: "解释中国哲学中和谐的概念", timeLimitSeconds: 120, expectedTopics: ["harmony concept", "Confucianism", "modern application"], expectedVocabulary: ["和谐", "儒家", "思想", "社会"], theme: "personal_public_identities", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "和谐是中国哲学中非常重要的概念。儒家思想强调人与人之间的和谐，包括家庭和谐和社会和谐。中国人相信'天人合一'，就是人要和自然和谐相处。在现代社会中，中国政府也提倡建设'和谐社会'。和谐的理念影响着中国人的日常生活和人际关系。" },
  { id: "sp-13", type: "presentation", topicEnglish: "Describe how Chinese medicine differs from Western medicine", topicChinese: "描述中医和西医的区别", timeLimitSeconds: 120, expectedTopics: ["TCM principles", "Western medicine", "comparison"], expectedVocabulary: ["中医", "西医", "治疗", "不同"], theme: "science_technology", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "中医和西医有很多不同。中医有几千年的历史，注重整体治疗，用草药和针灸等方法。西医比较注重科学研究和具体的症状治疗。中医讲究'治未病'，就是预防疾病。很多中国人同时使用中医和西医。现在越来越多的西方国家也开始接受中医。" },
  { id: "sp-14", type: "presentation", topicEnglish: "Discuss the impact of urbanization in China", topicChinese: "讨论城市化对中国的影响", timeLimitSeconds: 120, expectedTopics: ["urbanization", "migration", "economic development"], expectedVocabulary: ["城市化", "发展", "农村", "变化"], theme: "contemporary_life", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "中国的城市化进程非常快。过去几十年，大量农村人口搬到了城市寻找工作机会。城市化带来了经济发展和生活水平的提高，但也带来了一些问题，比如交通拥堵、房价高、环境污染。中国政府正在努力让城市和农村协调发展。" },
  { id: "sp-15", type: "presentation", topicEnglish: "Explain the importance of tea culture in China", topicChinese: "解释茶文化在中国的重要性", timeLimitSeconds: 120, expectedTopics: ["tea history", "tea ceremony", "social role"], expectedVocabulary: ["茶", "文化", "传统", "历史"], theme: "beauty_aesthetics", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "茶在中国文化中有非常重要的地位。中国是茶的故乡，有几千年的茶文化历史。中国有很多种类的茶，比如绿茶、红茶、乌龙茶。喝茶不仅是为了解渴，也是一种社交方式。中国人经常用茶来招待客人，表示尊重和友好。茶道也是一种修身养性的方式。" },
  { id: "sp-16", type: "presentation", topicEnglish: "Describe how social media has changed communication in China", topicChinese: "描述社交媒体如何改变中国的交流方式", timeLimitSeconds: 120, expectedTopics: ["WeChat", "social media impact", "communication changes"], expectedVocabulary: ["社交媒体", "微信", "交流", "改变"], theme: "science_technology", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "社交媒体深刻地改变了中国人的交流方式。微信是中国最流行的社交应用，几乎每个人都在用。人们通过微信聊天、发朋友圈、支付账单。短视频平台如抖音也非常流行。社交媒体让人们的交流更加方便快捷，但也有人担心面对面的交流在减少。" },
  { id: "sp-17", type: "presentation", topicEnglish: "Discuss the role of sports in Chinese society", topicChinese: "讨论体育在中国社会中的作用", timeLimitSeconds: 120, expectedTopics: ["popular sports", "Olympics", "fitness culture"], expectedVocabulary: ["体育", "运动", "比赛", "健康"], theme: "contemporary_life", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "体育在中国社会中扮演着重要的角色。乒乓球被称为中国的'国球'，篮球和足球也很受欢迎。中国在奥运会上取得了很多好成绩。近年来，越来越多的中国人开始注重健身。政府也鼓励全民运动，建设了很多公共运动设施。体育不仅能增强体质，还能培养团队精神。" },
  { id: "sp-18", type: "presentation", topicEnglish: "Compare public transportation in Chinese and American cities", topicChinese: "比较中美城市的公共交通", timeLimitSeconds: 120, expectedTopics: ["public transport", "high-speed rail", "comparison"], expectedVocabulary: ["公共交通", "高铁", "地铁", "比较"], theme: "science_technology", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "中国和美国的城市公共交通有很大的区别。中国的高铁系统非常发达，连接了很多大城市，又快又方便。中国的大城市都有地铁，票价便宜。美国的很多城市以私家车为主，公共交通不如中国方便。但美国的一些大城市，如纽约，也有很好的地铁系统。" },
  { id: "sp-19", type: "presentation", topicEnglish: "Describe how Chinese New Year is celebrated worldwide", topicChinese: "描述全世界如何庆祝中国新年", timeLimitSeconds: 120, expectedTopics: ["global celebrations", "traditions", "cultural exchange"], expectedVocabulary: ["春节", "庆祝", "世界", "传统"], theme: "families_communities", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "中国新年不仅在中国庆祝，在全世界很多地方都有庆祝活动。在美国、英国等国家的唐人街，人们会举行舞龙舞狮表演。很多城市会放烟花、办灯会。外国朋友也会参与庆祝，学习写春联、包饺子。中国新年已经成为一个全球性的文化活动，促进了文化交流。" },
  { id: "sp-20", type: "presentation", topicEnglish: "Discuss the challenges of preserving endangered languages", topicChinese: "讨论保护濒危语言的挑战", timeLimitSeconds: 120, expectedTopics: ["endangered languages", "preservation", "cultural identity"], expectedVocabulary: ["语言", "保护", "文化", "挑战"], theme: "global_challenges", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "保护濒危语言是一个重要的全球挑战。世界上有很多语言正在消失，每种语言的消失都意味着一种文化的流失。中国也有很多少数民族语言面临类似的问题。保护这些语言的方法包括记录、教学和使用科技来保存。语言是文化认同的重要部分，我们都应该关注这个问题。" },
  { id: "sp-21", type: "presentation", topicEnglish: "Explain the concept of face (面子) in Chinese culture", topicChinese: "解释中国文化中面子的概念", timeLimitSeconds: 120, expectedTopics: ["face concept", "social behavior", "examples"], expectedVocabulary: ["面子", "文化", "社会", "尊重"], theme: "personal_public_identities", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "面子在中国文化中是一个非常重要的概念。面子代表一个人在社会上的名誉和尊严。中国人很注重给别人面子，也很在意自己的面子。比如在公开场合批评别人会让人'丢面子'。送礼物、请客吃饭等都是'给面子'的方式。理解面子文化对于理解中国人的社交行为很有帮助。" },
  { id: "sp-22", type: "presentation", topicEnglish: "Describe the influence of Chinese philosophy on modern life", topicChinese: "描述中国哲学对现代生活的影响", timeLimitSeconds: 120, expectedTopics: ["Confucianism", "Taoism", "modern influence"], expectedVocabulary: ["哲学", "儒家", "道家", "影响"], theme: "personal_public_identities", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "中国哲学对现代生活有着深远的影响。儒家思想强调教育、家庭和社会秩序，至今仍影响着中国人的价值观。道家的'顺其自然'理念帮助人们在快节奏的现代生活中寻找平衡。佛教思想提倡善良和宽容。这些哲学思想不仅影响中国，也越来越受到世界各地人们的关注。" },
  { id: "sp-23", type: "presentation", topicEnglish: "Discuss the significance of the Silk Road in cultural exchange", topicChinese: "讨论丝绸之路在文化交流中的意义", timeLimitSeconds: 120, expectedTopics: ["Silk Road history", "cultural exchange", "modern Belt and Road"], expectedVocabulary: ["丝绸之路", "交流", "贸易", "文化"], theme: "global_challenges", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "丝绸之路是古代连接中国和西方的重要贸易路线。通过丝绸之路，中国的丝绸、茶叶、瓷器传到了西方。同时，西方的文化、宗教和技术也传入了中国。丝绸之路不仅是一条贸易之路，更是一条文化交流之路。现在中国提出了'一带一路'倡议，是对古代丝绸之路精神的传承。" },
  { id: "sp-24", type: "presentation", topicEnglish: "Describe the changes in Chinese family structure over the past decades", topicChinese: "描述过去几十年中国家庭结构的变化", timeLimitSeconds: 120, expectedTopics: ["family structure changes", "one-child policy", "modern families"], expectedVocabulary: ["家庭", "变化", "政策", "结构"], theme: "families_communities", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "过去几十年，中国的家庭结构发生了很大变化。以前中国的大家庭很常见，几代人住在一起。由于之前的独生子女政策，很多家庭只有一个孩子。现在中国鼓励生育，但很多年轻人因为经济压力选择晚婚或少生。核心家庭越来越多，但家庭的重要性在中国文化中仍然不变。" },
  { id: "sp-25", type: "presentation", topicEnglish: "Discuss the role of music in Chinese culture", topicChinese: "讨论音乐在中国文化中的作用", timeLimitSeconds: 120, expectedTopics: ["traditional music", "modern music", "cultural significance"], expectedVocabulary: ["音乐", "文化", "传统", "现代"], theme: "beauty_aesthetics", rubricPoints: ["Task completion", "Vocabulary range", "Grammar accuracy", "Organization", "Cultural knowledge"], modelResponse: "音乐在中国文化中一直扮演着重要的角色。中国的传统乐器如古筝、二胡、琵琶有几千年的历史。传统音乐和诗歌、戏曲紧密相连。现代中国音乐融合了流行、摇滚和嘻哈等西方元素。很多年轻人喜欢中国风音乐，把传统和现代结合起来。音乐是中国人表达情感的重要方式。" },
];

export function selectSpeakingExercises(
  exerciseType: SpeakingExerciseType,
  count: number
): SpeakingExercise[] {
  let pool: SpeakingExercise[];
  switch (exerciseType) {
    case "word":
      pool = [...WORD_EXERCISES];
      break;
    case "sentence":
      pool = [...SENTENCE_EXERCISES];
      break;
    case "conversation":
      pool = [...CONVERSATION_EXERCISES];
      break;
    case "presentation":
      pool = [...PRESENTATION_EXERCISES];
      break;
    default:
      pool = [];
  }

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
}

export function selectMixedSpeakingExercises(count: number): SpeakingExercise[] {
  const exercises: SpeakingExercise[] = [];
  const types: SpeakingExerciseType[] = ["word", "sentence", "conversation", "presentation"];

  const perType = Math.max(1, Math.floor(count / types.length));
  for (const type of types) {
    exercises.push(...selectSpeakingExercises(type, perType));
  }

  for (let i = exercises.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [exercises[i], exercises[j]] = [exercises[j], exercises[i]];
  }

  return exercises.slice(0, count);
}

export const TOTAL_CONVERSATION_PROMPTS = CONVERSATION_EXERCISES.length;
export const TOTAL_PRESENTATION_TOPICS = PRESENTATION_EXERCISES.length;
