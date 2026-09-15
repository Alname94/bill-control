# 🏡 Backend de Gestión de Servicios del Hogar y Facturación

[![Node.js](https://img.shields.io/badge/Node.js-v20-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-black.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_DB-blue.svg)](https://neon.tech/)
[![Jest](https://img.shields.io/badge/Tests-Jest_%26_Supertest-red.svg)](https://jestjs.io/)
[![Swagger](https://img.shields.io/badge/Docs-Swagger_UI-85EA2D.svg)](https://swagger.io/)

API RESTful para la administración de servicios del hogar y control de vencimiento/pago de facturas. Diseñada con enfoque en código limpio, validación de datos y arquitectura desacoplada por capas (Rutas, Controladores, Servicios).

---

## 🚀 Características Principales

* **Autenticación y Seguridad:** JWT (JSON Web Tokens) con hashing de contraseñas mediante `bcrypt` y protección IDOR (aislamiento multi-tenant estricto por usuario).
* **Validación de Datos:** Esquemas mediante **Zod** para controlar entradas en peticiones HTTP.
* **Cobertura de Tests:** Test suites automatizados con **Jest** y **Supertest** alcanzando **>93% de cobertura global**.
* **Documentación OpenAPI 3.0:** Consola interactiva con **Swagger UI** accesible directamente desde el navegador.
* **Manejo de Errores Unificado:** Middleware centralizado para respuestas estándar.
* **Scripting DDL Automatizado:** Inicialización idempotente del esquema de la base de datos vía Node.js.

---

## 🛠️ Tecnologías Utilizadas

* **Entorno de Ejecución:** Node.js (ES Modules)
* **Framework Web:** Express.js
* **Base de Datos:** PostgreSQL (Servicio Cloud Serverless en Neon DB / Local)
* **Validación:** Zod
* **Testing:** Jest, Supertest
* **Documentación:** Swagger UI Express, Swagger JSDoc
