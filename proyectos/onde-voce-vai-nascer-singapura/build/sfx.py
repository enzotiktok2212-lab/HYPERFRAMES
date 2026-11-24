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

# --- variantes: cada tipo de transición/zoom tiene versiones distintas que rotan
def env_rise(n, p=2.0): return np.linspace(0, 1, n) ** p
def env_fall(n, p=1.5): return np.linspace(1, 0, n) ** p
def bell_env(n): return np.sin(np.linspace(0, np.pi, n)) ** 2
V = {}
def mk_zin(i):
    d = [0.42, 0.3, 0.55, 0.25, 0.5, 0.36][i]; n = int(d * SR)
    if i == 0: return S["zoomin"]
    if i == 1: return norm(sweep_noise(d, 800, 9000, 0.25, env_rise(n, 3)) + 0.3 * hp(noise(d), 6000) * env_rise(n, 4), 0.55)
    if i == 2: return norm(tone(d, 180, 1400) * env_rise(n, 2.5) * 0.7 + 0.4 * sweep_noise(d, 400, 3000, 0.4, env_rise(n, 2)), 0.5)
    if i == 3: x = sweep_noise(d, 1500, 6000, 0.3, env_rise(n, 1.5)); x[-int(0.02 * SR):] += bp(noise(0.02), 2000, 7000) * 3; return norm(x, 0.55)
    if i == 4: return norm(lp(noise(d), 1200) * env_rise(n, 2.2) * (0.7 + 0.3 * np.sin(2 * np.pi * 30 * t_(d))) + 0.5 * tone(d, 60, 160) * env_rise(n, 2), 0.6)
    return norm(sweep_noise(d, 300, 2200, 0.6, env_rise(n, 1.8)) + 0.25 * np.sin(2 * np.pi * np.cumsum(np.linspace(500, 2600, n)) / SR) * env_rise(n, 3), 0.5)
def mk_zout(i):
    d = [0.45, 0.32, 0.6, 0.28, 0.5][i]; n = int(d * SR)
    if i == 0: return S["zoomout"]
    if i == 1: return norm(sweep_noise(d, 7000, 600, 0.3, env_fall(n, 2)), 0.5)
    if i == 2: return norm(tone(d, 1200, 150) * env_fall(n, 1.4) * 0.6 + 0.4 * lp(noise(d), 900) * env_fall(n), 0.5)
    if i == 3: x = bp(noise(0.03), 2000, 6000) * 2; return norm(np.r_[x, sweep_noise(d, 3000, 400, 0.4, env_fall(n, 2.5))], 0.5)
    return norm(lp(noise(d), 600) * env_fall(n, 1.2) * (0.6 + 0.4 * np.sin(2 * np.pi * 18 * t_(d))) + 0.4 * tone(d, 220, 70) * env_fall(n), 0.55)
def mk_wh(i):
    d = [0.32, 0.22, 0.4, 0.28, 0.5, 0.18][i]; n = int(d * SR)
    if i == 0: return S["whoosh"]
    if i == 1: return norm(sweep_noise(d, 2500, 8000, 0.3, bell_env(n)), 0.5)
    if i == 2: return norm(sweep_noise(d, 250, 1200, 0.5, bell_env(n)) + 0.3 * tone(d, 300, 180) * bell_env(n), 0.55)
    if i == 3: return norm(sweep_noise(d, 4000, 900, 0.35, bell_env(n)), 0.5)
    if i == 4: return norm(bp(noise(d), 500, 3000) * bell_env(n) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t_(d))), 0.5)
    return norm(hp(noise(d), 3000) * np.exp(-t_(d) * 14), 0.45)
def mk_slow(i):
    d = [2.2, 1.6, 2.0, 1.4][i]; n = int(d * SR)
    if i == 0: return S["zoomslow"]
    if i == 1: return norm(tone(d, 110, 220) * bell_env(n) * 0.6 + 0.3 * tone(d, 165, 330) * bell_env(n), 0.32)
    if i == 2: return norm(sweep_noise(d, 1500, 4000, 0.4, bell_env(n)) * 0.6, 0.3)
    return norm(lp(noise(d), 300) * bell_env(n) + 0.4 * tone(d, 55, 80) * bell_env(n), 0.35)
for k, f, nv in [("zoomin", mk_zin, 6), ("zoomout", mk_zout, 5), ("whoosh", mk_wh, 6), ("zoomslow", mk_slow, 4)]:
    V[k] = [f(i) for i in range(nv)]
for k, base in [("pop", S["pop"]), ("blip", S["blip"]), ("thud", S["thud"]), ("hit", S["hit"])]:
    V[k] = [base, norm(np.interp(np.arange(0, len(base), 1.18), np.arange(len(base)), base), np.abs(base).max()), norm(np.interp(np.arange(0, len(base), 0.85), np.arange(len(base)), base), np.abs(base).max())]

uk = np.zeros(int(1.6 * SR))
for k, f in enumerate([392, 523, 659, 784, 659, 523, 659, 784]):
    s0 = int(k * 0.18 * SR); tt2 = t_(0.6); n = (np.sin(2 * np.pi * f * tt2) + 0.5 * np.sin(2 * np.pi * 2 * f * tt2) + 0.25 * np.sin(2 * np.pi * 3 * f * tt2)) * np.exp(-tt2 * 7); uk[s0:s0 + len(n)] += n[: len(uk) - s0]
