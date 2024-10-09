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
import { ListDataContext } from "@/components/providers/list";
import Loader from "@/components/loader";

export default function List() {
  const { isLoading, moneys, currentTotal } = useContext(ListDataContext);
  if (isLoading) return <Loader />;

  return moneys?.map((money) => {
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
  });
}
