# Portfolio authoring system — AI implementation instructions

Audience: the AI assistant. Establish the shared architecture from the beginning and retain all authoring capabilities in the intended foundation. Follow the foundation file’s public-first visual checkpoint before extending or restyling authoring interfaces. Preserve already functioning tools. Do not present this file as reading or a setup checklist for the owner. Apply the owner's current requirements and the actual environment's capabilities.

## Stage gate — do not build these tools in the first pass

Read this file to understand the eventual architecture, but implement it only at stage 3 of file 01. First run the public preview, share its verified URL and let the owner select the design. Then finish the accepted public pages. Until that acceptance, do not create or extend the lab, dashboard, studio shell, presets, persistence endpoints, auth or save services. A full studio is not an acceptable substitute for showing a public design.

Keep only the minimal shared content/components/settings needed by the public preview. Existing functioning starter tools may remain; preserve them without expanding or restyling them before the owner selects the public design. Do not offer the lab as a compulsory way to choose the first design. If the owner has already explicitly accepted a direction, use that acceptance rather than asking again. Being in the attachment set does not authorize parallel implementation of all its features at once.

Report this file's capabilities as **planned for the authoring stage** while awaiting design feedback, not as abandoned scope or an urgent obligation to finish before replying. The owner’s requested staged workflow takes precedence over capability lists below. At stage 3, implement and verify the real tools; do not satisfy the stage with mock controls.

## Audience separation and build priority

Public copy describes the owner and their work. Lab/dashboard copy helps the owner edit. Neither the workshop instructions nor this capability list belong on the public portfolio. Apply the foundation file's public-copy rules to all pages and metadata, including missing-content states. Missing content requires the complete draft scaffold specified in file 01, not deletion of Work/About or all project layouts. Designated editable placeholder copy is permitted in draft scaffold regions; keep setup/status copy out of the visitor experience.

If a compatible starter is supplied, adapt its existing renderer, content and tools. Do not build a second public mockup or rewrite the whole system merely to change the design. First show a running public design, wait for the owner’s explicit selection, then complete Home, Work, About and the project layouts with real content or structured placeholders. Only afterward make controls operate on that accepted design. Functional lab/dashboard work remains required and must be verified or reported pending, not quietly dropped.

## Shared architecture

Separate structured content, accepted design settings, and reusable presentation components. Have the public site, design lab, and dashboard preview use the same underlying content and renderer. Avoid maintaining independent mock websites that drift from the portfolio.

Choose a compatible implementation for the existing project or selected environment. Use native editing capabilities when they satisfy the contract. Do not introduce a framework, service, or paid dependency simply to match an example architecture.

The deployment target is **Vercel**. Choose a supported framework/runtime or exportable static implementation, and establish its actual build and routing configuration. Native authoring capabilities are suitable only when their relationship to the Vercel-hosted result is understood and documented.

Model the owner's actual types of work. Adding projects, collections, sections, or media should reuse appropriate patterns without copying entire page implementations. Use stable identifiers and preserve content when layouts change.

Represent a work's presentation format separately from discipline tags and its stable identity. Use composable sections/media blocks with format-specific defaults so a case study, reel, film, visual collection, or other selected format can differ in reading order. Preserve role, collaborators, captions, and credits across formats. Permit section reordering/omission and format changes without destructive content replacement. Do not generate every example format. When work is missing, create the explicitly labelled editable project slots required by file 01; these are scaffold records, not fabricated real projects.

Make content persistence, revision checking, asset management, and publication explicit environment adapters. Local file writes, a hosted content service, repository commits, and platform-native storage have different behavior; implement and document the actual choice.

