"use client";
import { get_money } from "@/app/actions/moneys";
import { historyColumns } from "@/components/charts/history-columns";
import { HistoryTable } from "@/components/charts/history-table";
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

import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export default function MoneyPage({ params }: { params: { id: number } }) {
  const { currentTotal, user } = useContext(ListDataContext);
  const {
    data: money,
    isFetched,
    isLoading: moneyLoading,
  } = useQuery({
    queryKey: [params.id],
    enabled: !!user,
    queryFn: async () => await get_money(params.id),
  });

  const logs = money?.money_log.map((log) => ({
    ...log,
    money: log.changes.latest.name,
  }));

  if (moneyLoading) return <Loader />;
  if (isFetched && !money) return <p>This money does not exist.</p>;
  return (
    <>
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
      <HistoryTable
        defaultSearchBy="reason"
        columns={historyColumns}
        data={logs ?? []}
      />
    </>
  );
}
