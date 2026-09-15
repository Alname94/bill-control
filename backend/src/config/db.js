/**
 * @fileoverview Configuración del pool de conexiones a PostgreSQL.
 * Administra la conexión serverless con Neon DB y maneja la configuración
 * SSL requerida para entornos de producción y desarrollo local.
 */

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Pool de conexiones usando la URL de Neon
const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Función helper para ejecutar queries en la BD
export const query = (text, params) => pool.query(text, params);

export default pool;
