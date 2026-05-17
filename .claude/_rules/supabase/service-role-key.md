---
name: supabase-service-role-key
description: Hard rules for handling SUPABASE_SERVICE_ROLE_KEY — never on client, only in server contexts, CI grep to prevent leaks.
type: rule
---

# Supabase Service-Role Key

> The single most dangerous credential in this project. A leak = full database compromise (RLS bypass, all rows, all writes). Read this before touching any code that imports it.

## The rule

`SUPABASE_SERVICE_ROLE_KEY` may appear **only** in code paths that:

1. Run exclusively on the server (Server Components, Route Handlers, Server Actions, `packages/services/*`)
2. Are imported only by other server-only modules
3. Cannot be reached by the client bundle through any import path

Anything else is a bug, regardless of how clever the conditional looks.

## Concrete file rules

### Allowed locations

- `app/**/route.ts` — Route Handlers
- `app/**/actions.ts` and any file beginning with `'use server'` — Server Actions
- `app/**/page.tsx` and `app/**/layout.tsx` **only inside async server component bodies, never in module scope** that might leak via export
- `packages/services/**/*.ts` — business logic modules
- `packages/db/**/*.ts` — DB client factory (the canonical home for the admin client)
- `scripts/**/*.ts`, `scripts/**/*.py` — one-off backfills, migrations, scrapers

### Forbidden locations

- `app/**/page.tsx` or component files at module top level (gets included in the client RSC payload)
- Any file with `'use client'` at the top
- `packages/ui/**` — shared client components
- `next.config.ts` — exposed to build output
- Anywhere it might end up in `process.env` referenced from a `'use client'` boundary

## Canonical pattern

Centralise the admin client in one file so the danger surface stays auditable:

```ts
// packages/db/admin.ts
import 'server-only'; // hard fails if imported from client code
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');

export const supabaseAdmin = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
```

Every other file imports `supabaseAdmin` from here. Never call `createClient(url, SUPABASE_SERVICE_ROLE_KEY, ...)` inline elsewhere.

The `import 'server-only';` line is load-bearing — Next.js's `server-only` package throws at build time if any client-reachable graph imports this file.

## Why ENV access alone isn't enough

`process.env.SUPABASE_SERVICE_ROLE_KEY` will be `undefined` in the browser at runtime, so a client component "accessing" it would be a no-op rather than a leak. But:

- A clever bundler/inline replacement could substitute the value at build time.
- A naive developer might copy a pattern from a server component into a client component.
- Logging the env value during a hydration mismatch will surface it in source maps.

The `'server-only'` import is the only reliable guarantee.

## When to reach for it (and when not to)

Use it for:
- Writing to `audit_logs` (insert-only at the application layer)
- Cron-triggered batch jobs (no user session)
- Webhook handlers from Resend, payment provider, etc.
- One-off migrations that need to bypass RLS

Do **not** use it as a shortcut to fix a "policy is annoying" problem in normal request flow. That's a sign the RLS policy is wrong, not a sign you need to bypass it. Fix the policy.

## CI / pre-commit check

Add a grep guard to prevent regressions:

```bash
# Scripts/check-service-role-leaks.sh
# Fails CI if SUPABASE_SERVICE_ROLE_KEY appears outside allowed locations.

set -e

# Allow only inside these patterns
ALLOWED='packages/db/|/route\.ts$|/actions\.ts$|^scripts/|server-only'

# Find usages
matches=$(grep -RIn 'SUPABASE_SERVICE_ROLE_KEY' apps/ packages/ scripts/ 2>/dev/null || true)

if [ -z "$matches" ]; then
  echo "OK: no service-role-key usages found"
  exit 0
fi

# Check each line is in an allowed file
echo "$matches" | while IFS=: read -r file line _; do
  if ! echo "$file" | grep -qE "$ALLOWED"; then
    echo "ERROR: SUPABASE_SERVICE_ROLE_KEY used in $file:$line"
    exit 1
  fi
done

echo "OK: all usages in allowed locations"
```

Wire this into `lint-staged` or a GitHub Action.

## Anti-patterns

- **"It's behind a `typeof window === 'undefined'` check, it's fine."** No. The check happens at runtime; the value still goes into the client bundle if imported from a client-reachable file.
- **Logging `process.env` for debugging.** Strip env logs before commit. Sentry already redacts most secrets but don't rely on it for service-role.
- **Passing service-role key as a function argument** from a Server Component to a Client Component prop. The prop gets serialized into the page payload — pure leak.
- **Exposing as `NEXT_PUBLIC_SERVICE_ROLE_KEY`.** This is the worst possible mistake. The `NEXT_PUBLIC_` prefix is for client-safe values *by definition*. CI must hard-fail on any env var matching `NEXT_PUBLIC_.*SERVICE.*ROLE`.
