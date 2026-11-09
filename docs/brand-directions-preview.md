# Portfolio brand directions preview

This branch packages the local portfolio explorations for the existing Next.js/Vercel project. Production main is unchanged.

- `/` or `/version-2` opens the illustrated direction: Bricolage headings, rounded blue frame, paper texture, sketchbook character, illustrated About, four work cards, gentle card tilt and hand-drawn link underlines.
- `/version-1` opens the preserved DM Sans / ASCII-heart direction.
- Each direction includes Home, About, and all four case studies using hash navigation. Static files live under public/explorations; assets are shared without filesystem symlinks.
- The intro plays once per session; reduced motion skips it. Developer controls remain hidden.

## Vercel

Use the existing GitHub-connected Vercel project with its current Next.js build settings and repository root. Select this branch for a Preview deployment; do not change the production branch. If automatic previews are enabled, pushing the branch triggers one. The project owner may need to authorize the commit author/deployment.

These are design explorations, not a completed migration to React components. Original Next.js routes/components are retained; the root redirect applies on this branch. Preview pages retain noindex. No visual/browser/test suite was run, following the owner's instruction while building.
