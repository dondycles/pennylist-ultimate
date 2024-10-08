"use client";
import AddMoneyDrawer from "@/components/add-money-drawer";

import Nav, {
  NavBackBtn,
  NavBar,
  NavFilterOptions,
  NavHideOption,
  NavOptions,
  NavThemeOptions,
  NavUserOption,
} from "@/components/nav";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Charts from "@/components/charts";
export default function ChartPage() {
  return (
    <div className="w-full h-full mx-auto flex flex-col justify-start">
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
        <Charts />
        <Nav>
          <NavBar>
            <NavBackBtn />
            <AddMoneyDrawer />
            <NavOptions>
              <NavHideOption />
              <NavThemeOptions />
              <NavUserOption />
            </NavOptions>
          </NavBar>
        </Nav>
      </ClerkLoaded>
    </div>
  );
}
