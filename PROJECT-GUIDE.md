# Hridya Chopra — portfolio project guide

Private working notes. Not part of the public site.

## Current stage
**Stage 3: authoring tools built (2026-10-21).** Direction accepted 2026-10-21. Public pages complete with placeholders.
**Live: https://hridyachopra.vercel.app (deployed 2026-10-25).**
Next: optional GitHub remote for automatic deploys; sitemap/canonical/social image now that the URL is known.

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
| Owner palette | Colour | Live since 2026-10-22: “Blue tint + ripples” — background `#F3F8FE`, surfaces `#FBFDFF`, lines `#D7DEE8` (otherwise as “Halfway — brighter”: accent/headings `#17459F`, ink `#21395E`, secondary `#566783`, soft accent `#DDE7FA`, lines `#DBDEE0` before the tint). Previously cream `#F3EEE3` / cobalt `#2343B0` / navy `#16213F` (kept in History). | — |
| Owner type | Type | Playfair Display (with italic contrast) + Instrument Sans site-wide; the About page uses DM Serif Display + DM Sans (from the owner's earlier site). A site-wide switch to the DM pairing was tried on 2026-10-22 and reverted at the owner's request (“go back to previous fonts”). | — |

No official source repository found for either reference; all code is original.

## Content gaps (private)
- Home intro line (not shown with the carousel hero).
- Phone deliberately left empty on the site (not in the owner's list of public links) — note the résumé PDF itself shows the phone number.
- Owner to review: Franklin's card summary says “neighborhood coffee shop” (from the old home page) while the case study says “restaurant”; the résumé calls the book initiative “KitabX” while the case study says “Xchange”; the Xchange research image shows a handwritten survey with third parties' names/phone numbers and a WhatsApp message naming people (already public on the old site) — consider blurring.

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

## Blue tint + background ripples (live since 2026-10-22)
- New design setting `variants.ripples` (`off` default / `on`), lab control “Ripples when clicking the background”. `src/components/Ripples.jsx`: on pointerdown on the page background (not links, buttons, form fields, project rows or the carousel) a small circular water ripple plays (owner's reference: top-down water ripples) — a 10px glossy drop pops, then two concentric rings up to 90px wide, each with a light edge and soft accent shade, spread and fade in ~1.3s — on a fixed layer behind the content; max 5 ripples at once; elements removed after animating; disabled under reduced motion. Original code (the idea is reminiscent of the pond on baothiento.com; none of its code used).
- Lab exploration “Blue tint + ripples”: background `#F7F8F7` → `#F3F8FE`, surfaces `#FBFDFF`, lines `#D7DEE8` (OKLab hue shift, same lightness), ripples on. Contrast unchanged (body 10.9, headings 8.2, secondary 5.4).
- Checked: background click creates rings, link click doesn't, rings clean up; rings render behind content (frozen mid-animation capture at 375px).
- Accepted by the owner 2026-10-22 (“Make the blue tint and ripples live and commit”): colours from the exploration plus `variants.ripples: on`; CSS fallbacks and favicon synced. Verified on the live About page after a fresh load: background `#F3F8FE`; background click = 1 drop + 2 rings; link click = none; non-link content (e.g. a skill tag) ripples; all ripple elements removed after fading.

## Water background (live since 2026-10-22)
- New design setting `variants.background` (`plain` default / `water`), lab control “Page background”. `src/components/WaterBackground.jsx`: a fixed canvas behind everything (z-index −2, under the ripples) drawing a slowly moving water surface — interfering sine waves for a faint blue swell plus thin bright caustic bands — at 1/6 screen resolution, scaled up with a 3px blur, redrawn at ~30fps; pauses when the tab is hidden; reduced motion shows a still frame. Colour follows the accent setting. Original code.
- Lab exploration “Water background” = live design + water background (ripples still on).
- Checked on Home (1000×650) and About (375×812): text/cards stay crisp on top; page kept ~120fps rAF in the dev browser while animating. Not yet checked on a real phone for battery/heat.
- Accepted by the owner 2026-10-22 (“add this on the final site”): `variants.background: water` in the live settings. Verified on the live site after a fresh load: water canvas on Home (1000×650) and About (375×812, no horizontal overflow), background click still makes a ripple (drop + 2 rings) that clears after fading. Still unverified on a real phone (battery/heat); switch “Page background” back to “Plain colour” in the lab if it feels heavy.
- 2026-10-22 (owner request “remove the ripples”): `variants.ripples` set to `off` in the live settings; water background stays on. Ripple code and the lab switch remain, so they can be turned back on in the lab. Verified: no ripple layer on the live Home page; water canvas present.
- 2026-10-22 (owner request): water limited to the landing hero — `variants.background: waterHero` (lab option “Moving water in the landing hero only”; `water` = every page still available). `<WaterBackground contained />` sits inside `.hero-c` (or the typographic `.hero`), sized to the section, and fades out over the bottom 28% via a mask; other sections and pages have the plain background (About verified: no water). Hero carousel enlarged (`--w: clamp(300px, min(48vw, 62vh), 760px)`; phones 86vw) and moved directly under the name — cards 558px at 1440×900 (was ~450px), 323px at 375. Phone hero gets 72px bottom padding so the fade has room. Carousel stage now clips only horizontally so card shadows fade instead of ending in a hard line. No horizontal overflow at 1440 or 375.

## About page rebuilt from the owner's own site (2026-10-22)
- Owner asked to use the About page at hridyachopra.vercel.app/about (their own Next.js site) — scroll animation, font size ratios “and everything else” (CLOSE LAYOUT of their own work). Inspected the live page at 1440×900 and 375×812: measured positions, sizes and computed styles; scroll animation = framer-motion whileInView per block, opacity 0 + translateY(16px) → visible, ~0.5s ease-out (cubic), once.
- Implemented as original code in `src/pages/About.jsx` (`.ab*` classes): side padding 32/64/96px (≥768/≥1024), content max 1280px, grid 300px | 96px | 1fr from 1024px; portrait 260×347 (3:4) radius 16 with 2px border; contact lines 16/24, 8px apart, bold labels; Skills/Tools labels 13px caps; tags 12px caps, 8×20 padding, 2px border, 8px gaps; headings 32/48 serif (mb 24/32); quote 4px rule, 24px inset, 16/26 text, 16px gaps; timelines 2px line, 12px dots at −7px, 24px inset, 32px apart; dates 12px caps, titles 22/33 serif, details 13px, org 13px italic; sections 64px apart; closing: 1px top border, 48/96 padding, heading mb 12, 16/24 text, 22px serif email. Block-level fade-up 16px / 0.5s cubic-bezier(0.33,1,0.68,1).
- Fonts (owner: “use the same font as before”): the About page now uses the original's DM Serif Display 400 (headings) and DM Sans 400/400 italic/700/800 (text), self-hosted via @fontsource 5.1.0 (OFL-1.1), scoped to `.ab`; the rest of the site keeps Playfair Display/Instrument Sans. Verified identical metrics: tag widths 132/233/139/134px = original. Colours kept as the site's (original body text was blue; here ink). Tag/portrait hover effect on the original not reproduced (its hover rules weren't readable).
- Verified: at 1440 the portrait, About Me, paragraphs, Education, timeline items and Experience land on the same coordinates as the original; left-column items sit 32px higher only because no phone line is shown. At 375: same portrait/contact/heading positions; Tools → About Me gap 48px as original; no horizontal overflow.
- Content: LinkedIn set to https://www.linkedin.com/in/hridyachopra (from the original page). Not copied without owner OK: phone number, portrait photo (about-portrait.jpg, 960×1280 on the original site), résumé (/cv.pdf).

## Project cards (2026-10-22)
- Owner asked for the project format of pramitranjan-portfolio.vercel.app/work (“use this format for projects n not horizontal”). Measured the reference at 1000 and 375 wide: 4 columns of 218px, 16px gap; card panel with 1px border and 16–18px padding; ~4:3 cover; title 16/24, summary 14/1.6 muted, footer “VIEW →” (accent, caps) with caps tags on the right; 1 column on phones. Borrowed the card format only — colours/fonts stay this site's (light panels, accent blue instead of the reference's dark/red); no reference code or copy (e.g. its “More on the way” card) used.
- `src/components/ProjectGrid.jsx` (`.pgrid`, `.pcard*`) replaces the numbered row list (`ProjectIndex`, removed) on Work and Home “Selected work”. Columns: 1 / 2 (≥600px) / 4 (≥960px). Hover: border turns accent, card lifts 2px, cover zooms 3%, arrow nudges. Cards fade up with a small stagger. Lab control “Work list covers” removed (no longer applies).
- Checked: Work at 1000 wide (4×218px, cover 180×135), Home at 375 (1 column, 335px, no horizontal overflow), card links go to the project pages.

## Case studies, résumé and header (2026-10-22)
- Imported the owner's three case studies from hridyachopra.vercel.app/projects/1–3 (owner request): Xchange (2022), Website Redesign: Franklin's (2026), Cogniva (2026). Text copied verbatim into Overview / Problem / Solution / My role / Result / Conclusion sections (label + headline + paragraphs); images placed where they appeared there. Card summaries and tags from the old home page. Role/team/context only from the owner's text (Franklin's context left empty — not stated). Replaced the two placeholder projects (never published, so no redirects). Featured on Home: all three.
- Images: originals downloaded to `authoring/media-src/hridyachopra-vercel/` (gitignored, local masters; 16 MB) and published as WebP ≤2000px in `public/media/` (2.6 MB total). Alt text written from viewing each image. Portrait → `/media/portrait.jpg`; résumé → `/media/hridya-chopra-resume.pdf`.
- Project sections gained optional `title` (headline), multi-paragraph `body` (blank line between paragraphs) and `gallery` (images side by side; wide images stack full-width). Dashboard edits all three.
- Résumé: “Resume” in the header and footer (and the About/closing résumé links) download `/media/hridya-chopra-resume.pdf` directly as `Hridya-Chopra-Resume.pdf` — owner asked for download instead of showing it; the interim /resume page was removed.
- Header: “HC” monogram on Home; “hridyachopra” on every other page — all italic, one colour (ink), per owner request. Spacing tuned so it fits beside three links at 375px.
- Ripples back on (owner request) as light dissolving rings: 2 thin 1px rings, 150px, 2s, fading and blurring to 2px, no drop; behind content. (Inside the landing hero they sit under the water layer.)
- Checked: Xchange and Cogniva pages at 1440 (all images load, all alt text, 6 sections, next-project link), Franklin's at 375 (no overflow, galleries stack); Resume links verified to carry the download attribute, Home carousel/cards show real covers, About shows the photo, PDF served as application/pdf, ripple = 2 rings.
- 2026-10-22 (owner request): added **ixigo** (project 4 on the old site, found under Projects → All Projects): Overview / Scope / Live Activity / Design System copied verbatim; no case-study images on the old site (only a 512px logo card). Role/timeline from the About experience entry. Cover = the logo centred on a pale peach 2000×1125 panel (`/media/ixigo-cover.webp`, generated from the old site's cover.png). Not featured on Home (owner: “in selected work have only three”); listed on Work.
- Work page: page headings (`.h1`) reduced to clamp(2.5rem, 4.6vw, 4rem) — 64px at 1440 (was 96px). Project cards: 3 columns from 1024px (owner: “three case studies in one” row; ~345px wide at 1440), 2 columns from 640px, 1 on phones and covers are shown whole (`object-fit: contain` in a 16:10 frame) instead of cropped.

## Project card hover (2026-10-24)
- Owner asked for the Featured Work hover from hridyachopra.vercel.app. Inspected live: card lifts 4px, border → accent, shadow 0 12px 40px rgba(0,0,0,.08) (0.3s); a second “hover” image fades in over the cover (0.5s); a bottom-up dark gradient (rgba(0,0,0,.75) → .35 at 55% → 0) fades in (0.3s) with frosted 10px caps tag chips, 13px summary and “View case study →” (arrow nudges 2px).
- Rebuilt in `ProjectGrid` (original code) with the same timings; also applied on keyboard focus (`:focus-visible`); hover-only effects limited to `(hover: hover)` so touch devices keep the plain card. New optional project field `cardHover` (dashboard: “Card hover image”), excluded from the release check. Hover images from the old site: `xchange-hover.webp` (UI screens), Franklin's menu page, `cogniva-hover.webp` (robot face); ixigo has none (overlay only). Originals in `authoring/media-src/`.
- Checked at 1000 wide: real mouse hover (lift, accent border, shadow, hover image and overlay at full opacity) and Tab focus on the first card.
- 2026-10-24 (owner request): landing hero name is now one colour (ink `#21395E`) and fully italic, and smaller — hero size setting 3.1–7rem (was 3.6–8.25rem): 112px at 1440 (was ~121px), ~50px at 375. Header “HC” monogram unchanged.
- 2026-10-24 (owner request): the Home carousel now shows every visible project (Work order: Xchange, Franklin's, Cogniva, ixigo); “Selected work” stays curated to three via `home.featured`.
- 2026-10-24 (owner: “make hridya and chopra both same font”): the Home “HC” monogram now matches — both letters italic, ink colour (hero name was already identical for both words).

## Deployment
- 2026-10-25 (owner: “push this website to vercel”, “Replace hridyachopra.vercel.app”): deployed with the Vercel CLI to the existing Vercel project `hridyachopra` (account choprahridya-2919), replacing the owner's earlier Next.js site at https://hridyachopra.vercel.app.
- That project's dashboard settings are still Next.js; `vercel.json` overrides them (framework vite, `npm install`, `npm run build`, output `dist`, SPA rewrite). Keep those overrides.
- Folder linked via `.vercel/` (gitignored); `vercel link` also wrote `.env.local` (gitignored, Vercel OIDC token — never commit).
- Publishing routine (no Git remote yet): commit, then `npx vercel@latest deploy --prod`. If the Vercel project is connected to the old site's GitHub repo, a push there would redeploy the old site — disconnect it in Vercel → Settings → Git, or connect this repo instead.
- Checked live: /, /work, /about, /work/xchange (direct link), /work/ixigo, résumé PDF (200, application/pdf); /lab and /dashboard show the 404 page; no console errors.
