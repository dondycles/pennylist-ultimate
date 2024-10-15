"use client";

import { useLogsStore, useMoneysStore } from "@/store";
import { useRouter } from "next/navigation";

export default function Redirect() {
  const { logs } = useLogsStore();
  const { moneys } = useMoneysStore();
  const route = useRouter();
  if (logs.length || moneys.length) route.push("/list");
  return <></>;
}
