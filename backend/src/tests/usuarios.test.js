import request from "supertest";
import app from "../app.js";
import { generarTokenTest, limpiarBaseDeDatos, USUARIO_TEST_1_ID, tokenExpirado } from "./helpers.js";

describe('Suite de Pruebas: Módulo de Usuarios (/api/user)', () => {
  let tokenUsuario;

  beforeEach(async () => {
    await limpiarBaseDeDatos();
    tokenUsuario = generarTokenTest(USUARIO_TEST_1_ID);
  });

  afterAll(async () => {
    await limpiarBaseDeDatos();
  });

  describe('GET /api/user', () => {
    test('Debe obtener el perfil del usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${tokenUsuario}`);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.data.id).toBe(USUARIO_TEST_1_ID);
      expect(response.body.data).not.toHaveProperty('password');
    });

    test('Debe retornar 401 si se consulta sin token', async () => {
      const response = await request(app).get('/api/user');
      expect(response.status).toBe(401);
    });

    test("Debe retornar 401 si no se envía la cabecera Authorization", async () => {
      const response = await request(app).get("/api/user/");

      expect(response.status).toBe(401);
    });

    test('Debe retornar 401 si el usuario autenticado ya no existe en la base de datos', async () => {
      const response = await request(app)
        .get('/api/user/')
        .set('Authorization', `Bearer ${tokenExpirado}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('El usuario de este token ya no existe.');
    });
  });  

  describe('PUT /api/user', () => {
    test('Debe actualizar el nombre del usuario correctamente', async () => {
      const response = await request(app)
        .put('/api/user')
        .set('Authorization', `Bearer ${tokenUsuario}`)
        .send({ nombre: 'Nombre Actualizado' });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.data.nombre).toBe('Nombre Actualizado');
    });

    test('Debe fallar al enviar un nombre con formato inválido (Zod validation)', async () => {
      const response = await request(app)
        .put("/api/user")
        .set("Authorization", `Bearer ${tokenUsuario}`)
        .send({ nombre: "" });

        expect(response.status).toBe(400);
        expect(response.body.ok).toBe(false);
        expect(response.body.details).toHaveProperty("nombre");
        expect(response.body.details.nombre).toBe("El nombre debe tener al menos 2 caracteres");
    });
  });

  describe('PUT /api/user/password', () => {
    let token;

    beforeEach(async () => {
      const resAuth = await request(app).post("/api/auth/register").send({
        nombre: "Usuario Test",
        email: "test_pass@example.com",
        password: "Password123!",
      });

      token = resAuth.body.data.token;
    });

    test("Debe actualizar el password del usuario correctamente", async () => {
      const response = await request(app)
        .put("/api/user/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          passwordActual: "Password123!",
          passwordNuevo: "hash_nuevo",
        });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.mensaje).toBe("Password actualizado exitosamente");
    });

    test('Debe fallar al enviar un password con formato inválido (Zod validation)', async () => {
        const response = await request(app)
        .put("/api/user/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          passwordActual: "Password123!",
          passwordNuevo: "123",
        });

        expect(response.status).toBe(400);
        expect(response.body.ok).toBe(false);
        expect(response.body.details).toHaveProperty('passwordNuevo');
        expect(response.body.details.passwordNuevo).toBe('El nuevo password debe tener al menos 6 caracteres');
    });
    
    test("Debe fallar al enviar el password actual incorrecto", async () => {
      const response = await request(app)
        .put("/api/user/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          passwordActual: "Password1",
          passwordNuevo: "hash_nuevo",
        });

      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
    }); 
  });

  describe('DELETE /api/user', () => {
    test('Debe eliminar el usuario correctamente', async () => {
      const response = await request(app)
        .delete("/api/user")
        .set("Authorization", `Bearer ${tokenUsuario}`)

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.mensaje).toBe("Usuario eliminado");
    });
  });
});