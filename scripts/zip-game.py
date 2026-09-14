"""Zip the playable tree for CrazyGames: index.html at the archive root, relative paths only."""
from __future__ import annotations

import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "dist"
OUT = OUT_DIR / "fwoosh.zip"

INCLUDE_FILES = ("index.html", ".nojekyll")
INCLUDE_DIRS = ("css", "js", "media")


def add_dir(zf: zipfile.ZipFile, folder: Path) -> None:
    for path in sorted(folder.rglob("*")):
        if path.is_file():
            zf.write(path, path.relative_to(ROOT).as_posix())


def main() -> None:
    OUT_DIR.mkdir(exist_ok=True)
    if OUT.exists():
        OUT.unlink()
    with zipfile.ZipFile(OUT, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for name in INCLUDE_FILES:
            path = ROOT / name
            if path.exists():
                zf.write(path, path.name)
        for name in INCLUDE_DIRS:
            add_dir(zf, ROOT / name)
    names = zipfile.ZipFile(OUT).namelist()
    if "index.html" not in names:
        raise SystemExit("zip is missing index.html at the root")
    nested = [n for n in names if n.startswith("fwoosh/")]
    if nested:
        raise SystemExit("zip nested the project folder; index.html must be at the root")
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size} bytes, {len(names)} files)")


if __name__ == "__main__":
    main()
