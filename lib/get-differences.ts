import { MoneyWithLogs } from "@/drizzle/infered-types";
import { getDailyProgress } from "./get-daily-progress";
import _ from "lodash";
export const getDifferences = (
  logs: MoneyWithLogs["money_log"] | null,
  currentTotal: number,
  days: "1" | "7" | "14" | "28" | "365"
) => {
  // Reverse the dailyTotal array once

  const numberedDays = Number(days);

  const reversedDailyTotal = getDailyProgress(logs).toReversed();

  // Helper function to calculate the sum of totals over a given range
  const calculateSum = (start: number, end: number) => {
    return _.sum(
      getDailyProgress(logs)
        .toReversed()
        .splice(start, end)
        .map((d) => d.currentTotal)
    );
  };

  // Calculate sums for each week range

  const sumCurrentSpan = calculateSum(0, numberedDays);

  const sumPastSpan = calculateSum(numberedDays, numberedDays);
  // Calculate percentage differences
  const calculatePercentageDifference = (current: number, past: number) => {
    return ((current - past) / current) * 100;
  };

  if (days === "1") {
    const yesterday = calculatePercentageDifference(
      currentTotal,
      reversedDailyTotal[1]?.currentTotal
    );
    const numValue = isNaN(yesterday) ? 0 : Number(yesterday);
    return {
      value: `${numValue.toFixed(1)}%`,
      isUp: numValue > 0,
      isZero: numValue === 0,
    };
  }

  const difference = calculatePercentageDifference(sumCurrentSpan, sumPastSpan);
  const numValue = isNaN(difference) ? 0 : Number(difference);
  return {
    value: `${numValue.toFixed(1)}%`,
    isUp: numValue > 0,
    isZero: numValue === 0,
  };
};
