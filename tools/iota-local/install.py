#!/usr/bin/env python3
"""Install the local IOTA tools for the current user; no third-party packages needed."""
import argparse
import os
from pathlib import Path
import plistlib
import shutil
import subprocess
import sys

LABEL = 'com.local.iota.guardian'
FILES = ('iota_local_start.py', 'iota_local_relay.py', 'iota_guardian.py')


def locations(home):
    return (home / 'Library/Application Support/IOTA Local Guardian',
            home / 'Library/LaunchAgents' / (LABEL + '.plist'))


def configuration(support):
    return {'Label': LABEL, 'ProgramArguments': ['/usr/bin/python3', str(support / 'iota_guardian.py')],
            'RunAtLoad': True, 'KeepAlive': True, 'ThrottleInterval': 60, 'ProcessType': 'Background',
            'WorkingDirectory': str(support),
            'StandardOutPath': str(support / 'IOTA守护运行.log'),
            'StandardErrorPath': str(support / 'IOTA守护错误.log')}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true', help='只检查工具包完整性，不安装或重启')
    args = parser.parse_args()
    source = Path(__file__).resolve().parent / 'runtime'
    for name in FILES:
        file = source / name
        if not file.is_file():
            sys.exit('工具包不完整：缺少 ' + name + '。请解压完整压缩包，不要只复制 command 文件。')
        compile(file.read_text(), str(file), 'exec')
    support, agent = locations(Path.home())
    if args.check:
        print('工具包完整；安装路径将根据当前用户自动生成：' + str(support))
        return
    apps = (Path('/Applications/IOTA Train at Home.app'), Path.home() / 'Applications/IOTA Train at Home.app')
    if not any(app.is_dir() for app in apps):
        sys.exit('请先安装官方 IOTA Train at Home.app 到“应用程序”文件夹，再运行本工具。')
    support.mkdir(parents=True, exist_ok=True, mode=0o700)
    # On an existing installation, preserve a live legacy relay until IOTA exits.
    # This avoids dropping an active queue simply because the tools are updated.
    pid_file = support / 'iota-relay.pid'
    if pid_file.exists():
        try:
            pid = int(pid_file.read_text())
            command = subprocess.check_output(['ps', '-p', str(pid), '-o', 'command='], text=True).strip()
            marker = 'iota_local_relay.py'
            if marker in command and str(support / marker) not in command:
                prefix = command[:command.index(marker) + len(marker)]
                legacy = prefix.split(' ', 1)[1].strip()
                if legacy.startswith(str(Path.home()) + '/'):
                    (support / 'legacy-relay-path.txt').write_text(legacy)
        except (OSError, ValueError, subprocess.CalledProcessError):
            pass
    for name in FILES:
        temporary = support / (name + '.new')
        shutil.copyfile(source / name, temporary)
        temporary.chmod(0o600)
        temporary.replace(support / name)
    agent.parent.mkdir(parents=True, exist_ok=True)
    domain = 'gui/' + str(os.getuid())
    service = domain + '/' + LABEL
    previous = agent.read_bytes() if agent.exists() else None
    subprocess.run(['launchctl', 'bootout', service], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    agent.write_bytes(plistlib.dumps(configuration(support)))
    agent.chmod(0o644)
    result = subprocess.run(['launchctl', 'bootstrap', domain, str(agent)], capture_output=True, text=True)
    if result.returncode:
        if previous is not None:
            agent.write_bytes(previous)
            subprocess.run(['launchctl', 'bootstrap', domain, str(agent)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        sys.exit('启动器已安装，但后台守护未能启用。请在已登录的 Mac 桌面终端运行安装脚本。')
    print('安装完成。启动器和守护文件已安装到本机用户的应用支持目录。')
    print('接下来先从 IOTA 菜单正常退出，再双击同一文件夹内的“IOTA优化启动.command”。')
    print('守护每三十秒检查；连续三次本地异常才重启；正常排队不会被重启。')


if __name__ == '__main__':
    main()
