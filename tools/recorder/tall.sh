#!/bin/bash
cd "$(dirname "$0")"
unset AUDIT
export OUT=out_tall
( for L in en zh; do for n in insights onelook search warning lighting climate garage person everyone m_security m_climate m_irrigation m_shading; do echo "run.mjs $n $L"; done; done ) | xargs -P 4 -I{} bash -c 'set -- {}; timeout 500 node $1 $2 $3 2>&1 | grep -E "fit|rror|^out" | tail -5' > tall.log 2>&1
echo DONE >> tall.log
