"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import Amount from "./amount";
import {
  ArrowRightLeft,
  Check,
  ChevronUp,
  Dot,
  Ellipsis,
  ExternalLink,
  MessageCircleMore,
  MessageCirclePlus,
  Palette,
  Pencil,
  Trash,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { AnimatePresence, motion as m } from "framer-motion";
import EditMoneyForm from "./forms/edit-money";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { colors } from "@/lib/colors";
import { useDarkenColor } from "@/hooks/useDarkenColor";
import {
  ListState,
  type Money,
  MoneysStore,
  MoneyTransfer,
  TransferState,
  useListState,
  useLogsStore,
  useMoneysStore,
  useTransferState,
} from "@/store";
import { Input } from "./ui/input";
import _ from "lodash";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type MoneyBarProps = PropsWithChildren & {
  money: Money;
  specific: boolean;
  currentTotal: number;
};

const variants = {
  close: {
    height: 0,
    opacity: 0,
    marginTop: 0,
  },
  open: {
    height: "auto",
    opacity: 1,
    marginTop: 8,
  },
};

const MoneyBarContext = createContext<
  | {
      money: MoneyBarProps["money"];
      deleting: boolean;
      setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
      commenting: boolean;
      setCommenting: React.Dispatch<React.SetStateAction<boolean>>;
      specific: boolean;
      currentTotal: number;
      darken: string;
      transferDetails: {
        root: MoneyTransfer | null;
        branch: MoneyTransfer | null;
        isRoot: boolean;
        isInBranch: boolean;
        branchesDemandedAmounts: number;
        isRootNegative: boolean;
      };
      transferState: TransferState;
      listState: ListState;
      transfer: () => void;
      moneysStore: MoneysStore;
    }
  | undefined
>(undefined);

function useMoneyBarContext() {
  const context = useContext(MoneyBarContext);
  if (!context) throw new Error("Money context missing!");
  return context;
}

function useMoneyTransferringDetails(
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

  const isRootNegative =
    (root?.amount ?? 0) - (root?.fee ?? 0) - branchesDemandedAmounts < 0;
  return {
    root,
    branch,
    isRoot,
    isInBranch,
    branchesDemandedAmounts,
    isRootNegative,
  };
}

export function Money({
  children,
  money,
  specific,
  currentTotal,
}: MoneyBarProps) {
  const [deleting, setDeleting] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const darken = useDarkenColor(money.color ?? "");
  const transferState = useTransferState();
  const listState = useListState();
  const moneysStore = useMoneysStore();
  const transferDetails = useMoneyTransferringDetails(
    transferState.transferrings,
    money
  );
  function transfer() {
    if (!transferState.transferrings)
      return transferState.setTransferrings({
        root: { ...money, transferAmount: 0, reason: "", fee: 0 },
        branches: [],
      });

    if (transferDetails.isRoot) return transferState.setTransferrings(null);

    if (transferDetails.isInBranch) {
      const branches = transferState.transferrings.branches.filter(
        (b) => b.id !== money.id
      );

      return transferState.setTransferrings({
        ...transferState.transferrings,
        branches,
      });
    }

    transferState.setTransferrings({
      ...transferState.transferrings,
      branches: [
        ...transferState.transferrings.branches,
        { ...money, transferAmount: 0, reason: "", fee: 0 },
      ],
    });
  }

  return (
    <MoneyBarContext.Provider
      value={{
        money,
        deleting,
        setDeleting,
        specific,
        currentTotal,
        darken,
        transferDetails,
        commenting,
        setCommenting,
        transfer,
        transferState,
        listState,
        moneysStore,
      }}
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
  const {
    money,
    deleting,
    commenting,
    setCommenting,
    transferDetails: { isInBranch, isRoot, root, branch },
    listState,
    transferState: { setBranchState, setRootState },
  } = useMoneyBarContext();
  const { addNote, delNote } = useMoneysStore();
  const [note, setNote] = useState("");
  async function add_note() {
    if (note.trim() === "") return;
    addNote(money.id, {
      created_at: new Date().toISOString(),
      id: crypto.randomUUID(),
      note,
    });

    setNote("");
  }
  async function delete_note(id: string) {
    delNote(money.id, id);
  }
  return (
    <m.div
      layout
      key={`${money.id}-${money.last_updated_at}-${listState.compactMoney}-${listState.hidden}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        `w-full overflow-hidden p-4 flex flex-col border-b last:border-b-0 ${
          deleting && "animate-pulse scale-95"
        }`,
        className
      )}
    >
      {listState.compactMoney ? (
        <div className="flex flex-row items-center justify-between gap-4 flex-1">
          {children}
        </div>
      ) : (
        children
      )}

      <AnimatePresence initial={false}>
        {commenting && (
          <m.div
            layout
            initial={"close"}
            animate={"open"}
            exit={"close"}
            variants={variants}
            key={"commenting"}
          >
            <div className="flex flex-col border rounded-3xl overflow-hidden">
              {money.notes.length > 0 ? (
                <ScrollArea className="w-full h-[30dvh]">
                  {money.notes.map((note, i) => {
                    return (
                      <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                        key={`${note.id}-${i}`}
                        className="p-4 pb-0 last:mb-4"
                      >
                        <div className="rounded-3xl prose max-w-none text-muted-foreground p-4 bg-muted">
                          <span className="text-xs opacity-25">
                            {new Date(note.created_at).toLocaleDateString()}
                          </span>
                          <p className="whitespace-pre-wrap">{note.note}</p>
                          <CommentDeleteBtn
                            _delete={() => delete_note(note.id)}
                          />
                        </div>
                      </m.div>
                    );
                  })}
                </ScrollArea>
              ) : (
                <m.p
                  key={"no-notes"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                  className="text-xs text-muted-foreground text-center p-4"
                >
                  no notes yet
                </m.p>
              )}{" "}
              <form
                action={add_note}
                className="flex gap-4 items-end border-t p-4 flex-1 "
              >
                <Textarea
                  value={note}
                  onChange={(v) => setNote(v.currentTarget.value)}
                  className="flex-1 "
                  placeholder="Notes, comments, hmm...? "
                  rows={3}
                />
                <div className="flex flex-col gap-4">
                  <Button
                    variant={"ghost"}
                    className="size-6 p-0"
                    type="submit"
                    size={"icon"}
                  >
                    <MessageCirclePlus size={16} />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCommenting(false)}
                    variant={"ghost"}
                    size={"icon"}
                    className="size-6 p-0"
                  >
                    <ChevronUp size={16} />
                  </Button>
                </div>
              </form>
            </div>
          </m.div>
        )}

        {isInBranch ? (
          <m.div
            layout
            initial={"close"}
            animate={"open"}
            exit={"close"}
            variants={variants}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            key={"branch"}
            className="flex flex-col gap-4"
          >
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-xs">
                Receiving from {root?.name}
              </p>
              <Input
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
                placeholder={`Amount to receive from ${root?.name}`}
              />
            </div>
            <div className="flex flex-col xs:flex-row xs:items-end gap-4">
              <div className="space-y-1.5 flex-1 xs:max-w-32">
                <p className="text-muted-foreground text-xs truncate">
                  Receiving transfer fee (optional)
                </p>
                <Input
                  type="number"
                  min={0}
                  value={
                    Number(branch?.fee) <= 0 ? undefined : branch?.fee ?? 0
                  }
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
                  placeholder={`Fee (optional)`}
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="text-muted-foreground text-xs">
                  Reason (optional)
                </p>
                <Input
                  value={branch?.reason ?? ""}
                  onChange={(v) =>
                    setBranchState(
                      branch?.transferAmount ?? 0,
                      money.id,
                      v.currentTarget.value,
                      branch?.fee ?? 0
                    )
                  }
                  placeholder="Reason (optional)"
                />
              </div>
            </div>
          </m.div>
        ) : isRoot ? (
          <m.div
            layout
            initial={"close"}
            animate={"open"}
            exit={"close"}
            variants={variants}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            key={"root"}
          >
            <div className="flex flex-col xs:flex-row xs:items-end gap-4">
              <div className="space-y-1.5 flex-1 xs:max-w-32">
                <p className="text-muted-foreground text-xs truncate">
                  Sender transfer fee (optional)
                </p>
                <Input
                  type="number"
                  min={0}
                  value={Number(root?.fee) <= 0 ? undefined : root?.fee ?? 0}
                  onChange={(v) => {
                    if (!Number(v.currentTarget.value))
                      return setRootState(root!.id, root?.reason ?? "", 0);
                    setRootState(
                      root!.id,
                      root?.reason ?? "",
                      Number(v.target.value)
                    );
                  }}
                  placeholder={`Fee (optional)`}
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="text-muted-foreground text-xs">
                  Reason (optional)
                </p>
                <Input
                  value={root?.reason ?? ""}
                  onChange={(v) =>
                    setRootState(
                      root!.id,
                      v.currentTarget.value,
                      root?.fee ?? 0
                    )
                  }
                  placeholder="Reason (optional)"
                />
              </div>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </m.div>
  );
}

export function MoneyHeader() {
  const {
    money,
    darken,
    listState: { compactMoney },
  } = useMoneyBarContext();
  const color = [
    money.color ? money.color + "88" : "hsl(var(--muted-foreground))",
    money.color ?? "hsl(var(--foreground))",
  ];
  return (
    <m.div
      layout
      key={`${money.id}-${money.color}`}
      className={`flex items-baseline gap-2 h-fit  ${
        compactMoney && "flex-1 truncate"
      }`}
    >
      {compactMoney ? (
        <m.p
          layout
          className={`font-bold ${darken} `}
          style={{ color: color[1] }}
        >
          {money.name}
        </m.p>
      ) : (
        <>
          <m.p
            layout
            className={`font-bold ${darken} `}
            style={{ color: color[1] }}
          >
            {money.name}
          </m.p>
          <Dot
            style={{
              color: color[0],
            }}
            size={12}
          />
          <m.p
            layout
            style={{
              color: color[0],
            }}
            className=" text-xs"
          >
            {new Date(money.created_at).toLocaleDateString()}
          </m.p>
        </>
      )}
    </m.div>
  );
}

export function MoneyAmount() {
  const {
    money,
    darken,
    transferDetails: {
      isInBranch,
      isRoot,
      isRootNegative,
      root,
      branch,
      branchesDemandedAmounts,
    },
  } = useMoneyBarContext();

  const isBranchNegative =
    Number(branch?.transferAmount ?? 0) - Number(branch?.fee ?? 0) < 0;

  return (
    <m.div
      key={`amount-${money.id}`}
      layout
      className="flex flex-col overflow-hidden "
    >
      <Amount
        className={`${darken} text-base`}
        color={
          isRootNegative
            ? "hsl(var(--destructive))"
            : isBranchNegative
            ? "hsl(var(--destructive))"
            : money.color ?? ""
        }
        amount={Number(
          money.amount +
            (isInBranch
              ? Number(branch?.transferAmount ?? 0) - Number(branch?.fee ?? 0)
              : isRoot
              ? Number(-branchesDemandedAmounts) - Number(root?.fee ?? 0)
              : 0)
        )}
        settings={{ sign: true }}
      />
    </m.div>
  );
}

export function MoneyActions({ children }: { children: React.ReactNode }) {
  const {
    money,
    transferDetails,
    transfer,
    commenting,
    listState,
    transferState: { transferrings },
  } = useMoneyBarContext();
  return (
    <div
      key={`actions-${money.id}-${transferrings?.branches.length}-${String(
        transferDetails.isInBranch
      )}-${String(transferDetails.isRoot)}-${commenting}`}
      className={`shrink-0 flex flex-coloverflow-hidden ${
        listState.compactMoney ? "aspect-square size-6" : "mt-4 h-fit"
      }`}
    >
      {!listState.compactMoney ? (
        <div className={`flex flex-row gap-6 items-center`}>{children}</div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {commenting ? (
              <MoneyCommentBtn />
            ) : transferDetails.root ? (
              <MoneyTransferBtn />
            ) : (
              <Button variant={"ghost"} className="size-6 p-0 ">
                <Ellipsis size={16} />
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-3xl" align="end">
            <div className={`flex flex-row gap-6 items-center`}>
              {(transferDetails.isRoot || transferDetails.isInBranch) && (
                <Button
                  onClick={transfer}
                  variant={"destructive"}
                  className="size-6 p-0 rounded-full aspect-square -mr-5"
                >
                  <X size={16} />
                </Button>
              )}
              {children}
              {(transferDetails.isRoot || transferDetails.isInBranch) && (
                <span className="-ml-5 text-xs text-muted-foreground">
                  {transferDetails.isInBranch && "Receiver"}
                  {transferDetails.isRoot && "Sender"}
                </span>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export function MoneyDeleteBtn() {
  const {
    money,
    deleting,
    setDeleting,
    darken,
    transferState: { transferrings, setTransferrings },
    moneysStore: { delMoney, moneys, totalMoneys },
  } = useMoneyBarContext();
  const { addLog } = useLogsStore();
  async function deleteMoney() {
    setDeleting(true);
    delMoney(money.id);

    addLog({
      changes: {
        prev: { ...money, total: totalMoneys(moneys) },
        latest: {
          ...money,
          amount: 0,
          total: totalMoneys(moneys) - money.amount,
        },
      },
      action: "delete",
      created_at: new Date().toISOString(),
      current_total: totalMoneys(moneys) - money.amount,
      id: crypto.randomUUID(),
      money_id: money.id,
      reason: "delete",
      money_name: money.name,
    });

    if (transferrings) {
      const root = transferrings?.root;
      const isRoot = root?.id === money.id;
      const isInBranch = transferrings?.branches.find((b) => b.id === money.id);
      const branches = transferrings.branches.filter((b) => b.id !== money.id);
      if (isInBranch)
        setTransferrings({
          ...transferrings,
          branches,
        });
      if (isRoot) setTransferrings(null);
    }

    setTransferrings(null);
  }
  if (transferrings === null)
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size={"icon"}
            disabled={deleting}
            className="size-6 aspect-square"
            variant={"ghost"}
          >
            <Trash
              className={`${darken}`}
              style={{ color: money.color ?? "" }}
              size={16}
            />
          </Button>
        </DialogTrigger>

        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              <p>This action cannot be undone.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 p-4 pt-0 text-sm">
            <div
              style={{
                borderColor: money.color ?? "hsl(var(--border))",
                color: money.color ?? "hsl(var(--foreground))",
              }}
              className={`border flex-1 flex gap-4 items-center justify-between py-2 px-6 rounded-full ${darken}`}
            >
              <p className="font-bold ">{money.name}</p>
              <Amount
                amount={money.amount}
                settings={{ sign: true }}
                className="text-lg"
              />
            </div>
            <DialogClose asChild disabled={deleting}>
              <Button
                className="w-full"
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
  const {
    money,
    darken,
    transferState: { transferrings },
  } = useMoneyBarContext();
  if (transferrings === null)
    return (
      <Button
        size={"icon"}
        className="size-6 aspect-square "
        variant={"ghost"}
        asChild
      >
        <Link
          href={`/list/money/${money.id}`}
          className={`rounded-full h-fit aspect-square 
          
          ${transferrings !== null && "pointer-events-none opacity-50"}`}
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
  const {
    money,
    darken,
    transferState: { transferrings, setTransferrings },
  } = useMoneyBarContext();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  function done() {
    setOpenEditDialog(false);

    setTransferrings(null);
  }
  if (transferrings === null)
    return (
      <Dialog onOpenChange={setOpenEditDialog} open={openEditDialog}>
        <DialogTrigger asChild>
          <Button
            size={"icon"}
            className="size-6 aspect-square"
            variant={"ghost"}
          >
            <Pencil
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
            <EditMoneyForm money={money} done={done} />
          </div>
        </DialogContent>
      </Dialog>
    );
}

export function MoneyPaletteBtn() {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const {
    money,
    specific,
    currentTotal,
    darken,
    transferState: { setTransferrings, transferrings },
    moneysStore: { setMoneyColor },
  } = useMoneyBarContext();
  const [colorPreview, setColorPreview] = useState(money.color);
  async function colorize(c: string) {
    setMoneyColor(money.id, c);
    setOpenEditDialog(false);
    setTransferrings(null);
  }
  if (transferrings === null)
    return (
      <Dialog onOpenChange={setOpenEditDialog} open={openEditDialog}>
        <DialogTrigger asChild>
          <Button
            size={"icon"}
            className="size-6 aspect-square"
            variant={"ghost"}
          >
            <Palette
              className={`${darken}`}
              style={{ color: money.color ?? "hsl(var(--foreground))" }}
              size={16}
            />
          </Button>
        </DialogTrigger>

        <DialogOverlay />
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
                className="w-full"
                variant={"secondary"}
              >
                Set Default
              </Button>
              <Button
                onClick={() => colorize(colorPreview ?? "")}
                className="w-full"
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
  const {
    money,
    darken,
    transferDetails: { isRoot, isInBranch },
    transfer,
    listState: { compactMoney },
  } = useMoneyBarContext();
  return (
    <Button
      size={"icon"}
      className={`rounded-full ${
        isRoot || isInBranch
          ? compactMoney
            ? "size-6 aspect-square"
            : "h-6 px-2 w-fit"
          : "size-6 aspect-square"
      } w-fit gap-1 disabled:opacity-100`}
      variant={isRoot || isInBranch ? "secondary" : "ghost"}
      onClick={transfer}
    >
      {isRoot ? (
        <>
          {!compactMoney && (
            <span className="text-muted-foreground text-xs">Sender</span>
          )}
          <X className={`text-destructive`} size={16} />
        </>
      ) : isInBranch ? (
        <>
          {!compactMoney && (
            <span className="text-muted-foreground text-xs">Receiver</span>
          )}
          <X className={`text-destructive`} size={16} />
        </>
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

export function MoneyCommentBtn() {
  const {
    money,
    darken,
    setCommenting,
    commenting,
    transferState: { transferrings },
  } = useMoneyBarContext();
  if (transferrings === null)
    return (
      <Button
        onClick={() => setCommenting(!commenting)}
        size={"icon"}
        className="size-6 aspect-square relative"
        variant={"ghost"}
      >
        <MessageCircleMore
          className={`${darken} z-10`}
          style={{ color: money.color ?? "hsl(var(--foreground))" }}
          size={16}
        />
      </Button>
    );
}

function CommentDeleteBtn({ _delete }: { _delete: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div className="flex gap-4 justify-end mt-1">
      {confirmDelete ? (
        <>
          <Button
            onClick={() => _delete()}
            className="size-6 p-0"
            variant={"ghost"}
          >
            <Check className="text-destructive" size={16} />
          </Button>
          <Button
            onClick={() => setConfirmDelete(false)}
            className="size-6 p-0"
          >
            <X size={16} />
          </Button>
        </>
      ) : (
        <Button
          onClick={() => setConfirmDelete(true)}
          className="size-6 p-0"
          variant={"ghost"}
        >
          <Trash className="text-destructive" size={16} />
        </Button>
      )}
    </div>
  );
}
