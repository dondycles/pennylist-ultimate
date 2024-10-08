"use client";

import { get_moneys } from "@/app/actions/moneys";
import { MoneyWithLogs } from "@/drizzle/infered-types";
import { useListState } from "@/store";
import { ClerkLoaded, ClerkLoading, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

type ListDataContext = {
  moneys: MoneyWithLogs[] | undefined;
  isLoading: boolean;
  logs: (MoneyWithLogs["money_log"][0] & { name: string })[] | undefined;
};

export const ListDataContext = createContext<ListDataContext>({
  moneys: undefined,
  isLoading: true,
  logs: undefined,
});

export function ListDataProvider({ children }: { children: React.ReactNode }) {
  const listState = useListState();
  const { isLoaded, user, isSignedIn } = useUser();
  const { data: moneys, isLoading } = useQuery({
    queryKey: ["list", user?.id, listState.asc, listState.sortBy],
    enabled: isLoaded && isSignedIn && !!user,
    queryFn: async () =>
      await get_moneys({ asc: listState.asc, by: listState.sortBy }),
  });

  const logs = moneys
    ?.flatMap(({ money_log }) => money_log)
    .map((log) => ({ ...log, name: log.changes.latest.name }));

  return (
    <ListDataContext.Provider
      value={{ moneys, logs, isLoading: !isLoaded || isLoading }}
    >
      {children}
    </ListDataContext.Provider>
  );
}
