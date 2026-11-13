# Sintetiza los efectos de sonido (deterministas) y los mezcla con la voz.
# uso: python3 sfx.py sfx.json voz_cut.wav mix.wav
import sys, json, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

SR = 44100
rng = np.random.default_rng(1234)
t_ = lambda d: np.arange(int(d * SR)) / SR
def env(n, a=0.005, r=None, curve=4.0):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    if r is None: e[na:] = np.exp(-curve * np.linspace(0, 1, n - na))
    return e
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], "bandpass", fs=SR, output="sos"), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, "lowpass", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, "highpass", fs=SR, output="sos"), x)
def noise(d): return rng.standard_normal(int(d * SR))
def sweep_noise(d, f0, f1, q=0.35, shape=None):
    n = noise(d); out = np.zeros_like(n); B = 512
    for i in range(0, len(n), B):
        k = i / len(n); f = f0 * (f1 / f0) ** k
        out[i:i + B] = bp(n[max(0, i - 2048):i + B], max(40, f * (1 - q)), min(19000, f * (1 + q)))[-len(n[i:i + B]):]
    e = shape if shape is not None else np.sin(np.linspace(0, np.pi, len(n))) ** 1.5
    return out * e
def tone(d, f0, f1=None, kind="sin"):
    t = t_(d); f1 = f1 or f0; f = f0 * (f1 / f0) ** (t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) if kind == "sin" else np.sign(np.sin(ph)) * 0.6
def norm(x, g=1.0): return x / (np.abs(x).max() + 1e-9) * g

S = {}
S["tick"] = norm(bp(noise(0.03), 1800, 4200) * env(int(0.03 * SR), 0.0005, curve=18) + 0.6 * tone(0.03, 1100) * env(int(0.03 * SR), 0.0005, curve=25), 0.55)
S["whoosh"] = norm(sweep_noise(0.32, 500, 3500, 0.5), 0.55)
S["zoomin"] = norm(sweep_noise(0.45, 300, 5000, 0.45, np.linspace(0, 1, int(0.45 * SR)) ** 2 * np.exp(-np.linspace(0, 1, int(0.45 * SR)) * 0) * np.r_[np.ones(int(0.40 * SR)), np.linspace(1, 0, int(0.45 * SR) - int(0.40 * SR))]) + 0.4 * tone(0.45, 120, 520) * np.linspace(0, 1, int(0.45 * SR)) ** 2, 0.6)
S["zoomout"] = norm(sweep_noise(0.45, 4500, 300, 0.45, np.linspace(1, 0, int(0.45 * SR)) ** 1.5) + 0.35 * tone(0.45, 500, 110) * np.linspace(1, 0, int(0.45 * SR)), 0.55)
S["cloud"] = norm(lp(noise(0.7), 900) * np.sin(np.linspace(0, np.pi, int(0.7 * SR))) ** 2 + 0.5 * sweep_noise(0.7, 300, 1200, 0.6), 0.6)
n = int(0.12 * SR); S["pop"] = norm(tone(0.12, 380, 1100) * env(n, 0.002, curve=10), 0.5)
d = 1.1; tt = t_(d); S["ding"] = norm(sum(a * np.sin(2 * np.pi * f * tt) for f, a in [(1318, 1), (2637, 0.4), (3951, 0.2), (1975, 0.25)]) * np.exp(-tt * 4.5) * np.minimum(1, tt / 0.003), 0.38)
ch = np.zeros(int(1.6 * SR))
for i, f in enumerate([1046, 1318, 1568, 2093]):
    s0 = int(i * 0.09 * SR); seg = np.sin(2 * np.pi * f * t_(1.2)) * np.exp(-t_(1.2) * 4); ch[s0:s0 + len(seg)] += seg
