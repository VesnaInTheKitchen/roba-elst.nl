#!/usr/bin/env zsh
# Build a clean ZIP for drag-and-drop deploy to Netlify.
# Usage: zsh make-deploy-zip.sh
set -e
cd "$(dirname "$0")"

OUT="roba-elst-deploy.zip"
rm -f "$OUT"

zip -r "$OUT" . \
  -x '*.DS_Store' \
  -x 'design/*' \
  -x '_originals_backup/*' \
  -x '__pycache__/*' \
  -x 'hero section.png' \
  -x '*.zip' \
  -x '.git/*' \
  -x '.gitignore' \
  -x 'DEPLOY.md' \
  -x 'build-manifest.py' \
  -x 'make-deploy-zip.sh' \
  > /tmp/zip.log

SIZE=$(du -h "$OUT" | awk '{print $1}')
echo "Built $OUT ($SIZE)"
echo "Drag onto https://app.netlify.com/drop  (or onto your site's Deploys page for re-deploys)"
