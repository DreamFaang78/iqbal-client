# HOMMED — Dr. Iqbal's Homeopathy Centre

HOMMED is the web application for Dr. Iqbal's Homeopathy Centre (Kanpur). It is built on
**Next.js 16** (App Router, Turbopack), **React 19**, **Supabase** (Auth + Postgres), and
**Tailwind v4**. The app has four surfaces:

- **Public marketing site** — services, blogs, FAQs, appointment booking, and lead capture.
- **Patient dashboard** — appointment and prescription history for the signed-in patient.
- **Admin CRM** — leads, appointments, services, blogs, popups, and staff accounts.
- **Staff clinical portal** — patients, prescriptions, clinical notes, and timeline events.

---

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm (ships with Node)
- A [Supabase](https://supabase.com) project (free tier is fine)

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values. The build uses safe placeholders
so `next build` does not crash, but **auth and data access will fail at runtime** without the
required Supabase variables.

### Required

| Variable | Where it is used | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Supabase project URL. Exposed to the browser (safe). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server | Public anon key. Exposed to the browser (safe). |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Privileged key for signup, admin, and staff data access. **Never expose to the browser or commit it.** |

Find all three in your Supabase project under **Project Settings → API**.

### Optional

| Variable | Where it is used | Notes |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Server only | Bot token for lead/booking alerts. Create a bot via [@BotFather](https://t.me/BotFather). |
| `TELEGRAM_CHAT_ID` | Server only | Destination chat for alerts. Get yours via [@userinfobot](https://t.me/userinfobot). |

If the Telegram variables are left blank, the app still persists leads and appointments and
simply logs that no notification was sent — notification failures never block a booking or
lead from being saved.

---

## Database setup

The repository ships a reproducible schema at [`supabase/schema.sql`](supabase/schema.sql).
Applying it provisions all tables, Row Level Security (RLS) policies, the new-user trigger,
and seed data.

1. Open the **Supabase dashboard → SQL Editor → New query**.
2. Paste the full contents of `supabase/schema.sql` and click **Run**.
3. The script is **idempotent** — it uses `create table if not exists` and
   `create or replace` for functions/policies, so it is safe to re-run without dropping data.

What the script creates:

- **Tables:** `profiles`, `appointments`, `leads`, `services`, `blogs`, `popups`, `patients`,
  `patient_notes`, `prescriptions`, `patient_timeline` (snake_case columns matching the API
  route handlers).
- **RLS policies:** public `select` for `services`, `blogs`, `popups`; public `insert` for
  `leads` and `appointments`; clinical tables (`patients`, `patient_notes`, `prescriptions`,
  `patient_timeline`) are denied to anon clients and accessed only via the server-side
  service-role client behind staff/admin auth.
- **Trigger:** `handle_new_user()` runs on `auth.users` insert to create the matching
  `profiles` row.
- **Seed data:** the default services, blogs, and popups so the public site renders
  DB-backed content immediately.

Once the schema is applied, public GET endpoints return DB rows rather than the in-code
fallback defaults.

### Admin account bootstrap

The admin role is assigned automatically — there is no manual SQL step:

1. Apply `supabase/schema.sql` (above) so the `handle_new_user` trigger exists.
2. Sign up through the app using the email **`admin@hommed.com`**.
3. The `handle_new_user` trigger creates the `profiles` row and assigns the **`admin`** role
   to that email automatically. All other sign-ups default to the `patient` role.

After bootstrapping, sign in with `admin@hommed.com` to access the admin CRM.

---

## Local development

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build (must exit 0 with no type errors)
npm run lint     # run ESLint
```

`npm start` runs the production server after a build.

---

## Security notes

- **localStorage tokens (hardening item).** Sessions are Supabase access tokens stored in
  `localStorage` (`hommed_token`) with a cached user object (`hommed_user`). The token is
  verified server-side on every protected route. This is intentional for the current
  delivery to avoid a risky auth rewrite, but it is **not** the long-term best practice:
  tokens in `localStorage` are reachable by client-side scripts. Migrating to **httpOnly
  cookies** is a documented follow-up (see Out of scope).
- **Rotate the service-role key.** A live Supabase service-role key was committed to
  `.env.local` earlier in this project's history. **Rotate the service-role key after
  delivery** (Supabase dashboard → Project Settings → API → reset) and update `.env.local`
  with the new value. Treat the previously committed key as compromised.

---

## AI assistant

The on-site chat assistant is a **guided wellness/info assistant** — a keyword-driven helper
that answers common questions and captures a name and phone number as a real CRM lead. It is
**not** a diagnostic medical AI and does not provide medical advice or diagnoses. It responds
gracefully regardless of backend availability and never claims a lead was saved if the save
did not succeed.

---

## Manual smoke-test checklist

There is no automated test harness for this delivery (see Out of scope). After applying the
schema and configuring env vars, walk this checklist to verify the core flows:

1. **Public lead capture** — submit the contact form or a popup; confirm a `201` and a new
   row in `leads`.
2. **Public booking** — submit the booking form; confirm a `201`, a new row in
   `appointments`, and an auto-created `leads` row.
3. **Admin reads** — sign in as `admin@hommed.com`; confirm leads and appointments lists show
   the real rows created above.
4. **Staff persistence** — sign in as staff; create a patient, prescription, note, and
   timeline event; **reload the page** and confirm the records persist (this validates the
   staff-portal auth fix).
5. **Double-book rejection** — attempt to book the same date/time slot twice; confirm the
   second attempt is rejected with a clear message.
6. **Removed demo controls** — confirm the patient login no longer shows "Continue with
   Google" and the staff login no longer shows "Use Simulated Staff Account (Offline Demo
   Mode)".

---

## Out of scope (documented follow-ups)

The following are intentionally **not** included in this delivery and are recorded here so
they are not silently dropped:

- **Full Google OAuth** — the fake "Continue with Google" button was removed rather than
  faked; real OAuth is a follow-up.
- **httpOnly cookie auth** — migrating session tokens off `localStorage` (see Security notes).
- **LLM-backed AI** — the assistant remains a keyword engine; a real LLM is a follow-up.
- **Automated test suite** — verification is currently the manual smoke checklist above.
- **Service-role key rotation** — required ops follow-up (see Security notes).