Do not implement hosted dashboard persistence by writing back into deployed source files or temporary function storage. Use a suitable repository-backed content workflow or durable content/asset storage, and explain whether a content save triggers a new Vercel deployment. Keep local draft saving separate from remote publication. See [Vercel's runtime filesystem documentation](https://vercel.com/docs/functions/runtimes).

## Starting architecture for new projects

Prefer the workshop's reference starter when it is supplied, preserving its runtime and save/export contract. The reference route is local authoring and a public-only export deployed to Vercel. Do not add a database, hosted authentication, repository-writing API or new framework for ordinary workshop customization.

When no starter or compatible project is available, choose the simplest implementation that actually supports the shared renderer, durable content/settings, local editing, lab and dashboard. Explain the choice briefly. Do not assume a static page alone satisfies the authoring contract. A chat-only environment without project editing/preview must identify that limitation and provide a supported handoff; it cannot claim to have launched a working app.

Keep structured content and design settings versioned, use stable identifiers, and keep local drafts recoverable. Track safe lab/dashboard source so a fresh copy retains the tools, while excluding local authoring routes and private drafts from the public export. Preserve publishable assets and safe presets with the project as appropriate.

Hosted editing is a separate requirement only when the owner asks for it. If requested, use durable storage and server-side owner authentication/authorization, protect reads/writes/assets, and detect stale revisions. A hidden URL, browser-only password or temporary runtime filesystem does not satisfy this. Do not silently replace an explicitly requested hosted editor with a local one, or present an unconnected authentication screen as complete.

Implement one working persistence path and test it before adding alternatives. Never migrate a compatible established project merely to match an example architecture. Current framework documentation applies only to the framework actually chosen.

## Performance and media

Establish and record practical media/loading budgets appropriate to this portfolio's content, and inspect representative media-heavy pages under a phone-sized viewport and constrained network conditions when tooling supports it. Report measured results and test conditions; do not invent performance scores or treat a single automated score as a complete quality verdict.

- Preserve source masters outside the public output and serve optimized images at appropriate responsive sizes and formats. Preserve detail needed to inspect the work.
- Reserve image/video space through dimensions or aspect ratios to avoid layout shifts. Check intended crops, diagrams, and text inside images at actual displayed sizes.
- Load below-the-fold media deliberately and prioritize the important initial content. Avoid downloading all project images, iframe prototypes, or full videos on first load.
- Use suitable video encodings, posters, and playback behavior. Provide appropriate text/audio alternatives, and respect reduced-motion preferences for ambient playback.
- Load only the deliberately selected fonts and weights used, with licensing. Technical load-failure fallbacks are resilience only; do not substitute generic families as the accepted design. Verify the intended font actually loads. Inspect text during loading and after fonts resolve.
- Keep public pages free of unnecessary authoring UI and heavy editor dependencies. Load optional integrations without blocking core content.

Use native framework capabilities where appropriate. If the actual project uses Next.js, consult its current image and font documentation; otherwise use the chosen runtime’s supported mechanisms.

## Public-site essentials

Include a favicon, meaningful page titles/descriptions, suitable social-sharing images and metadata, canonical public URLs, a sitemap for intended public pages, and explicit indexing behavior. Keep private drafts and authoring routes out of public discovery, while enforcing real access control separately. Use the actual framework/platform’s supported metadata APIs or static document metadata.

Use stable project and collection URLs, a useful 404 experience, and understandable missing-media/error states. Preserve published links through redirects when slugs change. Generate canonical/sitemap/social URLs from the intended production origin, not a temporary Preview deployment. Inspect rendered metadata and actual asset responses; do not claim search indexing or a refreshed social cache merely because tags exist.

If a contact form or other submission feature is implemented, verify actual submission storage/delivery and success/failure feedback. A decorative form or nonfunctional action must not be presented as working.

## Design lab

Provide an experimentation surface, conventionally `/lab`, or an equivalent native workspace. Its purpose is to let the owner make and compare visual decisions directly.

### Interaction priorities

Make the portfolio canvas and relevant live adjustments the primary experience. Surface useful controls close to the work being adjusted. Keep naming, import/export, history, and other management actions secondary or progressively disclosed; they must not push the actual design controls out of immediate reach.

The interaction requirements do not mandate a full-screen studio, permanent sidebar, or floating panel. Preserve an established lab's interaction model when extending it. For a new project, choose and show a reversible layout suited to the work and device; distinguish a focused on-page inspector from a more extensive management workspace rather than making the lab and dashboard identical by default.

Keep the canvas easy to inspect at its intended size. Avoid unnecessary nested scrolling or shrinking the portfolio so far that visual decisions are misleading. State whether a preview is scaled or reflowed; verify phone/wide modes against actual viewport behavior. Make baseline comparison show the relevant differences, not merely reload an unexplained second view.

Use concise owner-facing labels and status. Keep renderer implementation details out of interface copy. Development access links and build-status banners must remain authoring-only and must not leak into the professional public portfolio.

### Capabilities

Implement:

- Rendering of actual portfolio pages and content.
- Accepted baseline settings and multiple named explorations.
- Immediate visual controls for useful design choices: type scale, spacing, width, colors, image ratio/fit, and relevant layout variants.
- Phone and wider-screen inspection, with breakpoint-specific controls clearly identified.
- Comparison of baseline and selected exploration, reset, and restoration of a saved exploration.
- Versioned machine-readable preset import/export with stable setting identifiers.
- A readable summary of selected settings and structural changes that need further implementation.
- An explicit “Use this design” action that validates and persists the chosen settings without silently publishing.

Scope experiment overrides to their preview. Keep exploratory changes separate from accepted settings until the owner selects them. Reuse real components and content; do not duplicate entire content trees for each variation.

Define each adjustable setting's label, type, default, valid range/options, unit, breakpoint scope, and rendering target. Match the initial render to accepted defaults. Keep controls coherent and limited to choices that have an actual effect. Handle obsolete presets through validation or migration, explaining any values that cannot be applied.

Persist exploration state appropriately. Browser storage may supplement durable presets but must not be the only recovery path for important work. Handle malformed state, unavailable storage, and clipboard failure gracefully. Export should remain available as a file or equivalent supported operation.

If a selected exploration needs structural code changes, preserve the owner's selection and implement those changes through the normal development workflow. Do not report a proposal or copied setting summary as an applied design.

## Page and scaffold content contract

Home, Work, About and work-detail views must share the actual content model, design settings and renderer. Global navigation and CTA destinations must use real routes. Do not build disconnected sample pages solely to satisfy screenshots. Support full-site previews, not just the homepage and one project; both Work and About must be selectable/inspectable in lab and dashboard previews.

Store scaffold/unreviewed state explicitly at the appropriate page/section/project/media level, with existing content migrated safely. A placeholder summary or project slot must persist on save/reopen and remain visible in the draft preview. Preserve records and URLs when placeholders become real content. Use the same renderer for preview and approved output; do not introduce a separate throwaway template website. Public release handling follows file 03; never silently drop all scaffold work and declare the foundation finished.

The dashboard must support home featured-project selection/order, intro/About teaser and CTA destinations; Work index ordering; About bio/portrait/contact/résumé and optional sections; and project-specific story/media placeholders. Omit or explain controls that are unsupported instead of pretending they work. Keep layout-specific controls bound to actual pages and breakpoints. No contact form is required unless explicitly requested and actually connected.

## Dashboard

Provide a content and settings editor, conventionally `/dashboard`, or use a suitable native editor. The owner should be able to maintain ordinary portfolio content without AI or manual source edits.

Support the relevant capabilities for this portfolio:

- Identity, introduction, bio, experience, contact, résumé, and links.
- Creating, duplicating, editing, grouping, and reordering projects or collections.
- Project-specific stories, media sequences, captions, descriptions, credits, and supported outcomes.
- Project/collection presentation-format selection, role-appropriate credits/breakdowns, and flexible media/text section order.
- Section ordering, optional content, and visibility.
- Media selection/import through the actual asset workflow, with useful crop/fit and presentation settings.
- Page titles/descriptions and other supported metadata.
- Accepted design settings shared with the lab and public renderer.

Adapt the editor to the actual content model and disciplines. Do not expose unsupported fields or pretend every field affects every page. Keep editor-to-renderer bindings explicit so new content features appear consistently.

## Drafts, preview, and saving

Implement this sequence:

1. Load content and its base revision from the same authoritative source.
2. Keep edits in a recoverable draft with visible unsaved state.
3. Preview the draft through the actual renderer before publication.
4. Validate data and show a useful change summary.
5. Save against the revision loaded at the start of editing.
6. If the baseline is outdated, preserve the draft, reject silent replacement, and provide a review/reconciliation path.
7. Identify what the save changed: local files, stored content, a repository commit, or a live deployment.

Fetching the newest remote file revision only at save time and attaching it to an older full-document draft is not sufficient conflict detection. Preserve newer work and the owner's unsaved edits.

Provide undo/redo, recovery after reload through a supported mechanism, failure feedback, retry, and export/backup. Handle network errors without leaving controls permanently locked in a saving state. Do not report success until the intended persistence operation completes.

Publication must be a distinct understood operation. If a platform necessarily publishes on save, explain that behavior before a consequential action and use its supported draft/staging mechanism when available.

## Assets and access

Implement media handling appropriate to the environment. Selecting a local file does not automatically import, upload, version, or publish it. A local filesystem picker is not a cross-platform hosted media system. Provide a browser-based workflow or a clearly supported asset-library selection process, with real persistence and usable failure messages.

Keep local-only authoring inaccessible on public deployments. If the dashboard is hosted, enforce owner authentication and authorization on protected content reads, writes, and asset operations. Keep private service credentials outside browser-delivered code. A hidden route, `noindex`, or a browser-only password check is insufficient.

Track reusable authoring source and safe schemas/presets so the tools survive a fresh clone or export. Keep private drafts and scratch assets separate. Enforce deployment/access boundaries independently of Git ignore rules.

If the environment cannot support part of this contract, state the specific gap and provide the nearest supported implementation. Do not substitute nonfunctional controls or unverified claims for the missing capability.

## Verification

Use the implementation's real workflows to check:

- Home, Work, About and distinct work-detail templates exist and their links, direct URLs and refresh work; the home flow includes featured work and an About route even with no real project material.
- Scaffold copy/media can be replaced, saved and reopened without losing other content or stable routes; each main page can be previewed through the actual lab/dashboard renderer.
- A fresh clone/export retains the authoring system.
- A lab adjustment affects the intended page and breakpoint.
- Baseline comparison, reset, preset transfer, and accepted-setting persistence work.
- Dashboard edits appear in draft preview and persist after save/reopen.
- Project/collection creation, reordering, and media changes render correctly.
- Different work formats actually produce appropriate reading order and media behavior; changing formats preserves existing content and authorship information.
- The lab's useful live controls are immediately reachable, its canvas can be inspected at meaningful widths, and management controls do not dominate the design task.
- Reload recovery, undo/redo, failed saves, and stale-tab conflicts preserve work.
- Unauthorized public visitors cannot use protected authoring capabilities.
- Vercel Preview and Production deployments preserve the intended authoring boundary; any required hosted content/media survives a new deployment.
- Keyboard interaction, visible focus, phone use, and reduced-motion behavior remain usable.
- Representative media-heavy pages meet the recorded performance/media budgets or have explicit unresolved findings.
- Metadata, favicon, sharing images, public sitemap, 404 behavior, and any changed-slug redirects work on the intended origin.
- Content migration and source recovery preserve existing work, settings, media references, and authoring behavior.
- The owner handover described in the foundation file is completed or explicitly pending.

Report which checks actually ran and their results. Keep setup and operating instructions in the project's consolidated guide, with the actual locations and actions the owner can use.
