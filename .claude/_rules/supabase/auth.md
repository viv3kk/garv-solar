---
name: supabase-auth
description: Supabase Auth setup with Next.js App Router — SSR session cookies, server-side verification, OAuth, signup flows, role + RLS-aware queries.
type: rule
---

# Supabase Auth (Next.js App Router)

> Read this when wiring login, signup, OAuth, password reset, protected routes, or any action that depends on the current user. Phase 1 has email/password + Google OAuth — start there, add MFA later for internal roles.

## Client architecture (three flavours)

There are three Supabase client constructors in a Next.js App Router app. Use the right one:

| Client | Where | Auth state | RLS posture |
|---|---|---|---|
| Browser client (`createBrowserClient`) | Client Components | Reads `sb-*` cookies via `@supabase/ssr` | Authenticated as the logged-in user |
| Server client (`createServerClient`) | Server Components, Route Handlers, Server Actions | Reads cookies via `next/headers` | Authenticated as the logged-in user |
| Admin client (`createClient` w/ service-role) | Server-only utilities | No session | Bypasses RLS — see `_rules/supabase/service-role-key.md` |

Use `@supabase/ssr` (not the old `@supabase/auth-helpers-nextjs`). The SSR package handles the cookie ↔ header dance correctly across RSC, route handlers, and middleware.

## Canonical client factories

Put these in `packages/auth/`:

```ts
// packages/auth/browser.ts
'use client';
import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

```ts
// packages/auth/server.ts
import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component — Next.js disallows set here.
            // Middleware handles refresh; this catch is intentional.
          }
        },
      },
    },
  );
}
```

## Middleware: refresh sessions on every request

```ts
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          toSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options));
        },
      },
    },
  );

  // This call refreshes the session if needed; do not remove.
  await supabase.auth.getUser();

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)'],
};
```

Without the middleware, expired sessions on first navigation cause a flash of unauthenticated state.

## Always use `getUser()`, never `getSession()` on the server

`getSession()` reads from cookies (which are user-mutable). `getUser()` verifies the JWT with the auth server, so it's authoritative:

```ts
const supabase = await createSupabaseServer();
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) redirect('/login');
```

This is one round-trip but it's cached for the request — cheap.

## Protecting routes

### Server Component pages (preferred for shop pages)

```tsx
// app/(buyer)/cart/page.tsx
import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/packages/auth/server';

export default async function CartPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/cart');

  // ...fetch user-scoped data via RLS
}
```

### Route Handlers / Server Actions

```ts
export async function POST(req: Request) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  // ... proceed with mutation
}
```

## Signup → org creation flow

Phase 1 signup creates a user *and* a single-member org. Two-step:

```ts
// 1. Sign up via Supabase (sends verification email)
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { emailRedirectTo: `${origin}/auth/callback` },
});

// 2. After verification, in the callback handler, create the org + membership
// (Do this in a Server Action or Route Handler, not on the client.)
```

A Postgres `AFTER INSERT` trigger on `auth.users` can auto-create a `profiles` row, but the org/membership creation should be an explicit step so the user picks a company name.

## OAuth (Google)

```ts
// Client side — initiate
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${origin}/auth/callback` },
});
```

```ts
// app/auth/callback/route.ts — handle the redirect
import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/packages/auth/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createSupabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(next, req.url));
}
```

## Role checks (RBAC layer on top of RLS)

RLS handles row-level access. Application code checks "can this user reach this UI / action at all":

```ts
const supabase = await createSupabaseServer();
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect('/login');

const { data: profile } = await supabase
  .from('profiles')
  .select('internal_role')
  .eq('user_id', user.id)
  .single();

if (!['catalogue_manager', 'super_admin'].includes(profile?.internal_role ?? '')) {
  redirect('/'); // not an admin
}
```

For the admin subdomain, this check goes in middleware so it runs before any page renders.

## Password reset

```ts
// 1. Request reset
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${origin}/auth/update-password`,
});

// 2. User clicks the link, lands on /auth/update-password (a server component
//    that exchanges the recovery token for a session via middleware)

// 3. User submits a new password via Server Action
await supabase.auth.updateUser({ password: newPassword });
```

## Anti-patterns

- **Storing user data in `localStorage` "for convenience."** All session state lives in the auth cookie. localStorage = XSS-readable.
- **Calling `getSession()` to decide what to render.** Spoofable. Use `getUser()`.
- **Letting the client tell you their role.** Read from `profiles.internal_role` on the server every request. Cache with `cache()` if needed.
- **Trusting `redirectTo` query params verbatim.** Validate against an allowlist of internal paths before redirecting — otherwise it's an open-redirect bug.
- **Building your own JWT verification.** Supabase's client does it correctly; don't reinvent.
- **Forgetting middleware.** Without it, sessions can appear to be expired for one request after refresh — confusing UX.
