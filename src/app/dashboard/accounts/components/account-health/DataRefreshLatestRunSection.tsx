"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useAccountHealthAccountStatus } from "@/hooks/account-health/useAccountHealthAccountStatus";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  EMPTY_RUN_RESULT_LABEL,
  getSummaryEmptyReason,
  healthRunStatusBadgeClass,
} from "@/lib/account-health/displayRules";
import { getAccountHealthRunDetailHref } from "@/lib/account-health/accountRoutes";
import { cn } from "@/lib/utils";
import { AccountHealthRunTimeline } from "./run-detail/AccountHealthRunTimeline";
import { AccountHealthRunBlockingCard } from "./run-detail/AccountHealthRunBlockingCard";
import { AccountHealthRunStepsTable } from "./run-detail/AccountHealthRunStepsTable";

interface DataRefreshLatestRunSectionProps {
  accountId: number;
}

export default function DataRefreshLatestRunSection({
  accountId,
}: DataRefreshLatestRunSectionProps) {
  const { data } = useAccountHealthAccountStatus(accountId);
  const { strapiLocation } = useGlobalContext();
  const [open, setOpen] = useState(true);

  const latestRun = data?.data?.latestRun;
  const account = data?.data?.account;

  const sortedItems = useMemo(() => {
    if (!latestRun?.items) return [];
    return [...latestRun.items].sort(
      (a, b) => a.stepIndex - b.stepIndex || a.id - b.id
    );
  }, [latestRun?.items]);

  if (!latestRun || !account) return null;

  const emptyMeta = getSummaryEmptyReason(latestRun.summary);
  const runHref = getAccountHealthRunDetailHref(latestRun.id, account.id);

  return (
    <SectionContainer
      title="Latest run — workflow"
      description="Step-by-step detail for the current or most recent refresh run"
      variant="compact"
      action={
        <Button variant="outline" size="sm" asChild>
          <Link href={runHref}>Open full run detail</Link>
        </Button>
      }
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="mb-4 w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={healthRunStatusBadgeClass(latestRun.status)}
              >
                {latestRun.status}
              </Badge>
              <span className="font-mono text-sm">Run #{latestRun.id}</span>
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                open && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
          {latestRun.failureReason && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              <strong>Run failure:</strong> {latestRun.failureReason}
            </div>
          )}
          {emptyMeta.isEmptyResult && (
            <div className="rounded-md border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
              {EMPTY_RUN_RESULT_LABEL}
              {emptyMeta.reasonDisplay
                ? `: ${emptyMeta.reasonDisplay}`
                : ""}
            </div>
          )}

          <AccountHealthRunTimeline
            startedAt={latestRun.startedAt}
            queuedAt={latestRun.queuedAt}
            completedAt={latestRun.completedAt}
            finalizedAt={latestRun.finalizedAt}
          />

          {latestRun.blockingItem && (
            <AccountHealthRunBlockingCard
              item={latestRun.blockingItem}
              runFailed={latestRun.status === "failed"}
              itemStrapiBase={strapiLocation.accountHealthItem}
            />
          )}

          <AccountHealthRunStepsTable
            items={sortedItems}
            runFailed={latestRun.status === "failed"}
            itemStrapiBase={strapiLocation.accountHealthItem}
          />
        </CollapsibleContent>
      </Collapsible>
    </SectionContainer>
  );
}
