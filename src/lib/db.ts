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
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
};

export const client = new Pool({
  ...defaultConfig,
  ...dbConfigSchema.parse({
    connectionString: process.env.DATABASE_URL || '',
    ssl: { rejectUnauthorized: false }
  })
});

// Check connection status
client.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

client.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

// Clean up on app shutdown
process.on('SIGINT', () => {
  client.end().then(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});

// Add type-safe query helper
export const query = async <T>(sql: string, values?: any[]): Promise<T[]> => {
  try {
    const res = await client.query(sql, values);
    return res.rows as T[];
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
};

// Add health check function
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await client.query('SELECT 1');
    return true;
  } catch (err) {
    console.error('Database health check failed:', err);
    return false;
  }
};
