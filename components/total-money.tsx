"use client";

import Amount from "./amount";

export default function TotalMoney({ total }: { total: number }) {
  return (
    <div className="w-full px-4 py-8  flex flex-col items-center gap-2 bg-muted/50 rounded-b-3xl shadow-lg mb-4 max-w-[800px] mx-auto">
      <p className="text-xs text-muted-foreground">Total Money</p>
      <Amount className="text-4xl" amount={total} settings={{ sign: true }} />
    </div>
  );
}
