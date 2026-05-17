---
name: supabase-multi-tenancy
description: Multi-tenant data scoping rules — every org-scoped query filters by session org_id from the server, never from client payload. Defense in depth on top of RLS.
type: rule
---

# Multi-Tenancy (Organizations)

> Read this when adding any table that holds data belonging to a buyer organization (`carts`, `quotes`, `orders`, `invoices`, etc.) or when reviewing a query/mutation that touches one.

## Mental model

Buyers in this platform are not lone users — they are users **within organizations**. One EPC firm has multiple employees using the same GST/PAN account. Ownership of business data lives at the org level.

```
users (auth identity)
  └─ memberships (user ↔ org, with role)
       └─ organizations (KYC, GST, PAN)
            └─ carts, quotes, orders, invoices, …
```

Every row in a "transactional" table carries an `org_id uuid NOT NULL` column.

## The rule

> When fetching, inserting, updating, or deleting org-scoped data on the server, the `org_id` MUST come from the authenticated session (resolved server-side from `auth.uid()` → `memberships`), NEVER from a value sent by the client.

This is true even though RLS will catch a wrong `org_id` at the DB layer. Defense in depth — and you'll also get clearer errors than RLS's silent "0 rows."

## Resolving org_id on the server

There are two flavours. Pick the right one for the request:

### 1. Single-org user (most cases)

Most buyer users belong to exactly one org. Resolve once per request:

```ts
// packages/auth/get-current-org.ts
import 'server-only';
import { createServerClient } from '@/packages/auth/server-client';

export async function getCurrentOrg() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: memberships, error } = await supabase
    .from('memberships')
    .select('org_id, role')
    .eq('user_id', user.id);

  if (error) throw error;
  if (!memberships?.length) throw new Error('No org membership');

  // Single-org case: return the one membership
  if (memberships.length === 1) {
    return { orgId: memberships[0].org_id, role: memberships[0].role };
  }

  // Multi-org case: see below
  throw new Error('Multi-org user — caller must specify');
}
```

### 2. Multi-org user (catalogue managers, super admin)

When a user belongs to several orgs, the active org is part of the **session state** — typically a `selected_org_id` cookie set when the user picks an org from a switcher. Always validate that the cookie value is actually one of the user's memberships before using it:

```ts
import { cookies } from 'next/headers';

export async function getActiveOrg() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const selected = (await cookies()).get('selected_org_id')?.value;

  const { data: memberships } = await supabase
    .from('memberships')
    .select('org_id, role')
    .eq('user_id', user.id);

  if (!memberships?.length) throw new Error('No org membership');

  const match = selected
    ? memberships.find(m => m.org_id === selected)
    : memberships[0];

  if (!match) throw new Error('Invalid org selection');
  return { orgId: match.org_id, role: match.role };
}
```

Never trust a `?org_id=` query param or a request body field. The cookie is auth-bound; raw params are not.

## In service modules

Every service module function that touches org-scoped data takes `orgId` as a typed argument resolved by the route handler / server action, not pulled from inside the service:

```ts
// packages/services/quotes/quotes.service.ts
export async function createQuote(args: { orgId: string; items: QuoteItem[] }) {
  // Trust args.orgId — caller is responsible for resolving it correctly
  return db.insert(quotes).values({ org_id: args.orgId, items: args.items });
}
```

The service is testable in isolation; the route handler is the trust boundary.

## In route handlers and server actions

```ts
// app/api/quotes/route.ts
import { getCurrentOrg } from '@/packages/auth/get-current-org';
import { createQuote } from '@/packages/services/quotes/quotes.service';
import { quoteInputSchema } from '@/packages/services/quotes/quotes.types';

export async function POST(req: Request) {
  const { orgId } = await getCurrentOrg(); // resolves from session — NOT from body
  const body = await req.json();
  const parsed = quoteInputSchema.parse(body); // validates items, ignores any org_id field
  const quote = await createQuote({ orgId, items: parsed.items });
  return Response.json(quote);
}
```

Note: if the client sends `body.org_id`, the Zod schema should explicitly omit/reject it. Use `.strict()` on the Zod object so unknown keys fail loudly rather than silently passing through.

## Joins to org-scoped data

When joining a public table (e.g. `products`) to org-scoped data (e.g. `cart_items` for "items in your cart"), the org filter goes on the org-scoped side:

```ts
// Get product details for items in current user's cart
db.select()
  .from(cartItems)
  .innerJoin(products, eq(cartItems.product_id, products.id))
  .where(eq(cartItems.org_id, orgId)); // ← org check, NOT on products
```

## Anti-patterns

- **Accepting `org_id` from the request body.** Always derived server-side. Even if Zod validates it, an attacker can submit a UUID belonging to a competitor.
- **Resolving `org_id` inside the service module by re-reading the session.** Couples business logic to Next.js. Pass it as an argument.
- **`getCurrentOrg()` in a loop.** Memoize per request (Next.js `cache()` helper) — one membership lookup per request is plenty.
- **Trusting "first membership" for catalogue managers.** Many internal users belong to a placeholder "internal" org; some belong to real orgs too. Always honour the selected-org cookie for multi-org users.
- **Storing `org_id` in `localStorage` as the "active" org.** Use an HTTP-only cookie or a server-rendered hidden field. localStorage is reachable by any browser-extension or XSS payload.
- **Forgetting `org_id` on a new table.** Every transactional table needs it as a non-null FK. The `db-reviewer` agent should flag missing org columns.

## Cross-cutting concerns

- **Audit logs** record `org_id` of the acting user plus `acted_on_org_id` of the affected row. Both for forensics.
- **Invoices and quotes** carry an immutable `org_id` snapshot — re-parenting a quote to a different org is not a supported operation, period.
- **Soft-delete** an org rather than cascading delete. Cascading delete of an org wipes years of order history; soft-delete preserves it for legal/GST audit purposes.
