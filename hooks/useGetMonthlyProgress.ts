import { MoneyWithLogs } from "@/drizzle/infered-types";
import { useGetDailyProgress } from "./useGetDailyProgress";
import _ from "lodash";
type Progress = {
  expenses: { amount: number; reason: string; date: string }[];
  gains: { amount: number; reason: string; date: string }[];
  date: string;
  expensesSum: number;
  gainsSum: number;
  gainOrLoss: number;
  currentTotal: number;
};

export const useGetMonthlyProgress = (
  logs: MoneyWithLogs["money_log"] | null
) => {
  const dailyProgress = useGetDailyProgress(logs);
  const year = new Date().getFullYear();
  const groupedByMonth: Progress[] = [];

  // starts at +1 of the current month of last year
  let month = new Date().getMonth() + 1;
  for (let i = 0; i < 12; i++) {
    // if its the last month back to first month of the current year
    if (month === 12) month = 0;
    // get the last data of the month
    let monthProgress: Progress[] | undefined;

    // if the current iteration of month is more than the current month, sets it back last year
    if (month <= new Date().getMonth()) {
      monthProgress = dailyProgress?.filter(
        (day) =>
          // gets data equal to month and year or last year at least
          new Date(day.date).getMonth() === month &&
          new Date(day.date).getFullYear() === year
      );
    } else {
      monthProgress = dailyProgress?.filter(
        (day) =>
          // gets data equal to month and year or last year at least
          new Date(day.date).getMonth() === month &&
          new Date(day.date).getFullYear() === year - 1
      );
    }

    const monthDate = monthProgress.findLast((m) => m)?.date;
    const expenses = monthProgress.flatMap((m) => m.expenses);
    const gains = monthProgress.flatMap((m) => m.gains);
    const expensesSum = _.sum(expenses.map((e) => e.amount));
    const gainsSum = _.sum(gains.map((g) => g.amount));
    const gainOrLoss = _.add(gainsSum, expensesSum);
    const lastTotal = monthProgress
      .map((m) => m.currentTotal)
      .findLast((m) => m);

    groupedByMonth[i] = {
      currentTotal: lastTotal!,
      date: monthDate!,
      expenses,
      expensesSum,
      gainOrLoss,
      gains,
      gainsSum,
    };

    month += 1;
  }

  return groupedByMonth;
};
