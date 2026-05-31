# Design — HOMMED Production Readiness

## Overview

This design turns the HOMMED clinic app into a production-ready state within a tight
delivery window. The strategy is **surgical, not a rewrite**: the public site, booking,
auth, and admin CRM are already wired to Supabase and the production build passes. The work
concentrates on (1) fixing the one critical bug that disables the staff portal, (2) removing
fake-auth and silent demo-fallback behaviors that mask real failures, (3) replacing
hardcoded UI metrics with real values, (4) shipping a reproducible Supabase schema + seed,
and (5) correcting and documenting configuration.

The app uses Next.js 16 (App Router, Turbopack) + React 19. Per workspace rule, this is a
breaking-change-era Next.js; the changes here stay within stable App Router conventions
already used in the repo (Route Handlers returning `NextResponse`, `'use client'` pages,
`React.use(params)` for dynamic routes) and introduce no new framework APIs.

### Design Principles

- **Fail honestly.** API routes return real status codes on DB errors. The UI shows empty
  states or error states — never fabricated "success."
- **Single source of truth.** `lib/data.ts` remains the *seed* source; once the DB is
  seeded, GET endpoints serve DB rows. Defaults stay only as a last-resort read fallback for
  public, non-sensitive content (services/blogs), never for writes or clinical data.
- **Least privilege.** Clinical tables are staff/admin only, enforced both by RLS and by the
  route-level role checks already present via `verifyStaffToken`.
- **Minimize blast radius.** No dependency changes, no routing changes, no redesign.

---

## Architecture

### Current request flow (unchanged)

```
Browser (client pages, localStorage token)
   │  fetch /api/* with Authorization: Bearer <supabase access_token>
   ▼
Next.js Route Handlers (app/api/**/route.ts)
   │  verifyToken / verifyStaffToken / verifyAdminToken  → supabase.auth.getUser(token)
   │  role lookup from public.profiles
   ▼
Supabase (Postgres + RLS)  ←→  service-role client (supabaseAdmin) for privileged writes
   │
   └─ side effects: Telegram notification (best-effort)
```

### Auth model (as-is, kept)

- Sessions are Supabase access tokens stored in `localStorage` (`hommed_token`) plus a cached
  user object (`hommed_user`). This is intentionally kept to avoid a risky auth rewrite under
  deadline. Token is verified server-side on every protected route via
  `supabase.auth.getUser(token)`.
- Roles: `admin`, `staff`, `patient`, resolved from `public.profiles.role` with an
  `admin@hommed.com` email fallback.

> Security note (documented, not changed now): storing tokens in `localStorage` is acceptable
> for this delivery but should be migrated to httpOnly cookies in a future hardening pass.
> This is recorded in the README so it is not silently shipped as "best practice."

---

## Components and Changes

### C1. Staff portal auth fix (Requirement 1) — CRITICAL

**File:** `app/staff/page.tsx`

The current helper is collapsed onto one line and drops the token:

```ts
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('hommed_token') || '';
  return fetch(url, { ...options, headers: { ...options.headers, 'Authorization': `Bearer ` } });
};
```

**Design:** rewrite so the token is interpolated and JSON content type preserved:

```ts
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('hommed_token') || '';
  return fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), 'Authorization': `Bearer ${token}` },
  });
};
```

Consequence: `verifyStaffToken` now receives a real token; staff GET/POST hit live tables.
The `getMockAppointments()` / `getMockPatientsFallback()` calls remain only inside `catch`
blocks for total network failure, not as the normal path.

### C2. Remove fake authentication shortcuts (Requirement 2)

- **`app/login/page.tsx`** — remove `handleGoogleMock` and the "Continue with Google" button
  and the now-unused `or` separator. (Real Google OAuth is out of scope for this delivery; we
  remove rather than fake it.) Wire the "Forgot password?" text to a real action: call
  `supabase.auth.resetPasswordForEmail` via a tiny `/api/auth/forgot` handler, or, if time is
  constrained, convert it to a `mailto:`/WhatsApp contact link so it is not a dead control.
- **`app/login/staff/page.tsx`** — remove `handleStaffMock`, the "Demo Testing" separator,
  and the "Use Simulated Staff Account (Offline Demo Mode)" button.

### C3. Staff clinical APIs persist real data (Requirement 3)

**Files:** `app/api/staff/{patients,notes,prescriptions,timeline}/route.ts`

Current pattern returns simulated rows on `error` and fabricated objects on insert failure.
**Design:**

- On **read** error → return `500` with `{ message }`. On empty result → return `[]`.
- On **write** error → return `500` (or `400` for validation) with the error message. Do
  **not** return a synthesized object with a `mock-*` id.
- Keep `verifyStaffToken` gating on every method. Add the missing auth check on
  `patients` **PUT** (currently unauthenticated) and validate `id` presence.
- Remove the `getSimulated*` helpers (or keep them unexported and unused only if needed for
  local dev; default path must be live). For this delivery they are removed to satisfy
  "no fabricated success."

