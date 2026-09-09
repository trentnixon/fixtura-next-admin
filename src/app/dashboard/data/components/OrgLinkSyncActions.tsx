"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import {
  siteNavigationGroupDividerClass,
  siteNavigationGroupItemClass,
  siteNavigationGroupShellClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import { triggerWeeklyAssociationClubIntegrity } from "@/lib/services/data-collection/triggerWeeklyAssociationClubIntegrity";
import { triggerWeeklyClubAssociationIntegrity } from "@/lib/services/data-collection/triggerWeeklyClubAssociationIntegrity";
import { formatGlobalDataWorkflowToast } from "@/lib/utils/formatGlobalDataWorkflowToast";

type SyncAction = "club_to_association" | "association_to_club";

const SYNC_CONFIG = {
  club_to_association: {
    buttonLabel: "Club → association",
    dialogTitle: "Confirm club → association link sync",
    dialogDescription:
      "Copies club_to_competition data into club.associations and association.clubs (club → association direction). Best run after a club competition refresh completes. Safe without a prior scrape (add-only). Full catalogue only — no per-club sync.",
    trigger: triggerWeeklyClubAssociationIntegrity,
  },
  association_to_club: {
    buttonLabel: "Association → club",
    dialogTitle: "Confirm association → club link sync",
    dialogDescription:
      "Copies club_to_competition data into association.clubs and club.associations (association → club direction). Best run after a club competition refresh completes. Safe without a prior scrape (add-only). Full catalogue only — no per-club sync.",
    trigger: triggerWeeklyAssociationClubIntegrity,
  },
} as const;

function showWorkflowToast(
  result: Awaited<ReturnType<typeof triggerWeeklyClubAssociationIntegrity>>,
) {
  const { title, description, variant } = formatGlobalDataWorkflowToast(result);
  if (variant === "warning") {
    toast.warning(title, { description });
  } else {
    toast.success(title, { description });
  }
}

function groupedItemClass(withDivider: boolean) {
  return cn(
    siteNavigationGroupItemClass,
    withDivider && siteNavigationGroupDividerClass,
  );
}

export function OrgLinkSyncActions() {
  const [dialogOpenFor, setDialogOpenFor] = useState<SyncAction | null>(null);
  const [loadingFor, setLoadingFor] = useState<SyncAction | null>(null);
  const queryClient = useQueryClient();

  const handleConfirm = async () => {
    if (!dialogOpenFor) return;

    setLoadingFor(dialogOpenFor);

    try {
      const config = SYNC_CONFIG[dialogOpenFor];
      const result = await config.trigger({});
      showWorkflowToast(result);
      setDialogOpenFor(null);
      queryClient.invalidateQueries({ queryKey: ["scraperLogs"] });
      queryClient.invalidateQueries({ queryKey: ["scraperLog"] });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to trigger org link sync",
      );
    } finally {
      setLoadingFor(null);
    }
  };

  const actions = Object.keys(SYNC_CONFIG) as SyncAction[];

  return (
    <>
      <OverviewRecordPanel
        className="mb-4"
        title="Org link sync"
        description="After club competition refresh completes, run both syncs (order does not matter) to repair org links across the full catalogue."
        badge={
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
            <Link2 className="h-3 w-3" aria-hidden />
            Post-refresh
          </span>
        }
        action={
          <div className={siteNavigationGroupShellClass}>
            {actions.map((action, index) => (
              <Button
                key={action}
                variant="ghost"
                size="sm"
                className={groupedItemClass(index < actions.length - 1)}
                disabled={!!loadingFor}
                onClick={() => setDialogOpenFor(action)}
              >
                {loadingFor === action
                  ? "Queuing..."
                  : SYNC_CONFIG[action].buttonLabel}
              </Button>
            ))}
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">
          These workflows copy relationship data from club competition scrape
          results into club and association records. They are safe to run without
          a prior scrape (add-only) but are most useful after a full catalogue
          refresh.
        </p>
      </OverviewRecordPanel>

      <Dialog
        open={!!dialogOpenFor}
        onOpenChange={(open) => {
          if (!open) setDialogOpenFor(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogOpenFor && SYNC_CONFIG[dialogOpenFor].dialogTitle}
            </DialogTitle>
            <DialogDescription>
              {dialogOpenFor && SYNC_CONFIG[dialogOpenFor].dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => setDialogOpenFor(null)}
              disabled={!!loadingFor}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={!!loadingFor}
            >
              {loadingFor ? "Queuing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
