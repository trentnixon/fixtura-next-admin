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
import { TestRunLegacy } from "@/types/fetch-account-scrape-test";
import { CheckIcon, XIcon } from "lucide-react";
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

  if (testRuns.length === 0) {
    return (
      <div className="mb-6">
        <div className="bg-slate-200 rounded-lg px-4 py-2">
          <div className="flex justify-between items-center py-2">
            <SectionTitle className="py-2 px-1">{title}</SectionTitle>
          </div>
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="bg-slate-200 rounded-lg px-4 py-2">
        <div className="flex justify-between items-center py-2">
          <SectionTitle className="py-2 px-1">{title}</SectionTitle>
          {/* Input filter */}
          <div className="flex items-center w-1/2">
            <Input
              type="text"
              placeholder="Search by scraper type, test entity, or environment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <Button
              variant="ghost"
              onClick={() => setSearchTerm("")}
              className="ml-2 px-4 py-2 rounded-md focus:outline-none"
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          {/* Table */}
          {filteredTestRuns.length > 0 ? (
            <div className="overflow-hidden">
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
                      <TableCell className="text-left font-mono">
                        {testRun.id}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDate(testRun.timestamp)}
                      </TableCell>
                      <TableCell className="text-center">
                        {testRun.scraperType}
                      </TableCell>
                      <TableCell className="text-center">
                        {testRun.testEntity}
                      </TableCell>
                      <TableCell className="text-center flex justify-center items-center">
                        {testRun.testPassed ? (
                          <CheckIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <XIcon className="w-4 h-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-sm">
                          <span className="text-green-600">
                            {testRun.passedValidations}
                          </span>
                          /
                          <span className="text-gray-600">
                            {testRun.totalValidations}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {formatDuration(testRun.testDuration)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          onClick={() => handleTestRunClick(testRun.id)}
                        >
                          View Test
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500">{emptyMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
