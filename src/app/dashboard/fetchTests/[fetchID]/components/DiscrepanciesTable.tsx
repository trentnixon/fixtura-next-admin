"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ByIDResponse } from "@/types/fetch-test";
import { SectionTitle } from "@/components/type/titles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { XIcon, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

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
      discrepancy.fieldPath.toLowerCase().includes(searchLower) ||
      discrepancy.fieldType.toLowerCase().includes(searchLower) ||
      discrepancy.severity.toLowerCase().includes(searchLower) ||
      discrepancy.gameId.toLowerCase().includes(searchLower) ||
      (discrepancy.expected &&
        discrepancy.expected.toLowerCase().includes(searchLower)) ||
      (discrepancy.actual &&
        discrepancy.actual.toString().toLowerCase().includes(searchLower))
    );
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (allDiscrepancies.length === 0) {
    return (
      <Card className="bg-slate-50 border-b-4 border-b-green-500 mb-6">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Discrepancies</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-600">
              No Discrepancies Found
            </p>
            <p className="text-sm text-muted-foreground">
              All tests passed successfully
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-50 border-b-4 border-b-red-500 mb-6">
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>
              Discrepancies ({allDiscrepancies.length})
            </SectionTitle>
          </CardTitle>
          <div className="flex items-center w-1/2">
            <Input
              type="text"
              placeholder="Search discrepancies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <Button
              variant="ghost"
              onClick={() => setSearch("")}
              className="ml-2 px-4 py-2 rounded-md focus:outline-none"
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="bg-white rounded-lg">
          {filteredDiscrepancies.length > 0 ? (
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
                    <TableCell className="text-left font-mono text-sm">
                      {discrepancy.gameId}
                    </TableCell>
                    <TableCell className="text-left">
                      <div>
                        <div className="font-medium">
                          {discrepancy.fieldPath}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {discrepancy.fieldType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getSeverityColor(discrepancy.severity)}>
                        {discrepancy.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center max-w-xs">
                      <div
                        className="truncate"
                        title={discrepancy.expected || "null"}
                      >
                        {discrepancy.expected || "null"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center max-w-xs">
                      <div
                        className="truncate"
                        title={discrepancy.actual?.toString() || "null"}
                      >
                        {discrepancy.actual?.toString() || "null"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center flex justify-center items-center">
                      {discrepancy.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-lg font-medium">
                No discrepancies match your search
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
