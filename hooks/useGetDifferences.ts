import { useGetDailyProgress } from "./useGetDailyProgress";
import _ from "lodash";
import { Log } from "@/store";

export const useGetDifferences = (
  logs: Log[] | null,
  currentTotal: number,
  days: "1" | "7" | "14" | "28" | "365"
) => {
  // Reverse the dailyTotal array once

  const numberedDays = Number(days);

  const reversedDailyTotal = useGetDailyProgress(logs).toReversed();

  // Helper function to calculate the sum of totals over a given range
  const useCalculateSum = (start: number, end: number) => {
    const dailyProgress = useGetDailyProgress(logs)
      .toReversed()
      .splice(start, end)
      .map((d) => d.currentTotal);
    return _.sum(dailyProgress);
  };

  // Calculate sums for each week range

  const sumCurrentSpan = useCalculateSum(0, numberedDays);

  const sumPastSpan = useCalculateSum(numberedDays, numberedDays);
  // Calculate percentage differences
  const calculatePercentageDifference = (current: number, past: number) => {
    return ((current - past) / current) * 100;
  };

  if (days === "1") {
    const yesterday = calculatePercentageDifference(
      currentTotal,
      reversedDailyTotal[0]?.currentTotal
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

export type Differences = ReturnType<typeof useGetDifferences>;
