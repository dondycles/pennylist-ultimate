"use client";

import { HistoryTable } from "@/components/charts/history-table";
import { historyColumns } from "@/components/charts/history-columns";
import ProgressBarChart from "@/components/charts/progress-bar-chart";
import { Separator } from "@/components/ui/separator";
import { useChartsState, useLogsStore, useMoneysStore } from "@/store";
import { motion } from "framer-motion";
import Scrollable from "@/components/scrollable";
import { useGetDifferences } from "@/hooks/useGetDifferences";
import { useGetMonthlyProgress } from "@/hooks/useGetMonthlyProgress";
import { useGetDailyProgress } from "@/hooks/useGetDailyProgress";
export default function Charts() {
  const { logs } = useLogsStore();
  const { moneys, totalMoneys } = useMoneysStore();
  const chartState = useChartsState();
  const moneyLogs = logs
    .map((l) => ({ ...l, money: l.changes.latest.name }))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  const differences = useGetDifferences(
    moneyLogs,
    totalMoneys(moneys),
    chartState.progressDays
  );
  const monthlyData = useGetMonthlyProgress(moneyLogs ?? []);
  const dailyData = useGetDailyProgress(moneyLogs ?? []);
  return (
    <Scrollable>
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: 20 }}
      >
        <ProgressBarChart
          differences={differences}
          chartData={chartState.type === "daily" ? dailyData : monthlyData}
        />
        <Separator />
        <HistoryTable
          defaultSearchBy="money"
          columns={historyColumns}
          data={moneyLogs ?? []}
        />
      </motion.div>
    </Scrollable>
  );
}
