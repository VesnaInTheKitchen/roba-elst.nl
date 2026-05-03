# Roba Elst — Site handoff

Live site: <https://roba-elst.nl/>
Hosted on: **Netlify** (auto-deploy from GitHub on `git push`)
Source: <https://github.com/VesnaInTheKitchen/roba-elst.nl>
Built: May 2026 from a Claude Design handoff bundle.

---

## Where things live

| Where | What |
|---|---|
| `roba-elst.nl` (domain) | Registered at **yourhosting.nl** |
| DNS records | Managed at **yourhosting.nl** (apex + www → Netlify load balancer `75.2.60.5`; everything else still yourhosting) |
| Website | **Netlify** — site name `benevolent-unicorn-faaad1` |
| Email `info@roba-elst.nl` | Still **yourhosting.nl** (MX → `*.yourfilter.nl`) |
| Source code (working copy) | `~/Desktop/roba-elst.nl/` on this Mac |
| Source backup + auto-deploy trigger | <https://github.com/VesnaInTheKitchen/roba-elst.nl> |
| Netlify dashboard | <https://app.netlify.com/> |
| Form submissions | Netlify dashboard → site → **Forms** tab |

---

## Day-to-day workflow

After ANY change (text, photos, colours), the cycle is:

```sh
cd ~/Desktop/roba-elst.nl

# Only if photos were added/removed/renamed:
python3 build-manifest.py

git add .
git commit -m "what you changed"
git push
```

Netlify auto-deploys ~1 min after the push. Watch progress at app.netlify.com → site → Deploys.

> The old `make-deploy-zip.sh` + drag-zip flow is no longer used. The script is still in the repo as a fallback in case GitHub/Netlify is unreachable.

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
├── RENOVATIE/              #   folder names with dashes/underscores get
├── VELUX/                  #     auto-titled (dakkapel-augustus-2020 →
├── OVERKAPPINGEN/          #     "Dakkapel Augustus 2020")
├── PROJECTEN/
├── ARCHIEF/
├── design/                 # Claude Design source (kept for reference, gitignored)
├── build-manifest.py       # rebuilds images/manifest.js from folders
├── make-deploy-zip.sh      # legacy fallback (drag-and-drop deploy)
├── HANDOFF.md              # this file
├── netlify.toml + _headers + _redirects   # Netlify config
└── robots.txt + sitemap.xml                # SEO
```

---

## How to make changes

### Replace, add, or remove photos

1. Edit folders inside `BADKAMERS/`, `HUISLIFTEN/`, etc.
   - Each subfolder = one project tile.
   - File named `cover.jpg` (or `.png` / `.webp`) becomes the tile cover. Otherwise the alphabetically-first photo is used.
   - Folder name becomes the project title (dashes and underscores → spaces, then Title Case).
2. Open Terminal, `cd ~/Desktop/roba-elst.nl`.
3. Run:
   ```sh
   python3 build-manifest.py
   git add . && git commit -m "Update photos" && git push
   ```
4. Wait ~1 min. Site updates automatically.

### Edit text, phone number, email, colours

1. Open `index.html` for text changes (search for what you want to change, e.g. `06-20 356 519`, `info@roba-elst.nl`, `Elst, Nederland`).
2. Open `styles.css` for colour or layout changes (top of file has CSS variables: `--red`, `--bg`, `--off-white`, etc.).
3. `git add . && git commit -m "..." && git push`.

### Re-shoot the hero photo

1. Replace `assets/hero.png` (any name and size — keep it under 2 MB).
2. If you used a different filename, update the line `url('assets/hero.png')` in `styles.css`.
3. Commit + push.

### Anything bigger (new section, new feature)

Open Claude Code in this folder and say: *"I want to add X to the Roba Elst site"*. Reference this file.

---

## Useful URLs

| What | URL |
|---|---|
| Live site | <https://roba-elst.nl/> |
| GitHub repo | <https://github.com/VesnaInTheKitchen/roba-elst.nl> |
| Netlify dashboard | <https://app.netlify.com/> |
| Netlify Forms (submissions) | Netlify → site → Forms |
| yourhosting.nl admin | <https://account.yourhosting.nl/> |
| Google Search Console | <https://search.google.com/search-console> |

---

## Recovering from problems

| Symptom | Fix |
|---|---|
| Site shows old content after a change | Hard refresh (Cmd+Shift+R). Wait 60 s for Netlify CDN to propagate. |
| `git push` rejected | Probably someone (or you elsewhere) pushed first. Run `git pull --rebase` then `git push`. |
| Netlify deploy failed | Netlify → site → Deploys → click the failed deploy → read the log. Usually a typo in `_redirects` or `_headers`. |
| "Not Secure" warning in Chrome | `chrome://net-internals/#dns` → Clear host cache. Then `chrome://net-internals/#hsts` → delete `roba-elst.nl`. Reopen tab. |
| Email not arriving | Check yourhosting MX records still resolve: `dig MX roba-elst.nl` should show `*.yourfilter.nl`. If not, restore them at yourhosting. |
| `python3 build-manifest.py` errors | Make sure you're in `~/Desktop/roba-elst.nl/`. Check that all category folders exist. |
| Need to roll back | Netlify → Deploys → find an older deploy → click **Publish deploy**. Instant revert (doesn't touch the GitHub repo). |
| macOS created `* 2` duplicate folders again | `find . -type d -name "* 2" -not -path "./design/*" -delete` (then rebuild manifest). |

---

## What's set up

- ✅ HTTPS (Let's Encrypt, auto-renews via Netlify)
- ✅ www → apex redirect (`_redirects`)
- ✅ Security headers (`_headers`: HSTS, X-Frame-Options, etc.)
- ✅ Cache headers (HTML no-cache, photos immutable 1y)
- ✅ Netlify Forms — contact form posts to dashboard. Submissions appear at Netlify → Forms tab.
- ✅ SEO: meta tags, OG/Twitter cards, JSON-LD LocalBusiness, sitemap.xml, robots.txt
- ✅ Velux® trademark rendered everywhere it appears
- ✅ Dynamic gallery from folder structure with lightbox + keyboard nav

## What's deliberately NOT set up

- **Email notifications for form submissions** — see "Optional next steps" below.
- **Analytics** — no tracking. Add Plausible, Fathom, or Netlify Analytics if needed.
- **Blog / news** — none. Could add later as static pages.
- **Multi-language** — site is Dutch only.

---

## Optional next steps

1. **Email notifications for the contact form** — Netlify dashboard → Forms → contact → Form notifications → Add notification → Email → `info@roba-elst.nl`.
2. **Submit sitemap to Google** — <https://search.google.com/search-console> → Add property `roba-elst.nl` → verify via DNS TXT (yourhosting.nl) → Sitemaps → submit `sitemap.xml`.
3. **Google Business Profile** — <https://business.google.com> → claim "Roba Bouwbedrijf Elst". Maps + local search.
4. **Privacy note** — small `/privacy.html` page linked from footer (1-line GDPR compliance).
5. **Lighthouse audit** — Chrome DevTools → Lighthouse → run on the live URL. Aim for ≥90 across the board.

---

## Credits

- Design: Vesna in Claude Design.
- Build: Claude Code (Sonnet/Opus).
- Photos: Roba Bouwbedrijf project archive.
- Stack: vanilla HTML/CSS/JS, no framework. Hosted on Netlify free tier.
