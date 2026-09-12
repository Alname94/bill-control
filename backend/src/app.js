import express from "express";
import cors from "cors";
import { errorHandler }  from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import servicioRoutes from "./routes/servicioRoutes.js";
import facturaRoutes from "./routes/facturaRoutes.js";

const app = express();

app.use(cors({origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true,}));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor funcionando correctamente" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", usuarioRoutes);
app.use("/api/services", servicioRoutes);
app.use("/api/bills", facturaRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

export default app;
