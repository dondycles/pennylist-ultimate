"use client";
import { Skeleton } from "./ui/skeleton";
import _ from "lodash";
import { useContext } from "react";
import { ListDataContext } from "./providers/list";
import { HistoryTable } from "./history-table";
import { historyColumns } from "./history-columns";
import TotalMoney from "./total-money";

export default function Charts() {
  const { isLoading, moneys, logs } = useContext(ListDataContext);
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
      <TotalMoney total={_.sum(moneys?.map((money) => money.amount) ?? [0])} />
      <div className="flex-1 flex flex-col overflow-auto max-w-[800px] w-screen mx-auto">
        <HistoryTable columns={historyColumns} data={logs ?? []} />
      </div>
    </div>
  );
}
