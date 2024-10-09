"use client";

import { get_logs } from "@/app/actions/logs";
import { get_moneys } from "@/app/actions/moneys";
import { MoneyWithLogs } from "@/drizzle/infered-types";
import { useListState, useChartsState } from "@/store";
import { useUser } from "@clerk/nextjs";
import { useQueries } from "@tanstack/react-query";
import _ from "lodash";
import { createContext } from "react";
import { UserResource } from "@clerk/types";
import { useGetMonthlyProgress } from "@/hooks/useGetMonthlyProgress";
import { useGetDailyProgress } from "@/hooks/useGetDailyProgress";
import { Differences, useGetDifferences } from "@/hooks/useGetDifferences";
import { Progress } from "@/lib/types";
type ListDataContext = {
  moneys: Omit<MoneyWithLogs, "money_log">[] | undefined;
  isLoading: boolean;
  logs: (MoneyWithLogs["money_log"][0] & { money: string })[] | undefined;
  currentTotal: number;
  user: UserResource | null | undefined;
  monthlyData: Progress[] | [];
  dailyData: Progress[] | [];
  differences: Differences;
  yesterdayDiff: Differences;
};

export const ListDataContext = createContext<ListDataContext>({
  moneys: undefined,
  isLoading: true,
  logs: undefined,
  currentTotal: 0,
  user: undefined,
  monthlyData: [],
  dailyData: [],
  differences: {
    isUp: false,
    isZero: false,
    value: "",
  },
  yesterdayDiff: {
    isUp: false,
    isZero: false,
    value: "",
  },
});

export function ListDataProvider({ children }: { children: React.ReactNode }) {
  const listState = useListState();
  const chartsState = useChartsState();
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

  const monthlyData = useGetMonthlyProgress(res[1].data ?? []);
  const dailyData = useGetDailyProgress(res[1].data ?? []);
  const differences = useGetDifferences(
    res[1].data ?? [],
    currentTotal,
    chartsState.progressDays
  );
  const yesterdayDiff = useGetDifferences(res[1].data ?? [], currentTotal, "1");

  return (
    <ListDataContext.Provider
      value={{
        user: user,
        moneys: res[0].data,
        logs: res[1].data,
        isLoading: !userLoaded || res.some((res) => res.isLoading),
        currentTotal,
        monthlyData,
        dailyData,
        differences,
        yesterdayDiff,
      }}
    >
      {children}
    </ListDataContext.Provider>
  );
}
