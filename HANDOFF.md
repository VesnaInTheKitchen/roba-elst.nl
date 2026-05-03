# Roba Elst — Site handoff

Live site: <https://roba-elst.nl/>
Hosted on: **Netlify** (drag-and-drop deploy)
Built: May 2026 from a Claude Design handoff bundle.

---

## Where things live

| Where | What |
|---|---|
| `roba-elst.nl` (domain) | Registered at **yourhosting.nl** |
| DNS records | Managed at **yourhosting.nl** (apex + www → Netlify load balancer `75.2.60.5`; everything else still yourhosting) |
| Website | **Netlify** — site name `benevolent-unicorn-faaad1` |
| Email `info@roba-elst.nl` | Still **yourhosting.nl** (MX → `*.yourfilter.nl`) |
| Source code | `~/Desktop/roba-elst.nl/` on this Mac |
| Netlify dashboard | <https://app.netlify.com/> |

---

## What's cancellable, what's not

After moving the site to Netlify, you can drop WordPress but **must keep domain + email** at yourhosting.

✅ KEEP at yourhosting:
- Domain registration (`roba-elst.nl`)
- DNS hosting
- Email hosting (`info@roba-elst.nl`)

❌ CANCEL:
- WordPress hosting plan (the site portion)
- Elementor license
- Any paid WordPress plugins

> Most Dutch hosters bundle hosting + email. Before cancelling, ask yourhosting support: *"I want to keep my domain and email at yourhosting but stop the WordPress hosting. Which package do I need to switch to?"* Email-only packages are usually €2–4/mo.

---

## Project structure

```
~/Desktop/roba-elst.nl/
├── index.html              # the page
├── styles.css              # all styling
├── app.js                  # interactivity (lightbox, hamburger, etc.)
├── images/
│   └── manifest.js         # auto-generated; lists every project + photos
├── assets/
│   ├── Roba_logo.png       # nav logo + favicon
│   └── hero.png            # hero background photo
├── BADKAMERS/              # source folders for galleries
├── HUISLIFTEN/             #   each subfolder = one project
├── VERBOUW/                #   drop a `cover.jpg` to pick the tile photo
├── RENOVATIE/
├── VELUX/
├── OVERKAPPINGEN/
├── PROJECTEN/
├── ARCHIEF/
├── _originals_backup/      # uncompressed photo backup (delete when confident)
├── design/                 # Claude Design source (kept for reference)
├── build-manifest.py       # rebuilds images/manifest.js from folders
├── make-deploy-zip.sh      # builds roba-elst-deploy.zip for upload
├── DEPLOY.md               # full deploy instructions
├── HANDOFF.md              # this file
├── netlify.toml + _headers + _redirects   # Netlify config
├── robots.txt + sitemap.xml                # SEO
└── roba-elst-deploy.zip    # latest deploy artefact (built by the script)
```

---

## How to make changes

### Replace, add, or remove photos

1. Edit folders inside `BADKAMERS/`, `HUISLIFTEN/`, etc.
   - Each subfolder = one project tile.
   - Files named `cover.jpg` (or `.png`/`.webp`) become the tile cover.
   - Folder name becomes the project title (with auto-titlecasing).
2. Open Terminal, `cd ~/Desktop/roba-elst.nl`.
3. Run:
   ```sh
   python3 build-manifest.py
   zsh make-deploy-zip.sh
   ```
4. Open <https://app.netlify.com/> → your site → **Deploys** tab → drag `roba-elst-deploy.zip` onto the page.
5. Wait ~2 minutes for the deploy. Site updates automatically.

### Edit text, phone number, email, colours

1. Open `index.html` for text changes (search for what you want to change, e.g. `06-20 356 519`, `info@roba-elst.nl`, `Elst, Nederland`).
2. Open `styles.css` for colour or layout changes (top of file has CSS variables: `--red`, `--bg`, `--off-white`, etc.).
3. Run:
   ```sh
   zsh make-deploy-zip.sh
   ```
4. Drag the new ZIP onto Netlify Deploys.

### Re-shoot the hero photo

1. Replace `assets/hero.png` (any name and size — keep it under 2 MB).
2. If you used a different filename, update the line `url('assets/hero.png')` in `styles.css`.
3. Re-zip + redeploy.

### Anything bigger (new section, new feature)

Open this same conversation in Claude (or a new one), say: *"I want to add X to the Roba Elst site, project lives at ~/Desktop/roba-elst.nl"*. Reference this file.

---

## Useful URLs

| What | URL |
|---|---|
| Live site | <https://roba-elst.nl/> |
| Netlify dashboard | <https://app.netlify.com/> |
| yourhosting.nl admin | <https://account.yourhosting.nl/> |
| Drag-and-drop new deploys | Netlify → site → Deploys → drag ZIP |
| First-time drag-drop | <https://app.netlify.com/drop> |

---

## Recovering from problems

| Symptom | Fix |
|---|---|
| Site shows old content after a change | Hard refresh (Cmd+Shift+R). Wait 60 s for Netlify CDN to propagate. |
| "Not Secure" warning in Chrome | `chrome://net-internals/#dns` → Clear host cache. Then `chrome://net-internals/#hsts` → delete `roba-elst.nl`. Reopen tab. |
| Email not arriving | Check yourhosting MX records still resolve: `dig MX roba-elst.nl` should show `*.yourfilter.nl`. If not, restore them at yourhosting. |
| `python3 build-manifest.py` errors | Make sure you're in `~/Desktop/roba-elst.nl/`. Check that all category folders exist. |
| ZIP too large | Delete `_originals_backup/` (saves 252 MB). Make sure no stray `roba-elst-deploy*.zip` files in the project folder. |
| Need to roll back | Netlify → Deploys → find an older deploy → click **Publish deploy**. Instant revert. |

---

## What's deliberately NOT set up

- **Real form submissions** — currently the contact form opens the visitor's email client (`mailto:`). For real form-to-inbox handling, switch to Netlify Forms (5 min change).
- **Analytics** — no tracking. Add Plausible, Fathom, or Netlify Analytics if needed.
- **Blog / news** — none. Could add later as static pages.
- **Multi-language** — site is Dutch only.

---

## Credits

- Design: Vesna in Claude Design.
- Build: Claude Code (Sonnet/Opus).
- Photos: Roba Bouwbedrijf project archive.
- Stack: vanilla HTML/CSS/JS, no framework. Hosted on Netlify free tier.
