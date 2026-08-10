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
import { useTriggerResultSingleScrape } from "@/hooks/fixtures/useTriggerResultSingleScrape";
import { cn } from "@/lib/utils";

function canTriggerResultScrape(url: string | null): boolean {
  return Boolean(url?.includes("/game-centre/"));
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
  const triggerScrape = useTriggerResultSingleScrape();

  const canTrigger = canTriggerResultScrape(scorecardUrl);
  const disabledReason = !scorecardUrl
    ? "No PlayHQ scorecard URL on this fixture."
    : !canTrigger
      ? "Scorecard URL must be a PlayHQ game-centre link (/game-centre/)."
      : undefined;

  const handleConfirm = async () => {
    try {
      await triggerScrape.mutateAsync({ cmsFixtureId: fixtureId });
      setIsDialogOpen(false);
    } catch {
      // Toasts handled in hook
    }
  };

  const isPending = triggerScrape.isPending;

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        disabled={isPending || !canTrigger}
        variant="accent"
        size="sm"
        title={disabledReason}
        className={cn(className)}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Scrape result
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-brandAccent-600" />
              Confirm result scrape
            </DialogTitle>
            <DialogDescription>
              This queues a background job to scrape this fixture&apos;s result
              from PlayHQ. The CMS validates the game-centre URL and enqueues
              the Redis queue scrape:result-single. Scrape plus ingest often
              takes about 30–60 seconds.
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
