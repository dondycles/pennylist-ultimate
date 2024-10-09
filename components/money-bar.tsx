"use client";

import { MoneyWithLogs } from "@/drizzle/infered-types";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import Amount from "./amount";
import { Dot, Edit, ExternalLink, Palette, Trash } from "lucide-react";
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
      style={{
        borderBottomColor: money.color ?? "hsl(var(--border))",
        borderBottomWidth: "1px",
      }}
      className={cn(
        `w-full p-4 flex flex-col gap-2 ${
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
  return (
    <div key={money.color} className={`flex items-baseline gap-2`}>
      <span
        className={`font-bold ${darken}`}
        style={{ color: money.color ?? "" }}
      >
        {money.name}
      </span>
      <Dot size={12} />
      <span className="text-muted-foreground text-xs">
        {new Date(money.created_at).toLocaleDateString()}
      </span>
    </div>
  );
}

export function MoneyAmount() {
  const { money } = useMoneyBarContext();
  const darken = useDarkenColor(money.color ?? "");
  return (
    <Amount
      className={`${darken}`}
      color={money.color ?? ""}
      amount={money.amount}
      settings={{ sign: true }}
    />
  );
}

export function MoneyActions({ children }: { children: React.ReactNode }) {
  return <div className={`flex flex-row gap-6 mt-4`}>{children}</div>;
}

export function MoneyDeleteBtn() {
  const { money, deleting, setDeleting, currentTotal, specific } =
    useMoneyBarContext();
  const queryClient = useQueryClient();
  const darken = useDarkenColor(money.color ?? "");
  async function deleteMoney() {
    setDeleting(true);
    await delete_money(money, currentTotal);
    if (specific) {
      queryClient.resetQueries({ queryKey: [String(money.id)] });
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
          style={{ color: money.color ?? "" }}
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
            style={{ color: money.color ?? "" }}
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
            style={{ color: money.color ?? "" }}
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
                        className={`rounded-full w-full aspect-square z-0 hover:z-50 hover:scale-125 scale-100 ease-in-out duration-150 transition-all ${
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
