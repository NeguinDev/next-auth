import { z } from 'zod';

export const LoginSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Mínimo de 2 caracteres' })
    .max(32, { message: 'Máximo de 32 caracteres' }),
  password: z
    .string()
    .min(6, { message: 'Mínimo de 6 caracteres' })
    .max(32, { message: 'Máximo de 32 caracteres' }),
});

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Mínimo de 2 caracteres' })
    .max(32, { message: 'Máximo de 32 caracteres' }),
  password: z
    .string()
    .min(6, { message: 'Mínimo de 6 caracteres' })
    .max(32, { message: 'Máximo de 32 caracteres' }),
});