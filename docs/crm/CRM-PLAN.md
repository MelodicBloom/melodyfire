# Melodyfire in-repo CRM — plan & handoff

Status: **foothold shipped** (gallery lead form → `inquiries`), rest deferred. No separate SaaS.

## What exists today (verified in code, 2026-10-26)
- Supabase table `inquiries` (written by ChildrensArt, Regenerative, and now Gallery with `inquiry_type = 'gallery_art'`).
- `/#/studio` (StudioPage) lists inquiries and sets `status` unread/read/archived.

## Shipped in this slice
- `/#/art` "Commission Similar" now pre-fills an on-page inquiry form (name, email, intent: commission/license/collaborate, brief) that inserts into `inquiries`; mailto fallback on error. Fixed a broken mailto that sent the literal text `${item.title}`.

## Risks found (must fix before promoting CRM)
1. **Studio has no auth gate in code** and reads `inquiries` with the public anon key. If RLS allows anon SELECT, lead PII is public. Action: verify RLS in Supabase project `ikfejoqvwmmqsuszpdhj`; allow anon INSERT only, SELECT/UPDATE only for an authenticated owner role; add Supabase Auth (magic link) gate to `/studio`.
2. Insert columns (`tier`, `inquiry_type`, `description`) are assumed — confirm schema; add a migration file to the repo.

## Next bounded slices
- S1 (security): RLS policies + Studio auth gate. Small.
- S2 (pipeline): add `stage` (new → qualified → quoted → won/lost), `value_estimate`, `next_action_at`, `source_ref` (artwork/project) to `inquiries`; Kanban view in Studio.
- S3 (notify): Supabase DB webhook / edge function → email to Jennipher on new inquiry (secret in Supabase, not repo).
- S4 (commerce link): quote → Gumroad/LemonSqueezy checkout link stored on the inquiry. Keep Gumroad for existing SKUs.
- Out of scope here: Substack publishing (see H5 design handoff), path routing migration (PR #6).
