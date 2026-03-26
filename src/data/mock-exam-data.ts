import type {
  MockExamReadingPassage,
  MockExamWritingPrompt,
  MockExamSpeakingPrompt,
} from "../types/mock-exam";

export const AP_READING_PASSAGES: MockExamReadingPassage[] = [
  {
    id: "rp-01",
    passageType: "sign",
    chinese: "图书馆开放时间\n周一至周五：上午8:00 — 晚上9:00\n周六：上午9:00 — 下午5:00\n周日：休息\n请保持安静，禁止饮食。",
    theme: "contemporary_life",
    questions: [
      { id: "rp-01-q1", question: "When is the library closed?", options: ["Monday", "Saturday", "Sunday", "Friday"], correctIndex: 2, explanation: "周日：休息 means the library is closed on Sunday." },
      { id: "rp-01-q2", question: "What time does the library close on weekdays?", options: ["5:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"], correctIndex: 2, explanation: "晚上9:00 indicates it closes at 9 PM on weekdays." },
      { id: "rp-01-q3", question: "What is NOT allowed in the library?", options: ["Studying", "Reading", "Eating and drinking", "Borrowing books"], correctIndex: 2, explanation: "禁止饮食 means eating and drinking are prohibited." },
    ],
  },
  {
    id: "rp-02",
    passageType: "note",
    chinese: "小明：\n你好！今天下午我去你家找你，但是你不在家。你妈妈说你去医院看病了。你没事吧？如果你明天能来上课，请带上我借你的那本数学书。如果你还需要休息，就不用着急，下周再还也可以。\n祝你早日康复！\n你的同学 小红",
    theme: "families_communities",
    questions: [
      { id: "rp-02-q1", question: "Why wasn't Xiao Ming at home?", options: ["He was at school", "He went to the hospital", "He was visiting friends", "He was shopping"], correctIndex: 1, explanation: "你妈妈说你去医院看病了 means his mom said he went to the hospital." },
      { id: "rp-02-q2", question: "What does Xiao Hong want Xiao Ming to bring?", options: ["A notebook", "A math book", "A dictionary", "Homework"], correctIndex: 1, explanation: "请带上我借你的那本数学书 means please bring the math book I lent you." },
      { id: "rp-02-q3", question: "What does Xiao Hong say if Xiao Ming can't come tomorrow?", options: ["Call her", "Send a message", "Return the book next week", "Go to the hospital"], correctIndex: 2, explanation: "下周再还也可以 means returning it next week is also fine." },
    ],
  },
  {
    id: "rp-03",
    passageType: "letter",
    chinese: "亲爱的王老师：\n\n您好！我是去年您教过的学生李华。我现在在美国上大学，学的是计算机科学。虽然课程很难，但是我每天都在努力学习。\n\n我想告诉您，在大学里我选了一门中文课。因为您以前对我的教导，我的中文基础很好，老师和同学们都很佩服。我非常感谢您当年对我的帮助。\n\n暑假的时候我打算回中国看看。到时候我一定去看您！\n\n祝您身体健康，工作顺利！\n\n您的学生 李华\n2026年3月15日",
    theme: "families_communities",
    questions: [
      { id: "rp-03-q1", question: "What is Li Hua studying in college?", options: ["Chinese literature", "Computer science", "Mathematics", "Education"], correctIndex: 1, explanation: "学的是计算机科学 means studying computer science." },
      { id: "rp-03-q2", question: "Why is Li Hua doing well in Chinese class?", options: ["The class is easy", "She has a good textbook", "Wang Laoshi's previous teaching", "She watches Chinese movies"], correctIndex: 2, explanation: "因为您以前对我的教导，我的中文基础很好 credits Wang Laoshi's previous teaching." },
      { id: "rp-03-q3", question: "When does Li Hua plan to visit China?", options: ["Next month", "During winter break", "During summer vacation", "Next year"], correctIndex: 2, explanation: "暑假的时候我打算回中国看看 means during summer vacation." },
    ],
  },
  {
    id: "rp-04",
    passageType: "article",
    chinese: "中国的高铁发展非常迅速。2008年，中国第一条高速铁路——京津城际铁路正式开通。到了2024年，中国的高铁总里程已经超过四万公里，是世界上最长的高铁网络。\n\n高铁不仅速度快（最高时速可达350公里），而且准时率非常高。很多中国人现在更喜欢坐高铁而不是飞机，因为高铁站通常在市中心，不需要提前很长时间到达。\n\n高铁的发展也促进了旅游业的增长。很多以前不方便到达的小城市，现在因为有了高铁，游客数量大大增加。",
    theme: "science_technology",
    questions: [
      { id: "rp-04-q1", question: "When did China's first high-speed rail line open?", options: ["2004", "2008", "2012", "2016"], correctIndex: 1, explanation: "2008年，中国第一条高速铁路正式开通。" },
      { id: "rp-04-q2", question: "Why do many people prefer high-speed rail over flying?", options: ["It's cheaper", "Stations are in city centers", "It's faster", "Better food"], correctIndex: 1, explanation: "高铁站通常在市中心，不需要提前很长时间到达 means stations are in city centers." },
      { id: "rp-04-q3", question: "How has high-speed rail affected small cities?", options: ["Population decreased", "Tourism increased", "Pollution increased", "No significant effect"], correctIndex: 1, explanation: "游客数量大大增加 means tourist numbers greatly increased." },
      { id: "rp-04-q4", question: "What is the maximum speed of China's high-speed trains?", options: ["250 km/h", "300 km/h", "350 km/h", "400 km/h"], correctIndex: 2, explanation: "最高时速可达350公里 means maximum speed reaches 350 km/h." },
    ],
  },
  {
    id: "rp-05",
    passageType: "advertisement",
    chinese: "暑期中文夏令营\n\n时间：7月1日 — 7月31日\n地点：北京语言大学\n费用：15000元（含食宿、教材、文化活动）\n\n课程内容：\n• 每天4小时中文课（口语、听力、阅读、写作）\n• 每周2次文化体验（书法、太极拳、中国画）\n• 周末文化参观（长城、故宫、天坛）\n\n报名条件：16-25岁，有基础中文水平\n名额有限，请在5月15日前报名！\n\n联系方式：summer@blcu.edu.cn",
    theme: "contemporary_life",
    questions: [
      { id: "rp-05-q1", question: "How long is the summer camp?", options: ["Two weeks", "Three weeks", "One month", "Two months"], correctIndex: 2, explanation: "7月1日—7月31日 is one month." },
      { id: "rp-05-q2", question: "What is included in the fee?", options: ["Only tuition", "Tuition and meals", "Accommodation, meals, textbooks, and activities", "Only accommodation"], correctIndex: 2, explanation: "含食宿、教材、文化活动 means meals, accommodation, textbooks, and cultural activities." },
      { id: "rp-05-q3", question: "How often are cultural experience classes?", options: ["Every day", "Twice a week", "Once a week", "Twice a month"], correctIndex: 1, explanation: "每周2次文化体验 means twice a week." },
    ],
  },
  {
    id: "rp-06",
    passageType: "article",
    chinese: "越来越多的中国年轻人开始关注心理健康。过去，中国人很少谈论心理问题，觉得这是一件不好意思的事情。但是现在，特别是在大城市，越来越多的人愿意寻求心理咨询的帮助。\n\n一项调查显示，18到30岁的年轻人中，有超过60%的人表示曾经感到焦虑或压力过大。大学也开始设立心理健康中心，提供免费的咨询服务。\n\n专家认为，社交媒体和学业、工作压力是导致年轻人心理问题增加的主要原因。他们建议年轻人多运动、保持良好的社交关系、必要时寻求专业帮助。",
    theme: "personal_public_identities",
    questions: [
      { id: "rp-06-q1", question: "How did Chinese people traditionally view mental health issues?", options: ["Very openly", "As embarrassing to discuss", "As very important", "As a Western concept"], correctIndex: 1, explanation: "觉得这是一件不好意思的事情 means they felt it was embarrassing." },
      { id: "rp-06-q2", question: "What percentage of young people reported feeling anxious?", options: ["Over 40%", "Over 50%", "Over 60%", "Over 70%"], correctIndex: 2, explanation: "有超过60%的人表示曾经感到焦虑 indicates over 60%." },
      { id: "rp-06-q3", question: "What do experts suggest as main causes of mental health issues?", options: ["Diet and exercise", "Social media and academic/work pressure", "Family problems", "Financial difficulties"], correctIndex: 1, explanation: "社交媒体和学业、工作压力是导致年轻人心理问题增加的主要原因" },
    ],
  },
  {
    id: "rp-07",
    passageType: "sign",
    chinese: "停车场收费标准\n小型车：前两小时免费，之后每小时10元\n大型车：前一小时免费，之后每小时20元\n收费时间：早7:00 — 晚10:00\n夜间停车（晚10:00 — 早7:00）：统一收费30元\n请勿占用残疾人专用车位",
    theme: "contemporary_life",
    questions: [
      { id: "rp-07-q1", question: "How long is free parking for small cars?", options: ["One hour", "Two hours", "Three hours", "No free parking"], correctIndex: 1, explanation: "前两小时免费 means the first two hours are free." },
      { id: "rp-07-q2", question: "How much is overnight parking?", options: ["10 yuan", "20 yuan", "30 yuan", "50 yuan"], correctIndex: 2, explanation: "夜间停车统一收费30元 means 30 yuan flat rate for overnight." },
    ],
  },
  {
    id: "rp-08",
    passageType: "article",
    chinese: `中国人有句老话：\u201C民以食为天。\u201D这句话说明了食物在中国文化中的重要地位。中国有八大菜系，分别是川菜、鲁菜、粤菜、苏菜、浙菜、闽菜、湘菜和徽菜。每种菜系都有自己独特的风味和烹饪方法。\n\n比如川菜以麻辣著称，粤菜注重食材的原味。近年来，\u201C融合菜\u201D越来越流行，就是把不同菜系甚至不同国家的烹饪方法结合在一起，创造出新的菜肴。\n\n此外，中国的饮食文化不仅仅是关于食物的味道，还包括用餐的礼仪。比如，长辈先动筷子，客人坐在主座等。这些规矩反映了中国人对尊重和和谐的重视。`,
    theme: "beauty_aesthetics",
    questions: [
      { id: "rp-08-q1", question: "How many major cuisine systems does China have?", options: ["Four", "Six", "Eight", "Ten"], correctIndex: 2, explanation: "中国有八大菜系 means China has eight major cuisines." },
      { id: "rp-08-q2", question: "What is Sichuan cuisine known for?", options: ["Sweetness", "Sourness", "Spiciness and numbing heat", "Light flavors"], correctIndex: 2, explanation: "川菜以麻辣著称 means Sichuan cuisine is famous for spicy and numbing flavors." },
      { id: "rp-08-q3", question: "What is 'fusion cuisine' (融合菜)?", options: ["Only Chinese cooking", "Combining different cooking methods", "Vegetarian food", "Street food"], correctIndex: 1, explanation: "把不同菜系甚至不同国家的烹饪方法结合在一起 means combining different methods." },
      { id: "rp-08-q4", question: "According to the passage, dining etiquette reflects what values?", options: ["Wealth and status", "Respect and harmony", "Speed and efficiency", "Independence"], correctIndex: 1, explanation: "反映了中国人对尊重和和谐的重视 means respect and harmony." },
    ],
  },
  {
    id: "rp-09",
    passageType: "letter",
    chinese: "亲爱的张阿姨：\n\n您好！谢谢您上个月寄来的中秋月饼，味道非常好！我和室友都很喜欢。\n\n在美国过中秋节的感觉和在中国很不一样。这里没有放假，我只能在晚上和几个中国同学一起赏月、吃月饼。虽然简单，但是让我感觉到了一点家的温暖。\n\n我的学业进展顺利。这学期我选了五门课，虽然很忙但是很充实。下学期我打算选一门关于中美文化比较的课，我想从学术的角度了解两种文化的异同。\n\n代我向叔叔和小弟弟问好！\n\n小芳\n2026年10月5日",
    theme: "families_communities",
    questions: [
      { id: "rp-09-q1", question: "What did Zhang Ayi send?", options: ["A letter", "Moon cakes", "A birthday gift", "Chinese books"], correctIndex: 1, explanation: "谢谢您上个月寄来的中秋月饼 means Mid-Autumn moon cakes." },
      { id: "rp-09-q2", question: "How did Xiao Fang celebrate Mid-Autumn Festival?", options: ["Had a big party", "Flew back to China", "Moon-gazed with Chinese classmates", "Didn't celebrate"], correctIndex: 2, explanation: "和几个中国同学一起赏月、吃月饼 means moon-gazing with Chinese classmates." },
      { id: "rp-09-q3", question: "What course does Xiao Fang plan to take next semester?", options: ["Advanced Chinese", "Chinese-American cultural comparison", "Computer science", "History"], correctIndex: 1, explanation: "关于中美文化比较的课 means a course on Chinese-American cultural comparison." },
    ],
  },
  {
    id: "rp-10",
    passageType: "article",
    chinese: "共享经济在中国发展得非常快。从共享单车到共享充电宝，再到共享办公空间，这种经济模式已经深入中国人的日常生活。\n\n以共享单车为例，像哈啰出行和美团单车这样的公司在中国的大城市投放了数百万辆自行车。用户只需要用手机扫描二维码，就可以骑车出行，非常方便。价格也很便宜，骑一次通常只需要一两块钱。\n\n但是共享经济也面临着一些挑战。比如共享单车曾经出现过乱停乱放的问题。很多城市已经开始规定必须把车停在指定的区域。\n\n总的来说，共享经济为人们的生活提供了更多便利，但同时也需要更好的管理和规范。",
    theme: "science_technology",
    questions: [
      { id: "rp-10-q1", question: "Which of these is NOT mentioned as a form of sharing economy?", options: ["Shared bikes", "Shared power banks", "Shared office spaces", "Shared cars"], correctIndex: 3, explanation: "The passage mentions bikes, power banks, and office spaces but not shared cars." },
      { id: "rp-10-q2", question: "How do users access shared bikes?", options: ["Buy a membership card", "Scan a QR code with phone", "Go to a rental shop", "Call customer service"], correctIndex: 1, explanation: "用手机扫描二维码 means scan a QR code with your phone." },
      { id: "rp-10-q3", question: "What problem did shared bikes face?", options: ["Too expensive", "Bikes breaking easily", "Bikes parked randomly everywhere", "Not enough bikes"], correctIndex: 2, explanation: "乱停乱放的问题 means the problem of parking randomly." },
    ],
  },
];

