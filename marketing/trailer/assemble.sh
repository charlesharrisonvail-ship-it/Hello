#!/usr/bin/env bash
# Cuts the AI shots in shots/1.mp4 … shots/8.mp4 together with the name cards,
# title and end card from out/ into out/epivail-8150-trailer.mp4 (1920x1080, 30 fps).
set -euo pipefail
cd "$(dirname "$0")"
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
V="scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1,format=yuv420p"
A="aresample=48000,aformat=channel_layouts=stereo"
enc=(-c:v libx264 -crf 18 -preset medium -c:a aac -b:a 192k -ar 48000)

shot() {  # shot <n> [card]  -> $T/s<n>.mp4, 5 s, card laid over from 0.8 s
  local n=$1 card=${2:-}
  local hasaudio; hasaudio=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 shots/$n.mp4 | head -1)
  local ain=(-f lavfi -t 5 -i anullsrc=r=48000:cl=stereo) amap="[2:a]"
  [ -n "$hasaudio" ] && { ain=(); amap="[0:a]"; }
  if [ -n "$card" ]; then
    ffmpeg -hide_banner -loglevel error -y -i shots/$n.mp4 -c:v libvpx-vp9 -itsoffset 0.8 -i out/$card-alpha.webm "${ain[@]}" \
      -filter_complex "[0:v]$V[b];[1:v]format=yuva420p[c];[b][c]overlay=eof_action=pass,format=yuv420p[v];${amap}$A,afade=t=out:st=4.7:d=0.3[a]" \
      -map "[v]" -map "[a]" -t 5 "${enc[@]}" $T/s$n.mp4
  else
    [ -n "$hasaudio" ] || amap="[1:a]"
    ffmpeg -hide_banner -loglevel error -y -i shots/$n.mp4 "${ain[@]}" \
      -filter_complex "[0:v]$V[v];${amap}$A,afade=t=out:st=4.7:d=0.3[a]" \
      -map "[v]" -map "[a]" -t 5 "${enc[@]}" $T/s$n.mp4
  fi
}
card() {  # full-screen graphic with silence
  ffmpeg -hide_banner -loglevel error -y -i out/$1.mp4 -f lavfi -i anullsrc=r=48000:cl=stereo \
    -filter_complex "[0:v]$V[v]" -map "[v]" -map 1:a -shortest "${enc[@]}" $T/$1.mp4
}

shot 1 charles; shot 2 olaf; shot 3 darrell; shot 4 eva
shot 5; shot 6; shot 7; shot 8
card title; card end

printf "file '%s'\n" $T/s1.mp4 $T/s2.mp4 $T/s3.mp4 $T/s4.mp4 $T/s5.mp4 $T/s6.mp4 $T/s7.mp4 \
  $T/title.mp4 $T/s8.mp4 $T/end.mp4 > $T/list.txt
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i $T/list.txt \
  -af loudnorm=I=-14:TP=-1.5:LRA=11 "${enc[@]}" -movflags +faststart out/epivail-8150-trailer.mp4
echo "done: out/epivail-8150-trailer.mp4"
