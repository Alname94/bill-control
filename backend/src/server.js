/**
 * @fileoverview Punto de entrada de la aplicación Node.js.
 * Verifica la conectividad con la base de datos PostgreSQL antes de iniciar
 * el servidor HTTP Express en el puerto configurado.
 */

import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 3000;

/**
 * Inicializa la aplicación.
 * 1. Comprueba la conexión con el pool de PostgreSQL mediante una consulta de prueba (`SELECT NOW()`).
 * 2. Inicia el servidor Express si la conexión es exitosa.
 * 3. En caso de error, registra la traza y detiene el proceso con un código de salida `1`.
 * 
 * @async
 * @function startServer
 * @returns {Promise<void>}
 */
const startServer = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Conexión exitosa a la BD. Hora en BD:", res.rows[0].now);

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error al conectar con la base de datos:", err.stack);
    process.exit(1);
  }
};

startServer();
