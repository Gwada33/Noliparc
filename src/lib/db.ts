import { Client } from 'pg';

export const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: 5432,
});

client.connect()
  .then(() => console.log('Connecté à la base PostgreSQL'))
  .catch((err) => console.error('Erreur de connexion à PostgreSQL', err));
