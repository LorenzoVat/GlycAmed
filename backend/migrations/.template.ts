// backend/migrations/.template.ts
import { Db } from 'mongodb'; // Importe le type de la BDD

/**
 * Fonction 'up' : ce qui est exécuté quand on migre.
 */
export const up = async (db: Db) => {{
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
}}
/**
 * Fonction 'down' : ce qui est exécuté quand on 'rollback'.
 * Doit faire l'inverse de la fonction 'up'.
 */
export const down = async (db: Db) => {
  // Exemple : Supprimer l'index
  // await db.collection('users').dropIndex('email_1');
  //
  // Exemple : Supprimer la collection
  // await db.collection('users').drop();
};