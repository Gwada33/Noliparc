import { Pool } from 'pg';

export const client = new Pool({
  connectionString: process.env.DATABASE_URL, // ex: 'postgresql://user:pass@host:5432/dbname'
  ssl:{ 
   rejectUnauthorized: false
  }
});

client.connect()
  .then(() => console.log('Connecté à la base PostgreSQL'))
  .catch((err) => console.error('Erreur de connexion à PostgreSQL', err));
