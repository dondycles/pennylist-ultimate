import { Money, TransferState } from "@/store";
import _ from "lodash";

export function useMoneyTransferringDetails(
  transferrings: TransferState["transferrings"],
  money: Money
) {
  const root = transferrings?.root ?? null;
  const branch = transferrings?.branches.find((b) => b.id === money.id) ?? null;
  const isRoot = root?.id === money.id;
  const isInBranch = Boolean(
    transferrings?.branches.find((b) => b.id === money.id)
  );
  const branchesDemandedAmounts = _.sum(
    transferrings?.branches.map((b) => b.transferAmount)
  );

  const branchesFees = _.sum(transferrings?.branches.map((m) => m.fee));

  const isRootNegative =
    (root?.amount ?? 0) -
      (root?.fee ?? 0) -
      branchesDemandedAmounts -
      branchesFees <
    0;
  return {
    root,
    branch,
    isRoot,
    isInBranch,
    branchesDemandedAmounts,
    isRootNegative,
    branchesFees,
  };
}
