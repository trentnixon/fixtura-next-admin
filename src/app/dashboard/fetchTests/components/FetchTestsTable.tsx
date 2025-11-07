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
import { TestRun } from "@/types/fetch-test";
import { CheckCircle, XCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface FetchTestsTableProps {
  title: string;
  testRuns: TestRun[];
  emptyMessage: string;
}

export function FetchTestsTable({
  title,
  testRuns,
  emptyMessage,
}: FetchTestsTableProps) {
  const router = useRouter();

  // State for search input and filtered test runs
  const [search, setSearch] = useState("");
  const filteredTestRuns = testRuns.filter((testRun) => {
    const id = testRun.id.toString();
    const timestamp = testRun.timestamp.toLowerCase();
    const passedTests = testRun.passedTests.toString();
    const failedTests = testRun.failedTests.toString();
    const testDuration = testRun.testDuration.toString();

    return (
      id.includes(search.toLowerCase()) ||
      timestamp.includes(search.toLowerCase()) ||
      passedTests.includes(search.toLowerCase()) ||
      failedTests.includes(search.toLowerCase()) ||
      testDuration.includes(search.toLowerCase())
    );
  });

  const formatDuration = (duration: number) => {
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleViewTest = (testId: number) => {
    router.push(`/dashboard/fetchTests/${testId}`);
  };

  return (
    <SectionContainer
      title={title}
      variant="compact"
      action={
        <div className="flex items-center gap-2 w-full max-w-md">
          <Input
            type="text"
            placeholder="Search by ID, Date, Duration, or Test Results..."
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
                <TableHead className="text-center">Duration</TableHead>
                <TableHead className="text-center">Passed Tests</TableHead>
                <TableHead className="text-center">Failed Tests</TableHead>
                <TableHead className="text-center">Status</TableHead>
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
                  <TableCell className="text-center font-mono text-sm">
                    {formatDuration(testRun.testDuration)}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {testRun.passedTests}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {testRun.failedTests}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {testRun.failedTests === 0 ? (
                        <CheckCircle className="w-5 h-5 text-success-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-error-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleViewTest(testRun.id)}
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
