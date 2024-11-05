import { useMoneysStore, useTransferState } from "@/store";

import MoneysTransferCard from "./money-transfer-card";

export default function SelectBranches() {
  const moneysStore = useMoneysStore();
  const { transferrings } = useTransferState();

  if (transferrings)
    return (
      <div className="grid grid-cols-2 md:grid-cols-3  gap-4 p-4">
        {moneysStore.moneys
          .filter((m) => m.id !== transferrings?.root.id)
          .map((m) => {
            return <MoneysTransferCard m={m} key={m.id} />;
          })}
      </div>
    );
  return null;
}