S["ukulele"] = norm(uk, 0.4)
co = np.zeros(int(1.0 * SR))
for k in range(8): s0 = int(k * 0.1 * SR); tt2 = t_(0.25); n = (np.sin(2 * np.pi * (2400 + k * 150) * tt2) + np.sin(2 * np.pi * (3700 + k * 90) * tt2)) * np.exp(-tt2 * 18); co[s0:s0 + len(n)] += n[: len(co) - s0]
S["coins"] = norm(co, 0.3)


# ================= República Dominicana: sons extra =================
def ks(f, d, damp=0.996, g=1.0):  # Karplus-Strong (corda dedilhada)
    n = int(d * SR); N = max(2, int(SR / f)); buf = rng.uniform(-1, 1, N); out = np.zeros(n)
    for i in range(n): out[i] = buf[i % N]; buf[i % N] = damp * 0.5 * (buf[i % N] + buf[(i + 1) % N])
    return out * g
def kick(d=0.32, f0=150, f1=42): n = int(d * SR); return tone(d, f0, f1) * env(n, 0.001, curve=7)
def snare(d=0.18): n = int(d * SR); return 0.7 * bp(noise(d), 1500, 7000) * env(n, 0.001, curve=12) + 0.4 * tone(d, 220, 180) * env(n, 0.001, curve=18)
def hat(d=0.05, g=0.35): n = int(d * SR); return g * hp(noise(d), 7000) * env(n, 0.001, curve=14)
def place(buf, x, t):
    i = int(t * SR)
    if i >= len(buf): return
    e = min(len(buf), i + len(x)); buf[i:e] += x[: e - i]
def note(m): return 440 * 2 ** ((m - 69) / 12)
def fadeio(x, a=0.03, r=0.35): n = len(x); x = x.copy(); x[: int(a * SR)] *= np.linspace(0, 1, int(a * SR)); x[-int(r * SR):] *= np.linspace(1, 0, int(r * SR)); return x
# dembow (112 bpm)
D = 3.2; buf = np.zeros(int(D * SR)); b = 60 / 112; s16 = b / 4
for k in range(int(D / b) + 1):
    t = k * b; place(buf, kick() * 0.9, t)
    if k % 2 == 0: place(buf, snare() * 0.8, t + 3 * s16)
    else: place(buf, snare() * 0.8, t + 2 * s16)
    for j in range(4): place(buf, hat(g=0.25 if j % 2 else 0.4), t + j * s16)
    bl = [36, 36, 39, 34][(k // 2) % 4]; place(buf, 0.5 * lp(np.sign(np.sin(2 * np.pi * note(bl) * t_(b * 0.9))) * env(int(b * 0.9 * SR), 0.005, curve=3), 300), t)
S["m_dembow"] = norm(fadeio(buf), 0.9)
# reggaeton (94 bpm)
D = 2.8; buf = np.zeros(int(D * SR)); b = 60 / 94; s16 = b / 4
for k in range(int(D / b) + 1):
    t = k * b; place(buf, kick(0.4, 120, 38), t); place(buf, snare() * 0.7, t + 3 * s16); place(buf, snare() * 0.7, t + 6 * s16 if k % 2 else t + 2 * s16)
    for j in range(4): place(buf, hat(g=0.3), t + j * s16)
    ch = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]][k % 4]; place(buf, 0.18 * sum(np.sin(2 * np.pi * note(m) * t_(b)) for m in ch) * np.exp(-t_(b) * 2), t)
