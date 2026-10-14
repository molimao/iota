"""Release only reviewed runtime files; exclude credentials, state and test fixtures."""
from pathlib import Path
import hashlib
import json
import re
import zipfile
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'scripts/device-agent'
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
