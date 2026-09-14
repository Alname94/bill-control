import { Router } from "express";
import { registrarUsuario, loginUsuario } from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { registroSchema, loginSchema } from "../schemas/authSchema.js";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Alejo Dev"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "alejo@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "PasswordSeguro123!"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
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
 *                   example: "Usuario registrado exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     usuario:
 *                       $ref: '#/components/schemas/Usuario'
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: El email ya se encuentra registrado o los datos son inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorRespuesta'
 */
router.post('/register', validateRequest(registroSchema), registrarUsuario);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "alejo@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "PasswordSeguro123!"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
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
 *                   example: "Inicio de sesión exitoso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     usuario:
 *                       $ref: '#/components/schemas/Usuario'
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciales inválidas (email o contraseña incorrectos)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorRespuesta'
 */
router.post('/login', validateRequest(loginSchema), loginUsuario);

export default router;