S["m_reggaeton"] = norm(fadeio(buf), 0.9)
# merengue suave (140 bpm): marimba + tambora leve + güira discreta
D = 2.8; buf = np.zeros(int(D * SR)); b = 60 / 140; s16 = b / 4
mel = [76, 79, 81, 79, 76, 74, 72, 74, 76, 79, 83, 81, 79, 76, 74, 72]
def mar(f, d=0.35): tt = t_(d); return (np.sin(2 * np.pi * f * tt) + 0.2 * np.sin(2 * np.pi * 4 * f * tt) * np.exp(-tt * 40)) * np.exp(-tt * 9) * np.minimum(1, tt / 0.003)
for k in range(int(D / b) + 1):
    t = k * b; place(buf, 0.35 * tone(0.14, 150, 100) * env(int(0.14 * SR), 0.002, curve=9), t)
    for j in range(4): place(buf, 0.06 * bp(noise(0.04), 3000, 6000) * env(int(0.04 * SR), 0.005, curve=6), t + j * s16)
    for j in range(2): place(buf, 0.5 * mar(note(mel[(k * 2 + j) % 16])), t + j * b / 2)
    ch = [[60, 64, 67], [55, 59, 62]][(k // 4) % 2]; place(buf, 0.12 * sum(np.sin(2 * np.pi * note(m) * t_(b)) for m in ch) * np.sin(np.linspace(0, np.pi, int(b * SR))), t)
S["m_merengue"] = norm(fadeio(lp(buf, 4000)), 0.75)
# bachata suave (124 bpm): violão dedilhado + bongô macio
D = 2.8; buf = np.zeros(int(D * SR)); b = 60 / 124; s16 = b / 4
arp = [64, 67, 71, 76, 74, 71, 67, 71, 62, 66, 69, 74, 72, 69, 66, 69]
for k in range(int(D / s16 * 0.5) + 1):
    t = k * 2 * s16; place(buf, 0.5 * ks(note(arp[k % 16]), 0.7, 0.997), t)
for k in range(int(D / b) + 1):
    t = k * b; place(buf, 0.25 * tone(0.1, 380 if k % 2 else 300, 260) * env(int(0.1 * SR), 0.002, curve=12), t + s16 * 2)
    place(buf, 0.35 * kick(0.25, 100, 50), t if k % 2 == 0 else t + 3 * s16)
S["m_bachata"] = norm(fadeio(lp(buf, 3500)), 0.75)
S["m_dembow"] = norm(lp(S["m_dembow"], 5000), 0.8); S["m_reggaeton"] = norm(lp(S["m_reggaeton"], 5000), 0.8)
# transições: cada tipo com assinatura própria
S["tr_whip"] = norm(sweep_noise(0.26, 900, 8000, 0.3, np.sin(np.linspace(0, np.pi, int(0.26 * SR))) ** 2) + 0.3 * hp(noise(0.26), 6000) * env(int(0.26 * SR), 0.2, curve=2), 0.6)
S["tr_slide"] = norm(sweep_noise(0.34, 3500, 500, 0.4, np.sin(np.linspace(0, np.pi, int(0.34 * SR))) ** 1.5), 0.55)
S["tr_up"] = norm(sweep_noise(0.36, 300, 3000, 0.5, np.linspace(0, 1, int(0.36 * SR)) ** 1.5) + 0.35 * tone(0.36, 200, 900) * np.linspace(0, 1, int(0.36 * SR)), 0.55)
S["tr_flash"] = norm(np.r_[hp(noise(0.02), 3000) * 2, np.zeros(int(0.01 * SR)), sweep_noise(0.3, 6000, 1500, 0.3, np.exp(-np.linspace(0, 6, int(0.3 * SR))))], 0.6)
S["tr_push"] = norm(lp(noise(0.42), 900) * np.linspace(0, 1, int(0.42 * SR)) ** 2.5 + 0.5 * tone(0.42, 60, 200) * np.linspace(0, 1, int(0.42 * SR)) ** 2, 0.6)
S["tr_pull"] = norm(tone(0.4, 900, 160) * np.exp(-np.linspace(0, 4, int(0.4 * SR))) * 0.6 + 0.4 * sweep_noise(0.4, 4000, 400, 0.4, np.exp(-np.linspace(0, 3, int(0.4 * SR)))), 0.55)
d = 0.42; tt = t_(d); S["tr_iris"] = norm(np.sin(2 * np.pi * np.cumsum(np.linspace(400, 1600, len(tt))) / SR) * np.sin(np.linspace(0, np.pi, len(tt))) * 0.5 + 0.4 * sweep_noise(d, 1200, 5000, 0.3), 0.45)
d = 0.4; tt = t_(d); S["tr_spin"] = norm(bp(noise(d), 600, 4000) * (0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(np.linspace(30, 8, len(tt))) / SR)) * np.sin(np.linspace(0, np.pi, len(tt))), 0.55)
V["cut"] = [norm(hp(noise(0.06), 2000) * env(int(0.06 * SR), 0.001, curve=10) + 0.4 * tone(0.06, 300, 160) * env(int(0.06 * SR), 0.001, curve=12), 0.45), norm(sweep_noise(0.14, 2000, 7000, 0.3), 0.4), norm(tone(0.09, 600, 300) * env(int(0.09 * SR), 0.002, curve=9), 0.35), norm(bp(noise(0.1), 300, 1500) * env(int(0.1 * SR), 0.002, curve=8), 0.45)]
# glossário: duas notas brilhantes + papel
gl = np.zeros(int(0.7 * SR)); place(gl, np.sin(2 * np.pi * 988 * t_(0.5)) * np.exp(-t_(0.5) * 7), 0); place(gl, np.sin(2 * np.pi * 1480 * t_(0.5)) * np.exp(-t_(0.5) * 6), 0.09); place(gl, 0.5 * bp(noise(0.08), 2000, 8000) * env(int(0.08 * SR), 0.002, curve=5), 0)
V["gloss"] = [norm(gl, 0.42), norm(np.interp(np.arange(0, len(gl), 1.12), np.arange(len(gl)), gl), 0.42), norm(np.interp(np.arange(0, len(gl), 0.9), np.arange(len(gl)), gl), 0.42)]
# impacto dramático (variantes)
im = tone(1.6, 60, 30) * np.exp(-t_(1.6) * 2.5) + 0.6 * lp(noise(1.6), 500) * np.exp(-t_(1.6) * 6) + 0.3 * bp(noise(1.6), 1500, 6000) * np.exp(-t_(1.6) * 10)
V["impact"] = [norm(im, 0.9), norm(im + 0.3 * tone(1.6, 110, 55) * np.exp(-t_(1.6) * 3), 0.9), norm(np.interp(np.arange(0, len(im), 0.85), np.arange(len(im)), im), 0.9)]
S["flag"] = norm(bp(noise(0.5), 300, 2500) * (0.5 + 0.5 * np.sin(2 * np.pi * 14 * t_(0.5))) * np.sin(np.linspace(0, np.pi, int(0.5 * SR))), 0.45)
d = 2.4; tt = t_(d); S["car"] = norm(lp(tone(d, 70, 90, "sq"), 600) * np.sin(np.linspace(0, np.pi, len(tt))) + 0.3 * lp(noise(d), 400) * np.sin(np.linspace(0, np.pi, len(tt))), 0.5)
d = 1.8; tt = t_(d); S["moto"] = norm(lp(np.sign(np.sin(2 * np.pi * np.cumsum(90 + 60 * np.sin(np.linspace(0, np.pi, len(tt)))) / SR)), 1500) * np.sin(np.linspace(0, np.pi, len(tt))) ** 0.7, 0.4)
stp = np.zeros(int(0.9 * SR))
for k in range(4): place(stp, lp(noise(0.05), 700) * env(int(0.05 * SR), 0.001, curve=10), k * 0.2)
S["steps"] = norm(stp, 0.4)
n = int(0.25 * SR); S["plop"] = norm(np.sin(2 * np.pi * np.cumsum(np.linspace(500, 150, n)) / SR) * env(n, 0.002, curve=8) + 0.3 * lp(noise(0.25), 1200) * env(n, 0.002, curve=10), 0.5)
d = 0.5; S["plate"] = norm(sum(np.sin(2 * np.pi * f * t_(d)) * a for f, a in [(2100, 1), (3300, 0.6), (5200, 0.3)]) * np.exp(-t_(d) * 9), 0.3)
d = 0.6; tt = t_(d); S["burp"] = norm(lp(tone(d, 110, 80, "sq") * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * tt)), 900) * np.sin(np.linspace(0, np.pi, len(tt))), 0.45)
d = 1.0; tt = t_(d); S["rooster"] = norm(np.r_[np.sin(2 * np.pi * np.cumsum(np.interp(np.linspace(0, 1, int(0.9 * SR)), [0, 0.15, 0.3, 0.7, 1], [600, 900, 1100, 1050, 700])) / SR) * (1 + 0.5 * np.sin(2 * np.pi * 2 * np.cumsum(np.full(int(0.9 * SR), 1100)) / SR)) * np.r_[np.linspace(0, 1, int(0.05 * SR)), np.ones(int(0.75 * SR)), np.linspace(1, 0, int(0.1 * SR))]], 0.4)
sp = np.zeros(int(0.5 * SR))
for k in range(9): place(sp, hp(noise(0.02), 3000) * rng.uniform(0.4, 1), rng.uniform(0, 0.4))
S["spark"] = norm(sp, 0.45)
d = 0.9; S["powerdown"] = norm(tone(d, 700, 60) * np.exp(-t_(d) * 2.5) * 0.6 + 0.4 * lp(tone(d, 120, 40, "sq"), 500) * np.exp(-t_(d) * 3), 0.6)
dm = lambda f: norm(bp(noise(0.06), f, f * 3) * env(int(0.06 * SR), 0.0005, curve=16) + 0.5 * np.sin(2 * np.pi * f * 1.6 * t_(0.06)) * env(int(0.06 * SR), 0.0005, curve=20) + 0.6 * lp(noise(0.06), 300) * env(int(0.06 * SR), 0.0005, curve=12), 0.6)
V["domino"] = [dm(900), dm(1100), dm(780)]
d = 0.5; S["bat"] = norm(np.sin(2 * np.pi * 1200 * t_(d)) * np.exp(-t_(d) * 14) + 0.8 * bp(noise(d), 1000, 5000) * np.exp(-t_(d) * 30) + 0.4 * tone(d, 200, 120) * np.exp(-t_(d) * 10), 0.7)
d = 1.0; tt = t_(d); S["clipper"] = norm(bp(noise(d), 300, 3000) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 120 * tt))) * np.minimum(1, (d - tt) / 0.2), 0.28)
cr = np.zeros(int(1.6 * SR))
for k in range(6): place(cr, np.sin(2 * np.pi * 4300 * t_(0.12)) * (np.sin(2 * np.pi * 40 * t_(0.12)) > 0) * 0.6, 0.25 * k)
S["cricket"] = norm(cr, 0.25)
d = 0.8; tt = t_(d); S["creak"] = norm(bp(np.sign(np.sin(2 * np.pi * np.cumsum(np.full(len(tt), 35)) / SR)) * noise(d), 500, 2500) * np.sin(np.linspace(0, np.pi, len(tt))), 0.3)
S["boom"] = norm(S["boom"] + 0.6 * im[: len(S["boom"])], 0.8)

