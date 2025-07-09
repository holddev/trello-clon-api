import { Context, Next } from "hono";
import { UnauthorizedError } from "../errors/error";
import { UserRepository } from "../repositories/user";
import { handleControllerError } from "../utils/utils";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { Env } from "../types/types";
import { env } from "hono/adapter";


export const authenticateUser = async (c: Context, next: Next) => {
  const config = env<Env>(c, 'workerd')

  const authHeader = c.req.header('Authorization');

  try {
    const db = c.get("db")

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Se requiere un token de autenticación.');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Token de autenticación no proporcionado.');
    }


    const client = await verifyToken(token, {
      secretKey: config.CLERK_SECRET_KEY,
    });

    if (!client || !client.sub) {
      throw new UnauthorizedError('Token inválido o usuario no encontrado.');
    }
    const repo = new UserRepository(db);
    let user = await repo.findById(client.sub as string);

    if (!user) {
      // 🔽 Intentar crear el usuario directamente
      const clerk = createClerkClient({ secretKey: config.CLERK_SECRET_KEY });
      const clerkUser = await clerk.users.getUser(client.sub);

      user = await repo.create({
        id: clerkUser.id,
        name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim(),
        email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      });
    }

    if (!user) {
      throw new UnauthorizedError('Unauthorized: user does not exist.');
    }

    c.set('userId', user.id);
    await next();
  } catch (error) {
    const { message, status } = handleControllerError(error);
    return c.json({ error: message }, status);
  }
};