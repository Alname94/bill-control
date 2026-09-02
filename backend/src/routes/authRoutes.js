import { Router } from "express";
import { registrarUsuario, loginUsuario } from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { registroSchema, loginSchema } from "../schemas/authSchema.js";

const router = Router();

router.post('/register', validateRequest(registroSchema), registrarUsuario);
router.post('/login', validateRequest(loginSchema), loginUsuario);

export default router;