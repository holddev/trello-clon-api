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

    return c.json(result, result.status)
  })

  router.patch("/reorder", async (c) => {
    const db = c.get("db")
    const services = new TaskController(new TaskRepository(db))
    const body: Partial<Task>[] = await c.req.json()
    const userId = c.req.query("userId") as string // prueba

    const result = await services.reorderTasks(userId, body)

    return c.json(result, result.status)
  })

  router.patch("/:id", async (c) => {
    const db = c.get("db")
    const services = new TaskController(new TaskRepository(db))
    const taskId = parseInt(c.req.param("id"))
    const taskUpdated: Partial<Task> = await c.req.json()
    const userId = c.req.query("userId") as string // prueba

    const result = await services.update(userId, taskId, taskUpdated)

    return c.json(result, result.status)
  })

  router.delete("/:id", async (c) => {
    const db = c.get("db")
    const services = new TaskController(new TaskRepository(db))
    const taskId = parseInt(c.req.param("id"))
    const userId = c.req.query("userId") as string // prueba

    const result = await services.delete(userId, taskId)

    return c.json(result, result.status)
  })

  return router
}