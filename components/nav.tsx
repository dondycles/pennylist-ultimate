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
  HardDriveDownload,
  HardDriveUpload,
  LetterText,
  MoonIcon,
  RectangleHorizontal,
  SortAsc,
  SortDesc,
  SunIcon,
  Trash,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  ListState,
  LogsStore,
  MoneysStore,
  useListState,
  useLogsStore,
  useMoneysStore,
  useTransferState,
} from "@/store";
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
import React, {
  createContext,
  forwardRef,
  useContext,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion as m } from "framer-motion";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import { usePathname } from "next/navigation";
import { useMeasure } from "@uidotdev/usehooks";
import AddMoneyDrawer from "./add-money-drawer";
import _ from "lodash";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import Amount from "./amount";
const NavContext = createContext<
  | {
      showProfile: boolean;
      setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
      listState: ListState;
      showManageDataDialog: boolean;
      setShowManageDataDialog: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

function useNavContext() {
  const context = useContext(NavContext);
  if (!context) throw new Error("Money context missing!");
  return context;
}

function Nav({ children }: { children: React.ReactNode }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showManageDataDialog, setShowManageDataDialog] = useState(false);
  const listState = useListState();
  return (
    <NavContext.Provider
      value={{
        showManageDataDialog,
        setShowManageDataDialog,
        setShowProfile,
        showProfile,
        listState,
      }}
    >
      {children}
    </NavContext.Provider>
  );
}
const NavBar = forwardRef(function NavBar(
  {
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: ClassNameValue;
  },
  ref: React.Ref<HTMLDivElement>
) {
  const { setShowManageDataDialog, showManageDataDialog } = useNavContext();
  const {
    moneys,
    delete: deleteMoneys,
    import: importMoneys,
  } = useMoneysStore();
  const { logs, delete: deleteLogs, import: importLogs } = useLogsStore();
  const [dialogState, setDialogState] = useState<"import" | "delete" | null>(
    null
  );
  const jsonInput = useRef<HTMLInputElement>(null);
  const [importedData, setImportedData] = useState<{
    logs: LogsStore["logs"];
    moneys: MoneysStore["moneys"];
  } | null>(null);
  function exportData() {
    const jsonBlob = new Blob([JSON.stringify({ logs, moneys }, null, 2)], {
      type: "application/json",
    });

    // Create a temporary <a> element
    const link = document.createElement("a");

    // Set the download attribute with the filename
    link.download = new Date().toISOString();

    // Create a URL for the blob
    link.href = URL.createObjectURL(jsonBlob);

    // Append the link to the body (necessary for some browsers)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();
    // Clean up and remove the link
    document.body.removeChild(link);
  }

  function importData() {
    if (!jsonInput.current) return;
    const data = jsonInput.current.files;
    if (data) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const jsonData: {
            moneys: MoneysStore["moneys"];
            logs: LogsStore["logs"];
          } = JSON.parse(String(e.target?.result));
          setImportedData(jsonData);
        } catch (error) {
          console.log(error);
        }
      };

      reader.readAsText(data[0]);
    }
  }

  function deleteData() {
    deleteLogs();
    deleteMoneys();
  }
  return (
    <nav className="flex justify-evenly gap-2 w-full overflow-hidden fixed bottom-0">
      <m.div
        ref={ref}
        layout
        className={cn(
          `h-full max-w-[800px] w-screen duration-500 bg-background`,
          className
        )}
      >
        <AnimatePresence mode="popLayout">{children}</AnimatePresence>
        <Dialog
          open={showManageDataDialog}
          onOpenChange={(open) => {
            setShowManageDataDialog(open);
            if (!open) {
              setDialogState(null);
              setImportedData(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Your Data</DialogTitle>
              <DialogDescription>
                {dialogState === null
                  ? " Import, export, or delete your data. Please be careful with this action as it cannot be undone."
                  : dialogState === "import"
                  ? "Importing data. This will overwrite the current data. This action cannot be undone"
                  : dialogState === "delete"
                  ? "Deleting data. Please export your current data to avoid data loss."
                  : null}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 pt-0 flex flex-col gap-4">
              {dialogState === null ? (
                <>
                  <Button
                    onClick={() => setDialogState("import")}
                    variant={"secondary"}
                  >
                    <HardDriveUpload size={16} className="mr-1" />
                    Import
                  </Button>
                  <DialogClose asChild>
                    <Button onClick={exportData} variant={"secondary"}>
                      <HardDriveDownload size={16} className="mr-1" />
                      Export
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={() => setDialogState("delete")}
                    variant={"destructive"}
                  >
                    <Trash size={16} className="mr-1" /> Delete
                  </Button>
                </>
              ) : dialogState === "import" ? (
                <>
                  <Input
                    className="sr-only"
                    ref={jsonInput}
                    type="file"
                    onChange={importData}
                  />
                  {importedData ? (
                    <div className="space-y-4 text-sm">
                      <p className="text-muted-foreground">
                        You are about to import...
                      </p>
                      <p>
                        <span className="text-muted-foreground">Moneys: </span>
                        {importedData.moneys.map((m) => m.name).join(", ")}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Log records:{" "}
                        </span>{" "}
                        {importedData.logs.length}
                      </p>
                      <div>
                        <span className="text-muted-foreground">
                          Total Money:{" "}
                        </span>
                        <Amount
                          settings={{
                            sign: true,
                            hide: false,
                          }}
                          amount={_.sum(
                            importedData.moneys.map((m) => m.amount)
                          )}
                        />
                      </div>
                      <div className="flex gap-4">
                        <DialogClose asChild>
                          <Button
                            onClick={() => {
                              importLogs(importedData.logs);
                              importMoneys(importedData.moneys);
                            }}
                            className="flex-1"
                            variant={"secondary"}
                          >
                            Import
                          </Button>
                        </DialogClose>

                        <Button
                          onClick={() => {
                            setDialogState(null);
                          }}
                          className="flex-1"
                          variant={"destructive"}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant={"secondary"}
                        onClick={() => {
                          if (!jsonInput.current) return;
                          jsonInput.current.click();
                        }}
                      >
                        Select Data
                      </Button>
                      <Button
                        onClick={() => setDialogState(null)}
                        variant={"destructive"}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </>
              ) : dialogState === "delete" ? (
                <>
                  <DialogClose asChild>
                    <Button onClick={deleteData} variant={"secondary"}>
                      Delete
                    </Button>
                  </DialogClose>

                  <Button
                    onClick={() => setDialogState(null)}
                    variant={"destructive"}
                  >
                    Cancel
                  </Button>
                </>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      </m.div>
    </nav>
  );
});

function NavOptions({ children }: { children: React.ReactNode }) {
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

function NavFilterOptions() {
  const { sortBy, asc, sortMoneys } = useMoneysStore();
  return (
    <>
      <DropdownMenuLabel className="text-muted-foreground text-xs">
        Ordering
      </DropdownMenuLabel>
      <DropdownMenuRadioGroup value={String(asc)}>
        <DropdownMenuRadioItem
          onClick={() => {
            sortMoneys(sortBy, true);
          }}
          value="true"
        >
          <SortAsc className="mr-2" size={16} />
          Ascending
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          onClick={() => {
            sortMoneys(sortBy, false);
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
      <DropdownMenuRadioGroup value={sortBy}>
        <DropdownMenuRadioItem
          onClick={() => {
            sortMoneys("created_at", asc);
          }}
          value="created_at"
        >
          <Calendar className="mr-2" size={16} />
          Date Added
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          onClick={() => {
            sortMoneys("amount", asc);
          }}
          value="amount"
        >
          <DollarSign className="mr-2" size={16} />
          Amount
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          onClick={() => {
            sortMoneys("name", asc);
          }}
          value="name"
        >
          <LetterText className="mr-2" size={16} /> Name
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  );
}

function NavHideOption() {
  const { listState } = useNavContext();
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

function NavThemeOptions() {
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
          Dark
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="light">
          <SunIcon size={16} className="mr-2" />
          Light
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  );
}

function NavCompactMoneyOption() {
  const { listState } = useNavContext();
  const pathname = usePathname();
  return (
    <>
      {pathname === "/list" && <DropdownMenuSeparator />}

      <DropdownMenuLabel className="text-muted-foreground text-xs">
        Moneys
      </DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={String(listState.compactMoney)}
        onValueChange={() =>
          listState.setState({
            ...listState,
            compactMoney: !listState.compactMoney,
          })
        }
      >
        <DropdownMenuRadioItem value="true">
          <RectangleHorizontal size={16} className="mr-2" />
          Compact
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  );
}

function NavListBtn() {
  return (
    <Button asChild size={"icon"} variant={"ghost"}>
      <Link href={"/list"}>
        <AlignJustify size={24} />
      </Link>
    </Button>
  );
}

function NavChartBtn() {
  return (
    <Button asChild size={"icon"} variant={"ghost"}>
      <Link href={"/chart"}>
        <ChartNoAxesColumnIncreasing size={24} />
      </Link>
    </Button>
  );
}

function NavManageDataBtn() {
  const { setShowManageDataDialog } = useNavContext();
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="text-muted-foreground text-xs">
        Data
      </DropdownMenuLabel>
      <DropdownMenuItem onClick={() => setShowManageDataDialog(true)}>
        <HardDriveDownload size={16} className="mr-2" />
        Manage My Data
      </DropdownMenuItem>
    </>
  );
}

function NavTransferCard() {
  const { moneys, editMoney, totalMoneys } = useMoneysStore();
  const { transferrings, setTransferrings } = useTransferState();
  const { addLog } = useLogsStore();

  const root = transferrings?.root;
  const branches = transferrings?.branches;
  const branchesDemandSum = _.sum(branches?.map((b) => b.transferAmount));

  function removeRoot() {
    setTransferrings(null);
  }

  function removeBranch(id: string) {
    if (!transferrings) return;
    const branches = transferrings.branches.filter((b) => b.id !== id);
    setTransferrings({ ...transferrings, branches });
  }

  async function transfer() {
    if (!branches) return alert("!branches");
    if (!root) return alert("!root");
    if (root.amount - branchesDemandSum < 0) return alert("root is negative");
    if (
      branches.some(
        (b) => Number(b.transferAmount ?? 0) - Number(b.fee ?? 0) < 0
      )
    )
      return alert("Some branch is negative");

    editMoney({
      ...root,
      amount: root.amount - branchesDemandSum - root.fee,
    });

    addLog({
      changes: {
        prev: { ...root, total: totalMoneys(moneys) },
        latest: {
          ...root,
          amount: root.amount - branchesDemandSum - root.fee,
          total: totalMoneys(moneys) - branchesDemandSum - root.fee,
        },
      },
      action: "transfer",
      created_at: new Date().toISOString(),
      current_total: totalMoneys(moneys) - branchesDemandSum - root.fee,
      id: crypto.randomUUID(),
      money_id: root.id,
      reason: root.reason,
      money_name: root.name,
    });

    for (let index = 0; index < branches.length; index++) {
      const branch = branches[index];
      const previousBranches = branches.slice(0, index);
      const sumOfPreviousBranchesFees = _.sum(
        previousBranches.map((b) => b.fee)
      );
      addLog({
        changes: {
          prev: { ...branch, total: totalMoneys(moneys) },
          latest: {
            ...branch,
            amount: branch.amount + (branch.transferAmount ?? 0) - branch.fee,
            total:
              totalMoneys(moneys) + (branch.transferAmount ?? 0) - branch.fee,
          },
        },
        action: "transfer",
        created_at: new Date().toISOString(),
        current_total:
          totalMoneys(moneys) -
          branches[index].fee -
          root.fee -
          (index > 0 ? sumOfPreviousBranchesFees : 0),
        id: crypto.randomUUID(),
        money_id: branch.id,
        reason: branch.reason,
        money_name: branch.name,
      });
      editMoney({
        ...branch,
        amount: branch.amount + (branch.transferAmount ?? 0) - branch.fee,
      });
    }
    setTransferrings(null);
  }
  return (
    <div className="w-full h-full flex flex-col justify-end gap-4 p-4">
      <div className="flex flex-col gap-2 border border-input bg-muted  dark:bg-[#171717] rounded-3xl p-4">
        <div className="flex flex-row gap-2 items-baseline">
          <p className="text-xs text-muted-foreground">Sender: </p>
          <Badge
            variant={"outline"}
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
        {transferrings?.branches.length !== 0 ? (
          <div className="flex flex-row gap-2 items-baseline border-t pt-2">
            <p className="text-muted-foreground text-xs">Receiver(s): </p>
            <div className="flex gap-2">
              {transferrings?.branches.map((b) => {
                return (
                  <React.Fragment key={b.id}>
                    <Badge
                      variant={"outline"}
                      style={{
                        color: b?.color ?? "hsl(var(--foreground))",
                      }}
                      className="gap-1"
                    >
                      <span>{b?.name}</span>

                      <button onClick={() => removeBranch(b?.id)}>
                        <X className="text-destructive" size={16} />
                      </button>
                    </Badge>
                    <span className="last:hidden">,</span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-xs">
            Receiver(s): Please select money(s)
          </p>
        )}
      </div>
      <div className="flex flex-row gap-4 ">
        <Button
          disabled={transferrings?.branches.length === 0}
          onClick={transfer}
          className="flex gap-2 flex-1"
        >
          Proceed Transfer
          <ArrowRightLeft size={16} />{" "}
        </Button>
        <Button
          onClick={() => setTransferrings(null)}
          variant={"destructive"}
          size="icon"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}

export default function AnimatedNav() {
  const pathname = usePathname();
  const { transferrings } = useTransferState();
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
  const variants = {
    close: { opacity: 0, translateY: 72 },
    open: { opacity: 1, translateY: 0 },
  };

  return (
    <Nav>
      <NavBar
        ref={navBar}
        className={`${!width ? "opacity-0" : "opacity-100"} ${
          transferrings ? "h-[178px] " : "h-[74px]"
        }`}
      >
        <AnimatePresence initial={false}>
          {transferrings ? (
            <m.div
              key={"transferring"}
              initial={"close"}
              animate={"open"}
              exit={"close"}
              variants={variants}
              className="absolute h-full bottom-0 left-0 right-0 p-0 mx-auto w-screen max-w-[800px]"
            >
              <NavTransferCard />
            </m.div>
          ) : (
            <m.div
              key={"!transferring"}
              initial={"close"}
              animate={"open"}
              exit={"close"}
              variants={variants}
              className="absolute h-full w-screen max-w-[800px] mx-auto bottom-0 left-0 right-0"
            >
              <div className="h-full w-full relative">
                <m.div
                  key={"pages-btn"}
                  initial={false}
                  className={`flex justify-center absolute left-0 bottom-4 h-10 `}
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
                  className={`flex justify-center absolute right-[50%] bottom-4 z-50`}
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
                  className={`flex justify-center absolute right-0 bottom-4`}
                  key={"options"}
                  initial={false}
                  animate={{
                    width: calculatedWidth,
                  }}
                >
                  <NavOptions>
                    {pathname === "/list" ? <NavFilterOptions /> : null}
                    <NavCompactMoneyOption />
                    <NavHideOption />
                    <NavThemeOptions />
                    <NavManageDataBtn />
                  </NavOptions>
                </m.div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </NavBar>
    </Nav>
  );
}
