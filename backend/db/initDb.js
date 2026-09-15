import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
