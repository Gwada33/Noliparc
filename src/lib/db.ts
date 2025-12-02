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

const createPool = () => {
  const config = {
    ...defaultConfig,
    ...dbConfigSchema.parse({
      connectionString: process.env.DATABASE_URL || '',
      ssl: { rejectUnauthorized: false }
    })
  };

  const newPool = new Pool(config);

  newPool.on('connect', async (client) => {
    // console.log('Connected to PostgreSQL database'); // Commented out to reduce noise as requested
    try {
      await client.query(`SET search_path TO public;`);
    } catch (err) {
      console.error('Failed to set search_path to public:', err);
    }
  });

  newPool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  return newPool;
};

declare global {
  var postgres: Pool | undefined;
}

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = createPool();
} else {
  if (!global.postgres) {
    global.postgres = createPool();
  }
  pool = global.postgres;
}

export const client = pool;

// Gestion propre de la fermeture lors de l'arrêt du processus
if (process.env.NODE_ENV !== 'production') {
  // En dev, on évite de tuer le pool global à chaque reload,
  // mais on peut gérer le SIGINT au niveau du process principal si besoin.
  // Le code précédent attachait un listener SIGINT à chaque import, ce qui est mauvais.
} else {
  process.on('SIGINT', () => {
    pool.end().then(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
}

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
