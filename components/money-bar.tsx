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
import { useListState } from "@/store";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { colors } from "@/lib/colors";

type MoneyBarProps = PropsWithChildren & {
  money: MoneyWithLogs;
};

const MoneyBarContext = createContext<
  | {
      money: MoneyBarProps["money"];
      deleting: boolean;
      setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

function useMoneyBarContext() {
  const context = useContext(MoneyBarContext);
  if (!context) throw new Error("Money context missing!");
  return context;
}

export function Money({ children, money }: MoneyBarProps) {
  const [deleting, setDeleting] = useState(false);
  return (
    <MoneyBarContext.Provider value={{ money, deleting, setDeleting }}>
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
      style={{ backgroundColor: money.color + "20" }}
      className={cn(
        `border-b w-full p-6 flex flex-col gap-2 ${
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
  return (
    <div className={`flex items-baseline gap-2`}>
      <span className={`font-bold`} style={{ color: money.color ?? "" }}>
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
  const { hidden } = useListState();
  return (
    <Amount
      color={money.color ?? ""}
      amount={money.amount}
      settings={{ hide: hidden, sign: true }}
    />
  );
}

export function MoneyActions({ children }: { children: React.ReactNode }) {
  return <div className={`flex flex-row gap-6 mt-4`}>{children}</div>;
}

export function MoneyDeleteBtn() {
  const { money, deleting, setDeleting } = useMoneyBarContext();
  const queryClient = useQueryClient();
  async function deleteMoney() {
    setDeleting(true);
    await delete_money(money);
    queryClient.invalidateQueries({ queryKey: ["list"] });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={deleting}
          size={"icon"}
          className="rounded-full"
          variant={"ghost"}
        >
          <Trash style={{ color: money.color ?? "" }} size={16} />
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
              settings={{ hide: false, sign: true }}
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

  return (
    <Button asChild size={"icon"} className="rounded-full" variant={"ghost"}>
      <Link href={`/list/money/${money.id}`}>
        <ExternalLink style={{ color: money.color ?? "" }} size={16} />
      </Link>
    </Button>
  );
}
export function MoneyEditBtn() {
  const { money } = useMoneyBarContext();
  const queryClient = useQueryClient();
  const [openEditDialog, setOpenEditDialog] = useState(false);

  function done() {
    setOpenEditDialog(false);
    queryClient.invalidateQueries({ queryKey: ["list"] });
  }
  return (
    <Dialog onOpenChange={setOpenEditDialog} open={openEditDialog}>
      <DialogTrigger asChild>
        <Button size={"icon"} className="rounded-full" variant={"ghost"}>
          <Edit style={{ color: money.color ?? "" }} size={16} />
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
  const { money } = useMoneyBarContext();
  const queryClient = useQueryClient();

  async function colorize(c: string) {
    setOpenEditDialog(false);
    await colorize_money(money, c);
    queryClient.invalidateQueries({ queryKey: ["list"] });
  }
  return (
    <Dialog onOpenChange={setOpenEditDialog} open={openEditDialog}>
      <DialogTrigger asChild>
        <Button size={"icon"} className="rounded-full" variant={"ghost"}>
          <Palette style={{ color: money.color ?? "" }} size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[75%] gap-0">
        <DialogHeader>
          <DialogTitle>Colorize money</DialogTitle>
          {/* <DialogDescription>
            <p>Edit the color of this money.</p>
          </DialogDescription> */}
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-0 text-sm">
          <Money money={money}>
            <MoneyBar className="p-4">
              <MoneyHeader />
              <MoneyAmount />
            </MoneyBar>
          </Money>
          <DialogClose>
            <div className="grid grid-cols-18 gap-1 pb-4 px-4 w-full ">
              {Object.values(colors).map((color, i) => {
                return (
                  <div key={i}>
                    {Object.values(color).map((c) => {
                      return (
                        <button
                          onClick={() => colorize(c)}
                          className="rounded w-full aspect-square hover:scale-125 scale-100 ease-in-out duration-150 transition-all"
                          style={{ backgroundColor: c }}
                          key={c}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
