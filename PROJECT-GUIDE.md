# Hridya Chopra — portfolio project guide

Private working notes. Not part of the public site.

## Current stage
**Stage 3: authoring tools built (2026-10-21).** Direction accepted 2026-10-21. Public pages complete with placeholders.
Next: owner handover (owner performs edits/saves/lab accept themselves), GitHub remote + Vercel deployment when authorised.

## Run locally
```
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # static output in dist/ (Vercel: Vite preset, output dist)
```

## Architecture
- Vite 5 + React 18 + react-router 6. SPA; `vercel.json` rewrites all routes to `index.html`.
- Content: `src/content/site.json` (identity, home, about, contact, projects). Items with `"scaffold": true` are unreviewed draft placeholders.
- Design settings: `src/content/settings.json` → CSS custom properties via `applySettings()`.
- Routes: `/`, `/work`, `/work/:slug`, `/about`, 404.
- Fonts self-hosted via @fontsource: Playfair Display 400/400 italic/500, Instrument Sans 400/500 (both SIL OFL).

## Visual direction (reference mode: SELECTED PARTS)
| Source | Element | Retained | Replaced / adapted |
| --- | --- | --- | --- |
| pramitranjan-portfolio.vercel.app | Motion | Scroll reveals (fade + small rise, ease-out), hover lifts/arrow nudges, a looping accent animation | Original code. No card carousel or dark/red palette; hero uses masked line-rise + a hand-drawn underline instead |
| baothiento.com | Minimalism | Warm off-white ground, small tracked uppercase nav, generous whitespace, quiet metadata | No pond hero, no card grid; work shown as a numbered editorial index with a cursor-following cover |
| Owner palette | Colour | Live since 2026-10-22: “Halfway — brighter” — background `#F7F8F7`, surfaces `#FDFDFD`, accent/headings `#17459F`, ink `#21395E`, secondary `#566783`, soft accent `#DDE7FA`, lines `#DBDEE0`. Previously cream `#F3EEE3` / cobalt `#2343B0` / navy `#16213F` (kept in History). | — |
| Owner type | Type | Playfair Display with italic contrast | Instrument Sans chosen as body face (owner to confirm) |

No official source repository found for either reference; all code is original.

## Content gaps (private)
- Real projects (titles, summaries, role, team, media) — two scaffold slots exist.
- Home intro line (not shown with the carousel hero).
- Portrait (upload the original photo; not cropped from a screenshot).
- LinkedIn URL and résumé (email is set). Phone deliberately left empty: not in the owner's list of public links — ask before adding.

## Checks run
Stage 1 (2026-10-21): Home and project-01 at 1440×900 and 375×812; no horizontal overflow at 375.
Stage 2 (2026-10-21):
- Work, About, project-02 and 404 rendered at 1440. Next-project loops 02 → 01; Back to Work works.
- Per-page titles/descriptions (editable in `site.json` → `meta`; project pages use title + summary).
- Keyboard: tab order runs project rows → onward link → footer; visible blue focus ring; Enter follows links.
- Motion-off rendering checked by injecting the same overrides as the `prefers-reduced-motion` rule (OS-level setting itself not emulated).
- `npm run build` passes; built output contains no authoring/workshop copy. `robots.txt` allows all.
- Not yet: sitemap, canonical and social-share image (need the production Vercel URL); phone pass of Work/About after these edits; Vercel deployment.

## Release blockers (placeholders)
Every `[bracketed]` item and grid media slot is draft scaffold. Before any public release, replace or agree to omit each one.

## Authoring tools (local only)
- `/lab` — design lab: live controls on the real pages (Phone 390 / Tablet 768 / Desktop 1440, true viewport widths in iframes, scaled to fit and labelled). Compare current vs exploration side by side, per-control reset, contrast check, change summary, notes for structural ideas. Save exploration → `authoring/presets/*.json`; export/import preset files (validated, older versions migrated). “Use this design” → `src/content/settings.json` (previous kept in `authoring/history/`). Working exploration also kept in browser storage.
- `/dashboard` — edit identity, statement, home intro, featured projects/order, projects (create/duplicate/delete/reorder, status, hide, slug with automatic redirect, details, cover, sections with images/hide/reorder), About (intro, bio, portrait, sections), contact links/résumé, page titles. Undo/redo, live draft preview, unsaved draft kept in browser storage with restore prompt, Save → `src/content/site.json` with revision check (conflict panel if the file changed), history snapshots (newest 60) with “Load into draft”, JSON backup export/import, release check listing placeholders.
- API: `authoring/server-plugin.js` (Vite dev server only). Uploads go to `public/media/` (15 MB max). Media deletion is not supported in the UI.
- Boundary: `/lab`, `/dashboard` and the API exist only under `npm run dev`; the production build contains none of it (checked by grep of `dist/`). On Vercel those URLs show the 404 page.
- Saving ≠ publishing: saves change local files only. Publishing will be Git commit + push → Vercel (not set up yet).
- Schema: content and settings are `schemaVersion: 2` (`src/content/schema.js`); v1 originals kept in `authoring/history/*-v1-before-migration.json`.

