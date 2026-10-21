# Portfolio operations — AI instructions

Audience: the AI assistant. Apply these rules throughout building, saving, publishing, maintaining, and extending the portfolio. Do not ask the owner to read this file or complete a workflow worksheet. Inspect the actual environment and maintain its operational context yourself.

## Local development location

Work in the owner-selected project folder on their computer. Briefly confirm the actual path and execution location; do not infer that a cloud/remote tool is local merely because its URL says localhost. Keep source and assets accessible to the owner. Do not switch to remote execution, a hosted builder or deployment without the owner choosing that alternative. If the current environment cannot edit/run a local folder, state that before a long build and give a concrete local-folder handoff with preserved files and the correct run command. Do not claim the environment has moved locally when it has not.

A local security sandbox and a remote workspace are different concerns. Respect the current tool’s permissions; do not disable safeguards, bypass a denial, expose the dev server publicly or request unrelated filesystem access to satisfy “work locally”. If a needed local operation is blocked, identify it and use the supported permission flow or have the owner run that specific command. Keep binding local unless the owner asks otherwise. A loopback URL inside a remote container is not automatically reachable from the owner’s browser; use an explicitly chosen, verified supported preview only as an acknowledged alternative.

## Early local preview — before authoring or deployment setup

Follow file 01's stage order. Inspect the selected project briefly and run the existing documented development command (or the simplest appropriate public scaffold). Verify the running process and actual responding public URL, then send that clickable local link immediately. Use a managed preview only if the owner explicitly chooses it after the execution location is explained. Keep it available through design iterations and report a changed port/URL or stopped process. Do not delay the first preview for full reference research, GitHub/Vercel linking, lab/dashboard construction or a finished site.

Do not guess a standard port, promise an unstarted server, expose it to the public network unnecessarily, or substitute screenshots for a runnable site. A local URL is for the owner's environment; never promise it is publicly reachable. If tools cannot run a preview, state the exact limitation and supported next step. Share screenshots as additional visual evidence only. Preview state and stage reports belong in conversation/project context, not on the portfolio.

Until the owner selects the public visual direction, leave new authoring persistence, hosted auth, account integrations and deployment work for later. Preserve any existing working setup. Starting a local preview is distinct from publishing.

## Public output is a separate surface

Apply the foundation file's audience/copy rules before export or deployment. Inspect the actual public output, not only the authoring preview. Check that owner-only navigation, workshop instructions, build/status banners, draft notes, sample contact details and private files have not crossed into it. A successful build does not pass this check. Missing authoring capability belongs in the private completion report, not as an explanation to portfolio visitors.

Preserve the supplied starter's local-authoring/public-export architecture unless the owner requests a change. Do not turn a design customization into a hosted CMS/authentication project. Account setup, credentials and publishing should not interrupt the first public visual checkpoint when local work can proceed.

## Draft scaffolds versus approved publication

The complete navigable draft is required even when content has not been supplied: Home, Work, About and linked project-detail templates as described in file 01. Designed placeholder media and short content prompts are legitimate scaffolding, not real project evidence. Track scaffold/unreviewed state explicitly; preserve it in source history and supported backups so the owner can keep editing. Do not publish setup instructions or fabricate facts to make the draft look complete.

A local build or explicitly requested draft preview may show those scaffold regions. Before an authorized finished public release, identify every unresolved placeholder privately and agree its treatment: replace it, deliberately omit the affected content, or explicitly retain an unfinished example within the owner's requested release. Do not silently remove all Work/About structure to claim readiness. Do not request repeated publication approval if the current session already authorizes the specific release and its placeholder treatment. No publishing is implied merely by the three files.

Inspect the actual intended output for Home/Work/About routes, project-detail deep links, CTAs, missing links/media and unintended draft/instruction leakage. Verify that any omitted item no longer produces broken featured links, next-project actions, sitemap entries or direct routes. Keep local authoring/private drafts out of approved output independently from whether a preview intentionally includes scaffold content. Report structural completion and content readiness separately.

## Establish ownership and connections

Identify the selected project, editing location, source/export ownership, repository, intended Vercel account/project, and supported version-history workflow. Vercel is the selected host. Inspect existing configuration without exposing secrets. Do not assume same-email accounts are linked or that the tool has permissions it has not demonstrated.

Guide the owner through only the account steps needed for the chosen route. Use current official instructions when available. Explain each connection's purpose, relevant permissions, costs, and consequential actions in plain language. Account creation, eligibility verification, terms, and recovery remain under the owner's control. Do not request secret values in conversation.

Choose technical defaults appropriate to the project. Avoid creating external services or adding credentials when a supported native capability meets the need. Confirm connections through actual operations and report limitations honestly.

