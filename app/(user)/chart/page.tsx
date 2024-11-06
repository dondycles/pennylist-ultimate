"use client";
import ProgressBarChart from "@/components/charts/progress-bar-chart";
import { useChartsState, useLogsStore, useMoneysStore } from "@/store";
import { motion } from "framer-motion";
import Scrollable from "@/components/scrollable";
import { useGetDifferences } from "@/hooks/useGetDifferences";
import { useGetMonthlyProgress } from "@/hooks/useGetMonthlyProgress";
import { useGetDailyProgress } from "@/hooks/useGetDailyProgress";
import { MoneysPieChart } from "@/components/charts/moneys-pie-chart";
import { MovementLineGraph } from "@/components/charts/movement-line-graph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HistoryList from "@/components/charts/history-list";
export default function Charts() {
  const { logs } = useLogsStore();
  const { moneys, totalMoneys } = useMoneysStore();
  const chartState = useChartsState();
  const moneyLogs = logs
    .map((l) => ({
      ...l,
      money: l.changes.latest.name,
      movement: l.changes.latest.amount - l.changes.prev.amount,
    }))
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
      {moneys.length || logs.length ? (
        <motion.div
          initial={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: 20 }}
        >
          <Tabs defaultValue={chartState.page}>
            <div className="p-4 pb-0">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger
                  onClick={() => {
                    chartState.setPage("movement");
                  }}
                  value="movement"
                >
                  <p className="truncate">Movement</p>
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    chartState.setPage("dailyprogress");
                  }}
                  value="dailyprogress"
                >
                  <p className="truncate">Daily Progress</p>
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    chartState.setPage("breakdown");
                  }}
                  value="breakdown"
                >
                  <p className="truncate">Breakdown</p>
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    chartState.setPage("history");
                  }}
                  value="history"
                >
                  <p className="truncate">History</p>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="movement">
              <MovementLineGraph
                logs={moneyLogs.filter((l) => l.action !== "transfer")}
              />
            </TabsContent>
            <TabsContent value="dailyprogress">
              <ProgressBarChart
                differences={differences}
                chartData={
                  chartState.type === "daily" ? dailyData : monthlyData
                }
              />
            </TabsContent>
            <TabsContent value="breakdown">
              <MoneysPieChart moneys={moneys} />
            </TabsContent>
            <TabsContent value="history">
              <HistoryList />
            </TabsContent>
          </Tabs>
        </motion.div>
      ) : (
        <p className="text-muted-foreground text-xs mt-4 text-center">
          No data yet. Start listing moneys now.
        </p>
      )}
    </Scrollable>
  );
}
