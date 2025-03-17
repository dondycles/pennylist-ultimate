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
  MoneyTransferBtn,
  MoneyCommentBtn,
  MoneySpendableBtn,
} from "@/components/money-bar";
import { motion } from "framer-motion";
import Scrollable from "@/components/scrollable";
import { useMoneysStore } from "@/store";
import { useCallback } from "react";
import SelectBranches from "@/components/select-branches";
import Unspendables from "@/components/unspendables";
export default function List() {
  const { moneys, totalMoneys, asc, sortBy } = useMoneysStore();

  const spendableMoneys = moneys.filter((m) => m.spendable);
  const sortMoneys = useCallback(() => {
    if (asc) {
      if (sortBy === "amount") {
        return spendableMoneys.toSorted((a, b) => a.amount - b.amount);
      }
      if (sortBy === "created_at") {
        return spendableMoneys.toSorted(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      if (sortBy === "name") {
        return spendableMoneys.toSorted((a, b) => b.name.localeCompare(a.name));
      }
      return spendableMoneys;
    }
    if (sortBy === "amount") {
      return spendableMoneys.toSorted((a, b) => b.amount - a.amount);
    }
    if (sortBy === "created_at") {
      return spendableMoneys.toSorted(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    if (sortBy === "name") {
      return spendableMoneys.toSorted((a, b) => a.name.localeCompare(b.name));
    }
    return spendableMoneys;
  }, [spendableMoneys, asc, sortBy]);

  const sortedMoneys = sortMoneys();
  return (
    <Scrollable>
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: 20 }}
      >
        {sortedMoneys.length ? (
          sortedMoneys.map((m, i) => {
            return (
              <Money
                currentTotal={totalMoneys(moneys)}
                specific={false}
                money={m}
                key={`${m.id}-${m.last_updated_at}`}
              >
                <MoneyBar key={i}>
                  <MoneyHeader />
                  <MoneyAmount />
                  <MoneyActions>
                    <MoneyExternalLinkBtn />
                    <MoneyPaletteBtn />
                    <MoneyTransferBtn />
                    <MoneyEditBtn />
                    <MoneyCommentBtn />
                    <MoneySpendableBtn />
                    <MoneyDeleteBtn />
                  </MoneyActions>
                </MoneyBar>
              </Money>
            );
          })
        ) : (
          <p className="text-muted-foreground text-center text-xs mt-4">
            No moneys to show yet, start listing now.
          </p>
        )}
        <Unspendables />
        <SelectBranches />
      </motion.div>
    </Scrollable>
  );
}
