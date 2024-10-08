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
import { useContext } from "react";
import { ListDataContext } from "./providers/list";
import TotalMoney from "./total-money";
import Loader from "./loader";
import Scrollable from "./scrollable";

export default function List() {
  const { isLoading, moneys, currentTotal } = useContext(ListDataContext);
  if (isLoading) return <Loader />;
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <TotalMoney total={currentTotal} />
      <Scrollable>
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
      </Scrollable>
    </div>
  );
}
