#!/bin/zsh
launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/com.local.iota.guardian.plist"
