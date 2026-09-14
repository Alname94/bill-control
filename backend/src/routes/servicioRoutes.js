import { Router } from "express";
import protegerRuta from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { crearServicioSchema, actualizarServicioSchema } from "../schemas/servicioSchema.js";
import { createServicio, deleteServicio, getServiciosByUser, getServicioById, updateServicio } from "../controllers/servicioController.js";
import { getFacturasByServicio } from "../controllers/facturaController.js";
import { queryFacturasSchema } from "../schemas/facturaSchema.js";

const router = Router();

router.use(protegerRuta);

/**
 * @openapi
 * /services:
 *   post:
 *     summary: Crear un nuevo servicio del hogar
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Servicio de Internet"
 *               nroCliente:
 *                 type: string
 *                 example: "123456789"
 *               activo:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *     responses:
 *       201:
 *         description: Servicio creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: Servicio creado correctamente
 *                 data:
 *                   $ref: '#/components/schemas/Servicio'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       401:
 *         description: No autorizado
 */
router.post('/', validateRequest(crearServicioSchema), createServicio);

/**
 * @openapi
 * /services:
 *   get:
 *     summary: Obtener todos los servicios del usuario autenticado
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado del servicio (true o false)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *     responses:
 *       200:
 *         description: Listado de servicios obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Servicio'
 *       401:
 *         description: No autorizado
 */
router.get('/', getServiciosByUser);

/**
 * @openapi
 * /services/{id}:
 *   get:
 *     summary: Obtener un servicio por su ID
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del servicio (SERIAL)
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Servicio'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Servicio no encontrado o no pertenece al usuario
 */
router.get('/:id', getServicioById);

/**
 * @openapi
 * /services/{id}:
 *   put:
 *     summary: Actualizar un servicio existente
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Internet Fibra 300MB"
 *               nroCliente:
 *                 type: string
 *                 example: "CLI-998877"
 *               activo:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Servicio actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: Servicio actualizado correctamente
 *                 data:
 *                   $ref: '#/components/schemas/Servicio'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Servicio no encontrado
 */
router.put('/:id', validateRequest(actualizarServicioSchema), updateServicio);

/**
 * @openapi
 * /services/{id}:
 *   delete:
 *     summary: Eliminar un servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a eliminar
 *     responses:
 *       200:
 *         description: Servicio eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: Servicio eliminado correctamente
 *                 data:
 *                   $ref: '#/components/schemas/Servicio'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Servicio no encontrado
 */
router.delete('/:id', deleteServicio);

/**
 * @openapi
 * /services/{id}/bills:
 *   get:
 *     summary: Obtener facturas de un servicio específico con paginación
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *     responses:
 *       200:
 *         description: Listado de facturas del servicio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Factura'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Servicio no encontrado o no pertenece al usuario
 */
router.get('/:id/bills', validateRequest(queryFacturasSchema), getFacturasByServicio);

export default router;