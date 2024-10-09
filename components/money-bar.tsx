"use client";

import { MoneyWithLogs } from "@/drizzle/infered-types";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import Amount from "./amount";
import {
  ArrowRightLeft,
  ArrowUpToLine,
  Dot,
  Edit,
  ExternalLink,
  Palette,
  Split,
  Trash,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { colorize_money, delete_money } from "@/app/actions/moneys";

import EditMoneyForm from "./forms/edit-money";
import { useQueryClient } from "@tanstack/react-query";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { colors } from "@/lib/colors";
import { useDarkenColor } from "@/hooks/useDarkenColor";
import { useListState } from "@/store";
import { Input } from "./ui/input";
import _ from "lodash";

type MoneyBarProps = PropsWithChildren & {
  money: Omit<MoneyWithLogs, "money_log">;
  specific: boolean;
  currentTotal: number;
};

const MoneyBarContext = createContext<
  | {
      money: MoneyBarProps["money"];
      deleting: boolean;
      setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
      specific: boolean;
      currentTotal: number;
    }
  | undefined
>(undefined);

function useMoneyBarContext() {
  const context = useContext(MoneyBarContext);
  if (!context) throw new Error("Money context missing!");
  return context;
}

export function Money({
  children,
  money,
  specific,
  currentTotal,
}: MoneyBarProps) {
  const [deleting, setDeleting] = useState(false);
  return (
    <MoneyBarContext.Provider
      value={{ money, deleting, setDeleting, specific, currentTotal }}
    >
      {children}
    </MoneyBarContext.Provider>
  );
}

export function MoneyBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: ClassNameValue;
}) {
  const { money, deleting } = useMoneyBarContext();
  return (
    <div
      key={money.id}
      // style={{
      //   borderBottomColor: money.color ?? "hsl(var(--border))",
      //   borderBottomWidth: "1px",
      // }}
      className={cn(
        `w-full p-4 flex flex-col gap-2 border-b last:border-b-0 ${
          deleting && "animate-pulse scale-95"
        }`,
        className
      )}
    >
      {children}
    </div>
  );
}

export function MoneyHeader() {
  const { money } = useMoneyBarContext();
  const darken = useDarkenColor(money.color ?? "");
  const color = [
    money.color ? money.color + "88" : "hsl(var(--muted-foreground))",
    money.color ?? "hsl(var(--foreground))",
  ];
  return (
    <div key={money.color} className={`flex items-baseline gap-2`}>
      <span className={`font-bold ${darken}`} style={{ color: color[1] }}>
        {money.name}
      </span>
      <Dot
        style={{
          color: color[0],
        }}
        size={12}
      />
      <span
        style={{
          color: color[0],
        }}
        className=" text-xs"
      >
        {/* {new Date(money.created_at).toLocaleDateString()} */}
        {money.id}
      </span>
    </div>
  );
}

export function MoneyAmount() {
  const { money } = useMoneyBarContext();
  const darken = useDarkenColor(money.color ?? "");
  const listState = useListState();

  const root = listState.transferrings?.root;
  const branch = listState.transferrings?.branches.find(
    (b) => b.id === money.id
  );
  const isRoot = root?.id === money.id;
  const isInBranch = listState.transferrings?.branches.find(
    (b) => b.id === money.id
  );
  const branchesDemandedAmounts = _.sum(
    listState.transferrings?.branches.map((b) => b.transferAmount)
  );
  const negative = money.amount - branchesDemandedAmounts <= 0;

  return (
    <div>
      {isInBranch ? (
        <div className="flex flex-col gap-4">
          <Amount
            className={`${darken}`}
            color={money.color ?? ""}
            amount={money.amount + (branch?.transferAmount ?? 0)}
            settings={{ sign: true }}
          />
          <div className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-xs">
                Receiving from {root?.name}
              </p>
              <Input
                value={
                  (branch?.transferAmount ?? 0) <= 0
                    ? undefined
                    : branch?.transferAmount ?? 0
                }
                onChange={(v) => {
                  if (!Number(v.currentTarget.value))
                    return listState.setTransferValue(0, money.id);
                  listState.setTransferValue(
                    Number(v.currentTarget.value),
                    money.id
                  );
                }}
                placeholder={`Amount to receive from ${root?.name}`}
                className="rounded-full bg-muted"
              />
            </div>
            <div className="flex flex-col xs:flex-row xs:items-end gap-4">
              <div className="space-y-1.5 flex-1 xs:max-w-32">
                <p className="text-muted-foreground text-xs truncate">
                  Receiving transfer fee (optional)
                </p>
                <Input
                  placeholder={`Fee (optional)`}
                  className="rounded-full bg-muted"
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="text-muted-foreground text-xs">
                  Reason (optional)
                </p>
                <Input
                  placeholder="Reason (optional)"
                  className="rounded-full bg-muted"
                />
              </div>
            </div>
            <Button className="rounded-full flex-1 w-fit mx-auto gap-2">
              Proceed Transfer <ArrowRightLeft size={16} />
            </Button>
          </div>
        </div>
      ) : isRoot ? (
        <Amount
          className={`${darken}`}
          color={negative ? "hsl(var(--destructive))" : money.color ?? ""}
          amount={Number(money.amount - branchesDemandedAmounts)}
          settings={{ sign: true }}
        />
      ) : (
        <Amount
          className={`${darken}`}
          color={money.color ?? ""}
          amount={money.amount}
          settings={{ sign: true }}
        />
      )}
    </div>
  );
}

