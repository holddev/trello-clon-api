import { Context, Next } from "hono";
import { UnauthorizedError } from "../errors/error";
import { UserRepository } from "../repositories/user";
import { handleControllerError } from "../utils/utils";

export const authenticateUser = async (c: Context, next: Next) => {
  const userId = c.req.query('userId') as string;
  const db = c.get('db');
  const repo = new UserRepository(db);

  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400);
  }

  try {
    const result = await repo.findById(userId);

    if (!result) {
      throw new UnauthorizedError('Unauthorized: user does not exist.');
    }
    c.set('userId', result.id);
    await next();
  } catch (error) {
    const { message, status } = handleControllerError(error);
    return c.json({ error: message }, status);
  }
};