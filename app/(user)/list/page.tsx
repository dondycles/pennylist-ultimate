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
import { useContext } from "react";
import { ListDataContext } from "@/components/providers/list";
import Loader from "@/components/loader";
import { motion } from "framer-motion";
import Scrollable from "@/components/scrollable";
export default function List() {
  const { isLoading, moneys, currentTotal } = useContext(ListDataContext);

  if (isLoading) return <Loader />;
  return (
    <Scrollable>
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: 20 }}
      >
        {moneys?.map((m) => {
          return (
            <Money
              currentTotal={currentTotal}
              specific={false}
              money={m}
              key={`${m.id}-${m.last_update}`}
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
