import { Progress } from "@/lib/types";
import { Log } from "@/store";
import _ from "lodash";

export const useGetDailyProgress = (logs: Log[] | null) => {
  if (!logs) return [];

  // all data will be coming from logs, since logs has all the movements in money

  // group each log by date, to also handle multiple logs in a single date.
  const groupedByDate: {
    [key: string]: Progress;
  } = {};

  // a temporary array for multiple logs in a single date
  let arrayOfLogsInASingleDate: {
    amount: number;
    reason: string;
    date: string;
  }[] = [];

  logs
    .filter((l) => l.action !== "transfer")
    .toReversed()
    .forEach((log) => {
      //each log has a record of changes in a money, so it will be stored here for later use
      const changesInAmount =
        Number(log.changes?.latest.amount) - Number(log.changes?.prev.amount);

      const date = new Date(log.created_at).toDateString();

      // checks if this date has no data
      // if false, this means that this date is different from the previous iteration
      if (!groupedByDate[date]) {
        // clears the temporary array so that it can be filled up again by this date
        arrayOfLogsInASingleDate = [];
      }
      // then, pushes the data of the current log
      // if the previous iteration's date is similar to current, it just adds the data so it will become multiple logs for a single date
      arrayOfLogsInASingleDate.push({
        amount: changesInAmount ?? 0,
        reason: log.reason!,
        date: new Date(log.created_at).toDateString(),
      });

      // gets all the expenses by filtering only the negative values
      const expenses = arrayOfLogsInASingleDate.filter(
        (t) => t.amount !== 0 && t.amount < 0
      );
      // gets all the expenses by filtering only the positive values
      const gains = arrayOfLogsInASingleDate.filter(
        (t) => t.amount !== 0 && t.amount > 0
      );

      const expensesSum = _.sum(expenses.map((t) => t.amount));
      const gainsSum = _.sum(gains.map((t) => t.amount));

      // this sums up the changes happened in this date. ex. (100 + -100 + -25)
      // summing up all the positive and negative values
      // if negative, then there is a loss since loss are more than gains
      // if positive, then there is a gain since gains are more than loss
      const gainOrLoss = _.sum(arrayOfLogsInASingleDate.map((a) => a.amount));

      // saves the current date single/multiple logs.
      // if current date has an existing data, it just gets the current data of the tempory array
      groupedByDate[date] = {
        expenses,
        gains,
        date: date,
        expensesSum,
        gainsSum,
        gainOrLoss,
        // currentTotal will always get the very last record in each day
        currentTotal: log.changes?.latest?.total ?? 0,
      };
    });

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 365);
  let previousProgress: Progress = {
    expenses: [],
    gains: [],
    date: "",
    expensesSum: 0,
    gainsSum: 0,
    gainOrLoss: 0,
    currentTotal: 0,
  };

  const eachDayData: Progress[] = [];

  for (let i = 0; i <= 365; i++) {
    const day = currentDate.toDateString();
    if (groupedByDate[day] !== undefined) {
      // if this date has total, set it to lastTotal so the next dates that does not have total will get that total as well to fill up the bars
      previousProgress = groupedByDate[day];
    } else {
      // if no data, resets everything except total
      previousProgress.gainOrLoss = 0;
      previousProgress.expenses = [];
      previousProgress.gains = [];
      previousProgress.date = day;
      previousProgress.expensesSum = 0;
      previousProgress.gainsSum = 0;
    }
    eachDayData.push({ ...previousProgress });
    // sets the date to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return eachDayData;
};
