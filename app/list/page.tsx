"use client";
import AddMoneyDrawer from "@/components/add-money-drawer";
import { ThemeToggle } from "@/components/theme-toggle";

import Nav, {
  NavBackBtn,
  NavFilterBtn,
  NavHideBtn,
  NavUserBtn,
} from "@/components/nav";
import { ClerkLoaded, ClerkLoading, useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import List from "@/components/list";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { useListState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { get_moneys } from "../actions/moneys";

export default function ListPage() {
  const listState = useListState();
  const { isLoaded, user, isSignedIn } = useUser();
  const {} = useQuery({
    queryKey: ["list", user?.id, listState.asc, listState.sortBy],
    enabled: isLoaded && isSignedIn && !!user,
    queryFn: async () =>
      await get_moneys({ asc: listState.asc, by: listState.sortBy }),
  });
  return (
    <div className="w-full h-full max-w-[800px] mx-auto flex flex-col justify-start">
      <ClerkLoading>
        <div className="m-auto text-muted-foreground text-sm flex flex-col gap-4 items-center">
          <p>Loading lister's info</p>
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
