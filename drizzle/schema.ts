import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  timestamp,
  text,
  real,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const moneysTable = pgTable("moneys_table", {
  id: serial("id").primaryKey().notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  amount: real("amount").notNull(),
  lister: text("lister").notNull(),
});

export const logsTable = pgTable("logs_table", {
  id: serial("id").primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  lister: text("lister").notNull(),
  action: text("action")
    .notNull()
    .$type<"add" | "delete" | "edit" | "transfer">(),
  reason: text("reason").notNull(),
  changes: jsonb("changes").notNull().$type<{
    prev: {
      amount: number;
      name: string;
    };
    latest: {
      amount: number;
      name: string;
    };
  }>(),
  money_id: serial("money_id"),
});

export const logsTableRelations = relations(logsTable, ({ one }) => ({
  money_log: one(moneysTable, {
    fields: [logsTable.money_id],
    references: [moneysTable.id],
    relationName: "money_log",
  }),
}));

export const moneysTableRelations = relations(moneysTable, ({ many }) => ({
  money_log: many(logsTable, { relationName: "money_log" }),
}));

export const addMoneySchema = createInsertSchema(moneysTable);

export type selectMoney = typeof moneysTable.$inferSelect;
export type insertLog = typeof logsTable.$inferSelect;
