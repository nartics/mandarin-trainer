#!/usr/bin/env python3
"""Parse the Manhattan Mandarin HSK 1 class PDF into structured JSON.

The PDF is 22 weekly entries (reverse-chronological). Each week has a "Class Notes
and Vocab" block of numbered section headers containing hanzi/pinyin/English items.
Items appear in three formats, all handled here:
  A) three separate lines:      汉字 / pīnyīn / english
  B) inline hanzi+pinyin, then:  ● 汉字 (pīnyīn)  /  → english
  C) one line:                   汉字 (pīnyīn) — english

Output: src/data/classNotes.json
  [{ week, date, chapterRefs, sections: [{ title, kind, items: [{hanzi,pinyin,en,type}] }] }]

Run:  python3 scripts/parse_class_pdf.py        (requires: pip install pymupdf)
"""
import json
import re
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("Install pymupdf:  pip install pymupdf")

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "resources" / "class-notes.pdf"
OUT = ROOT / "src" / "data" / "classNotes.json"

ZWS = "​"
DATE_RE = re.compile(r"^([A-Z][a-z]{2} \d{1,2}, 20\d\d)$")
HDR_RE = re.compile(r"^(\d+\s*[\.\、]|[一二三四五六七八九十]+\s*[\、\.]|Grammar\b)")
CJK_RE = re.compile(r"[一-鿿]")
PINYIN_CHARS = r"a-zA-ZüÜāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ"
PINYIN_LINE_RE = re.compile(r"^[" + PINYIN_CHARS + r"'·\.\-,\s/]+[0-9]*$")
# inline: <hanzi...> (<pinyin>) [trailing english]
INLINE_RE = re.compile(
    r"^(?P<h>[^()]*[一-鿿][^()]*?)\s*\((?P<p>[^)]*?)\)\s*(?P<rest>.*)$"
)
SENT_PUNCT = re.compile(r"[。？！，、…?!]")
BULLET_RE = re.compile(r"^[\s●○•\-–—→\*·●○]+")
SUBLABEL = {"pattern", "affirmative", "examples", "example", "paying", "ordering",
            "negative", "quantities and measure words"}


def has_cjk(s):
    return bool(CJK_RE.search(s))


def looks_pinyin(s):
    s = s.strip()
    if not s or has_cjk(s):
        return False
    return bool(re.search(r"[a-z" + "āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ" + r"]", s, re.I)) and bool(
        PINYIN_LINE_RE.match(s)
    )


def strip_bullet(s):
    return BULLET_RE.sub("", s).strip()


def strip_english(s):
    return re.sub(r"^[\s→—–\-:•●○]+", "", s).strip()


def classify(hanzi, en):
    if SENT_PUNCT.search(hanzi):
        return "sentence"
    n = len(CJK_RE.findall(hanzi))
    if n >= 5:
        return "sentence"
    ew = en.split()
    if len(ew) >= 4 and en[-1:] in ".?!":
        return "sentence"
    if any(p in hanzi for p in ("吗", "呢", "吧")) and n >= 3:
        return "sentence"
    if "了" in hanzi and n >= 4:
        return "sentence"
    return "vocab"


def section_kind(title):
    t = title.lower()
    if "grammar" in t or "structure" in t or "pattern" in t or "用法" in title:
        return "grammar"
    if any(k in title for k in ("了吗", "都", "还是", "还没", "更", "可以", "想要", "是…的",
                                "是...的", "在 + v", "了 ", "（")):
        return "grammar"
    return "vocab"


def clean(line):
    return line.replace(ZWS, "").strip()


def extract_items(lines):
    """Return (items, leftover_non_items) from a list of content lines."""
    items = []
    i, n = 0, len(lines)
    while i < n:
        raw = lines[i]
        line = strip_bullet(raw)
        if not line:
            i += 1
            continue
        if line.lower().rstrip(":").strip() in SUBLABEL:
            i += 1
            continue

        m = INLINE_RE.match(line)
        if m and looks_pinyin(m.group("p")):
            hanzi = re.sub(r"[\s—–\-→:]+$", "", m.group("h")).strip()
            pinyin = m.group("p").strip()
            rest = strip_english(m.group("rest"))
            if not rest and i + 1 < n:
                nxt = strip_english(strip_bullet(lines[i + 1]))
                if nxt and not has_cjk(nxt) and not looks_pinyin(nxt) and not HDR_RE.match(lines[i + 1]):
                    rest = nxt
                    i += 1
            if hanzi and rest:
                items.append({"hanzi": hanzi, "pinyin": pinyin, "en": rest,
                              "type": classify(hanzi, rest)})
            i += 1
            continue

        # three-line triplet
        if (has_cjk(line) and i + 2 < n
                and looks_pinyin(strip_english(strip_bullet(lines[i + 1])))
                and not has_cjk(lines[i + 2])
                and not HDR_RE.match(lines[i + 2])):
            en = strip_english(strip_bullet(lines[i + 2]))
            if en.lower() not in SUBLABEL and en:
                items.append({"hanzi": line, "pinyin": strip_bullet(lines[i + 1]).strip(),
                              "en": en, "type": classify(line, en)})
                i += 3
                continue
        i += 1
    return items


def parse():
    doc = fitz.open(PDF)
    lines = []
    for pg in doc:
        for raw in pg.get_text().split("\n"):
            s = clean(raw)
            if s:
                lines.append(s)

    # Split into week blocks on date headers.
    weeks, cur = [], None
    for line in lines:
        m = DATE_RE.match(line)
        if m:
            cur = {"date": m.group(1), "raw": [], "chapterRefs": []}
            weeks.append(cur)
            continue
        if cur is not None:
            cur["raw"].append(line)
            for cm in re.findall(r"chapter\s*(\d+)|lesson\s*(\d+)", line, re.I):
                num = cm[0] or cm[1]
                if num and int(num) not in cur["chapterRefs"]:
                    cur["chapterRefs"].append(int(num))

    weeks = list(reversed(weeks))  # oldest-first
    for idx, w in enumerate(weeks, 1):
        w["week"] = idx

    result = []
    for w in weeks:
        body = w["raw"]
        start = 0
        for j, l in enumerate(body):
            if l.lower().startswith("class notes"):
                start = j + 1
                break
        content = body[start:]

        # Build sections by splitting on headers; extract items within each.
        sections = []
        cur_title, cur_kind, buf = None, "vocab", []

        def flush():
            if buf:
                items = extract_items(buf)
                if items:
                    sections.append({"title": cur_title or "Notes",
                                     "kind": cur_kind, "items": items})

        for l in content:
            if HDR_RE.match(l):
                flush()
                buf = []
                cur_title = re.sub(r"^(\d+\s*[\.\、]|[一二三四五六七八九十]+\s*[\、\.])\s*", "", l).strip() or l
                cur_kind = section_kind(l)
            else:
                buf.append(l)
        flush()

        result.append({"week": w["week"], "date": w["date"],
                       "chapterRefs": sorted(w["chapterRefs"]), "sections": sections})

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    items = sum(len(s["items"]) for wk in result for s in wk["sections"])
    sents = sum(1 for wk in result for s in wk["sections"] for it in s["items"] if it["type"] == "sentence")
    print(f"Wrote {OUT.relative_to(ROOT)}")
    print(f"  weeks {len(result)}  sections {sum(len(w['sections']) for w in result)}  "
          f"items {items}  (sentences {sents}, vocab {items - sents})")


if __name__ == "__main__":
    parse()
