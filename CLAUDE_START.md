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
- *"Re-shoot the hero — replace `assets/hero.png` with the new file I'll put on the desktop."*
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

## State of the project as of last session (2026-05-03)

- ✅ Site live, HTTPS working
- ✅ GitHub repo + Netlify auto-deploy connected
- ✅ Netlify Forms enabled (but email notifications NOT yet configured)
- ✅ Photos: 80 projects, 728 photos across 8 categories
- ⏳ Pending: email notifications for form, Google Search Console, Google Business Profile, Lighthouse pass, privacy note
