# How to start a new Claude Code session for this project

Open Claude Code in this folder (`~/Desktop/roba-elst.nl/`) and paste the prompt below.

---

## Paste this:

```
This is the Roba Bouwbedrijf Elst site. Live at https://roba-elst.nl/, source on
GitHub at https://github.com/VesnaInTheKitchen/roba-elst.nl, hosted on Netlify
with auto-deploy from GitHub.

Before doing anything: read HANDOFF.md in full — it covers the project structure,
deploy flow, where DNS/email/domain live, and known gotchas.

Workflow rule: any change to text, photos, or styling is shipped via:
  python3 build-manifest.py    # only if photos changed
  git add . && git commit -m "..." && git push
Netlify auto-deploys ~1 min later. The drag-zip flow is retired.

Today's task: <DESCRIBE WHAT YOU WANT TO CHANGE>
```

---

## Common tasks (drop into the `<DESCRIBE…>` line)

- *"Update the phone number from X to Y everywhere it appears."*
- *"Add a new project folder under VERBOUW called `<name>` with photos I just dropped in there. Pick a sensible cover."*
- *"Re-shoot the hero — replace `assets/hero.jpg` with the new file I'll put on the desktop."* (resize to ≤1920w, JPG quality ~75, target ≤500 KB)
- *"Change the red accent colour from `#d12b2b` to `<new hex>`."*
- *"Add a section about <new service> after Overkappingen."*
- *"Set up email notifications for the Netlify contact form to info@roba-elst.nl."*
- *"Run a Lighthouse audit on the live site and fix the top 3 issues."*

---

## What NOT to ask Claude to do

These are deliberately user-only (per safety rules) — Claude will refuse:

- Cancel/modify hosting accounts, billing, or DNS
- Click "Send" on emails (Claude can draft them, you click send)
- Enter credit card or banking info anywhere
- Modify Netlify access permissions or share repos
- Delete deploys or empty trash without confirmation

---

## State of the project as of last session (2026-05-05)

- ✅ Site live, HTTPS working
- ✅ GitHub repo + Netlify auto-deploy connected
- ✅ Netlify Forms enabled (email notifications still NOT configured — see #1 below)
- ✅ Photos: 80 projects, 730 photos across 8 categories
- ✅ Privacy page at `/privacy.html`, linked from footer, in sitemap
- ✅ Mobile editorial polish (accordion sections, photo-backed bars, marquee under hero)
- ✅ Performance pass: logo 3.5MB → 45KB, hero PNG → 487KB JPG, fonts non-blocking,
     filmstrip + marquee deferred. Lighthouse desktop: Perf 85 / A11y 95 / BP 100 / SEO 100.
- ✅ Google Search Console: domain property verified, sitemap submitted
- ✅ Google Business Profile already exists (review/refresh recommended — see HANDOFF)
- ⏳ Pending:
  - Email notifications for the contact form (Netlify dashboard, 1 min)
  - GBP refresh: confirm website URL, categories, photos, ask for reviews
  - Optional perf polish: hero `<link rel=preload>` and/or batch convert covers to WebP

## Gotchas to remember

- **macOS Finder/iCloud creates `* 2` duplicate files and folders** that bloat the repo.
  `.gitignore` now blocks them, but if you ever see them in `git status`, run:
  `find . -type d -name "* 2" -not -path "./design/*" -not -path "./_originals_backup/*" -delete`
- **Always run `python3 build-manifest.py` after changing photos** — gallery is generated from folder structure.
- **Never commit `assets/hero.png` again** — it's now `hero.jpg`. Don't accidentally restore the 2 MB original.
- **Netlify free tier: 300 build credits/month, 100 form submissions/month, 100 GB bandwidth.**
  The `Sir Henry catering` team holds three sites (Roba, Sir Henry, plus one auto-named).
  Heavy iteration days can burn through credits — once stable, monthly use is ~10–20 min.
