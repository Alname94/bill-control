import request from "supertest";
import app from "../app.js";
import { generarTokenTest, limpiarBaseDeDatos, USUARIO_TEST_1_ID, USUARIO_TEST_2_ID } from './helpers.js';

describe('Suite de Pruebas: Módulo de Facturas (/api/bills)', () => {
  let tokenUsuario1;
  let tokenUsuario2;
  let servicioUsuario1Id;

  beforeAll(() => {
    tokenUsuario1 = generarTokenTest(USUARIO_TEST_1_ID);
    tokenUsuario2 = generarTokenTest(USUARIO_TEST_2_ID);
  });

  beforeEach(async () => {
    await limpiarBaseDeDatos();

    const servicioTest = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${tokenUsuario1}`)
      .send({ nombre: 'Servicio de Internet' });

    servicioUsuario1Id = servicioTest.body.data.id;
  });

  afterAll(async () => {
    await limpiarBaseDeDatos();
  });

  describe('POST /api/bills', () => {
    test('Debe crear una factura correctamente asociada a un servicio', async () => {
      const nuevaFactura = {
        servicioId: servicioUsuario1Id,
        monto: 1500.50,
        fechaVencimiento: '2026-10-15',
        pagado: false,
      };

      const response = await request(app)
        .post('/api/bills')
        .set('Authorization', `Bearer ${tokenUsuario1}`)
        .send(nuevaFactura);

      expect(response.status).toBe(201);
      expect(response.body.ok).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.monto).toBe('1500.50');
      expect(response.body.data.servicioId).toBe(servicioUsuario1Id);
    });

    test('Debe fallar al crear una factura para un servicio inexistente o ajeno', async () => {
      const nuevaFactura = {
        servicioId: servicioUsuario1Id,
        monto: 2000,
        fechaVencimiento: '2026-11-01',
      };

      const response = await request(app)
        .post('/api/bills')
        .set('Authorization', `Bearer ${tokenUsuario2}`)
        .send(nuevaFactura);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/bills/:id', () => {
    let facturaId;
    const idInexistente = 23232323;

    beforeEach(async () => {
      const res = await request(app)
        .post("/api/bills")
        .set("Authorization", `Bearer ${tokenUsuario1}`)
        .send({
          servicioId: servicioUsuario1Id,
          monto: 1000,
          fechaVencimiento: "2026-01-10",
          pagado: true,
        });

        facturaId = res.body.data.id
    });

    test('Debe obtener la factura correspondiente al ID pasado como parametro', async () => {
      const response = await request(app)
        .get(`/api/bills/${facturaId}`)
        .set("Authorization", `Bearer ${tokenUsuario1}`)

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data.monto).toBe("1000.00");
        expect(response.body.data.servicioId).toBe(servicioUsuario1Id);
    });

    test('Debe fallar al intentar obtener una factura con ID inexistente', async () => {
      const response = await request(app)
        .get(`/api/bills/${idInexistente}`)
        .set("Authorization", `Bearer ${tokenUsuario1}`);

        expect(response.status).toBe(404);
        expect(response.ok).toBe(false);
        expect(response.body.error).toBe("No se encontró factura con ese ID.");
    });
  });

  describe('GET /api/services/:servicioId/bills (Filtros y Paginación)', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/bills')
        .set('Authorization', `Bearer ${tokenUsuario1}`)
        .send({
          servicioId: servicioUsuario1Id,
          monto: 1000,
          fechaVencimiento: '2026-01-10',
          pagado: true,
        });

      await request(app)
        .post('/api/bills')
        .set('Authorization', `Bearer ${tokenUsuario1}`)
        .send({
          servicioId: servicioUsuario1Id,
          monto: 2000,
          fechaVencimiento: '2026-02-15',
          pagado: false,
        });

      await request(app)
        .post('/api/bills')
        .set('Authorization', `Bearer ${tokenUsuario1}`)
        .send({
          servicioId: servicioUsuario1Id,
          monto: 3000,
          fechaVencimiento: '2026-03-20',
          pagado: false,
        });
    });

    test('Debe obtener todas las facturas del servicio paginadas', async () => {
      const response = await request(app)
        .get(`/api/services/${servicioUsuario1Id}/bills/?page=1&limit=2`)
        .set("Authorization", `Bearer ${tokenUsuario1}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination).toEqual({
        total: 3,
        page: 1,
        limit: 2,
        totalPages: 2,
      });
    });

    test('Debe filtrar facturas por estado de pago (?pagado=true)', async () => {
      const response = await request(app)
        .get(`/api/services/${servicioUsuario1Id}/bills?pagado=true`)
        .set("Authorization", `Bearer ${tokenUsuario1}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].pagado).toBe(true);
    });

    test('Debe filtrar facturas por rango de fechas (fechaDesde y fechaHasta)', async () => {
      const response = await request(app)
        .get(`/api/services/${servicioUsuario1Id}/bills?fechaDesde=2026-02-01&fechaHasta=2026-02-28`)
        .set('Authorization', `Bearer ${tokenUsuario1}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].fechaVencimiento).toMatch(/^2026-02-15/);
    });

    test('El Usuario 2 NO debe poder ver las facturas del Usuario 1', async () => {
      const response = await request(app)
        .get(`/api/service/${servicioUsuario1Id}/bills`)
        .set('Authorization', `Bearer ${tokenUsuario2}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT y DELETE /api/bills/:id', () => {
    let facturaId;
    const idInexistente = 23232323;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/bills')
        .set('Authorization', `Bearer ${tokenUsuario1}`)
        .send({
          servicioId: servicioUsuario1Id,
          monto: 5000,
          fechaVencimiento: '2026-12-01',
          pagado: false,
        });
      facturaId = res.body.data.id;
    });

    test('Debe actualizar el estado de pago de una factura', async () => {
      const response = await request(app)
        .put(`/api/bills/${facturaId}`)
        .set("Authorization", `Bearer ${tokenUsuario1}`)
        .send({
          servicioId: servicioUsuario1Id,
          monto: 5000,
          fechaVencimiento: "2026-12-01",
          pagado: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.pagado).toBe(true);
    });

    test("Debe retornar 404 al intentar eliminar o actualizar una factura inexistente", async () => {
      const response = await request(app)
        .put(`/api/bills/${idInexistente}`)
        .set("Authorization", `Bearer ${tokenUsuario1}`);

      expect(response.status).toBe(404);
      expect(response.ok).toBe(false);
      expect(response.body.error).toBe("No se encontró factura con ese ID.");
    });

    test('Debe eliminar una factura correctamente', async () => {
      const response = await request(app)
        .delete(`/api/bills/${facturaId}`)
        .set('Authorization', `Bearer ${tokenUsuario1}`);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });
  });
});