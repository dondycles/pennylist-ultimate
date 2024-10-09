"use client";

import { Area, Bar, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetDailyProgress } from "@/hooks/useGetDailyProgress";
import { useContext } from "react";
import { ListDataContext } from "../providers/list";
import { toMonthWord } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useChartsState } from "@/store";
import { useGetDifferences } from "@/hooks/useGetDifferences";
import { useGetMonthlyProgress } from "@/hooks/useGetMonthlyProgress";
export const description = "A multiple bar chart";

const chartConfig = {
  expensesSum: {
    label: "Expenses",
    color: "hsl(var(--chart-5))",
  },
  gainsSum: {
    label: "Gains",
    color: "hsl(var(--chart-2))",
  },
  currentTotal: {
    label: "Total Money",
    color: "hsl(var(--primary))",
  },
  gainOrLoss: {
    label: "Difference",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function DailyProgress() {
  const { logs, currentTotal } = useContext(ListDataContext);
  const chartsState = useChartsState();
  const monthlyData = useGetMonthlyProgress(logs ?? []);
  const dailyData = useGetDailyProgress(logs ?? []);
  const chartData = chartsState.type === "monthly" ? monthlyData : dailyData;
  const differences = useGetDifferences(
    logs ?? [],
    currentTotal,
    chartsState.progressDays
  );

  return (
    <motion.div
      key={chartsState.type}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card>
        <CardHeader className="flex flex-row justify-between gap-4 items-baseline">
          <div className="space-y-1.5">
            <CardTitle>
              <span className="capitalize">{chartsState.type}</span> Progress
            </CardTitle>
            {chartsState.type === "daily" && (
              <CardDescription>
                {differences.isZero
                  ? "Nothing changed"
                  : differences.isUp
                  ? `Trending up by ${differences.value}`
                  : `Trending down by ${differences.value}`}{" "}
                compared to last {chartsState.progressDays} days
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"secondary"}
                className="rounded-full text-muted-foreground text-sm gap-1"
              >
                <span className="capitalize">{chartsState.type}</span>
                {chartsState.type === "daily" && (
                  <span>| ({chartsState.progressDays}) days</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={chartsState.type}
                onValueChange={(v) =>
                  chartsState.setState({
                    ...chartsState,
                    type: v as "monthly" | "daily",
                  })
                }
              >
                <DropdownMenuRadioItem value="daily">
                  Daily
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="monthly">
                  Monthly
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              {chartsState.type === "daily" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={chartsState.progressDays}
                    onValueChange={(v) =>
                      chartsState.setState({
                        ...chartsState,
                        progressDays: v as "7" | "14" | "28" | "365",
                      })
                    }
                  >
                    <DropdownMenuRadioItem value="7">
                      7 days
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="14">
                      14 days
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="28">
                      28 days
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="365">
                      365 days
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ComposedChart
              accessibilityLayer
              data={
                chartsState.type === "daily"
                  ? chartData.slice(
                      chartData.length - Number(chartsState.progressDays),
                      chartData.length
                    )
                  : chartData
              }
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value, i) => {
                  if (chartsState.type === "daily")
                    return new Date(value).toDateString() ===
                      new Date().toDateString()
                      ? "Today"
                      : new Date(value).getDate() === 1 || i === 0
                      ? `${toMonthWord(value)} ${new Date(
                          value
                        ).getDate()}, ${new Date(value).getFullYear()}`
                      : new Date(value).getDate().toString();
                  return value;
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="currentTotal"
                fill="var(--color-currentTotal)"
                radius={[8, 8, 0, 0]}
              />
              <Area
                dataKey="gainOrLoss"
                stroke="var(--color-gainOrLoss)"
                strokeWidth={0.5}
                fillOpacity={1}
                fill="var(--color-gainOrLoss)"
                type="monotone"
              />
              <Line
                dataKey="expensesSum"
                stroke="var(--color-expensesSum)"
                strokeWidth={2}
                type="monotone"
              />
              <Line
                dataKey="gainsSum"
                stroke="var(--color-gainsSum)"
                strokeWidth={2}
                type="monotone"
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}