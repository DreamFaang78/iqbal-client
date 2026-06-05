-- ============================================================================
-- HOMMED — Supabase Database Schema
-- ----------------------------------------------------------------------------
-- Dr. Iqbal's Homeopathy Centre (Kanpur) clinic web application.
--
-- HOW TO RUN:
--   1. Open the Supabase dashboard → SQL Editor → New query.
--   2. Paste the full contents of this file and click "Run".
--   3. The script is idempotent: it is safe to run multiple times. It uses
--      `create table if not exists` and (in later sections) `create or replace`
--      for functions/policies, so re-running will not drop existing data.
--
-- Column names are snake_case to match exactly what the Next.js API route
-- handlers in `app/api/**/route.ts` read and write.
--
-- File structure:
--   - TABLES                  (this task)
--   - RLS POLICIES            (added in task 2.2)
--   - TRIGGERS & SEED         (added in task 2.3)
-- ============================================================================

-- Required for gen_random_uuid().
create extension if not exists pgcrypto;

-- ============================================================================
-- ============ TABLES ============
-- ============================================================================

-- profiles: one row per auth user; holds display info and role.
-- Read by every verify*Token helper to resolve the caller's role.
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  phone      text,
  role       text not null default 'patient' check (role in ('admin', 'staff', 'patient')),
  created_at timestamptz default now()
);

-- appointments: public booking requests + admin-managed scheduling.
-- Matches app/api/appointments/route.ts (user_id, patient_name, patient_phone,
-- doctor_name, service, schedule_date, schedule_time, status, payment_status).
create table if not exists public.appointments (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id),
  patient_name   text not null,
  patient_phone  text not null,
  doctor_name    text default 'Dr. Iqbal',
  service        text,
  schedule_date  text,
  schedule_time  text,
  status         text default 'Pending',
  payment_status text default 'Pending',
  created_at     timestamptz default now()
);

-- leads: CRM inquiries from contact form, popups, and auto-created on booking.
-- Matches app/api/leads/route.ts (name, phone, email, inquiry, status,
-- follow_up_date).
create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  phone          text not null,
  email          text,
  inquiry        text,
  status         text default 'New Lead',
  follow_up_date text,
  created_at     timestamptz default now()
);

-- services: homeopathy service catalogue shown on the public site.
-- Matches app/api/services/route.ts (slug unique, short_description,
-- detailed_description, symptoms[], treatments[]).
create table if not exists public.services (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null,
  slug                 text unique not null,
  icon                 text,
  short_description    text,
  detailed_description text,
  symptoms             text[] default '{}',
  treatments           text[] default '{}',
  created_at           timestamptz default now()
);

-- blogs: published articles. Matches app/api/blogs/route.ts (slug unique,
-- category, content, excerpt, author, image, published_at).
create table if not exists public.blogs (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text unique not null,
  category     text,
  content      text,
  excerpt      text,
  author       text default 'Dr. Iqbal',
  image        text,
  published_at timestamptz default now()
);

-- popups: site popup configurations. Matches app/api/popups/route.ts
-- (type, title, content, is_active, delay_seconds).
create table if not exists public.popups (
  id            uuid primary key default gen_random_uuid(),
  type          text not null,
  title         text,
  content       text,
  is_active     boolean default false,
  delay_seconds int default 5
);

-- patients: clinical patient records (staff/admin only).
-- Matches app/api/staff/patients/route.ts (name, phone, email, age, gender,
-- address, blood_group, known_allergies, chronic_conditions,
-- emergency_contact, notes).
create table if not exists public.patients (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  phone              text not null,
  email              text,
  age                int,
  gender             text,
  address            text,
  blood_group        text,
  known_allergies    text,
  chronic_conditions text,
  emergency_contact  text,
  notes              text,
  created_at         timestamptz default now()
);

-- patient_notes: free-text clinical notes per patient.
-- Matches app/api/staff/notes/route.ts (patient_id, note).
create table if not exists public.patient_notes (
  id         uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade,
  note       text,
  created_at timestamptz default now()
);

