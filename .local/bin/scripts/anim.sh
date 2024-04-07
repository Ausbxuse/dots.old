#!/usr/bin/env bash

export c_default="\033[0m"
export c_blue="\033[1;34m"
export c_magenta="\033[1;35m"
export c_cyan="\033[1;36m"
export c_green="\033[1;32m"
export c_red="\033[1;31m"
export c_yellow="\033[1;33m"

anim=(
  "${c_blue}•${c_green}•${c_red}•${c_magenta}•    "
  " ${c_green}•${c_red}•${c_magenta}•${c_blue}•   "
  "  ${c_red}•${c_magenta}•${c_blue}•${c_green}•  "
  "   ${c_magenta}•${c_blue}•${c_green}•${c_red}• "
  "    ${c_blue}•${c_green}•${c_red}•${c_magenta}•"
)

start_animation() {
  [[ "${silent_mode}" == "true" ]] && return 0

  setterm -cursor off

  (
    while true; do
      for i in {0..4}; do
        echo -ne "\r\033[2K                         ${anim[i]}"
        sleep 0.1
      done

      for i in {4..0}; do
        echo -ne "\r\033[2K                         ${anim[i]}"
        sleep 0.1
      done
    done
  ) &

  export ANIM_PID="${!}"
}

stop_animation() {
  [[ "${silent_mode}" == "true" ]] && return 0

  [[ -e "/proc/${ANIM_PID}" ]] && kill -13 "${ANIM_PID}"
  setterm -cursor on
}

start_animation; sleep 2; stop_animation; echo
