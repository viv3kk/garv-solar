# `.claude/` — Project-Local Agent Assets

This directory holds a project-local copy of agents, skills, rules, and example
configurations curated from the
[`affaan-m/everything-claude-code`](https://github.com/affaan-m/everything-claude-code)
plugin marketplace, scoped to a **Next.js / React / TypeScript marketing site**.
Go, Python, PHP, Swift, and Rust assets from the upstream plugin are intentionally
omitted.

> The plugin marketplace install (`/plugin marketplace add affaan-m/everything-claude-code`)
> is a *separate* one-time user-side step that exposes these as namespaced slash
> commands inside Claude Code — the local copies here are the fallback for
> visibility, version control, and use in non-Claude-Code harnesses.

## What's in this directory

### `agents/` — Specialised sub-agent prompts
Drop-in personas Claude Code can dispatch via the Task tool. Each file is a
markdown document with YAML front-matter (`name`, `description`, `tools`, `model`)
followed by the system prompt.

| File | Use when… |
|---|---|
| [`agents/typescript-reviewer.md`](./agents/typescript-reviewer.md) | Reviewing TypeScript/JavaScript changes for type safety, async correctness, security, and idiomatic patterns. |
| [`agents/db-reviewer.md`](./agents/db-reviewer.md) | Supabase + Drizzle database review — schema design, RLS policies, multi-tenancy, indexes, JSONB shape, migration safety. Invoke whenever migrations, schema, or service-module DB queries change. |
| [`agents/code-reviewer.md`](./agents/code-reviewer.md) | General-purpose code review (language-agnostic) for quality, security, maintainability. |
| [`agents/security-reviewer.md`](./agents/security-reviewer.md) | Security-focused review — secrets, auth, injection, deserialisation, supply chain. |
| [`agents/refactor-cleaner.md`](./agents/refactor-cleaner.md) | Pure refactors — dead code, duplication, naming, structural cleanup with no behaviour change. |
| [`agents/planner.md`](./agents/planner.md) | Breaking down ambiguous tasks into a concrete plan before implementation. |
| [`agents/doc-updater.md`](./agents/doc-updater.md) | Keeping README/CLAUDE.md/comments in sync after code changes. |

Source: <https://github.com/affaan-m/everything-claude-code/tree/main/agents>

### `skills/` — Reusable workflow skills
Each skill is a self-contained directory with a `SKILL.md` describing when to
invoke it and what steps to take.

| Skill | What it gives you |
|---|---|
| [`skills/frontend-patterns/`](./skills/frontend-patterns/SKILL.md) | React/Next.js component, state, and rendering patterns. |
| [`skills/search-first/`](./skills/search-first/SKILL.md) | Reminder to grep/glob the codebase before writing new code. |
| [`skills/tdd-workflow/`](./skills/tdd-workflow/SKILL.md) | Red → green → refactor loop with test-first discipline. |
| [`skills/e2e-testing/`](./skills/e2e-testing/SKILL.md) | Playwright/Cypress end-to-end test design. |
| [`skills/security-review/`](./skills/security-review/SKILL.md) | Structured security checklist (auth, input validation, supply chain). |
| [`skills/liquid-glass-design/`](./skills/liquid-glass-design/SKILL.md) | iOS-26-style "Liquid Glass" visual design system — relevant for the calculator's glass aesthetic. |

> `skills/refactor-clean/SKILL.md` does not exist upstream — skipped.

Source: <https://github.com/affaan-m/everything-claude-code/tree/main/skills>

### `_rules/` — On-demand rules (NOT auto-loaded)

> Renamed from `rules/` → `_rules/` so Claude Code does **not** auto-inject these
> ~13k tokens of guidance on every prompt. Invoke explicitly when relevant.

Usage from chat:

> "Follow `.claude/_rules/typescript/coding-style.md` for this refactor"
> "Use `.claude/_rules/common/security.md` as the checklist for this review"

The three always-on essentials (immutability, error handling, validate at
boundaries) have been inlined into the root `CLAUDE.md` so they apply without an
explicit invocation. Everything else is summoned on demand.

- **`_rules/common/`** — language-agnostic: `agents.md`, `code-review.md`,
  `coding-style.md`, `development-workflow.md`, `git-workflow.md`, `hooks.md`,
  `patterns.md`, `performance.md`, `security.md`, `testing.md`,
  `api-design.md`, `backend-patterns.md`, `database-migrations.md`,
  `postgres-patterns.md`.
- **`_rules/typescript/`** — TypeScript/JavaScript-specific: `coding-style.md`,
  `hooks.md`, `patterns.md`, `security.md`, `testing.md`.
- **`_rules/supabase/`** — *(bespoke, written for this project)* `rls.md`,
  `service-role-key.md`, `multi-tenancy.md`, `auth.md`.
- **`_rules/drizzle/`** — *(bespoke)* `migrations.md`.

The five Supabase/Drizzle files are **not from upstream** — they were written for
this project to capture Phase 1 backend conventions from
`solar-marketplace-spec-v2.md`. Edit them as the project evolves.

Source (upstream files only): <https://github.com/affaan-m/everything-claude-code/tree/main>

### `examples/`

- [`examples/saas-nextjs-CLAUDE.md`](./examples/saas-nextjs-CLAUDE.md) — a fully
  worked example `CLAUDE.md` for a Next.js + Supabase + Stripe SaaS app. Useful
  as a reference when expanding the project's own `CLAUDE.md` (note: the actual
  project `CLAUDE.md` lives at the repo root and should remain the source of
  truth).

Source: <https://github.com/affaan-m/everything-claude-code/tree/main/examples>

## How a future Claude Code session uses these

1. **As namespaced slash commands** — if the user has run
   `/plugin marketplace add affaan-m/everything-claude-code` and installed the
   plugin, the agents and skills are available as `/everything:<name>` (or
   similar) commands directly. This is the primary, recommended path.
2. **As project-local context (the fallback)** — even without the plugin
   installed, Claude Code reads `.claude/` for project-scoped agents, skills,
   and rules. The on-demand `_rules/` files must be referenced explicitly by path —
   they are intentionally NOT auto-loaded.
3. **As reference material for non-Claude-Code harnesses** — when this repo is
   driven by another agent framework (Cursor, Windsurf, custom harness),
   `.claude/` doubles as version-controlled prompt library — point any harness
   at the markdown files directly.

## Provenance

All files in this directory were fetched on 2026-05-18 from
[`affaan-m/everything-claude-code@main`](https://github.com/affaan-m/everything-claude-code).
They are committed verbatim (no local edits) so an upstream diff is always
trivial to compute. To refresh, re-run the same fetch flow.
