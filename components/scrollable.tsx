"use client";
import { usePathname } from "next/navigation";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useRef } from "react";
import TotalMoney from "./total-money";

export default function Scrollable({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView();
  }, [pathname]);

  return (
    <div ref={ref} className="flex-1 overflow-y-auto overflow-x-hidden w-full ">
      <ScrollArea className="h-full w-full">
        <div className=" flex flex-col max-w-[800px] mx-auto pb-80">
          <TotalMoney />
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
