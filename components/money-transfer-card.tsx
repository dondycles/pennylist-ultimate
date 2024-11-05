import { Money, useTransferState } from "@/store";
import Amount from "./amount";
import { Button } from "./ui/button";
import { useMoneyTransferringDetails } from "@/hooks/useMoneyTransferringDetails";
import { Input } from "./ui/input";

export default function MoneysTransferCard({ m }: { m: Money }) {
  const { setTransferrings, transferrings, setBranchState } =
    useTransferState();
  const { isInBranch, branch, isRootNegative } = useMoneyTransferringDetails(
    transferrings,
    m
  );

  const isBranchNegative =
    Number(branch?.transferAmount ?? 0) - Number(branch?.fee ?? 0) < 0;

  return (
    <div
      style={{ color: m.color }}
      className="w-full p-4 border rounded-2xl flex flex-col gap-4"
      key={m.id}
    >
      <div
        className={`flex flex-col ${isInBranch ? "opacity-100" : "opacity-25"}`}
      >
        <p className="font-bold truncate text-sm ">{m.name}</p>
        <Amount
          className={`text-base truncate`}
          color={
            isRootNegative
              ? "hsl(var(--destructive))"
              : isBranchNegative
              ? "hsl(var(--destructive))"
              : m.color ?? ""
          }
          amount={Number(
            m.amount + (isInBranch ? Number(branch?.transferAmount ?? 0) : 0)
          )}
          settings={{ sign: true }}
        />
      </div>
      {isInBranch ? (
        <div className="text-foreground space-y-4">
          <Input
            placeholder="Receiving amount"
            type="number"
            min={0}
            value={
              Number(branch?.transferAmount) <= 0
                ? undefined
                : branch?.transferAmount ?? 0
            }
            onChange={(v) => {
              if (!branch) return;
              if (!Number(v.currentTarget.value))
                return setBranchState(
                  0,
                  branch?.id,
                  branch?.reason ?? "",
                  branch?.fee
                );
              setBranchState(
                Number(v.target.value),
                branch?.id,
                branch?.reason ?? "",
                branch?.fee
              );
            }}
          />
          <Input
            placeholder="Fee (optional)"
            type="number"
            min={0}
            value={Number(branch?.fee) <= 0 ? undefined : branch?.fee ?? 0}
            onChange={(v) => {
              if (!branch) return;
              if (!Number(v.currentTarget.value))
                return setBranchState(
                  branch.transferAmount ?? 0,
                  branch.id,
                  branch.reason ?? "",
                  0
                );
              setBranchState(
                branch.transferAmount ?? 0,
                branch.id,
                branch.reason ?? "",
                Number(v.target.value)
              );
            }}
          />
          <Input
            placeholder="Reason (optional)"
            value={branch?.reason ?? ""}
            onChange={(v) =>
              setBranchState(
                branch?.transferAmount ?? 0,
                m.id,
                v.currentTarget.value,
                branch?.fee ?? 0
              )
            }
          />
        </div>
      ) : null}
      <Button
        className="mb-0 mt-auto"
        variant={isInBranch ? "destructive" : "secondary"}
        onClick={() => {
          if (!transferrings) return;
          if (isInBranch) {
            const newBranches = transferrings.branches.filter(
              (money) => money.id !== m.id
            );
            setTransferrings({
              root: transferrings.root,
              branches: newBranches,
            });
            return;
          }
          setTransferrings({
            root: transferrings.root,
            branches: [
              ...transferrings.branches,
              { ...m, transferAmount: 0, reason: "", fee: 0 },
            ],
          });
        }}
      >
        {isInBranch ? "Remove" : "Cash In"}
      </Button>
    </div>
  );
}
