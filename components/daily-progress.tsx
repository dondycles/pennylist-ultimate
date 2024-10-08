"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { getDailyProgress } from "@/lib/get-daily-progress";
import { useContext } from "react";
import { ListDataContext } from "./providers/list";
import { toMonthWord } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useChartsState } from "@/store";

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
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function DailyProgress() {
  const { logs } = useContext(ListDataContext);
  const chartsState = useChartsState();
  const chartData = getDailyProgress(logs ?? []);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between gap-4 items-center">
        <div className="space-y-1.5">
          <CardTitle>Daily Progress</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="rounded-full">
              Set Days ({chartsState.progressDays})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={chartsState.progressDays}
              onValueChange={(v) =>
                chartsState.setState({
                  ...chartsState,
                  progressDays: v as "7" | "14" | "28" | "365",
                })
              }
            >
              <DropdownMenuRadioItem value="7">7 days</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="14">14 days</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="28">28 days</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="365">
                365 days
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData.slice(
              chartData.length - Number(chartsState.progressDays),
              chartData.length
            )}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value, i) =>
                new Date(value).toDateString() === new Date().toDateString()
                  ? "Today"
                  : new Date(value).getDate() === 1 || i === 0
                  ? `${toMonthWord(value)} ${new Date(
                      value
                    ).getDate()}, ${new Date(value).getFullYear()}`
                  : new Date(value).getDate().toString()
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="expensesSum"
              fill="var(--color-expensesSum)"
              radius={100}
            />
            <Bar dataKey="gainsSum" fill="var(--color-gainsSum)" radius={100} />
            <Bar
              dataKey="currentTotal"
              fill="var(--color-currentTotal)"
              radius={100}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