-- prescriptions: clinical prescriptions; `medicines` is a JSON array of
-- { name, potency, dosage, duration, instructions }.
-- Matches app/api/staff/prescriptions/route.ts (patient_id, appointment_id,
-- diagnosis, chief_complaint, medicines, dietary_advice, follow_up_date,
-- remarks, issued_at).
create table if not exists public.prescriptions (
  id             uuid primary key default gen_random_uuid(),
  patient_id     uuid references public.patients(id) on delete cascade,
  appointment_id uuid,
  diagnosis      text,
  chief_complaint text,
  medicines      jsonb default '[]',
  dietary_advice text,
  follow_up_date text,
  remarks        text,
  issued_at      timestamptz default now()
);

-- patient_timeline: chronological clinical events per patient.
-- Matches app/api/staff/timeline/route.ts (patient_id, event_type, title,
-- description).
create table if not exists public.patient_timeline (
  id          uuid primary key default gen_random_uuid(),
  patient_id  uuid references public.patients(id) on delete cascade,
  event_type  text,
  title       text,
  description text,
  created_at  timestamptz default now()
);

-- ============================================================================
-- ============ RLS POLICIES (task 2.2) ============
-- ============================================================================
-- Row Level Security model (see design "C5. Database schema + seed"):
--   - Public read:   services, blogs, popups  (anon SELECT).
--   - Public insert: leads, appointments       (anon INSERT for booking/lead
--                    capture, which are unauthenticated by design).
--   - Own-row:       profiles                  (a signed-in user can read and
--                    update only their own row).
--   - Clinical:      patients, patient_notes, prescriptions, patient_timeline
--                    have RLS enabled with NO anon/authenticated policies, so
--                    they DENY BY DEFAULT. The API routes reach them through the
--                    service-role client (supabaseAdmin), which BYPASSES RLS, so
--                    server-side access keeps working while the anon key cannot
--                    touch clinical data directly.
--
-- NOTE: enabling RLS on a table with no matching policy denies all access for
-- the anon/authenticated roles (the service role always bypasses RLS). For the
-- non-clinical tables below we add explicit policies for the access we DO want.
--
-- CREATE POLICY has no "if not exists", so every policy is preceded by
-- `drop policy if exists` to keep this script idempotent / re-runnable.

-- ----------------------------------------------------------------------------
-- Enable RLS on every table.
-- ----------------------------------------------------------------------------
alter table public.profiles         enable row level security;
alter table public.appointments     enable row level security;
alter table public.leads            enable row level security;
alter table public.services         enable row level security;
alter table public.blogs            enable row level security;
alter table public.popups           enable row level security;
alter table public.patients         enable row level security;
alter table public.patient_notes    enable row level security;
alter table public.prescriptions    enable row level security;
alter table public.patient_timeline enable row level security;

-- ----------------------------------------------------------------------------
-- profiles: a user may read and update only their own row.
-- (role is not self-elevatable by anon; service role manages roles.)
-- ----------------------------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- A signed-in user may create only their own profile row (id must equal their
-- auth uid). The handle_new_user() trigger (task 2.3) also inserts profiles via
-- the trigger owner; this policy covers any direct authenticated self-insert.
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- services / blogs / popups: public (anon) read.
-- The UI filters popups by is_active client-side.
-- ----------------------------------------------------------------------------
drop policy if exists "services_select_public" on public.services;
create policy "services_select_public"
  on public.services
  for select
  to anon, authenticated
  using (true);

drop policy if exists "blogs_select_public" on public.blogs;
create policy "blogs_select_public"
  on public.blogs
  for select
  to anon, authenticated
  using (true);

drop policy if exists "popups_select_public" on public.popups;
create policy "popups_select_public"
  on public.popups
  for select
  to anon, authenticated
  using (true);

-- ----------------------------------------------------------------------------
-- leads / appointments: public (anon) insert for unauthenticated booking and
-- lead capture. SELECT/UPDATE are intentionally NOT granted here — admin reads
-- go through the service-role client, enforced at the route layer.
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- patients / patient_notes / prescriptions / patient_timeline:
-- NO anon/authenticated policies are defined. With RLS enabled above, every
-- request from the anon/authenticated roles is denied by default. The staff
-- API routes access these tables via the service-role client (supabaseAdmin),
-- which bypasses RLS, behind verifyStaffToken role checks.
-- (Intentionally no CREATE POLICY statements for these four tables.)


