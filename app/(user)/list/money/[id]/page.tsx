"use client";
import { get_money } from "@/app/actions/moneys";
import { historyColumns } from "@/components/history-columns";
import { HistoryTable } from "@/components/history-table";
import Loader from "@/components/loader";
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

import { ListDataContext } from "@/components/providers/list";
import Scrollable from "@/components/scrollable";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export default function MoneyPage({ params }: { params: { id: number } }) {
  const { isLoaded, user, isSignedIn } = useUser();
  const { currentTotal } = useContext(ListDataContext);
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

  if (isLoading) return <Loader />;
  return (
    <Scrollable>
      {money && (
        <Money
          currentTotal={currentTotal}
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
    </Scrollable>
  );
}
