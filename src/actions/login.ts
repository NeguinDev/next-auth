'use server';

import * as z from 'zod';
import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import { LoginSchema } from '@/schemas/auth-schema';
import { getUserByUsername } from '@/data/user';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';


export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campos inválidos!' };
  }

  const { username, password } = validatedFields.data;

  const existingUser = await getUserByUsername(username);

  if (!existingUser || !existingUser.password) {
    return { error: 'Nome de Usuário não existe!' };
  }

  try {
    await signIn('credentials', {
      username,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Credenciais inválidas!' };
        default:
          return { error: 'Algo deu errado!' };
      }
    }

    throw error;
  }
};
