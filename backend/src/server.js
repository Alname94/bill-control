import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 3000;

// Consulta de prueba para verificar la conexión a la base de datos
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error al conectar con la base de datos en Neon:", err.stack);
  } else {
    console.log(
      "Conexión exitosa a PostgreSQL en Neon. Hora en BD:",
      res.rows[0].now,
    );
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
