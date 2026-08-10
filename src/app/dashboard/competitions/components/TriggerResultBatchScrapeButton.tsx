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
import { useTriggerResultBatchScrape } from "@/hooks/data-collection/useTriggerResultBatchScrape";

export interface TriggerResultBatchScrapeButtonProps {
  sourceType: "grade" | "competition";
  sourceId: number;
  disabled?: boolean;
  triggerMode?: "button" | "menu-item";
}

export default function TriggerResultBatchScrapeButton({
  sourceType,
  sourceId,
  disabled = false,
  triggerMode = "button",
}: TriggerResultBatchScrapeButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const triggerScrape = useTriggerResultBatchScrape();

  const handleConfirm = async () => {
    try {
      await triggerScrape.mutateAsync({ sourceType, sourceId });
      setIsDialogOpen(false);
    } catch {
      // Toasts handled in hook
    }
  };

  const isPending = triggerScrape.isPending;
  const triggerDisabled = isPending || disabled || sourceId <= 0;

  const scopeLabel = sourceType === "grade" ? "this grade" : "this competition";
  const openDialogAfterMenuCloses = () => {
    window.setTimeout(() => setIsDialogOpen(true), 0);
  };

  return (
    <>
      {triggerMode === "menu-item" ? (
        <DropdownMenuItem
          disabled={triggerDisabled}
          onSelect={openDialogAfterMenuCloses}
        >
          <RefreshCw className="h-4 w-4" />
          Scrape results
        </DropdownMenuItem>
      ) : (
        <Button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          disabled={triggerDisabled}
          variant="accent"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Scrape results
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-brandAccent-600" />
              Confirm result batch scrape
            </DialogTitle>
            <DialogDescription>
              Queue background jobs to scrape results from PlayHQ for fixtures
              in {scopeLabel}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                The CMS selects resultable fixtures in the configured date
                window (typically the last ~14 days), validates PlayHQ
                game-centre URLs, and enqueues the Redis queue{" "}
                <span className="font-medium">scrape:result-batch</span> with up
                to five fixtures per job.
              </p>
              <p>
                Jobs run asynchronously. Track progress on{" "}
                <span className="font-medium">/dashboard/data</span> scraper
                logs. Each fixture ingests via the existing single-fixture path.
                Re-running creates a new run id; the CMS does not dedupe
                repeated clicks.
              </p>
            </div>
            <div className="text-sm space-y-1 mt-4">
              <p>
                <span className="font-medium">Source:</span>{" "}
                {sourceType === "grade" ? "Grade" : "Competition"} ID {sourceId}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleConfirm}
              disabled={isPending}
            >
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
    </>
  );
}
