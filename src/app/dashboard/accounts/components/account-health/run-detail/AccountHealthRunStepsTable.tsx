"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  formatHealthStepDuration,
  formatHealthTimestamp,
} from "@/lib/account-health/formatHealthTimestamp";
import { getAccountHealthScopeLabel } from "@/lib/account-health/scopeLabels";
import { cn } from "@/lib/utils";
import type { AccountHealthItem } from "@/types/accountHealth";
import { FixtureDiscoveryDetails } from "./AccountHealthFixtureDiscovery";
import {
  healthRunActionButtonClass,
  healthRunItemStatusBadgeClass,
  healthRunStepIndexClass,
  healthRunTableHeaderClass,
  healthRunTableRowHoverClass,
} from "./healthRunPageStyles";

interface AccountHealthRunStepsTableProps {
  items: AccountHealthItem[];
  runFailed: boolean;
  itemStrapiBase: string;
}

export function AccountHealthRunStepsTable({
  items,
  runFailed,
  itemStrapiBase,
}: AccountHealthRunStepsTableProps) {
  return (
    <SectionContainer
      title="Steps"
      description="Workflow sequence for this data refresh run"
      variant="compact"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className={healthRunTableHeaderClass}>
              <TableHead className="font-semibold text-brandPrimary-900">Step</TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-brandPrimary-900">
                Start
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-brandPrimary-900">
                End
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-brandPrimary-900">
                Time taken
              </TableHead>
              <TableHead className="font-semibold text-brandPrimary-900">
                Status &amp; progress
              </TableHead>
              <TableHead className="w-[140px] text-right font-semibold text-brandPrimary-900">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  No step items.
                </TableCell>
              </TableRow>
          ) : (
            items.map((item) => {
              const scopeLabel = getAccountHealthScopeLabel(item.scope);
              const fd = item.fixtureDiscovery;
              const hasFixtureProgress =
                fd != null && fd.expectedTerminalCount > 0;

              return (
                <TableRow key={item.id} className={healthRunTableRowHoverClass}>
                  <TableCell className="py-3 align-top">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-sm font-semibold tabular-nums",
                          healthRunStepIndexClass(item.scope, item.status),
                        )}
                      >
                        {item.stepIndex}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-brandPrimary-900">
                          {scopeLabel}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {item.targetType} #{item.targetId}
                        </div>
                        {item.bullJobId && (
                          <div
                            className="mt-1 max-w-[280px] truncate font-mono text-[11px] text-muted-foreground"
                            title={item.bullJobId}
                          >
                            Bull: {item.bullJobId}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap py-3 align-top text-sm tabular-nums text-brandPrimary-900">
                    {formatHealthTimestamp(item.startedAt)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap py-3 align-top text-sm tabular-nums text-brandPrimary-900">
                    {formatHealthTimestamp(item.completedAt)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap py-3 align-top text-sm font-medium tabular-nums text-brandPrimary-900">
                    {formatHealthStepDuration(
                      item.startedAt,
                      item.completedAt,
                    )}
                  </TableCell>

                  <TableCell className="py-3 align-top">
                    <div className="flex flex-col items-start gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          healthRunItemStatusBadgeClass(item.status),
                        )}
                      >
                        {item.status}
                      </Badge>
                      {item.failureReason && (
                        <p className="max-w-[320px] text-xs text-brandError-800">
                          {item.failureReason}
                        </p>
                      )}
                      {hasFixtureProgress && (
                        <div className="w-full max-w-[360px] text-left">
                          <FixtureDiscoveryDetails
                            item={item}
                            runFailed={runFailed}
                            itemStrapiBase={itemStrapiBase}
                            variant="compact"
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="py-3 text-right align-top">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {itemStrapiBase ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className={healthRunActionButtonClass}
                          asChild
                        >
                          <a
                            href={`${itemStrapiBase}${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1"
                          >
                            CMS
                            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
          </TableBody>
        </Table>
      </div>
    </SectionContainer>
  );
}
