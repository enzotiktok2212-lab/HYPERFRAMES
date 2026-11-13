# Recorta silencios del locutor (excepto las pausas del gancho) y genera timing.js
# uso: python3 cut_audio.py voz44.wav segs.json texts.json out.wav timing.js
import sys, json, numpy as np, soundfile as sf
src, segs_json, texts_json, out_wav, out_js = sys.argv[1:6]
TEXT = json.load(open(texts_json)); segs = json.load(open(segs_json))
assert len(segs) == len(TEXT), (len(segs), len(TEXT))
a, sr = sf.read(src, dtype="float32")
PAD, GAP, LEAD = 0.035, 0.10, 0.12
keep = {0: segs[1]["s"] - segs[0]["e"], 1: segs[2]["s"] - segs[1]["e"]}
out = [np.zeros(int(LEAD * sr), np.float32)]; t = LEAD; timing = []
for i, sg in enumerate(segs):
    s0 = max(0, sg["s"] - PAD); e0 = min(len(a) / sr, sg["e"] + PAD)
    ch = a[int(s0 * sr):int(e0 * sr)].copy(); f = int(0.008 * sr); ch[:f] *= np.linspace(0, 1, f); ch[-f:] *= np.linspace(1, 0, f)
    timing.append({"s": round(t + PAD, 3), "e": round(t + len(ch) / sr - PAD, 3), "text": TEXT[i]})
    out.append(ch); t += len(ch) / sr
    if i < len(segs) - 1:
        g = keep.get(i, GAP); out.append(np.zeros(int(g * sr), np.float32)); t += g
out.append(np.zeros(int(0.9 * sr), np.float32)); t += 0.9
y = np.concatenate(out); y = y / max(1e-6, np.abs(y).max()) * 0.89
sf.write(out_wav, y, sr)
open(out_js, "w").write("window.T=" + json.dumps(timing, ensure_ascii=False) + ";window.TOTAL=" + str(round(len(y) / sr, 3)) + ";")
print("total", round(len(y) / sr, 2))
