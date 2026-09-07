import { Router } from "express";
import protegerRuta from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { crearFacturaSchema } from "../schemas/facturaSchema.js"
import { createFactura, getFacturaById, getFacturasByServicio, updateFactura, deleteFactura } from "../controllers/facturaController.js"

const router = Router();

router.use(protegerRuta);

router.post('/', validateRequest(crearFacturaSchema), createFactura);
router.get('/', getFacturasByServicio);
router.get('/:id', getFacturaById);
router.put('/:id', updateFactura);
router.delete('/:id', deleteFactura);

export default router;