import * as React from "react";

import { Column } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface HistoryTableActionFilterFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function HistoryTableActionFilter<TData, TValue>({
  column,
  title,
  options,
}: HistoryTableActionFilterFilterProps<TData, TValue>) {
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!column) return;
    column.setFilterValue(selectedValue ?? undefined);
  }, [selectedValue, column]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="text-muted-foreground">
          <Plus size={16} />
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={selectedValue as string}
          onValueChange={(v) => {
            if (!selectedValue) return setSelectedValue(v);
            setSelectedValue(v === selectedValue ? null : selectedValue);
          }}
        >
          {options.map((option) => {
            return (
              <DropdownMenuRadioItem value={option.value} key={option.value}>
                {option.value}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
