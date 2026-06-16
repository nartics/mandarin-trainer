// The 15 HSK Standard Course chapters that form the spine of the app, matching the
// Manhattan Mandarin class. Each chapter unites: core HSK1 vocab (vocab.js), grammar
// lessons (grammar.js), supplementary "extension" vocab + example sentences mined from
// the class notes (classNotes.json), and study resources (resources.js).

import { WORDS, chapterCoreWords } from './vocab'
import { chapterGrammar } from './grammar'
import { deriveMastery, defaultCard } from '../lib/sm2'
import classNotes from './classNotes.json'

// status: 'done' (class has covered it) · 'current' · 'upcoming'
export const META = [
  { num: 1, titleZh: '你好', pinyin: 'Nǐ hǎo', en: 'Hello', theme: 'Greetings & first words', status: 'done' },
  { num: 2, titleZh: '谢谢你', pinyin: 'Xièxie nǐ', en: 'Thank you', theme: 'Politeness & numbers', status: 'done' },
  { num: 3, titleZh: '你叫什么名字', pinyin: 'Nǐ jiào shénme míngzi', en: "What's your name?", theme: 'Names & introductions', status: 'done' },
  { num: 4, titleZh: '她是我的汉语老师', pinyin: 'Tā shì wǒ de Hànyǔ lǎoshī', en: 'She is my Chinese teacher', theme: 'School & possession', status: 'done' },
  { num: 5, titleZh: '她女儿今年二十岁', pinyin: 'Tā nǚ\'ér jīnnián èrshí suì', en: 'Her daughter is 20', theme: 'Family & age', status: 'done' },
  { num: 6, titleZh: '我会说汉语', pinyin: 'Wǒ huì shuō Hànyǔ', en: 'I can speak Chinese', theme: 'Abilities & languages', status: 'done' },
  { num: 7, titleZh: '今天几号', pinyin: 'Jīntiān jǐ hào', en: "What's the date today?", theme: 'Dates & time words', status: 'done' },
  { num: 8, titleZh: '我想喝茶', pinyin: 'Wǒ xiǎng hē chá', en: "I'd like to drink tea", theme: 'Food, drink & wants', status: 'done' },
  { num: 9, titleZh: '你儿子在哪儿工作', pinyin: 'Nǐ érzi zài nǎr gōngzuò', en: 'Where does your son work?', theme: 'Work & places', status: 'done' },
  { num: 10, titleZh: '我在这儿买票', pinyin: 'Wǒ zài zhèr mǎi piào', en: "I'm buying a ticket here", theme: 'Shopping & location', status: 'done' },
  { num: 11, titleZh: '现在几点', pinyin: 'Xiànzài jǐ diǎn', en: 'What time is it now?', theme: 'Telling time', status: 'done' },
  { num: 12, titleZh: '明天天气怎么样', pinyin: 'Míngtiān tiānqì zěnmeyàng', en: "How's the weather tomorrow?", theme: 'Weather & opinions', status: 'done' },
  { num: 13, titleZh: '他在学做中国菜', pinyin: 'Tā zài xué zuò Zhōngguó cài', en: "He's learning to cook", theme: 'Actions in progress', status: 'done' },
  { num: 14, titleZh: '她买了不少衣服', pinyin: 'Tā mǎi le bù shǎo yīfu', en: 'She bought quite a few clothes', theme: 'Completed actions — 了, 都', status: 'current' },
  { num: 15, titleZh: '我是坐飞机来的', pinyin: 'Wǒ shì zuò fēijī lái de', en: 'I came by plane', theme: 'The 是…的 pattern', status: 'upcoming' },
]

export const CURRENT_CHAPTER = META.find((m) => m.status === 'current')?.num ?? 14

const CORE_HANZI = new Set(WORDS.map((w) => w.hanzi))
const CJK = /[一-鿿]/

