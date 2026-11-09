-- Fix: anon lead-form inserts are rejected in prod.
-- Live (Obsad read-only 2026-11-09): inquiries.status default 'new', CHECK in (new, read, replied, archived);
-- inquiries_public_insert WITH CHECK allowed only status IS NULL OR 'unread'.
-- Postgres applies the column default BEFORE the RLS WITH CHECK, so an insert that omits status
-- becomes 'new' and is denied (receipt: melodyfire-fixture-anon-matrix-2026-11-09.txt, step 1b, 42501).
-- DRAFT. NOT APPLIED. Idempotent.
drop policy if exists inquiries_public_insert on public.inquiries;
create policy inquiries_public_insert on public.inquiries
  for insert to anon, authenticated
  with check (
    status = 'new'
    and char_length(coalesce(name,'')) <= 200
    and char_length(coalesce(email,'')) between 3 and 320
    and char_length(coalesce(message,'')) <= 5000
    and char_length(coalesce(subject,'')) <= 500
    and char_length(coalesce(budget_range,'')) <= 200
    and char_length(coalesce(timeline,'')) <= 200
  );
