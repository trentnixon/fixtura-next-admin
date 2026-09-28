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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTriggerResultSingleScrape } from "@/hooks/fixtures/useTriggerResultSingleScrape";
import { cn } from "@/lib/utils";

export function canTriggerResultSingleScrape(url: string | null): boolean {
  return Boolean(url?.includes("/game-centre/"));
}

export function getResultSingleScrapeDisabledReason(
  scorecardUrl: string | null,
): string | undefined {
  if (!scorecardUrl) {
    return "No PlayHQ scorecard URL on this fixture.";
  }
  if (!canTriggerResultSingleScrape(scorecardUrl)) {
    return "Scorecard URL must be a PlayHQ game-centre link (/game-centre/).";
  }
  return undefined;
}

export interface ResultSingleScrapeConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fixtureId: number;
}

export function ResultSingleScrapeConfirmDialog({
  open,
  onOpenChange,
  fixtureId,
}: ResultSingleScrapeConfirmDialogProps) {
  const triggerScrape = useTriggerResultSingleScrape();

  const handleConfirm = async () => {
    try {
      await triggerScrape.mutateAsync({ cmsFixtureId: fixtureId });
      onOpenChange(false);
    } catch {
      // Toasts handled in hook
    }
  };

  const isPending = triggerScrape.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-brandAccent-600" />
            Confirm result scrape
          </DialogTitle>
          <DialogDescription>
            This queues a background job to scrape this fixture&apos;s result
            from PlayHQ. The CMS validates the game-centre URL and enqueues the
            Redis queue scrape:result-single. Scrape plus ingest often takes
            about 30–60 seconds.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Fixture ID:</span> {fixtureId}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button variant="accent" onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Queuing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Confirm scrape
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ResultSingleScrapeMenuItemProps {
  scorecardUrl: string | null;
  onOpen: () => void;
}

/** Use inside DropdownMenuContent; pair with ResultSingleScrapeConfirmDialog outside the menu. */
export function ResultSingleScrapeMenuItem({
  scorecardUrl,
  onOpen,
}: ResultSingleScrapeMenuItemProps) {
  const disabledReason = getResultSingleScrapeDisabledReason(scorecardUrl);
  const triggerDisabled = !canTriggerResultSingleScrape(scorecardUrl);

  return (
    <DropdownMenuItem
      disabled={triggerDisabled}
      title={disabledReason}
      onSelect={() => {
        window.setTimeout(onOpen, 0);
      }}
    >
      <RefreshCw className="h-4 w-4" />
      Scrape result
    </DropdownMenuItem>
  );
}

interface TriggerResultSingleScrapeButtonProps {
  fixtureId: number;
  scorecardUrl: string | null;
  className?: string;
}

export default function TriggerResultSingleScrapeButton({
  fixtureId,
  scorecardUrl,
  className,
}: TriggerResultSingleScrapeButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const disabledReason = getResultSingleScrapeDisabledReason(scorecardUrl);
  const triggerDisabled = !canTriggerResultSingleScrape(scorecardUrl);

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        disabled={triggerDisabled}
        variant="accent"
        size="sm"
        title={disabledReason}
        className={cn(className)}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Scrape result
      </Button>

      <ResultSingleScrapeConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        fixtureId={fixtureId}
      />
    </>
  );
}
