# uso: stills.sh t0 t1 step out.jpg
cd "$(dirname "$0")/.." && rm -rf build/sh && mkdir -p build/sh && TS=$(python3 -c "import sys;a,b,s=map(float,sys.argv[1:4]);n=int((b-a)/s)+1;print(' '.join(f'{a+i*s:.2f}' for i in range(n)))" $1 $2 $3) && timeout 900 node build/shots.cjs index.html build/sh $TS 2>&1 | grep -v ERR_FILE_NOT_FOUND | head; python3 build/tile.py build/sh $4 ${5:-8}
