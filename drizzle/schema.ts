import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  timestamp,
  text,
  real,
  jsonb,
} from "drizzle-orm/pg-core";

export const moneysTable = pgTable("moneys_table", {
  id: serial("id").primaryKey().notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  amount: real("amount").notNull(),
  lister: text("lister").notNull(),
  color: text("color"),
  last_update: timestamp("last_update", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const moneysNotesTable = pgTable("moneys_notes_table", {
  id: serial("id").primaryKey().notNull(),
  money_id: serial("money_id")
    .notNull()
    .references(() => moneysTable.id, { onDelete: "cascade" }),
  note: text("note").notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
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
      total: number;
    };
    latest: {
      amount: number;
      name: string;
      total: number;
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
  money_note: many(moneysNotesTable, { relationName: "money_note" }),
}));

export const moneysNotesRelations = relations(moneysNotesTable, ({ one }) => ({
  money_note: one(moneysTable, {
    fields: [moneysNotesTable.money_id],
    references: [moneysTable.id],
    relationName: "money_note",
  }),
}));

export type selectMoney = typeof moneysTable.$inferSelect;
export type selectMoneyNote = typeof moneysNotesTable.$inferSelect;
export type insertLog = typeof logsTable.$inferSelect;
export type insertMoney = typeof moneysTable.$inferInsert;
export type insetMoneyNote = typeof moneysNotesTable.$inferInsert;
