"""Create, verify and restore a Fwoosh source backup, including ignored artwork.

create GAME_FOLDER --output BACKUP_DIRECTORY
verify ARCHIVE.zip
restore ARCHIVE.zip --output NEW_DIRECTORY

Archives are immutable. Restore refuses an existing destination and verifies every
file before creating it. No third-party packages or network access are required.
"""
from pathlib import Path, PurePosixPath
from datetime import datetime, timezone
import argparse
import hashlib
import json
import subprocess
import zipfile

FILES = ('index.html', 'ART.md', 'README.md', 'AGENTS.md', 'COMBAT_ROADMAP.md',
         'META_ROADMAP.md', 'package.json', '.gitignore', '.nojekyll')
FOLDERS = ('assets', 'media', 'js', 'css', 'scripts', 'docs', 'tools')
MANIFEST = 'MANIFEST.json'

def sha(data):
    return hashlib.sha256(data).hexdigest()

def safe_name(name):
    p = PurePosixPath(name)
    if not name or '\\' in name or ':' in name or p.is_absolute() or '..' in p.parts or str(p) != name:
        raise ValueError('Unsafe archive path: ' + name)
    return p

def sources(root):
    paths = [root / name for name in FILES if (root / name).is_file()]
    paths += [p for folder in FOLDERS for p in (root / folder).rglob('*')
              if p.is_file() and '__pycache__' not in p.parts]
    for p in sorted(paths):
        if not p.resolve().is_relative_to(root):
            raise ValueError('Source link points outside the game folder: ' + str(p))
        yield p

def verify(archive):
    archive = Path(archive).resolve()
    with zipfile.ZipFile(archive) as z:
        names = z.namelist()
        if len(names) != len(set(names)):
            raise ValueError('Duplicate archive entries')
        manifest = json.loads(z.read(MANIFEST))
        if manifest.get('version') != 1 or not isinstance(manifest.get('files'), list):
            raise ValueError('Unsupported backup manifest')
        expected = set()
        for item in manifest['files']:
            name = item['path']
            safe_name(name)
            if name in expected or name == MANIFEST:
                raise ValueError('Duplicate or reserved manifest entry: ' + name)
            expected.add(name)
            data = z.read(name)
            if len(data) != item['bytes'] or sha(data) != item['sha256']:
                raise ValueError('Integrity check failed: ' + name)
        if set(names) != expected | {MANIFEST}:
            raise ValueError('Archive contents do not match manifest')
    return manifest

def create(root, output):
    root, output = Path(root).resolve(), Path(output).resolve()
    if not root.is_dir() or not (root / 'index.html').is_file():
        raise ValueError('Game folder must contain index.html')
    if output.is_relative_to(root):
        raise ValueError('Place backups outside the game folder')
    paths = list(sources(root))
    output.mkdir(parents=True, exist_ok=True)
    now = datetime.now(timezone.utc)
    archive = output / ('fwoosh-source-' + now.strftime('%Y%m%dT%H%M%S%fZ') + '.zip')
    try:
        revision = subprocess.check_output(['git', '-C', str(root), 'rev-parse', 'HEAD'],
            stderr=subprocess.DEVNULL, text=True).strip()
    except (OSError, subprocess.CalledProcessError):
        revision = None
    manifest = {'version':1, 'created_at':now.isoformat(), 'base_commit':revision,
        'note':'Source snapshot including ignored art; may contain uncommitted work. Not a release or off-device backup.', 'files':[]}
    created = False
    try:
        with zipfile.ZipFile(archive, 'x', zipfile.ZIP_DEFLATED) as z:
            created = True
            for p in paths:
                data = p.read_bytes()
                name = p.relative_to(root).as_posix()
                safe_name(name)
                z.writestr(name, data)
                manifest['files'].append({'path':name, 'bytes':len(data), 'sha256':sha(data)})
            # Reject a mixed snapshot if captured files changed or files were added/removed.
            if {p.relative_to(root).as_posix() for p in sources(root)} != {r['path'] for r in manifest['files']}:
                raise ValueError('Source file set changed during capture; retry when stable')
            for item in manifest['files']:
                if sha((root / item['path']).read_bytes()) != item['sha256']:
                    raise ValueError('Source changed during capture: ' + item['path'])
            z.writestr(MANIFEST, json.dumps(manifest, indent=2) + '\n')
        verify(archive)
    except Exception:
        # Remove only the new, incomplete archive that this call created.
        if created and archive.parent == output and archive.is_file():
            archive.unlink()
        raise
    return archive, manifest

def restore(archive, output):
    archive, output = Path(archive).resolve(), Path(output).resolve()
    manifest = verify(archive)
    if output.exists():
        raise ValueError('Restore destination already exists; choose a new directory')
    output.mkdir(parents=True)
    with zipfile.ZipFile(archive) as z:
        for item in manifest['files']:
            target = output / item['path']
            if not target.resolve().is_relative_to(output):
                raise ValueError('Restore path leaves destination')
            target.parent.mkdir(parents=True, exist_ok=True)
            with target.open('xb') as f:
                f.write(z.read(item['path']))
            if sha(target.read_bytes()) != item['sha256']:
                raise ValueError('Restored file verification failed: ' + item['path'])
    return manifest

def main():
    parser=argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('action', choices=['create','verify','restore'])
    parser.add_argument('source')
    parser.add_argument('--output')
    args=parser.parse_args()
    if args.action in ('create','restore') and not args.output:
        parser.error('--output is required for create and restore')
    if args.action == 'create':
        archive, manifest=create(args.source,args.output)
    else:
        archive=Path(args.source).resolve()
        manifest=verify(archive) if args.action=='verify' else restore(archive,args.output)
    print(json.dumps({'action':args.action,'archive':str(archive),'files':len(manifest['files']),
        'source_art_files':sum(r['path'].startswith('assets/') for r in manifest['files']),
        'archive_sha256':sha(archive.read_bytes()),'verified':True},indent=2))

if __name__ == '__main__':
    main()