export const AP_WRITING_PROMPTS: MockExamWritingPrompt[] = [
  {
    id: "wp-01",
    type: "story_narration",
    instructions: "Look at the four pictures below and write a story based on them. Your story should be coherent, detailed, and written in Chinese characters.",
    imageDescriptions: [
      "A student looking at a test paper with a low grade, looking sad.",
      "The student studying hard at a desk with many books, late at night.",
      "The student taking another test, looking focused and confident.",
      "The student receiving the test back with a high grade, smiling happily.",
    ],
    timeLimitMinutes: 15,
  },
  {
    id: "wp-02",
    type: "story_narration",
    instructions: "Look at the four pictures below and write a story based on them. Your story should be coherent, detailed, and written in Chinese characters.",
    imageDescriptions: [
      "A family sitting at a dinner table, everyone on their phones, not talking to each other.",
      "The mother putting a 'no phones during dinner' sign on the table.",
      "The family talking and laughing together during dinner without phones.",
      "The family doing various activities together after dinner — playing board games, chatting.",
    ],
    timeLimitMinutes: 15,
  },
  {
    id: "wp-03",
    type: "story_narration",
    instructions: "Look at the four pictures below and write a story based on them. Your story should be coherent, detailed, and written in Chinese characters.",
    imageDescriptions: [
      "A student arriving at a Chinese school for the first time, looking nervous.",
      "A friendly Chinese student approaching and offering to help.",
      "The two students eating lunch together, the Chinese student teaching chopstick use.",
      "The two students presenting a project together in class, both smiling.",
    ],
    timeLimitMinutes: 15,
  },
  {
    id: "wp-04",
    type: "email_response",
    instructions: "Read the email below and write a reply in Chinese. Your response should address all the questions in the email.",
    emailContent: "Hi! I heard you participated in a summer program in China last year. I'm thinking about going this summer. Can you tell me:\n1. What was the program like? What did you learn?\n2. What was the most memorable experience?\n3. Do you have any advice for someone going for the first time?",
    emailContentChinese: "你好！听说你去年参加了一个中国的暑期项目。我今年夏天也想去。你能告诉我：\n1. 那个项目怎么样？你学到了什么？\n2. 最难忘的经历是什么？\n3. 对第一次去的人有什么建议吗？",
    timeLimitMinutes: 15,
  },
  {
    id: "wp-05",
    type: "email_response",
    instructions: "Read the email below and write a reply in Chinese. Your response should address all the questions in the email.",
    emailContent: "Hello! Our school's Chinese club is organizing a cultural event next month. We'd like your help. Could you:\n1. Suggest some activities that would help students learn about Chinese culture?\n2. Tell us about your experience with Chinese holidays or traditions?\n3. Would you be willing to teach a short lesson on Chinese calligraphy or cooking?",
    emailContentChinese: "你好！我们学校的中文俱乐部下个月要办一个文化活动。我们想请你帮忙。你能：\n1. 建议一些帮助学生了解中国文化的活动吗？\n2. 跟我们分享你关于中国节日或传统的经历吗？\n3. 你愿意教一节简短的书法课或者做菜课吗？",
    timeLimitMinutes: 15,
  },
  {
    id: "wp-06",
    type: "email_response",
    instructions: "Read the email below and write a reply in Chinese. Your response should address all the questions in the email.",
    emailContent: "Hi there! I'm your new pen pal from Beijing. I'm very excited to write to you! I'd like to know:\n1. What is your daily life like as a student in America?\n2. What do you like to do in your free time?\n3. Is there anything about Chinese culture you're curious about? I'd love to share!",
    emailContentChinese: "你好！我是你在北京的新笔友。我非常高兴能给你写信！我想知道：\n1. 作为美国学生，你的日常生活是什么样的？\n2. 你空闲时间喜欢做什么？\n3. 你对中国文化有什么好奇的吗？我很乐意分享！",
    timeLimitMinutes: 15,
  },
];

