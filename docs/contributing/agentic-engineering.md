# Agentic Engineering System

Rarebox uses an agentic engineering system to make AI-assisted development controllable instead of chaotic.

The point is not "let an agent do whatever it wants." The point is:

- you describe the product intent
- the agent turns it into a small, reviewable spec
- the repo rules constrain what it is allowed to change
- executable evals and smoke tests check the behaviors we care about
- CI blocks changes that break the harness
- you stay in the loop for product direction, risky trade-offs, and any error recovery that changes scope

Think of it as a development harness: specs, rules, tests, CI, and review checklists wrapped around a coding agent.

## Pieces of the system

### Main Rarebox repo

Repository: <https://github.com/novaoc/rarebox>

Important files:

| File or directory | Purpose |
| --- | --- |
| `AGENTS.md` | The coding-agent contract for Rarebox. Read this first when using any agent. |
| `.github/workflows/harness.yml` | Harness CI: evals, build, browser smoke test. |
| `.github/pull_request_template.md` | Forces risk notes, test notes, screenshots for UI, and verification output. |
| `scripts/evals/` | Fast executable checks for risky logic: providers, pricing, route order, backup safety, search fallback. |
| `scripts/smoke/browser-smoke.mjs` | Browser app-shell smoke test using Vite preview + Chromium. |
| `docs/harness/templates/` | Feature spec, bugfix spec, provider spec, and review checklist templates. |

### Rarebox agent rebuild kit

Repository: <https://github.com/novaoc/rarebox-agent-harness>

This repo rebuilds the dedicated `rarebox` Hermes profile and syncs the harness files into a Rarebox checkout.

It contains:

- the Rarebox agent identity (`profile/SOUL.md`)
- Rarebox-specific skills
- `AGENTS.md`
- eval scripts
- smoke tests
- spec/review templates
- install/sync scripts

It does not contain secrets, session databases, logs, tokens, backups, or runtime state.

### Dedicated `rarebox` Hermes profile

The `rarebox` profile is a focused engineering agent for Rarebox.

It should be used for:

- turning a feature idea into a spec
- implementing scoped changes
- adding or updating evals
- running verification
- reviewing diffs
- documenting durable patterns

It should not be used for:

- posting social content
- using Telegram/social tokens
- making broad product decisions without you

## How to use the Rarebox agent

From a machine with Hermes Agent installed and the profile configured:

```bash
rarebox chat
```

or:

```bash
hermes -p rarebox chat
```

For a one-shot check:

```bash
rarebox -z "Read AGENTS.md and tell me what checks are required before changing the trade analyzer. Do not edit files."
```

To verify the agent identity:

```bash
rarebox -z "In two sentences, identify your role and scope. Do not use tools."
```

Expected answer: it should identify as the Rarebox engineering agent focused on Rarebox development.

## If you want to build a new feature, where do you start?

Start with a spec, not code.

Use this prompt:

```text
I want to build [feature]. First, read AGENTS.md and the relevant docs. Do not edit code yet.
Create a feature spec using docs/harness/templates/feature-spec.md.
Include acceptance criteria, non-goals, affected files, data/privacy risks, mobile behavior, offline behavior, API/rate-limit impact, and verification gates.
Then stop and ask me to approve the direction before implementation.
```

Good feature prompts include:

- what user problem the feature solves
- which screen or flow it touches
- what should not change
- examples of happy path and messy real-world cases
- whether it affects local data, backups, imports, prices, search, or external APIs

Example:

```text
Build a saved-search feature for Booth. It should let buyers save a search like "Charizard under $50" inside a saved shop directory. Do not add accounts or servers. Start with a spec and tell me the storage shape before editing code.
```

After you approve the spec, ask the agent to implement in a narrow slice:

```text
Implement the approved saved-search spec. Keep the first PR scoped to local storage, UI, and backup inclusion only. Add or update evals for backup/restore if the stored shape changes. Run the harness and report exact output.
```

## How do I check that the system is working?

From the Rarebox repo:

```bash
npm run eval:harness
npm run eval:danger
npm run build
npm run smoke:browser
```

What each check proves:

| Command | What it checks |
| --- | --- |
| `npm run eval:harness` | Fast behavioral evals for provider shape, price parsing, sealed filtering, route safety, search fallback, and backup safety. |
| `npm run eval:danger` | High-risk diff tripwire. It warns when changes touch sensitive files without the expected review path. |
| `npm run build` | Vite production build compiles. |
| `npm run smoke:browser` | A real browser can load core routes at desktop and narrow mobile widths without blank screens or obvious app-shell failures. |

To check CI:

```bash
gh run list --repo novaoc/rarebox --workflow "Harness CI" --branch main --limit 5
```

A healthy run should complete in a few minutes. If it hangs near the 15-minute timeout, inspect the smoke test first: a passed browser test can still leave a preview server alive if process cleanup regresses.

## How this gives you control

The control comes from forcing agent work through explicit artifacts instead of trusting a chat transcript.

### 1. Intent becomes a written spec

The agent should write down:

- goal
- non-goals
- acceptance criteria
- affected files
- data risks
- UI/mobile expectations
- verification plan

This gives you a checkpoint before code exists. If the direction is wrong, you correct the spec cheaply.

### 2. Repo rules constrain the agent

`AGENTS.md` tells any coding agent what Rarebox will not compromise:

- no removing features without explicit direction
- no blocking search behind loading screens
- no account wall
- no careless API hammering
- no risky persistence changes without tests
- no Tactile-breaking UI shortcuts
- no claiming success without real command output

