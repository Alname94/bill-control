import { z } from "zod";

export const crearServicioSchema = z.object({
  body: z.object({
    nombre: z.string().min(2, "El nombre del servicio es obligatorio"),
    nroCliente: z.string().optional(),
    activo: z.boolean().optional().default(true),
  }),
});
