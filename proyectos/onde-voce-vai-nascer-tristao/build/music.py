# Música de fundo original (determinista): marimba suave + pad + baixo + shaker, ~96 bpm.
import sys, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
SR = 44100; dur = float(sys.argv[2]); n = int(dur * SR); out = np.zeros(n)
rng = np.random.default_rng(7); bpm = 96; beat = 60 / bpm; eighth = beat / 2
A4 = 440; note = lambda m: A4 * 2 ** ((m - 69) / 12)
prog = [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]]  # C G Am F
bass = [36, 43, 45, 41]
def add(sig, t0):
    i = int(t0 * SR); 
    if i >= n: return
    e = min(n, i + len(sig)); out[i:e] += sig[: e - i]
def marimba(f, d=0.5, g=0.22):
    t = np.arange(int(d * SR)) / SR; return g * (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 30)) * np.exp(-t * 7)
def pad(fs, d, g=0.05):
    t = np.arange(int(d * SR)) / SR; s = sum(np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.003 * t) for f in fs)
    e = np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.6); return g * s * e
def bassn(f, d, g=0.16):
    t = np.arange(int(d * SR)) / SR; return g * np.sin(2 * np.pi * f * t) * np.exp(-t * 2.2) * np.minimum(1, t / 0.01)
bar = beat * 4; t = 0.0; k = 0
patt = [0, 2, 1, 3, 2, 1, 3, 2]
while t < dur:
    ch = prog[k % 4]
    add(pad([note(m - 12) for m in ch[:3]], bar), t)
    add(bassn(note(bass[k % 4]), bar * 0.9), t); add(bassn(note(bass[k % 4]), beat * 1.5, 0.1), t + beat * 2)
    for j in range(8):
        if (k + j) % 7 == 6: continue
        add(marimba(note(ch[patt[j]] + (12 if j in (3, 6) else 0))), t + j * eighth)
    for j in range(8):
        s = rng.standard_normal(int(0.05 * SR)) * np.exp(-np.arange(int(0.05 * SR)) / SR * 70) * (0.035 if j % 2 else 0.02); add(s, t + j * eighth)
    t += bar; k += 1
sos = butter(2, [60, 9000], "bandpass", fs=SR, output="sos"); out = sosfilt(sos, out)
fade = int(1.5 * SR); out[-fade:] *= np.linspace(1, 0, fade); out[:int(0.3 * SR)] *= np.linspace(0, 1, int(0.3 * SR))
out = out / np.abs(out).max() * 0.9
sf.write(sys.argv[1], out, SR)
