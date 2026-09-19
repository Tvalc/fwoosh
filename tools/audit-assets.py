"""Check the modular game's local references and horizontal PNG animation atlases.

Usage: python tools/audit-assets.py GAME_FOLDER REPORT_JSON
Uses only the Python standard library; does not modify the game or its assets.
"""
from pathlib import Path
import hashlib
import json
import re
import struct
import sys

root = Path(sys.argv[1]).resolve()
report_path = Path(sys.argv[2]) if len(sys.argv) > 2 else None
checks = []

def check(name, ok, detail):
    checks.append({'name': name, 'status': 'pass' if ok else 'fail', 'detail': detail})

html = (root / 'index.html').read_text(encoding='utf-8-sig')
refs = [(root, s) for s in re.findall(r'(?:src|href)=["\']([^"\']+)', html)]
for p in (root / 'css').glob('*.css'):
    refs += [(p.parent, s.strip('"\'')) for s in re.findall(r'url\(([^)]+)\)', p.read_text(encoding='utf-8-sig'))]
for p in (root / 'js').glob('*.js'):
    refs += [(root, s) for s in re.findall(r'["\'](\./media/[^"\']+)["\']', p.read_text(encoding='utf-8-sig'))]
local = sorted({str((base / ref.split('?', 1)[0].split('#', 1)[0]).resolve())
                for base, ref in refs if not re.match(r'^(https?:|data:|#|//)', ref)})
missing = [str(Path(p).relative_to(root)) for p in local if not Path(p).is_file()]
check('All referenced local resources exist', not missing, {'references':len(local), 'missing':missing})

# The contract intentionally distinguishes shipped art from Cursor's pending
# exports. Pending entries are reported for handoff visibility and do not fail
# CI. Ready entries are hard requirements and do fail the audit if removed.
contract_path = root / 'tools' / 'art-contract.json'
if contract_path.exists():
    contract = json.loads(contract_path.read_text(encoding='utf-8-sig'))
    ready_missing = [entry['path'] for entry in contract.get('ready', [])
                     if not (root / entry['path']).is_file()]
    pending = [{'key':entry.get('key'), 'glob':entry.get('glob')}
               for entry in contract.get('pending', [])]
    check('Art contract ready assets exist', not ready_missing,
          {'missing':ready_missing, 'ready':len(contract.get('ready', []))})
    check('Art contract pending exports recorded', True,
          {'pending':pending})
else:
    check('Art contract exists', False, 'tools/art-contract.json is missing')

metadata = root / 'js' / 'media-meta.js'
if not metadata.exists():
    check('Modular media metadata exists', False, 'This tool targets the modular layout; use the state audit for the embedded build.')
else:
    text = metadata.read_text(encoding='utf-8-sig')
    match = re.search(r'const MAKKO_ANIM\s*=\s*(\{.*?\});', text)
    atlases = json.loads(match.group(1)) if match else {}
    for key, value in re.findall(r'MAKKO_ANIM\.(\w+)\s*=\s*(\{.*?\});', text):
        atlases[key] = json.loads(value)
    check('Animation metadata parsed', bool(atlases), {'keys':sorted(atlases)})
    for key, meta in atlases.items():
        p = root / 'media' / 'anim' / (key + '.png')
        cols = int(meta.get('cols', meta['frames']))
        rows = int(meta.get('rows', 1))
        padding = int(meta.get('padding', 0))
        expected = [cols * (meta['fw'] + 2 * padding),
                    rows * (meta['fh'] + 2 * padding)]
        actual = None
        if p.is_file():
            data = p.read_bytes()
            if data[:8] == b'\x89PNG\r\n\x1a\n':
                actual = list(struct.unpack('>II', data[16:24]))
        check('Atlas ' + key, actual == expected, {'actual':actual, 'expected':expected, 'frames':meta['frames']})

report = {'method':'Static modular resource and atlas validation; no visual approval.',
          'pass':sum(c['status']=='pass' for c in checks), 'fail':sum(c['status']=='fail' for c in checks), 'checks':checks,
          'media_files':[{'path':p.relative_to(root).as_posix(), 'bytes':p.stat().st_size,
                          'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
                         for p in sorted((root / 'media').rglob('*')) if p.is_file()]}
if report_path:
    report_path.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='media_files'}, indent=2))
sys.exit(1 if report['fail'] else 0)
