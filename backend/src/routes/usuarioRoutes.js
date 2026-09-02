import { Router } from "express";
import protegerRuta from "../middlewares/authMiddleware.js";
import { getUsuario, updateUsuario, updatePassword, deleteUsuario } from "../controllers/usuarioController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { updatePasswordSchema, updateUserSchema } from "../schemas/usuarioSchema.js";

const router = Router();

router.use(protegerRuta);

router.get('/', getUsuario);
router.put('/', validateRequest(updateUserSchema), updateUsuario);
router.put('/password', validateRequest(updatePasswordSchema), updatePassword);
router.delete('/', deleteUsuario);

export default router;
