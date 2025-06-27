import { LibSQLDatabase } from "drizzle-orm/libsql";
import { columns, NewColumn } from "../models/columns";
import { and, eq } from "drizzle-orm";
import { boards } from "../models/boards";

export class ColumnRepository {
  constructor(private db: LibSQLDatabase) { }

  async getAll(userId: string, boardId: number) {
    const board = await this.db.select()
      .from(boards)
      .where(and(eq(boards.id, boardId), eq(boards.user_id, userId)))
      .limit(1);

    if (!board.length) {
      throw new Error("No permission to view columns on this board");
    }

    const result = await this.db.select().from(columns).where(eq(columns.board_id, boardId)).orderBy(columns.position);
    return result;
  }

  async create(userId: string, column: NewColumn) {
    const board = await this.db.select()
      .from(boards)
      .where(and(eq(boards.id, column.board_id), eq(boards.user_id, userId)))
      .limit(1);

    if (!board.length) {
      throw new Error("No permission to create a column on this board");
    }

    const result = await this.db.insert(columns).values(column).returning()
    return result[0];
  }

  async updateField(userId: string, columnId: number, data: Partial<NewColumn>) {
    if (!data.board_id) return

    const board = await this.db.select()
      .from(boards)
      .where(and(eq(boards.id, data.board_id), eq(boards.user_id, userId)))
      .limit(1);

    if (!board.length) {
      throw new Error("No permission to update a column on this board");
    }

    const result = await this.db.update(columns)
      .set(data)
      .where(eq(columns.id, columnId))
      .returning();
    return result[0];
  }

  async delete(userId: string, columnId: number) {

    const columnWithBoard = await this.db.select()
      .from(columns)
      .innerJoin(boards, eq(columns.board_id, boards.id))
      .where(and(eq(columns.id, columnId), eq(boards.user_id, userId)))
      .limit(1);

    if (!columnWithBoard.length) {
      throw new Error("No permission to delete this column");
    }

    const result = await this.db.delete(columns)
      .where(eq(columns.id, columnId))
      .returning();

    return result[0];
  }

}