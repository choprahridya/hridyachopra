# About page: fix broken colors, restyle to blue-only

## Problem

`app/about/page.tsx`, `components/ui/Button.tsx`, and `components/ui/PillTag.tsx` are
uncommitted WIP files that reference color tokens (`--color-lime`, `--color-pink`,
`--color-yellow`, `--color-lavender`, `--color-bg-dark`, `--color-text-tertiary`,
`bg-bg-primary`, `bg-bg-secondary`, `bg-bg-light`) that don't exist in the committed
`app/globals.css` (a five-theme × light/dark token system, default "blue" theme). The
undefined references fail silently, so the About page renders as an unstyled hybrid
instead of the intended design. `PillTag` is also used by the already-committed
`app/projects/page.tsx`, so this bug is currently live in the dev server on that page too.

## Approach

Replace every non-existent color/class reference in these three files with the
equivalent real token from the active blue theme (`app/globals.css` `@theme` block):

- `--color-accent` (#004AAD) — primary emphasis / filled states
- `--color-accent-light` (#DDEAF8) — subtle fills
- `--color-text-primary` (#001E4A), `--color-text-secondary` (#1A5BAD),
  `--color-text-muted` (#6B96CC)
- `--color-border` (#BFD3EE)
- `--color-bg` (#EEF3FC), `--color-bg-card` (#FFFFFF)

No copy, layout, or structural changes. No new components. Multi-color accents
(skill-tag colors, photo-frame glow, section borders) collapse to this single blue
palette instead.

## Scope

- `components/ui/Button.tsx` — all three variants (primary/secondary/ghost) restyled
  to blue tokens.
- `components/ui/PillTag.tsx` — both variants (default/filled) restyled to blue tokens.
- `app/about/page.tsx` — `skillColors` array, emphasis spans, photo-frame glow,
  section borders, broken `bg-bg-*`/`text-text-tertiary` classes all switched to the
  token set above.

Out of scope: `app/work/page.tsx`, `app/work/[slug]/page.tsx` (also consume
Button/PillTag but weren't requested — should visually improve as a side effect,
not separately verified here).
