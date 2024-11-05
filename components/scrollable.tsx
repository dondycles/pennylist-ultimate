"use client";

import { ScrollArea } from "./ui/scroll-area";

import TotalMoney from "./total-money";

export default function Scrollable({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden w-full ">
      <ScrollArea className="h-full w-full">
        <div className=" flex flex-col max-w-[800px] mx-auto pb-40">
          <TotalMoney />
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
