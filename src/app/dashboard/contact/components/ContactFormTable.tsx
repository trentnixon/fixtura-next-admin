"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactFormSubmission } from "@/types/contact-form";
import {
  Check,
  X,
  Eye,
  EyeOff,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useMarkContactFormAsRead } from "@/hooks/contact-form/useMarkContactFormAsRead";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ContactFormTableProps {
  submissions: ContactFormSubmission[];
}

type SortField =
  | "name"
  | "email"
  | "subject"
  | "daysAgo"
  | "hasSeen"
  | "Acknowledged"
  | null;
type SortDirection = "asc" | "desc" | null;

/**
 * Contact Form Table Component
 *
 * Advanced table with search, filtering, sorting, and pagination.
 * Displays contact form submissions in a table format with status badges,
 * indicators for seen/acknowledged status, and formatted timestamps.
 * Includes a "Read" button that opens a dialog with full submission details.
 */
export default function ContactFormTable({
  submissions,
}: ContactFormTableProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactFormSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const markAsRead = useMarkContactFormAsRead();

  // Advanced table state
  const [searchQuery, setSearchQuery] = useState("");
  const [seenFilter, setSeenFilter] = useState<string>("all");
  const [acknowledgedFilter, setAcknowledgedFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "—";
    }
  };

  const calculateDaysAgo = (dateString: string | null) => {
    if (!dateString) return { text: "—", days: null };
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return { text: "Today", days: 0 };
      if (diffDays === 1) return { text: "1 day ago", days: 1 };
      return { text: `${diffDays} days ago`, days: diffDays };
    } catch {
      return { text: "—", days: null };
    }
  };

  const getDaysAgoBadgeVariant = (days: number | null) => {
    if (days === null) return "outline";

    // Stale ranking:
    // 0-1 days: Fresh (green/default)
    // 2-7 days: Recent (secondary/yellow)
    // 8-30 days: Stale (warning/orange)
    // 31+ days: Very stale (destructive/red)

    if (days <= 1) return "default"; // Fresh
    if (days <= 7) return "secondary"; // Recent
    if (days <= 30) return "outline"; // Stale (could use a warning variant if available)
    return "destructive"; // Very stale
  };

  const truncateText = (text: string | null, maxLength: number = 50) => {
    if (!text) return "—";
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const handleReadClick = async (submission: ContactFormSubmission) => {
    // Automatically mark as seen when opening the dialog
    if (!submission.hasSeen) {
      try {
        await markAsRead.mutateAsync({
          id: submission.id,
          updates: { hasSeen: true },
        });

        // Update submission with hasSeen: true
        setSelectedSubmission({
          ...submission,
          hasSeen: true,
        });
      } catch (error) {
        // If marking as seen fails, still open the dialog
        console.error("Failed to mark as seen:", error);
        setSelectedSubmission(submission);
      }
    } else {
      setSelectedSubmission(submission);
    }
    setIsDialogOpen(true);
  };

  const handleAcknowledgedToggle = async (checked: boolean) => {
    if (!selectedSubmission) return;

    try {
      await markAsRead.mutateAsync({
        id: selectedSubmission.id,
        updates: { Acknowledged: checked },
      });

      // Update local state
      setSelectedSubmission({
        ...selectedSubmission,
        Acknowledged: checked,
      });

      toast.success(
        checked ? "Marked as acknowledged" : "Unmarked as acknowledged"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update acknowledged status"
      );
    }
  };

  // Filter data
  const filteredData = submissions.filter((submission) => {
    const matchesSearch =
      searchQuery === "" ||
      (submission.name &&
        submission.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (submission.email &&
        submission.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (submission.subject &&
        submission.subject.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSeen =
      seenFilter === "all" ||
      (seenFilter === "seen" && submission.hasSeen) ||
      (seenFilter === "unseen" && !submission.hasSeen);

    const matchesAcknowledged =
      acknowledgedFilter === "all" ||
      (acknowledgedFilter === "acknowledged" && submission.Acknowledged) ||
      (acknowledgedFilter === "not-acknowledged" && !submission.Acknowledged);

    return matchesSearch && matchesSeen && matchesAcknowledged;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: string | number | boolean;
    let bValue: string | number | boolean;

    switch (sortField) {
      case "name":
        aValue = (a.name || "").toLowerCase();
        bValue = (b.name || "").toLowerCase();
        break;
      case "email":
        aValue = (a.email || "").toLowerCase();
        bValue = (b.email || "").toLowerCase();
        break;
      case "subject":
        aValue = (a.subject || "").toLowerCase();
        bValue = (b.subject || "").toLowerCase();
        break;
      case "daysAgo": {
        const aDays = calculateDaysAgo(a.timestamp).days ?? 999;
        const bDays = calculateDaysAgo(b.timestamp).days ?? 999;
        aValue = aDays;
        bValue = bDays;
        break;
      }
      case "hasSeen":
        aValue = a.hasSeen ? 1 : 0;
        bValue = b.hasSeen ? 1 : 0;
        break;
      case "Acknowledged":
        aValue = a.Acknowledged ? 1 : 0;
        bValue = b.Acknowledged ? 1 : 0;
        break;
      default:
        return 0;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Paginate sorted data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

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
    setCurrentPage(1); // Reset to first page on sort
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
    setSeenFilter("all");
    setAcknowledgedFilter("all");
    setSortField(null);
    setSortDirection(null);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    seenFilter !== "all" ||
    acknowledgedFilter !== "all" ||
    sortField;

  return (
    <>
      <div className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, or subject..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Seen Filter */}
          <Select
            value={seenFilter}
            onValueChange={(value) => {
              setSeenFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by seen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Seen Status</SelectItem>
              <SelectItem value="seen">Seen</SelectItem>
              <SelectItem value="unseen">Unseen</SelectItem>
            </SelectContent>
          </Select>

          {/* Acknowledged Filter */}
          <Select
            value={acknowledgedFilter}
            onValueChange={(value) => {
              setAcknowledgedFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by acknowledged" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Acknowledged</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="not-acknowledged">Not Acknowledged</SelectItem>
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
          Showing {paginatedData.length} of {sortedData.length} results
          {filteredData.length !== submissions.length &&
            ` (filtered from ${submissions.length} total)`}
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
                  onClick={() => handleSort("subject")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Subject
                  {getSortIcon("subject")}
                </Button>
              </TableHead>
              <TableHead className="w-[100px] text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("hasSeen")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Seen
                  {getSortIcon("hasSeen")}
                </Button>
              </TableHead>
              <TableHead className="w-[120px] text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("Acknowledged")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Acknowledged
                  {getSortIcon("Acknowledged")}
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("daysAgo")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Days Ago
                  {getSortIcon("daysAgo")}
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  No results found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.name ?? "—"}</TableCell>
                  <TableCell>
                    {submission.email ? (
                      <a
                        href={`mailto:${submission.email}`}
                        className="text-primary hover:underline"
                      >
                        {submission.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{truncateText(submission.subject, 40)}</TableCell>
                  <TableCell className="text-center">
                    {submission.hasSeen ? (
                      <Badge
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Seen
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Unseen
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {submission.Acknowledged ? (
                      <Badge
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <X className="h-3 w-3 mr-1" />
                        No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const { text, days } = calculateDaysAgo(
                        submission.timestamp
                      );
                      if (days === null) {
                        return (
                          <span className="text-sm text-muted-foreground">
                            {text}
                          </span>
                        );
                      }
                      return (
                        <Badge variant={getDaysAgoBadgeVariant(days)}>
                          {text}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => handleReadClick(submission)}
                    >
                      Read
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 0 && (
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
                totalItems={sortedData.length}
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
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Form Submission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              {/* Metadata List */}
              <ul className="space-y-3">
                <li className="flex flex-col gap-1">
                  <span className="font-medium text-sm">
                    {selectedSubmission.name && <>{selectedSubmission.name}</>}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {selectedSubmission.email && (
                      <>{selectedSubmission.email}</>
                    )}
                    {selectedSubmission.email ? (
                      <a
                        href={`mailto:${selectedSubmission.email}`}
                        className="text-primary hover:underline"
                      >
                        {selectedSubmission.email}
                      </a>
                    ) : (
                      !selectedSubmission.name && "—"
                    )}
                  </span>
                </li>
                {(selectedSubmission.subject ||
                  selectedSubmission.timestamp) && (
                  <li className="flex flex-col gap-1">
                    <span className="font-medium text-sm">
                      {selectedSubmission.subject && (
                        <>{selectedSubmission.subject}</>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedSubmission.timestamp && (
                        <>{formatDate(selectedSubmission.timestamp)}</>
                      )}
                    </span>
                  </li>
                )}
              </ul>
              {/* Message - Full Width */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Message</label>
                <div className="rounded-md border bg-muted/50 p-4">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedSubmission.text ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-between">
            {selectedSubmission && (
              <div className="flex items-center gap-3">
                <Label
                  htmlFor="acknowledged-switch"
                  className="text-sm font-medium"
                >
                  Acknowledged
                </Label>
                <Switch
                  id="acknowledged-switch"
                  checked={selectedSubmission.Acknowledged}
                  onCheckedChange={handleAcknowledgedToggle}
                  disabled={markAsRead.isPending}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
              </div>
            )}
            <Button
              variant="accent"
              onClick={() => setIsDialogOpen(false)}
              size="sm"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
