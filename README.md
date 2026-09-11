# Realms of Legacy — NPC Builder

Standalone GitHub Pages site for the Realms of Legacy NPC creation tools.
Structured to match the Player Character Creator: a shared design system in
`styles.css`, shared chrome in `shared.js`, and one HTML + one JS file per tool.

## Files

| File | Purpose |
|---|---|
| `index.html` | Hub — links to the three tools |
| `npc.html` / `npc.js` | NPC Generator (Stat Tracker + Stat Block Generator tabs) |
| `veilstrider.html` / `veilstrider.js` | Veilstrider Stat Block Generator |
| `leviathan.html` / `leviathan.js` | Leviathan Stat Block Generator |
| `styles.css` | Shared design system — identical to the Character Builder's, plus a tool-chrome layer |
| `shared.js` | Starfield backdrop + nav dropdown, loaded by every page |
| `CNAME` | Custom domain — edit or delete before deploying |
| `.nojekyll` | Stops GitHub Pages running the files through Jekyll |

Each tool page also carries its own `<style>` block for tool-specific rules
(the stat block output, forms, tabs) — the same pattern `digital_sheet.html`
uses in the Character Builder.

## Deploying

1. Create a new repository and copy these files into its root.
2. Settings → Pages → deploy from branch, root folder.
3. Edit `CNAME` to the subdomain you want (currently
   `npcbuilder.realmsoflegacy.com`), or delete it to use the default
   `*.github.io` address, then add the matching DNS record.

## External dependencies

- **Google Fonts** — Alegreya SC, Cinzel Decorative, Crimson Pro, DM Sans, Literata.
- **html2canvas** (cdnjs) — used only by "Download Stat Block" to rasterise the
  stat block. Everything else works without it.

## Notes

- Stat block output keeps its original light print styling on purpose, so
  downloaded images stay legible on white.
- Each tool's JSON save format is specific to that tool and is not
  interchangeable with the others.
- Nothing is uploaded; saves are local files.
