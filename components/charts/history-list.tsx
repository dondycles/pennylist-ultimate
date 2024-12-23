import { Log, useLogsStore } from "@/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import HistoryLogCard from "./history-log-card";
import Fuse from "fuse.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { Button } from "../ui/button";
export default function HistoryList({
  modifiedlogs,
}: {
  modifiedlogs?: Log[];
}) {
  const { logs: rawLogs } = useLogsStore();
  const logs = modifiedlogs ?? rawLogs;
  const [search, setSearch] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 500);
  const { ref, inView } = useInView();

  const fuse = new Fuse([...logs.toReversed()], {
    keys: ["money_name", "action", "reason"],
  });

  const filteredLogs = debouncedSearch
    ? fuse.search(debouncedSearch).map((l) => l.item)
    : logs.toReversed();

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ["history-logs", debouncedSearch ?? "none"],
    queryFn: async ({ pageParam = 1 }) => {
      return filteredLogs.slice((pageParam - 1) * 4, pageParam * 4);
    },
    initialPageParam: 0,
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialData: {
      pages: [filteredLogs.slice(0, 4)],
      pageParams: [1],
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  function sortLogs() {
    const logs = data.pages.flatMap((l) => l);
    return logs.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  const sortedLogs = sortLogs();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>
          All actions done with the moneys are logged
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="px-4">
          <Input
            value={search ?? ""}
            onChange={({ currentTarget: { value } }) =>
              setSearch(value.length === 0 ? null : value)
            }
            placeholder="Search by money/action/reason"
          />
        </div>
        <div className="flex flex-col gap-4 px-4">
          {sortedLogs.map((l) => {
            return <HistoryLogCard log={l} key={l.id} />;
          })}
          {sortedLogs.length !== filteredLogs.length ? (
            <Button
              variant={"secondary"}
              ref={ref}
              onClick={() => {
                fetchNextPage();
              }}
            >
              Load More
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