-- ============================================================================
-- ============ TRIGGERS & SEED (task 2.3) ============
-- ============================================================================
-- This section is idempotent and safe to re-run:
--   - handle_new_user() uses `create or replace function` and the trigger is
--     dropped-then-created.
--   - services/blogs are seeded with `on conflict (slug) do nothing`.
--   - popups have no natural unique key, so the popup seed is guarded with
--     `where not exists (select 1 from public.popups)` — it inserts the default
--     set only when the table is currently empty.
--
-- IMPORTANT: single-quote (') characters inside the seeded text are escaped by
-- doubling them ('') per SQL string rules. Curly apostrophes (’) are ordinary
-- characters and need no escaping.

-- ----------------------------------------------------------------------------
-- handle_new_user(): auto-create a profiles row whenever an auth user is added.
-- Role defaults to 'patient'; the bootstrap admin email becomes 'admin'.
-- Name/phone are pulled from auth.users.raw_user_meta_data when present (the
-- signup route stores them as `name` / `phone`; `full_name` / `phone_number`
-- are accepted as fallbacks for OAuth-style metadata, then literal 'User' / ''
-- so the NOT-NULL-friendly columns always get a value).
-- SECURITY DEFINER lets the trigger insert into public.profiles regardless of
-- the calling role; search_path is pinned to avoid hijacking.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', 'User'),
    coalesce(new.raw_user_meta_data->>'phone', new.raw_user_meta_data->>'phone_number', ''),
    case
      when lower(new.email) = 'admin@hommed.com' then 'admin'
      else 'patient'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Recreate the trigger idempotently.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Seed: services (8 rows from DEFAULT_SERVICES in lib/data.ts).
-- ----------------------------------------------------------------------------
insert into public.services
  (title, slug, icon, short_description, detailed_description, symptoms, treatments)
values
  (
    'Skin Disorders',
    'skin-disorders',
    'Sparkles',
    'Natural, permanent relief for Eczema, Psoriasis, Acne, and White Patches (Vitiligo).',
    'Skin disorders are often an external reflection of internal imbalances. Our homeopathic approach targets the root cause—such as immune dysfunction, stress, or toxin build-up—rather than just suppressing external symptoms. We provide customized treatment plans that stimulate your body’s innate healing mechanism, restoring healthy skin naturally without harsh steroid creams.',
    array['Itching and redness', 'Dry, scaly patches', 'Chronic acne breakouts', 'Depigmentation (white patches)', 'Inflammation and blistering'],
    array['Constitutional Homeopathic Therapy', 'Blood purification triggers', 'Anti-inflammatory symptom matching', 'Immune regulation guidance']
  ),
  (
    'Hair Fall & Alopecia',
    'hair-fall',
    'FlameKindling',
    'Advanced clinical treatment for Hair Loss, Dandruff, and Alopecia Areata.',
    'Hair loss can be triggered by genetic factors, hormonal changes, nutritional deficiencies, or high stress levels. Homeopathy offers safe and effective treatments that stimulate hair follicles, control excessive shedding, and treat scalp infections like stubborn dandruff or seborrheic dermatitis. Our customized therapies work inside out to promote healthy hair regrowth.',
    array['Excessive daily hair shedding', 'Thinning hair density', 'Patchy baldness (Alopecia Areata)', 'Itchy, flakey scalp (Dandruff)', 'Premature hair greying'],
    array['Follicular stimulation therapy', 'Hormonal balancing formulas', 'Scalp health nourishment regimens', 'Stress-reduction homeopathy remedies']
  ),
  (
    'Allergy & Asthma',
    'allergy-treatment',
    'Wind',
    'De-sensitize your immune system to overcome chronic Allergies, Rhinitis, and Sinus.',
    'Allergy occurs when the immune system overreacts to harmless substances like dust, pollen, or certain foods. Our homeopathic treatment aims to reduce this hypersensitivity. By strengthening the immune system, we help patients overcome chronic sneezing, watery eyes, allergic asthma, and sinus inflammation, offering long-term freedom from daily antihistamines.',
    array['Frequent sneezing and runny nose', 'Wheezing and shortness of breath', 'Watery, itchy, or swollen eyes', 'Chronic sinus blockages and headaches', 'Skin rashes and hives (Urticaria)'],
    array['Immunomodulator homeopathic prescriptions', 'Acute allergy relief tinctures', 'Desensitization mapping', 'Respiratory lung strengthening therapy']
  ),
  (
    'Migraine & Chronic Headache',
    'migraine',
    'Brain',
    'Gentle treatments that target vascular and nervous triggers of intense migraines.',
    'Migraines are vascular headaches caused by abnormal brain activity affecting nerve signals, chemicals, and blood vessels. Suppressive painkillers only offer temporary relief and carry side-effects. Homeopathy addresses triggers like stress, gastric upset, or hormonal fluctuations, decreasing the intensity and frequency of attacks permanently.',
    array['Throbbing headache on one side of head', 'Nausea, vomiting, and dizziness', 'Extreme sensitivity to light and sound', 'Visual disturbances or aura', 'Chronic stress-induced head tension'],
    array['Vascular congestion relief prescriptions', 'Neural regulator remedies', 'Gastric-headache link remedies', 'Relaxation constitutional care']
  ),
  (
    'PCOS & Women’s Health',
    'pcos',
    'Activity',
    'Hormonal regulation therapies for PCOS, irregular cycles, and thyroid concerns.',
    'Hormonal imbalances like Polycystic Ovary Syndrome (PCOS), irregular periods, and thyroid issues respond beautifully to homeopathy. Instead of using artificial hormones or birth control pills, we prescribe natural remedies that stimulate the endocrine glands to function correctly. This restores menstrual regularity, controls weight gain, and treats cysts naturally.',
    array['Irregular or missed menstrual cycles', 'Ovarian cysts on ultrasound', 'Excessive facial hair and acne', 'Unexplained weight gain', 'Mood swings and fatigue'],
    array['Endocrine regulatory therapy', 'Ovarian cyst absorption formulas', 'Constitutional metabolic regulators', 'Stress-PMS matching cures']
  ),
  (
    'Child Care & Immunity',
    'child-care',
    'Baby',
    'Safe, sweet pills to boost immunity and treat recurrent tonsillitis, cold, and cough.',
    'Children respond exceptionally well to homeopathy. The medicines are sweet and easy to take, and completely safe without side effects. We specialize in boosting kids’ immunity, treating recurrent cold and cough, tonsillitis, bedwetting, and teething problems, while reducing dependence on antibiotics.',
    array['Recurrent cold, cough, and fever', 'Swollen tonsils (Tonsillitis)', 'Digestive disorders or poor appetite', 'Skin rashes and allergies', 'Bedwetting or behavioral concerns'],
    array['Immune booster pediatric drops', 'Tonsillar drainage support', 'Nutritional absorption enhancers', 'Constitutional child growth remedies']
  ),
  (
    'Digestive Issues',
    'digestive-issues',
    'Heart',
    'Effective treatment for IBS, Acidity, Chronic Constipation, and Gastritis.',
    'Modern diets and stressful lifestyles frequently cause digestive issues like Acidity, Irritable Bowel Syndrome (IBS), Constipation, and Gastritis. Our remedies improve gut motility, heal the digestive tract lining, and regulate digestive enzyme secretion, ensuring long-term recovery and optimal nutrient absorption.',
    array['Bloating and flatulence', 'Heartburn and acid reflux', 'Alternating diarrhea and constipation (IBS)', 'Stomach pain after eating', 'Chronic indigestion'],
    array['Gut motility stabilizers', 'Anti-acidity homeopathic remedies', 'Gastric lining repair triggers', 'Digestive enzyme enhancers']
  ),
  (
    'Chronic Diseases',
    'chronic-diseases',
    'Shield',
    'Holistic management for Rheumatoid Arthritis, Diabetes, and Hypertension.',
    'Chronic lifestyle diseases such as Joint Pain, Arthritis, Gout, and early-stage Hypertension require long-term management. Homeopathy provides an excellent complementary or standalone system to reduce inflammation, improve joint mobility, regulate blood circulation, and prevent disease progression naturally.',
    array['Joint pain, swelling, and stiffness', 'Uric acid build-up (Gout)', 'Fatigue and chronic body aches', 'Fluctuating blood pressure', 'Slow tissue healing'],
    array['Anti-rheumatic constitutional remedies', 'Joint lubrication and cartilage support', 'Circulatory regulation drops', 'Tissue renewal remedies']
  )
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- Seed: blogs (3 rows from DEFAULT_BLOGS in lib/data.ts).
-- Content is HTML; apostrophes inside words (body's, patient's) are escaped as
-- '' below. image is null (no default image is defined in lib/data.ts).
-- ----------------------------------------------------------------------------
insert into public.blogs
  (title, slug, category, content, excerpt, author, image, published_at)
values
  (
    'Why Homeopathy is the Perfect Solution for Chronic Allergies',
    'homeopathy-chronic-allergies',
    'Respiratory Health',
    '<p>Chronic allergies, allergic rhinitis, and asthma can make daily life exhausting. Most conventional treatments rely on antihistamines or steroid inhalers, which suppress the symptoms temporarily but fail to solve the underlying problem. Once the medication wears off, the symptoms return.</p>
<h3>The Homeopathic Difference</h3>
<p>Homeopathy works on the law of "similars" and constitutional healing. Instead of blocking the body''s allergic response, homeopathic medicines desensitize the immune system. We look at the individual as a whole—taking into account triggers, emotional stresses, dietary habits, and genetic history.</p>
<h3>Key Benefits of Allergy Homeopathy</h3>
<ul>
  <li><strong>No Side Effects:</strong> No drowsiness, dry mouth, or dependency, which are common with antihistamines.</li>
  <li><strong>Strengthens Immunity:</strong> Builds resistance against common allergens like pollen, dust, and animal dander.</li>
  <li><strong>Long-term Relief:</strong> Reduces the frequency and intensity of attacks, leading to complete recovery over time.</li>
</ul>
<p>If you or your children suffer from recurrent sneezing, wheezing, or watery eyes, a personalized homeopathic plan at HOMMED can help you breathe freely and live naturally.</p>',
    'Discover how homeopathy treats allergies by strengthening the immune system rather than just suppressing symptoms temporarily.',
    'Dr. Iqbal',
    null,
    '2026-04-15T10:30:00Z'
  ),
  (
    'Natural PCOS Management: Healing Hormones Safely',
    'natural-pcos-management-hormones',
    'Womens Health',
    '<p>Polycystic Ovary Syndrome (PCOS) is a common hormonal disorder among women of reproductive age. Conventional treatments often prescribe hormone replacement therapy or birth control pills to force regular bleeding. However, this only masks the problem and does not cure the underlying endocrine dysfunction.</p>
<h3>Targeting the Root Cause of PCOS</h3>
<p>In homeopathy, we treat PCOS not just as a local ovarian disorder, but as a metabolic and hormonal imbalance. Homeopathic remedies stimulate the ovaries to produce hormones naturally, assisting in regular ovulation. Over a period of few months, cysts in the ovaries start shrinking, and normal cycle rhythm is restored.</p>
<h3>Symptoms we successfully treat:</h3>
<ul>
  <li>Irregular or absent menstrual cycles.</li>
  <li>Hirsutism (excessive facial hair growth) and cystic acne.</li>
  <li>Difficulty conceiving or infertility concerns.</li>
  <li>Insulin resistance and difficulty losing weight.</li>
</ul>
<p>Homeopathic treatment is gentle, safe, and works in harmony with your body to establish endocrine balance naturally.</p>',
    'PCOS affects 1 in 5 women. Learn how homeopathy stimulates natural hormone regulation without synthetic contraceptives.',
    'Dr. Iqbal',
    null,
    '2026-05-02T11:00:00Z'
  ),
  (
    'The Homeopathic Approach to Managing Psoriasis & Eczema',
    'homeopathic-psoriasis-eczema',
    'Skin Care',
    '<p>Psoriasis and eczema are more than just skin deep. They are autoimmune and inflammatory skin conditions that are triggered by internal factors, including genetic predisposition, immune dysregulation, and psychological stress. Applying topical steroid creams may clear the skin momentarily, but it often suppresses the disease, pushing it deeper into the system.</p>
<h3>Constitutional Treatment</h3>
<p>Homeopathy provides constitutional treatment, which means the remedy is selected based on the patient''s physical and mental make-up. We evaluate how the skin lesions look, when the itching is worst, what environment relieves it, and the patient''s stress levels. The remedy then stimulates the immune system to correct its auto-inflammatory actions.</p>
<h3>What to Expect during Treatment</h3>
<p>Homeopathic skin treatment requires patience. Since it heals from the inside out, patients often notice improvements in their digestion, energy levels, and sleep quality before the skin lesions completely clear. Slowly, the scaling, itching, and redness fade, leaving behind healthy, naturally-healed skin.</p>',
    'Learn how constitutional homeopathy addresses deep-rooted immune issues to clear skin plaques and eczema safely.',
    'Dr. Iqbal',
    null,
    '2026-05-18T09:15:00Z'
  )
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- Seed: popups (4 rows). Shape (type, title, content, is_active, delay_seconds)
-- matches the GET fallback in app/api/popups/route.ts and the PopupData type in
-- components/PopupManager.tsx. The popups table has no natural unique key, so
-- the whole set is inserted only when the table is empty (guard below), keeping
-- this idempotent.
--
-- Exactly one popup ('appointment') is seeded active. The admin PUT handler
-- enforces a single active popup (it deactivates the others when one is turned
-- on), and PopupManager renders the first active popup, so a single active row
-- matches what the app expects. "Don't" / "Iqbal's" apostrophes are escaped ''.
-- ----------------------------------------------------------------------------
insert into public.popups (type, title, content, is_active, delay_seconds)
select v.type, v.title, v.content, v.is_active, v.delay_seconds
from (values
  (
    'appointment',
    'Need Homeopathy Consultation?',
    'Book your digital wellness consult today and get 10% off your first medicine dispatch.',
    true,
    5
  ),
  (
    'whatsapp',
    'Consult Dr. Iqbal on WhatsApp',
    'Get instant answers for your healthcare inquiries directly from the doctor.',
    false,
    3
  ),
  (
    'exit',
    'Wait! Don''t Leave Empty-Handed',
    'Drop your details below to download Dr. Iqbal''s "Natural Homeopathy Health Guide" for free.',
    false,
    0
  ),
  (
    'offer',
    'Special Monsoon Wellness Offer',
    'Free thyroid screen with every chronic allergy packages.',
    false,
    10
  )
) as v(type, title, content, is_active, delay_seconds)
where not exists (select 1 from public.popups);

-- ============================================================================
-- ============ SHOP TABLES (E-commerce) ============
-- ============================================================================

-- products: store skin care and fairness products.
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  price       numeric not null,
  image_url   text,
  category    text,
  stock       int default 0,
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- orders: store user orders with Razorpay & COD support.
create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id),
  total_amount        numeric not null,
  status              text default 'Pending',
  payment_method      text not null,
  payment_status      text default 'Pending',
  razorpay_order_id   text,
  razorpay_payment_id text,
  shipping_address    jsonb,
  billing_address     jsonb,
  customer_name       text not null,
  customer_email      text not null,
  customer_phone      text not null,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- order_items: line items for each order.
