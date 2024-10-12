"use client";
import { useContext } from "react";
import Amount from "./amount";
import { ListDataContext } from "./providers/list";
import { motion } from "framer-motion";
import { useListState } from "@/store";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import _ from "lodash";
export default function TotalMoney() {
  const { currentTotal, yesterdayDiff, user, isLoading } =
    useContext(ListDataContext);
  const listState = useListState();
  const transfersFees =
    Number(listState.transferrings?.root.fee ?? 0) +
    _.sum(listState.transferrings?.branches.map((b) => b.fee));
  if (isLoading) return;
  return (
    <motion.div
      initial={false}
      animate={{
        height: listState.minimizeTotalMoney ? 34 : 152,
      }}
      transition={{
        ease: "anticipate",
      }}
      className="w-full flex flex-col gap-4 items-center px-4 py-6  rounded-b-3xl shadow-lg max-w-[800px] mx-auto z-50 overflow-hidden relative bg-muted/50"
    >
      <motion.p
        initial={false}
        animate={{
          opacity: listState.minimizeTotalMoney ? 0 : 1,
          translateY: listState.minimizeTotalMoney ? -10 : 0,
        }}
        className="text-xs text-muted-foreground"
      >
        {user?.username}&apos;s total money
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          scale: listState.minimizeTotalMoney ? 0.5 : 1,
          translateY: listState.minimizeTotalMoney ? -52 : 0,
          opacity: 1,
        }}
        transition={{
          ease: "backInOut",
        }}
      >
        <Amount
          className="text-4xl"
          amount={currentTotal - transfersFees}
          settings={{ sign: true }}
        />
      </motion.div>
      <motion.p
        initial={false}
        animate={{
          opacity: listState.minimizeTotalMoney ? 0 : 1,
        }}
        className="text-xs text-muted-foreground"
      >
        {yesterdayDiff.isZero
          ? "Nothing changed"
          : yesterdayDiff.isUp
          ? `Up by ${yesterdayDiff.value}`
          : `Down by ${yesterdayDiff.value}`}{" "}
        compared to yesterday
      </motion.p>
      <Button
        size={"icon"}
        variant={"ghost"}
        className="absolute right-4 bottom-[50%] translate-y-[50%] text-muted-foreground"
        onClick={() =>
          listState.setState({
            ...listState,
            minimizeTotalMoney: !listState.minimizeTotalMoney,
          })
        }
      >
        {listState.minimizeTotalMoney ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronUp size={16} />
        )}
      </Button>
    </motion.div>
  );
}
