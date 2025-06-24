import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { InferSelectModel, sql } from "drizzle-orm";

export const boards = sqliteTable("boards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  is_favorite: integer("is_favorite", { mode: "boolean" }).default(false),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Board = InferSelectModel<typeof boards>

export type newBoard = InferSelectModel<typeof boards>