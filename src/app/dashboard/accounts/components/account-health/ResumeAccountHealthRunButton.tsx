"use client";

import { useState } from "react";
import { Loader2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useResumeAccountHealthRun } from "@/hooks/account-health/useResumeAccountHealthRun";
import { healthRunActionButtonClass } from "@/app/dashboard/accounts/components/account-health/run-detail/healthRunPageStyles";
import { cn } from "@/lib/utils";

interface ResumeAccountHealthRunButtonProps {
  runId: number;
  accountId: number;
  grouped?: boolean;
  size?: "sm" | "default";
  className?: string;
}

export default function ResumeAccountHealthRunButton({
  runId,
  accountId,
  grouped = false,
  size = "sm",
  className,
}: ResumeAccountHealthRunButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const resume = useResumeAccountHealthRun();

  const handleConfirm = async () => {
    try {
      await resume.mutateAsync({ runId, accountId });
      setIsDialogOpen(false);
    } catch {
      // Toasts handled in hook
    }
  };

  const isPending = resume.isPending;
  const disabled =
    isPending || !Number.isFinite(runId) || runId <= 0 || accountId <= 0;

  return (
    <>
      <Button
        type="button"
        variant={grouped ? "secondary" : "outline"}
        size={size}
        className={cn(
          !grouped &&
            cn(
              healthRunActionButtonClass,
              "border-brandInfo-300 text-brandInfo-900 hover:border-brandInfo-700 hover:bg-brandInfo-700 hover:text-white"
            ),
          className
        )}
        onClick={() => setIsDialogOpen(true)}
        disabled={disabled}
      >
        <PlayCircle className="h-4 w-4" aria-hidden />
        Resume
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-brandInfo-700" aria-hidden />
              Resume run #{runId}?
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  This resumes the workflow from the first health item and
                  continues the sequence. It can requeue scraper work for stuck
                  early steps.
                </p>
                <p>
                  Records are kept for audit. Safe to retry if the run does not
                  progress on the first attempt.
                </p>
                <p className="font-medium text-brandInfo-900">
                  Use this when an early step is stuck or missed while later
                  steps appear complete.
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
                  Resuming…
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" aria-hidden />
                  Resume
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
