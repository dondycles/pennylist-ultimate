"use client";
import Amount from "@/components/amount";
import {
  Money,
  MoneyAmount,
  MoneyDeleteBtn,
  MoneyActions,
  MoneyHeader,
  MoneyPaletteBtn,
  MoneyExternalLinkBtn,
  MoneyEditBtn,
  MoneyBar,
} from "@/components/money-bar";
import { get_moneys } from "@/app/actions/moneys";
import { useQuery } from "@tanstack/react-query";
import { useListState } from "@/store";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "./ui/skeleton";
import _ from "lodash";

export default function List() {
  const listState = useListState();
  const { isLoaded, user, isSignedIn } = useUser();
  const { data: moneys, isLoading } = useQuery({
    queryKey: ["list", user?.id, listState.asc, listState.sortBy],
    enabled: isLoaded && isSignedIn && !!user,
    queryFn: async () =>
      await get_moneys({ asc: listState.asc, by: listState.sortBy }),
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
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="w-full p-6 py-12 bg-muted">
        <p></p>
        <Amount
          className="text-4xl"
          amount={_.sum(moneys?.map((money) => money.amount) ?? [0])}
          settings={{ hide: listState.hidden, sign: true }}
        />
      </div>
      <div className="flex-1 flex flex-col gap-[1px] overflow-auto">
        {moneys?.map((money) => {
          return (
            <Money money={money} key={money.id}>
              <MoneyBar>
                <MoneyHeader />
                <MoneyAmount />
                <MoneyActions>
                  <MoneyExternalLinkBtn />
                  <MoneyPaletteBtn />
                  <MoneyEditBtn />
                  <MoneyDeleteBtn />
                </MoneyActions>
              </MoneyBar>
            </Money>
          );
        })}
      </div>
    </div>
  );
}