# ================= Iacútia: sons extra =================
for a, b in [("flash", "tr_flash"), ("push", "tr_push"), ("slideL", "tr_slide"), ("whip", "tr_whip"), ("iris", "tr_iris"), ("slideUp", "tr_up"), ("pullback", "tr_pull"), ("spin", "tr_spin"), ("fade", "whoosh")]:
    S[a] = S[b]
d = 0.9; tt = t_(d); S["whisper"] = norm(bp(noise(d), 2500, 7000) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 5 * tt))) * np.sin(np.pi * tt / d), 0.25)
hz2 = np.zeros(int(1.0 * SR))
for k, f in enumerate([880, 1175, 1480, 1760]): place(hz2, np.sin(2 * np.pi * f * t_(0.4)) * np.exp(-t_(0.4) * 8), k * 0.11)
S["hearts"] = norm(hz2, 0.35)
cam = np.r_[hp(noise(0.03), 2500) * env(int(0.03 * SR), 0.001, curve=10), np.zeros(int(0.05 * SR)), bp(noise(0.06), 1500, 6000) * env(int(0.06 * SR), 0.001, curve=8)]
S["camera"] = norm(cam, 0.45)
dr = np.zeros(int(1.3 * SR))
for k in range(26): place(dr, snare(0.08) * (0.4 + 0.6 * k / 26), k * 0.045)
place(dr, kick(0.4, 110, 40), 1.18); S["drumroll"] = norm(dr, 0.6)
d = 0.5; S["crack"] = norm(np.r_[hp(noise(0.015), 3000) * 3, bp(noise(d), 1500, 7000) * np.exp(-t_(d) * 9)], 0.6)
d = 0.8; tt = t_(d); S["freeze"] = norm(sum(np.sin(2 * np.pi * f * tt) * a for f, a in [(2637, 1), (3520, 0.6), (4699, 0.4)]) * np.exp(-tt * 5) * (0.6 + 0.4 * (rng.random(len(tt)) > 0.5)) + 0.3 * sweep_noise(d, 3000, 9000, 0.3, np.exp(-tt * 4)), 0.32)
d = 2.4; tt = t_(d); S["engine"] = norm(lp(tone(d, 38, 40, "sq") * (0.7 + 0.3 * np.sin(2 * np.pi * 9 * tt)), 300) * np.minimum(1, tt / 0.2) * np.minimum(1, (d - tt) / 0.4), 0.45)
d = 0.12; S["click"] = norm(bp(noise(d), 1500, 5000) * env(int(d * SR), 0.0005, curve=20) + 0.4 * np.sin(2 * np.pi * 2200 * t_(d)) * env(int(d * SR), 0.0005, curve=30), 0.45)
cr = np.zeros(int(1.0 * SR))
for k in range(5): place(cr, lp(tone(0.14, 70, 55, "sq"), 600) * env(int(0.14 * SR), 0.005, curve=5), k * 0.18)
S["crank"] = norm(cr, 0.5)
d = 0.35; S["dig"] = norm(lp(noise(d), 1200) * env(int(d * SR), 0.002, curve=6) + 0.3 * bp(noise(d), 2000, 5000) * env(int(d * SR), 0.002, curve=12), 0.45)
d = 0.12; S["chop"] = norm(bp(noise(d), 2500, 8000) * env(int(d * SR), 0.001, curve=14) + 0.3 * tone(d, 900, 500) * env(int(d * SR), 0.001, curve=18), 0.35)
d = 0.7; tt = t_(d); S["slurp"] = norm(bp(noise(d), 600, 2500) * (0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(np.linspace(8, 25, len(tt))) / SR)) * np.sin(np.pi * tt / d), 0.35)
d = 0.4; S["drip"] = norm(np.sin(2 * np.pi * np.cumsum(np.linspace(900, 2000, int(d * SR))) / SR) * np.exp(-t_(d) * 14), 0.4)
d = 2.6; tt = t_(d); S["truck"] = norm(lp(tone(d, 55, 60, "sq"), 400) * np.sin(np.linspace(0, np.pi, len(tt))) + 0.3 * lp(noise(d), 300) * np.sin(np.linspace(0, np.pi, len(tt))), 0.45)
tb = np.zeros(int(2.0 * SR))
for k, (f0, dd) in enumerate([(392, 0.3), (370, 0.3), (349, 0.3), (330, 0.9)]):
    t2 = t_(dd); x = lp(np.sign(np.sin(2 * np.pi * f0 * (1 + (0.02 * np.sin(2 * np.pi * 6 * t2) if k == 3 else 0)) * t2)), 1800) * np.minimum(1, t2 / 0.02) * np.minimum(1, (dd - t2) / 0.08); place(tb, x, k * 0.32)
