"use client";

import { cn } from "@/lib/utils";
import { useListState, useLockerState } from "@/store";
import { ClassNameValue } from "tailwind-merge";

export default function Amount({
  className,
  amount,
  settings,
  color,
}: {
  className?: ClassNameValue;
  amount: number;
  settings: { decimals?: number; sign: boolean; hide?: boolean };
  color?: string;
}) {
  const { locked } = useLockerState();
  const listState = useListState();
  const stringedAmount = amount.toString();
  const asteriskedAmount = "*".repeat(stringedAmount.length);
  const withSign = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: settings?.decimals ?? 2,
  });
  const withoutSign = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: settings?.decimals ?? 2,
  });

  return (
    <span
      style={{ color: color ?? "" }}
      className={cn("text-2xl font-readex font-black", className)}
    >
      {locked
        ? asteriskedAmount
        : settings.hide === false
        ? settings?.sign
          ? withSign.format(amount)
          : withoutSign.format(amount)
        : listState?.hidden
        ? asteriskedAmount
        : settings?.sign
        ? withSign.format(amount)
        : withoutSign.format(amount)}
    </span>
  );
}
