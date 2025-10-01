"use client";

import { useState } from "react";
import { SectionTitle } from "@/components/type/titles";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TestRun } from "@/types/fetch-test";
import { CheckIcon, XIcon } from "lucide-react";
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
    <div className="mb-6">
      <div className="bg-slate-200 rounded-lg px-4 py-2">
        <div className="flex justify-between items-center py-2">
          <SectionTitle className="py-2 px-1">{title}</SectionTitle>
          {/* Input filter */}
          <div className="flex items-center w-1/2">
            <Input
              type="text"
              placeholder="Search by ID, Date, Duration, or Test Results..."
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

        <div className="bg-white rounded-lg p-4">
          {/* Table */}
          {filteredTestRuns.length > 0 ? (
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
                    <TableCell className="text-left font-mono">
                      {testRun.id}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatDate(testRun.timestamp)}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {formatDuration(testRun.testDuration)}
                    </TableCell>
                    <TableCell className="text-center">
                      {testRun.passedTests}
                    </TableCell>
                    <TableCell className="text-center">
                      {testRun.failedTests}
                    </TableCell>
                    <TableCell className="text-center flex justify-center items-center">
                      {testRun.failedTests === 0 ? (
                        <CheckIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <XIcon className="w-4 h-4 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() => handleViewTest(testRun.id)}
                      >
                        View Test
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">{emptyMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
