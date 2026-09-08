"use client";

import { useState } from "react";
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
import { useReconcileAccountHealthRun } from "@/hooks/account-health/useReconcileAccountHealthRun";
import { healthRunActionButtonClass } from "@/app/dashboard/accounts/components/account-health/run-detail/healthRunPageStyles";
import { cn } from "@/lib/utils";

interface ReconcileAccountHealthRunButtonProps {
  runId: number;
  accountId: number;
  /** Compact styling for header toolbars */
  size?: "sm" | "default";
  className?: string;
}

export default function ReconcileAccountHealthRunButton({
  runId,
  accountId,
  size = "sm",
  className,
}: ReconcileAccountHealthRunButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const reconcile = useReconcileAccountHealthRun();

  const handleConfirm = async () => {
    try {
      await reconcile.mutateAsync({ runId, accountId });
      setIsDialogOpen(false);
    } catch {
      // Toasts handled in hook
    }
  };

  const isPending = reconcile.isPending;
  const disabled =
    isPending || !Number.isFinite(runId) || runId <= 0 || accountId <= 0;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={size}
        className={cn(
          healthRunActionButtonClass,
          "border-brandWarning-300 text-brandWarning-900 hover:border-brandWarning-700 hover:bg-brandWarning-700 hover:text-white",
          className
        )}
        onClick={() => setIsDialogOpen(true)}
        disabled={disabled}
      >
        <RefreshCw className="h-4 w-4 mr-2" aria-hidden />
        Reconcile run
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-brandWarning-700" aria-hidden />
              Reconcile run #{runId}?
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  This rechecks fixture-discovery ingest rows for this run, may
                  requeue stale processing rows, and can finalize the run when
                  all expected rows are terminal.
                </p>
                <p>
                  Records are kept for audit. Safe to retry if the run does not
                  finalize on the first attempt.
                </p>
                <p className="font-medium text-brandWarning-900">
                  Use this when all steps show completed but the run never
                  finalized.
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
              variant="default"
              size="sm"
              disabled={disabled}
              onClick={handleConfirm}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />
                  Reconciling…
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" aria-hidden />
                  Reconcile run
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
