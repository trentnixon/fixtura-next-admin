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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAbortAccountHealthRun } from "@/hooks/account-health/useAbortAccountHealthRun";
import { ABORT_INACTIVE_RUN_TOOLTIP } from "@/lib/account-health/abortAvailability";
import { healthRunActionButtonClass } from "@/app/dashboard/accounts/components/account-health/run-detail/healthRunPageStyles";
import {
  siteNavigationGroupDividerClass,
  siteNavigationGroupItemClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";

interface AbortAccountHealthRunButtonProps {
  runId: number;
  accountId: number;
  canAbort?: boolean;
  grouped?: boolean;
  size?: "sm" | "default";
  className?: string;
}

export default function AbortAccountHealthRunButton({
  runId,
  accountId,
  canAbort = true,
  grouped = false,
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
    !canAbort ||
    isPending ||
    !Number.isFinite(runId) ||
    runId <= 0 ||
    accountId <= 0;

  const button = (
    <Button
      type="button"
      variant={grouped ? "ghost" : "outline"}
      size={size}
      className={cn(
        grouped
          ? cn(
              siteNavigationGroupItemClass,
              siteNavigationGroupDividerClass,
              "text-brandError-800 hover:bg-brandError-700 hover:text-white",
            )
          : cn(
              healthRunActionButtonClass,
              "border-brandError-300 text-brandError-800 hover:border-brandError-700 hover:bg-brandError-700 hover:text-white",
            ),
        !canAbort && "opacity-60",
        className,
      )}
      onClick={() => {
        if (canAbort) setIsDialogOpen(true);
      }}
      disabled={disabled}
    >
      <OctagonX className="h-4 w-4" aria-hidden />
      Abort
    </Button>
  );

  return (
    <>
      {!canAbort ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">{button}</span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              {ABORT_INACTIVE_RUN_TOOLTIP}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        button
      )}

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
                  Abort
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