// Gather class-note items for a chapter (weeks whose chapterRefs include it).
function classItemsFor(ch) {
  const out = []
  for (const wk of classNotes) {
    if (!wk.chapterRefs.includes(ch)) continue
    for (const sec of wk.sections) {
      for (const it of sec.items) out.push({ ...it, week: wk.week, section: sec.title })
    }
  }
  return out
}

function buildExtension(items) {
  const seen = new Set()
  const ext = []
  for (const it of items) {
    if (it.type !== 'vocab') continue
    const h = it.hanzi
    const n = (h.match(/[一-鿿]/g) || []).length
    if (n < 1 || n > 4) continue
    if (/[。？！，、…?!()（）]/.test(h)) continue
    if (CORE_HANZI.has(h) || seen.has(h)) continue
    if (!CJK.test(h)) continue
    seen.add(h)
    ext.push({ id: h, hanzi: h, pinyin: it.pinyin, en: it.en })
    if (ext.length >= 14) break
  }
  return ext
}

function buildSentences(items, coreWords) {
  const seen = new Set()
  const out = []
  for (const it of items) {
    if (it.type !== 'sentence') continue
    if (seen.has(it.hanzi)) continue
    seen.add(it.hanzi)
    out.push({ hanzi: it.hanzi, en: it.en })
  }
  // include clean core-word examples too
  for (const w of coreWords) {
    if (w.ex && !seen.has(w.ex[0])) { seen.add(w.ex[0]); out.push({ hanzi: w.ex[0], en: w.ex[1] }) }
  }
  return out
}

export const CHAPTERS = META.map((m) => {
  const items = classItemsFor(m.num)
  const coreWords = chapterCoreWords(m.num)
  return {
    id: m.num,
    ...m,
    coreWords,
    grammar: chapterGrammar(m.num),
    extensionVocab: buildExtension(items),
    sentences: buildSentences(items, coreWords),
  }
})

export const CHAPTER_BY_NUM = Object.fromEntries(CHAPTERS.map((c) => [c.num, c]))

// The chapter the learner is currently on — the first one not yet fully complete
// (all core words familiar+ and all grammar points practiced). Drives the "you are
// here" highlight, the auto-scroll, and the rail's Continue. Resets to chapter 1
// when progress is wiped; advances as they finish chapters.
function chapterComplete(c, progress) {
  const learned = c.coreWords.filter((w) => {
    const m = deriveMastery(progress.cardFor(w.id) || defaultCard())
    return m === 'mastered' || m === 'familiar'
  }).length
  const wordsDone = c.coreWords.length === 0 || learned >= c.coreWords.length
  const grammarDone = c.grammar.every((g) => { const gp = progress.grammarFor(g.id); return gp && gp.correct > 0 })
  return wordsDone && grammarDone
}

export function activeChapterNum(progress) {
  for (const c of CHAPTERS) {
    if (!chapterComplete(c, progress)) return c.num
  }
  return CHAPTERS[CHAPTERS.length - 1].num
}

// Count of fully-completed chapters (for achievements).
export function chaptersCompletedCount(progress) {
  return CHAPTERS.filter((c) => chapterComplete(c, progress)).length
}

// Every example sentence across the course (for the Listening Lab / mixed practice).
export const ALL_SENTENCES = (() => {
  const seen = new Set(); const out = []
  for (const c of CHAPTERS) for (const s of c.sentences) {
    if (!seen.has(s.hanzi)) { seen.add(s.hanzi); out.push({ ...s, chapter: c.num }) }
  }
  return out
})()

// Characters from core vocab, in chapter order, for the writing trainer.
export const CHAR_LIST = (() => {
  const seen = new Set(); const out = []
  for (const w of WORDS) for (const ch of w.hanzi) {
    if (CJK.test(ch) && !seen.has(ch)) { seen.add(ch); out.push({ char: ch, fromWord: w.hanzi, pinyin: w.pinyin, en: w.en, chapter: w.ch }) }
  }
  return out
})()
