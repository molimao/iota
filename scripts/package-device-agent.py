"""Release only reviewed runtime files; exclude credentials, state and test fixtures."""
from pathlib import Path
import hashlib
import json
import re
import sys
import zipfile
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'scripts/device-agent'
download=ROOT/'public/downloads'
if '--windows-only' not in sys.argv:
    version=re.search(r"^VERSION = '([0-9.]+)'",(SOURCE/'iota_watch_agent.py').read_text(),re.M)[1]
    files=('iota_watch_agent.py','agent_updater.py','iota_local_start.py','iota_local_relay.py','install.command','README.md')
    target=ROOT/'public/downloads'/f'iota-watch-agent-{version}.zip'
    with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as archive:
        for name in files:
            entry=zipfile.ZipInfo('iota-watch-agent/'+name,(2026,10,14,0,0,0))
            entry.create_system=3
            entry.external_attr=(0o100755 if name=='install.command' else 0o100644)<<16
            entry.compress_type=zipfile.ZIP_DEFLATED
            archive.writestr(entry,(SOURCE/name).read_bytes())
    manifest={'version':version,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'bytes':target.stat().st_size}
    for path in [target.with_suffix('.json'),target.parent/'iota-watch-agent-latest.json']:
        path.write_text(json.dumps(manifest,indent=2)+'\n')
    print(json.dumps(manifest))

    linux_version=re.search(r"^VERSION = '([0-9.]+)'",(SOURCE/'linux_gpu_agent.py').read_text(),re.M)[1]
    linux_target=target.parent/f'iota-watch-linux-{linux_version}.zip'
    with zipfile.ZipFile(linux_target,'w',zipfile.ZIP_DEFLATED) as archive:
        for name in ('linux_gpu_agent.py','install_linux.py','xds_observation.py','LINUX.md'):
            entry=zipfile.ZipInfo('iota-watch-linux/'+name,(2026,10,27,0,0,0))
            entry.create_system=3
            entry.external_attr=0o100644<<16
            entry.compress_type=zipfile.ZIP_DEFLATED
            archive.writestr(entry,(SOURCE/name).read_bytes())

windows_version=re.search(r"^VERSION = '([0-9.]+)'",(SOURCE/'windows_agent.py').read_text(),re.M)[1]
windows_target=download/f'iota-watch-windows-{windows_version}.zip'
with zipfile.ZipFile(windows_target,'w',zipfile.ZIP_DEFLATED) as archive:
    for name in ('windows_agent.py','xds_observation.py','Install.cmd','WINDOWS.md'):
        entry=zipfile.ZipInfo('iota-watch-windows/'+name,(2026,11,9,0,0,0))
        entry.compress_type=zipfile.ZIP_DEFLATED
        contents=(SOURCE/name).read_bytes()
        archive.writestr(entry,contents.replace(b'\n',b'\r\n') if name.endswith('.cmd') else contents)
