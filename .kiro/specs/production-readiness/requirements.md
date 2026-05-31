# Requirements — HOMMED Production Readiness

## Introduction

HOMMED is a homeopathy clinic web application for Dr. Iqbal's Centre (Kanpur). It is
built on Next.js 16 (App Router, Turbopack), React 19, Supabase (Auth + Postgres),
and Tailwind v4. The application has four surfaces: a public marketing site with
appointment booking and lead capture, a patient dashboard, an admin CRM, and a staff
clinical portal.

The codebase currently contains a mix of live integrations and "demo"/mock behaviors.
Several features simulate success without persisting data, one authentication helper is
broken, and there is no database schema in the repository. The goal of this spec is to
make the application **production ready**: every advertised feature must operate against
real data, critical bugs must be fixed, demo/offline shortcuts must be removed or clearly
gated, and the app must be deployable with verified configuration — all within a tight
delivery window.

### Current-State Findings (reverse-engineered)

- **Critical bug**: `app/staff/page.tsx` `fetchWithAuth` sends `Authorization: "Bearer "`
  (token dropped), so every staff API call returns 401 and the portal silently falls back
  to simulated data. Staff writes never persist.
- **Fake auth shortcuts**: "Continue with Google" (patient login) and "Simulated Staff
  Account (Offline Demo Mode)" (staff login) set fake tokens/users and bypass real auth.
- **Mocked staff APIs**: `patients`, `notes`, `prescriptions`, `timeline` return
  hardcoded sample data and fake "success" responses when the DB errors.
- **Mock data in UI**: patient dashboard shows hardcoded medical logs, a static
  "88% Immune Wellness", and inflated counts (`+3`, `+4`); admin has a hardcoded staff list.
- **AI assistant** is a keyword dictionary (acceptable, but must be labeled honestly).
- **Config drift**: `.env.local`/`.env.example` describe MongoDB + JWT while the code uses
  Supabase. No SQL schema/migration exists in the repo.
- **Minor**: dead "Forgot password" link; live Supabase keys committed in `.env.local`.

### Definition of "Production Ready" (for this spec)

1. The production build (`next build`) succeeds with no type errors.
2. Every user-facing action either performs a real, persisted operation or is removed.
3. No silent "demo mode" path masks a real failure with a fake success.
4. Authentication and role-based access work end to end against Supabase.
5. The database schema required by the app exists and is reproducible from the repo.
6. Configuration is accurate, documented, and free of misleading/unused variables.

---

## Requirements

### Requirement 1 — Fix the broken staff portal authentication

**User Story:** As a clinic staff member, I want my logged-in session to authorize my API
requests, so that the patient, prescription, note, and timeline data I create is actually
saved and retrieved.

#### Acceptance Criteria

1. WHEN the staff portal makes any API request THEN the system SHALL include the stored
   bearer token in the `Authorization` header (`Bearer <token>`).
2. WHEN a staff member with a valid staff/admin session loads the portal THEN the system
   SHALL retrieve real records from Supabase (not simulated fallback data).
3. WHEN a staff member creates a patient, prescription, note, or timeline event THEN the
   system SHALL persist it to Supabase and reflect the saved record in the UI.
4. IF a staff API request fails authentication THEN the system SHALL surface an honest
   error state rather than displaying fabricated success.

### Requirement 2 — Remove fake authentication shortcuts

**User Story:** As the clinic owner, I want all login paths to use real credentials, so
that no one can access patient data or portals without proper authentication.

#### Acceptance Criteria

1. WHERE the patient login page offers "Continue with Google" THEN the system SHALL either
   implement real Supabase OAuth OR remove the button entirely.
2. WHERE the staff login page offers "Simulated Staff Account (Offline Demo Mode)" THEN the
   system SHALL remove the mock-login button so no fake session can be created.
3. WHEN any user authenticates THEN the system SHALL only issue a session backed by a real
   Supabase access token.
4. WHEN a session token is invalid or expired THEN protected pages SHALL redirect to the
   appropriate login page.

### Requirement 3 — Make staff clinical APIs persist real data

**User Story:** As clinic staff, I want patient records, prescriptions, notes, and timeline
events to be stored in the database, so that clinical history is reliable and durable.

#### Acceptance Criteria

1. WHEN a staff API (patients, notes, prescriptions, timeline) is called with a valid
   session THEN the system SHALL read from and write to the corresponding Supabase table.
2. IF a Supabase operation fails THEN the system SHALL return an appropriate error status
   (4xx/5xx) and SHALL NOT return fabricated/simulated records as if successful.
3. WHEN the patients/prescriptions/notes/timeline tables are queried THEN the system SHALL
   enforce that only staff or admin roles can access them.
