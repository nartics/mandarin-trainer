import { WORDS } from '../data/vocab'

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

// Grammar drill: blank the pattern keyword in one of the lesson's example sentences.
export function makeFillBlank(grammar) {
  const withKw = grammar.examples.filter((e) => e.hanzi.includes(grammar.drill.keyword))
  const ex = (withKw.length ? withKw : grammar.examples)[Math.floor(Math.random() * (withKw.length || grammar.examples.length))]
  const options = shuffle(grammar.drill.options).map((o) => ({ label: o, han: true, correct: o === grammar.drill.keyword }))
  return {
    type: 'fill-blank', grammarId: grammar.id, keyword: grammar.drill.keyword,
    sentence: ex, options, prompt: `Complete the sentence · ${grammar.title.split('—')[0].trim()}`,
  }
}

export function buildGrammarQueue(grammar) {
  const q = []
  // a couple of fill-blanks + reorder its example sentences
  q.push(makeFillBlank(grammar))
  q.push(makeFillBlank(grammar))
  for (const ex of shuffle(grammar.examples).slice(0, 2)) {
    q.push({ type: 'build-sentence', grammarId: grammar.id, sentence: ex, prompt: 'Build the sentence' })
  }
  return shuffle(q)
}

// Mixed chapter practice: core-word exercises + one fill-blank per grammar point.
export function buildChapterQueue(chapter, { includeWrite = true } = {}) {
  const q = buildQueue(chapter.coreWords, { includeWrite, perWord: 1 })
  for (const g of chapter.grammar) q.push(makeFillBlank(g))
  return shuffle(q)
}
