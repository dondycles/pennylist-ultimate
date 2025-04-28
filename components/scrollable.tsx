"use client";

import { ScrollArea } from "./ui/scroll-area";

import TotalMoney from "./total-money";
import { cn } from "@/lib/utils";

export default function Scrollable({
  children,
  hideTotalMoney = false,
  className,
}: {
  children: React.ReactNode;
  hideTotalMoney?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden w-full ",
        className
      )}
    >
      <ScrollArea className="h-full w-full">
        <div className=" flex flex-col max-w-[800px] mx-auto pb-40">
          {!hideTotalMoney ? <TotalMoney /> : null}
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
