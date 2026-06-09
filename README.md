# 汉语 — HSK 1 Mastery

A Duolingo-style trainer to fully master **HSK 1** Chinese across **reading, writing & listening**.
Vite + React + Tailwind PWA. Fully self-contained — no API keys, works offline after first load.

## Run it

```bash
cd mandarin-trainer
npm install
npm run dev      # http://localhost:5188
```

Build for production / install to your phone:

```bash
npm run build && npm run preview
```

Then open on your phone and **Add to Home Screen** (iOS Safari: Share → Add to Home Screen).
It launches full-screen like a native app, and all progress is saved locally on the device.

## What's inside

The full **official HSK 1 word list** (~146 words / 170 characters), grouped into 15 themed
lessons. Every word has a native example sentence.

### Four ways to train

| Tab | What it does |
|-----|--------------|
| **Learn** | A lesson path. Each lesson mixes 6 exercise types: listen-and-choose, read-the-meaning, meaning→hanzi, pick-the-pinyin, build-the-sentence, and stroke-order writing. |
| **Listen** 听力 | Connected-speech comprehension. Hear a full sentence at **native speed** (toggle 🐢 slow), then pick the meaning. |
| **Write** 写字 | Stroke-order practice for every character, powered by Hanzi Writer. Trace it correctly to master it; tap **▶ Show me** to watch the strokes. |
| **Review** 复习 | Anki-style spaced repetition (SM-2). Due words come back right before you'd forget them. |

### Listening — native voices

Listening uses your device's **native system Mandarin voice** via the Web Speech API.
On macOS / iOS these are genuine native-speaker voices (Tingting, Sinji, Meijia…). No key, no network.

> If a device has no Chinese voice installed, add one in
> **Settings → Accessibility → Spoken Content → Voices → Chinese**.

## How mastery works

- Every answer feeds an SM-2 spaced-repetition card per word.
- A word climbs **new → learning → familiar → mastered** as your recall intervals grow.
- The dashboard shows exactly how many of the 146 words you've mastered, plus streak & XP.
- Writing mastery is tracked separately per character (a clean, mistake-free trace = mastered).

## Tech

- **Pinyin** is generated at runtime with `pinyin-pro` (tone-marked and tone-colored), so the
  data file only stores hanzi + English — less to get wrong.
- **Stroke data** loads on demand from the Hanzi Writer CDN and is cached by the service worker.
- State lives in `localStorage` under `hsk1-progress-v1`.

## Extending to real native audio

Listening currently uses on-device TTS. To swap in real native recordings, drop audio files in
`public/audio/<hanzi>.mp3` and update `useSpeech` to prefer them — the rest of the app is unchanged.
