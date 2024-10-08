"use client";
import AddMoneyDrawer from "@/components/add-money-drawer";

import Nav, {
  NavBackBtn,
  NavBar,
  NavHideOption,
  NavOptions,
  NavThemeOptions,
  NavUserOption,
} from "@/components/nav";
import Charts from "@/components/charts";
export default function ChartPage() {
  return (
    <div className="w-full h-full mx-auto flex flex-col justify-start">
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
    </div>
  );
}
