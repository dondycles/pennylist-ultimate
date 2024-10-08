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
import { useContext } from "react";
import { ListDataContext } from "./providers/list";
import TotalMoney from "./total-money";

export default function List() {
  const { isLoading, moneys, currentTotal } = useContext(ListDataContext);
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
      <TotalMoney total={currentTotal} />
      <div className="flex-1 flex flex-col overflow-auto max-w-[800px] w-screen mx-auto gap-4">
        <br />
        {moneys?.map((money) => {
          return (
            <Money
              currentTotal={currentTotal}
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
