"use client";

import { get_logs } from "@/app/actions/logs";
import { get_moneys } from "@/app/actions/moneys";
import { MoneyWithLogs } from "@/drizzle/infered-types";
import { useListState } from "@/store";
import { useUser } from "@clerk/nextjs";
import { useQueries } from "@tanstack/react-query";
import _ from "lodash";
import { createContext } from "react";

type ListDataContext = {
  moneys: Omit<MoneyWithLogs, "money_log">[] | undefined;
  isLoading: boolean;
  logs: (MoneyWithLogs["money_log"][0] & { money: string })[] | undefined;
  currentTotal: number;
};

export const ListDataContext = createContext<ListDataContext>({
  moneys: undefined,
  isLoading: true,
  logs: undefined,
  currentTotal: 0,
});

export function ListDataProvider({ children }: { children: React.ReactNode }) {
  const listState = useListState();
  const { isLoaded: userLoaded, user, isSignedIn } = useUser();

  const res = useQueries({
    queries: [
      {
        queryKey: ["list", user?.id, listState.asc, listState.sortBy],
        enabled: userLoaded && isSignedIn && !!user,
        queryFn: async () =>
          await get_moneys({ asc: listState.asc, by: listState.sortBy }),
      },
      {
        queryKey: ["logs", user?.id],
        enabled: userLoaded && isSignedIn && !!user,
        queryFn: async () => await get_logs(),
      },
    ],
  });

  const currentTotal = _.sum(res[0].data?.map((m) => m.amount));

  return (
    <ListDataContext.Provider
      value={{
        moneys: res[0].data,
        logs: res[1].data,
        isLoading: !userLoaded || res.some((res) => res.isLoading),
        currentTotal,
      }}
    >
      {children}
    </ListDataContext.Provider>
  );
}