This makes the staff portal a true reflection of DB state. It depends on C5 (schema) being
applied; if tables are missing, the UI will now correctly show errors/empty rather than
fake data — which is the desired honest behavior.

### C4. Real dashboard metrics (Requirement 4)

- **`app/dashboard/page.tsx`**
  - Replace `completedAppointments.length + 3` → `completedAppointments.length`.
  - Replace `prescriptions`/consultation inflated counts with real derivations.
  - Load real prescription history from `/api/staff/prescriptions?patientId=...` is staff-only;
    for the **patient** view we add a patient-scoped read path: a new
    `GET /api/patient/prescriptions` that returns prescriptions for the authenticated patient
    (matched by `patient_id` linked to their profile/appointments), OR, if linking patient
    profiles to the `patients` table is out of scope under deadline, render a clear empty
    state ("No prescriptions on record yet") instead of `mockMedicalLogs`.
  - "Immune Wellness 88%" → remove the stat card (it is not a real measure) to avoid
    presenting a fabricated clinical metric.
- **`app/admin/page.tsx`**
  - The hardcoded `staffList` is labeled and backed by the `profiles` table where
    `role = 'staff'`: add `GET /api/admin/staff` (admin-only) returning staff profiles, and
    have the Staff Accounts tab load from it. Creating a staff account uses the existing
    signup/admin createUser flow with role `staff`. If full CRUD is too much under deadline,
    at minimum load the real list and clearly mark any non-persisted control.

> Decision recorded: where a real data source cannot be completed safely in time, the design
> chooses an **honest empty/labeled state** over mock data, satisfying R4.3/R4.4.

### C5. Database schema + seed (Requirement 5)

**New file:** `supabase/schema.sql` (idempotent, run in Supabase SQL editor).

Tables and key columns (snake_case to match route handlers):

- `profiles` (`id uuid pk → auth.users`, `name`, `phone`, `role text default 'patient'`,
  `created_at`)
- `appointments` (`id uuid pk default gen_random_uuid()`, `user_id uuid null`,
  `patient_name`, `patient_phone`, `doctor_name default 'Dr. Iqbal'`, `service`,
  `schedule_date`, `schedule_time`, `status default 'Pending'`,
  `payment_status default 'Pending'`, `created_at`)
- `leads` (`id`, `name`, `phone`, `email`, `inquiry`, `status default 'New Lead'`,
  `follow_up_date`, `created_at`)
- `services` (`id`, `title`, `slug unique`, `icon`, `short_description`,
  `detailed_description`, `symptoms text[]`, `treatments text[]`, `created_at`)
- `blogs` (`id`, `title`, `slug unique`, `category`, `content`, `excerpt`, `author`,
  `image`, `published_at default now()`)
- `popups` (`id`, `type`, `title`, `content`, `is_active bool`, `delay_seconds int`)
- `patients` (`id`, `name`, `phone`, `email`, `age int`, `gender`, `address`,
  `blood_group`, `known_allergies`, `chronic_conditions`, `emergency_contact`, `notes`,
  `created_at`)
- `patient_notes` (`id`, `patient_id → patients`, `note`, `created_at`)
- `prescriptions` (`id`, `patient_id`, `appointment_id null`, `diagnosis`,
  `chief_complaint`, `medicines jsonb`, `dietary_advice`, `follow_up_date`, `remarks`,
  `issued_at default now()`)
- `patient_timeline` (`id`, `patient_id`, `event_type`, `title`, `description`,
  `created_at`)

**RLS policy design:**

- `profiles`: user can select/update own row; service role full access; `role` not
  self-elevatable by anon.
- `services`, `blogs`: public `select`. `popups`: public `select` (UI filters `is_active`).
- `leads`, `appointments`: public `insert` (booking/lead capture are unauthenticated by
  design); `select`/`update` restricted to staff/admin (admin reads via service-role client,
  so this is enforced primarily at the route layer — documented).
- `patients`, `patient_notes`, `prescriptions`, `patient_timeline`: no anon access; access via
  service-role client behind `verifyStaffToken`. RLS denies by default for anon/auth roles.

Because the routes use `supabaseAdmin` (service role) when available, server writes bypass RLS
safely; RLS still protects against direct client access with the anon key.

**Seed design:** insert the 8 services, 3 blogs, and 4 popups from `lib/data.ts`, plus a
`profiles` upsert helper note for bootstrapping admin. A trigger
`on auth.users insert → create profiles row` is included so new signups always get a profile
(the route-level upsert remains as a fallback).

**Auto-trigger:** `handle_new_user()` function + trigger to populate `profiles` from
`auth.users` metadata, with role defaulting to `patient` and `admin@hommed.com` → `admin`.

### C6. Configuration correction (Requirement 6)

- Rewrite **`.env.example`** to list only: `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (required) and
  `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (optional). Remove `MONGODB_URI`, `JWT_SECRET`,
  `NEXTAUTH_URL`, Cloudinary.
- `lib/supabase.ts`: keep build-safe placeholders, but add a clear runtime warning path
  already present; document that missing vars break auth. (We keep placeholders so
  `next build` static generation does not crash, matching the existing intent.)
