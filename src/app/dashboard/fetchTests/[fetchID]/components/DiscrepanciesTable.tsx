"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { EmptyState } from "@/components/ui-library";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ByIDResponse } from "@/types/fetch-test";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, XCircle } from "lucide-react";

interface DiscrepanciesTableProps {
  data: ByIDResponse;
}

export function DiscrepanciesTable({ data }: DiscrepanciesTableProps) {
  const [search, setSearch] = useState("");

  // Flatten all discrepancies from all games
  const allDiscrepancies = data.detailedResults.flatMap((result) =>
    result.discrepancies.map((discrepancy) => ({
      ...discrepancy,
      gameId: result.gameId,
      passed: result.passed,
    }))
  );

  const filteredDiscrepancies = allDiscrepancies.filter((discrepancy) => {
    const searchLower = search.toLowerCase();
    return (
      discrepancy.fieldPath?.toLowerCase().includes(searchLower) ||
      discrepancy.fieldType?.toLowerCase().includes(searchLower) ||
      (discrepancy.severity &&
        discrepancy.severity.toLowerCase().includes(searchLower)) ||
      discrepancy.gameId?.toLowerCase().includes(searchLower) ||
      (discrepancy.expected &&
        discrepancy.expected.toLowerCase().includes(searchLower)) ||
      (discrepancy.actual &&
        discrepancy.actual.toString().toLowerCase().includes(searchLower))
    );
  });

  const getSeverityBadgeColor = (severity: string | undefined) => {
    if (!severity) {
      return "bg-slate-500 text-white";
    }

    switch (severity.toLowerCase()) {
      case "error":
        return "bg-error-500 text-white";
      case "warning":
        return "bg-warning-500 text-white";
      case "info":
        return "bg-info-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  return (
    <SectionContainer
      title={`Discrepancies${
        allDiscrepancies.length > 0 ? ` (${allDiscrepancies.length})` : ""
      }`}
      description="Detailed discrepancies found in test results"
      variant="compact"
      action={
        allDiscrepancies.length > 0 ? (
          <div className="flex items-center gap-2 w-full max-w-md">
            <Input
              type="text"
              placeholder="Search discrepancies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
            {search && (
              <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : undefined
      }
    >
      {allDiscrepancies.length === 0 ? (
        <EmptyState
          title="No Discrepancies Found"
          description="All tests passed successfully"
          variant="minimal"
        />
      ) : filteredDiscrepancies.length === 0 ? (
        <EmptyState
          title="No discrepancies match your search"
          description="Try adjusting your search terms"
          variant="minimal"
        />
      ) : (
        <ScrollArea className="h-[600px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Game ID</TableHead>
                <TableHead className="text-left">Field Path</TableHead>
                <TableHead className="text-center">Severity</TableHead>
                <TableHead className="text-center">Expected</TableHead>
                <TableHead className="text-center">Actual</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDiscrepancies.map((discrepancy, index) => (
                <TableRow key={`${discrepancy.gameId}-${index}`}>
                  <TableCell className="text-left font-mono text-sm font-semibold">
                    {discrepancy.gameId}
                  </TableCell>
                  <TableCell className="text-left">
                    <div>
                      <div className="font-medium text-sm">
                        {discrepancy.fieldPath}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {discrepancy.fieldType}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Badge
                        className={`rounded-full ${getSeverityBadgeColor(
                          discrepancy.severity
                        )}`}
                      >
                        {discrepancy.severity || "unknown"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center max-w-xs">
                    <div
                      className="truncate text-sm"
                      title={discrepancy.expected || "null"}
                    >
                      {discrepancy.expected || "null"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center max-w-xs">
                    <div
                      className="truncate text-sm"
                      title={discrepancy.actual?.toString() || "null"}
                    >
                      {discrepancy.actual?.toString() || "null"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {discrepancy.passed ? (
                        <CheckCircle className="w-5 h-5 text-success-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-error-500" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </SectionContainer>
  );
}
