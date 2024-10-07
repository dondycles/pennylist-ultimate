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

import { db } from "@/drizzle/db";
import { moneysTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function MoneyPage({
  params,
}: {
  params: { id: number };
}) {
  const money = await db.query.moneysTable.findFirst({
    where: eq(moneysTable.id, params.id),
    with: {
      money_log: true,
    },
  });

  return (
    <div className="w-full h-full max-w-[800px] mx-auto flex flex-col justify-start">
      <div className="flex-1 flex flex-col gap-[1px] overflow-auto">
        {money ? (
          <div>
            <Money money={money} key={money.id}>
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
          </div>
        ) : (
          <div className="m-auto text-muted-foreground">Money not found</div>
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
