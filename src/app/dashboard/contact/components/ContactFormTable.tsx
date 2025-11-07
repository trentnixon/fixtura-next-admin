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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactFormSubmission } from "@/types/contact-form";
import { Check, X, Eye, EyeOff } from "lucide-react";
import { useMarkContactFormAsRead } from "@/hooks/contact-form/useMarkContactFormAsRead";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ContactFormTableProps {
  submissions: ContactFormSubmission[];
}

/**
 * Contact Form Table Component
 *
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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="w-[100px] text-center">Seen</TableHead>
            <TableHead className="w-[120px] text-center">
              Acknowledged
            </TableHead>
            <TableHead className="w-[120px]">Days Ago</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                No contact form submissions found
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((submission) => (
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
