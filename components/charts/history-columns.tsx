import { ColumnDef } from "@tanstack/react-table";
import { ChevronsDown, ChevronsUp, ChevronsUpDown } from "lucide-react";
import { Log } from "@/store";
import { HistoryTableActionFilter } from "./history-table-action-filter";
import { Button } from "../ui/button";

export const historyColumns: ColumnDef<Log | undefined>[] = [
  {
    accessorKey: "action",
    header: ({ column }) => {
      return (
        <HistoryTableActionFilter
          column={column}
          title="Action"
          options={[
            {
              label: "Edit",
              value: "Edit",
            },
            {
              label: "Transfer",
              value: "Transfer",
            },
            {
              label: "Fee",
              value: "Fee",
            },
            {
              label: "Add",
              value: "Add",
            },
            {
              label: "Delete",
              value: "Delete",
            },
          ]}
        />
      );
    },
  },

  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant={"secondary"}
          className="flex items-center text-muted-foreground"
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
        </Button>
      );
    },
  },
];
