import { Hono } from "hono";
import { UserRepository } from "../repositories/user";
import { UserController } from "../controllers/user";


export const userRouter = () => {

  const router = new Hono();

  router.get("/", async (c) => {
    const db = c.get("db");
    const service = new UserController(new UserRepository(db));

    const users = await service.findAll();
    return c.json(users);
  });

  router.get("/:id", async (c) => {
    const db = c.get("db");
    const service = new UserController(new UserRepository(db));

    const id = parseInt(c.req.param("id"));
    const user = await service.findById(id);
    if (!user) return c.json({ error: "User not found" }, 404);
    return c.json(user);
  });

  return router;
};