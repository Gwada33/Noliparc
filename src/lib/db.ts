import { Client } from 'pg';

export const client = new Client({
  connectionString: process.env.DATABASE_URL, // Exemple : 'postgresql://user:password@host:port/database'
});

client.connect()
  .then(() => console.log('Connecté à la base PostgreSQL'))
  .catch((err) => console.error('Erreur de connexion à PostgreSQL', err));
