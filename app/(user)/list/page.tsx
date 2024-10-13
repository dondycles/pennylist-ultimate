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
import { useListState, useMoneysStore } from "@/store";
import _ from "lodash";
export default function List() {
  const { moneys } = useMoneysStore();
  const { sortBy, asc } = useListState();
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
  const currentTotal = _.sum(moneys.map((m) => m.amount));
  const sortedMoneys = sortMoneys();

  return (
    <Scrollable>
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: 20 }}
      >
        {sortedMoneys.map((m) => {
          return (
            <Money
              currentTotal={currentTotal}
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
        })}
      </motion.div>
    </Scrollable>
  );
}