S["sadtrombone"] = norm(tb, 0.4)
bd = np.zeros(int(2.0 * SR))
for k in range(7): place(bd, np.sin(2 * np.pi * np.cumsum(3000 + 900 * np.sin(2 * np.pi * 18 * t_(0.12))) / SR) * np.sin(np.pi * t_(0.12) / 0.12), 0.1 + k * 0.25 + (k % 2) * 0.05)
S["birds"] = norm(bd, 0.25)
d = 2.0; tt = t_(d); S["buzz"] = norm(bp(tone(d, 520, 560, "sq") * (0.6 + 0.4 * np.sin(2 * np.pi * 3 * tt)), 400, 3000) * np.minimum(1, tt / 0.15) * np.minimum(1, (d - tt) / 0.3), 0.22)
d = 0.15; S["slap"] = norm(bp(noise(d), 800, 4000) * env(int(d * SR), 0.0005, curve=16) + 0.5 * lp(noise(d), 500) * env(int(d * SR), 0.0005, curve=20), 0.55)
d = 0.8; tt = t_(d); S["sizzle"] = norm(hp(noise(d), 4000) * (0.6 + 0.4 * (rng.random(len(tt)) > 0.7)) * np.sin(np.pi * tt / d), 0.22)
# khomus (berimbau de boca sakha): zumbido com formante que se move + tambor leve, SUAVE
D = 3.4; tt = t_(D); f0 = 98
car = np.sign(np.sin(2 * np.pi * f0 * tt)) * 0.5 + np.sin(2 * np.pi * f0 * tt)
form = np.zeros_like(tt); B = 1024
for i in range(0, len(tt), B):
    fc = 700 + 600 * np.sin(2 * np.pi * 2.2 * tt[i]) ** 2 + 400 * np.sin(2 * np.pi * 0.5 * tt[i])
    form[i:i + B] = bp(car[max(0, i - 4096):i + B], fc * 0.8, fc * 1.25)[-len(car[i:i + B]):]
