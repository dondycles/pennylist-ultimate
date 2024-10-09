"use client";
import { useContext } from "react";
import { ListDataContext } from "@/components/providers/list";
import { HistoryTable } from "@/components/charts/history-table";
import { historyColumns } from "@/components/charts/history-columns";
import ProgressBarChart from "@/components/charts/progress-bar-chart";
import Loader from "@/components//loader";
import { Separator } from "@/components/ui/separator";
import { useChartsState } from "@/store";

export default function Charts() {
  const { isLoading, logs, differences, dailyData, monthlyData } =
    useContext(ListDataContext);
  const chartState = useChartsState();
  if (isLoading) return <Loader />;
  return (
    <>
      <ProgressBarChart
        differences={differences}
        chartData={chartState.type === "daily" ? dailyData : monthlyData}
      />
      <Separator />
      <HistoryTable
        defaultSearchBy="money"
        columns={historyColumns}
        data={logs ?? []}
      />
    </>
  );
}
