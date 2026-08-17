"""Search Wikimedia Commons for candidate images for cities lacking local assets.
Outputs a JSON manifest (scripts/wm_candidates.json) for human review.
Usage: python wm_search.py
"""
import json, re, time, urllib.parse, urllib.request, os

API = "https://commons.wikimedia.org/w/api.php"
UA = "BecomeChineseApp-image-localization/1.0 (contact: local test)"

# city_id -> list of search queries (tried in order; first hit wins)
SEARCH = {
    "shangri-la": ["香格里拉 松赞林寺", "Shangri-La Yunnan landscape"],
    "yanan": ["延安 宝塔山", "Yan'an Pagoda Hill"],
    "jincheng": ["晋城 DBZ 炎帝陵", "Jincheng Shanxi city"],
    "linfen": ["临汾 尧庙", "Linfen Shanxi Hukou"],
    "honghe": ["红河 元阳梯田", "Yuanyang Rice Terraces"],
    "dehong": ["德宏 瑞丽 姐告", "Dehong Ruili"],
    "qiandao": ["千岛湖", "Qiandao Lake panorama"],
    "putuoshan": ["普陀山", "Mount Putuo"],
    "wutaishan": ["五台山", "Mount Wutai"],
    "emeishan": ["峨眉山 金顶", "Mount Emei"],
    "qingchengshan": ["青城山", "Mount Qingcheng"],
    "longhushan": ["龙虎山", "Mount Longhu"],
    "zhengzhou": ["郑州 郑东新区 天际线", "Zhengzhou skyline CBD"],
    "anyang": ["安阳 殷墟", "Yinxu Anyang"],
    "taishan": ["泰山", "Mount Tai"],
    "qufu": ["曲阜 孔庙", "Qufu temple Confucius"],
    "weifang": ["潍坊 风筝", "Weifang"],
    "zibo": ["淄博", "Zibo city"],
    "jinan": ["济南 趵突泉", "Jinan Baotu Spring"],
    "taiyuan": ["太原 晋祠", "Taiyuan Jinci"],
    "yangzhou": ["扬州 瘦西湖", "Yangzhou Slender West Lake"],
    "huaian": ["淮安 周恩来纪念馆", "Huaian city"],
    "zhenjiang": ["镇江 金山寺", "Zhenjiang Jinshan temple"],
    "changzhou": ["常州", "Changzhou city"],
    "wuxi": ["无锡 鼋头渚", "Wuxi Lihu"],
    "macau": ["澳门 大三巴", "Macau Ruins of Saint Paul"],
    "hongkong": ["香港 维多利亚港", "Hong Kong Victoria Harbour skyline"],
    "zhoushan": ["舟山", "Zhoushan city"],
    "liuan": ["六安 天堂寨", "Liuan Anhui"],
    "huanggang": ["黄冈", "Huanggang city"],
    "jingdezhen": ["景德镇 陶瓷", "Jingdezhen porcelain"],
    "yichang": ["宜昌 三峡", "Yichang Three Gorges"],
    "jingzhou": ["荆州 古城", "Jingzhou ancient city"],
    "zhuzhou": ["株洲", "Zhuzhou city"],
    "hengyang": ["衡山 衡阳", "Mount Heng Hengyang"],
    "chengde": ["承德 避暑山庄", "Chengde Mountain Resort"],
    "qianjiang": ["潜江 曹禺", "Qianjiang Hubei"],
    "meizhou": ["梅州", "Meizhou city"],
    "dongguan": ["东莞 松山湖", "Dongguan city"],
    "zhuhai": ["珠海 情侣路", "Zhuhai skyline"],
    "foshan": ["佛山 祖庙", "Foshan ancestral temple"],
    "zhaoqing": ["肇庆 七星岩", "Zhaoqing Seven Star Crags"],
    "shaoguan": ["韶关 丹霞山", "Danxia Mountain Shaoguan"],
    "heyuan": ["河源 万绿湖", "Heyuan city"],
    "shanwei": ["汕尾", "Shanwei city"],
}

FREE_LICENSES = ("cc0", "cc-by", "pd", "public domain", "cc-by-sa", "artificial", "cc_by")


def api(params):
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 6 + attempt * 5
                print(f"   429, backing off {wait}s")
                time.sleep(wait)
                continue
            print("   HTTPError", e.code, e)
            time.sleep(3)
        except Exception as e:
            print("   err", e)
            time.sleep(3)
    return None


def norm_lic(s):
    s = (s or "").lower()
    if "cc0" in s or "public domain" in s:
        return "PD/CC0"
    if "cc-by" in s:
        match = re.search(r'cc by[ -]?sa', s)
        return "CC BY-SA" if match else "CC BY"
    if "pd" in s:
        return "PD"
    return s


def search(query, limit=6):
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
        meta = ii.get("extmetadata", {})
        lic = norm_lic(meta.get("LicenseShortName", {}).get("value"))
        ext = (ii.get("mime") or "")
        if ext != "image/jpeg":
            continue
        w, h = ii.get("width", 0), ii.get("height", 0)
        # prefer landscape / not too tiny
        if min(w, h) < 600 or w < h * 0.8:
            continue
        artist = re.sub(r"<[^>]+>", "", meta.get("Artist", {}).get("value", "")) or "?"
        out.append({
            "title": pg.get("title"),
            "lic": lic, "artist": artist[:40],
            "w": w, "h": h, "ratio": round(w / h, 2),
            "thumburl": ii.get("thumburl"),
            "src": ii.get("url"),
            "query": query,
        })
    return out


def pick_best(cands):
    """rank: prefer CC0/PD, then wider/more square, larger"""
    def score(c):
        lic_score = {"PD/CC0": 3, "CC BY": 2, "CC BY-SA": 1}.get(c["lic"], 0)
        ratio = abs(c["ratio"] - 1.5)  # closer to 3:2 ideal
        return (lic_score, -ratio, c["w"], c["h"])
    return sorted(cands, key=score, reverse=True)


def main():
    result = {}
    for cid, queries in SEARCH.items():
        cands = []
        for q in queries[:1]:  # one query per city first pass
            try:
                r = search(q)
            except Exception as e:
                print(f"  {cid}: search error {e}")
                r = []
            if r:
                cands.extend(r)
            time.sleep(4)  # respect Wikimedia rate limits
        best = pick_best(cands)
        result[cid] = [dict(c) for c in best[:3]]
        top = best[0] if best else None
        if top:
            print(f"  {cid:14s} -> {top['lic']:10s} {top['title'][:55]} ({top['ratio']})")
        else:
            print(f"  {cid:14s} -> NO RESULT")
    with open(os.path.join(os.path.dirname(__file__), "wm_candidates.json"), "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
    n_ok = sum(1 for v in result.values() if v)
    print(f"\n候选已写入 wm_candidates.json: {n_ok}/{len(SEARCH)} 城市有候选")


if __name__ == "__main__":
    main()
