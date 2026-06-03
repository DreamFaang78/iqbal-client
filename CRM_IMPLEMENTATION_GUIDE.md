# HOMMED CRM v2.0 - Complete Implementation Guide

This guide details the database modifications, API updates, frontend enhancements, and deployment steps for HOMMED CRM v2.0.

## Database Migration

The database alterations are located at [`supabase/migration_crm_v2.sql`](supabase/migration_crm_v2.sql).

### Execution Steps
1. Navigate to your **Supabase Dashboard** for the project.
2. Open the **SQL Editor** tab.
3. Click **New query** (or blank query).
4. Paste the content of `supabase/migration_crm_v2.sql`.
5. Click **Run**.
6. Verify that all statements executed successfully and indices were created.

---

## API Endpoints Reference

### 1. Leads API (`app/api/leads/route.ts`)
*   `GET /api/leads`: Retrieves all leads (Admin/Staff only, sorted by newest). Mapped to frontend camelCase keys.
*   `POST /api/leads`: Creates a new lead (Public).
    *   **Payload**: `{ name: string, phone: string, inquiry: string, leadSource?: string, age?: number, gender?: string, city?: string }`
    *   **Feature**: Implements automatic duplicate verification. If a lead with the same phone was created in the last 30 days, `is_duplicate` is flagged as `true`.
*   `PUT /api/leads`: Updates a lead details/notes/status (Admin/Staff only).
    *   **Payload**: `{ id: string, status?: string, notes?: string, followUpScheduled?: string, assignedTo?: string }`
*   `DELETE /api/leads?id={id}`: Deletes a lead permanently (Admin only).

### 2. Appointments API (`app/api/appointments/route.ts`)
*   `GET /api/appointments`: Retrieves appointments (Admins/Staff get all, patients get their own).
*   `POST /api/appointments`: Creates a clinic/online booking request.
    *   **Payload**: `{ patientName, patientPhone, service, scheduleDate, scheduleTime, appointmentType, patientEmail, patientAge, patientGender, patientCity, disease, notes }`
    *   **Feature**: Verifies booking conflicts. Logs automated lead to Leads table and dispatches an enhanced alert via Telegram.
*   `PUT /api/appointments`: Modifies booking parameters or adds clinical/staff notes.

---

## Frontend Enhancements

All CRM modifications are built into the main Admin Dashboard in [`app/admin/page.tsx`](app/admin/page.tsx).

*   **Popup Leads Isolation**: Standard inquiries and popups are isolated into General vs Popup Leads tabs to clean up workflows.
*   **Kanban Workflow**: Statuses maps to: `New` ➔ `Contacted` ➔ `Confirmed` ➔ `Visited` ➔ `Follow-Up` ➔ `Closed`.
*   **Demographics**: View City, Age, and Gender inline on both Leads and Appointments tabs.
*   **Export to CSV**: Client-side conversion to download current filtered grids as `.csv` sheets instantly.
*   **One-Click Actions**: Dial patient's phone or click the green button to open WhatsApp Web/App preloaded with templates.

---

## Testing & Smoke Verification

Use this list to verify all CRM systems are functional:

1.  **Duplicate Leads**: Submit two inquiries with the identical phone number within 1 minute. Confirm that the second lead is marked with a yellow **Duplicate Lead Detected** alert in the Kanban view.
2.  **Delete Lead**: Hover over a lead card, click the trash bin icon, and verify it deletes from the Kanban list and DB.
3.  **CSV Export**: Filter appointments by `Clinic 1` and click **Export Filtered to CSV**. Open the file to ensure the rows match.
4.  **WhatsApp Links**: Click the WhatsApp button on a patient card to check that a new tab launches pointing to `https://wa.me/` with correctly escaped text parameter.
