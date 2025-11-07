"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { EmptyState } from "@/components/ui-library";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TestRunLegacy } from "@/types/fetch-account-scrape-test";
import { CheckCircle, XCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface FetchAccountTestsTableProps {
  title: string;
  testRuns: TestRunLegacy[];
  emptyMessage: string;
}

export function FetchAccountTestsTable({
  title,
  testRuns,
  emptyMessage,
}: FetchAccountTestsTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTestRuns = testRuns.filter(
    (testRun) =>
      testRun.scraperType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testRun.testEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testRun.environment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (duration: number) => {
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleTestRunClick = (testId: number) => {
    router.push(`/dashboard/fetchAccountTests/${testId}`);
  };

  return (
    <SectionContainer
      title={title}
      variant="compact"
      action={
        <div className="flex items-center gap-2 w-full max-w-md">
          <Input
            type="text"
            placeholder="Search by scraper type, test entity, or environment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      }
    >
      {testRuns.length === 0 ? (
        <EmptyState title={emptyMessage} variant="minimal" />
      ) : filteredTestRuns.length === 0 ? (
        <EmptyState
          title="No results found"
          description="Try adjusting your search terms"
          variant="minimal"
        />
      ) : (
        <ScrollArea className="h-[600px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">ID</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Scraper Type</TableHead>
                <TableHead className="text-center">Test Entity</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Validations</TableHead>
                <TableHead className="text-center">Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestRuns.map((testRun) => (
                <TableRow key={testRun.id}>
                  <TableCell className="text-left font-mono font-semibold">
                    {testRun.id}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatDate(testRun.timestamp)}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {testRun.scraperType}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {testRun.testEntity}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {testRun.testPassed ? (
                        <CheckCircle className="w-5 h-5 text-success-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-error-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-sm">
                      <span className="text-success-600 font-semibold">
                        {testRun.passedValidations}
                      </span>
                      <span className="text-muted-foreground"> / </span>
                      <span className="text-muted-foreground">
                        {testRun.totalValidations}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    {formatDuration(testRun.testDuration)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleTestRunClick(testRun.id)}
                    >
                      View Test
                    </Button>
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
