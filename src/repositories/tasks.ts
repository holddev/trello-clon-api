import { LibSQLDatabase } from "drizzle-orm/libsql";
import { newTask, tags, Task, tasks } from "../models/tasks";
import { and, eq } from "drizzle-orm";
import { columns } from "../models/columns";
import { boards } from "../models/boards";

export class TaskRepository {
  constructor(private db: LibSQLDatabase) { }

  private async columnBelongsToUser(columnId: number, userId: string) {
    const res = await this.db
      .select({ id: columns.id })
      .from(columns)
      .innerJoin(boards, eq(columns.board_id, boards.id))
      .where(and(eq(columns.id, columnId), eq(boards.user_id, userId)));
    return res.length > 0;
  }

  private async taskBelongsToUser(taskId: number, userId: string) {
    const res = await this.db
      .select({ id: tasks.id })
      .from(tasks)
      .innerJoin(columns, eq(tasks.column_id, columns.id))
      .innerJoin(boards, eq(columns.board_id, boards.id))
      .where(and(eq(tasks.id, taskId), eq(boards.user_id, userId)));
    return res.length > 0;
  }


  async create(userId: string, data: newTask) {
    if (!(await this.columnBelongsToUser(data.column_id, userId))) {
      throw new Error("Unauthorized: column does not belong to user");
    }

    const insertedTasks = await this.db
      .insert(tasks)
      .values({
        column_id: data.column_id,
        title: data.title,
        description: data.description,
        position: data.position,
      })
      .returning();

    const taskId = insertedTasks[0].id;

    if (!taskId) {
      throw new Error("Failed to create task");
    }

    const insertedTags = data.tags && data.tags.length > 0
      ? await this.db.insert(tags).values(
        data.tags.map((tag) => ({
          task_id: taskId,
          text: tag.text,
          color: tag.color,
        }))
      ).returning()
      : [];


    return ({
      ...insertedTasks[0],
      tags: insertedTags
    })
  }

  async update(userId: string, taskId: number, data: Partial<Task>) {

    if (!(await this.taskBelongsToUser(taskId, userId))) {
      throw new Error("Unauthorized: task does not belong to user");
    }

    const { tags: tagsEdit, ...taskFields } = data;

    const updatedTask = await this.db
      .update(tasks)
      .set(taskFields)
      .where(eq(tasks.id, taskId))
      .returning();

    if (updatedTask.length === 0) {
      throw new Error("Task not found or update failed");
    }

    if (tagsEdit && tagsEdit.length > 0) {
      await Promise.all(
        tagsEdit.map(async (tag) => {
          const { id, ...partialTag } = tag;

          await this.db
            .update(tags)
            .set(partialTag)
            .where(eq(tags.id, id));
        })
      );
    }

    return ({
      ...updatedTask[0],
      tags: tagsEdit || []
    })

  }

  async delete(userId: string, taskId: number) {

    if (!(await this.taskBelongsToUser(taskId, userId))) {
      throw new Error("Unauthorized: task does not belong to user");
    }

    const result = await this.db.delete(tasks).where(eq(tasks.id, taskId)).returning();
    return result[0];
  }

}