"use server";
import { db } from "@/drizzle/db";
import {
  addMoneySchema,
  logsTable,
  moneysTable,
  selectMoney,
} from "@/drizzle/schema";

import { and, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import auth_check from "./auth-check";

export const get_moneys = async (orderBy: {
  asc: boolean;
  by: "created_at" | "amount" | "name";
}) => {
  const user = await auth_check();
  const sortField = moneysTable[orderBy.by] || moneysTable.amount;
  const moneys = await db.query.moneysTable.findMany({
    with: {
      money_log: true,
    },
    where: eq(moneysTable.lister, user.userId!),
    orderBy: [orderBy.asc ? asc(sortField) : desc(sortField)],
  });
  return moneys;
};

export const add_money = async (money: z.infer<typeof addMoneySchema>) => {
  const user = await auth_check();
  const [m] = await db.insert(moneysTable).values(money).returning();
  await db.insert(logsTable).values({
    changes: {
      latest: {
        amount: m.amount,
        name: m.name,
      },
      prev: {
        amount: m.amount,
        name: m.name,
      },
    },
    action: "add",
    reason: "add",
    money_id: m.id,
    lister: user.userId!,
  });
};

export const edit_money = async (
  money: {
    prev: z.infer<typeof addMoneySchema>;
    latest: z.infer<typeof addMoneySchema>;
  },
  reason: string
) => {
  const user = await auth_check();
  if (!money.latest.id || !money.prev.id)
    throw new Error("Money's ID is missing!");
  if (money.latest.id !== money.prev.id) throw new Error("IDs did not match!");
  await db
    .update(moneysTable)
    .set({ ...money.latest, last_update: sql`NOW()` })
    .where(
      and(
        eq(moneysTable.id, money.prev.id),
        eq(moneysTable.lister, user.userId!)
      )
    );

  await db.insert(logsTable).values({
    changes: {
      latest: { ...money.latest },
      prev: { ...money.prev },
    },
    action: "edit",
    reason: reason,
    money_id: money.prev.id,
    lister: user.userId!,
  });
};

export const delete_money = async (money: selectMoney) => {
  const user = await auth_check();
  await db
    .delete(moneysTable)
    .where(
      and(eq(moneysTable.id, money.id), eq(moneysTable.lister, user.userId!))
    );
  await db.insert(logsTable).values({
    changes: {
      latest: {
        amount: 0,
        name: money.name,
      },
      prev: {
        amount: money.amount,
        name: money.name,
      },
    },
    action: "delete",
    reason: "delete",
    money_id: money.id,
    lister: user.userId!,
  });
};

export const colorize_money = async (money: selectMoney, color: string) => {
  const user = await auth_check();
  await db
    .update(moneysTable)
    .set({ color, last_update: sql`NOW()` })
    .where(
      and(eq(moneysTable.id, money.id), eq(moneysTable.lister, user.userId))
    );
};
