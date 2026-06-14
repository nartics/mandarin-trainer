# 汉语 — HSK 1 Mastery (Manhattan Mandarin)

A Duolingo-style trainer **structured around your live HSK 1 class** — the Spring 2026
Manhattan Mandarin course, which follows the **HSK Standard Course textbook, chapters 1–15**.
Reading, writing, listening and grammar, all mapped to what you actually study each week.
Vite + React + Tailwind PWA. Self-contained — no API keys, works offline after first load.

## Run it

```bash
cd mandarin-trainer
npm install
npm run dev      # http://localhost:5188
```

Build / install to your phone: `npm run build && npm run preview`, open on your phone and
**Add to Home Screen**. Progress is saved locally on the device.

## Structured around the class

The backbone is the **15 HSK Standard Course chapters** (你好 → 我是坐飞机来的). The home
screen marks **"Your class is here"** at the chapter you're currently on. Each chapter opens to:

- **Vocab** — the core HSK 1 words for that lesson, plus a collapsible *"From class — extension"*
  group of the extra conversational words your teacher added (kept separate so they don't
  distort your exam-vocab progress).
- **Grammar** — full lessons for every pattern the class teaches (想/可以/在+V, 是/吗, 的, 有,
  会/能, **都**, 喜欢, measure words, telling time, 怎么样, 太…了, 在…呢, **了 / 了吗**, **还是**,
  一些/更, **是…的**, 从…来 / 前·后…): a plain-English explanation, the pattern template, the
  **real example sentences from your class notes**, and drills.
- **Practice** — a mixed session (listen / read / pinyin / build-sentence / write / grammar
  fill-blank) scoped to that chapter.
- **Resources** — the exact **ChinesePod** native-speaker episodes, **Quizlet** sets and
  textbook lesson from that week's homework.

### Four tabs

| Tab | What it does |
|-----|--------------|
| **Learn** | Chapter path + dashboard. Open any chapter for its vocab, grammar, practice & resources. |
| **Listen** 听力 | Connected-speech comprehension at **native speed** (🐢 slow toggle), drawn from the class's example sentences. |
| **Write** 写字 | Stroke-order practice for every core character (Hanzi Writer). |
| **Review** 复习 | Anki-style spaced repetition (SM-2) across all core words. |

### Listening — native voices
By default, listening uses your device's **native system Mandarin voice** (Tingting / Sinji /
Meijia on macOS/iOS). Each chapter's Resources tab also links the class's ChinesePod episodes
for real native-speaker dialogue. *(ChinesePod & Quizlet use the class login from your course sheet.)*

**Optional — ElevenLabs voices.** For higher-quality audio, set an ElevenLabs key and the app
uses it automatically (cached per phrase), falling back to the system voice if a call fails:
- **Deployed / `vercel dev`**: set `ELEVENLABS_API_KEY` (server-side; the `api/tts.js` edge
  proxy keeps it out of the browser bundle) **and** `VITE_ELEVENLABS_ENABLED=1` (the public
  flag that turns the proxy on). Optionally `VITE_ELEVENLABS_VOICE_ID`. Redeploy after adding.
- **Plain `npm run dev`** (no proxy): set `VITE_ELEVENLABS_API_KEY` in `.env` for dev-only
  direct calls. With no key set, nothing changes — it stays on the free system voice.
See `.env.example`.

## Where the content comes from

- `resources/class-notes.pdf` — your class PDF (22 weeks of notes).
- `scripts/parse_class_pdf.py` — extracts the notes into `src/data/classNotes.json`
  (~694 vocab items + example sentences). Re-run after each new class:
  ```bash
  pip install pymupdf
  python3 scripts/parse_class_pdf.py
  ```
- `src/data/vocab.js` — the 146 core HSK 1 words, bucketed into the 15 chapters.
- `src/data/grammar.js` — authored grammar lessons (examples sourced from the class notes).
- `src/data/chapters.js` — ties it together (core + grammar + class extension vocab + sentences).
- `src/data/resources.js` — per-chapter ChinesePod / Quizlet / textbook links.

## Tech
Pinyin is generated at runtime with `pinyin-pro` (tone-marked & colored). Hanzi stroke data
loads on demand from the Hanzi Writer CDN and is service-worker cached. Progress lives in
`localStorage` (`hsk1-progress-v1`).
