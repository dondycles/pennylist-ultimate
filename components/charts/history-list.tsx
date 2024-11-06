import { useLogsStore } from "@/store";
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
import { Separator } from "../ui/separator";
export default function HistoryList() {
  const { logs } = useLogsStore();
  const [search, setSearch] = useState<string | null>(null);
  const { ref, inView } = useInView();
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ["history-logs"],
    queryFn: async ({ pageParam = 1 }) => {
      return logs.toReversed().slice((pageParam - 1) * 4, pageParam * 4);
    },
    initialPageParam: 0,
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialData: {
      pages: [logs.toReversed().slice(0, 4)],
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

  const fuse = new Fuse([...sortedLogs], {
    keys: ["money_name", "action", "reason"],
  });

  const filteredAndSortedLogs = search
    ? fuse.search(search).map((m) => m.item)
    : sortedLogs;

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
            onChange={({ currentTarget: { value } }) => setSearch(value)}
            placeholder="Search by money/action/reason"
          />
        </div>

        <div className="flex flex-col gap-4 px-4">
          {filteredAndSortedLogs.map((l) => {
            return <HistoryLogCard log={l} key={l.id} />;
          })}
          <Separator ref={ref} />
        </div>
      </CardContent>
    </Card>
  );
}
