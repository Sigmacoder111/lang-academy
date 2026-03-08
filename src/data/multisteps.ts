import type { MultistepScenario } from "../types/graph";

export const MULTISTEP_SCENARIOS: MultistepScenario[] = [
  {
    "id": "ms_1",
    "title": "Ordering at a Chinese Restaurant",
    "theme": "contemporary_life",
    "description": "You're dining at a traditional restaurant in Beijing. Navigate the menu, order food, and handle the bill using your Chinese skills.",
    "prereqNodeIds": [
      "w_94939c7c",
      "w_8fa962a4",
      "w_67815730",
      "c_5199",
      "c_5b66"
    ],
    "steps": [
      {
        "instruction": "The host greets you. How do you respond?",
        "question": "What does \"江\" mean?",
        "options": [
          "component of 兵马俑",
          "component of 长江",
          "to move/carry",
          "skill/technology"
        ],
        "correctIndex": 1,
        "explanation": "江 () means \"component of 长江\".",
        "hint": "Think about basic greetings"
      },
      {
        "instruction": "The waiter asks how many people. What's the measure word for people?",
        "question": "Which character means \"to analyze\"?",
        "options": [
          "能力",
          "分析",
          "带",
          "象"
        ],
        "correctIndex": 1,
        "explanation": "\"to analyze\" is written as 分析 (fēnxī)."
      },
      {
        "instruction": "You see 菜 on the menu. What category is this?",
        "question": "How do you pronounce \"议论文:教育\"?",
        "options": [
          "yīn cái shī jiào",
          "yìlùnwén: jiàoyù",
          "zhì",
          "rùkǒu"
        ],
        "correctIndex": 1,
        "explanation": "议论文:教育 is pronounced yìlùnwén: jiàoyù."
      },
      {
        "instruction": "The waiter recommends a dish. Understand the description.",
        "question": "What does \"承\" mean?",
        "options": [
          "component of 慈善",
          "component of 承担",
          "Go (board game)",
          "component of 捐款"
        ],
        "correctIndex": 1,
        "explanation": "承 () means \"component of 承担\"."
      },
      {
        "instruction": "You want to order tea. How do you say it?",
        "question": "Which character means \"component of 一直\"?",
        "options": [
          "裤子",
          "一",
          "胖",
          "捐款"
        ],
        "correctIndex": 1,
        "explanation": "\"component of 一直\" is written as 一 ()."
      },
      {
        "instruction": "Ask the waiter how much the dish costs.",
        "question": "How do you pronounce \"奉献\"?",
        "options": [
          "fèngxiàn",
          "jìsuànjī",
          "nànmín",
          "kē"
        ],
        "correctIndex": 0,
        "explanation": "奉献 is pronounced fèngxiàn."
      },
      {
        "instruction": "The waiter says it's very delicious. What word did they use?",
        "question": "What does \"气质\" mean?",
        "options": [
          "temperament/aura",
          "component of 头痛",
          "seek truth from facts",
          "to dare"
        ],
        "correctIndex": 0,
        "explanation": "气质 (qìzhì) means \"temperament/aura\"."
      },
      {
        "instruction": "You want to order rice. What's the word?",
        "question": "Which character means \"Mount Tai\"?",
        "options": [
          "泰山",
          "弹幕",
          "自由",
          "羽毛球"
        ],
        "correctIndex": 0,
        "explanation": "\"Mount Tai\" is written as 泰山 (Tàishān)."
      },
      {
        "instruction": "Ask for the bill.",
        "question": "How do you pronounce \"鞋子\"?",
        "options": [
          "yuē",
          "wēndài",
          "pǔtōnghuà",
          "xiézi"
        ],
        "correctIndex": 3,
        "explanation": "鞋子 is pronounced xiézi."
      },
      {
        "instruction": "Thank the waiter as you leave.",
        "question": "What does \"材\" mean?",
        "options": [
          "component of 因材施教",
          "component of 绘画",
          "to criticize",
          "component of 商店"
        ],
        "correctIndex": 0,
        "explanation": "材 () means \"component of 因材施教\"."
      }
    ]
  },
  {
    "id": "ms_2",
    "title": "First Day at a Chinese School",
    "theme": "contemporary_life",
    "description": "It's your first day as an exchange student at a Chinese high school. Introduce yourself, find your classroom, and make new friends.",
    "prereqNodeIds": [
      "rd_4e2d56fd655980b24f537cfb",
      "c_9a73",
      "w_503c5f97",
      "c_7cd5",
      "c_4f17"
    ],
    "steps": [
      {
        "instruction": "The teacher asks your name. Introduce yourself.",
        "question": "What does \"杂志\" mean?",
        "options": [
          "component of 啤酒",
          "carbon dioxide",
          "magazine",
          "rich/wealthy"
        ],
        "correctIndex": 2,
        "explanation": "杂志 (zázhì) means \"magazine\"."
      },
      {
        "instruction": "Where are you from? State your nationality.",
        "question": "Which character means \"component of 简单\"?",
        "options": [
          "谐",
          "简",
          "经",
          "饭店"
        ],
        "correctIndex": 1,
        "explanation": "\"component of 简单\" is written as 简 ()."
      },
      {
        "instruction": "The teacher introduces you to the class. Understand the introduction.",
        "question": "How do you pronounce \"片面\"?",
        "options": [
          "piànmiàn",
          "píngděng",
          "wàng",
          ""
        ],
        "correctIndex": 0,
        "explanation": "片面 is pronounced piànmiàn."
      },
      {
        "instruction": "A classmate asks what you like to do. Answer them.",
        "question": "What does \"退休\" mean?",
        "options": [
          "loss/damage",
          "City life passage",
          "to count/calculate",
          "to retire"
        ],
        "correctIndex": 3,
        "explanation": "退休 (tuìxiū) means \"to retire\"."
      },
      {
        "instruction": "Find the classroom. What does 教室 mean?",
        "question": "Which character means \"father/dad\"?",
        "options": [
          "面包",
          "爸",
          "梦",
          "远程工作"
        ],
        "correctIndex": 1,
        "explanation": "\"father/dad\" is written as 爸 (bà)."
      },
      {
        "instruction": "The schedule shows 中文课. What class is this?",
        "question": "How do you pronounce \"基尼系数\"?",
        "options": [
          "jīní xìshù",
          "jìsuànjī",
          "",
          ""
        ],
        "correctIndex": 0,
        "explanation": "基尼系数 is pronounced jīní xìshù."
      },
      {
        "instruction": "Your new friend invites you to lunch. Respond appropriately.",
        "question": "What does \"碳\" mean?",
        "options": [
          "component of 医疗保障",
          "component of 碳排放",
          "to announce/declare",
          "often/frequently"
        ],
        "correctIndex": 1,
        "explanation": "碳 () means \"component of 碳排放\"."
      },
      {
        "instruction": "At lunch, discuss your favorite food.",
        "question": "Which character means \"disaster relief\"?",
        "options": [
          "救灾",
          "锅",
          "悲观",
          "残"
        ],
        "correctIndex": 0,
        "explanation": "\"disaster relief\" is written as 救灾 (jiùzāi)."
      },
      {
        "instruction": "Exchange phone numbers with your new friend.",
        "question": "How do you pronounce \"坚持\"?",
        "options": [
          "shuìshōu",
          "wǎngqiú",
          "lái",
          "jiānchí"
        ],
        "correctIndex": 3,
        "explanation": "坚持 is pronounced jiānchí."
      },
      {
        "instruction": "Say goodbye at the end of the day.",
        "question": "What does \"安\" mean?",
        "options": [
          "to break/broken",
          "component of 杂志",
          "assign/duty",
          "safe/peaceful"
        ],
        "correctIndex": 3,
        "explanation": "安 (ān) means \"safe/peaceful\"."
      }
    ]
  },
  {
    "id": "ms_3",
    "title": "Writing a Letter to a Host Family",
    "theme": "families_communities",
    "description": "Write a letter to your Chinese host family before your exchange trip. Introduce yourself and ask about their family.",
    "prereqNodeIds": [
      "wr_63cf51995bb65ead",
      "c_7b49",
      "c_542c",
      "w_4e3e4e0053cd4e09",
      "w_73b05b9e"
    ],
    "steps": [
      {
        "instruction": "Start the letter with a proper greeting.",
        "question": "What does \"碗\" mean?",
        "options": [
          "to shrink/reduce",
          "component of 碗",
          "waiter/attendant",
          "complaint"
        ],
        "correctIndex": 1,
        "explanation": "碗 () means \"component of 碗\"."
      },
      {
        "instruction": "Introduce your name and age.",
        "question": "Which character means \"poverty alleviation\"?",
        "options": [
          "着急",
          "扶贫",
          "性",
          "投"
        ],
        "correctIndex": 1,
        "explanation": "\"poverty alleviation\" is written as 扶贫 (fúpín)."
      },
      {
        "instruction": "Describe your family members.",
        "question": "How do you pronounce \"号\"?",
        "options": [
          "fēnzǐ",
          "táo",
          "bì",
          ""
        ],
        "correctIndex": 3,
        "explanation": "号 is pronounced ."
      },
      {
        "instruction": "Talk about what you study at school.",
        "question": "What does \"锻\" mean?",
        "options": [
          "topic/question",
          "front/before",
          "component of 锻炼",
          "Seeing a doctor passage"
        ],
        "correctIndex": 2,
        "explanation": "锻 () means \"component of 锻炼\"."
      },
      {
        "instruction": "Mention your hobbies and interests.",
        "question": "Which character means \"component of 而且\"?",
        "options": [
          "而",
          "和谐",
          "送",
          "垃圾分类"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 而且\" is written as 而 ()."
      },
      {
        "instruction": "Ask about their family.",
        "question": "How do you pronounce \"滑\"?",
        "options": [
          "",
          "",
          "yùdìng",
          "fùyìn"
        ],
        "correctIndex": 0,
        "explanation": "滑 is pronounced ."
      },
      {
        "instruction": "Express excitement about the trip.",
        "question": "What does \"别具一格\" mean?",
        "options": [
          "deep/profound",
          "unique/distinctive",
          "component of 脚踏实地",
          "component of 悲剧"
        ],
        "correctIndex": 1,
        "explanation": "别具一格 (bié jù yī gé) means \"unique/distinctive\"."
      },
      {
        "instruction": "Ask about the weather in their city.",
        "question": "Which character means \"component of 因为\"?",
        "options": [
          "联",
          "艺术",
          "礼",
          "为"
        ],
        "correctIndex": 3,
        "explanation": "\"component of 因为\" is written as 为 ()."
      },
      {
        "instruction": "Ask what food they recommend.",
        "question": "How do you pronounce \"植物园\"?",
        "options": [
          "zhíwùyuán",
          "",
          "guǎn",
          ""
        ],
        "correctIndex": 0,
        "explanation": "植物园 is pronounced zhíwùyuán."
      },
      {
        "instruction": "Close the letter politely.",
        "question": "What does \"样\" mean?",
        "options": [
          "component of 辐射",
          "willing/wish",
          "clean/pure",
          "component of 文化多样性"
        ],
        "correctIndex": 3,
        "explanation": "样 () means \"component of 文化多样性\"."
      }
    ]
  },
  {
    "id": "ms_4",
    "title": "Shopping at a Chinese Market",
    "theme": "contemporary_life",
    "description": "Explore a bustling Chinese market. Bargain for souvenirs, buy fruits, and practice your numbers.",
    "prereqNodeIds": [
      "w_83dc5355",
      "w_671f5f85",
      "c_522b",
      "rd_75595b667ecf5386",
      "w_530588f9"
    ],
    "steps": [
      {
        "instruction": "A vendor calls out. What are they selling?",
        "question": "What does \"教育\" mean?",
        "options": [
          "component of 湖泊",
          "education",
          "component of 绘画",
          "to receive/bear"
        ],
        "correctIndex": 1,
        "explanation": "教育 (jiàoyù) means \"education\"."
      },
      {
        "instruction": "Ask how much something costs.",
        "question": "Which character means \"component of 卫星\"?",
        "options": [
          "把+Object+Verb",
          "记忆",
          "卫",
          "搜"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 卫星\" is written as 卫 ()."
      },
      {
        "instruction": "The vendor says a price. Understand the number.",
        "question": "How do you pronounce \"慈\"?",
        "options": [
          "fāyīn",
          "huódòng cèhuà",
          "",
          "xiě rìjì"
        ],
        "correctIndex": 2,
        "explanation": "慈 is pronounced ."
      },
      {
        "instruction": "That's too expensive! How do you say it?",
        "question": "What does \"奉\" mean?",
        "options": [
          "rich/wealthy",
          "component of 举一反三",
          "component of 奉献",
          "superficial/shallow"
        ],
        "correctIndex": 2,
        "explanation": "奉 () means \"component of 奉献\"."
      },
      {
        "instruction": "Try to bargain. Offer a lower price.",
        "question": "Which character means \"data/material\"?",
        "options": [
          "四大发明",
          "开",
          "资料",
          "阻碍"
        ],
        "correctIndex": 2,
        "explanation": "\"data/material\" is written as 资料 (zīliào)."
      },
      {
        "instruction": "You want to buy fruit. Name the fruit.",
        "question": "How do you pronounce \"著\"?",
        "options": [
          "qí",
          "",
          "xiāofángzhàn",
          "bīngxiāng"
        ],
        "correctIndex": 1,
        "explanation": "著 is pronounced ."
      },
      {
        "instruction": "Ask for a specific quantity.",
        "question": "What does \"盾\" mean?",
        "options": [
          "video conference",
          "component of 矛盾",
          "component of 敬佩",
          "China's economic development passage"
        ],
        "correctIndex": 1,
        "explanation": "盾 () means \"component of 矛盾\"."
      },
      {
        "instruction": "The vendor gives you change. Count it.",
        "question": "Which character means \"to eliminate/phase out\"?",
        "options": [
          "淘汰",
          "逃",
          "规",
          "论"
        ],
        "correctIndex": 0,
        "explanation": "\"to eliminate/phase out\" is written as 淘汰 (táotài)."
      },
      {
        "instruction": "You see something pretty. Describe it.",
        "question": "How do you pronounce \"早\"?",
        "options": [
          "guànjūn",
          "quēfá",
          "wǎngluò",
          "zǎo"
        ],
        "correctIndex": 3,
        "explanation": "早 is pronounced zǎo."
      },
      {
        "instruction": "Thank the vendor and say goodbye.",
        "question": "What does \"男孩\" mean?",
        "options": [
          "component of 补偿",
          "boy",
          "component of 激烈",
          "component of 着急"
        ],
        "correctIndex": 1,
        "explanation": "男孩 (nánhái) means \"boy\"."
      }
    ]
  },
  {
    "id": "ms_5",
    "title": "Visiting a Chinese Doctor",
    "theme": "contemporary_life",
    "description": "You're not feeling well during your stay in China. Visit a clinic and describe your symptoms.",
    "prereqNodeIds": [
      "w_540c74065fc3",
      "w_56e04e3a",
      "c_718a",
      "c_989c",
      "c_5e7c"
    ],
    "steps": [
      {
        "instruction": "Arrive at the hospital. What does 医院 mean?",
        "question": "What does \"鱼\" mean?",
        "options": [
          "physical education",
          "to ski/skiing",
          "fish",
          "to detain"
        ],
        "correctIndex": 2,
        "explanation": "鱼 (yú) means \"fish\"."
      },
      {
        "instruction": "Tell the receptionist you need to see a doctor.",
        "question": "Which character means \"component of 生命\"?",
        "options": [
          "生物",
          "析",
          "命",
          "妹"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 生命\" is written as 命 ()."
      },
      {
        "instruction": "The doctor asks what's wrong. Describe your symptom.",
        "question": "How do you pronounce \"月亮\"?",
        "options": [
          "",
          "",
          "gāozhōng",
          "yuèliang"
        ],
        "correctIndex": 3,
        "explanation": "月亮 is pronounced yuèliang."
      },
      {
        "instruction": "How long have you been sick? Express duration.",
        "question": "What does \"金\" mean?",
        "options": [
          "duty/responsibility",
          "to publish",
          "component of 奖学金",
          "fragrant/delicious"
        ],
        "correctIndex": 2,
        "explanation": "金 () means \"component of 奖学金\"."
      },
      {
        "instruction": "The doctor examines you. Understand their question about body parts.",
        "question": "Which character means \"south\"?",
        "options": [
          "翻译",
          "爬",
          "南",
          "提高"
        ],
        "correctIndex": 2,
        "explanation": "\"south\" is written as 南 (nán)."
      },
      {
        "instruction": "The doctor prescribes medicine. What does 药 mean?",
        "question": "How do you pronounce \"响\"?",
        "options": [
          "xiǎng",
          "xiāngcūn zhènxīng",
          "",
          "zài + verb"
        ],
        "correctIndex": 0,
        "explanation": "响 is pronounced xiǎng."
      },
      {
        "instruction": "Ask how many times a day to take the medicine.",
        "question": "What does \"监\" mean?",
        "options": [
          "component of 监狱",
          "component of 头痛",
          "sense of belonging",
          "street"
        ],
        "correctIndex": 0,
        "explanation": "监 () means \"component of 监狱\"."
      },
      {
        "instruction": "The doctor advises rest. Understand the advice.",
        "question": "Which character means \"international\"?",
        "options": [
          "白色",
          "圾",
          "国际",
          "午餐"
        ],
        "correctIndex": 2,
        "explanation": "\"international\" is written as 国际 (guójì)."
      },
      {
        "instruction": "Ask when you'll feel better.",
        "question": "How do you pronounce \"追求\"?",
        "options": [
          "shuō",
          "",
          "",
          "zhuīqiú"
        ],
        "correctIndex": 3,
        "explanation": "追求 is pronounced zhuīqiú."
      },
      {
        "instruction": "Thank the doctor.",
        "question": "What does \"约\" mean?",
        "options": [
          "service",
          "scholar/academic",
          "about/appointment",
          "always/straight"
        ],
        "correctIndex": 2,
        "explanation": "约 (yuē) means \"about/appointment\"."
      }
    ]
  },
  {
    "id": "ms_6",
    "title": "Taking Public Transportation",
    "theme": "contemporary_life",
    "description": "Navigate Beijing's public transportation system. Buy tickets, find your route, and arrive at your destination.",
    "prereqNodeIds": [
      "c_6069",
      "w_94887078",
      "w_624b673a",
      "w_53cd9a73",
      "c_529f"
    ],
    "steps": [
      {
        "instruction": "Find the subway station. What does 地铁站 mean?",
        "question": "What does \"司机\" mean?",
        "options": [
          "driver",
          "clean/pure",
          "component of 乐观",
          "world/era"
        ],
        "correctIndex": 0,
        "explanation": "司机 (sījī) means \"driver\"."
      },
      {
        "instruction": "Buy a ticket. How do you say you want to go to a place?",
        "question": "Which character means \"component of 信封\"?",
        "options": [
          "要",
          "封",
          "档案",
          "缺乏"
        ],
        "correctIndex": 1,
        "explanation": "\"component of 信封\" is written as 封 ()."
      },
      {
        "instruction": "Read the station name on the map.",
        "question": "How do you pronounce \"给+Sb+Verb\"?",
        "options": [
          "gěi + sb + verb",
          "",
          "nà",
          "dà shùjù"
        ],
        "correctIndex": 0,
        "explanation": "给+Sb+Verb is pronounced gěi + sb + verb."
      },
      {
        "instruction": "Which direction should you go? Understand directions.",
        "question": "What does \"朗\" mean?",
        "options": [
          "creativity",
          "government/prefecture",
          "component of 开朗",
          "text/culture"
        ],
        "correctIndex": 2,
        "explanation": "朗 () means \"component of 开朗\"."
      },
      {
        "instruction": "The announcement says the next stop. Listen and understand.",
        "question": "Which character means \"to deny\"?",
        "options": [
          "准备",
          "灵",
          "亏",
          "否认"
        ],
        "correctIndex": 3,
        "explanation": "\"to deny\" is written as 否认 (fǒurèn)."
      },
      {
        "instruction": "Ask a fellow passenger for help.",
        "question": "How do you pronounce \"冠\"?",
        "options": [
          "dànmù",
          "yuánzǐ",
          "cā",
          ""
        ],
        "correctIndex": 3,
        "explanation": "冠 is pronounced ."
      },
      {
        "instruction": "Transfer to another line. Follow the signs.",
        "question": "What does \"饭\" mean?",
        "options": [
          "component of 饭店",
          "to dare",
          "sense of mission",
          "City life passage"
        ],
        "correctIndex": 0,
        "explanation": "饭 () means \"component of 饭店\"."
      },
      {
        "instruction": "You've arrived! How do you say 'I've arrived'?",
        "question": "Which character means \"component of 农村\"?",
        "options": [
          "村",
          "世界观",
          "沟通",
          "泊"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 农村\" is written as 村 ()."
      },
      {
        "instruction": "Find the exit. What does 出口 mean?",
        "question": "How do you pronounce \"擦\"?",
        "options": [
          "gèrén jiǎnlì",
          "",
          "cā",
          ""
        ],
        "correctIndex": 2,
        "explanation": "擦 is pronounced cā."
      },
      {
        "instruction": "Ask for directions to your final destination.",
        "question": "What does \"终\" mean?",
        "options": [
          "trade/commerce",
          "restaurant/hotel",
          "component of 终于",
          "comment/review"
        ],
        "correctIndex": 2,
        "explanation": "终 () means \"component of 终于\"."
      }
    ]
  },
  {
    "id": "ms_7",
    "title": "Celebrating Chinese New Year",
    "theme": "families_communities",
    "description": "Experience Chinese New Year with your host family. Learn about traditions, food, and greetings.",
    "prereqNodeIds": [
      "c_82e6",
      "c_76d1",
      "w_6bd54e1a",
      "w_51fa7248",
      "w_9a8450b2"
    ],
    "steps": [
      {
        "instruction": "Your host says 新年好! What does this mean?",
        "question": "What does \"联系\" mean?",
        "options": [
          "Emphasis on time/place/manner",
          "component of 句子",
          "to contact/connection",
          "cold"
        ],
        "correctIndex": 2,
        "explanation": "联系 (liánxì) means \"to contact/connection\"."
      },
      {
        "instruction": "Learn about the tradition of giving red envelopes.",
        "question": "Which character means \"component of 刷卡\"?",
        "options": [
          "经济",
          "刺",
          "翻译",
          "卡"
        ],
        "correctIndex": 3,
        "explanation": "\"component of 刷卡\" is written as 卡 ()."
      },
      {
        "instruction": "Help prepare traditional foods. What is 饺子?",
        "question": "How do you pronounce \"南\"?",
        "options": [
          "bèidòng",
          "nán",
          "péicháng",
          ""
        ],
        "correctIndex": 1,
        "explanation": "南 is pronounced nán."
      },
      {
        "instruction": "The family gathers for dinner. Who is at the table?",
        "question": "What does \"诚恳\" mean?",
        "options": [
          "sincere/earnest",
          "component of 显著",
          "to come",
          "package/parcel"
        ],
        "correctIndex": 0,
        "explanation": "诚恳 (chéngkěn) means \"sincere/earnest\"."
      },
      {
        "instruction": "Watch fireworks. Describe what you see.",
        "question": "Which character means \"Olympic Games\"?",
        "options": [
          "奥运会",
          "中国茶文化",
          "骄傲",
          "向"
        ],
        "correctIndex": 0,
        "explanation": "\"Olympic Games\" is written as 奥运会 (àoyùnhuì)."
      },
      {
        "instruction": "Give a New Year blessing to the grandparents.",
        "question": "How do you pronounce \"健康饮食\"?",
        "options": [
          "ài",
          "biāozhǔn",
          "",
          "jiànkāng yǐnshí"
        ],
        "correctIndex": 3,
        "explanation": "健康饮食 is pronounced jiànkāng yǐnshí."
      },
      {
        "instruction": "Talk about your New Year's resolutions.",
        "question": "What does \"送\" mean?",
        "options": [
          "painting/drawing",
          "botanical garden",
          "to send/deliver",
          "to bend/curved"
        ],
        "correctIndex": 2,
        "explanation": "送 (sòng) means \"to send/deliver\"."
      },
      {
        "instruction": "Learn about the zodiac animal for this year.",
        "question": "Which character means \"thank you\"?",
        "options": [
          "登山",
          "谢谢",
          "终",
          "暖"
        ],
        "correctIndex": 1,
        "explanation": "\"thank you\" is written as 谢谢 (xièxie)."
      },
      {
        "instruction": "Post Spring Festival couplets. What do they say?",
        "question": "How do you pronounce \"中国美食\"?",
        "options": [
          "fāshāo",
          "xiàyǔ",
          "jīngjì shuāituì",
          "zhōngguó měishí"
        ],
        "correctIndex": 3,
        "explanation": "中国美食 is pronounced zhōngguó měishí."
      },
      {
        "instruction": "Reflect on the experience. Express your feelings.",
        "question": "What does \"而且\" mean?",
        "options": [
          "big data",
          "moreover/and also",
          "component of 缩小",
          "to send/deliver"
        ],
        "correctIndex": 1,
        "explanation": "而且 (érqiě) means \"moreover/and also\"."
      }
    ]
  },
  {
    "id": "ms_8",
    "title": "Making Friends Online",
    "theme": "science_technology",
    "description": "Join a Chinese social media platform and practice chatting with native speakers.",
    "prereqNodeIds": [
      "w_90025f53",
      "c_5b63",
      "g_dao_result",
      "c_9884",
      "c_788d"
    ],
    "steps": [
      {
        "instruction": "Create your profile. Fill in your name.",
        "question": "What does \"慕\" mean?",
        "options": [
          "component of 羡慕",
          "component of 公共汽车",
          "loss/damage",
          "if"
        ],
        "correctIndex": 0,
        "explanation": "慕 () means \"component of 羡慕\"."
      },
      {
        "instruction": "Write a short self-introduction.",
        "question": "Which character means \"component of 骄傲\"?",
        "options": [
          "认",
          "长江",
          "傲",
          "太极"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 骄傲\" is written as 傲 ()."
      },
      {
        "instruction": "Someone sends you a friend request. Accept and greet them.",
        "question": "How do you pronounce \"非\"?",
        "options": [
          "kāifàng bāoróng",
          "tōng",
          "",
          "lǐ"
        ],
        "correctIndex": 2,
        "explanation": "非 is pronounced ."
      },
      {
        "instruction": "They ask where you're from. Respond.",
        "question": "What does \"律\" mean?",
        "options": [
          "public",
          "component of 再见",
          "component of 律师",
          "riddle-like saying"
        ],
        "correctIndex": 2,
        "explanation": "律 () means \"component of 律师\"."
      },
      {
        "instruction": "Share your interests.",
        "question": "Which character means \"to build/establish\"?",
        "options": [
          "筷子",
          "街",
          "模",
          "建"
        ],
        "correctIndex": 3,
        "explanation": "\"to build/establish\" is written as 建 (jiàn)."
      },
      {
        "instruction": "They send you a photo. Comment on it.",
        "question": "How do you pronounce \"山\"?",
        "options": [
          "shān",
          "yì",
          "jīròu",
          ""
        ],
        "correctIndex": 0,
        "explanation": "山 is pronounced shān."
      },
      {
        "instruction": "Discuss your favorite music or movie.",
        "question": "What does \"字\" mean?",
        "options": [
          "digitalization",
          "Never have/do",
          "Campus life passage",
          "character/word"
        ],
        "correctIndex": 3,
        "explanation": "字 (zì) means \"character/word\"."
      },
      {
        "instruction": "Plan to video chat. Suggest a time.",
        "question": "Which character means \"component of 模糊\"?",
        "options": [
          "赖",
          "嘴",
          "犹",
          "模"
        ],
        "correctIndex": 3,
        "explanation": "\"component of 模糊\" is written as 模 ()."
      },
      {
        "instruction": "Learn internet slang. What does 哈哈 mean?",
        "question": "How do you pronounce \"和平共处\"?",
        "options": [
          "hépíng gòngchǔ",
          "yuán",
          "mèi",
          "huǒ"
        ],
        "correctIndex": 0,
        "explanation": "和平共处 is pronounced hépíng gòngchǔ."
      },
      {
        "instruction": "Say goodbye and make plans to chat again.",
        "question": "What does \"力\" mean?",
        "options": [
          "component of 偏旁",
          "power/strength",
          "To tell/make someone do",
          "component of 食堂"
        ],
        "correctIndex": 1,
        "explanation": "力 (lì) means \"power/strength\"."
      }
    ]
  },
  {
    "id": "ms_9",
    "title": "Exploring Chinese History Museum",
    "theme": "personal_public_identities",
    "description": "Visit a Chinese history museum and learn about key historical periods and cultural artifacts.",
    "prereqNodeIds": [
      "w_578465ad",
      "w_540c74065fc3",
      "c_6cf3",
      "c_9759",
      "c_521b"
    ],
    "steps": [
      {
        "instruction": "Buy tickets at the entrance. How much are they?",
        "question": "What does \"部\" mean?",
        "options": [
          "poor/poverty",
          "component of 部首",
          "A is more... than B",
          "Forbidden City"
        ],
        "correctIndex": 1,
        "explanation": "部 () means \"component of 部首\"."
      },
      {
        "instruction": "Read the museum map. Find the ancient history section.",
        "question": "Which character means \"component of 录取\"?",
        "options": [
          "邮票",
          "取",
          "发达国家",
          "口"
        ],
        "correctIndex": 1,
        "explanation": "\"component of 录取\" is written as 取 ()."
      },
      {
        "instruction": "Learn about the Great Wall. What is it called in Chinese?",
        "question": "How do you pronounce \"婴\"?",
        "options": [
          "gē",
          "liàng",
          "",
          ""
        ],
        "correctIndex": 2,
        "explanation": "婴 is pronounced ."
      },
      {
        "instruction": "See ancient Chinese writing. What are these characters?",
        "question": "What does \"格\" mean?",
        "options": [
          "standard/grid",
          "public",
          "to express/indicate",
          "component of 配送"
        ],
        "correctIndex": 0,
        "explanation": "格 (gé) means \"standard/grid\"."
      },
      {
        "instruction": "Learn about a famous Chinese invention.",
        "question": "Which character means \"Writing: letter to a teacher\"?",
        "options": [
          "写信:给老师",
          "医",
          "茶",
          "习惯"
        ],
        "correctIndex": 0,
        "explanation": "\"Writing: letter to a teacher\" is written as 写信:给老师 (xiě xìn: gěi lǎoshī)."
      },
      {
        "instruction": "Read a description of a dynasty.",
        "question": "How do you pronounce \"对+Sb+Verb\"?",
        "options": [
          "liú",
          "",
          "xuézhě",
          "duì + sb + verb"
        ],
        "correctIndex": 3,
        "explanation": "对+Sb+Verb is pronounced duì + sb + verb."
      },
      {
        "instruction": "See traditional Chinese art. Describe a painting.",
        "question": "What does \"我\" mean?",
        "options": [
          "I/me",
          "component of 空调",
          "extracurricular activity",
          "loud/echo"
        ],
        "correctIndex": 0,
        "explanation": "我 (wǒ) means \"I/me\"."
      },
      {
        "instruction": "Learn about Chinese philosophy. Who was Confucius?",
        "question": "Which character means \"small/little\"?",
        "options": [
          "地铁",
          "宿舍",
          "旅行攻略",
          "小"
        ],
        "correctIndex": 3,
        "explanation": "\"small/little\" is written as 小 (xiǎo)."
      },
      {
        "instruction": "Visit the gift shop. Buy a souvenir.",
        "question": "How do you pronounce \"烧\"?",
        "options": [
          "",
          "",
          "",
          "xūjiǎ"
        ],
        "correctIndex": 0,
        "explanation": "烧 is pronounced ."
      },
      {
        "instruction": "Write a postcard about your visit.",
        "question": "What does \"牛\" mean?",
        "options": [
          "component of 律师",
          "seeing is believing",
          "component of 仪式",
          "component of 牛肉"
        ],
        "correctIndex": 3,
        "explanation": "牛 () means \"component of 牛肉\"."
      }
    ]
  },
  {
    "id": "ms_10",
    "title": "Preparing for an AP Chinese Exam",
    "theme": "contemporary_life",
    "description": "Practice exam-style tasks: reading comprehension, listening prompts, and structured writing.",
    "prereqNodeIds": [
      "w_7a0e6536",
      "w_59296c14",
      "c_632f",
      "w_90008d27",
      "g_zhiyou_cai"
    ],
    "steps": [
      {
        "instruction": "Read a passage and identify the main topic.",
        "question": "What does \"普\" mean?",
        "options": [
          "work/job",
          "universal/general",
          "year",
          "road/path"
        ],
        "correctIndex": 1,
        "explanation": "普 (pǔ) means \"universal/general\"."
      },
      {
        "instruction": "Answer a vocabulary question from the passage.",
        "question": "Which character means \"worldview\"?",
        "options": [
          "币",
          "世界观",
          "考试",
          "旅游"
        ],
        "correctIndex": 1,
        "explanation": "\"worldview\" is written as 世界观 (shìjièguān)."
      },
      {
        "instruction": "Identify the author's purpose.",
        "question": "How do you pronounce \"黄色\"?",
        "options": [
          "huángsè",
          "hòuxuǎnrén",
          "càidān",
          "shǒu"
        ],
        "correctIndex": 0,
        "explanation": "黄色 is pronounced huángsè."
      },
      {
        "instruction": "Answer a detail question.",
        "question": "What does \"法律\" mean?",
        "options": [
          "dark/dim",
          "flood",
          "law",
          "to answer"
        ],
        "correctIndex": 2,
        "explanation": "法律 (fǎlǜ) means \"law\"."
      },
      {
        "instruction": "Understand a cultural reference in the text.",
        "question": "Which character means \"lunch\"?",
        "options": [
          "学校",
          "号",
          "学者",
          "午餐"
        ],
        "correctIndex": 3,
        "explanation": "\"lunch\" is written as 午餐 (wǔcān)."
      },
      {
        "instruction": "Practice a presentational writing prompt.",
        "question": "How do you pronounce \"泳\"?",
        "options": [
          "",
          "zhuīqiú",
          "cóngróng",
          "yǒng"
        ],
        "correctIndex": 3,
        "explanation": "泳 is pronounced yǒng."
      },
      {
        "instruction": "Respond to an interpersonal reading.",
        "question": "What does \"数学\" mean?",
        "options": [
          "Self-introduction passage",
          "table/express",
          "mathematics",
          "component of 记者"
        ],
        "correctIndex": 2,
        "explanation": "数学 (shùxué) means \"mathematics\"."
      },
      {
        "instruction": "Identify the correct grammar structure.",
        "question": "Which character means \"scenery/landscape\"?",
        "options": [
          "风景",
          "爸爸",
          "共享经济",
          "刺激"
        ],
        "correctIndex": 0,
        "explanation": "\"scenery/landscape\" is written as 风景 (fēngjǐng)."
      },
      {
        "instruction": "Complete a listening comprehension question.",
        "question": "How do you pronounce \"汉字\"?",
        "options": [
          "",
          "chuàngzàolì",
          "bié jù yī gé",
          "hànzì"
        ],
        "correctIndex": 3,
        "explanation": "汉字 is pronounced hànzì."
      },
      {
        "instruction": "Review and self-assess your performance.",
        "question": "What does \"干\" mean?",
        "options": [
          "text/culture",
          "dry/do/clean",
          "program/procedure",
          "healthcare security"
        ],
        "correctIndex": 1,
        "explanation": "干 (gān) means \"dry/do/clean\"."
      }
    ]
  },
  {
    "id": "ms_11",
    "title": "Cooking Chinese Food Together",
    "theme": "families_communities",
    "description": "Learn to cook a Chinese dish with your host mother. Follow a recipe and practice food vocabulary.",
    "prereqNodeIds": [
      "w_59169762",
      "c_5927",
      "rd_827a672f6b238d4f",
      "c_6696",
      "c_8df5"
    ],
    "steps": [
      {
        "instruction": "Read the recipe title. What dish are you making?",
        "question": "What does \"逐\" mean?",
        "options": [
          "component of 逐渐",
          "component of 阳台",
          "component of 军人",
          "star"
        ],
        "correctIndex": 0,
        "explanation": "逐 () means \"component of 逐渐\"."
      },
      {
        "instruction": "Identify the ingredients. What does 鸡蛋 mean?",
        "question": "Which character means \"to finish/complete\"?",
        "options": [
          "湖泊",
          "完",
          "亚军",
          "文章"
        ],
        "correctIndex": 1,
        "explanation": "\"to finish/complete\" is written as 完 (wán)."
      },
      {
        "instruction": "Measure the ingredients. Understand quantity words.",
        "question": "How do you pronounce \"损\"?",
        "options": [
          "qiān hétong",
          "",
          "",
          ""
        ],
        "correctIndex": 1,
        "explanation": "损 is pronounced ."
      },
      {
        "instruction": "The recipe says to wash the vegetables. What verb is used?",
        "question": "What does \"放弃\" mean?",
        "options": [
          "component of 表达",
          "to give up/abandon",
          "component of 汉字",
          "classmate"
        ],
        "correctIndex": 1,
        "explanation": "放弃 (fàngqì) means \"to give up/abandon\"."
      },
      {
        "instruction": "Cut the ingredients. What does 切 mean?",
        "question": "Which character means \"dark/dim\"?",
        "options": [
          "暗",
          "保修",
          "通勤",
          "太阳能"
        ],
        "correctIndex": 0,
        "explanation": "\"dark/dim\" is written as 暗 (àn)."
      },
      {
        "instruction": "Heat the oil. Understand the cooking instruction.",
        "question": "How do you pronounce \"幸福指数\"?",
        "options": [
          "tuī chén chū xīn",
          "adj + duō le",
          "zhī",
          "xìngfú zhǐshù"
        ],
        "correctIndex": 3,
        "explanation": "幸福指数 is pronounced xìngfú zhǐshù."
      },
      {
        "instruction": "Add the seasoning. What is 盐?",
        "question": "What does \"节\" mean?",
        "options": [
          "component of 拥堵",
          "rich/abundant",
          "breakfast",
          "festival/segment"
        ],
        "correctIndex": 3,
        "explanation": "节 (jié) means \"festival/segment\"."
      },
      {
        "instruction": "Stir-fry the dish. How long should you cook it?",
        "question": "Which character means \"component of 但是\"?",
        "options": [
          "捡",
          "务",
          "但",
          "合作"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 但是\" is written as 但 ()."
      },
      {
        "instruction": "Taste the food and give your opinion.",
        "question": "How do you pronounce \"农民\"?",
        "options": [
          "yǔ shí jù jìn",
          "",
          "nóngmín",
          "fāyīn"
        ],
        "correctIndex": 2,
        "explanation": "农民 is pronounced nóngmín."
      },
      {
        "instruction": "The dish is ready! Compliment the cook.",
        "question": "What does \"通货膨胀\" mean?",
        "options": [
          "inflation",
          "package/parcel",
          "chopsticks",
          "text message"
        ],
        "correctIndex": 0,
        "explanation": "通货膨胀 (tōnghuò péngzhàng) means \"inflation\"."
      }
    ]
  },
  {
    "id": "ms_12",
    "title": "Hiking in the Chinese Mountains",
    "theme": "global_challenges",
    "description": "Go hiking in a scenic Chinese mountain area. Learn nature vocabulary and discuss environmental topics.",
    "prereqNodeIds": [
      "c_60dc",
      "w_8d5e6210",
      "c_94fe",
      "c_987e",
      "c_7272"
    ],
    "steps": [
      {
        "instruction": "Read the trail sign. What mountain is this?",
        "question": "What does \"陶\" mean?",
        "options": [
          "component of 赔偿",
          "component of 碳排放",
          "component of 陶艺",
          "to contact/connection"
        ],
        "correctIndex": 2,
        "explanation": "陶 () means \"component of 陶艺\"."
      },
      {
        "instruction": "Check the weather forecast. What does it say?",
        "question": "Which character means \"component of 后悔\"?",
        "options": [
          "凉",
          "端午节",
          "悔",
          "古迹"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 后悔\" is written as 悔 ()."
      },
      {
        "instruction": "Identify the trees along the path.",
        "question": "How do you pronounce \"外交\"?",
        "options": [
          "",
          "wàijiāo",
          "",
          ""
        ],
        "correctIndex": 1,
        "explanation": "外交 is pronounced wàijiāo."
      },
      {
        "instruction": "You see a river. Describe it.",
        "question": "What does \"赦免\" mean?",
        "options": [
          "to retire",
          "pure/simple",
          "component of 风俗",
          "to pardon"
        ],
        "correctIndex": 3,
        "explanation": "赦免 (shèmiǎn) means \"to pardon\"."
      },
      {
        "instruction": "A sign warns about the trail. Understand the warning.",
        "question": "Which character means \"to look/see/read\"?",
        "options": [
          "主观",
          "前",
          "狭",
          "看"
        ],
        "correctIndex": 3,
        "explanation": "\"to look/see/read\" is written as 看 (kàn)."
      },
      {
        "instruction": "Take a photo of the scenery. Describe what you see.",
        "question": "How do you pronounce \"刻\"?",
        "options": [
          "hépíng gòngchǔ",
          "shíyàn",
          "",
          "pǎobù"
        ],
        "correctIndex": 2,
        "explanation": "刻 is pronounced ."
      },
      {
        "instruction": "Meet another hiker. Start a conversation.",
        "question": "What does \"才\" mean?",
        "options": [
          "component of 天才",
          "genius",
          "tomorrow",
          "healthy/health"
        ],
        "correctIndex": 0,
        "explanation": "才 () means \"component of 天才\"."
      },
      {
        "instruction": "Discuss environmental protection.",
        "question": "Which character means \"component of 弹幕\"?",
        "options": [
          "Verb+着",
          "百",
          "体",
          "幕"
        ],
        "correctIndex": 3,
        "explanation": "\"component of 弹幕\" is written as 幕 ()."
      },
      {
        "instruction": "Read about an endangered species at the information board.",
        "question": "How do you pronounce \"心\"?",
        "options": [
          "zhǎi",
          "",
          "yuànwàng",
          "qiān hétong"
        ],
        "correctIndex": 1,
        "explanation": "心 is pronounced ."
      },
      {
        "instruction": "Reach the summit! Express your feelings.",
        "question": "What does \"生活方式\" mean?",
        "options": [
          "component of 值得",
          "mutually/each other",
          "component of 债务",
          "lifestyle"
        ],
        "correctIndex": 3,
        "explanation": "生活方式 (shēnghuó fāngshì) means \"lifestyle\"."
      }
    ]
  },
  {
    "id": "ms_13",
    "title": "Attending a Chinese Wedding",
    "theme": "families_communities",
    "description": "You've been invited to a traditional Chinese wedding. Learn customs, give blessings, and celebrate.",
    "prereqNodeIds": [
      "w_8bc14ef6",
      "c_7720",
      "w_843d540e",
      "c_5df2",
      "w_4e9276f8"
    ],
    "steps": [
      {
        "instruction": "Read the wedding invitation. When is the wedding?",
        "question": "What does \"邻居\" mean?",
        "options": [
          "component of 保险",
          "he/him",
          "neighbor",
          "pencil"
        ],
        "correctIndex": 2,
        "explanation": "邻居 (línjū) means \"neighbor\"."
      },
      {
        "instruction": "Buy a gift. What's appropriate?",
        "question": "Which character means \"contain/face\"?",
        "options": [
          "容",
          "怀念",
          "和平",
          "结果"
        ],
        "correctIndex": 0,
        "explanation": "\"contain/face\" is written as 容 (róng)."
      },
      {
        "instruction": "Arrive and greet the couple. Give a blessing.",
        "question": "How do you pronounce \"压力\"?",
        "options": [
          "yālì",
          "fǎ",
          "zǎo",
          "nàixīn"
        ],
        "correctIndex": 0,
        "explanation": "压力 is pronounced yālì."
      },
      {
        "instruction": "Learn about the tea ceremony tradition.",
        "question": "What does \"幼稚\" mean?",
        "options": [
          "childish/naive",
          "proof/certificate",
          "Negation of past action",
          "component of 风俗"
        ],
        "correctIndex": 0,
        "explanation": "幼稚 (yòuzhì) means \"childish/naive\"."
      },
      {
        "instruction": "At the banquet, identify the dishes on the table.",
        "question": "Which character means \"nuclear energy\"?",
        "options": [
          "共享单车",
          "东",
          "核能",
          "心情"
        ],
        "correctIndex": 2,
        "explanation": "\"nuclear energy\" is written as 核能 (hénéng)."
      },
      {
        "instruction": "Toast the couple. What do you say?",
        "question": "How do you pronounce \"邀请函\"?",
        "options": [
          "verb + de + complement",
          "yī",
          "yāoqǐng hán",
          "hànzì"
        ],
        "correctIndex": 2,
        "explanation": "邀请函 is pronounced yāoqǐng hán."
      },
      {
        "instruction": "Chat with other guests. Introduce yourself.",
        "question": "What does \"漂\" mean?",
        "options": [
          "dialect",
          "component of 漂亮",
          "component of 民主",
          "to sign (agreement)"
        ],
        "correctIndex": 1,
        "explanation": "漂 () means \"component of 漂亮\"."
      },
      {
        "instruction": "Learn about the meaning of red at weddings.",
        "question": "Which character means \"unemployment\"?",
        "options": [
          "面对",
          "赋",
          "失业",
          "惜"
        ],
        "correctIndex": 2,
        "explanation": "\"unemployment\" is written as 失业 (shīyè)."
      },
      {
        "instruction": "Watch a performance. Describe it.",
        "question": "How do you pronounce \"智\"?",
        "options": [
          "verb + wán",
          "",
          "shuǐguǒ",
          "cháng"
        ],
        "correctIndex": 1,
        "explanation": "智 is pronounced ."
      },
      {
        "instruction": "Say goodbye and wish the couple well.",
        "question": "What does \"饮\" mean?",
        "options": [
          "precise/accurate",
          "component of 饮料",
          "to assess/examine",
          "component of 介绍"
        ],
        "correctIndex": 1,
        "explanation": "饮 () means \"component of 饮料\"."
      }
    ]
  },
  {
    "id": "ms_14",
    "title": "Job Interview in Chinese",
    "theme": "contemporary_life",
    "description": "Prepare for and attend a mock job interview in Chinese. Practice professional language and etiquette.",
    "prereqNodeIds": [
      "w_65877269",
      "w_5de57a0b5e08",
      "c_8d27",
      "w_4e135bb6",
      "c_6c7d"
    ],
    "steps": [
      {
        "instruction": "Read the job posting. What position is it for?",
        "question": "What does \"合理\" mean?",
        "options": [
          "reasonable/rational",
          "component of 营养",
          "component of 原谅",
          "component of 改革"
        ],
        "correctIndex": 0,
        "explanation": "合理 (hélǐ) means \"reasonable/rational\"."
      },
      {
        "instruction": "Prepare your resume. How do you say 'work experience'?",
        "question": "Which character means \"healthy/health\"?",
        "options": [
          "慕",
          "早餐",
          "健康",
          "少"
        ],
        "correctIndex": 2,
        "explanation": "\"healthy/health\" is written as 健康 (jiànkāng)."
      },
      {
        "instruction": "Greet the interviewer formally.",
        "question": "How do you pronounce \"退\"?",
        "options": [
          "",
          "jiǎnsù",
          "wéiqí",
          "jiāxiāng jièshào"
        ],
        "correctIndex": 0,
        "explanation": "退 is pronounced ."
      },
      {
        "instruction": "The interviewer asks about your education. Respond.",
        "question": "What does \"幸福感\" mean?",
        "options": [
          "sense of happiness",
          "component of 逮捕",
          "China's economic development passage",
          "condition/terms"
        ],
        "correctIndex": 0,
        "explanation": "幸福感 (xìngfúgǎn) means \"sense of happiness\"."
      },
      {
        "instruction": "Describe your skills and strengths.",
        "question": "Which character means \"to swipe a card\"?",
        "options": [
          "刷卡",
          "创业",
          "再+Verb",
          "磁"
        ],
        "correctIndex": 0,
        "explanation": "\"to swipe a card\" is written as 刷卡 (shuākǎ)."
      },
      {
        "instruction": "Explain why you want this job.",
        "question": "How do you pronounce \"训\"?",
        "options": [
          "jī",
          "lǐwù",
          "",
          "shēngdiào"
        ],
        "correctIndex": 2,
        "explanation": "训 is pronounced ."
      },
      {
        "instruction": "The interviewer asks about your weaknesses. Respond diplomatically.",
        "question": "What does \"完善\" mean?",
        "options": [
          "component of 渴望",
          "to perfect/improve",
          "bike sharing",
          "drought"
        ],
        "correctIndex": 1,
        "explanation": "完善 (wánshàn) means \"to perfect/improve\"."
      },
      {
        "instruction": "Ask about the work schedule.",
        "question": "Which character means \"refrigerator\"?",
        "options": [
          "冰箱",
          "梦想",
          "消防站",
          "菜单"
        ],
        "correctIndex": 0,
        "explanation": "\"refrigerator\" is written as 冰箱 (bīngxiāng)."
      },
      {
        "instruction": "Discuss salary expectations.",
        "question": "How do you pronounce \"领\"?",
        "options": [
          "tuánjié hézuò",
          "",
          "lǐng",
          ""
        ],
        "correctIndex": 2,
        "explanation": "领 is pronounced lǐng."
      },
      {
        "instruction": "Thank the interviewer and follow up.",
        "question": "What does \"湿\" mean?",
        "options": [
          "frequency",
          "nervous/tense",
          "wet/damp",
          "cold (illness)"
        ],
        "correctIndex": 2,
        "explanation": "湿 (shī) means \"wet/damp\"."
      }
    ]
  },
  {
    "id": "ms_15",
    "title": "Discussing Chinese Art and Literature",
    "theme": "beauty_aesthetics",
    "description": "Visit an art gallery and discuss Chinese calligraphy, painting, and poetry with a local artist.",
    "prereqNodeIds": [
      "c_6070",
      "c_504f",
      "w_559c5267",
      "c_5bfc",
      "c_753b"
    ],
    "steps": [
      {
        "instruction": "Enter the gallery. Read the exhibition title.",
        "question": "What does \"风俗\" mean?",
        "options": [
          "custom/tradition",
          "Besides/except for...",
          "day/sun",
          "component of 绿色"
        ],
        "correctIndex": 0,
        "explanation": "风俗 (fēngsú) means \"custom/tradition\"."
      },
      {
        "instruction": "See a Chinese calligraphy piece. What style is it?",
        "question": "Which character means \"to unite/connect\"?",
        "options": [
          "课",
          "联",
          "睡",
          "物联网"
        ],
        "correctIndex": 1,
        "explanation": "\"to unite/connect\" is written as 联 (lián)."
      },
      {
        "instruction": "The artist explains the meaning of a painting.",
        "question": "How do you pronounce \"理性\"?",
        "options": [
          "",
          "xiàoguǒ",
          "huábīng",
          "lǐxìng"
        ],
        "correctIndex": 3,
        "explanation": "理性 is pronounced lǐxìng."
      },
      {
        "instruction": "Learn about the Four Treasures of the Study.",
        "question": "What does \"封\" mean?",
        "options": [
          "component of 职业",
          "component of 信封",
          "component of 故事",
          "fire"
        ],
        "correctIndex": 1,
        "explanation": "封 () means \"component of 信封\"."
      },
      {
        "instruction": "Read a famous Chinese poem.",
        "question": "Which character means \"to inherit/pass down\"?",
        "options": [
          "家人",
          "泰",
          "判",
          "传承"
        ],
        "correctIndex": 3,
        "explanation": "\"to inherit/pass down\" is written as 传承 (chuánchéng)."
      },
      {
        "instruction": "Discuss the relationship between calligraphy and painting.",
        "question": "How do you pronounce \"已\"?",
        "options": [
          "",
          "lǐpéi",
          "",
          "Chángchéng"
        ],
        "correctIndex": 0,
        "explanation": "已 is pronounced ."
      },
      {
        "instruction": "Try writing a character with a brush. Describe the experience.",
        "question": "What does \"改\" mean?",
        "options": [
          "component of 改革",
          "Study methods passage",
          "rough/violent",
          "to guide/instruct"
        ],
        "correctIndex": 0,
        "explanation": "改 () means \"component of 改革\"."
      },
      {
        "instruction": "Compare Chinese and Western art styles.",
        "question": "Which character means \"bike sharing\"?",
        "options": [
          "共享单车",
          "写故事",
          "啡",
          "赔偿"
        ],
        "correctIndex": 0,
        "explanation": "\"bike sharing\" is written as 共享单车 (gòngxiǎng dānchē)."
      },
      {
        "instruction": "Express your appreciation for the artwork.",
        "question": "How do you pronounce \"灵活\"?",
        "options": [
          "yuàn",
          "",
          "dǎ",
          "línghuó"
        ],
        "correctIndex": 3,
        "explanation": "灵活 is pronounced línghuó."
      },
      {
        "instruction": "Buy an art print and ask about the artist.",
        "question": "What does \"兵\" mean?",
        "options": [
          "component of 崇拜",
          "component of 兵马俑",
          "tone (of Chinese)",
          "to practice/study"
        ],
        "correctIndex": 1,
        "explanation": "兵 () means \"component of 兵马俑\"."
      }
    ]
  },
  {
    "id": "ms_16",
    "title": "Environmental Awareness Campaign",
    "theme": "global_challenges",
    "description": "Participate in a school environmental awareness campaign. Learn about pollution, recycling, and conservation.",
    "prereqNodeIds": [
      "c_6bd4",
      "c_534a",
      "c_5267",
      "w_62c55fc3",
      "w_5c0f5b66"
    ],
    "steps": [
      {
        "instruction": "Read the campaign poster. What's the theme?",
        "question": "What does \"欢\" mean?",
        "options": [
          "audience/spectator",
          "joyful/happy",
          "component of 粗暴",
          "to chat"
        ],
        "correctIndex": 1,
        "explanation": "欢 (huān) means \"joyful/happy\"."
      },
      {
        "instruction": "Learn the word for 'environment' in Chinese.",
        "question": "Which character means \"company/manage\"?",
        "options": [
          "旅行攻略",
          "司",
          "司机",
          "文静"
        ],
        "correctIndex": 1,
        "explanation": "\"company/manage\" is written as 司 (sī)."
      },
      {
        "instruction": "Discuss water pollution. What does 污染 mean?",
        "question": "How do you pronounce \"慈善\"?",
        "options": [
          "",
          "xiázhǎi",
          "míng",
          "císhàn"
        ],
        "correctIndex": 3,
        "explanation": "慈善 is pronounced císhàn."
      },
      {
        "instruction": "Learn about recycling practices in China.",
        "question": "What does \"音乐课\" mean?",
        "options": [
          "music class",
          "principle",
          "component of 研究",
          "monsoon"
        ],
        "correctIndex": 0,
        "explanation": "音乐课 (yīnyuèkè) means \"music class\"."
      },
      {
        "instruction": "Create a slogan for the campaign.",
        "question": "Which character means \"component of 洪水\"?",
        "options": [
          "待",
          "缺乏",
          "续",
          "洪"
        ],
        "correctIndex": 3,
        "explanation": "\"component of 洪水\" is written as 洪 ()."
      },
      {
        "instruction": "Present statistics about air quality.",
        "question": "How do you pronounce \"上诉\"?",
        "options": [
          "shàngsù",
          "",
          "",
          "zhǎo"
        ],
        "correctIndex": 0,
        "explanation": "上诉 is pronounced shàngsù."
      },
      {
        "instruction": "Discuss solutions to environmental problems.",
        "question": "What does \"功夫\" mean?",
        "options": [
          "quality of life",
          "but/however",
          "to believe",
          "kung fu/skill"
        ],
        "correctIndex": 3,
        "explanation": "功夫 (gōngfu) means \"kung fu/skill\"."
      },
      {
        "instruction": "Learn about renewable energy in China.",
        "question": "Which character means \"component of 京剧\"?",
        "options": [
          "生日",
          "关系",
          "剧",
          "后悔"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 京剧\" is written as 剧 ()."
      },
      {
        "instruction": "Write a pledge to protect the environment.",
        "question": "How do you pronounce \"上传\"?",
        "options": [
          "shàngchuán",
          "",
          "fěnsè",
          ""
        ],
        "correctIndex": 0,
        "explanation": "上传 is pronounced shàngchuán."
      },
      {
        "instruction": "Reflect on what you've learned.",
        "question": "What does \"沟通\" mean?",
        "options": [
          "referee/judge",
          "government",
          "component of 推陈出新",
          "to communicate"
        ],
        "correctIndex": 3,
        "explanation": "沟通 (gōutōng) means \"to communicate\"."
      }
    ]
  },
  {
    "id": "ms_17",
    "title": "Chinese Music and Dance Performance",
    "theme": "beauty_aesthetics",
    "description": "Attend a traditional Chinese music and dance performance. Learn about instruments and dance forms.",
    "prereqNodeIds": [
      "c_804c",
      "w_624b5957",
      "w_542c4f17",
      "w_51cf5c11",
      "c_6e34"
    ],
    "steps": [
      {
        "instruction": "Read the performance program. What's showing tonight?",
        "question": "What does \"柔\" mean?",
        "options": [
          "component of 签署",
          "component of 无聊",
          "poor/poverty",
          "component of 温柔"
        ],
        "correctIndex": 3,
        "explanation": "柔 () means \"component of 温柔\"."
      },
      {
        "instruction": "Identify a traditional Chinese instrument.",
        "question": "Which character means \"component of 铅笔\"?",
        "options": [
          "残忍",
          "方言",
          "铅",
          "摄"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 铅笔\" is written as 铅 ()."
      },
      {
        "instruction": "The performer plays a famous piece. What is it about?",
        "question": "How do you pronounce \"老师\"?",
        "options": [
          "lǎoshī",
          "xiǎng",
          "hétong",
          ""
        ],
        "correctIndex": 0,
        "explanation": "老师 is pronounced lǎoshī."
      },
      {
        "instruction": "Learn about the guzheng. What kind of instrument is it?",
        "question": "What does \"厨\" mean?",
        "options": [
          "component of 厨房",
          "component of 干旱",
          "happy/to like",
          "plan"
        ],
        "correctIndex": 0,
        "explanation": "厨 () means \"component of 厨房\"."
      },
      {
        "instruction": "Watch a traditional dance. Describe the movements.",
        "question": "Which character means \"hat/cap\"?",
        "options": [
          "断",
          "搜索",
          "件",
          "帽子"
        ],
        "correctIndex": 3,
        "explanation": "\"hat/cap\" is written as 帽子 (màozi)."
      },
      {
        "instruction": "The dancer wears a beautiful costume. Describe it.",
        "question": "How do you pronounce \"泼\"?",
        "options": [
          "sùsòng",
          "",
          "zhǔnbèi",
          ""
        ],
        "correctIndex": 1,
        "explanation": "泼 is pronounced ."
      },
      {
        "instruction": "Learn about the meaning behind the dance.",
        "question": "What does \"矛盾\" mean?",
        "options": [
          "Writing: suggestion letter",
          "contradiction/conflict",
          "satellite",
          "to start a business"
        ],
        "correctIndex": 1,
        "explanation": "矛盾 (máodùn) means \"contradiction/conflict\"."
      },
      {
        "instruction": "Compare traditional and modern Chinese music.",
        "question": "Which character means \"flustered/panic\"?",
        "options": [
          "探",
          "怀念",
          "慌",
          "舞"
        ],
        "correctIndex": 2,
        "explanation": "\"flustered/panic\" is written as 慌 (huāng)."
      },
      {
        "instruction": "Express your feelings about the performance.",
        "question": "How do you pronounce \"所以\"?",
        "options": [
          "suǒyǐ",
          "",
          "xùnsù",
          ""
        ],
        "correctIndex": 0,
        "explanation": "所以 is pronounced suǒyǐ."
      },
      {
        "instruction": "Write a review of the show.",
        "question": "What does \"风力发电\" mean?",
        "options": [
          "microwave oven",
          "although/even though",
          "wind power",
          "air conditioning"
        ],
        "correctIndex": 2,
        "explanation": "风力发电 (fēnglì fādiàn) means \"wind power\"."
      }
    ]
  },
  {
    "id": "ms_18",
    "title": "Planning a Trip to Xi'an",
    "theme": "contemporary_life",
    "description": "Plan a trip to Xi'an to see the Terracotta Warriors. Book transportation, find accommodation, and create an itinerary.",
    "prereqNodeIds": [
      "w_590f5929",
      "w_793c7269",
      "c_8bf7",
      "w_90574ea7",
      "w_8d234efb"
    ],
    "steps": [
      {
        "instruction": "Research Xi'an. What is it famous for?",
        "question": "What does \"往\" mean?",
        "options": [
          "to exceed/the more",
          "component of 挑战",
          "component of 遗产",
          "component of 向往"
        ],
        "correctIndex": 3,
        "explanation": "往 () means \"component of 向往\"."
      },
      {
        "instruction": "Book a train ticket. How do you ask for one?",
        "question": "Which character means \"component of 安排\"?",
        "options": [
          "法律",
          "密",
          "幸",
          "排"
        ],
        "correctIndex": 3,
        "explanation": "\"component of 安排\" is written as 排 ()."
      },
      {
        "instruction": "Find a hotel. Understand the room description.",
        "question": "How do you pronounce \"生日\"?",
        "options": [
          "A de B",
          "",
          "shēngrì",
          "túshūguǎn"
        ],
        "correctIndex": 2,
        "explanation": "生日 is pronounced shēngrì."
      },
      {
        "instruction": "Create a day-by-day itinerary.",
        "question": "What does \"调\" mean?",
        "options": [
          "component of 空调",
          "visa",
          "pen/writing tool",
          "to change/transform"
        ],
        "correctIndex": 0,
        "explanation": "调 () means \"component of 空调\"."
      },
      {
        "instruction": "Arrive in Xi'an. Ask for directions to the hotel.",
        "question": "Which character means \"profound/deep\"?",
        "options": [
          "境",
          "预算",
          "深刻",
          "问"
        ],
        "correctIndex": 2,
        "explanation": "\"profound/deep\" is written as 深刻 (shēnkè)."
      },
      {
        "instruction": "Visit the Terracotta Warriors. Buy an entrance ticket.",
        "question": "How do you pronounce \"场\"?",
        "options": [
          "shēngdiào",
          "yuànwàng",
          "",
          "wèidao"
        ],
        "correctIndex": 2,
        "explanation": "场 is pronounced ."
      },
      {
        "instruction": "Read the information about the warriors.",
        "question": "What does \"养\" mean?",
        "options": [
          "component of 营养",
          "bad/broken",
          "to go",
          "name"
        ],
        "correctIndex": 0,
        "explanation": "养 () means \"component of 营养\"."
      },
      {
        "instruction": "Try local Xi'an food. What is 肉夹馍?",
        "question": "Which character means \"component of 魅力\"?",
        "options": [
          "启发",
          "养老问题",
          "魅",
          "文化"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 魅力\" is written as 魅 ()."
      },
      {
        "instruction": "Visit the city wall. Describe the view.",
        "question": "How do you pronounce \"绘\"?",
        "options": [
          "",
          "huì + verb",
          "qíshí",
          ""
        ],
        "correctIndex": 0,
        "explanation": "绘 is pronounced ."
      },
      {
        "instruction": "Share your trip highlights with a friend.",
        "question": "What does \"电话\" mean?",
        "options": [
          "coach/trainer",
          "telephone",
          "nervous/tense",
          "price/value"
        ],
        "correctIndex": 1,
        "explanation": "电话 (diànhuà) means \"telephone\"."
      }
    ]
  },
  {
    "id": "ms_19",
    "title": "Chinese Tea Ceremony",
    "theme": "beauty_aesthetics",
    "description": "Participate in a traditional Chinese tea ceremony. Learn about tea culture, types of tea, and proper etiquette.",
    "prereqNodeIds": [
      "c_5ba4",
      "w_8bb08005",
      "c_6298",
      "c_6599",
      "w_65875316591a68376027"
    ],
    "steps": [
      {
        "instruction": "Your host welcomes you to the tea house. Respond.",
        "question": "What does \"大使馆\" mean?",
        "options": [
          "singer",
          "embassy",
          "waiter/attendant",
          "to worry"
        ],
        "correctIndex": 1,
        "explanation": "大使馆 (dàshǐguǎn) means \"embassy\"."
      },
      {
        "instruction": "Learn about different types of Chinese tea.",
        "question": "Which character means \"to expand/enlarge\"?",
        "options": [
          "舍",
          "已经+Verb+了",
          "减速",
          "扩大"
        ],
        "correctIndex": 3,
        "explanation": "\"to expand/enlarge\" is written as 扩大 (kuòdà)."
      },
      {
        "instruction": "The host offers you 绿茶. What kind of tea is this?",
        "question": "How do you pronounce \"开\"?",
        "options": [
          "kuài",
          "zhàn",
          "kāi",
          ""
        ],
        "correctIndex": 2,
        "explanation": "开 is pronounced kāi."
      },
      {
        "instruction": "Observe the tea preparation. Describe the steps.",
        "question": "What does \"文\" mean?",
        "options": [
          "to yearn for",
          "to practice",
          "text/culture",
          "customer"
        ],
        "correctIndex": 2,
        "explanation": "文 (wén) means \"text/culture\"."
      },
      {
        "instruction": "Learn about the importance of water temperature.",
        "question": "Which character means \"kitchen\"?",
        "options": [
          "夫",
          "旁边",
          "厨房",
          "现在"
        ],
        "correctIndex": 2,
        "explanation": "\"kitchen\" is written as 厨房 (chúfáng)."
      },
      {
        "instruction": "Smell the tea. Describe the aroma.",
        "question": "How do you pronounce \"年\"?",
        "options": [
          "yùsuàn",
          "",
          "",
          "nián"
        ],
        "correctIndex": 3,
        "explanation": "年 is pronounced nián."
      },
      {
        "instruction": "Taste the tea. Express your opinion.",
        "question": "What does \"雨\" mean?",
        "options": [
          "email",
          "custom/tradition",
          "rain",
          "component of 岛屿"
        ],
        "correctIndex": 2,
        "explanation": "雨 (yǔ) means \"rain\"."
      },
      {
        "instruction": "Learn about the health benefits of tea.",
        "question": "Which character means \"so/therefore\"?",
        "options": [
          "所以",
          "总结",
          "可再生",
          "金牌"
        ],
        "correctIndex": 0,
        "explanation": "\"so/therefore\" is written as 所以 (suǒyǐ)."
      },
      {
        "instruction": "Ask about the history of Chinese tea culture.",
        "question": "How do you pronounce \"地址\"?",
        "options": [
          "",
          "dìzhǐ",
          "wēnróu",
          "ānquán"
        ],
        "correctIndex": 1,
        "explanation": "地址 is pronounced dìzhǐ."
      },
      {
        "instruction": "Thank your host and express appreciation.",
        "question": "What does \"李\" mean?",
        "options": [
          "component of 快递",
          "component of 语言",
          "class/shift",
          "component of 行李"
        ],
        "correctIndex": 3,
        "explanation": "李 () means \"component of 行李\"."
      }
    ]
  },
  {
    "id": "ms_20",
    "title": "Discussing Chinese Festivals",
    "theme": "families_communities",
    "description": "Learn about major Chinese festivals throughout the year. Compare them with holidays you know.",
    "prereqNodeIds": [
      "c_7b97",
      "w_96467eed",
      "w_6c114e3b",
      "w_4fc38fdb",
      "c_7545"
    ],
    "steps": [
      {
        "instruction": "Learn about 春节 (Spring Festival). When is it?",
        "question": "What does \"题\" mean?",
        "options": [
          "component of 夏天",
          "component of 其实",
          "justice",
          "topic/question"
        ],
        "correctIndex": 3,
        "explanation": "题 (tí) means \"topic/question\"."
      },
      {
        "instruction": "What traditions are associated with Mid-Autumn Festival?",
        "question": "Which character means \"component of 原谅\"?",
        "options": [
          "新陈代谢",
          "显",
          "远程工作",
          "谅"
        ],
        "correctIndex": 3,
        "explanation": "\"component of 原谅\" is written as 谅 ()."
      },
      {
        "instruction": "Learn about Dragon Boat Festival and its food.",
        "question": "How do you pronounce \"鱼肉\"?",
        "options": [
          "yúròu",
          "lǚxíng rìjì",
          "dūn",
          ""
        ],
        "correctIndex": 0,
        "explanation": "鱼肉 is pronounced yúròu."
      },
      {
        "instruction": "What is the Lantern Festival? Read about it.",
        "question": "What does \"胸怀\" mean?",
        "options": [
          "to compare",
          "mind/breadth of vision",
          "component of 纪念品",
          "bedroom"
        ],
        "correctIndex": 1,
        "explanation": "胸怀 (xiōnghuái) means \"mind/breadth of vision\"."
      },
      {
        "instruction": "Discuss the importance of family reunions during festivals.",
        "question": "Which character means \"structure/construct\"?",
        "options": [
          "构",
          "公检法",
          "张",
          "总"
        ],
        "correctIndex": 0,
        "explanation": "\"structure/construct\" is written as 构 (gòu)."
      },
      {
        "instruction": "Learn about traditional festival foods.",
        "question": "How do you pronounce \"谈判\"?",
        "options": [
          "tánpàn",
          "",
          "jiǎnsù",
          ""
        ],
        "correctIndex": 0,
        "explanation": "谈判 is pronounced tánpàn."
      },
      {
        "instruction": "Compare a Chinese festival with one from your culture.",
        "question": "What does \"有的...有的...\" mean?",
        "options": [
          "reason/cause",
          "Some...some...",
          "to swipe a card",
          "essence/nature"
        ],
        "correctIndex": 1,
        "explanation": "有的...有的... (yǒude...yǒude...) means \"Some...some...\"."
      },
      {
        "instruction": "Write New Year wishes in Chinese.",
        "question": "Which character means \"down-to-earth/practical\"?",
        "options": [
          "脚踏实地",
          "分别",
          "模糊",
          "知识"
        ],
        "correctIndex": 0,
        "explanation": "\"down-to-earth/practical\" is written as 脚踏实地 (jiǎo tà shí dì)."
      },
      {
        "instruction": "Learn about the Chinese zodiac and its significance.",
        "question": "How do you pronounce \"清楚\"?",
        "options": [
          "",
          "",
          "",
          "qīngchu"
        ],
        "correctIndex": 3,
        "explanation": "清楚 is pronounced qīngchu."
      },
      {
        "instruction": "Plan how to celebrate a Chinese festival.",
        "question": "What does \"努力\" mean?",
        "options": [
          "component of 温柔",
          "host/presenter",
          "silver/money",
          "to work hard/effort"
        ],
        "correctIndex": 3,
        "explanation": "努力 (nǔlì) means \"to work hard/effort\"."
      }
    ]
  },
  {
    "id": "ms_21",
    "title": "Technology and Daily Life in China",
    "theme": "science_technology",
    "description": "Explore how technology shapes daily life in modern China — mobile payments, apps, and digital culture.",
    "prereqNodeIds": [
      "w_60258e81",
      "c_8ba9",
      "c_6f5c",
      "c_6cf0",
      "w_8eab4f53"
    ],
    "steps": [
      {
        "instruction": "Learn about mobile payment. What is 微信支付?",
        "question": "What does \"痛\" mean?",
        "options": [
          "spirit/clever",
          "food safety",
          "social media",
          "component of 头痛"
        ],
        "correctIndex": 3,
        "explanation": "痛 () means \"component of 头痛\"."
      },
      {
        "instruction": "Download a food delivery app. Order lunch.",
        "question": "Which character means \"component of 义务\"?",
        "options": [
          "百",
          "贵",
          "义",
          "狭"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 义务\" is written as 义 ()."
      },
      {
        "instruction": "Use a navigation app. Find your destination.",
        "question": "How do you pronounce \"Statement+吗?\"?",
        "options": [
          "statement + ma?",
          "",
          "",
          "zhēnjiǔ"
        ],
        "correctIndex": 0,
        "explanation": "Statement+吗? is pronounced statement + ma?."
      },
      {
        "instruction": "Learn about bike-sharing. How does it work?",
        "question": "What does \"铜\" mean?",
        "options": [
          "to jog/run",
          "luck/transport",
          "collective/group",
          "component of 铜牌"
        ],
        "correctIndex": 3,
        "explanation": "铜 () means \"component of 铜牌\"."
      },
      {
        "instruction": "Discuss the differences in social media platforms.",
        "question": "Which character means \"component of 共享单车\"?",
        "options": [
          "丰富",
          "英语",
          "享",
          "履"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 共享单车\" is written as 享 ()."
      },
      {
        "instruction": "Learn about online shopping in China.",
        "question": "How do you pronounce \"克服\"?",
        "options": [
          "huǒzāi",
          "shèbǎo",
          "hóng",
          "kèfú"
        ],
        "correctIndex": 3,
        "explanation": "克服 is pronounced kèfú."
      },
      {
        "instruction": "Use a translation app. Practice with it.",
        "question": "What does \"反驳\" mean?",
        "options": [
          "social media",
          "component of 缓慢",
          "Chinese cuisine passage",
          "to refute"
        ],
        "correctIndex": 3,
        "explanation": "反驳 (fǎnbó) means \"to refute\"."
      },
      {
        "instruction": "Discuss the pros and cons of technology dependence.",
        "question": "Which character means \"to expand/enlarge\"?",
        "options": [
          "扩大",
          "士",
          "图书",
          "被"
        ],
        "correctIndex": 0,
        "explanation": "\"to expand/enlarge\" is written as 扩大 (kuòdà)."
      },
      {
        "instruction": "Learn about Chinese tech companies.",
        "question": "How do you pronounce \"拜\"?",
        "options": [
          "pǐn",
          "shāngrén",
          "",
          ""
        ],
        "correctIndex": 2,
        "explanation": "拜 is pronounced ."
      },
      {
        "instruction": "Reflect on technology's role in learning Chinese.",
        "question": "What does \"消\" mean?",
        "options": [
          "component of 紫色",
          "to practice/exercise",
          "kitchen",
          "component of 消费"
        ],
        "correctIndex": 3,
        "explanation": "消 () means \"component of 消费\"."
      }
    ]
  },
  {
    "id": "ms_22",
    "title": "Reading Chinese News",
    "theme": "global_challenges",
    "description": "Read and discuss Chinese news articles. Practice reading comprehension and learn current events vocabulary.",
    "prereqNodeIds": [
      "c_9646",
      "c_620f",
      "c_76ee",
      "c_7d27",
      "c_6c34"
    ],
    "steps": [
      {
        "instruction": "Read the headline. What is the article about?",
        "question": "What does \"雪\" mean?",
        "options": [
          "letter/believe",
          "loan",
          "snow",
          "to celebrate"
        ],
        "correctIndex": 2,
        "explanation": "雪 (xuě) means \"snow\"."
      },
      {
        "instruction": "Identify key vocabulary in the first paragraph.",
        "question": "Which character means \"component of 留恋\"?",
        "options": [
          "论",
          "丰",
          "星期",
          "恋"
        ],
        "correctIndex": 3,
        "explanation": "\"component of 留恋\" is written as 恋 ()."
      },
      {
        "instruction": "Understand the main argument of the article.",
        "question": "How do you pronounce \"特征\"?",
        "options": [
          "tèzhēng",
          "kèwài huódòng",
          "",
          "yīngxióng"
        ],
        "correctIndex": 0,
        "explanation": "特征 is pronounced tèzhēng."
      },
      {
        "instruction": "Find supporting details.",
        "question": "What does \"复印\" mean?",
        "options": [
          "component of 拘留",
          "to close/concern",
          "to photocopy",
          "clear/understood"
        ],
        "correctIndex": 2,
        "explanation": "复印 (fùyìn) means \"to photocopy\"."
      },
      {
        "instruction": "Learn news-related vocabulary.",
        "question": "Which character means \"component of 逮捕\"?",
        "options": [
          "惠",
          "专",
          "逮",
          "企"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 逮捕\" is written as 逮 ()."
      },
      {
        "instruction": "Summarize the article in your own words.",
        "question": "How do you pronounce \"暗\"?",
        "options": [
          "àn",
          "gōngsī",
          "jùjué",
          ""
        ],
        "correctIndex": 0,
        "explanation": "暗 is pronounced àn."
      },
      {
        "instruction": "Form an opinion about the topic.",
        "question": "What does \"忽视\" mean?",
        "options": [
          "scholar/academic",
          "to neglect/ignore",
          "phenomenon",
          "snow"
        ],
        "correctIndex": 1,
        "explanation": "忽视 (hūshì) means \"to neglect/ignore\"."
      },
      {
        "instruction": "Discuss the article with a partner.",
        "question": "Which character means \"consumer\"?",
        "options": [
          "绘画",
          "消费者",
          "不",
          "故事"
        ],
        "correctIndex": 1,
        "explanation": "\"consumer\" is written as 消费者 (xiāofèizhě)."
      },
      {
        "instruction": "Write a response to the article.",
        "question": "How do you pronounce \"珍\"?",
        "options": [
          "",
          "",
          "",
          ""
        ],
        "correctIndex": 0,
        "explanation": "珍 is pronounced ."
      },
      {
        "instruction": "Compare news coverage in different languages.",
        "question": "What does \"炼\" mean?",
        "options": [
          "quiet/still",
          "component of 骄傲",
          "component of 锻炼",
          "spicy/hot"
        ],
        "correctIndex": 2,
        "explanation": "炼 () means \"component of 锻炼\"."
      }
    ]
  },
  {
    "id": "ms_23",
    "title": "Chinese Zodiac Stories",
    "theme": "personal_public_identities",
    "description": "Learn the stories behind the twelve Chinese zodiac animals and discover your zodiac sign.",
    "prereqNodeIds": [
      "w_8d5e7f8e",
      "c_8138",
      "c_601d",
      "w_76f858f0",
      "c_505a"
    ],
    "steps": [
      {
        "instruction": "Learn the twelve zodiac animals in Chinese.",
        "question": "What does \"射\" mean?",
        "options": [
          "component of 辐射",
          "extroverted/outgoing",
          "painting/drawing",
          "Writing: write a short story"
        ],
        "correctIndex": 0,
        "explanation": "射 () means \"component of 辐射\"."
      },
      {
        "instruction": "Find out your zodiac animal. What year were you born?",
        "question": "Which character means \"Writing: write a short story\"?",
        "options": [
          "天赋",
          "绘",
          "救灾",
          "写故事"
        ],
        "correctIndex": 3,
        "explanation": "\"Writing: write a short story\" is written as 写故事 (xiě gùshi)."
      },
      {
        "instruction": "Read the story of the Great Race.",
        "question": "How do you pronounce \"假设\"?",
        "options": [
          "shùxué",
          "",
          "jiǎshè",
          "yúròu"
        ],
        "correctIndex": 2,
        "explanation": "假设 is pronounced jiǎshè."
      },
      {
        "instruction": "Learn personality traits associated with your zodiac.",
        "question": "What does \"害\" mean?",
        "options": [
          "component of 事半功倍",
          "component of 缓慢",
          "harm/damage",
          "newspaper"
        ],
        "correctIndex": 2,
        "explanation": "害 (hài) means \"harm/damage\"."
      },
      {
        "instruction": "Discuss zodiac compatibility.",
        "question": "Which character means \"per capita income\"?",
        "options": [
          "细胞",
          "司",
          "人均收入",
          "营"
        ],
        "correctIndex": 2,
        "explanation": "\"per capita income\" is written as 人均收入 (rénjūn shōurù)."
      },
      {
        "instruction": "Learn the order of the zodiac animals.",
        "question": "How do you pronounce \"宿\"?",
        "options": [
          "",
          "gāo'ěrfū",
          "",
          "làjiāo"
        ],
        "correctIndex": 0,
        "explanation": "宿 is pronounced ."
      },
      {
        "instruction": "Discuss how zodiac beliefs influence culture.",
        "question": "What does \"循\" mean?",
        "options": [
          "situation/condition",
          "component of 循序渐进",
          "virtual/fictitious",
          "method/way"
        ],
        "correctIndex": 1,
        "explanation": "循 () means \"component of 循序渐进\"."
      },
      {
        "instruction": "Compare Chinese zodiac with Western astrology.",
        "question": "Which character means \"actually/in fact\"?",
        "options": [
          "消费",
          "其实",
          "显",
          "变化"
        ],
        "correctIndex": 1,
        "explanation": "\"actually/in fact\" is written as 其实 (qíshí)."
      },
      {
        "instruction": "Create a zodiac profile for yourself.",
        "question": "How do you pronounce \"率\"?",
        "options": [
          "",
          "",
          "",
          ""
        ],
        "correctIndex": 0,
        "explanation": "率 is pronounced ."
      },
      {
        "instruction": "Share your zodiac with a Chinese friend.",
        "question": "What does \"友\" mean?",
        "options": [
          "Chinese character",
          "component of 朋友",
          "police officer",
          "kung fu/skill"
        ],
        "correctIndex": 1,
        "explanation": "友 () means \"component of 朋友\"."
      }
    ]
  },
  {
    "id": "ms_24",
    "title": "Health and Wellness Practices",
    "theme": "contemporary_life",
    "description": "Learn about traditional Chinese health practices including tai chi, acupuncture, and herbal medicine.",
    "prereqNodeIds": [
      "c_53d7",
      "w_52aa529b",
      "g_yinwei_because",
      "w_54739053",
      "c_8d38"
    ],
    "steps": [
      {
        "instruction": "Learn about traditional Chinese medicine.",
        "question": "What does \"湿\" mean?",
        "options": [
          "photography",
          "wet/damp",
          "allergy/allergic",
          "Even...also..."
        ],
        "correctIndex": 1,
        "explanation": "湿 (shī) means \"wet/damp\"."
      },
      {
        "instruction": "What is 太极拳 (Tai Chi)? Learn the basics.",
        "question": "Which character means \"to touch/feel\"?",
        "options": [
          "硕士",
          "摸",
          "花",
          "钓"
        ],
        "correctIndex": 1,
        "explanation": "\"to touch/feel\" is written as 摸 (mō)."
      },
      {
        "instruction": "Visit a traditional pharmacy. Identify herbs.",
        "question": "How do you pronounce \"鸡肉\"?",
        "options": [
          "hélǐ",
          "",
          "zànshí",
          "jīròu"
        ],
        "correctIndex": 3,
        "explanation": "鸡肉 is pronounced jīròu."
      },
      {
        "instruction": "Learn about the concept of yin and yang in health.",
        "question": "What does \"长江\" mean?",
        "options": [
          "living room",
          "professor",
          "How about...? / And...?",
          "Yangtze River"
        ],
        "correctIndex": 3,
        "explanation": "长江 (Chángjiāng) means \"Yangtze River\"."
      },
      {
        "instruction": "Discuss the importance of balance in diet.",
        "question": "Which character means \"evolution\"?",
        "options": [
          "宽容",
          "交通工具",
          "晚",
          "进化"
        ],
        "correctIndex": 3,
        "explanation": "\"evolution\" is written as 进化 (jìnhuà)."
      },
      {
        "instruction": "Learn about acupuncture. What does 针灸 mean?",
        "question": "How do you pronounce \"婴儿\"?",
        "options": [
          "yīng'ér",
          "suí yù ér ān",
          "shī",
          "jìngpèi"
        ],
        "correctIndex": 0,
        "explanation": "婴儿 is pronounced yīng'ér."
      },
      {
        "instruction": "Practice describing symptoms in Chinese.",
        "question": "What does \"相信\" mean?",
        "options": [
          "to bend/curved",
          "to believe",
          "component of 二维码",
          "component of 改革"
        ],
        "correctIndex": 1,
        "explanation": "相信 (xiāngxìn) means \"to believe\"."
      },
      {
        "instruction": "Compare Eastern and Western medicine approaches.",
        "question": "Which character means \"clean/pure\"?",
        "options": [
          "大数据",
          "观",
          "净",
          "兴奋"
        ],
        "correctIndex": 2,
        "explanation": "\"clean/pure\" is written as 净 (jìng)."
      },
      {
        "instruction": "Learn health-related vocabulary.",
        "question": "How do you pronounce \"人\"?",
        "options": [
          "A de B",
          "fāshāo",
          "rén",
          "duànliàn"
        ],
        "correctIndex": 2,
        "explanation": "人 is pronounced rén."
      },
      {
        "instruction": "Create a healthy lifestyle plan in Chinese.",
        "question": "What does \"救灾\" mean?",
        "options": [
          "component of 烹饪",
          "to raise/improve",
          "component of 阻碍",
          "disaster relief"
        ],
        "correctIndex": 3,
        "explanation": "救灾 (jiùzāi) means \"disaster relief\"."
      }
    ]
  },
  {
    "id": "ms_25",
    "title": "Renting an Apartment in China",
    "theme": "contemporary_life",
    "description": "Search for and rent an apartment. Practice real estate vocabulary and negotiation skills.",
    "prereqNodeIds": [
      "w_785558eb",
      "c_75db",
      "w_56fe4e66",
      "w_4e1c897f",
      "w_4f207edf"
    ],
    "steps": [
      {
        "instruction": "Search online listings. Understand the descriptions.",
        "question": "What does \"Adj+一点儿\" mean?",
        "options": [
          "correct/toward",
          "A little bit + adj",
          "diligent/frequent",
          "to return"
        ],
        "correctIndex": 1,
        "explanation": "Adj+一点儿 (adj + yīdiǎnr) means \"A little bit + adj\"."
      },
      {
        "instruction": "Call a real estate agent. Ask about availability.",
        "question": "Which character means \"component of 研究\"?",
        "options": [
          "伪",
          "研",
          "花园",
          "律"
        ],
        "correctIndex": 1,
        "explanation": "\"component of 研究\" is written as 研 ()."
      },
      {
        "instruction": "Visit an apartment. Describe the rooms.",
        "question": "How do you pronounce \"泰山\"?",
        "options": [
          "adj + duō le",
          "Tàishān",
          "yínpái",
          "shì...de"
        ],
        "correctIndex": 1,
        "explanation": "泰山 is pronounced Tàishān."
      },
      {
        "instruction": "Ask about the monthly rent.",
        "question": "What does \"头痛\" mean?",
        "options": [
          "component of 端午节",
          "headache",
          "poor/poverty",
          "laboratory"
        ],
        "correctIndex": 1,
        "explanation": "头痛 (tóutòng) means \"headache\"."
      },
      {
        "instruction": "Discuss the lease terms.",
        "question": "Which character means \"component of 污染\"?",
        "options": [
          "约",
          "压岁钱",
          "污",
          "铁"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 污染\" is written as 污 ()."
      },
      {
        "instruction": "Ask about utilities. What's included?",
        "question": "How do you pronounce \"绿\"?",
        "options": [
          "",
          "jiāo",
          "",
          "pínlǜ"
        ],
        "correctIndex": 0,
        "explanation": "绿 is pronounced ."
      },
      {
        "instruction": "Negotiate the rent.",
        "question": "What does \"历史\" mean?",
        "options": [
          "Besides/except for...",
          "to play chess",
          "history",
          "to be interested in"
        ],
        "correctIndex": 2,
        "explanation": "历史 (lìshǐ) means \"history\"."
      },
      {
        "instruction": "Read and understand the contract.",
        "question": "Which character means \"suddenly\"?",
        "options": [
          "情况",
          "小康社会",
          "突然",
          "上诉"
        ],
        "correctIndex": 2,
        "explanation": "\"suddenly\" is written as 突然 (tūrán)."
      },
      {
        "instruction": "Discuss moving day logistics.",
        "question": "How do you pronounce \"国际关系\"?",
        "options": [
          "",
          "chóngbài",
          "xiūyǎng",
          "guójì guānxì"
        ],
        "correctIndex": 3,
        "explanation": "国际关系 is pronounced guójì guānxì."
      },
      {
        "instruction": "Meet your new neighbors. Introduce yourself.",
        "question": "What does \"奉\" mean?",
        "options": [
          "world",
          "component of 奉献",
          "boundary/world",
          "to carry/bring"
        ],
        "correctIndex": 1,
        "explanation": "奉 () means \"component of 奉献\"."
      }
    ]
  },
  {
    "id": "ms_26",
    "title": "Discussing Climate Change",
    "theme": "global_challenges",
    "description": "Participate in a class discussion about climate change and its impact on China and the world.",
    "prereqNodeIds": [
      "w_4ee38868",
      "w_56fd964554084f5c",
      "w_73cd60dc",
      "c_5a74",
      "w_5e7f6cdb"
    ],
    "steps": [
      {
        "instruction": "Learn the Chinese word for 'climate change'.",
        "question": "What does \"创造力\" mean?",
        "options": [
          "World Trade Organization",
          "component of 筷子",
          "creativity",
          "worried/anxious"
        ],
        "correctIndex": 2,
        "explanation": "创造力 (chuàngzàolì) means \"creativity\"."
      },
      {
        "instruction": "Read statistics about global warming.",
        "question": "Which character means \"disease/illness\"?",
        "options": [
          "疾病",
          "表达",
          "太",
          "协商"
        ],
        "correctIndex": 0,
        "explanation": "\"disease/illness\" is written as 疾病 (jíbìng)."
      },
      {
        "instruction": "Discuss causes of climate change.",
        "question": "How do you pronounce \"跨\"?",
        "options": [
          "jiāotōng gōngjù",
          "",
          "",
          ""
        ],
        "correctIndex": 1,
        "explanation": "跨 is pronounced ."
      },
      {
        "instruction": "Learn about China's environmental policies.",
        "question": "What does \"虚伪\" mean?",
        "options": [
          "artificial intelligence",
          "component of 急躁",
          "hypocritical/false",
          "Very + adjective"
        ],
        "correctIndex": 2,
        "explanation": "虚伪 (xūwěi) means \"hypocritical/false\"."
      },
      {
        "instruction": "Discuss the impact on agriculture.",
        "question": "Which character means \"should/ought to\"?",
        "options": [
          "生活方式",
          "师",
          "应该",
          "搜索"
        ],
        "correctIndex": 2,
        "explanation": "\"should/ought to\" is written as 应该 (yīnggāi)."
      },
      {
        "instruction": "Learn about renewable energy solutions.",
        "question": "How do you pronounce \"太阳能\"?",
        "options": [
          "tàiyáng néng",
          "jié",
          "",
          ""
        ],
        "correctIndex": 0,
        "explanation": "太阳能 is pronounced tàiyáng néng."
      },
      {
        "instruction": "Debate different approaches to the problem.",
        "question": "What does \"其实\" mean?",
        "options": [
          "actually/in fact",
          "component of 亡羊补牢",
          "face",
          "Transportation passage"
        ],
        "correctIndex": 0,
        "explanation": "其实 (qíshí) means \"actually/in fact\"."
      },
      {
        "instruction": "Write an opinion paragraph about the issue.",
        "question": "Which character means \"common/together\"?",
        "options": [
          "在线学习",
          "共",
          "赞成",
          "消防安全"
        ],
        "correctIndex": 1,
        "explanation": "\"common/together\" is written as 共 (gòng)."
      },
      {
        "instruction": "Propose personal actions to help.",
        "question": "How do you pronounce \"着急\"?",
        "options": [
          "",
          "shēnfènzhèng",
          "wén",
          "zháojí"
        ],
        "correctIndex": 3,
        "explanation": "着急 is pronounced zháojí."
      },
      {
        "instruction": "Summarize the key takeaways from the discussion.",
        "question": "What does \"谐\" mean?",
        "options": [
          "component of 宾馆",
          "component of 和谐",
          "to read aloud",
          "component of 晴天"
        ],
        "correctIndex": 1,
        "explanation": "谐 () means \"component of 和谐\"."
      }
    ]
  },
  {
    "id": "ms_27",
    "title": "Chinese Calligraphy Workshop",
    "theme": "beauty_aesthetics",
    "description": "Join a calligraphy workshop. Learn brush techniques, character structure, and the art of beautiful writing.",
    "prereqNodeIds": [
      "c_6361",
      "w_62cd5356",
      "w_4e16754c676f",
      "w_5f539009",
      "w_953b70bc"
    ],
    "steps": [
      {
        "instruction": "Meet the calligraphy master. How do you address them?",
        "question": "What does \"意\" mean?",
        "options": [
          "yellow",
          "express delivery",
          "price",
          "meaning/idea"
        ],
        "correctIndex": 3,
        "explanation": "意 (yì) means \"meaning/idea\"."
      },
      {
        "instruction": "Learn about the calligraphy tools. What is a 毛笔?",
        "question": "Which character means \"component of 硕士\"?",
        "options": [
          "士",
          "太极",
          "全球变暖",
          "务"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 硕士\" is written as 士 ()."
      },
      {
        "instruction": "Practice basic strokes. What are the main types?",
        "question": "How do you pronounce \"环保倡议书\"?",
        "options": [
          "",
          "bǎoxiū",
          "xiān",
          "huánbǎo chàngyì shū"
        ],
        "correctIndex": 3,
        "explanation": "环保倡议书 is pronounced huánbǎo chàngyì shū."
      },
      {
        "instruction": "Write the character 人. How many strokes?",
        "question": "What does \"取\" mean?",
        "options": [
          "system/unite",
          "component of 录取",
          "component of 微波炉",
          "component of 宗教"
        ],
        "correctIndex": 1,
        "explanation": "取 () means \"component of 录取\"."
      },
      {
        "instruction": "Learn about different calligraphy styles.",
        "question": "Which character means \"component of 促进\"?",
        "options": [
          "促",
          "视",
          "水",
          "原谅"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 促进\" is written as 促 ()."
      },
      {
        "instruction": "Practice writing your name in Chinese.",
        "question": "How do you pronounce \"念\"?",
        "options": [
          "",
          "",
          "qūkuàiliàn",
          "chūkǒu"
        ],
        "correctIndex": 0,
        "explanation": "念 is pronounced ."
      },
      {
        "instruction": "The master critiques your work. Understand the feedback.",
        "question": "What does \"经济衰退\" mean?",
        "options": [
          "structure/construct",
          "to study diligently",
          "economic recession",
          "component of 优惠"
        ],
        "correctIndex": 2,
        "explanation": "经济衰退 (jīngjì shuāituì) means \"economic recession\"."
      },
      {
        "instruction": "Learn about the philosophical connection to calligraphy.",
        "question": "Which character means \"component of 地铁\"?",
        "options": [
          "康",
          "铁",
          "百",
          "杯"
        ],
        "correctIndex": 1,
        "explanation": "\"component of 地铁\" is written as 铁 ()."
      },
      {
        "instruction": "Write a short phrase or proverb.",
        "question": "How do you pronounce \"A是B\"?",
        "options": [
          "jiào",
          "A shì B",
          "wǎncān",
          "kuàng"
        ],
        "correctIndex": 1,
        "explanation": "A是B is pronounced A shì B."
      },
      {
        "instruction": "Display your best work and describe it.",
        "question": "What does \"被+Agent+Verb\" mean?",
        "options": [
          "component of 博物馆",
          "component of 面包",
          "Passive voice",
          "Tradition and modernity passage"
        ],
        "correctIndex": 2,
        "explanation": "被+Agent+Verb (bèi + agent + verb) means \"Passive voice\"."
      }
    ]
  },
  {
    "id": "ms_28",
    "title": "Sports and Competition",
    "theme": "contemporary_life",
    "description": "Join a sports event at a Chinese school. Learn sports vocabulary and discuss sportsmanship.",
    "prereqNodeIds": [
      "c_6298",
      "w_679c6c41",
      "c_5e03",
      "c_5fc3",
      "c_65e5"
    ],
    "steps": [
      {
        "instruction": "Read the sports day schedule. What events are there?",
        "question": "What does \"健康\" mean?",
        "options": [
          "component of 裁判",
          "Forbidden City",
          "healthy/health",
          "component of 珍惜"
        ],
        "correctIndex": 2,
        "explanation": "健康 (jiànkāng) means \"healthy/health\"."
      },
      {
        "instruction": "Sign up for an event. What sport do you choose?",
        "question": "Which character means \"market\"?",
        "options": [
          "志愿者",
          "飞",
          "富",
          "市场"
        ],
        "correctIndex": 3,
        "explanation": "\"market\" is written as 市场 (shìchǎng)."
      },
      {
        "instruction": "Learn the rules. Understand the instructions.",
        "question": "How do you pronounce \"摸\"?",
        "options": [
          "héxié",
          "mō",
          "zhòngcái",
          "shēn"
        ],
        "correctIndex": 1,
        "explanation": "摸 is pronounced mō."
      },
      {
        "instruction": "Cheer for your team. What do you shout?",
        "question": "What does \"火车\" mean?",
        "options": [
          "component of 英雄",
          "fair/just",
          "train",
          "journey/process"
        ],
        "correctIndex": 2,
        "explanation": "火车 (huǒchē) means \"train\"."
      },
      {
        "instruction": "The score is announced. Understand the numbers.",
        "question": "Which character means \"component of 自行车\"?",
        "options": [
          "自",
          "发达国家",
          "演",
          "钓鱼"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 自行车\" is written as 自 ()."
      },
      {
        "instruction": "Discuss good sportsmanship.",
        "question": "How do you pronounce \"镜\"?",
        "options": [
          "",
          "kāifàng bāoróng",
          "yǒu",
          ""
        ],
        "correctIndex": 0,
        "explanation": "镜 is pronounced ."
      },
      {
        "instruction": "Your team wins! Express excitement.",
        "question": "What does \"银\" mean?",
        "options": [
          "to practice/exercise",
          "comprehensive",
          "component of 丈夫",
          "silver/money"
        ],
        "correctIndex": 3,
        "explanation": "银 (yín) means \"silver/money\"."
      },
      {
        "instruction": "Congratulate the opposing team.",
        "question": "Which character means \"romantic love\"?",
        "options": [
          "爱情",
          "降低",
          "商人",
          "暖"
        ],
        "correctIndex": 0,
        "explanation": "\"romantic love\" is written as 爱情 (àiqíng)."
      },
      {
        "instruction": "Discuss your favorite athlete.",
        "question": "How do you pronounce \"导游\"?",
        "options": [
          "",
          "",
          "dǎoyóu",
          "jiějué"
        ],
        "correctIndex": 2,
        "explanation": "导游 is pronounced dǎoyóu."
      },
      {
        "instruction": "Write about the sports day experience.",
        "question": "What does \"探\" mean?",
        "options": [
          "component of 探索",
          "bright/light",
          "yin and yang",
          "to accelerate"
        ],
        "correctIndex": 0,
        "explanation": "探 () means \"component of 探索\"."
      }
    ]
  },
  {
    "id": "ms_29",
    "title": "Chinese Film Night",
    "theme": "beauty_aesthetics",
    "description": "Watch a Chinese film and discuss the plot, characters, and cultural themes.",
    "prereqNodeIds": [
      "c_731c",
      "c_5e38",
      "w_6548679c",
      "w_90004f11",
      "c_7701"
    ],
    "steps": [
      {
        "instruction": "Read the movie poster. What's the title?",
        "question": "What does \"活到老学到老\" mean?",
        "options": [
          "to exchange/communicate",
          "component of 否认",
          "hat/cap",
          "live and learn / never stop learning"
        ],
        "correctIndex": 3,
        "explanation": "活到老学到老 (huó dào lǎo xué dào lǎo) means \"live and learn / never stop learning\"."
      },
      {
        "instruction": "Understand the genre. What type of film is it?",
        "question": "Which character means \"to stimulate\"?",
        "options": [
          "刺激",
          "幸福感",
          "换货",
          "消费者"
        ],
        "correctIndex": 0,
        "explanation": "\"to stimulate\" is written as 刺激 (cìjī)."
      },
      {
        "instruction": "Watch the opening scene. Describe the setting.",
        "question": "How do you pronounce \"珍惜\"?",
        "options": [
          "zhēnxī",
          "yǐnliào",
          "",
          ""
        ],
        "correctIndex": 0,
        "explanation": "珍惜 is pronounced zhēnxī."
      },
      {
        "instruction": "Identify the main character. What's their name?",
        "question": "What does \"咸\" mean?",
        "options": [
          "sufficient/full",
          "component of 尊重",
          "salty",
          "to practice"
        ],
        "correctIndex": 2,
        "explanation": "咸 (xián) means \"salty\"."
      },
      {
        "instruction": "Understand a key dialogue scene.",
        "question": "Which character means \"to understand\"?",
        "options": [
          "广",
          "羊",
          "咳",
          "懂"
        ],
        "correctIndex": 3,
        "explanation": "\"to understand\" is written as 懂 (dǒng)."
      },
      {
        "instruction": "Identify the conflict in the story.",
        "question": "How do you pronounce \"写\"?",
        "options": [
          "",
          "fúwùyuán",
          "xiě",
          "fǎlǜ"
        ],
        "correctIndex": 2,
        "explanation": "写 is pronounced xiě."
      },
      {
        "instruction": "Discuss the cultural themes in the film.",
        "question": "What does \"南\" mean?",
        "options": [
          "to issue/distribute",
          "component of 渴望",
          "south",
          "component of 蛋糕"
        ],
        "correctIndex": 2,
        "explanation": "南 (nán) means \"south\"."
      },
      {
        "instruction": "Describe your favorite scene.",
        "question": "Which character means \"Passive voice\"?",
        "options": [
          "湿度",
          "被+Agent+Verb",
          "协",
          "没+Verb"
        ],
        "correctIndex": 1,
        "explanation": "\"Passive voice\" is written as 被+Agent+Verb (bèi + agent + verb)."
      },
      {
        "instruction": "Give a star rating and explain why.",
        "question": "How do you pronounce \"解\"?",
        "options": [
          "xǐ",
          "zhàiquàn",
          "jiě",
          "jīng"
        ],
        "correctIndex": 2,
        "explanation": "解 is pronounced jiě."
      },
      {
        "instruction": "Recommend the film to a friend.",
        "question": "What does \"温故知新\" mean?",
        "options": [
          "review the old to learn the new",
          "expert/specialist",
          "component of 宿舍",
          "doctor"
        ],
        "correctIndex": 0,
        "explanation": "温故知新 (wēn gù zhī xīn) means \"review the old to learn the new\"."
      }
    ]
  },
  {
    "id": "ms_30",
    "title": "Volunteering in the Community",
    "theme": "families_communities",
    "description": "Join a community volunteering event. Help at a food bank, teach children, or clean a park.",
    "prereqNodeIds": [
      "w_623f95f4",
      "c_53f7",
      "c_6562",
      "w_5c0f5eb7793e4f1a",
      "w_66745929"
    ],
    "steps": [
      {
        "instruction": "Read the volunteer sign-up sheet. What options are there?",
        "question": "What does \"爱\" mean?",
        "options": [
          "to love",
          "species",
          "old/used",
          "not/no"
        ],
        "correctIndex": 0,
        "explanation": "爱 (ài) means \"to love\"."
      },
      {
        "instruction": "Sign up. Provide your information.",
        "question": "Which character means \"weather\"?",
        "options": [
          "聊天",
          "启发",
          "训练",
          "天气"
        ],
        "correctIndex": 3,
        "explanation": "\"weather\" is written as 天气 (tiānqì)."
      },
      {
        "instruction": "Meet the other volunteers. Introduce yourself.",
        "question": "How do you pronounce \"的\"?",
        "options": [
          "de",
          "zài + place",
          "",
          "yìng"
        ],
        "correctIndex": 0,
        "explanation": "的 is pronounced de."
      },
      {
        "instruction": "Receive instructions. Understand your task.",
        "question": "What does \"部门\" mean?",
        "options": [
          "department",
          "at the same time",
          "component of 寒带",
          "dinner"
        ],
        "correctIndex": 0,
        "explanation": "部门 (bùmén) means \"department\"."
      },
      {
        "instruction": "Help sort donations. Learn related vocabulary.",
        "question": "Which character means \"discount\"?",
        "options": [
          "损失",
          "决定",
          "打折",
          "环境"
        ],
        "correctIndex": 2,
        "explanation": "\"discount\" is written as 打折 (dǎzhé)."
      },
      {
        "instruction": "Talk to someone you're helping. Practice conversation.",
        "question": "How do you pronounce \"中外文化差异\"?",
        "options": [
          "shū",
          "xīnchén dàixiè",
          "zhōngwài wénhuà chāyì",
          ""
        ],
        "correctIndex": 2,
        "explanation": "中外文化差异 is pronounced zhōngwài wénhuà chāyì."
      },
      {
        "instruction": "Take a break. Chat with other volunteers.",
        "question": "What does \"新闻报道\" mean?",
        "options": [
          "tour guide",
          "respectively/separately",
          "Writing: news report",
          "salty"
        ],
        "correctIndex": 2,
        "explanation": "新闻报道 (xīnwén bàodào) means \"Writing: news report\"."
      },
      {
        "instruction": "Learn about the community organization.",
        "question": "Which character means \"supermarket\"?",
        "options": [
          "盾",
          "超市",
          "脱",
          "宵"
        ],
        "correctIndex": 1,
        "explanation": "\"supermarket\" is written as 超市 (chāoshì)."
      },
      {
        "instruction": "Reflect on the volunteering experience.",
        "question": "How do you pronounce \"帮\"?",
        "options": [
          "zé",
          "pínglùn",
          "dēngjì",
          "bāng"
        ],
        "correctIndex": 3,
        "explanation": "帮 is pronounced bāng."
      },
      {
        "instruction": "Plan to volunteer again. Express your commitment.",
        "question": "What does \"饺\" mean?",
        "options": [
          "child",
          "sunny day",
          "impression",
          "component of 饺子"
        ],
        "correctIndex": 3,
        "explanation": "饺 () means \"component of 饺子\"."
      }
    ]
  },
  {
    "id": "ms_31",
    "title": "Ordering at a Chinese Restaurant",
    "theme": "contemporary_life",
    "description": "You're dining at a traditional restaurant in Beijing. Navigate the menu, order food, and handle the bill using your Chinese skills.",
    "prereqNodeIds": [
      "c_6536",
      "c_66f4",
      "c_6447",
      "c_73b0",
      "w_522b51774e00683c"
    ],
    "steps": [
      {
        "instruction": "The host greets you. How do you respond?",
        "question": "What does \"乏\" mean?",
        "options": [
          "humorous/funny",
          "component of 缺乏",
          "driver's license",
          "often/frequently"
        ],
        "correctIndex": 1,
        "explanation": "乏 () means \"component of 缺乏\".",
        "hint": "Think about basic greetings"
      },
      {
        "instruction": "The waiter asks how many people. What's the measure word for people?",
        "question": "Which character means \"Both...and...\"?",
        "options": [
          "收入",
          "既...又...",
          "绍",
          "世界贸易组织"
        ],
        "correctIndex": 1,
        "explanation": "\"Both...and...\" is written as 既...又... (jì...yòu...)."
      },
      {
        "instruction": "You see 菜 on the menu. What category is this?",
        "question": "How do you pronounce \"绿色\"?",
        "options": [
          "lǜsè",
          "",
          "shuō",
          "shì"
        ],
        "correctIndex": 0,
        "explanation": "绿色 is pronounced lǜsè."
      },
      {
        "instruction": "The waiter recommends a dish. Understand the description.",
        "question": "What does \"脱贫\" mean?",
        "options": [
          "stock/shares",
          "Global warming passage",
          "to bargain",
          "to escape poverty"
        ],
        "correctIndex": 3,
        "explanation": "脱贫 (tuōpín) means \"to escape poverty\"."
      },
      {
        "instruction": "You want to order tea. How do you say it?",
        "question": "Which character means \"English language\"?",
        "options": [
          "聊",
          "有志者事竟成",
          "城市交通问题",
          "英语"
        ],
        "correctIndex": 3,
        "explanation": "\"English language\" is written as 英语 (yīngyǔ)."
      },
      {
        "instruction": "Ask the waiter how much the dish costs.",
        "question": "How do you pronounce \"Verb+完\"?",
        "options": [
          "",
          "",
          "verb + wán",
          "yǔ"
        ],
        "correctIndex": 2,
        "explanation": "Verb+完 is pronounced verb + wán."
      },
      {
        "instruction": "The waiter says it's very delicious. What word did they use?",
        "question": "What does \"使命感\" mean?",
        "options": [
          "stable/steady",
          "component of 猛烈",
          "sense of mission",
          "component of 二维码"
        ],
        "correctIndex": 2,
        "explanation": "使命感 (shǐmìnggǎn) means \"sense of mission\"."
      },
      {
        "instruction": "You want to order rice. What's the word?",
        "question": "Which character means \"hall/office\"?",
        "options": [
          "乡",
          "尊",
          "小康",
          "厅"
        ],
        "correctIndex": 3,
        "explanation": "\"hall/office\" is written as 厅 (tīng)."
      },
      {
        "instruction": "Ask for the bill.",
        "question": "How do you pronounce \"微波炉\"?",
        "options": [
          "xiàoyuán shēnghuó",
          "xiāngzi",
          "máng",
          "wēibōlú"
        ],
        "correctIndex": 3,
        "explanation": "微波炉 is pronounced wēibōlú."
      },
      {
        "instruction": "Thank the waiter as you leave.",
        "question": "What does \"银行\" mean?",
        "options": [
          "safe/safety",
          "component of 咖啡",
          "bank",
          "component of 垄断"
        ],
        "correctIndex": 2,
        "explanation": "银行 (yínháng) means \"bank\"."
      }
    ]
  },
  {
    "id": "ms_32",
    "title": "First Day at a Chinese School",
    "theme": "contemporary_life",
    "description": "It's your first day as an exchange student at a Chinese high school. Introduce yourself, find your classroom, and make new friends.",
    "prereqNodeIds": [
      "w_78147a76",
      "c_94b1",
      "c_8fc7",
      "w_8bc14ef6",
      "w_8b665bdf5c40"
    ],
    "steps": [
      {
        "instruction": "The teacher asks your name. Introduce yourself.",
        "question": "What does \"大\" mean?",
        "options": [
          "component of 适当",
          "big/large",
          "actually/in fact",
          "to decrease/reduce"
        ],
        "correctIndex": 1,
        "explanation": "大 (dà) means \"big/large\"."
      },
      {
        "instruction": "Where are you from? State your nationality.",
        "question": "Which character means \"Writing: restaurant review\"?",
        "options": [
          "需要",
          "号",
          "餐厅评价",
          "凰"
        ],
        "correctIndex": 2,
        "explanation": "\"Writing: restaurant review\" is written as 餐厅评价 (cāntīng píngjià)."
      },
      {
        "instruction": "The teacher introduces you to the class. Understand the introduction.",
        "question": "How do you pronounce \"警察\"?",
        "options": [
          "liáng",
          "quēfá",
          "",
          "jǐngchá"
        ],
        "correctIndex": 3,
        "explanation": "警察 is pronounced jǐngchá."
      },
      {
        "instruction": "A classmate asks what you like to do. Answer them.",
        "question": "What does \"自动化\" mean?",
        "options": [
          "component of 寒带",
          "component of 诗歌",
          "automation",
          "culture"
        ],
        "correctIndex": 2,
        "explanation": "自动化 (zìdònghuà) means \"automation\"."
      },
      {
        "instruction": "Find the classroom. What does 教室 mean?",
        "question": "Which character means \"room/between\"?",
        "options": [
          "美术",
          "间",
          "亏",
          "黄色"
        ],
        "correctIndex": 1,
        "explanation": "\"room/between\" is written as 间 (jiān)."
      },
      {
        "instruction": "The schedule shows 中文课. What class is this?",
        "question": "How do you pronounce \"弹幕\"?",
        "options": [
          "tí",
          "gěi + sb + verb",
          "",
          "dànmù"
        ],
        "correctIndex": 3,
        "explanation": "弹幕 is pronounced dànmù."
      },
      {
        "instruction": "Your new friend invites you to lunch. Respond appropriately.",
        "question": "What does \"访\" mean?",
        "options": [
          "component of 元宵节",
          "to swipe a card",
          "component of 采访",
          "taxi"
        ],
        "correctIndex": 2,
        "explanation": "访 () means \"component of 采访\"."
      },
      {
        "instruction": "At lunch, discuss your favorite food.",
        "question": "Which character means \"component of 尊重\"?",
        "options": [
          "尊",
          "子",
          "踏",
          "艺"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 尊重\" is written as 尊 ()."
      },
      {
        "instruction": "Exchange phone numbers with your new friend.",
        "question": "How do you pronounce \"贵\"?",
        "options": [
          "wěndìng",
          "guì",
          "",
          ""
        ],
        "correctIndex": 1,
        "explanation": "贵 is pronounced guì."
      },
      {
        "instruction": "Say goodbye at the end of the day.",
        "question": "What does \"航空\" mean?",
        "options": [
          "pollution",
          "component of 违约",
          "aviation",
          "must/certainly"
        ],
        "correctIndex": 2,
        "explanation": "航空 (hángkōng) means \"aviation\"."
      }
    ]
  },
  {
    "id": "ms_33",
    "title": "Writing a Letter to a Host Family",
    "theme": "families_communities",
    "description": "Write a letter to your Chinese host family before your exchange trip. Introduce yourself and ask about their family.",
    "prereqNodeIds": [
      "c_4e9a",
      "w_53d197f3",
      "w_98917e41",
      "g_shi_sentence",
      "w_8ba88bba"
    ],
    "steps": [
      {
        "instruction": "Start the letter with a proper greeting.",
        "question": "What does \"需\" mean?",
        "options": [
          "component of 旁边",
          "objective",
          "to need/require",
          "component of 句子"
        ],
        "correctIndex": 2,
        "explanation": "需 (xū) means \"to need/require\"."
      },
      {
        "instruction": "Introduce your name and age.",
        "question": "Which character means \"genius\"?",
        "options": [
          "短",
          "天才",
          "粉色",
          "归"
        ],
        "correctIndex": 1,
        "explanation": "\"genius\" is written as 天才 (tiāncái)."
      },
      {
        "instruction": "Describe your family members.",
        "question": "How do you pronounce \"波\"?",
        "options": [
          "rèdài",
          "shěnpī",
          "",
          "hēisè"
        ],
        "correctIndex": 2,
        "explanation": "波 is pronounced ."
      },
      {
        "instruction": "Talk about what you study at school.",
        "question": "What does \"高兴\" mean?",
        "options": [
          "component of 帽子",
          "happy/glad",
          "component of 蛋糕",
          "component of 太极拳"
        ],
        "correctIndex": 1,
        "explanation": "高兴 (gāoxìng) means \"happy/glad\"."
      },
      {
        "instruction": "Mention your hobbies and interests.",
        "question": "Which character means \"idiom (4-character)\"?",
        "options": [
          "成语",
          "乐观",
          "繁",
          "先"
        ],
        "correctIndex": 0,
        "explanation": "\"idiom (4-character)\" is written as 成语 (chéngyǔ)."
      },
      {
        "instruction": "Ask about their family.",
        "question": "How do you pronounce \"功夫\"?",
        "options": [
          "xiàng",
          "dà",
          "gōngfu",
          "liǎn"
        ],
        "correctIndex": 2,
        "explanation": "功夫 is pronounced gōngfu."
      },
      {
        "instruction": "Express excitement about the trip.",
        "question": "What does \"我的家\" mean?",
        "options": [
          "package/parcel",
          "responsible",
          "component of 利益",
          "My family passage"
        ],
        "correctIndex": 3,
        "explanation": "我的家 (wǒ de jiā) means \"My family passage\"."
      },
      {
        "instruction": "Ask about the weather in their city.",
        "question": "Which character means \"component of 下棋\"?",
        "options": [
          "通勤",
          "二氧化碳",
          "棋",
          "安全感"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 下棋\" is written as 棋 ()."
      },
      {
        "instruction": "Ask what food they recommend.",
        "question": "How do you pronounce \"乏\"?",
        "options": [
          "",
          "",
          "",
          "dàodé"
        ],
        "correctIndex": 0,
        "explanation": "乏 is pronounced ."
      },
      {
        "instruction": "Close the letter politely.",
        "question": "What does \"Verb+了\" mean?",
        "options": [
          "component of 分裂",
          "Completed action",
          "please/to invite",
          "to face/confront"
        ],
        "correctIndex": 1,
        "explanation": "Verb+了 (verb + le) means \"Completed action\"."
      }
    ]
  },
  {
    "id": "ms_34",
    "title": "Shopping at a Chinese Market",
    "theme": "contemporary_life",
    "description": "Explore a bustling Chinese market. Bargain for souvenirs, buy fruits, and practice your numbers.",
    "prereqNodeIds": [
      "g_bu_negation",
      "c_80c0",
      "c_65c5",
      "c_7b28",
      "c_5c65"
    ],
    "steps": [
      {
        "instruction": "A vendor calls out. What are they selling?",
        "question": "What does \"随遇而安\" mean?",
        "options": [
          "component of 逮捕",
          "to believe",
          "be content with one's lot",
          "talent cultivation"
        ],
        "correctIndex": 2,
        "explanation": "随遇而安 (suí yù ér ān) means \"be content with one's lot\"."
      },
      {
        "instruction": "Ask how much something costs.",
        "question": "Which character means \"component of 广泛\"?",
        "options": [
          "光速",
          "泛",
          "繁",
          "任"
        ],
        "correctIndex": 1,
        "explanation": "\"component of 广泛\" is written as 泛 ()."
      },
      {
        "instruction": "The vendor says a price. Understand the number.",
        "question": "How do you pronounce \"着\"?",
        "options": [
          "yǒu + object",
          "",
          "guānzhù",
          ""
        ],
        "correctIndex": 1,
        "explanation": "着 is pronounced ."
      },
      {
        "instruction": "That's too expensive! How do you say it?",
        "question": "What does \"所以\" mean?",
        "options": [
          "yellow",
          "waste sorting",
          "bowl",
          "so/therefore"
        ],
        "correctIndex": 3,
        "explanation": "所以 (suǒyǐ) means \"so/therefore\"."
      },
      {
        "instruction": "Try to bargain. Offer a lower price.",
        "question": "Which character means \"learn to apply in practice\"?",
        "options": [
          "粽",
          "计划",
          "审美",
          "学以致用"
        ],
        "correctIndex": 3,
        "explanation": "\"learn to apply in practice\" is written as 学以致用 (xué yǐ zhì yòng)."
      },
      {
        "instruction": "You want to buy fruit. Name the fruit.",
        "question": "How do you pronounce \"颁奖\"?",
        "options": [
          "bānjiǎng",
          "dì",
          "xuǎnjǔ",
          ""
        ],
        "correctIndex": 0,
        "explanation": "颁奖 is pronounced bānjiǎng."
      },
      {
        "instruction": "Ask for a specific quantity.",
        "question": "What does \"超市\" mean?",
        "options": [
          "wife",
          "Weather forecast passage",
          "open and inclusive",
          "supermarket"
        ],
        "correctIndex": 3,
        "explanation": "超市 (chāoshì) means \"supermarket\"."
      },
      {
        "instruction": "The vendor gives you change. Count it.",
        "question": "Which character means \"now\"?",
        "options": [
          "猛",
          "落后",
          "衣",
          "现在"
        ],
        "correctIndex": 3,
        "explanation": "\"now\" is written as 现在 (xiànzài)."
      },
      {
        "instruction": "You see something pretty. Describe it.",
        "question": "How do you pronounce \"看医生\"?",
        "options": [
          "yǎnyuán",
          "",
          "kàn yīshēng",
          "shǎo"
        ],
        "correctIndex": 2,
        "explanation": "看医生 is pronounced kàn yīshēng."
      },
      {
        "instruction": "Thank the vendor and say goodbye.",
        "question": "What does \"默\" mean?",
        "options": [
          "component of 幽默",
          "museum",
          "component of 平衡",
          "component of 挑战"
        ],
        "correctIndex": 0,
        "explanation": "默 () means \"component of 幽默\"."
      }
    ]
  },
  {
    "id": "ms_35",
    "title": "Visiting a Chinese Doctor",
    "theme": "contemporary_life",
    "description": "You're not feeling well during your stay in China. Visit a clinic and describe your symptoms.",
    "prereqNodeIds": [
      "c_5b9c",
      "c_8ba1",
      "c_7a0e",
      "rd_4ea4901a5de55177",
      "w_4e305bcc"
    ],
    "steps": [
      {
        "instruction": "Arrive at the hospital. What does 医院 mean?",
        "question": "What does \"丝绸之路\" mean?",
        "options": [
          "city/wall",
          "Silk Road passage",
          "exchange rate",
          "exam/test"
        ],
        "correctIndex": 1,
        "explanation": "丝绸之路 (sīchóu zhī lù) means \"Silk Road passage\"."
      },
      {
        "instruction": "Tell the receptionist you need to see a doctor.",
        "question": "Which character means \"component of 背包\"?",
        "options": [
          "背",
          "迅",
          "布",
          "敬"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 背包\" is written as 背 ()."
      },
      {
        "instruction": "The doctor asks what's wrong. Describe your symptom.",
        "question": "How do you pronounce \"核能\"?",
        "options": [
          "",
          "wǎngqiú",
          "hénéng",
          "yǎngqì"
        ],
        "correctIndex": 2,
        "explanation": "核能 is pronounced hénéng."
      },
      {
        "instruction": "How long have you been sick? Express duration.",
        "question": "What does \"粗暴\" mean?",
        "options": [
          "component of 时候",
          "rough/violent",
          "component of 压岁钱",
          "today/now"
        ],
        "correctIndex": 1,
        "explanation": "粗暴 (cūbào) means \"rough/violent\"."
      },
      {
        "instruction": "The doctor examines you. Understand their question about body parts.",
        "question": "Which character means \"temperature\"?",
        "options": [
          "新闻报道",
          "生活质量",
          "温度",
          "光"
        ],
        "correctIndex": 2,
        "explanation": "\"temperature\" is written as 温度 (wēndù)."
      },
      {
        "instruction": "The doctor prescribes medicine. What does 药 mean?",
        "question": "How do you pronounce \"歉\"?",
        "options": [
          "de",
          "nèixiàng",
          "",
          "cāi"
        ],
        "correctIndex": 2,
        "explanation": "歉 is pronounced ."
      },
      {
        "instruction": "Ask how many times a day to take the medicine.",
        "question": "What does \"逮\" mean?",
        "options": [
          "racial discrimination",
          "component of 逮捕",
          "to hinder/obstruct",
          "My dream passage"
        ],
        "correctIndex": 1,
        "explanation": "逮 () means \"component of 逮捕\"."
      },
      {
        "instruction": "The doctor advises rest. Understand the advice.",
        "question": "Which character means \"component of 社交媒体\"?",
        "options": [
          "媒",
          "大学",
          "意",
          "豁达"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 社交媒体\" is written as 媒 ()."
      },
      {
        "instruction": "Ask when you'll feel better.",
        "question": "How do you pronounce \"堂\"?",
        "options": [
          "zhèng",
          "tóusù",
          "",
          ""
        ],
        "correctIndex": 2,
        "explanation": "堂 is pronounced ."
      },
      {
        "instruction": "Thank the doctor.",
        "question": "What does \"发明\" mean?",
        "options": [
          "component of 梦想",
          "component of 婴儿",
          "angry",
          "to invent/invention"
        ],
        "correctIndex": 3,
        "explanation": "发明 (fāmíng) means \"to invent/invention\"."
      }
    ]
  },
  {
    "id": "ms_36",
    "title": "Taking Public Transportation",
    "theme": "contemporary_life",
    "description": "Navigate Beijing's public transportation system. Buy tickets, find your route, and arrive at your destination.",
    "prereqNodeIds": [
      "c_5f85",
      "w_6c1165cf",
      "w_8bc48bba",
      "c_5e74",
      "c_82b1"
    ],
    "steps": [
      {
        "instruction": "Find the subway station. What does 地铁站 mean?",
        "question": "What does \"冰川\" mean?",
        "options": [
          "glacier",
          "to close/concern",
          "component of 牺牲",
          "Only if...then..."
        ],
        "correctIndex": 0,
        "explanation": "冰川 (bīngchuān) means \"glacier\"."
      },
      {
        "instruction": "Buy a ticket. How do you say you want to go to a place?",
        "question": "Which character means \"goodbye\"?",
        "options": [
          "香",
          "温和",
          "再见",
          "A是B"
        ],
        "correctIndex": 2,
        "explanation": "\"goodbye\" is written as 再见 (zàijiàn)."
      },
      {
        "instruction": "Read the station name on the map.",
        "question": "How do you pronounce \"篮球\"?",
        "options": [
          "",
          "zūnzhòng",
          "lánqiú",
          "liǎn"
        ],
        "correctIndex": 2,
        "explanation": "篮球 is pronounced lánqiú."
      },
      {
        "instruction": "Which direction should you go? Understand directions.",
        "question": "What does \"慌\" mean?",
        "options": [
          "male/man",
          "flustered/panic",
          "music class",
          "component of 词语"
        ],
        "correctIndex": 1,
        "explanation": "慌 (huāng) means \"flustered/panic\"."
      },
      {
        "instruction": "The announcement says the next stop. Listen and understand.",
        "question": "Which character means \"component of 录取\"?",
        "options": [
          "辞",
          "宽",
          "取",
          "她"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 录取\" is written as 取 ()."
      },
      {
        "instruction": "Ask a fellow passenger for help.",
        "question": "How do you pronounce \"规\"?",
        "options": [
          "",
          "yīng",
          "",
          ""
        ],
        "correctIndex": 0,
        "explanation": "规 is pronounced ."
      },
      {
        "instruction": "Transfer to another line. Follow the signs.",
        "question": "What does \"反对\" mean?",
        "options": [
          "component of 赞美",
          "stairs/staircase",
          "All / both",
          "to oppose"
        ],
        "correctIndex": 3,
        "explanation": "反对 (fǎnduì) means \"to oppose\"."
      },
      {
        "instruction": "You've arrived! How do you say 'I've arrived'?",
        "question": "Which character means \"performance/show\"?",
        "options": [
          "演出",
          "稚",
          "承",
          "箱子"
        ],
        "correctIndex": 0,
        "explanation": "\"performance/show\" is written as 演出 (yǎnchū)."
      },
      {
        "instruction": "Find the exit. What does 出口 mean?",
        "question": "How do you pronounce \"烹\"?",
        "options": [
          "",
          "shī",
          "gè",
          "gào"
        ],
        "correctIndex": 0,
        "explanation": "烹 is pronounced ."
      },
      {
        "instruction": "Ask for directions to your final destination.",
        "question": "What does \"烹\" mean?",
        "options": [
          "to expect/look forward to",
          "component of 烹饪",
          "component of 魅力",
          "drought"
        ],
        "correctIndex": 1,
        "explanation": "烹 () means \"component of 烹饪\"."
      }
    ]
  },
  {
    "id": "ms_37",
    "title": "Celebrating Chinese New Year",
    "theme": "families_communities",
    "description": "Experience Chinese New Year with your host family. Learn about traditions, food, and greetings.",
    "prereqNodeIds": [
      "c_5c5e",
      "w_53d1660e",
      "c_989c",
      "c_518d",
      "w_8f855bfc"
    ],
    "steps": [
      {
        "instruction": "Your host says 新年好! What does this mean?",
        "question": "What does \"骗\" mean?",
        "options": [
          "component of 广播",
          "to deceive/cheat",
          "component of 兴奋",
          "historic site"
        ],
        "correctIndex": 1,
        "explanation": "骗 (piàn) means \"to deceive/cheat\"."
      },
      {
        "instruction": "Learn about the tradition of giving red envelopes.",
        "question": "Which character means \"thing/stuff\"?",
        "options": [
          "阻",
          "祝",
          "安慰",
          "东西"
        ],
        "correctIndex": 3,
        "explanation": "\"thing/stuff\" is written as 东西 (dōngxi)."
      },
      {
        "instruction": "Help prepare traditional foods. What is 饺子?",
        "question": "How do you pronounce \"渐\"?",
        "options": [
          "",
          "kǎohé",
          "èr yǎnghuà tàn",
          "fān"
        ],
        "correctIndex": 0,
        "explanation": "渐 is pronounced ."
      },
      {
        "instruction": "The family gathers for dinner. Who is at the table?",
        "question": "What does \"织\" mean?",
        "options": [
          "component of 颁奖",
          "to carry/worry",
          "to weave/organize",
          "badminton"
        ],
        "correctIndex": 2,
        "explanation": "织 (zhī) means \"to weave/organize\"."
      },
      {
        "instruction": "Watch fireworks. Describe what you see.",
        "question": "Which character means \"to go out/exit\"?",
        "options": [
          "民族",
          "出",
          "恩",
          "文"
        ],
        "correctIndex": 1,
        "explanation": "\"to go out/exit\" is written as 出 (chū)."
      },
      {
        "instruction": "Give a New Year blessing to the grandparents.",
        "question": "How do you pronounce \"干\"?",
        "options": [
          "guǎnggào",
          "gān",
          "",
          "yúròu"
        ],
        "correctIndex": 1,
        "explanation": "干 is pronounced gān."
      },
      {
        "instruction": "Talk about your New Year's resolutions.",
        "question": "What does \"哥哥\" mean?",
        "options": [
          "component of 乒乓球",
          "to repair/study",
          "curiosity",
          "older brother"
        ],
        "correctIndex": 3,
        "explanation": "哥哥 (gēge) means \"older brother\"."
      },
      {
        "instruction": "Learn about the zodiac animal for this year.",
        "question": "Which character means \"sound/voice\"?",
        "options": [
          "核",
          "声",
          "午餐",
          "量"
        ],
        "correctIndex": 1,
        "explanation": "\"sound/voice\" is written as 声 (shēng)."
      },
      {
        "instruction": "Post Spring Festival couplets. What do they say?",
        "question": "How do you pronounce \"而\"?",
        "options": [
          "guò shēngrì",
          "",
          "kū",
          "jiāoliú"
        ],
        "correctIndex": 1,
        "explanation": "而 is pronounced ."
      },
      {
        "instruction": "Reflect on the experience. Express your feelings.",
        "question": "What does \"丰富\" mean?",
        "options": [
          "Yangtze River",
          "to push",
          "to pardon",
          "rich/abundant"
        ],
        "correctIndex": 3,
        "explanation": "丰富 (fēngfù) means \"rich/abundant\"."
      }
    ]
  },
  {
    "id": "ms_38",
    "title": "Making Friends Online",
    "theme": "science_technology",
    "description": "Join a Chinese social media platform and practice chatting with native speakers.",
    "prereqNodeIds": [
      "w_671f5f85",
      "c_5c9b",
      "c_8baf",
      "g_le_completion",
      "w_656c4f69"
    ],
    "steps": [
      {
        "instruction": "Create your profile. Fill in your name.",
        "question": "What does \"世界\" mean?",
        "options": [
          "component of 牛肉",
          "to practice",
          "world",
          "component of 硕士"
        ],
        "correctIndex": 2,
        "explanation": "世界 (shìjiè) means \"world\"."
      },
      {
        "instruction": "Write a short self-introduction.",
        "question": "Which character means \"champion\"?",
        "options": [
          "冠军",
          "收入",
          "大学",
          "战争"
        ],
        "correctIndex": 0,
        "explanation": "\"champion\" is written as 冠军 (guànjūn)."
      },
      {
        "instruction": "Someone sends you a friend request. Accept and greet them.",
        "question": "How do you pronounce \"亡羊补牢\"?",
        "options": [
          "wáng yáng bǔ láo",
          "",
          "gòumǎilì",
          "zhèngyì"
        ],
        "correctIndex": 0,
        "explanation": "亡羊补牢 is pronounced wáng yáng bǔ láo."
      },
      {
        "instruction": "They ask where you're from. Respond.",
        "question": "What does \"尼\" mean?",
        "options": [
          "component of 信封",
          "to practice/exercise",
          "younger brother",
          "component of 基尼系数"
        ],
        "correctIndex": 3,
        "explanation": "尼 () means \"component of 基尼系数\"."
      },
      {
        "instruction": "Share your interests.",
        "question": "Which character means \"hello\"?",
        "options": [
          "责任感",
          "你好",
          "微",
          "实验室"
        ],
        "correctIndex": 1,
        "explanation": "\"hello\" is written as 你好 (nǐhǎo)."
      },
      {
        "instruction": "They send you a photo. Comment on it.",
        "question": "How do you pronounce \"鼓\"?",
        "options": [
          "huìhuà",
          "",
          "",
          ""
        ],
        "correctIndex": 1,
        "explanation": "鼓 is pronounced ."
      },
      {
        "instruction": "Discuss your favorite music or movie.",
        "question": "What does \"了\" mean?",
        "options": [
          "washing machine",
          "more/even more",
          "completed action particle",
          "change/variation"
        ],
        "correctIndex": 2,
        "explanation": "了 (le) means \"completed action particle\"."
      },
      {
        "instruction": "Plan to video chat. Suggest a time.",
        "question": "Which character means \"to have a fever\"?",
        "options": [
          "安",
          "发烧",
          "狱",
          "视频会议"
        ],
        "correctIndex": 1,
        "explanation": "\"to have a fever\" is written as 发烧 (fāshāo)."
      },
      {
        "instruction": "Learn internet slang. What does 哈哈 mean?",
        "question": "How do you pronounce \"画家\"?",
        "options": [
          "wánshàn",
          "",
          "hùxiāng",
          "huàjiā"
        ],
        "correctIndex": 3,
        "explanation": "画家 is pronounced huàjiā."
      },
      {
        "instruction": "Say goodbye and make plans to chat again.",
        "question": "What does \"扩大\" mean?",
        "options": [
          "to expand/enlarge",
          "impartial/fair",
          "wonderful/clever",
          "moreover/and also"
        ],
        "correctIndex": 0,
        "explanation": "扩大 (kuòdà) means \"to expand/enlarge\"."
      }
    ]
  },
  {
    "id": "ms_39",
    "title": "Exploring Chinese History Museum",
    "theme": "personal_public_identities",
    "description": "Visit a Chinese history museum and learn about key historical periods and cultural artifacts.",
    "prereqNodeIds": [
      "w_5f006717",
      "w_88d95b50",
      "c_5e08",
      "w_4e2d6587",
      "w_63d09ad8"
    ],
    "steps": [
      {
        "instruction": "Buy tickets at the entrance. How much are they?",
        "question": "What does \"故宫\" mean?",
        "options": [
          "smelly/stinky",
          "component of 牙痛",
          "Forbidden City",
          "school"
        ],
        "correctIndex": 2,
        "explanation": "故宫 (Gùgōng) means \"Forbidden City\"."
      },
      {
        "instruction": "Read the museum map. Find the ancient history section.",
        "question": "Which character means \"to pardon\"?",
        "options": [
          "再见",
          "稳",
          "赦免",
          "弯"
        ],
        "correctIndex": 2,
        "explanation": "\"to pardon\" is written as 赦免 (shèmiǎn)."
      },
      {
        "instruction": "Learn about the Great Wall. What is it called in Chinese?",
        "question": "How do you pronounce \"小\"?",
        "options": [
          "",
          "xiǎo",
          "tián",
          ""
        ],
        "correctIndex": 1,
        "explanation": "小 is pronounced xiǎo."
      },
      {
        "instruction": "See ancient Chinese writing. What are these characters?",
        "question": "What does \"区别\" mean?",
        "options": [
          "to decelerate",
          "to admit/recognize",
          "difference/distinction",
          "component of 诚恳"
        ],
        "correctIndex": 2,
        "explanation": "区别 (qūbié) means \"difference/distinction\"."
      },
      {
        "instruction": "Learn about a famous Chinese invention.",
        "question": "Which character means \"public\"?",
        "options": [
          "碗",
          "锅",
          "炼",
          "公"
        ],
        "correctIndex": 3,
        "explanation": "\"public\" is written as 公 (gōng)."
      },
      {
        "instruction": "Read a description of a dynasty.",
        "question": "How do you pronounce \"豫\"?",
        "options": [
          "xuéxiào",
          "jīchǎng",
          "",
          ""
        ],
        "correctIndex": 2,
        "explanation": "豫 is pronounced ."
      },
      {
        "instruction": "See traditional Chinese art. Describe a painting.",
        "question": "What does \"社会实践\" mean?",
        "options": [
          "social practice",
          "component of 段落",
          "Silk Road",
          "warm"
        ],
        "correctIndex": 0,
        "explanation": "社会实践 (shèhuì shíjiàn) means \"social practice\"."
      },
      {
        "instruction": "Learn about Chinese philosophy. Who was Confucius?",
        "question": "Which character means \"real/true\"?",
        "options": [
          "熊猫",
          "医",
          "Verb+过",
          "真实"
        ],
        "correctIndex": 3,
        "explanation": "\"real/true\" is written as 真实 (zhēnshí)."
      },
      {
        "instruction": "Visit the gift shop. Buy a souvenir.",
        "question": "How do you pronounce \"补\"?",
        "options": [
          "gòumǎilì",
          "yì",
          "",
          ""
        ],
        "correctIndex": 2,
        "explanation": "补 is pronounced ."
      },
      {
        "instruction": "Write a postcard about your visit.",
        "question": "What does \"领导力\" mean?",
        "options": [
          "to resign",
          "leadership",
          "component of 日新月异",
          "to cherish/treasure"
        ],
        "correctIndex": 1,
        "explanation": "领导力 (lǐngdǎolì) means \"leadership\"."
      }
    ]
  },
  {
    "id": "ms_40",
    "title": "Preparing for an AP Chinese Exam",
    "theme": "contemporary_life",
    "description": "Practice exam-style tasks: reading comprehension, listening prompts, and structured writing.",
    "prereqNodeIds": [
      "c_8d38",
      "w_793e4fdd",
      "w_542c4f17",
      "w_5b8c5584",
      "c_5987"
    ],
    "steps": [
      {
        "instruction": "Read a passage and identify the main topic.",
        "question": "What does \"联\" mean?",
        "options": [
          "bowl",
          "to inherit",
          "to unite/connect",
          "component of 彼此"
        ],
        "correctIndex": 2,
        "explanation": "联 (lián) means \"to unite/connect\"."
      },
      {
        "instruction": "Answer a vocabulary question from the passage.",
        "question": "Which character means \"cooked rice\"?",
        "options": [
          "情",
          "米饭",
          "牙痛",
          "就业"
        ],
        "correctIndex": 1,
        "explanation": "\"cooked rice\" is written as 米饭 (mǐfàn)."
      },
      {
        "instruction": "Identify the author's purpose.",
        "question": "How do you pronounce \"购买力\"?",
        "options": [
          "yuànwàng",
          "",
          "zhēn",
          "gòumǎilì"
        ],
        "correctIndex": 3,
        "explanation": "购买力 is pronounced gòumǎilì."
      },
      {
        "instruction": "Answer a detail question.",
        "question": "What does \"这\" mean?",
        "options": [
          "component of 垃圾分类",
          "advanced",
          "component of 原谅",
          "this"
        ],
        "correctIndex": 3,
        "explanation": "这 (zhè) means \"this\"."
      },
      {
        "instruction": "Understand a cultural reference in the text.",
        "question": "Which character means \"where there's a will there's a way\"?",
        "options": [
          "非物质文化遗产",
          "收件人",
          "有志者事竟成",
          "牺牲"
        ],
        "correctIndex": 2,
        "explanation": "\"where there's a will there's a way\" is written as 有志者事竟成 (yǒu zhì zhě shì jìng chéng)."
      },
      {
        "instruction": "Practice a presentational writing prompt.",
        "question": "How do you pronounce \"证\"?",
        "options": [
          "ānquán",
          "",
          "měishù",
          "zhèng"
        ],
        "correctIndex": 3,
        "explanation": "证 is pronounced zhèng."
      },
      {
        "instruction": "Respond to an interpersonal reading.",
        "question": "What does \"勤奋\" mean?",
        "options": [
          "For someone do",
          "component of 保险",
          "frigid zone",
          "diligent/hardworking"
        ],
        "correctIndex": 3,
        "explanation": "勤奋 (qínfèn) means \"diligent/hardworking\"."
      },
      {
        "instruction": "Identify the correct grammar structure.",
        "question": "Which character means \"ecological civilization\"?",
        "options": [
          "北",
          "看",
          "文章",
          "生态文明"
        ],
        "correctIndex": 3,
        "explanation": "\"ecological civilization\" is written as 生态文明 (shēngtài wénmíng)."
      },
      {
        "instruction": "Complete a listening comprehension question.",
        "question": "How do you pronounce \"练习\"?",
        "options": [
          "fǎlǜ",
          "yōumò",
          "liànxí",
          "zàixiàn xuéxí"
        ],
        "correctIndex": 2,
        "explanation": "练习 is pronounced liànxí."
      },
      {
        "instruction": "Review and self-assess your performance.",
        "question": "What does \"保\" mean?",
        "options": [
          "to protect/keep",
          "component of 针灸",
          "e-commerce",
          "to read aloud"
        ],
        "correctIndex": 0,
        "explanation": "保 (bǎo) means \"to protect/keep\"."
      }
    ]
  },
  {
    "id": "ms_41",
    "title": "Cooking Chinese Food Together",
    "theme": "families_communities",
    "description": "Learn to cook a Chinese dish with your host mother. Follow a recipe and practice food vocabulary.",
    "prereqNodeIds": [
      "w_7a0e6536",
      "c_5267",
      "w_7bee7403",
      "c_5fd8",
      "w_51b35b9a"
    ],
    "steps": [
      {
        "instruction": "Read the recipe title. What dish are you making?",
        "question": "What does \"单\" mean?",
        "options": [
          "luggage/baggage",
          "component of 菜单",
          "to refute",
          "physical education"
        ],
        "correctIndex": 1,
        "explanation": "单 () means \"component of 菜单\"."
      },
      {
        "instruction": "Identify the ingredients. What does 鸡蛋 mean?",
        "question": "Which character means \"juice\"?",
        "options": [
          "实事求是",
          "果汁",
          "修养",
          "疾病"
        ],
        "correctIndex": 1,
        "explanation": "\"juice\" is written as 果汁 (guǒzhī)."
      },
      {
        "instruction": "Measure the ingredients. Understand quantity words.",
        "question": "How do you pronounce \"发布\"?",
        "options": [
          "lǐngdǎo",
          "hēi",
          "túshūguǎn",
          "fābù"
        ],
        "correctIndex": 3,
        "explanation": "发布 is pronounced fābù."
      },
      {
        "instruction": "The recipe says to wash the vegetables. What verb is used?",
        "question": "What does \"直播\" mean?",
        "options": [
          "component of 丝绸之路",
          "component of 邻居",
          "artificial intelligence",
          "live streaming"
        ],
        "correctIndex": 3,
        "explanation": "直播 (zhíbō) means \"live streaming\"."
      },
      {
        "instruction": "Cut the ingredients. What does 切 mean?",
        "question": "Which character means \"component of 留恋\"?",
        "options": [
          "证据",
          "愿望",
          "文化",
          "恋"
        ],
        "correctIndex": 3,
        "explanation": "\"component of 留恋\" is written as 恋 ()."
      },
      {
        "instruction": "Heat the oil. Understand the cooking instruction.",
        "question": "How do you pronounce \"泰山\"?",
        "options": [
          "",
          "xiànshí",
          "",
          "Tàishān"
        ],
        "correctIndex": 3,
        "explanation": "泰山 is pronounced Tàishān."
      },
      {
        "instruction": "Add the seasoning. What is 盐?",
        "question": "What does \"教练\" mean?",
        "options": [
          "healthy/health",
          "to register",
          "component of 猪肉",
          "coach/trainer"
        ],
        "correctIndex": 3,
        "explanation": "教练 (jiàoliàn) means \"coach/trainer\"."
      },
      {
        "instruction": "Stir-fry the dish. How long should you cook it?",
        "question": "Which character means \"component of 与时俱进\"?",
        "options": [
          "俱",
          "脸",
          "你好",
          "逃"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 与时俱进\" is written as 俱 ()."
      },
      {
        "instruction": "Taste the food and give your opinion.",
        "question": "How do you pronounce \"运动\"?",
        "options": [
          "",
          "",
          "yùndòng",
          "shěng"
        ],
        "correctIndex": 2,
        "explanation": "运动 is pronounced yùndòng."
      },
      {
        "instruction": "The dish is ready! Compliment the cook.",
        "question": "What does \"快\" mean?",
        "options": [
          "component of 突然",
          "to reduce/lower",
          "To have / there is",
          "fast/quick/happy"
        ],
        "correctIndex": 3,
        "explanation": "快 (kuài) means \"fast/quick/happy\"."
      }
    ]
  },
  {
    "id": "ms_42",
    "title": "Hiking in the Chinese Mountains",
    "theme": "global_challenges",
    "description": "Go hiking in a scenic Chinese mountain area. Learn nature vocabulary and discuss environmental topics.",
    "prereqNodeIds": [
      "c_5728",
      "w_53d173b0",
      "g_yijing_already",
      "w_68ee6797",
      "c_76fe"
    ],
    "steps": [
      {
        "instruction": "Read the trail sign. What mountain is this?",
        "question": "What does \"预订\" mean?",
        "options": [
          "to reserve/book",
          "zoo",
          "If...then...",
          "component of 时候"
        ],
        "correctIndex": 0,
        "explanation": "预订 (yùdìng) means \"to reserve/book\"."
      },
      {
        "instruction": "Check the weather forecast. What does it say?",
        "question": "Which character means \"pair/double\"?",
        "options": [
          "双",
          "粉",
          "网球",
          "质"
        ],
        "correctIndex": 0,
        "explanation": "\"pair/double\" is written as 双 (shuāng)."
      },
      {
        "instruction": "Identify the trees along the path.",
        "question": "How do you pronounce \"爱\"?",
        "options": [
          "zuòwén",
          "càipǔ xiězuò",
          "fēnzǐ",
          "ài"
        ],
        "correctIndex": 3,
        "explanation": "爱 is pronounced ài."
      },
      {
        "instruction": "You see a river. Describe it.",
        "question": "What does \"护\" mean?",
        "options": [
          "to protect/guard",
          "to move/carry",
          "component of 牺牲",
          "skill/technology"
        ],
        "correctIndex": 0,
        "explanation": "护 (hù) means \"to protect/guard\"."
      },
      {
        "instruction": "A sign warns about the trail. Understand the warning.",
        "question": "Which character means \"to worry\"?",
        "options": [
          "引力",
          "狗",
          "信封",
          "担心"
        ],
        "correctIndex": 3,
        "explanation": "\"to worry\" is written as 担心 (dānxīn)."
      },
      {
        "instruction": "Take a photo of the scenery. Describe what you see.",
        "question": "How do you pronounce \"卖\"?",
        "options": [
          "zuǒ",
          "mài",
          "bà",
          ""
        ],
        "correctIndex": 1,
        "explanation": "卖 is pronounced mài."
      },
      {
        "instruction": "Meet another hiker. Start a conversation.",
        "question": "What does \"电子商务\" mean?",
        "options": [
          "to worry",
          "e-commerce",
          "to consume/spending",
          "music"
        ],
        "correctIndex": 1,
        "explanation": "电子商务 (diànzǐ shāngwù) means \"e-commerce\"."
      },
      {
        "instruction": "Discuss environmental protection.",
        "question": "Which character means \"component of 显著\"?",
        "options": [
          "压",
          "敢",
          "社会",
          "显"
        ],
        "correctIndex": 3,
        "explanation": "\"component of 显著\" is written as 显 ()."
      },
      {
        "instruction": "Read about an endangered species at the information board.",
        "question": "How do you pronounce \"骗\"?",
        "options": [
          "piàn",
          "biānjí",
          "",
          "zǔ'ài"
        ],
        "correctIndex": 0,
        "explanation": "骗 is pronounced piàn."
      },
      {
        "instruction": "Reach the summit! Express your feelings.",
        "question": "What does \"古迹\" mean?",
        "options": [
          "component of 终于",
          "component of 矛盾",
          "beef",
          "historic site"
        ],
        "correctIndex": 3,
        "explanation": "古迹 (gǔjì) means \"historic site\"."
      }
    ]
  },
  {
    "id": "ms_43",
    "title": "Attending a Chinese Wedding",
    "theme": "families_communities",
    "description": "You've been invited to a traditional Chinese wedding. Learn customs, give blessings, and celebrate.",
    "prereqNodeIds": [
      "w_62a57eb8",
      "c_806a",
      "w_548c5e7351715904",
      "c_8457",
      "rd_7f514e0a8d2d7269"
    ],
    "steps": [
      {
        "instruction": "Read the wedding invitation. When is the wedding?",
        "question": "What does \"洗衣机\" mean?",
        "options": [
          "washing machine",
          "new",
          "bronze medal",
          "component of 四大发明"
        ],
        "correctIndex": 0,
        "explanation": "洗衣机 (xǐyījī) means \"washing machine\"."
      },
      {
        "instruction": "Buy a gift. What's appropriate?",
        "question": "Which character means \"capital city\"?",
        "options": [
          "赔偿",
          "坐公车",
          "椒",
          "首都"
        ],
        "correctIndex": 3,
        "explanation": "\"capital city\" is written as 首都 (shǒudū)."
      },
      {
        "instruction": "Arrive and greet the couple. Give a blessing.",
        "question": "How do you pronounce \"非物质文化遗产\"?",
        "options": [
          "",
          "dǎsuàn",
          "dònghuàpiàn",
          "fēi wùzhì wénhuà yíchǎn"
        ],
        "correctIndex": 3,
        "explanation": "非物质文化遗产 is pronounced fēi wùzhì wénhuà yíchǎn."
      },
      {
        "instruction": "Learn about the tea ceremony tradition.",
        "question": "What does \"证据\" mean?",
        "options": [
          "middle school",
          "evidence/proof",
          "wallet/purse",
          "component of 贷款"
        ],
        "correctIndex": 1,
        "explanation": "证据 (zhèngjù) means \"evidence/proof\"."
      },
      {
        "instruction": "At the banquet, identify the dishes on the table.",
        "question": "Which character means \"to combine/fit\"?",
        "options": [
          "报",
          "合",
          "背",
          "革"
        ],
        "correctIndex": 1,
        "explanation": "\"to combine/fit\" is written as 合 (hé)."
      },
      {
        "instruction": "Toast the couple. What do you say?",
        "question": "How do you pronounce \"足球\"?",
        "options": [
          "zúqiú",
          "xuǎnjǔ",
          "jī",
          "cāi"
        ],
        "correctIndex": 0,
        "explanation": "足球 is pronounced zúqiú."
      },
      {
        "instruction": "Chat with other guests. Introduce yourself.",
        "question": "What does \"现实\" mean?",
        "options": [
          "reality",
          "forever/always",
          "component of 骄傲",
          "pregnant woman"
        ],
        "correctIndex": 0,
        "explanation": "现实 (xiànshí) means \"reality\"."
      },
      {
        "instruction": "Learn about the meaning of red at weddings.",
        "question": "Which character means \"component of 其实\"?",
        "options": [
          "文化",
          "医生",
          "实",
          "驾"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 其实\" is written as 实 ()."
      },
      {
        "instruction": "Watch a performance. Describe it.",
        "question": "How do you pronounce \"公共汽车\"?",
        "options": [
          "mùbiāo",
          "gōnggòng qìchē",
          "zhìdù",
          "rúguǒ...jiù..."
        ],
        "correctIndex": 1,
        "explanation": "公共汽车 is pronounced gōnggòng qìchē."
      },
      {
        "instruction": "Say goodbye and wish the couple well.",
        "question": "What does \"表达\" mean?",
        "options": [
          "component of 荒谬",
          "component of 其实",
          "to express",
          "passport"
        ],
        "correctIndex": 2,
        "explanation": "表达 (biǎodá) means \"to express\"."
      }
    ]
  },
  {
    "id": "ms_44",
    "title": "Job Interview in Chinese",
    "theme": "contemporary_life",
    "description": "Prepare for and attend a mock job interview in Chinese. Practice professional language and etiquette.",
    "prereqNodeIds": [
      "w_51fa53e3",
      "rd_4e2d5916658753165dee5f02",
      "c_8c6b",
      "c_62ff",
      "c_9f3b"
    ],
    "steps": [
      {
        "instruction": "Read the job posting. What position is it for?",
        "question": "What does \"军事\" mean?",
        "options": [
          "pretty/beautiful",
          "military",
          "to hope/long for",
          "component of 发烧"
        ],
        "correctIndex": 1,
        "explanation": "军事 (jūnshì) means \"military\"."
      },
      {
        "instruction": "Prepare your resume. How do you say 'work experience'?",
        "question": "Which character means \"bronze medal\"?",
        "options": [
          "铜牌",
          "涵",
          "指导",
          "阳"
        ],
        "correctIndex": 0,
        "explanation": "\"bronze medal\" is written as 铜牌 (tóngpái)."
      },
      {
        "instruction": "Greet the interviewer formally.",
        "question": "How do you pronounce \"丈夫\"?",
        "options": [
          "kàn yīshēng",
          "zhàngfu",
          "qūbié",
          "shuǐ"
        ],
        "correctIndex": 1,
        "explanation": "丈夫 is pronounced zhàngfu."
      },
      {
        "instruction": "The interviewer asks about your education. Respond.",
        "question": "What does \"骗\" mean?",
        "options": [
          "to deceive/cheat",
          "component of 幼稚",
          "home/family",
          "smartphone"
        ],
        "correctIndex": 0,
        "explanation": "骗 (piàn) means \"to deceive/cheat\"."
      },
      {
        "instruction": "Describe your skills and strengths.",
        "question": "Which character means \"component of 广泛\"?",
        "options": [
          "泛",
          "救灾",
          "幼儿园",
          "悲观"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 广泛\" is written as 泛 ()."
      },
      {
        "instruction": "Explain why you want this job.",
        "question": "How do you pronounce \"拒绝\"?",
        "options": [
          "jùjué",
          "yángtái",
          "dǎoyóu",
          "bàn"
        ],
        "correctIndex": 0,
        "explanation": "拒绝 is pronounced jùjué."
      },
      {
        "instruction": "The interviewer asks about your weaknesses. Respond diplomatically.",
        "question": "What does \"偏旁\" mean?",
        "options": [
          "sharing economy",
          "to approve/agree",
          "radical (of character)",
          "component of 赔偿"
        ],
        "correctIndex": 2,
        "explanation": "偏旁 (piānpáng) means \"radical (of character)\"."
      },
      {
        "instruction": "Ask about the work schedule.",
        "question": "Which character means \"component of 捐款\"?",
        "options": [
          "捐",
          "站",
          "月饼",
          "喝"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 捐款\" is written as 捐 ()."
      },
      {
        "instruction": "Discuss salary expectations.",
        "question": "How do you pronounce \"当\"?",
        "options": [
          "zhēng",
          "tài",
          "zǔ'ài",
          ""
        ],
        "correctIndex": 3,
        "explanation": "当 is pronounced ."
      },
      {
        "instruction": "Thank the interviewer and follow up.",
        "question": "What does \"空调\" mean?",
        "options": [
          "Art appreciation passage",
          "air conditioning",
          "component of 时候",
          "common/together"
        ],
        "correctIndex": 1,
        "explanation": "空调 (kōngtiáo) means \"air conditioning\"."
      }
    ]
  },
  {
    "id": "ms_45",
    "title": "Discussing Chinese Art and Literature",
    "theme": "beauty_aesthetics",
    "description": "Visit an art gallery and discuss Chinese calligraphy, painting, and poetry with a local artist.",
    "prereqNodeIds": [
      "c_96c4",
      "c_5de6",
      "w_975e84255229",
      "w_62536298",
      "c_6f20"
    ],
    "steps": [
      {
        "instruction": "Enter the gallery. Read the exhibition title.",
        "question": "What does \"应该\" mean?",
        "options": [
          "to cultivate/train",
          "time/moment",
          "should/ought to",
          "to praise"
        ],
        "correctIndex": 2,
        "explanation": "应该 (yīnggāi) means \"should/ought to\"."
      },
      {
        "instruction": "See a Chinese calligraphy piece. What style is it?",
        "question": "Which character means \"Transportation passage\"?",
        "options": [
          "交通工具",
          "辣",
          "惰",
          "含"
        ],
        "correctIndex": 0,
        "explanation": "\"Transportation passage\" is written as 交通工具 (jiāotōng gōngjù)."
      },
      {
        "instruction": "The artist explains the meaning of a painting.",
        "question": "How do you pronounce \"应该\"?",
        "options": [
          "yìwù",
          "",
          "yīnggāi",
          ""
        ],
        "correctIndex": 2,
        "explanation": "应该 is pronounced yīnggāi."
      },
      {
        "instruction": "Learn about the Four Treasures of the Study.",
        "question": "What does \"印象\" mean?",
        "options": [
          "point/o'clock",
          "glacier",
          "impression",
          "component of 刚好"
        ],
        "correctIndex": 2,
        "explanation": "印象 (yìnxiàng) means \"impression\"."
      },
      {
        "instruction": "Read a famous Chinese poem.",
        "question": "Which character means \"Internet safety passage\"?",
        "options": [
          "网络安全",
          "交",
          "垃圾分类",
          "阻"
        ],
        "correctIndex": 0,
        "explanation": "\"Internet safety passage\" is written as 网络安全 (wǎngluò ānquán)."
      },
      {
        "instruction": "Discuss the relationship between calligraphy and painting.",
        "question": "How do you pronounce \"对+Sb+Verb\"?",
        "options": [
          "jiǎ",
          "kāng",
          "duì + sb + verb",
          "wánshàn"
        ],
        "correctIndex": 2,
        "explanation": "对+Sb+Verb is pronounced duì + sb + verb."
      },
      {
        "instruction": "Try writing a character with a brush. Describe the experience.",
        "question": "What does \"建设\" mean?",
        "options": [
          "to let/allow",
          "to construct/build",
          "component of 蓝色",
          "to pay attention/follow"
        ],
        "correctIndex": 1,
        "explanation": "建设 (jiànshè) means \"to construct/build\"."
      },
      {
        "instruction": "Compare Chinese and Western art styles.",
        "question": "Which character means \"Security Council\"?",
        "options": [
          "闲",
          "用",
          "才华",
          "安全理事会"
        ],
        "correctIndex": 3,
        "explanation": "\"Security Council\" is written as 安全理事会 (ānquán lǐshìhuì)."
      },
      {
        "instruction": "Express your appreciation for the artwork.",
        "question": "How do you pronounce \"经济特区\"?",
        "options": [
          "miáoxiě chéngshì",
          "zhuǎnbō",
          "",
          "jīngjì tèqū"
        ],
        "correctIndex": 3,
        "explanation": "经济特区 is pronounced jīngjì tèqū."
      },
      {
        "instruction": "Buy an art print and ask about the artist.",
        "question": "What does \"任\" mean?",
        "options": [
          "component of 熊猫",
          "to summarize",
          "continent/mainland",
          "assign/duty"
        ],
        "correctIndex": 3,
        "explanation": "任 (rèn) means \"assign/duty\"."
      }
    ]
  },
  {
    "id": "ms_46",
    "title": "Environmental Awareness Campaign",
    "theme": "global_challenges",
    "description": "Participate in a school environmental awareness campaign. Learn about pollution, recycling, and conservation.",
    "prereqNodeIds": [
      "w_56e27ed354084f5c",
      "c_6f14",
      "c_7aef",
      "c_8fd1",
      "w_8bc48bba"
    ],
    "steps": [
      {
        "instruction": "Read the campaign poster. What's the theme?",
        "question": "What does \"扶贫\" mean?",
        "options": [
          "contain/face",
          "poverty alleviation",
          "humidity",
          "Again (future)"
        ],
        "correctIndex": 1,
        "explanation": "扶贫 (fúpín) means \"poverty alleviation\"."
      },
      {
        "instruction": "Learn the word for 'environment' in Chinese.",
        "question": "Which character means \"component of 京剧\"?",
        "options": [
          "剧",
          "生物",
          "射",
          "恰"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 京剧\" is written as 剧 ()."
      },
      {
        "instruction": "Discuss water pollution. What does 污染 mean?",
        "question": "How do you pronounce \"乡\"?",
        "options": [
          "",
          "qínfèn",
          "huì + verb",
          "zuòjiā"
        ],
        "correctIndex": 0,
        "explanation": "乡 is pronounced ."
      },
      {
        "instruction": "Learn about recycling practices in China.",
        "question": "What does \"旅行日记\" mean?",
        "options": [
          "cheerful/open",
          "component of 突然",
          "Writing: travel diary",
          "zoo"
        ],
        "correctIndex": 2,
        "explanation": "旅行日记 (lǚxíng rìjì) means \"Writing: travel diary\"."
      },
      {
        "instruction": "Create a slogan for the campaign.",
        "question": "Which character means \"component of 申请\"?",
        "options": [
          "魅",
          "细胞",
          "矛",
          "申"
        ],
        "correctIndex": 3,
        "explanation": "\"component of 申请\" is written as 申 ()."
      },
      {
        "instruction": "Present statistics about air quality.",
        "question": "How do you pronounce \"午\"?",
        "options": [
          "chúfáng",
          "",
          "",
          ""
        ],
        "correctIndex": 1,
        "explanation": "午 is pronounced ."
      },
      {
        "instruction": "Discuss solutions to environmental problems.",
        "question": "What does \"越来越+Adj\" mean?",
        "options": [
          "gardening",
          "More and more + adj",
          "component of 退货",
          "component of 烹饪"
        ],
        "correctIndex": 1,
        "explanation": "越来越+Adj (yuè lái yuè + adj) means \"More and more + adj\"."
      },
      {
        "instruction": "Learn about renewable energy in China.",
        "question": "Which character means \"name\"?",
        "options": [
          "弟弟",
          "障",
          "核能",
          "名字"
        ],
        "correctIndex": 3,
        "explanation": "\"name\" is written as 名字 (míngzi)."
      },
      {
        "instruction": "Write a pledge to protect the environment.",
        "question": "How do you pronounce \"率\"?",
        "options": [
          "fǎnduì",
          "",
          "chǔlǐ",
          ""
        ],
        "correctIndex": 1,
        "explanation": "率 is pronounced ."
      },
      {
        "instruction": "Reflect on what you've learned.",
        "question": "What does \"案\" mean?",
        "options": [
          "component of 牛肉",
          "backpack",
          "component of 档案",
          "component of 骄傲"
        ],
        "correctIndex": 2,
        "explanation": "案 () means \"component of 档案\"."
      }
    ]
  },
  {
    "id": "ms_47",
    "title": "Chinese Music and Dance Performance",
    "theme": "beauty_aesthetics",
    "description": "Attend a traditional Chinese music and dance performance. Learn about instruments and dance forms.",
    "prereqNodeIds": [
      "c_6697",
      "c_5f2f",
      "c_5e8f",
      "w_507650cf",
      "c_6b8b"
    ],
    "steps": [
      {
        "instruction": "Read the performance program. What's showing tonight?",
        "question": "What does \"名人传记\" mean?",
        "options": [
          "component of 民主",
          "to sign (agreement)",
          "to contend/fight",
          "Celebrity biography passage"
        ],
        "correctIndex": 3,
        "explanation": "名人传记 (míngrén zhuànjì) means \"Celebrity biography passage\"."
      },
      {
        "instruction": "Identify a traditional Chinese instrument.",
        "question": "Which character means \"advertisement\"?",
        "options": [
          "广告",
          "演讲稿",
          "世界贸易组织",
          "期望"
        ],
        "correctIndex": 0,
        "explanation": "\"advertisement\" is written as 广告 (guǎnggào)."
      },
      {
        "instruction": "The performer plays a famous piece. What is it about?",
        "question": "How do you pronounce \"幸福指数\"?",
        "options": [
          "xìngfú zhǐshù",
          "bīngmǎyǒng",
          "fēnliè",
          ""
        ],
        "correctIndex": 0,
        "explanation": "幸福指数 is pronounced xìngfú zhǐshù."
      },
      {
        "instruction": "Learn about the guzheng. What kind of instrument is it?",
        "question": "What does \"求\" mean?",
        "options": [
          "component of 足球",
          "component of 区块链",
          "component of 即时通讯",
          "component of 追求"
        ],
        "correctIndex": 3,
        "explanation": "求 () means \"component of 追求\"."
      },
      {
        "instruction": "Watch a traditional dance. Describe the movements.",
        "question": "Which character means \"face\"?",
        "options": [
          "句子",
          "码",
          "脸",
          "苹果"
        ],
        "correctIndex": 2,
        "explanation": "\"face\" is written as 脸 (liǎn)."
      },
      {
        "instruction": "The dancer wears a beautiful costume. Describe it.",
        "question": "How do you pronounce \"密\"?",
        "options": [
          "",
          "gǔlì",
          "wénjìng",
          "yuánzǐ"
        ],
        "correctIndex": 0,
        "explanation": "密 is pronounced ."
      },
      {
        "instruction": "Learn about the meaning behind the dance.",
        "question": "What does \"推\" mean?",
        "options": [
          "suitable/cheap",
          "Silk Road",
          "to push",
          "component of 孕妇"
        ],
        "correctIndex": 2,
        "explanation": "推 (tuī) means \"to push\"."
      },
      {
        "instruction": "Compare traditional and modern Chinese music.",
        "question": "Which character means \"to come\"?",
        "options": [
          "术",
          "锅",
          "来",
          "校园"
        ],
        "correctIndex": 2,
        "explanation": "\"to come\" is written as 来 (lái)."
      },
      {
        "instruction": "Express your feelings about the performance.",
        "question": "How do you pronounce \"姐姐\"?",
        "options": [
          "xǐyījī",
          "",
          "diàn",
          "jiějie"
        ],
        "correctIndex": 3,
        "explanation": "姐姐 is pronounced jiějie."
      },
      {
        "instruction": "Write a review of the show.",
        "question": "What does \"书\" mean?",
        "options": [
          "to praise/admire",
          "book",
          "true/real",
          "component of 被动"
        ],
        "correctIndex": 1,
        "explanation": "书 (shū) means \"book\"."
      }
    ]
  },
  {
    "id": "ms_48",
    "title": "Planning a Trip to Xi'an",
    "theme": "contemporary_life",
    "description": "Plan a trip to Xi'an to see the Terracotta Warriors. Book transportation, find accommodation, and create an itinerary.",
    "prereqNodeIds": [
      "w_70ed5e26",
      "c_58eb",
      "c_86cb",
      "c_8083",
      "rd_4e2d56fd7ecf6d4e53d15c55"
    ],
    "steps": [
      {
        "instruction": "Research Xi'an. What is it famous for?",
        "question": "What does \"康\" mean?",
        "options": [
          "person/people",
          "snow",
          "healthy/peaceful",
          "imagination"
        ],
        "correctIndex": 2,
        "explanation": "康 (kāng) means \"healthy/peaceful\"."
      },
      {
        "instruction": "Book a train ticket. How do you ask for one?",
        "question": "Which character means \"tai chi\"?",
        "options": [
          "市",
          "堂",
          "导",
          "太极拳"
        ],
        "correctIndex": 3,
        "explanation": "\"tai chi\" is written as 太极拳 (tàijíquán)."
      },
      {
        "instruction": "Find a hotel. Understand the room description.",
        "question": "How do you pronounce \"推\"?",
        "options": [
          "",
          "fǎnbó",
          "tuī",
          "lì"
        ],
        "correctIndex": 2,
        "explanation": "推 is pronounced tuī."
      },
      {
        "instruction": "Create a day-by-day itinerary.",
        "question": "What does \"辞\" mean?",
        "options": [
          "emerging market",
          "component of 啤酒",
          "debt",
          "component of 辞职"
        ],
        "correctIndex": 3,
        "explanation": "辞 () means \"component of 辞职\"."
      },
      {
        "instruction": "Arrive in Xi'an. Ask for directions to the hotel.",
        "question": "Which character means \"component of 公检法\"?",
        "options": [
          "检",
          "生",
          "破",
          "终"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 公检法\" is written as 检 ()."
      },
      {
        "instruction": "Visit the Terracotta Warriors. Buy an entrance ticket.",
        "question": "How do you pronounce \"情\"?",
        "options": [
          "bīngchuān",
          "qíng",
          "chòu",
          "xìnfēng"
        ],
        "correctIndex": 1,
        "explanation": "情 is pronounced qíng."
      },
      {
        "instruction": "Read the information about the warriors.",
        "question": "What does \"军\" mean?",
        "options": [
          "component of 军人",
          "to donate money",
          "Green travel passage",
          "step by step/gradually"
        ],
        "correctIndex": 0,
        "explanation": "军 () means \"component of 军人\"."
      },
      {
        "instruction": "Try local Xi'an food. What is 肉夹馍?",
        "question": "Which character means \"component of 妥协\"?",
        "options": [
          "在学校",
          "队",
          "躁",
          "协"
        ],
        "correctIndex": 3,
        "explanation": "\"component of 妥协\" is written as 协 ()."
      },
      {
        "instruction": "Visit the city wall. Describe the view.",
        "question": "How do you pronounce \"中学\"?",
        "options": [
          "zhōngxué",
          "fān",
          "cháng",
          "yǐng"
        ],
        "correctIndex": 0,
        "explanation": "中学 is pronounced zhōngxué."
      },
      {
        "instruction": "Share your trip highlights with a friend.",
        "question": "What does \"难民\" mean?",
        "options": [
          "public welfare",
          "refugee",
          "to miss/cherish",
          "component of 教育"
        ],
        "correctIndex": 1,
        "explanation": "难民 (nànmín) means \"refugee\"."
      }
    ]
  },
  {
    "id": "ms_49",
    "title": "Chinese Tea Ceremony",
    "theme": "beauty_aesthetics",
    "description": "Participate in a traditional Chinese tea ceremony. Learn about tea culture, types of tea, and proper etiquette.",
    "prereqNodeIds": [
      "c_5ffd",
      "w_773c955c",
      "w_90e895e8",
      "c_8d21",
      "w_59cb7ec8"
    ],
    "steps": [
      {
        "instruction": "Your host welcomes you to the tea house. Respond.",
        "question": "What does \"素质\" mean?",
        "options": [
          "negotiation",
          "component of 端午节",
          "quality/character",
          "component of 退货"
        ],
        "correctIndex": 2,
        "explanation": "素质 (sùzhì) means \"quality/character\"."
      },
      {
        "instruction": "Learn about different types of Chinese tea.",
        "question": "Which character means \"component of 邮局\"?",
        "options": [
          "间",
          "具体",
          "邮",
          "单"
        ],
        "correctIndex": 2,
        "explanation": "\"component of 邮局\" is written as 邮 ()."
      },
      {
        "instruction": "The host offers you 绿茶. What kind of tea is this?",
        "question": "How do you pronounce \"过分\"?",
        "options": [
          "guòfèn",
          "",
          "",
          ""
        ],
        "correctIndex": 0,
        "explanation": "过分 is pronounced guòfèn."
      },
      {
        "instruction": "Observe the tea preparation. Describe the steps.",
        "question": "What does \"输\" mean?",
        "options": [
          "to lose/transport",
          "to govern/cure",
          "I/me",
          "hypothesis/assume"
        ],
        "correctIndex": 0,
        "explanation": "输 (shū) means \"to lose/transport\"."
      },
      {
        "instruction": "Learn about the importance of water temperature.",
        "question": "Which character means \"challenge\"?",
        "options": [
          "投诉信",
          "款",
          "挑战",
          "才华"
        ],
        "correctIndex": 2,
        "explanation": "\"challenge\" is written as 挑战 (tiǎozhàn)."
      },
      {
        "instruction": "Smell the tea. Describe the aroma.",
        "question": "How do you pronounce \"引力\"?",
        "options": [
          "jiǎo",
          "xiānjìn",
          "yǐnlì",
          "bōcháng"
        ],
        "correctIndex": 2,
        "explanation": "引力 is pronounced yǐnlì."
      },
      {
        "instruction": "Taste the tea. Express your opinion.",
        "question": "What does \"古迹\" mean?",
        "options": [
          "historic site",
          "to chat",
          "cloudy/overcast",
          "subway/metro"
        ],
        "correctIndex": 0,
        "explanation": "古迹 (gǔjì) means \"historic site\"."
      },
      {
        "instruction": "Learn about the health benefits of tea.",
        "question": "Which character means \"component of 留恋\"?",
        "options": [
          "留",
          "诚恳",
          "原因",
          "同情"
        ],
        "correctIndex": 0,
        "explanation": "\"component of 留恋\" is written as 留 ()."
      },
      {
        "instruction": "Ask about the history of Chinese tea culture.",
        "question": "How do you pronounce \"画龙点睛\"?",
        "options": [
          "",
          "zìdònghuà",
          "lājī fēnlèi",
          "huà lóng diǎn jīng"
        ],
        "correctIndex": 3,
        "explanation": "画龙点睛 is pronounced huà lóng diǎn jīng."
      },
      {
        "instruction": "Thank your host and express appreciation.",
        "question": "What does \"弹\" mean?",
        "options": [
          "component of 随遇而安",
          "component of 弹幕",
          "exit",
          "component of 逐渐"
        ],
        "correctIndex": 1,
        "explanation": "弹 () means \"component of 弹幕\"."
      }
    ]
  },
  {
    "id": "ms_50",
    "title": "Discussing Chinese Festivals",
    "theme": "families_communities",
    "description": "Learn about major Chinese festivals throughout the year. Compare them with holidays you know.",
    "prereqNodeIds": [
      "wr_51994fe13a7ed9670b53cb",
      "rd_73af4fdd51fa884c",
      "w_666e901a8bdd",
      "c_7ecd",
      "c_5750"
    ],
    "steps": [
      {
        "instruction": "Learn about 春节 (Spring Festival). When is it?",
        "question": "What does \"混乱\" mean?",
        "options": [
          "capital/resource",
          "phenomenon",
          "consumer",
          "chaos/confusion"
        ],
        "correctIndex": 3,
        "explanation": "混乱 (hùnluàn) means \"chaos/confusion\"."
      },
      {
        "instruction": "What traditions are associated with Mid-Autumn Festival?",
        "question": "Which character means \"eyeball/eye\"?",
        "options": [
          "坐",
          "睛",
          "退",
          "约会"
        ],
        "correctIndex": 1,
        "explanation": "\"eyeball/eye\" is written as 睛 (jīng)."
      },
      {
        "instruction": "Learn about Dragon Boat Festival and its food.",
        "question": "How do you pronounce \"乐\"?",
        "options": [
          "pǔtōnghuà",
          "",
          "",
          "lè"
        ],
        "correctIndex": 3,
        "explanation": "乐 is pronounced lè."
      },
      {
        "instruction": "What is the Lantern Festival? Read about it.",
        "question": "What does \"贸易\" mean?",
        "options": [
          "trade/commerce",
          "to pay attention/follow",
          "component of 选举",
          "government/prefecture"
        ],
        "correctIndex": 0,
        "explanation": "贸易 (màoyì) means \"trade/commerce\"."
      },
      {
        "instruction": "Discuss the importance of family reunions during festivals.",
        "question": "Which character means \"girl\"?",
        "options": [
          "女孩",
          "消防安全",
          "屿",
          "览"
        ],
        "correctIndex": 0,
        "explanation": "\"girl\" is written as 女孩 (nǚhái)."
      },
      {
        "instruction": "Learn about traditional festival foods.",
        "question": "How do you pronounce \"化\"?",
        "options": [
          "",
          "",
          "huà",
          "àn"
        ],
        "correctIndex": 2,
        "explanation": "化 is pronounced huà."
      },
      {
        "instruction": "Compare a Chinese festival with one from your culture.",
        "question": "What does \"层\" mean?",
        "options": [
          "layer/floor",
          "society",
          "component of 武器",
          "wavelength"
        ],
        "correctIndex": 0,
        "explanation": "层 (céng) means \"layer/floor\"."
      },
      {
        "instruction": "Write New Year wishes in Chinese.",
        "question": "Which character means \"email\"?",
        "options": [
          "电子邮件",
          "鸡",
          "配送",
          "快乐"
        ],
        "correctIndex": 0,
        "explanation": "\"email\" is written as 电子邮件 (diànzǐ yóujiàn)."
      },
      {
        "instruction": "Learn about the Chinese zodiac and its significance.",
        "question": "How do you pronounce \"闻\"?",
        "options": [
          "",
          "yǎnyuán",
          "dàikuǎn",
          ""
        ],
        "correctIndex": 0,
        "explanation": "闻 is pronounced ."
      },
      {
        "instruction": "Plan how to celebrate a Chinese festival.",
        "question": "What does \"人工智能时代\" mean?",
        "options": [
          "Writing: movie review",
          "space/aerospace",
          "Age of AI passage",
          "morality/justice"
        ],
        "correctIndex": 2,
        "explanation": "人工智能时代 (réngōng zhìnéng shídài) means \"Age of AI passage\"."
      }
    ]
  }
];
