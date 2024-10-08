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
import { useQueryClient } from "@tanstack/react-query";

export default function AddMoneyDrawer() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  function done() {
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["list"] });
    queryClient.invalidateQueries({ queryKey: ["logs"] });
  }
  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button className="rounded-full" variant={"default"}>
          <Plus size={24} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-2/3">
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
