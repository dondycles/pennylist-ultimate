"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Log } from "@/store";
import { toMonthWord } from "@/lib/utils";

export const description = "A line chart";

export function MovementLineGraph({ logs }: { logs: Log[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement</CardTitle>
        <CardDescription>
          Last 30 movements of gains and expenses logged (not including
          transfers)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <LineChart
            accessibilityLayer
            data={logs.toReversed()}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="created_at"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value, i) => {
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
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="movement"
              type="natural"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
