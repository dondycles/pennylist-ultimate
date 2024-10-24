"use client";

import { Pie, PieChart } from "recharts";

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
import { Money } from "@/store";

export const description = "A simple pie chart";

export function MoneysPieChart({ moneys }: { moneys: Money[] }) {
  const modifiedMoney = moneys.map((m) => ({ ...m, fill: m.color }));

  const generateChartConfig = (): ChartConfig => {
    return modifiedMoney.reduce((acc, { name, color }) => {
      acc[name] = {
        label: name,
        color: color,
      };
      return acc;
    }, {} as ChartConfig);
  };

  const chartConfig = generateChartConfig();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Money Breakdown</CardTitle>
        <CardDescription>See the pieces of your wealth</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart key={"money-pie-chart"}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={modifiedMoney}
              dataKey="amount"
              nameKey="name"
              innerRadius={75}
            />
            <ChartLegend
              className="flex flex-wrap gap-2"
              content={<ChartLegendContent nameKey="name" />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
