import { Log } from "@/store";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";

export default function CommonReasons({
  logs,
  setValue,
}: {
  logs: Log[];
  setValue: (v: string) => void;
}) {
  const [commonReasons, setCommonReasons] = useState<string[]>([]);
  const getCommonReasons = (logs: Log[]): string[] => {
    const reasons = logs.map((l) => l.reason).filter((a) => a !== "");

    const reasonCount: Record<string, number> = reasons.reduce(
      (acc, reason) => {
        acc[reason] = (acc[reason] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const sortByCount = Object.entries(reasonCount).toSorted(
      (a, b) => b[1] - a[1]
    );

    // Get reasons with the max count
    const tenCommonReasons = sortByCount
      .map((reason) => reason[0])
      .splice(0, 10);
    console.log("hi");
    return tenCommonReasons;
  };
  useEffect(() => {
    setCommonReasons(getCommonReasons(logs));
  }, []);
  return commonReasons.length !== 0 ? (
    <>
      <div className="flex flex-wrap pl-8 gap-2">
        {commonReasons.map((r) => {
          return (
            <button
              onClick={() => {
                setValue(r);
              }}
              type="button"
              key={r}
            >
              <Badge variant={"outline"} className="w-fit h-fit">
                {r}
              </Badge>
            </button>
          );
        })}
      </div>
    </>
  ) : null;
}
