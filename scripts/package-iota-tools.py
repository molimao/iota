"""Build the public release from a fixed source-file allowlist; never include local state."""
from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'tools/iota-local'
VERSION = '1.0.0'
FILES = (
    'README.md', 'LICENSE', 'install.py', '安装IOTA工具.command',
    'IOTA优化启动.command', '查看IOTA状态.command', '启动IOTA守护.command',
    '停止IOTA守护.command', 'runtime/iota_guardian.py',
    'runtime/iota_local_start.py', 'runtime/iota_local_relay.py',
)
target = ROOT / 'public/downloads' / f'iota-local-tools-{VERSION}.zip'
target.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED) as archive:
    for name in FILES:
        data = (SOURCE / name).read_bytes()
        entry = zipfile.ZipInfo('IOTA本地工具/' + name, (2026, 10, 1, 0, 0, 0))
        entry.create_system = 3
        entry.compress_type = zipfile.ZIP_DEFLATED
        entry.external_attr = ((0o100755 if name.endswith('.command') else 0o100644) << 16)
        archive.writestr(entry, data)
release = {'version': VERSION, 'date': '2026-10-01', 'filename': target.name,
           'bytes': target.stat().st_size, 'sha256': hashlib.sha256(target.read_bytes()).hexdigest()}
(ROOT / 'src/lib/local-tools-release.json').write_text(json.dumps(release, indent=2) + '\n')
(target.parent / f'iota-local-tools-{VERSION}.json').write_text(json.dumps(release, indent=2) + '\n')
(target.parent / 'iota-status.command').write_bytes((SOURCE / '查看IOTA状态.command').read_bytes())
print(json.dumps(release))
