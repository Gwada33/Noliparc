// db.ts
import { Client } from 'pg';

const client = new Client({
  user: process.env.PG_USER,         // Remplace par ton utilisateur PostgreSQL
  host: process.env.PG_HOST,           // Adresse de ton serveur PostgreSQL
  database: process.env.PG_DATABASE,  // Nom de la base de données cible
  password: process.env.PG_PASSWORD,         // Mot de passe
  port: 5432,                  // Port PostgreSQL (par défaut 5432)
});

client.connect()
  .then(() => console.log('Connecté à la base PostgreSQL'))
  .catch((err) => console.error('Erreur de connexion à PostgreSQL', err));

export default client;
