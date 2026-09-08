"use client";

import { useState } from "react";
import { Loader2, OctagonX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAbortAccountHealthRun } from "@/hooks/account-health/useAbortAccountHealthRun";
import { healthRunActionButtonClass } from "@/app/dashboard/accounts/components/account-health/run-detail/healthRunPageStyles";
import { cn } from "@/lib/utils";

interface AbortAccountHealthRunButtonProps {
  runId: number;
  accountId: number;
  /** Compact styling for header toolbars */
  size?: "sm" | "default";
  className?: string;
}

export default function AbortAccountHealthRunButton({
  runId,
  accountId,
  size = "sm",
  className,
}: AbortAccountHealthRunButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const abort = useAbortAccountHealthRun();

  const handleConfirm = async () => {
    try {
      await abort.mutateAsync({ runId, accountId });
      setIsDialogOpen(false);
    } catch {
      // Toasts handled in hook
    }
  };

  const isPending = abort.isPending;
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
          "border-brandError-300 text-brandError-800 hover:border-brandError-700 hover:bg-brandError-700 hover:text-white",
          className
        )}
        onClick={() => setIsDialogOpen(true)}
        disabled={disabled}
      >
        <OctagonX className="h-4 w-4 mr-2" aria-hidden />
        Abort run
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <OctagonX className="h-5 w-5 text-brandError-600" aria-hidden />
              Abort run #{runId}?
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  This marks the run as failed, clears the account&apos;s active
                  refresh lock, and marks any non-terminal workflow steps as
                  failed so you can queue a new update.
                </p>
                <p>
                  Bull jobs already in flight may still finish in the background,
                  but this run will no longer block new refreshes.
                </p>
                <p className="font-medium text-brandError-800">
                  Use this when a run is stuck or cannot complete on its own.
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
              variant="destructive"
              size="sm"
              disabled={disabled}
              onClick={handleConfirm}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />
                  Aborting…
                </>
              ) : (
                <>
                  <OctagonX className="h-4 w-4 mr-2" aria-hidden />
                  Abort run
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
