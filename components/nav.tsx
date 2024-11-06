"use client";
import {
  AlignJustify,
  ArrowRightLeft,
  ArrowUpDown,
  Bolt,
  Calendar,
  ChartNoAxesColumnIncreasing,
  DollarSign,
  EyeOff,
  HardDriveDownload,
  HardDriveUpload,
  HelpCircle,
  LetterText,
  Lock,
  MoonIcon,
  RectangleHorizontal,
  Shirt,
  SortAsc,
  SortDesc,
  SunIcon,
  Trash,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  ListState,
  LockerState,
  LogsStore,
  MoneysStore,
  useListState,
  useLockerState,
  useLogsStore,
  useMoneysStore,
  useTransferState,
} from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import Amount from "./amount";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const PINFormSchema = z
  .object({
    pin: z.string().min(4, {
      message: "Your PIN must be 4 characters.",
    }),
    cPin: z.string().min(4, {
      message: "Please confirm your PIN.",
    }),
  })
  .refine((data) => data.cPin === data.pin, {
    message: "PIN not matched!",
    path: ["cPin"],
  });

const NavContext = createContext<
  | {
      showProfile: boolean;
      setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
      listState: ListState;
      lockerState: LockerState;
      showManageDataDialog: boolean;
      setShowManageDataDialog: React.Dispatch<React.SetStateAction<boolean>>;
      showPasswordDialog: boolean;
      setShowPasswordDialog: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const listState = useListState();
  const lockerState = useLockerState();
  return (
    <NavContext.Provider
      value={{
        showManageDataDialog,
        setShowManageDataDialog,
        setShowProfile,
        showProfile,
        listState,
        lockerState,
        showPasswordDialog,
        setShowPasswordDialog,
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
  const {
    setShowManageDataDialog,
    showManageDataDialog,
    showPasswordDialog,
    setShowPasswordDialog,
    lockerState,
  } = useNavContext();
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

  const pinForm = useForm<z.infer<typeof PINFormSchema>>({
    resolver: zodResolver(PINFormSchema),
    defaultValues: {
      cPin: "",
      pin: "",
    },
  });

  function setPin(data: z.infer<typeof PINFormSchema>) {
    lockerState.setPassword(lockerState.password ? null : data.pin);
    pinForm.reset();
    setShowPasswordDialog(false);
  }

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
    lockerState.setPassword(null);
  }

  useEffect(() => {
    if (showPasswordDialog) pinForm.setValue("pin", lockerState.password ?? "");
  }, [lockerState.password, pinForm, showPasswordDialog]);

  return (
    <nav className="flex justify-evenly gap-2 w-full overflow-hidden fixed bottom-0">
      <m.div
        ref={ref}
        layout
        className={cn(
          `h-full max-w-[800px] w-screen duration-500 bg-transparent backdrop-blur`,
          className
        )}
      >
        <AnimatePresence mode="popLayout">{children}</AnimatePresence>
        <Dialog
          key={"manage-data"}
          open={showManageDataDialog}
          onOpenChange={(open) => {
            setShowManageDataDialog(open);
            if (!open) {
              setDialogState(null);
              setImportedData(null);
            }
          }}
        >
          <DialogOverlay />
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
        <Dialog
          key={"password"}
          open={showPasswordDialog}
          onOpenChange={setShowPasswordDialog}
        >
          <DialogOverlay />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {lockerState.password ? "Remove " : "Set "}PIN
              </DialogTitle>
              <DialogDescription>
                {lockerState.password
                  ? "Removing your password will allow visitors to sneak in."
                  : "To protect your data from unwanted visitors, set PIN. Please remember your password."}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 pt-0 flex flex-col gap-4 items-center">
              <Form {...pinForm}>
                <form
                  onSubmit={pinForm.handleSubmit(setPin)}
                  className="space-y-4 w-full"
                >
                  <FormField
                    control={pinForm.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem
                        hidden={lockerState.password !== null}
                        className="w-fit mx-auto"
                      >
                        <FormControl>
                          <InputOTP
                            maxLength={4}
                            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                            {...field}
                          >
                            <InputOTPGroup className=" mx-auto">
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={pinForm.control}
                    name="cPin"
                    render={({ field }) => (
                      <FormItem className="w-fit mx-auto">
                        <FormControl>
                          <InputOTP
                            maxLength={4}
                            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                            {...field}
                          >
                            <InputOTPGroup className=" mx-auto">
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="w-full"
                    type="submit"
                    variant={"secondary"}
                  >
                    {lockerState.password ? "Remove" : "Set"} PIN
                  </Button>
                </form>
              </Form>
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
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <ArrowUpDown size={16} className="mr-2" /> Ordering
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent sideOffset={8}>
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
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
}

function NavPrivacyOption() {
  const { listState, setShowPasswordDialog, lockerState } = useNavContext();
  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          {" "}
          <Lock size={16} className="mr-2" /> Privacy
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent sideOffset={8}>
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
          <DropdownMenuRadioGroup value={String(lockerState.password !== null)}>
            <DropdownMenuRadioItem
              onClick={() => setShowPasswordDialog(true)}
              value="true"
            >
              <Lock size={16} className="mr-2" />
              Ask PIN On Open
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
}

function NavHelpBtn() {
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <HelpCircle size={16} className="mr-2" /> Help
      </DropdownMenuItem>
    </>
  );
}

function NavThemeOptions() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <MoonIcon size={16} className="mr-2" /> Theme
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent sideOffset={8}>
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
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

function NavAppearanceOption() {
  const { listState } = useNavContext();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Shirt size={16} className="mr-2" />
        Appearance
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent sideOffset={8}>
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
      </DropdownMenuSubContent>
    </DropdownMenuSub>
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
      <Link href={"/charts"}>
        <ChartNoAxesColumnIncreasing size={24} />
      </Link>
    </Button>
  );
}

function NavManageDataBtn() {
  const { setShowManageDataDialog } = useNavContext();
  return (
    <DropdownMenuItem onClick={() => setShowManageDataDialog(true)}>
      <HardDriveDownload size={16} className="mr-2" />
      Manage My Data
    </DropdownMenuItem>
  );
}

function NavTransferCard() {
  const { moneys, editMoney, totalMoneys, sortMoneys, asc, sortBy } =
    useMoneysStore();
  const { transferrings, setTransferrings } = useTransferState();
  const { addLog } = useLogsStore();

  const root = transferrings?.root;
  const branches = transferrings?.branches;
  const branchesDemandSum = _.sum(branches?.map((b) => b.transferAmount));
  const branchesFees = _.sum(branches?.map((m) => m.fee));

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
      amount: root.amount - branchesDemandSum - branchesFees,
    });

    addLog({
      changes: {
        prev: { ...root, total: totalMoneys(moneys) },
        latest: {
          ...root,
          amount: root.amount - branchesDemandSum - branchesFees,
          total: totalMoneys(moneys) - branchesDemandSum - branchesFees,
        },
      },
      action: "transfer",
      created_at: new Date().toISOString(),
      current_total: totalMoneys(moneys) - branchesDemandSum - branchesFees,
      id: crypto.randomUUID(),
      money_id: root.id,
      reason: root.reason,
      money_name: root.name,
    });

    for (let index = 0; index < branches.length; index++) {
      const branch = branches[index];
      addLog({
        changes: {
          prev: { ...branch, total: totalMoneys(moneys) },
          latest: {
            ...branch,
            amount: branch.amount + (branch.transferAmount ?? 0),
            total: totalMoneys(moneys) + (branch.transferAmount ?? 0),
          },
        },
        action: "transfer",
        created_at: new Date().toISOString(),
        current_total: totalMoneys(moneys) - branchesFees,
        id: crypto.randomUUID(),
        money_id: branch.id,
        reason: branch.reason,
        money_name: branch.name,
      });

      editMoney({
        ...branch,
        amount: branch.amount + (branch.transferAmount ?? 0),
      });
    }

    addLog({
      changes: {
        prev: { ...root, total: totalMoneys(moneys), amount: 0 },
        latest: {
          ...root,
          amount: -branchesFees,
          total: totalMoneys(moneys) - branchesDemandSum - branchesFees,
        },
      },
      action: "fee",
      created_at: new Date().toISOString(),
      current_total: totalMoneys(moneys) - branchesDemandSum - branchesFees,
      id: crypto.randomUUID(),
      money_id: root.id,
      reason: `${branches
        .map((b) => {
          return `${b.name}: -${b.fee}`;
        })
        .join("\n")}`,
      money_name: root.name,
    });
    setTransferrings(null);
    sortMoneys(sortBy, asc);
  }
  return (
    <div className="w-full h-full flex flex-col justify-end gap-2 px-4 py-2">
      <div className="flex flex-row gap-2">
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
    if (pathname === "/charts") return width! / 2 - 1;
    return width! / 4 - 1;
  };
  const calculatedWidth = calculateWidth();
  const showListBtn =
    !Boolean(pathname.match("/list")) ||
    Boolean(pathname.startsWith("/list/money/"));
  const showChartBtn = !Boolean(pathname.match("/charts"));
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
        className={`${!width ? "opacity-0" : "opacity-100"} h-[56px]`}
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
                    <NavAppearanceOption />
                    <NavPrivacyOption />
                    <NavThemeOptions />
                    <NavHelpBtn />
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
