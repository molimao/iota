#!/bin/zsh
launchctl bootout "gui/$(id -u)/com.local.iota.guardian"
print 'IOTA 守护已停止；矿工仍保持当前运行状态。'