kh = form * (0.75 + 0.25 * np.sin(2 * np.pi * 4.4 * tt))
buf = np.zeros(len(tt))
for k in range(int(D / 0.5)): place(buf, 0.35 * tone(0.18, 120, 70) * env(int(0.18 * SR), 0.002, curve=7), k * 0.5)
S["m_khomus"] = norm(fadeio(lp(kh * 0.8 + buf, 3500), 0.2, 0.6), 0.6)
# festa: pop eletrônico suave (sintetizado), baixo
D = 3.4; buf = np.zeros(int(D * SR)); b = 60 / 118
for k in range(int(D / b) + 1):
    t = k * b; place(buf, 0.7 * kick(0.3, 120, 45), t); place(buf, hat(g=0.18), t + b / 2)
    ch = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]][(k // 2) % 4]
    place(buf, 0.12 * sum(np.sin(2 * np.pi * note(m) * t_(b)) + 0.3 * np.sin(2 * np.pi * 2 * note(m) * t_(b)) for m in ch) * np.exp(-t_(b) * 1.5), t)
S["m_party"] = norm(fadeio(lp(buf, 4000), 0.1, 0.6), 0.55)

# ================= Antártida: sons extra =================
d = 0.9; tt = t_(d)
pg = np.zeros(int(d * SR))
for k in range(3):
    seg = t_(0.22); f = 520 + 140 * np.sin(2 * np.pi * 7 * seg) - 120 * seg / 0.22
    place(pg, lp(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.sin(np.pi * seg / 0.22), 2200) * (1 - k * 0.2), k * 0.27)
S["penguin"] = norm(pg, 0.4)
sb = np.zeros(int(0.9 * SR))
for k in range(3): seg = t_(0.18); place(sb, lp(tone(0.18, 260, 180, "sq"), 1200) * np.sin(np.pi * seg / 0.18), k * 0.26)
S["sealbark"] = norm(sb, 0.4)
bk = np.zeros(int(0.7 * SR))
for k in range(2): seg = t_(0.14); place(bk, bp(tone(0.14, 600, 380, "sq"), 300, 2500) * np.sin(np.pi * seg / 0.14) + 0.4 * bp(noise(0.14), 800, 3000) * np.sin(np.pi * seg / 0.14), k * 0.3)
S["bark"] = norm(bk, 0.4)
d = 0.5; S["paper"] = norm(bp(noise(d), 1500, 7000) * (0.4 + 0.6 * (rng.random(int(d * SR)) > 0.6)) * np.sin(np.linspace(0, np.pi, int(d * SR))), 0.35)
bg_ = np.zeros(int(1.4 * SR))
for k, (f, dd) in enumerate([(392, 0.18), (523, 0.18), (659, 0.18), (784, 0.6)]):
    seg = t_(dd); place(bg_, (np.sin(2 * np.pi * f * seg) + 0.5 * np.sin(2 * np.pi * 2 * f * seg) + 0.3 * np.sin(2 * np.pi * 3 * f * seg)) * np.minimum(1, seg / 0.02) * np.minimum(1, (dd - seg) / 0.06), k * 0.2)
S["bugle"] = norm(lp(bg_, 3000), 0.3)
# tango suave (bandoneón sintetizado + baixo marcado), original
D = 3.6; buf = np.zeros(int(D * SR)); b = 60 / 116
mel = [69, 72, 76, 75, 76, 72, 69, 68, 69, 71, 72, 74, 76, 74, 72, 71]
def band(f, d):
    tt2 = t_(d); x = sum(np.sin(2 * np.pi * f * h * tt2 * (1 + 0.003 * np.sin(2 * np.pi * 5 * tt2))) / h for h in (1, 2, 3, 4))
    return x * np.minimum(1, tt2 / 0.05) * np.minimum(1, (d - tt2) / 0.08)
for k in range(int(D / (b / 2))):
    t = k * b / 2; place(buf, 0.18 * band(note(mel[k % 16]), b / 2 * 0.95), t)
for k in range(int(D / b) + 1):
    t = k * b; place(buf, 0.35 * kick(0.2, 90, 50), t); ch = [[45, 52, 57], [40, 47, 52]][(k // 4) % 2]
    if k % 2 == 0: place(buf, 0.08 * sum(band(note(m), b * 0.4) for m in ch), t + b * 0.5)
S["m_tango"] = norm(fadeio(lp(buf, 3500), 0.1, 0.6), 0.55)

# ================= França: sons extra =================
fl = np.zeros(int(0.3 * SR)); place(fl, lp(noise(0.12), 900) * np.sin(np.linspace(0, np.pi, int(0.12 * SR))), 0.0); place(fl, 0.6 * lp(noise(0.1), 700) * np.sin(np.linspace(0, np.pi, int(0.1 * SR))), 0.14)
S["flap"] = norm(fl, 0.35)
d = 1.6; tt = t_(d); S["siren"] = norm(np.sin(2 * np.pi * np.cumsum(750 + 250 * np.sin(2 * np.pi * 1.6 * tt)) / SR) * np.minimum(1, tt / 0.1) * np.minimum(1, (d - tt) / 0.3), 0.35)
S["snatch"] = norm(sweep_noise(0.3, 800, 6000, 0.4) + 0.5 * np.r_[np.zeros(int(0.12 * SR)), tone(0.4, 900, 1300) * np.sin(np.linspace(0, np.pi, int(0.4 * SR)))][: int(0.3 * SR)], 0.5)
d = 1.6; tt = t_(d); S["cheer"] = norm(bp(noise(d), 500, 3500) * (0.6 + 0.4 * np.sin(2 * np.pi * 5 * tt)) * np.minimum(1, tt / 0.15) * np.minimum(1, (d - tt) / 0.5), 0.4)
ty = np.zeros(int(1.2 * SR))
for k in range(14): place(ty, S["click"] * rng.uniform(0.4, 0.9), k * 0.08 + rng.uniform(0, 0.03))
S["typing"] = norm(ty, 0.35)
cs = np.zeros(int(1.0 * SR)); place(cs, lp(noise(0.08), 2000) * env(int(0.08 * SR), 0.001, curve=10), 0)
place(cs, sum(np.sin(2 * np.pi * f * t_(0.8)) * a for f, a in [(2637, 1), (3520, 0.6), (5274, 0.3)]) * np.exp(-t_(0.8) * 5), 0.1)
S["cash"] = norm(cs, 0.45)
cr2 = np.zeros(int(0.5 * SR))
for k in range(6): place(cr2, bp(noise(0.05), 1500, 6000) * env(int(0.05 * SR), 0.001, curve=8) * rng.uniform(0.5, 1), k * 0.06)
S["crunch"] = norm(cr2, 0.45)
d = 0.9; tt = t_(d); S["sigh"] = norm(bp(noise(d), 300, 1800) * np.sin(np.pi * tt / d) ** 2 * (1 - tt / d * 0.5), 0.35)
db_ = np.zeros(int(1.2 * SR)); place(db_, np.sin(2 * np.pi * 1318 * t_(0.6)) * np.exp(-t_(0.6) * 5), 0); place(db_, np.sin(2 * np.pi * 1046 * t_(0.8)) * np.exp(-t_(0.8) * 4), 0.3)
S["doorbell"] = norm(db_, 0.35)
d = 0.6; S["coin"] = norm(sum(np.sin(2 * np.pi * f * t_(d)) * a for f, a in [(3300, 1), (4950, 0.5), (6100, 0.3)]) * np.exp(-t_(d) * 9), 0.35)
d = 0.7; tt = t_(d); S["sneeze"] = norm(np.r_[bp(noise(0.3), 400, 2000) * np.linspace(0, 1, int(0.3 * SR)) ** 2 * 0.4, bp(noise(0.4), 800, 5000) * np.exp(-t_(0.4) * 8)], 0.5)
d = 2.0; tt = t_(d); S["rain"] = norm(hp(noise(d), 2500) * (0.7 + 0.3 * (rng.random(len(tt)) > 0.9)) * np.minimum(1, tt / 0.2) * np.minimum(1, (d - tt) / 0.4), 0.3)
sq = np.zeros(int(1.0 * SR))
for k in range(4): place(sq, np.sin(2 * np.pi * np.cumsum(np.linspace(3200, 4200, int(0.08 * SR))) / SR) * np.sin(np.linspace(0, np.pi, int(0.08 * SR))), k * 0.2 + rng.uniform(0, 0.05))
S["squeak"] = norm(sq, 0.3)
ch_ = np.zeros(int(2.0 * SR))
for k in range(4): place(ch_, bp(noise(0.35), 300, 1800) * np.sin(np.linspace(0, np.pi, int(0.35 * SR))) + 0.4 * tone(0.35, 220, 200, "sq") * np.sin(np.linspace(0, np.pi, int(0.35 * SR))), k * 0.45)
S["chant"] = norm(lp(ch_, 2500) + 0.4 * S["crowd"][: len(ch_)], 0.45)
fw = np.zeros(int(2.0 * SR))
for k in range(4): place(fw, 0.5 * tone(0.3, 600, 2000) * np.linspace(0, 1, int(0.3 * SR)), k * 0.35); place(fw, lp(noise(0.6), 1500) * np.exp(-t_(0.6) * 6) + 0.5 * hp(noise(0.6), 3000) * np.exp(-t_(0.6) * 4) * (rng.random(int(0.6 * SR)) > 0.8), k * 0.35 + 0.3)
S["fireworks"] = norm(fw, 0.5)
S["fire"] = norm(S["crackle"][: int(2.0 * SR)] + 0.4 * lp(noise(2.0), 300) * np.minimum(1, t_(2.0) / 0.3), 0.45)
d = 0.5; S["bubble"] = norm(np.sin(2 * np.pi * np.cumsum(np.linspace(300, 900, int(d * SR))) / SR) * np.exp(-t_(d) * 6), 0.35)
# musette (acordeão francês, valsa) — original
D = 3.6; buf = np.zeros(int(D * SR)); b = 60 / 168
def acc(f, d):
    tt2 = t_(d); x = sum(np.sin(2 * np.pi * f * h * tt2) / h ** 1.2 for h in (1, 2, 3, 4, 5)) + 0.7 * sum(np.sin(2 * np.pi * f * 1.006 * h * tt2) / h ** 1.2 for h in (1, 2, 3))
    return x * (1 + 0.15 * np.sin(2 * np.pi * 6 * tt2)) * np.minimum(1, tt2 / 0.03) * np.minimum(1, (d - tt2) / 0.06)
melm = [76, 79, 84, 83, 81, 79, 77, 76, 74, 77, 81, 79, 77, 76, 74, 72, 71, 74, 79, 77]
for k in range(int(D / b)):
    t = k * b; place(buf, 0.16 * acc(note(melm[k % len(melm)]), b * 0.9), t)
    bar_ = (k // 3) % 2; root = [48, 43][bar_]; ch3 = [[60, 64, 67], [59, 62, 67]][bar_]
    if k % 3 == 0: place(buf, 0.22 * acc(note(root), b * 0.8), t)
    else: place(buf, 0.06 * sum(acc(note(m), b * 0.5) for m in ch3), t)
S["m_musette"] = norm(fadeio(lp(buf, 4500), 0.1, 0.6), 0.55)
# samba suave (surdo + tamborim + cavaquinho) — original
D = 3.0; buf = np.zeros(int(D * SR)); b = 60 / 100; s16 = b / 4
for k in range(int(D / b) + 1):
    t = k * b; place(buf, 0.7 * kick(0.35, 90 if k % 2 else 70, 40), t)
    for j in range(4):
        if (k * 4 + j) % 3 != 1: place(buf, 0.25 * hp(noise(0.04), 3000) * env(int(0.04 * SR), 0.001, curve=12), t + j * s16)
    for j in (0, 1.5, 3):
        place(buf, 0.12 * sum(ks(note(m), 0.3) for m in [62, 66, 69, 74]), t + j * s16)
S["m_samba"] = norm(fadeio(lp(buf, 5000), 0.1, 0.6), 0.5)

cues = json.load(open(sys.argv[1]))
voice, sr = sf.read(sys.argv[2], dtype="float64"); assert sr == SR
L = len(voice) + SR
fx = np.zeros(L); ms = np.zeros(L)
VOL = 0.36
USE = {}
for t, kind, g in sorted(cues, key=lambda c: c[0]):
    if kind in V: i = USE.get(kind, 0); USE[kind] = i + 1; x = V[kind][(i * 7 + i // len(V[kind])) % len(V[kind])]
    else: x = S.get(kind)
    if x is None: print("sin sonido:", kind); continue
    s0 = int(t * SR)
    if s0 >= L: continue
    seg = x[: L - s0] * g * VOL
    if kind.startswith("m_"): ms[s0:s0 + len(seg)] += seg * 0.6
    else: fx[s0:s0 + len(seg)] += seg
v = np.r_[voice, np.zeros(L - len(voice))]
# ducking suave de efectos bajo la voz
envv = np.convolve(np.abs(v), np.ones(2205) / 2205, "same"); duck = 1 - 0.55 * np.clip(envv / 0.06, 0, 1)
import os
mus = np.zeros(L)
if os.environ.get("MUSIC"):
    m, msr = sf.read(os.environ["MUSIC"], dtype="float64"); m = m if m.ndim == 1 else m.mean(1); mus[: min(L, len(m))] = m[: L]
mduck = 1 - 0.6 * np.clip(envv / 0.05, 0, 1)
mix = v * 1.0 + fx * duck + ms * (1 - 0.6 * np.clip(envv / 0.05, 0, 1)) + mus * 0.11 * mduck
mix = mix / max(1.0, np.abs(mix).max() / 0.97)
sf.write(sys.argv[3], np.stack([mix, mix], 1)[: len(voice) + int(0.2 * SR)], SR)
print("cues", len(cues), "len", round(len(mix) / SR, 2))
