#!/usr/bin/env bash

set -e
source "$HOME/.config/user-dirs.dirs"

if ! [[ -d 'sharedPaths' ]]; then
  echo "Make sharedPaths directory"

  mkdir 'sharedPaths'
fi

if [[ -n "$XDG_VIDEOS_DIR" ]] then
  ln $XDG_VIDEOS_DIR -s sharedPaths/Videos
  echo "Link created: sharedPaths/Videos"
fi
if [[ -n "$XDG_DOCUMENTS_DIR" ]] then
  ln $XDG_DOCUMENTS_DIR -s sharedPaths/Documents
  echo "Link created: sharedPaths/Documents"
fi
if [[ -n "$XDG_DOWNLOAD_DIR" ]] then
  ln $XDG_DOWNLOAD_DIR -s sharedPaths/Downloads
  echo "Link created: sharedPaths/Downloads"
fi
if [[ -n "$XDG_MUSIC_DIR" ]] then
  ln $XDG_MUSIC_DIR -s sharedPaths/Music
  echo "Link created: sharedPaths/Music"
fi
if [[ -n "$XDG_PICTURES_DIR" ]] then
  ln $XDG_PICTURES_DIR -s sharedPaths/Pictures
  echo "Link created: sharedPaths/Pictures"
fi

npm install
