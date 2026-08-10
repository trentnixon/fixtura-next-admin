"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { AdminInvoiceAggregate } from "@/types/adminInvoice";
import { formatInvoiceTimestamp } from "../../utils/invoiceQueueFormatters";

interface InvoiceStaleConflictDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staleCode: "STALE_INVOICE_REQUEST" | "STALE_ORDER";
  serverSnapshot: AdminInvoiceAggregate | null;
  onDiscard: () => void;
  onKeepChanges: () => void;
}

export default function InvoiceStaleConflictDialog({
  open,
  onOpenChange,
  staleCode,
  serverSnapshot,
  onDiscard,
  onKeepChanges,
}: InvoiceStaleConflictDialogProps) {
  const staleSection =
    staleCode === "STALE_ORDER" ? "Linked order" : "Invoice request";
  const serverTimestamp =
    staleCode === "STALE_ORDER"
      ? serverSnapshot?.order?.updatedAt
      : serverSnapshot?.invoiceRequest.updatedAt;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Stale update detected</DialogTitle>
          <DialogDescription>
            Another change occurred after this editor loaded. Your unsaved edits
            are preserved.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="rounded-md border bg-muted/30 px-3 py-2">
            <p>
              <span className="font-medium">Stale section:</span> {staleSection}
            </p>
            <p>
              <span className="font-medium">Latest server timestamp:</span>{" "}
              {formatInvoiceTimestamp(serverTimestamp)}
            </p>
          </div>

          <div className="space-y-2 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">
                Discard local changes
              </span>{" "}
              loads the latest CMS values and clears your unsaved edits.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Keep my changes
              </span>{" "}
              updates concurrency timestamps from the server while keeping your
              form values so you can review and submit again manually.
            </p>
            <p>
              <span className="font-medium text-foreground">Cancel</span> closes
              this review without changing your current editor state.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={onKeepChanges}>
            Keep my changes
          </Button>
          <Button variant="primary" onClick={onDiscard}>
            Discard local changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
