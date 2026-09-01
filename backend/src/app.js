import express from "express";
import cors from "cors";

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba/salud de la API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor funcionando correctamente" });
});

app.use(errorHandler);

export default app;
