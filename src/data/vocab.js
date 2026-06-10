// Core HSK 1 vocabulary, distributed across the 15 HSK Standard Course chapters
// that the Manhattan Mandarin class follows. Each word belongs to exactly one
// chapter (`ch`). Pinyin for example sentences is generated at runtime via
// pinyin-pro, so we only store hanzi + English here.
//
// Chapter themes (HSK Standard Course 1):
//  1 你好 · 2 谢谢你 · 3 你叫什么名字 · 4 她是我的汉语老师 · 5 她女儿今年二十岁
//  6 我会说汉语 · 7 今天几号 · 8 我想喝茶 · 9 你儿子在哪儿工作 · 10 我在这儿买票
//  11 现在几点 · 12 明天天气怎么样 · 13 他在学做中国菜 · 14 她买了不少衣服 · 15 我是坐飞机来的

const RAW = [
  // ── Chapter 1 · 你好 — Hello ──────────────────────────────────────────
  { ch: 1, hanzi: '你', pinyin: 'nǐ', en: 'you', pos: 'pron', ex: ['你好！', 'Hello!'] },
  { ch: 1, hanzi: '好', pinyin: 'hǎo', en: 'good; well', pos: 'adj', ex: ['我很好。', 'I am very well.'] },
  { ch: 1, hanzi: '我', pinyin: 'wǒ', en: 'I; me', pos: 'pron', ex: ['我是学生。', 'I am a student.'] },
  { ch: 1, hanzi: '我们', pinyin: 'wǒmen', en: 'we; us', pos: 'pron', ex: ['我们都是学生。', 'We are all students.'] },
  { ch: 1, hanzi: '不', pinyin: 'bù', en: 'not; no', pos: 'adv', ex: ['我不是老师。', "I'm not a teacher."] },
  { ch: 1, hanzi: '大', pinyin: 'dà', en: 'big', pos: 'adj', ex: ['这个学校很大。', 'This school is big.'] },
  { ch: 1, hanzi: '小', pinyin: 'xiǎo', en: 'small', pos: 'adj', ex: ['我的家很小。', 'My home is small.'] },
  { ch: 1, hanzi: '一', pinyin: 'yī', en: 'one', pos: 'num', ex: ['我有一个朋友。', 'I have one friend.'] },
  { ch: 1, hanzi: '二', pinyin: 'èr', en: 'two', pos: 'num', ex: ['二加二是四。', 'Two plus two is four.'] },
  { ch: 1, hanzi: '三', pinyin: 'sān', en: 'three', pos: 'num', ex: ['我家有三个人。', 'There are three people in my family.'] },
  { ch: 1, hanzi: '四', pinyin: 'sì', en: 'four', pos: 'num', ex: ['现在四点。', "It's four o'clock."] },
  { ch: 1, hanzi: '五', pinyin: 'wǔ', en: 'five', pos: 'num', ex: ['我买了五个苹果。', 'I bought five apples.'] },

  // ── Chapter 2 · 谢谢你 — Thank you ────────────────────────────────────
  { ch: 2, hanzi: '谢谢', pinyin: 'xièxie', en: 'thank you', pos: 'v', ex: ['谢谢你！', 'Thank you!'] },
  { ch: 2, hanzi: '不客气', pinyin: 'bú kèqi', en: "you're welcome", pos: 'phr', ex: ['不客气。', "You're welcome."] },
  { ch: 2, hanzi: '再见', pinyin: 'zàijiàn', en: 'goodbye', pos: 'phr', ex: ['老师，再见！', 'Goodbye, teacher!'] },
  { ch: 2, hanzi: '请', pinyin: 'qǐng', en: 'please; to invite', pos: 'v', ex: ['请喝茶。', 'Please have some tea.'] },
  { ch: 2, hanzi: '对不起', pinyin: 'duìbuqǐ', en: 'sorry', pos: 'phr', ex: ['对不起，我来晚了。', "Sorry, I'm late."] },
  { ch: 2, hanzi: '没关系', pinyin: 'méi guānxi', en: "it's okay; never mind", pos: 'phr', ex: ['没关系。', "It's okay."] },
  { ch: 2, hanzi: '喂', pinyin: 'wéi', en: 'hello (on phone)', pos: 'interj', ex: ['喂，你好！', 'Hello? Hi!'] },
  { ch: 2, hanzi: '六', pinyin: 'liù', en: 'six', pos: 'num', ex: ['他六岁。', 'He is six years old.'] },
  { ch: 2, hanzi: '七', pinyin: 'qī', en: 'seven', pos: 'num', ex: ['一个星期有七天。', 'A week has seven days.'] },
  { ch: 2, hanzi: '八', pinyin: 'bā', en: 'eight', pos: 'num', ex: ['现在八点。', "It's eight o'clock."] },
  { ch: 2, hanzi: '九', pinyin: 'jiǔ', en: 'nine', pos: 'num', ex: ['我九点睡觉。', 'I go to sleep at nine.'] },
  { ch: 2, hanzi: '十', pinyin: 'shí', en: 'ten', pos: 'num', ex: ['这本书十块钱。', 'This book is ten yuan.'] },

  // ── Chapter 3 · 你叫什么名字 — What's your name? ──────────────────────
  { ch: 3, hanzi: '他', pinyin: 'tā', en: 'he; him', pos: 'pron', ex: ['他是我朋友。', 'He is my friend.'] },
  { ch: 3, hanzi: '她', pinyin: 'tā', en: 'she; her', pos: 'pron', ex: ['她是老师。', 'She is a teacher.'] },
  { ch: 3, hanzi: '人', pinyin: 'rén', en: 'person', pos: 'n', ex: ['他是中国人。', 'He is Chinese.'] },
  { ch: 3, hanzi: '名字', pinyin: 'míngzi', en: 'name', pos: 'n', ex: ['你叫什么名字？', "What's your name?"] },
  { ch: 3, hanzi: '叫', pinyin: 'jiào', en: 'to be called', pos: 'v', ex: ['我叫小明。', 'My name is Xiaoming.'] },
  { ch: 3, hanzi: '是', pinyin: 'shì', en: 'to be', pos: 'v', ex: ['我是医生。', 'I am a doctor.'] },
  { ch: 3, hanzi: '谁', pinyin: 'shéi', en: 'who', pos: 'pron', ex: ['他是谁？', 'Who is he?'] },
  { ch: 3, hanzi: '朋友', pinyin: 'péngyou', en: 'friend', pos: 'n', ex: ['她是我的好朋友。', 'She is my good friend.'] },
  { ch: 3, hanzi: '什么', pinyin: 'shénme', en: 'what', pos: 'pron', ex: ['这是什么？', 'What is this?'] },
  { ch: 3, hanzi: '吗', pinyin: 'ma', en: '(yes/no question particle)', pos: 'part', ex: ['你是学生吗？', 'Are you a student?'] },
  { ch: 3, hanzi: '呢', pinyin: 'ne', en: '(follow-up question particle)', pos: 'part', ex: ['我很好，你呢？', "I'm fine, and you?"] },
  { ch: 3, hanzi: '和', pinyin: 'hé', en: 'and; with', pos: 'conj', ex: ['我和朋友去。', 'My friend and I go.'] },

  // ── Chapter 4 · 她是我的汉语老师 — She is my Chinese teacher ──────────
  { ch: 4, hanzi: '先生', pinyin: 'xiānsheng', en: 'Mr.; sir', pos: 'n', ex: ['王先生是老师。', 'Mr. Wang is a teacher.'] },
  { ch: 4, hanzi: '小姐', pinyin: 'xiǎojiě', en: 'Miss; young lady', pos: 'n', ex: ['李小姐很漂亮。', 'Miss Li is very pretty.'] },
  { ch: 4, hanzi: '学生', pinyin: 'xuésheng', en: 'student', pos: 'n', ex: ['我是大学生。', 'I am a university student.'] },
  { ch: 4, hanzi: '老师', pinyin: 'lǎoshī', en: 'teacher', pos: 'n', ex: ['我们的老师是中国人。', 'Our teacher is Chinese.'] },
  { ch: 4, hanzi: '同学', pinyin: 'tóngxué', en: 'classmate', pos: 'n', ex: ['他是我的同学。', 'He is my classmate.'] },
  { ch: 4, hanzi: '学校', pinyin: 'xuéxiào', en: 'school', pos: 'n', ex: ['我去学校。', 'I go to school.'] },
  { ch: 4, hanzi: '学习', pinyin: 'xuéxí', en: 'to study; learn', pos: 'v', ex: ['我喜欢学习汉语。', 'I like studying Chinese.'] },
  { ch: 4, hanzi: '字', pinyin: 'zì', en: 'character; word', pos: 'n', ex: ['这个字我会写。', 'I can write this character.'] },
  { ch: 4, hanzi: '书', pinyin: 'shū', en: 'book', pos: 'n', ex: ['这是一本汉语书。', 'This is a Chinese book.'] },
  { ch: 4, hanzi: '本', pinyin: 'běn', en: '(measure word: books)', pos: 'mw', ex: ['我有三本书。', 'I have three books.'] },
  { ch: 4, hanzi: '认识', pinyin: 'rènshi', en: 'to know; recognize', pos: 'v', ex: ['我认识他。', 'I know him.'] },
  { ch: 4, hanzi: '这', pinyin: 'zhè', en: 'this', pos: 'pron', ex: ['这是我的书。', 'This is my book.'] },
  { ch: 4, hanzi: '那', pinyin: 'nà', en: 'that', pos: 'pron', ex: ['那是谁的猫？', 'Whose cat is that?'] },
  { ch: 4, hanzi: '的', pinyin: 'de', en: '(possessive particle)', pos: 'part', ex: ['这是我的书。', 'This is my book.'] },

  // ── Chapter 5 · 她女儿今年二十岁 — Her daughter is 20 ──────────────────
  { ch: 5, hanzi: '爸爸', pinyin: 'bàba', en: 'dad', pos: 'n', ex: ['我爸爸是医生。', 'My dad is a doctor.'] },
  { ch: 5, hanzi: '妈妈', pinyin: 'māma', en: 'mom', pos: 'n', ex: ['我妈妈在家。', 'My mom is at home.'] },
  { ch: 5, hanzi: '儿子', pinyin: 'érzi', en: 'son', pos: 'n', ex: ['他的儿子很小。', 'His son is very young.'] },
  { ch: 5, hanzi: '女儿', pinyin: "nǚ'ér", en: 'daughter', pos: 'n', ex: ['我女儿是学生。', 'My daughter is a student.'] },
  { ch: 5, hanzi: '家', pinyin: 'jiā', en: 'home; family', pos: 'n', ex: ['我在家看电视。', 'I watch TV at home.'] },
  { ch: 5, hanzi: '有', pinyin: 'yǒu', en: 'to have; there is', pos: 'v', ex: ['我有一只猫。', 'I have a cat.'] },
  { ch: 5, hanzi: '几', pinyin: 'jǐ', en: 'how many (small number)', pos: 'pron', ex: ['你家有几个人？', 'How many people are in your family?'] },
  { ch: 5, hanzi: '个', pinyin: 'gè', en: '(general measure word)', pos: 'mw', ex: ['三个学生。', 'Three students.'] },
  { ch: 5, hanzi: '岁', pinyin: 'suì', en: 'years (of age)', pos: 'mw', ex: ['我女儿五岁。', 'My daughter is five.'] },
  { ch: 5, hanzi: '多少', pinyin: 'duōshao', en: 'how many; how much', pos: 'pron', ex: ['这个多少钱？', 'How much is this?'] },

  // ── Chapter 6 · 我会说汉语 — I can speak Chinese ──────────────────────
  { ch: 6, hanzi: '会', pinyin: 'huì', en: 'can; to know how to', pos: 'v', ex: ['我会说汉语。', 'I can speak Chinese.'] },
  { ch: 6, hanzi: '能', pinyin: 'néng', en: 'can; be able to', pos: 'v', ex: ['你能来吗？', 'Can you come?'] },
  { ch: 6, hanzi: '说话', pinyin: 'shuōhuà', en: 'to speak; talk', pos: 'v', ex: ['他在说话。', 'He is talking.'] },
  { ch: 6, hanzi: '读', pinyin: 'dú', en: 'to read', pos: 'v', ex: ['请读这本书。', 'Please read this book.'] },
  { ch: 6, hanzi: '写', pinyin: 'xiě', en: 'to write', pos: 'v', ex: ['请写你的名字。', 'Please write your name.'] },
  { ch: 6, hanzi: '看', pinyin: 'kàn', en: 'to look; watch; read', pos: 'v', ex: ['我看电视。', 'I watch TV.'] },
  { ch: 6, hanzi: '听', pinyin: 'tīng', en: 'to listen', pos: 'v', ex: ['我听老师说话。', 'I listen to the teacher.'] },
  { ch: 6, hanzi: '汉语', pinyin: 'Hànyǔ', en: 'Chinese (language)', pos: 'n', ex: ['汉语很有意思。', 'Chinese is interesting.'] },
  { ch: 6, hanzi: '中国', pinyin: 'Zhōngguó', en: 'China', pos: 'n', ex: ['我想去中国。', 'I want to go to China.'] },
  { ch: 6, hanzi: '北京', pinyin: 'Běijīng', en: 'Beijing', pos: 'n', ex: ['北京很大。', 'Beijing is very big.'] },
  { ch: 6, hanzi: '都', pinyin: 'dōu', en: 'all; both', pos: 'adv', ex: ['我们都喜欢茶。', 'We all like tea.'] },

  // ── Chapter 7 · 今天几号 — What's the date today? ────────────────────
  { ch: 7, hanzi: '今天', pinyin: 'jīntiān', en: 'today', pos: 'n', ex: ['今天是星期一。', 'Today is Monday.'] },
  { ch: 7, hanzi: '明天', pinyin: 'míngtiān', en: 'tomorrow', pos: 'n', ex: ['明天见！', 'See you tomorrow!'] },
  { ch: 7, hanzi: '昨天', pinyin: 'zuótiān', en: 'yesterday', pos: 'n', ex: ['昨天我没去学校。', "I didn't go to school yesterday."] },
  { ch: 7, hanzi: '上午', pinyin: 'shàngwǔ', en: 'morning', pos: 'n', ex: ['上午我学习汉语。', 'I study Chinese in the morning.'] },
  { ch: 7, hanzi: '中午', pinyin: 'zhōngwǔ', en: 'noon', pos: 'n', ex: ['中午我们吃米饭。', 'We eat rice at noon.'] },
  { ch: 7, hanzi: '下午', pinyin: 'xiàwǔ', en: 'afternoon', pos: 'n', ex: ['下午我去商店。', 'I go to the shop in the afternoon.'] },
  { ch: 7, hanzi: '年', pinyin: 'nián', en: 'year', pos: 'n', ex: ['我学了一年汉语。', "I've studied Chinese for a year."] },
  { ch: 7, hanzi: '月', pinyin: 'yuè', en: 'month', pos: 'n', ex: ['这个月很冷。', 'This month is very cold.'] },
  { ch: 7, hanzi: '星期', pinyin: 'xīngqī', en: 'week', pos: 'n', ex: ['这个星期我很忙。', "I'm busy this week."] },
  { ch: 7, hanzi: '时候', pinyin: 'shíhou', en: 'time; moment', pos: 'n', ex: ['你什么时候来？', 'When are you coming?'] },

  // ── Chapter 8 · 我想喝茶 — I'd like to drink tea ─────────────────────
  { ch: 8, hanzi: '想', pinyin: 'xiǎng', en: 'to want; would like; miss', pos: 'v', ex: ['我想喝茶。', 'I want to drink tea.'] },
  { ch: 8, hanzi: '喝', pinyin: 'hē', en: 'to drink', pos: 'v', ex: ['我喝茶。', 'I drink tea.'] },
  { ch: 8, hanzi: '吃', pinyin: 'chī', en: 'to eat', pos: 'v', ex: ['我吃苹果。', 'I eat an apple.'] },
  { ch: 8, hanzi: '菜', pinyin: 'cài', en: 'dish; vegetable', pos: 'n', ex: ['这个菜很好吃。', 'This dish is delicious.'] },
  { ch: 8, hanzi: '米饭', pinyin: 'mǐfàn', en: 'cooked rice', pos: 'n', ex: ['我喜欢吃米饭。', 'I like eating rice.'] },
  { ch: 8, hanzi: '水', pinyin: 'shuǐ', en: 'water', pos: 'n', ex: ['我想喝水。', 'I want to drink water.'] },
  { ch: 8, hanzi: '水果', pinyin: 'shuǐguǒ', en: 'fruit', pos: 'n', ex: ['我买了一些水果。', 'I bought some fruit.'] },
  { ch: 8, hanzi: '苹果', pinyin: 'píngguǒ', en: 'apple', pos: 'n', ex: ['这个苹果很大。', 'This apple is big.'] },
  { ch: 8, hanzi: '茶', pinyin: 'chá', en: 'tea', pos: 'n', ex: ['请喝茶。', 'Please have some tea.'] },
  { ch: 8, hanzi: '杯子', pinyin: 'bēizi', en: 'cup; glass', pos: 'n', ex: ['桌子上有一个杯子。', 'There is a cup on the table.'] },
  { ch: 8, hanzi: '爱', pinyin: 'ài', en: 'to love', pos: 'v', ex: ['我爱我的家。', 'I love my family.'] },
  { ch: 8, hanzi: '喜欢', pinyin: 'xǐhuan', en: 'to like', pos: 'v', ex: ['我喜欢狗。', 'I like dogs.'] },
  { ch: 8, hanzi: '没', pinyin: 'méi', en: 'not; have not', pos: 'adv', ex: ['我没有钱。', "I don't have money."] },

  // ── Chapter 9 · 你儿子在哪儿工作 — Where does your son work? ──────────
  { ch: 9, hanzi: '工作', pinyin: 'gōngzuò', en: 'to work; job', pos: 'v', ex: ['我妈妈在医院工作。', 'My mom works at a hospital.'] },
  { ch: 9, hanzi: '在', pinyin: 'zài', en: 'at; in; (be) located at', pos: 'prep', ex: ['我在家。', 'I am at home.'] },
  { ch: 9, hanzi: '住', pinyin: 'zhù', en: 'to live; stay', pos: 'v', ex: ['我住在北京。', 'I live in Beijing.'] },
  { ch: 9, hanzi: '哪', pinyin: 'nǎ', en: 'which', pos: 'pron', ex: ['你是哪国人？', 'What country are you from?'] },
  { ch: 9, hanzi: '哪儿', pinyin: 'nǎr', en: 'where', pos: 'pron', ex: ['你在哪儿？', 'Where are you?'] },
  { ch: 9, hanzi: '里', pinyin: 'lǐ', en: 'inside', pos: 'n', ex: ['钱在家里。', 'The money is at home.'] },
  { ch: 9, hanzi: '商店', pinyin: 'shāngdiàn', en: 'shop; store', pos: 'n', ex: ['商店里有很多东西。', 'There are many things in the shop.'] },
  { ch: 9, hanzi: '饭店', pinyin: 'fàndiàn', en: 'restaurant; hotel', pos: 'n', ex: ['我们去饭店吃饭。', 'We go to the restaurant to eat.'] },
  { ch: 9, hanzi: '医院', pinyin: 'yīyuàn', en: 'hospital', pos: 'n', ex: ['医生在医院工作。', 'Doctors work in hospitals.'] },
  { ch: 9, hanzi: '医生', pinyin: 'yīshēng', en: 'doctor', pos: 'n', ex: ['我爸爸是医生。', 'My dad is a doctor.'] },

  // ── Chapter 10 · 我在这儿买票 — I'm buying a ticket here ─────────────
  { ch: 10, hanzi: '买', pinyin: 'mǎi', en: 'to buy', pos: 'v', ex: ['我想买衣服。', 'I want to buy clothes.'] },
  { ch: 10, hanzi: '钱', pinyin: 'qián', en: 'money', pos: 'n', ex: ['我没有钱。', "I don't have money."] },
  { ch: 10, hanzi: '块', pinyin: 'kuài', en: 'yuan (money); piece', pos: 'mw', ex: ['这个苹果三块钱。', 'This apple is three yuan.'] },
  { ch: 10, hanzi: '些', pinyin: 'xiē', en: 'some; a few', pos: 'mw', ex: ['我买了一些菜。', 'I bought some vegetables.'] },
  { ch: 10, hanzi: '东西', pinyin: 'dōngxi', en: 'thing; stuff', pos: 'n', ex: ['我买了很多东西。', 'I bought many things.'] },
  { ch: 10, hanzi: '衣服', pinyin: 'yīfu', en: 'clothes', pos: 'n', ex: ['这件衣服很漂亮。', 'These clothes are pretty.'] },
  { ch: 10, hanzi: '上', pinyin: 'shàng', en: 'up; on; above', pos: 'n', ex: ['书在桌子上。', 'The book is on the table.'] },
  { ch: 10, hanzi: '下', pinyin: 'xià', en: 'down; under; below', pos: 'n', ex: ['猫在椅子下。', 'The cat is under the chair.'] },

  // ── Chapter 11 · 现在几点 — What time is it now? ────────────────────
  { ch: 11, hanzi: '现在', pinyin: 'xiànzài', en: 'now', pos: 'n', ex: ['现在几点？', 'What time is it now?'] },
  { ch: 11, hanzi: '点', pinyin: 'diǎn', en: "o'clock; dot", pos: 'mw', ex: ['现在七点。', "It's seven o'clock."] },
  { ch: 11, hanzi: '分钟', pinyin: 'fēnzhōng', en: 'minute', pos: 'n', ex: ['请等五分钟。', 'Please wait five minutes.'] },
  { ch: 11, hanzi: '来', pinyin: 'lái', en: 'to come', pos: 'v', ex: ['请来我家。', 'Please come to my home.'] },
  { ch: 11, hanzi: '去', pinyin: 'qù', en: 'to go', pos: 'v', ex: ['我去学校。', 'I go to school.'] },
  { ch: 11, hanzi: '回', pinyin: 'huí', en: 'to return', pos: 'v', ex: ['我回家了。', 'I went back home.'] },
  { ch: 11, hanzi: '开', pinyin: 'kāi', en: 'to open; drive; turn on', pos: 'v', ex: ['请开门。', 'Please open the door.'] },
  { ch: 11, hanzi: '睡觉', pinyin: 'shuìjiào', en: 'to sleep', pos: 'v', ex: ['他在睡觉。', 'He is sleeping.'] },
  { ch: 11, hanzi: '打电话', pinyin: 'dǎ diànhuà', en: 'to make a phone call', pos: 'v', ex: ['我给朋友打电话。', 'I call my friend.'] },

  // ── Chapter 12 · 明天天气怎么样 — How's the weather tomorrow? ─────────
  { ch: 12, hanzi: '天气', pinyin: 'tiānqì', en: 'weather', pos: 'n', ex: ['今天天气很好。', 'The weather is nice today.'] },
  { ch: 12, hanzi: '怎么样', pinyin: 'zěnmeyàng', en: 'how about; how is it', pos: 'pron', ex: ['今天天气怎么样？', "How's the weather today?"] },
  { ch: 12, hanzi: '怎么', pinyin: 'zěnme', en: 'how', pos: 'pron', ex: ['这个字怎么读？', 'How do you read this character?'] },
  { ch: 12, hanzi: '冷', pinyin: 'lěng', en: 'cold', pos: 'adj', ex: ['今天很冷。', "It's cold today."] },
  { ch: 12, hanzi: '热', pinyin: 'rè', en: 'hot', pos: 'adj', ex: ['夏天很热。', 'Summer is hot.'] },
  { ch: 12, hanzi: '下雨', pinyin: 'xiàyǔ', en: 'to rain', pos: 'v', ex: ['明天会下雨。', 'It will rain tomorrow.'] },
  { ch: 12, hanzi: '多', pinyin: 'duō', en: 'many; much', pos: 'adj', ex: ['这里人很多。', 'There are many people here.'] },
  { ch: 12, hanzi: '少', pinyin: 'shǎo', en: 'few; little', pos: 'adj', ex: ['今天人很少。', 'There are few people today.'] },
  { ch: 12, hanzi: '很', pinyin: 'hěn', en: 'very', pos: 'adv', ex: ['我很好。', "I'm very well."] },
  { ch: 12, hanzi: '太', pinyin: 'tài', en: 'too; extremely', pos: 'adv', ex: ['太好了！', 'Great!'] },

  // ── Chapter 13 · 他在学做中国菜 — He's learning to cook ─────────────
  { ch: 13, hanzi: '做', pinyin: 'zuò', en: 'to do; make', pos: 'v', ex: ['你在做什么？', 'What are you doing?'] },
  { ch: 13, hanzi: '高兴', pinyin: 'gāoxìng', en: 'happy; glad', pos: 'adj', ex: ['我很高兴。', "I'm very happy."] },
  { ch: 13, hanzi: '漂亮', pinyin: 'piàoliang', en: 'pretty; beautiful', pos: 'adj', ex: ['她很漂亮。', 'She is beautiful.'] },
  { ch: 13, hanzi: '电视', pinyin: 'diànshì', en: 'television', pos: 'n', ex: ['我喜欢看电视。', 'I like watching TV.'] },
  { ch: 13, hanzi: '电脑', pinyin: 'diànnǎo', en: 'computer', pos: 'n', ex: ['这个电脑很好。', 'This computer is good.'] },
  { ch: 13, hanzi: '电影', pinyin: 'diànyǐng', en: 'movie', pos: 'n', ex: ['我们去看电影。', "We're going to watch a movie."] },
  { ch: 13, hanzi: '桌子', pinyin: 'zhuōzi', en: 'table; desk', pos: 'n', ex: ['书在桌子上。', 'The book is on the desk.'] },
  { ch: 13, hanzi: '椅子', pinyin: 'yǐzi', en: 'chair', pos: 'n', ex: ['请坐这把椅子。', 'Please sit on this chair.'] },
  { ch: 13, hanzi: '猫', pinyin: 'māo', en: 'cat', pos: 'n', ex: ['我的猫很小。', 'My cat is small.'] },
  { ch: 13, hanzi: '狗', pinyin: 'gǒu', en: 'dog', pos: 'n', ex: ['这只狗很大。', 'This dog is big.'] },

  // ── Chapter 14 · 她买了不少衣服 — She bought quite a few clothes ──────
  { ch: 14, hanzi: '了', pinyin: 'le', en: '(completed-action particle)', pos: 'part', ex: ['我吃饭了。', "I've eaten."] },
  { ch: 14, hanzi: '看见', pinyin: 'kànjiàn', en: 'to see; catch sight of', pos: 'v', ex: ['我看见他了。', 'I saw him.'] },

  // ── Chapter 15 · 我是坐飞机来的 — I came by plane ────────────────────
  { ch: 15, hanzi: '坐', pinyin: 'zuò', en: 'to sit; travel by', pos: 'v', ex: ['我坐出租车去。', 'I go by taxi.'] },
  { ch: 15, hanzi: '飞机', pinyin: 'fēijī', en: 'airplane', pos: 'n', ex: ['我坐飞机去北京。', 'I fly to Beijing.'] },
  { ch: 15, hanzi: '出租车', pinyin: 'chūzūchē', en: 'taxi', pos: 'n', ex: ['我们坐出租车。', 'We take a taxi.'] },
]

export const WORDS = RAW.map((w) => ({ ...w, id: w.hanzi }))
export const WORD_BY_ID = Object.fromEntries(WORDS.map((w) => [w.id, w]))
export const CORE_TOTAL = WORDS.length

export function chapterCoreWords(ch) {
  return WORDS.filter((w) => w.ch === ch)
}
