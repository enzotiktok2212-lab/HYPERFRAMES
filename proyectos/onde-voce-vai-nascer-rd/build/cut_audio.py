# Recorta silencios y ajusta las pausas para que el total sea exactamente TARGET segundos.
# Mantiene pausas fijas en el gancho (pregunta → país → ciudad).
# uso: python3 cut_audio.py voz.wav segs.json texts.json out.wav timing.js TARGET
import sys, json, numpy as np, soundfile as sf
src, segs_json, texts_json, out_wav, out_js, target = sys.argv[1:7]; target = float(target)
TEXT = json.load(open(texts_json)); segs = json.load(open(segs_json)); assert len(segs) == len(TEXT), (len(segs), len(TEXT))
a, sr = sf.read(src, dtype="float32"); PAD, LEAD, TAIL = 0.025, 0.1, 0.3
keep = {0: 0.5, 1: 0.42}
speech = sum(min(len(a) / sr, s["e"] + PAD) - max(0, s["s"] - PAD) for s in segs)
ngaps = len(segs) - 1 - len(keep)
GAP = (target - LEAD - TAIL - speech - sum(keep.values())) / ngaps
print("speech", round(speech, 2), "gap", round(GAP, 3))
assert GAP >= 0.04, "la voz es demasiado larga para el objetivo"
out = [np.zeros(int(LEAD * sr), np.float32)]; t = LEAD; timing = []
for i, sg in enumerate(segs):
    s0 = max(0, sg["s"] - PAD); e0 = min(len(a) / sr, sg["e"] + PAD)
    ch = a[int(s0 * sr):int(e0 * sr)].copy(); f = int(0.008 * sr); ch[:f] *= np.linspace(0, 1, f); ch[-f:] *= np.linspace(1, 0, f)
    timing.append({"s": round(t + PAD, 3), "e": round(t + len(ch) / sr - PAD, 3), "text": TEXT[i]}); out.append(ch); t += len(ch) / sr
    if i < len(segs) - 1: g = keep.get(i, GAP); out.append(np.zeros(int(g * sr), np.float32)); t += g
y = np.concatenate(out); y = np.r_[y, np.zeros(max(0, int(target * sr) - len(y)), np.float32)][: int(target * sr)]
y = y / max(1e-6, np.abs(y).max()) * 0.89; sf.write(out_wav, y, sr)
open(out_js, "w").write("window.T=" + json.dumps(timing, ensure_ascii=False) + ";window.TOTAL=" + str(round(len(y) / sr, 3)) + ";")
print("total", round(len(y) / sr, 3))
