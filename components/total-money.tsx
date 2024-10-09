"use client";
import { useContext } from "react";
import Amount from "./amount";
import { ListDataContext } from "./providers/list";
export default function TotalMoney() {
  const { currentTotal } = useContext(ListDataContext);
  return (
    <div className="w-full px-4 py-6   flex flex-col items-center gap-2 bg-muted/50 rounded-b-3xl shadow-lg max-w-[800px] mx-auto z-50">
      <Amount
        className="text-4xl"
        amount={currentTotal}
        settings={{ sign: true }}
      />
      <p className="text-xs text-muted-foreground"> {}Total Money</p>
    </div>
  );
}
