"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Users } from "lucide-react";
import { useTriggerGradesLookupTeamsScrape } from "@/hooks/competitions/useTriggerGradesLookupTeamsScrape";

/**
 * Button to trigger grade-teams scrape via POST /api/grade-teams/trigger-grades-lookup-teams-scrape.
 * CMS enqueues a job to scrape:grades-lookup-teams. Bull-bridge-worker scrapes PlayHQ ladder pages
 * for teams across all grades and POSTs to /api/grade-teams/response.
 */
export function LookupGradeTeamsButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const triggerScrape = useTriggerGradesLookupTeamsScrape();

  const handleLookupGradeTeams = async () => {
    try {
      await triggerScrape.mutateAsync({});
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error triggering grades lookup teams scrape:", error);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        disabled={triggerScrape.isPending}
        variant="accent"
        size="sm"
      >
        <Users className="h-4 w-4 mr-2" />
        Lookup Grade Teams
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brandAccent-600" />
              Confirm Lookup Grade Teams
            </DialogTitle>
            <DialogDescription>
              This will queue a background job to scrape PlayHQ ladder pages for
              teams across all grades in the system. The CMS enqueues to the
              Redis queue scrape:grades-lookup-teams. The job runs
              asynchronously.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
              disabled={triggerScrape.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleLookupGradeTeams}
              disabled={triggerScrape.isPending}
            >
              {triggerScrape.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Queuing...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Confirm Lookup
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
