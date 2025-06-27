import { Hono } from "hono";
import { ColumnController } from "../controllers/columns";
import { ColumnRepository } from "../repositories/columns";
import { Column } from "../models/columns";

export const columnRouter = () => {
  const router = new Hono();

  router.get("/board/:id", async (c) => {
    const db = c.get("db");
    const service = new ColumnController(new ColumnRepository(db));

    const boardId = parseInt(c.req.param("id"));
    const userId = c.req.query("userId") as string //prueba    

    const result = await service.getAll(userId, boardId);

    if (!result.ok) {
      return c.json({ error: result.message }, result.status);
    }

    return c.json(result.data, result.status);
  });

  router.post("/", async (c) => {
    const db = c.get("db");
    const service = new ColumnController(new ColumnRepository(db));
    const userId = c.req.query("userId") as string //prueba    

    const data: Column = await c.req.json();
    const result = await service.create(userId, data);

    if (!result.ok) {
      return c.json({ error: result.message }, result.status);
    }

    return c.json(result.data, result.status);
  });

  router.patch("/:id", async (c) => {
    const db = c.get("db");
    const service = new ColumnController(new ColumnRepository(db))
    const userId = c.req.query("userId") as string //prueba    

    const columnId = parseInt(c.req.param("id"));
    const data: Partial<Column> = await c.req.json();

    const result = await service.update(userId, columnId, data);

    if (!result.ok) {
      return c.json({ error: result.message }, result.status);
    }

    return c.json(result.data, result.status);
  });

  router.delete("/:id", async (c) => {
    const db = c.get("db");
    const service = new ColumnController(new ColumnRepository(db));
    const userId = c.req.query("userId") as string //prueba    

    const columnId = parseInt(c.req.param("id"));

    const result = await service.delete(userId, columnId);

    if (!result.ok) {
      return c.json({ error: result.message }, result.status);
    }

    return c.json(result.data, result.status);
  });

  return router;
}