"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fixtureProgressLine } from "@/lib/account-health/displayRules";
import { cn } from "@/lib/utils";
import type { AccountHealthItem } from "@/types/accountHealth";
import {
  healthRunActionButtonClass,
  healthRunFixturePanelClass,
  healthRunProcessingStatusBadgeClass,
} from "./healthRunPageStyles";

function fixtureProgressPercent(terminal: number, expected: number): number {
  if (expected <= 0) return 0;
  return Math.min(100, Math.round((terminal / expected) * 100));
}

export function NonTerminalFixtureRows({
  item,
  itemStrapiBase,
}: {
  item: AccountHealthItem;
  itemStrapiBase: string;
}) {
  const rows = item.fixtureDiscovery?.nonTerminalRows ?? [];
  const [open, setOpen] = useState(false);

  if (rows.length === 0) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-9 w-full justify-between gap-2 px-3",
            healthRunActionButtonClass,
          )}
        >
          <span>Non-terminal rows ({rows.length})</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 overflow-hidden rounded-md border border-brandSecondary-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Row</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">CMS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-sm">#{r.id}</TableCell>
                <TableCell className="text-sm">
                  {r.gradeId != null ? `#${r.gradeId}` : "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      healthRunProcessingStatusBadgeClass(r.processingStatus),
                    )}
                  >
                    {r.processingStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {itemStrapiBase ? (
                    <a
                      href={`${itemStrapiBase}${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-brandSecondary-700 underline underline-offset-2 hover:text-brandSecondary-900"
                    >
                      Item
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function FixtureDiscoveryDetails({
  item,
  runFailed = false,
  itemStrapiBase,
  variant = "default",
}: {
  item: AccountHealthItem;
  runFailed?: boolean;
  itemStrapiBase: string;
  variant?: "default" | "compact";
}) {
  const fd = item.fixtureDiscovery;
  if (!fd || fd.expectedTerminalCount <= 0) {
    return variant === "compact" ? (
      <span className="text-muted-foreground">—</span>
    ) : null;
  }

  const percent = fixtureProgressPercent(fd.terminal, fd.expectedTerminalCount);
  const line = fixtureProgressLine(fd.terminal, fd.expectedTerminalCount);
  const progressTextClass =
    fd.failed > 0 && runFailed ? "text-brandError-800" : "text-brandPrimary-900";

  const isCompact = variant === "compact";

  return (
    <div className={cn("space-y-3", isCompact && "space-y-2")}>
      <div className={cn("space-y-2", !isCompact && healthRunFixturePanelClass)}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p
            className={cn(
              "font-semibold tabular-nums",
              isCompact ? "text-sm" : "text-lg",
              progressTextClass,
            )}
          >
            {line}
          </p>
          <span
            className={cn(
              "font-semibold tabular-nums text-muted-foreground",
              isCompact ? "text-xs" : "text-sm",
            )}
          >
            {percent}%
          </span>
        </div>
        <Progress
          value={percent}
          className={cn("bg-brandSecondary-100", isCompact ? "h-2" : "h-2.5")}
          indicatorClassName={
            fd.failed > 0 && runFailed
              ? "bg-brandError-500"
              : percent >= 100
                ? "bg-brandSuccess-500"
                : "bg-brandSecondary-600"
          }
        />
        {(fd.nonTerminal > 0 || fd.failed > 0) && (
          <p className="text-xs text-muted-foreground">
            {fd.nonTerminal > 0 && (
              <span>{fd.nonTerminal} non-terminal</span>
            )}
            {fd.nonTerminal > 0 && fd.failed > 0 && <span> · </span>}
            {fd.failed > 0 && <span>{fd.failed} failed ingest</span>}
          </p>
        )}
      </div>
      <NonTerminalFixtureRows item={item} itemStrapiBase={itemStrapiBase} />
    </div>
  );
}
