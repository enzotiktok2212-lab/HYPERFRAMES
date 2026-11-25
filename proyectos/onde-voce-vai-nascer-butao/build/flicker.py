# Detecta piscadas reais: 1-2 frames com uma região que muda forte (>40 níveis) em relação aos vizinhos,
# enquanto os vizinhos são praticamente iguais entre si. Ignora ruído de compressão.
import sys, subprocess, numpy as np
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-vf", "scale=180:320,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
d = np.frombuffer(raw, np.uint8).reshape(-1, 320, 180).astype(np.int16); n = len(d)
F = lambda i, j: (np.abs(d[i] - d[j]) > 40).mean()
out = []
for i in range(1, n - 2):
    for w in (1, 2):
        if i + w >= n: continue
        a = F(i, i - 1); b = F(i + w - 1, i + w); c = F(i - 1, i + w)
        if a > 0.004 and b > 0.004 and c < 0.25 * min(a, b): out.append((i, w, round(i / 30, 2), round(a * 100, 2), round(c * 100, 2)))
for o in out: print(*o)
print("total", len(out))
