import { splitHealthTimestamp } from "@/lib/account-health/formatHealthTimestamp";
import { cn } from "@/lib/utils";

interface HealthTimestampStackProps {
  iso: string | null;
  className?: string;
  emptyLabel?: string;
}

export function HealthTimestampStack({
  iso,
  className,
  emptyLabel = "—",
}: HealthTimestampStackProps) {
  const parts = splitHealthTimestamp(iso);

  if (!parts) {
    return (
      <span className={cn("text-sm text-muted-foreground", className)}>
        {emptyLabel}
      </span>
    );
  }

  return (
    <div className={cn("tabular-nums", className)}>
      <div className="text-base font-bold leading-tight text-brandPrimary-900">
        {parts.time}
      </div>
      <div className="text-xs font-normal text-muted-foreground">
        {parts.date}
      </div>
    </div>
  );
}
