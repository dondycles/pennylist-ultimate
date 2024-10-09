"use client";
import { useContext } from "react";
import { ListDataContext } from "@/components/providers/list";
import { HistoryTable } from "@/components/charts/history-table";
import { historyColumns } from "@/components/charts/history-columns";
import TotalMoney from "@/components//total-money";
import DailyProgress from "@/components/charts/daily-progress";
import Loader from "@/components//loader";
import { Separator } from "@/components/ui/separator";

export default function Charts() {
  const { isLoading, logs } = useContext(ListDataContext);
  if (isLoading) return <Loader />;
  return (
    <>
      <DailyProgress />
      <Separator />
      <HistoryTable
        defaultSearchBy="money"
        columns={historyColumns}
        data={logs ?? []}
      />
    </>
  );
}
