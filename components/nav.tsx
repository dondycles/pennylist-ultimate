"use client";
import {
  AlignJustify,
  ArrowRightLeft,
  Bolt,
  Calendar,
  ChartNoAxesColumnIncreasing,
  CornerRightDown,
  DollarSign,
  EyeOff,
  LetterText,
  LogOut,
  MoonIcon,
  SortAsc,
  SortDesc,
  SunIcon,
  User,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { SignOutButton, UserProfile } from "@clerk/nextjs";
import { useListState } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { createContext, forwardRef, useContext, useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import Link from "next/link";
import { AnimatePresence, motion as m } from "framer-motion";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import { transfer_money } from "@/app/actions/moneys";
import { usePathname } from "next/navigation";
import { ListDataContext } from "./providers/list";
import { useQueryClient } from "@tanstack/react-query";
import { useMeasure } from "@uidotdev/usehooks";
import AddMoneyDrawer from "./add-money-drawer";
import _ from "lodash";
import { Badge } from "./ui/badge";
const NavContext = createContext<
  | {
      showProfile: boolean;
      setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

function useNavContext() {
  const context = useContext(NavContext);
  if (!context) throw new Error("Money context missing!");
  return context;
}

export function Nav({ children }: { children: React.ReactNode }) {
  const [showProfile, setShowProfile] = useState(false);
  return (
    <NavContext.Provider value={{ setShowProfile, showProfile }}>
      {children}
    </NavContext.Provider>
  );
}
export const NavBar = forwardRef(function NavBar(
  {
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: ClassNameValue;
  },
  ref: React.Ref<HTMLDivElement>
) {
  const { showProfile, setShowProfile } = useNavContext();
  return (
    <nav className="flex justify-evenly gap-2 w-full bg-background overflow-hidden">
      <m.div
        ref={ref}
        layout
        className={cn("h-full max-w-[800px] w-screen duration-500", className)}
      >
        <AnimatePresence mode="popLayout">{children}</AnimatePresence>
      </m.div>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="w-fit max-w-fit flex h-[75dvh]">
          <UserProfile
            routing="virtual"
            appearance={{
              elements: {
                rootBox: "h-full",
                cardBox: "h-full",
              },
            }}
          />
        </DialogContent>
      </Dialog>
    </nav>
  );
});

export function NavOptions({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <Bolt size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end" sideOffset={16}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NavFilterOptions() {
  const listState = useListState();
  return (
    <>
      <DropdownMenuLabel className="text-muted-foreground text-xs">
        Ordering
      </DropdownMenuLabel>
      <DropdownMenuRadioGroup value={String(listState.asc)}>
        <DropdownMenuRadioItem
          onClick={() => {
            listState.setState({ ...listState, asc: true });
          }}
          value="true"
        >
          <SortAsc className="mr-2" size={16} />
          Ascending
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          onClick={() => {
            listState.setState({ ...listState, asc: false });
          }}
          value="false"
        >
          <SortDesc className="mr-2" size={16} />
          Descending
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="text-muted-foreground text-xs">
        Sorting
      </DropdownMenuLabel>
      <DropdownMenuRadioGroup value={listState.sortBy}>
        <DropdownMenuRadioItem
          onClick={() => {
            listState.setState({ ...listState, sortBy: "created_at" });
          }}
          value="created_at"
        >
          <Calendar className="mr-2" size={16} />
          Date Added
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          onClick={() => {
            listState.setState({ ...listState, sortBy: "amount" });
          }}
          value="amount"
        >
          <DollarSign className="mr-2" size={16} />
          Amount
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          onClick={() => {
            listState.setState({ ...listState, sortBy: "name" });
          }}
          value="name"
        >
          <LetterText className="mr-2" size={16} /> Name
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  );
}

export function NavHideOption() {
  const listState = useListState();
  return (
    <>
      <DropdownMenuLabel className="text-muted-foreground text-xs">
        Privacy
      </DropdownMenuLabel>
      <DropdownMenuRadioGroup value={String(listState.hidden)}>
        <DropdownMenuRadioItem
          onClick={() =>
            listState.setState({ ...listState, hidden: !listState.hidden })
          }
          value="true"
        >
          <EyeOff size={16} className="mr-2" />
          Hide Values
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  );
}

export function NavThemeOptions() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="text-muted-foreground text-xs">
        Theme
      </DropdownMenuLabel>
      <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
        <DropdownMenuRadioItem value="dark">
          <MoonIcon size={16} className="mr-2" />
          Dark Mode
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="light">
          <SunIcon size={16} className="mr-2" />
          Light Mode
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  );
}

export function NavUserOption() {
  const { setShowProfile } = useNavContext();
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => setShowProfile(true)}>
        <User size={16} className="mr-2" />
        Account Settings
      </DropdownMenuItem>
      <SignOutButton>
        <DropdownMenuItem>
          <LogOut size={16} className="mr-2" />
          Sign Out
        </DropdownMenuItem>
      </SignOutButton>
    </>
  );
}

export function NavListBtn() {
  return (
    <Button asChild size={"icon"} variant={"ghost"}>
      <Link href={"/list"}>
        <AlignJustify size={24} />
      </Link>
    </Button>
  );
}

export function NavChartBtn() {
  return (
    <Button asChild size={"icon"} variant={"ghost"}>
      <Link href={"/chart"}>
        <ChartNoAxesColumnIncreasing size={24} />
      </Link>
    </Button>
  );
}