### 3. Evals encode product invariants

The evals are small, fast tests for things that have broken or could hurt users:

- `$0` is a real price, not missing data
- sealed search must not show individual numbered cards
- route order must not shadow Pokémon sets
- backup restore must reject unsafe keys and preserve important local data
- provider normalization must stay consistent across TCGs

When a feature changes one of these areas, the agent should update the evals before or alongside the feature.

### 4. Browser smoke catches app-shell failures

The smoke test is intentionally basic but real: it opens the built app in Chromium and checks that core routes render, including narrow mobile widths.

It is not a full QA suite. It is the "did we ship a blank screen?" tripwire.

### 5. CI is the outside referee

The local agent can be wrong. CI runs the harness again from a clean environment on PRs and pushes to `main`.

If local output and CI disagree, trust CI enough to investigate.

## Where to look if you find an error

Start with the error type.

### CI failed

Look at the failed GitHub run:

```bash
gh run list --repo novaoc/rarebox --workflow "Harness CI" --limit 5
gh run view <run-id> --repo novaoc/rarebox --log-failed
```

Then map it:

| Failure | Start here |
| --- | --- |
| `eval:harness` failed | `scripts/evals/`, then the source file named in the assertion. |
| `eval:danger` failed | The changed high-risk files and `.github/pull_request_template.md`. Decide whether the change needs extra review or a new eval. |
| `build` failed | The compile error, then the import path or Vue file named by Vite. |
| `smoke:browser` failed | `scripts/smoke/browser-smoke.mjs`, route config, recent UI/layout changes. |
| CI hit 15 minutes | Smoke test process cleanup, Vite preview server shutdown, or a command waiting for input. |

### App bug or user-facing behavior is wrong

Use this prompt:

```text
Bug: [describe bug]. First reproduce or characterize it. Do not edit until you identify the likely failing layer. Check console errors, affected files, and existing eval coverage. Then propose the smallest safe fix and whether a new eval/smoke assertion should be added.
```

Useful places:

| Area | Files |
| --- | --- |
| Local collection data | `src/stores/portfolio.js`, `src/db.js`, `src/utils/backup.js` |
| Search | `src/services/tcg/multiSearch.js`, `src/services/tcg/cardCache.js` |
| Browse Sets | `src/services/tcg/providers.js`, `src/views/TcgSetsView.vue`, `src/views/SetsView.vue` |
| Trade Analyzer | `src/views/TradeLanding.vue`, trade store/services, scan services |
| Card Booth | Booth views/stores, backup/transfer code |
| Routes | `src/router/index.js`, `scripts/evals/route-safety.mjs` |
| Backup/import | `src/utils/backup.js`, `src/utils/collectrImport.js`, `scripts/evals/backup-roundtrip.mjs` |

## Does the system automatically handle errors?

Partly.

The system automatically detects many errors:

- eval assertions fail
- build fails
- smoke test fails
- CI times out
- danger-zone diff trips

The agent can usually attempt a fix when the failure is clearly inside the requested scope. Examples:

- missing import extension in an eval
- smoke test leaving Vite preview alive
- route order regression
- price parser treating `$0` as missing
- browser smoke route selector needs updating after a harmless copy change

But the agent should ask you before changing direction, product behavior, data shape, or risk level.

It should ask for feedback when:

- the fix would remove, simplify, or defer a user-visible feature
- the error suggests the original spec was wrong or incomplete
- there are multiple plausible UX directions
- a data migration, backup format change, or destructive operation is involved
- API usage might increase enough to risk rate limits or blocks
- a workaround would weaken privacy/local-first/offline guarantees
- the implementation would expand beyond the approved scope

A good agent recovery message looks like:

```text
The approved approach hit a blocker: [specific error].
I found two safe options:
A) [minimal fix, trade-off]
B) [broader fix, trade-off]
I recommend A because [reason]. Which direction do you want?
```

A bad recovery message is silently changing the product to make tests pass. That is exactly what this harness is meant to prevent.

## Recommended interaction patterns

### Planning only

```text
Read AGENTS.md and docs/contributing/agentic-engineering.md. I want [feature]. Create a spec only. Do not edit files.
```

### Implementation after approval

```text
Implement the approved spec. Keep changes minimal. Add/adjust evals for changed invariants. Run npm run eval:harness, npm run eval:danger, npm run build, and npm run smoke:browser if UI/routes changed. Report exact command output and changed files.
```

### Debugging

```text
Investigate [bug/error]. Reproduce it first or explain why it cannot be reproduced. Do not edit until you identify the likely failing layer and propose the smallest safe fix.
```

### Review an agent's work

```text
Review the current diff adversarially against AGENTS.md. Look for data-loss risk, mobile regressions, API abuse, lost features, and missing eval coverage. Do not edit files; return findings and recommended checks.
```

## When to update the harness

Update the harness when a bug reveals a missing invariant.

Examples:

- A route gets shadowed: add/update route-safety eval.
- A parser drops `$0`: add a price-parser case.
- A backup restore misses a new store key: extend backup-roundtrip fixture.
- A smoke test passes but CI hangs: fix process cleanup and keep the smoke step timeout short.
- A feature adds a new TCG/provider: extend provider-shape and provider-normalization evals.

The rule: if the bug was preventable, encode the lesson somewhere durable — an eval, smoke assertion, `AGENTS.md`, docs, or a Rarebox skill.
