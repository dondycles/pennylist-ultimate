"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
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
import { Progress } from "@/lib/types";
import { Differences } from "@/hooks/useGetDifferences";
import Amount from "../amount";
import { ChartSpline, GitCommitVertical, Square } from "lucide-react";
import { ReactNode } from "react";

const chartConfig = {
  expensesSum: {
    color: "var(--expenses)",
  },
  gainsSum: {
    color: "var(--gains)",
  },
  currentTotal: {
    color: "hsl(var(--primary))",
  },
  gainOrLoss: {
    color: "var(--difference)",
  },
} satisfies ChartConfig;

export default function ProgressBarChart({
  chartData,
  differences,
}: {
  chartData: Progress[];
  differences: Differences;
}) {
  const chartsState = useChartsState();

  return (
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
              className="text-muted-foreground text-sm gap-1 border border-input"
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
              <DropdownMenuRadioItem value="daily">Daily</DropdownMenuRadioItem>
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
                    chartData.length - Number(chartsState.progressDays) < 0
                      ? 0
                      : chartData.length - Number(chartsState.progressDays),
                    chartData.length
                  )
                : chartData
            }
          >
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
                    : i % 2 === 0
                    ? ""
                    : new Date(value).getDate().toString();
                return value;
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(data, i) => {
                    const label: {
                      icon: ReactNode;
                      className: string;
                      label: string;
                    } | null =
                      (i === "currentTotal" && {
                        label: "Total Money",
                        className: "",
                        icon: (
                          <Square size={16} fill="var(--color-currentTotal)" />
                        ),
                      }) ||
                      (i === "gainOrLoss" && {
                        label: "Difference",
                        className: "",
                        icon: (
                          <div className="size-4 overflow-hidden">
                            <ChartSpline
                              size={16}
                              stroke="var(--color-gainOrLoss)"
                              className="translate-y-[2px] -translate-x-[2px] box-content scale-150"
                            />
                          </div>
                        ),
                      }) ||
                      (i === "expensesSum" && {
                        label: "Expenses",
                        className: "",
                        icon: (
                          <GitCommitVertical
                            className="rotate-90"
                            size={16}
                            stroke="var(--color-expensesSum)"
                          />
                        ),
                      }) ||
                      (i === "gainsSum" && {
                        label: "Gains",
                        className: "",
                        icon: (
                          <GitCommitVertical
                            className="rotate-90"
                            size={16}
                            stroke="var(--color-gainsSum)"
                          />
                        ),
                      }) ||
                      null;
                    return (
                      <div className="flex gap-1  flex-1">
                        {label ? label.icon : null}
                        <p className="flex-1">
                          {(i === "currentTotal" && "Total Money") ||
                            (i === "gainOrLoss" && "Difference") ||
                            (i === "expensesSum" && "Expenses") ||
                            (i === "gainsSum" && "Gains")}
                        </p>
                        <Amount
                          className="text-xs "
                          settings={{ sign: true }}
                          amount={data as number}
                        />
                      </div>
                    );
                  }}
                  indicator="line"
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              isAnimationActive={false}
              dataKey="currentTotal"
              fill="var(--color-currentTotal)"
              radius={[8, 8, 0, 0]}
            />
            <Area
              isAnimationActive={false}
              dataKey="gainOrLoss"
              stroke="var(--color-gainOrLoss)"
              fill="var(--color-gainOrLoss)"
              type="monotone"
            />
            <Line
              isAnimationActive={false}
              dataKey="expensesSum"
              stroke="var(--color-expensesSum)"
              strokeWidth={2}
              type="monotone"
            />
            <Line
              isAnimationActive={false}
              dataKey="gainsSum"
              stroke="var(--color-gainsSum)"
              strokeWidth={2}
              type="monotone"
            />
            <CartesianGrid vertical={false} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
