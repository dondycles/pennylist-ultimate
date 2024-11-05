"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Log, Money } from "@/store";
import { Badge } from "../ui/badge";
import Amount from "../amount";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultSearchBy: "money" | "reason";
}

export function HistoryTable<TData, TValue>({
  columns,
  data,
  defaultSearchBy,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "created_at",
      desc: true,
    },
  ]);
  const [columnVisibility] = useState<VisibilityState>({});
  const [searchBy, setSearchBy] = useState<"money" | "reason">(defaultSearchBy);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
      columnVisibility,
    },
  });

  useEffect(() => {
    table.resetColumnFilters();
  }, [searchBy, table]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>
          All actions done with the moneys are logged
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center p-4 pt-0 gap-4">
          <Input
            placeholder={`Search by ${searchBy}...`}
            value={
              (table.getColumn(searchBy)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchBy)?.setFilterValue(event.target.value)
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="text-muted-foreground gap-1 border border-input"
                variant={"secondary"}
              >
                <span>by</span>
                <span className="capitalize">{searchBy}</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={searchBy}
                onValueChange={(v) => setSearchBy(v as "money" | "reason")}
              >
                <DropdownMenuRadioItem value="money">
                  Money
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="reason">
                  Reason
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>{" "}
        {/* <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className="text-xs" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div> */}
        <div className="flex flex-col gap-4 px-4">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const log = row.original as Log;
              return (
                <div
                  key={row.id}
                  className="p-4 rounded-2xl bg-muted/50 flex flex-col gap-2"
                >
                  {/* {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))} */}
                  <div className="flex gap-4 items-start justify-between">
                    <Badge className="capitalize">{log.action}</Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    style={{ color: log.changes.latest.color }}
                    className="flex flex-col items-center truncate w-full"
                  >
                    <p className="text-sm font-bold">
                      {log.changes.latest.name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <Amount
                        amount={log.changes.prev.amount}
                        settings={{ sign: true }}
                        className="text-xs text-muted-foreground"
                      />
                      <div className="flex gap-1">
                        <p className="text-xl font-semibold">
                          {log.changes.latest.amount - log.changes.prev.amount >
                          0
                            ? "+"
                            : "-"}
                        </p>
                        <Amount
                          amount={log.changes.latest.amount}
                          settings={{ sign: true }}
                          className="text-xl"
                        />
                        <p className="text-xl font-semibold">=</p>
                      </div>
                      <div>
                        <Amount
                          amount={Math.abs(
                            log.changes.latest.amount - log.changes.prev.amount
                          )}
                          settings={{ sign: true }}
                          className="text-xs text-muted-foreground"
                        />
                      </div>
                    </div>

                    <div className="flex items-baseline text-muted-foreground text-xs gap-1">
                      <p>Total Money: </p>
                      <Amount
                        className="text-sm"
                        amount={log.current_total}
                        settings={{ sign: true }}
                      />
                    </div>
                  </div>
                  <p
                    hidden={!log.reason}
                    className="text-sm text-muted-foreground"
                  >
                    {log.reason}
                  </p>
                </div>
              );
            })
          ) : (
            <p>No results.</p>
          )}
        </div>
        {/* <div className="flex flex-row justify-center gap-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div> */}
      </CardContent>
    </Card>
  );
}
