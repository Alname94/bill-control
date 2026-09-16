import { Router } from "express";
import protegerRuta from "../middlewares/authMiddleware.js";
import { getUsuario, updateUsuario, updatePassword, deleteUsuario } from "../controllers/usuarioController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { updatePasswordSchema, updateUserSchema } from "../schemas/usuarioSchema.js";

const router = Router();

router.use(protegerRuta);

/**
 * @openapi
 * /user:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
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
 *                   example: "Usuario obtenido"
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/', getUsuario);

/**
 * @openapi
 * /user:
 *   patch:
 *     summary: Actualizar datos del perfil (nombre)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Nombre Actualizado"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
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
 *                   example: "Usuario actualizado"
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         $ref: '#/components/responses/ErrorValidacion'
 *       401:
 *         description: No autorizado
 */
router.patch('/', validateRequest(updateUserSchema), updateUsuario);

/**
 * @openapi
 * /user/password:
 *   patch:
 *     summary: Cambiar contraseña del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passwordActual
 *               - nuevaPassword
 *             properties:
 *               passwordActual:
 *                 type: string
 *                 format: password
 *                 example: "PasswordSeguro123!"
 *               passwordNuevo:
 *                 type: string
 *                 format: password
 *                 example: "NuevaPassword456!"
 *     responses:
 *       200:
 *         description: Password actualizado exitosamente
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
 *                   example: "Password actualizado exitosamente"
 *       400:
 *         description: La contraseña actual es incorrecta o la nueva no cumple con la validación Zod
 *       401:
 *         description: No autorizado
 */
router.patch('/password', validateRequest(updatePasswordSchema), updatePassword);

/**
 * @openapi
 * /user:
 *   delete:
 *     summary: Eliminar la cuenta del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
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
 *                   example: "Usuario eliminado"
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/', deleteUsuario);

export default router;
