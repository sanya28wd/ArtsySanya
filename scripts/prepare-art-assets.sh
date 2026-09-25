#!/usr/bin/env bash

set -euo pipefail

output_directory="public/artworks"
quicklook_directory="/private/tmp/artsy-sanya-quicklook"

mkdir -p "$output_directory" "$quicklook_directory"

prepare_image() {
  local source_path="$1"
  local output_name="$2"
  local temporary_input="$source_path"
  local extension="${source_path##*.}"
  local normalized_extension

  normalized_extension=$(printf '%s' "$extension" | tr '[:upper:]' '[:lower:]')

  if [ "$normalized_extension" = "heic" ]; then
    qlmanage -t -s 2200 -o "$quicklook_directory" "$source_path" >/dev/null
    temporary_input="$quicklook_directory/$(basename "$source_path").png"
  fi

  ffmpeg -loglevel error -y -i "$temporary_input" \
    -vf "scale='min(1800,iw)':-2:force_original_aspect_ratio=decrease" \
    -map_metadata -1 -q:v 3 "$output_directory/$output_name.jpg"
}

prepare_video() {
  local source_path="$1"
  local output_name="$2"

  ffmpeg -loglevel error -y -i "$source_path" \
    -vf "scale='min(1280,iw)':-2:force_original_aspect_ratio=decrease" \
    -an -c:v libvpx-vp9 -crf 36 -b:v 0 "$output_directory/$output_name.webm"
}

prepare_image "art/bottle art/IMG_9959.JPG" "ganesha-glow"
prepare_image "art/bottle art/IMG_9971.jpg" "peacock-nocturne"
prepare_image "art/bottle art/IMG_9948.JPG" "crimson-folklore"
prepare_image "art/bottle art/IMG_9977.JPG" "festival-rabbit"
prepare_image "art/bottle art/IMG_9961.JPG" "jerrys-garden"
prepare_image "art/bottle art/IMG_9933.JPG" "words-to-keep"
prepare_image "art/bottle art/IMG_5869.jpg" "botanical-bottle"
prepare_image "art/bottle art/IMG_9978.JPG" "owl-garden"
prepare_image "art/bottle art/IMG_9947.JPG" "blue-ganesha"
prepare_image "art/bottle art/IMG_7952.JPG" "starlit-peacock"
prepare_image "art/digital art/butterfly/IMG_5970.PNG" "turquoise-metamorphosis"
prepare_image "art/digital art/IMG_1136.jpg" "burj-after-dark"
prepare_image "art/digital art/DD21742D-1BD0-43FE-AA61-0B4C12AFC9B2.JPG" "dubai-after-dark"
prepare_image "art/digital art/fish /Untitled_Artwork 3.JPG" "moonlit-betta"
prepare_image "art/digital art/sharjah mosque /IMG_0216.jpg" "violet-minarets"
prepare_image "art/digital art/IMG_1183.JPG" "velvet-rose"
prepare_image "art/digital art/abstract art/IMG_0238.jpg" "botanical-balance"
prepare_image "art/digital art/eye /IMG_0821.JPG" "watchful"
prepare_image "art/digital art/feather /IMG_0115 2.JPG" "electric-feather"
prepare_image "art/digital art/northern lights /photo-output.JPEG" "northern-lights"
prepare_image "art/digital art/colors page/Untitled_Artwork.JPG" "colour-study"
prepare_image "art/mandala /Untitled_Artwork 16.png" "quiet-orbit"
prepare_image "art/mandala /IMG_0748.jpg" "midnight-lotus"
prepare_image "art/mandala /Untitled_Artwork 11.png" "sunset-promise"
prepare_image "art/mandala /IMG_1131.jpg" "violet-geometry"
prepare_image "art/mandala /IMG_0207.jpg" "sacred-ganesha"
prepare_image "art/mandala /IMG_0165.jpg" "time-in-bloom"
prepare_image "art/mandala /teddy mandala /Untitled_Artwork 4.png" "teddy-halo"
prepare_image "art/mandala /ice cream mandala /IMG_0277.jpg" "midnight-treat"
prepare_image "art/mandala /IMG_1150.PNG" "crescent-prayer"
prepare_image "art/mandala /IMG_1048.jpg" "radhas-song"
prepare_image "art/mandala /Untitled_Artwork 5.png" "pink-bloom"
prepare_image "art/mandala /IMG_0193.jpg" "solar-lace"
prepare_image "art/rangoli /untitled folder/0V8A5587.JPG" "diya-bloom"
prepare_image "art/rangoli /rangoli 2 /IMG_8565.jpg" "festival-garden"
prepare_image "art/rangoli /rangoli 1 /IMG_2071.jpg" "circle-of-celebration"
prepare_image "art/rangoli /rangoli 3/OR3C0699.JPG" "peacock-petals"
prepare_image "art/craft work /ganesha /IMG_9395.HEIC" "ganesha-craft"
prepare_image "art/resin/coasters /IMG_6042.heic" "rose-quartz-coasters"
prepare_image "art/canvas paintings /IMG_6161.jpg" "into-her-dreams"
prepare_image "art/canvas paintings /IMG_7249.jpg" "radha-krishna-reverie"
prepare_image "art/canvas paintings /IMG_6157.jpg" "folk-wedding"
prepare_image "art/canvas paintings /IMG_7248.jpg" "moonlit-stillness"
prepare_image "art/canvas paintings /untitled folder/IMG_0134.jpg" "wings-in-gold"
prepare_image "art/canvas paintings /feather painting /IMG_0133.JPG" "peacock-feather-studies"
prepare_image "art/canvas paintings /flow painting /IMG_4300.heic" "tidal-blue"
prepare_video "art/bottle art/b694787b10594a04ab9e06d276984d69.MOV" "bottle-process"
prepare_video "art/canvas paintings /flow painting /IMG_4301.MOV" "tidal-blue-process"
