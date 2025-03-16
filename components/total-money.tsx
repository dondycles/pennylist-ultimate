"use client";
import Amount from "./amount";
import { motion } from "framer-motion";
import {
  useListState,
  useLogsStore,
  useMoneysStore,
  useTransferState,
} from "@/store";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import _ from "lodash";
import { useGetDifferences } from "@/hooks/useGetDifferences";
export default function TotalMoney() {
  const { moneys, spendableTotalMoneys, totalMoneys } = useMoneysStore();
  const { logs } = useLogsStore();
  const { transferrings } = useTransferState();
  const listState = useListState();
  const transfersFees =
    Number(transferrings?.root.fee ?? 0) +
    _.sum(transferrings?.branches.map((b) => b.fee));

  const yesterdayDiff = useGetDifferences(
    logs ?? [],
    spendableTotalMoneys(moneys),
    "1"
  );

  return (
    <motion.div
      initial={false}
      animate={{
        height: listState.minimizeTotalMoney ? 34 : 156,
      }}
      transition={{
        ease: "anticipate",
      }}
      className="w-full flex flex-col gap-4 items-center px-4 py-6  rounded-b-3xl shadow-lg max-w-[800px] mx-auto z-50 overflow-hidden relative bg-muted/50"
    >
      <motion.div
        initial={false}
        animate={{
          scale: listState.minimizeTotalMoney ? 0.5 : 1,
          translateY: listState.minimizeTotalMoney ? -20 : 0,
          opacity: 1,
        }}
        transition={{
          ease: "backInOut",
        }}
      >
        <Amount
          className="text-4xl text-primary"
          amount={spendableTotalMoneys(moneys) - transfersFees}
          settings={{ sign: true }}
        />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          opacity: listState.minimizeTotalMoney ? 0 : 1,
        }}
        className="text-xs text-muted-foreground flex items-baseline gap-1"
      >
        <Amount
          className="text-base text-primary"
          amount={totalMoneys(moneys) - transfersFees}
          settings={{ sign: true }}
        />
        <p>with unspendables</p>
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
