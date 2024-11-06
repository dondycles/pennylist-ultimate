import { Log } from "@/store";
import { Badge } from "../ui/badge";
import Amount from "../amount";

export default function HistoryLogCard({ log }: { log: Log }) {
  return (
    <div key={log.id} className="pb-4 border-b flex flex-col gap-2">
      <div className="flex gap-4 items-start justify-between">
        <Badge
          variant={"secondary"}
          className={`capitalize text-xs ${
            (log.action === "transfer" && "text-blue-600") ||
            (log.action === "delete" && "text-destructive") ||
            (log.action === "add" && "text-green-600") ||
            (log.action === "edit" && "text-yellow-600") ||
            (log.action === "fee" && "text-destructive")
          }`}
        >
          {log.action}
        </Badge>
        <p className="text-xs text-muted-foreground">
          {new Date(log.created_at).toLocaleDateString()}
        </p>
      </div>
      <div
        style={{ color: log.changes.latest.color }}
        className="flex flex-col items-center w-full"
      >
        <p className="text-sm font-bold">{log.changes.latest.name}</p>
        <div className="flex items-baseline gap-1 justify-center w-full truncate ">
          <Amount
            amount={log.changes.prev.amount}
            settings={{ sign: true }}
            className="text-xs text-muted-foreground"
          />
          <div className="flex">
            <p className="text-xl font-semibold">
              {log.changes.latest.amount - log.changes.prev.amount > 0
                ? "+"
                : "-"}
            </p>
            <Amount
              amount={Math.abs(
                log.changes.latest.amount - log.changes.prev.amount
              )}
              settings={{ sign: true }}
              className="text-xl"
            />
            <p className="text-xl font-semibold">=</p>
          </div>
          <div>
            <Amount
              amount={log.changes.latest.amount}
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
        className="text-sm text-muted-foreground whitespace-pre-wrap"
      >
        {log.reason}
      </p>
    </div>
  );
}
