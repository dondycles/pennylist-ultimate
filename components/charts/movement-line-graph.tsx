"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
          Last 30 movements of gains and expenses logged
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <LineChart
            accessibilityLayer
            data={logs
              .toReversed()
              .slice(logs.length - 30 < 0 ? 0 : logs.length - 30, logs.length)}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
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
            <YAxis tickMargin={8} tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="movement"
              type="monotone"
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
