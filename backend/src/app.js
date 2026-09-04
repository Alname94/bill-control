import express from "express";
import cors from "cors";
import { errorHandler }  from "./middlewares/errorHandler.js"
import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"
import servicioRoutes from "./routes/servicioRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", usuarioRoutes);
app.use("/api/services", servicioRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor funcionando correctamente" });
});

app.use(errorHandler);

export default app;
