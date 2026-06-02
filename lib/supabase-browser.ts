'use client';

import { createClient } from '@supabase/supabase-js';

/**
 * Browser-only Supabase client used exclusively for the Google OAuth (PKCE) flow.
 *
 * It is intentionally separate from the shared `lib/supabase.ts` client:
 *  - That client uses `persistSession: false` (the app manages tokens manually
 *    in localStorage under `hommed_token`).
 *  - OAuth/PKCE needs to persist a short-lived code verifier between the
 *    initiating page (`/login`, `/signup`) and the redirect target
 *    (`/auth/callback`), so this client uses `persistSession: true` with its own
 *    `storageKey` to avoid clashing with anything else.
 *
 * After the callback exchanges the code for a session, we copy the access token
 * + a normalized user object into the app's existing `hommed_token` /
 * `hommed_user` keys, so the rest of the app keeps working unchanged.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseBrowser = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false, // we exchange the code manually for determinism
      flowType: 'pkce',
      storageKey: 'hommed_oauth',
    },
  }
);
