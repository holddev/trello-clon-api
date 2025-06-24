import { LibSQLDatabase } from "drizzle-orm/libsql";
import { boards, newBoard } from "../models/boards";
import { and, eq, sql } from "drizzle-orm";
import { columns } from "../models/columns";
import { tags } from "../models/tags";
import { tasks } from "../models/tasks";

export class BoardRepository {
  constructor(private db: LibSQLDatabase) { }

  async create(data: newBoard) {
    const result = await this.db.insert(boards).values(data).returning();
    return result[0];
  }

  async findAll(userId: string) {
    const result = await this.db.select({
      id: boards.id,
      user_id: boards.user_id,
      title: boards.title,
      is_favorite: boards.is_favorite,
      created_at: boards.created_at,
      cols: sql<number>`(
          SELECT COALESCE(COUNT(*),0)
          FROM columns
          WHERE columns.board_id = boards.id
        )` ?? 0,
    }).from(boards).where(eq(boards.user_id, userId));
    return result;
  }

  async updateField(userId: string, id: number, data: Partial<newBoard>) {
    const result = await this.db.update(boards)
      .set(data)
      .where(and(eq(boards.id, id), eq(boards.user_id, userId)))
      .returning();
    return result[0];
  }

  async findByIdWithColumnsAndTasks(userId: string, id: number) {
    const board = await this.db.select().from(boards).where((and(eq(boards.id, id), eq(boards.user_id, userId))));
    const boardData = board[0];
    if (!boardData) return null;

    const cols = await this.db.select().from(columns).where(eq(columns.board_id, id));

    const resultCols = await Promise.all(
      cols.map(async (col) => {
        const resultTasks = await this.db.select().from(tasks).where(eq(tags.task_id, col.id));

        const tasksWithTags = await Promise.all(
          resultTasks.map(async (task) => {
            const tagsResult = await this.db.select().from(tags).where(eq(tags.task_id, task.id));
            return {
              ...task,
              tags: tagsResult
            };
          })
        )
        return {
          ...col,
          tasks: tasksWithTags
        };
      })
    )

    return ({
      ...boardData,
      columns: resultCols
    })

  }

  async delete(userId: string, id: number) {
    const result = await this.db.delete(boards)
      .where(and(eq(boards.id, id), eq(boards.user_id, userId)))
      .returning();
    return result[0];
  }

}