S["chime"] = norm(ch, 0.32)
S["sparkle"] = S["chime"] * 0.9
n = int(0.28 * SR); S["thud"] = norm(tone(0.28, 140, 45) * env(n, 0.002, curve=7) + 0.4 * lp(noise(0.28), 400) * env(n, 0.001, curve=14), 0.8)
S["stamp"] = norm(S["thud"] + 0.5 * np.r_[bp(noise(0.08), 800, 3000) * env(int(0.08 * SR), 0.001, curve=12), np.zeros(len(S["thud"]) - int(0.08 * SR))], 0.75)
n = int(0.08 * SR); S["blip"] = norm(tone(0.08, 880, 1320) * env(n, 0.002, curve=8), 0.35)
n = int(0.5 * SR); tt = t_(0.5); S["boing"] = norm(np.sin(2 * np.pi * np.cumsum(220 + 160 * np.sin(2 * np.pi * 9 * tt) * np.exp(-tt * 5)) / SR) * env(n, 0.003, curve=5), 0.5)
d = 1.4; tt = t_(d); S["bell"] = norm((np.sin(2 * np.pi * 1450 * tt) + 0.6 * np.sin(2 * np.pi * 2310 * tt)) * (0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 16 * tt))) * np.minimum(1, (d - tt) / 0.3), 0.42)
S["swish"] = norm(sweep_noise(0.16, 2500, 6000, 0.4), 0.35)
S["flip"] = norm(bp(noise(0.07), 1500, 6000) * env(int(0.07 * SR), 0.002, curve=6), 0.4)
d = 1.8; tt = t_(d); S["rumble"] = norm(lp(noise(d), 120, 3) * (0.6 + 0.4 * np.sin(2 * np.pi * 3 * tt)) * np.minimum(1, tt / 0.1) * np.minimum(1, (d - tt) / 0.4) + 0.5 * tone(d, 45) * np.minimum(1, (d - tt) / 0.4), 0.9)
d = 1.2; tt = t_(d); S["alarm"] = norm(np.sign(np.sin(2 * np.pi * np.where((tt * 4).astype(int) % 2 == 0, 880, 660) * tt)) * 0.5 * np.minimum(1, (d - tt) / 0.2), 0.18)
d = 0.45; S["door"] = norm(lp(noise(d), 1500) * np.sin(np.linspace(0, np.pi, int(d * SR))) + np.r_[np.zeros(int(0.38 * SR)), S["thud"][: int(0.07 * SR)]] * 0.6, 0.45)
conf = np.zeros(int(0.7 * SR))
for i in range(10): s0 = int(rng.uniform(0, 0.55) * SR); p = S["pop"] * rng.uniform(0.3, 0.7); conf[s0:s0 + len(p)] += p[: len(conf) - s0]
S["confetti"] = norm(conf + 0.3 * hp(noise(0.7), 4000) * np.exp(-t_(0.7) * 4), 0.5)
d = 1.3; tt = t_(d); S["horn"] = norm((np.sin(2 * np.pi * 110 * tt) + 0.5 * np.sin(2 * np.pi * 165 * tt) + 0.3 * np.sin(2 * np.pi * 220 * tt)) * np.minimum(1, tt / 0.08) * np.minimum(1, (d - tt) / 0.25), 0.5)
S["plane"] = norm(sweep_noise(1.2, 400, 2400, 0.3) + 0.3 * tone(1.2, 180, 260) * np.sin(np.linspace(0, np.pi, int(1.2 * SR))), 0.5)
d = 0.45; S["buzzer"] = norm(lp(tone(d, 150, 140, "sq"), 1800) * np.minimum(1, (d - t_(d)) / 0.05), 0.45)
d = 0.9; tt = t_(d); S["shing"] = norm((np.sin(2 * np.pi * 3200 * tt) + 0.6 * np.sin(2 * np.pi * 4870 * tt) + 0.4 * np.sin(2 * np.pi * 6100 * tt)) * np.exp(-tt * 5) + 0.6 * sweep_noise(d, 2000, 9000, 0.3) * np.exp(-tt * 6), 0.45)
sc = np.zeros(int(1.2 * SR))
for i in range(14): s0 = int(i * 0.085 * SR); g = bp(noise(0.05), 2500, 7000) * env(int(0.05 * SR), 0.005, curve=3); sc[s0:s0 + len(g)] += g * rng.uniform(0.4, 1)
S["scribble"] = norm(sc, 0.3)
n = int(0.22 * SR); S["squish"] = norm(np.sin(2 * np.pi * np.cumsum(np.linspace(300, 90, n)) / SR) * env(n, 0.01, curve=5) + 0.3 * lp(noise(0.22), 800) * env(n, 0.01, curve=6), 0.45)
d = 1.1; tt = t_(d); S["snore"] = norm(lp(noise(d), 500) * np.sin(np.pi * tt / d) ** 2 * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * tt)), 0.45)
jg = np.zeros(int(1.6 * SR))
for i in range(12): s0 = int(i * 0.125 * SR); g = hp(noise(0.12), 5000) * env(int(0.12 * SR), 0.002, curve=9) + 0.3 * np.sin(2 * np.pi * 5200 * t_(0.12)) * env(int(0.12 * SR), 0.002, curve=12); jg[s0:s0 + len(g)] += g * (1 if i % 2 == 0 else 0.6)
S["jingle"] = norm(jg, 0.35)
cn = np.zeros(int(0.9 * SR))
for k in range(12): s0 = int(0.8 * (1 - (1 - k / 12) ** 2) * SR); b = S["blip"] * 0.7; cn[s0:s0 + len(b)] += b[: len(cn) - s0]
S["count"] = norm(cn, 0.3)
d = 1.5; tt = t_(d); clack = np.zeros(int(d * SR))
for k in range(6): s0 = int(k * 0.24 * SR); c = lp(noise(0.05), 900) * env(int(0.05 * SR), 0.001, curve=10); clack[s0:s0 + len(c)] += c
S["train"] = norm(lp(noise(d), 300) * 0.6 * np.minimum(1, tt / 0.2) * np.minimum(1, (d - tt) / 0.4) + clack, 0.6)


