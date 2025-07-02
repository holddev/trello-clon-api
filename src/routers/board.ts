import { Hono } from "hono";
import { BoardRepository } from "../repositories/boards";
import { BoardController } from "../controllers/boards";
import { newBoard } from "../models/boards";


export const boardRouter = () => {

  const router = new Hono();

  router.post("/", async (c) => {
    const db = c.get("db");
    const service = new BoardController(new BoardRepository(db));

    const data: newBoard = await c.req.json()
    const result = await service.create(data)

    return c.json(result, result.status);
  })

  router.get("/", async (c) => {
    const db = c.get("db");
    const service = new BoardController(new BoardRepository(db));
    const userId = c.req.query("userId") as string //prueba    

    const result = await service.findAll(userId);

    return c.json(result, result.status);
  });

  router.patch("/reorder", async (c) => {
    const db = c.get("db");
    const service = new BoardController(new BoardRepository(db));

    const userId = c.req.query("userId") as string; //prueba
    const data: Partial<newBoard>[] = await c.req.json();

    const result = await service.reorder(userId, data)

    return c.json(result, result.status);
  })

  router.get("/:id", async (c) => {
    const db = c.get("db");
    const service = new BoardController(new BoardRepository(db));

    const id = c.req.param("id");
    const userId = c.req.query("userId") as string; //prueba

    if (!id) return c.json({ error: "Board ID is required" }, 400);

    const result = await service.findByIdWithDetails(userId, Number(id));

    return c.json(result, result.status);
  })

  router.patch("/:id", async (c) => {
    const db = c.get("db");
    const service = new BoardController(new BoardRepository(db));

    const id = c.req.param("id");
    const userId = c.req.query("userId") as string; //prueba

    if (!id) return c.json({ error: "Board ID is required" }, 400);
    const data: Partial<newBoard> = await c.req.json();

    const result = await service.updateField(userId, Number(id), data);

    return c.json(result, result.status);
  })

  router.delete("/:id", async (c) => {
    const db = c.get("db");
    const service = new BoardController(new BoardRepository(db));

    const id = c.req.param("id")
    const userId = c.req.query("userId") as string //prueba

    if (!id) return c.json({ error: "Board ID is required" }, 400);

    const result = await service.delete(userId, Number(id))

    return c.json(result, result.status);
  })

  return router;
};