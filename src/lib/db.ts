import { Pool, PoolConfig } from 'pg';
import { z } from 'zod';

const dbConfigSchema = z.object({
  connectionString: z.string(),
  ssl: z.object({
    rejectUnauthorized: z.boolean()
  }).optional(),
  max: z.number().optional(),
  idleTimeoutMillis: z.number().optional(),
  connectionTimeoutMillis: z.number().optional()
});

const defaultConfig: PoolConfig = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

// Force l'utilisation du schéma "public"
const setSearchPathToPublic = async (pool: Pool) => {
  const client = await pool.connect();
  try {
    await client.query(`SET search_path TO public;`);
  } finally {
    client.release();
  }
};

export const client = new Pool({
  ...defaultConfig,
  ...dbConfigSchema.parse({
    connectionString: process.env.DATABASE_URL || '',
    ssl: { rejectUnauthorized: false }
  })
});

client.on('connect', async () => {
  console.log('Connected to PostgreSQL database');
  try {
    await setSearchPathToPublic(client);
  } catch (err) {
    console.error('Failed to set search_path to public:', err);
  }
});

client.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

process.on('SIGINT', () => {
  client.end().then(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});

export const query = async <T>(sql: string, values?: any[]): Promise<T[]> => {
  try {
    const res = await client.query(sql, values);
    return res.rows as T[];
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
};

export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await client.query('SELECT 1');
    return true;
  } catch (err) {
    console.error('Database health check failed:', err);
    return false;
  }
};
