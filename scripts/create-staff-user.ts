import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// 1. Parse env variables manually from .env.local (same approach as seed-supabase.ts)
const envPath = path.join(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase URL or Service Role Key missing in .env.local!');
  process.exit(1);
}

// Admin client bypasses RLS and can create pre-confirmed users.
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ── Credentials (override via CLI args: email password name phone role) ──
// Role defaults to 'staff', or 'admin' when the email is admin@hommed.com.
const EMAIL = (process.argv[2] || 'staff@hommed.com').toLowerCase();
const PASSWORD = process.argv[3] || 'Staff@12345';
const NAME = process.argv[4] || 'Test Staff';
const PHONE = process.argv[5] || '9999999999';
const ROLE = process.argv[6] || (EMAIL === 'admin@hommed.com' ? 'admin' : 'staff');

async function createStaff() {
  console.log(`Creating user: ${EMAIL} (role: ${ROLE})`);

  try {
    // 1. Find existing auth user with this email (so the script is re-runnable).
    let userId: string | undefined;
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) throw listErr;
    const existing = list.users.find(u => u.email?.toLowerCase() === EMAIL);

    if (existing) {
      userId = existing.id;
      console.log('User already exists in auth — reusing and resetting password.');
      // Ensure the password is known and the account is confirmed.
      const { error: updErr } = await supabase.auth.admin.updateUserById(userId, {
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { name: NAME, phone: PHONE },
      });
      if (updErr) throw updErr;
    } else {
      // 2. Create a new, pre-confirmed auth user.
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: EMAIL,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { name: NAME, phone: PHONE },
      });
      if (createErr) throw createErr;
      userId = created.user.id;
      console.log('Created new auth user.');
    }

    // 3. Upsert the profile row with role = 'staff' (the signup route only assigns
    //    patient/admin, so we set the staff role explicitly here).
    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: userId,
      name: NAME,
      phone: PHONE,
      role: ROLE,
    });
    if (profileErr) throw profileErr;

    console.log('\n✅ Account ready. Sign in with:');
    console.log(`   Email:    ${EMAIL}`);
    console.log(`   Password: ${PASSWORD}`);
    console.log(`   Role:     ${ROLE}`);
    process.exit(0);
  } catch (err: any) {
    console.error('Failed to create staff user:', err.message || err);
    process.exit(1);
  }
}

createStaff();
