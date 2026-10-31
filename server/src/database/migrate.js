// Migration runner for PostgreSQL
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log('[Migrate] No DATABASE_URL provided. Skipping PostgreSQL migration.');
    return;
  }

  const client = new pg.Client({ connectionString });
  try {
    console.log('[Migrate] Connecting to PostgreSQL database...');
    await client.connect();

    const migrationFile = path.resolve(__dirname, '../../migrations/001_init.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');

    console.log('[Migrate] Applying 001_init.sql schema...');
    await client.query(sql);
    console.log('[Migrate] Database schema applied successfully.');
  } catch (err) {
    console.error('[Migrate Error]:', err.message);
  } finally {
    await client.end().catch(() => {});
  }
}

runMigrations();
