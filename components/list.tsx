"use client";
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
import { Skeleton } from "./ui/skeleton";
import _ from "lodash";
import { useContext } from "react";
import { ListDataContext } from "./providers/list";
import TotalMoney from "./total-money";

export default function List() {
  const { isLoading, moneys } = useContext(ListDataContext);
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
      <TotalMoney total={_.sum(moneys?.map((money) => money.amount) ?? [0])} />
      <div className="flex-1 flex flex-col overflow-auto max-w-[800px] mx-auto w-screen">
        {moneys?.map((money) => {
          return (
            <Money
              specific={false}
              money={money}
              key={`${money.id}-${money.last_update}`}
            >
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
