"use client";
import { useContext } from "react";
import { ListDataContext } from "@/components/providers/list";
import { HistoryTable } from "@/components/charts/history-table";
import { historyColumns } from "@/components/charts/history-columns";
import TotalMoney from "@/components//total-money";
import DailyProgress from "@/components/charts/daily-progress";
import Loader from "@/components//loader";

export default function Charts() {
  const { isLoading, logs, currentTotal } = useContext(ListDataContext);
  if (isLoading) return <Loader />;
  return (
    <>
      <TotalMoney total={currentTotal} />
      <DailyProgress />
      <HistoryTable
        defaultSearchBy="money"
        columns={historyColumns}
        data={logs ?? []}
      />
    </>
  );
}
