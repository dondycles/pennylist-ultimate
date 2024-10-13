"use client";
import { historyColumns } from "@/components/charts/history-columns";
import { HistoryTable } from "@/components/charts/history-table";
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
import _ from "lodash";

export default function MoneyPage({ params }: { params: { id: string } }) {
  const chartsState = useChartsState();
  const { moneys } = useMoneysStore();
  const { logs } = useLogsStore();
  const currentTotal = _.sum(moneys.map((m) => m.amount));
  const money = moneys.find((m) => m.id === params.id);
  const moneyLogs: Array<Log & { money: string }> = logs
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
    currentTotal,
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
        {money && (
          <Money
            currentTotal={currentTotal}
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
        )}
        <ProgressBarChart chartData={chartData} differences={differences} />
        <HistoryTable
          defaultSearchBy="reason"
          columns={historyColumns}
          data={moneyLogs ?? []}
        />
      </motion.div>
    </Scrollable>
  );
}
