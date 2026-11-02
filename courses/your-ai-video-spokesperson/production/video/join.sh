#!/bin/bash
# join.sh <module n> <chunk count> : wav/<n>01.. -> m<n>.wav (48k mono, 0.45 s between chunks, loudness-normalized)
cd "$(dirname "$0")"; n=$1; c=$2; args=(); f=""
for j in $(seq 1 $c); do args+=(-i wav/${n}0$j.wav); done
for j in $(seq 0 $((c-1))); do f="$f[$j:a]aresample=48000,aformat=channel_layouts=mono,apad=pad_dur=0.45[a$j];"; done
for j in $(seq 0 $((c-1))); do f="$f[a$j]"; done
ffmpeg -loglevel error -y "${args[@]}" -filter_complex "${f}concat=n=$c:v=0:a=1,loudnorm=I=-16:TP=-1.5:LRA=11[o]" -map "[o]" -ar 48000 m$n.wav
ffprobe -v error -show_entries format=duration -of csv=p=0 m$n.wav
