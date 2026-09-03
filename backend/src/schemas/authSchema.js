import { z } from "zod";

export const registroSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.email({ pattern: z.regexes.unicodeEmail }, "Debe ser un email válido"),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({ pattern: z.regexes.unicodeEmail }, "Debe ser un email válido"),
    password: z.string().min(1, 'La contraseña es requerida'),
  })
});

