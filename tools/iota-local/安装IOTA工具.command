#!/bin/zsh
toolkit_dir="${0:A:h}"
/usr/bin/python3 "$toolkit_dir/install.py"
result=$?
read -k 1 '?按任意键关闭…'
exit $result
