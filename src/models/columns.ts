import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { boards } from "./boards";


export const columns = sqliteTable("columns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  board_id: integer("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  position: integer("position").notNull(),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Column = InferSelectModel<typeof columns>;
export type NewColumn = InferInsertModel<typeof columns>;