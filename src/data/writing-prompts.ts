import type { WritingPrompt } from "../types/writing";

export const WRITING_PROMPTS: WritingPrompt[] = [
  // ===== STORY NARRATION (20) =====
  {
    id: "sn-01",
    format: "story_narration",
    theme: "families_communities",
    title: "A Family Reunion Dinner",
    titleChinese: "\u5BB6\u5EAD\u56E2\u5706\u665A\u9910",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A family is preparing food together in the kitchen. The grandmother is teaching her granddaughter how to make dumplings.
Scene 2: More relatives arrive at the door carrying gifts and dishes. Everyone greets each other warmly.
Scene 3: The whole family sits around a large round table eating, laughing, and sharing stories.
Scene 4: After dinner, the children play together while the adults drink tea and chat.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B\uFF1A
\u573A\u666F\u4E00\uFF1A\u4E00\u5BB6\u4EBA\u5728\u53A8\u623F\u91CC\u4E00\u8D77\u51C6\u5907\u98DF\u7269\u3002\u5976\u5976\u6B63\u5728\u6559\u5B59\u5973\u5305\u997A\u5B50\u3002
\u573A\u666F\u4E8C\uFF1A\u66F4\u591A\u7684\u4EB2\u621A\u5230\u95E8\u53E3\uFF0C\u5E26\u7740\u793C\u7269\u548C\u83DC\u80B4\u3002\u5927\u5BB6\u70ED\u60C5\u5730\u4E92\u76F8\u95EE\u5019\u3002
\u573A\u666F\u4E09\uFF1A\u5168\u5BB6\u4EBA\u56F4\u5750\u5728\u4E00\u5F20\u5927\u5706\u684C\u65C1\u5403\u996D\u3001\u7B11\u7740\u804A\u5929\u3001\u5206\u4EAB\u6545\u4E8B\u3002
\u573A\u666F\u56DB\uFF1A\u665A\u996D\u540E\uFF0C\u5B69\u5B50\u4EEC\u5728\u4E00\u8D77\u73A9\uFF0C\u5927\u4EBA\u4EEC\u559D\u8336\u804A\u5929\u3002`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Describes all four scenes in a coherent narrative",
      "Uses appropriate family vocabulary",
      "Shows logical progression between scenes",
      "Includes dialogue or direct speech",
    ],
    modelResponse: `\u4ECA\u5929\u662F\u6625\u8282\uFF0C\u6211\u4EEC\u5168\u5BB6\u4EBA\u90FD\u5F88\u9AD8\u5174\u3002\u4E0B\u5348\u7684\u65F6\u5019\uFF0C\u5976\u5976\u5728\u53A8\u623F\u91CC\u6559\u6211\u5305\u997A\u5B50\u3002\u5979\u8BF4\uFF1A\u300C\u5148\u628A\u9985\u513F\u653E\u5728\u76AE\u4E0A\uFF0C\u7136\u540E\u628A\u8FB9\u634F\u7D27\u3002\u300D\u6211\u8BD5\u4E86\u597D\u51E0\u6B21\u624D\u5305\u597D\u3002

\u4E94\u70B9\u949F\u5DE6\u53F3\uFF0C\u53D4\u53D4\u548C\u963F\u59E8\u5E26\u7740\u793C\u7269\u6765\u4E86\u3002\u5988\u5988\u9AD8\u5174\u5730\u8BF4\uFF1A\u300C\u6B22\u8FCE\u6B22\u8FCE\uFF01\u5FEB\u8FDB\u6765\uFF01\u300D\u5927\u5BB6\u90FD\u4E92\u76F8\u62E5\u62B1\u3002

\u665A\u996D\u7684\u65F6\u5019\uFF0C\u5168\u5BB6\u4EBA\u56F4\u5750\u5728\u5927\u5706\u684C\u65C1\u3002\u684C\u4E0A\u6709\u997A\u5B50\u3001\u9C7C\u3001\u9E21\u8089\u548C\u5F88\u591A\u84D4\u83DC\u3002\u7237\u7237\u7ED9\u5927\u5BB6\u8BB2\u4E86\u4ED6\u5C0F\u65F6\u5019\u7684\u6545\u4E8B\uFF0C\u5927\u5BB6\u90FD\u7B11\u4E86\u3002

\u5403\u5B8C\u996D\u4EE5\u540E\uFF0C\u6211\u548C\u8868\u5F1F\u8868\u59B9\u4EEC\u5728\u5BA2\u5385\u91CC\u4E00\u8D77\u73A9\u6E38\u620F\uFF0C\u5927\u4EBA\u4EEC\u5728\u559D\u8336\u804A\u5929\u3002\u8FD9\u662F\u4E00\u4E2A\u975E\u5E38\u6E29\u6696\u5FEB\u4E50\u7684\u665A\u4E0A\u3002`,
  },
  {
    id: "sn-02",
    format: "story_narration",
    theme: "science_technology",
    title: "The Science Fair Project",
    titleChinese: "\u79D1\u5B66\u5C55\u89C8\u9879\u76EE",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A student sits at their desk surrounded by books, planning a science fair project about solar energy.
Scene 2: The student builds a small solar-powered car model in the school lab with a friend's help.
Scene 3: At the science fair, the student presents the project to judges, demonstrating how the car moves.
Scene 4: The student receives an award and takes a photo with their teacher and classmates.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B\uFF1A
\u573A\u666F\u4E00\uFF1A\u4E00\u4E2A\u5B66\u751F\u5750\u5728\u4E66\u684C\u524D\uFF0C\u5468\u56F4\u90FD\u662F\u4E66\uFF0C\u6B63\u5728\u8BA1\u5212\u4E00\u4E2A\u5173\u4E8E\u592A\u9633\u80FD\u7684\u79D1\u5B66\u5C55\u89C8\u9879\u76EE\u3002
\u573A\u666F\u4E8C\uFF1A\u8FD9\u4E2A\u5B66\u751F\u5728\u5B66\u6821\u5B9E\u9A8C\u5BA4\u91CC\u548C\u670B\u53CB\u4E00\u8D77\u5236\u4F5C\u4E00\u4E2A\u592A\u9633\u80FD\u5C0F\u6C7D\u8F66\u6A21\u578B\u3002
\u573A\u666F\u4E09\uFF1A\u5728\u79D1\u5B66\u5C55\u89C8\u4F1A\u4E0A\uFF0C\u5B66\u751F\u5411\u8BC4\u59D4\u5C55\u793A\u9879\u76EE\uFF0C\u6F14\u793A\u5C0F\u6C7D\u8F66\u5982\u4F55\u8FD0\u52A8\u3002
\u573A\u666F\u56DB\uFF1A\u5B66\u751F\u83B7\u5956\u4E86\uFF0C\u548C\u8001\u5E08\u3001\u540C\u5B66\u4EEC\u4E00\u8D77\u62CD\u7167\u3002`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Narrates all four scenes clearly",
      "Uses science/technology vocabulary",
      "Shows character development and emotion",
      "Maintains narrative flow",
    ],
    modelResponse: `\u4E0A\u4E2A\u6708\uFF0C\u6211\u51B3\u5B9A\u53C2\u52A0\u5B66\u6821\u7684\u79D1\u5B66\u5C55\u89C8\u3002\u6211\u5BF9\u592A\u9633\u80FD\u5F88\u611F\u5174\u8DA3\uFF0C\u6240\u4EE5\u60F3\u505A\u4E00\u4E2A\u592A\u9633\u80FD\u5C0F\u6C7D\u8F66\u3002\u6211\u5728\u56FE\u4E66\u9986\u501F\u4E86\u5F88\u591A\u4E66\u6765\u5B66\u4E60\u3002

\u5728\u5B66\u6821\u7684\u5B9E\u9A8C\u5BA4\u91CC\uFF0C\u6211\u7684\u597D\u670B\u53CB\u5C0F\u660E\u5E2E\u6211\u4E00\u8D77\u505A\u3002\u6211\u4EEC\u82B1\u4E86\u4E24\u4E2A\u661F\u671F\u624D\u628A\u5C0F\u6C7D\u8F66\u505A\u597D\u3002\u867D\u7136\u5F88\u8F9B\u82E6\uFF0C\u4F46\u662F\u6211\u4EEC\u5F88\u5F00\u5FC3\u3002

\u79D1\u5B66\u5C55\u89C8\u90A3\u5929\uFF0C\u6211\u5F88\u7D27\u5F20\u3002\u6211\u5411\u8BC4\u59D4\u4ECB\u7ECD\u4E86\u592A\u9633\u80FD\u7684\u539F\u7406\uFF0C\u7136\u540E\u6F14\u793A\u4E86\u6211\u7684\u5C0F\u6C7D\u8F66\u3002\u8BC4\u59D4\u4EEC\u90FD\u5F88\u611F\u5174\u8DA3\uFF0C\u95EE\u4E86\u6211\u5F88\u591A\u95EE\u9898\u3002

\u6700\u540E\uFF0C\u6211\u83B7\u5F97\u4E86\u4E8C\u7B49\u5956\uFF01\u8001\u5E08\u548C\u540C\u5B66\u4EEC\u90FD\u4E3A\u6211\u9AD8\u5174\u3002\u6211\u4EEC\u4E00\u8D77\u62CD\u4E86\u4E00\u5F20\u7167\u7247\u3002\u8FD9\u6B21\u7ECF\u5386\u8BA9\u6211\u66F4\u52A0\u559C\u6B22\u79D1\u5B66\u4E86\u3002`,
  },
  {
    id: "sn-03",
    format: "story_narration",
    theme: "contemporary_life",
    title: "Lost in the Shopping Mall",
    titleChinese: "\u5728\u8D2D\u7269\u4E2D\u5FC3\u8FF7\u8DEF\u4E86",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A parent and child enter a busy shopping mall. The child is excited and looks around at all the stores.
Scene 2: While the parent is looking at clothes, the child wanders off to a toy store.
Scene 3: The child realizes they are lost and looks worried. A security guard notices and approaches.
Scene 4: The parent and child are reunited. The parent hugs the child with relief.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B\uFF1A
\u573A\u666F\u4E00\uFF1A\u4E00\u4F4D\u5BB6\u957F\u548C\u5B69\u5B50\u8D70\u8FDB\u4E86\u4E00\u4E2A\u70ED\u95F9\u7684\u8D2D\u7269\u4E2D\u5FC3\u3002\u5B69\u5B50\u5F88\u5174\u594B\uFF0C\u5230\u5904\u770B\u3002
\u573A\u666F\u4E8C\uFF1A\u5BB6\u957F\u5728\u770B\u8863\u670D\u7684\u65F6\u5019\uFF0C\u5B69\u5B50\u8DD1\u5230\u4E86\u4E00\u5BB6\u73A9\u5177\u5E97\u3002
\u573A\u666F\u4E09\uFF1A\u5B69\u5B50\u53D1\u73B0\u81EA\u5DF1\u8FF7\u8DEF\u4E86\uFF0C\u770B\u8D77\u6765\u5F88\u62C5\u5FC3\u3002\u4E00\u4E2A\u4FDD\u5B89\u6CE8\u610F\u5230\u4E86\uFF0C\u8D70\u8FC7\u6765\u3002
\u573A\u666F\u56DB\uFF1A\u5BB6\u957F\u548C\u5B69\u5B50\u91CD\u65B0\u56E2\u805A\u4E86\u3002\u5BB6\u957F\u677E\u4E86\u4E00\u53E3\u6C14\uFF0C\u7D27\u7D27\u62B1\u4F4F\u5B69\u5B50\u3002`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Clear narrative arc with conflict and resolution",
      "Uses descriptive language for emotions",
      "Appropriate shopping/location vocabulary",
      "Dialogue enhances the story",
    ],
    modelResponse: `\u661F\u671F\u516D\uFF0C\u5988\u5988\u5E26\u6211\u53BB\u8D2D\u7269\u4E2D\u5FC3\u4E70\u8863\u670D\u3002\u8D2D\u7269\u4E2D\u5FC3\u91CC\u4EBA\u5F88\u591A\uFF0C\u6709\u5404\u79CD\u5404\u6837\u7684\u5546\u5E97\uFF0C\u6211\u89C9\u5F97\u5F88\u5174\u594B\u3002

\u5988\u5988\u5728\u4E00\u5BB6\u670D\u88C5\u5E97\u91CC\u770B\u8863\u670D\u7684\u65F6\u5019\uFF0C\u6211\u770B\u5230\u65C1\u8FB9\u6709\u4E00\u5BB6\u5F88\u5927\u7684\u73A9\u5177\u5E97\u3002\u6211\u60F3\u53BB\u770B\u770B\uFF0C\u5C31\u81EA\u5DF1\u8D70\u4E86\u8FC7\u53BB\u3002

\u5728\u73A9\u5177\u5E97\u91CC\u73A9\u4E86\u4E00\u4F1A\u513F\u4EE5\u540E\uFF0C\u6211\u60F3\u627E\u5988\u5988\uFF0C\u53EF\u662F\u600E\u4E48\u4E5F\u627E\u4E0D\u5230\u5979\u4E86\u3002\u6211\u5F88\u5BB3\u6015\uFF0C\u5DEE\u70B9\u54ED\u4E86\u3002\u8FD9\u65F6\u5019\uFF0C\u4E00\u4E2A\u4FDD\u5B89\u53D4\u53D4\u8D70\u8FC7\u6765\u95EE\u6211\uFF1A\u300C\u5C0F\u670B\u53CB\uFF0C\u4F60\u8FF7\u8DEF\u4E86\u5417\uFF1F\u300D\u6211\u70B9\u4E86\u70B9\u5934\u3002

\u4FDD\u5B89\u53D4\u53D4\u7528\u5E7F\u64AD\u5E2E\u6211\u627E\u5988\u5988\u3002\u51E0\u5206\u949F\u540E\uFF0C\u5988\u5988\u8DD1\u8FC7\u6765\u4E86\uFF0C\u5979\u7D27\u7D27\u5730\u62B1\u4F4F\u6211\u8BF4\uFF1A\u300C\u4EE5\u540E\u4E0D\u8981\u81EA\u5DF1\u4E71\u8DD1\u4E86\uFF01\u300D\u6211\u8BF4\uFF1A\u300C\u5BF9\u4E0D\u8D77\uFF0C\u5988\u5988\u3002\u300D\u4ECE\u90A3\u4EE5\u540E\uFF0C\u6211\u518D\u4E5F\u4E0D\u6562\u81EA\u5DF1\u4E71\u8DD1\u4E86\u3002`,
  },
  {
    id: "sn-04",
    format: "story_narration",
    theme: "beauty_aesthetics",
    title: "The School Art Exhibition",
    titleChinese: "\u5B66\u6821\u7F8E\u672F\u5C55\u89C8",
    prompt: `Narrate a story based on these four scenes:
Scene 1: An art teacher announces a school art exhibition. Students excitedly discuss their ideas.
Scene 2: A student paints a landscape of their hometown mountains and rivers after school.
Scene 3: On exhibition day, students and parents walk through the gallery admiring the artworks.
Scene 4: The student stands proudly next to their painting as visitors compliment the work.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B\uFF1A
\u573A\u666F\u4E00\uFF1A\u7F8E\u672F\u8001\u5E08\u5BA3\u5E03\u5B66\u6821\u8981\u4E3E\u529E\u4E00\u4E2A\u7F8E\u672F\u5C55\u89C8\u3002\u5B66\u751F\u4EEC\u5174\u594B\u5730\u8BA8\u8BBA\u81EA\u5DF1\u7684\u60F3\u6CD5\u3002
\u573A\u666F\u4E8C\uFF1A\u653E\u5B66\u540E\uFF0C\u4E00\u4E2A\u5B66\u751F\u753B\u4E86\u4E00\u5E45\u5BB6\u4E61\u5C71\u6C34\u7684\u98CE\u666F\u753B\u3002
\u573A\u666F\u4E09\uFF1A\u5C55\u89C8\u5F53\u5929\uFF0C\u5B66\u751F\u548C\u5BB6\u957F\u4EEC\u8D70\u8FC7\u5C55\u5385\uFF0C\u6B23\u8D4F\u5404\u79CD\u4F5C\u54C1\u3002
\u573A\u666F\u56DB\uFF1A\u8FD9\u4E2A\u5B66\u751F\u9A84\u50B2\u5730\u7AD9\u5728\u81EA\u5DF1\u7684\u753B\u65C1\u8FB9\uFF0C\u53C2\u89C2\u8005\u4EEC\u8D5E\u7F8E\u8FD9\u5E45\u4F5C\u54C1\u3002`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Describes all four scenes with vivid detail",
      "Uses art and aesthetics vocabulary",
      "Expresses emotions and personal feelings",
      "Coherent narrative structure",
    ],
    modelResponse: `\u4E0A\u4E2A\u661F\u671F\uFF0C\u738B\u8001\u5E08\u544A\u8BC9\u6211\u4EEC\u5B66\u6821\u4E0B\u4E2A\u6708\u8981\u4E3E\u529E\u7F8E\u672F\u5C55\u89C8\u3002\u540C\u5B66\u4EEC\u90FD\u5F88\u9AD8\u5174\u3002\u6211\u60F3\u4E86\u5F88\u4E45\uFF0C\u51B3\u5B9A\u753B\u6211\u5BB6\u4E61\u7684\u5C71\u548C\u6CB3\u3002

\u653E\u5B66\u540E\uFF0C\u6211\u6BCF\u5929\u90FD\u5728\u753B\u753B\u3002\u6211\u7528\u7EFF\u8272\u753B\u4E86\u5C71\uFF0C\u7528\u84DD\u8272\u753B\u4E86\u6CB3\uFF0C\u8FD8\u52A0\u4E86\u4E00\u5EA7\u5C0F\u6865\u548C\u51E0\u68F5\u6811\u3002\u5988\u5988\u770B\u4E86\u8BF4\uFF1A\u300C\u753B\u5F97\u771F\u597D\uFF01\u300D

\u5C55\u89C8\u90A3\u5929\uFF0C\u5F88\u591A\u5BB6\u957F\u548C\u5B66\u751F\u6765\u53C2\u89C2\u3002\u5899\u4E0A\u6302\u6EE1\u4E86\u5404\u79CD\u5404\u6837\u7684\u753B\uFF0C\u6709\u98CE\u666F\u753B\u3001\u4EBA\u7269\u753B\u3001\u8FD8\u6709\u52A8\u7269\u753B\u3002\u6BCF\u4E00\u5E45\u90FD\u5F88\u6F02\u4EAE\u3002

\u6709\u51E0\u4E2A\u4EBA\u505C\u5728\u6211\u7684\u753B\u524D\u9762\u8BF4\uFF1A\u300C\u8FD9\u5E45\u98CE\u666F\u753B\u753B\u5F97\u5F88\u7F8E\uFF01\u300D\u6211\u7AD9\u5728\u65C1\u8FB9\uFF0C\u5FC3\u91CC\u975E\u5E38\u5F00\u5FC3\u548C\u9A84\u50B2\u3002\u8FD9\u6B21\u5C55\u89C8\u8BA9\u6211\u66F4\u52A0\u70ED\u7231\u753B\u753B\u4E86\u3002`,
  },
  {
    id: "sn-05",
    format: "story_narration",
    theme: "global_challenges",
    title: "The Community Recycling Day",
    titleChinese: "\u793E\u533A\u56DE\u6536\u65E5",
    prompt: `Narrate a story based on these four scenes:
Scene 1: Students see a poster about a community recycling event and discuss joining.
Scene 2: On the day, volunteers sort recyclables in the park.
Scene 3: A student teaches younger children about why recycling matters using a poster.
Scene 4: The community celebrates with refreshments. A before/after photo shows the cleaner environment.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B\uFF1A
\u573A\u666F\u4E00\uFF1A\u5B66\u751F\u4EEC\u770B\u5230\u4E00\u5F20\u5173\u4E8E\u793E\u533A\u56DE\u6536\u6D3B\u52A8\u7684\u6D77\u62A5\uFF0C\u8BA8\u8BBA\u8981\u4E0D\u8981\u53C2\u52A0\u3002
\u573A\u666F\u4E8C\uFF1A\u6D3B\u52A8\u5F53\u5929\uFF0C\u5FD7\u613F\u8005\u5728\u516C\u56ED\u91CC\u5206\u7C7B\u56DE\u6536\u7269\u54C1\u3002
\u573A\u666F\u4E09\uFF1A\u4E00\u4E2A\u5B66\u751F\u7528\u6D77\u62A5\u6559\u5C0F\u670B\u53CB\u4EEC\u4E3A\u4EC0\u4E48\u56DE\u6536\u5F88\u91CD\u8981\u3002
\u573A\u666F\u56DB\uFF1A\u793E\u533A\u7528\u98DF\u54C1\u548C\u996E\u6599\u6765\u5E86\u795D\u3002\u4E00\u5F20\u524D\u540E\u5BF9\u6BD4\u7684\u7167\u7247\u663E\u793A\u4E86\u66F4\u5E72\u51C0\u7684\u73AF\u5883\u3002`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Addresses environmental themes clearly",
      "Uses recycling/environment vocabulary",
      "Shows community involvement and teamwork",
      "Coherent four-scene narrative",
    ],
    modelResponse: `\u4E0A\u4E2A\u661F\u671F\u4E00\uFF0C\u6211\u5728\u5B66\u6821\u95E8\u53E3\u770B\u5230\u4E00\u5F20\u6D77\u62A5\uFF0C\u4E0A\u9762\u5199\u7740\uFF1A\u300C\u793E\u533A\u56DE\u6536\u65E5\uFF0C\u6B22\u8FCE\u5FD7\u613F\u8005\uFF01\u300D\u6211\u548C\u51E0\u4E2A\u540C\u5B66\u51B3\u5B9A\u4E00\u8D77\u53C2\u52A0\u3002

\u661F\u671F\u516D\u65E9\u4E0A\uFF0C\u6211\u4EEC\u5230\u4E86\u516C\u56ED\u3002\u6211\u4EEC\u6234\u4E0A\u624B\u5957\uFF0C\u5F00\u59CB\u628A\u5783\u573E\u5206\u7C7B\uFF1A\u5851\u6599\u74F6\u653E\u4E00\u4E2A\u7BB1\u5B50\uFF0C\u7EB8\u653E\u4E00\u4E2A\u7BB1\u5B50\uFF0C\u73BB\u7483\u653E\u53E6\u4E00\u4E2A\u7BB1\u5B50\u3002

\u4E0B\u5348\uFF0C\u6211\u7528\u4E00\u5F20\u5927\u6D77\u62A5\u7ED9\u5C0F\u670B\u53CB\u4EEC\u8BB2\u4E86\u56DE\u6536\u7684\u91CD\u8981\u6027\u3002\u6211\u544A\u8BC9\u4ED6\u4EEC\uFF1A\u300C\u5982\u679C\u6211\u4EEC\u56DE\u6536\u4E00\u4E2A\u5851\u6599\u74F6\uFF0C\u5C31\u53EF\u4EE5\u51CF\u5C11\u6C61\u67D3\u3002\u300D\u5C0F\u670B\u53CB\u4EEC\u90FD\u8BA4\u771F\u5730\u542C\u3002

\u6D3B\u52A8\u7ED3\u675F\u540E\uFF0C\u6211\u4EEC\u4E00\u8D77\u5403\u4E86\u70B9\u5FC3\u3002\u6709\u4EBA\u62CD\u4E86\u4E00\u5F20\u516C\u56ED\u7684\u7167\u7247\u2014\u2014\u548C\u4EE5\u524D\u76F8\u6BD4\uFF0C\u516C\u56ED\u53D8\u5F97\u5E72\u51C0\u591A\u4E86\u3002\u6211\u89C9\u5F97\u4FDD\u62A4\u73AF\u5883\u662F\u6BCF\u4E2A\u4EBA\u7684\u8D23\u4EFB\u3002`,
  },
  {
    id: "sn-06",
    format: "story_narration",
    theme: "personal_public_identities",
    title: "The New Student",
    titleChinese: "\u65B0\u540C\u5B66",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A new student enters the classroom on the first day, looking nervous. The teacher introduces them.
Scene 2: During lunch, the new student sits alone. A classmate invites them to join their table.
Scene 3: In PE class, the new student shows impressive basketball skills and classmates cheer.
Scene 4: After school, several students walk home together with the new student, chatting happily.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B\uFF1A
\u573A\u666F\u4E00\uFF1A\u5F00\u5B66\u7B2C\u4E00\u5929\uFF0C\u4E00\u4E2A\u65B0\u540C\u5B66\u8D70\u8FDB\u6559\u5BA4\uFF0C\u770B\u8D77\u6765\u5F88\u7D27\u5F20\u3002\u8001\u5E08\u4ECB\u7ECD\u4E86\u4ED6\u3002
\u573A\u666F\u4E8C\uFF1A\u5348\u996D\u65F6\u95F4\uFF0C\u65B0\u540C\u5B66\u4E00\u4E2A\u4EBA\u5750\u7740\u3002\u4E00\u4E2A\u540C\u5B66\u9080\u8BF7\u4ED6\u4E00\u8D77\u5403\u996D\u3002
\u573A\u666F\u4E09\uFF1A\u4F53\u80B2\u8BFE\u4E0A\uFF0C\u65B0\u540C\u5B66\u8868\u73B0\u51FA\u51FA\u8272\u7684\u7BEE\u7403\u6280\u672F\uFF0C\u540C\u5B66\u4EEC\u90FD\u6B22\u547C\u3002
\u573A\u666F\u56DB\uFF1A\u653E\u5B66\u540E\uFF0C\u51E0\u4E2A\u540C\u5B66\u548C\u65B0\u540C\u5B66\u4E00\u8D77\u8D70\u56DE\u5BB6\uFF0C\u5F00\u5FC3\u5730\u804A\u5929\u3002`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Develops the new student character arc",
      "Describes emotions and social interactions",
      "Uses school life vocabulary",
      "Shows progression from isolation to acceptance",
    ],
    modelResponse: `\u65B0\u5B66\u671F\u5F00\u59CB\u4E86\uFF0C\u73ED\u4E0A\u6765\u4E86\u4E00\u4E2A\u65B0\u540C\u5B66\u53EB\u674E\u660E\u3002\u8001\u5E08\u8BA9\u4ED6\u505A\u81EA\u6211\u4ECB\u7ECD\uFF0C\u4ED6\u6709\u70B9\u7D27\u5F20\u5730\u8BF4\uFF1A\u300C\u5927\u5BB6\u597D\uFF0C\u6211\u53EB\u674E\u660E\uFF0C\u4ECE\u5317\u4EAC\u8F6C\u5B66\u6765\u7684\u3002\u300D\u5927\u5BB6\u9F13\u638C\u6B22\u8FCE\u4ED6\u3002

\u5348\u996D\u7684\u65F6\u5019\uFF0C\u674E\u660E\u4E00\u4E2A\u4EBA\u5750\u5728\u89D2\u843D\u91CC\u3002\u6211\u8D70\u8FC7\u53BB\u8BF4\uFF1A\u300C\u4F60\u597D\uFF0C\u6765\u548C\u6211\u4EEC\u4E00\u8D77\u5403\u5427\uFF01\u300D\u4ED6\u9AD8\u5174\u5730\u7B54\u5E94\u4E86\u3002

\u4E0B\u5348\u4F53\u80B2\u8BFE\u6253\u7BEE\u7403\u7684\u65F6\u5019\uFF0C\u674E\u660E\u8868\u73B0\u5F97\u975E\u5E38\u597D\u3002\u4ED6\u6295\u4E86\u597D\u51E0\u4E2A\u4E09\u5206\u7403\uFF0C\u540C\u5B66\u4EEC\u90FD\u5927\u58F0\u53EB\u597D\u3002

\u653E\u5B66\u4EE5\u540E\uFF0C\u6211\u548C\u51E0\u4E2A\u540C\u5B66\u4E00\u8D77\u966A\u674E\u660E\u8D70\u56DE\u5BB6\u3002\u6211\u4EEC\u4E00\u8DEF\u804A\u5929\uFF0C\u53D1\u73B0\u4ED6\u5F88\u6709\u8DA3\u3002\u674E\u660E\u8BF4\uFF1A\u300C\u8C22\u8C22\u4F60\u4EEC\uFF0C\u6211\u5F88\u9AD8\u5174\u4EA4\u5230\u4E86\u65B0\u670B\u53CB\u3002\u300D`,
  },
  {
    id: "sn-07",
    format: "story_narration",
    theme: "families_communities",
    title: "Grandpa Birthday",
    titleChinese: "\u7237\u7237\u7684\u751F\u65E5",
    prompt: `Narrate a story based on these four scenes:
Scene 1: Family members are secretly planning a surprise birthday party for grandpa.
Scene 2: The grandchildren are making a birthday card and decorating the living room with balloons.
Scene 3: Grandpa comes home to find everyone shouting Surprise! with a big cake on the table.
Scene 4: Grandpa blows out the candles, making a wish, with tears of happiness in his eyes.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B\uFF1A
\u573A\u666F\u4E00\uFF1A\u5BB6\u4EBA\u4EEC\u5728\u79D8\u5BC6\u5730\u4E3A\u7237\u7237\u8BA1\u5212\u4E00\u4E2A\u60CA\u559C\u751F\u65E5\u6D3E\u5BF9\u3002
\u573A\u666F\u4E8C\uFF1A\u5B59\u5B50\u5B59\u5973\u4EEC\u5728\u505A\u751F\u65E5\u5361\u7247\uFF0C\u7528\u6C14\u7403\u88C5\u9970\u5BA2\u5385\u3002
\u573A\u666F\u4E09\uFF1A\u7237\u7237\u56DE\u5230\u5BB6\uFF0C\u53D1\u73B0\u5927\u5BB6\u90FD\u5728\u559C\u300C\u60CA\u559C\uFF01\u300D\u684C\u4E0A\u6709\u4E00\u4E2A\u5927\u86CB\u7CD5\u3002
\u573A\u666F\u56DB\uFF1A\u7237\u7237\u5439\u706D\u8721\u70DB\uFF0C\u8BB8\u4E86\u4E00\u4E2A\u613F\u671B\uFF0C\u773C\u91CC\u542B\u7740\u5E78\u798F\u7684\u6CEA\u6C34\u3002`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Clear narrative covering all four scenes",
      "Family and celebration vocabulary",
      "Emotional depth in describing grandpa reaction",
      "Appropriate use of time transitions",
    ],
    modelResponse: `\u4ECA\u5929\u662F\u7237\u7237\u4E03\u5341\u5C81\u7684\u751F\u65E5\u3002\u7238\u7238\u548C\u5988\u5988\u5077\u5077\u5730\u8BA1\u5212\u4E86\u4E00\u4E2A\u60CA\u559C\u6D3E\u5BF9\u3002\u4ED6\u4EEC\u8BA9\u59D1\u59D1\u5E26\u7237\u7237\u51FA\u53BB\u6563\u6B65\uFF0C\u6211\u4EEC\u5728\u5BB6\u91CC\u51C6\u5907\u3002

\u6211\u548C\u59D0\u59D0\u4E00\u8D77\u505A\u4E86\u4E00\u5F20\u5927\u5927\u7684\u751F\u65E5\u5361\u7247\uFF0C\u4E0A\u9762\u753B\u4E86\u5168\u5BB6\u4EBA\u3002\u5F1F\u5F1F\u5E2E\u5FD9\u5439\u6C14\u7403\uFF0C\u6211\u4EEC\u628A\u6C14\u7403\u6302\u5728\u5BA2\u5385\u7684\u5899\u4E0A\u3002

\u4E0B\u5348\u4E94\u70B9\uFF0C\u7237\u7237\u56DE\u6765\u4E86\u3002\u4ED6\u521A\u6253\u5F00\u95E8\uFF0C\u6211\u4EEC\u5C31\u4E00\u8D77\u5927\u58F0\u558A\uFF1A\u300C\u751F\u65E5\u5FEB\u4E50\uFF01\u300D\u7237\u7237\u5413\u4E86\u4E00\u8DF3\uFF0C\u7136\u540E\u5F00\u5FC3\u5730\u7B11\u4E86\u3002

\u7237\u7237\u5750\u5728\u86CB\u7CD5\u524D\u9762\uFF0C\u6211\u4EEC\u4E00\u8D77\u5531\u4E86\u751F\u65E5\u6B4C\u3002\u7237\u7237\u95ED\u4E0A\u773C\u775B\u8BB8\u4E86\u4E00\u4E2A\u613F\u671B\uFF0C\u7136\u540E\u5439\u706D\u4E86\u8721\u70DB\u3002\u4ED6\u7684\u773C\u91CC\u6709\u6CEA\u6C34\uFF0C\u4ED6\u8BF4\uFF1A\u300C\u6709\u4F60\u4EEC\u5728\u8EAB\u8FB9\uFF0C\u662F\u6211\u6700\u5927\u7684\u5E78\u798F\u3002\u300D`,
  },
  {
    id: "sn-08",
    format: "story_narration",
    theme: "contemporary_life",
    title: "The Weekend Cooking Challenge",
    titleChinese: "\u5468\u672B\u70F9\u996A\u6311\u6218",
    prompt: `Narrate a story based on these four scenes:
Scene 1: Two friends decide to have a cooking competition on the weekend.
Scene 2: At the market, they buy ingredients including vegetables, meat, tofu, and spices.
Scene 3: In the kitchen, one friend makes kung pao chicken while the other attempts mapo tofu. There is a small accident.
Scene 4: They taste each other's dishes and declare it a tie, then eat together happily.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B\uFF1A
\u573A\u666F\u4E00\uFF1A\u4E24\u4E2A\u670B\u53CB\u51B3\u5B9A\u5468\u672B\u4E3E\u884C\u4E00\u6B21\u70F9\u996A\u6BD4\u8D5B\u3002
\u573A\u666F\u4E8C\uFF1A\u5728\u5E02\u573A\u4E0A\uFF0C\u4ED6\u4EEC\u4E70\u98DF\u6750\u2014\u2014\u84D4\u83DC\u3001\u8089\u3001\u8C46\u8150\u548C\u8C03\u6599\u3002
\u573A\u666F\u4E09\uFF1A\u5728\u53A8\u623F\u91CC\uFF0C\u4E00\u4E2A\u670B\u53CB\u505A\u5BAB\u4FDD\u9E21\u4E01\uFF0C\u53E6\u4E00\u4E2A\u505A\u9EBB\u5A46\u8C46\u8150\u3002\u6709\u4E00\u4E2A\u5C0F\u610F\u5916\u3002
\u573A\u666F\u56DB\uFF1A\u4ED6\u4EEC\u54C1\u5C1D\u5BF9\u65B9\u7684\u83DC\uFF0C\u5BA3\u5E03\u5E73\u5C40\uFF0C\u7136\u540E\u5F00\u5FC3\u5730\u4E00\u8D77\u5403\u996D\u3002`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Covers all four scenes with detail",
      "Uses food and cooking vocabulary",
      "Includes humor or personality in the narrative",
      "Natural dialogue between friends",
    ],
    modelResponse: `\u4E0A\u4E2A\u5468\u672B\uFF0C\u6211\u548C\u597D\u670B\u53CB\u5C0F\u534E\u51B3\u5B9A\u6BD4\u4E00\u6BD4\u8C01\u505A\u83DC\u505A\u5F97\u597D\u3002\u6211\u60F3\u505A\u5BAB\u4FDD\u9E21\u4E01\uFF0C\u5C0F\u534E\u60F3\u505A\u9EBB\u5A46\u8C46\u8150\u3002

\u661F\u671F\u516D\u65E9\u4E0A\uFF0C\u6211\u4EEC\u4E00\u8D77\u53BB\u83DC\u5E02\u573A\u4E70\u98DF\u6750\u3002\u6211\u4E70\u4E86\u9E21\u8089\u3001\u82B1\u751F\u548C\u8FA3\u6912\uFF0C\u5C0F\u534E\u4E70\u4E86\u8C46\u8150\u3001\u8089\u672B\u548C\u82B1\u6912\u3002

\u56DE\u5230\u5BB6\uFF0C\u6211\u4EEC\u5F00\u59CB\u505A\u83DC\u3002\u6211\u5728\u7092\u9E21\u8089\u7684\u65F6\u5019\uFF0C\u5C0F\u534E\u4E0D\u5C0F\u5FC3\u628A\u8C46\u8150\u5F04\u788E\u4E86\uFF0C\u4ED6\u8BF4\uFF1A\u300C\u6CA1\u5173\u7CFB\uFF0C\u9EBB\u5A46\u8C46\u8150\u672C\u6765\u5C31\u662F\u788E\u7684\uFF01\u300D\u6211\u4EEC\u90FD\u7B11\u4E86\u3002

\u6700\u540E\uFF0C\u4E24\u9053\u83DC\u90FD\u505A\u597D\u4E86\u3002\u6211\u5C1D\u4E86\u5C0F\u534E\u7684\u9EBB\u5A46\u8C46\u8150\uFF0C\u53C8\u9EBB\u53C8\u8FA3\uFF0C\u5F88\u597D\u5403\u3002\u5C0F\u534E\u8BF4\u6211\u7684\u5BAB\u4FDD\u9E21\u4E01\u4E5F\u5F88\u9999\u3002\u6211\u4EEC\u51B3\u5B9A\u8FD9\u6B21\u6BD4\u8D5B\u662F\u5E73\u5C40\u3002`,
  },
  {
    id: "sn-09",
    format: "story_narration",
    theme: "science_technology",
    title: "The Robot Competition",
    titleChinese: "\u673A\u5668\u4EBA\u6BD4\u8D5B",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A group of students meets after school in the computer lab to work on their robot for a competition.
Scene 2: The team tests the robot but it keeps falling over. They debug and rebuild parts of it.
Scene 3: At the competition, their robot successfully completes the obstacle course while they watch nervously.
Scene 4: The team wins third place and celebrates together, already planning improvements for next year.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B\uFF1A
\u573A\u666F\u4E00\uFF1A\u4E00\u7FA4\u5B66\u751F\u653E\u5B66\u540E\u5728\u7535\u8111\u5BA4\u91CC\u4E3A\u6BD4\u8D5B\u505A\u673A\u5668\u4EBA\u3002
\u573A\u666F\u4E8C\uFF1A\u56E2\u961F\u6D4B\u8BD5\u673A\u5668\u4EBA\uFF0C\u4F46\u5B83\u4E00\u76F4\u5012\u3002\u4ED6\u4EEC\u8C03\u8BD5\u548C\u91CD\u5EFA\u4E86\u4E00\u4E9B\u90E8\u5206\u3002
\u573A\u666F\u4E09\uFF1A\u6BD4\u8D5B\u4E2D\uFF0C\u4ED6\u4EEC\u7684\u673A\u5668\u4EBA\u6210\u529F\u5B8C\u6210\u4E86\u969C\u788D\u8D5B\u9053\u3002
\u573A\u666F\u56DB\uFF1A\u56E2\u961F\u83B7\u5F97\u4E86\u7B2C\u4E09\u540D\uFF0C\u4E00\u8D77\u5E86\u795D\u3002`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Narrates teamwork and problem-solving",
      "Technology and competition vocabulary",
      "Shows emotional journey from struggle to success",
      "All four scenes covered coherently",
    ],
    modelResponse: `\u6211\u4EEC\u5B66\u6821\u6709\u4E00\u4E2A\u673A\u5668\u4EBA\u5174\u8DA3\u5C0F\u7EC4\u3002\u4E3A\u4E86\u53C2\u52A0\u5E02\u91CC\u7684\u673A\u5668\u4EBA\u6BD4\u8D5B\uFF0C\u6211\u548C\u4E09\u4E2A\u540C\u5B66\u6BCF\u5929\u653E\u5B66\u540E\u90FD\u5728\u7535\u8111\u5BA4\u91CC\u5DE5\u4F5C\u3002

\u521A\u5F00\u59CB\u7684\u65F6\u5019\uFF0C\u6211\u4EEC\u7684\u673A\u5668\u4EBA\u603B\u662F\u5012\u3002\u6211\u4EEC\u68C0\u67E5\u4E86\u4EE3\u7801\uFF0C\u53D1\u73B0\u662F\u4F20\u611F\u5668\u7684\u95EE\u9898\u3002\u7ECF\u8FC7\u4E00\u4E2A\u661F\u671F\u7684\u4FEE\u6539\uFF0C\u673A\u5668\u4EBA\u7EC8\u4E8E\u53EF\u4EE5\u6B63\u5E38\u8D70\u8DEF\u4E86\u3002

\u6BD4\u8D5B\u90A3\u5929\uFF0C\u6211\u4EEC\u90FD\u5F88\u7D27\u5F20\u3002\u5F53\u6211\u4EEC\u7684\u673A\u5668\u4EBA\u5F00\u59CB\u8D70\u969C\u788D\u8D5B\u9053\u65F6\uFF0C\u6211\u7684\u5FC3\u8DF3\u5F97\u5F88\u5FEB\u3002\u5B83\u6210\u529F\u5730\u907F\u5F00\u4E86\u6240\u6709\u969C\u788D\uFF0C\u5230\u8FBE\u4E86\u7EC8\u70B9\uFF01\u6211\u4EEC\u9AD8\u5174\u5730\u8DF3\u4E86\u8D77\u6765\u3002

\u867D\u7136\u6211\u4EEC\u53EA\u5F97\u4E86\u7B2C\u4E09\u540D\uFF0C\u4F46\u6211\u4EEC\u90FD\u975E\u5E38\u5F00\u5FC3\u3002\u8001\u5E08\u8BF4\uFF1A\u300C\u4F60\u4EEC\u505A\u5F97\u5F88\u597D\uFF0C\u660E\u5E74\u4E00\u5B9A\u80FD\u505A\u5F97\u66F4\u597D\u3002\u300D\u6211\u4EEC\u5DF2\u7ECF\u5F00\u59CB\u8BA8\u8BBA\u660E\u5E74\u8981\u600E\u4E48\u6539\u8FDB\u673A\u5668\u4EBA\u4E86\u3002`,
  },
  {
    id: "sn-10",
    format: "story_narration",
    theme: "beauty_aesthetics",
    title: "A Trip to the Chinese Garden",
    titleChinese: "\u53C2\u89C2\u4E2D\u56FD\u56ED\u6797",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A class arrives at a traditional Chinese garden on a field trip. The teacher explains the history.
Scene 2: Students walk along a winding path past a pond with lotus flowers and koi fish.
Scene 3: They cross a moon bridge and sit in a pavilion. One student sketches the scenery.
Scene 4: Before leaving, the class takes a group photo in front of the garden ornate gate.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Vivid description of the garden scenery",
      "Uses nature and architecture vocabulary",
      "Covers all four scenes",
      "Includes personal reflection or sensory details",
    ],
    modelResponse: `\u4ECA\u5929\uFF0C\u6211\u4EEC\u73ED\u53BB\u53C2\u89C2\u4E86\u4E00\u4E2A\u6709\u4E09\u767E\u5E74\u5386\u53F2\u7684\u4E2D\u56FD\u56ED\u6797\u3002\u8001\u5E08\u8BF4\u8FD9\u4E2A\u56ED\u6797\u662F\u6E05\u671D\u65F6\u5019\u5EFA\u7684\u3002

\u6211\u4EEC\u6CBF\u7740\u4E00\u6761\u5F2F\u5F2F\u66F2\u66F2\u7684\u77F3\u5934\u5C0F\u8DEF\u5F80\u524D\u8D70\u3002\u8DEF\u8FB9\u6709\u4E00\u4E2A\u5F88\u5927\u7684\u6C60\u5858\uFF0C\u91CC\u9762\u6709\u7C89\u7EA2\u8272\u7684\u8377\u82B1\u548C\u4E94\u989C\u516D\u8272\u7684\u9526\u9CA4\u3002

\u7136\u540E\u6211\u4EEC\u8D70\u8FC7\u4E86\u4E00\u5EA7\u534A\u5706\u5F62\u7684\u77F3\u6865\uFF0C\u8001\u5E08\u8BF4\u8FD9\u53EB\u300C\u6708\u4EAE\u6865\u300D\u3002\u6211\u4EEC\u5728\u4E00\u4E2A\u4EAD\u5B50\u91CC\u5750\u4E0B\u6765\u4F11\u606F\u3002\u6211\u7684\u540C\u5B66\u5C0F\u7F8E\u62FF\u51FA\u753B\u672C\uFF0C\u5F00\u59CB\u753B\u773C\u524D\u7684\u98CE\u666F\u3002

\u5FEB\u8981\u8D70\u7684\u65F6\u5019\uFF0C\u8001\u5E08\u8BA9\u6211\u4EEC\u5728\u5927\u95E8\u524D\u62CD\u4E86\u4E00\u5F20\u5408\u5F71\u3002\u8FD9\u4E2A\u56ED\u6797\u771F\u7684\u592A\u7F8E\u4E86\uFF0C\u8BA9\u6211\u611F\u53D7\u5230\u4E86\u4E2D\u56FD\u6587\u5316\u7684\u9B45\u529B\u3002`,
  },
  {
    id: "sn-11",
    format: "story_narration",
    theme: "global_challenges",
    title: "The Typhoon",
    titleChinese: "\u53F0\u98CE\u6765\u4E86",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A weather report on TV warns about an approaching typhoon. A family prepares by buying supplies.
Scene 2: The typhoon arrives with strong wind and rain. The family stays inside watching the storm.
Scene 3: After the storm passes, neighbors come out and help each other clean up.
Scene 4: The community shares a meal together outdoors, grateful that everyone is safe.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Describes the weather event vividly",
      "Uses weather and community vocabulary",
      "Shows community solidarity",
      "Logical narrative progression",
    ],
    modelResponse: `\u661F\u671F\u4E09\u665A\u4E0A\uFF0C\u7535\u89C6\u91CC\u7684\u5929\u6C14\u9884\u62A5\u8BF4\u660E\u5929\u4F1A\u6709\u5F88\u5927\u7684\u53F0\u98CE\u3002\u7238\u7238\u5988\u5988\u9A6C\u4E0A\u5E26\u6211\u53BB\u8D85\u5E02\u4E70\u4E86\u6C34\u3001\u65B9\u4FBF\u9762\u548C\u624B\u7535\u7B52\u3002

\u7B2C\u4E8C\u5929\u65E9\u4E0A\uFF0C\u53F0\u98CE\u6765\u4E86\u3002\u98CE\u547C\u547C\u5730\u5439\uFF0C\u96E8\u54D7\u54D7\u5730\u4E0B\u3002\u6211\u4EEC\u5168\u5BB6\u4EBA\u5F85\u5728\u5BA2\u5385\u91CC\uFF0C\u4ECE\u7A97\u6237\u770B\u5916\u9762\u3002\u8DEF\u4E0A\u4E00\u4E2A\u4EBA\u90FD\u6CA1\u6709\u3002

\u4E0B\u5348\uFF0C\u98CE\u548C\u96E8\u6E10\u6E10\u5C0F\u4E86\u3002\u6211\u4EEC\u51FA\u53BB\u770B\uFF0C\u53D1\u73B0\u8DEF\u4E0A\u6709\u5F88\u591A\u6811\u679D\u3002\u90BB\u5C45\u4EEC\u90FD\u51FA\u6765\u5E2E\u5FD9\u6253\u626B\u3002\u6211\u4E5F\u5E2E\u5FD9\u6361\u6811\u679D\uFF0C\u5927\u5BB6\u4E00\u8D77\u5E72\u6D3B\uFF0C\u5F88\u5FEB\u5C31\u6E05\u7406\u5E72\u51C0\u4E86\u3002

\u665A\u4E0A\uFF0C\u5927\u5BB6\u5728\u5C0F\u533A\u7684\u5E7F\u573A\u4E0A\u4E00\u8D77\u5403\u996D\u3002\u5927\u5BB6\u90FD\u5F88\u9AD8\u5174\u6CA1\u6709\u4EBA\u53D7\u4F24\u3002`,
  },
  {
    id: "sn-12",
    format: "story_narration",
    theme: "personal_public_identities",
    title: "The School Talent Show",
    titleChinese: "\u5B66\u6821\u624D\u827A\u8868\u6F14",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A shy student decides to sign up for the school talent show to perform a traditional Chinese song.
Scene 2: The student practices every day, sometimes feeling discouraged but their family encourages them.
Scene 3: On stage, the student is nervous at first but sings beautifully, and the audience is captivated.
Scene 4: After the performance, classmates congratulate the student, who feels more confident.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Shows character growth from shy to confident",
      "Uses performance and emotion vocabulary",
      "All four scenes included",
      "Personal reflection on the experience",
    ],
    modelResponse: `\u6211\u662F\u4E00\u4E2A\u5F88\u5BB3\u7F9E\u7684\u4EBA\u3002\u4F46\u662F\u8FD9\u5B66\u671F\uFF0C\u6211\u51B3\u5B9A\u62A5\u540D\u53C2\u52A0\u5B66\u6821\u7684\u624D\u827A\u8868\u6F14\u3002\u6211\u8981\u5531\u4E00\u9996\u53EB\u300A\u8309\u8389\u82B1\u300B\u7684\u4E2D\u56FD\u6B4C\u3002

\u63A5\u4E0B\u6765\u7684\u4E24\u4E2A\u661F\u671F\uFF0C\u6211\u6BCF\u5929\u90FD\u5728\u5BB6\u91CC\u7EC3\u4E60\u5531\u6B4C\u3002\u6709\u65F6\u5019\u6211\u5531\u4E0D\u597D\u5C31\u5F88\u7070\u5FC3\u3002\u5988\u5988\u603B\u662F\u9F13\u52B1\u6211\u8BF4\uFF1A\u300C\u4F60\u5531\u5F97\u5F88\u597D\uFF0C\u52A0\u6CB9\uFF01\u300D

\u8868\u6F14\u90A3\u5929\uFF0C\u6211\u7AD9\u5728\u821E\u53F0\u4E0A\uFF0C\u770B\u7740\u53F0\u4E0B\u90A3\u4E48\u591A\u4EBA\uFF0C\u5FC3\u8DF3\u5F97\u5F88\u5FEB\u3002\u97F3\u4E50\u4E00\u54CD\uFF0C\u6211\u6DF1\u547C\u5438\u4E86\u4E00\u4E0B\uFF0C\u5F00\u59CB\u5531\u4E86\u3002\u6162\u6162\u5730\uFF0C\u6211\u4E0D\u7D27\u5F20\u4E86\uFF0C\u8D8A\u5531\u8D8A\u597D\u3002\u5531\u5B8C\u4EE5\u540E\uFF0C\u5168\u573A\u9F13\u638C\u3002

\u4E0B\u53F0\u4EE5\u540E\uFF0C\u5F88\u591A\u540C\u5B66\u6765\u8BF4\u300C\u4F60\u5531\u5F97\u592A\u597D\u4E86\uFF01\u300D\u6211\u5FC3\u91CC\u7279\u522B\u5F00\u5FC3\u3002\u8FD9\u6B21\u7ECF\u5386\u8BA9\u6211\u77E5\u9053\uFF0C\u53EA\u8981\u52C7\u6562\u5C1D\u8BD5\uFF0C\u5C31\u80FD\u505A\u5230\u81EA\u5DF1\u60F3\u505A\u7684\u4E8B\u3002`,
  },
  {
    id: "sn-13",
    format: "story_narration",
    theme: "families_communities",
    title: "Moving to a New Neighborhood",
    titleChinese: "\u642C\u5230\u65B0\u793E\u533A",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A family loads a moving truck and says goodbye to neighbors in their old neighborhood.
Scene 2: They arrive at their new home and start unpacking boxes. The house is empty and unfamiliar.
Scene 3: A neighbor comes over with a plate of homemade food to welcome the new family.
Scene 4: Weeks later, the family feels at home, with new friends and a decorated house.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Describes emotional transition from old to new home",
      "Community and home vocabulary",
      "Shows warmth of neighborly welcome",
      "Coherent four-scene arc",
    ],
    modelResponse: `\u56E0\u4E3A\u7238\u7238\u6362\u4E86\u5DE5\u4F5C\uFF0C\u6211\u4EEC\u5168\u5BB6\u8981\u642C\u5230\u65B0\u7684\u57CE\u5E02\u53BB\u3002\u642C\u5BB6\u90A3\u5929\uFF0C\u65E7\u793E\u533A\u7684\u90BB\u5C45\u4EEC\u90FD\u6765\u9001\u6211\u4EEC\u3002\u6211\u5F88\u820D\u4E0D\u5F97\u3002

\u5230\u4E86\u65B0\u5BB6\u4EE5\u540E\uFF0C\u623F\u5B50\u91CC\u7A7A\u7A7A\u7684\uFF0C\u5230\u5904\u90FD\u662F\u7BB1\u5B50\u3002\u6211\u770B\u7740\u964C\u751F\u7684\u623F\u95F4\uFF0C\u5FC3\u91CC\u6709\u70B9\u96BE\u8FC7\u3002

\u8FD9\u65F6\u5019\uFF0C\u6709\u4EBA\u6572\u95E8\u4E86\u3002\u662F\u9694\u58C1\u7684\u9648\u963F\u59E8\uFF0C\u5979\u7AEF\u7740\u4E00\u5927\u76D8\u7EA2\u70E7\u8089\u3002\u5979\u7B11\u7740\u8BF4\uFF1A\u300C\u6B22\u8FCE\u4F60\u4EEC\uFF01\u6709\u4EC0\u4E48\u9700\u8981\u5E2E\u5FD9\u7684\u5C3D\u7BA1\u8BF4\u3002\u300D\u6211\u4EEC\u89C9\u5F97\u5F88\u6E29\u6696\u3002

\u51E0\u4E2A\u661F\u671F\u8FC7\u53BB\u4E86\uFF0C\u65B0\u5BB6\u7EC8\u4E8E\u88C5\u9970\u597D\u4E86\u3002\u6211\u4E5F\u5728\u65B0\u5B66\u6821\u4EA4\u5230\u4E86\u597D\u670B\u53CB\u3002\u73B0\u5728\u6211\u5DF2\u7ECF\u5F88\u559C\u6B22\u8FD9\u4E2A\u65B0\u793E\u533A\u4E86\u3002`,
  },
  {
    id: "sn-14",
    format: "story_narration",
    theme: "contemporary_life",
    title: "The Bus Ride Adventure",
    titleChinese: "\u516C\u4EA4\u8F66\u4E0A\u7684\u5192\u9669",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A teenager takes the city bus alone for the first time to visit a friend across town.
Scene 2: They accidentally get on the wrong bus and end up in an unfamiliar neighborhood.
Scene 3: They ask a kind elderly person for directions, who helps them find the right bus stop.
Scene 4: They finally arrive at their friend house, late but with an exciting story to tell.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: [
      "Clear narrative of the journey",
      "Transportation and direction vocabulary",
      "Describes emotions throughout the adventure",
      "Natural dialogue with the elderly person",
    ],
    modelResponse: `\u661F\u671F\u5929\uFF0C\u6211\u7B2C\u4E00\u6B21\u4E00\u4E2A\u4EBA\u5750\u516C\u4EA4\u8F66\u53BB\u770B\u4F4F\u5728\u57CE\u5E02\u53E6\u4E00\u8FB9\u7684\u597D\u670B\u53CB\u5C0F\u519B\u3002

\u5230\u4E86\u516C\u4EA4\u8F66\u7AD9\uFF0C\u6709\u4E24\u8F86\u8F66\u540C\u65F6\u6765\u4E86\u3002\u6211\u6025\u6025\u5FD9\u5FD9\u5730\u4E0A\u4E86\u4E00\u8F86\uFF0C\u53EF\u662F\u4E0A\u8F66\u4EE5\u540E\u53D1\u73B0\u8FD9\u4E0D\u662F\u5341\u4E94\u8DEF\u3002\u5F53\u6211\u4E0B\u8F66\u7684\u65F6\u5019\uFF0C\u5DF2\u7ECF\u5230\u4E86\u4E00\u4E2A\u5B8C\u5168\u4E0D\u8BA4\u8BC6\u7684\u5730\u65B9\u3002

\u8FD9\u65F6\u5019\uFF0C\u4E00\u4E2A\u8001\u7237\u7237\u5750\u5728\u8DEF\u8FB9\u770B\u62A5\u7EB8\u3002\u6211\u8D70\u8FC7\u53BB\u95EE\uFF1A\u300C\u8BF7\u95EE\uFF0C\u5341\u4E94\u8DEF\u8F66\u7AD9\u5728\u54EA\u91CC\uFF1F\u300D\u8001\u7237\u7237\u5F88\u70ED\u5FC3\uFF0C\u4ED6\u8BF4\uFF1A\u300C\u4F60\u5F80\u524D\u8D70\u4E24\u4E2A\u8DEF\u53E3\uFF0C\u53F3\u8F6C\u5C31\u80FD\u770B\u5230\u4E86\u3002\u300D

\u867D\u7136\u6BD4\u8BA1\u5212\u665A\u4E86\u534A\u4E2A\u5C0F\u65F6\uFF0C\u4F46\u6211\u6700\u7EC8\u5230\u4E86\u5C0F\u519B\u5BB6\u3002\u6211\u8DDF\u4ED6\u8BB2\u4E86\u6211\u5750\u9519\u8F66\u7684\u6545\u4E8B\uFF0C\u6211\u4EEC\u90FD\u7B11\u4E86\u5F88\u4E45\u3002`,
  },
  {
    id: "sn-15",
    format: "story_narration",
    theme: "science_technology",
    title: "Astronomy Club Stargazing Night",
    titleChinese: "\u5929\u6587\u793E\u89C2\u661F\u4E4B\u591C",
    prompt: `Narrate a story based on these four scenes:
Scene 1: Members of the school astronomy club gather on the school rooftop with telescopes after dark.
Scene 2: The club leader points out constellations and planets. Students take turns looking through the telescope.
Scene 3: A student excitedly spots a shooting star. Everyone makes a wish.
Scene 4: Walking home, the student looks up at the stars with a newfound sense of wonder.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Vivid description of the night sky", "Astronomy and nature vocabulary", "All four scenes included", "Personal reflection on the experience"],
    modelResponse: `\u661F\u671F\u4E94\u665A\u4E0A\uFF0C\u6211\u548C\u5929\u6587\u793E\u7684\u540C\u5B66\u4EEC\u5E26\u7740\u671B\u8FDC\u955C\u6765\u5230\u5B66\u6821\u7684\u697C\u9876\u3002\u5929\u4E0A\u7684\u661F\u661F\u7279\u522B\u4EAE\u3002

\u793E\u957F\u5C0F\u5218\u6307\u7740\u5929\u7A7A\u8BF4\uFF1A\u300C\u770B\uFF0C\u90A3\u662F\u5317\u6597\u4E03\u661F\uFF0C\u90A3\u4E2A\u5F88\u4EAE\u7684\u662F\u6728\u661F\u3002\u300D\u6211\u4EEC\u8F6E\u6D41\u7528\u671B\u8FDC\u955C\u770B\u3002\u901A\u8FC7\u671B\u8FDC\u955C\uFF0C\u6211\u7B2C\u4E00\u6B21\u770B\u6E05\u4E86\u6728\u661F\u7684\u6761\u7EB9\uFF0C\u771F\u7684\u592A\u795E\u5947\u4E86\uFF01

\u7A81\u7136\uFF0C\u4E00\u4E2A\u540C\u5B66\u5927\u53EB\uFF1A\u300C\u5FEB\u770B\uFF01\u6D41\u661F\uFF01\u300D\u6211\u4EEC\u90FD\u62AC\u5934\u770B\uFF0C\u4E00\u9053\u4EAE\u5149\u5212\u8FC7\u5929\u7A7A\u3002\u5927\u5BB6\u8D76\u7D27\u95ED\u4E0A\u773C\u775B\u8BB8\u613F\u3002

\u6D3B\u52A8\u7ED3\u675F\u540E\uFF0C\u6211\u8D70\u5728\u56DE\u5BB6\u7684\u8DEF\u4E0A\uFF0C\u4E0D\u505C\u5730\u62AC\u5934\u770B\u661F\u7A7A\u3002\u6211\u89C9\u5F97\u5B87\u5B99\u592A\u7F8E\u4E86\uFF0C\u592A\u5927\u4E86\u3002`,
  },
  {
    id: "sn-16",
    format: "story_narration",
    theme: "beauty_aesthetics",
    title: "The Calligraphy Lesson",
    titleChinese: "\u4E66\u6CD5\u8BFE",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A student visits their grandmother, who is a calligraphy master, during summer break.
Scene 2: Grandmother teaches the student how to hold the brush and demonstrates basic strokes.
Scene 3: The student practices but makes many mistakes. Grandmother patiently corrects them.
Scene 4: By the end of summer, the student completes a beautiful calligraphy piece and gifts it to grandmother.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Describes the calligraphy learning process", "Art and tradition vocabulary", "Shows patience and perseverance", "Warm grandmother-grandchild relationship"],
    modelResponse: `\u6691\u5047\u7684\u65F6\u5019\uFF0C\u6211\u53BB\u4E86\u5976\u5976\u5BB6\u3002\u5976\u5976\u5199\u4E86\u516D\u5341\u5E74\u7684\u4E66\u6CD5\uFF0C\u5979\u7684\u5B57\u975E\u5E38\u6F02\u4EAE\u3002

\u7B2C\u4E00\u5929\uFF0C\u5976\u5976\u6559\u6211\u600E\u6837\u63E1\u6BDB\u7B14\u3002\u5979\u8BF4\uFF1A\u300C\u63E1\u7B14\u8981\u7A33\uFF0C\u7528\u529B\u8981\u5747\u5300\u3002\u300D\u7136\u540E\u5979\u793A\u8303\u4E86\u6A2A\u3001\u7AD6\u3001\u6487\u3001\u6350\u51E0\u4E2A\u57FA\u672C\u7B14\u753B\u3002

\u6211\u5F00\u59CB\u7EC3\u4E60\uFF0C\u53EF\u662F\u624B\u603B\u662F\u6296\uFF0C\u5199\u51FA\u6765\u7684\u5B57\u6B6A\u6B6A\u626D\u626D\u7684\u3002\u6211\u6709\u70B9\u7070\u5FC3\u3002\u5976\u5976\u7B11\u7740\u8BF4\uFF1A\u300C\u4E0D\u8981\u6025\uFF0C\u6162\u6162\u6765\u3002\u300D\u5979\u63E1\u7740\u6211\u7684\u624B\uFF0C\u4E00\u7B14\u4E00\u7B14\u5730\u6559\u6211\u3002

\u6574\u4E2A\u6691\u5047\uFF0C\u6211\u6BCF\u5929\u90FD\u7EC3\u4E60\u3002\u6700\u540E\u4E00\u5929\uFF0C\u6211\u7EC8\u4E8E\u5199\u4E86\u4E00\u5E45\u6EE1\u610F\u7684\u4F5C\u54C1\u3002\u6211\u628A\u5B83\u9001\u7ED9\u4E86\u5976\u5976\u3002\u5976\u5976\u5F88\u611F\u52A8\uFF0C\u628A\u5B83\u6302\u5728\u4E86\u5BA2\u5385\u7684\u5899\u4E0A\u3002`,
  },
  {
    id: "sn-17",
    format: "story_narration",
    theme: "global_challenges",
    title: "Planting Trees at School",
    titleChinese: "\u5728\u5B66\u6821\u79CD\u6811",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A teacher announces a tree-planting initiative for Earth Day. Students volunteer enthusiastically.
Scene 2: Students dig holes and plant saplings along the school driveway.
Scene 3: A student waters the new trees and places a small name tag on each one.
Scene 4: Months later, the students visit the trees, which have grown taller. They feel proud.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Environmental awareness theme", "Nature and activity vocabulary", "Shows teamwork and accomplishment", "Four scenes covered clearly"],
    modelResponse: `\u56DB\u6708\u4E8C\u5341\u4E8C\u65E5\u662F\u5730\u7403\u65E5\u3002\u738B\u8001\u5E08\u8BF4\uFF1A\u300C\u8FD9\u4E2A\u661F\u671F\u516D\uFF0C\u6211\u4EEC\u8981\u5728\u5B66\u6821\u79CD\u6811\u3002\u300D\u5168\u73ED\u540C\u5B66\u90FD\u4E3E\u4E86\u624B\u3002

\u661F\u671F\u516D\u65E9\u4E0A\uFF0C\u6211\u4EEC\u6765\u5230\u5B66\u6821\u95E8\u53E3\u7684\u8DEF\u8FB9\u3002\u8001\u5E08\u7ED9\u4E86\u6211\u4EEC\u94F2\u5B50\u548C\u5C0F\u6811\u82D7\u3002\u6211\u548C\u5C0F\u660E\u4E00\u7EC4\uFF0C\u4E00\u8D77\u6316\u5751\u3002\u571F\u5F88\u786C\uFF0C\u6316\u8D77\u6765\u4E0D\u5BB9\u6613\u3002

\u79CD\u597D\u6811\u4EE5\u540E\uFF0C\u6211\u63D0\u7740\u6C34\u6876\u53BB\u6D47\u6C34\u3002\u6211\u5728\u6BCF\u68F5\u6811\u4E0A\u6302\u4E86\u4E00\u4E2A\u5C0F\u724C\u5B50\uFF0C\u5199\u4E0A\u79CD\u6811\u4EBA\u7684\u540D\u5B57\u3002

\u4E09\u4E2A\u6708\u4EE5\u540E\uFF0C\u6211\u4EEC\u56DE\u53BB\u770B\u90A3\u4E9B\u6811\u3002\u5B83\u4EEC\u90FD\u957F\u9AD8\u4E86\u4E0D\u5C11\uFF0C\u53F6\u5B50\u53C8\u7EFF\u53C8\u8302\u76DB\u3002\u770B\u7740\u81EA\u5DF1\u79CD\u7684\u6811\uFF0C\u6211\u89C9\u5F97\u975E\u5E38\u9A84\u50B2\u3002`,
  },
  {
    id: "sn-18",
    format: "story_narration",
    theme: "personal_public_identities",
    title: "Learning to Ride a Bicycle",
    titleChinese: "\u5B66\u9A91\u81EA\u884C\u8F66",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A child gets a new bicycle for their birthday. They are excited but also a bit scared.
Scene 2: Their older sibling helps them practice in the park. The child falls several times.
Scene 3: After many tries, the child finally rides on their own for the first time. The sibling cheers.
Scene 4: The child rides proudly around the neighborhood, feeling a sense of accomplishment.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Clear growth narrative", "Describes physical and emotional experience", "Sibling relationship depicted well", "All scenes covered with detail"],
    modelResponse: `\u6211\u516B\u5C81\u751F\u65E5\u7684\u65F6\u5019\uFF0C\u7238\u7238\u9001\u4E86\u6211\u4E00\u8F86\u84DD\u8272\u7684\u81EA\u884C\u8F66\u3002\u6211\u975E\u5E38\u5F00\u5FC3\uFF0C\u4F46\u4E5F\u6709\u70B9\u5BB3\u6015\u3002

\u661F\u671F\u5929\uFF0C\u59D0\u59D0\u5E26\u6211\u53BB\u516C\u56ED\u5B66\u9A91\u8F66\u3002\u5979\u5728\u540E\u9762\u6276\u7740\u8F66\u5EA7\uFF0C\u8BA9\u6211\u6162\u6162\u9A91\u3002\u53EF\u662F\u6211\u603B\u662F\u63A7\u5236\u4E0D\u597D\u65B9\u5411\uFF0C\u6454\u4E86\u597D\u51E0\u6B21\u3002

\u59D0\u59D0\u8BF4\uFF1A\u300C\u4E0D\u8981\u653E\u5F03\uFF01\u300D\u6211\u53C8\u8BD5\u4E86\u4E00\u6B21\u3002\u8FD9\u4E00\u6B21\uFF0C\u59D0\u59D0\u6084\u6084\u5730\u677E\u4E86\u624B\u3002\u6211\u9A91\u4E86\u51FA\u53BB\uFF0C\u7ADF\u7136\u6CA1\u6709\u6454\u5012\uFF01\u6211\u5174\u594B\u5730\u5927\u53EB\uFF1A\u300C\u6211\u4F1A\u9A91\u4E86\uFF01\u300D\u59D0\u59D0\u5728\u540E\u9762\u62CD\u624B\u6B22\u547C\u3002

\u73B0\u5728\uFF0C\u6211\u6BCF\u5929\u653E\u5B66\u540E\u90FD\u5728\u5C0F\u533A\u91CC\u9A91\u81EA\u884C\u8F66\u3002\u9A91\u8F66\u7684\u611F\u89C9\u50CF\u98DE\u4E00\u6837\u3002\u6211\u660E\u767D\u4E86\uFF1A\u53EA\u8981\u4E0D\u653E\u5F03\uFF0C\u5C31\u4E00\u5B9A\u80FD\u6210\u529F\u3002`,
  },
  {
    id: "sn-19",
    format: "story_narration",
    theme: "contemporary_life",
    title: "A Rainy Day at Home",
    titleChinese: "\u96E8\u5929\u5728\u5BB6",
    prompt: `Narrate a story based on these four scenes:
Scene 1: A student wakes up to heavy rain and learns that their outdoor plans are cancelled.
Scene 2: They decide to bake cookies with their younger sibling. The kitchen gets messy.
Scene 3: While waiting for cookies to bake, they build a blanket fort and read stories together.
Scene 4: In the evening, the rain stops. They eat cookies and watch the sunset from the window.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Turns a negative into a positive narrative", "Home and cooking vocabulary", "Sibling relationship warmth", "All four scenes covered"],
    modelResponse: `\u661F\u671F\u516D\u65E9\u4E0A\uFF0C\u6211\u4E00\u7741\u5F00\u773C\u5C31\u542C\u5230\u5916\u9762\u4E0B\u7740\u5927\u96E8\u3002\u672C\u6765\u6211\u548C\u670B\u53CB\u7EA6\u597D\u4E86\u53BB\u722C\u5C71\uFF0C\u73B0\u5728\u53EA\u80FD\u53D6\u6D88\u4E86\u3002

\u5988\u5988\u5EFA\u8BAE\u8BF4\uFF1A\u300C\u4F60\u53EF\u4EE5\u548C\u5F1F\u5F1F\u4E00\u8D77\u70E4\u997C\u5E72\u554A\u3002\u300D\u6211\u548C\u5F1F\u5F1F\u627E\u5230\u4E86\u5DE7\u514B\u529B\u997C\u5E72\u7684\u505A\u6CD5\uFF0C\u5F00\u59CB\u51C6\u5907\u9762\u7C89\u3001\u9E21\u86CB\u548C\u5DE7\u514B\u529B\u3002\u5F1F\u5F1F\u628A\u9762\u7C89\u5F04\u5F97\u5230\u5904\u90FD\u662F\uFF0C\u4F46\u6211\u4EEC\u7B11\u4E2A\u4E0D\u505C\u3002

\u628A\u997C\u5E72\u653E\u8FDB\u70E4\u7BB1\u4EE5\u540E\uFF0C\u6211\u4EEC\u5728\u5BA2\u5385\u91CC\u7528\u6BEF\u5B50\u548C\u6905\u5B50\u642D\u4E86\u4E00\u4E2A\u5C0F\u5E10\u7BF7\u3002\u6211\u7ED9\u5F1F\u5F1F\u8BB2\u4E86\u4E00\u4E2A\u897F\u6E38\u8BB0\u7684\u6545\u4E8B\u3002

\u508D\u665A\u7684\u65F6\u5019\uFF0C\u96E8\u7EC8\u4E8E\u505C\u4E86\u3002\u6211\u4EEC\u5750\u5728\u7A97\u8FB9\uFF0C\u4E00\u8FB9\u5403\u7740\u81EA\u5DF1\u70E4\u7684\u997C\u5E72\uFF0C\u4E00\u8FB9\u770B\u7740\u7F8E\u4E3D\u7684\u65E5\u843D\u3002\u867D\u7136\u6CA1\u53BB\u722C\u5C71\uFF0C\u4F46\u8FD9\u4E2A\u96E8\u5929\u4E5F\u8FC7\u5F97\u5F88\u5F00\u5FC3\u3002`,
  },
  {
    id: "sn-20",
    format: "story_narration",
    theme: "families_communities",
    title: "Visiting the Farmers Market",
    titleChinese: "\u901B\u519C\u8D38\u5E02\u573A",
    prompt: `Narrate a story based on these four scenes:
Scene 1: Early morning, a parent takes a child to the local farmers market. It is busy and colorful.
Scene 2: They visit different stalls with fruit, vegetables, fresh fish, and handmade goods.
Scene 3: The child tries a sample of fresh longan fruit and really likes it. They bargain with the vendor.
Scene 4: Walking home with bags of groceries, they plan what dishes to cook for dinner.`,
    promptChinese: `\u6839\u636E\u4EE5\u4E0B\u56DB\u4E2A\u573A\u666F\u5199\u4E00\u4E2A\u6545\u4E8B`,
    expectedCharacters: { min: 150, max: 200 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Vivid market scene description", "Food and shopping vocabulary", "Natural dialogue in bargaining scene", "All four scenes covered"],
    modelResponse: `\u661F\u671F\u5929\u4E00\u5927\u65E9\uFF0C\u5988\u5988\u5C31\u53EB\u6211\u8D77\u5E8A\u53BB\u519C\u8D38\u5E02\u573A\u3002\u5E02\u573A\u91CC\u4EBA\u5F88\u591A\uFF0C\u5404\u79CD\u5404\u6837\u7684\u4E1C\u897F\u6446\u6EE1\u4E86\u644A\u4F4D\uFF0C\u4E94\u989C\u516D\u8272\u7684\u3002

\u6211\u4EEC\u5148\u53BB\u4E86\u6C34\u679C\u644A\uFF0C\u4E70\u4E86\u82F9\u679C\u548C\u9999\u8549\u3002\u7136\u540E\u53BB\u84D4\u83DC\u644A\u4E70\u4E86\u897F\u7EA2\u67FF\u548C\u9752\u83DC\u3002\u5988\u5988\u8FD8\u5728\u9C7C\u644A\u4E0A\u4E70\u4E86\u4E00\u6761\u5F88\u65B0\u9C9C\u7684\u9C88\u9C7C\u3002

\u7ECF\u8FC7\u4E00\u4E2A\u6C34\u679C\u644A\u65F6\uFF0C\u963F\u59E8\u8BA9\u6211\u8BD5\u5403\u4E86\u4E00\u9897\u9F99\u773C\u3002\u300C\u771F\u751C\uFF01\u300D\u6211\u8BF4\u3002\u5988\u5988\u95EE\uFF1A\u300C\u591A\u5C11\u94B1\u4E00\u65A4\uFF1F\u300D\u963F\u59E8\u8BF4\u5341\u4E94\u5757\u3002\u5988\u5988\u8BF4\uFF1A\u300C\u5341\u4E8C\u5757\u884C\u4E0D\u884C\uFF1F\u300D\u6700\u540E\u4EE5\u5341\u4E09\u5757\u6210\u4EA4\u4E86\u3002

\u56DE\u5BB6\u7684\u8DEF\u4E0A\uFF0C\u6211\u5E2E\u5988\u5988\u63D0\u888B\u5B50\u3002\u6211\u4EEC\u4E00\u8FB9\u8D70\u4E00\u8FB9\u8BA8\u8BBA\u665A\u9910\u505A\u4EC0\u4E48\u83DC\u3002\u6211\u5F00\u5FC3\u5730\u8BF4\uFF1A\u300C\u6211\u5E2E\u4F60\u505A\uFF01\u300D`,
  },

  // ===== EMAIL RESPONSE (20) =====
  {
    id: "er-01",
    format: "email_response",
    theme: "families_communities",
    title: "Reply to a Friend Invitation",
    titleChinese: "\u56DE\u590D\u670B\u53CB\u7684\u9080\u8BF7",
    prompt: `You received this email from your friend Zhang Wei:

"Hi! My family is having a Chinese New Year party at our house on Saturday at 5 PM. There will be food, games, and fireworks. Can you come? Let me know if you need a ride. -- Zhang Wei"

Write a reply accepting the invitation. Ask what you should bring, mention you are excited about the food, and confirm you can get a ride from your parents.`,
    promptChinese: `\u4F60\u6536\u5230\u4E86\u670B\u53CB\u5F20\u4F1F\u7684\u90AE\u4EF6\uFF0C\u5199\u4E00\u5C01\u56DE\u590D\u63A5\u53D7\u9080\u8BF7\u3002\u95EE\u4F60\u5E94\u8BE5\u5E26\u4EC0\u4E48\uFF0C\u63D0\u5230\u4F60\u5BF9\u98DF\u7269\u5F88\u671F\u5F85\uFF0C\u5E76\u786E\u8BA4\u4F60\u7684\u7236\u6BCD\u53EF\u4EE5\u9001\u4F60\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Addresses all parts of the prompt", "Appropriate greeting and closing", "Polite and friendly tone", "Natural email format"],
    modelResponse: `\u5F20\u4F1F\uFF1A

\u4F60\u597D\uFF01\u8C22\u8C22\u4F60\u9080\u8BF7\u6211\u53C2\u52A0\u4F60\u4EEC\u5BB6\u7684\u6625\u8282\u805A\u4F1A\uFF01\u6211\u975E\u5E38\u613F\u610F\u6765\u3002

\u6211\u542C\u8BF4\u4F60\u5988\u5988\u505A\u7684\u83DC\u7279\u522B\u597D\u5403\uFF0C\u6211\u5F88\u671F\u5F85\u80FD\u5C1D\u5230\u3002\u6211\u9700\u8981\u5E26\u4EC0\u4E48\u5417\uFF1F\u6211\u53EF\u4EE5\u5E26\u4E00\u4E9B\u6C34\u679C\u6216\u8005\u751C\u70B9\u3002

\u5173\u4E8E\u4EA4\u901A\uFF0C\u4E0D\u7528\u62C5\u5FC3\uFF0C\u6211\u7238\u7238\u53EF\u4EE5\u5F00\u8F66\u9001\u6211\u8FC7\u53BB\u3002\u6211\u4EEC\u5927\u6982\u4E94\u70B9\u5DE6\u53F3\u5230\u3002

\u65B0\u5E74\u5FEB\u4E50\uFF01\u661F\u671F\u516D\u89C1\uFF01

\u4F60\u7684\u670B\u53CB`,
  },
  {
    id: "er-02",
    format: "email_response",
    theme: "contemporary_life",
    title: "Reply to a Teacher About Homework",
    titleChinese: "\u56DE\u590D\u8001\u5E08\u5173\u4E8E\u4F5C\u4E1A\u7684\u90AE\u4EF6",
    prompt: `You received this email from your Chinese teacher, Ms. Li:

"Dear student, I noticed you did not submit this week's essay about your favorite holiday. The deadline was yesterday. Is everything okay? Please let me know when you can submit it. -- Ms. Li"

Write a reply apologizing for the late submission. Explain that you were sick this week, ask for a deadline extension, and promise to submit it by Monday.`,
    promptChinese: `\u4F60\u6536\u5230\u4E86\u4E2D\u6587\u8001\u5E08\u674E\u8001\u5E08\u7684\u90AE\u4EF6\uFF0C\u5199\u4E00\u5C01\u56DE\u590D\u4E3A\u8FDF\u4EA4\u9053\u6B49\u3002\u89E3\u91CA\u4F60\u8FD9\u5468\u751F\u75C5\u4E86\uFF0C\u8BF7\u6C42\u5EF6\u671F\uFF0C\u5E76\u627F\u8BFA\u661F\u671F\u4E00\u4EA4\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Apologizes sincerely", "Explains the reason", "Requests extension politely", "Uses formal/respectful tone with teacher"],
    modelResponse: `\u674E\u8001\u5E08\uFF1A

\u60A8\u597D\uFF01\u975E\u5E38\u62B1\u6B49\u6211\u6CA1\u6709\u6309\u65F6\u4EA4\u4F5C\u6587\u3002\u8FD9\u4E2A\u661F\u671F\u6211\u751F\u75C5\u4E86\uFF0C\u53D1\u70E7\u4E86\u597D\u51E0\u5929\uFF0C\u6CA1\u80FD\u6309\u65F6\u5B8C\u6210\u4F5C\u4E1A\u3002

\u73B0\u5728\u6211\u5DF2\u7ECF\u597D\u591A\u4E86\u3002\u6211\u60F3\u8BF7\u95EE\u53EF\u4E0D\u53EF\u4EE5\u628A\u622A\u6B62\u65E5\u671F\u5EF6\u5230\u4E0B\u661F\u671F\u4E00\uFF1F\u6211\u4FDD\u8BC1\u661F\u671F\u4E00\u4E4B\u524D\u4E00\u5B9A\u4EA4\u4E0A\u6765\u3002

\u8C22\u8C22\u60A8\u7684\u7406\u89E3\uFF0C\u7ED9\u60A8\u6DFB\u9EBB\u70E6\u4E86\u3002

\u5B66\u751F \u656C\u4E0A`,
  },
  {
    id: "er-03",
    format: "email_response",
    theme: "science_technology",
    title: "Reply About a Study Group",
    titleChinese: "\u56DE\u590D\u5173\u4E8E\u5B66\u4E60\u5C0F\u7EC4\u7684\u90AE\u4EF6",
    prompt: `You received this email from your classmate Liu Mei:

"Hey! A few of us are forming a study group for the upcoming math test. We meet in the library after school on Tuesdays and Thursdays. Want to join? We also use an online chat to share notes. -- Liu Mei"

Write a reply expressing interest. Ask about the online platform they use, mention you can come on Thursdays but not Tuesdays, and offer to share your practice problems.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u8868\u793A\u611F\u5174\u8DA3\u3002\u95EE\u4ED6\u4EEC\u7528\u4EC0\u4E48\u5728\u7EBF\u5E73\u53F0\uFF0C\u8BF4\u4F60\u5468\u56DB\u53EF\u4EE5\u4F46\u5468\u4E8C\u4E0D\u884C\uFF0C\u5E76\u63D0\u51FA\u53EF\u4EE5\u5206\u4EAB\u4F60\u7684\u7EC3\u4E60\u9898\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Addresses all three points", "Friendly casual tone", "Clear and organized response", "Appropriate email format"],
    modelResponse: `\u5218\u6885\uFF1A

\u4F60\u597D\uFF01\u8C22\u8C22\u4F60\u544A\u8BC9\u6211\u5B66\u4E60\u5C0F\u7EC4\u7684\u4E8B\u3002\u6211\u5F88\u60F3\u52A0\u5165\uFF01

\u4E0D\u8FC7\u6211\u5468\u4E8C\u653E\u5B66\u540E\u6709\u94A2\u7434\u8BFE\uFF0C\u6240\u4EE5\u53EA\u80FD\u5468\u56DB\u6765\u56FE\u4E66\u9986\u3002\u4F60\u4EEC\u7528\u7684\u662F\u4EC0\u4E48\u5728\u7EBF\u5E73\u53F0\uFF1F\u8FD9\u6837\u5468\u4E8C\u7684\u5185\u5BB9\u6211\u4E5F\u4E0D\u4F1A\u9519\u8FC7\u3002

\u53E6\u5916\uFF0C\u6211\u6709\u5F88\u591A\u6570\u5B66\u7EC3\u4E60\u9898\uFF0C\u53EF\u4EE5\u5206\u4EAB\u7ED9\u5927\u5BB6\u3002\u5E0C\u671B\u5BF9\u5927\u5BB6\u7684\u590D\u4E60\u6709\u5E2E\u52A9\uFF01

\u5468\u56DB\u89C1\uFF01`,
  },
  {
    id: "er-04",
    format: "email_response",
    theme: "beauty_aesthetics",
    title: "Reply About a Photography Club Trip",
    titleChinese: "\u56DE\u590D\u6444\u5F71\u793E\u6D3B\u52A8",
    prompt: `You received this email from the photography club president:

"Hi everyone! This Saturday we are going to the botanical garden for a photo shoot. Meet at school at 8 AM. Bring your camera and lunch. Theme: Spring Colors. -- Club President Chen"

Write a reply confirming attendance. Ask if phone cameras are okay since yours is broken, mention your favorite flower to photograph, and ask if anyone can carpool.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u786E\u8BA4\u53C2\u52A0\u3002\u95EE\u624B\u673A\u62CD\u7167\u884C\u4E0D\u884C\uFF0C\u63D0\u5230\u4F60\u6700\u559C\u6B22\u62CD\u7684\u82B1\uFF0C\u95EE\u6709\u6CA1\u6709\u4EBA\u53EF\u4EE5\u62FC\u8F66\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Confirms attendance clearly", "Asks about phone camera appropriately", "Mentions specific flower interest", "Asks about carpooling naturally"],
    modelResponse: `\u9648\u793E\u957F\uFF1A

\u4F60\u597D\uFF01\u6211\u5F88\u671F\u5F85\u661F\u671F\u516D\u53BB\u690D\u7269\u56ED\u62CD\u7167\uFF01\u6211\u4E00\u5B9A\u4F1A\u53C2\u52A0\u7684\u3002

\u4E0D\u8FC7\u6211\u6709\u4E00\u4E2A\u95EE\u9898\uFF1A\u6211\u7684\u76F8\u673A\u4E0A\u5468\u6454\u574F\u4E86\uFF0C\u8FD8\u6CA1\u4FEE\u597D\u3002\u53EF\u4EE5\u7528\u624B\u673A\u62CD\u7167\u5417\uFF1F

\u6211\u6700\u559C\u6B22\u62CD\u6A31\u82B1\uFF0C\u5E0C\u671B\u690D\u7269\u56ED\u91CC\u6709\u5F88\u591A\u3002\u53E6\u5916\uFF0C\u6709\u6CA1\u6709\u4EBA\u53EF\u4EE5\u62FC\u8F66\uFF1F\u6211\u5BB6\u6BD4\u8F83\u8FDC\u3002

\u8C22\u8C22\uFF01\u661F\u671F\u516D\u89C1\uFF01`,
  },
  {
    id: "er-05",
    format: "email_response",
    theme: "global_challenges",
    title: "Reply About Volunteering at a Food Bank",
    titleChinese: "\u56DE\u590D\u98DF\u7269\u94F6\u884C\u5FD7\u613F\u8005\u90AE\u4EF6",
    prompt: `You received this email from the school community service coordinator:

"Dear students, we need volunteers to help at the local food bank this Sunday from 9 AM to 1 PM. Tasks include sorting donations and packing food boxes. Please sign up if interested. -- Mr. Wang"

Write a reply signing up. Ask if you can bring a friend, mention any previous volunteer experience, and ask what to wear.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u62A5\u540D\u53C2\u52A0\u3002\u95EE\u80FD\u4E0D\u80FD\u5E26\u670B\u53CB\uFF0C\u63D0\u5230\u4F60\u4E4B\u524D\u7684\u5FD7\u613F\u8005\u7ECF\u9A8C\uFF0C\u95EE\u5E94\u8BE5\u7A7F\u4EC0\u4E48\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Signs up clearly", "Asks about bringing a friend", "Mentions volunteer experience", "Asks about dress code"],
    modelResponse: `\u738B\u8001\u5E08\uFF1A

\u60A8\u597D\uFF01\u6211\u60F3\u62A5\u540D\u53C2\u52A0\u661F\u671F\u5929\u7684\u98DF\u7269\u94F6\u884C\u5FD7\u613F\u6D3B\u52A8\u3002

\u6211\u53BB\u5E74\u5728\u793E\u533A\u4E2D\u5FC3\u5E2E\u5FD9\u53D1\u8FC7\u7269\u8D44\uFF0C\u6709\u4E00\u4E9B\u5FD7\u613F\u8005\u7ECF\u9A8C\u3002\u8BF7\u95EE\u6211\u53EF\u4EE5\u5E26\u4E00\u4E2A\u670B\u53CB\u4E00\u8D77\u6765\u5417\uFF1F

\u53E6\u5916\uFF0C\u6211\u4EEC\u9700\u8981\u7A7F\u4EC0\u4E48\u6837\u7684\u8863\u670D\uFF1F\u662F\u4E0D\u662F\u9700\u8981\u7A7F\u8FD0\u52A8\u978B\uFF1F

\u8C22\u8C22\uFF01

\u5B66\u751F \u656C\u4E0A`,
  },
  {
    id: "er-06",
    format: "email_response",
    theme: "personal_public_identities",
    title: "Reply About a Language Exchange Partner",
    titleChinese: "\u56DE\u590D\u8BED\u8A00\u4EA4\u6362\u4F19\u4F34",
    prompt: `You received this email from a potential language exchange partner in Beijing:

"Hello! My name is Li Hua. I am 16 and I want to practice English. I can help you with Chinese. Want to video call once a week? I like movies and basketball. -- Li Hua"

Write a reply introducing yourself. Accept the weekly video call proposal, suggest a day and time, mention your interests, and ask what movies they like.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u81EA\u6211\u4ECB\u7ECD\u3002\u63A5\u53D7\u6BCF\u5468\u89C6\u9891\u901A\u8BDD\u7684\u63D0\u8BAE\uFF0C\u5EFA\u8BAE\u4E00\u4E2A\u65F6\u95F4\uFF0C\u63D0\u5230\u4F60\u7684\u5174\u8DA3\uFF0C\u95EE\u4ED6\u559C\u6B22\u4EC0\u4E48\u7535\u5F71\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Self-introduction included", "Accepts proposal and suggests schedule", "Shares personal interests", "Asks follow-up question about movies"],
    modelResponse: `\u674E\u534E\uFF1A

\u4F60\u597D\uFF01\u6211\u53EBDavid\uFF0C\u4ECA\u5E74\u5341\u4E03\u5C81\uFF0C\u4F4F\u5728\u7F8E\u56FD\u3002\u6211\u6B63\u5728\u5B66\u4E2D\u6587\uFF0C\u5F88\u9AD8\u5174\u80FD\u627E\u5230\u4E00\u4E2A\u8BED\u8A00\u4EA4\u6362\u7684\u4F19\u4F34\uFF01

\u6BCF\u5468\u89C6\u9891\u901A\u8BDD\u4E00\u6B21\u662F\u4E2A\u597D\u4E3B\u610F\u3002\u4F60\u89C9\u5F97\u6BCF\u4E2A\u661F\u671F\u516D\u4E0A\u5348\u5341\u70B9\u600E\u4E48\u6837\uFF1F

\u6211\u4E5F\u5F88\u559C\u6B22\u7BEE\u7403\uFF01\u6211\u8FD8\u559C\u6B22\u542C\u97F3\u4E50\u548C\u770B\u4E66\u3002\u4F60\u559C\u6B22\u4EC0\u4E48\u7C7B\u578B\u7684\u7535\u5F71\uFF1F

\u671F\u5F85\u548C\u4F60\u804A\u5929\uFF01`,
  },
  {
    id: "er-07",
    format: "email_response",
    theme: "families_communities",
    title: "Reply to a Cousin Travel Plans",
    titleChinese: "\u56DE\u590D\u8868\u54E5\u7684\u65C5\u884C\u8BA1\u5212",
    prompt: `You received this email from your cousin in China:

"Hi cousin! I am planning to visit your city next month for a week. I have never been to America before. What should I see? What is the weather like? Can I stay at your house? -- Cousin Ming"

Write a reply welcoming them. Suggest 2-3 places to visit, describe the weather, and confirm they can stay at your house.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u6B22\u8FCE\u4ED6\u3002\u5EFA\u8BAE\u4E24\u5230\u4E09\u4E2A\u53EF\u4EE5\u53BB\u7684\u5730\u65B9\uFF0C\u63CF\u8FF0\u5929\u6C14\uFF0C\u786E\u8BA4\u4ED6\u53EF\u4EE5\u4F4F\u4F60\u5BB6\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Warm welcoming tone", "2-3 specific place suggestions", "Weather description", "Confirms accommodation"],
    modelResponse: `\u8868\u54E5\uFF1A

\u4F60\u597D\uFF01\u592A\u597D\u4E86\uFF0C\u4F60\u8981\u6765\u7F8E\u56FD\uFF01\u6211\u4EEC\u5168\u5BB6\u90FD\u5F88\u671F\u5F85\u89C1\u5230\u4F60\uFF01

\u4E0B\u4E2A\u6708\u8FD9\u91CC\u7684\u5929\u6C14\u5F88\u6696\u548C\uFF0C\u5927\u6982\u4E8C\u5341\u5230\u4E8C\u5341\u4E94\u5EA6\uFF0C\u4F46\u6709\u65F6\u5019\u4F1A\u4E0B\u96E8\uFF0C\u8BB0\u5F97\u5E26\u96E8\u4F1E\u3002

\u6211\u63A8\u8350\u4F60\u53BB\u8FD9\u51E0\u4E2A\u5730\u65B9\uFF1A\u7B2C\u4E00\u662F\u5E02\u4E2D\u5FC3\u7684\u535A\u7269\u9986\uFF0C\u7B2C\u4E8C\u662F\u6D77\u8FB9\u7684\u516C\u56ED\uFF0C\u7B2C\u4E09\u662F\u5510\u4EBA\u8857\u3002

\u4F60\u5F53\u7136\u53EF\u4EE5\u4F4F\u6211\u5BB6\uFF01\u6211\u4F1A\u628A\u5BA2\u623F\u6536\u62FE\u597D\u7684\u3002\u5FEB\u6765\u5427\uFF01

\u4F60\u7684\u8868\u5F1F`,
  },
  {
    id: "er-08",
    format: "email_response",
    theme: "contemporary_life",
    title: "Reply About a Lost Item",
    titleChinese: "\u56DE\u590D\u5173\u4E8E\u4E22\u5931\u7269\u54C1\u7684\u90AE\u4EF6",
    prompt: `You received this email from the school lost and found office:

"Hello, we found a blue backpack with books and a pencil case in the cafeteria. Does it belong to you? Please come to Room 102 to identify it. Office hours: 8 AM - 4 PM. -- Lost and Found Office"

Write a reply confirming it is yours. Describe a specific item inside the bag to prove ownership, mention when you will come to pick it up, and thank them.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u786E\u8BA4\u662F\u4F60\u7684\u3002\u63CF\u8FF0\u5305\u91CC\u7684\u4E00\u4EF6\u5177\u4F53\u7269\u54C1\u6765\u8BC1\u660E\uFF0C\u8BF4\u4F60\u4EC0\u4E48\u65F6\u5019\u6765\u62FF\uFF0C\u5E76\u8868\u793A\u611F\u8C22\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Confirms ownership clearly", "Provides identifying detail", "States pickup time", "Expresses gratitude"],
    modelResponse: `\u60A8\u597D\uFF01

\u8C22\u8C22\u4F60\u4EEC\u627E\u5230\u4E86\u6211\u7684\u80CC\u5305\uFF01\u90A3\u4E2A\u84DD\u8272\u7684\u80CC\u5305\u662F\u6211\u7684\u3002

\u91CC\u9762\u5E94\u8BE5\u6709\u4E00\u672C\u7EA2\u8272\u5C01\u9762\u7684\u4E2D\u6587\u8BFE\u672C\uFF0C\u4E0A\u9762\u5199\u7740\u6211\u7684\u540D\u5B57\u3002\u94C5\u7B14\u76D2\u662F\u9ED1\u8272\u7684\uFF0C\u91CC\u9762\u6709\u4E24\u652F\u84DD\u8272\u7684\u7B14\u3002

\u6211\u4ECA\u5929\u4E0B\u5348\u4E09\u70B9\u4E0B\u8BFE\u4EE5\u540E\u5C31\u53BB102\u5BA4\u6765\u62FF\u3002

\u975E\u5E38\u611F\u8C22\uFF01

\u5B66\u751F \u656C\u4E0A`,
  },
  {
    id: "er-09",
    format: "email_response",
    theme: "science_technology",
    title: "Reply About a Coding Workshop",
    titleChinese: "\u56DE\u590D\u7F16\u7A0B\u5DE5\u4F5C\u574A\u90AE\u4EF6",
    prompt: `You received this email from the school technology club:

"Hi! We are hosting a Python coding workshop this Saturday from 10 AM to 2 PM in the computer lab. No experience needed! We will build a simple game. Bring your laptop. -- Tech Club"

Write a reply signing up. Ask if you should install Python beforehand, mention your interest in learning coding, and ask if lunch is provided.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u62A5\u540D\u3002\u95EE\u662F\u5426\u9700\u8981\u63D0\u524D\u5B89\u88C5Python\uFF0C\u63D0\u5230\u4F60\u5BF9\u5B66\u4E60\u7F16\u7A0B\u7684\u5174\u8DA3\uFF0C\u95EE\u662F\u5426\u63D0\u4F9B\u5348\u9910\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Signs up clearly", "Asks about Python installation", "Expresses coding interest", "Asks about lunch"],
    modelResponse: `\u79D1\u6280\u793E\uFF1A

\u4F60\u4EEC\u597D\uFF01\u8FD9\u4E2A\u7F16\u7A0B\u5DE5\u4F5C\u574A\u542C\u8D77\u6765\u592A\u68D2\u4E86\uFF01\u6211\u60F3\u62A5\u540D\u53C2\u52A0\u3002

\u6211\u4E00\u76F4\u5BF9\u7F16\u7A0B\u5F88\u611F\u5174\u8DA3\uFF0C\u4F46\u4ECE\u6765\u6CA1\u6709\u5B66\u8FC7\u3002\u8BF7\u95EE\u6211\u9700\u8981\u63D0\u524D\u5728\u7535\u8111\u4E0A\u5B89\u88C5Python\u5417\uFF1F

\u53E6\u5916\uFF0C\u5DE5\u4F5C\u574A\u4ECE\u5341\u70B9\u5230\u4E24\u70B9\uFF0C\u65F6\u95F4\u6BD4\u8F83\u957F\u3002\u8BF7\u95EE\u4F1A\u63D0\u4F9B\u5348\u9910\u5417\uFF1F

\u8C22\u8C22\uFF01\u661F\u671F\u516D\u89C1\uFF01`,
  },
  {
    id: "er-10",
    format: "email_response",
    theme: "beauty_aesthetics",
    title: "Reply About a Music Concert",
    titleChinese: "\u56DE\u590D\u97F3\u4E50\u4F1A\u90AE\u4EF6",
    prompt: `You received this email from your friend:

"Hi! There is a traditional Chinese music concert at the cultural center next Friday evening. I have an extra ticket. Want to come with me? It starts at 7 PM. -- Your friend Xiao Hong"

Write a reply accepting the offer. Express your excitement about traditional music, ask what instruments will be played, and suggest meeting for dinner beforehand.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u63A5\u53D7\u9080\u8BF7\u3002\u8868\u8FBE\u5BF9\u4F20\u7EDF\u97F3\u4E50\u7684\u70ED\u60C5\uFF0C\u95EE\u4F1A\u6F14\u594F\u4EC0\u4E48\u4E50\u5668\uFF0C\u5EFA\u8BAE\u5148\u4E00\u8D77\u5403\u665A\u996D\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Accepts invitation clearly", "Shows enthusiasm for traditional music", "Asks about instruments", "Suggests pre-concert dinner"],
    modelResponse: `\u5C0F\u7EA2\uFF1A

\u4F60\u597D\uFF01\u592A\u597D\u4E86\uFF0C\u6211\u5F88\u60F3\u53BB\u542C\u90A3\u573A\u97F3\u4E50\u4F1A\uFF01\u8C22\u8C22\u4F60\u9080\u8BF7\u6211\u3002

\u6211\u5F88\u559C\u6B22\u4E2D\u56FD\u4F20\u7EDF\u97F3\u4E50\u3002\u4F60\u77E5\u9053\u4F1A\u6F14\u594F\u4EC0\u4E48\u4E50\u5668\u5417\uFF1F\u6211\u7279\u522B\u60F3\u542C\u4E8C\u80E1\u548C\u53E4\u7B5D\u7684\u6F14\u594F\u3002

\u97F3\u4E50\u4F1A\u4E03\u70B9\u5F00\u59CB\uFF0C\u6211\u4EEC\u8981\u4E0D\u8981\u5148\u53BB\u5403\u4E2A\u665A\u996D\uFF1F\u6587\u5316\u4E2D\u5FC3\u9644\u8FD1\u6709\u4E00\u5BB6\u4E0D\u9519\u7684\u9762\u9986\u3002\u6211\u4EEC\u53EF\u4EE5\u4E94\u70B9\u534A\u89C1\u9762\u3002

\u661F\u671F\u4E94\u89C1\uFF01`,
  },
  {
    id: "er-11",
    format: "email_response",
    theme: "global_challenges",
    title: "Reply About an Environmental Essay Contest",
    titleChinese: "\u56DE\u590D\u73AF\u4FDD\u4F5C\u6587\u6BD4\u8D5B\u90AE\u4EF6",
    prompt: `You received this email from your school newsletter:

"Dear students, our school is hosting an essay contest about environmental protection. Topic: What I Can Do to Help the Planet. Deadline: March 15. Prizes for top 3. Maximum 500 words in Chinese. -- School Newsletter"

Write a reply expressing interest in participating. Share your essay topic idea, ask about the word count (is it strict?), and ask where to submit.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u8868\u793A\u6709\u5174\u8DA3\u53C2\u52A0\u3002\u5206\u4EAB\u4F60\u7684\u4F5C\u6587\u60F3\u6CD5\uFF0C\u95EE\u5B57\u6570\u9650\u5236\u4E25\u683C\u5417\uFF0C\u95EE\u5728\u54EA\u91CC\u63D0\u4EA4\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Expresses interest clearly", "Shares a specific essay idea", "Asks about word count", "Asks about submission method"],
    modelResponse: `\u8001\u5E08\uFF1A

\u60A8\u597D\uFF01\u6211\u5BF9\u73AF\u4FDD\u4F5C\u6587\u6BD4\u8D5B\u5F88\u611F\u5174\u8DA3\uFF0C\u60F3\u62A5\u540D\u53C2\u52A0\u3002

\u6211\u6253\u7B97\u5199\u7684\u4E3B\u9898\u662F\u300C\u51CF\u5C11\u5851\u6599\u4F7F\u7528\u300D\uFF0C\u56E0\u4E3A\u6211\u89C9\u5F97\u5851\u6599\u6C61\u67D3\u662F\u73B0\u5728\u6700\u4E25\u91CD\u7684\u73AF\u5883\u95EE\u9898\u4E4B\u4E00\u3002

\u8BF7\u95EE\u4E94\u767E\u5B57\u7684\u9650\u5236\u662F\u4E25\u683C\u7684\u5417\uFF1F\u5982\u679C\u591A\u5199\u4E86\u4E00\u70B9\u70B9\u53EF\u4EE5\u5417\uFF1F\u53E6\u5916\uFF0C\u4F5C\u6587\u5E94\u8BE5\u63D0\u4EA4\u5230\u54EA\u91CC\uFF1F

\u8C22\u8C22\uFF01`,
  },
  {
    id: "er-12",
    format: "email_response",
    theme: "personal_public_identities",
    title: "Reply About Joining a Sports Team",
    titleChinese: "\u56DE\u590D\u52A0\u5165\u8FD0\u52A8\u961F\u90AE\u4EF6",
    prompt: `You received this email from the school basketball team captain:

"Hey! We saw you playing basketball at lunch and you are really good! Our team has tryouts this Thursday at 4 PM in the gym. Interested in joining? -- Captain Zhang"

Write a reply expressing excitement. Confirm you will be at tryouts, ask about the practice schedule, and mention your basketball experience.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u8868\u793A\u5174\u594B\u3002\u786E\u8BA4\u4F60\u4F1A\u53BB\u9009\u62D4\uFF0C\u95EE\u8BAD\u7EC3\u65F6\u95F4\u5B89\u6392\uFF0C\u63D0\u5230\u4F60\u7684\u7BEE\u7403\u7ECF\u5386\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Shows enthusiasm", "Confirms tryout attendance", "Asks about practice schedule", "Mentions basketball background"],
    modelResponse: `\u5F20\u961F\u957F\uFF1A

\u4F60\u597D\uFF01\u6536\u5230\u4F60\u7684\u90AE\u4EF6\u6211\u771F\u7684\u592A\u9AD8\u5174\u4E86\uFF01\u6211\u5F88\u60F3\u52A0\u5165\u5B66\u6821\u7BEE\u7403\u961F\uFF01

\u6211\u4E00\u5B9A\u4F1A\u661F\u671F\u56DB\u4E0B\u5348\u56DB\u70B9\u53BB\u4F53\u80B2\u9986\u53C2\u52A0\u9009\u62D4\u7684\u3002\u6211\u4ECE\u5C0F\u5B66\u4E94\u5E74\u7EA7\u5C31\u5F00\u59CB\u6253\u7BEE\u7403\u4E86\uFF0C\u4EE5\u524D\u5728\u521D\u4E2D\u7684\u6821\u961F\u6253\u8FC7\u540E\u536B\u3002

\u8BF7\u95EE\u5E73\u65F6\u7684\u8BAD\u7EC3\u662F\u4EC0\u4E48\u65F6\u5019\uFF1F\u6BCF\u5468\u7EC3\u51E0\u6B21\uFF1F

\u8C22\u8C22\uFF01\u661F\u671F\u56DB\u89C1\uFF01`,
  },
  {
    id: "er-13",
    format: "email_response",
    theme: "families_communities",
    title: "Reply About a Community Festival",
    titleChinese: "\u56DE\u590D\u793E\u533A\u8282\u65E5\u6D3B\u52A8\u90AE\u4EF6",
    prompt: `You received this email from your neighborhood committee:

"Dear residents, our annual Mid-Autumn Festival celebration will be held on September 29th in the community park from 4-8 PM. We need volunteers to help with setup and moon cake distribution. -- Neighborhood Committee"

Write a reply volunteering. Ask what time to arrive for setup, mention you can also help with cleanup, and ask if your younger sibling can come along.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u62A5\u540D\u5F53\u5FD7\u613F\u8005\u3002\u95EE\u51E0\u70B9\u5230\u573A\u5E03\u7F6E\uFF0C\u63D0\u5230\u4F60\u4E5F\u53EF\u4EE5\u5E2E\u5FD9\u6536\u62FE\uFF0C\u95EE\u5F1F\u5F1F/\u59B9\u59B9\u80FD\u4E0D\u80FD\u4E00\u8D77\u6765\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Volunteers clearly", "Asks about setup time", "Offers additional help with cleanup", "Asks about bringing sibling"],
    modelResponse: `\u793E\u533A\u59D4\u5458\u4F1A\uFF1A

\u60A8\u597D\uFF01\u6211\u5F88\u4E50\u610F\u5F53\u4E2D\u79CB\u8282\u6D3B\u52A8\u7684\u5FD7\u613F\u8005\u3002

\u8BF7\u95EE\u5E03\u7F6E\u9700\u8981\u51E0\u70B9\u5230\uFF1F\u53E6\u5916\uFF0C\u6D3B\u52A8\u7ED3\u675F\u4EE5\u540E\u6211\u4E5F\u53EF\u4EE5\u7559\u4E0B\u6765\u5E2E\u5FD9\u6536\u62FE\u548C\u6253\u626B\u3002

\u8FD8\u6709\u4E00\u4E2A\u95EE\u9898\uFF0C\u6211\u7684\u5F1F\u5F1F\u4ECA\u5E74\u5341\u5C81\uFF0C\u4ED6\u4E5F\u60F3\u53C2\u52A0\u3002\u53EF\u4EE5\u5E26\u4ED6\u4E00\u8D77\u6765\u5417\uFF1F

\u8C22\u8C22\uFF01\u671F\u5F85\u4E2D\u79CB\u8282\u7684\u6D3B\u52A8\uFF01`,
  },
  {
    id: "er-14",
    format: "email_response",
    theme: "contemporary_life",
    title: "Reply About a Book Recommendation",
    titleChinese: "\u56DE\u590D\u63A8\u8350\u4E66\u7684\u90AE\u4EF6",
    prompt: `You received this email from your friend:

"Hi! I just finished reading a great Chinese novel called To Live by Yu Hua. Have you read it? I think you would really like it. I can lend it to you. -- Friend Mei"

Write a reply saying you have not read it but are interested. Ask what it is about, mention a book you recently read, and accept the offer to borrow it.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u8BF4\u4F60\u6CA1\u8BFB\u8FC7\u4F46\u5F88\u611F\u5174\u8DA3\u3002\u95EE\u8FD9\u672C\u4E66\u8BB2\u4EC0\u4E48\uFF0C\u63D0\u5230\u4F60\u6700\u8FD1\u8BFB\u7684\u4E00\u672C\u4E66\uFF0C\u5E76\u63A5\u53D7\u501F\u4E66\u7684\u63D0\u8BAE\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Acknowledges the recommendation", "Asks about the book content", "Shares own reading experience", "Accepts to borrow it"],
    modelResponse: `\u6885\uFF1A

\u4F60\u597D\uFF01\u8C22\u8C22\u4F60\u7684\u63A8\u8350\uFF01\u6211\u542C\u8BF4\u8FC7\u300A\u6D3B\u7740\u300B\u8FD9\u672C\u4E66\uFF0C\u4F46\u8FD8\u6CA1\u6709\u8BFB\u8FC7\u3002\u4F60\u80FD\u8DDF\u6211\u8BF4\u8BF4\u8FD9\u672C\u4E66\u8BB2\u7684\u662F\u4EC0\u4E48\u5417\uFF1F

\u6211\u6700\u8FD1\u521A\u8BFB\u5B8C\u4E00\u672C\u53EB\u300A\u4E09\u4F53\u300B\u7684\u79D1\u5E7B\u5C0F\u8BF4\uFF0C\u7279\u522B\u597D\u770B\uFF0C\u63A8\u8350\u4F60\u4E5F\u8BD5\u8BD5\u3002

\u6211\u5F88\u60F3\u501F\u4F60\u7684\u300A\u6D3B\u7740\u300B\u6765\u8BFB\uFF01\u4F60\u65B9\u4FBF\u7684\u8BDD\u53EF\u4EE5\u660E\u5929\u5E26\u5230\u5B66\u6821\u6765\u5417\uFF1F

\u8C22\u8C22\uFF01`,
  },
  {
    id: "er-15",
    format: "email_response",
    theme: "science_technology",
    title: "Reply About a Field Trip to a Science Museum",
    titleChinese: "\u56DE\u590D\u79D1\u6280\u9986\u53C2\u89C2\u90AE\u4EF6",
    prompt: `You received this email from your science teacher:

"Dear class, we will visit the Science and Technology Museum next Wednesday. The bus leaves at 8:30 AM sharp. Do not forget permission slips! We will see the space exhibit and the robotics lab. -- Mrs. Zhou"

Write a reply confirming you will attend. Say you are most excited about the space exhibit, ask if you can bring a notebook to take notes, and confirm your permission slip is signed.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u786E\u8BA4\u53C2\u52A0\u3002\u8BF4\u4F60\u6700\u671F\u5F85\u592A\u7A7A\u5C55\uFF0C\u95EE\u80FD\u4E0D\u80FD\u5E26\u7B14\u8BB0\u672C\u505A\u7B14\u8BB0\uFF0C\u786E\u8BA4\u5BB6\u957F\u540C\u610F\u4E66\u5DF2\u7B7E\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Confirms attendance", "Expresses excitement about space exhibit", "Asks about notebook", "Confirms permission slip is ready"],
    modelResponse: `\u5468\u8001\u5E08\uFF1A

\u60A8\u597D\uFF01\u6211\u5F88\u671F\u5F85\u4E0B\u5468\u4E09\u53BB\u79D1\u6280\u9986\u53C2\u89C2\uFF01\u6211\u4E00\u5B9A\u4F1A\u51C6\u65F6\u5230\u3002

\u6211\u5BF9\u592A\u7A7A\u5C55\u6700\u611F\u5174\u8DA3\u3002\u8BF7\u95EE\u6211\u53EF\u4EE5\u5E26\u4E00\u4E2A\u7B14\u8BB0\u672C\u53BB\u505A\u7B14\u8BB0\u5417\uFF1F

\u5BB6\u957F\u540C\u610F\u4E66\u6211\u5DF2\u7ECF\u8BA9\u7238\u7238\u7B7E\u597D\u4E86\uFF0C\u661F\u671F\u4E00\u5C31\u4EA4\u7ED9\u60A8\u3002

\u8C22\u8C22\uFF01

\u5B66\u751F \u656C\u4E0A`,
  },
  {
    id: "er-16",
    format: "email_response",
    theme: "beauty_aesthetics",
    title: "Reply About a Dance Performance",
    titleChinese: "\u56DE\u590D\u821E\u8E48\u8868\u6F14\u90AE\u4EF6",
    prompt: `You received this email from the school dance club:

"Hello! We are performing a traditional Chinese dance at the school assembly next month. We need 2 more dancers. No experience required, we will teach you! Rehearsals are Monday and Wednesday after school. -- Dance Club"

Write a reply expressing interest in joining. Ask about the dance style, mention any relevant experience, and confirm your availability for rehearsals.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u8868\u793A\u6709\u5174\u8DA3\u52A0\u5165\u3002\u95EE\u821E\u8E48\u98CE\u683C\uFF0C\u63D0\u5230\u76F8\u5173\u7ECF\u9A8C\uFF0C\u786E\u8BA4\u6392\u7EC3\u65F6\u95F4\u53EF\u4EE5\u53C2\u52A0\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Shows genuine interest", "Asks about dance style", "Mentions relevant experience", "Confirms rehearsal schedule"],
    modelResponse: `\u821E\u8E48\u793E\uFF1A

\u4F60\u4EEC\u597D\uFF01\u6211\u770B\u5230\u4F60\u4EEC\u5728\u627E\u821E\u8005\uFF0C\u6211\u5F88\u6709\u5174\u8DA3\u52A0\u5165\uFF01

\u8BF7\u95EE\u4F60\u4EEC\u8981\u8868\u6F14\u7684\u662F\u4EC0\u4E48\u7C7B\u578B\u7684\u4E2D\u56FD\u4F20\u7EDF\u821E\u8E48\uFF1F\u6211\u5C0F\u65F6\u5019\u5B66\u8FC7\u4E24\u5E74\u4E2D\u56FD\u821E\uFF0C\u57FA\u672C\u529F\u8FD8\u8BB0\u5F97\u4E00\u4E9B\u3002

\u5468\u4E00\u548C\u5468\u4E09\u653E\u5B66\u540E\u6211\u90FD\u6709\u65F6\u95F4\uFF0C\u53EF\u4EE5\u53C2\u52A0\u6392\u7EC3\u3002\u8BF7\u544A\u8BC9\u6211\u7B2C\u4E00\u6B21\u6392\u7EC3\u662F\u4EC0\u4E48\u65F6\u5019\u3002

\u8C22\u8C22\uFF01`,
  },
  {
    id: "er-17",
    format: "email_response",
    theme: "global_challenges",
    title: "Reply About a Charity Run",
    titleChinese: "\u56DE\u590D\u6148\u5584\u8DD1\u6B65\u90AE\u4EF6",
    prompt: `You received this email from a community organizer:

"Dear community members, we are organizing a 5K charity run to raise money for the children hospital. Date: April 20th, 9 AM at Central Park. Registration fee: $20. Family and friends welcome! -- Community Center"

Write a reply registering yourself. Ask if there is a student discount, mention you will bring your family, and ask about the route.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u62A5\u540D\u3002\u95EE\u6709\u6CA1\u6709\u5B66\u751F\u6298\u6263\uFF0C\u63D0\u5230\u4F60\u4F1A\u5E26\u5BB6\u4EBA\u6765\uFF0C\u95EE\u8DD1\u6B65\u8DEF\u7EBF\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Registers clearly", "Asks about student discount", "Mentions bringing family", "Asks about the route"],
    modelResponse: `\u793E\u533A\u4E2D\u5FC3\uFF1A

\u60A8\u597D\uFF01\u6211\u60F3\u62A5\u540D\u53C2\u52A0\u56DB\u6708\u4E8C\u5341\u65E5\u7684\u6148\u5584\u8DD1\u6B65\u6D3B\u52A8\u3002\u4E3A\u513F\u7AE5\u533B\u9662\u7B79\u6B3E\u662F\u4E00\u4EF6\u5F88\u6709\u610F\u4E49\u7684\u4E8B\u3002

\u8BF7\u95EE\u5B66\u751F\u6709\u6CA1\u6709\u4F18\u60E0\u4EF7\uFF1F\u53E6\u5916\uFF0C\u6211\u7684\u7238\u7238\u5988\u5988\u548C\u5F1F\u5F1F\u4E5F\u60F3\u53C2\u52A0\uFF0C\u6211\u4EEC\u4E00\u5171\u56DB\u4E2A\u4EBA\u3002

\u8BF7\u95EE\u8DD1\u6B65\u7684\u8DEF\u7EBF\u662F\u4EC0\u4E48\u6837\u7684\uFF1F\u662F\u5728\u516C\u56ED\u91CC\u7ED5\u5708\u8DD1\u5417\uFF1F

\u8C22\u8C22\uFF01`,
  },
  {
    id: "er-18",
    format: "email_response",
    theme: "personal_public_identities",
    title: "Reply About a Pen Pal Letter",
    titleChinese: "\u56DE\u590D\u7B14\u53CB\u6765\u4FE1",
    prompt: `You received this email from a pen pal in Shanghai:

"Hi! I am Wang Lin, your new pen pal. I am 15, in 10th grade. I live in Shanghai and love drawing manga. What is life like where you live? What are your hobbies? I hope we can be good friends! -- Wang Lin"

Write a reply introducing yourself and your city. Share 2-3 hobbies, ask about their manga drawings, and express hope for a long friendship.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u4ECB\u7ECD\u81EA\u5DF1\u548C\u4F60\u7684\u57CE\u5E02\u3002\u5206\u4EAB\u4E24\u5230\u4E09\u4E2A\u7231\u597D\uFF0C\u95EE\u4ED6\u7684\u6F2B\u753B\uFF0C\u8868\u8FBE\u5E0C\u671B\u957F\u671F\u505A\u670B\u53CB\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Self-introduction with city description", "Shares 2-3 hobbies", "Shows interest in pen pal manga", "Warm closing about friendship"],
    modelResponse: `\u738B\u6797\uFF1A

\u4F60\u597D\uFF01\u5F88\u9AD8\u5174\u8BA4\u8BC6\u4F60\uFF01\u6211\u53EBSarah\uFF0C\u4ECA\u5E74\u5341\u516D\u5C81\uFF0C\u4F4F\u5728\u6D1B\u6749\u77F6\u3002\u8FD9\u91CC\u4E00\u5E74\u56DB\u5B63\u90FD\u5F88\u6696\u548C\uFF0C\u6D77\u8FB9\u975E\u5E38\u6F02\u4EAE\u3002

\u6211\u7684\u7231\u597D\u662F\u5F39\u5409\u4ED6\u3001\u770B\u7535\u5F71\u548C\u6E38\u6CF3\u3002\u6211\u4E5F\u5F88\u559C\u6B22\u65E5\u672C\u52A8\u6F2B\uFF01\u4F60\u753B\u7684\u6F2B\u753B\u662F\u4EC0\u4E48\u98CE\u683C\u7684\uFF1F\u53EF\u4EE5\u7ED9\u6211\u770B\u770B\u5417\uFF1F

\u6211\u4E5F\u5E0C\u671B\u6211\u4EEC\u80FD\u6210\u4E3A\u597D\u670B\u53CB\uFF01\u4EE5\u540E\u6211\u4EEC\u53EF\u4EE5\u4E92\u76F8\u5206\u4EAB\u751F\u6D3B\u4E2D\u6709\u8DA3\u7684\u4E8B\u60C5\u3002

\u671F\u5F85\u4F60\u7684\u56DE\u4FE1\uFF01`,
  },
  {
    id: "er-19",
    format: "email_response",
    theme: "contemporary_life",
    title: "Reply About a Birthday Party",
    titleChinese: "\u56DE\u590D\u751F\u65E5\u6D3E\u5BF9\u9080\u8BF7",
    prompt: `You received this email from a classmate:

"Hey! I am having my birthday party this Saturday at 2 PM at the bowling alley. Then we are going for ice cream. Can you come? Let me know by Thursday! -- Your classmate Lily"

Write a reply saying you can come but will be 30 minutes late because of piano class. Ask what gift they would like, and mention you are excited about bowling.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u8BF4\u4F60\u80FD\u6765\u4F46\u4F1A\u8FDF\u5230\u4E09\u5341\u5206\u949F\u56E0\u4E3A\u6709\u94A2\u7434\u8BFE\u3002\u95EE\u5979\u60F3\u8981\u4EC0\u4E48\u793C\u7269\uFF0C\u63D0\u5230\u4F60\u5BF9\u6253\u4FDD\u9F84\u7403\u5F88\u671F\u5F85\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Accepts with explanation of delay", "Asks about gift preference", "Shows excitement about bowling", "Friendly tone"],
    modelResponse: `Lily\uFF1A

\u751F\u65E5\u5FEB\u4E50\uFF01\u8C22\u8C22\u4F60\u9080\u8BF7\u6211\u53C2\u52A0\u4F60\u7684\u751F\u65E5\u6D3E\u5BF9\uFF01

\u6211\u53EF\u4EE5\u6765\uFF0C\u4F46\u662F\u6211\u661F\u671F\u516D\u4E0B\u5348\u6709\u94A2\u7434\u8BFE\uFF0C\u4E24\u70B9\u534A\u624D\u4E0B\u8BFE\u3002\u6240\u4EE5\u6211\u5927\u6982\u4E24\u70B9\u534A\u5230\u4FDD\u9F84\u7403\u9986\uFF0C\u4F1A\u8FDF\u5230\u4E09\u5341\u5206\u949F\u3002

\u6211\u7279\u522B\u671F\u5F85\u6253\u4FDD\u9F84\u7403\uFF01\u5BF9\u4E86\uFF0C\u4F60\u751F\u65E5\u60F3\u8981\u4EC0\u4E48\u793C\u7269\uFF1F\u7ED9\u6211\u4E00\u4E9B\u63D0\u793A\u5427\uFF01

\u661F\u671F\u516D\u89C1\uFF01`,
  },
  {
    id: "er-20",
    format: "email_response",
    theme: "families_communities",
    title: "Reply About Helping a Neighbor",
    titleChinese: "\u56DE\u590D\u5E2E\u52A9\u90BB\u5C45\u7684\u90AE\u4EF6",
    prompt: `You received this email from your neighbor, Mrs. Chen:

"Hello dear, I need to go to the hospital for a check-up next Tuesday morning. Could you help walk my dog, Baobao, around 9 AM? He just needs a 20-minute walk in the park. I will give you some of my homemade cookies as thanks! -- Mrs. Chen"

Write a reply agreeing to help. Ask about the dog habits, confirm the park route, and politely respond to the cookie offer.`,
    promptChinese: `\u5199\u4E00\u5C01\u56DE\u590D\u540C\u610F\u5E2E\u5FD9\u3002\u95EE\u72D7\u7684\u4E60\u60EF\uFF0C\u786E\u8BA4\u516C\u56ED\u8DEF\u7EBF\uFF0C\u793C\u8C8C\u5730\u56DE\u5E94\u997C\u5E72\u7684\u63D0\u8BAE\u3002`,
    expectedCharacters: { min: 100, max: 150 },
    timeLimitMinutes: 15,
    rubricCriteria: ["Agrees to help warmly", "Asks about dog habits or needs", "Confirms logistics", "Politely responds to cookie offer"],
    modelResponse: `\u9648\u963F\u59E8\uFF1A

\u60A8\u597D\uFF01\u6211\u5F88\u613F\u610F\u5E2E\u60A8\u9076\u5B9D\u5B9D\uFF01\u4E0B\u5468\u4E8C\u65E9\u4E0A\u4E5D\u70B9\u6CA1\u95EE\u9898\u3002

\u8BF7\u95EE\u5B9D\u5B9D\u6709\u4EC0\u4E48\u7279\u522B\u7684\u4E60\u60EF\u5417\uFF1F\u6BD4\u5982\u4ED6\u6015\u4E0D\u6015\u5176\u4ED6\u7684\u72D7\uFF1F\u9700\u8981\u5E26\u6C34\u5417\uFF1F\u5E73\u65F6\u60A8\u4E00\u822C\u5E26\u4ED6\u5728\u516C\u56ED\u7684\u54EA\u6761\u8DEF\u4E0A\u8D70\uFF1F

\u60A8\u592A\u5BA2\u6C14\u4E86\uFF0C\u4E0D\u7528\u7ED9\u6211\u997C\u5E72\u7684\u3002\u4E0D\u8FC7\u5982\u679C\u60A8\u575A\u6301\u7684\u8BDD\uFF0C\u6211\u4E5F\u4E0D\u4F1A\u62D2\u7EDD\uFF0C\u56E0\u4E3A\u60A8\u505A\u7684\u997C\u5E72\u771F\u7684\u592A\u597D\u5403\u4E86\uFF01

\u795D\u60A8\u68C0\u67E5\u4E00\u5207\u987A\u5229\uFF01`,
  },
];

export function getWritingPrompt(id: string): WritingPrompt | undefined {
  return WRITING_PROMPTS.find((p) => p.id === id);
}

export function getStoryNarrationPrompts(): WritingPrompt[] {
  return WRITING_PROMPTS.filter((p) => p.format === "story_narration");
}

export function getEmailResponsePrompts(): WritingPrompt[] {
  return WRITING_PROMPTS.filter((p) => p.format === "email_response");
}

export function getRandomWritingPrompt(format?: "story_narration" | "email_response"): WritingPrompt {
  const pool = format ? WRITING_PROMPTS.filter((p) => p.format === format) : WRITING_PROMPTS;
  return pool[Math.floor(Math.random() * pool.length)];
}
