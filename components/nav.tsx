"use client";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  ListFilter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useListState } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Nav({ children }: { children: React.ReactNode }) {
  return <nav className="flex justify-evenly gap-2 p-6">{children}</nav>;
}

export function NavFilterBtn() {
  const listState = useListState();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" size={"icon"} variant={"ghost"}>
          <ListFilter size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sorting</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={String(listState.asc)}>
          <DropdownMenuRadioItem
            onClick={() => {
              listState.setState({ ...listState, asc: true });
            }}
            value="true"
          >
            <SortAsc className="mr-1" size={16} />
            Ascending
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            onClick={() => {
              listState.setState({ ...listState, asc: false });
            }}
            value="false"
          >
            <SortDesc className="mr-1" size={16} />
            Descending
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={listState.sortBy}>
          <DropdownMenuRadioItem
            onClick={() => {
              listState.setState({ ...listState, sortBy: "created_at" });
            }}
            value="created_at"
          >
            Date Added
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            onClick={() => {
              listState.setState({ ...listState, sortBy: "amount" });
            }}
            value="amount"
          >
            Amount
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            onClick={() => {
              listState.setState({ ...listState, sortBy: "name" });
            }}
            value="name"
          >
            Name
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NavHideBtn() {
  const listState = useListState();
  return (
    <Button
      onClick={() =>
        listState.setState({ ...listState, hidden: !listState.hidden })
      }
      className="rounded-full"
      size={"icon"}
      variant={"ghost"}
    >
      {listState.hidden ? <Eye size={24} /> : <EyeOff size={24} />}
    </Button>
  );
}

export function NavUserBtn() {
  return (
    <Button className="rounded-full" size={"icon"} variant={"ghost"}>
      <UserButton />
    </Button>
  );
}

export function NavBackBtn() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      className="rounded-full"
      size={"icon"}
      variant={"ghost"}
    >
      <ChevronLeft size={24} />
    </Button>
  );
}
