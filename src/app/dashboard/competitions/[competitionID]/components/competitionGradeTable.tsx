"use client";

import { useGlobalContext } from "@/components/providers/GlobalContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useCompetitionsQuery } from "@/hooks/competitions/useFetchCompetitionByID";
import { DatabaseIcon, ExternalLinkIcon, EyeIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export const CompetitionGradeTable = () => {
  const { competitionID } = useParams();
  const { strapiLocation } = useGlobalContext();
  const { data, isLoading, isError, error } = useCompetitionsQuery(
    Number(competitionID)
  );

  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) return <p>Loading competition details...</p>;
  if (isError) return <p>Error loading competition: {error?.message}</p>;

  const competition = data?.attributes;
  const grades = competition?.grades?.data || [];

  // Filter grades based on search query (case-insensitive)
  const filteredGrades = grades.filter(grade =>
    grade.attributes.gradeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-8">
      <div className="bg-slate-200 rounded-lg px-4 py-2">
        {grades.length > 0 && (
          <div>
            <div className="flex justify-between items-center  py-2">
              <h2 className="text-xl font-semibold mb-2">
                Grades in Competition ({grades.length})
              </h2>

              {/* Search Input */}
              <div className="flex items-center w-1/2">
                <Input
                  type="text"
                  placeholder="Search by Grade Name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-white w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                <Button
                  variant="ghost"
                  onClick={() => setSearchQuery("")}
                  className="ml-2 px-4 py-2 rounded-md focus:outline-none">
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-sm border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Grade Name</TableHead>
                    <TableHead className="text-center">Age Group</TableHead>
                    <TableHead className="text-center">Days Played</TableHead>
                    <TableHead className="text-center">Gender</TableHead>
                    <TableHead className="text-center">Strapi</TableHead>
                    <TableHead className="text-center">PlayHQ</TableHead>
                    <TableHead className="text-center">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrades.length > 0 ? (
                    filteredGrades.map(grade => (
                      <TableRow key={grade.id}>
                        <TableCell className="text-left">
                          {grade.attributes.gradeName}
                        </TableCell>
                        <TableCell className="text-center">
                          {grade.attributes.ageGroup}
                        </TableCell>
                        <TableCell className="text-center">
                          {grade.attributes.daysPlayed}
                        </TableCell>
                        <TableCell className="text-center">
                          {grade.attributes.gender}
                        </TableCell>
                        <TableCell className="text-center">
                          <Link
                            href={`${strapiLocation.grade}${grade.id}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            <Button variant="outline">
                              <DatabaseIcon size="16" />
                            </Button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link href={grade.attributes.url} target="_blank">
                            <Button variant="outline">
                              <ExternalLinkIcon size="16" />
                            </Button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/dashboard/grades/${grade.id}`}>
                            <Button variant="outline">
                              <EyeIcon size="16" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-gray-500">
                        No grades found matching &quot;{searchQuery}&quot;
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
