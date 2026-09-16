/**
 * @fileoverview Configuración de Swagger para la documentación de la API.
 * Define la estructura de la documentación, incluyendo información general,
 * servidores, esquemas de seguridad y modelos de datos (Usuario, Servicio, Factura).
 */

import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de Gestión de Servicios del Hogar y Facturas",
    version: "1.0.0",
    description:
      "Backend multi-tenant en Node.js/Express para administración de servicios del hogar (Luz, Agua, Internet) y control de vencimiento/pago de facturas.",
  },
  servers: [
    {
      url: (process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 8080}`) + "/api",
      description: process.env.NODE_ENV === "production" ? "Servidor Producción" : "Servidor Local",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Autenticación con JWT. Ingresa el token obtenido en /auth/login.",
      },
    },
    schemas: {
      // Entidad: Usuario
      Usuario: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "11111111-1111-1111-1111-111111111111",
          },
          nombre: { type: "string", example: "Alejo Dev" },
          email: {
            type: "string",
            format: "email",
            example: "alejo@example.com",
          },
          creadoEn: {
            type: "string",
            format: "date-time",
            example: "2026-03-03T12:00:00Z",
          },
        },
      },

      // Entidad: Servicio (Luz, Agua, Internet, etc.)
      Servicio: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          usuario_id: {
            type: "string",
            format: "uuid",
            example: "11111111-1111-1111-1111-111111111111",
          },
          nombre: {
            type: "string",
            example: "Servicio de Internet",
          },
          nroCliente: {
            type: "string",
            nullable: true,
            example: "123456789",
          },
          activo: { type: "boolean", example: true },
          creadoEn: {
            type: "string",
            format: "date-time",
            example: "2026-03-03T12:00:00Z",
          },
        },
      },

      // Entidad: Factura
      Factura: {
        type: "object",
        properties: {
          id: { type: "integer", example: 101 },
          servicioId: { type: "integer", example: 1 },
          monto: { type: "number", format: "double", example: 4500.5 },
          fechaVencimiento: {
            type: "string",
            format: "date",
            example: "2026-03-20",
          },
          pagado: { type: "boolean", example: false },
          creadoEn: {
            type: "string",
            format: "date-time",
            example: "2026-03-03T12:00:00Z",
          },
        },
      },

      // Respuestas Estándar de Error (Zod / Middlewares)
      ErrorRespuesta: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: false },
          mensaje: {
            type: "string",
            example: "Error de validación o recurso no encontrado",
          },
          details: {
            type: "object",
            nullable: true,
            description: "Mapeo de errores de Zod por campo",
            example: { email: "El email debe tener un formato válido" },
          },
        },
      },
    },
    responses: {
      ErrorValidacion: {
        description: "Error de validación en los parámetros de entrada (Zod)",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorRespuesta",
            },
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
