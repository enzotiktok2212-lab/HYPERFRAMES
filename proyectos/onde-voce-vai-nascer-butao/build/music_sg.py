# Música de fundo (determinista): marimba suave + "guzheng" pentatônico (sabor do Sudeste Asiático) + pad + baixo.
import sys, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
SR = 44100; dur = float(sys.argv[2]); n = int(dur * SR); out = np.zeros(n)
rng = np.random.default_rng(11); bpm = 96; beat = 60 / bpm; eighth = beat / 2
note = lambda m: 440 * 2 ** ((m - 69) / 12)
prog = [[62, 66, 69], [59, 62, 66], [55, 59, 62], [57, 61, 64]]  # D Bm G A
bass = [38, 35, 43, 45]
PENT = [62, 64, 66, 69, 71, 74, 76, 78, 81]  # D maior pentatônica
def add(sig, t0):
    i = int(t0 * SR)
    if i >= n: return
    e = min(n, i + len(sig)); out[i:e] += sig[: e - i]
def marimba(f, d=0.45, g=0.16):
    t = np.arange(int(d * SR)) / SR; return g * (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 30)) * np.exp(-t * 8)
def zheng(f, d=1.2, g=0.13):
    t = np.arange(int(d * SR)) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t / 0.3)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    s = np.sin(ph) + 0.5 * np.sin(2 * ph) * np.exp(-t * 6) + 0.25 * np.sin(3 * ph) * np.exp(-t * 9) + 0.12 * np.sin(5 * ph) * np.exp(-t * 14)
    return g * s * np.exp(-t * 3.2) * np.minimum(1, t / 0.004)
def pad(fs, d, g=0.04):
    t = np.arange(int(d * SR)) / SR; s = sum(np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.003 * t) for f in fs)
    e = np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.6); return g * s * e
def bassn(f, d, g=0.14):
    t = np.arange(int(d * SR)) / SR; return g * np.sin(2 * np.pi * f * t) * np.exp(-t * 2.2) * np.minimum(1, t / 0.01)
bar = beat * 4; t = 0.0; k = 0
mel = [[4, 3, 2, -1, 3, 2, 0, -1], [2, 1, 0, -1, 1, 2, 3, -1], [5, 4, 3, 2, 3, -1, 2, -1], [1, 2, 3, 4, 5, -1, 4, -1]]
while t < dur:
    ch = prog[k % 4]
    add(pad([note(m - 12) for m in ch], bar), t)
    add(bassn(note(bass[k % 4]), bar * 0.9), t); add(bassn(note(bass[k % 4]), beat * 1.5, 0.08), t + beat * 2)
    for j in range(8):
        if (k + j) % 5 != 4: add(marimba(note(ch[j % 3] + (12 if j in (3, 6) else 0))), t + j * eighth)
    m = mel[k % 4]
    for j, d in enumerate(m):
        if d >= 0: add(zheng(note(PENT[d] + 12 * (k % 8 >= 4))), t + j * eighth)
    if k % 4 == 3:  # glissando de guzheng no fim da frase
        for i, d in enumerate(range(8, 0, -1)): add(zheng(note(PENT[d]), 0.6, 0.06), t + bar - 0.5 + i * 0.05)
    for j in range(8):
        s = rng.standard_normal(int(0.04 * SR)) * np.exp(-np.arange(int(0.04 * SR)) / SR * 80) * (0.03 if j % 2 else 0.015); add(s, t + j * eighth)
    t += bar; k += 1
sos = butter(2, [60, 9000], "bandpass", fs=SR, output="sos"); out = sosfilt(sos, out)
fade = int(1.5 * SR); out[-fade:] *= np.linspace(1, 0, fade); out[:int(0.3 * SR)] *= np.linspace(0, 1, int(0.3 * SR))
out = out / np.abs(out).max() * 0.9
sf.write(sys.argv[1], out, SR)
