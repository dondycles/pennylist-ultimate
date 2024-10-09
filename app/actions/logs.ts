"use server";
import { db } from "@/drizzle/db";
import { logsTable } from "@/drizzle/schema";

import { desc, eq } from "drizzle-orm";
import auth_check from "./auth-check";

export const get_logs = async () => {
  const user = await auth_check();
  const logs = await db.query.logsTable.findMany({
    where: eq(logsTable.lister, user.userId!),
    orderBy: desc(logsTable.createdAt),
  });
  return logs.map((log) => ({ ...log, money: log.changes.latest.name }));
};
