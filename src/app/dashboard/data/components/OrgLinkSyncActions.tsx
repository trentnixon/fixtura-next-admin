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
import { triggerWeeklyAssociationClubIntegrity } from "@/lib/services/data-collection/triggerWeeklyAssociationClubIntegrity";
import { triggerWeeklyClubAssociationIntegrity } from "@/lib/services/data-collection/triggerWeeklyClubAssociationIntegrity";
import { formatGlobalDataWorkflowToast } from "@/lib/utils/formatGlobalDataWorkflowToast";

type SyncAction = "club_to_association" | "association_to_club";

const SYNC_CONFIG = {
  club_to_association: {
    buttonLabel: "Sync club → association links",
    dialogTitle: "Confirm club → association link sync",
    dialogDescription:
      "Copies club_to_competition data into club.associations and association.clubs (club → association direction). Best run after a club competition refresh completes. Safe without a prior scrape (add-only). Full catalogue only — no per-club sync.",
    trigger: triggerWeeklyClubAssociationIntegrity,
  },
  association_to_club: {
    buttonLabel: "Sync association → club links",
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

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-slate-50/80 p-3">
        <div className="flex min-w-0 flex-1 items-start gap-2 text-sm text-slate-600">
          <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          <p>
            After club competition refresh completes, run both syncs (order does
            not matter) to repair org links across the full catalogue.
          </p>
        </div>
        {(Object.keys(SYNC_CONFIG) as SyncAction[]).map((action) => (
          <Button
            key={action}
            variant="secondary"
            size="sm"
            disabled={!!loadingFor}
            onClick={() => setDialogOpenFor(action)}
          >
            {loadingFor === action
              ? "Queuing..."
              : SYNC_CONFIG[action].buttonLabel}
          </Button>
        ))}
      </div>

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
