# Segmenta la voz por silencios y transcribe cada segmento (whisper vía sherpa-onnx)
import sys, json, numpy as np, soundfile as sf, sherpa_onnx
from scipy.signal import resample_poly
src, out, mdir = sys.argv[1:4]; MINSIL = float(sys.argv[4]) if len(sys.argv) > 4 else 0.22
a, sr = sf.read(src, dtype="float32"); hop = int(0.01 * sr)
e = np.array([np.sqrt(np.mean(a[i:i + hop] ** 2)) for i in range(0, len(a) - hop, hop)])
db = 20 * np.log10(e + 1e-9); on = db > -38
segs = []; i = 0; n = len(on)
while i < n:
    if on[i]:
        j = i
        while j < n and (on[j] or (np.any(on[j:j + int(MINSIL * 100)]) )): j += 1
        segs.append([i / 100, j / 100]); i = j
    else: i += 1
segs = [s for s in segs if s[1] - s[0] > 0.12]
r = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=mdir + "/small-encoder.int8.onnx", decoder=mdir + "/small-decoder.int8.onnx", tokens=mdir + "/small-tokens.txt", language="pt", task="transcribe", num_threads=4)
a16 = resample_poly(a, 16000, sr).astype(np.float32); res = []
for s, e_ in segs:
    st = r.create_stream(); st.accept_waveform(16000, a16[int(max(0, s - 0.05) * 16000):int((e_ + 0.05) * 16000)]); r.decode_stream(st)
    res.append({"s": round(s, 3), "e": round(e_, 3), "t": st.result.text.strip()}); print(f"{len(res)-1:2d} {s:7.2f}-{e_:7.2f} {st.result.text.strip()}")
json.dump(res, open(out, "w"), ensure_ascii=False, indent=0)
