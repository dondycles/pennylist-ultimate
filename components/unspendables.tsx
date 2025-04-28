import { useMoneysStore, useTransferState } from "@/store";
import {
  Money,
  MoneyActions,
  MoneyAmount,
  MoneyBar,
  MoneyCommentBtn,
  MoneyDeleteBtn,
  MoneyEditBtn,
  MoneyExternalLinkBtn,
  MoneyHeader,
  MoneyPaletteBtn,
  MoneySpendableBtn,
  MoneyTransferBtn,
} from "./money-bar";
import { useCallback } from "react";
import Scrollable from "./scrollable";
import { motion } from "framer-motion";
export default function Unspendables() {
  const { moneys, totalMoneys, asc, sortBy } = useMoneysStore();
  const { transferrings } = useTransferState();
  const unspendableMoneys = moneys.filter((m) => !m.spendable);

  const sortMoneys = useCallback(() => {
    if (asc) {
      if (sortBy === "amount") {
        return unspendableMoneys.toSorted((a, b) => a.amount - b.amount);
      }
      if (sortBy === "created_at") {
        return unspendableMoneys.toSorted(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      if (sortBy === "name") {
        return unspendableMoneys.toSorted((a, b) =>
          b.name.localeCompare(a.name)
        );
      }
      return unspendableMoneys;
    }
    if (sortBy === "amount") {
      return unspendableMoneys.toSorted((a, b) => b.amount - a.amount);
    }
    if (sortBy === "created_at") {
      return unspendableMoneys.toSorted(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    if (sortBy === "name") {
      return unspendableMoneys.toSorted((a, b) => a.name.localeCompare(b.name));
    }
    return unspendableMoneys;
  }, [unspendableMoneys, asc, sortBy]);

  const sortedMoneys = sortMoneys();

  if (sortedMoneys.length === 0) return null;
  return (
    <Scrollable hideTotalMoney className={`${transferrings && "hidden"}`}>
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: 20 }}
      >
        <br />
        <p className="text-sm text-muted-foreground text-center">
          Unspendables
        </p>
        {sortedMoneys.map((m) => {
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
                  <MoneySpendableBtn />
                  <MoneyDeleteBtn />
                </MoneyActions>
              </MoneyBar>
            </Money>
          );
        })}
      </motion.div>
    </Scrollable>
  );
}
