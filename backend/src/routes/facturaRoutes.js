import { Router } from "express";
import protegerRuta from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { crearFacturaSchema } from "../schemas/facturaSchema.js"
import { createFactura, getFacturaById, getFacturasByServicio, updateFactura, deleteFactura } from "../controllers/facturaController.js"

const router = Router();

router.use(protegerRuta);

/**
 * @openapi
 * /bills:
 *   post:
 *     summary: Crear una nueva factura
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - servicioId
 *               - monto
 *               - fechaVencimiento
 *             properties:
 *               servicioId:
 *                 type: integer
 *                 example: 1
 *               monto:
 *                 type: number
 *                 format: double
 *                 example: 4500.50
 *               fechaVencimiento:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-10"
 *               pagado:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Factura creada correctamente
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
 *                   example: Factura creada correctamente
 *                 data:
 *                   $ref: '#/components/schemas/Factura'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       401:
 *         description: No autorizado
 */
router.post('/', validateRequest(crearFacturaSchema), createFactura);

/**
 * @openapi
 * /bills/{id}:
 *   get:
 *     summary: Obtener el detalle de una factura por ID
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Factura'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Factura no encontrada
 */
router.get('/:id', getFacturaById);

/**
 * @openapi
 * /bills/{id}:
 *   put:
 *     summary: Actualizar una factura
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monto:
 *                 type: number
 *                 format: double
 *                 example: 5200.00
 *               fechaVencimiento:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-15"
 *               pagado:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Factura actualizada correctamente
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
 *                   example: Factura actualizada correctamente
 *                 data:
 *                   $ref: '#/components/schemas/Factura'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Factura no encontrada
 */
router.put('/:id', updateFactura);

/**
 * @openapi
 * /bills/{id}:
 *   delete:
 *     summary: Eliminar una factura
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura eliminada correctamente
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
 *                   example: Factura eliminada correctamente
 *                 data:
 *                   $ref: '#/components/schemas/Factura'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Factura no encontrada
 */
router.delete('/:id', deleteFactura);

export default router;