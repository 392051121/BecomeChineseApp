"""Second-pass targeted search for cities whose first candidate was poor/missing.
Pull the best real candidate for each. Appends into wm_candidates.json.
"""
import json, re, time, urllib.parse, urllib.request, os, sys

API = "https://commons.wikimedia.org/w/api.php"
UA = "BecomeChineseApp-image-localization/1.0 (contact: local test)"
HERE = os.path.dirname(os.path.abspath(__file__))
CAND_FILE = os.path.join(HERE, "wm_candidates.json")

# city -> (query, preferred_title_keyword) preferred_keyword optional filter
RESEARCH = {
    "zhoushan":   ["Zhoushan port city", ""],
    "hengyang":   ["衡山", "衡"],
    "zhuzhou":    ["Zhuzhou Xiangjiang city", ""],
    "yichang":    ["三峡大坝", "坝"],
    "shangri-la": ["Shangri-La Ganden Sumtseling Monastery", "松赞林寺"],
    "huanggang":  ["黄冈 东坡赤壁", "东坡"],
    "jingdezhen": ["景德镇 古窑 陶瓷", "古窑"],
    "zibo":       ["淄博 城市", "淄"],
    "putuoshan":  ["Mount Putuo", "Putuo"],
    "honghe":     ["元阳梯田", "梯田"],
    "jincheng":   ["Jincheng 皇城相府", "相府"],
    "linfen":     ["临汾 壶口瀑布", "壶口"],
    "dehong":     ["瑞丽 大金塔", "金塔"],
    "zhengzhou":  ["Zhengzhou CBD 郑东新区", "郑东"],
    "liuan":      ["六安 天堂寨", "天堂寨"],
    "qianjiang":  ["潜江 曹禺", "曹禺"],
    "longhushan": ["龙虎山", "山"],
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
                print(f"   429 backoff {7+attempt*5}s")
                time.sleep(7 + attempt * 5)
        except Exception as e:
            print("   err", e)
            time.sleep(3)
    return None


def search(query, limit=10):
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
        if min(w, h) < 700 or w < h * 0.9:
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
    for cid, (query, kw) in RESEARCH.items():
        results = search(query)
        if kw:
            results = [r for r in results if kw.lower() in r["title"].lower()] or results
        cands[cid] = results[:3]
        if results:
            r = results[0]
            print(f"  {cid:14s} -> [{r['lic']}] {r['title'][:58]}")
        else:
            print(f"  {cid:14s} -> STILL NO RESULT")
        time.sleep(4)
    json.dump(cands, open(CAND_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("\ndone, updated wm_candidates.json")


if __name__ == "__main__":
    main()
