"use client";

import { MoneyWithLogs } from "@/drizzle/infered-types";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import Amount from "./amount";
import {
  ArrowRightLeft,
  ArrowUpToLine,
  Check,
  ChevronUp,
  CornerRightDown,
  Dot,
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
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { colorize_money, delete_money } from "@/app/actions/moneys";
import { AnimatePresence, motion as m } from "framer-motion";
import EditMoneyForm from "./forms/edit-money";
import { useQueryClient } from "@tanstack/react-query";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { colors } from "@/lib/colors";
import { useDarkenColor } from "@/hooks/useDarkenColor";
import { ListState, MoneyTransfer, useListState } from "@/store";
import { Input } from "./ui/input";
import _ from "lodash";
import { Textarea } from "./ui/textarea";
import { add_money_note, delete_money_note } from "@/app/actions/moneys-notes";
import { ScrollArea } from "./ui/scroll-area";

type MoneyBarProps = PropsWithChildren & {
  money: Omit<MoneyWithLogs, "money_log">;
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
      transferState: {
        root: MoneyTransfer | null;
        branch: MoneyTransfer | null;
        isRoot: boolean;
        isInBranch: boolean;
        branchesDemandedAmounts: number;
        isRootNegative: boolean;
      };
      listState: ListState;
      transfer: () => void;
    }
  | undefined
>(undefined);

function useMoneyBarContext() {
  const context = useContext(MoneyBarContext);
  if (!context) throw new Error("Money context missing!");
  return context;
}

function useMoneyTransferringDetails(
  listState: ListState,
  money: Omit<MoneyWithLogs, "money_log">
) {
  const root = listState.transferrings?.root ?? null;
  const branch =
    listState.transferrings?.branches.find((b) => b.id === money.id) ?? null;
  const isRoot = root?.id === money.id;
  const isInBranch = Boolean(
    listState.transferrings?.branches.find((b) => b.id === money.id)
  );
  const branchesDemandedAmounts = _.sum(
    listState.transferrings?.branches.map((b) => b.transferAmount)
  );
  const isRootNegative = (root?.amount ?? 0) - branchesDemandedAmounts < 0;
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
  const listState = useListState();
  const transferState = useMoneyTransferringDetails(listState, money);
  function transfer() {
    if (!listState.transferrings)
      return listState.setState({
        ...listState,
        transferrings: {
          root: { ...money, transferAmount: 0, reason: "", fee: 0 },
          branches: [],
        },
      });

    if (transferState.isRoot)
      return listState.setState({ ...listState, transferrings: null });

    if (transferState.isInBranch) {
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
          { ...money, transferAmount: 0, reason: "", fee: 0 },
        ],
      },
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
        transferState,
        listState,
        commenting,
        setCommenting,
        transfer,
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
  const { money, deleting } = useMoneyBarContext();
  return (
    <m.div
      layout
      key={`${money.id}-${money.last_update}  `}
      className={cn(
        `w-full pt-4 flex flex-col gap-2 border-b last:border-b-0 ${
          deleting && "animate-pulse scale-95"
        }`,
        className
      )}
    >
      {children}
    </m.div>
  );
}

export function MoneyHeader() {
  const { money, darken } = useMoneyBarContext();
  const color = [
    money.color ? money.color + "88" : "hsl(var(--muted-foreground))",
    money.color ?? "hsl(var(--foreground))",
  ];
  return (
    <m.div
      layout
      key={`${money.id}-${money.color}`}
      className={`flex items-baseline gap-2 h-fit px-4`}
    >
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
        {new Date(money.created_at).toLocaleDateString()}
      </span>
      {/* {isRoot && (
        <CornerRightDown size={16} className="text-muted-foreground" />
      )} */}
    </m.div>
  );
}

export function MoneyAmount() {
  const {
    listState,
    money,
    darken,
    transferState: {
      isInBranch,
      isRoot,
      isRootNegative,
      root,
      branch,
      branchesDemandedAmounts,
    },
  } = useMoneyBarContext();

  return (
    <m.div
      key={`amount-${money.id}`}
      layout
      className="flex flex-col w-full overflow-hidden px-4 pb-1 -mb-1"
    >
      <m.div layout>
        <Amount
          className={`${darken}`}
          color={isRootNegative ? "hsl(var(--destructive))" : money.color ?? ""}
          amount={Number(
            money.amount +
              (isInBranch
                ? branch?.transferAmount ?? 0
                : isRoot
                ? -branchesDemandedAmounts
                : 0)
          )}
          settings={{ sign: true }}
        />
      </m.div>
      <AnimatePresence initial={false}>
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
                  if (!Number(v.currentTarget.value))
                    return listState.setTransfereesState(
                      0,
                      money.id,
                      branch?.reason ?? "",
                      branch?.fee ?? 0
                    );
                  listState.setTransfereesState(
                    Number(v.target.value),
                    money.id,
                    branch?.reason ?? "",
                    branch?.fee ?? 0
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
                    if (!Number(v.currentTarget.value))
                      return listState.setTransfereesState(
                        branch?.transferAmount ?? 0,
                        money.id,
                        branch?.reason ?? "",
                        0
                      );
                    listState.setTransfereesState(
                      branch?.transferAmount ?? 0,
                      money.id,
                      branch?.reason ?? "",
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
                    listState.setTransfereesState(
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
                  Receiving transfer fee (optional)
                </p>
                <Input
                  type="number"
                  min={0}
                  value={Number(root?.fee) <= 0 ? undefined : root?.fee ?? 0}
                  onChange={(v) => {
                    if (!Number(v.currentTarget.value))
                      return listState.setRootState(
                        root!.id,
                        root?.reason ?? "",
                        0
                      );
                    listState.setRootState(
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
                    listState.setRootState(
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

export function MoneyActions({ children }: { children: React.ReactNode }) {
  const {
    money,
    listState,
    transferState,
    commenting,
    transfer,
    setCommenting,
  } = useMoneyBarContext();
  const [note, setNote] = useState("");
  const queryClient = useQueryClient();
  async function add_note() {
    if (note.trim() === "") return;
    await add_money_note(note, money.id);
    queryClient.invalidateQueries({
      queryKey: ["list"],
    });
    queryClient.invalidateQueries({
      queryKey: [String(money.id)],
    });
    setNote("");
  }
  async function delete_note(id: number) {
    await delete_money_note(id);
    queryClient.invalidateQueries({
      queryKey: ["list"],
    });
    queryClient.invalidateQueries({
      queryKey: [String(money.id)],
    });
  }
  return (
    <m.div
      key={`actions-${money.id}-${
        listState.transferrings?.branches.length
      }-${String(transferState.isInBranch)}-${String(transferState.isRoot)}`}
      animate={{ opacity: 1, translateX: -0 }}
      initial={{ opacity: 0, translateX: -10 }}
      exit={{ opacity: 0, translateX: -10 }}
      className={`flex flex-col h-fit overflow-hidden mt-2 px-4 -mb-1 pb-4`}
      layout
    >
      <m.div layout className={`flex flex-row gap-6 mb-1 items-center`}>
        {(transferState.isRoot || transferState.isInBranch) && (
          <Button
            onClick={transfer}
            variant={"destructive"}
            className="size-6 p-0 rounded-full aspect-square -mr-5"
          >
            <X size={16} />
          </Button>
        )}
        {children}

        {(transferState.isRoot || transferState.isInBranch) && (
          <span className="-ml-5 text-xs text-muted-foreground">
            {transferState.isInBranch && "Receiver"}
            {transferState.isRoot && "Sender"}
          </span>
        )}
      </m.div>
      <AnimatePresence>
        {commenting && (
          <m.div
            layout
            initial={"close"}
            animate={"open"}
            exit={"close"}
            variants={variants}
            key={"commenting"}
            className="mb-1 flex flex-col  bg-[#171717] rounded-3xl overflow-hidden"
          >
            {money.money_note.length > 0 ? (
              <ScrollArea className="w-full h-[30dvh]">
                {money.money_note.map((note, i) => {
                  return (
                    <m.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                      key={`${note.id}-${i}`}
                      className="p-4 pb-0 last:mb-4"
                    >
                      <div className="rounded-3xl prose max-w-none text-muted-foreground p-4 bg-muted/50 border">
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
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

export function MoneyDeleteBtn() {
  const {
    money,
    deleting,
    setDeleting,
    currentTotal,
    specific,
    listState,
    darken,
  } = useMoneyBarContext();
  const queryClient = useQueryClient();
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

    listState.setState({ ...listState, transferrings: null });
  }
  if (listState.transferrings === null)
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
              className={`border flex items-center justify-between py-2 px-6 rounded-full ${darken}`}
            >
              <p className="font-bold">{money.name}</p>
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
  const { money, listState, darken } = useMoneyBarContext();
  if (listState.transferrings === null)
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
          
          ${
            listState.transferrings !== null && "pointer-events-none opacity-50"
          }`}
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
  const { money, currentTotal, darken, listState } = useMoneyBarContext();
  const queryClient = useQueryClient();
  const [openEditDialog, setOpenEditDialog] = useState(false);

  function done() {
    setOpenEditDialog(false);
    queryClient.invalidateQueries({
      queryKey: ["list"],
    });
    queryClient.invalidateQueries({
      queryKey: [String(money.id)],
    });
    queryClient.invalidateQueries({ queryKey: ["logs"] });

    listState.setState({ ...listState, transferrings: null });
  }
  if (listState.transferrings === null)
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
  const { money, specific, currentTotal, listState, darken } =
    useMoneyBarContext();
  const [colorPreview, setColorPreview] = useState(money.color);
  const queryClient = useQueryClient();

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

    listState.setState({ ...listState, transferrings: null });
  }
  if (listState.transferrings === null)
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
    transferState: { isRoot, isInBranch },
    transfer,
  } = useMoneyBarContext();

  return (
    <Button
      size={"icon"}
      className="size-6 aspect-square disabled:opacity-100"
      variant={"ghost"}
      onClick={!isRoot || !isInBranch ? transfer : () => {}}
      disabled={isRoot || isInBranch}
    >
      {isRoot ? (
        <CornerRightDown className={`text-yellow-400`} size={16} />
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

export function MoneyCommentBtn() {
  const { money, darken, setCommenting, commenting, listState } =
    useMoneyBarContext();
  if (listState.transferrings === null)
    return (
      <Button
        onClick={() => setCommenting(!commenting)}
        size={"icon"}
        className="size-6 aspect-square relative"
        variant={"ghost"}
      >
        <m.div
          animate={{
            height: 36,
            opacity: commenting ? 1 : 0,
          }}
          transition={{
            delay: commenting ? 0.1 : 0,
            duration: commenting ? 0.25 : 0.1,
          }}
          className="absolute p-4 -bottom-3 w-6 bg-gradient-to-t from-[#141414] to-transparent z-0 rounded-t-full"
        />
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
