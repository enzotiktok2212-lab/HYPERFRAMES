#!/bin/bash
# Render robusto: reintenta hasta 4 veces si falla, verifica parpadeos y corrige frames sueltos.
# uso: bash build/render_safe.sh nombre_salida
cd "$(dirname "$0")/.." || exit 1
OUT=${1:-video}; mkdir -p build/entrega
SHELL_BIN=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell | head -1)
for attempt in 1 2 3 4; do
  echo "[render_safe] intento $attempt $(date +%T)"
  rm -rf renders
  PRODUCER_HEADLESS_SHELL_PATH=$SHELL_BIN node ../../packages/cli/dist/cli.js render . --quality high --fps 30 --workers 3 > build/render.log 2>&1
  V=$(ls renders/*.mp4 2>/dev/null | head -1)
  if [ -n "$V" ] && ffprobe -v error "$V" >/dev/null 2>&1; then
    BAD=$(python3 build/flicker.py "$V" | awk '$1 ~ /^[0-9]+$/ && $2==1{print $1}' | tr '\n' ' ')
    if [ -n "$BAD" ]; then echo "[render_safe] frames con falla: $BAD -> corrigiendo"; python3 build/deglitch.py "$V" "build/entrega/$OUT.mp4" $BAD; else cp "$V" "build/entrega/$OUT.mp4"; fi
    python3 build/flicker.py "build/entrega/$OUT.mp4" | tail -1
    echo "[render_safe] OK $(date +%T)"; exit 0
  fi
  echo "[render_safe] falló (ver build/render.log), reintentando en 20 s"; tail -5 build/render.log; sleep 20
done
echo "[render_safe] FALLÓ 4 veces"; exit 1