- **`README.md`** (new/updated): document required env vars, how to run `supabase/schema.sql`,
  how to bootstrap the admin account, the localStorage-token security caveat, and the AI
  assistant being a guided (non-diagnostic) assistant.
- Note: `.env.local` already contains real keys; the design does not commit new secrets and
  recommends rotating the service-role key after delivery (documented in README).

### C7. Booking / lead / notification verification (Requirement 7)

No code change required to the happy path (already implemented in
`app/api/appointments/route.ts` and `app/api/leads/route.ts`): create record → auto-create
lead → best-effort Telegram. Design action is **verification** plus ensuring the appointment
auto-lead and Telegram failures never block the 201 (already wrapped in try/catch — confirm).
Double-booking guard already exists (`status in ['Pending','Confirmed']`). Confirm and keep.

### C8. AI assistant honesty (Requirement 8)

**Files:** `components/AIAssistant.tsx`, `app/api/ai/route.ts`. Keyword engine is retained
(no LLM dependency added under deadline). Design change is presentational: ensure labels say
"guided wellness assistant"/"info assistant" rather than implying diagnostic AI, and keep the
lead-capture writing to `/api/leads` (real). No claim of a persisted action unless the POST
succeeded.

### C9. Build & lint integrity (Requirement 9)

After all edits, run `next build` and `next lint`. All assets referenced (`/logo.png`, etc.)
confirmed present. Ensure removed handlers leave no unused imports (e.g. icons in login
pages) that would trip lint.

---

## Data Models

### Appointment (API ⇄ DB mapping)

| API (camelCase) | DB column (snake_case) |
|---|---|
| `_id` | `id` |
| `patientId` | `user_id` |
| `patientName` | `patient_name` |
| `patientPhone` | `patient_phone` |
| `doctorName` | `doctor_name` |
| `service` | `service` |
| `scheduleDate` | `schedule_date` |
| `scheduleTime` | `schedule_time` |
| `status` | `status` |
| `paymentStatus` | `payment_status` |
| `createdAt` | `created_at` |

### Prescription `medicines` shape (jsonb)

```json
[{ "name": "Thuja Occidentalis", "potency": "200C", "dosage": "4 pills twice daily",
   "duration": "30 Days", "instructions": "Take dry on tongue" }]
```

These mappings already exist in the route handlers; the schema is designed to match them
exactly so no mapping code changes.

---

## Error Handling

| Scenario | Current | Designed behavior |
|---|---|---|
| Staff API DB read error | returns simulated rows | `500 { message }`; UI shows error/empty |
| Staff API write error | returns fake `mock-*` object | `500/400 { message }`; UI shows error |
| Patient dashboard with no records | shows mock logs | clear empty state |
| Telegram not configured | logs, returns false | unchanged (non-blocking) |
| Missing Supabase env at runtime | placeholder client, opaque failures | documented; auth fails with clear message |
| Double booking | rejected `400` | unchanged (kept) |
| Unauthorized staff/admin route | `401/403` | unchanged; add check to `patients` PUT |

---

## Testing Strategy

This is a UI + API integration codebase with no existing test harness; under the delivery
window the verification approach is:

1. **Build/typecheck:** `npm run build` must exit 0 (baseline already passes; keep it green).
2. **Lint:** `npm run lint` — no blocking errors.
3. **Manual API smoke (documented in README):**
   - `POST /api/leads` (public) → 201 + row in `leads`.
   - `POST /api/appointments` (public) → 201 + row in `appointments` + auto lead.
   - Login as admin → `GET /api/leads`, `/api/appointments` return real rows.
   - Login as staff → create patient, prescription, note, timeline → verify persisted on
     reload (this directly validates the C1 fix).
   - Double-book same slot → 400.
4. **Auth/role checks:** unauthenticated calls to admin/staff routes return 401/403; removed
   demo-login buttons no longer present.
5. **Schema apply check:** after running `supabase/schema.sql`, public GET endpoints return DB
   rows (services/blogs/popups) rather than in-code defaults.

Automated tests are out of scope for this delivery window; the README records this as a
follow-up. Where logic is non-trivial (booking conflict, role resolution), manual smoke steps
are enumerated so they are repeatable.

---

## Implementation Order (risk-first)

1. **C1** staff auth fix (highest impact, lowest risk).
2. **C5** schema + seed file (unblocks real data; user applies it in Supabase).
3. **C3** staff APIs honest persistence.
4. **C2** remove fake logins + wire forgot-password.
5. **C4** real dashboard metrics / admin staff list.
6. **C6** config + README.
7. **C7/C8** verify booking/lead/notification + AI labeling.
8. **C9** build + lint + final smoke.

---

## Out of Scope (recorded, not silently dropped)

- Full Google OAuth implementation (we remove the fake button instead).
- Migrating auth tokens from `localStorage` to httpOnly cookies (documented hardening item).
- Replacing the keyword AI with a real LLM.
- Automated test suite.
- Rotating the committed Supabase service-role key (documented as a required ops follow-up).
