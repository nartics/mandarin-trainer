import { pinyin } from 'pinyin-pro'

// Convert a hanzi string into an array of { hanzi, pinyin, tone } segments,
// aligned character-by-character. Non-Chinese chars pass through as tone 0.
export function annotate(text) {
  if (!text) return []
  const toned = pinyin(text, { type: 'array', toneType: 'symbol', nonZh: 'consecutive' })
  const numbered = pinyin(text, { type: 'array', toneType: 'num', nonZh: 'consecutive' })
  const chars = Array.from(text)
  return chars.map((ch, i) => {
    const py = toned[i] ?? ''
    const num = numbered[i] ?? ''
    const m = /([1-5])\b/.exec(num)
    const tone = /[一-鿿]/.test(ch) ? (m ? Number(m[1]) : 5) : 0
    return { hanzi: ch, pinyin: /[一-鿿]/.test(ch) ? py : '', tone }
  })
}

// Plain toned pinyin string for a sentence, e.g. "nǐ hǎo".
export function toPinyin(text) {
  if (!text) return ''
  return pinyin(text, { toneType: 'symbol', nonZh: 'consecutive' })
}
