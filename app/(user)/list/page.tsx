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
} from "@/components/money-bar";
import { motion } from "framer-motion";
import Scrollable from "@/components/scrollable";
import { useMoneysStore } from "@/store";
import { useCallback } from "react";
export default function List() {
  const { moneys, totalMoneys, asc, sortBy } = useMoneysStore();

  function sortMoneys() {
    if (asc) {
      if (sortBy === "amount") {
        return moneys.toSorted((a, b) => a.amount - b.amount);
      }
      if (sortBy === "created_at") {
        return moneys.toSorted(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      if (sortBy === "name") {
        return moneys.toSorted((a, b) => b.name.localeCompare(a.name));
      }
      return moneys;
    }
    if (sortBy === "amount") {
      return moneys.toSorted((a, b) => b.amount - a.amount);
    }
    if (sortBy === "created_at") {
      return moneys.toSorted(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    if (sortBy === "name") {
      return moneys.toSorted((a, b) => a.name.localeCompare(b.name));
    }
    return moneys;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sortedMoneys = useCallback(() => sortMoneys(), [moneys, asc, sortBy]);

  return (
    <Scrollable>
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: 20 }}
      >
        {sortedMoneys().length ? (
          sortedMoneys().map((m) => {
            return (
              <Money
                currentTotal={totalMoneys(moneys)}
                specific={false}
                money={m}
                key={`${m.id}-${m.last_updated_at}`}
              >
                <MoneyBar>
                  <MoneyHeader />
                  <MoneyAmount />
                  <MoneyActions>
                    <MoneyExternalLinkBtn />
                    <MoneyPaletteBtn />
                    <MoneyTransferBtn />
                    <MoneyEditBtn />
                    <MoneyCommentBtn />
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
      </motion.div>
    </Scrollable>
  );
}
