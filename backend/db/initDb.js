/**
 * @fileoverview Script de inicialización y migración para PostgreSQL.
 * Lee el archivo de esquema `init.sql` local y lo ejecuta en la base de datos
 * utilizando una conexión temporal con manejo de SSL según el entorno.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Obtención de equivalentes a __filename y __dirname en módulos ECMAScript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ejecuta el script SQL de inicialización en la base de datos PostgreSQL.
 * 
 * 1. Instancia un pool temporal de conexiones leyendo la variable de entorno `DB_URL`.
 * 2. Carga y lee de forma sincrónica el archivo `init.sql` ubicado en la misma carpeta.
 * 3. Ejecuta la consulta SQL masiva en la BD.
 * 4. Cierra de forma segura el pool de conexiones en la cláusula `finally`.
 * 
 * @async
 * @function runInitSql
 * @returns {Promise<void>}
 */
const runInitSql = async () => {
  const pool = new pg.Pool({
    connectionString: process.env.DB_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

  try {
    const sqlPath = path.join(__dirname, "init.sql");
    const sqlScript = fs.readFileSync(sqlPath, "utf8");

    console.log("Ejecutando script init.sql...");
    await pool.query(sqlScript);
    console.log("Base de datos inicializada correctamente.");
  } catch (error) {
    console.error("Error al ejecutar init.sql:", error);
  } finally {
    await pool.end();
  }
};

runInitSql();
