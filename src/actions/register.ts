'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas/auth-schema';
import { getUserByUsername } from '@/data/user';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export const register = async (
  values: z.infer<typeof RegisterSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campos inválidos!' };
  }

  const { username, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByUsername(username);

  if (existingUser) {
    return { error: 'Nome de usuário já em uso!' };
  }

  await db.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  try {
    await signIn('credentials', {
      username,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });

    return { success: 'Conta criada com sucesso!' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Credenciais invalidas, tente novamente!' };
        default:
          return { error: 'Algo deu errado!' };
      }
    }

    throw error;
  }

  return { success: 'Conta criada com sucesso!' };
};
