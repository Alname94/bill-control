import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres")
  })
});

export const updatePasswordSchema = z.object({
  body: z.object({
    passwordActual: z.string().min(1, "Password actual es requerido"),
    passwordNuevo: z
      .string()
      .min(6, "El nuevo password debe tener al menos 6 caracteres"),
  })
});