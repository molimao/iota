#!/bin/zsh
set -e
script_dir="${0:A:h}"
exec /usr/bin/python3 "$script_dir/iota_watch_agent.py" --install
