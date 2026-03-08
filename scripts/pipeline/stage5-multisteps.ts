/**
 * Stage 5: Generate multistep scenarios.
 * ~50 applied mini-projects (8-12 scaffolded steps each) tied to AP themes.
 */

import type { MultistepScenario } from "../../src/types/graph";
import type { NodeWithLesson } from "./stage3-lessons";
import { getCached, setCache } from "./cache";

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface ScenarioTemplate {
  title: string;
  theme: string;
  description: string;
  stepTemplates: Array<{
    instruction: string;
    questionTemplate: string;
    hint?: string;
  }>;
}

const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    title: "Ordering at a Chinese Restaurant",
    theme: "contemporary_life",
    description: "You're dining at a traditional restaurant in Beijing. Navigate the menu, order food, and handle the bill using your Chinese skills.",
    stepTemplates: [
      { instruction: "The host greets you. How do you respond?", questionTemplate: "greeting", hint: "Think about basic greetings" },
      { instruction: "The waiter asks how many people. What's the measure word for people?", questionTemplate: "measure_word" },
      { instruction: "You see 菜 on the menu. What category is this?", questionTemplate: "food_vocab" },
      { instruction: "The waiter recommends a dish. Understand the description.", questionTemplate: "food_description" },
      { instruction: "You want to order tea. How do you say it?", questionTemplate: "beverage" },
      { instruction: "Ask the waiter how much the dish costs.", questionTemplate: "price_question" },
      { instruction: "The waiter says it's very delicious. What word did they use?", questionTemplate: "adjective" },
      { instruction: "You want to order rice. What's the word?", questionTemplate: "staple_food" },
      { instruction: "Ask for the bill.", questionTemplate: "bill_request" },
      { instruction: "Thank the waiter as you leave.", questionTemplate: "thanks" },
    ],
  },
  {
    title: "First Day at a Chinese School",
    theme: "contemporary_life",
    description: "It's your first day as an exchange student at a Chinese high school. Introduce yourself, find your classroom, and make new friends.",
    stepTemplates: [
      { instruction: "The teacher asks your name. Introduce yourself.", questionTemplate: "name_intro" },
      { instruction: "Where are you from? State your nationality.", questionTemplate: "nationality" },
      { instruction: "The teacher introduces you to the class. Understand the introduction.", questionTemplate: "introduction" },
      { instruction: "A classmate asks what you like to do. Answer them.", questionTemplate: "hobbies" },
      { instruction: "Find the classroom. What does 教室 mean?", questionTemplate: "school_vocab" },
      { instruction: "The schedule shows 中文课. What class is this?", questionTemplate: "class_type" },
      { instruction: "Your new friend invites you to lunch. Respond appropriately.", questionTemplate: "invitation" },
      { instruction: "At lunch, discuss your favorite food.", questionTemplate: "food_preference" },
      { instruction: "Exchange phone numbers with your new friend.", questionTemplate: "phone_exchange" },
      { instruction: "Say goodbye at the end of the day.", questionTemplate: "farewell" },
    ],
  },
  {
    title: "Writing a Letter to a Host Family",
    theme: "families_communities",
    description: "Write a letter to your Chinese host family before your exchange trip. Introduce yourself and ask about their family.",
    stepTemplates: [
      { instruction: "Start the letter with a proper greeting.", questionTemplate: "letter_greeting" },
      { instruction: "Introduce your name and age.", questionTemplate: "self_intro" },
      { instruction: "Describe your family members.", questionTemplate: "family_members" },
      { instruction: "Talk about what you study at school.", questionTemplate: "studies" },
      { instruction: "Mention your hobbies and interests.", questionTemplate: "interests" },
      { instruction: "Ask about their family.", questionTemplate: "ask_family" },
      { instruction: "Express excitement about the trip.", questionTemplate: "excitement" },
      { instruction: "Ask about the weather in their city.", questionTemplate: "weather_question" },
      { instruction: "Ask what food they recommend.", questionTemplate: "food_recommendation" },
      { instruction: "Close the letter politely.", questionTemplate: "letter_closing" },
    ],
  },
  {
    title: "Shopping at a Chinese Market",
    theme: "contemporary_life",
    description: "Explore a bustling Chinese market. Bargain for souvenirs, buy fruits, and practice your numbers.",
    stepTemplates: [
      { instruction: "A vendor calls out. What are they selling?", questionTemplate: "vendor_call" },
      { instruction: "Ask how much something costs.", questionTemplate: "price_ask" },
      { instruction: "The vendor says a price. Understand the number.", questionTemplate: "number_comprehension" },
      { instruction: "That's too expensive! How do you say it?", questionTemplate: "too_expensive" },
      { instruction: "Try to bargain. Offer a lower price.", questionTemplate: "bargaining" },
      { instruction: "You want to buy fruit. Name the fruit.", questionTemplate: "fruit_vocab" },
      { instruction: "Ask for a specific quantity.", questionTemplate: "quantity" },
      { instruction: "The vendor gives you change. Count it.", questionTemplate: "counting_money" },
      { instruction: "You see something pretty. Describe it.", questionTemplate: "description" },
      { instruction: "Thank the vendor and say goodbye.", questionTemplate: "thanks_farewell" },
    ],
  },
  {
    title: "Visiting a Chinese Doctor",
    theme: "contemporary_life",
    description: "You're not feeling well during your stay in China. Visit a clinic and describe your symptoms.",
    stepTemplates: [
      { instruction: "Arrive at the hospital. What does 医院 mean?", questionTemplate: "hospital_vocab" },
      { instruction: "Tell the receptionist you need to see a doctor.", questionTemplate: "see_doctor" },
      { instruction: "The doctor asks what's wrong. Describe your symptom.", questionTemplate: "symptom" },
      { instruction: "How long have you been sick? Express duration.", questionTemplate: "duration" },
      { instruction: "The doctor examines you. Understand their question about body parts.", questionTemplate: "body_parts" },
      { instruction: "The doctor prescribes medicine. What does 药 mean?", questionTemplate: "medicine_vocab" },
      { instruction: "Ask how many times a day to take the medicine.", questionTemplate: "dosage" },
      { instruction: "The doctor advises rest. Understand the advice.", questionTemplate: "rest_advice" },
      { instruction: "Ask when you'll feel better.", questionTemplate: "recovery_time" },
      { instruction: "Thank the doctor.", questionTemplate: "thank_doctor" },
    ],
  },
  {
    title: "Taking Public Transportation",
    theme: "contemporary_life",
    description: "Navigate Beijing's public transportation system. Buy tickets, find your route, and arrive at your destination.",
    stepTemplates: [
      { instruction: "Find the subway station. What does 地铁站 mean?", questionTemplate: "station_vocab" },
      { instruction: "Buy a ticket. How do you say you want to go to a place?", questionTemplate: "destination" },
      { instruction: "Read the station name on the map.", questionTemplate: "read_map" },
      { instruction: "Which direction should you go? Understand directions.", questionTemplate: "directions" },
      { instruction: "The announcement says the next stop. Listen and understand.", questionTemplate: "next_stop" },
      { instruction: "Ask a fellow passenger for help.", questionTemplate: "ask_help" },
      { instruction: "Transfer to another line. Follow the signs.", questionTemplate: "transfer" },
      { instruction: "You've arrived! How do you say 'I've arrived'?", questionTemplate: "arrival" },
      { instruction: "Find the exit. What does 出口 mean?", questionTemplate: "exit_vocab" },
      { instruction: "Ask for directions to your final destination.", questionTemplate: "final_directions" },
    ],
  },
  {
    title: "Celebrating Chinese New Year",
    theme: "families_communities",
    description: "Experience Chinese New Year with your host family. Learn about traditions, food, and greetings.",
    stepTemplates: [
      { instruction: "Your host says 新年好! What does this mean?", questionTemplate: "new_year_greeting" },
      { instruction: "Learn about the tradition of giving red envelopes.", questionTemplate: "red_envelope" },
      { instruction: "Help prepare traditional foods. What is 饺子?", questionTemplate: "traditional_food" },
      { instruction: "The family gathers for dinner. Who is at the table?", questionTemplate: "family_gathering" },
      { instruction: "Watch fireworks. Describe what you see.", questionTemplate: "fireworks" },
      { instruction: "Give a New Year blessing to the grandparents.", questionTemplate: "blessing" },
      { instruction: "Talk about your New Year's resolutions.", questionTemplate: "resolutions" },
      { instruction: "Learn about the zodiac animal for this year.", questionTemplate: "zodiac" },
      { instruction: "Post Spring Festival couplets. What do they say?", questionTemplate: "couplets" },
      { instruction: "Reflect on the experience. Express your feelings.", questionTemplate: "reflection" },
    ],
  },
  {
    title: "Making Friends Online",
    theme: "science_technology",
    description: "Join a Chinese social media platform and practice chatting with native speakers.",
    stepTemplates: [
      { instruction: "Create your profile. Fill in your name.", questionTemplate: "profile_name" },
      { instruction: "Write a short self-introduction.", questionTemplate: "online_intro" },
      { instruction: "Someone sends you a friend request. Accept and greet them.", questionTemplate: "accept_friend" },
      { instruction: "They ask where you're from. Respond.", questionTemplate: "origin" },
      { instruction: "Share your interests.", questionTemplate: "share_interests" },
      { instruction: "They send you a photo. Comment on it.", questionTemplate: "photo_comment" },
      { instruction: "Discuss your favorite music or movie.", questionTemplate: "entertainment" },
      { instruction: "Plan to video chat. Suggest a time.", questionTemplate: "schedule_chat" },
      { instruction: "Learn internet slang. What does 哈哈 mean?", questionTemplate: "internet_slang" },
      { instruction: "Say goodbye and make plans to chat again.", questionTemplate: "online_farewell" },
    ],
  },
  {
    title: "Exploring Chinese History Museum",
    theme: "personal_public_identities",
    description: "Visit a Chinese history museum and learn about key historical periods and cultural artifacts.",
    stepTemplates: [
      { instruction: "Buy tickets at the entrance. How much are they?", questionTemplate: "ticket_price" },
      { instruction: "Read the museum map. Find the ancient history section.", questionTemplate: "museum_map" },
      { instruction: "Learn about the Great Wall. What is it called in Chinese?", questionTemplate: "great_wall" },
      { instruction: "See ancient Chinese writing. What are these characters?", questionTemplate: "ancient_writing" },
      { instruction: "Learn about a famous Chinese invention.", questionTemplate: "inventions" },
      { instruction: "Read a description of a dynasty.", questionTemplate: "dynasty" },
      { instruction: "See traditional Chinese art. Describe a painting.", questionTemplate: "art_description" },
      { instruction: "Learn about Chinese philosophy. Who was Confucius?", questionTemplate: "philosophy" },
      { instruction: "Visit the gift shop. Buy a souvenir.", questionTemplate: "souvenir" },
      { instruction: "Write a postcard about your visit.", questionTemplate: "postcard" },
    ],
  },
  {
    title: "Preparing for an AP Chinese Exam",
    theme: "contemporary_life",
    description: "Practice exam-style tasks: reading comprehension, listening prompts, and structured writing.",
    stepTemplates: [
      { instruction: "Read a passage and identify the main topic.", questionTemplate: "main_topic" },
      { instruction: "Answer a vocabulary question from the passage.", questionTemplate: "passage_vocab" },
      { instruction: "Identify the author's purpose.", questionTemplate: "author_purpose" },
      { instruction: "Answer a detail question.", questionTemplate: "detail_question" },
      { instruction: "Understand a cultural reference in the text.", questionTemplate: "cultural_ref" },
      { instruction: "Practice a presentational writing prompt.", questionTemplate: "writing_prompt" },
      { instruction: "Respond to an interpersonal reading.", questionTemplate: "interpersonal" },
      { instruction: "Identify the correct grammar structure.", questionTemplate: "grammar_identify" },
      { instruction: "Complete a listening comprehension question.", questionTemplate: "listening" },
      { instruction: "Review and self-assess your performance.", questionTemplate: "self_assess" },
    ],
  },
  {
    title: "Cooking Chinese Food Together",
    theme: "families_communities",
    description: "Learn to cook a Chinese dish with your host mother. Follow a recipe and practice food vocabulary.",
    stepTemplates: [
      { instruction: "Read the recipe title. What dish are you making?", questionTemplate: "recipe_title" },
      { instruction: "Identify the ingredients. What does 鸡蛋 mean?", questionTemplate: "ingredient" },
      { instruction: "Measure the ingredients. Understand quantity words.", questionTemplate: "quantities" },
      { instruction: "The recipe says to wash the vegetables. What verb is used?", questionTemplate: "cooking_verb" },
      { instruction: "Cut the ingredients. What does 切 mean?", questionTemplate: "cut_vocab" },
      { instruction: "Heat the oil. Understand the cooking instruction.", questionTemplate: "heat_instruction" },
      { instruction: "Add the seasoning. What is 盐?", questionTemplate: "seasoning" },
      { instruction: "Stir-fry the dish. How long should you cook it?", questionTemplate: "cooking_time" },
      { instruction: "Taste the food and give your opinion.", questionTemplate: "taste_opinion" },
      { instruction: "The dish is ready! Compliment the cook.", questionTemplate: "compliment" },
    ],
  },
  {
    title: "Hiking in the Chinese Mountains",
    theme: "global_challenges",
    description: "Go hiking in a scenic Chinese mountain area. Learn nature vocabulary and discuss environmental topics.",
    stepTemplates: [
      { instruction: "Read the trail sign. What mountain is this?", questionTemplate: "mountain_name" },
      { instruction: "Check the weather forecast. What does it say?", questionTemplate: "weather_forecast" },
      { instruction: "Identify the trees along the path.", questionTemplate: "tree_vocab" },
      { instruction: "You see a river. Describe it.", questionTemplate: "river_description" },
      { instruction: "A sign warns about the trail. Understand the warning.", questionTemplate: "trail_warning" },
      { instruction: "Take a photo of the scenery. Describe what you see.", questionTemplate: "scenery" },
      { instruction: "Meet another hiker. Start a conversation.", questionTemplate: "hiker_chat" },
      { instruction: "Discuss environmental protection.", questionTemplate: "environment" },
      { instruction: "Read about an endangered species at the information board.", questionTemplate: "wildlife" },
      { instruction: "Reach the summit! Express your feelings.", questionTemplate: "summit_feelings" },
    ],
  },
  {
    title: "Attending a Chinese Wedding",
    theme: "families_communities",
    description: "You've been invited to a traditional Chinese wedding. Learn customs, give blessings, and celebrate.",
    stepTemplates: [
      { instruction: "Read the wedding invitation. When is the wedding?", questionTemplate: "invitation_date" },
      { instruction: "Buy a gift. What's appropriate?", questionTemplate: "wedding_gift" },
      { instruction: "Arrive and greet the couple. Give a blessing.", questionTemplate: "wedding_blessing" },
      { instruction: "Learn about the tea ceremony tradition.", questionTemplate: "tea_ceremony" },
      { instruction: "At the banquet, identify the dishes on the table.", questionTemplate: "banquet_dishes" },
      { instruction: "Toast the couple. What do you say?", questionTemplate: "toast" },
      { instruction: "Chat with other guests. Introduce yourself.", questionTemplate: "guest_chat" },
      { instruction: "Learn about the meaning of red at weddings.", questionTemplate: "red_meaning" },
      { instruction: "Watch a performance. Describe it.", questionTemplate: "performance" },
      { instruction: "Say goodbye and wish the couple well.", questionTemplate: "farewell_wishes" },
    ],
  },
  {
    title: "Job Interview in Chinese",
    theme: "contemporary_life",
    description: "Prepare for and attend a mock job interview in Chinese. Practice professional language and etiquette.",
    stepTemplates: [
      { instruction: "Read the job posting. What position is it for?", questionTemplate: "job_title" },
      { instruction: "Prepare your resume. How do you say 'work experience'?", questionTemplate: "resume_vocab" },
      { instruction: "Greet the interviewer formally.", questionTemplate: "formal_greeting" },
      { instruction: "The interviewer asks about your education. Respond.", questionTemplate: "education_bg" },
      { instruction: "Describe your skills and strengths.", questionTemplate: "skills" },
      { instruction: "Explain why you want this job.", questionTemplate: "motivation" },
      { instruction: "The interviewer asks about your weaknesses. Respond diplomatically.", questionTemplate: "weaknesses" },
      { instruction: "Ask about the work schedule.", questionTemplate: "schedule" },
      { instruction: "Discuss salary expectations.", questionTemplate: "salary" },
      { instruction: "Thank the interviewer and follow up.", questionTemplate: "interview_thanks" },
    ],
  },
  {
    title: "Discussing Chinese Art and Literature",
    theme: "beauty_aesthetics",
    description: "Visit an art gallery and discuss Chinese calligraphy, painting, and poetry with a local artist.",
    stepTemplates: [
      { instruction: "Enter the gallery. Read the exhibition title.", questionTemplate: "exhibition_title" },
      { instruction: "See a Chinese calligraphy piece. What style is it?", questionTemplate: "calligraphy" },
      { instruction: "The artist explains the meaning of a painting.", questionTemplate: "painting_meaning" },
      { instruction: "Learn about the Four Treasures of the Study.", questionTemplate: "four_treasures" },
      { instruction: "Read a famous Chinese poem.", questionTemplate: "poem" },
      { instruction: "Discuss the relationship between calligraphy and painting.", questionTemplate: "art_relationship" },
      { instruction: "Try writing a character with a brush. Describe the experience.", questionTemplate: "brush_writing" },
      { instruction: "Compare Chinese and Western art styles.", questionTemplate: "art_comparison" },
      { instruction: "Express your appreciation for the artwork.", questionTemplate: "appreciation" },
      { instruction: "Buy an art print and ask about the artist.", questionTemplate: "buy_art" },
    ],
  },
  {
    title: "Environmental Awareness Campaign",
    theme: "global_challenges",
    description: "Participate in a school environmental awareness campaign. Learn about pollution, recycling, and conservation.",
    stepTemplates: [
      { instruction: "Read the campaign poster. What's the theme?", questionTemplate: "campaign_theme" },
      { instruction: "Learn the word for 'environment' in Chinese.", questionTemplate: "environment_word" },
      { instruction: "Discuss water pollution. What does 污染 mean?", questionTemplate: "pollution_vocab" },
      { instruction: "Learn about recycling practices in China.", questionTemplate: "recycling" },
      { instruction: "Create a slogan for the campaign.", questionTemplate: "slogan" },
      { instruction: "Present statistics about air quality.", questionTemplate: "statistics" },
      { instruction: "Discuss solutions to environmental problems.", questionTemplate: "solutions" },
      { instruction: "Learn about renewable energy in China.", questionTemplate: "renewable_energy" },
      { instruction: "Write a pledge to protect the environment.", questionTemplate: "pledge" },
      { instruction: "Reflect on what you've learned.", questionTemplate: "env_reflection" },
    ],
  },
  {
    title: "Chinese Music and Dance Performance",
    theme: "beauty_aesthetics",
    description: "Attend a traditional Chinese music and dance performance. Learn about instruments and dance forms.",
    stepTemplates: [
      { instruction: "Read the performance program. What's showing tonight?", questionTemplate: "program" },
      { instruction: "Identify a traditional Chinese instrument.", questionTemplate: "instrument" },
      { instruction: "The performer plays a famous piece. What is it about?", questionTemplate: "music_piece" },
      { instruction: "Learn about the guzheng. What kind of instrument is it?", questionTemplate: "guzheng" },
      { instruction: "Watch a traditional dance. Describe the movements.", questionTemplate: "dance_moves" },
      { instruction: "The dancer wears a beautiful costume. Describe it.", questionTemplate: "costume" },
      { instruction: "Learn about the meaning behind the dance.", questionTemplate: "dance_meaning" },
      { instruction: "Compare traditional and modern Chinese music.", questionTemplate: "music_comparison" },
      { instruction: "Express your feelings about the performance.", questionTemplate: "performance_feelings" },
      { instruction: "Write a review of the show.", questionTemplate: "show_review" },
    ],
  },
  {
    title: "Planning a Trip to Xi'an",
    theme: "contemporary_life",
    description: "Plan a trip to Xi'an to see the Terracotta Warriors. Book transportation, find accommodation, and create an itinerary.",
    stepTemplates: [
      { instruction: "Research Xi'an. What is it famous for?", questionTemplate: "xian_famous" },
      { instruction: "Book a train ticket. How do you ask for one?", questionTemplate: "train_ticket" },
      { instruction: "Find a hotel. Understand the room description.", questionTemplate: "hotel_booking" },
      { instruction: "Create a day-by-day itinerary.", questionTemplate: "itinerary" },
      { instruction: "Arrive in Xi'an. Ask for directions to the hotel.", questionTemplate: "hotel_directions" },
      { instruction: "Visit the Terracotta Warriors. Buy an entrance ticket.", questionTemplate: "entrance_ticket" },
      { instruction: "Read the information about the warriors.", questionTemplate: "warriors_info" },
      { instruction: "Try local Xi'an food. What is 肉夹馍?", questionTemplate: "local_food" },
      { instruction: "Visit the city wall. Describe the view.", questionTemplate: "city_wall" },
      { instruction: "Share your trip highlights with a friend.", questionTemplate: "trip_highlights" },
    ],
  },
  {
    title: "Chinese Tea Ceremony",
    theme: "beauty_aesthetics",
    description: "Participate in a traditional Chinese tea ceremony. Learn about tea culture, types of tea, and proper etiquette.",
    stepTemplates: [
      { instruction: "Your host welcomes you to the tea house. Respond.", questionTemplate: "tea_welcome" },
      { instruction: "Learn about different types of Chinese tea.", questionTemplate: "tea_types" },
      { instruction: "The host offers you 绿茶. What kind of tea is this?", questionTemplate: "green_tea" },
      { instruction: "Observe the tea preparation. Describe the steps.", questionTemplate: "tea_prep" },
      { instruction: "Learn about the importance of water temperature.", questionTemplate: "water_temp" },
      { instruction: "Smell the tea. Describe the aroma.", questionTemplate: "tea_aroma" },
      { instruction: "Taste the tea. Express your opinion.", questionTemplate: "tea_taste" },
      { instruction: "Learn about the health benefits of tea.", questionTemplate: "tea_health" },
      { instruction: "Ask about the history of Chinese tea culture.", questionTemplate: "tea_history" },
      { instruction: "Thank your host and express appreciation.", questionTemplate: "tea_thanks" },
    ],
  },
  {
    title: "Discussing Chinese Festivals",
    theme: "families_communities",
    description: "Learn about major Chinese festivals throughout the year. Compare them with holidays you know.",
    stepTemplates: [
      { instruction: "Learn about 春节 (Spring Festival). When is it?", questionTemplate: "spring_festival" },
      { instruction: "What traditions are associated with Mid-Autumn Festival?", questionTemplate: "mid_autumn" },
      { instruction: "Learn about Dragon Boat Festival and its food.", questionTemplate: "dragon_boat" },
      { instruction: "What is the Lantern Festival? Read about it.", questionTemplate: "lantern_festival" },
      { instruction: "Discuss the importance of family reunions during festivals.", questionTemplate: "family_reunion" },
      { instruction: "Learn about traditional festival foods.", questionTemplate: "festival_food" },
      { instruction: "Compare a Chinese festival with one from your culture.", questionTemplate: "festival_compare" },
      { instruction: "Write New Year wishes in Chinese.", questionTemplate: "new_year_wishes" },
      { instruction: "Learn about the Chinese zodiac and its significance.", questionTemplate: "zodiac_significance" },
      { instruction: "Plan how to celebrate a Chinese festival.", questionTemplate: "celebrate_plan" },
    ],
  },
  {
    title: "Technology and Daily Life in China",
    theme: "science_technology",
    description: "Explore how technology shapes daily life in modern China — mobile payments, apps, and digital culture.",
    stepTemplates: [
      { instruction: "Learn about mobile payment. What is 微信支付?", questionTemplate: "mobile_payment" },
      { instruction: "Download a food delivery app. Order lunch.", questionTemplate: "food_delivery" },
      { instruction: "Use a navigation app. Find your destination.", questionTemplate: "navigation" },
      { instruction: "Learn about bike-sharing. How does it work?", questionTemplate: "bike_sharing" },
      { instruction: "Discuss the differences in social media platforms.", questionTemplate: "social_media" },
      { instruction: "Learn about online shopping in China.", questionTemplate: "online_shopping" },
      { instruction: "Use a translation app. Practice with it.", questionTemplate: "translation_app" },
      { instruction: "Discuss the pros and cons of technology dependence.", questionTemplate: "tech_pros_cons" },
      { instruction: "Learn about Chinese tech companies.", questionTemplate: "tech_companies" },
      { instruction: "Reflect on technology's role in learning Chinese.", questionTemplate: "tech_learning" },
    ],
  },
  {
    title: "Reading Chinese News",
    theme: "global_challenges",
    description: "Read and discuss Chinese news articles. Practice reading comprehension and learn current events vocabulary.",
    stepTemplates: [
      { instruction: "Read the headline. What is the article about?", questionTemplate: "headline" },
      { instruction: "Identify key vocabulary in the first paragraph.", questionTemplate: "key_vocab" },
      { instruction: "Understand the main argument of the article.", questionTemplate: "main_argument" },
      { instruction: "Find supporting details.", questionTemplate: "supporting_details" },
      { instruction: "Learn news-related vocabulary.", questionTemplate: "news_vocab" },
      { instruction: "Summarize the article in your own words.", questionTemplate: "summarize" },
      { instruction: "Form an opinion about the topic.", questionTemplate: "opinion" },
      { instruction: "Discuss the article with a partner.", questionTemplate: "discussion" },
      { instruction: "Write a response to the article.", questionTemplate: "response" },
      { instruction: "Compare news coverage in different languages.", questionTemplate: "compare_coverage" },
    ],
  },
  {
    title: "Chinese Zodiac Stories",
    theme: "personal_public_identities",
    description: "Learn the stories behind the twelve Chinese zodiac animals and discover your zodiac sign.",
    stepTemplates: [
      { instruction: "Learn the twelve zodiac animals in Chinese.", questionTemplate: "zodiac_animals" },
      { instruction: "Find out your zodiac animal. What year were you born?", questionTemplate: "birth_year" },
      { instruction: "Read the story of the Great Race.", questionTemplate: "great_race" },
      { instruction: "Learn personality traits associated with your zodiac.", questionTemplate: "personality_traits" },
      { instruction: "Discuss zodiac compatibility.", questionTemplate: "compatibility" },
      { instruction: "Learn the order of the zodiac animals.", questionTemplate: "zodiac_order" },
      { instruction: "Discuss how zodiac beliefs influence culture.", questionTemplate: "zodiac_culture" },
      { instruction: "Compare Chinese zodiac with Western astrology.", questionTemplate: "zodiac_comparison" },
      { instruction: "Create a zodiac profile for yourself.", questionTemplate: "zodiac_profile" },
      { instruction: "Share your zodiac with a Chinese friend.", questionTemplate: "share_zodiac" },
    ],
  },
  {
    title: "Health and Wellness Practices",
    theme: "contemporary_life",
    description: "Learn about traditional Chinese health practices including tai chi, acupuncture, and herbal medicine.",
    stepTemplates: [
      { instruction: "Learn about traditional Chinese medicine.", questionTemplate: "tcm_intro" },
      { instruction: "What is 太极拳 (Tai Chi)? Learn the basics.", questionTemplate: "tai_chi" },
      { instruction: "Visit a traditional pharmacy. Identify herbs.", questionTemplate: "pharmacy" },
      { instruction: "Learn about the concept of yin and yang in health.", questionTemplate: "yin_yang" },
      { instruction: "Discuss the importance of balance in diet.", questionTemplate: "diet_balance" },
      { instruction: "Learn about acupuncture. What does 针灸 mean?", questionTemplate: "acupuncture" },
      { instruction: "Practice describing symptoms in Chinese.", questionTemplate: "symptoms" },
      { instruction: "Compare Eastern and Western medicine approaches.", questionTemplate: "medicine_comparison" },
      { instruction: "Learn health-related vocabulary.", questionTemplate: "health_vocab" },
      { instruction: "Create a healthy lifestyle plan in Chinese.", questionTemplate: "health_plan" },
    ],
  },
  {
    title: "Renting an Apartment in China",
    theme: "contemporary_life",
    description: "Search for and rent an apartment. Practice real estate vocabulary and negotiation skills.",
    stepTemplates: [
      { instruction: "Search online listings. Understand the descriptions.", questionTemplate: "listing_vocab" },
      { instruction: "Call a real estate agent. Ask about availability.", questionTemplate: "call_agent" },
      { instruction: "Visit an apartment. Describe the rooms.", questionTemplate: "room_description" },
      { instruction: "Ask about the monthly rent.", questionTemplate: "rent_price" },
      { instruction: "Discuss the lease terms.", questionTemplate: "lease_terms" },
      { instruction: "Ask about utilities. What's included?", questionTemplate: "utilities" },
      { instruction: "Negotiate the rent.", questionTemplate: "negotiate" },
      { instruction: "Read and understand the contract.", questionTemplate: "contract" },
      { instruction: "Discuss moving day logistics.", questionTemplate: "moving_day" },
      { instruction: "Meet your new neighbors. Introduce yourself.", questionTemplate: "meet_neighbors" },
    ],
  },
  {
    title: "Discussing Climate Change",
    theme: "global_challenges",
    description: "Participate in a class discussion about climate change and its impact on China and the world.",
    stepTemplates: [
      { instruction: "Learn the Chinese word for 'climate change'.", questionTemplate: "climate_change_word" },
      { instruction: "Read statistics about global warming.", questionTemplate: "warming_stats" },
      { instruction: "Discuss causes of climate change.", questionTemplate: "causes" },
      { instruction: "Learn about China's environmental policies.", questionTemplate: "china_policies" },
      { instruction: "Discuss the impact on agriculture.", questionTemplate: "agriculture_impact" },
      { instruction: "Learn about renewable energy solutions.", questionTemplate: "renewable_solutions" },
      { instruction: "Debate different approaches to the problem.", questionTemplate: "debate" },
      { instruction: "Write an opinion paragraph about the issue.", questionTemplate: "opinion_paragraph" },
      { instruction: "Propose personal actions to help.", questionTemplate: "personal_actions" },
      { instruction: "Summarize the key takeaways from the discussion.", questionTemplate: "takeaways" },
    ],
  },
  {
    title: "Chinese Calligraphy Workshop",
    theme: "beauty_aesthetics",
    description: "Join a calligraphy workshop. Learn brush techniques, character structure, and the art of beautiful writing.",
    stepTemplates: [
      { instruction: "Meet the calligraphy master. How do you address them?", questionTemplate: "master_address" },
      { instruction: "Learn about the calligraphy tools. What is a 毛笔?", questionTemplate: "brush_tools" },
      { instruction: "Practice basic strokes. What are the main types?", questionTemplate: "basic_strokes" },
      { instruction: "Write the character 人. How many strokes?", questionTemplate: "write_ren" },
      { instruction: "Learn about different calligraphy styles.", questionTemplate: "calligraphy_styles" },
      { instruction: "Practice writing your name in Chinese.", questionTemplate: "write_name" },
      { instruction: "The master critiques your work. Understand the feedback.", questionTemplate: "feedback" },
      { instruction: "Learn about the philosophical connection to calligraphy.", questionTemplate: "philosophy_connection" },
      { instruction: "Write a short phrase or proverb.", questionTemplate: "write_proverb" },
      { instruction: "Display your best work and describe it.", questionTemplate: "display_work" },
    ],
  },
  {
    title: "Sports and Competition",
    theme: "contemporary_life",
    description: "Join a sports event at a Chinese school. Learn sports vocabulary and discuss sportsmanship.",
    stepTemplates: [
      { instruction: "Read the sports day schedule. What events are there?", questionTemplate: "sports_events" },
      { instruction: "Sign up for an event. What sport do you choose?", questionTemplate: "choose_sport" },
      { instruction: "Learn the rules. Understand the instructions.", questionTemplate: "sport_rules" },
      { instruction: "Cheer for your team. What do you shout?", questionTemplate: "cheering" },
      { instruction: "The score is announced. Understand the numbers.", questionTemplate: "score" },
      { instruction: "Discuss good sportsmanship.", questionTemplate: "sportsmanship" },
      { instruction: "Your team wins! Express excitement.", questionTemplate: "winning" },
      { instruction: "Congratulate the opposing team.", questionTemplate: "congratulate" },
      { instruction: "Discuss your favorite athlete.", questionTemplate: "favorite_athlete" },
      { instruction: "Write about the sports day experience.", questionTemplate: "sports_reflection" },
    ],
  },
  {
    title: "Chinese Film Night",
    theme: "beauty_aesthetics",
    description: "Watch a Chinese film and discuss the plot, characters, and cultural themes.",
    stepTemplates: [
      { instruction: "Read the movie poster. What's the title?", questionTemplate: "movie_title" },
      { instruction: "Understand the genre. What type of film is it?", questionTemplate: "genre" },
      { instruction: "Watch the opening scene. Describe the setting.", questionTemplate: "setting" },
      { instruction: "Identify the main character. What's their name?", questionTemplate: "main_character" },
      { instruction: "Understand a key dialogue scene.", questionTemplate: "key_dialogue" },
      { instruction: "Identify the conflict in the story.", questionTemplate: "conflict" },
      { instruction: "Discuss the cultural themes in the film.", questionTemplate: "cultural_themes" },
      { instruction: "Describe your favorite scene.", questionTemplate: "favorite_scene" },
      { instruction: "Give a star rating and explain why.", questionTemplate: "star_rating" },
      { instruction: "Recommend the film to a friend.", questionTemplate: "recommend" },
    ],
  },
  {
    title: "Volunteering in the Community",
    theme: "families_communities",
    description: "Join a community volunteering event. Help at a food bank, teach children, or clean a park.",
    stepTemplates: [
      { instruction: "Read the volunteer sign-up sheet. What options are there?", questionTemplate: "volunteer_options" },
      { instruction: "Sign up. Provide your information.", questionTemplate: "sign_up" },
      { instruction: "Meet the other volunteers. Introduce yourself.", questionTemplate: "meet_volunteers" },
      { instruction: "Receive instructions. Understand your task.", questionTemplate: "task_instructions" },
      { instruction: "Help sort donations. Learn related vocabulary.", questionTemplate: "donations" },
      { instruction: "Talk to someone you're helping. Practice conversation.", questionTemplate: "helping_conversation" },
      { instruction: "Take a break. Chat with other volunteers.", questionTemplate: "break_chat" },
      { instruction: "Learn about the community organization.", questionTemplate: "organization" },
      { instruction: "Reflect on the volunteering experience.", questionTemplate: "volunteer_reflection" },
      { instruction: "Plan to volunteer again. Express your commitment.", questionTemplate: "commitment" },
    ],
  },
];

