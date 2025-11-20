"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { P } from "@/components/type/type";
import { H4 } from "@/components/type/titles";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSyncAccountResults } from "@/hooks/accounts/useSyncAccountResults";
import { SyncAccountResultsRequest } from "@/lib/services/data-collection/syncAccountResults";
import { RefreshCw, AlertCircle } from "lucide-react";
import {
  parseAccountSyncError,
  showErrorNotification,
  showSuccessNotification,
} from "../utils/errorHandlers";

interface SyncResultsButtonProps {
  accountId: number;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | "secondary"
    | "link"
    | "primary"
    | "accent";
}

/**
 * SyncResultsButton Component
 *
 * Handles results-only scrape with confirmation dialog, error handling, and loading states.
 * This triggers a results-only scrape that updates fixture results without creating assets.
 */
export default function SyncResultsButton({
  accountId,
  variant = "primary",
}: SyncResultsButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorState, setErrorState] = useState<{
    title: string;
    message: string;
    type: "error" | "warning" | "info";
  } | null>(null);

  // Use the mutation hook
  const { mutate, isPending } = useSyncAccountResults();

  const handleSync = () => {
    // Clear any previous errors
    setErrorState(null);

    const requestData: SyncAccountResultsRequest = {
      accountId,
    };

    mutate(requestData, {
      onSuccess: (data) => {
        console.log("Results-only scrape queued successfully:", data);
        showSuccessNotification(
          data.message ||
            `Results-only scrape job queued successfully. Job ID: ${data.jobId}`
        );
        setIsDialogOpen(false);
      },
      onError: (error: Error) => {
        console.error("Failed to queue results-only scrape:", error);

        // Parse error for user-friendly message
        const parsedError = parseAccountSyncError(error);
        setErrorState(parsedError);

        // Show error notification
        showErrorNotification(
          parsedError.title,
          parsedError.message,
          parsedError.type
        );

        // Don't close dialog on error so user can see the error message
        // Dialog will close when user clicks cancel or outside
      },
    });
  };

  const handleButtonClick = () => {
    setErrorState(null); // Clear errors when opening dialog
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={handleButtonClick}
        disabled={isPending}
        className={isPending ? "opacity-50 cursor-not-allowed" : ""}
      >
        {isPending ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Results
          </>
        )}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Sync Results</DialogTitle>
            <DialogDescription>
              Trigger a results-only scrape to update fixture results
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <P>
                Are you sure you want to trigger a results-only scrape for{" "}
                <strong>Account ID {accountId}</strong>?
              </P>
              <P className="text-sm text-muted-foreground">
                This will update fixture results without creating assets. The
                job will be processed asynchronously in the background. Results
                will be updated automatically once the scrape is finished.
              </P>
            </div>

            {/* Error Display */}
            {errorState && (
              <div
                className={`rounded-lg p-4 border ${
                  errorState.type === "error"
                    ? "bg-red-50 border-red-200"
                    : errorState.type === "warning"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className={`h-5 w-5 mt-0.5 ${
                      errorState.type === "error"
                        ? "text-red-600"
                        : errorState.type === "warning"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  />
                  <div className="flex-1">
                    <H4 className="text-sm mb-1">{errorState.title}</H4>
                    <P className="text-sm">{errorState.message}</P>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Display */}
            {isPending && (
              <div className="rounded-lg p-4 bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                  <P className="text-sm text-blue-800">
                    Queuing results-only scrape job...
                  </P>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              className="rounded-full"
              onClick={() => {
                setErrorState(null);
                setIsDialogOpen(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant={variant}
              onClick={handleSync}
              disabled={isPending}
              className={isPending ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                "Confirm Sync"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
