"use client";
import AddMoneyDrawer from "@/components/add-money-drawer";
import { ThemeToggle } from "@/components/theme-toggle";

import Nav, {
  NavBackBtn,
  NavFilterBtn,
  NavHideBtn,
  NavUserBtn,
} from "@/components/nav";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import List from "@/components/list";
import { Loader } from "lucide-react";

export default function ListPage() {
  return (
    <div className="w-full h-full max-w-[800px] mx-auto flex flex-col justify-start">
      <ClerkLoading>
        <div className="m-auto text-muted-foreground text-sm flex flex-col gap-4 items-center">
          <p>Loading lister&apos;s info</p>
          <Loader className="animate-spin" />
        </div>
        <Nav>
          <NavBackBtn />
          <ThemeToggle />
        </Nav>
      </ClerkLoading>
      <ClerkLoaded>
        <List />
        <Nav>
          <NavFilterBtn />
          <NavHideBtn />
          <AddMoneyDrawer />
          <ThemeToggle />
          <NavUserBtn />
        </Nav>
      </ClerkLoaded>
    </div>
  );
}
