"use server";
import { db } from "@/drizzle/db";
import {
  logsTable,
  moneysTable,
  selectMoney,
  insertMoney,
  moneysNotesTable,
} from "@/drizzle/schema";

import { and, asc, desc, eq, sql } from "drizzle-orm";
import auth_check from "./auth-check";

export const get_moneys = async (orderBy: {
  asc: boolean;
  by: "created_at" | "amount" | "name";
}) => {
  const user = await auth_check();
  const sortField = moneysTable[orderBy.by] || moneysTable.amount;
  const moneys = await db.query.moneysTable.findMany({
    where: eq(moneysTable.lister, user.userId!),
    orderBy: [orderBy.asc ? asc(sortField) : desc(sortField)],
    with: {
      money_note: {
        orderBy: [desc(moneysNotesTable.created_at)],
      },
    },
  });
  return moneys;
};

export const get_money = async (id: number) => {
  const user = await auth_check();
  const moneys = await db.query.moneysTable.findFirst({
    with: {
      money_log: true,
      money_note: {
        orderBy: [desc(moneysNotesTable.created_at)],
      },
    },
    where: and(eq(moneysTable.lister, user.userId!), eq(moneysTable.id, id)),
  });
  return moneys;
};

export const add_money = async (money: insertMoney, currentTotal: number) => {
  const user = await auth_check();
  const [m] = await db.insert(moneysTable).values(money).returning();
  await db.insert(logsTable).values({
    changes: {
      latest: {
        amount: m.amount,
        name: m.name,
        total: currentTotal + m.amount,
      },
      prev: {
        amount: 0,
        name: "",
        total: currentTotal,
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
    prev: insertMoney;
    latest: insertMoney;
  },
  reason: string,
  currentTotal: number
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
      latest: {
        ...money.latest,
        total: currentTotal + (money.latest.amount - money.prev.amount),
      },
      prev: { ...money.prev, total: currentTotal },
    },
    action: "edit",
    reason: reason,
    money_id: money.prev.id,
    lister: user.userId!,
  });
};

export const transfer_money = async (
  money: {
    prev: insertMoney;
    latest: insertMoney;
  },
  reason: string,
  currentTotal: number
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
      latest: {
        ...money.latest,
        total: currentTotal,
      },
      prev: { ...money.prev, total: currentTotal },
    },
    action: "transfer",
    reason: reason,
    money_id: money.prev.id,
    lister: user.userId!,
  });

  console.log("transferred");
};

export const delete_money = async (
  money: selectMoney,
  currentTotal: number
) => {
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
        total: currentTotal - money.amount,
      },
      prev: {
        amount: money.amount,
        name: money.name,
        total: currentTotal,
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
