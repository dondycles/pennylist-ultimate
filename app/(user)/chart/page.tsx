"use client";
import { useContext } from "react";
import { ListDataContext } from "@/components/providers/list";
import { HistoryTable } from "@/components/charts/history-table";
import { historyColumns } from "@/components/charts/history-columns";
import ProgressBarChart from "@/components/charts/progress-bar-chart";
import Loader from "@/components//loader";
import { Separator } from "@/components/ui/separator";
import { useChartsState } from "@/store";
import { motion } from "framer-motion";
import Scrollable from "@/components/scrollable";
export default function Charts() {
  const { isLoading, logs, differences, dailyData, monthlyData } =
    useContext(ListDataContext);
  const chartState = useChartsState();
  if (isLoading) return <Loader />;
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
          data={logs ?? []}
        />
      </motion.div>
    </Scrollable>
  );
}
