import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import type { EmailBlock } from "@/types/email";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
};

export const templates = sqliteTable("templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  blocks: text("blocks", { mode: "json" }).$type<EmailBlock[]>().notNull(),
  ...timestamps,
});

export const insertSchema = createInsertSchema(templates).extend({
  name: z.string().min(1, "Name required"),
  blocks: z.array(z.any()).min(1, "At least one block required"),
});

// Update schema without id (id comes from URL params)
export const updateSchema = insertSchema.omit({ id: true });

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
