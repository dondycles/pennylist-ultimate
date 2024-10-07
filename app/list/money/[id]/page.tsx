"use client";
import { get_money } from "@/app/actions/moneys";
import {
  Money,
  MoneyActions,
  MoneyAmount,
  MoneyBar,
  MoneyDeleteBtn,
  MoneyEditBtn,
  MoneyHeader,
  MoneyPaletteBtn,
} from "@/components/money-bar";
import Nav, { NavBackBtn, NavHideBtn, NavUserBtn } from "@/components/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";

import { useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function MoneyPage({ params }: { params: { id: number } }) {
  const { isLoaded, user, isSignedIn } = useUser();
  const { data: money, isLoading } = useQuery({
    queryKey: [params.id],
    enabled: isLoaded && isSignedIn && !!user,
    queryFn: async () => await get_money(params.id),
  });

  if (isLoading)
    return (
      <div className="flex flex-col gap-[1px] h-full">
        <Skeleton className="h-[136px] w-full" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
      </div>
    );
  return (
    <div className="w-full h-full max-w-[800px] mx-auto flex flex-col justify-start">
      <div className="flex-1 flex flex-col gap-[1px] overflow-auto">
        {money && (
          <Money specific={true} money={money} key={money.id}>
            <MoneyBar>
              <MoneyHeader />
              <MoneyAmount />
              <MoneyActions>
                <MoneyPaletteBtn />
                <MoneyEditBtn />
                <MoneyDeleteBtn />
              </MoneyActions>
            </MoneyBar>
          </Money>
        )}
      </div>
      <Nav>
        <NavBackBtn />
        <NavHideBtn />
        <ThemeToggle />
        <NavUserBtn />
      </Nav>
    </div>
  );
}
