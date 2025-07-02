import { NotFoundError } from "../errors/error";
import { newTask, Task } from "../models/tasks";
import { TaskRepository } from "../repositories/tasks";
import { ControllerResponse } from "../types/types";
import { handleControllerError } from "../utils/utils";

export class TaskController {
  constructor(private taskRepository: TaskRepository) { }

  async create(userId: string, data: newTask): Promise<ControllerResponse<Task>> {
    try {
      const result = await this.taskRepository.create(userId, data);
      return { ok: true, message: "task created Successfully", data: result, status: 201 };
    } catch (error) {
      console.error("Error creating task:", error);
      const { message, status } = handleControllerError(error)
      return { ok: false, data: null, message, status };
    }
  }

  async update(userId: string, taskId: number, data: Partial<Task>): Promise<ControllerResponse<Task>> {
    try {
      const result = await this.taskRepository.update(userId, taskId, data);
      if (!result) {
        throw new NotFoundError("Task not found");
      }
      return { ok: true, message: "task updated Successfully", data: null, status: 200 };
    } catch (error) {
      console.error("Error updating task:", error);
      const { message, status } = handleControllerError(error);
      return { ok: false, data: null, message, status };
    }
  }

  async delete(userId: string, taskId: number): Promise<ControllerResponse<null>> {
    try {
      const result = await this.taskRepository.delete(userId, taskId);
      if (!result) {
        throw new NotFoundError("Task not found");
      }
      return { ok: true, data: null, message: "Task deleted successfully", status: 200 };
    } catch (error) {
      console.error("Error deleting task:", error);
      const { message, status } = handleControllerError(error);
      return { ok: false, data: null, message, status };
    }
  }

  async reorderTasks(userId: string, data: Partial<Task>[]): Promise<ControllerResponse<null>> {
    try {
      await this.taskRepository.reorderTasks(userId, data);
      return { ok: true, data: null, message: "Tasks reordered successfully", status: 200 };
    } catch (error) {
      console.error("Error reordering tasks:", error);
      const { message, status } = handleControllerError(error);
      return { ok: false, data: null, message, status };
    }
  }

}