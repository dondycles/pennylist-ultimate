"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function auth_check() {
  const user = auth();
  if (!user.userId) redirect("https://major-fly-78.accounts.dev/sign-in");
  return user;
}
