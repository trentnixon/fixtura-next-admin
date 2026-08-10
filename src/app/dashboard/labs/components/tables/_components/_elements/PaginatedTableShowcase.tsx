"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
  PaginationInfo,
} from "@/components/ui/pagination";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { TABLE_TOKENS } from "./tableTokens";
import { getStatusBadgeClass, sampleUsers } from "./tableSampleData";

const ITEMS_PER_PAGE = 5;

/**
 * Paginated table showcase — table with Pagination component
 */
export default function PaginatedTableShowcase() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sampleUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = sampleUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <SectionContainer
      title="Paginated Table"
      description="Table with reusable pagination controls and item count"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Pagination</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              Pagination · PaginationInfo
            </span>
          </div>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              variant="primary"
              className="w-full"
            >
              <PaginationInfo
                format="long"
                totalItems={sampleUsers.length}
                itemsPerPage={ITEMS_PER_PAGE}
                className="mr-auto"
              />
              <div className="flex items-center gap-1 ml-auto">
                <PaginationPrevious />
                <PaginationPages />
                <PaginationNext />
              </div>
            </Pagination>
          </div>
          <ComponentRef token={TABLE_TOKENS.pagination} />
        </div>
      </div>
    </SectionContainer>
  );
}
