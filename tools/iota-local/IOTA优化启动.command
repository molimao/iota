#!/bin/zsh
toolkit_dir="${0:A:h}"
installed_script="$HOME/Library/Application Support/IOTA Local Guardian/iota_local_start.py"
if [[ ! -f "$installed_script" ]]; then
    /usr/bin/python3 "$toolkit_dir/install.py" || exit $?
fi
/usr/bin/python3 "$installed_script"