4. WHEN no records exist for a patient THEN the system SHALL return an empty result, not
   hardcoded sample data.

### Requirement 4 — Replace mock data in patient and admin dashboards with real data

**User Story:** As a patient and as the admin, I want dashboards to reflect my actual data,
so that the numbers and records I see are trustworthy.

#### Acceptance Criteria

1. WHEN the patient dashboard renders counts (consultations, scheduled slots) THEN the
   system SHALL compute them from real appointment/prescription data without arbitrary
   offsets (no `+3`/`+4`).
2. WHERE the patient dashboard shows medical/prescription history THEN the system SHALL load
   it from the patient's real records OR clearly present an empty state when none exist.
3. WHERE a metric cannot be derived from real data (e.g. "Immune Wellness %") THEN the
   system SHALL remove it or label it as illustrative, not present it as a real metric.
4. WHERE the admin staff list is hardcoded THEN the system SHALL load staff accounts from a
   real source OR clearly mark the section's data source.

### Requirement 5 — Provide and apply the database schema

**User Story:** As a developer/operator, I want a reproducible database schema, so that the
application's tables, columns, and access rules exist and match what the code expects.

#### Acceptance Criteria

1. THE repository SHALL contain a SQL schema file that creates all required tables:
   `profiles`, `appointments`, `leads`, `services`, `blogs`, `popups`, `patients`,
   `patient_notes`, `prescriptions`, `patient_timeline`.
2. THE schema SHALL define columns matching the field names the API routes read/write
   (snake_case as used in the route handlers).
3. THE schema SHALL include Row Level Security policies (or documented equivalent) that
   permit public read where appropriate (services, blogs, active popups), public insert for
   leads/appointments, and restrict clinical tables to staff/admin.
4. THE schema SHALL seed default services, blogs, FAQs/testimonials source data, and popup
   rows consistent with `lib/data.ts` so the public site shows real DB-backed content.
5. WHEN the schema has been applied THEN GET endpoints SHALL return DB rows rather than the
   in-code fallback defaults.

### Requirement 6 — Correct and document configuration

**User Story:** As an operator deploying the app, I want accurate environment configuration,
so that the app runs correctly and I am not misled by unused variables.

#### Acceptance Criteria

1. THE `.env.example` SHALL list only the variables the application actually uses
   (Supabase URL/keys, optional Telegram), and SHALL remove unused MongoDB/JWT entries.
2. THE configuration documentation SHALL state which variables are required vs optional.
3. WHEN required Supabase variables are missing at runtime THEN the system SHALL fail with a
   clear, actionable error rather than silently using placeholders.
4. THE admin bootstrap process (creating the `admin@hommed.com` account / assigning the
   admin role) SHALL be documented.

### Requirement 7 — Verify booking, lead, and notification flows end to end

**User Story:** As a prospective patient, I want booking an appointment and submitting an
inquiry to reliably reach the clinic, so that my request is not lost.

#### Acceptance Criteria

1. WHEN a visitor submits the booking form THEN the system SHALL create an appointment
   record, auto-create a CRM lead, and attempt a Telegram notification.
2. WHEN a visitor submits the contact/lead form or popup THEN the system SHALL create a lead
   record and attempt a Telegram notification.
3. IF Telegram credentials are not configured THEN the system SHALL still succeed at
   persisting the record and SHALL log (not fail) the missing-notification case.
4. WHEN a double-booking is attempted for the same date/time THEN the system SHALL reject it
   with a clear message.
5. WHEN the booking succeeds THEN the patient SHALL see a confirmation and the record SHALL
   appear in the admin appointments view.

### Requirement 8 — Honest representation of the AI assistant

**User Story:** As a visitor, I want the chat assistant to set accurate expectations, so that
I understand it provides guided information and lead capture rather than medical AI.

#### Acceptance Criteria

1. WHERE the assistant is labeled THEN it SHALL be presented as a guided wellness/info
   assistant, not implied to be a diagnostic medical AI.
2. WHEN the assistant captures a name and phone THEN it SHALL create a real lead record.
3. THE assistant SHALL continue to function (graceful responses) regardless of backend
   availability, without claiming a persisted action that did not occur.

### Requirement 9 — Build and deployment integrity

**User Story:** As an operator, I want the app to build and run cleanly, so that it can be
deployed without errors.

#### Acceptance Criteria

1. WHEN `next build` runs THEN it SHALL complete successfully with no TypeScript errors.
2. WHEN `next lint` runs THEN there SHALL be no errors that block production (warnings
   triaged).
3. THE application SHALL not reference missing static assets (all `/logo.png` and image
   references resolve).
4. WHERE network-exposed API routes mutate data THEN they SHALL validate input and enforce
   role checks before writing.
