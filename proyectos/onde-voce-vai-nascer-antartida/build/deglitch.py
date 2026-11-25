# Substitui frames com falha de captura (lista) pelo frame anterior. uso: deglitch.py in.mp4 out.mp4 f1 f2 ...
import sys, subprocess
src, dst, *fr = sys.argv[1:]; bad = set(map(int, fr)); W, H = 1440, 2560; N = W * H * 3
dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "30", "-i", "-", "-i", src, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "15", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", dst], stdin=subprocess.PIPE)
prev = None; i = 0
while True:
    f = dec.stdout.read(N)
    if len(f) < N: break
    if i in bad and prev is not None: f = prev
    enc.stdin.write(f); prev = f; i += 1
enc.stdin.close(); enc.wait(); print("frames", i)
