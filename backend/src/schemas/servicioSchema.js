import { z } from "zod";

export const crearServicioSchema = z.object({
  body: z.object({
    nombre: z.string().trim().toUpperCase().min(2, "El nombre del servicio es obligatorio"),
    nroCliente: z.string().optional(),
    activo: z.boolean().optional().default(true),
  }),
});

export const actualizarServicioSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    nombre: z.string().trim().toUpperCase().min(2, 'El nombre debe tener al menos 2 caracteres'),
    nroCliente: z.string().optional(),
    activo: z.boolean().optional(),
  }),
});
