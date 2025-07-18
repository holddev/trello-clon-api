import { Hono } from "hono";
import { ColumnController } from "../controllers/columns";
import { ColumnRepository } from "../repositories/columns";
import { Column } from "../models/columns";

export const columnRouter = () => {
  const router = new Hono();

  router.get("/board/:id", async (c) => {
    const db = c.get("db");
    const userId = c.get("userId")
    const boardId = parseInt(c.req.param("id"));
    const service = new ColumnController(new ColumnRepository(db));

    const result = await service.getAll(userId, boardId);

    return c.json(result, result.status);
  });

  router.post("/", async (c) => {
    const db = c.get("db");
    const userId = c.get("userId")
    const data: Column = await c.req.json();
    const service = new ColumnController(new ColumnRepository(db));

    const result = await service.create(userId, data);

    return c.json(result, result.status);
  });

  router.patch("/:id", async (c) => {
    const db = c.get("db");
    const userId = c.get("userId")
    const columnId = parseInt(c.req.param("id"));
    const service = new ColumnController(new ColumnRepository(db))

    const data: Partial<Column> = await c.req.json();

    const result = await service.update(userId, columnId, data);

    return c.json(result, result.status);
  });

  router.delete("/:id", async (c) => {
    const columnId = parseInt(c.req.param("id"));
    const db = c.get("db");
    const userId = c.get("userId")
    const service = new ColumnController(new ColumnRepository(db));

    const result = await service.delete(userId, columnId);

    return c.json(result, result.status);
  });

  return router;
}