export const AP_SPEAKING_CONVERSATION_PROMPTS: MockExamSpeakingPrompt[] = [
  {
    id: "scp-01",
    type: "conversation",
    prompt: "You are talking with a Chinese exchange student at your school. She wants to know about your school life.",
    conversationTurns: [
      "你在这个学校上几年了？你喜欢这个学校吗？",
      "你最喜欢什么课？为什么？",
      "你参加了什么课外活动？",
      "你一般放学后做什么？",
      "你觉得美国的学校和中国的学校有什么不同？",
      "你对将来上大学有什么计划？",
    ],
    timeLimitSeconds: 120,
  },
  {
    id: "scp-02",
    type: "conversation",
    prompt: "You are talking with your Chinese teacher about your plans for studying Chinese this summer.",
    conversationTurns: [
      "暑假你打算怎么继续学中文？",
      "你有没有考虑过去中国学习？",
      "你觉得你的中文哪方面需要提高？",
      "你平时怎么练习听力和口语？",
      "你看中文电影或者听中文歌吗？",
      "你觉得学好中文对你的未来有什么帮助？",
    ],
    timeLimitSeconds: 120,
  },
  {
    id: "scp-03",
    type: "conversation",
    prompt: "You are talking with a friend about healthy eating habits.",
    conversationTurns: [
      "你平时吃饭注意健康吗？",
      "你觉得什么是健康的饮食习惯？",
      "你经常吃快餐吗？为什么？",
      "在你们学校的食堂，有没有健康的食物选择？",
      "你觉得中国菜和美国菜哪个更健康？为什么？",
      "你有什么建议帮助年轻人吃得更健康？",
    ],
    timeLimitSeconds: 120,
  },
  {
    id: "scp-04",
    type: "conversation",
    prompt: "You are discussing environmental protection with a Chinese classmate.",
    conversationTurns: [
      "你觉得环境保护重要吗？为什么？",
      "你和你的家人做了什么来保护环境？",
      "你觉得学校应该怎么帮助保护环境？",
      "你听说过中国的环境问题吗？",
      "你觉得政府在环境保护中应该起什么作用？",
      "如果你能改变一件事来帮助环境，你会做什么？",
    ],
    timeLimitSeconds: 120,
  },
  {
    id: "scp-05",
    type: "conversation",
    prompt: "You are talking with a Chinese friend about technology and social media.",
    conversationTurns: [
      "你每天花多少时间在手机上？",
      "你最常用什么社交媒体？",
      "你觉得社交媒体对年轻人有什么影响？",
      "你的父母对你用手机有什么规定吗？",
      "你觉得人工智能会怎么改变我们的生活？",
      "如果有一天没有手机，你会怎么办？",
    ],
    timeLimitSeconds: 120,
  },
  {
    id: "scp-06",
    type: "conversation",
    prompt: "You are talking with a Chinese friend about travel experiences.",
    conversationTurns: [
      "你去过最远的地方是哪里？",
      "你旅行的时候最喜欢做什么？",
      "你更喜欢自然风景还是城市景观？为什么？",
      "如果你能去中国旅行，你最想去哪里？",
      "你觉得旅行对一个人有什么好处？",
      "你有没有在旅行中遇到过什么有趣的事情？",
    ],
    timeLimitSeconds: 120,
  },
];

