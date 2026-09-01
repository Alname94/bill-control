import { z } from "zod";

export const crearFacturaSchema = z.object({
  body: z.object({
    servicioId: z.number().int().positive("El servicioId debe ser un ID válido"),
    monto: z.number().positive("El monto debe ser un número mayor a 0"),
    fechaVencimiento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato AAAA-MM-DD"),
    pagado: z.boolean().optional().default(false),
  }),
});