## Stage 3 checks run (2026-10-21)
Lab control changed the real renderer in preview (colour, hero size, hero variant); side-by-side at 390px; save preset; accept design wrote settings + snapshot; stale accept caught as conflict without page reload. Dashboard edit → live preview, undo/redo, reload recovery, save with slug change → redirect from old URL worked on public page, outside edit caught as conflict, History load + overwrite restored content, image upload shown in preview with alt-text prompt. All test changes reverted; content verified identical to the original.
Follow-up checks (2026-10-21): keyboard pass through lab and dashboard (visible focus everywhere; lab has a “Skip to design controls” link so keyboard users needn't tab through the preview; dashboard “Go” buttons say where they go). Both tools fit a 375px screen with no sideways scroll; previews scale down and say so; dashboard Save bar stays pinned on phones.
Not yet: owner handover (owner performs the routine actions), Git repository, Vercel deployment.

## Version history (Git)
- Local repository, branch `main`, first commit 2026-10-21. No remote yet; nothing pushed.
- Author identity is set for this repository only (`git config user.name/user.email`), not globally. Before pushing to a public GitHub repo, the owner may switch to GitHub’s private “noreply” email and amend the commit.
- Tracked: site source, content/settings JSON, `public/` assets (incl. future `public/media` uploads), authoring tools + API, `authoring/presets/` (saved explorations), Vercel config, this guide, workshop instruction files (not part of the public build).
- Ignored: `node_modules/`, `dist/`, `.vercel/`, `.env*`, `authoring/history/` (dashboard’s automatic save snapshots — local recovery only; commits are the durable history).
- Routine: after a session of dashboard/lab saves, review `git status` / `git diff`, then commit with a short message. Saving in the dashboard does not commit; committing does not publish. Once a GitHub remote is connected to Vercel, pushing `main` will publish.

## Home 3D carousel (added 2026-10-22)
- Owner asked for the Framer component `framer.com/m/infinite-3d-carousel-UXdsrF.js@yJUGNsIxfIt7742FGdlc` on the landing page.
- Inspected its source (framerusercontent module, revision yJUGNsIxfIt7742FGdlc): React + `framer` runtime (`addPropertyControls`, `useIsStaticRenderer`) + `framer-motion` (`useReducedMotion`); sample images are Framer-hosted stock. No licence, author or reuse notice. A shared Framer link allows use inside Framer; reuse of the code outside Framer is not established, so **no code was copied**.
- `src/components/Carousel3D.jsx` is an original implementation of the observed behaviour: five recycled card slots around a continuous position, slow autoplay, drag with momentum, settle on nearest card, side cards rotate/tilt/shrink/blur/fade. Added beyond the original: visible Pause/Play (WCAG 2.2.2), Previous/Next buttons, screen-reader announcement on manual moves, only the front card focusable, autoplay pauses on hover/focus/off-screen, reduced motion → no autoplay and no easing.
- Content: featured projects' covers, each linking to its case study. Placed directly under the hero. Dashboard → Home & identity: “Show the carousel” and “Move on its own”. Stored as `home.carousel` (defaults filled by `migrateSite`).
- Checked: desktop 1440 and phone 375 (no overflow, 44px buttons), Next/Previous/arrow keys, drag with momentum and no accidental project open, autoplay rate, dashboard toggle in preview, build excludes authoring code. Reduced-motion path reviewed in code; OS setting not emulated.
- If the owner confirms they hold rights to the Framer code (e.g. they authored it), it could be adapted directly instead; the current version needs no Framer runtime.

## Home hero variant: name + carousel (added 2026-10-22)
- New design setting `variants.heroLayout`: `type` (accepted: eyebrow, name, statement, intro) or `carousel` (only the name on one line + the project carousel, no supporting text; carousel shows counter + Previous/Pause/Next, no project title). Falls back to `type` if the carousel is switched off or no projects are featured.
- Lab control: Layout variants → “Home first screen”. Saved as exploration **“Name + carousel hero”** (`authoring/presets/name-carousel-hero-*.json`).
- **Accepted by the owner 2026-10-22** (“change the current to the carousel on the landing page”): `variants.heroLayout` is now `carousel` in `src/content/settings.json`. Previous design (typographic hero) kept as a history snapshot and reachable by switching “Home first screen” back in the lab. With this layout the home intro text and statement are no longer shown on Home (still stored and editable).
- Lab/dashboard previews now use real device screens (phone 390×844, tablet 768×1024, desktop 1440×900) scaled to fit, so full-height layouts preview truthfully. Lab/dashboard fill defaults for settings added after the file was saved.
- Checked at 1440×900 (name + carousel fit in the first screen) and 375×812 (no sideways scroll; controls on one row).
- 2026-10-22 (owner requests): hero carousel has no visible controls (no Pause, no 01/02 counter, no arrows) — drag, or Tab to the front card and use ←/→. Name moved to the top of the first screen with the carousel filling the space below; the name’s reveal mask now leaves room for the y/p descenders. Accessibility trade-off: with no Pause button, autoplay stops for good once a visitor drags or uses an arrow, and still pauses on hover/focus/off-screen; reduced-motion visitors see no movement. If stricter compliance is wanted, switch “Move on its own” off in the dashboard. The band variant (unused) keeps its counter, title and Pause.

## About page format (2026-10-22)
- Owner supplied screenshots of their earlier site (hridyachopra.vercel.app) and asked for the About page in that format. Layout reproduced in this site's design tokens: left column portrait + contact lines (Phone/Email/LinkedIn/Résumé, each only if filled) + Skills/Tools pills; right column “About Me” paragraphs with a side rule, Education and Experience timelines; closing “Want to connect?” with the email. On phones: portrait/contact → About/Education/Experience → Skills/Tools.
- Content transcribed from the screenshots (owner's own text): three About paragraphs, SCAD + HXLS, Ixigo + Social Panga internships, skills, tools, email, closing line.
- Content schema v3: `about` = heading, paragraphs[], portrait, education[], experience[], skills[], tools[], extra[], connect{heading,text}; `contact.phone` added. `migrateSite` converts v2 (backup: `authoring/history/site-v2-before-about-v3.json`, local only). Home About teaser now uses the first paragraph.
- Dashboard About tab rebuilt for these fields (paragraphs, timeline entries with reorder/hide/remove, comma lists, closing text); Contact tab has Phone. Fixed comma-list fields dropping a typed comma (also project Tags).
- Checked: desktop 1440 layout metrics, phone 375 full scroll (no overflow), dashboard edit → preview → undo.
- Spacing matched to the reference screenshot (2026-10-22), measured as fractions of content width and verified in the browser at 1440 and 1000 wide: content 84.7% of the window (side margins 7.65vw), right column starts at 31%, portrait 20% wide at 3:4 and top-aligned with “About Me”, 2px mid-blue rule (accent mixed 45% into the background) with ~2% text inset, timeline line on the same axis, headings 3.3% of content width, section gaps ≈ 2× heading size. The left column has a 230px minimum and tags shrink slightly between 861–1180px so nothing overflows; phones stack as before.

## Colour change (2026-10-22)
- Sampled the owner's earlier-site screenshots (background `#EDF3FC`, headings `#07468E`, body `#2C527E`) and saved as lab exploration “Screenshot blues” (secondary text darkened to `#516A8E` for 4.5:1 contrast).
- “Halfway cream–blue”: each colour blended 50/50 in OKLab (background `#F0F1F0`). “Halfway — brighter”: background/surfaces/lines/soft accent lightened, text unchanged (contrast body 10.9, headings 8.3, secondary 5.4).
- Owner chose “Halfway — brighter” as the live design; applied colours only (other accepted settings unchanged). CSS fallback colours and favicon updated to match. All three explorations kept in `authoring/presets/`.
- Lab fix: the saved-explorations list refreshes when the lab regains focus or the list is opened (previously loaded once, so explorations saved elsewhere didn't appear).
