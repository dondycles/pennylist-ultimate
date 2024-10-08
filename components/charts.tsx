"use client";
import { Skeleton } from "./ui/skeleton";
import { useContext } from "react";
import { ListDataContext } from "./providers/list";
import { HistoryTable } from "./history-table";
import { historyColumns } from "./history-columns";
import TotalMoney from "./total-money";
import DailyProgress from "./daily-progress";

export default function Charts() {
  const { isLoading, logs, currentTotal } = useContext(ListDataContext);
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
    <div className="flex-1 flex flex-col overflow-auto ">
      <TotalMoney total={currentTotal} />
      <div className="flex-1 flex flex-col overflow-auto max-w-[800px] w-screen mx-auto gap-4">
        <br />
        <DailyProgress />
        <HistoryTable columns={historyColumns} data={logs ?? []} />
      </div>
    </div>
  );
}
