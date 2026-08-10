"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InvoiceExitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceRequestId: number;
  orderId: number | null;
  exitKind: "declined" | "cancelled";
  isPending: boolean;
  onConfirm: () => void;
}

export default function InvoiceExitConfirmDialog({
  open,
  onOpenChange,
  invoiceRequestId,
  orderId,
  exitKind,
  isPending,
  onConfirm,
}: InvoiceExitConfirmDialogProps) {
  const isCancel = exitKind === "cancelled";
  const title = isCancel ? "Cancel invoice request" : "Decline invoice request";
  const statusLabel = isCancel ? "Cancelled" : "Declined";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            The invoice request will move to <strong>{statusLabel}</strong>.
            This is a terminal exit from the happy path.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="rounded-md border bg-muted/30 px-3 py-2">
            <p>
              <span className="font-medium">Invoice request:</span> #
              {invoiceRequestId}
            </p>
            {orderId != null && (
              <p>
                <span className="font-medium">Linked order:</span> #{orderId}
              </p>
            )}
          </div>

          {orderId != null ? (
            <div>
              <p className="font-medium">
                For an unpaid invoice-channel order, the CMS will:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Set checkout status to Incomplete expired</li>
                <li>Set payment status to Canceled</li>
                <li>Keep the order unpaid and inactive</li>
                <li>Retain invoice URLs for audit history</li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                The order will no longer appear as awaiting payment.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No linked order will be updated. Only the invoice request status
              changes.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Keep request open
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating…
              </>
            ) : isCancel ? (
              "Confirm cancel"
            ) : (
              "Confirm decline"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
