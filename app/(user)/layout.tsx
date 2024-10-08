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
import { usePathname, useRouter } from "next/navigation";
import { motion as m } from "framer-motion";
import { useMeasure } from "@uidotdev/usehooks";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [navBar, { width }] = useMeasure();
  const calculateWidth = () => {
    if (pathname === "/list") return width! / 3 - 1;
    if (pathname.startsWith("/list/money/")) return width! / 3 - 1;
    if (pathname === "/chart") return width! / 2 - 1;
    return width! / 4 - 1;
  };
  const calculatedWidth = calculateWidth();
  const showListBtn =
    !Boolean(pathname.match("/list")) ||
    Boolean(pathname.startsWith("/list/money/"));
  const showChartBtn = !Boolean(pathname.match("/chart"));
  const showAddBtn =
    Boolean(pathname.match("/list")) &&
    !Boolean(pathname.startsWith("/list/money/"));
  return (
    <div className="w-full h-full flex flex-col justify-start">
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
              translateX: showListBtn ? 0 : -72,
              width: calculatedWidth,
              opacity: showListBtn ? 1 : 0,
              pointerEvents: showListBtn ? "all" : "none",
              scale: showListBtn ? 1 : 1.5,
            }}
          >
            <NavListBtn />
          </m.div>
          <m.div
            className={`flex justify-center absolute left-0 translate-y-0`}
            key={"chart-btn"}
            animate={{
              width: calculatedWidth,
              opacity: showChartBtn ? 1 : 0,
              pointerEvents: showChartBtn ? "all" : "none",
              scale: showChartBtn ? 1 : 0,
              translateX: pathname.startsWith("/list/money/")
                ? calculatedWidth
                : showChartBtn
                ? 0
                : 72,
            }}
          >
            <NavChartBtn />
          </m.div>
          <m.div
            className={`flex justify-center absolute right-[50%]`}
            key={"add-btn"}
            animate={{
              translateY: showAddBtn ? 0 : 72,
              translateX: "50%",
              width: calculatedWidth,
              opacity: showAddBtn ? 1 : 0,
              pointerEvents: showAddBtn ? "all" : "none",
            }}
          >
            <AddMoneyDrawer />
          </m.div>
          <m.div
            className={`flex justify-center absolute right-0`}
            key={"options"}
            animate={{
              width: calculatedWidth,
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