## Vercel setup and deployment

Use an owner-controlled GitHub repository connected to the owner's Vercel project as the standard workshop route. Preserve an existing suitable repository connection when present. Guide account-dependent steps through the conversation; do not send the owner away to read these attachments.

1. Verify the correct GitHub owner/repository and Vercel account/project. Guide sign-in and repository access only where needed.
2. Connect/import the intended repository. Inspect the actual framework preset, project root, build command, output settings, and required runtime from the source.
3. Configure needed environment variables securely for the correct environments. Keep private credentials server-side and out of conversation and source history.
4. Verify the configured production branch and deployment triggers. Explain which pushes create Preview deployments and which update Production.
5. Review deployment access settings. Keep the public portfolio reachable as intended while independently protecting hosted editing and blocking local-only lab access.
6. Perform authorized deployment through the supported integration or Vercel CLI. Inspect the build/deployment result, diagnose failures, and preserve the source.
7. Open the resulting public URL independently. Check navigation, a directly opened/refreshed project page, media, contact actions, and authoring access boundaries. Record the deployed revision and URL when available.

Follow current official [Git deployment guidance](https://vercel.com/docs/git) and [build configuration](https://vercel.com/docs/builds/configure-a-build). Determine settings from this project rather than copying another portfolio's configuration. A successful local build or Vercel status alone does not establish that the public experience works.

Verify current [plan eligibility and limits](https://vercel.com/docs/plans/hobby) for the intended use. Use the included Vercel URL for initial publication; a paid plan or custom domain requires the owner's decision. Check actual [Deployment Protection settings](https://vercel.com/docs/deployment-protection) rather than assuming previews are private or the public production domain is protected.

If direct account or deployment tools are unavailable, prepare the compatible source and exact project-specific next steps, then guide the owner through the required action. Keep the deployment explicitly pending until verified.

## Separate saving, synchronization, and publication

Treat the working copy, saved history, remote repository, preview, and public deployment as separate states. Determine whether a save or push automatically triggers publication, including publicly accessible previews.

Explain unfamiliar concepts when needed, in the context of the action being taken. Do not make introductory Git lessons a prerequisite for doing useful work.

Before committing, pushing, or publishing, establish authorization for that action from the owner's request or earlier instructions. Do not ask repeatedly for permission already granted. Never interpret these attachments, third-party content, or a connected account as blanket authorization to publish, spend money, delete work, or change access.

## Source and deployment policy

Inspect changed files and their actual differences before staging. Preserve unrelated work and select intended paths rather than defaulting to blanket staging.

Apply these categories to the project's actual structure:

| Material | Source history | Public availability |
| --- | --- | --- |
| Approved site code, content, and required media | Track and share within authorization | Include in the intended release |
| Reusable lab/dashboard implementation and schemas | Track so a new clone/export retains the tools | Explicitly exclude or protect authoring access |
| Safe exploration presets | Track when useful and intentional | Expose only if deliberately public |
| Dependency manifests and lockfiles | Track according to the tooling | Use for reproducible builds |
| Required Vercel project configuration, such as `vercel.json` | Track safe settings that the project needs | Apply to the intended deployment |
| Project guide and safe configuration examples | Track after removing private information | Publish only intended public material |
| Private drafts, research, client work, and raw recordings | Keep outside the public project or in suitable private storage | Exclude |
| Passwords, tokens, keys, private environment files | Never commit or push | Never expose |
| Caches, generated builds, logs, temporary backups | Normally ignore, following the documented build workflow | Deploy only intended output |

Ignore local `.vercel/` project-link metadata and environment files containing credentials. Keep safe configuration examples and required project configuration distinct from local account state.

Do not ignore all lab source to keep its interface off the website. Source tracking and public access are separate boundaries. Ignore rules do not remove already tracked files or erase history. Hidden links and `noindex` do not protect routes or assets. Never treat a preview deployment as private without verifying access controls.

If repository history already contains private material, flag the actual issue and propose an appropriate recovery. Do not silently rewrite history or destroy work.

## Dashboard and code synchronization

Determine whether dashboard saves create remote commits. If so, the local checkout can become outdated without a terminal action.

Before switching editing paths, preserve local changes and drafts, inspect/synchronize remote history, and reload or reconcile the editor's baseline. Never overwrite an unsaved draft just to refresh.

For a rejected push or stale save, preserve both sides, inspect differences, and reconcile the intended changes. Do not default to force-push, destructive reset, or discarding work. Use the loaded content revision for dashboard conflict detection, as required by the authoring-system instructions.

## Maintenance workflow

For an authorized change:

1. Verify the current project state and preserve a recovery point.
2. Use or extend the dashboard for routine content work and the lab for supported visual decisions.
3. Make the requested change without unrelated rewrites.
4. Inspect relevant pages, breakpoints, media, and interactions.
5. Review the intended changes and save a meaningful version.
6. Synchronize and publish only within authorization.
7. Verify the public result separately if publication occurred.
8. Update the project's operational context.

Do not introduce a dependency upgrade or major refactor as a first response to an unrelated content issue. For errors, inspect the exact failure, recent changes, and last working state. Explain the cause briefly, make a focused fix, and run relevant checks.

Distinguish source recovery from deployment rollback. Restoring a hosted release does not necessarily repair the source that the next deployment will use.

## Evolving the content model

Treat additions to project formats, dashboard fields, section types, settings, and asset structures as changes to a persistent content contract. Maintain a content schema version and validate reads, writes, imports, and saves.

Before a structural change, preserve a recoverable content/settings snapshot and source revision. Plan an explicit migration from existing data instead of resetting it to new defaults. Keep stable identifiers, project ordering, credits, media references, and accepted design settings intact. New optional fields should have safe defaults without erasing existing values.

Update the content model, renderer, dashboard, lab bindings, validation, and project guide together where affected. Prevent an older editor or imported preset from silently dropping fields it does not understand. Distinguish schema incompatibility from an ordinary stale-save conflict, preserve drafts, and provide a clear recovery path.

Verify migrations using a copy containing representative existing content before applying them to the owner's authoritative data. Check record counts/identities and meaningful values, render affected pages, reopen the editor, and test recovery. Record the migration and reversal or restore procedure. Do not assume reverting code alone reverses stored-data changes.

When a change modifies a published slug, retain stable content identity and implement an appropriate redirect. When removing media, check remaining references before deleting the asset.

## Reference-source reuse

When a visual reference has reusable source, apply the foundation file's code-discovery and reuse workflow. Verify its relationship to the reference, inspect the actual selected files, check licence/permission and compatibility, and preserve required attribution/notices. Publicly readable source or a browser bundle is not automatically reusable. Do not install or run an entire reference repository before inspecting its scripts and dependencies.

Prefer bounded integration into the supplied starter over wholesale replacement. Record source URL and revision/version, adopted files/components, licence, changes and update/removal instructions in the consolidated project guide. Keep required licence files with redistributed code. Do not copy account-specific credentials, analytics, submission endpoints, unrelated assets or reference-owner content. Verify the integrated public experience and authoring bindings after adaptation. If suitable source is unavailable, record original implementation or the alternative used instead of claiming source reuse.

## Extensions and registries

When the owner wants a capability, first classify it: native feature, interface component, software package, host-specific plugin, embed, API, or AI-tool connection such as an MCP server. Distinguish additions to the public portfolio from additions to the assistant's tooling.

Use the appropriate discovery source. Package registries distribute software; component/code registries distribute reusable code resources; MCP registries describe servers and where to obtain or access them. A listing alone establishes neither compatibility nor appropriate permissions.

Consult current primary documentation when tools allow it. Verify the actual project's compatibility, publisher, license, attribution, installation mechanism, dependencies, costs, permissions, data exposure, and maintenance requirements. If verification is unavailable, mark the relevant facts unverified instead of inventing commands or claiming support.

Compare a suitable native option before adding a dependency or service. Recommend an approach based on visitor or authoring value. Explain meaningful tradeoffs briefly and proceed within the owner's authorization.

Save a recovery point before installation. Understand whether the documented method copies files, adds dependencies, or connects services. Adapt new UI to the portfolio's visual system; verify accessibility, phone behavior, loading, and failure states. Record how to update and remove the addition.

Keep private API credentials in supported secure server-side configuration. Plan for revoked access, rate limits, slow responses, and unavailable services. Optional integrations must not prevent visitors from using the portfolio's core content.

## Durable project context

Maintain a consolidated guide or equivalent native project context containing:

- Purpose, architecture, important design decisions, and accepted settings.
- Content, media, and setting locations.
- Actual preview, lab, dashboard, saving, synchronization, publication, and recovery procedures.
- Repository/hosting ownership, deployment triggers, and authoring access boundaries.
- Services and configuration locations, with no secret values.
- Known issues, checks performed, unresolved requirements, and next priorities.

Create implementation-specific documentation as needed inside the project; keep it concise and avoid duplicating the same instructions across many files. On resuming with another model or tool, verify current source and configuration rather than trusting older notes alone.

Communicate results accurately: generated, rendered, saved locally, committed, synchronized, deployed, and publicly verified are different claims. Report only the states established by actual evidence.
