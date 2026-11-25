import sys, glob, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
fs = sorted(glob.glob(os.path.join(d, "s_*.png")), key=lambda f: float(os.path.basename(f)[2:-4]))
ims = [Image.open(f).convert("RGB") for f in fs]; w, h = 300, int(300 * 2560 / 1440)
rows = (len(ims) + cols - 1) // cols; S = Image.new("RGB", (cols * w, rows * h), "white"); D = ImageDraw.Draw(S)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = (i % cols) * w, (i // cols) * h; S.paste(im.resize((w, h)), (x, y)); D.rectangle([x, y, x + 70, y + 22], fill="black"); D.text((x + 4, y + 4), os.path.basename(f)[2:-4], fill="yellow")
S.save(out, quality=85)
