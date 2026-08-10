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

interface InvoiceIssuanceConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceRequestId: number;
  orderId: number;
  isPending: boolean;
  onConfirm: () => void;
}

export default function InvoiceIssuanceConfirmDialog({
  open,
  onOpenChange,
  invoiceRequestId,
  orderId,
  isPending,
  onConfirm,
}: InvoiceIssuanceConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create and send invoice</DialogTitle>
          <DialogDescription>
            The invoice request will move to <strong>Invoice created</strong>.
            This action cannot be reversed through the ordinary happy path.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="rounded-md border bg-muted/30 px-3 py-2">
            <p>
              <span className="font-medium">Invoice request:</span> #
              {invoiceRequestId}
            </p>
            <p>
              <span className="font-medium">Linked order:</span> #{orderId}
            </p>
          </div>

          <div>
            <p className="font-medium">The CMS will:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Set checkout status to Invoice issued</li>
              <li>Keep the order unpaid and inactive</li>
              <li>Queue the customer invoice email for delivery</li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            Member access stays locked until the invoice is marked paid.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              "Confirm create / send"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
