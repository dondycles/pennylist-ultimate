"use client";
import { usePathname } from "next/navigation";

import Scrollable from "@/components/scrollable";
import TotalMoney from "@/components/total-money";

import _ from "lodash";
import AnimatedNav from "@/components/nav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full h-full flex-1 flex flex-col justify- overflow-hidden">
      <Scrollable>
        <TotalMoney />
        {children}
      </Scrollable>
      <AnimatedNav />
    </main>
  );
}
