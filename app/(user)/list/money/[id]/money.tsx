"use client";
import ProgressBarChart from "@/components/charts/progress-bar-chart";
import {
  Money,
  MoneyActions,
  MoneyAmount,
  MoneyBar,
  MoneyCommentBtn,
  MoneyDeleteBtn,
  MoneyEditBtn,
  MoneyHeader,
  MoneyPaletteBtn,
} from "@/components/money-bar";

import { useGetDailyProgress } from "@/hooks/useGetDailyProgress";
import { useGetDifferences } from "@/hooks/useGetDifferences";
import { useGetMonthlyProgress } from "@/hooks/useGetMonthlyProgress";
import { Log, useChartsState, useLogsStore, useMoneysStore } from "@/store";
import { motion } from "framer-motion";
import Scrollable from "@/components/scrollable";
import HistoryList from "@/components/charts/history-list";

export default function MoneyComponent({ id }: { id: string }) {
  const chartsState = useChartsState();
  const { moneys, totalMoneys } = useMoneysStore();
  const { logs } = useLogsStore();
  const money = moneys.find((m) => m.id === id);
  const moneyLogs: Log[] = logs
    .filter((l) => l.money_id === money?.id)
    .map((l) => ({ ...l, money: l.changes.latest.name }))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const dailyData = useGetDailyProgress(logs ?? []);
  const monthlyData = useGetMonthlyProgress(logs ?? []);
  const differences = useGetDifferences(
    moneyLogs ?? [],
    totalMoneys(moneys),
    chartsState.progressDays
  );
  const chartData = chartsState.type === "daily" ? dailyData : monthlyData;

  return (
    <Scrollable>
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: 20 }}
      >
        {money ? (
          <>
            <Money
              currentTotal={totalMoneys(moneys)}
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
                  <MoneyCommentBtn />
                  <MoneyDeleteBtn />
                </MoneyActions>
              </MoneyBar>
            </Money>
            <ProgressBarChart chartData={chartData} differences={differences} />
            <HistoryList />
          </>
        ) : (
          <p className="text-muted-foreground text-xs mt-4 text-center">
            Money is missing.
          </p>
        )}
      </motion.div>
    </Scrollable>
  );
}
