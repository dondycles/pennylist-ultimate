"use server";
import { db } from "@/drizzle/db";
import { moneysNotesTable } from "@/drizzle/schema";

import auth_check from "./auth-check";
import { and, eq } from "drizzle-orm";

export const add_money_note = async (note: string, money_id: number) => {
  const user = await auth_check();
  await db
    .insert(moneysNotesTable)
    .values({ note, lister: user.userId, money_id });
};

export const delete_money_note = async (id: number) => {
  const user = await auth_check();
  await db
    .delete(moneysNotesTable)
    .where(
      and(eq(moneysNotesTable.id, id), eq(moneysNotesTable.lister, user.userId))
    );
};
