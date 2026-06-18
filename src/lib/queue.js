import { WORDS } from '../data/vocab'
import { deriveMastery } from './sm2'

export function shuffle(a) {
  const arr = [...a]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function distractors(word, key, n = 3) {
  const pool = WORDS.filter((w) => w.id !== word.id && w[key] !== word[key])
  return shuffle(pool).slice(0, n)
}

const WORD_TYPES = ['listen-meaning', 'read-meaning', 'meaning-hanzi', 'pinyin-choose', 'listen-hanzi', 'build-sentence', 'write']

export function makeExercise(type, word) {
  switch (type) {
    case 'listen-meaning': {
      const opts = shuffle([word, ...distractors(word, 'en')]).map((w) => ({ label: w.en, correct: w.id === word.id }))
      return { type, word, audio: word.hanzi, options: opts, prompt: 'What did you hear?' }
    }
    case 'listen-hanzi': {
      const opts = shuffle([word, ...distractors(word, 'hanzi')]).map((w) => ({ label: w.hanzi, han: true, correct: w.id === word.id }))
      return { type, word, audio: word.hanzi, options: opts, prompt: 'Pick the characters you heard' }
    }
    case 'read-meaning': {
      const opts = shuffle([word, ...distractors(word, 'en')]).map((w) => ({ label: w.en, correct: w.id === word.id }))
      return { type, word, options: opts, prompt: 'What does this mean?' }
    }
    case 'meaning-hanzi': {
      const opts = shuffle([word, ...distractors(word, 'hanzi')]).map((w) => ({ label: w.hanzi, han: true, correct: w.id === word.id }))
      return { type, word, options: opts, prompt: `Which one means “${word.en}”?` }
    }
    case 'pinyin-choose': {
      const opts = shuffle([word, ...distractors(word, 'pinyin')]).map((w) => ({ label: w.pinyin, correct: w.id === word.id }))
      return { type, word, options: opts, prompt: 'Choose the correct pinyin' }
    }
    case 'build-sentence':
      return { type, word, sentence: word.ex ? { hanzi: word.ex[0], en: word.ex[1] } : null, prompt: 'Build the sentence' }
    case 'write':
      return { type, word, prompt: 'Write the character' }
    default:
      return makeExercise('read-meaning', word)
  }
}

// Word-based queue (used by chapter vocab practice and review).
export function buildQueue(words, { types = WORD_TYPES, perWord = 1, includeWrite = false } = {}) {
  const useTypes = includeWrite ? types : types.filter((t) => t !== 'write')
  const q = []
  for (const word of words) {
    const picks = shuffle(useTypes)
    for (let k = 0; k < perWord; k++) q.push(makeExercise(picks[k % picks.length], word))
  }
  return shuffle(q).filter(Boolean)
}

// Lightweight feedback context carried on each grammar drill so the drill UI can
// render the explanation without re-importing the grammar table.
function feedbackCtx(grammar) {
  return { id: grammar.id, title: grammar.title, summary: grammar.summary, notes: grammar.notes, why: grammar.why, contrasts: grammar.contrasts || {} }
}

// Grammar drill: blank the pattern keyword in one of the lesson's example sentences.
export function makeFillBlank(grammar) {
  const withKw = grammar.examples.filter((e) => e.hanzi.includes(grammar.drill.keyword))
  const ex = (withKw.length ? withKw : grammar.examples)[Math.floor(Math.random() * (withKw.length || grammar.examples.length))]
  const options = shuffle(grammar.drill.options).map((o) => ({ label: o, han: true, correct: o === grammar.drill.keyword }))
  return {
    type: 'fill-blank', grammarId: grammar.id, keyword: grammar.drill.keyword,
    sentence: ex, options, grammar: feedbackCtx(grammar),
    prompt: `Complete the sentence · ${grammar.title.split('—')[0].trim()}`,
  }
}

function makeBuildSentence(grammar, ex) {
  return { type: 'build-sentence', grammarId: grammar.id, sentence: ex, grammar: feedbackCtx(grammar), prompt: 'Build the sentence' }
}

export function buildGrammarQueue(grammar) {
  const q = [makeFillBlank(grammar), makeFillBlank(grammar)]
  for (const ex of shuffle(grammar.examples).slice(0, 2)) q.push(makeBuildSentence(grammar, ex))
  return shuffle(q)
}

// A short teaching card shown inline, right before a grammar drill.
export function makeGrammarTip(grammar) {
  return { type: 'grammar-tip', grammarId: grammar.id, grammar, sentence: grammar.examples[0], prompt: '' }
}

// First encounter with a concept: introduce it, then a short cluster of drills.
function grammarIntroBlock(grammar) {
  const exs = shuffle(grammar.examples)
  return [
    makeGrammarTip(grammar),
    makeFillBlank(grammar),
    makeBuildSentence(grammar, exs[0] || grammar.examples[0]),
    makeFillBlank(grammar),
  ]
}

// Later encounters: a single spaced review drill.
function grammarReviewItem(grammar) {
  return makeFillBlank(grammar)
}

// Splice contiguous segments into a base queue at spread-out positions, so grammar
// surfaces *as you go* rather than bunched at the end. Each segment stays in order.
function interleave(base, segments) {
  const out = [...base]
  if (!segments.length) return out
  const gap = Math.max(1, Math.floor(out.length / (segments.length + 1)))
  let pos = gap
  for (const seg of segments) {
    out.splice(Math.min(pos, out.length), 0, ...seg)
    pos += gap + seg.length
  }
  return out
}

const isNew = (g, isIntroduced) => !(isIntroduced ? isIntroduced(g.id) : false)

// Split a grammar list into new-concept intro blocks (lead the session) and
// single review drills for already-known concepts (interleaved among words).
function assemble(words, grammarList, isIntroduced, maxNewIntros) {
  const fresh = grammarList.filter((g) => isNew(g, isIntroduced)).slice(0, maxNewIntros)
  const known = grammarList.filter((g) => !isNew(g, isIntroduced))
  const intro = fresh.flatMap(grammarIntroBlock)            // contiguous: intro + drills
  const body = interleave(words, known.map((g) => [grammarReviewItem(g)]))
  return [...intro, ...body]
}

// Sentence-context listening: hear the word's example sentence, pick the English translation.
function makeSentenceListen(word, chapterWords) {
  const distPool = chapterWords.filter((w) => w.id !== word.id && w.ex)
  const dist = shuffle(distPool).slice(0, 3)
  if (dist.length < 3) {
    const global = WORDS.filter((w) => w.id !== word.id && w.ex && !dist.find((d) => d.id === w.id))
    dist.push(...shuffle(global).slice(0, 3 - dist.length))
  }
  const options = shuffle([word, ...dist]).map((w) => ({ label: w.ex[1], correct: w.id === word.id }))
  return { type: 'sentence-listen', word, audio: word.ex[0], options, prompt: 'What does the sentence mean?' }
}

// SRS-aware word queue for chapter practice: new words get 3 exercises, learning 2, familiar/mastered 1.
function buildSRSQueue(words, { includeWrite = false, cardFor } = {}) {
  const useTypes = WORD_TYPES.filter((t) => includeWrite || t !== 'write')
  const q = []
  for (const word of words) {
    const card = cardFor ? cardFor(word.id) : undefined
    const mastery = deriveMastery(card)
    const pool = shuffle([...useTypes])
    let exs
    if (mastery === 'new') {
      exs = [makeExercise('listen-meaning', word), makeExercise('meaning-hanzi', word)]
      if (word.ex) exs.push(makeSentenceListen(word, words))
      else exs.push(makeExercise(pool.find((t) => !['listen-meaning', 'meaning-hanzi'].includes(t)) || 'read-meaning', word))
    } else if (mastery === 'learning') {
      exs = [makeExercise(pool[0], word), makeExercise(pool[1] || 'read-meaning', word)]
    } else {
      exs = [makeExercise(pool[0], word)]
    }
    q.push(...exs)
  }
  return shuffle(q).filter(Boolean)
}

// Mixed chapter practice: introduce ALL grammar concepts for the chapter (no cap),
// with word exercises scaled to SRS mastery level.
export function buildChapterQueue(chapter, { includeWrite = true, isIntroduced, cardFor } = {}) {
  const words = buildSRSQueue(chapter.coreWords, { includeWrite, cardFor })
  return assemble(words, chapter.grammar, isIntroduced, Infinity)
}

// Review / quick practice: same logic over a chosen grammar list.
export function buildReviewQueue(words, grammarList = [], { isIntroduced, maxNewIntros = 1 } = {}) {
  const base = buildQueue(words, { includeWrite: false })
  return assemble(base, grammarList, isIntroduced, maxNewIntros)
}
