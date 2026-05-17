---
name: supabase-rls
description: Row-Level Security policy patterns for Supabase. Every table gets RLS, policies live in migrations, deny-by-default, tested with set role authenticated.
type: rule
---

# Supabase RLS

> Invoke this rule before adding any new table, changing an existing policy, or reviewing a migration that touches `auth.*` or `public.*` data.

## Non-negotiable defaults

1. **Every public table has RLS enabled.** No exceptions, including lookup tables. The CI check should grep for `CREATE TABLE` without an accompanying `ENABLE ROW LEVEL SECURITY`.
2. **Deny by default.** Enabling RLS without policies = nothing readable. That is the correct starting state. Add the minimum policy needed to unblock the feature, nothing more.
3. **Policies live in migration SQL files** alongside the table definition. Never set policies through the Supabase Studio UI in production — the change won't be in version control.
4. **`USING` and `WITH CHECK` are different things.** `USING` filters reads/updates/deletes; `WITH CHECK` validates inserts/updates. Most policies need both, mismatched.

## Standard policy shapes

### Org-scoped table (the common case for buyer-facing data)

For tables like `quotes`, `orders`, `carts` where every row belongs to one organization:

```sql
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Read: members of the org can see
CREATE POLICY "quotes_select_by_org_member"
  ON quotes FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Insert: must be inserted with an org_id the user belongs to
CREATE POLICY "quotes_insert_by_org_member"
  ON quotes FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Update/delete: same scope as select, plus a role check if needed
CREATE POLICY "quotes_update_by_org_member"
  ON quotes FOR UPDATE
  USING (org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid()))
  WITH CHECK (org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid()));
```

### Public-readable catalogue table

For `products`, `brands`, `categories` — visible to anonymous visitors:

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_public"
  ON products FOR SELECT
  USING (true);

-- No insert/update/delete policy → writes blocked for non-service-role.
```

### Internal-role-only table

For `suppliers`, `purchase_orders`, `audit_logs` — invisible to buyers:

```sql
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "suppliers_select_internal_only"
  ON suppliers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.internal_role IN ('catalogue_manager', 'procurement_staff', 'procurement_admin', 'super_admin')
    )
  );
```

## Helper functions

Push complex membership/role checks into security-definer SQL functions so policies stay readable:

```sql
CREATE OR REPLACE FUNCTION public.is_org_member(target_org uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM memberships
    WHERE user_id = auth.uid() AND org_id = target_org
  );
$$;
```

Then: `USING (public.is_org_member(org_id))`.

`STABLE` matters — lets Postgres cache the result within a query. `SECURITY DEFINER` lets the function bypass RLS on `memberships` while the policy itself remains restrictive.

## Testing policies

Test inside a psql or migration test, never trust visual inspection. Use the local Supabase Docker DB (§5.4 of the spec):

```sql
BEGIN;
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claim.sub TO '00000000-0000-0000-0000-000000000001';

-- Should return rows
SELECT * FROM quotes WHERE org_id = 'org-the-user-belongs-to';

-- Should return zero rows (different org)
SELECT * FROM quotes WHERE org_id = 'org-they-do-not-belong-to';

ROLLBACK;
```

A migration is not complete until its policies have been exercised this way.

## Service-role bypass

The `service_role` key bypasses RLS entirely. That's its purpose — for trusted server-side code. It also means a leaked service-role key is a complete database compromise. See `_rules/supabase/service-role-key.md` for the handling rules.

When you find yourself reaching for service-role in app code, ask: "Could a `SECURITY DEFINER` function with a tight check accomplish this instead?" Usually yes, and that's the safer choice.

## Anti-patterns

- **Trusting the client to send a correct `org_id`.** RLS catches this but you should still filter in application code (defense in depth). See `_rules/supabase/multi-tenancy.md`.
- **Using `auth.uid()` directly in every policy.** Wrap in helper functions for joined checks — keeps policies one-liners and the logic in one place.
- **Disabling RLS "temporarily" to debug.** Never. Use a separate role with `BYPASSRLS` if you need that, or use service-role from a trusted shell.
- **Policy named after the column it filters** (`policy_org_id_eq_user_org`). Name after the *intent* — `quotes_select_by_org_member`.
- **Per-row owner check via `created_by = auth.uid()`** on org-scoped tables. Use the org check instead — one user, multiple org members can see the same quote.
