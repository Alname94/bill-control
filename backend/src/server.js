import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log(
      "Conexión exitosa a la BD. Hora en BD:", res.rows[0].now,
    );

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(
      "Error al conectar con la base de datos:", err.stack,
    );
    process.exit(1);
  }
};

startServer();
