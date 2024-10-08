"use client";
import { useContext } from "react";
import { ListDataContext } from "./providers/list";
import { HistoryTable } from "./history-table";
import { historyColumns } from "./history-columns";
import TotalMoney from "./total-money";
import DailyProgress from "./daily-progress";
import Loader from "./loader";

export default function Charts() {
  const { isLoading, logs, currentTotal } = useContext(ListDataContext);
  if (isLoading) return <Loader />;
  return (
    <div className="flex-1 flex flex-col overflow-auto ">
      <TotalMoney total={currentTotal} />
      <div className="flex-1 flex flex-col overflow-auto max-w-[800px] w-screen mx-auto gap-4">
        <DailyProgress />
        <HistoryTable columns={historyColumns} data={logs ?? []} />
      </div>
    </div>
  );
}
