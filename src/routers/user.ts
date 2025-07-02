import { Hono } from "hono";
import { UserRepository } from "../repositories/user";
import { UserController } from "../controllers/user";
import { User } from "../models/users";

export const userRouter = () => {

  const router = new Hono();

  router.post("/", async (c) => {
    const db = c.get("db");
    const service = new UserController(new UserRepository(db));

    const data: User = await c.req.json()
    const result = await service.create(data)

    return c.json(result, result.status);
  })

  router.get("/", async (c) => {
    const db = c.get("db");
    const service = new UserController(new UserRepository(db));

    const result = await service.findAll();

    return c.json(result, result.status);
  });

  router.get("/:id", async (c) => {
    const db = c.get("db");
    const service = new UserController(new UserRepository(db));

    const id = c.req.param("id");

    const result = await service.findById(id);

    return c.json(result, result.status);
  });

  return router;
};