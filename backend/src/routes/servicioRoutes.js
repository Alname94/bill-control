import { Router } from "express";
import protegerRuta from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { crearServicioSchema, actualizarServicioSchema } from "../schemas/servicioSchema.js";
import { createServicio, deleteServicio, getServiciosByUser, getServicioById, updateServicio } from "../controllers/servicioController.js";

const router = Router();

router.use(protegerRuta);

router.post('/', validateRequest(crearServicioSchema), createServicio);
router.get('/', getServiciosByUser);
router.get('/:id', getServicioById);
router.put('/:id', validateRequest(actualizarServicioSchema), updateServicio);
router.delete('/:id', deleteServicio);

export default router;