// Grammar lessons — one entry per pattern the Manhattan Mandarin class teaches,
// mapped to the HSK Standard Course chapter where it appears. Explanations are
// authored; example sentences are drawn from the class notes (resources/class-notes.pdf
// → classNotes.json). Pinyin is generated at runtime via pinyin-pro.
//
// Shape: { id, chapter, title, patternZh, summary, notes:[], examples:[{hanzi,en}],
//          drill: { keyword, options:[] }, why, contrasts:{ <distractor>: reason } }
//   why       — one line on why the keyword is the right fit (shown in drill feedback)
//   contrasts — why each wrong option doesn't fit (shown when the user picks it)

export const GRAMMAR = [
  // ── Chapter 1 ──────────────────────────────────────────────────────────
  {
    id: 'xiang', chapter: 1, title: 'Saying what you want — 想', patternZh: '我 + 想 + 动词',
    summary: '想 (xiǎng) before a verb means "want to / would like to" do something. Negate with 不想.',
    notes: ['Subject + 想 + verb (+ object).', 'Negative: 不想 = don\'t want to.'],
    examples: [
      { hanzi: '我想喝咖啡。', en: 'I want to drink coffee.' },
      { hanzi: '我不想喝咖啡。', en: "I don't want to drink coffee." },
      { hanzi: '我想吃北京烤鸭。', en: 'I want to eat Beijing roast duck.' },
      { hanzi: '我想喝茶。', en: 'I want to drink tea.' },
    ],
    drill: { keyword: '想', options: ['想', '是', '在', '都'] },
    why: '想 is the modal "want to" placed right before another verb.',
    contrasts: { '是': '是 links two nouns (A is B); it can\'t carry "want to".', '在': '在 marks an action in progress, not wanting.', '都': '都 means "all" and goes after the subject.' },
  },
  {
    id: 'keyi', chapter: 1, title: 'Permission — 可以', patternZh: '主语 + 可以 + 动词',
    summary: '可以 (kěyǐ) means "can / may" in the sense of being allowed to. Negate with 不可以.',
    notes: ['Use 可以 for permission; 会/能 for ability.', '不可以 = may not / cannot.'],
    examples: [
      { hanzi: '我可以喝咖啡。', en: 'I can drink coffee.' },
      { hanzi: '我可以吃火锅。', en: 'I can eat hot pot.' },
      { hanzi: '我们现在不可以休息。', en: "We can't rest right now." },
    ],
    drill: { keyword: '可以', options: ['可以', '喜欢', '名字', '谢谢'] },
    why: '可以 = "may / be allowed to" before a verb.',
    contrasts: { '喜欢': '喜欢 means "to like", not permission.', '名字': '名字 is a noun, "name".', '谢谢': '谢谢 means "thank you".' },
  },
  {
    id: 'zai-v', chapter: 1, title: 'Happening now — 在 + verb', patternZh: '主语 + (现在) 在 + 动词',
    summary: '在 (zài) before a verb marks an action in progress — "(be) doing". Add 现在 for "right now".',
    notes: ['Subject + 在 + verb = is/are V-ing.', '现在 + 在 + verb emphasises "now".'],
    examples: [
      { hanzi: '我们在上课。', en: 'We are having class.' },
      { hanzi: '我们在吃火锅。', en: 'We are eating hot pot.' },
      { hanzi: '我们现在在上课。', en: 'We are having class now.' },
    ],
    drill: { keyword: '在', options: ['在', '想', '会', '了'] },
    why: '在 before a verb marks an action in progress ("-ing").',
    contrasts: { '想': '想 means "want to", not happening now.', '会': '会 means "can / will", not in progress.', '了': '了 marks a completed action — the opposite of ongoing.' },
  },

  // ── Chapter 3 ──────────────────────────────────────────────────────────
  {
    id: 'ye', chapter: 3, title: 'Also / too — 也', patternZh: '主语 + 也 + 动词/形容词',
    summary: '也 (yě) means "also / too" and always comes BEFORE the verb, never after.',
    notes: ['我也是学生 = I am also a student.', '也 goes before the verb/adjective.', 'Never say 我是也学生.'],
    examples: [
      { hanzi: '我也是学生。', en: 'I am also a student.' },
      { hanzi: '他也喜欢吃饺子。', en: 'He also likes eating dumplings.' },
      { hanzi: '我也不知道。', en: "I don't know either." },
    ],
    drill: { keyword: '也', options: ['也', '都', '很', '不'] },
    why: '也 = "also/too", placed before the verb/adjective.',
    contrasts: { '都': '都 = "all" for a group; 也 = "too" linking to a prior statement.', '很': '很 = "very", a degree word.', '不': '不 negates; it doesn\'t mean "also".' },
  },
  {
    id: 'shi', chapter: 3, title: 'To be — 是 / 不是', patternZh: 'A + 是 + B',
    summary: '是 (shì) links two nouns: "A is B". Negate with 不是. Don\'t use 是 before adjectives — use 很.',
    notes: ['我是学生 = I am a student.', 'Negative: 不是. (Note: 不 is 4th tone here → bú.)', 'For "I am happy" use 我很高兴, NOT 我是高兴.'],
    examples: [
      { hanzi: '我是美国人。', en: 'I am American.' },
      { hanzi: '我不是英国人。', en: 'I am not British.' },
      { hanzi: '他是我的朋友。', en: 'He is my friend.' },
    ],
    drill: { keyword: '是', options: ['是', '在', '有', '很'] },
    why: '是 links two nouns: A 是 B.',
    contrasts: { '在': '在 means "to be at a place", not "to be (something)".', '有': '有 means "to have / there is".', '很': '很 goes before adjectives (很好), not nouns.' },
  },
  {
    id: 'ma', chapter: 3, title: 'Yes/no questions — 吗', patternZh: '陈述句 + 吗？',
    summary: 'Add 吗 (ma) to the end of a statement to turn it into a yes/no question.',
    notes: ['你是学生 → 你是学生吗？', 'Answer yes by repeating the verb (是 / 喜欢); no with 不/没.'],
    examples: [
      { hanzi: '你是学生吗？', en: 'Are you a student?' },
      { hanzi: '你喜欢吃鸡蛋吗？', en: 'Do you like eating eggs?' },
      { hanzi: '你想喝咖啡吗？', en: 'Do you want to drink coffee?' },
    ],
    drill: { keyword: '吗', options: ['吗', '呢', '了', '的'] },
    why: '吗 at the end turns a statement into a yes/no question.',
    contrasts: { '呢': '呢 asks a follow-up ("and you?"), not a yes/no question.', '了': '了 marks completion, not a question.', '的': '的 shows possession.' },
  },

  // ── Chapter 4 ──────────────────────────────────────────────────────────
  {
    id: 'de', chapter: 4, title: 'Possession — 的', patternZh: '名词 + 的 + 名词',
    summary: '的 (de) shows possession, like English \'s / "of": 我的书 = my book.',
    notes: ['我的 = my, 你的 = your, 他的 = his.', 'With close relationships 的 is often dropped: 我妈妈, 我朋友.'],
    examples: [
      { hanzi: '这是我的书。', en: 'This is my book.' },
      { hanzi: '他是我的朋友。', en: 'He is my friend.' },
      { hanzi: '那是谁的猫？', en: 'Whose cat is that?' },
    ],
    drill: { keyword: '的', options: ['的', '是', '在', '吗'] },
    why: '的 links an owner to the thing owned: 我的书 = my book.',
    contrasts: { '是': '是 links two nouns as equal, not possession.', '在': '在 marks location.', '吗': '吗 makes a yes/no question.' },
  },

  // ── Chapter 5 ──────────────────────────────────────────────────────────
  {
    id: 'you', chapter: 5, title: 'Having — 有 / 没有', patternZh: '主语 + 有 / 没有 + 宾语',
    summary: '有 (yǒu) = "to have / there is". Its negative is always 没有 (never 不有).',
    notes: ['我有一只猫 = I have a cat.', 'Negative is 没有, not 不有.', '有 also means "there is/are": 家里有三个人.'],
    examples: [
      { hanzi: '我家有三个人。', en: 'There are three people in my family.' },
      { hanzi: '我没有兄弟姐妹。', en: "I don't have any siblings." },
      { hanzi: '你家有几个人？', en: 'How many people are in your family?' },
    ],
    drill: { keyword: '没有', options: ['没有', '不有', '不是', '没是'] },
    why: 'The negative of 有 is 没有 — always 没, never 不.',
    contrasts: { '不有': '不 never negates 有; the fixed form is 没有.', '不是': '不是 = "is not", not "does not have".', '没是': '没 negates 有, not 是.' },
  },
  {
    id: 'age', chapter: 5, title: 'Asking age — 几岁 / 多大', patternZh: '你今年 + 几岁 / 多大？',
    summary: 'Use 几岁 for children (small numbers) and 多大 for older people to ask age.',
    notes: ['几 expects a number under ~10, so 几岁 suits kids.', '多大 = "how big/old", neutral for adults.', 'Answer: 我今年二十岁。'],
    examples: [
      { hanzi: '你今年几岁？', en: 'How old are you? (to a child)' },
      { hanzi: '她女儿今年二十岁。', en: 'Her daughter is twenty this year.' },
      { hanzi: '你今年多大？', en: 'How old are you? (to an adult)' },
    ],
    drill: { keyword: '几', options: ['几', '多少', '什么', '怎么'] },
    why: '几 asks "how many" for small numbers — it fits 几岁 for a child.',
    contrasts: { '多少': '多少 asks larger / open quantities, not 岁 for a child.', '什么': '什么 means "what".', '怎么': '怎么 means "how".' },
  },

  // ── Chapter 6 ──────────────────────────────────────────────────────────
  {
    id: 'hui-neng', chapter: 6, title: 'Ability — 会 / 能', patternZh: '主语 + 会 / 能 + 动词',
    summary: '会 (huì) = a learned skill ("know how to"); 能 (néng) = able to in this situation.',
    notes: ['我会说汉语 = I can (have learned to) speak Chinese.', '你能来吗？ = Are you able to come?', 'Negative: 不会 / 不能.'],
    examples: [
      { hanzi: '我会说汉语。', en: 'I can speak Chinese.' },
      { hanzi: '我会说英语、法语和一点点中文。', en: 'I can speak English, French and a little Chinese.' },
      { hanzi: '你能来吗？', en: 'Can you come?' },
    ],
    drill: { keyword: '会', options: ['会', '能', '可以', '想'] },
    why: '会 = a learned skill, "know how to" (e.g. speak a language).',
    contrasts: { '能': '能 = able to in this situation, not a learned skill.', '可以': '可以 = have permission, not skill.', '想': '想 = want to, not ability.' },
  },
  {
    id: 'dou', chapter: 6, title: 'All / both — 都', patternZh: '主语 + 都 + (不/没) + 动词',
    summary: '都 (dōu) means "all/both" and comes AFTER the subject, before the verb. With 不/没 it means "none".',
    notes: ['Subject + 都 + verb: 我们都喜欢茶.', '都 goes before 不/没: 同学都不上课 = none attend class.', 'Word order is fixed — 都 cannot start the sentence.'],
    examples: [
      { hanzi: '我们都喜欢茶。', en: 'We all like tea.' },
      { hanzi: '同学都上课。', en: 'All the students attend class.' },
      { hanzi: '同学都不上课。', en: 'None of the students attend class.' },
      { hanzi: '同学都没来上课。', en: 'None of the students came to class.' },
    ],
    drill: { keyword: '都', options: ['都', '也', '很', '不'] },
    why: '都 = "all/both", placed after the subject and before the verb.',
    contrasts: { '也': '也 means "also", linking to a previous statement.', '很': '很 modifies adjectives, not "all".', '不': '不 negates; it doesn\'t mean "all".' },
  },

  // ── Chapter 7 ──────────────────────────────────────────────────────────
  {
    id: 'date', chapter: 7, title: 'Dates — 年/月/号', patternZh: '年 + 月 + 号/日',
    summary: 'Chinese dates go from largest to smallest: year → month → day. Ask with 几月几号？',
    notes: ['2026年6月15号 = 15 June 2026.', '今天几月几号？ = What is today\'s date?', 'Weekdays: 星期一 to 星期日 (Mon–Sun).'],
    examples: [
      { hanzi: '今天几月几号？', en: 'What month and day is it today?' },
      { hanzi: '今天是六月十五号。', en: 'Today is June 15th.' },
      { hanzi: '明天是星期六。', en: 'Tomorrow is Saturday.' },
    ],
    drill: { keyword: '号', options: ['号', '岁', '点', '月'] },
    why: '号 marks the day of the month: 十五号 = the 15th.',
    contrasts: { '岁': '岁 counts years of age, not calendar dates.', '点': '点 marks hours on a clock.', '月': '月 marks the month (六月 = June), while 号 marks the specific day.' },
  },

  // ── Chapter 8 ──────────────────────────────────────────────────────────
  {
    id: 'xihuan', chapter: 8, title: 'Likes — 喜欢', patternZh: '主语 + 喜欢 + 动词/名词',
    summary: '喜欢 (xǐhuan) = "to like". It can be followed by a noun or by another verb phrase.',
    notes: ['喜欢 + noun: 我喜欢狗.', '喜欢 + verb: 我喜欢吃鸡蛋.', 'Negative: 不喜欢.'],
    examples: [
      { hanzi: '我喜欢吃鸡蛋。', en: 'I like eating eggs.' },
      { hanzi: '我不喜欢吃鸡蛋。', en: "I don't like eating eggs." },
      { hanzi: '我喜欢学习汉语。', en: 'I like studying Chinese.' },
    ],
    drill: { keyword: '喜欢', options: ['喜欢', '可以', '名字', '认识'] },
    why: '喜欢 = "to like" — a noun or an activity can follow it.',
    contrasts: { '可以': '可以 = "may", permission, not liking.', '名字': '名字 is the noun "name".', '认识': '认识 = "to know / recognise" a person.' },
  },
  {
    id: 'measure', chapter: 8, title: 'Measure words — 个 / 杯 / 瓶', patternZh: '数字 + 量词 + 名词',
    summary: 'Chinese counts nouns with a measure word between the number and the noun: 一杯茶 = one cup of tea.',
    notes: ['个 is the general one: 三个人.', 'Containers: 一杯咖啡 (cup), 一瓶茶 (bottle).', 'Never say 一茶 — always number + measure + noun.'],
    examples: [
      { hanzi: '我买了一杯咖啡。', en: 'I bought a cup of coffee.' },
      { hanzi: '我想要一瓶茶。', en: 'I would like a bottle of tea.' },
      { hanzi: '我家有三个人。', en: 'There are three people in my family.' },
    ],
    drill: { keyword: '杯', options: ['杯', '瓶', '个', '本'] },
    why: '杯 is the measure word for a cup/glass of a drink: 一杯咖啡.',
    contrasts: { '瓶': '瓶 counts bottles, not a cup.', '个': '个 is the general measure word, but a drink in a cup takes 杯.', '本': '本 counts books.' },
  },

  // ── Chapter 9 ──────────────────────────────────────────────────────────
  {
    id: 'zai-loc', chapter: 9, title: 'Location — 在 + place', patternZh: '主语 + 在 + 地方',
    summary: '在 (zài) + a place = "to be at/in a place". Also used as "where": 在哪儿？',
    notes: ['我在家 = I am at home.', 'Ask where with 在哪儿: 你在哪儿工作？', 'Don\'t confuse with 在 + verb (in progress).'],
    examples: [
      { hanzi: '我在家。', en: 'I am at home.' },
      { hanzi: '我在大学工作。', en: 'I work at a university.' },
      { hanzi: '你在哪儿工作？', en: 'Where do you work?' },
    ],
    drill: { keyword: '在', options: ['在', '是', '有', '去'] },
    why: '在 + a place means "to be located at".',
    contrasts: { '是': '是 links nouns, not location.', '有': '有 = "to have / there is".', '去': '去 = "to go to" — a movement, not being at.' },
  },

  // ── Chapter 10 ─────────────────────────────────────────────────────────
  {
    id: 'position', chapter: 10, title: 'Where things are — 上 / 下 / 里', patternZh: '名词 + 上/下/里',
    summary: 'Position words come AFTER the noun: 桌子上 = "on the table", 家里 = "in the home".',
    notes: ['桌子上 = on the table, 椅子下 = under the chair, 家里 = inside the home.', 'Pattern: (在) + noun + 上/下/里.'],
    examples: [
      { hanzi: '书在桌子上。', en: 'The book is on the table.' },
      { hanzi: '护照在厨房桌子上。', en: 'The passport is on the kitchen table.' },
      { hanzi: '钱在家里。', en: 'The money is at home.' },
    ],
    drill: { keyword: '上', options: ['上', '下', '里', '在'] },
    why: '上 after a noun means "on top of": 桌子上 = on the table.',
    contrasts: { '下': '下 = "under", the opposite of on.', '里': '里 = "inside", not "on".', '在': '在 is the verb "to be at"; the position word still comes after the noun.' },
  },

  // ── Chapter 11 ─────────────────────────────────────────────────────────
  {
    id: 'time', chapter: 11, title: 'Telling time — 点 / 分 / 半 / 差', patternZh: '现在 + 数字 + 点 (+ 分/半)',
    summary: 'Hours use 点, minutes use 分; 半 = half past, 差 = "to / before" the hour.',
    notes: ['现在七点 = 7:00.', '七点半 = 7:30 (半 = half).', '差十分七点 = ten to seven (差 = short of).'],
    examples: [
      { hanzi: '现在几点了？', en: 'What time is it now?' },
      { hanzi: '现在七点半了。', en: "It's half past seven now." },
      { hanzi: '现在差十分七点。', en: "It's ten minutes to seven." },
    ],
    drill: { keyword: '点', options: ['点', '分', '岁', '块'] },
    why: '点 marks the hour: 七点 = seven o\'clock.',
    contrasts: { '分': '分 marks minutes, not the hour.', '岁': '岁 counts years of age.', '块': '块 counts money (yuan).' },
  },

  // ── Chapter 12 ─────────────────────────────────────────────────────────
  {
    id: 'zenmeyang', chapter: 12, title: 'How is it? — 怎么样', patternZh: '名词 + 怎么样？',
    summary: '怎么样 (zěnmeyàng) asks "how is…?" / "how about…?" — great for opinions and weather.',
    notes: ['今天天气怎么样？ = How is the weather today?', 'Also for suggestions: 我们去吃饭，怎么样？'],
    examples: [
      { hanzi: '今天天气怎么样？', en: 'How is the weather today?' },
      { hanzi: '这个菜怎么样？', en: 'How is this dish?' },
    ],
    drill: { keyword: '怎么样', options: ['怎么样', '什么', '多少', '哪儿'] },
    why: '怎么样 asks "how is it?" — perfect for opinions and weather.',
    contrasts: { '什么': '什么 asks "what", not "how is".', '多少': '多少 asks "how much / many".', '哪儿': '哪儿 asks "where".' },
  },
  {
    id: 'hui-will', chapter: 12, title: 'Will / too… — 会 & 太…了', patternZh: '会 + 动词 · 太 + 形容词 + 了',
    summary: '会 also predicts the future ("will"). 太…了 wraps an adjective to mean "too / so".',
    notes: ['明天会下雨 = It will rain tomorrow.', '太好了！ = Great! / 太冷了 = too cold.'],
    examples: [
      { hanzi: '明天会下雨。', en: 'It will rain tomorrow.' },
      { hanzi: '这个星期每天都会下雨。', en: 'It will rain every day this week.' },
      { hanzi: '太好了！', en: 'Great!' },
    ],
    drill: { keyword: '会', options: ['会', '在', '是', '都'] },
    why: '会 before a verb predicts the future ("will"): 会下雨.',
    contrasts: { '在': '在 marks something happening now, not the future.', '是': '是 links nouns.', '都': '都 means "all".' },
  },

  // ── Chapter 13 ─────────────────────────────────────────────────────────
  {
    id: 'zai-ne', chapter: 13, title: 'Right now — 在…呢 & 吧', patternZh: '主语 + 在 + 动词 + 呢 · 句子 + 吧',
    summary: '在…呢 stresses an action happening right now. 吧 softens a sentence into a suggestion or guess.',
    notes: ['他在睡觉呢 = He is sleeping (right now).', '我们走吧 = Let\'s go. / 你是老师吧？ = You\'re a teacher, right?'],
    examples: [
      { hanzi: '他在学做中国菜。', en: 'He is learning to cook Chinese food.' },
      { hanzi: '回家前，我们先去超市吧。', en: "Before going home, let's go to the supermarket first." },
    ],
    drill: { keyword: '呢', options: ['呢', '吗', '了', '的'] },
    why: '呢 closes the 在…呢 frame that stresses an action happening right now.',
    contrasts: { '吗': '吗 makes a yes/no question, not a "right now" statement.', '了': '了 marks completion — the opposite of ongoing.', '的': '的 shows possession.' },
  },

  // ── Chapter 14 ─────────────────────────────────────────────────────────
  {
    id: 'le', chapter: 14, title: 'Completed actions — 了', patternZh: '主语 + 动词 + 了 (+ 吗)',
    summary: '了 (le) marks a completed action. Ask about completion with …了吗？; answer no with 还没.',
    notes: ['我吃午饭了 = I ate lunch.', 'Question: 你吃晚饭了吗？', 'Negative answer uses 没/还没, and 了 drops: 我还没吃.'],
    examples: [
      { hanzi: '我吃午饭了。', en: 'I ate lunch.' },
      { hanzi: '你吃晚饭了吗？', en: 'Have you eaten dinner?' },
      { hanzi: '我还没吃晚饭。', en: "I haven't eaten dinner yet." },
    ],
    drill: { keyword: '了', options: ['了', '吗', '在', '的'] },
    why: '了 after the verb marks the action as completed.',
    contrasts: { '吗': '吗 only asks a question; it doesn\'t mark completion.', '在': '在 marks an action in progress, not finished.', '的': '的 shows possession.' },
  },
  {
    id: 'haishi', chapter: 14, title: 'Choice questions — 还是', patternZh: 'A + 还是 + B？',
    summary: '还是 (háishì) = "or" in questions, offering a choice between A and B.',
    notes: ['你想喝咖啡还是茶？ = Coffee or tea?', 'Only use 还是 in questions; for "or" in statements use 或者.'],
    examples: [
      { hanzi: '你想喝咖啡还是茶？', en: 'Would you like coffee or tea?' },
      { hanzi: '你想吃米饭还是面？', en: 'Would you like rice or noodles?' },
    ],
    drill: { keyword: '还是', options: ['还是', '和', '都', '也'] },
    why: '还是 = "or", offering a choice between A and B in a question.',
    contrasts: { '和': '和 = "and", joining items, not a choice.', '都': '都 = "all / both".', '也': '也 = "also".' },
  },
  {
    id: 'yixie-geng', chapter: 14, title: 'Some & prefer — 一些 / 更', patternZh: '动词 + 一些 + 名词 · 更 + 喜欢',
    summary: '一些 (yìxiē) = "some / a few" before a noun. 更 (gèng) before a verb = "more / prefer".',
    notes: ['我买了一些水果 = I bought some fruit.', '我更喜欢茶 = I prefer tea.'],
    examples: [
      { hanzi: '我买了一些衣服。', en: 'I bought some clothes.' },
      { hanzi: '我更喜欢喝茶。', en: 'I prefer to drink tea.' },
      { hanzi: '我更喜欢中国。', en: 'I prefer China.' },
    ],
    drill: { keyword: '更', options: ['更', '都', '很', '太'] },
    why: '更 before a verb/adjective means "more / prefer": 更喜欢.',
    contrasts: { '都': '都 = "all", not "more".', '很': '很 = "very" (a plain degree), not a comparison.', '太': '太 = "too (much)", not "more".' },
  },

  // ── Chapter 15 ─────────────────────────────────────────────────────────
  {
    id: 'shi-de', chapter: 15, title: 'Emphasis — 是…的', patternZh: '主语 + 是 + (方式/时间) + 动词 + 的',
    summary: 'The 是…的 frame emphasises HOW / WHEN / WHERE a past action happened — e.g. how you came.',
    notes: ['我是坐飞机来的 = I came BY PLANE.', 'The detail (坐飞机) sits between 是 and 的.', 'Common for past manner: 是…来的 / 是…去的.'],
    examples: [
      { hanzi: '我是坐飞机来的。', en: 'I came by plane.' },
      { hanzi: '你是怎么来的？', en: 'How did you get here?' },
    ],
    drill: { keyword: '的', options: ['的', '了', '吗', '在'] },
    why: 'In 是…的, the final 的 closes the frame that stresses how/when a past action happened.',
    contrasts: { '了': '了 just marks completion; 是…的 emphasises the manner, not only that it happened.', '吗': '吗 makes a question.', '在': '在 marks location or progress.' },
  },
  {
    id: 'cong', chapter: 15, title: 'From & before/after — 从…来 / 前·后', patternZh: '从 + 地方 + 来 · 时间 + 前/后',
    summary: '从 (cóng) = "from" a place or time. After a time word, 前 = "before/ago" and 后 = "after/later".',
    notes: ['我从公司来 = I come from the company.', '一个星期后 = a week later. 上课前 = before class.'],
    examples: [
      { hanzi: '你们从哪儿来？', en: 'Where are you coming from?' },
      { hanzi: '我从家来。', en: 'I am coming from home.' },
      { hanzi: '下课后，我回家做饭。', en: 'After class, I go home and cook.' },
    ],
    drill: { keyword: '从', options: ['从', '在', '到', '后'] },
    why: '从 marks the starting point — "from" a place or time: 从家来.',
    contrasts: { '在': '在 = "at" a place, not "from".', '到': '到 = "to / arrive at" — the destination, not the source.', '后': '后 = "after", a time word.' },
  },
]

export const GRAMMAR_BY_ID = Object.fromEntries(GRAMMAR.map((g) => [g.id, g]))
export function chapterGrammar(ch) {
  return GRAMMAR.filter((g) => g.chapter === ch)
}