export const AP_SPEAKING_PRESENTATION_PROMPTS: MockExamSpeakingPrompt[] = [
  {
    id: "spp-01",
    type: "presentation",
    prompt: "Chinese calligraphy is considered one of the highest forms of art in Chinese culture. In your presentation, describe the significance of calligraphy in Chinese culture, including its history, its role in daily life, and why it is still valued today.",
    promptChinese: "中国书法被认为是中国文化中最高的艺术形式之一。请描述书法在中国文化中的意义，包括它的历史、在日常生活中的角色，以及为什么它今天仍然被重视。",
    timeLimitSeconds: 120,
    prepTimeSeconds: 240,
  },
  {
    id: "spp-02",
    type: "presentation",
    prompt: "The Spring Festival (Chinese New Year) is the most important traditional holiday in China. In your presentation, describe how Spring Festival is celebrated, including traditions, foods, and family customs.",
    promptChinese: "春节是中国最重要的传统节日。请描述春节是怎么庆祝的，包括传统习俗、食物和家庭活动。",
    timeLimitSeconds: 120,
    prepTimeSeconds: 240,
  },
  {
    id: "spp-03",
    type: "presentation",
    prompt: "China's education system places great emphasis on exams, particularly the college entrance exam (高考). In your presentation, discuss the role of exams in Chinese education, how it compares to the American system, and its impact on students.",
    promptChinese: "中国的教育制度非常重视考试，特别是高考。请讨论考试在中国教育中的角色，与美国制度的比较，以及对学生的影响。",
    timeLimitSeconds: 120,
    prepTimeSeconds: 240,
  },
  {
    id: "spp-04",
    type: "presentation",
    prompt: "Chinese cuisine varies greatly from region to region. In your presentation, describe the diversity of Chinese cuisine, including regional differences, famous dishes, and the cultural significance of food in China.",
    promptChinese: "中国菜因地区不同而有很大差异。请描述中国菜的多样性，包括地区差异、著名菜肴以及食物在中国文化中的意义。",
    timeLimitSeconds: 120,
    prepTimeSeconds: 240,
  },
  {
    id: "spp-05",
    type: "presentation",
    prompt: "The concept of filial piety (孝) has been central to Chinese culture for thousands of years. In your presentation, explain what filial piety means, how it is practiced today, and whether you think it is still important in modern society.",
    promptChinese: "孝道在中国文化中有几千年的历史。请解释孝道的含义，今天人们是如何践行的，以及你认为它在现代社会是否仍然重要。",
    timeLimitSeconds: 120,
    prepTimeSeconds: 240,
  },
  {
    id: "spp-06",
    type: "presentation",
    prompt: "Technology has rapidly changed how people communicate in China, from WeChat to social media platforms. In your presentation, discuss how technology has changed communication in China and its effects on social relationships.",
    promptChinese: "科技迅速改变了中国人的交流方式，从微信到各种社交媒体平台。请讨论科技如何改变了中国的交流方式及其对社会关系的影响。",
    timeLimitSeconds: 120,
    prepTimeSeconds: 240,
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function selectReadingPassages(count: number): MockExamReadingPassage[] {
  return shuffle(AP_READING_PASSAGES).slice(0, count);
}

export function selectWritingPrompts(): {
  storyNarration: MockExamWritingPrompt;
  emailResponse: MockExamWritingPrompt;
} {
  const stories = shuffle(AP_WRITING_PROMPTS.filter(p => p.type === "story_narration"));
  const emails = shuffle(AP_WRITING_PROMPTS.filter(p => p.type === "email_response"));
  return {
    storyNarration: stories[0],
    emailResponse: emails[0],
  };
}

export function selectConversationPrompt(): MockExamSpeakingPrompt {
  return shuffle(AP_SPEAKING_CONVERSATION_PROMPTS)[0];
}

export function selectPresentationPrompt(): MockExamSpeakingPrompt {
  return shuffle(AP_SPEAKING_PRESENTATION_PROMPTS)[0];
}
