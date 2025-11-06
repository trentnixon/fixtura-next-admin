"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
  PaginationInfo,
} from "@/components/ui/pagination";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";
import CodeExample from "./_elements/CodeExample";

/**
 * Tables Showcase
 *
 * Displays Table component examples
 */
type SortField = "name" | "email" | "role" | "status" | null;
type SortDirection = "asc" | "desc" | null;

export default function TablesShowcase() {
  // Sample data for paginated table
  const sampleData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      role: "Editor",
      status: "Active",
    },
    {
      id: 5,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 6,
      name: "Diana Prince",
      email: "diana@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 7,
      name: "Edward Norton",
      email: "edward@example.com",
      role: "User",
      status: "Pending",
    },
    {
      id: 8,
      name: "Fiona Apple",
      email: "fiona@example.com",
      role: "Editor",
      status: "Active",
    },
    {
      id: 9,
      name: "George Washington",
      email: "george@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 10,
      name: "Hannah Montana",
      email: "hannah@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      id: 11,
      name: "Isaac Newton",
      email: "isaac@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 12,
      name: "Julia Roberts",
      email: "julia@example.com",
      role: "Editor",
      status: "Active",
    },
  ];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(sampleData.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sampleData.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      Active: "bg-success-500 text-white border-0",
      Inactive: "bg-error-500 text-white border-0",
      Pending: "bg-warning-500 text-white border-0",
    };
    return statusMap[status] || "bg-slate-500 text-white border-0";
  };

  // Advanced table state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [advancedCurrentPage, setAdvancedCurrentPage] = useState(1);
  const advancedItemsPerPage = 5;

  // Filter and sort data
  const filteredData = sampleData.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: string | number = a[sortField];
    let bValue: string | number = b[sortField];

    if (
      sortField === "name" ||
      sortField === "email" ||
      sortField === "role" ||
      sortField === "status"
    ) {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Paginate sorted data
  const advancedTotalPages = Math.ceil(
    sortedData.length / advancedItemsPerPage
  );
  const advancedStartIndex = (advancedCurrentPage - 1) * advancedItemsPerPage;
  const advancedEndIndex = advancedStartIndex + advancedItemsPerPage;
  const advancedPaginatedData = sortedData.slice(
    advancedStartIndex,
    advancedEndIndex
  );

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setAdvancedCurrentPage(1); // Reset to first page on sort
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4 ml-1" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1" />;
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
    setSortField(null);
    setSortDirection(null);
    setAdvancedCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery || roleFilter !== "all" || statusFilter !== "all" || sortField;

  return (
    <>
      <SectionContainer
        title="Tables"
        description="Data table components for displaying structured data"
      >
        <div className="space-y-6">
          <ElementContainer title="Basic Table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>
                    <Badge className="bg-success-500 text-white border-0">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>
                    <Badge className="bg-success-500 text-white border-0">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>User</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bob Johnson</TableCell>
                  <TableCell>
                    <Badge className="bg-error-500 text-white border-0">
                      Inactive
                    </Badge>
                  </TableCell>
                  <TableCell>User</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-6">
              <CodeExample
                code={`import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>Active</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
              />
            </div>
          </ElementContainer>

          <ElementContainer title="Table with Caption">
            <Table>
              <TableCaption>A list of recent transactions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2024-01-15</TableCell>
                  <TableCell>$1,234.56</TableCell>
                  <TableCell>
                    <Badge className="bg-success-500 text-white border-0">
                      Completed
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-01-14</TableCell>
                  <TableCell>$987.65</TableCell>
                  <TableCell>
                    <Badge className="bg-warning-500 text-white border-0">
                      Pending
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-6">
              <CodeExample
                code={`import { TableCaption } from "@/components/ui/table";

<Table>
  <TableCaption>A list of recent transactions</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Date</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>2024-01-15</TableCell>
      <TableCell>$1,234.56</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
              />
            </div>
          </ElementContainer>

          <ElementContainer title="Table with Footer">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Product A</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell className="text-right">$50.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Product B</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell className="text-right">$30.00</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right font-semibold">
                    $80.00
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <div className="mt-6">
              <CodeExample
                code={`import { TableFooter } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Item</TableHead>
      <TableHead className="text-right">Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Product A</TableCell>
      <TableCell className="text-right">$50.00</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={1}>Total</TableCell>
      <TableCell className="text-right font-semibold">$80.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>`}
              />
            </div>
          </ElementContainer>

          <ElementContainer title="Table with Pagination">
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
                        <Badge className={getStatusBadge(user.status)}>
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
              <div className="flex items-center justify-between">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  variant="primary"
                  className="w-full"
                >
                  <PaginationInfo
                    format="long"
                    totalItems={sampleData.length}
                    itemsPerPage={itemsPerPage}
                    className="mr-auto"
                  />
                  <div className="flex items-center gap-1 ml-auto">
                    <PaginationPrevious />
                    <PaginationPages />
                    <PaginationNext />
                  </div>
                </Pagination>
              </div>
            </div>
            <div className="mt-6">
              <CodeExample
                code={`import { useState } from "react";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
  PaginationInfo,
} from "@/components/ui/pagination";

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;
const totalPages = Math.ceil(data.length / itemsPerPage);
const paginatedData = data.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {paginatedData.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

<div className="flex items-center justify-between mt-4">
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
    variant="primary"
    className="w-full"
  >
    <PaginationInfo
      format="long"
      totalItems={data.length}
      itemsPerPage={itemsPerPage}
      className="mr-auto"
    />
    <div className="flex items-center gap-1 ml-auto">
      <PaginationPrevious />
      <PaginationPages />
      <PaginationNext />
    </div>
  </Pagination>
</div>`}
              />
            </div>
          </ElementContainer>

          <ElementContainer title="Advanced Table with Search, Filtering, Sorting & Pagination">
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setAdvancedCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setAdvancedCurrentPage(1);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Role Filter */}
                <Select
                  value={roleFilter}
                  onValueChange={(value) => {
                    setRoleFilter(value);
                    setAdvancedCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setAdvancedCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                {/* Reset Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="whitespace-nowrap"
                  >
                    Reset Filters
                  </Button>
                )}
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                Showing {advancedPaginatedData.length} of {sortedData.length}{" "}
                results
                {filteredData.length !== sampleData.length &&
                  ` (filtered from ${sampleData.length} total)`}
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("name")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Name
                        {getSortIcon("name")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("email")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Email
                        {getSortIcon("email")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("role")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Role
                        {getSortIcon("role")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("status")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Status
                        {getSortIcon("status")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advancedPaginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-8"
                      >
                        No results found. Try adjusting your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    advancedPaginatedData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {advancedTotalPages > 0 && (
                <div className="flex items-center justify-between">
                  <Pagination
                    currentPage={advancedCurrentPage}
                    totalPages={advancedTotalPages}
                    onPageChange={setAdvancedCurrentPage}
                    variant="primary"
                    className="w-full"
                  >
                    <PaginationInfo
                      format="long"
                      totalItems={sortedData.length}
                      itemsPerPage={advancedItemsPerPage}
                      className="mr-auto"
                    />
                    <div className="flex items-center gap-1 ml-auto">
                      <PaginationPrevious />
                      <PaginationPages />
                      <PaginationNext />
                    </div>
                  </Pagination>
                </div>
              )}
            </div>
            <div className="mt-6">
              <CodeExample
                code={`import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
  PaginationInfo,
} from "@/components/ui/pagination";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";

type SortField = "name" | "email" | "role" | "status" | null;
type SortDirection = "asc" | "desc" | null;

function AdvancedTable({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter data
  const filteredData = data.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || item.role === roleFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    let aValue = a[sortField].toLowerCase();
    let bValue = b[sortField].toLowerCase();
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Paginate
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortDirection === "asc"
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="h-auto p-0"
              >
                Name {getSortIcon("name")}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      >
        <PaginationPrevious />
        <PaginationPages />
        <PaginationNext />
      </Pagination>
    </div>
  );
}`}
              />
            </div>
          </ElementContainer>
        </div>
      </SectionContainer>

      <SectionContainer
        title="Usage Guidelines"
        description="Best practices for using table components"
      >
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Tables</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use for structured, tabular data</li>
              <li>Always include TableHeader for accessibility</li>
              <li>Use TableFooter for totals and summaries</li>
              <li>Use TableCaption for table descriptions</li>
              <li>Consider pagination for large datasets</li>
            </ul>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