# --- sonidos extra (Cabo Verde)
d = 2.2; tt = t_(d); S["zoomslow"] = norm(sweep_noise(d, 200, 1400, 0.5, np.sin(np.linspace(0, np.pi, int(d * SR))) ** 2) + 0.3 * tone(d, 80, 140) * np.sin(np.linspace(0, np.pi, int(d * SR))) ** 2, 0.4)
d = 2.6; tt = t_(d); S["waves"] = norm(lp(noise(d), 700) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.6 * tt - 1.5)) ** 2 * np.minimum(1, tt / 0.3) * np.minimum(1, (d - tt) / 0.6), 0.5)
d = 0.9; tt = t_(d); S["water"] = norm(bp(noise(d), 600, 4000) * (0.6 + 0.4 * np.sin(2 * np.pi * 17 * tt)) * np.minimum(1, tt / 0.05) * np.minimum(1, (d - tt) / 0.3), 0.35)
d = 2.0; tt = t_(d); S["wind"] = norm(sweep_noise(d, 300, 700, 0.6, np.sin(np.linspace(0, np.pi, int(d * SR))) ** 1.5), 0.4)
d = 2.0; tt = t_(d); S["crowd"] = norm(bp(noise(d), 300, 2500) * (0.7 + 0.3 * np.sin(2 * np.pi * 3.3 * tt)) * np.minimum(1, tt / 0.25) * np.minimum(1, (d - tt) / 0.6), 0.55)
cr = np.zeros(int(3.0 * SR))
for i in range(90): s0 = int(rng.uniform(0, 2.95) * SR); cr[s0:s0 + 40] += rng.uniform(-1, 1, 40) * np.exp(-np.arange(40) / 8)
S["crackle"] = norm(hp(cr, 1500) + 0.15 * lp(noise(3.0), 300), 0.3)
d = 1.0; tt = t_(d); S["ring"] = norm((np.sin(2 * np.pi * 880 * tt) + np.sin(2 * np.pi * 1320 * tt)) * (np.sin(2 * np.pi * 20 * tt) > 0) * np.where((tt % 0.5) < 0.35, 1, 0), 0.25)

d = 1.0; tt = t_(d); S["riser"] = norm(sweep_noise(d, 300, 6000, 0.35, (tt / d) ** 2.2) + 0.4 * tone(d, 110, 440) * (tt / d) ** 2, 0.5)
n = int(1.2 * SR); tt = t_(1.2); S["hit"] = norm(tone(1.2, 70, 38) * np.exp(-tt * 3.2) + 0.5 * lp(noise(1.2), 600) * np.exp(-tt * 9) + 0.25 * bp(noise(1.2), 2000, 6000) * np.exp(-tt * 25), 0.85)

d = 0.5; tt = t_(d); S["beep"] = norm(np.r_[np.sign(np.sin(2 * np.pi * 520 * t_(0.18))) * 0.5, np.zeros(int(0.06 * SR)), np.sign(np.sin(2 * np.pi * 520 * t_(0.22))) * 0.5], 0.3)
hz = np.zeros(int(1.2 * SR))
for k in range(5): s0 = int(k * 0.2 * SR); c = lp(noise(0.06), 800) * np.exp(-t_(0.06) * 40); hz[s0:s0 + len(c)] += c
nh = np.r_[np.zeros(int(0.1 * SR)), tone(0.6, 700, 1100) * np.sin(2 * np.pi * 14 * t_(0.6)) * np.exp(-t_(0.6) * 2)]; hz[: len(nh)] += 0.4 * nh
S["horse"] = norm(hz, 0.5)
d = 1.2; tt = t_(d); S["boom"] = norm(tone(d, 90, 40) * np.exp(-tt * 4) + 0.6 * hp(noise(d), 2000) * np.exp(-tt * 3) * (rng.random(int(d * SR)) > 0.97), 0.6)

cues = json.load(open(sys.argv[1]))
voice, sr = sf.read(sys.argv[2], dtype="float64"); assert sr == SR
L = len(voice) + SR
fx = np.zeros(L)
VOL = 0.5
for t, kind, g in cues:
    x = S.get(kind)
    if x is None: print("sin sonido:", kind); continue
    s0 = int(t * SR)
    if s0 >= L: continue
    seg = x[: L - s0] * g * VOL; fx[s0:s0 + len(seg)] += seg
v = np.r_[voice, np.zeros(L - len(voice))]
# ducking suave de efectos bajo la voz
envv = np.convolve(np.abs(v), np.ones(2205) / 2205, "same"); duck = 1 - 0.35 * np.clip(envv / 0.08, 0, 1)
mix = v * 1.0 + fx * duck
mix = mix / max(1.0, np.abs(mix).max() / 0.97)
sf.write(sys.argv[3], np.stack([mix, mix], 1)[: len(voice) + int(0.2 * SR)], SR)
print("cues", len(cues), "len", round(len(mix) / SR, 2))