export default function AnimatedNav() {
  const pathname = usePathname();
  const { currentTotal } = useContext(ListDataContext);
  const queryClient = useQueryClient();
  const [navBar, { width }] = useMeasure();
  const listState = useListState();
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
  const root = listState.transferrings?.root;
  const branches = listState.transferrings?.branches;
  const branchesDemandSum = _.sum(branches?.map((b) => b.transferAmount));
  const variants = {
    close: { opacity: 0, translateY: 72 },
    open: { opacity: 1, translateY: 0 },
  };

  function removeRoot() {
    listState.setState({ ...listState, transferrings: null });
  }

  function removeBranch(id: number) {
    if (!listState.transferrings) return;
    const branches = listState.transferrings.branches.filter(
      (b) => b.id !== id
    );

    listState.setState({
      ...listState,
      transferrings: {
        ...listState.transferrings,
        branches,
      },
    });
  }

  async function transfer() {
    if (!branches) return alert("!branches");
    if (!root) return alert("!root");
    if (root.amount - branchesDemandSum < 0) return alert("root is negative");

    await transfer_money(
      {
        prev: root,
        latest: {
          ...root,
          amount: root.amount - branchesDemandSum,
        },
      },
      root.reason,
      currentTotal - root.fee
    );

    for (const branch of branches) {
      await transfer_money(
        {
          prev: branch,
          latest: {
            ...branch,
            amount: branch.amount + (branch.transferAmount ?? 0),
          },
        },
        branch.reason,
        currentTotal - branch.fee
      );
    }
    queryClient.refetchQueries();
    listState.setState({ ...listState, transferrings: null });
  }
  return (
    <Nav>
      <NavBar
        ref={navBar}
        className={`${!width ? "opacity-0" : "opacity-100"} ${
          listState.transferrings ? "h-fit" : "h-[58px]"
        }`}
      >
        {listState.transferrings ? (
          <m.div
            key={"transferring"}
            initial={"close"}
            animate={"open"}
            exit={"close"}
            variants={variants}
            className="w-full h-full flex flex-col justify-end gap-4 py-2 px-4"
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-end">
                <Badge
                  variant={"secondary"}
                  className="font-bold text-base gap-1"
                  style={{ color: root?.color ?? "hsl(var(--foreground))" }}
                >
                  <span>{root?.name}</span>
                  <button onClick={removeRoot}>
                    <X className="text-destructive" size={16} />
                  </button>
                </Badge>
                <CornerRightDown className="text-muted-foreground" size={16} />
              </div>
              {listState.transferrings.branches.length !== 0 ? (
                <div className="flex gap-2">
                  {listState.transferrings.branches.map((b) => {
                    return (
                      <Badge
                        variant={"outline"}
                        key={b.id}
                        style={{ color: b?.color ?? "hsl(var(--foreground))" }}
                        className="gap-1"
                      >
                        <span>{b?.name}</span>

                        <button onClick={() => removeBranch(b?.id)}>
                          <X className="text-destructive" size={16} />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                "..."
              )}
            </div>
            <div className="flex flex-row gap-4 ">
              <Button
                disabled={listState.transferrings.branches.length === 0}
                onClick={transfer}
                className="flex gap-2 flex-1"
              >
                Proceed Transfer
                <ArrowRightLeft size={16} />{" "}
              </Button>
              <Button
                onClick={() =>
                  listState.setState({ ...listState, transferrings: null })
                }
                variant={"destructive"}
                size="icon"
              >
                <X size={16} />
              </Button>
            </div>
          </m.div>
        ) : (
          <m.div
            key={"!transferring"}
            initial={"close"}
            animate={"open"}
            exit={"close"}
            variants={variants}
            className="h-full w-full relative "
          >
            <m.div
              key={"pages-btn"}
              initial={false}
              className={`flex justify-center absolute left-0 bottom-2 h-10 `}
              animate={{
                width:
                  showListBtn && showChartBtn
                    ? calculatedWidth * 2
                    : calculatedWidth,
              }}
            >
              <div className="flex-1 relative">
                <m.div
                  className="absolute bottom-[50%] translate-x-[-50%] translate-y-[50%]"
                  initial={false}
                  animate={{
                    opacity: showListBtn ? 1 : 0,
                    pointerEvents: showListBtn ? "all" : "none",
                    left: showListBtn && showChartBtn ? "25%" : "50%",
                  }}
                  key={"list-btn"}
                >
                  <NavListBtn />
                </m.div>
                <m.div
                  className="absolute bottom-[50%] translate-x-[-50%]  translate-y-[50%]"
                  initial={false}
                  animate={{
                    opacity: showChartBtn ? 1 : 0,
                    pointerEvents: showChartBtn ? "all" : "none",
                    left: showListBtn && showChartBtn ? "75%" : "50%",
                  }}
                  key={"charts-btn"}
                >
                  <NavChartBtn />
                </m.div>
              </div>
            </m.div>
            <m.div
              className={`flex justify-center absolute right-[50%] bottom-2 z-50`}
              key={"add-btn"}
              initial={false}
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
              className={`flex justify-center absolute right-0 bottom-2`}
              key={"options"}
              initial={false}
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
          </m.div>
        )}
      </NavBar>
    </Nav>
  );
}