function generateStepQuestion(
  template: ScenarioTemplate,
  stepIdx: number,
  nodes: NodeWithLesson[],
  rng: () => number
): {
  instruction: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
} {
  const step = template.stepTemplates[stepIdx];
  const relevantNodes = shuffle(nodes.filter(n => n.type !== "radical"), rng).slice(0, 20);
  const targetNode = relevantNodes[stepIdx % relevantNodes.length];
  const distractors = shuffle(
    relevantNodes.filter(n => n.id !== targetNode.id),
    rng
  ).slice(0, 3);

  const questionVariants = [
    {
      q: `What does "${targetNode.hanzi}" mean?`,
      opts: shuffle([targetNode.meaning, ...distractors.map(d => d.meaning)], rng),
      correct: targetNode.meaning,
      expl: `${targetNode.hanzi} (${targetNode.pinyin}) means "${targetNode.meaning}".`,
    },
    {
      q: `Which character means "${targetNode.meaning}"?`,
      opts: shuffle([targetNode.hanzi, ...distractors.map(d => d.hanzi)], rng),
      correct: targetNode.hanzi,
      expl: `"${targetNode.meaning}" is written as ${targetNode.hanzi} (${targetNode.pinyin}).`,
    },
    {
      q: `How do you pronounce "${targetNode.hanzi}"?`,
      opts: shuffle([targetNode.pinyin, ...distractors.map(d => d.pinyin)], rng),
      correct: targetNode.pinyin,
      expl: `${targetNode.hanzi} is pronounced ${targetNode.pinyin}.`,
    },
  ];

  const variant = questionVariants[stepIdx % questionVariants.length];

  return {
    instruction: step.instruction,
    question: variant.q,
    options: variant.opts,
    correctIndex: variant.opts.indexOf(variant.correct),
    explanation: variant.expl,
    hint: step.hint,
  };
}

