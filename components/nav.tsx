"use client";
import {
  AlignJustify,
  Bolt,
  Calendar,
  ChartNoAxesColumnIncreasing,
  DollarSign,
  EyeOff,
  LetterText,
  LogOut,
  MoonIcon,
  SortAsc,
  SortDesc,
  SunIcon,
  User,
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

export default function Nav({ children }: { children: React.ReactNode }) {
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
    <nav className="flex justify-evenly gap-2 w-full h-14 bg-background overflow-hidden">
      <m.div
        ref={ref}
        layout
        className={cn(
          "h-full relative max-w-[800px] w-screen duration-500 delay-500 ",
          className
        )}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {children}
        </AnimatePresence>
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
        <Button className="rounded-full" size={"icon"} variant={"ghost"}>
          <Bolt size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end" sideOffset={16}>
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NavFilterOptions() {
  const listState = useListState();
  return (
    <>
      <DropdownMenuSeparator />
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
      <DropdownMenuSeparator />
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
    <Button asChild className="rounded-full" size={"icon"} variant={"ghost"}>
      <Link href={"/list"}>
        <AlignJustify size={24} />
      </Link>
    </Button>
  );
}

export function NavChartBtn() {
  return (
    <Button asChild className="rounded-full" size={"icon"} variant={"ghost"}>
      <Link href={"/chart"}>
        <ChartNoAxesColumnIncreasing size={24} />
      </Link>
    </Button>
  );
}
