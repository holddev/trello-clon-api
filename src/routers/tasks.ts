import { Hono } from "hono"
import { TaskController } from "../controllers/tasks"
import { TaskRepository } from "../repositories/tasks"
import { newTask, Task } from "../models/tasks"

export const TaskRouter = () => {
  const router = new Hono()

  router.post("/", async (c) => {
    const db = c.get("db")
    const services = new TaskController(new TaskRepository(db))
    const body: newTask = await c.req.json()
    const userId = c.req.query("userId") as string // prueba

    const result = await services.create(userId, body)

    if (!result.ok) {
      return c.json({ error: result.message }, result.status)
    }

    return c.json(result.data, result.status)
  })

  router.patch("/:id", async (c) => {
    const db = c.get("db")
    const services = new TaskController(new TaskRepository(db))
    const taskId = parseInt(c.req.param("id"))
    const taskUpdated: Partial<Task> = await c.req.json()
    const userId = c.req.query("userId") as string // prueba

    const result = await services.update(userId, taskId, taskUpdated)

    if (!result.ok) {
      return c.json({ error: result.message }, result.status)
    }

    return c.json(result.data, result.status)
  })

  router.delete("/:id", async (c) => {
    const db = c.get("db")
    const services = new TaskController(new TaskRepository(db))
    const taskId = parseInt(c.req.param("id"))
    const userId = c.req.query("userId") as string // prueba

    const result = await services.delete(userId, taskId)

    if (!result.ok) {
      return c.json({ error: result.message }, result.status)
    }

    return c.json(result.data, result.status)
  })


  return router
}