export function generateMultistepScenarios(nodes: NodeWithLesson[]): MultistepScenario[] {
  const cacheKey = `multisteps-v3-${nodes.length}`;
  const cached = getCached<MultistepScenario[]>("stage5", cacheKey);
  if (cached) {
    console.log(`  [cache hit] ${cached.length} multistep scenarios loaded`);
    return cached;
  }

  const scenarios: MultistepScenario[] = [];
  const usableNodes = nodes.filter(n => n.type !== "radical");

  const targetCount = 50;

  for (let i = 0; i < targetCount; i++) {
    const template = SCENARIO_TEMPLATES[i % SCENARIO_TEMPLATES.length];
    const rng = seededRandom(`multistep-${i}-${template.title}`);

    const scenarioNodes = shuffle(usableNodes, rng).slice(0, 15);
    const prereqNodeIds = scenarioNodes.slice(0, 5).map(n => n.id);

    const stepCount = template.stepTemplates.length;
    const steps = [];

    for (let s = 0; s < stepCount; s++) {
      steps.push(generateStepQuestion(template, s, usableNodes, rng));
    }

    scenarios.push({
      id: `ms_${i + 1}`,
      title: template.title,
      theme: template.theme,
      description: template.description,
      prereqNodeIds,
      steps,
    });
  }

  console.log(`  Generated ${scenarios.length} multistep scenarios`);
  console.log(`  Average steps per scenario: ${(scenarios.reduce((sum, s) => sum + s.steps.length, 0) / scenarios.length).toFixed(1)}`);
  setCache("stage5", cacheKey, scenarios);
  return scenarios;
}
