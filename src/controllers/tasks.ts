import { newTask, Task } from "../models/tasks";
import { TaskRepository } from "../repositories/tasks";
import { ControllerResponse } from "../types/types";

export class TaskController {
  constructor(private taskRepository: TaskRepository) { }

  async create(userId: string, data: newTask): Promise<ControllerResponse<Task>> {
    try {
      const result = await this.taskRepository.create(userId, data);
      return { ok: true, data: result, status: 201 };
    } catch (error) {
      console.error("Error creating task:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
    }
  }

  async update(userId: string, taskId: number, data: Partial<Task>): Promise<ControllerResponse<Task>> {
    try {
      const result = await this.taskRepository.update(userId, taskId, data);
      return { ok: true, data: result, status: 200 };
    } catch (error) {
      console.error("Error updating task:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
    }
  }

  async delete(userId: string, taskId: number): Promise<ControllerResponse<null>> {
    try {
      await this.taskRepository.delete(userId, taskId);
      return { ok: true, data: null, message: "Task deleted successfully", status: 200 };
    } catch (error) {
      console.error("Error deleting task:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
    }
  }

  async reorderTasks(userId: string, data: Partial<Task>[]): Promise<ControllerResponse<null>> {
    try {
      await this.taskRepository.reorderTasks(userId, data);
      return { ok: true, data: null, message: "Tasks reordered successfully", status: 200 };
    } catch (error) {
      console.error("Error reordering tasks:", error);
      return { ok: false, data: null, message: "Internal Server Error", status: 500 };
    }
  }

}