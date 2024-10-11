"use client";
import { get_money } from "@/app/actions/moneys";
import { historyColumns } from "@/components/charts/history-columns";
import { HistoryTable } from "@/components/charts/history-table";
import ProgressBarChart from "@/components/charts/progress-bar-chart";
import Loader from "@/components/loader";
import {
  Money,
  MoneyActions,
  MoneyAmount,
  MoneyBar,
  MoneyDeleteBtn,
  MoneyEditBtn,
  MoneyHeader,
  MoneyPaletteBtn,
} from "@/components/money-bar";

import { ListDataContext } from "@/components/providers/list";
import { useGetDailyProgress } from "@/hooks/useGetDailyProgress";
import { useGetDifferences } from "@/hooks/useGetDifferences";
import { useGetMonthlyProgress } from "@/hooks/useGetMonthlyProgress";
import { useChartsState } from "@/store";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import Scrollable from "@/components/scrollable";

export default function MoneyPage({ params }: { params: { id: number } }) {
  const { currentTotal, user } = useContext(ListDataContext);
  const chartsState = useChartsState();
  const {
    data: money,
    isFetched,
    isLoading: moneyLoading,
  } = useQuery({
    queryKey: [params.id],
    enabled: !!user,
    queryFn: async () => await get_money(params.id),
  });

  const logs = money?.money_log.map((log) => ({
    ...log,
    money: log.changes.latest.name,
  }));

  const dailyData = useGetDailyProgress(logs ?? []);
  const monthlyData = useGetMonthlyProgress(logs ?? []);
  const differences = useGetDifferences(
    logs ?? [],
    currentTotal,
    chartsState.progressDays
  );
  const chartData = chartsState.type === "daily" ? dailyData : monthlyData;

  if (moneyLoading) return <Loader />;
  if (isFetched && !money)
    return (
      <p className="text-muted-foreground text-xs mt-4 text-center">
        This money does not exist.
      </p>
    );
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
                <MoneyDeleteBtn />
              </MoneyActions>
            </MoneyBar>
          </Money>
        )}
        <ProgressBarChart chartData={chartData} differences={differences} />
        <HistoryTable
          defaultSearchBy="reason"
          columns={historyColumns}
          data={logs ?? []}
        />
      </motion.div>
    </Scrollable>
  );
}
