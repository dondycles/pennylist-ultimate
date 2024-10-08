"use client";
import { get_money } from "@/app/actions/moneys";
import { historyColumns } from "@/components/history-columns";
import { HistoryTable } from "@/components/history-table";
import {
  Money,
  MoneyActions,
  MoneyAmount,
  MoneyBar,
  MoneyDeleteBtn,
  MoneyEditBtn,
  MoneyHeader,
  MoneyPaletteBtn,
} from "@/components/money-bar";
import Nav, {
  NavBackBtn,
  NavBar,
  NavHideOption,
  NavOptions,
  NavThemeOptions,
  NavUserOption,
} from "@/components/nav";
import { ListDataContext } from "@/components/providers/list";
import { Skeleton } from "@/components/ui/skeleton";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import _ from "lodash";
export default function MoneyPage({ params }: { params: { id: number } }) {
  const { isLoaded, user, isSignedIn } = useUser();
  const { moneys } = useContext(ListDataContext);
  const { data: money, isLoading } = useQuery({
    queryKey: [params.id],
    enabled: isLoaded && isSignedIn && !!user,
    queryFn: async () => await get_money(params.id),
    staleTime: Infinity,
  });

  const logs = money?.money_log.map((log) => ({
    ...log,
    name: log.changes.latest.name,
  }));

  if (isLoading)
    return (
      <div className="flex flex-col gap-[1px] h-full">
        <Skeleton className="h-[136px] w-full" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
      </div>
    );
  return (
    <div className="w-full h-full max-w-[800px] mx-auto flex flex-col justify-start">
      <div className="flex-1 flex flex-col overflow-auto">
        {money && (
          <Money
            currentTotal={_.sum(moneys?.map((m) => m.amount))}
            specific={true}
            money={money}
            key={money.id}
          >
            <MoneyBar>
              <MoneyHeader />
              <MoneyAmount />
              <MoneyActions>
                <MoneyPaletteBtn />
                <MoneyEditBtn />
                <MoneyDeleteBtn />
              </MoneyActions>
            </MoneyBar>
          </Money>
        )}
        <HistoryTable columns={historyColumns} data={logs ?? []} />
      </div>
      <Nav>
        <NavBar>
          <NavBackBtn />
          <NavOptions>
            <NavHideOption />
            <NavThemeOptions />
            <NavUserOption />
          </NavOptions>
        </NavBar>
      </Nav>
    </div>
  );
}
