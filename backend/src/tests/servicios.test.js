import request from "supertest";
import app from "../app.js";
import { generarTokenTest, limpiarBaseDeDatos, USUARIO_TEST_1_ID, USUARIO_TEST_2_ID, } from "./helpers.js";

describe("Suite de Pruebas: Módulo de Servicios (/api/services)", () => {
  let tokenUsuario1;
  let tokenUsuario2;

  beforeAll(() => {
    tokenUsuario1 = generarTokenTest(USUARIO_TEST_1_ID);
    tokenUsuario2 = generarTokenTest(USUARIO_TEST_2_ID);
  });

  beforeEach(async () => {
    await limpiarBaseDeDatos();
  });

  afterAll(async () => {
    await limpiarBaseDeDatos();
  });

  describe("POST /api/services", () => {
    let nuevoServicio;

    beforeEach(async () => {
      const resCrear = await request(app)
        .post("/api/services")
        .set("Authorization", `Bearer ${tokenUsuario1}`)
        .send({ nombre: "Edesur", nroCliente: "123456", activo: true });

        nuevoServicio = resCrear.body.data.nombre;
    });

    test("Debe crear un servicio correctamente para el usuario autenticado", async () => {
      const nuevoServicio = {
        nombre: "Internet",
        nroCliente: "123456",
        activo: true,
      };

      const response = await request(app)
        .post("/api/services")
        .set("Authorization", `Bearer ${tokenUsuario1}`)
        .send(nuevoServicio);

      expect(response.status).toBe(201);
      expect(response.body.ok).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.nombre).toBe("INTERNET");
      expect(response.body.data.usuarioId).toBe(USUARIO_TEST_1_ID);
    });

    test('Debe fallar al intentar crear un servicio con un nombre ya existente', async () => {
      const response = await request(app)
        .post("/api/services")
        .set("Authorization", `Bearer ${tokenUsuario1}`)
        .send({ nombre: "Edesur", nroCliente: "123456", activo: true });

        expect(response.status).toBe(400);
    });

    test("Debe retornar 401 si se intenta crear sin token de autenticación", async () => {
      const response = await request(app)
        .post("/api/services")
        .send({ nombre: "Internet" });

      expect(response.status).toBe(401);
    });
  });

  describe("Aislamiento Multi-tenant (Seguridad IDOR)", () => {
    test("El Usuario 2 NO debe poder ver ni modificar un servicio del Usuario 1", async () => {
      const resServicio = await request(app)
        .post("/api/services")
        .set("Authorization", `Bearer ${tokenUsuario1}`)
        .send({ nombre: "Gas Naturgy", nroCliente: "999" });

      const servicioId = resServicio.body.data.id;

      const resGet = await request(app)
        .get(`/api/services/${servicioId}`)
        .set("Authorization", `Bearer ${tokenUsuario2}`);

      expect(resGet.status).toBe(404);

      const resDelete = await request(app)
        .delete(`/api/services/${servicioId}`)
        .set("Authorization", `Bearer ${tokenUsuario2}`);

      expect(resDelete.status).toBe(404);
    });
  });

  describe("GET /api/services (Paginación)", () => {
    test("Debe retornar la lista de servicios paginada correctamente", async () => {
      await request(app)
        .post("/api/services")
        .set("Authorization", `Bearer ${tokenUsuario1}`)
        .send({ nombre: "Agua" });

      await request(app)
        .post("/api/services")
        .set("Authorization", `Bearer ${tokenUsuario1}`)
        .send({ nombre: "Internet" });

      const response = await request(app)
        .get("/api/services?page=1&limit=1")
        .set("Authorization", `Bearer ${tokenUsuario1}`);

      expect(response.status).toBe(200);
      expect(response.body.data.servicios.length).toBe(1);
      expect(response.body.data.pagination).toEqual({
        total: 2,
        page: 1,
        limit: 1,
        totalPages: 2,
      });
    });
  });

  describe("PUT y DELETE /api/services/:id", () => {
    let servicioId;

    beforeEach(async () => {
      const resCrear = await request(app)
        .post("/api/services")
        .set("Authorization", `Bearer ${tokenUsuario1}`)
        .send({ nombre: "Servicio Viejo" });

      servicioId = resCrear.body.data.id;
    });

    test("Debe actualizar los datos de un servicio existente", async () => {
      const response = await request(app)
        .put(`/api/services/${servicioId}`)
        .set("Authorization", `Bearer ${tokenUsuario1}`)
        .send({ nombre: "Servicio Actualizado", activo: false });

      expect(response.status).toBe(200);
      expect(response.body.data.nombre).toBe("SERVICIO ACTUALIZADO");
      expect(response.body.data.activo).toBe(false);
    });

    test("Debe fallar al enviar un nombre de servicio con formato inválido (Zod validation)", async () => {
      const response = await request(app)
        .put(`/api/services/${servicioId}`)
        .set("Authorization", `Bearer ${tokenUsuario1}`)
        .send({ nombre: "", activo: false });

      expect(response.status).toBe(400);
      expect(response.body.details.nombre).toBe("El nombre debe tener al menos 2 caracteres");
    });

    test("Debe retornar 404 al intentar actualizar o eliminar un servicio inexistente", async () => {
      const idInexistente = 999999;
      const response = await request(app)
        .put(`/api/servicios/${idInexistente}`)
        .set("Authorization", `Bearer ${tokenUsuario1}`)
        .send({
          nombre: "Servicio Inexistente"
        });

      expect(response.status).toBe(404);
    });

    test("Debe eliminar un servicio correctamente", async () => {
      const response = await request(app)
        .delete(`/api/services/${servicioId}`)
        .set("Authorization", `Bearer ${tokenUsuario1}`);

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.mensaje).toBe("Servicio eliminado correctamente");
    });
  });
});

