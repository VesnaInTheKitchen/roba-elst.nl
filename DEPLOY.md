# Deploy: Roba Elst → Netlify

## One-time deploy (drag-and-drop)

1. Run **`zsh make-deploy-zip.sh`** from the project root (or the command at the bottom of this file). It builds `roba-elst-deploy.zip` excluding the design bundle, system files, and the unused `hero section.png`.
2. Open <https://app.netlify.com/drop>.
3. Drag `roba-elst-deploy.zip` onto the page.
4. Netlify gives you a temporary URL like `https://something-random.netlify.app/`. Open it to verify.

## Connect the `roba-elst.nl` domain

1. In Netlify, open the new site → **Domain settings** → **Add a domain** → enter `roba-elst.nl`.
2. Netlify shows DNS records to set. Two options:
   - **Easiest:** point your domain's nameservers at Netlify (Netlify shows you which). Lets Netlify handle DNS + automatic HTTPS.
   - **Or keep DNS where it is** (e.g. yourhosting.nl): set an `A` record for `roba-elst.nl` to Netlify's load balancer (`75.2.60.5`) and a `CNAME` for `www.roba-elst.nl` to your `*.netlify.app` host.
3. Wait for the green padlock in Netlify (usually under 10 minutes after DNS resolves).

## Re-deploying after edits

1. Edit files locally.
2. Run `python3 build-manifest.py` if you changed photos.
3. Run `zsh make-deploy-zip.sh` again.
4. In Netlify, open the site → **Deploys** → drag the new ZIP onto the deploys page.

## Re-build manifest only

```sh
python3 build-manifest.py
```

Re-reads every category folder (VERBOUW, BADKAMERS, …), picks the cover, and rewrites `images/manifest.js`. To override a project's cover, drop a file named `cover.jpg` (or `.png`/`.webp`) into that project's subfolder before rebuilding.

## Notes & gotchas

- The contact form posts to `mailto:info@roba-elst.nl`. It opens the visitor's mail client. To accept submissions without that step (recommended for production), enable **Netlify Forms**: change the form tag to `<form name="contact" method="POST" data-netlify="true">` and add a hidden honeypot. I can wire that up when you're ready.
- The site references roughly **530 MB of project photos** (mostly in `ARCHIEF/`). Netlify will host them, but the first deploy takes a while to upload. Bandwidth is fine on the free tier (100 GB / month).
- Headers and redirects live in `_headers` and `_redirects`. `netlify.toml` just sets the publish dir.
- Photos are lazy-loaded but not optimized. If load speed becomes an issue, batch-resize originals to max 1600 px wide; ~70 % JPEG quality keeps them under 200 KB each.

## What's in the deploy ZIP

Included:
- `index.html`, `styles.css`, `app.js`
- `images/` (manifest)
- `assets/` (logo, hero photo)
- All category folders (`VERBOUW/`, `BADKAMERS/`, etc.)
- `robots.txt`, `sitemap.xml`
- `netlify.toml`, `_headers`, `_redirects`

Excluded:
- `design/` (Claude Design handoff)
- `build-manifest.py` (build tool, not needed on the server)
- `hero section.png` (unused; we use `assets/hero.png`)
- `.DS_Store`, `__pycache__`, etc.

## ZIP build command

If you don't want to run the script, this is the same command:

```sh
zip -r roba-elst-deploy.zip . \
  -x '*.DS_Store' \
  -x 'design/*' \
  -x '__pycache__/*' \
  -x 'hero section.png' \
  -x 'roba-elst-deploy.zip' \
  -x '.git/*' \
  -x '.gitignore' \
  -x 'DEPLOY.md' \
  -x 'build-manifest.py' \
  -x 'make-deploy-zip.sh'
```
