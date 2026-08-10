"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { InvoiceRequestStatusValue } from "@/types/adminInvoice";
import {
  canCancelInvoice,
  canCreateSendInvoice,
  canDeclineInvoice,
  canMarkInvoicePaid,
  isTerminalInvoiceStatus,
} from "@/lib/services/orders/adminInvoiceTransitions";
import { formatInvoiceRequestStatusLabel } from "../../utils/invoiceQueueFormatters";
import InvoiceFormSection from "./InvoiceFormSection";
import InvoiceLifecycleSteps from "./InvoiceLifecycleSteps";

export type InvoiceLifecycleAction =
  | "create_send"
  | "mark_paid"
  | "decline"
  | "cancel";

interface InvoiceLifecycleControlsProps {
  currentStatus: InvoiceRequestStatusValue;
  hasLinkedOrder: boolean;
  requestNotes: string;
  isPending: boolean;
  onRequestNotesChange: (value: string) => void;
  onLifecycleAction: (action: InvoiceLifecycleAction) => void;
}

export default function InvoiceLifecycleControls({
  currentStatus,
  hasLinkedOrder,
  requestNotes,
  isPending,
  onRequestNotesChange,
  onLifecycleAction,
}: InvoiceLifecycleControlsProps) {
  const isTerminal = isTerminalInvoiceStatus(currentStatus);
  const showCreate = canCreateSendInvoice(currentStatus, hasLinkedOrder);
  const showMarkPaid = canMarkInvoicePaid(currentStatus, hasLinkedOrder);
  const showDecline = canDeclineInvoice(currentStatus);
  const showCancel = canCancelInvoice(currentStatus);
  const hasActions = showCreate || showMarkPaid || showDecline || showCancel;

  return (
    <InvoiceFormSection
      title="Lifecycle"
      description="Received → Created → Paid. Terminal exits are declined or cancelled. The CMS owns order payment and activation flags."
    >
      <InvoiceLifecycleSteps currentStatus={currentStatus} />

      <div className="grid gap-4">
        <div className="rounded-md border bg-muted/20 px-3 py-2 text-sm">
          <span className="font-medium">Current status: </span>
          {formatInvoiceRequestStatusLabel(currentStatus)}
          {isTerminal && (
            <p className="mt-1 text-muted-foreground">
              No further status transitions are available. Other fields may still
              be edited if permitted by the CMS.
            </p>
          )}
          {!isTerminal && !hasLinkedOrder && (
            <p className="mt-1 text-muted-foreground">
              Create/send and mark paid require a linked order.
            </p>
          )}
        </div>

        {hasActions && (
          <div className="flex flex-wrap gap-2">
            {showCreate && (
              <Button
                type="button"
                variant="primary"
                disabled={isPending}
                onClick={() => onLifecycleAction("create_send")}
              >
                Create / send invoice
              </Button>
            )}
            {showMarkPaid && (
              <Button
                type="button"
                variant="primary"
                disabled={isPending}
                onClick={() => onLifecycleAction("mark_paid")}
              >
                Mark paid
              </Button>
            )}
            {showDecline && (
              <Button
                type="button"
                variant="secondary"
                disabled={isPending}
                onClick={() => onLifecycleAction("decline")}
              >
                Decline
              </Button>
            )}
            {showCancel && (
              <Button
                type="button"
                variant="secondary"
                disabled={isPending}
                onClick={() => onLifecycleAction("cancel")}
              >
                Cancel request
              </Button>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="request-notes">Request notes</Label>
          <Textarea
            id="request-notes"
            value={requestNotes}
            onChange={(event) => onRequestNotesChange(event.target.value)}
            className="min-h-[80px] break-words"
          />
        </div>
      </div>
    </InvoiceFormSection>
  );
}
