"""Download the FINAL chosen Wikimedia Commons image for each city into
assets/cities/<id>.jpg, resized to max 1600px wide, quality ~82. Writes a
sources manifest (scripts/wm_sources.md) for license attribution.

Usage: python wm_download.py
"""
import io, json, os, re, sys, time, urllib.parse, urllib.request
from PIL import Image

API = "https://commons.wikimedia.org/w/api.php"
UA = "BecomeChineseApp-image-localization/1.0 (contact: local test)"
HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, "..", "assets", "cities"))
MAXW = 1600
QUALITY = 82

# city_id -> exact Wikimedia file title (without File: prefix)
PICK = {
    "shangri-la": "Ganden Sumtseling Monastery 松赞林寺, Yunnan, 2009 (51990868798).jpg",
    "yanan": "宝塔山看延安市 1.jpg",
    "jincheng": "晋城皇城相府 - panoramio.jpg",
    "linfen": "山西 黄河壶口瀑布 - panoramio.jpg",
    "honghe": "Jingkou Sunrise (151240987).jpeg",
    "dehong": "勐焕大金塔01.jpg",
    "qiandao": "Mt Banner and Thousand Island Lake.jpg",
    "putuoshan": "Mount Putuo 20090606 8825.jpg",
    "wutaishan": "Wutai shan temples.jpg",
    "emeishan": "峨眉山金顶之钟楼.jpg",
    "qingchengshan": "青城山 Mount Qingcheng 2017.jpg",
    "longhushan": "龙虎山.JPG",
    "zhengzhou": "Night view of Zhengdong New Area CBD.jpeg",
    "anyang": "乙二十仿殷大殿 - panoramio.jpg",
    "taishan": "Jade Emperor Peak of Mount Tai 泰山玉皇顶 2007 075.jpg",
    "qufu": "曲阜孔庙.jpg",
    "weifang": "第42届潍坊国际风筝会01.jpg",
    "zibo": "Zibo montage.jpg",
    "jinan": "趵突泉201904.jpg",
    "taiyuan": "Lingshi Jinci Miao 2013.08.24 16-12-22.jpg",
    "yangzhou": "扬州瘦西湖, 2009-01-28 06.jpg",
    "huaian": "周恩来纪念馆01.jpg",
    "zhenjiang": "镇江金山寺.jpg",
    "changzhou": "ChangzhouOldCityDistrict.jpg",
    "wuxi": "鼋头渚.jpg",
    "macau": "澳门大三巴牌坊平安夜.jpg",
    "hongkong": "Victoria Harbour skyscrapers.jpg",
    "zhoushan": "SOUTH GATE OF THE CITY OF TING-HAI.jpg",
    "liuan": "Dabie Mountains landscape - seen from Hewu Railway P1050141.JPG",
    "huanggang": "湖北黄冈东坡赤壁.jpg",
    "jingdezhen": "Jingdezhen China Ceramics Museum 20231020 12.jpg",
    "yichang": "三峡大坝.jpg",
    "jingzhou": "荆州古城墙.jpg",
    "zhuzhou": "Zhuzhou County 20170721 110026.jpg",
    "hengyang": "HengshanMountains.JPG",
    "chengde": "承德避暑山庄澹泊敬诚殿2025.11.jpg",
    "qianjiang": "Qianjiang Road Station 01.jpg",
    "meizhou": "2000-01-15 Meizhou Street.jpg",
    "dongguan": "东莞 松山湖之查理大桥.jpg",
    "zhuhai": "珠海情侣路 - panoramio.jpg",
    "foshan": "Foshan Zu Miao 2012.11.20 15-41-28.jpg",
    "zhaoqing": "肇庆七星岩 - panoramio.jpg",
    "shaoguan": "韶关丹霞山 - panoramio (1).jpg",
    "heyuan": "The Wanlv Lake at noon.jpg",
    "shanwei": "汕尾风光1.jpg",
}


def api(params):
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for a in range(5):
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            time.sleep(9 if e.code == 429 else 4)
        except Exception:
            time.sleep(4)
    return None


def resolve_title(title):
    """Get download url + license for an exact file title via imageinfo."""
    res = api({
        "action": "query", "titles": "File:" + title,
        "prop": "imageinfo", "iiprop": "url|size|extmetadata|mime",
        "iiurlwidth": str(MAXW * 2), "format": "json",
    })
    if not res:
        return None, None
    pages = (res.get("query") or {}).get("pages", {})
    for pg in pages.values():
        ii = (pg.get("imageinfo") or [{}])[0]
        url = ii.get("thumburl") or ii.get("url")
        lic = (ii.get("extmetadata") or {}).get("LicenseShortName", {}).get("value", "?")
        artist = re.sub(r"<[^>]+>", "", (ii.get("extmetadata") or {}).get("Artist", {}).get("value", ""))
        return url, f"{pg.get('title')} | License: {lic} | Author: {artist}"
    return None, None


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for a in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except Exception as e:
            print("      fetch retry", a + 1)
            time.sleep(4)
    return None


def process(cid, title):
    out = os.path.join(ASSETS, f"{cid}.jpg")
    # Skip if already downloaded (resume support)
    if os.path.exists(out):
        return ("SKIP-EXISTS", None)
    url, meta = resolve_title(title)
    if not url:
        return ("NO-URL", meta)
    data = fetch(url)
    if not data:
        return ("FETCH-FAIL", meta)
    try:
        im = Image.open(io.BytesIO(data)).convert("RGB")
    except Exception as e:
        return (f"DECODE-FAIL {e}", meta)
    w, h = im.size
    if w > MAXW:
        nh = int(round(h * MAXW / w))
        im = im.resize((MAXW, nh), Image.LANCZOS)
    im.save(out, "JPEG", quality=QUALITY, optimize=True)
    return (f"OK {im.size[0]}x{im.size[1]} {os.path.getsize(out)//1024}KB", meta)


def main():
    os.makedirs(ASSETS, exist_ok=True)
    src_lines = ["# Wikimedia Commons source / attribution for local place photos\n"]
    ok, skip, fail = [], [], []
    for i, (cid, title) in enumerate(PICK.items()):
        status, meta = process(cid, title)
        print(f"  {i+1:2d}/{len(PICK)} {cid:14s} {status}")
        if status.startswith("OK"):
            ok.append(cid)
            src_lines.append(f"- `{cid}` : {meta}\n")
        elif status.startswith("SKIP"):
            skip.append(cid)
            src_lines.append(f"- `{cid}` : (already downloaded before)\n")
        else:
            fail.append((cid, title, status, meta))
        time.sleep(4)  # respect Wikimedia rate limits (was 1.5s -> 429 storms)
    with open(os.path.join(HERE, "wm_sources.md"), "w", encoding="utf-8") as f:
        f.writelines(src_lines)
    print(f"\nOK: {len(ok)}  SKIP: {len(skip)}  FAIL: {len(fail)}")
    for cid, t, s, m in fail:
        print(f"  FAIL {cid}: {t} -> {s} | {m}")
    # re-save PICK as a JSON for mapping step
    json.dump(PICK, open(os.path.join(HERE, "wm_pick.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
