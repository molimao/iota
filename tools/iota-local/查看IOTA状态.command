#!/bin/zsh
guardian_script="$HOME/Library/Application Support/IOTA Local Guardian/iota_guardian.py"
if [[ ! -f "$guardian_script" ]]; then
    print '尚未安装 IOTA 守护，请先运行完整工具包里的“安装IOTA工具.command”。'
    exit 1
fi
trap 'printf "\n已停止状态刷新。\n"; exit 0' INT TERM
while true; do
    printf '\033[2J\033[H'
    print 'IOTA 实时状态 · 每 60 秒自动刷新'
    print -- '--------------------------------'
    /usr/bin/python3 "$guardian_script" --status
    print '\n下次刷新：60 秒后。按 Ctrl+C 或关闭窗口退出查看；后台守护继续运行。'
    sleep 60
done
