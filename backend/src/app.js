/**
 * @fileoverview Configuración principal de la aplicación Express.
 * Define la canalización de middlewares globales, montado de rutas de la API,
 * documentación con Swagger UI y el controlador global de errores.
 */

import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import servicioRoutes from "./routes/servicioRoutes.js";
import facturaRoutes from "./routes/facturaRoutes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

/**
 * Configuración de CORS para permitir solicitudes desde el cliente web.
 * Se define una lista de orígenes permitidos y se valida cada solicitud entrante.
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8080",
  process.env.FRONTEND_URL,
  process.env.RENDER_EXTERNAL_URL,
].filter(Boolean);

/**
 * Opciones de configuración de CORS.
 * Se permite el acceso a los orígenes especificados, métodos HTTP y cabeceras.
 */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS bloqueado: El origen ${origin} no está permitido.`),
      );
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

/**
 * Configuración de CORS para permitir peticiones desde el cliente web.
 */
app.use(cors(corsOptions));

/**
 * Middleware para parsear el cuerpo de las peticiones entrantes en formato JSON.
 */
app.use(express.json());

/**
 * Ruta para la interfaz interactiva de Swagger UI.
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Endpoint de verificación de estado del servidor (Health Check).
 *
 * @name GET/api/health
 * @function
 * @param {import('express').Request} req - Petición Express.
 * @param {import('express').Response} res - Respuesta Express.
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor funcionando correctamente" });
});

// ==========================================
// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/user", usuarioRoutes);
app.use("/api/services", servicioRoutes);
app.use("/api/bills", facturaRoutes);

/**
 * Middleware para capturar rutas inexistentes (404 Not Found).
 */
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

/**
 * Middleware global para la gestión de errores no capturados.
 */
app.use(errorHandler);

export default app;
