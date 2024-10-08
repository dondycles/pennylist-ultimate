"use client";
import AddMoneyDrawer from "@/components/add-money-drawer";
import Nav, {
  NavBar,
  NavChartBtn,
  NavListBtn,
  NavOptions,
  NavUserOption,
  NavFilterOptions,
  NavHideOption,
  NavThemeOptions,
} from "@/components/nav";
import { usePathname } from "next/navigation";
import { motion as m } from "framer-motion";
import { useMeasure } from "@uidotdev/usehooks";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [navBar, { width }] = useMeasure();
  const calculateWidth = () => {
    if (pathname === "/list") return width! / 3 - 1;
    if (pathname === "/chart") return width! / 2 - 1;
    return width! / 3 - 1;
  };
  const calculatedWith = calculateWidth();
  return (
    <div className="w-full h-full flex flex-col justify-start mb-32">
      {children}
      <Nav>
        <NavBar
          ref={navBar}
          className={`max-w-[800px] w-screen gap-1 duration-500 delay-500 ${
            !width ? "opacity-0" : "opacity-100"
          }`}
        >
          <m.div
            key={"list-btn"}
            className={`flex justify-center absolute left-0`}
            animate={{
              translateX: pathname === "/list" ? -72 : 0,
              width: calculatedWith,
              opacity: pathname === "/list" ? 0 : 1,
              pointerEvents: pathname === "/list" ? "none" : "all",
            }}
          >
            <NavListBtn />
          </m.div>
          <m.div
            className={`flex justify-center absolute left-0`}
            key={"chart-btn"}
            animate={{
              translateY: pathname === "/chart" ? 72 : 0,
              width: calculatedWith,
              opacity: pathname === "/chart" ? 0 : 1,
              pointerEvents: pathname === "/chart" ? "none" : "all",
            }}
          >
            <NavChartBtn />
          </m.div>
          <m.div
            className={`flex justify-center absolute right-[50%]`}
            key={"add-btn"}
            animate={{
              translateY: pathname === "/chart" ? 72 : 0,
              translateX: "50%",
              width: calculatedWith,
              opacity: pathname === "/chart" ? 0 : 1,
              pointerEvents: pathname === "/chart" ? "none" : "all",
            }}
          >
            <AddMoneyDrawer />
          </m.div>
          <m.div
            className={`flex justify-center absolute right-0`}
            key={"options"}
            animate={{
              width: calculatedWith,
            }}
          >
            <NavOptions>
              {pathname === "/list" ? <NavFilterOptions /> : null}
              <NavHideOption />
              <NavThemeOptions />
              <NavUserOption />
            </NavOptions>
          </m.div>
        </NavBar>
      </Nav>
    </div>
  );
}
