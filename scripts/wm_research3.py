"""Round-3: hard cities. Try several query variants each, best wins."""
import json, re, time, urllib.parse, urllib.request, os

API = "https://commons.wikimedia.org/w/api.php"
UA = "BecomeChineseApp-image-localization/1.0 (contact: local test)"
HERE = os.path.dirname(os.path.abspath(__file__))
CAND_FILE = os.path.join(HERE, "wm_candidates.json")

HARD = {
    "zhuzhou":    ["Zhuzhou city skyline", "株洲 神农广场 雕塑", "株洲 湘江"],
    "jingdezhen": ["景德镇 中国陶瓷博物馆", "景德镇 御窑厂", "Jingdezhen kiln"],
    "zibo":       ["淄博 齐盛湖", "淄博 海岱楼", "淄博 城市全景"],
    "linfen":     ["壶口瀑布 山西", "Hukou Waterfall", "临汾 尧庙"],
    "liuan":      ["六安 天堂寨 瀑布", "六安 万佛湖", "Lu'an 大别山"],
    "qianjiang":  ["潜江 城市", "潜江 曹禺公园", "Qianjiang Hubei city"],
}


def api(params):
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                print(f"   429 backoff {8+attempt*5}s")
                time.sleep(8 + attempt * 5)
            else:
                time.sleep(3)
        except Exception as e:
            print("   err", e)
            time.sleep(3)
    return None


def search(query, limit=8):
    res = api({
        "action": "query", "generator": "search",
        "gsrsearch": query, "gsrlimit": limit, "gsrnamespace": "6",
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata|mime",
        "iiurlwidth": "1600", "format": "json",
    })
    if not res:
        return []
    pages = (res.get("query") or {}).get("pages", {})
    out = []
    for pid, pg in sorted(pages.items(), key=lambda kv: int(kv[0])):
        ii = (pg.get("imageinfo") or [{}])[0]
        if (ii.get("mime") or "") != "image/jpeg":
            continue
        w, h = ii.get("width", 0), ii.get("height", 0)
        if min(w, h) < 700 or w < h * 0.8:
            continue
        meta = ii.get("extmetadata", {})
        lic = (meta.get("LicenseShortName", {}).get("value") or "?").lower()
        artist = re.sub(r"<[^>]+>", "", meta.get("Artist", {}).get("value", "")) or "?"
        out.append({
            "title": pg.get("title"), "lic": lic, "artist": artist[:30],
            "w": w, "h": h, "ratio": round(w / h, 2),
            "thumburl": ii.get("thumburl"), "src": ii.get("url"), "query": query,
        })
    return out


def main():
    cands = json.load(open(CAND_FILE, encoding="utf-8"))
    for cid, queries in HARD.items():
        best = []
        for q in queries:
            best.extend(search(q))
            time.sleep(3.5)
        # dedupe by title
        seen, uniq = set(), []
        for c in best:
            if c["title"] not in seen:
                seen.add(c["title"]); uniq.append(c)
        cands[cid] = uniq[:4]
        if uniq:
            r = uniq[0]
            print(f"  {cid:14s} -> [{r['lic']}] {r['title'][:56]}")
        else:
            print(f"  {cid:14s} -> STILL NO RESULT")
    json.dump(cands, open(CAND_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("\ndone")


if __name__ == "__main__":
    main()
