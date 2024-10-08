"use client";
import AddMoneyDrawer from "@/components/add-money-drawer";

import Nav, {
  NavBar,
  NavChartBtn,
  NavFilterOptions,
  NavHideOption,
  NavOptions,
  NavThemeOptions,
  NavUserOption,
} from "@/components/nav";
import List from "@/components/list";
export default function ListPage() {
  return (
    <div className="w-full h-full mx-auto flex flex-col justify-start">
      <List />
      <Nav>
        <NavBar>
          <NavChartBtn />
          <AddMoneyDrawer />
          <NavOptions>
            <NavFilterOptions />
            <NavHideOption />
            <NavThemeOptions />
            <NavUserOption />
          </NavOptions>
        </NavBar>
      </Nav>
    </div>
  );
}
