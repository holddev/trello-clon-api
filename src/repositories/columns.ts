import { LibSQLDatabase } from "drizzle-orm/libsql";
import { columns, NewColumn } from "../models/columns";
import { and, eq } from "drizzle-orm";
import { boards } from "../models/boards";

export class ColumnRepository {
  constructor(private db: LibSQLDatabase) { }

  private async authorizeBoardAccess(userId: string, boardId: number) {
    const board = await this.db.select()
      .from(boards)
      .where(and(eq(boards.id, boardId), eq(boards.user_id, userId)))
      .limit(1);

    if (!board.length) {
      throw new Error("Unauthorized: You do not have access to this board.");
    }
  }

  private async authorizeColumnAccess(userId: string, columnId: number) {
    const result = await this.db.select()
      .from(columns)
      .innerJoin(boards, eq(columns.board_id, boards.id))
      .where(and(eq(columns.id, columnId), eq(boards.user_id, userId)))
      .limit(1);

    if (!result.length) {
      throw new Error("Unauthorized: You do not have access to this column.");
    }
  }

  async getAll(userId: string, boardId: number) {
    await this.authorizeBoardAccess(userId, boardId);

    const result = await this.db.select().from(columns).where(eq(columns.board_id, boardId)).orderBy(columns.position);
    return result;
  }

  async create(userId: string, column: NewColumn) {
    await this.authorizeBoardAccess(userId, column.board_id);

    const result = await this.db.insert(columns).values(column).returning()
    return result[0];
  }

  async updateField(userId: string, columnId: number, data: Partial<NewColumn>) {
    await this.authorizeColumnAccess(userId, columnId);

    const result = await this.db.update(columns)
      .set(data)
      .where(eq(columns.id, columnId))
      .returning();
    return result[0];
  }

  async delete(userId: string, columnId: number) {
    await this.authorizeColumnAccess(userId, columnId);

    const result = await this.db.delete(columns)
      .where(eq(columns.id, columnId))
      .returning();
    return result[0];
  }

}