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
export default function List() {
  const { moneys, totalMoneys } = useMoneysStore();

  return (
    <Scrollable>
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: 20 }}
      >
        {moneys.length ? (
          moneys.map((m) => {
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
