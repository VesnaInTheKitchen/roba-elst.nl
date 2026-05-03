#!/usr/bin/env python3
"""Walk category folders, emit images/manifest.js with one entry per project subfolder.
Run after adding/removing photos: `python3 build-manifest.py`"""
import json, os, re, urllib.parse
from pathlib import Path

ROOT = Path(__file__).parent
CATEGORIES = [
    ("verbouw",       "VERBOUW",       "Verbouw"),
    ("renovatie",     "RENOVATIE",     "Renovatie"),
    ("badkamers",     "BADKAMERS",     "Badkamers"),
    ("huisliften",    "HUISLIFTEN",    "Huisliften"),
    ("velux",         "VELUX",         "Velux"),
    ("overkappingen", "OVERKAPPINGEN", "Overkappingen"),
    ("projecten",     "PROJECTEN",     "Projecten"),
    ("archief",       "ARCHIEF",       "Archief"),
]
PHOTO_EXTS = {".jpg", ".jpeg", ".png", ".webp"}

def title_from_folder(name: str) -> str:
    s = name.replace("_", " ").replace("-", " ")
    # Drop redundant category prefixes ("archief", "project", "huislift" feel redundant on the tile label)
    s = re.sub(r"^(archief|project)\s+", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\s+", " ", s).strip()
    return s.title()

def url_path(p: Path) -> str:
    rel = p.relative_to(ROOT).as_posix()
    return "/".join(urllib.parse.quote(seg) for seg in rel.split("/"))

def collect_photos(folder: Path):
    photos = sorted(
        [f for f in folder.iterdir() if f.is_file() and f.suffix.lower() in PHOTO_EXTS],
        key=lambda f: f.name.lower()
    )
    cover = next((p for p in photos if p.stem.lower() == "cover"), None)
    cover_url = url_path(cover) if cover else (url_path(photos[0]) if photos else None)
    return [url_path(p) for p in photos], cover_url

manifest = {}
for key, dirname, label in CATEGORIES:
    cat_dir = ROOT / dirname
    if not cat_dir.is_dir():
        manifest[key] = {"label": label, "projects": []}
        continue
    projects = []
    for sub in sorted(cat_dir.iterdir(), key=lambda p: p.name.lower()):
        if not sub.is_dir(): continue
        photos, cover = collect_photos(sub)
        if not photos: continue
        projects.append({
            "slug": sub.name,
            "title": title_from_folder(sub.name),
            "cover": cover,
            "photos": photos,
        })
    manifest[key] = {"label": label, "projects": projects}

out = "window.RobaImages = " + json.dumps(manifest, ensure_ascii=False, indent=2) + ";\n"
(ROOT / "images" / "manifest.js").write_text(out, encoding="utf-8")

total_projects = sum(len(c["projects"]) for c in manifest.values())
total_photos = sum(len(p["photos"]) for c in manifest.values() for p in c["projects"])
print(f"Wrote images/manifest.js — {total_projects} projects, {total_photos} photos across {len(CATEGORIES)} categories")
for key, cat in manifest.items():
    print(f"  {key:14s} {len(cat['projects']):3d} projects, {sum(len(p['photos']) for p in cat['projects']):4d} photos")
