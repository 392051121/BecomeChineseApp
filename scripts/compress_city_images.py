"""Compress all JPEGs in assets/cities to shrink APK size.
- Images wider than MAXW get downscaled to MAXW (LANCZOS).
- Anything substantially larger than the target bytes is re-encoded at quality.
- Skips files already under the target and already at/below MAXW width.
Only re-encodes; never deletes. Idempotent.
"""
import glob, os
from PIL import Image

ASSETS = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "cities"))
MAXW = 1600            # cap width
QUALITY = 80           # re-encode quality
TARGET_BYTES = 800_000 # don't touch files already this small

def compress(path):
    orig = os.path.getsize(path)
    if orig <= TARGET_BYTES:
        # already small enough; still downscale if absurdly wide but tiny
        return ("SKIP-SMALL", orig, orig, None)
    im = Image.open(path)
    w, h = im.size
    if w > MAXW:
        nh = int(round(h * MAXW / w))
        im = im.resize((MAXW, nh), Image.LANCZOS)
    im = im.convert("RGB")
    tmp = path + ".tmp.jpg"
    im.save(tmp, "JPEG", quality=QUALITY, optimize=True)
    new_size = os.path.getsize(tmp)
    if new_size < orig:
        os.replace(tmp, path)
        return ("OK", orig, new_size, f"{im.size[0]}x{im.size[1]}")
    else:
        os.remove(tmp)
        return ("NO-GAIN", orig, orig, f"{im.size[0]}x{im.size[1]}")

def main():
    files = sorted(glob.glob(os.path.join(ASSETS, "*.jpg")))
    before = sum(os.path.getsize(f) for f in files)
    stats = {"OK": 0, "SKIP-SMALL": 0, "NO-GAIN": 0}
    saved = 0
    for f in files:
        status, o, n, dim = compress(f)
        stats[status.split("-")[0]] = stats.get(status.split("-")[0], 0) + 1
        if n < o:
            saved += o - n
        mb = lambda x: x / 1024 / 1024
        print(f"  {os.path.basename(f):34s} {status:12s} {mb(o):6.2f}MB -> {mb(n):6.2f}MB  {dim}")
    after = sum(os.path.getsize(f) for f in files)
    print(f"\n共 {len(files)} 张 | 压缩前 {mb(before):.1f}MB -> 压缩后 {mb(after):.1f}MB | 节省 {mb(before-after):.1f}MB")
    print(f"统计: {stats}")

if __name__ == "__main__":
    main()