export function MoneyActions({ children }: { children: React.ReactNode }) {
  return <div className={`flex flex-row gap-6 mt-4`}>{children}</div>;
}

export function MoneyDeleteBtn() {
  const { money, deleting, setDeleting, currentTotal, specific } =
    useMoneyBarContext();
  const queryClient = useQueryClient();
  const listState = useListState();
  const darken = useDarkenColor(money.color ?? "");
  async function deleteMoney() {
    setDeleting(true);
    await delete_money(money, currentTotal);
    if (specific) {
      queryClient.resetQueries({ queryKey: [String(money.id)] });
    }

    if (listState.transferrings) {
      const root = listState.transferrings?.root;
      const isRoot = root?.id === money.id;
      const isInBranch = listState.transferrings?.branches.find(
        (b) => b.id === money.id
      );
      const branches = listState.transferrings.branches.filter(
        (b) => b.id !== money.id
      );
      if (isInBranch)
        listState.setState({
          ...listState,
          transferrings: {
            ...listState.transferrings,
            branches,
          },
        });
      if (isRoot)
        listState.setState({
          ...listState,
          transferrings: null,
        });
    }

    queryClient.invalidateQueries({
      queryKey: ["list"],
    });
    queryClient.invalidateQueries({
      queryKey: [String(money.id)],
    });
    queryClient.invalidateQueries({ queryKey: ["logs"] });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          disabled={deleting}
          className="rounded-full size-6 aspect-square"
          variant={"ghost"}
        >
          <Trash
            className={`${darken}`}
            style={{ color: money.color ?? "" }}
            size={16}
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            <p>This action cannot be undone.</p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-4 pt-0 text-sm">
          <div className="flex items-center justify-between border py-2 px-6 rounded-full">
            <p>{money.name}</p>
            <Amount
              amount={money.amount}
              settings={{ sign: true }}
              className="text-lg"
            />
          </div>
          <DialogClose asChild disabled={deleting}>
            <Button
              className="rounded-full w-full"
              onClick={deleteMoney}
              variant={"destructive"}
              disabled={deleting}
            >
              Confirm Delete
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MoneyExternalLinkBtn() {
  const { money } = useMoneyBarContext();
  const darken = useDarkenColor(money.color ?? "");

  return (
    <Button
      size={"icon"}
      className="rounded-full size-6 aspect-square"
      variant={"ghost"}
      asChild
    >
      <Link
        href={`/list/money/${money.id}`}
        className="rounded-full h-fit aspect-square"
      >
        <ExternalLink
          className={`${darken}`}
          style={{ color: money.color ?? "hsl(var(--foreground))" }}
          size={16}
        />
      </Link>
    </Button>
  );
}
export function MoneyEditBtn() {
  const { money, currentTotal } = useMoneyBarContext();
  const queryClient = useQueryClient();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const darken = useDarkenColor(money.color ?? "");

  function done() {
    setOpenEditDialog(false);
    queryClient.invalidateQueries({
      queryKey: ["list"],
    });
    queryClient.invalidateQueries({
      queryKey: [String(money.id)],
    });
    queryClient.invalidateQueries({ queryKey: ["logs"] });
  }
  return (
    <Dialog onOpenChange={setOpenEditDialog} open={openEditDialog}>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          className="rounded-full size-6 aspect-square"
          variant={"ghost"}
        >
          <Edit
            className={`${darken}`}
            style={{ color: money.color ?? "hsl(var(--foreground))" }}
            size={16}
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit money</DialogTitle>
          <DialogDescription>
            <p>Edit the progress of this money.</p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-4 pt-0 text-sm">
          <EditMoneyForm
            currentTotal={currentTotal}
            money={money}
            done={done}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MoneyPaletteBtn() {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { money, specific, currentTotal } = useMoneyBarContext();
  const [colorPreview, setColorPreview] = useState(money.color);
  const queryClient = useQueryClient();
  const darken = useDarkenColor(money.color ?? "");

  async function colorize(c: string) {
    await colorize_money(money, c);
    setOpenEditDialog(false);
    queryClient.invalidateQueries({
      queryKey: ["list"],
    });
    queryClient.invalidateQueries({
      queryKey: [String(money.id)],
    });
    queryClient.invalidateQueries({ queryKey: ["logs"] });
  }
  return (
    <Dialog onOpenChange={setOpenEditDialog} open={openEditDialog}>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          className="rounded-full size-6 aspect-square"
          variant={"ghost"}
        >
          <Palette
            className={`${darken}`}
            style={{ color: money.color ?? "hsl(var(--foreground))" }}
            size={16}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[75%] gap-0">
        <DialogHeader>
          <DialogTitle>Colorize money</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-0 text-sm">
          <Money
            currentTotal={currentTotal}
            specific={specific}
            money={{ ...money, color: colorPreview }}
          >
            <MoneyBar className="p-4">
              <MoneyHeader />
              <MoneyAmount />
            </MoneyBar>
          </Money>
          <div className="grid grid-cols-18 gap-1 px-4 w-full">
            {Object.values(colors).map((color, i) => {
              return (
                <div key={i}>
                  {Object.values(color).map((c) => {
                    return (
                      <button
                        onClick={() => setColorPreview(c)}
                        className={`rounded-full w-full aspect-square ${
                          c === money.color && "border-4 border-primary"
                        } ${
                          c === colorPreview && "border-4 border-primary/50"
                        }`}
                        style={{ backgroundColor: c }}
                        key={c}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="px-4 pb-4 w-full flex flex-col gap-4">
            <Button
              onClick={() => colorize("")}
              className="rounded-full w-full"
              variant={"secondary"}
            >
              Set Default
            </Button>
            <Button
              onClick={() => colorize(colorPreview ?? "")}
              className={`rounded-full w-full`}
              disabled={money.color === colorPreview}
            >
              Update Color
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MoneyTransferBtn() {
  const { money } = useMoneyBarContext();
  const listState = useListState();
  const darken = useDarkenColor(money.color ?? "");

  const isRoot = listState.transferrings?.root.id === money.id;
  const isInBranch = listState.transferrings?.branches.find(
    (b) => b.id === money.id
  );

  function transfer() {
    if (!listState.transferrings)
      return listState.setState({
        ...listState,
        transferrings: {
          root: { ...money, transferAmount: 0 },
          branches: [],
        },
      });

    if (isRoot)
      return listState.setState({ ...listState, transferrings: null });

    if (isInBranch) {
      const branches = listState.transferrings.branches.filter(
        (b) => b.id !== money.id
      );

      return listState.setState({
        ...listState,
        transferrings: {
          ...listState.transferrings,
          branches,
        },
      });
    }

    listState.setState({
      ...listState,
      transferrings: {
        ...listState.transferrings,
        branches: [
          ...listState.transferrings.branches,
          { ...money, transferAmount: 0 },
        ],
      },
    });
  }

  return (
    <Button
      size={"icon"}
      className="rounded-full size-6 aspect-square"
      variant={"ghost"}
      onClick={transfer}
    >
      {isRoot ? (
        <Split className={`text-orange-400`} size={16} />
      ) : isInBranch ? (
        <ArrowUpToLine className={`text-blue-400 rotate-180`} size={16} />
      ) : (
        <ArrowRightLeft
          className={`${darken}`}
          style={{ color: money.color ?? "hsl(var(--foreground))" }}
          size={16}
        />
      )}
    </Button>
  );
}
