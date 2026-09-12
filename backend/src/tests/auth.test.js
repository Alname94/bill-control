import request from "supertest";
import app from "../app.js";
import { limpiarBaseDeDatos } from "./helpers.js";

describe("Suite de Pruebas: Módulo de Autenticación (/api/auth)", () => {
  beforeEach(async () => {
    await limpiarBaseDeDatos();
  });

  afterAll(async () => {
    await limpiarBaseDeDatos();
  });

  describe("POST /api/auth/register", () => {
    test("Debe registrar un nuevo usuario correctamente", async () => {
      const nuevoUsuario = {
        nombre: "Nuevo Usuario",
        email: "nuevo@example.com",
        password: "Password123!",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(nuevoUsuario);

      expect(response.status).toBe(201);
      expect(response.body.ok).toBe(true);
      expect(response.body.data.usuario).toHaveProperty("id");
      expect(response.body.data.usuario.email).toBe("nuevo@example.com");
      expect(response.body.data.usuario).not.toHaveProperty("password");
    });

    test("Debe fallar al intentar registrar un email ya existente", async () => {
      const usuarioOriginal = {
        nombre: "Original",
        email: "duplicado@example.com",
        password: "Password123!",
      };

      await request(app).post("/api/auth/register").send(usuarioOriginal);

      const response = await request(app)
        .post("/api/auth/register")
        .send(usuarioOriginal);

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
    });

    test("Debe fallar al enviar un email o password con formato inválido (Zod Validation)", async () => {
      const usuarioInvalido = {
        nombre: "Juan",
        email: "email-invalido",
        password: "123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(usuarioInvalido);

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.details).toHaveProperty('email');
      expect(response.body.details.email).toBe("Debe ser un email válido");
      expect(response.body.details).toHaveProperty('password');
      expect(response.body.details.password).toBe('La contraseña debe tener al menos 6 caracteres');
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        nombre: "Usuario Registrado",
        email: "login@example.com",
        password: "PasswordSeguro123",
      });
    });

    test("Debe autenticar correctamente al usuario y retornar un JWT token", async () => {
      const credencialesCorrectas = {
        email: "login@example.com",
        password: "PasswordSeguro123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credencialesCorrectas);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.data).toHaveProperty("token");
      expect(typeof response.body.data.token).toBe("string");
      expect(response.body.data.usuario.email).toBe("login@example.com");
    });

    test("Debe rechazar el login cuando la contraseña es incorrecta", async () => {
      const credencialesErroneas = {
        email: "login@example.com",
        password: "PasswordIncorrecto",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credencialesErroneas);

      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
      expect(response.body).not.toHaveProperty("token");
    });

    test("Debe rechazar el login cuando el email no existe en la base de datos", async () => {
      const usuarioInexistente = {
        email: "noexiste@example.com",
        password: "PasswordSeguro123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(usuarioInexistente);

      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
    });
  });
});