import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { columns } from "./columns";


export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  column_id: integer("column_id")
    .notNull()
    .references(() => columns.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").notNull(),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const tags = sqliteTable("task_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  task_id: integer("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  color: text("color").notNull()
});


export type Task = {
  id: number;
  column_id: number;
  title: string;
  description: string | null;
  position: number;
  created_at: string | null;
  tags: {
    id: number;
    task_id: number;
    text: string;
    color: string;
  }[];
}

export type newTask = {
  column_id: number;
  title: string;
  description: string;
  position: number;
  tags: {
    task_id: number;
    text: string;
    color: string;
  }[];
}