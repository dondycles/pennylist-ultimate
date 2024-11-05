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
import { ChevronDown, ChevronUp, Equal } from "lucide-react";
import Amount from "../amount";

export function MovementLineGraph({ logs }: { logs: Log[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement</CardTitle>
        <CardDescription>Last 30 movements logged</CardDescription>
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
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => {
                    const movement = value as number;
                    return (
                      <div className="flex items-center gap-1">
                        {(movement > 0 && (
                          <ChevronUp
                            fill="hsl(var(--muted))"
                            stroke="var(--gains)"
                            size={16}
                          />
                        )) ||
                          (movement < 0 && (
                            <ChevronDown
                              fill="hsl(var(--muted))"
                              stroke="var(--expenses)"
                              size={16}
                            />
                          )) || (
                            <Equal
                              fill="hsl(var(--muted))"
                              stroke="hsl(var(--muted-foreground))"
                              size={16}
                            />
                          ) ||
                          null}
                        <div>
                          {movement > 0 ? (
                            <span className="font-bold text-base">+</span>
                          ) : (
                            <span className="font-bold text-base">-</span>
                          )}
                          <Amount
                            className="text-xs"
                            settings={{ sign: true }}
                            amount={Math.abs(movement)}
                          />
                        </div>
                      </div>
                    );
                  }}
                  hideLabel
                  cursor={false}
                />
              }
            />
            <Line
              isAnimationActive={false}
              dataKey="movement"
              type="monotone"
              stroke="#88888811"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const r = 16;
                return (
                  (payload.movement > 0 && (
                    <ChevronUp
                      key={payload.id}
                      x={cx - r / 2}
                      y={cy - r / 2}
                      width={r}
                      height={r}
                      fill="hsl(var(--muted))"
                      stroke="var(--gains)"
                    />
                  )) ||
                  (payload.movement < 0 && (
                    <ChevronDown
                      key={payload.id}
                      x={cx - r / 2}
                      y={cy - r / 2}
                      width={r}
                      height={r}
                      fill="hsl(var(--muted))"
                      stroke="var(--expenses)"
                    />
                  )) || (
                    <Equal
                      key={payload.id}
                      x={cx - r / 2}
                      y={cy - r / 2}
                      width={r}
                      height={r}
                      fill="hsl(var(--muted))"
                      stroke="hsl(var(--muted-foreground))"
                    />
                  ) ||
                  null
                );
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
