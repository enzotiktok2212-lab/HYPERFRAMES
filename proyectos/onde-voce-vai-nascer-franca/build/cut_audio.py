# Recorta silencios (entre frases y pausas internas largas) y ajusta las pausas para que el total sea exactamente TARGET.
# Mantiene pausas fijas en el gancho (pregunta → país → ciudad). La voz NUNCA se acelera.
# uso: python3 cut_audio.py voz.wav segs.json texts.json out.wav timing.js TARGET
import sys, json, numpy as np, soundfile as sf
src, segs_json, texts_json, out_wav, out_js, target = sys.argv[1:7]; target = float(target)
TEXT = json.load(open(texts_json)); segs = json.load(open(segs_json)); assert len(segs) == len(TEXT), (len(segs), len(TEXT))
a, sr = sf.read(src, dtype="float32"); PAD, LEAD, TAIL = 0.025, 0.1, 0.3
keep = {0: 0.2, 1: 0.55, 3: 0.3, 13: 0.25, 22: 0.25, 52: 0.25}
hop = int(0.01 * sr)
def squeeze(ch):  # pausas internas > 0.12 s -> 0.08 s
    db = np.array([20 * np.log10(np.sqrt(np.mean(ch[i:i + hop] ** 2)) + 1e-9) for i in range(0, len(ch) - hop, hop)])
    off = db < -40; parts = []; i = 0; last = 0
    while i < len(off):
        if off[i]:
            j = i
            while j < len(off) and off[j]: j += 1
            if j - i >= 16 and i > 3 and j < len(off) - 3:
                a0 = (i + 6) * hop; a1 = (j - 6) * hop
                parts.append(ch[last:a0]); last = a1
            i = j
        else: i += 1
    parts.append(ch[last:]); out = parts[0]
    for p in parts[1:]:
        f = int(0.004 * sr); out = np.r_[out[:-f], out[-f:] * np.linspace(1, 0, f) + p[:f] * np.linspace(0, 1, f), p[f:]]
    return out
chunks = []
for i, sg in enumerate(segs):
    s0 = max(0, sg["s"] - PAD); e0 = min(len(a) / sr, sg["e"] + PAD)
    ch = a[int(s0 * sr):int(e0 * sr)].copy()
    if i > 1: ch = squeeze(ch)
    f = int(0.008 * sr); ch[:f] *= np.linspace(0, 1, f); ch[-f:] *= np.linspace(1, 0, f); chunks.append(ch)
speech = sum(len(c) for c in chunks) / sr
ngaps = len(segs) - 1 - len(keep)
GAP = (target - LEAD - TAIL - speech - sum(keep.values())) / ngaps
print("speech", round(speech, 2), "gap", round(GAP, 3))
assert GAP >= 0.04, "la voz es demasiado larga para el objetivo"
out = [np.zeros(int(LEAD * sr), np.float32)]; t = LEAD; timing = []
for i, ch in enumerate(chunks):
    timing.append({"s": round(t + PAD, 3), "e": round(t + len(ch) / sr - PAD, 3), "text": TEXT[i]}); out.append(ch); t += len(ch) / sr
    if i < len(chunks) - 1: g = keep.get(i, GAP); out.append(np.zeros(int(g * sr), np.float32)); t += g
y = np.concatenate(out); y = np.r_[y, np.zeros(max(0, int(target * sr) - len(y)), np.float32)][: int(target * sr)]
y = y / max(1e-6, np.abs(y).max()) * 0.89; sf.write(out_wav, y, sr)
open(out_js, "w").write("window.T=" + json.dumps(timing, ensure_ascii=False) + ";window.TOTAL=" + str(round(len(y) / sr, 3)) + ";")
print("total", round(len(y) / sr, 3))
