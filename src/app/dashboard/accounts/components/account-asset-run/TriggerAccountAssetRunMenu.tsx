"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ImageIcon, Loader2, Rows3 } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTriggerAccountAssetRunOnDemand } from "@/hooks/account-asset-run/useTriggerAccountAssetRunOnDemand";
import type { AccountAssetRunTriggerMode } from "@/types/accountAssetRun";
import {
  getAccountAssetRunDetailHref,
  type AccountAssetRunAccountOrgType,
} from "@/lib/account-asset-run/accountRoutes";

interface TriggerAccountAssetRunMenuProps {
  accountId: number;
  accountType: AccountAssetRunAccountOrgType;
  liveRun: boolean;
  activeRunId?: number;
}

export default function TriggerAccountAssetRunMenu({
  accountId,
  accountType,
  liveRun,
  activeRunId,
}: TriggerAccountAssetRunMenuProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmMode, setConfirmMode] =
    useState<AccountAssetRunTriggerMode>("asset_only");
  const trigger = useTriggerAccountAssetRunOnDemand();

  const showViewRun =
    liveRun &&
    activeRunId != null &&
    Number.isFinite(activeRunId) &&
    activeRunId > 0;

  if (showViewRun && activeRunId != null) {
    return (
      <Button variant="primary" size="sm" asChild>
        <Link
          href={getAccountAssetRunDetailHref(
            activeRunId,
            accountId,
            accountType
          )}
        >
          View current asset run
        </Link>
      </Button>
    );
  }

  const openConfirm = (mode: AccountAssetRunTriggerMode) => {
    setConfirmMode(mode);
    setDialogOpen(true);
  };

  const dialogTitle =
    confirmMode === "asset_only"
      ? "Create assets now"
      : "Run scrape and create assets";

  const handleConfirm = async () => {
    try {
      const result = await trigger.mutateAsync({ accountId, mode: confirmMode });
      setDialogOpen(false);

      const body = result.data;
      if (body.status === "queued") {
        router.push(
          getAccountAssetRunDetailHref(body.run.id, accountId, accountType)
        );
      }
    } catch {
      // Errors and blocking toasts handled in mutation hook / catch
    }
  };

  const isPending = trigger.isPending;
  const disabled =
    isPending || !Number.isFinite(accountId) || accountId <= 0;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="primary" size="sm" disabled={disabled}>
            Asset run
            <ChevronDown className="ml-1 h-4 w-4 shrink-0" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[min(100vw-2rem,20rem)]">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              openConfirm("asset_only");
            }}
          >
            <ImageIcon className="mr-2 h-4 w-4" aria-hidden />
            Create assets now
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              openConfirm("full");
            }}
          >
            <Rows3 className="mr-2 h-4 w-4" aria-hidden />
            Run scrape and create assets
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmMode === "asset_only" ? (
                <ImageIcon className="h-5 w-5 text-brandPrimary-600" />
              ) : (
                <Rows3 className="h-5 w-5 text-brandPrimary-600" />
              )}
              {dialogTitle}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                {confirmMode === "asset_only" ? (
                  <p>
                    Queue asset creation immediately from current CMS data
                    (skips recent result scraping and upcoming remove-fixtures
                    checks tracking items may still appear as skipped).
                  </p>
                ) : (
                  <p>
                    Queue result scraping (~14 days), remove-fixtures checks,
                    then asset creation. Can take noticeably longer than
                    asset-only mode.
                  </p>
                )}
                <p>
                  Requires an{" "}
                  <strong className="text-foreground">
                    active paid order
                  </strong>
                  . Trial subscriptions cannot queue these runs — the API
                  rejects with a clear message when not eligible.
                </p>
                <p className="text-amber-900">
                  Existing scheduler/render safeguards still apply. Passing{" "}
                  <code className="font-mono text-xs">force: true</code> only affects
                  duplicate run-key behaviour on the server — it does not bypass
                  payment or safety checks.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={disabled}
              onClick={handleConfirm}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Queuing…
                </>
              ) : (
                <>Queue asset run</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
