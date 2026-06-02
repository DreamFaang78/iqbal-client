-- ============================================================================
-- Reconcile live database with what the HOMMED app expects
-- ----------------------------------------------------------------------------
-- Run this once in the Supabase dashboard → SQL Editor → New query → Run.
-- It is idempotent and safe to re-run.
--
-- Findings from the live schema (everything else already matches the code):
--   • profiles.role has a CHECK constraint that only allows 'admin'/'patient',
--     which blocks the 'staff' role the clinical portal needs
--     (verifyStaffToken authorizes role in ('staff','admin')).
--   • profiles.role is nullable with no default; the app assumes 'patient' when
--     a role is absent, so we make that explicit and backfill any null rows.
-- ============================================================================

-- 1. Allow the 'staff' role (plus 'admin' and 'patient').
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'staff', 'patient'));

-- 2. Backfill any existing NULL roles to the default, then enforce default.
update public.profiles set role = 'patient' where role is null;

alter table public.profiles
  alter column role set default 'patient';

-- ============================================================================
-- Public insert policies for leads + appointments
-- ----------------------------------------------------------------------------
-- The live DB rejects anon inserts on `leads` (and likely `appointments`) with
-- error 42501. Public popup/contact/booking submissions currently work ONLY
-- because the API uses the service-role key, which bypasses RLS. This makes
-- those flows fragile. The policies below allow the intended public inserts so
-- lead/booking capture is robust even without the service-role client.
-- Idempotent: drop-then-create.
-- ============================================================================

alter table public.leads        enable row level security;
alter table public.appointments enable row level security;

drop policy if exists "leads_insert_public" on public.leads;
create policy "leads_insert_public"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "appointments_insert_public" on public.appointments;
create policy "appointments_insert_public"
  on public.appointments
  for insert
  to anon, authenticated
  with check (true);
