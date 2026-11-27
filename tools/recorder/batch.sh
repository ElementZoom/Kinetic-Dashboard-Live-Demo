#!/bin/bash
# usage: batch.sh  -> records every site loop (en + zh) with the smooth recorders into $OUT, skipping finished ones; safe to re-run
cd "$(dirname "$0")"; export OUT=${OUT:-/tmp/all}; mkdir -p $OUT
jobs=""
for l in detections climate everyone insights looks m_energy lighting m_security m_climate m_vehicle person m_irrigation m_shading onelook search warning garage; do for g in en zh; do [ "$l$g" = "garageen" ] && continue; jobs="$jobs phone:$l:$g"; done; done
for l in t_land t_port t_search; do for g in en zh; do jobs="$jobs tab:$l:$g"; done; done
run() { IFS=: read k l g <<< "$1"; f=$(node -e "import('./loops/$l.mjs').then(m=>console.log(m.default.file))"); o="$OUT/$f"; [ "$g" = zh ] && o="${o}_zh"; [ -f "$o.mp4" ] && [ -f "$o.webp" ] && return 0; if [ $k = phone ]; then node run60v.mjs $l $g; else node runt60v.mjs $l $g; fi >> $OUT/log.txt 2>&1; }
export -f run; export OUT
echo $jobs | tr ' ' '\n' | xargs -P 2 -I{} bash -c 'run {}'
