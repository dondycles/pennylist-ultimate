"use client";

import {
  DrawerTrigger,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Button } from "./ui/button";
import AddMoneyForm from "./forms/add-money";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AddMoneyDrawer() {
  const [open, setOpen] = useState(false);
  function done() {
    setOpen(false);
  }
  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button className="flex-1" variant={"default"}>
          <Plus size={24} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Money</DrawerTitle>
        </DrawerHeader>
        <div className="mx-auto w-full h-full max-w-[800px] flex flex-col gap-4 p-4">
          <AddMoneyForm done={done} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
