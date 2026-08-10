"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTriggerAccountHealthRunOnDemand } from "@/hooks/account-health/useTriggerAccountHealthRunOnDemand";
import { getAccountHealthRunDetailHref } from "@/lib/account-health/accountRoutes";

interface TriggerAccountHealthRunButtonProps {
  accountId: number;
  liveRun: boolean;
  activeRunId?: number;
}

export default function TriggerAccountHealthRunButton({
  accountId,
  liveRun,
  activeRunId,
}: TriggerAccountHealthRunButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const trigger = useTriggerAccountHealthRunOnDemand();

  const showViewRun =
    liveRun &&
    activeRunId != null &&
    Number.isFinite(activeRunId) &&
    activeRunId > 0;

  if (showViewRun && activeRunId != null) {
    return (
      <Button variant="primary" size="sm" asChild>
        <Link href={getAccountHealthRunDetailHref(activeRunId, accountId)}>
          View current run
        </Link>
      </Button>
    );
  }

  const handleConfirm = async () => {
    try {
      await trigger.mutateAsync({ accountId });
      setIsDialogOpen(false);
    } catch {
      // Toasts handled in hook
    }
  };

  const isPending = trigger.isPending;
  const disabled = isPending || !Number.isFinite(accountId) || accountId <= 0;

  return (
    <>
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        disabled={disabled}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Run account update now
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-brandPrimary-600" />
              Run account update now
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Queue a full season data refresh for this account (scrapes,
                  grades, org syncs, fixture discovery).
                </p>
                <p>
                  This is not the lightweight &quot;Sync Account&quot;
                  metadata job. Fixture discovery can take over an hour; keep
                  this page open or use run detail to monitor progress.
                </p>
                <p>
                  Only active accounts with completed setup that are billable
                  or on trial will be accepted—the server rejects others.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={disabled}
              onClick={handleConfirm}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Queuing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Queue update
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
