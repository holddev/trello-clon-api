import { Hono } from "hono";
import { BoardRepository } from "../repositories/boards";
import { BoardController } from "../controllers/boards";
import { User } from "../models/users";
import { newBoard } from "../models/boards";


export const boardRouter = () => {

  const router = new Hono();

  router.post("/", async (c) => {
    const db = c.get("db");
    const service = new BoardController(new BoardRepository(db));

    const data: newBoard = await c.req.json()
    const result = await service.create(data)

    if (!result.ok) {
      return c.json({ error: result.message }, result.status);
    }

    return c.json(result.data, result.status);
  })

  router.get("/", async (c) => {
    const db = c.get("db");
    const service = new BoardController(new BoardRepository(db));
    const userId = c.req.query("userId") as string //prueba    

    const result = await service.findAll(userId);
    if (!result.ok) {
      return c.json({ error: result.message }, result.status);
    }
    return c.json(result.data, result.status);
  });

  router.patch("/:id", async (c) => {
    const db = c.get("db");
    const service = new BoardController(new BoardRepository(db));

    const id = c.req.param("id");
    const userId = c.req.query("userId") as string; //prueba

    if (!id) return c.json({ error: "Board ID is required" }, 400);
    const data: Partial<newBoard> = await c.req.json();

    const result = await service.updateField(userId, Number(id), data);

    if (!result.ok) {
      return c.json({ error: result.message }, result.status);
    }

    return c.json(result.data, result.status);
  })

  router.get("/:id", async (c) => {
    const db = c.get("db");
    const service = new BoardController(new BoardRepository(db));

    const id = c.req.param("id");
    const userId = c.req.query("userId") as string; //prueba

    if (!id) return c.json({ error: "Board ID is required" }, 400);

    const result = await service.findByIdWithDetails(userId, Number(id));

    if (!result.ok) {
      return c.json({ error: result.message }, result.status);
    }

    return c.json(result.data, result.status);
  })

  router.delete("/:id", async (c) => {
    const db = c.get("db");
    const service = new BoardController(new BoardRepository(db));

    const id = c.req.param("id")
    const userId = c.req.query("userId") as string //prueba

    if (!id) return c.json({ error: "Board ID is required" }, 400);

    const result = await service.delete(userId, Number(id))

    if (!result.ok) {
      return (c.json({ error: result.message }, result.status))
    }

    return (c.json(result.data, result.status))
  })

  return router;
};