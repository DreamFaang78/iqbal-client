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
