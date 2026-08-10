"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTriggerRemoveFixturesScrape } from "@/hooks/data-collection/useTriggerRemoveFixturesScrape";
import type { AssociationAccountOption } from "@/utils/associationAccountSelection";
import { getAccountSelectionState } from "@/utils/associationAccountSelection";

export interface TriggerRemoveFixturesScrapeButtonProps {
  sourceType: "grade" | "competition";
  sourceId: number;
  associationAccounts: AssociationAccountOption[];
  accountsLoading?: boolean;
  disabled?: boolean;
  triggerMode?: "button" | "menu-item";
}

const NO_ACCOUNTS_TITLE = "No Fixtura account linked to this association";

export default function TriggerRemoveFixturesScrapeButton({
  sourceType,
  sourceId,
  associationAccounts,
  accountsLoading = false,
  disabled = false,
  triggerMode = "button",
}: TriggerRemoveFixturesScrapeButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const triggerScrape = useTriggerRemoveFixturesScrape();

  const selectionState = getAccountSelectionState(associationAccounts);
  const scopeLabel = sourceType === "grade" ? "this grade" : "this competition";

  useEffect(() => {
    if (!isDialogOpen) return;

    if (selectionState === "multiple") {
      setSelectedAccountId("");
    }
  }, [isDialogOpen, selectionState]);

  const handleConfirm = async () => {
    if (selectionState === "none") return;

    let accountId: number;
    if (selectionState === "single") {
      accountId = associationAccounts[0].id;
    } else {
      const parsed = Number.parseInt(selectedAccountId, 10);
      if (Number.isNaN(parsed)) return;
      accountId = parsed;
    }

    try {
      await triggerScrape.mutateAsync({
        accountId,
        sourceType,
        sourceId,
      });
      setIsDialogOpen(false);
    } catch {
      // Toasts handled in hook
    }
  };

  const isPending = triggerScrape.isPending;

  const isNoAccountsBlocked = selectionState === "none" && !accountsLoading;

  const confirmDisabled =
    isPending ||
    selectionState === "none" ||
    (selectionState === "multiple" && selectedAccountId === "");

  const openDisabled =
    isPending ||
    disabled ||
    sourceId <= 0 ||
    accountsLoading ||
    isNoAccountsBlocked;

  const openTitle = isNoAccountsBlocked ? NO_ACCOUNTS_TITLE : undefined;
  const openDialogAfterMenuCloses = () => {
    window.setTimeout(() => setIsDialogOpen(true), 0);
  };

  const singleAccount =
    selectionState === "single" ? associationAccounts[0] : null;

  return (
    <>
      {triggerMode === "menu-item" ? (
        <DropdownMenuItem
          disabled={openDisabled}
          title={openTitle}
          onSelect={openDialogAfterMenuCloses}
        >
          <ClipboardList className="h-4 w-4" />
          Queue remove-fixtures check
        </DropdownMenuItem>
      ) : (
        <Button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          disabled={openDisabled}
          title={openTitle}
          variant="accent"
          size="sm"
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          Queue remove-fixtures check
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-brandAccent-600" />
              Confirm remove-fixtures check (enqueue-only)
            </DialogTitle>
            <DialogDescription>
              Queue background jobs to validate PlayHQ scorecard URLs for
              fixtures in {scopeLabel}. CMS does{" "}
              <span className="font-medium">not</span> delete fixtures from this
              endpoint (enqueue-only v1).
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                The CMS loads all fixtures for the scoped grades (no rolling
                date filter), keeps rows with valid{" "}
                <span className="font-medium">https</span> playhq URLs, and
                enqueues the Redis queue{" "}
                <span className="font-medium">scrape:remove-fixtures</span> in
                chunks (about 150 fixtures per job by default).
              </p>
              <p>
                Jobs run asynchronously. Track runs on{" "}
                <span className="font-medium">/dashboard/data</span> scraper
                logs. Each call uses a new run id.
              </p>
            </div>
            <div className="text-sm space-y-3 mt-4">
              <p>
                <span className="font-medium">Source:</span>{" "}
                {sourceType === "grade" ? "Grade" : "Competition"} ID {sourceId}
              </p>

              {selectionState === "single" && singleAccount && (
                <p>
                  <span className="font-medium">Fixtura account:</span>{" "}
                  {singleAccount.label} (ID {singleAccount.id})
                </p>
              )}

              {selectionState === "multiple" && (
                <div className="space-y-2">
                  <Label htmlFor="remove-fixtures-account-select">
                    Fixtura account <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedAccountId || undefined}
                    onValueChange={setSelectedAccountId}
                  >
                    <SelectTrigger id="remove-fixtures-account-select">
                      <SelectValue placeholder="Choose an account" />
                    </SelectTrigger>
                    <SelectContent>
                      {associationAccounts.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.label} (#{a.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Multiple Fixtura accounts are linked to this association.
                    Pick the correct one for correlation and auditing.
                  </p>
                </div>
              )}
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
              disabled={confirmDisabled}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Queuing...
                </>
              ) : (
                <>
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Confirm enqueue
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
