import pg from 'pg';
import dotenv from 'dotenv';
import { FullUserData } from './types/index.js';
import { USERS_STORE, USER_NEW, USER_HISTORY } from './data/users.js';

dotenv.config();

const { Pool } = pg;

let pool: pg.Pool | null = null;

function getPool(): pg.Pool | null {
  if (pool) return pool;

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log('[DB] No DATABASE_URL provided. Running in-memory mode.');
    return null;
  }

  pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
  });

  pool.on('error', (err) => {
    console.error('[DB] Unexpected error on idle client:', err);
  });

  return pool;
}

/**
 * Initialize database schema and load persisted users into USERS_STORE
 */
export async function initDb(): Promise<void> {
  const p = getPool();
  if (!p) return;

  try {
    const client = await p.connect();
    try {
      console.log('[DB] Connecting to Supabase PostgreSQL...');
      
      // Ensure table exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255),
          major VARCHAR(255),
          avatar_initials VARCHAR(10),
          is_new_user BOOLEAN DEFAULT false,
          overall_mastery INTEGER DEFAULT 0,
          estimated_theta FLOAT DEFAULT 0.0,
          standard_error FLOAT DEFAULT 1.0,
          items_answered INTEGER DEFAULT 0,
          reliability_score INTEGER DEFAULT 0,
          status_summary TEXT,
          concepts JSONB DEFAULT '[]'::jsonb,
          misconceptions JSONB DEFAULT '[]'::jsonb,
          activities JSONB DEFAULT '[]'::jsonb,
          tests JSONB DEFAULT '[]'::jsonb,
          notes JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // Check if seed users exist, insert if missing
      const existing = await client.query('SELECT id FROM users');
      const existingIds = new Set(existing.rows.map(r => r.id));

      if (!existingIds.has('user-new')) {
        await saveUserToDb(USER_NEW, 'neuronotes123');
        console.log('[DB] Seeded user-new (Elena Rostova)');
      }

      if (!existingIds.has('user-history')) {
        await saveUserToDb(USER_HISTORY, 'neuronotes123');
        console.log('[DB] Seeded user-history (Vikrant Kolse)');
      }

      // Load all persisted users from DB into in-memory USERS_STORE
      const allRows = await client.query('SELECT * FROM users');
      for (const row of allRows.rows) {
        USERS_STORE[row.id] = {
          id: row.id,
          name: row.name,
          email: row.email,
          major: row.major || 'Physical Sciences',
          avatarInitials: row.avatar_initials || row.name.slice(0, 2).toUpperCase(),
          isNewUser: row.is_new_user ?? false,
          overallMastery: row.overall_mastery ?? 0,
          estimatedTheta: row.estimated_theta ?? 0.0,
          standardError: row.standard_error ?? 1.0,
          itemsAnswered: row.items_answered ?? 0,
          reliabilityScore: row.reliability_score ?? 0,
          statusSummary: row.status_summary || '',
          concepts: Array.isArray(row.concepts) ? row.concepts : (USER_NEW.concepts || []),
          misconceptions: Array.isArray(row.misconceptions) ? row.misconceptions : [],
          activities: Array.isArray(row.activities) ? row.activities : [],
          tests: Array.isArray(row.tests) ? row.tests : [],
          notes: Array.isArray(row.notes) ? row.notes : [],
        };
      }

      console.log(`[DB] Successfully loaded ${allRows.rows.length} user(s) from Supabase.`);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[DB] Failed to initialize Supabase database:', error);
  }
}

/**
 * Persist user data to Supabase PostgreSQL (Upsert)
 */
export async function saveUserToDb(user: FullUserData, password?: string): Promise<void> {
  // Always update in-memory cache immediately
  USERS_STORE[user.id] = user;

  const p = getPool();
  if (!p) return;

  try {
    const query = `
      INSERT INTO users (
        id, name, email, password, major, avatar_initials, is_new_user,
        overall_mastery, estimated_theta, standard_error, items_answered,
        reliability_score, status_summary, concepts, misconceptions,
        activities, tests, notes, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        password = COALESCE(EXCLUDED.password, users.password),
        major = EXCLUDED.major,
        avatar_initials = EXCLUDED.avatar_initials,
        is_new_user = EXCLUDED.is_new_user,
        overall_mastery = EXCLUDED.overall_mastery,
        estimated_theta = EXCLUDED.estimated_theta,
        standard_error = EXCLUDED.standard_error,
        items_answered = EXCLUDED.items_answered,
        reliability_score = EXCLUDED.reliability_score,
        status_summary = EXCLUDED.status_summary,
        concepts = EXCLUDED.concepts,
        misconceptions = EXCLUDED.misconceptions,
        activities = EXCLUDED.activities,
        tests = EXCLUDED.tests,
        notes = EXCLUDED.notes,
        updated_at = NOW();
    `;

    const values = [
      user.id,
      user.name,
      user.email,
      password || 'neuronotes123',
      user.major,
      user.avatarInitials,
      user.isNewUser,
      user.overallMastery,
      user.estimatedTheta,
      user.standardError,
      user.itemsAnswered,
      user.reliabilityScore,
      user.statusSummary,
      JSON.stringify(user.concepts || []),
      JSON.stringify(user.misconceptions || []),
      JSON.stringify(user.activities || []),
      JSON.stringify(user.tests || []),
      JSON.stringify(user.notes || []),
    ];

    await p.query(query, values);
  } catch (error) {
    console.error(`[DB] Error persisting user ${user.id} to Supabase:`, error);
  }
}

/**
 * Verify credentials from database
 */
export async function getDbUserPassword(email: string): Promise<string | null> {
  const p = getPool();
  if (!p) return null;
  try {
    const res = await p.query('SELECT password FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (res.rows.length > 0) {
      return res.rows[0].password;
    }
  } catch (e) {
    console.error('[DB] Error querying user password:', e);
  }
  return null;
}
