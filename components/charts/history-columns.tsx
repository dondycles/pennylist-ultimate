import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import Amount from "../amount";
import { ChevronsDown, ChevronsUp, ChevronsUpDown } from "lucide-react";
import { Log } from "@/store";

export const historyColumns: ColumnDef<Log | undefined>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.original?.action;
      return (
        <Badge
          className={`capitalize text-xs ${
            (action === "transfer" && "text-blue-600") ||
            (action === "delete" && "text-destructive") ||
            (action === "add" && "text-green-600") ||
            (action === "edit" && "text-yellow-600")
          }`}
        >
          {row.original?.action}
        </Badge>
      );
    },
  },
  {
    accessorKey: "money",
    header: "Money",
    cell: ({ row }) => {
      return (
        <p className="capitalize text-xs truncate">
          {row.original?.money_name ??
            (row.original as unknown as { money: string }).money}
        </p>
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
      const prev = row.original?.changes.prev;
      const latest = row.original?.changes.latest;
      const isNegative = (latest?.amount ?? 0) - (prev?.amount ?? 0) >= 0;
      return (
        <div className="truncate text-xs">
          {row.original?.changes?.prev.name !==
          row.original?.changes?.latest.name ? (
            <p>
              <span>{prev?.name}</span>
              <span> to </span>
              <span>{latest?.name}</span>
            </p>
          ) : null}
          <p>
            {row.original?.action === "fee" ? (
              <span className="text-destructive font-bold text-base">
                <Amount
                  className="text-xs"
                  amount={latest?.amount ?? 0}
                  settings={{ sign: true }}
                />
              </span>
            ) : (
              <>
                <span>
                  <Amount
                    className="text-xs"
                    amount={prev?.amount ?? 0}
                    settings={{ sign: true }}
                  />
                </span>
                <span> to </span>
                <span>
                  <Amount
                    className="text-xs"
                    amount={latest?.amount ?? 0}
                    settings={{ sign: true }}
                  />
                  {" | "}
                </span>
                <span
                  className={`font-bold text-base ${
                    !isNegative ? "text-destructive" : "text-green-600"
                  }`}
                >
                  {isNegative ? "+" : "-"}
                  <Amount
                    className="text-xs"
                    amount={Math.abs(
                      (latest?.amount ?? 0) - (prev?.amount ?? 0)
                    )}
                    settings={{ sign: true }}
                  />
                </span>
              </>
            )}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "currentTotal",
    header: "Current Total",
    cell: ({ row }) => {
      return (
        <Amount
          amount={row.original?.current_total ?? 0}
          className="text-xs"
          settings={{ sign: true }}
        />
      );
    },
  },
  {
    accessorKey: "created_at",
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
          {new Date(row.original?.created_at ?? "").toLocaleString()}
        </p>
      );
    },
  },
];
