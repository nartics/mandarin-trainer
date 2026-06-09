import { WORDS } from '../data/vocab'

function shuffle(a) {
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

// Build a varied, shuffled exercise queue from a set of words.
// types is the list of exercise kinds to mix in.
export function buildQueue(words, {
  types = ['listen-meaning', 'read-meaning', 'meaning-hanzi', 'pinyin-choose', 'listen-hanzi', 'build-sentence', 'write'],
  perWord = 1,
  includeWrite = false,
} = {}) {
  const q = []
  const useTypes = includeWrite ? types : types.filter((t) => t !== 'write')

  for (const word of words) {
    const picks = shuffle(useTypes)
    for (let k = 0; k < perWord; k++) {
      const type = picks[k % picks.length]
      q.push(makeExercise(type, word))
    }
  }
  return shuffle(q).filter(Boolean)
}

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
      return { type, word, prompt: 'Build the sentence' }
    case 'write':
      return { type, word, prompt: 'Write the character' }
    default:
      return { type: 'read-meaning', word, options: shuffle([word, ...distractors(word, 'en')]).map((w) => ({ label: w.en, correct: w.id === word.id })) }
  }
}

export { shuffle }
