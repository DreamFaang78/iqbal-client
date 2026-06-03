-- ============================================================================
-- HOMMED CRM v2.0 Database Migration Script
-- ----------------------------------------------------------------------------
-- Provisions additional fields and optimization indices for Leads and Appointments,
-- and creates the new `follow_ups` table.
--
-- HOW TO RUN:
--   1. Open the Supabase dashboard → SQL Editor → New query.
--   2. Paste the full contents of this file and click "Run".
-- ============================================================================

-- 1. Alter public.leads table (adding 8 new columns)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lead_source text DEFAULT 'contact';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS follow_up_scheduled timestamptz;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS is_duplicate boolean DEFAULT false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS city text;

-- 2. Alter public.appointments table (adding 8 new columns)
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS appointment_type text DEFAULT 'Clinic 1';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS patient_email text;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS patient_age integer;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS patient_gender text;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS patient_city text;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS disease text;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 3. Create public.follow_ups table
CREATE TABLE IF NOT EXISTS public.follow_ups (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id        uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  follow_up_date date NOT NULL,
  follow_up_time text,
  notes          text,
  status         text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- 4. Enable Row Level Security (RLS) on new tables
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;

-- No anon or authenticated access policies are defined for public.follow_ups by default.
-- With RLS enabled, all anon/authenticated access is denied. The API route will
-- query it via the service-role client (supabaseAdmin), keeping it secure.

-- 5. Create performance optimization indices
CREATE INDEX IF NOT EXISTS idx_leads_lead_source ON public.leads(lead_source);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone);
CREATE INDEX IF NOT EXISTS idx_appointments_appointment_type ON public.appointments(appointment_type);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_schedule_date ON public.appointments(schedule_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_phone ON public.appointments(patient_phone);
CREATE INDEX IF NOT EXISTS idx_follow_ups_lead_id ON public.follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_appointment_id ON public.follow_ups(appointment_id);
