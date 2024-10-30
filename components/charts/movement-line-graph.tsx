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
import { GitCommitVertical } from "lucide-react";
import Amount from "../amount";

export function MovementLineGraph({ logs }: { logs: Log[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement</CardTitle>
        <CardDescription>Last 60 movements logged</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="aspect-[5/2]" config={{}}>
          <LineChart
            accessibilityLayer
            data={logs
              .toReversed()
              .slice(logs.length - 60 < 0 ? 0 : logs.length - 60, logs.length)}
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

            <Line
              isAnimationActive={false}
              dataKey="movement"
              type="monotone"
              stroke="hsl(var(--muted))"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const r = 16;
                return (
                  <GitCommitVertical
                    key={payload.id}
                    x={cx - r / 2}
                    y={cy - r / 2}
                    width={r}
                    height={r}
                    fill="hsl(var(--muted))"
                    stroke={`${
                      payload.movement >= 0 ? "var(--gains)" : "var(--expenses)"
                    }`}
                  />
                );
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(movement) => {
                    return (
                      <div className="flex items-center gap-1">
                        <GitCommitVertical
                          stroke={`${
                            (movement as number) >= 0
                              ? "var(--gains)"
                              : "var(--expenses)"
                          }`}
                          size={16}
                        />
                        <p>movement</p>
                        <Amount
                          className="text-xs"
                          settings={{ sign: true }}
                          amount={movement as number}
                        />
                      </div>
                    );
                  }}
                  hideLabel
                  cursor={false}
                />
              }
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
