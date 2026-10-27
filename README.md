# 🏡 Backend de Gestión de Servicios del Hogar y Facturación

[![Node.js](https://img.shields.io/badge/Node.js-v20-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-black.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_DB-blue.svg)](https://neon.tech/)
[![Jest](https://img.shields.io/badge/Tests-Jest_%26_Supertest-red.svg)](https://jestjs.io/)
[![Swagger](https://img.shields.io/badge/Docs-Swagger_UI-85EA2D.svg)](https://swagger.io/)

App Full-Stack desarrollada para la administración integral de servicios del hogar y el control de vencimientos y pagos de facturas. Permite gestionar servicios y facturas con control de estados y autenticación segura por usuario.

---

# 🌐 Despliegue en Producción

¡La aplicación se encuentra en producción y lista para usar! Podés acceder a través de los siguientes enlaces:

- 💻 **Frontend (Vercel):** [bill-control-ochre.vercel.app](https://bill-control-ochre.vercel.app)
- 📚 **Documentación API (Swagger):** [Explorar Swagger UI](https://backend-bill-control.onrender.com/api-docs/)

> ⚠️ **Nota importante sobre el Backend:** El servidor corre sobre el plan gratuito de Render. Si es la primera vez que ingresas en el día o tras un periodo de inactividad, puede demorar entre **1 y 2 minutos en "despertar"**.

---

## 🚀 Características Principales

### 🖥️ Frontend (React & Vite)
- **Autenticación Persistente:** Flujo completo de inicio de sesión y registro con manejo de tokens JWT (`localStorage`), interceptores HTTP automáticos y protección de rutas privadas.

- **Gestión de Servicios:** Listado dinámico con ordenamiento alfabético, búsqueda en tiempo real por nombre o número de cliente, y paginación integrada con recálculo dinámico de totales.

- **Control de Facturas:** Asociación directa de facturas por servicio, ordenamiento cronológico de vencimientos y tarjetas de paginación adaptativas.

- **UI/UX Fluida:** Interfaz responsiva desarrollada con **Bootstrap 5**, modales de confirmación, manejo unificado de estados de carga y retroalimentación de errores.

### ⚙️ Backend (Node.js & Express)
- **Gestión de Servicios y Facturas**: Permite registrar servicios y facturas asociadas a un usuario.

- **Autenticación y Seguridad:** JWT (JSON Web Tokens) con hashing de contraseñas mediante `bcrypt` y protección IDOR (aislamiento multi-tenant estricto por usuario).

- **Validación de Datos:** Esquemas mediante **Zod** para controlar entradas en peticiones HTTP.

- **Scripting DDL Automatizado:** Inicialización idempotente del esquema de la base de datos vía Node.js.

---

## ✅ Calidad y Testing
- **Cobertura de Tests:** Test suites automatizados con **Jest** y **Supertest** alcanzando **>93% de cobertura global**.

- **Manejo de Errores Unificado:** Middleware centralizado para respuestas estándar.

- **Documentación OpenAPI 3.0:** Consola interactiva con **Swagger UI** accesible directamente desde el navegador ingresando a [https://backend-bill-control.onrender.com/api-docs/](https://backend-bill-control.onrender.com/api-docs/) (Puede demorar un par de minutos en conectarse con Render).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** 
  - React (Functional Components & Custom Hooks)
  - Vite (Bundler y entorno de desarrollo)
  - React Router DOM (Ruteo protegido)
  - Axios (Cliente HTTP con interceptores globales)
  - Bootstrap 5 (Estilos y componentes responsivos)

- **Backend y Base de Datos:** 
  - Node.js (ES Modules) & Express.js
  - PostgreSQL (Cloud Serverless en Neon DB)
  - Zod (Validación de esquemas)
  - Jest & Supertest (Testing automatizado)
  - Swagger UI Express (Documentación OpenAPI 3.0)

- **Hosting / Deploy:** 
  - Vercel (Frontend) & Render (Backend)

---

## 🛠️ Buenas Prácticas y Arquitectura
- Arquitectura en Capas: Separación clara de responsabilidades (Rutas, Controladores, Servicios).

- Código Limpio: Nombramiento semántico, componentes modulares y funciones de responsabilidad única.

- Interceptores HTTP: Manejo centralizado de tokens de autorización y redirecciones automáticas ante expiración de sesión (401).

---

### Autor: [Alejo Méndez](https://github.com/Alname94)
