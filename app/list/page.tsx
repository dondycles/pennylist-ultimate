"use client";
import AddMoneyDrawer from "@/components/add-money-drawer";

import Nav, {
  NavBackBtn,
  NavBar,
  NavChartBtn,
  NavFilterOptions,
  NavHideOption,
  NavOptions,
  NavThemeOptions,
  NavUserOption,
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
          <NavOptions>
            <NavThemeOptions />
          </NavOptions>
        </Nav>
      </ClerkLoading>
      <ClerkLoaded>
        <List />
        <Nav>
          <NavBar>
            <NavOptions>
              <NavFilterOptions />
              <NavHideOption />
              <NavThemeOptions />
              <NavUserOption />
            </NavOptions>
            <AddMoneyDrawer />
            <NavChartBtn />
          </NavBar>
        </Nav>
      </ClerkLoaded>
    </div>
  );
}
