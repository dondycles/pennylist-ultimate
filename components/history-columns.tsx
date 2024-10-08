import { Badge } from "@/components/ui/badge";
import { MoneyWithLogs } from "@/drizzle/infered-types";
import { ColumnDef } from "@tanstack/react-table";
import Amount from "./amount";
import { ChevronsDown, ChevronsUp, ChevronsUpDown } from "lucide-react";

export const historyColumns: ColumnDef<
  (MoneyWithLogs["money_log"][0] & { name: string }) | undefined
>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <Badge className="capitalize text-xs">{row.original?.action}</Badge>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Money",
    cell: ({ row }) => {
      return (
        <p className="capitalize text-xs truncate">{row.original?.name}</p>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      return (
        <p
          className={`capitalize text-xs ${
            row.original?.reason === "N/A" && "text-muted-foreground"
          }`}
        >
          {row.original?.reason}
        </p>
      );
    },
  },
  {
    accessorKey: "changes",
    header: "Changes",
    cell: ({ row }) => {
      return (
        <div className="truncate text-xs">
          {row.original?.changes?.prev.name !==
          row.original?.changes?.latest.name ? (
            <p>
              <span>{row.original?.changes.prev.name}</span>
              <span> to </span>
              <span>{row.original?.changes.latest.name}</span>
            </p>
          ) : null}
          {row.original?.changes?.prev.amount !==
          row.original?.changes?.latest.amount ? (
            <p>
              <span>
                <Amount
                  className="text-xs"
                  amount={row.original?.changes?.prev.amount ?? 0}
                  settings={{ sign: true }}
                />
              </span>
              <span> to </span>
              <span>
                <Amount
                  className="text-xs"
                  amount={row.original?.changes?.latest.amount ?? 0}
                  settings={{ sign: true }}
                />
              </span>
            </p>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "currentTotal",
    header: "Current Total",
    cell: ({ row }) => {
      if (row.original?.changes?.latest.total)
        return (
          <Amount
            amount={row.original?.changes?.latest.total}
            className="text-xs"
            settings={{ sign: true }}
          />
        );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          {column.getIsSorted() === "asc" ? (
            <ChevronsUp className="ml-1" size={14} />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronsDown className="ml-1" size={14} />
          ) : (
            <ChevronsUpDown className="ml-1" size={14} />
          )}
        </button>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-xs text-muted-foreground truncate">
          {/* {differenceInHours(
            new Date(row.original?.createdAt ?? ""),
            new Date()
          )}{" "}
          hr(s) ago */}
          {new Date(row.original?.createdAt ?? "").toLocaleString()}
        </p>
      );
    },
  },
];
