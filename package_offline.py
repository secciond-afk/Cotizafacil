#!/usr/bin/env python3
import os
import zipfile
import shutil

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
ZIP_NAME = "cotizafacil-pro-offline.zip"
OUTPUT_ZIP_ROOT = os.path.join(ROOT_DIR, ZIP_NAME)
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
DIST_DIR = os.path.join(ROOT_DIR, "dist")

# Ensure public dir exists
os.makedirs(PUBLIC_DIR, exist_ok=True)
OUTPUT_ZIP_PUBLIC = os.path.join(PUBLIC_DIR, ZIP_NAME)
OUTPUT_ZIP_DIST = os.path.join(DIST_DIR, ZIP_NAME) if os.path.exists(DIST_DIR) else None

# Folders to include
INCLUDE_DIRS = [
    "src",
    "database",
    "dist",
    "assets",
    "public"
]

# Files to include
INCLUDE_FILES = [
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "index.html",
    "metadata.json",
    ".env.example",
    ".gitignore",
    "local-server.js",
    "INICIAR_LOCAL.bat",
    "iniciar_local.sh",
    "INSTRUCCIONES_OFFLINE.md",
    "README_OFFLINE.md",
]

EXCLUDE_PATTERNS = [
    "node_modules",
    ".git",
    "cotizafacil-pro-offline.zip",
    "package_offline.py",
    ".DS_Store"
]

def should_exclude(rel_path):
    parts = rel_path.split(os.sep)
    for pattern in EXCLUDE_PATTERNS:
        if pattern in parts or rel_path.endswith(pattern):
            return True
    return False

print(f"Creando archivo ZIP offline: {OUTPUT_ZIP_ROOT} ...")

with zipfile.ZipFile(OUTPUT_ZIP_ROOT, "w", zipfile.ZIP_DEFLATED) as zipf:
    # 1. Add individual files
    for filename in INCLUDE_FILES:
        filepath = os.path.join(ROOT_DIR, filename)
        if os.path.isfile(filepath):
            arcname = os.path.join("cotizafacil-pro-offline", filename)
            zipf.write(filepath, arcname)
            print(f"  + Archivo: {filename}")

    # 2. Add directories
    for dirname in INCLUDE_DIRS:
        dirpath = os.path.join(ROOT_DIR, dirname)
        if os.path.isdir(dirpath):
            for root, dirs, files in os.walk(dirpath):
                # Filter out excluded dirs in-place
                dirs[:] = [d for d in dirs if not should_exclude(d)]
                for file in files:
                    full_file = os.path.join(root, file)
                    rel_to_root = os.path.relpath(full_file, ROOT_DIR)
                    if not should_exclude(rel_to_root):
                        arcname = os.path.join("cotizafacil-pro-offline", rel_to_root)
                        zipf.write(full_file, arcname)
            print(f"  + Directorio: {dirname}/")

# Copy the generated zip to public/ and dist/ so Vite and local-server can serve it directly
shutil.copyfile(OUTPUT_ZIP_ROOT, OUTPUT_ZIP_PUBLIC)
print(f"Copiado a: {OUTPUT_ZIP_PUBLIC}")

if OUTPUT_ZIP_DIST:
    shutil.copyfile(OUTPUT_ZIP_ROOT, OUTPUT_ZIP_DIST)
    print(f"Copiado a: {OUTPUT_ZIP_DIST}")

file_size_mb = os.path.getsize(OUTPUT_ZIP_ROOT) / (1024 * 1024)
print(f"\n[ÉXITO] Archivo ZIP generado con éxito!")
print(f"Ruta: {OUTPUT_ZIP_ROOT}")
print(f"Tamaño: {file_size_mb:.2f} MB")
