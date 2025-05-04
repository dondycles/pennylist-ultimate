"use client";

import { Button } from "./ui/button";
import AddMoneyForm from "./forms/add-money";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/animate-ui/radix/sheet";
export default function AddMoneyDrawer() {
  const [open, setOpen] = useState(false);
  function done() {
    setOpen(false);
  }
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button className="flex-1" variant={"default"}>
          <Plus size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>Add Money</SheetTitle>
        </SheetHeader>
        <div className="mx-auto w-full h-full max-w-[800px] flex flex-col gap-4 p-4">
          <AddMoneyForm done={done} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