create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid references public.orders(id) on delete cascade not null,
  product_id        uuid references public.products(id) not null,
  quantity          int not null,
  price_at_purchase numeric not null
);

-- ----------------------------------------------------------------------------
-- SHOP RLS POLICIES
-- ----------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- products: public read
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
  on public.products
  for select
  to anon, authenticated
  using (true);

-- orders: users can read their own orders. Admin bypasses RLS via service_role.
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders
  for select
  to authenticated
  using (auth.uid() = user_id);

-- orders: users can insert their own orders. For guest checkout, anyone can insert.
drop policy if exists "orders_insert_public" on public.orders;
create policy "orders_insert_public"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

-- order_items: same as orders
drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own"
  on public.order_items
  for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = public.order_items.order_id
      and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_insert_public" on public.order_items;
create policy "order_items_insert_public"
  on public.order_items
  for insert
  to anon, authenticated
  with check (true);

-- ----------------------------------------------------------------------------
-- Seed: products
-- ----------------------------------------------------------------------------
insert into public.products
  (name, slug, description, price, image_url, category, stock)
values
  (
    'ClearSkin Acne Treatment',
    'clearskin-acne-treatment',
    'Advanced homeopathic formula to clear stubborn acne and prevent future breakouts without drying out your skin.',
    499.00,
    null,
    'Skin Care',
    100
  ),
  (
    'Radiance Fairness Drops',
    'radiance-fairness-drops',
    'Natural drops to help reduce pigmentation and dark spots, promoting an even, glowing complexion.',
    599.00,
    null,
    'Fairness',
    100
  ),
  (
    'Eczema Relief Cream',
    'eczema-relief-cream',
    'Soothing natural cream for dry, itchy, and irritated skin caused by eczema or psoriasis.',
    349.00,
    null,
    'Skin Care',
    50
  )
on conflict (slug) do nothing;

